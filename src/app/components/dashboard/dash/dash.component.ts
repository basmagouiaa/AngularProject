import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { ReservationService } from 'src/services/reservation.service';
import { forkJoin } from 'rxjs';
import { TablesService } from 'src/services/tables.service';
import { OrderService } from 'src/services/order.service';
import { FoodService } from 'src/services/food.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  activeChart: 'tables' | 'orders' | 'weekly' = 'tables';

  // Configuration du graphique à barres
  reservationsByTableChartConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Réservations par table',
          data: [],
          backgroundColor: '#66bb6a'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Nombre de réservations par table'
        },
        legend: { display: false }
      }
    }
  };

  // Configuration du graphique à lignes
  reservationsLineChartConfig: ChartConfiguration<'line'> = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Réservations par semaine',
          data: [],
          fill: true,
          tension: 0.3,
          borderColor: '#42a5f5',
          backgroundColor: 'rgba(66, 165, 245, 0.3)',
          pointBackgroundColor: '#1e88e5',
          pointRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Évolution hebdomadaire des réservations'
        },
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  // Configuration du pie chart
  popularFoodsChart: ChartConfiguration<'pie'> = {
    type: 'pie',
    data: {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50',
            '#BA68C8', '#FF7043', '#26C6DA', '#8D6E63'
          ],
          hoverBackgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4CAF50',
            '#BA68C8', '#FF7043', '#26C6DA', '#8D6E63'
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Plats les plus populaires'
        },
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.raw as number;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  };

  constructor(
    private tableService: TablesService,
    private reservationService: ReservationService,
    private orderService: OrderService,
    private foodService: FoodService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReservationsByTable();
    this.loadReservationsByWeek();
    this.loadPopularFoods();

    setTimeout(() => {
      this.cdRef.detectChanges();
      this.chart?.update();
    }, 500); // délai pour laisser le DOM se mettre à jour
  }

  loadReservationsByTable(): void {
    this.tableService.getAllTables().subscribe(tables => {
      const tableIds = tables.map(t => t.id);
      const requests = tableIds.map(id => this.reservationService.getReservationsByTableId(id));

      forkJoin(requests).subscribe(responses => {
        const labels: string[] = [];
        const data: number[] = [];

        responses.forEach((reservations, index) => {
          labels.push(`Table ${tableIds[index]}`);
          data.push(reservations.length);
        });

        this.reservationsByTableChartConfig.data.labels = labels;
        this.reservationsByTableChartConfig.data.datasets[0].data = data;

        this.forceChartRefresh();
      });
    });
  }

  loadReservationsByWeek(): void {
    this.reservationService.getAll().subscribe(reservations => {
      const reservationsByWeek: { [key: string]: number } = {};

      reservations.forEach(res => {
        const date = new Date(res.startTime);
        const week = this.getWeekNumber(date);
        const year = date.getFullYear();
        const key = `Semaine ${week} - ${year}`;

        reservationsByWeek[key] = (reservationsByWeek[key] || 0) + 1;
      });

      const sortedWeeks = Object.keys(reservationsByWeek).sort();

      this.reservationsLineChartConfig.data.labels = sortedWeeks;
      this.reservationsLineChartConfig.data.datasets[0].data = sortedWeeks.map(w => reservationsByWeek[w]);

      this.forceChartRefresh();
    });
  }

  loadPopularFoods(): void {
    const token = localStorage.getItem('token') || '';
    this.orderService.getOrders(token).subscribe(orders => {
      const completedOrders = orders.filter(order => order.paymentMethod === 1);

      if (completedOrders.length === 0) {
        this.popularFoodsChart.options!.plugins!.title!.text = 'Aucune commande payée trouvée';
        return;
      }

      const foodCountMap: { [key: string]: number } = {};

      completedOrders.forEach(order => {
        order.orderItems.forEach((item: any) => {
          const foodId = item.itemId.toString();
          foodCountMap[foodId] = (foodCountMap[foodId] || 0) + item.quantite;
        });
      });

      this.foodService.getAllFoods().subscribe(foods => {
        const sortedFoods = Object.entries(foodCountMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8);

        const labels = sortedFoods.map(([foodId, count]) => {
          const food = foods.find(f => f?.id?.toString() === foodId.toString());
          return food ? `${food.name} (${count})` : `Plat ID: ${foodId} (${count})`;
        });

        const data = sortedFoods.map(([_, count]) => count);

        this.popularFoodsChart.data.labels = labels;
        this.popularFoodsChart.data.datasets[0].data = data;

        this.forceChartRefresh();
      });
    });
  }

  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7);
  }

  private forceChartRefresh(): void {
    setTimeout(() => {
      this.cdRef.detectChanges();
      this.chart?.update();
    }, 100);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrderService } from 'src/services/order.service';

interface Order {
  id?: number | null;
  userId?: string | null;
  dateCreation?: string | null;
  paymentMethod?: number | null;
  status?: number | null;
}

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  isLoading = true;
  displayedColumns: string[] = ['id', 'dateCreation', 'paymentMethod', 'status', 'actions'];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource<Order>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    const userId = JSON.parse(localStorage.getItem('user') || '{}').id; // Replace 'someUserId' with the actual user ID
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (orders) => {
        this.dataSource = new MatTableDataSource(orders.filter(order => order.id !== null));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '-';
    return dateString.split(' ')[0]; // Extrait juste la date sans l'heure
  }

  getPaymentMethod(method: number | null | undefined): string {
    if (method === null || method === undefined) return 'Inconnu';
    return method === 1 ? 'Carte bancaire' : 'Autre méthode';
  }

  getStatusText(status: number | null | undefined): string {
    if (status === null || status === undefined) return 'Inconnu';
    switch(status) {
      case 0: return 'En traitement';
      case 1: return 'Validée';
      case 2: return 'Expédiée';
      case 3: return 'Livrée';
      case 4: return 'Annulée';
      default: return `Statut ${status}`;
    }
  }

  getStatusClass(status: number | null | undefined): string {
    if (status === null || status === undefined) return 'status-unknown';
    switch(status) {
      case 0: return 'status-processing';
      case 1: return 'status-confirmed';
      case 2: return 'status-shipped';
      case 3: return 'status-delivered';
      case 4: return 'status-cancelled';
      default: return 'status-unknown';
    }
  }

  viewOrderDetails(orderId: number | null | undefined): void {
    if (orderId) {
      this.router.navigate(['/orders', orderId]);
    }
  }
}
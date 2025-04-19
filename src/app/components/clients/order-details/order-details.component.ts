import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Food } from 'src/models/food/food.module';
import { Order } from 'src/models/order/order.module';
import { FoodService } from 'src/services/food.service';
import { OrderService } from 'src/services/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  orderId!: number;
  order!: any;
  food: any = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private foodService: FoodService // Assuming you have a food service
  ) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        // console.log(data)
        this.order = data;
        this.foodService.getAllFoods().subscribe({
          next: (foods) => {
            // Créer un Set des IDs des articles dans la commande pour une recherche plus efficace
            const orderItemIds = new Set(this.order.orderItems.map((item: any) => item.itemId));
            // console.log(orderItemIds);
            // Filtrer les aliments qui correspondent aux IDs de la commande
            this.food = foods.filter((food: any) => {
              const matchingItem = this.order.orderItems.find((item: any) => item.itemId === food.id);
              
              if (matchingItem) {
                // Ajoute la quantité à l'objet food
                food.quantity = matchingItem.quantite;
                // console.log('Aliment avec quantité:', food);
                return true;
              }
              
              return false;
            });
            
            // Log final pour vérification
            console.log('Aliments correspondants:', this.food);
          },
          error: (err) => {
            console.error('Erreur lors du chargement des aliments:', err);
            // Optionnel : afficher un message à l'utilisateur
          }
        });
      },
      error: (err) => {
        console.error('Error loading order:', err);
      }
    });
  }

  calculateTotal(): number {
    if (!this.order?.orderItems) return 0;
    let i = 0;
    return this.order.orderItems.reduce((total: number, item: any) => {
      // Conversion en nombre au cas où les valeurs seraient des strings
      const prix: number = Number(this.food[i].price) || 0;
      const quantite: number = Number(item.quantite) || 0; // Note: 'quantite' au lieu de 'quantity'
      i++;
      console.log(item);
      return total + (prix * quantite);
    }, 0);
  }


  getStatusText(status: number | undefined): string {
    if (status === undefined) return 'Inconnu';
    switch(status) {
      case 0: return 'En traitement';
      case 1: return 'Validée';
      case 2: return 'Expédiée';
      case 3: return 'Livrée';
      case 4: return 'Annulée';
      default: return `Statut ${status}`;
    }
  }

  getStatusClass(status: number | undefined): string {
    if (status === undefined) return 'status-unknown';
    switch(status) {
      case 0: return 'status-processing';
      case 1: return 'status-confirmed';
      case 2: return 'status-shipped';
      case 3: return 'status-delivered';
      case 4: return 'status-cancelled';
      default: return 'status-unknown';
    }
  }

  getPaymentMethod(method: number | undefined): string {
    if (method === undefined) return 'Inconnu';
    return method === 1 ? 'Carte bancaire' : 'Autre méthode';
  }
  // Dans votre composant TypeScript
getFoodImage(foodId: number): string {
  const food: Food | undefined = this.food?.find((f: Food) => Number(f.id) === foodId);
  return food?.imageUrl || '';
}

getFoodName(foodId: number): string {
  const food: Food | undefined = this.food?.find((f: Food) => Number(f.id) === foodId);
  return food?.name || '';
}

getFoodDetails(foodId: number): any {
  const food: Food | undefined = this.food?.find((f: Food) => Number(f.id) === foodId);
}
}
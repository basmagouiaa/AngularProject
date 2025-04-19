import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import { OrderService } from 'src/services/order.service';

declare var bootstrap: any;

interface Order {
  id: number;
  userId: string;
  status: number;
  dateCreation: string;
  orderItems: OrderItem[];
}

interface OrderItem {
  itemId: string;
  quantite: number;
  prixUnitaire: number;
}

interface User {
  id: string;
  nom: string;
  prenom: string;
}

interface FoodItem {
  id?: string;
  name: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  displayedColumns: string[] = ['id', 'user', 'status', 'actions'];
  dataSource: MatTableDataSource<Order>;
  orders: Order[] = [];
  userNames: { [id: string]: string } = {};
  foodNames: { [id: string]: string } = {};
  selectedOrder: any;

  @ViewChild('invoiceModal') invoiceModal!: ElementRef;
  searchValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderService: OrderService) {
    this.dataSource = new MatTableDataSource<Order>([]);
  }

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    const token = localStorage.getItem('token') || '';
    this.orderService.getOrders(token).subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Fetch user and food information
        data.forEach(order => {
          this.fetchUser(order.userId, token);
          order.orderItems.forEach(item => this.fetchFood(item.itemId, token));
        });
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  fetchUser(userId: string, token: string) {
    if (this.userNames[userId]) return;
    this.orderService.getUser(userId, token).subscribe({
      next: (user: User) => {
        this.userNames[userId] = `${user.nom} ${user.prenom}`;
      },
      error: (error) => {
        console.error(`Error fetching user ${userId}:`, error);
        this.userNames[userId] = 'Utilisateur inconnu';
      }
    });
  }

  fetchFood(itemId: string, token: string) {
    if (this.foodNames[itemId]) return;
    this.orderService.getFood(itemId, token).subscribe({
      next: (food: FoodItem) => {
        this.foodNames[itemId] = food.name;
      },
      error: (error) => {
        console.error(`Error fetching food ${itemId}:`, error);
        this.foodNames[itemId] = 'Aliment inconnu';
      }
      });
  }

  getUserName(id: string): string {
    return this.userNames[id] || 'Utilisateur inconnu';
  }

  getFoodName(id: string): string {
    return this.foodNames[id] || 'Aliment inconnu';
  }

  handleDeliver(id: number) {
    const token = localStorage.getItem('token') || '';
    this.orderService.deliverOrder(id, token).subscribe({
      next: () => {
        this.orders = this.orders.map(order => 
          order.id === id ? { ...order, status: 1 } : order
        );
        this.dataSource.data = this.orders;
      },
      error: (error) => {
        console.error('Error delivering order:', error);
      }
    });
  }

  openInvoiceModal(order: any) {
    this.selectedOrder = order;
    const modalElement = this.invoiceModal.nativeElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  getTotal(order: Order): number {
    return order.orderItems.reduce(
      (acc: number, item: OrderItem) => acc + (item.quantite * item.prixUnitaire),
      0
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  generateInvoicePDF() {
    if (!this.selectedOrder) return;

    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Facture Commande #${this.selectedOrder.id}`,
      subject: 'Facture',
      author: 'Votre Restaurant',
      keywords: 'facture, commande, restaurant',
      creator: 'Votre Restaurant'
    });

    // Add title
    doc.setFontSize(16);
    doc.text(`Facture - Commande #${this.selectedOrder.id}`, 20, 20);
    
    // Add customer information
    doc.setFontSize(12);
    doc.text(`Client: ${this.getUserName(this.selectedOrder.userId)}`, 20, 30);
    doc.text(`Date: ${new Date(this.selectedOrder.dateCreation).toLocaleString()}`, 20, 40);
    doc.text(`Statut: ${this.selectedOrder.status === 1 ? 'Livrée' : 'En attente'}`, 20, 50);

    // Add items table
    let y = 70;
    doc.text("Articles commandés:", 20, y);
    y += 10;

    // Table headers
    doc.setFont('helvetica', 'bold');
    doc.text("Article", 20, y);
    doc.text("Quantité", 80, y);
    doc.text("Prix unitaire", 120, y);
    doc.text("Total", 160, y);
    y += 8;

    // Table rows
    doc.setFont('helvetica', 'normal');
    this.selectedOrder.orderItems.forEach((item: OrderItem) => {
      const itemTotal = item.quantite * item.prixUnitaire;
      doc.text(this.getFoodName(item.itemId), 20, y);
      doc.text(item.quantite.toString(), 80, y);
      doc.text(`${item.prixUnitaire.toFixed(2)} €`, 120, y);
      doc.text(`${itemTotal.toFixed(2)} €`, 160, y);
      y += 10;
    });

    // Add total
    y += 5;
    doc.setFont('helvetica', 'bold');
    const total = this.getTotal(this.selectedOrder).toFixed(2);
    doc.text(`Total: ${total} €`, 120, y);

    // Save the PDF
    doc.save(`Facture_Commande_${this.selectedOrder.id}.pdf`);
  }
}
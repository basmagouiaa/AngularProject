import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReservationService } from 'src/services/reservation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reservation } from 'src/models/reservation/reservation.module';

@Component({
  selector: 'app-list-reservation',
  templateUrl: './list-reservation.component.html',
  styleUrls: ['./list-reservation.component.css']
})
export class ListReservationComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['startTime', 'endTime', 'tableId', 'userName', 'actions'];
  dataSource: MatTableDataSource<Reservation> = new MatTableDataSource<Reservation>();
  userNames: { [key: string]: string } = {};
  searchValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private reservationService: ReservationService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(): void {
    this.searchValue = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private loadReservations(): void {
    this.reservationService.getAll().subscribe({
      next: (reservations: Reservation[]) => {
        this.dataSource.data = reservations;
        reservations.forEach(res => this.loadUserName(res.userId));
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des réservations.', 'Fermer', { duration: 3000 });
      }
    });
  }

  private loadUserName(userId: string): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(`http://localhost:5047/api/Account/GetUserById/${userId}`, { headers }).subscribe({
      next: (user) => {
        this.userNames[userId] = `${user.nom} ${user.prenom}`;
      }
    });
  }

  getUserName(userId: string): string {
    return this.userNames[userId] || 'Utilisateur inconnu';
  }

  cancelReservation(id: string): void {
    this.reservationService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Réservation annulée avec succès.', 'Fermer', { duration: 3000 });
        this.loadReservations();
      },
      error: () => {
        this.snackBar.open("Erreur lors de l'annulation.", 'Fermer', { duration: 3000 });
      }
    });
  }
  canCancelReservation(startTime: Date | string): boolean {
    const now = new Date();
    const reservationDate = new Date(startTime);
    
    // Soustraire 24 heures (en millisecondes)
    const limitDate = new Date(reservationDate.getTime() - 24 * 60 * 60 * 1000);
    
    return now < limitDate;
  }
  
}

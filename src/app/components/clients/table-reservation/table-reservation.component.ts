import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TablesService } from 'src/services/tables.service';

@Component({
  selector: 'app-table-reservation',
  templateUrl: './table-reservation.component.html',
  styleUrls: ['./table-reservation.component.css']
})
export class TableReservationComponent implements OnInit {
  tables: any[] = [];
  selectedTable: any = null;
  startTime: string = '';
  endTime: string = '';
  token: string | null = '';
  user: any = null;
  minDateTime: string = '';

  constructor(private http: HttpClient,private tablesService:TablesService) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
    this.fetchTables();
    this.setMinDateTime();
  }

  setMinDateTime(): void {
    const now = new Date();
    this.minDateTime = now.toISOString().slice(0, 16); // format yyyy-MM-ddTHH:mm
  }
  
  fetchTables(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    this.tablesService.getAvailableTables()
      .subscribe({
        next: (data) => this.tables = data,
        error: (err) => console.error('Error fetching tables', err)
      });
  }

  handleTableClick(table: any): void {
    if (table.status === 'occupied') return;
    this.selectedTable = table;
  }

  handleReservation(): void {
    if (!this.user) {
      alert('Please log in to make a reservation.');
      return;
    }

    const reservation = {
      StartTime: this.startTime,
      EndTime: this.endTime,
      TableId: this.selectedTable.id,
      UserId: this.user.id
    };

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });

    this.http.post('http://localhost:5047/api/Reservation', reservation, { headers })
      .subscribe({
        next: () => {
          alert('Reservation made successfully!');
          this.selectedTable = null;
          this.startTime = '';
          this.endTime = '';
        },
        error: (err) => {
          console.error('Error making reservation', err);
          alert('Failed to make reservation.');
        }
      });
  }

  getChairStyles(index: number, capacity: number) {
    const angle = (360 / capacity) * index;
    return {
      transform: `rotate(${angle}deg) translate(70px) rotate(-${angle}deg)`
    };
  }
}

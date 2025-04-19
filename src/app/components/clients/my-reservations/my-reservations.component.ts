import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReservationService } from 'src/services/reservation.service';
import { Reservation } from 'src/models/reservation/reservation.module';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'startTime', 'endTime', 'tableId', 'action'];
  dataSource!: MatTableDataSource<Reservation>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.reservationService.getById(user.id).subscribe(data => {
      this.dataSource = new MatTableDataSource(Array.isArray(data) ? data : [data]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  canCancel(startTime: string): boolean {
    const today = new Date();
    const reservationDate = new Date(startTime);
    const oneDayBefore = new Date(reservationDate);
    oneDayBefore.setDate(reservationDate.getDate() - 1);
    return today <= oneDayBefore;
  }

  cancelReservation(id: string): void {
    this.reservationService.delete(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(r => r.id !== id);
    });
  }
}

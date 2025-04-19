import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Reservation } from 'src/models/reservation/reservation.module';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:5047/api/Reservation';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };
  }

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl, this.getAuthHeaders());
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
  getById(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/user/${id}`, this.getAuthHeaders());
  }
  getAllTables(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Table`, this.getAuthHeaders());
  }
  getReservationsByTable(): Observable<any[]> {
    return this.getAllTables().pipe(
      switchMap(tables => {
        const requests = tables.map(table =>{
          console.log(table) 
          this.http.get<Reservation[]>(`${this.apiUrl}/Reservation/table/${table.id}`, this.getAuthHeaders()).pipe(
            map(reservations => ({
              tableNumber: table.numero,
              totalReservations: reservations.length
            }))
          )}
        );
        return forkJoin(requests);
      })
    );
  }
  getReservationsByTableId(tableId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/table/${tableId}`, this.getAuthHeaders());
  }
  
}

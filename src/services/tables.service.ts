import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TablesService {
  private apiUrl = 'http://localhost:5047/api/Table'; // Remplacez par votre URL API

  constructor(private http: HttpClient) {}

  getAllTables(): Observable<Table[]> {
    return this.http.get<Table[]>(this.apiUrl);
  }

  getTableById(id: number): Observable<Table> {
    return this.http.get<Table>(`${this.apiUrl}/${id}`);
  }

  addTable(table: Table): Observable<Table> {
    return this.http.post<Table>(this.apiUrl, table);
  }

  updateTable(table: Table): Observable<Table> {
    return this.http.put<Table>(`${this.apiUrl}/${table.id}`, table);
  }

  deleteTable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAvailableTables(): Observable<Table[]> {
    return this.http.get<Table[]>(`${this.apiUrl}/available`);
  }
}

export interface Table {
  id: number;
  number: number;
  capacity: number;
  availability: boolean;
}
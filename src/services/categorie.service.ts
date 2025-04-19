import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = 'http://localhost:5047/api/Categorie'; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<CategorieDTO[]> {
    return this.http.get<CategorieDTO[]>(this.apiUrl);
  }

  getById(id: number): Observable<CategorieDTO> {
    return this.http.get<CategorieDTO>(`${this.apiUrl}/${id}`);
  }

  create(categorie: CategorieDTO): Observable<CategorieDTO> {
    return this.http.post<CategorieDTO>(this.apiUrl, categorie);
  }

  update(categorie: CategorieDTO): Observable<CategorieDTO> {
    return this.http.put<CategorieDTO>(`${this.apiUrl}/update/${categorie.id}`, categorie);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getProductsByCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${categoryId}/with-foods`);
  }
}
export interface CategorieDTO {
  id: number;
  name: string;
}
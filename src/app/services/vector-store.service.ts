import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VectorStore, VectorStoreCreate, VectorStoreUpdate } from '../models/vector-store.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VectorStoreService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getToken(): string {
    return this.authService.getToken() || '';
  }

  create(data: VectorStoreCreate): Observable<VectorStore> {
    const token = this.getToken();
    return this.http.post<VectorStore>(`${this.apiUrl}/vector-store/${token}/`, data);
  }

  list(): Observable<VectorStore[]> {
    const token = this.getToken();
    return this.http.get<VectorStore[]>(`${this.apiUrl}/vector-store/${token}/list/`);
  }

  get(id: string): Observable<VectorStore> {
    const token = this.getToken();
    return this.http.get<VectorStore>(`${this.apiUrl}/vector-store/${token}/${id}/`);
  }

  update(id: string, data: VectorStoreUpdate): Observable<VectorStore> {
    const token = this.getToken();
    return this.http.patch<VectorStore>(`${this.apiUrl}/vector-store/${token}/${id}/`, data);
  }

  delete(id: string): Observable<void> {
    const token = this.getToken();
    return this.http.delete<void>(`${this.apiUrl}/vector-store/${token}/${id}/`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DocumentAlert, DocumentAlertCreate } from '../models/document-alert.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentAlertService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getToken(): string {
    return this.authService.getToken() || '';
  }

  create(data: DocumentAlertCreate): Observable<DocumentAlert> {
    const token = this.getToken();
    return this.http.post<DocumentAlert>(`${this.apiUrl}/document-alert/${token}/`, data);
  }

  list(): Observable<DocumentAlert[]> {
    const token = this.getToken();
    return this.http.get<DocumentAlert[]>(`${this.apiUrl}/document-alert/${token}/list/`);
  }

  get(id: number): Observable<DocumentAlert> {
    const token = this.getToken();
    return this.http.get<DocumentAlert>(`${this.apiUrl}/document-alert/${token}/${id}/`);
  }

  update(id: number, data: Partial<DocumentAlertCreate>): Observable<DocumentAlert> {
    const token = this.getToken();
    return this.http.patch<DocumentAlert>(`${this.apiUrl}/document-alert/${token}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    const token = this.getToken();
    return this.http.delete<void>(`${this.apiUrl}/document-alert/${token}/${id}/`);
  }
}
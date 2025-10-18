import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  DocumentAccess, 
  DocumentAccessCreate, 
  DocumentAccessRemove 
} from '../models/document-access.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentAccessService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getToken(): string {
    return this.authService.getToken() || '';
  }

  create(data: DocumentAccessCreate): Observable<DocumentAccess> {
    const token = this.getToken();
    return this.http.post<DocumentAccess>(`${this.apiUrl}/document-access/${token}/`, data);
  }

  list(): Observable<DocumentAccess[]> {
    const token = this.getToken();
    return this.http.get<DocumentAccess[]>(`${this.apiUrl}/document-access/${token}/list/`);
  }

  get(id: number): Observable<DocumentAccess> {
    const token = this.getToken();
    return this.http.get<DocumentAccess>(`${this.apiUrl}/document-access/${token}/${id}/`);
  }

  remove(data: DocumentAccessRemove): Observable<void> {
    const token = this.getToken();
    return this.http.request<void>('delete', `${this.apiUrl}/document-access/remove/${token}/`, {
      body: data
    });
  }

  delete(id: number): Observable<void> {
    const token = this.getToken();
    return this.http.delete<void>(`${this.apiUrl}/document-access/${token}/${id}/`);
  }
}
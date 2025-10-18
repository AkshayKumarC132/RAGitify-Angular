import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Assistant, AssistantCreate } from '../models/assistant.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getToken(): string {
    return this.authService.getToken() || '';
  }

  create(data: AssistantCreate): Observable<Assistant> {
    const token = this.getToken();
    return this.http.post<Assistant>(`${this.apiUrl}/assistant/${token}/`, data);
  }

  list(): Observable<Assistant[]> {
    const token = this.getToken();
    return this.http.get<Assistant[]>(`${this.apiUrl}/assistant/${token}/list/`);
  }

  get(id: string): Observable<Assistant> {
    const token = this.getToken();
    return this.http.get<Assistant>(`${this.apiUrl}/assistant/${token}/${id}/`);
  }

  update(id: string, data: Partial<AssistantCreate>): Observable<Assistant> {
    const token = this.getToken();
    return this.http.patch<Assistant>(`${this.apiUrl}/assistant/${token}/${id}/`, data);
  }

  delete(id: string): Observable<void> {
    const token = this.getToken();
    return this.http.delete<void>(`${this.apiUrl}/assistant/${token}/${id}/`);
  }
}
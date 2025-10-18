import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OpenAIKey, OpenAIKeyCreate } from '../models/openai-key.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OpenAIKeyService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getToken(): string {
    return this.authService.getToken() || '';
  }

  create(data: OpenAIKeyCreate): Observable<OpenAIKey> {
    const token = this.getToken();
    return this.http.post<OpenAIKey>(`${this.apiUrl}/openai-key/${token}/`, data);
  }

  list(): Observable<OpenAIKey[]> {
    const token = this.getToken();
    return this.http.get<OpenAIKey[]>(`${this.apiUrl}/openai-key/${token}/list/`);
  }

  get(id: number): Observable<OpenAIKey> {
    const token = this.getToken();
    return this.http.get<OpenAIKey>(`${this.apiUrl}/openai-key/${token}/${id}/`);
  }

  update(id: number, data: Partial<OpenAIKeyCreate>): Observable<OpenAIKey> {
    const token = this.getToken();
    return this.http.patch<OpenAIKey>(`${this.apiUrl}/openai-key/${token}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    const token = this.getToken();
    return this.http.delete<void>(`${this.apiUrl}/openai-key/${token}/${id}/`);
  }
}
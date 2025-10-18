import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Thread, ThreadCreate } from '../models/thread.model';
import { Message } from '../models/message.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getToken(): string {
    return this.authService.getToken() || '';
  }

  create(data: ThreadCreate): Observable<Thread> {
    const token = this.getToken();
    return this.http.post<Thread>(`${this.apiUrl}/thread/${token}/`, data);
  }

  list(): Observable<Thread[]> {
    const token = this.getToken();
    return this.http.get<Thread[]>(`${this.apiUrl}/thread/${token}/list/`);
  }

  get(id: string): Observable<Thread> {
    const token = this.getToken();
    return this.http.get<Thread>(`${this.apiUrl}/thread/${token}/${id}/`);
  }

  getMessages(threadId: string): Observable<Message[]> {
    const token = this.getToken();
    return this.http.get<Message[]>(`${this.apiUrl}/thread/${token}/${threadId}/messages/`);
  }

  update(id: string, data: Partial<ThreadCreate>): Observable<Thread> {
    const token = this.getToken();
    return this.http.patch<Thread>(`${this.apiUrl}/thread/${token}/${id}/`, data);
  }

  delete(id: string): Observable<void> {
    const token = this.getToken();
    return this.http.delete<void>(`${this.apiUrl}/thread/${token}/${id}/`);
  }
}
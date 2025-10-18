import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  Message, 
  MessageCreate, 
  MessageFeedback, 
  MessageFeedbackCreate 
} from '../models/message.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getToken(): string {
    return this.authService.getToken() || '';
  }

  create(data: MessageCreate): Observable<Message> {
    const token = this.getToken();
    return this.http.post<Message>(`${this.apiUrl}/message/${token}/`, data);
  }

  list(): Observable<Message[]> {
    const token = this.getToken();
    return this.http.get<Message[]>(`${this.apiUrl}/message/${token}/list/`);
  }

  get(id: string): Observable<Message> {
    const token = this.getToken();
    return this.http.get<Message>(`${this.apiUrl}/message/${token}/${id}/`);
  }

  update(id: string, data: Partial<MessageCreate>): Observable<Message> {
    const token = this.getToken();
    return this.http.patch<Message>(`${this.apiUrl}/message/${token}/${id}/`, data);
  }

  delete(id: string): Observable<void> {
    const token = this.getToken();
    return this.http.delete<void>(`${this.apiUrl}/message/${token}/${id}/`);
  }

  createFeedback(data: MessageFeedbackCreate): Observable<MessageFeedback> {
    const token = this.getToken();
    return this.http.post<MessageFeedback>(`${this.apiUrl}/message-feedback/${token}/`, data);
  }

  listFeedback(): Observable<MessageFeedback[]> {
    const token = this.getToken();
    return this.http.get<MessageFeedback[]>(`${this.apiUrl}/message-feedback/${token}/list/`);
  }
}
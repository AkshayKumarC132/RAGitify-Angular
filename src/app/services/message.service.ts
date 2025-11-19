import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Message,
  MessageCreate,
  MessageFeedback,
  MessageFeedbackCreate,
  MessageListParams
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

  list(params?: MessageListParams): Observable<Message[]> {
    const token = this.getToken();
    let httpParams = new HttpParams();
    if (params?.thread_id) {
      httpParams = httpParams.set('thread_id', params.thread_id);
    }
    return this.http.get<Message[]>(`${this.apiUrl}/message/${token}/list/`, { params: httpParams });
  }

  get(id: number): Observable<Message> {
    const token = this.getToken();
    return this.http.get<Message>(`${this.apiUrl}/message/${token}/${id}/`);
  }

  update(id: number, data: Partial<MessageCreate>): Observable<Message> {
    const token = this.getToken();
    return this.http.patch<Message>(`${this.apiUrl}/message/${token}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
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
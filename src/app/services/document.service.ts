import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Document,
  IngestDocumentRequest,
  DocumentStatusResponse,
  DocumentListFilters
} from '../models/document.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getToken(): string {
    return this.authService.getToken() || '';
  }

  ingest(data: IngestDocumentRequest): Observable<Document> {
    const token = this.getToken();
    const formData = new FormData();

    if (data.file) {
      formData.append('file', data.file);
    }
    if (data.s3_file_url) {
      formData.append('s3_file_url', data.s3_file_url);
    }
    if (data.title) {
      formData.append('title', data.title);
    }
    formData.append('vector_store_id', data.vector_store_id);

    return this.http.post<Document>(`${this.apiUrl}/document/${token}/ingest/`, formData);
  }

  list(filters?: DocumentListFilters): Observable<Document[]> {
    const token = this.getToken();
    let params = new HttpParams();
    if (filters?.vector_store_id) {
      params = params.set('vector_store_id', filters.vector_store_id);
    }
    return this.http.get<Document[]>(`${this.apiUrl}/document/${token}/list/`, { params });
  }

  get(id: string): Observable<Document> {
    const token = this.getToken();
    return this.http.get<Document>(`${this.apiUrl}/document/${token}/${id}/`);
  }

  getStatus(documentId: string): Observable<DocumentStatusResponse> {
    const token = this.getToken();
    return this.http.get<DocumentStatusResponse>(`${this.apiUrl}/document/${token}/${documentId}/status/`);
  }

  update(id: string, data: Partial<Document>): Observable<Document> {
    const token = this.getToken();
    return this.http.patch<Document>(`${this.apiUrl}/document/${token}/${id}/`, data);
  }

  delete(id: string): Observable<void> {
    const token = this.getToken();
    return this.http.delete<void>(`${this.apiUrl}/document/${token}/${id}/`);
  }
}
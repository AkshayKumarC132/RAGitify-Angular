import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Run, RunCreate, SubmitToolOutputs } from '../models/run.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RunService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getToken(): string {
    return this.authService.getToken() || '';
  }

  create(data: RunCreate): Observable<Run> {
    const token = this.getToken();
    return this.http.post<Run>(`${this.apiUrl}/run/${token}/`, data);
  }

  list(): Observable<Run[]> {
    const token = this.getToken();
    return this.http.get<Run[]>(`${this.apiUrl}/run/${token}/list/`);
  }

  get(id: string): Observable<Run> {
    const token = this.getToken();
    return this.http.get<Run>(`${this.apiUrl}/run/${token}/${id}/`);
  }

  cancel(runId: string): Observable<Run> {
    const token = this.getToken();
    return this.http.post<Run>(`${this.apiUrl}/run/${token}/${runId}/cancel/`, {});
  }

  rerun(runId: string): Observable<Run> {
    const token = this.getToken();
    return this.http.post<Run>(`${this.apiUrl}/run/${token}/${runId}/rerun/`, {});
  }

  submitToolOutputs(runId: string, data: SubmitToolOutputs): Observable<Run> {
    const token = this.getToken();
    return this.http.post<Run>(`${this.apiUrl}/run/${token}/${runId}/submit-tool-outputs/`, data);
  }

  update(id: string, data: Partial<RunCreate>): Observable<Run> {
    const token = this.getToken();
    return this.http.patch<Run>(`${this.apiUrl}/run/${token}/${id}/`, data);
  }

  delete(id: string): Observable<void> {
    const token = this.getToken();
    return this.http.delete<void>(`${this.apiUrl}/run/${token}/${id}/`);
  }
}
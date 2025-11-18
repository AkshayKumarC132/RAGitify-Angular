import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Run, RunCreate, RunListParams, SubmitToolOutputs } from '../models/run.model';
import { ApiMessageResponse } from '../models/api.model';
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

  list(params?: RunListParams): Observable<Run[]> {
    const token = this.getToken();
    let httpParams = new HttpParams();
    if (params?.thread_id) {
      httpParams = httpParams.set('thread_id', params.thread_id);
    }
    return this.http.get<Run[]>(`${this.apiUrl}/run/${token}/list/`, { params: httpParams });
  }

  get(id: string): Observable<Run> {
    const token = this.getToken();
    return this.http.get<Run>(`${this.apiUrl}/run/${token}/${id}/`);
  }

  cancel(runId: string): Observable<ApiMessageResponse> {
    const token = this.getToken();
    return this.http.post<ApiMessageResponse>(`${this.apiUrl}/run/${token}/${runId}/cancel/`, {});
  }

  rerun(runId: string, overrides?: Partial<RunCreate>): Observable<Run> {
    const token = this.getToken();
    return this.http.post<Run>(`${this.apiUrl}/run/${token}/${runId}/rerun/`, overrides || {});
  }

  submitToolOutputs(runId: string, data: SubmitToolOutputs): Observable<ApiMessageResponse> {
    const token = this.getToken();
    return this.http.post<ApiMessageResponse>(`${this.apiUrl}/run/${token}/${runId}/submit-tool-outputs/`, data);
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
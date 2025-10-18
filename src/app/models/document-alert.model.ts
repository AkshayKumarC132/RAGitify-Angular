export interface DocumentAlert {
  id: string;
  document: any;
  user: string;
  keyword: string;
  snippet: string;
  created_at: string;
}

export interface DocumentAlertCreate {
  document: string;
  keyword: string;
  snippet: string;
}
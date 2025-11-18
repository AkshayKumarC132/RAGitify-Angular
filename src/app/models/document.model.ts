import { VectorStore } from './vector-store.model';

export type DocumentStatusValue = 'pending' | 'processing' | 'completed' | 'failed';

export interface Document {
  id: string;
  title: string;
  status: DocumentStatusValue;
  vector_store?: VectorStore | string;
  vector_store_id?: string;
  description?: string;
  file_name?: string;
  file_size?: number;
  uploaded_at?: string;
  created_at?: string;
  updated_at?: string;
  qdrant_points?: number;
  metadata?: Record<string, any>;
}

export interface IngestDocumentRequest {
  vector_store_id: string;
  title?: string;
  file?: File;
  s3_file_url?: string;
}

export interface DocumentStatusResponse {
  document_id: string;
  status: string;
  qdrant_points: number;
}

export interface DocumentListFilters {
  vector_store_id?: string;
}
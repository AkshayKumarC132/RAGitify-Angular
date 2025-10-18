export interface Document {
  id: string;
  title: string;
  vector_store: VectorStore;
  user: string;
  uploaded_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface IngestDocumentRequest {
  file?: File;
  s3_file_url?: string;
  vector_store_id: string;
}

export interface DocumentStatus {
  id: string;
  status: string;
  message?: string;
}

import { VectorStore } from './vector-store.model';
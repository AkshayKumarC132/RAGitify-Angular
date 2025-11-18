import { Document } from './document.model';
import { VectorStore } from './vector-store.model';

export interface DocumentAccess {
  id: number;
  document: Document | string;
  vector_store: VectorStore | string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface DocumentAccessRequest {
  vector_store: string;
  documents: string[];
}

export interface DocumentAccessDetail {
  document_access_id: string;
  document_id: string;
  vector_store_id: string;
  status: 'created' | 'updated';
}

export interface DocumentAccessResponse {
  message: string;
  access_details: DocumentAccessDetail[];
}

export interface DocumentAccessRemoveRequest {
  vector_store: string;
  document_ids: string[];
}

export interface DocumentAccessRemoveResponse {
  message: string;
}
export interface DocumentAccess {
  id: string;
  document_ids?: string[];
  vector_store_id?: string;
  granted_by: string;
  granted_at: string;
}

export interface DocumentAccessCreate {
  document_ids: string[];
  vector_store_id: string;
}

export interface DocumentAccessRemove {
  document_ids: string[];
  vector_store_id: string;
}
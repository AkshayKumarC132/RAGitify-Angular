export interface Thread {
  id: string;
  title?: string;
  vector_store_id: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface ThreadCreate {
  title?: string;
  vector_store_id: string;
  metadata?: Record<string, any>;
}
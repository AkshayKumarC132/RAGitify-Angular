export interface Thread {
  id: string;
  title: string;
  created_at: string;
  vector_store_id_read?: string;
}

export interface ThreadCreate {
  title?: string;
  vector_store_id: string;
}
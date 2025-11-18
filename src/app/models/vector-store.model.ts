export interface VectorStore {
  id: string;
  name: string;
  description?: string;
  provider: string;
  model?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
  owner_name?: string;
}

export interface VectorStoreCreate {
  name: string;
  provider: string;
  description?: string;
  model?: string;
  metadata?: Record<string, any>;
}

export type VectorStoreUpdate = Partial<VectorStoreCreate>;
import { VectorStore } from './vector-store.model';

export interface Assistant {
  id: string;
  name: string;
  instructions?: string;
  model?: string;
  tools?: AssistantTool[];
  vector_store_id?: string;
  vector_store?: VectorStore | null;
  default_run_params?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AssistantTool {
  type: 'file_search' | 'function';
  function?: {
    name: string;
    description?: string;
    parameters?: any;
  };
}

export interface AssistantCreate {
  name: string;
  instructions?: string;
  model?: string;
  tools?: AssistantTool[];
  vector_store_id?: string;
  default_run_params?: Record<string, any>;
}
export interface Assistant {
  id: string;
  name: string;
  vector_store_id?: string;
  instructions?: string;
  model?: string;
  tools?: AssistantTool[];
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
  vector_store_id: string;
  instructions?: string;
  model?: string;
  tools?: AssistantTool[];
}
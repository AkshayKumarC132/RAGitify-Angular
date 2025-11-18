export interface OpenAIKey {
  id: number;
  name?: string;
  provider: string;
  api_key?: string;
  model?: string;
  region?: string;
  is_valid?: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OpenAIKeyCreate {
  provider: string;
  api_key: string;
  name?: string;
  model?: string;
  region?: string;
  is_active?: boolean;
}
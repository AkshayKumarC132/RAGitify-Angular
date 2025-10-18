export interface OpenAIKey {
  id: string;
  api_key?: string;
  name: string;
  model: string;
  provider: 'OpenAI' | 'Ollama';
  is_valid: boolean;
  is_active: boolean;
}

export interface OpenAIKeyCreate {
  api_key: string;
  name: string;
  model?: string;
  provider: 'OpenAI' | 'Ollama';
  is_active?: boolean;
}
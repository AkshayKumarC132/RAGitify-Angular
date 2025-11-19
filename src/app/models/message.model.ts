export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface Message {
  id: number;
  thread_id: string;
  assistant_id?: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface MessageCreate {
  thread_id: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface MessageListParams {
  thread_id?: string;
}

export interface MessageFeedback {
  id: number;
  message: Message;
  message_id?: number;
  rating: 'positive' | 'negative';
  created_at: string;
  updated_at: string;
}

export interface MessageFeedbackCreate {
  message_id: number;
  rating: 'positive' | 'negative';
}
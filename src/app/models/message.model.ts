export interface Message {
  id: string;
  thread_id?: string;
  user: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface MessageCreate {
  thread_id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface MessageFeedback {
  id: string;
  message: Message;
  message_id?: string;
  rating: 'positive' | 'negative';
  created_at: string;
  updated_at: string;
}

export interface MessageFeedbackCreate {
  message_id: string;
  rating: 'positive' | 'negative';
}
export type RunStatus = 'queued' | 'in_progress' | 'requires_action' | 'completed' | 'failed' | 'cancelled';

export interface Run {
  id: string;
  thread_id: string;
  assistant_id: string;
  status: RunStatus;
  mode?: 'document' | 'normal' | 'web';
  queries?: string | string[];
  required_action?: any;
  tool_outputs?: any;
  created_at: string;
  completed_at?: string;
  cancelled_at?: string;
  message_id?: string;
  source_run_id?: string;
  source_message_id?: string;
  rerun_of_id?: string;
  metadata?: Record<string, any>;
}

export interface RunCreate {
  thread_id: string;
  assistant_id: string;
  mode?: 'document' | 'normal' | 'web';
  queries?: string | string[];
  message_id?: string;
  source_run_id?: string;
  parameters?: Record<string, any>;
}

export interface RunListParams {
  thread_id?: string;
}

export interface SubmitToolOutputs {
  tool_outputs: {
    tool_call_id: string;
    output: string;
  }[];
}
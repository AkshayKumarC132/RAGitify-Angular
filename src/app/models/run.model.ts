export interface Run {
  id: string;
  thread_id?: string;
  status: 'queued' | 'in_progress' | 'requires_action' | 'completed' | 'failed' | 'cancelled';
  assistant_id?: string;
  mode?: 'document' | 'normal' | 'web';
  required_action?: any;
  tool_outputs?: any;
  created_at: string;
  completed_at?: string;
  cancelled_at?: string;
  message_id?: string;
  source_run_id?: string;
  source_message_id?: string;
  rerun_of_id?: string;
}

export interface RunCreate {
  thread_id: string;
  assistant_id: string;
  mode?: 'document' | 'normal' | 'web';
  message_id?: string;
  source_run_id?: string;
}

export interface SubmitToolOutputs {
  tool_outputs: {
    tool_call_id: string;
    output: string;
  }[];
}
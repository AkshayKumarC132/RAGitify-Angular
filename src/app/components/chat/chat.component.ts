import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ThreadService } from '../../services/thread.service';
import { MessageService } from '../../services/message.service';
import { AssistantService } from '../../services/assistant.service';
import { RunService } from '../../services/run.service';
import { Thread } from '../../models/thread.model';
import { Message } from '../../models/message.model';
import { Assistant } from '../../models/assistant.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  threads: Thread[] = [];
  currentThread: Thread | null = null;
  messages: Message[] = [];
  assistants: Assistant[] = [];
  selectedAssistant: Assistant | null = null;
  
  messageForm: FormGroup;
  isLoading = false;
  isSending = false;

  constructor(
    private fb: FormBuilder,
    private threadService: ThreadService,
    private messageService: MessageService,
    private assistantService: AssistantService,
    private runService: RunService
  ) {
    this.messageForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadThreads();
    this.loadAssistants();
  }

  loadThreads(): void {
    this.threadService.list().subscribe({
      next: (threads) => {
        this.threads = threads;
        if (threads.length > 0 && !this.currentThread) {
          this.selectThread(threads[0]);
        }
      },
      error: (error) => console.error('Error loading threads:', error)
    });
  }

  loadAssistants(): void {
    this.assistantService.list().subscribe({
      next: (assistants) => {
        this.assistants = assistants;
        if (assistants.length > 0 && !this.selectedAssistant) {
          this.selectedAssistant = assistants[0];
        }
      },
      error: (error) => console.error('Error loading assistants:', error)
    });
  }

  selectThread(thread: Thread): void {
    this.currentThread = thread;
    this.loadMessages(thread.id);
  }

  loadMessages(threadId: string): void {
    this.isLoading = true;
    this.threadService.getMessages(threadId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.isLoading = false;
      }
    });
  }

  createNewThread(): void {
    const title = `Chat ${new Date().toLocaleString()}`;
    // You need to provide a vector_store_id, for now we'll handle it differently
    // This is a simplified version
    alert('Please create a thread with a vector store ID from the Vector Stores page');
  }

  sendMessage(): void {
    if (this.messageForm.valid && this.currentThread) {
      const content = this.messageForm.get('content')?.value;
      this.isSending = true;

      const messageData = {
        thread_id: this.currentThread.id,
        role: 'user' as const,
        content: content
      };

      this.messageService.create(messageData).subscribe({
        next: (message) => {
          this.messages.push(message);
          this.messageForm.reset();
          this.scrollToBottom();
          
          // Create a run to get assistant response
          if (this.selectedAssistant) {
            this.createRun();
          } else {
            this.isSending = false;
          }
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.isSending = false;
        }
      });
    }
  }

  createRun(): void {
    if (this.currentThread && this.selectedAssistant) {
      const runData = {
        thread_id: this.currentThread.id,
        assistant_id: this.selectedAssistant.id,
        mode: 'document' as const
      };

      this.runService.create(runData).subscribe({
        next: (run) => {
          // Poll for run completion and get assistant's response
          this.pollRunStatus(run.id);
        },
        error: (error) => {
          console.error('Error creating run:', error);
          this.isSending = false;
        }
      });
    }
  }

  pollRunStatus(runId: string): void {
    const interval = setInterval(() => {
      this.runService.get(runId).subscribe({
        next: (run) => {
          if (run.status === 'completed') {
            clearInterval(interval);
            this.loadMessages(this.currentThread!.id);
            this.isSending = false;
          } else if (run.status === 'failed' || run.status === 'cancelled') {
            clearInterval(interval);
            this.isSending = false;
          }
        },
        error: (error) => {
          clearInterval(interval);
          console.error('Error polling run status:', error);
          this.isSending = false;
        }
      });
    }, 2000);

    // Stop polling after 2 minutes
    setTimeout(() => {
      clearInterval(interval);
      this.isSending = false;
    }, 120000);
  }

  giveFeedback(message: Message, rating: 'positive' | 'negative'): void {
    this.messageService.createFeedback({
      message_id: message.id,
      rating: rating
    }).subscribe({
      next: () => {
        console.log('Feedback submitted');
      },
      error: (error) => console.error('Error submitting feedback:', error)
    });
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch(err) {
      console.error('Error scrolling:', err);
    }
  }
}
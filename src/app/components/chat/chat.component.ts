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
import { VectorStoreService } from '../../services/vector-store.service';
import { VectorStore } from '../../models/vector-store.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

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
  vectorStores: VectorStore[] = [];
  selectedVectorStore: VectorStore | null = null;
  threadError = '';
  isCreatingThread = false;
  
  messageForm: FormGroup;
  isLoading = false;
  isSending = false;

  constructor(
    private fb: FormBuilder,
    private threadService: ThreadService,
    private messageService: MessageService,
    private assistantService: AssistantService,
    private runService: RunService,
    private vectorStoreService: VectorStoreService
  ) {
    this.messageForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadThreads();
    this.loadAssistants();
    this.loadVectorStores();
  }

  loadThreads(): void {
    this.threadService.list().subscribe({
      next: (threads) => {
        this.threads = threads;
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

  loadVectorStores(): void {
    this.vectorStoreService.list().subscribe({
      next: (stores) => {
        this.vectorStores = stores;
        if (this.currentThread?.vector_store_id_read) {
          const active = stores.find(store => store.id === this.currentThread?.vector_store_id_read);
          if (active) {
            this.selectedVectorStore = active;
          }
        }

        if (stores.length > 0 && !this.selectedVectorStore) {
          this.selectedVectorStore = stores[0];
        }
      },
      error: (error) => console.error('Error loading vector stores:', error)
    });
  }

  selectThread(thread: Thread): void {
    this.currentThread = thread;
    this.threadError = '';
    if (thread.vector_store_id_read) {
      const matchingStore = this.vectorStores.find(store => store.id === thread.vector_store_id_read);
      if (matchingStore) {
        this.selectedVectorStore = matchingStore;
      }
    }
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
    this.currentThread = null;
    this.messages = [];
    this.threadError = '';
    this.messageForm.reset();
  }

  sendMessage(): void {
    if (this.messageForm.invalid || this.isSending) {
      return;
    }

    const rawContent = this.messageForm.get('content')?.value;
    const content = typeof rawContent === 'string' ? rawContent.trim() : '';

    if (!content) {
      this.messageForm.get('content')?.setValue('');
      return;
    }

    this.isSending = true;
    this.threadError = '';

    this.ensureActiveThread(content)
      .pipe(
        switchMap((thread) => {
          const messageData = {
            thread_id: thread.id,
            role: 'user' as const,
            content
          };

          return this.messageService.create(messageData);
        })
      )
      .subscribe({
        next: (message) => {
          this.messages.push(message);
          this.messageForm.reset();
          this.scrollToBottom();

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

  private ensureActiveThread(initialMessage: string): Observable<Thread> {
    if (this.currentThread) {
      return of(this.currentThread);
    }

    if (!this.selectedVectorStore) {
      this.threadError = 'Select a vector store to start a new conversation.';
      return throwError(() => new Error('Vector store required'));
    }

    const title = this.buildThreadTitle(initialMessage);
    const payload = {
      title,
      vector_store_id: this.selectedVectorStore.id
    } as const;

    this.isCreatingThread = true;

    return this.threadService.create(payload).pipe(
      tap((thread) => {
        this.currentThread = thread;
        this.threads = [thread, ...this.threads];
        this.isCreatingThread = false;
      }),
      catchError((error) => {
        this.isCreatingThread = false;
        this.threadError = error?.error?.detail || 'Unable to create thread. Please try again.';
        return throwError(() => error);
      })
    );
  }

  private buildThreadTitle(content: string): string {
    const normalized = content.replace(/\s+/g, ' ').trim();
    if (!normalized) {
      return `Chat ${new Date().toLocaleString()}`;
    }

    return normalized.length > 60 ? `${normalized.slice(0, 57)}...` : normalized;
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
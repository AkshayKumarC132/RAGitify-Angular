import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThreadService } from '../../services/thread.service';
import { DocumentService } from '../../services/document.service';
import { VectorStoreService } from '../../services/vector-store.service';
import { AssistantService } from '../../services/assistant.service';
import { Thread } from '../../models/thread.model';
import { Document } from '../../models/document.model';
import { VectorStore } from '../../models/vector-store.model';
import { Assistant } from '../../models/assistant.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  threads: Thread[] = [];
  documents: Document[] = [];
  vectorStores: VectorStore[] = [];
  assistants: Assistant[] = [];

  isLoading = {
    threads: false,
    documents: false,
    vectorStores: false,
    assistants: false
  };

  constructor(
    private threadService: ThreadService,
    private documentService: DocumentService,
    private vectorStoreService: VectorStoreService,
    private assistantService: AssistantService
  ) {}

  ngOnInit(): void {
    this.loadThreads();
    this.loadDocuments();
    this.loadVectorStores();
    this.loadAssistants();
  }

  private loadThreads(): void {
    this.isLoading.threads = true;
    this.threadService.list().subscribe({
      next: (threads) => {
        this.threads = threads;
        this.isLoading.threads = false;
      },
      error: (error) => {
        console.error('Error loading threads:', error);
        this.isLoading.threads = false;
      }
    });
  }

  private loadDocuments(): void {
    this.isLoading.documents = true;
    this.documentService.list().subscribe({
      next: (documents) => {
        this.documents = documents;
        this.isLoading.documents = false;
      },
      error: (error) => {
        console.error('Error loading documents:', error);
        this.isLoading.documents = false;
      }
    });
  }

  private loadVectorStores(): void {
    this.isLoading.vectorStores = true;
    this.vectorStoreService.list().subscribe({
      next: (stores) => {
        this.vectorStores = stores;
        this.isLoading.vectorStores = false;
      },
      error: (error) => {
        console.error('Error loading vector stores:', error);
        this.isLoading.vectorStores = false;
      }
    });
  }

  private loadAssistants(): void {
    this.isLoading.assistants = true;
    this.assistantService.list().subscribe({
      next: (assistants) => {
        this.assistants = assistants;
        this.isLoading.assistants = false;
      },
      error: (error) => {
        console.error('Error loading assistants:', error);
        this.isLoading.assistants = false;
      }
    });
  }
}

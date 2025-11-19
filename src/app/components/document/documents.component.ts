import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { VectorStoreService } from '../../services/vector-store.service';
import { Document } from '../../models/document.model';
import { VectorStore } from '../../models/vector-store.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full overflow-y-auto p-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Documents</h1>
          <p class="text-gray-600 mt-2">Manage your uploaded documents</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="mb-6">
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Upload Document
            </button>
          </div>

          <div *ngIf="documents.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-lg">No documents yet</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let doc of documents" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 class="font-semibold text-gray-900 mb-1">{{ doc.title }}</h3>
              <p class="text-sm text-gray-500">Status: {{ doc.status }}</p>
              <p class="text-sm text-gray-500" *ngIf="doc.vector_store_id || doc.vector_store">
                Vector Store: {{ getVectorStoreLabel(doc) }}
              </p>
              <p class="text-xs text-gray-400 mb-1">
                {{ (doc.created_at || doc.uploaded_at) | date:'short' }}
              </p>
              <p class="text-xs text-gray-500" *ngIf="doc.qdrant_points !== undefined">
                Qdrant Points: {{ doc.qdrant_points }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DocumentsComponent implements OnInit {
  documents: Document[] = [];
  vectorStores: VectorStore[] = [];

  constructor(
    private documentService: DocumentService,
    private vectorStoreService: VectorStoreService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
    this.loadVectorStores();
  }

  loadDocuments(): void {
    this.documentService.list().subscribe({
      next: (docs) => this.documents = docs,
      error: (error) => console.error('Error loading documents:', error)
    });
  }

  loadVectorStores(): void {
    this.vectorStoreService.list().subscribe({
      next: (stores) => this.vectorStores = stores,
      error: (error) => console.error('Error loading vector stores:', error)
    });
  }

  getVectorStoreLabel(doc: Document): string {
    if (doc.vector_store && typeof doc.vector_store === 'object') {
      return doc.vector_store.name;
    }
    return doc.vector_store_id || '';
  }
}
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
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
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
      next: (docs) => (this.documents = docs),
      error: (error) => console.error('Error loading documents:', error)
    });
  }

  loadVectorStores(): void {
    this.vectorStoreService.list().subscribe({
      next: (stores) => (this.vectorStores = stores),
      error: (error) => console.error('Error loading vector stores:', error)
    });
  }
}

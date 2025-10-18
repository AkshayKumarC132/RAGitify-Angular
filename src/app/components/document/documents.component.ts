import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { VectorStoreService } from '../../services/vector-store.service';
import { Document } from '../../models/document.model';
import { VectorStore } from '../../models/vector-store.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  documents: Document[] = [];
  vectorStores: VectorStore[] = [];
  uploadForm: FormGroup;
  showUploadForm = false;
  uploadError = '';
  isUploading = false;
  selectedFile: File | null = null;

  constructor(
    private documentService: DocumentService,
    private vectorStoreService: VectorStoreService,
    private fb: FormBuilder
  ) {
    this.uploadForm = this.fb.group({
      vector_store_id: ['', Validators.required],
      s3_file_url: ['']
    });
  }

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

  toggleUploadForm(): void {
    this.showUploadForm = !this.showUploadForm;
    this.uploadError = '';
    if (!this.showUploadForm) {
      this.resetUploadForm();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  submitUpload(): void {
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    const vectorStoreId = this.uploadForm.get('vector_store_id')?.value;
    const s3Url = (this.uploadForm.get('s3_file_url')?.value || '').trim();

    if (!this.selectedFile && !s3Url) {
      this.uploadError = 'Choose a file or provide an S3 URL to ingest.';
      return;
    }

    const payload: any = {
      vector_store_id: vectorStoreId
    };

    if (this.selectedFile) {
      payload.file = this.selectedFile;
    } else {
      payload.s3_file_url = s3Url;
    }

    this.isUploading = true;
    this.uploadError = '';

    this.documentService.ingest(payload).subscribe({
      next: () => {
        this.isUploading = false;
        this.toggleUploadForm();
        this.resetUploadForm();
        this.loadDocuments();
      },
      error: (error) => {
        this.isUploading = false;
        this.uploadError = error?.error?.detail || 'Unable to upload document.';
      }
    });
  }

  private resetUploadForm(): void {
    this.uploadForm.reset();
    this.selectedFile = null;
  }
}

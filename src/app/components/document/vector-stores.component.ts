import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VectorStoreService } from '../../services/vector-store.service';
import { VectorStore } from '../../models/vector-store.model';

@Component({
  selector: 'app-vector-stores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vector-stores.component.html',
  styleUrls: ['./vector-stores.component.scss']
})
export class VectorStoresComponent implements OnInit {
  vectorStores: VectorStore[] = [];
  createForm: FormGroup;
  showCreateForm = false;
  createError = '';
  isCreating = false;

  constructor(
    private vectorStoreService: VectorStoreService,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadVectorStores();
  }

  loadVectorStores(): void {
    this.vectorStoreService.list().subscribe({
      next: (stores) => (this.vectorStores = stores),
      error: (error) => console.error('Error loading vector stores:', error)
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.createError = '';
    if (!this.showCreateForm) {
      this.createForm.reset();
    }
  }

  submitCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const payload = this.createForm.value;
    this.isCreating = true;
    this.createError = '';

    this.vectorStoreService.create(payload).subscribe({
      next: (store) => {
        this.isCreating = false;
        this.vectorStores = [store, ...this.vectorStores];
        this.toggleCreateForm();
      },
      error: (error) => {
        this.isCreating = false;
        this.createError = error?.error?.detail || 'Unable to create vector store.';
      }
    });
  }
}

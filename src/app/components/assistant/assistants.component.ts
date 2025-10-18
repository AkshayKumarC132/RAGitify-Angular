import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssistantService } from '../../services/assistant.service';
import { VectorStoreService } from '../../services/vector-store.service';
import { Assistant } from '../../models/assistant.model';
import { VectorStore } from '../../models/vector-store.model';

@Component({
  selector: 'app-assistants',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.scss']
})
export class AssistantsComponent implements OnInit {
  assistants: Assistant[] = [];
  vectorStores: VectorStore[] = [];
  createForm: FormGroup;
  showCreateForm = false;
  createError = '';
  isCreating = false;

  constructor(
    private assistantService: AssistantService,
    private vectorStoreService: VectorStoreService,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      vector_store_id: ['', Validators.required],
      model: [''],
      instructions: ['']
    });
  }

  ngOnInit(): void {
    this.loadAssistants();
    this.loadVectorStores();
  }

  loadAssistants(): void {
    this.assistantService.list().subscribe({
      next: (assistants) => (this.assistants = assistants),
      error: (error) => console.error('Error loading assistants:', error)
    });
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

    const payload = {
      ...this.createForm.value,
      tools: []
    };

    this.isCreating = true;
    this.createError = '';

    this.assistantService.create(payload).subscribe({
      next: (assistant) => {
        this.isCreating = false;
        this.assistants = [assistant, ...this.assistants];
        this.toggleCreateForm();
      },
      error: (error) => {
        this.isCreating = false;
        this.createError = error?.error?.detail || 'Unable to create assistant.';
      }
    });
  }
}

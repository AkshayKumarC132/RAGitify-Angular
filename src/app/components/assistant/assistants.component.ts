import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistantService } from '../../services/assistant.service';
import { Assistant } from '../../models/assistant.model';

@Component({
  selector: 'app-assistants',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full overflow-y-auto p-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Assistants</h1>
          <p class="text-gray-600 mt-2">Configure your AI assistants</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="mb-6">
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Create Assistant
            </button>
          </div>

          <div *ngIf="assistants.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <p class="text-lg">No assistants yet</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let assistant of assistants" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 class="font-semibold text-gray-900 mb-2">{{ assistant.name }}</h3>
              <p class="text-sm text-gray-500 mb-2">Model: {{ assistant.model || 'Default' }}</p>
              <p class="text-xs text-gray-400 mb-2">{{ assistant.instructions || 'No instructions' }}</p>
              <p class="text-xs text-gray-400">Created: {{ assistant.created_at | date:'short' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AssistantsComponent implements OnInit {
  assistants: Assistant[] = [];

  constructor(private assistantService: AssistantService) {}

  ngOnInit(): void {
    this.loadAssistants();
  }

  loadAssistants(): void {
    this.assistantService.list().subscribe({
      next: (assistants) => this.assistants = assistants,
      error: (error) => console.error('Error loading assistants:', error)
    });
  }
}
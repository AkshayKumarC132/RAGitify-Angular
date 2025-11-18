import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VectorStoreService } from '../../services/vector-store.service';
import { VectorStore } from '../../models/vector-store.model';

@Component({
  selector: 'app-vector-stores',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full overflow-y-auto p-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Vector Stores</h1>
          <p class="text-gray-600 mt-2">Manage your vector stores</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="mb-6">
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Create Vector Store
            </button>
          </div>

          <div *ngIf="vectorStores.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <p class="text-lg">No vector stores yet</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let store of vectorStores" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 class="font-semibold text-gray-900 mb-1">{{ store.name }}</h3>
              <p class="text-sm text-gray-500">Provider: {{ store.provider }}</p>
              <p class="text-sm text-gray-500" *ngIf="store.model">Model: {{ store.model }}</p>
              <p class="text-xs text-gray-400" *ngIf="store.description">{{ store.description }}</p>
              <p class="text-xs text-gray-400">Created: {{ store.created_at | date:'short' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VectorStoresComponent implements OnInit {
  vectorStores: VectorStore[] = [];

  constructor(private vectorStoreService: VectorStoreService) {}

  ngOnInit(): void {
    this.loadVectorStores();
  }

  loadVectorStores(): void {
    this.vectorStoreService.list().subscribe({
      next: (stores) => this.vectorStores = stores,
      error: (error) => console.error('Error loading vector stores:', error)
    });
  }
}
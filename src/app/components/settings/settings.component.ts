import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenAIKeyService } from '../../services/openai-key.service';
import { OpenAIKey } from '../../models/openai-key.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full overflow-y-auto p-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
          <p class="text-gray-600 mt-2">Manage your API keys and configurations</p>
        </div>

        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">API Keys</h2>
          
          <div class="mb-6">
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Add API Key
            </button>
          </div>

          <div *ngIf="apiKeys.length === 0" class="text-center py-8 text-gray-500">
            <p>No API keys configured</p>
          </div>

          <div class="space-y-4">
            <div *ngFor="let key of apiKeys" class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ key.name }}</h3>
                  <p class="text-sm text-gray-500">Provider: {{ key.provider }} | Model: {{ key.model }}</p>
                  <div class="flex items-center space-x-2 mt-2">
                    <span 
                      [class.bg-green-100]="key.is_valid"
                      [class.text-green-800]="key.is_valid"
                      [class.bg-red-100]="!key.is_valid"
                      [class.text-red-800]="!key.is_valid"
                      class="text-xs px-2 py-1 rounded-full"
                    >
                      {{ key.is_valid ? 'Valid' : 'Invalid' }}
                    </span>
                    <span 
                      *ngIf="key.is_active"
                      class="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800"
                    >
                      Active
                    </span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button class="text-indigo-600 hover:text-indigo-800">Edit</button>
                  <button class="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div class="space-y-3">
            <div>
              <label class="text-sm text-gray-600">Email</label>
              <p class="text-gray-900">{{ user?.email || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">Tenant</label>
              <p class="text-gray-900">{{ user?.tenant?.name || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  apiKeys: OpenAIKey[] = [];
  user: any = null;

  constructor(private openAIKeyService: OpenAIKeyService) {}

  ngOnInit(): void {
    this.loadAPIKeys();
    // Load user from localStorage or auth service
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
  }

  loadAPIKeys(): void {
    this.openAIKeyService.list().subscribe({
      next: (keys) => this.apiKeys = keys,
      error: (error) => console.error('Error loading API keys:', error)
    });
  }
}
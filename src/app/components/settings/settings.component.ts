import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenAIKeyService } from '../../services/openai-key.service';
import { OpenAIKey } from '../../models/openai-key.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  apiKeys: OpenAIKey[] = [];
  user: any = null;

  constructor(private openAIKeyService: OpenAIKeyService) {}

  ngOnInit(): void {
    this.loadAPIKeys();
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
  }

  loadAPIKeys(): void {
    this.openAIKeyService.list().subscribe({
      next: (keys) => (this.apiKeys = keys),
      error: (error) => console.error('Error loading API keys:', error)
    });
  }
}

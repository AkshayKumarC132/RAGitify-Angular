import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistantService } from '../../services/assistant.service';
import { Assistant } from '../../models/assistant.model';

@Component({
  selector: 'app-assistants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.scss']
})
export class AssistantsComponent implements OnInit {
  assistants: Assistant[] = [];

  constructor(private assistantService: AssistantService) {}

  ngOnInit(): void {
    this.loadAssistants();
  }

  loadAssistants(): void {
    this.assistantService.list().subscribe({
      next: (assistants) => (this.assistants = assistants),
      error: (error) => console.error('Error loading assistants:', error)
    });
  }
}

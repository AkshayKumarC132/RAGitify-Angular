import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VectorStoreService } from '../../services/vector-store.service';
import { VectorStore } from '../../models/vector-store.model';

@Component({
  selector: 'app-vector-stores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vector-stores.component.html',
  styleUrls: ['./vector-stores.component.scss']
})
export class VectorStoresComponent implements OnInit {
  vectorStores: VectorStore[] = [];

  constructor(private vectorStoreService: VectorStoreService) {}

  ngOnInit(): void {
    this.loadVectorStores();
  }

  loadVectorStores(): void {
    this.vectorStoreService.list().subscribe({
      next: (stores) => (this.vectorStores = stores),
      error: (error) => console.error('Error loading vector stores:', error)
    });
  }
}

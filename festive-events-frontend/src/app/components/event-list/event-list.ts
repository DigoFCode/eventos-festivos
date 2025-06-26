import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api';
import { FestiveEvent } from '../../models/interfaces';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSnackBarModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss'
})
export class EventListComponent implements OnInit {
  events: FestiveEvent[] = [];
  displayedColumns: string[] = ['image', 'event_name', 'event_date', 'event_address', 'user', 'actions'];
  loading = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.apiService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar eventos:', error);
        this.snackBar.open('Erro ao carregar eventos', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  deleteEvent(event: FestiveEvent) {
    if (confirm(`Tem certeza que deseja excluir o evento "${event.event_name}"?`)) {
      this.apiService.deleteEvent(event.id!).subscribe({
        next: () => {
          this.snackBar.open('Evento excluído com sucesso', 'Fechar', { duration: 3000 });
          this.loadEvents();
        },
        error: (error) => {
          console.error('Erro ao excluir evento:', error);
          this.snackBar.open('Erro ao excluir evento', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    return `http://localhost:5000/${imageUrl}`;
  }
}


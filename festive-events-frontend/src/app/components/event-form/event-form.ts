import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api';
import { User, FestiveEvent } from '../../models/interfaces';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss'
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId: number | null = null;
  loading = false;
  submitting = false;
  uploadingImage = false;
  users: User[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  currentImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      event_name: ['', [Validators.required, Validators.minLength(3)]],
      event_date: ['', [Validators.required]],
      event_time: ['', [Validators.required]],
      event_address: ['', [Validators.required]],
      event_description: [''],
      user_id: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadUsers();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.eventId = +params['id'];
        this.loadEvent();
      }
    });
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.snackBar.open('Erro ao carregar usuários', 'Fechar', { duration: 3000 });
      }
    });
  }

  loadEvent() {
    if (!this.eventId) return;
    
    this.loading = true;
    this.apiService.getEvent(this.eventId).subscribe({
      next: (event) => {
        const eventDate = new Date(event.event_date);
        const dateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        const timeOnly = eventDate.toTimeString().slice(0, 5);
        
        this.eventForm.patchValue({
          event_name: event.event_name,
          event_date: dateOnly,
          event_time: timeOnly,
          event_address: event.event_address,
          event_description: event.event_description,
          user_id: event.user_id
        });
        
        if (event.image_url) {
          this.currentImageUrl = `http://localhost:5000/${event.image_url}`;
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar evento:', error);
        this.snackBar.open('Erro ao carregar evento', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/events']);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.currentImageUrl = null;
  }

  async uploadImage(): Promise<string | null> {
    if (!this.selectedFile) return null;
    
    this.uploadingImage = true;
    
    try {
      const response = await this.apiService.uploadImage(this.selectedFile).toPromise();
      this.uploadingImage = false;
      return response?.image_url || null;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      this.snackBar.open('Erro ao fazer upload da imagem', 'Fechar', { duration: 3000 });
      this.uploadingImage = false;
      return null;
    }
  }

  async onSubmit() {
    if (this.eventForm.valid) {
      this.submitting = true;
      
      let imageUrl = this.currentImageUrl ? this.currentImageUrl.replace('http://localhost:5000/', '') : '';
      
      // Upload da nova imagem se selecionada
      if (this.selectedFile) {
        const uploadedImageUrl = await this.uploadImage();
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl;
        } else {
          this.submitting = false;
          return;
        }
      }
      
      // Combinar data e hora
      const formValue = this.eventForm.value;
      const eventDate = new Date(formValue.event_date);
      const [hours, minutes] = formValue.event_time.split(':');
      eventDate.setHours(parseInt(hours), parseInt(minutes));
      
      const eventData: FestiveEvent = {
        event_name: formValue.event_name,
        event_date: eventDate.toISOString(),
        event_address: formValue.event_address,
        event_description: formValue.event_description,
        image_url: imageUrl,
        user_id: formValue.user_id
      };

      const operation = this.isEditMode 
        ? this.apiService.updateEvent(this.eventId!, eventData)
        : this.apiService.createEvent(eventData);

      operation.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Evento atualizado com sucesso' : 'Evento criado com sucesso';
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Erro ao salvar evento:', error);
          let errorMessage = 'Erro ao salvar evento';
          if (error.error?.error) {
            errorMessage = error.error.error;
          }
          this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
          this.submitting = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/events']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.eventForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} é obrigatório`;
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }
    return '';
  }
}


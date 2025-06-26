import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUser();
        // Em modo de edição, a senha não é obrigatória
        this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
        this.userForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  loadUser() {
    if (!this.userId) return;
    
    this.loading = true;
    this.apiService.getUser(this.userId).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuário:', error);
        this.snackBar.open('Erro ao carregar usuário', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.submitting = true;
      const userData: User = this.userForm.value;

      // Se estamos editando e a senha está vazia, não incluir no payload
      if (this.isEditMode && !userData.password) {
        delete userData.password;
      }

      const operation = this.isEditMode 
        ? this.apiService.updateUser(this.userId!, userData)
        : this.apiService.createUser(userData);

      operation.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Usuário atualizado com sucesso' : 'Usuário criado com sucesso';
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (error) => {
          console.error('Erro ao salvar usuário:', error);
          let errorMessage = 'Erro ao salvar usuário';
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
    this.router.navigate(['/users']);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} é obrigatório`;
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }
    return '';
  }
}


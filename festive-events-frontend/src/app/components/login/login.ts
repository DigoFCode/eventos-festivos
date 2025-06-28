import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.submitting = true;
      const { username, password } = this.loginForm.value;
      this.apiService.login(username, password).subscribe({
        next: (res) => {
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.snackBar.open('Login realizado com sucesso', 'Fechar', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (err) => {
          console.error('Erro ao fazer login:', err);
          let msg = 'Credenciais inválidas';
          if (err.error?.error) {
            msg = err.error.error;
          }
          this.snackBar.open(msg, 'Fechar', { duration: 3000 });
          this.submitting = false;
        }
      });
    }
  }
}

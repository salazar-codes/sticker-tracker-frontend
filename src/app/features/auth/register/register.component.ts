// src/app/features/auth/register/register.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  onSubmit() {
    this.loading.set(true);
    this.error.set('');


    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/colecciones']),
      error: () => {
        this.error.set('Error al crear la cuenta');
        this.loading.set(false);
      }
    });
  }
}
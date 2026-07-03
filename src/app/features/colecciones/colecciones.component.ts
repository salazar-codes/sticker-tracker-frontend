// src/app/features/colecciones/colecciones.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Coleccion } from '../../core/models/coleccion.model';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-colecciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './colecciones.component.html',
  styleUrl: './colecciones.component.scss'
})
export class ColeccionesComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  colecciones = signal<Coleccion[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.http.get<Coleccion[]>(`${environment.apiUrl}/colecciones`)
      .subscribe({
        next: data => {
          this.colecciones.set(data);
          this.loading.set(false);
          //if (data.length === 1) this.abrir(data[0]);
        },
        error: () => this.loading.set(false)
      });
  }

  abrir(coleccion: Coleccion) {
    this.router.navigate(['/album', coleccion.codigo]);
  }

  logout() {
    this.authService.logout();
  }
}
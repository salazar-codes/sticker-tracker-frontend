// src/app/core/services/album.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AlbumStats } from '../models/album.model';
import { Figurita, ToggleResponse } from '../models/figurita.model';
import { AlbumFigurita } from '../models/figurita.model';

@Injectable({ providedIn: 'root' })
export class AlbumService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getStats(codigoColeccion: string) {
    return this.http.get<AlbumStats>(
      `${this.base}/album/${codigoColeccion}/stats`
    );
  }

  getFiguritasConEstado(codigoColeccion: string) {
    return this.http.get<AlbumFigurita[]>(
      `${this.base}/album/${codigoColeccion}/figuritas`
    );
  }

  getFiguritas(codigoColeccion: string) {
    return this.http.get<Figurita[]>(
      `${this.base}/colecciones/${codigoColeccion}/figuritas`
    );
  }

  toggle(codigoColeccion: string, numero: string) {
    return this.http.patch<ToggleResponse>(
      `${this.base}/album/${codigoColeccion}/figuritas/${numero}/toggle`,
      {}
    );
  }
}
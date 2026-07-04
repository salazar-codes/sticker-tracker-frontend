// src/app/features/album/album.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlbumService } from '../../core/services/album.service';
import { StatsComponent } from './stats/stats.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
import { AlbumStats } from '../../core/models/album.model';
import { COLOR_ESTADO, AlbumFigurita, EstadoFigurita } from '../../core/models/figurita.model';

@Component({
  selector: 'app-album',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsComponent, HeatmapComponent],
  templateUrl: './album.component.html',
  styleUrl: './album.component.scss'
})
export class AlbumComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private albumService = inject(AlbumService);
  private bannerTimer: ReturnType<typeof setTimeout> | null = null;

  codigo = this.route.snapshot.paramMap.get('codigo')!;

  stats    = signal<AlbumStats | null>(null);
  figuritas = signal<AlbumFigurita[]>([]);
  loading  = signal(true);
  ultimaTocada   = signal<AlbumFigurita | null>(null);

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading.set(true);

    this.albumService.getStats(this.codigo).subscribe({
      next: data => this.stats.set(data)
    });

    // Usa el nuevo endpoint — ya viene con estado y ordenado
    this.albumService.getFiguritasConEstado(this.codigo).subscribe({
      next: data => {
        // El backend ya viene ordenado — solo lo seteamos
        this.figuritas.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
   
  onToggle(numero: string) {
    // Optimistic update
    this.figuritas.update(lista =>
      lista.map(f => {
        if (f.numero !== numero) return f;
        const siguiente: Record<EstadoFigurita, EstadoFigurita> = {
          'FALTA': 'TENGO',
          'TENGO': 'REPETIDA',
          'REPETIDA': 'FALTA'
        };
        const nuevoEstado = siguiente[f.estado];
        return {
          ...f,
          estado: nuevoEstado,
          colorHex: COLOR_ESTADO[nuevoEstado]
        };
      })
    );

    // Setea banner con estado actualizado
    const figActualizada = this.figuritas().find(f => f.numero === numero) ?? null;
    this.ultimaTocada.set(figActualizada);

    // ← Cancela el timer anterior antes de crear uno nuevo
    if (this.bannerTimer) {
      clearTimeout(this.bannerTimer);
    }
    this.bannerTimer = setTimeout(() => {
      this.ultimaTocada.set(null);
      this.bannerTimer = null;
    }, 2000);

    // Persiste en backend
    this.albumService.toggle(this.codigo, numero).subscribe({
      next: response => {
        // Sincroniza con estado real del backend
        this.figuritas.update(lista =>
          lista.map(f =>
            f.numero === numero
              ? { ...f, estado: response.estado, colorHex: response.colorHex }
              : f
          )
        );
        // Refresca stats
        this.albumService.getStats(this.codigo).subscribe({
          next: stats => this.stats.set(stats)
        });
      },
      error: () => this.cargarDatos()  // rollback
    });
  }
}
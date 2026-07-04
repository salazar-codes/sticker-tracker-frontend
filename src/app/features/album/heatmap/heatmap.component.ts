// src/app/features/album/heatmap/heatmap.component.ts
import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumFigurita } from '../../../core/models/figurita.model';

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.scss'
})
export class HeatmapComponent {
  figuritas = input.required<AlbumFigurita[]>();
  toggleFigurita = output<string>();
  ultimaTocada = input<AlbumFigurita | null>(null);
  figuitaHover   = signal<AlbumFigurita | null>(null);
  tooltipX       = signal(0);
  tooltipY       = signal(0);
  isMobile       = signal(window.innerWidth < 768);

  // Desktop — hover
  onHover(fig: AlbumFigurita, event: MouseEvent) {
    if (this.isMobile()) return;
    this.figuitaHover.set(fig);
    this.posicionarTooltip(event.clientX, event.clientY);
  }

  onLeave() {
    if (!this.isMobile()) this.figuitaHover.set(null);
  }

  // Desktop — click directo
  onClick(fig: AlbumFigurita) {
    if (this.isMobile()) return;
    this.toggleFigurita.emit(fig.numero);
  }

  // Mobile — touchend para evitar conflictos con scroll
  onTouchEnd(fig: AlbumFigurita, event: TouchEvent) {
    if (!this.isMobile()) return;
    event.preventDefault();
    this.toggleFigurita.emit(fig.numero); // primero emite
  }

  private posicionarTooltip(clientX: number, clientY: number) {
    const tooltipW = 180;
    const tooltipH = 120;
    const margin   = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = clientX + margin;
    if (x + tooltipW > vw) x = clientX - tooltipW - margin;

    let y = clientY + margin;
    if (y + tooltipH > vh) y = clientY - tooltipH - margin;

    this.tooltipX.set(x);
    this.tooltipY.set(y);
  }

  seccionEntries(): [string, AlbumFigurita[]][] {
    const map = new Map<string, AlbumFigurita[]>();
    for (const fig of this.figuritas()) {
      if (!map.has(fig.codigoSeccion)) map.set(fig.codigoSeccion, []);
      map.get(fig.codigoSeccion)!.push(fig);
    }
    return Array.from(map.entries());
  }
}
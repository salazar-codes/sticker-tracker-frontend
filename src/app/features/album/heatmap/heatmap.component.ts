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
  figuitaHover = signal<AlbumFigurita | null>(null);
  tooltipX = signal(0);
  tooltipY = signal(0);

  onHover(fig: AlbumFigurita, event: MouseEvent) {
    this.figuitaHover.set(fig);
    this.tooltipX.set(event.clientX + 12);
    this.tooltipY.set(event.clientY + 12);
  }

  onLeave() { this.figuitaHover.set(null); }

  onToggle(numero: string) { this.toggleFigurita.emit(numero); }

  seccionEntries(): [string, AlbumFigurita[]][] {
    const map = new Map<string, AlbumFigurita[]>();
    for (const fig of this.figuritas()) {
      if (!map.has(fig.codigoSeccion)) map.set(fig.codigoSeccion, []);
      map.get(fig.codigoSeccion)!.push(fig);
    }
    return Array.from(map.entries());
  }
}
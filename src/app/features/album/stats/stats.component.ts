// src/app/features/album/stats/stats.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumStats } from '../../../core/models/album.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  stats = input.required<AlbumStats>();
}
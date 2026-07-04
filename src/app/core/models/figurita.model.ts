export type EstadoFigurita = 'TENGO' | 'FALTA' | 'REPETIDA';

export interface Figurita {
  id: number;
  numero: string;
  nombreDisplay: string;
  tipo: string;
  esPremium: boolean;
  ordenEnSeccion: number;
  codigoSeccion: string;
  codigoSeleccion: string | null;
  estadioNombre: string | null;
}

export interface FiguitaConEstado extends Figurita {
  estado: EstadoFigurita;
  colorHex: string;
}

export interface ToggleResponse {
  numero: string;
  estado: EstadoFigurita;
  colorHex: string;
}

export interface AlbumFigurita {
  id: number;
  numero: string;
  nombreDisplay: string;
  tipo: string;
  esPremium: boolean;
  ordenEnSeccion: number;
  codigoSeccion: string;
  nombreSeccion: string;
  codigoSeleccion: string | null;
  estadioNombre: string | null;
  estado: EstadoFigurita;
  colorHex: string;
}

export const COLOR_ESTADO: Record<EstadoFigurita, string> = {
  TENGO:    '#22C55E',
  FALTA:    '#D1D5DB',
  REPETIDA: '#EAB308'
};
export interface Cliente {
  id: string;
  nombre: string;
  apellidos: string;
  identificacion: string;
  numeroMovil: string;
  foto: string | null;
}

export interface Chofer {
  id: string;
  nombre: string;
  apellidos: string;
  identificacion: string;
  numeroMovil: string;
  municipio: string;
  vehiculo: 'auto' | 'camioneta' | 'triciclo';
  fotosVehiculo: string[];
}

export interface Viaje {
  id: string;
  clienteId: string;
  choferId: string;
  lugarRecogida: string;
  destino: string;
  distanciaKm: number;
  costoTotal: number;
  porcentaje: number;
  fecha: string;
}

export type Page = 'home' | 'clientes' | 'choferes' | 'viajes';

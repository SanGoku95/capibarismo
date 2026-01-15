export type CandidateID = string;

export interface CandidateBase {
  id: CandidateID;
  nombre: string;
  ideologia?: string;
  partido?: string;
  partyIcon?: string;
  headshot?: string;
  fullBody?: string;
  color?: string;
}

export interface ProyectoPoliticoDetalle {
  subtitulo: string;
  texto: string;
  fuente?: string;
}
export interface ProyectoPolitico {
  titulo: string;
  resumen: string;
  detalles?: ProyectoPoliticoDetalle[];
}

export interface Creencia {
  id: string;
  nombre: string;
  resumen: string;
  detalle?: string;
  fuente?: string;
}

export interface PresenciaDigital {
  plataformas: Array<{
    nombre: 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'web';
    handle?: string;
    url: string;
    estrategia: string;
  }>;
}

export interface MapaDePoder {
  alianzas: Array<{ nombre: string; descripcion: string }>;
  opositores: Array<{ nombre: string; descripcion: string }>;
}

export type Severidad = 'media' | 'alta' | 'muy-alta';
export type EstadoLegal = 'denuncia_en_medios' | 'en_curso' | 'sancion' | 'cerrado_sin_sancion' | 'condena';

export interface Controversia {
  id: string;
  titulo: string;
  descripcion: string;
  fuente: string;
  rank?: number;
  legal?: EstadoLegal;
  severidad?: Severidad;
}

export interface CandidateProfile {
  base: CandidateBase;
  trayectoria?: import('./domains/trayectorias').TrayectoriaEstructurada;
  proyectoPolitico?: ProyectoPolitico;
  creenciasClave: Creencia[];
  presenciaDigital?: PresenciaDigital;
  mapaDePoder?: MapaDePoder;
  controversias?: Controversia[];
}

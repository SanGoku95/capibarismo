export type CandidateID = string;

export interface CandidateBase {
  id: CandidateID;
  nombre: string;
  ideologia?: string | null;
  partido?: string;
  partyIcon?: string;
  headshot?: string;
  fullBody?: string;
  color?: string;
}

// Tipos de educación (datos JNE)
export interface EducacionUniversitaria {
  universidad: string;
  carrera: string;
  año: string;
}

export interface EducacionPostgrado {
  tipo: string;
  institucion: string;
  especialidad: string;
  año: string;
}

export interface Educacion {
  basica: { primaria: string; secundaria: string };
  universitaria: EducacionUniversitaria[];
  postgrado: EducacionPostgrado[];
}

// Tipos de experiencia laboral (datos JNE)
export interface Trabajo {
  puesto: string;
  empresa: string;
  periodo: string;
  ubicacion: string;
}

// Tipos de sentencias (datos JNE)
export interface Sentencia {
  delito: string;
  año: string;
  fallo: string;
  organo: string;
}

// Tipos de propiedades (datos JNE)
export interface Propiedades {
  inmuebles: number;
  vehiculos: number;
  otros: number;
}

// Tipos de ingresos (datos JNE)
export interface Ingreso {
  año: string;
  publico: number;
  privado: number;
  total: number;
}

export interface CandidateProfile {
  base: CandidateBase;
  educacion?: Educacion;
  experienciaLaboral?: Trabajo[];
  sentencias?: Sentencia[];
  propiedades?: Propiedades;
  ingresos?: Ingreso[];
}

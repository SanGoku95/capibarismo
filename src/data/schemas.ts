import { z } from 'zod';

export const ProyectoPoliticoSchema = z.object({
  titulo: z.string().min(1),
  resumen: z.string().min(1),
  detalles: z.array(
    z.object({
      subtitulo: z.string().min(1),
      texto: z.string().min(1),
      fuente: z.string().url().optional(),
    })
  ).optional(),
});

export const CreenciaSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1),
  resumen: z.string().min(1),
  detalle: z.string().optional(),
  fuente: z.string().url().optional(),
});

export const PresenciaDigitalSchema = z.object({
  plataformas: z.array(z.object({
    nombre: z.enum(['tiktok','youtube','instagram','facebook','twitter','web']),
    handle: z.string().optional(),
    url: z.string().url(),
    estrategia: z.string().min(1),
  })),
});

export const CandidateBaseSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().min(1),
  ideologia: z.string().optional(),
  partido: z.string().optional(),
  partyIcon: z.string().optional(),
  headshot: z.string().optional(),
  fullBody: z.string().optional(),
  color: z.string().optional(),
});

// Educación (JNE)
export const EducacionUniversitariaSchema = z.object({
  universidad: z.string().min(1),
  carrera: z.string().min(1),
  año: z.string().min(1),
});

export const EducacionPostgradoSchema = z.object({
  tipo: z.string().min(1),
  institucion: z.string().min(1),
  especialidad: z.string().min(1),
  año: z.string().min(1),
});

export const EducacionSchema = z.object({
  basica: z.object({
    primaria: z.string().min(1),
    secundaria: z.string().min(1),
  }),
  universitaria: z.array(EducacionUniversitariaSchema),
  postgrado: z.array(EducacionPostgradoSchema),
});

// Experiencia laboral (JNE)
export const TrabajoSchema = z.object({
  puesto: z.string().min(1),
  empresa: z.string().min(1),
  periodo: z.string().min(1),
  ubicacion: z.string().min(1),
});
export const ExperienciaLaboralSchema = z.array(TrabajoSchema);

// Sentencias (JNE)
export const SentenciaSchema = z.object({
  delito: z.string().min(1),
  año: z.string().min(1),
  fallo: z.string().min(1),
  organo: z.string().min(1),
});
export const SentenciasSchema = z.array(SentenciaSchema);

// Propiedades (JNE)
export const PropiedadesSchema = z.object({
  inmuebles: z.number().int().nonnegative(),
  vehiculos: z.number().int().nonnegative(),
  otros: z.number().int().nonnegative(),
});

// Ingresos (JNE)
export const IngresoSchema = z.object({
  año: z.string().min(1),
  publico: z.number().nonnegative(),
  privado: z.number().nonnegative(),
  total: z.number().nonnegative(),
});
export const IngresosSchema = z.array(IngresoSchema);

// Perfil compuesto (enfocado en JNE)
export const CandidateProfileSchema = z.object({
  base: CandidateBaseSchema,
  educacion: EducacionSchema.optional(),
  experienciaLaboral: ExperienciaLaboralSchema.optional(),
  sentencias: SentenciasSchema.optional(),
  propiedades: PropiedadesSchema.optional(),
  ingresos: IngresosSchema.optional(),
});

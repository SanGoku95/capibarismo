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

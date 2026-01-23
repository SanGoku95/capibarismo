import { base as baseRecords } from '../src/data/domains/base';
import { proyectos } from '../src/data/domains/proyectos';
import { creencias } from '../src/data/domains/creencias';
import { presencia } from '../src/data/domains/presencia';
import { ProyectoPoliticoSchema, CreenciaSchema, PresenciaDigitalSchema } from '../src/data/schemas';

let ok = true;

for (const id of Object.keys(baseRecords)) {
  const p = proyectos[id];
  if (p) {
    const res = ProyectoPoliticoSchema.safeParse(p);
    if (!res.success) {
      ok = false;
      console.error(`[data] proyectoPolitico inválido para ${id}:`, res.error.format());
    }
  }
  const cr = creencias[id] ?? [];
  for (const item of cr) {
    const res = CreenciaSchema.safeParse(item);
    if (!res.success) {
      ok = false;
      console.error(`[data] creencia inválida para ${id}:`, res.error.format());
    }
  }
  const pd = presencia[id];
  if (pd) {
    const res = PresenciaDigitalSchema.safeParse(pd);
    if (!res.success) {
      ok = false;
      console.error(`[data] presenciaDigital inválida para ${id}:`, res.error.format());
    }
  }
}

if (!ok) {
  process.exit(1);
}

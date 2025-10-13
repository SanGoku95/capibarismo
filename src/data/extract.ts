import { candidates, type Candidate } from './candidates';

const extractSources = (candidate: Candidate): string[] => {
  const sources = new Set<string>();
  const push = (value?: string) => {
    if (value) sources.add(value);
  };

  candidate.proyectoPolitico.detalles?.forEach(detalle => push(detalle.fuente));
  candidate.creenciasClave.forEach(creencia => push(creencia.fuente));
  candidate.trayectoria.forEach(entry => {
    push(entry.fuente);
    entry.detalles?.forEach(detalle => push(detalle.fuente));
  });
  candidate.presenciaDigital.plataformas.forEach(plataforma => push(plataforma.url));
  candidate.controversias.forEach(controversia => push(controversia.fuente));

  return Array.from(sources);
};

const candidateSources = candidates.map(candidate => ({
  id: candidate.id,
  sources: extractSources(candidate),
}));

console.log(JSON.stringify(candidateSources, null, 2));
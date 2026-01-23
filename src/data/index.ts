import type { CandidateProfile, CandidateBase } from './types';
import { base as baseRecords } from './domains/base';
import { educacion as educacionData } from './domains/educacion';
import { experienciaLaboral as experienciaData } from './domains/experienciaLaboral';
import { sentencias as sentenciasData } from './domains/sentencias';
import { propiedades as propiedadesData } from './domains/propiedades';
import { ingresos as ingresosData } from './domains/ingresos';

export function listCandidates(): CandidateBase[] {
  return Object.values(baseRecords);
}

export function getCandidateProfile(id: string): CandidateProfile | null {
  const base = baseRecords[id];
  if (!base) return null;

  const educacion = educacionData[id];
  const experienciaLaboral = experienciaData[id];
  const sentencias = sentenciasData[id];
  const propiedades = propiedadesData[id];
  const ingresos = ingresosData[id];

  // Compat: si CandidateProfile aún tiene campos legacy, se devuelven con defaults.
  return {
    base,

    trayectoria: undefined,
    proyectoPolitico: undefined,
    creenciasClave: [],
    presenciaDigital: undefined,
    mapaDePoder: undefined,
    controversias: [],

    educacion,
    experienciaLaboral,
    sentencias,
    propiedades,
    ingresos,
  } as CandidateProfile;
}

// Backward-compat convenience: quick lookup for simple pages
export function findCandidateBase(id: string): CandidateBase | undefined {
  return listCandidates().find((c) => c.id === id);
}

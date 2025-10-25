import { trayectorias } from './domains/trayectorias';
import type { CandidateProfile, CandidateBase, ProyectoPolitico, Creencia, PresenciaDigital, MapaDePoder, Controversia } from './types';
import { base as baseRecords } from './domains/base';
import { proyectos as proyectosOverrides } from './domains/proyectos';
import { creencias as creenciasOverrides } from './domains/creencias';
import { presencia as presenciaOverrides } from './domains/presencia';
import { mapaDePoder as mapaDePoderOverrides } from './domains/mapaDePoder';
import { controversias as controversiasOverrides } from './domains/controversias';

export function listCandidates(): CandidateBase[] {
  return Object.values(baseRecords);
}

export function getCandidateProfile(id: string): CandidateProfile | null {
  const base = baseRecords[id];
  if (!base) return null;

  // Usar exclusivamente dominios migrados (sin fallback al monolito)
  const proyecto: ProyectoPolitico | undefined = proyectosOverrides[id];
  const creencias: Creencia[] = creenciasOverrides[id] ?? [];
  const presencia: PresenciaDigital | undefined = presenciaOverrides[id];
  const poder: MapaDePoder | undefined = mapaDePoderOverrides[id];
  const controversias: Controversia[] | undefined = controversiasOverrides[id];

  return {
    base,
    trayectoria: trayectorias[id],
    proyectoPolitico: proyecto,
    creenciasClave: creencias,
    presenciaDigital: presencia,
    mapaDePoder: poder,
    controversias,
  };
}

// Backward-compat convenience: quick lookup for simple pages
export function findCandidateBase(id: string): CandidateBase | undefined {
  return listCandidates().find((c) => c.id === id);
}

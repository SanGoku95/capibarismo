import { trayectorias } from './domains/trayectorias';
import type { CandidateProfile, CandidateBase, ProyectoPolitico, Creencia, PresenciaDigital, MapaDePoder, Controversia, Educacion, Trabajo, Sentencia, Propiedades, Ingreso } from './types';
import { base as baseRecords } from './domains/base';
import { proyectos as proyectosOverrides } from './domains/proyectos';
import { creencias as creenciasOverrides } from './domains/creencias';
import { presencia as presenciaOverrides } from './domains/presencia';
import { mapaDePoder as mapaDePoderOverrides } from './domains/mapaDePoder';
import { controversias as controversiasOverrides } from './domains/controversias';
// Nuevos datos JNE
import { educacion as educacionData } from './domains/educacion';
import { experienciaLaboral as experienciaData } from './domains/experienciaLaboral';
import { sentencias as sentenciasData } from './domains/sentencias';
import { propiedades as propiedadesData } from './domains/propiedades';
import { ingresos as ingresosData } from './domains/ingresos';
import { getOldId } from './domains/idMapping';

export function listCandidates(): CandidateBase[] {
  return Object.values(baseRecords);
}

export function getCandidateProfile(id: string): CandidateProfile | null {
  const base = baseRecords[id];
  if (!base) return null;

  // Obtener el ID antiguo para datos curados (fotos, trayectorias, etc.)
  const oldId = getOldId(id);

  // Usar exclusivamente dominios migrados (sin fallback al monolito)
  // Los datos curados usan oldId, los datos JNE usan id directamente
  const proyecto: ProyectoPolitico | undefined = proyectosOverrides[oldId];
  const creencias: Creencia[] = creenciasOverrides[oldId] ?? [];
  const presencia: PresenciaDigital | undefined = presenciaOverrides[oldId];
  const poder: MapaDePoder | undefined = mapaDePoderOverrides[oldId];
  const controversias: Controversia[] | undefined = controversiasOverrides[oldId];

  // Datos JNE (usan el ID nuevo directamente)
  const educacion: Educacion | undefined = educacionData[id];
  const experienciaLaboral: Trabajo[] | undefined = experienciaData[id];
  const sentencias: Sentencia[] | undefined = sentenciasData[id];
  const propiedades: Propiedades | undefined = propiedadesData[id];
  const ingresos: Ingreso[] | undefined = ingresosData[id];

  return {
    base,
    trayectoria: trayectorias[oldId],
    proyectoPolitico: proyecto,
    creenciasClave: creencias,
    presenciaDigital: presencia,
    mapaDePoder: poder,
    controversias,
    // Nuevos datos JNE
    educacion,
    experienciaLaboral,
    sentencias,
    propiedades,
    ingresos,
  };
}

// Backward-compat convenience: quick lookup for simple pages
export function findCandidateBase(id: string): CandidateBase | undefined {
  return listCandidates().find((c) => c.id === id);
}

// Normalización de ejes del Mapa Político y banderas temáticas
export type CompassStance = {
  econ?: number;
  social?: number;
  territorial?: number;
  power?: number;
};
// Extraído de candidates.ts para dejar de depender del monolito en tiempo de ejecución
export const compass: Record<string, CompassStance> = {
  keiko: {
    econ: 8,
    social: 8,
    territorial: 6,
    power: 3,
  },
  rafael: {
    econ: 6,
    social: 10,
    territorial: -3,
    power: 8,
  },
  yonhy: {
    econ: -3,
    social: -1,
    territorial: -6,
    power: -6,
  },
  'carlos-alvarez': {
    econ: 3,
    social: 6,
    territorial: 1,
    power: 6,
  },
  'cesar-acuna': {
    econ: 3,
    social: 3,
    territorial: -1,
    power: 3,
  },
  'lopez-chau': {
    econ: -3,
    social: -3,
    territorial: -5,
    power: 1,
  },
  belmont: {
    econ: 0,
    social: 0,
    territorial: 0,
    power: 0,
  },
  cerron: {
    econ: 0,
    social: 0,
    territorial: 0,
    power: 0,
  },
  guevara: {
    econ: 0,
    social: 0,
    territorial: 0,
    power: 0,
  },
  olivera: {
    econ: 0,
    social: 0,
    territorial: 0,
    power: 0,
  },
  sanchez: {
    econ: 0,
    social: 0,
    territorial: 0,
    power: 0,
  },
};

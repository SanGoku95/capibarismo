export type Axis = 'econ' | 'social' | 'territorial' | 'power';

export const axisLabels: Record<Axis, { name: string; low: string; high: string }> = {
  econ: { name: 'EJE ECONÓMICO', low: 'IZQUIERDA', high: 'DERECHA' },
  social: { name: 'EJE SOCIAL', low: 'LIBERTARIO', high: 'AUTORITARIO' },
  territorial: { name: 'EJE TERRITORIAL', low: 'REGIONALISTA', high: 'CENTRALISTA' },
  power: { name: 'ESTILO DE PODER', low: 'INSTITUCIONALISTA', high: 'POPULISTA' },
};

import type { StanceDetails } from './topics';

export interface CandidateStances {
  actor: string;
  id: string;
  stances: Record<string /* subtopic.id */, StanceDetails>;
}

export const candidateData: CandidateStances[] = [
  {
    id: "keiko",
    actor: "Keiko Fujimori",
    stances: {
      'military-police-support': { stance: 'A favor', gist: 'Mano dura y orden.', evidence: 'Propone declarar en emergencia la seguridad y que las FFAA apoyen a la policía en el control territorial.', source: 'Plan de Gobierno 2021' },
      'job-programs': { stance: 'Mixto', gist: 'Inversión privada para empleo.', evidence: 'El enfoque principal es atraer inversión para generar empleo, no programas estatales directos. Menciona "obras por impuestos" para capacitación.', source: 'Plan de Gobierno 2021' },
      'community-policing': { stance: 'Neutral', gist: 'No es su enfoque principal.', evidence: 'Su plan se centra en el fortalecimiento de la autoridad y el castigo, con poca mención a estrategias de policía comunitaria.', source: 'Debates Públicos' },
    }
  },
  {
    id: "veronika",
    actor: "Verónika Mendoza",
    stances: {
      'military-police-support': { stance: 'En contra', gist: 'Reforma policial, no militarización.', evidence: 'Critica la "mano dura". Propone una reforma policial con enfoque en derechos humanos y control civil, oponiéndose a la intervención militar.', source: 'Plan de Gobierno JPP' },
      'job-programs': { stance: 'A favor', gist: 'Programas estatales de empleo juvenil.', evidence: 'Propone programas de empleo temporal y capacitación para jóvenes en barrios vulnerables como estrategia de prevención del delito.', source: 'Plan de Gobierno JPP' },
      'community-policing': { stance: 'A favor', gist: 'Fortalecer el vínculo policía-comunidad.', evidence: 'Enfatiza la necesidad de una policía de barrio que trabaje con las juntas vecinales y organizaciones sociales para prevenir el delito.', source: 'Entrevistas' },
    }
  },
  // TODO: Add more candidates here...
];

export const allCandidates = candidateData.map(c => ({ id: c.id, name: c.actor }));

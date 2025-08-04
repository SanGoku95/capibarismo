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
      'gun-control': { stance: 'Mixto', gist: 'Control más estricto pero no prohibición.', evidence: 'Propone un mayor control y registro de armas legales, pero no apoya una prohibición total, enfocándose en el armamento ilegal.', source: 'Entrevistas' },
      'mining-investment': { stance: 'A favor', gist: 'Destrabar proyectos mineros.', evidence: 'Considera la minería como el motor principal de la economía y propone facilitar y acelerar la ejecución de grandes proyectos de inversión.', source: 'Plan de Gobierno 2021' },
      'tax-reform': { stance: 'En contra', gist: 'No subir impuestos.', evidence: 'Se opone a la creación de nuevos impuestos o al aumento de las tasas existentes, argumentando que desincentiva la inversión privada.', source: 'Debates Públicos' },
      'informal-economy': { stance: 'A favor', gist: 'Formalización vía simplificación.', evidence: 'Propone un régimen tributario y laboral simplificado y de bajo costo para incentivar la formalización de pequeñas empresas.', source: 'Plan de Gobierno 2021' },
    }
  },
  {
    id: "veronika",
    actor: "Verónika Mendoza",
    stances: {
      'military-police-support': { stance: 'En contra', gist: 'Reforma policial, no militarización.', evidence: 'Critica la "mano dura". Propone una reforma policial con enfoque en derechos humanos y control civil, oponiéndose a la intervención militar.', source: 'Plan de Gobierno JPP' },
      'job-programs': { stance: 'A favor', gist: 'Programas estatales de empleo juvenil.', evidence: 'Propone programas de empleo temporal y capacitación para jóvenes en barrios vulnerables como estrategia de prevención del delito.', source: 'Plan de Gobierno JPP' },
      'community-policing': { stance: 'A favor', gist: 'Fortalecer el vínculo policía-comunidad.', evidence: 'Enfatiza la necesidad de una policía de barrio que trabaje con las juntas vecinales y organizaciones sociales para prevenir el delito.', source: 'Entrevistas' },
      'gun-control': { stance: 'A favor', gist: 'Prohibición de porte de armas para civiles.', evidence: 'Propone una política de desarme civil y una prohibición estricta del porte de armas de fuego para personas no autorizadas.', source: 'Plan de Gobierno JPP' },
      'mining-investment': { stance: 'Mixto', gist: 'Nuevas reglas y consulta previa.', evidence: 'Propone una renegociación de contratos para obtener mayores regalías y la aplicación estricta de la consulta previa y los estándares ambientales.', source: 'Plan de Gobierno JPP' },
      'tax-reform': { stance: 'A favor', gist: 'Impuesto a las grandes fortunas.', evidence: 'Es una de sus propuestas centrales para financiar programas sociales, proponiendo un impuesto permanente a las mayores fortunas del país.', source: 'Plan de Gobierno JPP' },
      'informal-economy': { stance: 'A favor', gist: 'Formalización con derechos.', evidence: 'Busca formalizar a través del acceso a crédito barato, seguridad social y pensiones, en lugar de solo un enfoque punitivo o tributario.', source: 'Entrevistas' },
    }
  },
  {
    id: "rafael",
    actor: "Rafael López Aliaga",
    stances: {
      'military-police-support': { stance: 'A favor', gist: 'FFAA en las calles.', evidence: 'Es uno de los principales proponentes de que las Fuerzas Armadas patrullen las calles junto a la policía para imponer el orden.', source: 'Declaraciones Públicas' },
      'job-programs': { stance: 'En contra', gist: 'El Estado no debe crear empleo.', evidence: 'Sostiene que el empleo debe ser generado exclusivamente por el sector privado y que el Estado solo debe facilitar la inversión.', source: 'Entrevistas' },
      'community-policing': { stance: 'Neutral', gist: 'Poco énfasis en su discurso.', evidence: 'Su enfoque es punitivo y de control, sin desarrollar propuestas específicas sobre el policiamiento comunitario.', source: 'Plan de Gobierno' },
      'gun-control': { stance: 'En contra', gist: 'Derecho a la autodefensa.', evidence: 'Ha sugerido en varias ocasiones que los ciudadanos honestos deberían tener derecho a portar armas para su defensa personal.', source: 'Declaraciones Públicas' },
      'mining-investment': { stance: 'A favor', gist: 'Inversión minera sin trabas.', evidence: 'Promueve la eliminación de lo que considera "trabas burocráticas" y "chantaje ambientalista" para acelerar la inversión minera.', source: 'Entrevistas' },
      'tax-reform': { stance: 'En contra', gist: 'Bajar impuestos para invertir.', evidence: 'Propone reducir la carga tributaria a las empresas para fomentar la reinversión y el crecimiento económico.', source: 'Plan de Gobierno' },
      'informal-economy': { stance: 'Mixto', gist: 'Tolerancia cero con informalidad "criminal".', evidence: 'Propone un enfoque de "formalízate o desaparece", con incentivos de mercado pero también con mano dura contra la informalidad ligada a actividades ilícitas.', source: 'Declaraciones Públicas' },
    }
  }
  // TODO: Add more candidates here...
];

export const allCandidates = candidateData.map(c => ({ id: c.id, name: c.actor }));

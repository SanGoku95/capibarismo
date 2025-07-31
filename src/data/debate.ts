export type Issue = 'Seguridad Ciudadana' | 'Reforma Política' | 'Modelo Económico' | 'Minería y Medio Ambiente' | 'Salud y Educación';

export type Stance = 'A favor' | 'En contra' | 'Neutral' | 'Mixto';

export interface DebateTopic {
  actor: string;
  id: string;
  stances: Record<Issue, {
    stance: Stance | null;
    gist: string;
    evidence: string;
    source: string;
  }>;
}

export const issues: Issue[] = ['Seguridad Ciudadana', 'Reforma Política', 'Modelo Económico', 'Minería y Medio Ambiente', 'Salud y Educación'];

export const debateData: DebateTopic[] = [
  {
    id: "keiko",
    actor: "Keiko Fujimori",
    stances: {
      'Seguridad Ciudadana': { stance: 'A favor', gist: 'Mano dura, más policías y cárceles.', evidence: 'Propone declarar en emergencia la seguridad y construir cárceles en zonas altas y alejadas. Enfatiza el orden y la autoridad.', source: 'Plan de Gobierno 2021' },
      'Reforma Política': { stance: 'En contra', gist: 'No a la Asamblea Constituyente.', evidence: 'Se opone a un cambio total de la Constitución. Propone reformas puntuales a través del Congreso.', source: 'Declaraciones Públicas' },
      'Modelo Económico': { stance: 'A favor', gist: 'Mantener el modelo de libre mercado.', evidence: 'Defiende la economía social de mercado, la inversión privada y los tratados de libre comercio como motores de crecimiento.', source: 'Plan de Gobierno 2021' },
      'Minería y Medio Ambiente': { stance: 'Mixto', gist: 'Pro-minería con mejor fiscalización.', evidence: 'Apoya la inversión minera pero pide un mayor control ambiental y que los beneficios lleguen a las comunidades.', source: 'Entrevistas' },
      'Salud y Educación': { stance: 'A favor', gist: 'Inversión con participación privada.', evidence: 'Propone mejorar la infraestructura y gestión de hospitales y colegios mediante asociaciones público-privadas (APP).', source: 'Plan de Gobierno 2021' },
    }
  },
  {
    id: "veronika",
    actor: "Verónika Mendoza",
    stances: {
      'Seguridad Ciudadana': { stance: 'Mixto', gist: 'Enfoque preventivo y reforma policial.', evidence: 'Critica la "mano dura". Propone fortalecer la inteligencia, la prevención del delito y una reforma policial con enfoque en derechos humanos.', source: 'Plan de Gobierno JPP' },
      'Reforma Política': { stance: 'A favor', gist: 'Sí a la Asamblea Constituyente.', evidence: 'Es una de las principales promotoras de una nueva Constitución para cambiar el "modelo económico" y fortalecer el rol del Estado.', source: 'Declaraciones Públicas' },
      'Modelo Económico': { stance: 'En contra', gist: 'Cambio de modelo, Estado regulador.', evidence: 'Propone un nuevo modelo económico con un Estado más fuerte, que regule mercados y participe en sectores estratégicos.', source: 'Plan de Gobierno JPP' },
      'Minería y Medio Ambiente': { stance: 'En contra', gist: 'Priorizar agua y medio ambiente.', evidence: 'Propone una moratoria a nuevos proyectos mineros, consulta previa obligatoria y una transición a energías limpias.', source: 'Entrevistas' },
      'Salud y Educación': { stance: 'A favor', gist: 'Fortalecimiento de lo público.', evidence: 'Propone un aumento histórico del presupuesto para salud y educación públicas, con el Estado como único garante.', source: 'Plan de Gobierno JPP' },
    }
  },
  // Add more candidates here...
];
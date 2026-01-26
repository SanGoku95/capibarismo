// Sentencias judiciales de los candidatos

export interface Sentencia {
  delito: string;
  año: string;
  fallo: string;
  organo: string;
}

export const sentencias: Record<string, Sentencia[]> = {
  'lopez-chau': [],
  'ronald-atencio': [],
  'fiorella-molinelli': [],
  'cesar-acuna': [],
  'jose-williams': [],
  'yonhy-lescano': [],
  'alvaro-paz': [],
  'luis-olivera': [],
  'keiko-fujimori': [],
  'wolfgang-grozo': [],
  'roberto-sanchez': [],
  'rafael-belaunde': [],
  'carlos-alvarez': [],
  'pitter-valderrama': [],
  'ricardo-belmont': [],
  'napoleon-becerra': [],
  'jorge-nieto': [],
  'charlie-carrasco': [],
  'alex-gonzales': [],
  'armando-masse': [
    {
      delito: 'CONTRA EL PATRIMONIO',
      año: '2006',
      fallo: 'SOBRESEIDA',
      organo: 'TREINTAISIETEAVO JUZGADO PENAL DE LIMA',
    },
    {
      delito: 'FRAUDE EN LA ADM. DE LAS PERSONAS JURIDICAS',
      año: '2019',
      fallo: 'ABSUELTO',
      organo: 'DECIMO SEGUNDO JUZGADO PENAL DE LIMA',
    },
  ],
  'george-forsyth': [],
  'mesias-guevara': [],
  'herbert-caller': [],
  'alfonso-espa': [],
  'francisco-diez-canseco': [],
  'vladimir-cerron': [
    {
      delito: 'NEGOCIACIÓN INCOMPATIBLE',
      año: '2019',
      fallo: '4 AÑOS DE PENA PRIVATIVA',
      organo: 'SALA PENAL DE APELACIONES TRANSITORIA - SEDE CENTRAL',
    },
    {
      delito: 'COLUSIÓN',
      año: '2023',
      fallo: '3 AÑOS 6 MESES DE PENA PRIVATIVA',
      organo: 'SALA PENAL DE APELACIÓN TRANSITORIA ESPECIALIZADA',
    },
  ],
  'carlos-jaico': [],
  'mario-vizcarra': [
    {
      delito: 'PECULADO',
      año: '2005',
      fallo: 'PENA PRIVATIVA DE LA LIBERTAD',
      organo: 'SALA MIXTA DE MOQUEGUA',
    },
  ],
  'jose-luna': [],
  'maria-perez': [],
  'walter-chirinos': [],
  'paul-jaimes': [],
  'rafael-lopezaliaga': [],
  'antonio-ortiz': [],
  'rosario-fernandez': [],
  'roberto-chiabra': []
};

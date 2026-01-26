export interface CandidateBase {
  id: string;
  nombre: string;
  ideologia?: string;
  partido?: string;
  partyIcon?: string;
}
export const candidates: Record<string, CandidateBase> = {
  'lopez-chau': {
    id: 'lopez-chau',
    nombre: 'Pablo Alfonso Lopez Chau Nava',
    partido: 'Ahora Nacion - An',
    partyIcon: '/iconos_partidos/AhoraNacion-An.jpg',
  },
  'ronald-atencio': {
    id: 'ronald-atencio',
    nombre: 'Ronald Darwin Atencio Sotomayor',
    partido: 'Alianza Electoral Venceremos',
    partyIcon: '/iconos_partidos/AlianzaElectoralVenceremos.jpg',
  },
  'fiorella-molinelli': {
    id: 'fiorella-molinelli',
    nombre: 'Fiorella Giannina Molinelli Aristondo',
    partido: 'Fuerza y Libertad',
    partyIcon: '/iconos_partidos/FuerzayLibertad.jpg',
  },
  'cesar-acuna': {
    id: 'cesar-acuna',
    nombre: 'Cesar Acuña Peralta',
    partido: 'Alianza para el Progreso',
    partyIcon: '/iconos_partidos/AlianzaparaelProgreso.jpg',
  },
  'jose-williams': {
    id: 'jose-williams',
    nombre: 'Jose Daniel Williams Zapata',
    partido: 'Avanza Pais - Partido de Integracion Social',
    partyIcon: '/iconos_partidos/AvanzaPais-PartidodeIntegracionSocial.jpg',
  },
  'yonhy-lescano': {
    id: 'yonhy-lescano',
    nombre: 'Yonhy Lescano Ancieta',
    partido: 'Partido Politico Cooperacion Popular',
    partyIcon: '/iconos_partidos/PartidoPoliticoCooperacionPopular.jpg',
  },
  'alvaro-paz': {
    id: 'alvaro-paz',
    nombre: 'Alvaro Gonzalo Paz de la Barra Freigeiro',
    partido: 'Fe en el Peru',
    partyIcon: '/iconos_partidos/FeenelPeru.jpg',
  },
  'luis-olivera': {
    id: 'luis-olivera',
    nombre: 'Luis Fernando Olivera Vega',
    partido: 'Partido Frente de la Esperanza 2021',
    partyIcon: '/iconos_partidos/PartidoFrentedelaEsperanza2021.jpg',
  },
  'keiko-fujimori': {
    id: 'keiko-fujimori',
    nombre: 'Keiko Sofia Fujimori Higuchi',
    partido: 'Fuerza Popular',
    partyIcon: '/iconos_partidos/FuerzaPopular.jpg',
  },
  'wolfgang-grozo': {
    id: 'wolfgang-grozo',
    nombre: 'Wolfgang Mario Grozo Costa',
    partido: 'Partido Politico Integridad Democratica',
    partyIcon: '/iconos_partidos/PartidoPoliticoIntegridadDemocratica.jpg',
  },
  'roberto-sanchez': {
    id: 'roberto-sanchez',
    nombre: 'Roberto Helbert Sanchez Palomino',
    partido: 'Juntos por el Peru',
    partyIcon: '/iconos_partidos/JuntosporelPeru.jpg',
  },
  'rafael-belaunde': {
    id: 'rafael-belaunde',
    nombre: 'Rafael Jorge Belaunde Llosa',
    partido: 'Libertad Popular',
    partyIcon: '/iconos_partidos/LibertadPopular.jpg',
  },
  'carlos-alvarez': {
    id: 'carlos-alvarez',
    nombre: 'Carlos Gonsalo Alvarez Loayza',
    partido: 'Partido Pais para Todos',
    partyIcon: '/iconos_partidos/PartidoPaisparaTodos.jpg',
  },
  'pitter-valderrama': {
    id: 'pitter-valderrama',
    nombre: 'Pitter Enrique Valderrama Peña',
    partido: 'Partido Aprista Peruano',
    partyIcon: '/iconos_partidos/PartidoApristaPeruano.jpg',
  },
  'ricardo-belmont': {
    id: 'ricardo-belmont',
    nombre: 'Ricardo Pablo Belmont Cassinelli',
    partido: 'Partido Civico Obras',
    partyIcon: '/iconos_partidos/PartidoCivicoObras.jpg',
  },
  'napoleon-becerra': {
    id: 'napoleon-becerra',
    nombre: 'Napoleon Becerra Garcia',
    partido: 'Partido de los Trabajadores y Emprendedores Pte - Peru',
    partyIcon: '/iconos_partidos/PartidodelosTrabajadoresyEmprendedoresPte-Peru.jpg',
  },
  'jorge-nieto': {
    id: 'jorge-nieto',
    nombre: 'Jorge Nieto Montesinos',
    partido: 'Partido del Buen Gobierno',
    partyIcon: '/iconos_partidos/PartidodelBuenGobierno.jpg',
  },
  'charlie-carrasco': {
    id: 'charlie-carrasco',
    nombre: 'Charlie Carrasco Salazar',
    partido: 'Partido Democrata Unido Peru',
    partyIcon: '/iconos_partidos/PartidoDemocrataUnidoPeru.jpg',
  },
  'alex-gonzales': {
    id: 'alex-gonzales',
    nombre: 'Alex Gonzales Castillo',
    partido: 'Partido Democrata Verde',
    partyIcon: '/iconos_partidos/PartidoDemocrataVerde.jpg',
  },
  'armando-masse': {
    id: 'armando-masse',
    nombre: 'Armando Joaquin Masse Fernandez',
    partido: 'Partido Democratico Federal',
    partyIcon: '/iconos_partidos/PartidoDemocraticoFederal.jpg',
  },
  'george-forsyth': {
    id: 'george-forsyth',
    nombre: 'George Patrick Forsyth Sommer',
    partido: 'Partido Democratico Somos Peru',
    partyIcon: '/iconos_partidos/PartidoDemocraticoSomosPeru.jpg',
  },
  'mesias-guevara': {
    id: 'mesias-guevara',
    nombre: 'Mesias Antonio Guevara Amasifuen',
    partido: 'Partido Morado',
    partyIcon: '/iconos_partidos/PartidoMorado.jpg',
  },
  'herbert-caller': {
    id: 'herbert-caller',
    nombre: 'Herbert Caller Gutierrez',
    partido: 'Partido Patriotico del Peru',
    partyIcon: '/iconos_partidos/PartidoPatrioticodel Peru.jpg',
  },
  'alfonso-espa': {
    id: 'alfonso-espa',
    nombre: 'Alfonso Carlos Espa y Garces-alvear',
    partido: 'Partido Sicreo',
    partyIcon: '/iconos_partidos/PartidoSicreo.jpg',
  },
  'francisco-diez-canseco': {
    id: 'francisco-diez-canseco',
    nombre: 'Francisco Ernesto Diez-canseco Távara',
    partido: 'Partido Politico Peru Accion',
    partyIcon: '/iconos_partidos/PartidoPoliticoPeruAccion.jpg',
  },
  'vladimir-cerron': {
    id: 'vladimir-cerron',
    nombre: 'Vladimir Roy Cerron Rojas',
    partido: 'Partido Politico Nacional Peru Libre',
    partyIcon: '/iconos_partidos/PartidoPoliticoNacionalPeruLibre.jpg',
  },
  'carlos-jaico': {
    id: 'carlos-jaico',
    nombre: 'Carlos Ernesto Jaico Carranza',
    partido: 'Peru Moderno',
    partyIcon: '/iconos_partidos/PeruModerno.jpg',
  },
  'mario-vizcarra': {
    id: 'mario-vizcarra',
    nombre: 'Mario Enrique Vizcarra Cornejo',
    partido: 'Partido Politico Peru Primero',
    partyIcon: '/iconos_partidos/PartidoPoliticoPeruPrimero.jpg',
  },
  'jose-luna': {
    id: 'jose-luna',
    nombre: 'Jose Leon Luna Galvez',
    partido: 'Podemos Peru',
    partyIcon: '/iconos_partidos/PodemosPeru.jpg',
  },
  'maria-perez': {
    id: 'maria-perez',
    nombre: 'Maria Soledad Perez Tello de Rodriguez',
    partido: 'Primero la Gente - Comunidad, Ecologia, Libertad y Progreso',
    partyIcon: '/iconos_partidos/PrimerolaGente-Comunidad,Ecologia,LibertadyProgreso.jpg',
  },
  'walter-chirinos': {
    id: 'walter-chirinos',
    nombre: 'Walter Gilmer Chirinos Purizaga',
    partido: 'Partido Politico Prin',
    partyIcon: '/iconos_partidos/PartidoPoliticoPrin.jpg',
  },
  'paul-jaimes': {
    id: 'paul-jaimes',
    nombre: 'Paul Davis Jaimes Blanco',
    partido: 'Progresemos',
    partyIcon: '/iconos_partidos/Progresemos.jpg',
  },
  'rafael-lopezaliaga': {
    id: 'rafael-lopezaliaga',
    nombre: 'Rafael Bernardo López Aliaga Cazorla',
    partido: 'Renovacion Popular',
    partyIcon: '/iconos_partidos/RenovacionPopular.jpg',
  },
  'antonio-ortiz': {
    id: 'antonio-ortiz',
    nombre: 'Antonio Ortiz Villano',
    partido: 'Salvemos Al Peru',
    partyIcon: '/iconos_partidos/SalvemosAlPeru.jpg',
  },
  'rosario-fernandez': {
    id: 'rosario-fernandez',
    nombre: 'Rosario del Pilar Fernandez Bazan',
    partido: 'Un Camino Diferente',
    partyIcon: '/iconos_partidos/UnCaminoDiferente.jpg',
  },
  'roberto-chiabra': {
    id: 'roberto-chiabra',
    nombre: 'Roberto Enrique Chiabra Leon',
    partido: 'Unidad Nacional',
    partyIcon: '/iconos_partidos/UnidadNacional.jpg',
  },
};

export function listCandidates(): CandidateBase[] {
  return Object.values(candidates);
}

export function getCandidateById(id: string): CandidateBase | undefined {
  return candidates[id];
}

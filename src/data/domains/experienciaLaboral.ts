// Experiencia laboral de los candidatos

export interface Trabajo {
  puesto: string;
  empresa: string;
  periodo: string;
  ubicacion: string;
}

export const experienciaLaboral: Record<string, Trabajo[]> = {
  'lopez-chau': [
    {
      puesto: 'Rector',
      empresa: 'Universidad Nacional de Ingeniería',
      periodo: '2021 - 2025',
      ubicacion: 'Rimac, Lima, Peru',
    },
    {
      puesto: 'Director de la Escuela de Ingeniería Económica',
      empresa: 'Universidad Nacional de Ingeniería',
      periodo: '2017 - 2019',
      ubicacion: 'Rimac, Lima, Peru',
    },
    {
      puesto: 'Profesor Principal',
      empresa: 'Universidad Nacional de Ingeniería',
      periodo: '1990 - 2025',
      ubicacion: 'Rimac, Lima, Peru',
    },
  ],
  'ronald-atencio': [
    {
      puesto: 'Asesor 1',
      empresa: 'Congreso de la Republica',
      periodo: '2022 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Docente',
      empresa: 'Universidad Privada del Norte SAC',
      periodo: '2016 - 2016',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Gerente - Docente',
      empresa: 'Centro Jurídico Athena',
      periodo: '2011 - 2022',
      ubicacion: 'Jesus Maria, Lima, Peru',
    },
  ],
  'fiorella-molinelli': [
    {
      puesto: 'Docente',
      empresa: 'Universidad Continental Sociedad Anonima Cerrada',
      periodo: '2024 - 2025',
      ubicacion: 'Los Olivos, Lima, Peru',
    },
    {
      puesto: 'Servicio de Docencia en Centro de Altos Estudios Nacionales - Caen',
      empresa: 'Ministerio de Defensa',
      periodo: '2024 - 2024',
      ubicacion: 'Chorrillos, Lima, Peru',
    },
    {
      puesto: 'Decana (e) de la Facultad de Ciencias Empresariales / Asesora del Consejo Directivo',
      empresa: 'Universidad Señor de Sipan S.a.c.',
      periodo: '2021 - 2022',
      ubicacion: 'Pimentel, Lambayeque, Peru',
    },
    {
      puesto: 'Presidente Ejecutivo',
      empresa: 'Seguro Social de Salud',
      periodo: '2018 - 2021',
      ubicacion: 'Jesus Maria, Lima, Peru',
    },
    {
      puesto: 'Ministra de Desarrollo e Inclusion Social',
      empresa: 'Ministerio de Desarrollo e Inclusion Social',
      periodo: '2017 - 2018',
      ubicacion: 'San Isidro, Lima, Peru',
    },
  ],
  'cesar-acuna': [
    {
      puesto: 'Gobernagor Regional',
      empresa: 'Gobierno Regional de la Libertad',
      periodo: '2023 - 2025',
      ubicacion: 'La Esperanza, La Libertad, Peru',
    },
    {
      puesto: 'Asesor',
      empresa: 'Universidad Cesar Vallejo',
      periodo: '2019 - 2025',
      ubicacion: 'Los Olivos, Lima, Peru',
    },
    {
      puesto: 'Gobernador Regional',
      empresa: 'Gobierno Regional de la Libertad',
      periodo: '2015 - 2015',
      ubicacion: 'La Esperanza, La Libertad, Peru',
    },
    {
      puesto: 'Alcalde',
      empresa: 'Municipalidad Provincial de Trujillo',
      periodo: '2007 - 2014',
      ubicacion: 'Trujillo, La Libertad, Peru',
    },
    {
      puesto: 'Presidente del Directorio',
      empresa: 'Universidad Cesar Vallejo',
      periodo: '1999 - 2019',
      ubicacion: 'Victor Larco Herrera, La Libertad, Peru',
    },
  ],
  'jose-williams': [
    {
      puesto: 'Congresista',
      empresa: 'Congreso de la Republica',
      periodo: '2021 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
  ],
  'yonhy-lescano': [
    {
      puesto: 'Profesor Principal',
      empresa: 'Universidad Antiplano Puno',
      periodo: '2025 - 2025',
      ubicacion: 'Puno, Puno, Peru',
    },
    {
      puesto: 'Asesor',
      empresa: 'Congreso de la Republica',
      periodo: '2021 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
  ],
  'alvaro-paz': [
    {
      puesto: 'Gerente Municipal',
      empresa: 'Municipalidad Distrital Rimac',
      periodo: '2023 - 2023',
      ubicacion: 'Rimac, Lima, Peru',
    },
    {
      puesto: 'Alcalde',
      empresa: 'Municipalidad Distrital la Molina',
      periodo: '2019 - 2022',
      ubicacion: 'La Molina, Lima, Peru',
    },
    {
      puesto: 'Presidente',
      empresa: 'Asociacion de Municpalidades del Perú - Ampe',
      periodo: '2019 - 2022',
      ubicacion: 'La Molina, Lima, Peru',
    },
    {
      puesto: 'Gerente General',
      empresa: 'Pbf Abogados SAC',
      periodo: '2015 - 2018',
      ubicacion: 'La Molina, Lima, Peru',
    },
    {
      puesto: 'Socio Fundador',
      empresa: 'Paz de la Barra Abogados SAC',
      periodo: '2012 - 2018',
      ubicacion: 'La Molina, Lima, Peru',
    },
  ],
  'luis-olivera': [
    {
      puesto: 'Director de Economia y Cooperacion Internacional',
      empresa: 'Asociacion Akuy Ukuku',
      periodo: '2025 - 2025',
      ubicacion: 'Magdalena del Mar, Lima, Peru',
    },
    {
      puesto: 'Presidente',
      empresa: 'Consejo Empresarial del Peru en España',
      periodo: '2008 - 2025',
      ubicacion: 'None, None, Espana',
    },
  ],
  'keiko-fujimori': [
    {
      puesto: 'Presidenta',
      empresa: 'Partido Político Fuerza Popular',
      periodo: '2013 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
  ],
  'wolfgang-grozo': [
    {
      puesto: 'Profesor en Gerencia',
      empresa: 'Universidad de Lima',
      periodo: '2022 - 2025',
      ubicacion: 'Santiago de Surco, Lima, Peru',
    },
  ],
  'roberto-sanchez': [
    {
      puesto: 'Congresista',
      empresa: 'Congreso de la República',
      periodo: '2021 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Ministro',
      empresa: 'Ministerio de Comercio Exterior y Turismo - Mincetur',
      periodo: '2021 - 2022',
      ubicacion: 'San Isidro, Lima, Peru',
    },
    {
      puesto: 'Gerente de Desarrollo Social',
      empresa: 'Municipalidad Provincial de Huaral',
      periodo: '2020 - 2020',
      ubicacion: 'Huaral, Lima, Peru',
    },
    {
      puesto: 'Gerente de la Capital Humano',
      empresa: 'Municipalidad Distrital de San Borja',
      periodo: '2019 - 2020',
      ubicacion: 'San Borja, Lima, Peru',
    },
    {
      puesto: 'Gerente de Administración y Finanzas',
      empresa: 'Municipalidad Provincial de Huaura - Huacho',
      periodo: '2017 - 2017',
      ubicacion: 'Huacho, Lima, Peru',
    },
  ],
  'rafael-belaunde': [
    {
      puesto: 'Gerente General',
      empresa: 'Inmobiliaria Ferymar SAC',
      periodo: '2020 - 2025',
      ubicacion: 'San Isidro, Lima, Peru',
    },
    {
      puesto: 'Ministro',
      empresa: 'Miniterio de Energia y Minas',
      periodo: '2020 - 2020',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Gerente General',
      empresa: 'Remediadora Ambiental SAC',
      periodo: '2015 - 2020',
      ubicacion: 'Lima, Lima, Peru',
    },
  ],
  'carlos-alvarez': [
    {
      puesto: 'Comediante',
      empresa: 'Independiente',
      periodo: '2020 - 2025',
      ubicacion: 'San Isidro, Lima, Peru',
    },
    {
      puesto: 'Comediante',
      empresa: 'Andina de Radio Difusión',
      periodo: '2019 - 2019',
      ubicacion: 'San Isidro, Lima, Peru',
    },
    {
      puesto: 'Comediante',
      empresa: 'Willax SAC',
      periodo: '2018 - 2018',
      ubicacion: 'San Borja, Lima, Peru',
    },
  ],
  'pitter-valderrama': [
    {
      puesto: 'Analista Legal',
      empresa: 'Global Security Law S.a.c',
      periodo: '2023 - 2025',
      ubicacion: 'San Isidro, Lima, Peru',
    },
    {
      puesto: 'Sub Gerente',
      empresa: 'Ps Innova SAC',
      periodo: '2018 - 2023',
      ubicacion: 'El Porvenir, La Libertad, Peru',
    },
    {
      puesto: 'Sub Gerente',
      empresa: 'Contratistas Generales Saalino S.a.c.',
      periodo: '2015 - 2019',
      ubicacion: 'Ventanilla, Callao, Peru',
    },
  ],
  'ricardo-belmont': [
    {
      puesto: 'Empresario',
      empresa: 'Red Bicolor de Comunicaciones S.a.a',
      periodo: '1986 - 2025',
      ubicacion: 'Chorrillos, Lima, Peru',
    },
  ],
  'napoleon-becerra': [
    {
      puesto: 'Empleado',
      empresa: 'Municipalidad de Lima Metropolitana',
      periodo: '1984 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
  ],
  'jorge-nieto': [
    {
      puesto: 'Ministro',
      empresa: 'Ministerio de Defensa',
      periodo: '2016 - 2018',
      ubicacion: 'Jesus Maria, Lima, Peru',
    },
    {
      puesto: 'Ministro',
      empresa: 'Ministerio de Cultura',
      periodo: '2016 - 2016',
      ubicacion: 'San Borja, Lima, Peru',
    },
    {
      puesto: 'Presidente',
      empresa: 'Instituto Internacional para la Cultura Democrática SAC',
      periodo: '2011 - 2014',
      ubicacion: 'Miraflores, Lima, Peru',
    },
  ],
  'charlie-carrasco': [
    {
      puesto: 'Catedratico',
      empresa: 'Universidad Nacional Jose Faustino Sanchez Carrion',
      periodo: '2021 - 2025',
      ubicacion: 'Huacho, Lima, Peru',
    },
  ],
  'alex-gonzales': [
    {
      puesto: 'Presidente',
      empresa: 'Instituto de Estudios Juridicos Derectum',
      periodo: '2023 - 2024',
      ubicacion: 'La Victoria, Lima, Peru',
    },
    {
      puesto: 'Fundador y Presidente del Comite Ejecutivo Nacional',
      empresa: 'Partido Democrata Verde',
      periodo: '2021 - 2025',
      ubicacion: 'La Victoria, Lima, Peru',
    },
    {
      puesto: 'Alcalde Distrital',
      empresa: 'Municipalidad Distrital de San Juan de Lurigancho',
      periodo: '2019 - 2022',
      ubicacion: 'San Juan de Lurigancho, Lima, Peru',
    },
    {
      puesto: 'Presidente',
      empresa: 'Instituto de Ecologia Politica "alternativa Verde"',
      periodo: '2011 - 2014',
      ubicacion: 'La Victoria, Lima, Peru',
    },
    {
      puesto: 'Presidente',
      empresa: 'Instituto de Estudios Juridicos Derectum',
      periodo: '2011 - 2018',
      ubicacion: 'La Victoria, Lima, Peru',
    },
  ],
  'armando-masse': [
    {
      puesto: 'Medico',
      empresa: 'Centro Médico de Guardia',
      periodo: '2016 - 2025',
      ubicacion: 'Santiago de Surco, Lima, Peru',
    },
    {
      puesto: 'Presidente/secretario General',
      empresa: 'Apdayc',
      periodo: '1999 - 2025',
      ubicacion: 'Miraflores, Lima, Peru',
    },
  ],
  'george-forsyth': [
    {
      puesto: 'Gerente General',
      empresa: 'Alhambra Inversiones S.r.l',
      periodo: '2024 - 2025',
      ubicacion: 'Santiago de Surco, Lima, Peru',
    },
    {
      puesto: 'Alcalde Distrital',
      empresa: 'Municipalidad de la Victoria',
      periodo: '2019 - 2020',
      ubicacion: 'La Victoria, Lima, Peru',
    },
    {
      puesto: 'Gerente General',
      empresa: 'Los M SAC',
      periodo: '2017 - 2025',
      ubicacion: 'Santiago de Surco, Lima, Peru',
    },
    {
      puesto: 'Representante de Credito Fiscal',
      empresa: 'Club Alianza Lima',
      periodo: '2012 - 2020',
      ubicacion: 'La Victoria, Lima, Peru',
    },
    {
      puesto: 'Futbolista Profesional',
      empresa: 'Club Alianza Lima',
      periodo: '2008 - 2016',
      ubicacion: 'La Victoria, Lima, Peru',
    },
  ],
  'mesias-guevara': [
    {
      puesto: 'Locador Fag',
      empresa: 'Gobierno Regional Ancash',
      periodo: '2025 - 2025',
      ubicacion: 'Huaraz, Ancash, Peru',
    },
    {
      puesto: 'Consultor Independiente',
      empresa: 'Consultor Independiente',
      periodo: '2023 - 2025',
      ubicacion: 'Santiago de Surco, Lima, Peru',
    },
    {
      puesto: 'Gobernador Regional',
      empresa: 'Gobierno Regional de Cajamarca',
      periodo: '2019 - 2022',
      ubicacion: 'Cajamarca, Cajamarca, Peru',
    },
    {
      puesto: 'Miembro del Consejo Directivo',
      empresa: 'Centro Nacional de Planeamiento Estrategico - Ceplan',
      periodo: '2019 - 2025',
      ubicacion: 'San Isidro, Lima, Peru',
    },
    {
      puesto: 'Congresista',
      empresa: 'Congreso de la Republica',
      periodo: '2011 - 2016',
      ubicacion: 'Lima, Lima, Peru',
    },
  ],
  'herbert-caller': [
    {
      puesto: 'Empresario',
      empresa: 'Caller Colegio Internacional de Super Aprendizaje SAC',
      periodo: '2016 - 2025',
      ubicacion: 'La Molina, Lima, Peru',
    },
    {
      puesto: 'Empresario',
      empresa: 'Caller Language Center SAC',
      periodo: '2015 - 2025',
      ubicacion: 'La Molina, Lima, Peru',
    },
    {
      puesto: 'Oficial Superior',
      empresa: 'Marina de Guerra del Peru',
      periodo: '1996 - 2017',
      ubicacion: 'Callao, Callao, Peru',
    },
  ],
  'alfonso-espa': [
    {
      puesto: 'Director de Comunicaciones',
      empresa: 'Prensa y Cultura Embajada de Estados Unidos',
      periodo: '2008 - 2023',
      ubicacion: 'Santiago de Surco, Lima, Peru',
    },
  ],
  'francisco-diez-canseco': [
    {
      puesto: 'Abogado',
      empresa: 'Independiente',
      periodo: '1981 - 2025',
      ubicacion: 'San Isidro, Lima, Peru',
    },
  ],
  'vladimir-cerron': [
    {
      puesto: 'Secretario General Nacional',
      empresa: 'Partido Politico Nacional Perú Libre',
      periodo: '2025 - 2025',
      ubicacion: 'Brena, Lima, Peru',
    },
    {
      puesto: 'Gobernador Regional',
      empresa: 'Gobierno Regional Junín',
      periodo: '2019 - 2022',
      ubicacion: 'Huancayo, Junin, Peru',
    },
    {
      puesto: 'Docente Auxiliar Nombrado',
      empresa: 'Universidad Nacional del Centro del Perú',
      periodo: '2011 - 2019',
      ubicacion: 'El Tambo, Junin, Peru',
    },
    {
      puesto: 'Presidente Regional',
      empresa: 'Gobierno Regional Junin',
      periodo: '2011 - 2014',
      ubicacion: 'Huancayo, Junin, Peru',
    },
    {
      puesto: 'Medico Neurocirujano Asistente',
      empresa: 'Hospital Nacional Essalud Huancayo',
      periodo: '2003 - 2019',
      ubicacion: 'El Tambo, Junin, Peru',
    },
  ],
  'carlos-jaico': [
    {
      puesto: 'Gerente General',
      empresa: 'Alpaxor S.a.c.',
      periodo: '2024 - 2025',
      ubicacion: 'San Isidro, Lima, Peru',
    },
    {
      puesto: 'Abogado Independiente',
      empresa: 'Carlos Ernesto Jaico Carranza',
      periodo: '2022 - 2025',
      ubicacion: 'San Isidro, Lima, Peru',
    },
    {
      puesto: 'Secretario General',
      empresa: 'Despacho Presidencial',
      periodo: '2021 - 2022',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Asesor Parlamentario',
      empresa: 'Congreso de la Republica del Peru',
      periodo: '2020 - 2021',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Profesor de Catedra',
      empresa: 'Universidad Tecmilenio',
      periodo: '2014 - 2018',
      ubicacion: 'None, None, Mexico',
    },
  ],
  'mario-vizcarra': [
    {
      puesto: 'Gerente Gerente Administrativo',
      empresa: 'Agrotecnica Estuquiña Sa.',
      periodo: '1998 - 2025',
      ubicacion: 'Moquegua, Moquegua, Peru',
    },
    {
      puesto: 'Gerente Administrativo',
      empresa: 'Cym Vizcarra SAC',
      periodo: '1993 - 2017',
      ubicacion: 'Moquegua, Moquegua, Peru',
    },
  ],
  'jose-luna': [
    {
      puesto: 'Asesor',
      empresa: 'Sabio Antunez de Mayolo E.i.r.l.',
      periodo: '2023 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Congresista',
      empresa: 'Congreso de la Republica',
      periodo: '2021 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Asesor',
      empresa: 'Universidad Privada Telesup S.a.c.',
      periodo: '2020 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Asesor',
      empresa: 'Nstituto Superior Tecnologico Privado Intur Peru Instituto Internacional de Turismo E.i.r.l',
      periodo: '2011 - 2025',
      ubicacion: 'San Isidro, Lima, Peru',
    },
  ],
  'maria-perez': [
    {
      puesto: 'Ministra de Justicia',
      empresa: 'Ministerio de Justicia y Derechos Humanos',
      periodo: '2016 - 2017',
      ubicacion: 'Miraflores, Lima, Peru',
    },
    {
      puesto: 'Congresista',
      empresa: 'Congreso de la Republica',
      periodo: '2011 - 2016',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Notaria',
      empresa: 'Notaria Perez Tello',
      periodo: '1999 - 2025',
      ubicacion: 'Santiago de Surco, Lima, Peru',
    },
    {
      puesto: 'Docente Facultad de Derecho',
      empresa: 'Universidad San Martin de Porres',
      periodo: '1996 - 2020',
      ubicacion: 'La Molina, Lima, Peru',
    },
  ],
  'walter-chirinos': [
    {
      puesto: 'Director General de Gobierno del Interior',
      empresa: 'Ministerio del Interior',
      periodo: '2018 - 2018',
      ubicacion: 'Lima, Lima, Peru',
    },
  ],
  'paul-jaimes': [
    {
      puesto: 'Asesor I',
      empresa: 'Congreso de la República',
      periodo: '2022 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
  ],
  'rafael-lopezaliaga': [
    {
      puesto: 'Alcalde',
      empresa: 'Municipalidad Metropolitana de Lima',
      periodo: '2023 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Catedrático',
      empresa: 'Universidad Nacional de Ingeniería',
      periodo: '2017 - 2020',
      ubicacion: 'Rimac, Lima, Peru',
    },
    {
      puesto: 'Director',
      empresa: 'Perurail S.a.',
      periodo: '1999 - 2022',
      ubicacion: 'Miraflores, Lima, Peru',
    },
    {
      puesto: 'Director',
      empresa: 'Ferrocarril Trasandino S.a.',
      periodo: '1999 - 2022',
      ubicacion: 'Miraflores, Lima, Peru',
    },
    {
      puesto: 'Director',
      empresa: 'Peru Belmond Hotels S.a.',
      periodo: '1990 - 2022',
      ubicacion: 'Miraflores, Lima, Peru',
    },
  ],
  'antonio-ortiz': [
    {
      puesto: 'Gerente General',
      empresa: 'Tonsan del Peru S.a.',
      periodo: '2010 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Gerente General',
      empresa: 'Kmk Hidraulica y Servicios S.a',
      periodo: '2005 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
    {
      puesto: 'Gerente General',
      empresa: 'Mportadora y Distribuidora de Retenes Rodamientos y Afines (idre) S.a',
      periodo: '1999 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
  ],
  'rosario-fernandez': [
    {
      puesto: 'Docente',
      empresa: 'Iep Jan Komesky',
      periodo: '2005 - 2025',
      ubicacion: 'Trujillo, La Libertad, Peru',
    },
  ],
  'roberto-chiabra': [
    {
      puesto: 'Congresista',
      empresa: 'Congreso de la Republica',
      periodo: '2021 - 2025',
      ubicacion: 'Lima, Lima, Peru',
    },
  ]
};

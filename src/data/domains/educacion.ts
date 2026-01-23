// Información educativa de los candidatos

export interface Educacion {
  basica: { primaria: string; secundaria: string };
  universitaria: Array<{ universidad: string; carrera: string; año: string }>;
  postgrado: Array<{ tipo: string; institucion: string; especialidad: string; año: string }>;
}

export const educacion: Record<string, Educacion> = {
  'lopez-chau': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Nacional del Callao', carrera: 'Economista', año: 'None' },
      { universidad: 'Universidad Nacional del Callao', carrera: 'Bachiller en Ciencias Economicas', año: '1976' },
    ],
    postgrado: [
      { tipo: 'Doctorado', institucion: 'Universidad Nacional Autónoma de México', especialidad: 'Grado de Doctor en Economía', año: '2005' },
      { tipo: 'Maestría', institucion: 'Universidad Nacional Autónoma de México', especialidad: 'Grado de Maestro en Economía', año: '2002' },
    ],
  },
  'ronald-atencio': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Abogado', año: '2006' },
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Bachiller en Derecho y Ciencia Politica', año: '2006' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Pontificia Universidad Católica del Perú', especialidad: 'Maestro en Derecho Penal', año: '2024' },
    ],
  },
  'fiorella-molinelli': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Pontificia Universidad Católica del Perú', carrera: 'Bachiller en Ciencias Sociales Con Mencion en Economia', año: 'None' },
      { universidad: 'Pontificia Universidad Católica del Perú', carrera: 'Licenciado en Economía', año: '2008' },
    ],
    postgrado: [
      { tipo: 'Doctorado', institucion: 'Universidad de San Martín de Porres', especialidad: 'Doctora en Gobierno y Politica Publica', año: '2012' },
    ],
  },
  'cesar-acuna': {
    basica: { primaria: 'No', secundaria: 'No' },
    universitaria: [
      { universidad: 'Universidad Nacional de Trujillo', carrera: 'Bachiller en Ingenieria Quimica', año: 'None' },
      { universidad: 'Universidad Nacional de Trujillo', carrera: 'Ingeniero Quimico', año: '1995' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Universidad de Lima', especialidad: 'Maestro en Administracion de la Educacion', año: '1997' },
      { tipo: 'Maestría', institucion: 'Universidad de los Andes', especialidad: 'Diploma de Magister en Dirección Universitaria', año: '1998' },
      { tipo: 'Doctorado', institucion: 'Universidad Complutense de Madrid', especialidad: 'Título de Doctor por la Universidad Complutense de Madrid', año: '2013' },
    ],
  },
  'jose-williams': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Escuela Militar de Chorrillos “coronel Francisco Bolognesi”', carrera: 'Bachiller en Ciencias Militares', año: '2009' },
      { universidad: 'Escuela Militar de Chorrillos “coronel Francisco Bolognesi”', carrera: 'Licenciado en Ciencias Militares', año: '2009' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Centro de Altos Estudios Nacionales - Caen', especialidad: 'Magister en Desarrollo y Defensa Nacional', año: '2011' },
    ],
  },
  'yonhy-lescano': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Católica de Santa María', carrera: 'Bachiller en Derecho', año: '1999' },
      { universidad: 'Universidad Católica de Santa María', carrera: 'Abogado', año: '1999' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Universidad de Chile', especialidad: 'Grado de Magíster en Derecho (grado de Maestro)', año: '2022' },
    ],
  },
  'alvaro-paz': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Bachiller en Derecho', año: '2007' },
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Abogado', año: '2008' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Eucim Business School', especialidad: 'Magister en Gestión Pública', año: '2023' },
      { tipo: 'Doctorado', institucion: 'Universidad Nacional Mayor de San Marcos', especialidad: 'Maestria en Derecho Constitucional y Derechos Humanos', año: 'None' },
    ],
  },
  'luis-olivera': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad del Pacífico', carrera: 'Bachiller en Ciencias Con Mencion en Administracion', año: 'None' },
    ],
    postgrado: [
    ],
  },
  'keiko-fujimori': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Boston University', carrera: 'Grado de Licenciada en Administración de Empresas (grado de Bachiller y Título Profesional)', año: '2025' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Columbia University', especialidad: 'Título de Máster en Administración de Empresas (grado de Maestro)', año: '2024' },
    ],
  },
  'wolfgang-grozo': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Escuela de Oficiales de la Fuerza Aérea del Perú', carrera: 'Bachiller en Ciencias de la Administracion Aeroespacial', año: '2010' },
      { universidad: 'Escuela de Oficiales de la Fuerza Aérea del Perú', carrera: 'Licenciado en Ciencias de la Administracion Aeroespacial', año: '2012' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Centro de Altos Estudios Nacionales - Caen', especialidad: 'Maestro en Desarrollo y Defensa Nacional', año: '2018' },
      { tipo: 'Doctorado', institucion: 'Centro de Altos Estudios Nacionales - Caen', especialidad: 'Doctor en Desarrollo y Seguridad Estrategica', año: '2020' },
    ],
  },
  'roberto-sanchez': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Nacional Mayor de San Marcos', carrera: 'Psicologo', año: '2000' },
      { universidad: 'Universidad Nacional Mayor de San Marcos', carrera: 'Bachiller en Psicologia', año: '1998' },
    ],
    postgrado: [
      { tipo: 'Doctorado', institucion: 'Pontificia Universidad Catolica del Perú - PUCP', especialidad: 'Maestria de Politicas Socilaes', año: 'None' },
    ],
  },
  'rafael-belaunde': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad de Lima', carrera: 'Bachiller en Economia', año: 'None' },
    ],
    postgrado: [
    ],
  },
  'carlos-alvarez': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
    ],
    postgrado: [
    ],
  },
  'pitter-valderrama': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Bachiller en Derecho', año: '2022' },
    ],
    postgrado: [
      { tipo: 'Doctorado', institucion: 'Universidad de la Rioja', especialidad: 'Maestría', año: 'None' },
    ],
  },
  'ricardo-belmont': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad de Lima', carrera: 'Bachiyer Administrador de Empresas', año: '1977' },
    ],
    postgrado: [
    ],
  },
  'napoleon-becerra': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Inca Garcilaso de la Vega Asociación Civil', carrera: 'Licenciado en Administracion', año: '2009' },
      { universidad: 'Universidad Inca Garcilaso de la Vega Asociación Civil', carrera: 'Bachiller en Ciencias Administrativas', año: 'None' },
    ],
    postgrado: [
    ],
  },
  'jorge-nieto': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Pontificia Universidad Católica del Perú', carrera: 'Bachiller en Ciencias Sociales Con Mencion en Sociologia', año: 'None' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Facultad Latinoamericana de Ciencias Sociales', especialidad: 'Maestría en Ciencias Sociales Con Mención en Sociologia.', año: '1984' },
    ],
  },
  'charlie-carrasco': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Tecnológica de los Andes', carrera: 'Bachiller en Derecho', año: '2007' },
      { universidad: 'Universidad Tecnológica de los Andes', carrera: 'Abogado', año: '2009' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Universidad Nacional Federico Villarreal', especialidad: 'Maestro en Derecho Constitucional', año: '2011' },
      { tipo: 'Doctorado', institucion: 'Universidad Nacional Federico Villarreal', especialidad: 'Doctor en Derecho', año: '2012' },
      { tipo: 'Maestría', institucion: 'Universidad de San Martín de Porres', especialidad: 'Maestro en Gestión Pública', año: '2023' },
    ],
  },
  'alex-gonzales': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Inca Garcilaso de la Vega', carrera: 'Administracion', año: 'None' },
    ],
    postgrado: [
    ],
  },
  'armando-masse': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Inca Garcilaso de la Vega Asociación Civil', carrera: 'Abogado', año: '2007' },
      { universidad: 'Universidad Inca Garcilaso de la Vega Asociación Civil', carrera: 'Bachiller en Derecho y Ciencias Politicas', año: '2006' },
      { universidad: 'Universidad Nacional Mayor de San Marcos', carrera: 'Médico Cirujano', año: '1988' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Pontificia Universidad Católica del Perú', especialidad: 'Magister en Administracion Estrategica de Empresas', año: 'None' },
      { tipo: 'Doctorado', institucion: 'Pontificia Universidad Católica del Perú', especialidad: 'Maestria en Propiedad Intelectual y Competencia', año: 'None' },
      { tipo: 'Doctorado', institucion: 'Universidad Europea de Madrid', especialidad: 'Magister Derecho Digital Tecnológico', año: 'None' },
    ],
  },
  'george-forsyth': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Peruana de Ciencias Aplicadas S.a.c.', carrera: 'Bachiller en Administración de Empresas', año: '2021' },
      { universidad: 'Universidad de San Martin de Porres', carrera: 'No Concluido', año: 'None' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Universidad del Pacífico', especialidad: 'Magíster en Administración', año: '2023' },
    ],
  },
  'mesias-guevara': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Ricardo Palma', carrera: 'Bachiller en Ingenieria Electronica', año: '1988' },
      { universidad: 'Universidad Ricardo Palma', carrera: 'Ingeniero Electronico', año: '1990' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Universidad Peruana de Ciencias Aplicadas S.a.c.', especialidad: 'Magister en Administracion de Empresas', año: '2001' },
    ],
  },
  'herbert-caller': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Nacional de Ingeniería', carrera: 'Bachiller en Ciencias', año: '2010' },
      { universidad: 'Universidad Alas Peruanas S.a.', carrera: 'Bachiller en Derecho', año: '2016' },
      { universidad: 'Universidad Alas Peruanas S.a.', carrera: 'Abogado', año: '2025' },
      { universidad: 'Escuela Naval del Perú', carrera: 'Bachiller en Ciencias Marítimo Navales', año: '2025' },
    ],
    postgrado: [
      { tipo: 'Doctorado', institucion: 'Instituto Nacional de Investigacion y Capacitacion de Telecomunicaciones - Inictel', especialidad: 'Post Grado', año: 'None' },
    ],
  },
  'alfonso-espa': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Pontificia Universidad Católica del Perú', carrera: 'Bachiller en Derecho', año: '1987' },
      { universidad: 'Pontificia Universidad Católica del Perú', carrera: 'Abogado', año: '1987' },
    ],
    postgrado: [
    ],
  },
  'francisco-diez-canseco': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Nacional Mayor de San Marcos', carrera: 'Abogado', año: '1972' },
    ],
    postgrado: [
    ],
  },
  'vladimir-cerron': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Instituto Superior de Ciencias Médicas de Camaguey', carrera: 'Título de Especialista de Primer Grado en Neurocirugía', año: '2002' },
      { universidad: 'Instituto Superior de Ciencias Médicas de Camaguey', carrera: 'Título de Doctor en Medicina', año: '1997' },
    ],
    postgrado: [
      { tipo: 'Doctorado', institucion: 'Universidad Nacional Mayor de San Marcos', especialidad: 'Doctor en Medicina', año: '2010' },
      { tipo: 'Maestría', institucion: 'Universidad Nacional Mayor de San Marcos', especialidad: 'Magister en Neurociencias', año: '2009' },
    ],
  },
  'carlos-jaico': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Abogado', año: '2021' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'University Of Fribourg', especialidad: 'Grado de Licenciado en Derecho (máster en Derecho) (grado de Maestro)', año: '2018' },
    ],
  },
  'mario-vizcarra': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Nacional de Ingenieria', carrera: 'Ingenieria Industrial', año: '1978' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Universidad Esan', especialidad: 'Magister en Administracion', año: '2003' },
    ],
  },
  'jose-luna': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Economista', año: '2000' },
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Bachiller en Ciencias Economicas', año: '2000' },
    ],
    postgrado: [
      { tipo: 'Doctorado', institucion: 'Universidad de San Martín de Porres', especialidad: 'Doctor en Educacion', año: '2005' },
      { tipo: 'Maestría', institucion: 'Universidad de San Martín de Porres', especialidad: 'Maestro en Economia Mencion en Comercio y Finanzas Internacionales', año: '2004' },
    ],
  },
  'maria-perez': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Abogado', año: '1995' },
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Bachiller en Derecho', año: '1995' },
    ],
    postgrado: [
      { tipo: 'Doctorado', institucion: 'Pontificia Universidad Catolica del Peru', especialidad: 'Maestria en Derecho Constitucional', año: 'None' },
    ],
  },
  'walter-chirinos': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Privada Telesup S.a.c.', carrera: 'Contador Público', año: '2016' },
      { universidad: 'Universidad Privada Telesup S.a.c.', carrera: 'Bachiller en Contabilidad y Finanzas', año: '2013' },
    ],
    postgrado: [
      { tipo: 'Doctorado', institucion: 'Universidad Nacional Enrique Guzman y Valle', especialidad: 'Maestria en Gestion Publica', año: 'None' },
    ],
  },
  'paul-jaimes': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Bachiller en Derecho y Ciencia Politica', año: '2004' },
      { universidad: 'Universidad de San Martín de Porres', carrera: 'Abogado', año: '2009' },
    ],
    postgrado: [
      { tipo: 'Doctorado', institucion: 'Instituto de Gobierno y Gestión Publica Universidad San Martin de Porres', especialidad: 'Gobierno y Gestión Publica', año: 'None' },
    ],
  },
  'rafael-lopezaliaga': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad de Piura', carrera: 'Ingeniero Industrial', año: '1995' },
      { universidad: 'Universidad de Piura', carrera: 'Bachiller en Ciencias de la Ingenieria', año: 'None' },
    ],
    postgrado: [
      { tipo: 'Maestría', institucion: 'Universidad del Pacífico', especialidad: 'Magister en Administracion', año: 'None' },
    ],
  },
  'antonio-ortiz': {
    basica: { primaria: 'Sí', secundaria: 'No' },
    universitaria: [
    ],
    postgrado: [
    ],
  },
  'rosario-fernandez': {
    basica: { primaria: 'Sí', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Universidad Privada César Vallejo', carrera: 'Bachiller en Educacion', año: '2001' },
    ],
    postgrado: [
    ],
  },
  'roberto-chiabra': {
    basica: { primaria: 'No', secundaria: 'Sí' },
    universitaria: [
      { universidad: 'Escuela Militar de Chorrillos “coronel Francisco Bolognesi”', carrera: 'Bachiller en Ciencias Militares', año: '2012' },
      { universidad: 'Escuela Militar de Chorrillos “coronel Francisco Bolognesi”', carrera: 'Licenciado en Ciencias Militares', año: '2012' },
    ],
    postgrado: [
    ],
  }
};

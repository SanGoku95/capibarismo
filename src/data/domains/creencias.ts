import type { Creencia } from '../types';

export const creencias: Record<string, Creencia[]> = {
  keiko: [
    {
      id: "liberalismo-economico-defensivo",
      nombre: "Liberalismo Pro-Mercado",
      resumen:
        "Defensa pragmática de la Constitución del 93, matizada con populismo fiscal para fines electorales.",
      detalle:
        "El núcleo de su proyecto es la defensa del capítulo económico de la Constitución de 1993, considerándola la base de la prosperidad peruana. Propone medidas para profundizar el modelo, como la simplificación tributaria, y se posiciona como un 'muro de contención' contra propuestas de cambio de modelo económico. Este liberalismo es pragmático, ya que incorpora promesas de alto gasto fiscal, como bonos o aumento del sueldo mínimo, por consideraciones electorales.",
      fuente: "https://semanaeconomica.com/economia-finanzas/macroeconomia/elecciones-2021-las-claves-del-plan-economico-de-keiko-fujimori",
    },
    {
      id: "conservadurismo-punitivo",
      nombre: "Conservadurismo Punitivo",
      resumen:
        "Prioriza el orden y la 'mano dura' contra el crimen; rechaza propuestas enfocadas en derechos de las minorías.",
      detalle:
        "Mientras defiende la libertad de mercado, mantiene una agenda social profundamente conservadora, oponiéndose a la expansión de derechos para minorías LGTBQ+ y a la despenalización del aborto en defensa de la 'familia tradicional'. El pilar de su discurso social es la seguridad ciudadana desde una perspectiva de 'mano dura', buscando restablecer el 'principio de autoridad' y estableciendo un paralelismo entre la derrota del terrorismo en los 90 y su promesa de derrotar la delincuencia común.",
      fuente: "https://www.youtube.com/watch?v=p7m1T-ptrXA",
    },
    {
      id: "institucionalismo-pragmatico",
      nombre: "Institucionalismo Pragmático",
      resumen:
        "Busca influir en el marco institucional de acuerdo a su agenda, no busca desmantelarlo.",
      detalle:
        "Se presenta como defensora del marco institucional vigente, rechazando una Asamblea Constituyente para proteger la Constitución de 1993. Sin embargo, su praxis política es personalista y confrontacional, atacando a instituciones del sistema de justicia que la han investigado. Su 'institucionalismo' no se basa en principios democráticos abstractos, sino en la conveniencia estratégica: defiende el orden cuando le es funcional y lo ataca cuando lo percibe como una amenaza.",
      fuente: "https://www.youtube.com/watch?v=G7UGSv9emS0",
    },
  ],
    rafael: [
    {
      id: "conservadurismo-religioso",
      nombre: "Agenda Social Conservadora",
      resumen:
        "Su plataforma se basa en un conservadurismo social explícito, fundamentado en sus convicciones religiosas como miembro del Opus Dei.",
      detalle:
        "Se manifiesta en su oposición al 'enfoque de género' en la educación pública y a políticas sobre identidad sexual. Utiliza su fe como un pilar central de su identidad política para promover una agenda de valores tradicionales.",
      fuente: "https://declara.jne.gob.pe/ASSETS/PLANGOBIERNO/FILEPLANGOBIERNO/16482.pdf",
    },
    {
      id: "perfil-gerencial",
      nombre: "Visión Gerencial en la Gestión Pública",
      resumen:
        "Se presenta como un gestor del sector privado capaz de aplicar un modelo de eficiencia empresarial en la administración pública.",
      detalle:
        "Utiliza su trayectoria como fundador de un conglomerado de empresas (Grupo Acres, PeruRail) para sustentar su promesa de transformar Lima en una 'potencia mundial' a través de una gestión basada en resultados.",
      fuente: "https://www.youtube.com/watch?v=HV0qljMG2Wk&t=5s",
    },
  ],
  yonhy: [
    {
      id: "economia-social-regulada",
      nombre: "Economía Social de Mercado Regulada",
      resumen:
        "Acepta el mercado pero con un Estado fuerte que combata monopolios, regule precios y proteja a la industria nacional.",
      detalle:
        "Busca implementar una 'real economía social de mercado', lo que se traduce en una agenda para combatir activamente monopolios y oligopolios, y regular precios en sectores clave para evitar abusos. Propone 'desglobalizar la economía', fortaleciendo el aparato productivo nacional y protegiendo a las MYPES con crédito barato. Su creencia es que el mercado, sin control, genera desigualdades que solo un Estado regulador fuerte puede corregir.",
      fuente: "https://declara.jne.gob.pe/ASSETS/PLANGOBIERNO/FILEPLANGOBIERNO/16511.pdf",
    },
    {
      id: "centro-liberal-moderado",
      nombre: "Centro Liberal Moderado",
      resumen:
        "Enfocado en la justicia social pero moderado en temas de derechos de las minorías.",
      detalle:
        "No es un abanderado de las causas más progresistas y su plan de gobierno mantenía una concepción tradicional de la familia. Sin embargo, su plan incluía políticas para mitigar la violencia contra la mujer y ha reconocido la necesidad de regular la unión patrimonial de parejas del mismo sexo, aunque sin equipararla al matrimonio. Prioriza la justicia social a través de políticas públicas universales en salud y educación.",
      fuente: "https://declara.jne.gob.pe/ASSETS/PLANGOBIERNO/FILEPLANGOBIERNO/16511.pdf",
    },
    {
      id: "institucionalismo-reformista",
      nombre: "Institucionalismo Reformista",
      resumen:
        "Busca reformas profundas, incluyendo un sistema confederal, pero sin cambio de Constitución.",
      detalle:
        "A pesar de un discurso crítico contra la clase política, su creencia fundamental es que los cambios deben procesarse dentro del marco legal. Su crítica no es al sistema democrático, sino a la corrupción de los actores. Incluso su propuesta más radical, un 'sistema confederativo' con autonomía para las regiones, la enmarca como una reforma estructural del Estado que debe ser aprobada por las vías institucionales, buscando perfeccionar la democracia, no destruirla.",
      fuente: "https://www.youtube.com/watch?v=mL-osKOQ21Y",
    },
  ],
  antauro: [
    {
      id: "estatismo-radical",
      nombre: "Estatismo Radical",
      resumen:
        "Ruptura total con el mercado. Propone la expropiación y nacionalización de los sectores estratégicos de la economía.",
      detalle:
        "Inspirado en el gobierno militar de Juan Velasco Alvarado, su proyecto plantea explícitamente una 'fuerte economía 'peruanizada' a través de expropiaciones y nacionalizaciones' de sectores como la minería y los hidrocarburos. Su discurso es vehementemente antiliberal y anticapitalista, proponiendo la completa aniquilación del modelo de mercado y su sustitución por un sistema donde el Estado es el único actor relevante.",
      fuente: "https://www.youtube.com/watch?v=bOxifrWM1h0",
    },
    {
      id: "ultraconservadurismo-autoritario",
      nombre: "Ultraconservadurismo Autoritario",
      resumen:
        "Impone el orden y la supremacía racial. Es abiertamente homófobo y xenófobo.",
      detalle:
        "El núcleo de su ideología etnocacerista es explícitamente racista, basándose en la supuesta supremacía de la 'raza cobriza' (andina) y la exclusión de otras minorías. Es abiertamente homofóbico y xenófobo, y ha propuesto públicamente el fusilamiento de sus rivales políticos. Su visión desprecia por completo las libertades civiles y los derechos humanos, promoviendo un orden social militarizado y racialmente excluyente.",
      fuente: "https://www.youtube.com/watch?v=ox4vL808Ba4",
    },
    {
      id: "totalitarismo-antisistema",
      nombre: "Totalitarismo Antisistema",
      resumen:
        "Busca la demolición de la estructura estatal actual para reemplazarlo por un régimen de base étnica.",
      detalle:
        "Su carrera política se ha construido a través de actos de violencia directa contra el Estado, como el levantamiento del 'Andahuaylazo'. Su objetivo declarado no es reformar las instituciones, sino demolerlas, afirmando su intención de 'tirarse legalmente todo el Estado de derecho'. Desprecia la democracia liberal y su proyecto implica la aniquilación del orden constitucional para reemplazarlo por un régimen autoritario de base étnica.",
      fuente: "http://www.desco.org.pe/recursos/sites/indice/58/261.pdf",
    },
  ],
  "martin-vizcarra": [
    {
      id: "centro-derecha-pro-inversion",
      nombre: "Centro-Derecha Pro-Inversión",
      resumen:
        "Mantiene el modelo de mercado pero con un Estado regulador.",
      detalle:
        "Durante su mandato, mantuvo los pilares de estabilidad macroeconómica y promoción de la inversión privada, pero con un esfuerzo por fortalecer la capacidad regulatoria del Estado. Impulsó la 'ley antielusiva' contra la evasión fiscal y la 'Ley de Control Previo a las Concentraciones Económicas' para prevenir monopolios. Su perfil es el de un gestor tecnocrático que cree en la economía de mercado, pero con un Estado robusto que garantice la competencia leal y la justicia fiscal.",
      fuente: "https://www.gob.pe/institucion/presidencia/noticias/50420-presidente-vizcarra-anuncia-52-proyectos-de-infraestructura-para-potenciar-el-crecimiento-la-competitividad-y-el-desarrollo-del-pais",
    },
    {
      id: "centro-liberal-moderado",
      nombre: "Centro Liberal Moderado",
      resumen:
        "Defiende la inclusión social y la igualdad de género.",
      detalle:
        "Su gobierno se alineó con una agenda social modernizadora. Uno de sus frentes más notorios fue la defensa del enfoque de género en la currícula educativa, enfrentándose a grupos conservadores. Su discurso se centró en la 'inclusión social' y la lucha contra la violencia hacia la mujer. Su visión era la de un Estado que debe activamente cerrar brechas y proteger a las poblaciones vulnerables.",
      fuente: "https://wayka.pe/enfoque-de-genero-para-vizcarra-padres-y-docentes-por-amanda-meza/",
    },
    {
      id: "institucionalismo-reformista-extremo",
      nombre: "Institucionalismo Reformista",
      resumen:
        "Impulsa reformas institucionales, dispuesto a forzar los límites constitucionales para lograrlas.",
      detalle:
        "Su principal bandera fue una ambiciosa reforma política y judicial contra la corrupción sistémica, impulsando la creación de la JNJ y un referéndum para la no reelección de congresistas. Ante el bloqueo parlamentario, recurrió a la medida constitucional extrema de la disolución del Congreso en 2019. Su creencia parece ser que las instituciones deben ser reformadas, pero si se vuelven un obstáculo, es legítimo forzar las reglas del juego para superar el bloqueo.",
      fuente: "https://www.youtube.com/watch?v=rYO122Qs1fE",
    },
  ],
  "guillermo-bermejo": [
    {
      id: "izquierda-intervencionista",
      nombre: "Izquierda Intervencionista",
      resumen:
        "El Estado debe asumir un rol protagónico en la industrialización y controlar los recursos naturales.",
      detalle:
        "Propone una reforma constitucional para eliminar el principio de subsidiariedad estatal y permitir que el Estado asuma un rol protagónico y empresarial en la industrialización. Ha planteado que de las ganancias generadas por las inversiones, el 80% debería quedarse para el Estado peruano. Su creencia es que solo un Estado empresario, que controle los sectores estratégicos, puede garantizar la soberanía económica y una distribución más justa de la riqueza.",
      fuente: "https://www.youtube.com/watch?v=PMm960A6ZHA",
    },
    {
      id: "progresismo-social",
      nombre: "Progresismo Social",
      resumen:
        "La lucha por la justicia social incluye la defensa de los derechos de minorías, pueblos originarios y el medio ambiente.",
      detalle:
        "Su militancia de izquierda se origina en una oposición al racismo, el machismo y las violaciones de los derechos humanos. Su visión enmarca la agenda de derechos civiles dentro de una lucha más amplia por la justicia social y la reivindicación de los sectores históricamente excluidos. Su trabajo parlamentario se ha enfocado en la Comisión de Pueblos Andinos y en la problemática de los conflictos socioambientales.",
      fuente: "https://www.youtube.com/watch?v=PMm960A6ZHA",
    },
    {
      id: "populismo-antisistema-refundacional",
      nombre: "Populismo Antisistema Refundacional",
      resumen:
        "Propone que el sistema actual debe ser reemplazado por completo a través de una Asamblea Constituyente.",
      detalle:
        "Su creencia más definitoria es la necesidad imperativa de convocar a una Asamblea Constituyente. Para él, la Constitución de 1993 no es un marco a reformar, sino el pilar de un sistema neoliberal ilegítimo que debe ser reemplazado en su totalidad. Su objetivo no es participar en el sistema para mejorarlo, sino liderar un proceso de ruptura que permita su refundación completa.",
      fuente: "https://www.youtube.com/watch?v=idwJ4xaDfZE",
    },
  ],
  "carlos-alvarez": [
    {
      id: "centro-derecha-pro-inversion",
      nombre: "Centro-Derecha Pro-Inversión",
      resumen:
        "Enfoque pragmático que favorece la inversión privada como generadora de empleo.",
      detalle:
        "Rechaza las etiquetas ideológicas, prefiriendo definirse como un candidato de 'sentido común'. Manifiesta un claro apoyo a la inversión privada como el principal motor para la creación de empleo. Sin embargo, no es un liberal dogmático, ya que ha mencionado la posibilidad de mantener 'empresas públicas rentables', demostrando un enfoque que prioriza la eficiencia sobre la ideología.",
      fuente: "https://www.youtube.com/watch?v=3DJZs5LhafQ",
    },
    {
      id: "conservadurismo-punitivo-bukele",
      nombre: "Conservadurismo Punitivo",
      resumen:
        "Plataforma de 'mano dura' contra el crimen, proponiendo la pena de muerte.",
      detalle:
        "Esta es la creencia central de su plataforma. Su propuesta más notoria es la implementación de la pena de muerte para delitos graves. Su modelo de referencia explícito es el del presidente Nayib Bukele en El Salvador, elogiando sus métodos de represión. Su creencia es que los derechos humanos de los criminales no pueden prevalecer sobre la seguridad de los ciudadanos.",
      fuente: "https://www.youtube.com/watch?v=lyNkd_EtUsU",
    },
    {
      id: "populismo-outsider-disruptivo",
      nombre: "Populismo Outsider Disruptivo",
      resumen:
        "Se presenta como un outsider que busca reformar el sistema para hacerlo más punitivo, descalificando a la clase política.",
      detalle:
        "Encarna el arquetipo del outsider que desafía a la élite tradicional. Su discurso se construye sobre la descalificación del sistema político, describiendo a sus actores como una 'clase política vergonzosa'. Su propuesta de reforma constitucional no busca fortalecer los contrapesos, sino instrumentalizarla para servir a su agenda punitiva.",
      fuente: "https://m.youtube.com/watch?v=Qyhcr_mRBr4&pp=0gcJCa0JAYcqIYzv",
    },
  ],
  "cesar-acuna": [
    {
      id: "populismo-fiscal-clientelar",
      nombre: "Centro-Derecha Pro-Inversión",
      resumen:
        "Apoyo formal al mercado, pero en la práctica utiliza la economía como herramienta de populismo fiscal y clientelismo.",
      detalle:
        "Formalmente, su ideario se alinea con el centro-derecha, promoviendo la inversión privada. Sin embargo, su praxis abraza un populismo fiscal extremo, con promesas de gasto público masivo como un 'bono COVID' de S/600 mensuales o la compra de deudas de peruanos por parte del Estado. Su creencia fundamental no reside en un modelo económico, sino en el uso de la política económica como herramienta para captar votos.",
      fuente: "https://www.youtube.com/watch?v=BNdr8ceoqwE",
    },
    {
      id: "centro-conservador-pragmatico",
      nombre: "Centro Conservador Pragmático",
      resumen:
        "Discurso centrado en la educación y el emprendimiento, con posturas de 'mano dura' en seguridad.",
      detalle:
        "Su discurso social se construye alrededor de su biografía como 'emprendedor que salió de abajo'. La solución que ofrece es la educación como herramienta de movilidad social. En seguridad, su postura es de 'mano dura', proponiendo contratar reservistas para patrullar las calles. En temas valóricos, su partido opera con pragmatismo, evitando posiciones firmes.",
      fuente: "https://semanaeconomica.com/legal-politica/politica/177364-el-plan-de-gobierno-de-cesar-acuna",
    },
    {
      id: "pragmatismo-clientelar",
      nombre: "Pragmatismo Clientelar",
      resumen:
        "Utiliza el poder y las instituciones para mantener la 'gobernabilidad' y beneficiar a sus aliados políticos.",
      detalle:
        "No es un antisistema ideológico; es un actor pragmático que busca operar dentro del sistema para maximizar su poder. Su partido es considerado un vehículo político personalista. Su objetivo es la 'gobernabilidad', que se traduce en aliarse con el gobierno de turno para asegurar beneficios para su red. Su praxis, que incluye el uso instrumental del poder para fines personales, es la definición del pragmatismo clientelar.",
      fuente: "https://www.youtube.com/watch?v=KlEIO-G6ORQ",
    },
  ],
  phillip: [
    {
      id: "liberalismo-pro-mercado",
      nombre: "Liberalismo Pro-Mercado",
      resumen:
        "Defensa doctrinaria del libre mercado, la desregulación y la reducción del Estado a su mínima expresión.",
      detalle:
        "Se ha posicionado como uno de los defensores más vehementes del liberalismo económico en el Perú. Su discurso es consistentemente pro-mercado, anti-regulación y crítico de cualquier intervencionismo estatal. Aboga por la reducción del Estado, la flexibilización de regulaciones ambientales y laborales, y la primacía del sector privado. Su creencia es que la burocracia y los impuestos son los principales obstáculos para el desarrollo.",
      fuente: "https://www.youtube.com/watch?v=6wa00utIGmE",
    },
    {
      id: "conservadurismo-punitivo-mediatico",
      nombre: "Conservadurismo Punitivo",
      resumen:
        "Promueve la 'mano dura' y la defensa de valores tradicionales desde su plataforma mediática.",
      detalle:
        "Su plataforma social se construye sobre la promesa de restaurar el orden a través de métodos autoritarios. Su principal propuesta se centra en un plan de 'mano dura' contra la delincuencia. Su discurso mediático es consistentemente conservador, nacionalista y confrontacional, defendiendo los valores tradicionales frente al 'progresismo'. Su retórica se alinea con el 'modelo Bukele' de priorizar la seguridad sobre las garantías procesales.",
      fuente: "https://m.youtube.com/shorts/9vOLPu43Svs",
    },
    {
      id: "populismo-outsider-mediatico",
      nombre: "Populismo Outsider Disruptivo",
      resumen:
        "Utiliza su rol en los medios para atacar al 'establishment', la clase política y la 'prensa mermelera'.",
      detalle:
        "Su poder no reside en una estructura partidaria, sino en su capacidad para construir una narrativa de confrontación desde su plataforma de medios. Se posiciona como un outsider que canaliza el descontento contra la 'clase política' y el 'establishment'. Un elemento central de su discurso es el ataque a los medios de comunicación tradicionales, a los que acusa de recibir 'mermelada' (dinero del Estado).",
      fuente: "https://www.youtube.com/watch?v=ILpoO1NJ4BQ",
    },
  ],
};

import type { ProyectoPolitico } from '../types';

export const proyectos: Record<string, ProyectoPolitico> = {
  keiko: {
    titulo: "Orden y Mercado",
    resumen:
      "Su proyecto político busca reivindicar el legado del fujimorismo a través de una plataforma que combina políticas de 'mano dura' contra la delincuencia con la defensa del modelo de economía de mercado, mientras se enfrenta a un persistente movimiento antifujimorista.",
    detalles: [
      {
        subtitulo: "Legislación de 'mano dura' y reforma de seguridad",
        texto:
          "Promueve una política de 'mano dura' contra la delincuencia. Esto incluye proyectos de ley para restringir beneficios penitenciarios en delitos graves, fortalecer la investigación criminal de la Policía Nacional y construir nuevos penales de máxima seguridad para reducir el hacinamiento.",
        fuente: "https://www.youtube.com/watch?v=PMiEfL_thsE",
      },
      {
        subtitulo: "Defensa del modelo económico de la Constitución de 1993",
        texto:
          "Busca dar continuidad al capítulo económico de la Constitución de 1993, al que atribuye el crecimiento económico del país. Considera a la inversión privada como el 'motor de la economía peruana' y el principal generador de empleo.",
        fuente:
          "https://semanaeconomica.com/economia-finanzas/macroeconomia/elecciones-2021-las-claves-del-plan-economico-de-keiko-fujimori",
      },
      {
        subtitulo: "Impulso a las micro y pequeñas empresas (MYPES)",
        texto:
          "Se proponen medidas para facilitar la formalización, como una ventanilla única y electrónica para la creación de MYPES. También se plantea un programa de apoyo especial para las MYPES de los sectores de turismo y restaurantes, que incluiría la reducción de impuestos y el acceso a préstamos preferenciales.",
        fuente:
          "https://apisije-e.jne.gob.pe/TRAMITE/ESCRITO/1095/ARCHIVO/FIRMADO/3017.PDF",
      },
    ],
  },
  rafael: {
    titulo: "Mano Dura Gerencial",
    resumen:
      "Propone un modelo de gobierno que fusiona un liberalismo económico pragmático, un profundo conservadurismo social de base religiosa y la aplicación de principios de gestión del sector privado a la administración pública.",
    detalles: [
      {
        subtitulo: "'Lima Potencia Mundial': Infraestructura y Seguridad",
        texto:
          "Su principal propuesta de campaña se centró en la adquisición de 10,000 motocicletas para patrullaje y la ejecución de grandes obras viales, como una nueva vía expresa y teleféricos, para posicionar a 'Lima como potencia mundial'.",
        fuente:
          "https://www.actualidadambiental.pe/wp-content/uploads/2022/09/Plan-de-Gobierno-Renovacion-Popular-Elecciones-2022.pdf",
      },
      {
        subtitulo: "'Hambre Cero': Apoyo a ollas comunes",
        texto:
          "Es el programa social central de su gestión, enfocado en combatir la inseguridad alimentaria mediante el apoyo directo y la entrega de alimentos a las ollas comunes y programas de Vaso de Leche.",
        fuente:
          "https://www.actualidadambiental.pe/wp-content/uploads/2022/09/Plan-de-Gobierno-Renovacion-Popular-Elecciones-2022.pdf",
      },
      {
        subtitulo: "Confrontación con Concesionarias de Peajes",
        texto:
          "Aplica un modelo de gestión de confrontación directa contra concesiones que considera 'lesivas'. Su principal acción ha sido buscar la anulación unilateral del contrato de peajes con la empresa Rutas de Lima, en lugar de una renegociación.",
        fuente: "https://www.youtube.com/watch?v=A_zk_1h4y5M",
      },
    ],
  },
  yonhy: {
    titulo: "Centro Institucional y Reformista",
    resumen:
      "Su proyecto se basa en el fortalecimiento de la institucionalidad democrática, una fuerte agenda anticorrupción y la defensa del consumidor, proponiendo cambios estructurales profundos pero canalizados a través de las vías legales.",
    detalles: [
      {
        subtitulo: "Defensa del consumidor y regulación de mercados",
        texto:
          "Propone un rol estatal más activo para combatir monopolios y oligopolios, y regular precios en sectores clave para evitar abusos, basándose en su trayectoria legislativa en la protección al consumidor.",
        fuente: "https://www.youtube.com/watch?v=A_QjFIcAqsY",
      },
      {
        subtitulo: "Reforma institucional y lucha anticorrupción",
        texto:
          "Su agenda se centra en el fortalecimiento de la transparencia estatal, la rendición de cuentas y el restablecimiento del equilibrio de poderes, criticando duramente la corrupción de la clase política pero defendiendo el marco democrático.",
        fuente: "https://www.youtube.com/watch?v=mL-osKOQ21Y",
      },
      {
        subtitulo: "Propuesta de un Sistema Confederal",
        texto:
          "Plantea una reorganización radical del Estado hacia un 'sistema confederativo', otorgando autonomía económica, administrativa, judicial y legislativa a las regiones como una forma de profundizar la descentralización y combatir el centralismo.",
        fuente:
          "https://ucsp.edu.pe/archivos/publicaciones/agenda-desarrollo-arequipa/planes-de-gobierno-elecciones-generales-2021.pdf",
      },
    ],
  },
  "carlos-alvarez": {
    titulo: "Mano Dura Punitiva",
    resumen:
      "Su proyecto político es monotemático y se centra en una agenda de seguridad de 'mano de hierro', proponiendo medidas extremas como la pena de muerte, la construcción de megacárceles y la expulsión de delincuentes extranjeros, inspirado en el modelo de Nayib Bukele.",
    detalles: [
      {
        subtitulo: "Pena de muerte y salida del Pacto de San José",
        texto:
          "Propone viabilizar la pena capital para delitos graves como sicariato y violación, para lo cual plantea denunciar la Convención Americana de Derechos Humanos (Pacto de San José) y reformar la Constitución.",
        fuente:
          "https://rpp.pe/peru/actualidad/carlos-alvarez-anuncia-su-disposicion-de-postular-a-la-presidencia-y-propone-pena-de-muerte-contra-criminales-noticia-1625714",
      },
      {
        subtitulo: "Expulsión de delincuentes extranjeros",
        texto:
          "Insiste en la necesidad de realizar expulsiones inmediatas de los ciudadanos extranjeros que cometan delitos en el país.",
        fuente: "https://www.youtube.com/watch?v=hb5PHqWNTqk",
      },
      {
        subtitulo: "Cooperación punitiva internacional (modelo Bukele)",
        texto:
          "Ha sugerido la posibilidad de establecer convenios con El Salvador para poder encarcelar a los delincuentes más peligrosos del Perú en las prisiones de máxima seguridad de dicho país.",
        fuente:
          "https://trome.com/actualidad/politica/carlos-alvarez-dina-debe-hacer-un-convenio-con-bukele-y-mandar-a-los-criminales-mas-peligrosos-a-el-salvador-video-entrevista-noticia/",
      },
    ],
  },
  "cesar-acuna": {
    titulo: "Poder Clientelar y Obras Públicas",
    resumen:
      "Su proyecto se basa en un modelo de poder personalista y clientelar, utilizando su imagen de empresario exitoso y su maquinaria partidaria para ejecutar obras públicas de alto impacto visible y distribuir recursos a través de promesas de gasto masivo.",
    detalles: [
      {
        subtitulo: "Proyectos de infraestructura a gran escala",
        texto:
          "Su gestión como gobernador se ha centrado en megaproyectos como el destrabe del Proyecto Especial Chavimochic III y la planificación de un nuevo Hospital Regional para Trujillo.",
        fuente:
          "https://regionlalibertad.gob.pe/noticiaS/regionales/15239-cesar-acuna-gestiones-mas-emblematicas-son-destrabe-de-chavimochic-y-nuevo-hospital-regional",
      },
      {
        subtitulo: "Populismo Fiscal y Asistencia Directa",
        texto:
          "Ha propuesto medidas de alto impacto electoral como un 'bono COVID' de S/600 mensuales por un año para cinco millones de familias y la compra de las deudas de millones de peruanos por parte del Banco de la Nación.",
        fuente: "https://www.youtube.com/watch?v=BNdr8ceoqwE",
      },
      {
        subtitulo: "Modelo de alianzas con gobiernos locales",
        texto:
          "Ha implementado un sistema de ejecución de obras en alianza con los municipios, donde el Gobierno Regional financia directamente los proyectos locales, habiendo financiado más de 108 de ellos para consolidar su red de poder territorial.",
        fuente:
          "https://www.gob.pe/institucion/regionlalibertad/noticias/1158501-en-3-anos-de-gestion-108-obras-financiara-el-gore-a-municipios",
      },
    ],
  },
  belmont: {
    titulo: "Próximamente",
    resumen: "Próximamente",
    detalles: [],
  },
  cerron: {
    titulo: "Próximamente",
    resumen: "Próximamente",
    detalles: [],
  },
  guevara: {
    titulo: "Próximamente",
    resumen: "Próximamente",
    detalles: [],
  },
  olivera: {
    titulo: "Próximamente",
    resumen: "Próximamente",
    detalles: [],
  },
  sanchez: {
    titulo: "Próximamente",
    resumen: "Próximamente",
    detalles: [],
  },
};
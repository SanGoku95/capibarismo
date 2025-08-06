export interface FuenteAntauro {
  id: string;
  titulo: string;
  tipo: string;
  anio: number;
  url: string;
  notas?: string;
}

const fuentesAntauro: FuenteAntauro[] = [
  {
    id: "wikipedia",
    titulo: "Antauro Humala – Entrada en Wikipedia",
    tipo: "Enciclopedia online",
    anio: 2025,
    url: "https://es.wikipedia.org/wiki/Antauro_Humala",
    notas: "Perfil biográfico actualizado."
  },
  {
    id: "scielo",
    titulo: "El etnocacerismo: un nacionalismo étnico en el Perú del siglo XXI – Carlos Meléndez",
    tipo: "Artículo académico (SciELO)",
    anio: 2011,
    url: "https://www.scielo.cl/scielo.php?script=sci_arttext&pid=S0718-090X2011000100007",
    notas: "Marco doctrinario del etnocacerismo."
  },
  {
    id: "iep166",
    titulo: "Políticas de la identidad, fragmentación y conflicto social – IEP Doc 166",
    tipo: "Documento de trabajo",
    anio: 2010,
    url: "https://repositorio.iep.org.pe/bitstream/handle/IEP/611/DT166.pdf",
    notas: "Contexto sobre identidad y etnocacerismo."
  },
  {
    id: "infobae2024",
    titulo: "Antauro Humala quiere ser presidente: propuestas radicales",
    tipo: "Artículo de prensa (Infobae)",
    anio: 2024,
    url: "https://www.infobae.com/peru/2024/05/17/antauro-humala-quiere-ser-presidente-del-peru-estas-son-sus-radicales-propuestas-que-incluyen-la-pena-de-muerte/"
  },
  {
    id: "rpp2025",
    titulo: "JNE confirma rechazo de inscripción de A.N.T.A.U.R.O.",
    tipo: "Nota de prensa (RPP)",
    anio: 2025,
    url: "https://rpp.pe/politica/judiciales/jne-confirma-rechazo-a-la-inscripcion-del-partido-de-antauro-humala-por-su-ideologia-noticia-1558289"
  },
  {
    id: "elcomercio2025",
    titulo: "Antauro Humala y Verónika Mendoza confirman alianza electoral para 2026",
    tipo: "Nota de prensa (El Comercio)",
    anio: 2025,
    url: "https://elcomercio.pe/politica/elecciones/antauro-humala-y-veronika-mendoza-confirman-alianza-electoral-para-las-elecciones-del-2026-juntos-por-el-peru-etnocacerismo-noticia/"
  },
  {
    id: "yt_montoya2025",
    titulo: "Entrevista Modesto Montoya – Propuestas políticas (YouTube)",
    tipo: "Video entrevista",
    anio: 2025,
    url: "https://www.youtube.com/watch?v=D44PZoQ5B4A",
    notas: "57,9 k vistas; 9 may 2025."
  },
  {
    id: "yt_radiouno2025",
    titulo: "Radio Uno Tacna – Minería informal (YouTube)",
    tipo: "Video entrevista",
    anio: 2025,
    url: "https://www.youtube.com/watch?v=hojhhm9So00",
    notas: "20,8 k vistas; 11 jul 2025."
  },
  {
    id: "yt_runasur2025",
    titulo: "Discurso RUNASUR Bolivia (YouTube)",
    tipo: "Video discurso",
    anio: 2025,
    url: "https://www.youtube.com/watch?v=sldh8XTX7zk",
    notas: "4 ago 2025."
  },
  {
    id: "yt_coyuntura2025",
    titulo: "Escuela Política – Coyuntura nacional e internacional (YouTube)",
    tipo: "Video clase magistral",
    anio: 2025,
    url: "https://www.youtube.com/watch?v=-4w4OwsTMhM"
  },
  {
    id: "yt_talara2025",
    titulo: "Conferencia de prensa Talara – Petroperú (YouTube)",
    tipo: "Video conferencia",
    anio: 2025,
    url: "https://www.youtube.com/watch?v=n1lRr5d6AlM"
  }
];

export default fuentesAntauro;

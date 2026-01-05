// Utilities for controversy severity and legal status

export const severityProps = (sev?: string) => {
  switch (sev) {
    case 'muy-alta': return { label: 'Muy alta', className: 'bg-red-600/90 text-white' };
    case 'alta':     return { label: 'Alta',     className: 'bg-orange-600/90 text-white' };
    case 'media':    return { label: 'Media',    className: 'bg-amber-300/90 text-foreground' };
    default:         return { label: '—',        className: 'bg-muted text-foreground' };
  }
};

export const legalProps = (l?: string) => {
  switch (l) {
    case 'denuncia_en_medios':   return { label: 'Denuncia en Medios',         className: 'bg-sky-600/90 text-white' };
    case 'en_curso': return { label: 'En Curso', className: 'bg-amber-500/90 text-black' };
    case 'sancion':  return { label: 'Sanción',     className: 'bg-rose-600/90 text-white'};
    case 'cerrado_sin_sancion':  return { label: 'Cerrado sin sanción',     className: 'bg-emerald-600/90 text-white' };
    case 'condena':              return { label: 'Condena',             className:'bg-red-700/90 text-white' };
    default:                     return { label: '—', className:'bg-muted text-foreground'};
  }
};

export const severityHelp = (sev?: string) => {
  switch (sev) {
    case 'muy-alta': return 'Controversia de muy alto impacto público o institucional.';
    case 'alta':     return 'Controversia de impacto significativo o con medidas relevantes.';
    case 'media':    return 'Controversia relevante en seguimiento.';
    default:         return 'Sin clasificación específica.';
  }
};

export const legalHelp = (l?: string) => {
  switch (l) {
    case 'denuncia_en_medios':  return 'Se dijo en prensa/redes; sin trámite oficial.';
    case 'en_curso':            return 'Trámite oficial abierto (investigación o juicio).';
    case 'sancion':             return 'Hubo sanción institucional (no es condena penal).';
    case 'cerrado_sin_sancion': return 'Archivado o absuelto; sin sanción.';
    case 'condena':             return 'Sentencia penal firme de culpabilidad.';
    default:                    return 'Sin datos suficientes para clasificar.';
  }
};

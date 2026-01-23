import { base as baseRecords } from '../src/data/domains/base';

import { educacion } from '../src/data/domains/educacion';
import { experienciaLaboral } from '../src/data/domains/experienciaLaboral';
import { ingresos } from '../src/data/domains/ingresos';
import { propiedades } from '../src/data/domains/propiedades';
import { sentencias } from '../src/data/domains/sentencias';

let ok = true;

const baseIds = new Set(Object.keys(baseRecords));

const fail = (msg: string, extra?: unknown) => {
  ok = false;
  console.error(msg);
  if (extra) console.error(extra);
};

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isString = (v: unknown): v is string => typeof v === 'string';
const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

const approxEqual = (a: number, b: number, eps = 0.01) => Math.abs(a - b) <= eps;

const assertNoOrphans = (domainName: string, keys: string[]) => {
  for (const k of keys) {
    if (!baseIds.has(k)) fail(`[data] ${domainName}: id no existe en base: "${k}"`);
  }
};

// 1) Orphan keys (domain keys must be subset of base ids)
assertNoOrphans('educacion', Object.keys(educacion));
assertNoOrphans('experienciaLaboral', Object.keys(experienciaLaboral));
assertNoOrphans('ingresos', Object.keys(ingresos));
assertNoOrphans('propiedades', Object.keys(propiedades));
assertNoOrphans('sentencias', Object.keys(sentencias));

// 2) Per-candidate validation (domain values shape)
for (const id of Object.keys(baseRecords)) {
  const e = educacion[id];
  if (e !== undefined) {
    if (!isRecord(e)) fail(`[data] educacion inválida (no objeto) para ${id}`);
    if (!e?.basica || !isRecord(e.basica)) fail(`[data] educacion.basica inválida para ${id}`);
    if (!isString(e?.basica?.primaria)) fail(`[data] educacion.basica.primaria inválida para ${id}`);
    if (!isString(e?.basica?.secundaria)) fail(`[data] educacion.basica.secundaria inválida para ${id}`);

    if (!Array.isArray(e.universitaria)) fail(`[data] educacion.universitaria inválida (no array) para ${id}`);
    else {
      for (const u of e.universitaria) {
        if (!isRecord(u)) fail(`[data] educacion.universitaria item inválido (no objeto) para ${id}`);
        if (!isString(u.universidad)) fail(`[data] educacion.universitaria.universidad inválida para ${id}`);
        if (!isString(u.carrera)) fail(`[data] educacion.universitaria.carrera inválida para ${id}`);
        if (!isString(u.año)) fail(`[data] educacion.universitaria.año inválida para ${id}`);
      }
    }

    if (!Array.isArray(e.postgrado)) fail(`[data] educacion.postgrado inválida (no array) para ${id}`);
    else {
      for (const p of e.postgrado) {
        if (!isRecord(p)) fail(`[data] educacion.postgrado item inválido (no objeto) para ${id}`);
        if (!isString(p.tipo)) fail(`[data] educacion.postgrado.tipo inválida para ${id}`);
        if (!isString(p.institucion)) fail(`[data] educacion.postgrado.institucion inválida para ${id}`);
        if (!isString(p.especialidad)) fail(`[data] educacion.postgrado.especialidad inválida para ${id}`);
        if (!isString(p.año)) fail(`[data] educacion.postgrado.año inválida para ${id}`);
      }
    }
  }

  const jobs = experienciaLaboral[id];
  if (jobs !== undefined) {
    if (!Array.isArray(jobs)) fail(`[data] experienciaLaboral inválida (no array) para ${id}`);
    else {
      for (const j of jobs) {
        if (!isRecord(j)) fail(`[data] experienciaLaboral item inválido (no objeto) para ${id}`);
        if (!isString(j.puesto)) fail(`[data] experienciaLaboral.puesto inválido para ${id}`);
        if (!isString(j.empresa)) fail(`[data] experienciaLaboral.empresa inválido para ${id}`);
        if (!isString(j.periodo)) fail(`[data] experienciaLaboral.periodo inválido para ${id}`);
        if (!isString(j.ubicacion)) fail(`[data] experienciaLaboral.ubicacion inválido para ${id}`);
      }
    }
  }

  const incRows = ingresos[id];
  if (incRows !== undefined) {
    if (!Array.isArray(incRows)) fail(`[data] ingresos inválida (no array) para ${id}`);
    else {
      for (const r of incRows) {
        if (!isRecord(r)) fail(`[data] ingresos item inválido (no objeto) para ${id}`);
        if (!isString(r.año)) fail(`[data] ingresos.año inválido para ${id}`);
        if (!isNumber(r.publico)) fail(`[data] ingresos.publico inválido para ${id}`);
        if (!isNumber(r.privado)) fail(`[data] ingresos.privado inválido para ${id}`);
        if (!isNumber(r.total)) fail(`[data] ingresos.total inválido para ${id}`);

        if (isNumber(r.publico) && r.publico < 0) fail(`[data] ingresos.publico < 0 para ${id} (${r.año})`);
        if (isNumber(r.privado) && r.privado < 0) fail(`[data] ingresos.privado < 0 para ${id} (${r.año})`);
        if (isNumber(r.total) && r.total < 0) fail(`[data] ingresos.total < 0 para ${id} (${r.año})`);

        if (isNumber(r.publico) && isNumber(r.privado) && isNumber(r.total)) {
          const sum = r.publico + r.privado;
          if (!approxEqual(sum, r.total)) {
            fail(`[data] ingresos.total != publico+privado para ${id} (${r.año})`, { publico: r.publico, privado: r.privado, total: r.total });
          }
        }
      }
    }
  }

  const p = propiedades[id];
  if (p !== undefined) {
    if (!isRecord(p)) fail(`[data] propiedades inválida (no objeto) para ${id}`);
    if (!isNumber(p?.inmuebles)) fail(`[data] propiedades.inmuebles inválido para ${id}`);
    if (!isNumber(p?.vehiculos)) fail(`[data] propiedades.vehiculos inválido para ${id}`);
    if (!isNumber(p?.otros)) fail(`[data] propiedades.otros inválido para ${id}`);
    if (isNumber(p?.inmuebles) && p.inmuebles < 0) fail(`[data] propiedades.inmuebles < 0 para ${id}`);
    if (isNumber(p?.vehiculos) && p.vehiculos < 0) fail(`[data] propiedades.vehiculos < 0 para ${id}`);
    if (isNumber(p?.otros) && p.otros < 0) fail(`[data] propiedades.otros < 0 para ${id}`);
  }

  const s = sentencias[id];
  if (s !== undefined) {
    if (!Array.isArray(s)) fail(`[data] sentencias inválida (no array) para ${id}`);
    else {
      for (const row of s) {
        if (!isRecord(row)) fail(`[data] sentencias item inválido (no objeto) para ${id}`);
        if (!isString(row.delito)) fail(`[data] sentencias.delito inválido para ${id}`);
        if (!isString(row.año)) fail(`[data] sentencias.año inválido para ${id}`);
        if (!isString(row.fallo)) fail(`[data] sentencias.fallo inválido para ${id}`);
        if (!isString(row.organo)) fail(`[data] sentencias.organo inválido para ${id}`);
      }
    }
  }
}

if (!ok) process.exit(1);

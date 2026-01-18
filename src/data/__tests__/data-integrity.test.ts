import { describe, it, expect } from 'vitest';
import { listCandidates, getCandidateProfile } from '../index';
import { base } from '../domains/base';
import { proyectos } from '../domains/proyectos';
import { creencias } from '../domains/creencias';
import { presencia } from '../domains/presencia';
import { trayectorias } from '../domains/trayectorias';
import { mapaDePoder } from '../domains/mapaDePoder';
import { controversias } from '../domains/controversias';

describe('Data Integrity Tests', () => {
  describe('listCandidates()', () => {
    it('should return an array of candidates', () => {
      const candidates = listCandidates();

      expect(Array.isArray(candidates)).toBe(true);
      expect(candidates.length).toBeGreaterThan(0);
    });

    it('should return all candidates from base domain', () => {
      const candidates = listCandidates();
      const baseCount = Object.keys(base).length;

      expect(candidates.length).toBe(baseCount);
    });

    it('should have valid base data for each candidate', () => {
      const candidates = listCandidates();

      candidates.forEach(candidate => {
        expect(candidate.id).toBeTruthy();
        expect(candidate.nombre).toBeTruthy();
        // ideologia is optional for some candidates
        expect(candidate.headshot).toBeTruthy();
        expect(candidate.fullBody).toBeTruthy();

        // Validar formato de URLs/paths
        expect(
          candidate.headshot.startsWith('http') || candidate.headshot.startsWith('/')
        ).toBe(true);
        expect(
          candidate.fullBody.startsWith('http') || candidate.fullBody.startsWith('/')
        ).toBe(true);
      });
    });

    it('should have unique IDs for all candidates', () => {
      const candidates = listCandidates();
      const ids = candidates.map(c => c.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('getCandidateProfile()', () => {
    it('should return null for non-existent candidate', () => {
      const profile = getCandidateProfile('non-existent-id');

      expect(profile).toBeNull();
    });

    it('should return complete profile for existing candidate', () => {
      const candidateId = Object.keys(base)[0]; // Primer candidato
      const profile = getCandidateProfile(candidateId);

      expect(profile).not.toBeNull();
      expect(profile?.base).toBeDefined();
      expect(profile?.base.id).toBe(candidateId);
    });

    it('should include all domain data when available', () => {
      // Buscar un candidato que tenga todos los dominios
      const candidateId = Object.keys(base).find(id =>
        proyectos[id] &&
        creencias[id]?.length > 0 &&
        presencia[id] &&
        trayectorias[id] &&
        mapaDePoder[id]
      );

      if (candidateId) {
        const profile = getCandidateProfile(candidateId);

        expect(profile).not.toBeNull();
        expect(profile?.proyectoPolitico).toBeDefined();
        expect(profile?.creenciasClave).toBeDefined();
        expect(profile?.creenciasClave?.length).toBeGreaterThan(0);
        expect(profile?.presenciaDigital).toBeDefined();
        expect(profile?.trayectoria).toBeDefined();
        expect(profile?.mapaDePoder).toBeDefined();
      }
    });

    it('should handle candidates with partial data gracefully', () => {
      const candidates = listCandidates();

      candidates.forEach(candidate => {
        const profile = getCandidateProfile(candidate.id);

        // Base siempre debe existir
        expect(profile).not.toBeNull();
        expect(profile?.base).toBeDefined();

        // Otros dominios son opcionales pero no deben romper
        expect(() => profile?.proyectoPolitico).not.toThrow();
        expect(() => profile?.creenciasClave).not.toThrow();
        expect(() => profile?.presenciaDigital).not.toThrow();
        expect(() => profile?.trayectoria).not.toThrow();
        expect(() => profile?.mapaDePoder).not.toThrow();
        expect(() => profile?.controversias).not.toThrow();
      });
    });
  });

  describe('Domain Data Consistency', () => {
    it('should have matching IDs between base and proyectos', () => {
      Object.keys(proyectos).forEach(proyectoId => {
        expect(base[proyectoId]).toBeDefined();
        expect(base[proyectoId]?.id).toBe(proyectoId);
      });
    });

    it('should have matching IDs between base and creencias', () => {
      Object.keys(creencias).forEach(creenciaId => {
        expect(base[creenciaId]).toBeDefined();
        expect(base[creenciaId]?.id).toBe(creenciaId);
      });
    });

    it('should have matching IDs between base and presencia', () => {
      Object.keys(presencia).forEach(presenciaId => {
        expect(base[presenciaId]).toBeDefined();
        expect(base[presenciaId]?.id).toBe(presenciaId);
      });
    });

    it('should have matching IDs between base and trayectorias', () => {
      Object.keys(trayectorias).forEach(trayectoriaId => {
        expect(base[trayectoriaId]).toBeDefined();
        expect(base[trayectoriaId]?.id).toBe(trayectoriaId);
      });
    });

    it('should have matching IDs between base and mapaDePoder', () => {
      Object.keys(mapaDePoder).forEach(mapaPoderId => {
        expect(base[mapaPoderId]).toBeDefined();
        expect(base[mapaPoderId]?.id).toBe(mapaPoderId);
      });
    });

    it('should have matching IDs between base and controversias', () => {
      Object.keys(controversias).forEach(controversiaId => {
        expect(base[controversiaId]).toBeDefined();
        expect(base[controversiaId]?.id).toBe(controversiaId);
      });
    });
  });

  describe('Data Completeness Report', () => {
    it('should report data coverage for all candidates', () => {
      const candidates = listCandidates();
      const report = candidates.map(candidate => ({
        id: candidate.id,
        nombre: candidate.nombre,
        hasProyecto: !!proyectos[candidate.id],
        hasCreencias: !!creencias[candidate.id]?.length,
        hasPresencia: !!presencia[candidate.id],
        hasTrayectoria: !!trayectorias[candidate.id],
        hasMapaPoder: !!mapaDePoder[candidate.id],
        hasControversias: !!controversias[candidate.id]?.length,
      }));

      // Calcular porcentaje de completitud
      const completeness = report.map(r => {
        const fields = [
          r.hasProyecto,
          r.hasCreencias,
          r.hasPresencia,
          r.hasTrayectoria,
          r.hasMapaPoder,
          r.hasControversias,
        ];
        const filledFields = fields.filter(Boolean).length;
        return (filledFields / fields.length) * 100;
      });

      const avgCompleteness = completeness.reduce((a, b) => a + b, 0) / completeness.length;

      // Log para debugging (opcional)
      console.log('\n📊 Data Completeness Report:');
      report.forEach((r, i) => {
        console.log(`  ${r.nombre}: ${completeness[i].toFixed(0)}% complete`);
      });
      console.log(`\n📈 Average completeness: ${avgCompleteness.toFixed(1)}%\n`);

      // Asegurar que al menos 50% de datos estén completos en promedio
      expect(avgCompleteness).toBeGreaterThan(50);
    });

    it('should ensure all candidates have at least base data', () => {
      const candidates = listCandidates();

      expect(candidates.every(c =>
        c.id && c.nombre && c.headshot && c.fullBody
      )).toBe(true);
    });
  });
});

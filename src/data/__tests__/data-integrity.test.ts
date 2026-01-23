import { describe, it, expect } from 'vitest';
import { listCandidates, getCandidateProfile } from '../index';
import { base } from '../domains/base';
import { educacion } from '../domains/educacion';
import { experienciaLaboral } from '../domains/experienciaLaboral';
import { sentencias } from '../domains/sentencias';
import { propiedades } from '../domains/propiedades';
import { ingresos } from '../domains/ingresos';

describe('Data Integrity', () => {
  describe('Base data', () => {
    it('should have all required fields for each candidate', () => {
      const candidates = listCandidates();
      expect(candidates.length).toBeGreaterThan(0);

      candidates.forEach((candidate) => {
        expect(candidate).toHaveProperty('id');
        expect(candidate).toHaveProperty('nombre');
        expect(candidate.id).toBeTruthy();
        expect(candidate.nombre).toBeTruthy();
      });
    });

    it('should have unique IDs', () => {
      const ids = Object.keys(base);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('JNE domain data', () => {
    const allCandidateIds = Object.keys(base);

    it('educacion domain should reference valid candidate IDs', () => {
      const educacionIds = Object.keys(educacion);
      educacionIds.forEach((id) => {
        expect(allCandidateIds).toContain(id);
      });
    });

    it('experienciaLaboral domain should reference valid candidate IDs', () => {
      const experienciaIds = Object.keys(experienciaLaboral);
      experienciaIds.forEach((id) => {
        expect(allCandidateIds).toContain(id);
      });
    });

    it('sentencias domain should reference valid candidate IDs', () => {
      const sentenciasIds = Object.keys(sentencias);
      sentenciasIds.forEach((id) => {
        expect(allCandidateIds).toContain(id);
      });
    });

    it('propiedades domain should reference valid candidate IDs', () => {
      const propiedadesIds = Object.keys(propiedades);
      propiedadesIds.forEach((id) => {
        expect(allCandidateIds).toContain(id);
      });
    });

    it('ingresos domain should reference valid candidate IDs', () => {
      const ingresosIds = Object.keys(ingresos);
      ingresosIds.forEach((id) => {
        expect(allCandidateIds).toContain(id);
      });
    });
  });

  describe('getCandidateProfile', () => {
    it('should return complete profile for existing candidates', () => {
      const candidates = listCandidates();
      const sampleCandidate = candidates[0];
      
      const profile = getCandidateProfile(sampleCandidate.id);
      expect(profile).not.toBeNull();
      expect(profile?.base).toEqual(sampleCandidate);
    });

    it('should return null for non-existent candidate', () => {
      const profile = getCandidateProfile('non-existent-id');
      expect(profile).toBeNull();
    });
  });
});

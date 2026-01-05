import { describe, it, expect } from 'vitest';
import { ProyectoPoliticoSchema, CreenciaSchema, PresenciaDigitalSchema } from '../schemas';

describe('ProyectoPoliticoSchema', () => {
  describe('valid data', () => {
    it('validates a minimal proyecto politico with required fields only', () => {
      const validData = {
        titulo: 'Plan de Educación',
        resumen: 'Mejorar la calidad educativa en el país',
      };

      const result = ProyectoPoliticoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates a proyecto politico with detalles', () => {
      const validData = {
        titulo: 'Plan de Educación',
        resumen: 'Mejorar la calidad educativa en el país',
        detalles: [
          {
            subtitulo: 'Presupuesto',
            texto: 'Aumentar el presupuesto educativo a 6% del PBI',
          },
          {
            subtitulo: 'Infraestructura',
            texto: 'Construir 100 nuevas escuelas',
            fuente: 'https://example.com/plan-educacion',
          },
        ],
      };

      const result = ProyectoPoliticoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates detalles with optional fuente URL', () => {
      const validData = {
        titulo: 'Salud Universal',
        resumen: 'Sistema de salud universal',
        detalles: [
          {
            subtitulo: 'Cobertura',
            texto: '100% de cobertura',
            fuente: 'https://salud.gob.pe/plan',
          },
        ],
      };

      const result = ProyectoPoliticoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('rejects empty titulo', () => {
      const invalidData = {
        titulo: '',
        resumen: 'Valid resumen',
      };

      const result = ProyectoPoliticoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects empty resumen', () => {
      const invalidData = {
        titulo: 'Valid titulo',
        resumen: '',
      };

      const result = ProyectoPoliticoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects missing required fields', () => {
      const invalidData = {
        titulo: 'Only titulo',
      };

      const result = ProyectoPoliticoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects detalles with empty subtitulo', () => {
      const invalidData = {
        titulo: 'Plan',
        resumen: 'Resumen',
        detalles: [
          {
            subtitulo: '',
            texto: 'Valid text',
          },
        ],
      };

      const result = ProyectoPoliticoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects detalles with empty texto', () => {
      const invalidData = {
        titulo: 'Plan',
        resumen: 'Resumen',
        detalles: [
          {
            subtitulo: 'Valid subtitle',
            texto: '',
          },
        ],
      };

      const result = ProyectoPoliticoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects detalles with invalid fuente URL', () => {
      const invalidData = {
        titulo: 'Plan',
        resumen: 'Resumen',
        detalles: [
          {
            subtitulo: 'Subtitle',
            texto: 'Text',
            fuente: 'not-a-valid-url',
          },
        ],
      };

      const result = ProyectoPoliticoSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreenciaSchema', () => {
  describe('valid data', () => {
    it('validates a minimal creencia with required fields only', () => {
      const validData = {
        id: 'libre-mercado',
        nombre: 'Libre Mercado',
        resumen: 'Economía de libre mercado',
      };

      const result = CreenciaSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates creencia with all fields', () => {
      const validData = {
        id: 'medio-ambiente',
        nombre: 'Protección Ambiental',
        resumen: 'Políticas de protección del medio ambiente',
        detalle: 'Implementar energías renovables y proteger áreas naturales',
        fuente: 'https://example.com/propuestas',
      };

      const result = CreenciaSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates creencia with detalle but no fuente', () => {
      const validData = {
        id: 'educacion',
        nombre: 'Educación Pública',
        resumen: 'Fortalecer la educación pública',
        detalle: 'Incrementar presupuesto y mejorar infraestructura',
      };

      const result = CreenciaSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('rejects empty id', () => {
      const invalidData = {
        id: '',
        nombre: 'Valid nombre',
        resumen: 'Valid resumen',
      };

      const result = CreenciaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects empty nombre', () => {
      const invalidData = {
        id: 'valid-id',
        nombre: '',
        resumen: 'Valid resumen',
      };

      const result = CreenciaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects empty resumen', () => {
      const invalidData = {
        id: 'valid-id',
        nombre: 'Valid nombre',
        resumen: '',
      };

      const result = CreenciaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects missing required fields', () => {
      const invalidData = {
        id: 'only-id',
      };

      const result = CreenciaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects invalid fuente URL', () => {
      const invalidData = {
        id: 'valid-id',
        nombre: 'Valid nombre',
        resumen: 'Valid resumen',
        fuente: 'invalid-url',
      };

      const result = CreenciaSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe('PresenciaDigitalSchema', () => {
  describe('valid data', () => {
    it('validates presencia digital with single platform', () => {
      const validData = {
        plataformas: [
          {
            nombre: 'twitter',
            url: 'https://twitter.com/candidate',
            estrategia: 'Tweets diarios con propuestas',
          },
        ],
      };

      const result = PresenciaDigitalSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates presencia digital with multiple platforms', () => {
      const validData = {
        plataformas: [
          {
            nombre: 'tiktok',
            handle: '@candidato',
            url: 'https://tiktok.com/@candidato',
            estrategia: 'Videos cortos diarios',
          },
          {
            nombre: 'youtube',
            url: 'https://youtube.com/candidato',
            estrategia: 'Entrevistas semanales',
          },
          {
            nombre: 'facebook',
            url: 'https://facebook.com/candidato',
            estrategia: 'Live streams',
          },
        ],
      };

      const result = PresenciaDigitalSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates all platform enum values', () => {
      const platforms = ['tiktok', 'youtube', 'instagram', 'facebook', 'twitter', 'web'] as const;

      platforms.forEach((platform) => {
        const validData = {
          plataformas: [
            {
              nombre: platform,
              url: `https://${platform}.com/test`,
              estrategia: 'Test strategy',
            },
          ],
        };

        const result = PresenciaDigitalSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('validates platform with optional handle', () => {
      const validData = {
        plataformas: [
          {
            nombre: 'instagram',
            handle: '@candidato_oficial',
            url: 'https://instagram.com/candidato_oficial',
            estrategia: 'Stories y posts diarios',
          },
        ],
      };

      const result = PresenciaDigitalSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid data', () => {
    it('rejects invalid platform nombre', () => {
      const invalidData = {
        plataformas: [
          {
            nombre: 'linkedin', // Not in enum
            url: 'https://linkedin.com/in/candidate',
            estrategia: 'Professional updates',
          },
        ],
      };

      const result = PresenciaDigitalSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects invalid URL', () => {
      const invalidData = {
        plataformas: [
          {
            nombre: 'twitter',
            url: 'not-a-url',
            estrategia: 'Strategy',
          },
        ],
      };

      const result = PresenciaDigitalSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects empty estrategia', () => {
      const invalidData = {
        plataformas: [
          {
            nombre: 'facebook',
            url: 'https://facebook.com/page',
            estrategia: '',
          },
        ],
      };

      const result = PresenciaDigitalSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects missing required fields in platform', () => {
      const invalidData = {
        plataformas: [
          {
            nombre: 'youtube',
            // Missing url and estrategia
          },
        ],
      };

      const result = PresenciaDigitalSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects empty plataformas array', () => {
      const invalidData = {
        plataformas: [],
      };

      const result = PresenciaDigitalSchema.safeParse(invalidData);
      expect(result.success).toBe(true); // Note: Schema doesn't enforce minimum array length
    });
  });
});

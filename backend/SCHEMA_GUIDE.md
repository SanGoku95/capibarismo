# Guía del Esquema Simplificado de IPSOS

## Cambios vs Esquema Original

El nuevo esquema (`ipsos_schema_simple.json`) es más **flexible, genérico y reutilizable** que el original:

### ✅ Ventajas del Nuevo Esquema

1. **Genérico para cualquier fecha**: No tiene fechas hardcodeadas como `febrero_2_2026`
2. **Dinámico para candidatos**: Acepta cualquier candidato, no lista nombres específicos
3. **Flexible**: Campos opcionales para desagregaciones que no siempre están disponibles
4. **Más simple**: Estructura más plana y fácil de entender
5. **Reutilizable**: Funciona para cualquier encuesta IPSOS de Perú, presente o futura

### 📊 Estructura del Nuevo Esquema

```json
{
  "metadata": {
    "titulo": "Encuesta...",
    "fecha": "2026-02",
    "encuestadora": "Ipsos",
    "muestra": 1200,
    "margen_error": 2.8,
    "nivel_confianza": 95
  },
  "resultados": [
    {
      "fecha_medicion": "Febrero 2026",
      "candidatos": [
        {
          "nombre": "Rafael López Aliaga",
          "partido": "Renovación Popular",
          "porcentaje": 23.5
        },
        {
          "nombre": "Keiko Fujimori",
          "partido": "Fuerza Popular",
          "porcentaje": 18.2
        }
        // ... más candidatos dinámicamente
      ],
      "otros": 5.3,
      "blanco_viciado_ninguno": 12.1,
      "no_precisa": 8.9
    }
    // Puede haber múltiples mediciones (ej: Feb 1-2026, Feb 2-2026)
  ],
  "evolucion_historica": [
    {
      "periodo": "Ene 2026",
      "datos": [
        {
          "nombre": "Rafael López Aliaga",
          "porcentaje": 22.1
        },
        {
          "nombre": "Keiko Fujimori",
          "porcentaje": 17.8
        }
      ],
      "blanco_viciado_ninguno": 11.5
    }
    // Más periodos históricos
  ],
  "desagregaciones": {
    "por_ambito": [
      {
        "nombre": "Rafael López Aliaga",
        "total": 23.5,
        "lima": 25.2,
        "interior": 22.3
      }
    ],
    "por_region": [
      {
        "nombre": "Rafael López Aliaga",
        "total": 23.5,
        "norte": 21.0,
        "centro": 24.5,
        "sur": 22.8,
        "oriente": 20.1,
        "urbano": 24.2,
        "rural": 21.5
      }
    ],
    "por_nse": [...],
    "por_genero_edad": [...]
  }
}
```

## Comparación: Viejo vs Nuevo

### Esquema Viejo (Rígido)

```json
{
  "encuesta": {
    "resultados": {
      "febrero_2_2026": { ... },  // ❌ Fecha hardcodeada
      "febrero_1_2026": { ... },  // ❌ Específico a 2026
      "enero_2026": { ... }        // ❌ Solo estos 3 meses
    },
    "evolucion_historica": [
      {
        "periodo": "...",
        "lopez_aliaga": 23.5,      // ❌ Nombres hardcodeados
        "keiko_fujimori": 18.2,    // ❌ Solo estos candidatos
        "carlos_alvarez": 12.1,    // ❌ No acepta nuevos
        // ...
      }
    ]
  }
}
```

### Esquema Nuevo (Flexible)

```json
{
  "metadata": { ... },
  "resultados": [               // ✅ Array dinámico
    {
      "fecha_medicion": "...",  // ✅ Cualquier fecha
      "candidatos": [           // ✅ Lista dinámica
        {
          "nombre": "...",      // ✅ Cualquier candidato
          "porcentaje": 23.5
        }
      ]
    }
  ],
  "evolucion_historica": [     // ✅ Cualquier periodo
    {
      "periodo": "...",
      "datos": [                // ✅ Candidatos dinámicos
        {
          "nombre": "...",
          "porcentaje": 23.5
        }
      ]
    }
  ]
}
```

## Uso en el Código

### TypeScript Types

```typescript
import type { IpsosEncuestaSimple } from '@/types/ipsos-simple.js';

const encuesta: IpsosEncuestaSimple = {
  metadata: {
    titulo: "Encuesta...",
    fecha: "2026-02",
    encuestadora: "Ipsos",
    muestra: 1200
  },
  resultados: [
    {
      fecha_medicion: "Febrero 2026",
      candidatos: [
        { nombre: "Candidato 1", porcentaje: 23.5 },
        { nombre: "Candidato 2", porcentaje: 18.2 }
      ]
    }
  ]
};
```

### Ventajas para Desarrollo

1. **Fácil de extender**: Agregar nuevos candidatos es automático
2. **Múltiples fechas**: Un archivo puede tener varias mediciones
3. **Campos opcionales**: No todos los PDFs tienen todas las desagregaciones
4. **Type-safe**: TypeScript valida la estructura
5. **Validación**: Zod asegura que los datos cumplan el esquema

## Migración

Si tienes datos en el formato viejo, puedes convertirlos al nuevo:

```typescript
// Viejo formato
const old = {
  encuesta: {
    resultados: {
      febrero_2_2026: { candidatos: [...] }
    }
  }
};

// Nuevo formato
const nuevo: IpsosEncuestaSimple = {
  metadata: {
    titulo: old.encuesta.titulo,
    fecha: old.encuesta.fecha,
    encuestadora: old.encuesta.ficha_tecnica.encuestadora,
    muestra: old.encuesta.ficha_tecnica.muestra
  },
  resultados: [
    {
      fecha_medicion: "Febrero 2-2026",
      candidatos: old.encuesta.resultados.febrero_2_2026.candidatos
    }
  ]
};
```

## Próximos Pasos

1. **DATUM y CPI**: Crear esquemas similares para otras encuestadoras
2. **Validación**: Agregar tests unitarios para el esquema
3. **API**: Crear endpoints para consultar encuestas históricas
4. **Base de datos**: Migrar de archivos JSON a PostgreSQL/MongoDB
5. **Visualización**: Dashboard para comparar encuestas

## Documentación del Esquema

Ver `ipsos_schema_simple.json` para el JSON Schema completo con todas las validaciones.

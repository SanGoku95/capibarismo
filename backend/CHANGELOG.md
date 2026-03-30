# Changelog - IPSOS Survey Extractor

## [1.1.0] - 2026-02-28

### 🎯 Cambios Mayores

#### Nuevo Esquema Simplificado
- **Archivo**: `ipsos_schema_simple.json`
- **Motivación**: Crear un esquema genérico, reutilizable y flexible para cualquier encuesta IPSOS

#### Diferencias Clave

**Antes (Esquema Rígido)**:
```json
{
  "encuesta": {
    "resultados": {
      "febrero_2_2026": {...},  // Fechas hardcodeadas
      "febrero_1_2026": {...}
    },
    "evolucion_historica": [{
      "lopez_aliaga": 23.5,      // Candidatos hardcodeados
      "keiko_fujimori": 18.2
    }]
  }
}
```

**Ahora (Esquema Flexible)**:
```json
{
  "metadata": {...},
  "resultados": [                // Array dinámico de mediciones
    {
      "candidatos": [            // Lista dinámica de candidatos
        {"nombre": "...", "porcentaje": 23.5}
      ]
    }
  ],
  "evolucion_historica": [
    {
      "datos": [                 // Candidatos dinámicos
        {"nombre": "...", "porcentaje": 23.5}
      ]
    }
  ]
}
```

### ✅ Ventajas

1. **Genérico**: Funciona para cualquier fecha y candidatos
2. **Flexible**: Campos opcionales para datos no siempre disponibles
3. **Reutilizable**: Mismo esquema para encuestas futuras
4. **Simple**: Estructura más clara y plana
5. **Escalable**: Fácil de extender a DATUM, CPI, etc.

### 📝 Archivos Modificados

1. **Nuevo**: `ipsos_schema_simple.json` - Esquema simplificado
2. **Nuevo**: `src/types/ipsos-simple.ts` - TypeScript types para el nuevo esquema
3. **Actualizado**: `src/services/extract-ipsos.ts` - Usa el nuevo esquema
4. **Actualizado**: `src/repositories/ipsos.ts` - Acepta el nuevo tipo
5. **Nuevo**: `SCHEMA_GUIDE.md` - Documentación del nuevo esquema
6. **Nuevo**: `CHANGELOG.md` - Este archivo

### 🔧 Cambios Técnicos

#### Schema Conversion para OpenAI
Se mejoró la función `convertSchemaForOpenAI()` para:
- ✅ Remover campos `oneOf` (no soportados por OpenAI structured outputs)
- ✅ Remover campos `format` (uri, email no soportados)
- ✅ Remover `additionalProperties` (innecesario en strict mode)
- ✅ Limpiar metadatos del schema (`$schema`, `$id`)

#### Validación con Zod
Se simplificó el schema Zod:
- Campos opcionales donde tiene sentido
- Arrays dinámicos para candidatos
- Estructura más plana

### 🐛 Bugs Corregidos

1. **Error 400**: "oneOf is not permitted" - Resuelto removiendo oneOf del schema
2. **Error 400**: "uri is not a valid format" - Resuelto removiendo format constraints
3. **Type errors**: Repository ahora acepta `IpsosEncuestaSimple`

### 📚 Documentación

- `SCHEMA_GUIDE.md`: Guía completa del nuevo esquema
- `SERVICE_README.md`: README del servicio (mantiene instrucciones de uso)
- Ejemplos de migración del formato viejo al nuevo

## [1.0.0] - 2026-02-28

### 🚀 Release Inicial

- ✅ Servicio Express.js con TypeScript
- ✅ Extracción de PDFs con pdf-parse
- ✅ Integración con OpenAI GPT-4 (structured outputs)
- ✅ Arquitectura en capas (Handler → Service → Repository)
- ✅ Validación con Zod
- ✅ Guardado de JSON en filesystem
- ✅ Esquema completo IPSOS (ipsos_schema.json - deprecado)

### Stack Tecnológico
- Node.js 20.x
- TypeScript 5.9
- Express.js 4.x
- OpenAI SDK 4.x
- Zod 3.x
- pdf-parse 1.x

---

## Próximas Versiones

### [1.2.0] - Planeado
- [ ] Soporte para DATUM PDFs
- [ ] Soporte para CPI PDFs
- [ ] Tests unitarios con Vitest
- [ ] GitHub Actions CI/CD

### [1.3.0] - Planeado
- [ ] API REST completa (CRUD de encuestas)
- [ ] Base de datos (PostgreSQL)
- [ ] Búsqueda y filtros
- [ ] Comparación entre encuestas

### [2.0.0] - Futuro
- [ ] Dashboard web de visualización
- [ ] Análisis de tendencias con IA
- [ ] Predicciones basadas en datos históricos
- [ ] API pública con rate limiting

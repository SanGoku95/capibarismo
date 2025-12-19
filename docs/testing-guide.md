# Testing Guide - Presidential Punch Peru

## Overview

Este proyecto usa **Vitest** como framework de testing, junto con **@testing-library/react** para tests de componentes.

## Scripts Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con interfaz visual
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage
```

## Estructura de Tests

Los tests se organizan en carpetas `__tests__` junto al código que testean:

```
src/
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts
api/
├── elo.ts
└── __tests__/
    └── elo.test.ts
```

## Configuración

- **Archivo de configuración**: `vitest.config.ts`
- **Setup global**: `src/test/setup.ts`
- **Utilidades de testing**: `src/test/utils.tsx`

## Escribir Tests

### Test Básico

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myFunction';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### Test de Componentes React

```typescript
import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

### Mocking

#### Mock de Módulos

```typescript
import { vi } from 'vitest';

vi.mock('../api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mocked' }))
}));
```

#### Mock de localStorage

El setup global ya incluye un mock de `localStorage` y `sessionStorage`. Para tests específicos:

```typescript
import { createMockStorage } from '@/test/utils';

const mockStorage = createMockStorage();
mockStorage.setItem('key', 'value');
```

## Coverage

La configuración de coverage excluye automáticamente:

- `node_modules/`
- `src/test/` (archivos de testing)
- `**/*.d.ts` (tipos)
- `**/*.config.*` (configuraciones)
- `dist/` y `.vercel/` (build outputs)
- `scripts/` (scripts de build)

### Ver Reporte de Coverage

Después de ejecutar `npm run test:coverage`, abre:

```
coverage/index.html
```

## Estado Actual

### Tests Implementados (Iteración 1)

✅ **src/lib/utils.ts** - 8 tests
- Función `cn()` para merge de clases CSS
- Manejo de condicionales, arrays, objetos
- Deduplicación y resolución de conflictos Tailwind

✅ **api/elo.ts** - 22 tests
- Cálculo de probabilidad esperada
- Actualización de ratings
- Edge cases (diferencias extremas, empates)
- Propiedades del sistema (zero-sum, transitividad)

**Total: 30 tests pasando** ✅

### Cobertura Actual

- **api/elo.ts**: 100% de cobertura
- **src/lib/utils.ts**: 100% de cobertura
- **Proyecto general**: ~3.35% (normal para inicio)

## Próximos Pasos

Según el plan de testing, las próximas áreas a testear son:

1. **Validación de datos** (`src/data/schemas.ts`)
2. **Generación de pares** (`src/hooks/useGameAPI.ts`)
3. **Stores Zustand** (`src/store/`)
4. **API endpoints** (`api/game/vote.ts`, `api/ranking/personal.ts`)

## Convenciones

### Naming

- Archivos de test: `*.test.ts` o `*.test.tsx`
- Carpeta de tests: `__tests__/` junto al código fuente
- Describe blocks: usar el nombre de la función/componente
- Test cases: usar "should..." para describir comportamiento esperado

### Estructura de Tests

```typescript
describe('ComponentOrFunction', () => {
  describe('specificMethod or feature', () => {
    it('should handle normal case', () => {
      // Arrange
      const input = 'value';

      // Act
      const result = myFunction(input);

      // Assert
      expect(result).toBe('expected');
    });

    it('should handle edge case', () => {
      // ...
    });
  });
});
```

## Solución de Problemas

### Los tests no se ejecutan

1. Verifica que estás usando Node 20.x (requerido por el proyecto)
2. Limpia node_modules y reinstala: `rm -rf node_modules && npm install`
3. Verifica que `vitest.config.ts` esté correctamente configurado

### Errores de importación

- Asegúrate de usar el alias `@/` para imports desde `src/`
- Ejemplo: `import { cn } from '@/lib/utils'`

### Tests de componentes fallan

- Verifica que estés usando `renderWithProviders` en lugar de `render` directo
- Esto asegura que QueryClient y Router estén disponibles

## Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Vitest UI](https://vitest.dev/guide/ui.html)

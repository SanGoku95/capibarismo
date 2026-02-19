#!/usr/bin/env bash
# Creates 13 GitHub issues from ROADMAP.md ideas.
# Requires: gh CLI authenticated (run `gh auth login` first)
#
# Usage:
#   chmod +x scripts/create-roadmap-issues.sh
#   ./scripts/create-roadmap-issues.sh

set -euo pipefail

REPO="SanGoku95/capibarismo"
CREATED=0

create_issue() {
  local title="$1"
  local body="$2"
  local labels="${3:-}"

  if [ -n "$labels" ]; then
    gh issue create --repo "$REPO" --title "$title" --body "$body" --label "$labels"
  else
    gh issue create --repo "$REPO" --title "$title" --body "$body"
  fi
  CREATED=$((CREATED + 1))
  echo "✅ Created issue $CREATED/13: $title"
}

echo "🚀 Creating 13 issues from ROADMAP.md..."
echo ""

# ─── Decisión informada ────────────────────────────────────────

create_issue \
  "Información de Vicepresidentes" \
  "## Descripción

¿Quién acompaña a cada candidato en la fórmula presidencial?

Agregar información de los vicepresidentes (primer y segundo) para cada candidato, incluyendo:
- Nombre completo
- Foto
- Breve biografía
- Experiencia relevante

## Motivación

El usuario necesita saber quién acompaña a su candidato — el vicepresidente puede ser decisivo.

## Categoría

🗳️ Decisión informada

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

create_issue \
  "Ideología de todos los candidatos" \
  "## Descripción

Agregar una etiqueta política clara y verificada para cada uno de los 36 candidatos.

- Definir categorías ideológicas (izquierda, centro-izquierda, centro, centro-derecha, derecha, etc.)
- Asignar etiqueta a cada candidato basándose en fuentes verificables
- Mostrar la etiqueta en el perfil del candidato y en las comparaciones

## Motivación

Facilitar al usuario una primera aproximación rápida a la posición política de cada candidato.

## Categoría

🗳️ Decisión informada

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

create_issue \
  "Datos del Mapa Político para todos los candidatos" \
  "## Descripción

Completar las posiciones en los 4 ejes del mapa político para todos los candidatos.

- Revisar y completar datos faltantes en \`/src/data/domains/compass.ts\`
- Verificar fuentes para cada posición asignada
- Documentar la metodología de asignación

## Motivación

El mapa político actualmente puede tener candidatos sin datos completos. Completar todos mejora la utilidad de la herramienta.

## Categoría

🗳️ Decisión informada

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

create_issue \
  "Ampliar Controversias" \
  "## Descripción

Ampliar la sección de controversias con más candidatos, más contexto y mejores fuentes.

- Agregar controversias documentadas para candidatos que aún no las tienen
- Mejorar el contexto de las controversias existentes
- Asegurar que todas las fuentes sean verificables y de calidad
- Incluir fecha y fuente primaria para cada controversia

## Motivación

Las controversias son un factor importante en la decisión del voto. Información más completa ayuda al usuario.

## Categoría

🗳️ Decisión informada

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

create_issue \
  "Encuestas del último mes" \
  "## Descripción

Mostrar la intención de voto actualizada semanalmente basada en encuestas recientes.

- Definir fuentes confiables de encuestas (Ipsos, Datum, CPI, etc.)
- Crear componente para mostrar tendencias de intención de voto
- Actualizar datos semanalmente (manual o automatizado)
- Mostrar fecha de la encuesta y margen de error

## Motivación

Las encuestas dan contexto sobre la viabilidad electoral de cada candidato, lo cual es información útil para el voto estratégico.

## Categoría

🗳️ Decisión informada

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

create_issue \
  "Datos de Polymarket" \
  "## Descripción

Integrar probabilidades del mercado de predicciones Polymarket como señal adicional.

- Investigar si Polymarket tiene mercados relevantes para las elecciones peruanas
- Definir cómo mostrar las probabilidades (porcentaje, gráfico de tendencia)
- Integrar datos vía API o manualmente
- Explicar al usuario qué significa esta información

## Motivación

Los mercados de predicciones pueden ofrecer una perspectiva complementaria a las encuestas tradicionales.

## Categoría

🗳️ Decisión informada

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

create_issue \
  "Explorar Senadores" \
  "## Descripción

Ayudar al usuario a decidir su voto para el Senado.

- Recopilar datos de candidatos al Senado (por región/circunscripción)
- Diseñar interfaz para explorar y comparar candidatos al Senado
- Considerar integración con el flujo principal o como sección separada

## Motivación

El voto al Senado es parte de la misma jornada electoral. Dar herramientas para esa decisión complementa la experiencia.

## Categoría

🗳️ Decisión informada

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

create_issue \
  "Explorar Diputados" \
  "## Descripción

Ayudar al usuario a decidir su voto para la Cámara de Diputados.

- Recopilar datos de candidatos a Diputados (por circunscripción)
- Diseñar interfaz para explorar y comparar candidatos a Diputados
- Considerar integración con el flujo principal o como sección separada

## Motivación

El voto a Diputados es parte de la misma jornada electoral. Dar herramientas para esa decisión complementa la experiencia.

## Categoría

🗳️ Decisión informada

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

# ─── Experiencia de juego ──────────────────────────────────────

create_issue \
  "Mejorar Ranking Compartible" \
  "## Descripción

El podio ya se puede compartir; hacerlo más atractivo y viral.

- Mejorar el diseño visual de la imagen compartible (PodiumScreen)
- Agregar branding sutil para que se identifique la fuente
- Optimizar para las dimensiones de Instagram Stories, Twitter/X y WhatsApp
- Considerar agregar un CTA (call-to-action) en la imagen compartida

## Motivación

Compartir resultados es el principal motor de viralidad. Una imagen más atractiva genera más shares.

## Categoría

🎮 Experiencia de juego

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

create_issue \
  "Animaciones de Ataques Especiales" \
  "## Descripción

La Meta Épica: ataques únicos por candidato ⚡

- Diseñar animaciones de ataque especial para cada candidato en la pantalla VS
- Crear assets de animación (sprites o Lottie/Framer Motion)
- Implementar triggers de animación durante el gameplay
- Presupuesto estimado: S/ 1,000

## Motivación

Las animaciones únicas por candidato elevarían la experiencia de juego al nivel de un fighting game real, haciendo la experiencia memorable y compartible.

## Categoría

🎮 Experiencia de juego

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

create_issue \
  "Ranking Global" \
  "## Descripción

Mostrar quién está ganando entre todos los usuarios.

- Agregar endpoint para calcular ranking agregado de todos los usuarios
- Diseñar vista de ranking global (tabla o visualización)
- Considerar actualizaciones en tiempo real o periódicas
- Definir métricas: ¿porcentaje de victorias en torneos? ¿Elo agregado?

## Motivación

Un ranking global genera engagement recurrente y da contexto social a la experiencia individual.

## Categoría

🎮 Experiencia de juego

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

# ─── Mapa Político ─────────────────────────────────────────────

create_issue \
  "Usuario en el Mapa Político + Compartir" \
  "## Descripción

Que el usuario conteste preguntas y se ubique en el mapa político, y pueda compartir su posición.

- Diseñar cuestionario breve para ubicar al usuario en los 4 ejes
- Calcular y mostrar la posición del usuario en el mapa político
- Mostrar qué candidatos están más cerca del usuario
- Generar imagen compartible con la posición del usuario en el mapa

## Motivación

Personaliza la experiencia y ayuda al usuario a descubrir afinidades ideológicas que quizás no conocía.

## Categoría

🗺️ Mapa Político

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

create_issue \
  "Acerca en el Mapa Político" \
  "## Descripción

Explicar la metodología del mapa político directamente desde esa página.

- Agregar sección/modal \"Acerca de\" en la página del mapa político
- Explicar los 4 ejes y qué significan
- Describir cómo se asignaron las posiciones de los candidatos
- Citar fuentes y metodología utilizada

## Motivación

La transparencia metodológica genera confianza en la herramienta y ayuda al usuario a interpretar correctamente el mapa.

## Categoría

🗺️ Mapa Político

## Referencia

Idea del [ROADMAP.md](../ROADMAP.md)."

echo ""
echo "🎉 Done! Created $CREATED/13 issues successfully."

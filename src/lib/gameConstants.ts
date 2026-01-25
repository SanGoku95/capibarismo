/**
 * Game constants and configuration values.
 * Centralized location for all magic numbers used throughout the application.
 */

/**
 * Número de votos para mostrar el ranking preliminar.
 * A los 15 votos, el usuario puede ver un ranking inicial.
 */
export const PRELIMINARY_GOAL = 15;

/**
 * Número de votos recomendados para un ranking confiable.
 * Con 30 votos y 36 candidatos, cada candidato aparece ~1.7 veces en promedio.
 */
export const RECOMMENDED_GOAL = 30;

/**
 * @deprecated Use PRELIMINARY_GOAL instead
 * Kept for backward compatibility during migration
 */
export const COMPLETION_GOAL = PRELIMINARY_GOAL;

/**
 * Máximo número de intentos para encontrar un par no visto.
 * Previene loops infinitos durante generación de pares.
 * Con 36 candidatos hay 630 pares posibles, 100 intentos es más que suficiente.
 */
export const MAX_PAIR_SELECTION_ATTEMPTS = 100;

/**
 * Factor K del sistema ELO. Determina la velocidad de cambio de ratings.
 * Valores más altos = cambios más dramáticos por partido.
 *
 * Valores típicos:
 * - 40: Jugadores nuevos o amateur
 * - 32: Jugadores establecidos (usado aquí)
 * - 16: Jugadores masters/profesionales
 */
export const ELO_K = 32;

/**
 * Rating ELO inicial para todos los candidatos.
 * 1200 es el estándar para sistemas ELO (chess, gaming, etc).
 */
export const INITIAL_ELO = 1200;

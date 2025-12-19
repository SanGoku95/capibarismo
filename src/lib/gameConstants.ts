/**
 * Game constants and configuration values.
 * Centralized location for all magic numbers used throughout the application.
 */

/**
 * Número de votos requeridos para completar una sesión de juego.
 * Cuando el usuario alcanza este número, se muestra el modal de completado.
 */
export const COMPLETION_GOAL = 10;

/**
 * Máximo número de intentos para encontrar un par no visto.
 * Previene loops infinitos durante generación de pares.
 * Con 6 candidatos hay 15 pares posibles, 50 intentos es más que suficiente.
 */
export const MAX_PAIR_SELECTION_ATTEMPTS = 50;

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

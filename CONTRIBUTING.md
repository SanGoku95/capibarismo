# Contribuir a Presidential Punch Peru

¡Gracias por tu interés en contribuir! Este proyecto expone información sobre candidatos presidenciales peruanos siguiendo un protocolo riguroso de hechos.

### Principios Rectores
- **Empirismo**: Priorizamos perspectivas basadas en hechos y en el método cientítico.
- **Agencia**: Las personas establecen sus valores y perspectiva; nosotros exponemos un balance
- **Verificabilidad**: Cada afirmación es rastreable hasta fuentes primarias
- **Pluralismo**: Exponemos alternativas creíbles, no una sola "perspectiva"
- **Humildad**: Mostramos incertidumbre y qué cambiaría las conclusiones

## Cómo Contribuir

1. **Fork del repositorio**
2. **Clonar y configurar**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/presidential-punch-peru.git
   cd presidential-punch-peru
   npm install
   npm run dev
   ```
3. **Realizar cambios**
4. **Enviar Pull Request**

## Protocolo de Hechos

Si quieres cambiar datos de candidatos, debes seguir estrictamente este protocolo:

### Hechos Atómicos Únicamente
Cada elemento debe ser uno de: 
- **record** (voto/resultado/número)
- **cita** (cita literal + fuente)
- **oficial** (manifiesto/presentación oficial)
- **evento** (quién/qué/cuándo/dónde). Sin análisis mezclado.

### Fuentes Primarias Primero
Cada hecho debe tener ≥1 fuente primaria (lista de votación, ley en PDF, sitio oficial). Los enlaces a fuentes secundarias son opcionales.

### Tiempo y Alcance Fijados
Incluye `observed_at` y la jurisdicción/cargo al que aplica. Los hechos pueden cambiar; las marcas de tiempo no.

### Redacción Exacta, Sin Adjetivos
Sin intensificadores ("masivo", "controvertido") ni conjeturas modales. Usa números, unidades y atribución.

### Indicador de Incertidumbre
Si dos fuentes primarias creíbles se contradicen, marca `status: "contested"` y muestra ambos valores—no arbitres en el archivo de hechos.

### Regla de Simetría
Si destacas un tema para un candidato, debes intentar el hecho equivalente para sus pares (si no hay datos, indícalo como "no disponible").

### Paso de Verificación, No Editorial
Cada hecho termina con una instrucción de "Cómo verificar" de 1–2 líneas. Ese es tu empujón: procedimental, no retórico.

## Qué Aceptamos

- Corrección de errores técnicos
- Mejoras de funcionalidades
- Actualizaciones de documentación
- Correcciones de datos (siguiendo el Protocolo de Hechos)
- Traducciones

## Qué No Aceptamos

- Opiniones políticas o promoción de candidatos
- Información no verificada
- Cambios disruptivos sin discusión previa

---

Al contribuir, aceptas seguir nuestro [Código de Conducta](CODE_OF_CONDUCT.md) y el Protocolo de Hechos.
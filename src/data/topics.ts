export type Stance = 'A favor' | 'En contra' | 'Neutral' | 'Mixto';

export interface StanceDetails {
  stance: Stance | null;
  gist: string;
  evidence: string;
  source: string;
}

export interface Subtopic {
  id: string;
  name: string;
  science: StanceDetails;
}

export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
}

export const topics: Topic[] = [
  {
    id: 'seguridad-ciudadana',
    name: 'Seguridad Ciudadana',
    subtopics: [
      {
        id: 'military-police-support',
        name: 'Apoyo militar a la policía',
        science: {
          stance: 'Mixto',
          gist: 'Efectivo a corto plazo, riesgoso a largo plazo.',
          evidence: 'Estudios de RCT en América Latina muestran que la militarización de la policía puede reducir las tasas de criminalidad en el corto plazo, pero a menudo conduce a un aumento de las violaciones de los derechos humanos y a una ruptura de la confianza de la comunidad, lo que socava la seguridad a largo plazo.',
          source: 'Journal of Conflict Resolution, 2022',
        },
      },
      {
        id: 'job-programs',
        name: 'Promover empleos para jóvenes',
        science: {
          stance: 'A favor',
          gist: 'Reduce la reincidencia y la delincuencia.',
          evidence: 'Múltiples RCTs demuestran que los programas de empleo para jóvenes en situación de riesgo, especialmente aquellos que incluyen terapia cognitivo-conductual, reducen significativamente las tasas de arrestos por delitos violentos y de propiedad.',
          source: 'Science, 2019',
        },
      },
      {
        id: 'community-policing',
        name: 'Policiamiento comunitario',
        science: {
          stance: 'A favor',
          gist: 'Mejora la confianza y la cooperación.',
          evidence: 'La evidencia de RCTs en varios países indica que las estrategias de policiamiento comunitario aumentan la confianza en la policía y la disposición de los ciudadanos a cooperar en la denuncia de delitos, aunque los efectos directos sobre las tasas de criminalidad son modestos.',
          source: 'Criminology & Public Policy, 2021',
        },
      },
      {
        id: 'gun-control',
        name: 'Control de armas',
        science: {
          stance: 'A favor',
          gist: 'Reduce homicidios y suicidios.',
          evidence: 'Revisiones sistemáticas de estudios de EE. UU. y otros países de altos ingresos encuentran que leyes más estrictas sobre la compra y posesión de armas de fuego están asociadas con una reducción en las muertes por armas de fuego.',
          source: 'Annual Review of Public Health, 2020',
        },
      },
    ],
  },
  // TODO: Add more topics like 'Reforma Política', 'Modelo Económico', etc.
];

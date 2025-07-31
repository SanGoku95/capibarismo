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
  {
    id: 'modelo-economico',
    name: 'Modelo Económico',
    subtopics: [
      {
        id: 'mining-investment',
        name: 'Inversión Minera y Conflictos Sociales',
        science: {
          stance: 'Mixto',
          gist: 'Beneficios económicos vs. costos socioambientales.',
          evidence: 'Estudios de caso muestran que si bien la inversión minera puede impulsar el PBI local y nacional, a menudo genera conflictos socioambientales y no se traduce en desarrollo sostenible sin una gobernanza fuerte, consulta previa y distribución equitativa de ingresos.',
          source: 'World Development, 2021',
        },
      },
      {
        id: 'tax-reform',
        name: 'Reforma Tributaria (Impuestos a grandes fortunas)',
        science: {
          stance: 'Mixto',
          gist: 'Potencial recaudatorio vs. riesgo de fuga de capitales.',
          evidence: 'La evidencia internacional sobre impuestos a la riqueza es mixta. Mientras algunos estudios sugieren un potencial para reducir la desigualdad, otros señalan dificultades administrativas y el riesgo de evasión fiscal y fuga de capitales, especialmente en economías con alta informalidad.',
          source: 'Journal of Economic Perspectives, 2019',
        },
      },
      {
        id: 'informal-economy',
        name: 'Formalización de la Economía Informal',
        science: {
          stance: 'A favor',
          gist: 'Simplificación y beneficios superan a la fiscalización.',
          evidence: 'RCTs en varios países en desarrollo indican que las estrategias de formalización más efectivas son aquellas que simplifican drásticamente el registro y el pago de impuestos, y lo combinan con el acceso a beneficios (crédito, seguridad social), en lugar de centrarse únicamente en la fiscalización.',
          source: 'American Economic Review, 2020',
        },
      },
    ],
  },
  // TODO: Add more topics like 'Reforma Política', etc.
];

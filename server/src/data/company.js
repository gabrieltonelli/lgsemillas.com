import { env } from '../config/env.js';

export const getCompanyInfo = () => ({
  ...env.publicCompany,
  tagline: 'Genética de excelencia creada por agricultores para agricultores',
  subtitle:
    'Marca global de semillas de cultivos extensivos del grupo cooperativo francés Limagrain, con investigación, desarrollo y producción adaptada al campo argentino.',
  metrics: [
    {
      value: '+70',
      label: 'Programas Genéticos',
      detail: 'Red global de mejoramiento en maíz, girasol, trigo y soja.',
    },
    {
      value: '4.º',
      label: 'Semillero Mundial',
      detail: 'Respaldo internacional de la cooperativa francesa Limagrain.',
    },
    {
      value: '+50',
      label: 'Distribuidores Red Líder',
      detail: 'Asesoramiento técnico y llegada directa en todas las regiones.',
    },
    {
      value: '2011',
      label: 'En Argentina',
      detail: 'Operando en Pergamino e integrando el legado genético de Sursem.',
    },
  ],
  pillars: [
    {
      id: 'cooperativa',
      title: 'Espíritu Cooperativo y Visión a Largo Plazo',
      description:
        'Limagrain fue fundada y continúa siendo dirigida por agricultores de Auvernia (Francia). Cada inversión en genética vuelve al lote en forma de estabilidad, sanidad y rentabilidad sustentable.',
    },
    {
      id: 'pergamino',
      title: 'Estación Experimental y Planta en Pergamino',
      description:
        'Desde Ruta 32 Km. 2 en Pergamino, evaluamos miles de parcelas experimentales integrando genética internacional con el histórico programa local de Sursem.',
    },
    {
      id: 'bpa',
      title: 'Buenas Prácticas Agrícolas (BPA) y Refugio MRI',
      description:
        'Promovemos activamente los programas de Manejo de Resistencia de Insectos (MRI), calidad de siembra y rotaciones sustentables para cuidar la durabilidad de las biotecnologías.',
    },
  ],
  regions: [
    { id: 'Zona Núcleo', label: 'Zona Núcleo (Norte Bs. As. / Sur Sta. Fe / SE Cba.)' },
    { id: 'Oeste Arenoso', label: 'Oeste Arenoso / La Pampa' },
    { id: 'Centro Córdoba', label: 'Centro y Norte de Córdoba' },
    { id: 'Sur Buenos Aires', label: 'Sur y Sudeste de Buenos Aires' },
    { id: 'Entre Ríos', label: 'Entre Ríos / Litoral' },
    { id: 'NOA', label: 'Noroeste Argentino (NOA)' },
    { id: 'NEA', label: 'Noreste Argentino (NEA)' },
  ],
  careersAreas: [
    'Investigación y Mejoramiento Genético (I+D)',
    'Desarrollo Técnico y Ensayos a Campo',
    'Producción de Semillas y Planta Pergamino',
    'Comercial y Red Líder LG',
    'Administración, Finanzas y Supply Chain',
  ],
});


import { PRODUCTS, CATEGORIES } from '../../server/src/data/products.js';
import { DISTRIBUTORS } from '../../server/src/data/distributors.js';
import { ARTICLES } from '../../server/src/data/articles.js';
import {
  validateContactPayload,
  validateCareerPayload,
  validateRecommendPayload,
} from '../../server/src/routes/validators.js';

const normalize = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

const getPublicCompanyFromEnv = () => ({
  name: process.env.COMPANY_NAME || 'LG Semillas — Limagrain Argentina',
  group: process.env.COMPANY_GROUP || 'Limagrain Field Seeds',
  email: process.env.COMPANY_EMAIL || 'lgsemillas@limagrain.com',
  phone: process.env.COMPANY_PHONE || '+54 2477 430000',
  whatsapp: process.env.COMPANY_WHATSAPP || '+5492477430000',
  address:
    process.env.COMPANY_ADDRESS ||
    'Ruta 32 Km. 2, (2700) Pergamino, Provincia de Buenos Aires, Argentina',
  ethicsChannelUrl:
    process.env.ETHICS_CHANNEL_URL || 'https://www.limagrain.com/en/ethics-and-compliance',
  tagline: 'Genética de excelencia creada por agricultores para agricultores',
  subtitle:
    'Marca global de semillas de cultivos extensivos del grupo cooperativo francés Limagrain, con investigación, desarrollo y producción adaptada al campo argentino.',
  metrics: [
    { value: '+70', label: 'Programas Genéticos', detail: 'Red global de mejoramiento en maíz, girasol, trigo y soja.' },
    { value: '4.º', label: 'Semillero Mundial', detail: 'Respaldo internacional de la cooperativa francesa Limagrain.' },
    { value: '+50', label: 'Distribuidores Red Líder', detail: 'Asesoramiento técnico y llegada directa en todas las regiones.' },
    { value: '2011', label: 'En Argentina', detail: 'Operando en Pergamino e integrando el legado genético de Sursem.' },
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
        'Promovemos activamente los programas de Manejo de Resistencia de Insectos (MRI), calidad de siembra y rotaciones sustentables.',
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

export default async function handler(req) {
  const url = new URL(req.url);
  const subPath = url.pathname
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '') || '/';

  if (req.method === 'GET' && subPath === '/health') {
    return json({ ok: true, service: 'lgsemillas-netlify-api', timestamp: new Date().toISOString() });
  }

  if (req.method === 'GET' && subPath === '/company') {
    return json({ ok: true, company: getPublicCompanyFromEnv() });
  }

  if (req.method === 'GET' && subPath === '/products') {
    const category = url.searchParams.get('category') || 'all';
    const search = url.searchParams.get('search') || '';
    const technology = url.searchParams.get('technology') || 'all';
    const region = url.searchParams.get('region') || 'all';

    const qSearch = normalize(search);
    const qTech = normalize(technology);
    const qRegion = normalize(region);

    const items = PRODUCTS.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (technology !== 'all' && !item.technologies.some((t) => normalize(t) === qTech)) return false;
      if (region !== 'all' && !item.regions.some((r) => normalize(r).includes(qRegion))) return false;
      if (qSearch) {
        const haystack = normalize(
          `${item.name} ${item.categoryLabel} ${item.tagline} ${item.technology} ${item.description}`
        );
        if (!haystack.includes(qSearch)) return false;
      }
      return true;
    });

    return json({ ok: true, total: items.length, categories: CATEGORIES, items });
  }

  if (req.method === 'GET' && subPath.startsWith('/products/')) {
    const id = subPath.replace('/products/', '');
    const item = PRODUCTS.find((p) => p.id === id);
    if (!item) return json({ ok: false, error: 'Producto no encontrado.' }, 404);
    return json({ ok: true, item });
  }

  if (req.method === 'POST' && subPath === '/recommend') {
    const body = await req.json().catch(() => ({}));
    const { crop, region, sowingDate, priority, areaHa } = validateRecommendPayload(body);

    const candidates = PRODUCTS.filter((p) => (crop === 'all' ? true : p.category === crop));
    const recommendations = candidates
      .map((product) => {
        let fitScore = 0;
        const regionMatch = product.regions.some((r) => normalize(r) === normalize(region));
        const dateMatch = product.sowingDates.some((d) => normalize(d) === normalize(sowingDate));
        if (regionMatch) fitScore += 40;
        if (dateMatch) fitScore += 30;
        if (priority === 'rinde') fitScore += product.scores.yieldPotential * 0.35;
        else if (priority === 'sanidad') fitScore += product.scores.sanitaryProfile * 0.35;
        else fitScore += (product.scores.stability + product.scores.sanitaryProfile) * 0.18;

        let bagsEstimated = 0;
        let bagUnit = 'bolsas';
        if (product.category === 'maiz' || product.category === 'silo') {
          const seedsPerHa = sowingDate === 'Tardía' ? 64000 : 78000;
          bagsEstimated = Math.ceil((areaHa * seedsPerHa) / product.seedBagSize);
          bagUnit = 'bolsas (80.000 sem.)';
        } else if (product.category === 'girasol') {
          bagsEstimated = Math.ceil((areaHa * 55000) / product.seedBagSize);
          bagUnit = 'bolsas (150.000 sem.)';
        } else if (product.category === 'trigo') {
          const kgPerHa = sowingDate === 'Tardía' ? 130 : 110;
          bagsEstimated = Math.ceil((areaHa * kgPerHa) / product.seedBagSize);
          bagUnit = 'bolsas (40 kg)';
        } else {
          const kgPerHa = sowingDate === 'Tardía' ? 80 : 70;
          bagsEstimated = Math.ceil((areaHa * kgPerHa) / product.seedBagSize);
          bagUnit = 'bolsas (40 kg)';
        }

        return {
          ...product,
          fitScore: Math.round(fitScore),
          regionMatch,
          dateMatch,
          sowingEstimate: {
            areaHa,
            bagsEstimated,
            bagUnit,
            densityGuide:
              product.recommendedDensity[sowingDate] || product.recommendedDensity.Temprana,
          },
        };
      })
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, 3);

    return json({ ok: true, recommendations });
  }

  if (req.method === 'GET' && subPath === '/distributors') {
    const province = url.searchParams.get('province') || 'all';
    const search = url.searchParams.get('search') || '';
    const qProvince = normalize(province);
    const qSearch = normalize(search);

    const items = DISTRIBUTORS.filter((dist) => {
      if (province !== 'all' && normalize(dist.province) !== qProvince) return false;
      if (qSearch) {
        const haystack = normalize(
          `${dist.name} ${dist.city} ${dist.province} ${dist.region} ${dist.crops.join(' ')}`
        );
        if (!haystack.includes(qSearch)) return false;
      }
      return true;
    });

    const provinces = [...new Set(DISTRIBUTORS.map((d) => d.province))];
    return json({ ok: true, total: items.length, provinces, items });
  }

  if (req.method === 'GET' && subPath === '/articles') {
    return json({ ok: true, total: ARTICLES.length, items: ARTICLES });
  }

  if (req.method === 'POST' && subPath === '/contact') {
    const body = await req.json().catch(() => ({}));
    const result = validateContactPayload(body);
    if (!result.valid) return json({ ok: false, errors: result.errors }, 400);
    return json(
      {
        ok: true,
        ticketId: `LG-${Date.now().toString().slice(-6)}`,
        message:
          'Tu consulta fue registrada correctamente. Un representante técnico de LG Semillas / Red Líder se pondrá en contacto a la brevedad.',
      },
      201
    );
  }

  if (req.method === 'POST' && subPath === '/careers') {
    const body = await req.json().catch(() => ({}));
    const result = validateCareerPayload(body);
    if (!result.valid) return json({ ok: false, errors: result.errors }, 400);
    return json(
      {
        ok: true,
        applicationId: `RRHH-${Date.now().toString().slice(-6)}`,
        message:
          '¡Gracias por postularte a Limagrain Argentina! Tu perfil fue derivado al equipo de Talento Humano en Pergamino.',
      },
      201
    );
  }

  return json({ ok: false, error: 'Ruta API no encontrada.' }, 404);
}


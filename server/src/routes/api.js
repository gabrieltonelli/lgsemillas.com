import { Router } from 'express';
import { env } from '../config/env.js';
import { getCompanyInfo } from '../data/company.js';
import { PRODUCTS, CATEGORIES } from '../data/products.js';
import { DISTRIBUTORS } from '../data/distributors.js';
import { ARTICLES } from '../data/articles.js';
import {
  validateContactPayload,
  validateCareerPayload,
  validateRecommendPayload,
} from './validators.js';

const router = Router();

const normalize = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

// Estado del servicio (sin exponer credenciales ni secretos)
router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'lgsemillas-api',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Datos institucionales y regiones
router.get('/company', (_req, res) => {
  res.json({
    ok: true,
    company: getCompanyInfo(),
  });
});

// Catálogo de productos con filtros opcionales
router.get('/products', (req, res) => {
  const { category = 'all', search = '', technology = 'all', region = 'all' } = req.query;

  const qSearch = normalize(search);
  const qTech = normalize(technology);
  const qRegion = normalize(region);

  const items = PRODUCTS.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;

    if (technology !== 'all') {
      const hasTech = item.technologies.some((t) => normalize(t) === qTech);
      if (!hasTech) return false;
    }

    if (region !== 'all') {
      const hasRegion = item.regions.some((r) => normalize(r).includes(qRegion));
      if (!hasRegion) return false;
    }

    if (qSearch) {
      const haystack = normalize(
        `${item.name} ${item.categoryLabel} ${item.tagline} ${item.technology} ${item.description} ${item.highlights.join(' ')}`
      );
      if (!haystack.includes(qSearch)) return false;
    }

    return true;
  });

  res.json({
    ok: true,
    total: items.length,
    categories: CATEGORIES,
    items,
  });
});

// Ficha técnica por ID
router.get('/products/:id', (req, res) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({
      ok: false,
      error: 'No encontramos el híbrido o variedad solicitada.',
    });
  }
  return res.json({ ok: true, item: product });
});

// Recomendador Agronómico "Agro Point" + cálculo de bolsas por ha
router.post('/recommend', (req, res) => {
  const { crop, region, sowingDate, priority, areaHa } = validateRecommendPayload(req.body);

  let candidates = PRODUCTS.filter((p) => (crop === 'all' ? true : p.category === crop));

  const ranked = candidates
    .map((product) => {
      let fitScore = 0;
      const regionMatch = product.regions.some((r) => normalize(r) === normalize(region));
      const dateMatch = product.sowingDates.some((d) => normalize(d) === normalize(sowingDate));

      if (regionMatch) fitScore += 40;
      if (dateMatch) fitScore += 30;

      if (priority === 'rinde') {
        fitScore += product.scores.yieldPotential * 0.35;
      } else if (priority === 'sanidad') {
        fitScore += product.scores.sanitaryProfile * 0.35;
      } else {
        fitScore += (product.scores.stability + product.scores.sanitaryProfile) * 0.18;
      }

      // Cálculo agronómico orientativo de semillas/bolsas para el lote
      let bagsEstimated = 0;
      let bagUnit = 'bolsas';
      if (product.category === 'maiz' || product.category === 'silo') {
        const seedsPerHa = sowingDate === 'Tardía' ? 64000 : 78000;
        bagsEstimated = Math.ceil((areaHa * seedsPerHa) / product.seedBagSize);
        bagUnit = 'bolsas (80.000 sem.)';
      } else if (product.category === 'girasol') {
        const seedsPerHa = 55000;
        bagsEstimated = Math.ceil((areaHa * seedsPerHa) / product.seedBagSize);
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
            product.recommendedDensity[sowingDate] ||
            product.recommendedDensity.Temprana ||
            'Consultar con Red Líder LG',
        },
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3);

  res.json({
    ok: true,
    criteria: { crop, region, sowingDate, priority, areaHa },
    recommendations: ranked,
  });
});

// Buscador de distribuidores "Red Líder LG"
router.get('/distributors', (req, res) => {
  const { province = 'all', search = '' } = req.query;
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

  res.json({
    ok: true,
    total: items.length,
    provinces,
    items,
  });
});

// Artículos técnicos y novedades Agro Point
router.get('/articles', (_req, res) => {
  res.json({
    ok: true,
    total: ARTICLES.length,
    items: ARTICLES,
  });
});

// Recepción de formulario de Contacto Técnico / Comercial
router.post('/contact', (req, res) => {
  const result = validateContactPayload(req.body);
  if (!result.valid) {
    return res.status(400).json({
      ok: false,
      errors: result.errors,
    });
  }

  const ticketId = `LG-${Date.now().toString().slice(-6)}`;

  // Nota de seguridad: env.privateSecrets (SMTP / CRM) permanece exclusivamente en el servidor
  const hasMailTransport = Boolean(env.privateSecrets.smtpHost && env.privateSecrets.smtpUser);

  return res.status(201).json({
    ok: true,
    ticketId,
    message:
      'Tu consulta fue registrada correctamente. Un representante técnico de LG Semillas / Red Líder se pondrá en contacto a la brevedad.',
    meta: {
      receivedAt: new Date().toISOString(),
      channelReady: hasMailTransport,
    },
  });
});

// Recepción de postulaciones "Trabajá con Nosotros"
router.post('/careers', (req, res) => {
  const result = validateCareerPayload(req.body);
  if (!result.valid) {
    return res.status(400).json({
      ok: false,
      errors: result.errors,
    });
  }

  const applicationId = `RRHH-${Date.now().toString().slice(-6)}`;

  return res.status(201).json({
    ok: true,
    applicationId,
    message:
      '¡Gracias por postularte a Limagrain Argentina! Tu perfil fue derivado al equipo de Talento Humano en Pergamino.',
    meta: {
      receivedAt: new Date().toISOString(),
    },
  });
});

export default router;


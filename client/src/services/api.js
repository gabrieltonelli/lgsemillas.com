import { clientEnv } from '../config/env.js';
import {
  FALLBACK_ARTICLES,
  FALLBACK_CATEGORIES,
  FALLBACK_COMPANY,
  FALLBACK_DISTRIBUTORS,
  FALLBACK_PRODUCTS,
} from '../data/fallbackData.js';

const requestJson = async (path, options = {}) => {
  const url = `${clientEnv.apiBaseUrl}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errMsg =
      (Array.isArray(payload.errors) && payload.errors.join(' ')) ||
      payload.error ||
      `Error HTTP ${response.status}`;
    throw new Error(errMsg);
  }
  return payload;
};

export const apiService = {
  async getHealth() {
    try {
      return await requestJson('/health');
    } catch {
      return { ok: false, offlineMode: true };
    }
  },

  async getCompany() {
    try {
      const data = await requestJson('/company');
      return { company: data.company, fromApi: true };
    } catch {
      return { company: FALLBACK_COMPANY, fromApi: false };
    }
  },

  async getProducts(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.set('category', filters.category);
    if (filters.technology && filters.technology !== 'all')
      params.set('technology', filters.technology);
    if (filters.region && filters.region !== 'all') params.set('region', filters.region);
    if (filters.search) params.set('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    try {
      const data = await requestJson(`/products${query}`);
      return {
        items: data.items || [],
        categories: data.categories || FALLBACK_CATEGORIES,
        fromApi: true,
      };
    } catch {
      const q = (filters.search || '').toLowerCase();
      const filtered = FALLBACK_PRODUCTS.filter((item) => {
        if (filters.category && filters.category !== 'all' && item.category !== filters.category)
          return false;
        if (
          filters.technology &&
          filters.technology !== 'all' &&
          !item.technologies.includes(filters.technology)
        )
          return false;
        if (filters.region && filters.region !== 'all' && !item.regions.includes(filters.region))
          return false;
        if (q && !`${item.name} ${item.tagline} ${item.technology}`.toLowerCase().includes(q))
          return false;
        return true;
      });
      return { items: filtered, categories: FALLBACK_CATEGORIES, fromApi: false };
    }
  },

  async getRecommendations(criteria) {
    try {
      return await requestJson('/recommend', {
        method: 'POST',
        body: JSON.stringify(criteria),
      });
    } catch {
      const areaHa = Number(criteria.areaHa) || 100;
      const matches = FALLBACK_PRODUCTS.filter(
        (p) => criteria.crop === 'all' || p.category === criteria.crop
      )
        .slice(0, 3)
        .map((product) => ({
          ...product,
          fitScore: 92,
          regionMatch: product.regions.includes(criteria.region),
          dateMatch: product.sowingDates.includes(criteria.sowingDate),
          sowingEstimate: {
            areaHa,
            bagsEstimated: Math.ceil(areaHa * 0.95),
            bagUnit: 'bolsas estimadas',
            densityGuide:
              product.recommendedDensity[criteria.sowingDate] ||
              product.recommendedDensity.Temprana,
          },
        }));
      return { ok: true, recommendations: matches, offlineFallback: true };
    }
  },

  async getDistributors(filters = {}) {
    const params = new URLSearchParams();
    if (filters.province && filters.province !== 'all') params.set('province', filters.province);
    if (filters.search) params.set('search', filters.search);
    const query = params.toString() ? `?${params.toString()}` : '';

    try {
      return await requestJson(`/distributors${query}`);
    } catch {
      const q = (filters.search || '').toLowerCase();
      const items = FALLBACK_DISTRIBUTORS.filter((d) => {
        if (filters.province && filters.province !== 'all' && d.province !== filters.province)
          return false;
        if (q && !`${d.name} ${d.city} ${d.province} ${d.region}`.toLowerCase().includes(q))
          return false;
        return true;
      });
      return {
        items,
        provinces: [...new Set(FALLBACK_DISTRIBUTORS.map((d) => d.province))],
        fromApi: false,
      };
    }
  },

  async getArticles() {
    try {
      const data = await requestJson('/articles');
      return data.items || FALLBACK_ARTICLES;
    } catch {
      return FALLBACK_ARTICLES;
    }
  },

  async submitContact(formData) {
    return requestJson('/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  async submitCareer(formData) {
    return requestJson('/careers', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },
};


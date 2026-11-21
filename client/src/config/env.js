// Configuración pública del cliente: solo variables VITE_* seguras.
// NUNCA importar ni declarar credenciales privadas aquí.

export const clientEnv = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, ''),
  siteName: import.meta.env.VITE_SITE_NAME || 'LG Semillas — Limagrain Argentina',
  companyGroup: import.meta.env.VITE_COMPANY_GROUP || 'Limagrain Field Seeds',
  contactEmail: import.meta.env.VITE_PUBLIC_CONTACT_EMAIL || 'lgsemillas@limagrain.com',
  phone: import.meta.env.VITE_PUBLIC_PHONE || '+54 2477 430000',
  whatsapp: (import.meta.env.VITE_PUBLIC_WHATSAPP || '5492477430000').replace(/\D/g, ''),
  whatsappShortlink: import.meta.env.VITE_WHATSAPP_SHORTLINK || 'https://wa.link/x5ez2m',
  hqAddress:
    import.meta.env.VITE_PUBLIC_HQ_ADDRESS ||
    'Ruta 32 Km. 2, (2700) Pergamino, Provincia de Buenos Aires, Argentina',
  ethicsUrl:
    import.meta.env.VITE_ETHICS_URL || 'https://www.limagrain.com/en/ethics-and-compliance',
  defaultRegion: import.meta.env.VITE_DEFAULT_REGION || 'Zona Núcleo',
};


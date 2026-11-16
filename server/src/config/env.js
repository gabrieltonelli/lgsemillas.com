import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carga server/.env cuando se ejecuta desde server/ o desde la raíz del monorepo
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseOrigins = (raw) => {
  if (!raw || raw.trim() === '*') return ['*'];
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const env = {
  port: parsePositiveInt(process.env.PORT, 4580),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN || 'http://localhost:5580'),
  rateLimit: {
    windowMs: parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    maxRequests: parsePositiveInt(process.env.RATE_LIMIT_MAX_REQUESTS, 150),
  },
  // Información pública institucional (segura para devolver al cliente)
  publicCompany: {
    name: process.env.COMPANY_NAME || 'LG Semillas — Limagrain Argentina',
    group: process.env.COMPANY_GROUP || 'Limagrain Field Seeds',
    email: process.env.COMPANY_EMAIL || 'lgsemillas@limagrain.com',
    phone: process.env.COMPANY_PHONE || '+54 2477 430000',
    whatsapp: process.env.COMPANY_WHATSAPP || '+5492477430000',
    address:
      process.env.COMPANY_ADDRESS ||
      'Ruta 32 Km. 2, (2700) Pergamino, Provincia de Buenos Aires, Argentina',
    ethicsChannelUrl:
      process.env.ETHICS_CHANNEL_URL ||
      'https://www.limagrain.com/en/ethics-and-compliance',
  },
  // Credenciales y secretos internos: jamás serializar en respuestas HTTP
  privateSecrets: {
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: parsePositiveInt(process.env.SMTP_PORT, 587),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    contactRecipient: process.env.CONTACT_RECIPIENT_EMAIL || 'lgsemillas@limagrain.com',
    careersRecipient: process.env.CAREERS_RECIPIENT_EMAIL || 'rrhh.argentina@limagrain.com',
    crmApiKey: process.env.CRM_API_KEY || '',
    crmWebhookSecret: process.env.CRM_WEBHOOK_SECRET || '',
  },
};


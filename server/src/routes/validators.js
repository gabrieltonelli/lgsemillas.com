const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sanitizeText = (value, maxLength = 1000) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

export const validateContactPayload = (body = {}) => {
  const errors = [];
  const name = sanitizeText(body.name, 120);
  const email = sanitizeText(body.email, 160);
  const phone = sanitizeText(body.phone, 50);
  const province = sanitizeText(body.province, 80);
  const cropInterest = sanitizeText(body.cropInterest, 80);
  const message = sanitizeText(body.message, 2000);

  if (name.length < 2) errors.push('Ingresá tu nombre y apellido.');
  if (!EMAIL_REGEX.test(email)) errors.push('Ingresá un correo electrónico válido.');
  if (province.length < 2) errors.push('Seleccioná o indicá tu provincia o localidad.');
  if (message.length < 8) errors.push('Contanos brevemente tu consulta (mínimo 8 caracteres).');

  return {
    valid: errors.length === 0,
    errors,
    data: { name, email, phone, province, cropInterest, message },
  };
};

export const validateCareerPayload = (body = {}) => {
  const errors = [];
  const name = sanitizeText(body.name, 120);
  const email = sanitizeText(body.email, 160);
  const phone = sanitizeText(body.phone, 50);
  const area = sanitizeText(body.area, 120);
  const linkedin = sanitizeText(body.linkedin, 250);
  const message = sanitizeText(body.message, 2000);

  if (name.length < 2) errors.push('Ingresá tu nombre completo.');
  if (!EMAIL_REGEX.test(email)) errors.push('Ingresá un correo electrónico válido.');
  if (area.length < 2) errors.push('Seleccioná el área de interés.');
  if (message.length < 8) errors.push('Agregá una breve presentación profesional.');

  return {
    valid: errors.length === 0,
    errors,
    data: { name, email, phone, area, linkedin, message },
  };
};

export const validateRecommendPayload = (body = {}) => {
  const crop = sanitizeText(body.crop || 'maiz', 40).toLowerCase();
  const region = sanitizeText(body.region || 'Zona Núcleo', 80);
  const sowingDate = sanitizeText(body.sowingDate || 'Temprana', 40);
  const priority = sanitizeText(body.priority || 'equilibrio', 40).toLowerCase();
  const parsedArea = Number(body.areaHa);
  const areaHa = Number.isFinite(parsedArea) && parsedArea > 0 ? Math.min(parsedArea, 50000) : 100;

  return { crop, region, sowingDate, priority, areaHa };
};


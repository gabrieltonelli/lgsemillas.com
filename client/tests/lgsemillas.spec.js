import { test, expect } from '@playwright/test';

const SCREENSHOT_DIR = './screenshots';

test.describe('LG Semillas — Pruebas Funcionales y Auditoría Visual 2026', () => {
  test('1. Desktop: Header bicolor oficial, Logo, Hero 3 escenas, Canvas y Split Limagrain', async ({
    page,
  }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');

    // Header bicolor: bloque rojo izquierdo (#E3002C) con logo blanco + barra blanca derecha
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const logoBlock = header.locator('a[aria-label="Inicio LG Semillas"]');
    const logoBlockBg = await logoBlock.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(logoBlockBg).toContain('227, 0, 44');

    const headerBg = await header.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(headerBg).toContain('255, 255, 255');

    const headerLogo = header.locator('img[src="/assets/logo/logonuevo04.png"]');
    await expect(headerLogo).toBeVisible();
    const logoLoaded = await headerLogo.evaluate((img) => img.complete && img.naturalWidth > 0);
    expect(logoLoaded).toBe(true);

    // Hero Scene 1: Juntos producimos mejor + Canvas interactivo
    await expect(page.locator('#inicio canvas')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-home.png`, fullPage: false });

    // Navegación del carrusel hacia Slide 2 ("Somos LG")
    await page.getByRole('button', { name: 'Escena siguiente' }).click();
    await expect(page.locator('#inicio img[src="/assets/hero/somoslg.png"]')).toBeVisible();

    // Sección Split 50/50 Limagrain + edificio oficial + modal historia
    const nosotros = page.locator('#nosotros');
    await nosotros.scrollIntoViewIfNeeded();
    await expect(nosotros.getByRole('heading', { name: 'Limagrain', exact: true })).toBeVisible();
    const officeImgLoaded = await nosotros
      .locator('img[src="/assets/hero/oficina.jpg"]')
      .evaluate((img) => img.complete && img.naturalWidth > 0);
    expect(officeImgLoaded).toBe(true);

    await nosotros.getByRole('button', { name: /Descubrí más de/i }).click();
    await expect(page.getByRole('heading', { name: /Limagrain y LG Semillas/i })).toBeVisible();
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click();

    expect(consoleErrors).toEqual([]);
  });

  test('2. Damero 50/50, Banner Productos 2026, Filtros, Ficha Técnica y Comparador', async ({
    page,
  }) => {
    await page.goto('/');

    // Click en el damero de Girasol -> filtra catálogo
    const girasolTile = page
      .locator('section[aria-label="Cultivos LG Semillas"] [role="button"]')
      .filter({ hasText: 'GIRASOL' });
    await girasolTile.scrollIntoViewIfNeeded();
    await girasolTile.click();

    await expect(page.locator('#catalogo h3', { hasText: 'LG 5710 CL' })).toBeVisible();
    await expect(page.locator('#catalogo h3', { hasText: 'LG 30680 VIP3' })).toHaveCount(0);

    // Captura del damero + banner Productos 2026
    await page.locator('#productos-2026').scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: 'Productos 2026' })).toBeVisible();
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-banner-2026.png`, fullPage: false });

    // Volver a Todos los Cultivos en la grilla y capturar catálogo
    await page.getByRole('button', { name: 'Todos los Cultivos' }).click();
    await expect(page.locator('#catalogo h3', { hasText: 'LG 30680 VIP3' })).toBeVisible();
    await page.locator('#catalogo').scrollIntoViewIfNeeded();
    await page.waitForTimeout(550);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-catalog.png`, fullPage: false });

    // Ficha Técnica Modal
    const firstCard = page.locator('#catalogo article').first();
    await firstCard.getByRole('button', { name: 'Ficha Técnica' }).click();
    await expect(page.getByText(/Perfil Sanitario y Agronómico/i)).toBeVisible();
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click();

    // Comparador 2 semillas
    const compareButtons = page.locator('#catalogo article button', { hasText: 'Comparar' });
    await compareButtons.nth(0).click();
    await compareButtons.nth(1).click();
    await page.getByRole('button', { name: 'Comparar Ahora' }).click();
    await expect(page.getByRole('heading', { name: 'Comparador Técnico LG Semillas' })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('3. Agro Point, Videos Novedades, Red Líder Geolocalizado, Contáctenos Rojo y Footer Blanco', async ({
    page,
  }) => {
    await page.goto('/');

    // Agro Point
    await page.locator('#recomendador').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Calcular Recomendación para mi Lote' }).click();
    await expect(page.getByText(/Materiales Recomendados/i)).toBeVisible();

    // Novedades / Videos YouTube oficiales
    const novedades = page.locator('#novedades');
    await novedades.scrollIntoViewIfNeeded();
    await expect(novedades.getByText(/Enraízados en el Propósito/i)).toBeVisible();
    await expect(novedades.getByText(/T\. Reynal e I\. Martínez/i)).toBeVisible();
    await novedades.locator('button[aria-label^="Reproducir video:"]').first().click();
    await expect(novedades.locator('iframe[src*="youtube.com/embed/dR6MN8LLEQw"]')).toBeVisible();

    // Red Líder LG (57 puntos geolocalizados + mapa SVG)
    const redLider = page.locator('#red-lider');
    await redLider.scrollIntoViewIfNeeded();
    await expect(redLider.getByText(/57 agentes oficiales/i)).toBeVisible();
    const mapPinsCount = await redLider.locator('svg g[role="button"]').count();
    expect(mapPinsCount).toBe(57);

    // Filtrar por Buenos Aires y contactar agente seleccionado
    await redLider.getByRole('button', { name: 'Buenos Aires', exact: true }).click();
    await expect(redLider.getByText(/agentes oficiales/i)).not.toHaveText(/57 agentes/i);
    await redLider.locator('button', { hasText: 'Contactar Agente' }).first().click();

    // Contáctenos duotono rojo prellenado + envío real a API
    const contacto = page.locator('#contacto');
    await expect(contacto.locator('#contact-province')).not.toHaveValue('');
    await contacto.locator('#contact-name').fill('Juan Carlos Productor');
    await contacto.locator('#contact-email').fill('juan@estancialapampa.com.ar');
    await contacto.locator('#contact-message').fill('Consulta técnica por semillas de maíz VIP3 en Pergamino.');
    await contacto.getByRole('button', { name: /ENVIAR/i }).click();
    await expect(contacto.getByRole('status')).toContainText(/Ticket:/i);

    // Footer blanco oficial con logo3.png y limagrain.png
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    const footerBg = await footer.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(footerBg).toContain('255, 255, 255');
    const footerLogosLoaded = await footer.evaluate((el) =>
      [...el.querySelectorAll('img')].every((img) => img.complete && img.naturalWidth > 0)
    );
    expect(footerLogosLoaded).toBe(true);

    // Chatbot AgroBot LG + link WhatsApp oficial
    const botBtn = page.getByRole('button', { name: /Abrir asistente WhatsApp AgroBot LG/i });
    await botBtn.click();
    await expect(page.getByText('AgroBot · LG Semillas')).toBeVisible();
    await expect(page.getByRole('link', { name: /Abrir chat oficial en WhatsApp/i })).toHaveAttribute(
      'href',
      'https://wa.link/x5ez2m'
    );
    await page.getByRole('button', { name: /Cerrar asistente/i }).click().catch(async () => {
      await botBtn.click();
    });

    // Captura completa de la página para auditoría visual
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-full.png`, fullPage: true });
  });

  test('4. Mobile (390x844): Cero desborde horizontal, Menú Drawer y Secciones Responsivas', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForTimeout(500);

    const overflowTop = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(overflowTop.scrollWidth).toBeLessThanOrEqual(overflowTop.innerWidth);

    await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile-home.png`, fullPage: false });

    // Abrir y cerrar menú móvil
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await expect(page.getByText('Menú Oficial')).toBeVisible();
    await page.getByRole('button', { name: 'Cerrar menú' }).click();

    // Desplazarse por todo el sitio en mobile y confirmar 0 desborde horizontal
    await page.locator('#red-lider').scrollIntoViewIfNeeded();
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.waitForTimeout(350);

    const overflowBottom = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(overflowBottom.scrollWidth).toBeLessThanOrEqual(overflowBottom.innerWidth);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile-full.png`, fullPage: true });
    await context.close();
  });
});

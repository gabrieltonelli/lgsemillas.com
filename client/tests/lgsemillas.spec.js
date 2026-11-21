import { test, expect } from '@playwright/test';

const SCREENSHOT_DIR = './screenshots';

test.describe('LG Semillas — Pruebas Funcionales, Rutas Independientes y Auditoría Visual 2026', () => {
  test('1. Home (/): Header bicolor, Botones iguales en #productos-2026, Orden exacto y Secciones separadas', async ({
    page,
  }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');

    // Header bicolor oficial
    const header = page.locator('header');
    await expect(header).toBeVisible();
    const logoBlockBg = await header
      .locator('a[aria-label="Inicio LG Semillas"]')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(logoBlockBg).toContain('227, 0, 44');

    const headerBg = await header.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(headerBg).toContain('255, 255, 255');

    const logoLoaded = await header
      .locator('img[src="/assets/logo/logonuevo04.png"]')
      .evaluate((img) => img.complete && img.naturalWidth > 0);
    expect(logoLoaded).toBe(true);

    // Verificar que las secciones movidas NO están en el Home (/)
    await expect(page.locator('#catalogo')).toHaveCount(0);
    await expect(page.locator('#recomendador')).toHaveCount(0);
    await expect(page.locator('#red-lider')).toHaveCount(0);
    await expect(
      page.getByText('Informes técnicos, ensayos y Buenas Prácticas Agrícolas')
    ).toHaveCount(0);

    // Captura superior del Hero + Header
    await expect(page.locator('#inicio canvas')).toBeVisible();
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-home.png`, fullPage: false });

    // Verificar orden vertical estricto en Home: #inicio -> #nosotros -> #productos-2026 -> #novedades -> #contacto -> footer
    const verticalOrder = await page.evaluate(() => {
      const ids = ['inicio', 'nosotros', 'productos-2026', 'novedades', 'contacto'];
      const tops = ids.map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : -1;
      });
      const footerEl = document.querySelector('footer');
      const footerTop = footerEl ? footerEl.getBoundingClientRect().top + window.scrollY : -1;
      return [...tops, footerTop];
    });
    expect(verticalOrder.every((pos) => pos >= 0)).toBe(true);
    for (let i = 1; i < verticalOrder.length; i += 1) {
      expect(verticalOrder[i]).toBeGreaterThan(verticalOrder[i - 1]);
    }

    // Verificar que los 5 botones circulares de #productos-2026 tienen exactamente el mismo tamaño
    const bannerSection = page.locator('#productos-2026');
    await bannerSection.scrollIntoViewIfNeeded();
    await expect(bannerSection.getByRole('heading', { name: 'Productos 2026' })).toBeVisible();

    const circleButtons = bannerSection.locator('button[aria-label^="Filtrar por "]');
    await expect(circleButtons).toHaveCount(5);

    const checkEqualSizes = async () => {
      const boxes = await circleButtons.evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return { w: Math.round(r.width), h: Math.round(r.height) };
        })
      );
      for (const b of boxes) {
        expect(b.w).toBe(boxes[0].w);
        expect(b.h).toBe(boxes[0].h);
      }
    };

    await checkEqualSizes();
    await circleButtons.nth(1).click();
    await page.waitForTimeout(250);
    await checkEqualSizes();

    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-banner-2026.png`, fullPage: false });

    // Verificar #novedades (solo videos YouTube) inmediatamente después de #productos-2026
    const novedades = page.locator('#novedades');
    await novedades.scrollIntoViewIfNeeded();
    await expect(novedades.getByRole('heading', { name: /Enraízados en el Propósito/i })).toBeVisible();
    await expect(novedades.getByRole('heading', { name: /T\. Reynal e I\. Martínez/i })).toBeVisible();

    // Captura completa del Home rediseñado
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-home-full.png`, fullPage: true });

    expect(consoleErrors).toEqual([]);
  });

  test('2. Ruta Independiente (/catalogo): Menú -> #catalogo, Filtros, Ficha Técnica y Comparador', async ({
    page,
  }) => {
    await page.goto('/');

    // Navegar a /catalogo desde el menú superior
    await page.locator('header nav a', { hasText: 'CATÁLOGO' }).click();
    await expect(page).toHaveURL(/\/catalogo$/);
    await expect(page.locator('#catalogo')).toBeVisible();

    // Filtrar por Girasol y volver a Todos los Cultivos
    await page.getByRole('button', { name: 'Girasol', exact: true }).click();
    await expect(page.locator('#catalogo h3', { hasText: 'LG 5710 CL' })).toBeVisible();
    await expect(page.locator('#catalogo h3', { hasText: 'LG 30680 VIP3' })).toHaveCount(0);

    await page.getByRole('button', { name: 'Todos los Cultivos' }).click();
    await expect(page.locator('#catalogo h3', { hasText: 'LG 30680 VIP3' })).toBeVisible();
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-catalog.png`, fullPage: false });

    // Ficha Técnica Modal
    const firstCard = page.locator('#catalogo article').first();
    await firstCard.getByRole('button', { name: 'Ficha Técnica' }).click();
    await expect(page.getByText(/Perfil Sanitario y Agronómico/i)).toBeVisible();
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click();

    // Comparador con 2 materiales
    const compareButtons = page.locator('#catalogo article button', { hasText: 'Comparar' });
    await compareButtons.nth(0).click();
    await compareButtons.nth(1).click();
    await page.getByRole('button', { name: 'Comparar Ahora' }).click();
    await expect(page.getByRole('heading', { name: 'Comparador Técnico LG Semillas' })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('3. Rutas Independientes (/agro-point, /informes, /red-lider) y Flujo a #contacto + Footer', async ({
    page,
  }) => {
    await page.goto('/');

    // /agro-point
    await page.locator('header nav a', { hasText: 'AGRO POINT' }).click();
    await expect(page).toHaveURL(/\/agro-point$/);
    await expect(page.locator('#recomendador')).toBeVisible();
    await page.getByRole('button', { name: 'Calcular Recomendación para mi Lote' }).click();
    await expect(page.getByText(/Materiales Recomendados/i)).toBeVisible();

    // /informes
    await page.locator('header nav a', { hasText: 'INFORMES' }).click();
    await expect(page).toHaveURL(/\/informes$/);
    await expect(
      page.getByRole('heading', { name: /Informes técnicos, ensayos y Buenas Prácticas Agrícolas/i })
    ).toBeVisible();
    await page.getByRole('button', { name: /Leer informe completo/i }).first().click();
    await expect(page.getByRole('button', { name: 'Cerrar informe' })).toBeVisible();
    await page.getByRole('button', { name: 'Cerrar informe' }).click();

    // /red-lider
    await page.locator('header nav a', { hasText: 'RED LÍDER' }).click();
    await expect(page).toHaveURL(/\/red-lider$/);
    const redLider = page.locator('#red-lider');
    await expect(redLider.getByText(/57 agentes oficiales/i)).toBeVisible();
    const mapPinsCount = await redLider.locator('svg g[role="button"]').count();
    expect(mapPinsCount).toBe(57);

    // Filtrar por Buenos Aires y contactar agente -> redirige a /#contacto prellenado
    await redLider.getByRole('button', { name: 'Buenos Aires', exact: true }).click();
    await expect(redLider.getByText(/agentes oficiales/i)).not.toHaveText(/57 agentes/i);
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/desktop-red-lider.png`, fullPage: false });

    await redLider.locator('button', { hasText: 'Contactar Agente' }).first().click();
    await expect(page).toHaveURL(/\/#contacto$/);

    const contacto = page.locator('#contacto');
    await expect(contacto.locator('#contact-province')).not.toHaveValue('');
    await contacto.locator('#contact-name').fill('Juan Carlos Productor');
    await contacto.locator('#contact-email').fill('juan@estancialapampa.com.ar');
    await contacto.locator('#contact-message').fill('Consulta técnica por semillas de maíz VIP3 en Pergamino.');
    await contacto.getByRole('button', { name: /ENVIAR/i }).click();
    await expect(contacto.getByRole('status')).toContainText(/Ticket:/i);

    // Footer blanco
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    const footerBg = await footer.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(footerBg).toContain('255, 255, 255');
    const footerLogosLoaded = await footer.evaluate((el) =>
      [...el.querySelectorAll('img')].every((img) => img.complete && img.naturalWidth > 0)
    );
    expect(footerLogosLoaded).toBe(true);

    // Chatbot AgroBot LG
    const botBtn = page.getByRole('button', { name: /Abrir asistente WhatsApp AgroBot LG/i });
    await botBtn.click();
    await expect(page.getByText('AgroBot · LG Semillas')).toBeVisible();
    await expect(page.getByRole('link', { name: /Abrir chat oficial en WhatsApp/i })).toHaveAttribute(
      'href',
      'https://wa.link/x5ez2m'
    );
  });

  test('4. Mobile (390x844): Cero desborde horizontal, Menú Drawer a páginas independientes', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto('/');
    await page.waitForTimeout(450);

    const overflowTop = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(overflowTop.scrollWidth).toBeLessThanOrEqual(overflowTop.innerWidth);
    await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile-home.png`, fullPage: false });

    // Verificar botones circulares iguales en mobile
    const bannerMobile = page.locator('#productos-2026');
    await bannerMobile.scrollIntoViewIfNeeded();
    const mobileCircles = bannerMobile.locator('button[aria-label^="Filtrar por "]');
    const mobileBoxes = await mobileCircles.evaluateAll((els) =>
      els.map((el) => ({
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height),
      }))
    );
    for (const mb of mobileBoxes) {
      expect(mb.w).toBe(mobileBoxes[0].w);
      expect(mb.h).toBe(mobileBoxes[0].h);
    }

    // Navegar a /catalogo desde el Menú Drawer móvil
    await page.getByRole('button', { name: 'Abrir menú' }).click();
    await expect(page.getByText('Menú Oficial')).toBeVisible();
    await page.getByRole('link', { name: /CATÁLOGO TÉCNICO/i }).click();
    await expect(page).toHaveURL(/\/catalogo$/);
    await expect(page.locator('#catalogo')).toBeVisible();

    const overflowCatalog = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(overflowCatalog.scrollWidth).toBeLessThanOrEqual(overflowCatalog.innerWidth);
    await context.close();
  });
});

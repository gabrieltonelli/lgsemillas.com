# LG Semillas — Limagrain Argentina (`lgsemillas.com`)

Rediseño integral del portal oficial de **LG Semillas (Limagrain Argentina)**, implementado como un **monorepo dividido en `client/` y `server/`**, sin `package.json` ni `node_modules` en la raíz, con variables de entorno independientes para cada aplicación, preparado para desarrollo local con `npm run dev`, contenedores Docker locales y despliegue en **Netlify**.

---

## Arquitectura del Monorepo

```text
lgsemillas.com/
├── .env.template                 # Plantilla comentada para orquestación Docker Compose
├── docker-compose.yml            # Orquesta frontend (Nginx) y backend (Node/Express)
├── netlify.toml                  # Configuración de build, SPA fallback y Netlify Functions
├── netlify/
│   └── functions/
│       └── api.mjs               # API serverless para Netlify sin dependencias en raíz
├── client/                       # Frontend React + Vite + Tailwind CSS (node_modules propio)
│   ├── .env.template             # Variables públicas VITE_* (cero credenciales privadas)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
└── server/                       # Backend Node.js + Express (node_modules propio)
    ├── .env.template             # Parámetros del servidor y credenciales backend-only
    ├── Dockerfile
    └── src/
```

> **Regla de aislamiento:** No existen `package.json` ni `node_modules` en la raíz del proyecto. Las dependencias viven exclusivamente dentro de `client/node_modules` y `server/node_modules`.

---

## Funcionalidades Principales del Rediseño

1. **Home Fiel a la Identidad Oficial (`/` — `Navbar.jsx`, `Hero.jsx`, `AboutSection.jsx`, `ProductCatalog.jsx`, `NewsSection.jsx`, `ContactSection.jsx`, `Footer.jsx`)**:
   - Encabezado bicolor con bloque rojo `#E3002C` y logo oficial **"LG 60 años"**, tipografía `Microbrew-Soft-Four` (`@font-face` local), carrusel Hero de 3 escenas con Canvas 2D interactivo, sección split 50/50 de **Limagrain Argentina** (`oficina.jpg`), damero de 5 cultivos + banner **Productos 2026**, grilla oficial de videos en `#novedades`, formulario duotono rojo en `#contacto` y pie institucional blanco.
2. **Páginas Independientes Accesibles desde el Menú (`/catalogo`, `/agro-point`, `/informes`, `/red-lider`)**:
   - **`/catalogo` (`ProductCatalog.jsx` modo página)**: Explorador técnico de **Maíz Grano**, **Maíz Silo**, **Girasol**, **Trigo ("La Tropilla del Rinde")** y **Soja**, filtros por cultivo, tecnología (`VIP3`, `VT3P`, `RR2`, `CL`, `HO`, `STS`, `Convencional`) y región, modal de **Ficha Técnica Completa** y **Comparador Técnico** de hasta 3 semillas.
   - **`/agro-point` (`AgroAdvisor.jsx` + `POST /api/recommend`)**: Recomendador agronómico por cultivo, región y fecha de siembra con cálculo estimado de bolsas por hectárea.
   - **`/informes` (`NewsSection.jsx` modo informes + `GET /api/articles`)**: Informes técnicos sobre complejo de achaparramiento (*Dalbulus maidis* / *Spiroplasma*), calidad de silaje (*stay-green* y FDND), estrategia en trigo y Programa MRI (10% refugio).
   - **`/red-lider` (`RedLiderMap.jsx` + `GET /api/distributors`)**: Mapa SVG interactivo geolocalizado con los **57 distribuidores oficiales** en Argentina y Uruguay, filtro por provincia/búsqueda, portal **LG Líder** y prellenado de consulta comercial hacia `/#contacto`.
6. **Contáctenos Duotono, Trabajá con Nosotros y Canal Ético (`ContactSection.jsx`)**:
   - Sección full-bleed duotono rojo (`form.jpg`), formularios validados en el backend (`POST /api/contact`, `POST /api/careers`), enlace directo a WhatsApp comercial, sede central en Pergamino (Ruta 32 Km. 2), acceso al Código de Conducta / Canal Ético y footer blanco institucional oficial.
7. **Motion Design (`GSAP` + `genjutsu:cast`), Chatbot WhatsApp (`WhatsAppChatbot.jsx`) y Mobile-First**:
   - Paleta oficial de `lgsemillas.com` (`#E3002C`, `#a20513`, `#100f26`, `#6f6f6e`, `#f3f3f3`) con logos, favicons, íconos y fotografías reales en `client/public/assets/`.
   - Tarjetas 3D con spotlight radial y animaciones GSAP (`useGSAP` + `ScrollTrigger`) con respeto estricto a `prefers-reduced-motion`.
   - Chatbot flotante **AgroBot LG** con atajos y envío directo mediante `VITE_WHATSAPP_SHORTLINK`.
   - Menú *drawer* móvil accesible, botones ≥ 42–48 px y cero desborde horizontal.

---

## Variables de Entorno y Seguridad

Nunca versiones archivos `.env` reales (están excluidos en `.gitignore`). Utiliza las plantillas `.env.template`:

| Ámbito | Archivo Plantilla | Propósito y Seguridad |
| :--- | :--- | :--- |
| **Frontend** | `client/.env.template` | Solo parámetros públicos con prefijo `VITE_` (`VITE_API_BASE_URL`, `VITE_DEV_PROXY_TARGET`, `VITE_DEV_PORT`, `VITE_SITE_NAME`, `VITE_PUBLIC_CONTACT_EMAIL`, `VITE_PUBLIC_PHONE`, `VITE_PUBLIC_WHATSAPP`, `VITE_WHATSAPP_SHORTLINK`, `VITE_PUBLIC_HQ_ADDRESS`, `VITE_ETHICS_URL`, `VITE_DEFAULT_REGION`). **No almacena ni expone credenciales privadas.** |
| **Backend** | `server/.env.template` | Configura puerto (`4580`), CORS, rate limiting (`helmet` + `express-rate-limit`), datos institucionales y credenciales privadas exclusivas del servidor (`SMTP_*`, `CRM_API_KEY`, `CRM_WEBHOOK_SECRET`), que nunca se serializan en respuestas HTTP. |
| **Raíz (Docker)** | `.env.template` | Parametriza puertos (`CLIENT_DOCKER_PORT=8580`, `SERVER_DOCKER_PORT=4580`) y argumentos de build de `docker-compose.yml`. |

---

## Cómo Ejecutar el Proyecto

### 1. Desarrollo Local (por separado en `server` y `client`)

**Terminal 1 — Backend (`server`):**

```bash
cd server
cp .env.template .env   # En Windows PowerShell: Copy-Item .env.template .env
npm install
npm run dev
```

El servidor quedará escuchando por defecto en `http://localhost:4580/api`.

**Terminal 2 — Frontend (`client`):**

```bash
cd client
cp .env.template .env   # En Windows PowerShell: Copy-Item .env.template .env
npm install
npm run dev
```

El frontend quedará disponible en `http://localhost:5580` con proxy automático hacia `/api`.

### 2. Entorno Local con Docker

```bash
docker compose up --build
```

- **Frontend (Nginx):** `http://localhost:8580` (configurable con `CLIENT_DOCKER_PORT` en `.env`)
- **Backend API:** `http://localhost:4580/api/health` (configurable con `SERVER_DOCKER_PORT` en `.env`)

### 3. Despliegue en Netlify

El archivo `netlify.toml` en la raíz deja configurado el build y la API serverless:

1. Conecta el repositorio en Netlify (o ejecuta `netlify deploy --prod` con Netlify CLI).
2. Netlify ejecutará `cd client && npm install && npm run build`, publicará `client/dist` y desplegará `netlify/functions/api.mjs` para atender todas las rutas `/api/*`.
3. En el panel de Netlify (**Site configuration → Environment variables**), configurá tus variables de entorno según `client/.env.template` y `server/.env.template`.

### 4. Pruebas Funcionales y Auditoría Visual (Playwright)

Con ambos servidores corriendo (`server` en `4580` y `client` en `5580`), ejecuta la suite E2E:

```bash
cd client
npm run test:e2e
```

Valida contraste de header/logo, carrusel Hero con Canvas, Bento showcase y filtros del catálogo, Ficha Técnica, Comparador, Recomendador Agro Point, Red Líder LG, Chatbot AgroBot LG y responsividad mobile sin desborde horizontal.

---

## Endpoints de la API (`/api`)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Verificación de estado del backend |
| `GET` | `/api/company` | Información institucional, métricas y regiones |
| `GET` | `/api/products` | Listado filtrable por `category`, `technology`, `region`, `search` |
| `GET` | `/api/products/:id` | Ficha técnica completa de un híbrido o variedad |
| `POST` | `/api/recommend` | Recomendador agronómico y cálculo estimado de bolsas |
| `GET` | `/api/distributors` | Buscador de distribuidores **Red Líder LG** |
| `GET` | `/api/articles` | Informes técnicos **Agro Point** |
| `POST` | `/api/contact` | Envío validado de consultas comerciales/técnicas |
| `POST` | `/api/careers` | Envío validado de postulaciones (**Trabajá con Nosotros**) |

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Scale,
  X,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Download,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { apiService } from '../services/api.js';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHECKERBOARD_ITEMS = [
  {
    id: 'maiz',
    title: 'MAÍZ',
    redTheme: true,
    iconDesktop: '/assets/crops/maiz-icon.png',
    text: 'Los más de 70 programas genéticos en el mundo y los sólidos convenios con proveedores de biotecnología, nos permiten ofrecer líneas genéticas de excepcional rendimiento y destacadas características agronómicas.',
  },
  {
    id: 'girasol',
    title: 'GIRASOL',
    redTheme: false,
    iconDesktop: '/assets/crops/girasol-icon-r.png',
    text: 'Nuestro equipo de R&D está en búsqueda constante de materiales adaptables a todas las zonas de nuestro país. Ofrecemos semillas de excelente comportamiento sanitario y de gran estabilidad en la Prov. de Buenos Aires, La Pampa y NEA.',
  },
  {
    id: 'trigo',
    title: 'TRIGO',
    redTheme: false,
    iconDesktop: '/assets/crops/trigo-icon-r.png',
    iconMobile: '/assets/crops/trigo-icon.png',
    text: 'El programa de Limagrain es N°1 en cultivos de invierno en Europa y ofrece una paleta diversa en grupos de calidad y ciclos.',
  },
  {
    id: 'soja',
    title: 'SOJA',
    redTheme: true,
    iconDesktop: '/assets/crops/soja-icon.png',
    iconMobile: '/assets/crops/soja-icon-r.png',
    text: 'Una amplia oferta en todos los grupos de madurez y biotecnología que nos permite estar presentes en todas las regiones sojeras de la Argentina.',
  },
  {
    id: 'silo',
    title: 'MAÍZ SILO',
    redTheme: true,
    iconDesktop: '/assets/crops/maiz-silo-icon.png',
    text: 'Híbridos concebidos bajo el estándar global de nutrición animal Limagrain: máximo volumen de materia seca digestible, stay-green extendido y alta concentración energética para tambos y feedlots.',
  },
];

const BANNER_TABS = [
  {
    id: 'maiz',
    label: 'Maíz',
    banner: '/assets/crops/banner-maiz.jpg',
    circleImg: '/assets/crops/maiz-1.png',
  },
  {
    id: 'girasol',
    label: 'Girasol',
    banner: '/assets/crops/banner-girasol.jpg',
    circleImg: '/assets/crops/girasol-1.png',
  },
  {
    id: 'trigo',
    label: 'Trigo',
    banner: '/assets/crops/banner-trigo.jpg',
    circleImg: '/assets/crops/trigo-1.png',
  },
  {
    id: 'soja',
    label: 'Soja',
    banner: '/assets/crops/banner-soja.jpg',
    circleImg: '/assets/crops/soja-1.png',
  },
  {
    id: 'silo',
    label: 'Maíz Silo',
    banner: '/assets/hero/maiz-silo.jpg',
    circleImg: '/assets/crops/maiz-silo-1.png',
  },
];

const CATEGORY_STYLES = {
  maiz: {
    badge: 'bg-brand-red text-white border-brand-red',
    banner: '/assets/crops/banner-maiz.jpg',
    cutout: '/assets/crops/maiz-1.png',
    icon: '/assets/crops/maiz-icon.png',
  },
  silo: {
    badge: 'bg-brand-navy text-white border-brand-navy',
    banner: '/assets/hero/maiz-silo.jpg',
    cutout: '/assets/crops/maiz-silo-1.png',
    icon: '/assets/crops/maiz-silo-icon.png',
  },
  girasol: {
    badge: 'bg-brand-coral text-white border-brand-coral',
    banner: '/assets/crops/banner-girasol.jpg',
    cutout: '/assets/crops/girasol-1.png',
    icon: '/assets/crops/girasol-icon-r.png',
  },
  trigo: {
    badge: 'bg-brand-darkred text-white border-brand-darkred',
    banner: '/assets/crops/banner-trigo.jpg',
    cutout: '/assets/crops/trigo-1.png',
    icon: '/assets/crops/trigo-icon-r.png',
  },
  soja: {
    badge: 'bg-brand-blue text-white border-brand-blue',
    banner: '/assets/crops/banner-soja.jpg',
    cutout: '/assets/crops/soja-1.png',
    icon: '/assets/crops/soja-icon.png',
  },
};

const ScoreBar = ({ label, value, delayMs = 0 }) => (
  <div>
    <div className="flex justify-between text-xs font-medium text-brand-gray mb-1">
      <span>{label}</span>
      <span className="font-bold text-brand-navy">{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-brand-lightgray overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-darkred via-brand-red to-brand-coral cast-score-bar"
        style={{ width: `${value}%`, animationDelay: `${delayMs}ms` }}
      />
    </div>
  </div>
);

export default function ProductCatalog({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  regions = [],
  onRequestQuote,
  compareCountChange,
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [technology, setTechnology] = useState('all');
  const [region, setRegion] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showAllCatalog, setShowAllCatalog] = useState(false);

  const sectionRef = useRef(null);

  const isFiltered =
    selectedCategory !== 'all' || Boolean(searchTerm.trim()) || technology !== 'all' || region !== 'all';

  const visibleProducts = useMemo(() => {
    if (isFiltered || showAllCatalog) return products;
    return products.slice(0, 6);
  }, [products, isFiltered, showAllCatalog]);

  const activeBannerTab = useMemo(() => {
    const found = BANNER_TABS.find((t) => t.id === selectedCategory);
    return found || BANNER_TABS[0];
  }, [selectedCategory]);

  useEffect(() => {
    compareCountChange?.(compareIds.length);
  }, [compareIds.length, compareCountChange]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const result = await apiService.getProducts({
        category: selectedCategory,
        search: searchTerm,
        technology,
        region,
      });
      if (!active) return;
      setProducts(result.items);
      if (result.categories?.length) setCategories(result.categories);
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [selectedCategory, searchTerm, technology, region]);

  useGSAP(
    () => {
      if (loading || products.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.gsap-product-card', {
          y: 22,
          opacity: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      });
    },
    { scope: sectionRef, dependencies: [products, loading] }
  );

  const compareItems = useMemo(
    () => products.filter((p) => compareIds.includes(p.id)),
    [products, compareIds]
  );

  const toggleCompare = (productId) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= 3) return [...prev.slice(1), productId];
      return [...prev, productId];
    });
  };

  const resetFilters = () => {
    onCategoryChange('all');
    onSearchChange('');
    setTechnology('all');
    setRegion('all');
  };

  const handleSelectFromCheckerboard = (cropId) => {
    onCategoryChange(cropId);
    document.getElementById('productos-2026')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCardPointerMove = (e) => {
    if (window.innerWidth < 768) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / rect.height) * -4.5;
    const ry = ((x - rect.width / 2) / rect.width) * 4.5;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    card.style.setProperty('--rx', `${rx.toFixed(2)}deg`);
    card.style.setProperty('--ry', `${ry.toFixed(2)}deg`);
  };

  const handleCardPointerLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  return (
    <div ref={sectionRef}>
      {/* ================= BLOQUE A: DAMERO 50/50 OFICIAL DE LOS 5 CULTIVOS ================= */}
      <section aria-label="Cultivos LG Semillas" className="w-full grid grid-cols-1 md:grid-cols-2">
        {CHECKERBOARD_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectFromCheckerboard(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleSelectFromCheckerboard(item.id);
            }}
            className={`group cursor-pointer px-6 sm:px-12 lg:px-16 py-10 sm:py-14 flex items-start gap-5 sm:gap-7 transition-all duration-300 ${
              item.redTheme
                ? 'bg-brand-red text-white hover:bg-brand-darkred'
                : 'bg-brand-lightgray text-brand-navy hover:bg-stone-200/80'
            }`}
          >
            <div className="shrink-0 pt-1">
              <img
                src={item.iconDesktop}
                alt={item.title}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
            </div>

            <div className="space-y-2.5 flex-1">
              <h3
                className={`font-microbrew text-4xl sm:text-5xl tracking-tight leading-none ${
                  item.redTheme ? 'text-white drop-shadow-sm' : 'text-brand-red'
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-sm sm:text-base leading-relaxed font-medium ${
                  item.redTheme ? 'text-white/95' : 'text-brand-gray'
                }`}
              >
                {item.text}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider pt-1 ${
                  item.redTheme ? 'text-white' : 'text-brand-red'
                }`}
              >
                <span>Ver variedades {item.title}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        ))}

        {/* Sexto bloque del damero: Puente interactivo hacia Agro Point & Comparador */}
        <div className="bg-brand-lightgray px-6 sm:px-12 lg:px-16 py-10 sm:py-14 flex flex-col justify-center gap-4 border-t border-stone-200/70">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-red">
            <Compass className="w-4 h-4" />
            <span>Agro Point & Comparador 2026</span>
          </div>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-navy leading-tight">
            ¿No sabés qué híbrido se adapta mejor a tu lote?
          </h3>
          <p className="text-sm text-brand-gray leading-relaxed">
            Usá nuestro recomendador interactivo por zona agroecológica y fecha de siembra, o compará hasta 3 materiales lado a lado.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <a
              href="#recomendador"
              className="cast-btn-press min-h-[44px] px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-red"
            >
              <span>Abrir Recomendador</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => {
                onCategoryChange('all');
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="cast-btn-press min-h-[44px] px-5 py-2.5 rounded-xl bg-white border border-stone-300 hover:border-brand-red text-brand-navy font-bold text-xs uppercase tracking-wider"
            >
              Ver Todo el Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* ================= BLOQUE B: BANNER FULL-WIDTH "PRODUCTOS 2026" ================= */}
      <section id="productos-2026" className="relative bg-white pb-12">
        <div className="relative h-[280px] sm:h-[360px] lg:h-[400px] overflow-hidden bg-brand-navy">
          <img
            key={activeBannerTab.id}
            src={activeBannerTab.banner}
            alt={`Productos 2026 — ${activeBannerTab.label}`}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(16,15,38,0.25) 0%, rgba(16,15,38,0.55) 60%, rgba(16,15,38,0.72) 100%)',
            }}
          />

          <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-center items-center md:items-end text-center md:text-right">
            <h2 className="font-microbrew text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
              Productos 2026
            </h2>

            <div className="mt-5 flex flex-wrap justify-center md:justify-end gap-3">
              <a
                href="https://www.lgsemillas.com/assets/productos/CatalogoLG2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="cast-btn-press min-h-[46px] px-6 py-3 rounded-sm bg-brand-red hover:bg-brand-darkred text-white font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-3 shadow-red"
              >
                <Download className="w-4 h-4" />
                <span>Descargar catálogo</span>
                <img
                  src="/assets/misc/arrow-right-white.png"
                  alt="→"
                  className="w-4 h-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* 5 Botones Circulares Rojos montados sobre el borde inferior del banner (igual a la captura oficial) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-10 -mt-9 sm:-mt-10 relative z-10 flex items-center justify-center md:justify-start gap-2.5 sm:gap-4 flex-wrap">
          {BANNER_TABS.map((tab) => {
            const isActive =
              selectedCategory === tab.id || (selectedCategory === 'all' && tab.id === 'maiz');
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onCategoryChange(tab.id)}
                aria-label={`Filtrar por ${tab.label}`}
                title={tab.label}
                className={`group relative w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full bg-white p-0.5 shadow-xl transition-all duration-200 ${
                  isActive
                    ? 'ring-4 ring-brand-red scale-110'
                    : 'hover:scale-105 opacity-95 hover:opacity-100'
                }`}
              >
                <img
                  src={tab.circleImg}
                  alt={tab.label}
                  className="w-full h-full object-contain rounded-full"
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= BLOQUE C: GRILLA INTERACTIVA, FICHAS TÉCNICAS Y COMPARADOR ================= */}
      <section id="catalogo" className="py-10 sm:py-16 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-red mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Explorador Técnico 2026
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-navy tracking-tight">
                Fichas agronómicas y comparador de materiales
              </h2>
            </div>
            <div className="text-sm font-semibold text-brand-gray shrink-0">
              Mostrando <span className="text-brand-red font-extrabold">{products.length}</span>{' '}
              materiales
            </div>
          </div>

          {/* Pestañas de filtros por cultivo */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-5">
            {(categories.length
              ? categories
              : [
                  { id: 'all', label: 'Todos los Cultivos' },
                  { id: 'maiz', label: 'Maíz Grano' },
                  { id: 'silo', label: 'Maíz Silo' },
                  { id: 'girasol', label: 'Girasol' },
                  { id: 'trigo', label: 'Trigo' },
                  { id: 'soja', label: 'Soja' },
                ]
            ).map((cat) => {
              const active = selectedCategory === cat.id;
              const iconPath = CATEGORY_STYLES[cat.id]?.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.id)}
                  className={`cast-btn-press min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-brand-red text-white shadow-red'
                      : 'bg-white text-brand-navy border border-stone-200 hover:border-brand-red/50'
                  }`}
                >
                  {iconPath && (
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        active ? 'bg-white/20' : 'bg-brand-red'
                      }`}
                    >
                      <img
                        src={iconPath}
                        alt=""
                        className="w-4 h-4 object-contain brightness-0 invert"
                      />
                    </span>
                  )}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="bg-white rounded-2xl border border-stone-200 p-3.5 sm:p-4 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-gray absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar híbrido, variedad o rasgo..."
                className="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-xl border border-stone-200 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
              />
            </div>

            <div>
              <select
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                aria-label="Filtrar por biotecnología"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red/30"
              >
                <option value="all">Todas las tecnologías / eventos</option>
                <option value="VIP3">VIP3 (Agrisure Viptera 3)</option>
                <option value="VT3P">VT3P (VT Triple Pro)</option>
                <option value="RR2">RR2 (Roundup Ready 2)</option>
                <option value="CL">Clearfield (CL)</option>
                <option value="HO">Alto Oleico (HO)</option>
                <option value="STS">STS (Soja)</option>
                <option value="Convencional">Convencional (Trigo)</option>
              </select>
            </div>

            <div>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                aria-label="Filtrar por región agroecológica"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red/30"
              >
                <option value="all">Todas las regiones productivas</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="cast-btn-press min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-stone-200 bg-brand-lightgray hover:bg-stone-200 text-brand-navy text-sm font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Limpiar Filtros</span>
            </button>
          </div>

          {/* Grilla de tarjetas 3D */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="h-96 rounded-3xl bg-white border border-stone-200 p-6 animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-3">
              <p className="font-display font-bold text-lg text-brand-navy">
                No encontramos variedades con esos criterios
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="cast-btn-press min-h-[44px] px-5 py-2.5 rounded-xl bg-brand-red text-white text-sm font-bold shadow-red"
              >
                Mostrar todo el catálogo
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {visibleProducts.map((item, idx) => {
                  const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.maiz;
                  const isSelectedCompare = compareIds.includes(item.id);
                  const staggerDelay = Math.min(idx, 5) * 55;
                  return (
                    <article
                      key={`${selectedCategory}-${item.id}`}
                      onPointerMove={handleCardPointerMove}
                      onPointerLeave={handleCardPointerLeave}
                      className="gsap-product-card spotlight-card group bg-white rounded-3xl border border-stone-200/90 shadow-card hover:shadow-soft hover:border-brand-red/50 flex flex-col justify-between overflow-hidden"
                    >
                      <div>
                        <div className="relative h-32 overflow-hidden bg-brand-navy">
                          <img
                            src={style.banner}
                            alt={item.categoryLabel}
                            className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-110"
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                'linear-gradient(180deg, rgba(16,15,38,0.38) 0%, rgba(16,15,38,0.94) 100%)',
                            }}
                          />
                          <div className="absolute top-3 left-4 right-4 flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold shadow-sm ${style.badge}`}
                            >
                              <img
                                src={style.icon}
                                alt=""
                                className="w-3.5 h-3.5 object-contain brightness-0 invert"
                              />
                              {item.categoryLabel}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/95 text-brand-navy text-xs font-extrabold shadow-sm">
                              {item.technology}
                            </span>
                          </div>

                          <div className="absolute bottom-2.5 left-4 right-16">
                            <h3 className="font-display font-extrabold text-xl text-white tracking-tight drop-shadow-sm">
                              {item.name}
                            </h3>
                            <p className="text-[11px] font-bold text-rose-200">
                              Ciclo: {item.cycle} · {item.relativeMaturity}
                            </p>
                          </div>

                          <img
                            src={style.cutout}
                            alt=""
                            aria-hidden="true"
                            className="absolute -bottom-1 right-3 w-14 h-14 object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                          />
                        </div>

                        <div className="p-5 sm:p-6 space-y-4">
                          <p className="text-sm text-brand-gray leading-relaxed">{item.tagline}</p>

                          <div className="space-y-2.5 pt-1">
                            <ScoreBar
                              label="Potencial de Rinde"
                              value={item.scores.yieldPotential}
                              delayMs={staggerDelay + 80}
                            />
                            <ScoreBar
                              label="Estabilidad Ambiental"
                              value={item.scores.stability}
                              delayMs={staggerDelay + 140}
                            />
                            <ScoreBar
                              label="Sanidad Integral"
                              value={item.scores.sanitaryProfile}
                              delayMs={staggerDelay + 200}
                            />
                          </div>

                          <ul className="space-y-1.5 pt-1">
                            {item.highlights.slice(0, 2).map((hl) => (
                              <li key={hl} className="flex items-start gap-2 text-xs text-brand-gray">
                                <CheckCircle2 className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="relative z-10 px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-stone-100 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveProduct(item)}
                          className="cast-btn-press cast-btn-arrow flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-red hover:bg-brand-darkred text-white text-sm font-bold shadow-sm"
                        >
                          <span>Ficha Técnica</span>
                          <ArrowUpRight className="w-4 h-4 arrow-icon" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCompare(item.id)}
                          className={`cast-btn-press min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-semibold ${
                            isSelectedCompare
                              ? 'bg-brand-navy border-brand-navy text-white'
                              : 'bg-white border-stone-200 text-brand-navy hover:bg-brand-lightgray'
                          }`}
                        >
                          <Scale className="w-4 h-4" />
                          <span>{isSelectedCompare ? 'En comparador' : 'Comparar'}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {!isFiltered && products.length > 6 && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllCatalog((prev) => !prev)}
                    className="cast-btn-press min-h-[46px] px-7 py-2.5 rounded-full bg-white border border-stone-300 hover:border-brand-red text-brand-navy font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-sm transition-colors"
                  >
                    {showAllCatalog ? (
                      <>
                        <span>Mostrar resumen (6 materiales)</span>
                        <ChevronUp className="w-4 h-4 text-brand-red" />
                      </>
                    ) : (
                      <>
                        <span>Ver todo el portfolio ({products.length} materiales)</span>
                        <ChevronDown className="w-4 h-4 text-brand-red" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Barra flotante de comparador */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 sm:w-full sm:max-w-2xl">
          <div className="cast-modal-enter bg-brand-navy text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <Scale className="w-5 h-5 text-brand-red shrink-0" />
              <span className="text-sm font-semibold">{compareIds.length}/3 seleccionados:</span>
              {compareItems.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-slate text-xs font-bold text-rose-200 border border-white/10"
                >
                  {item.name}
                  <button
                    type="button"
                    onClick={() => toggleCompare(item.id)}
                    aria-label={`Quitar ${item.name}`}
                    className="hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                className="cast-btn-press flex-1 sm:flex-initial min-h-[42px] px-4 py-2 rounded-xl bg-brand-red hover:bg-brand-crimson text-white font-bold text-sm"
              >
                Comparar Ahora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ficha Técnica Completa */}
      {activeProduct && (
        <div
          className="fixed inset-0 z-50 bg-brand-navy/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="cast-modal-enter bg-white w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <img src="/assets/logo/logo3.png" alt="LG" className="w-10 h-10 object-contain" />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-brand-red border border-red-200 text-xs font-bold">
                      {activeProduct.categoryLabel}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-brand-navy text-white text-xs font-bold">
                      {activeProduct.technology}
                    </span>
                  </div>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-navy">
                    {activeProduct.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveProduct(null)}
                aria-label="Cerrar ficha técnica"
                className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-brand-gray hover:bg-brand-lightgray shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm sm:text-base text-brand-navy/90 leading-relaxed">
              {activeProduct.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-lightgray p-4 rounded-2xl border border-stone-200">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-gray">
                  Ciclo & Madurez
                </p>
                <p className="text-sm font-bold text-brand-navy mt-0.5">
                  {activeProduct.cycle} ({activeProduct.relativeMaturity})
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-gray">
                  Fechas de Siembra
                </p>
                <p className="text-sm font-bold text-brand-navy mt-0.5">
                  {activeProduct.sowingDates.join(' / ')}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-gray">
                  Densidad Temprana
                </p>
                <p className="text-sm font-bold text-brand-red mt-0.5">
                  {activeProduct.recommendedDensity.Temprana}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-gray">
                  Densidad Tardía
                </p>
                <p className="text-sm font-bold text-brand-red mt-0.5">
                  {activeProduct.recommendedDensity.Tardía}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-brand-navy mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-brand-red" />
                Perfil Sanitario y Agronómico (Escala 1 a 10)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { k: 'roya', label: 'Roya / Foliar' },
                  { k: 'tizon', label: 'Tizón / Mancha' },
                  { k: 'malDeRioCuarto', label: 'Vuelco / MRC' },
                  { k: 'spiroplasma', label: 'Spiroplasma' },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="rounded-xl border border-stone-200 p-3 text-center bg-white"
                  >
                    <p className="text-xs text-brand-gray font-medium">{s.label}</p>
                    <p className="font-display font-extrabold text-xl text-brand-red mt-0.5">
                      {activeProduct.sanitaryDetail[s.k]}/10
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-gray mb-2">
                Regiones recomendadas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeProduct.regions.map((reg) => (
                  <span
                    key={reg}
                    className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-semibold text-brand-red"
                  >
                    {reg}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const chosen = activeProduct;
                  setActiveProduct(null);
                  onRequestQuote?.(chosen);
                }}
                className="cast-btn-press flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-sm shadow-red"
              >
                Solicitar Cotización de {activeProduct.name}
              </button>
              <button
                type="button"
                onClick={() => setActiveProduct(null)}
                className="min-h-[48px] px-5 py-3 rounded-xl border border-stone-200 text-brand-navy font-semibold text-sm hover:bg-brand-lightgray"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Comparador Side-by-Side */}
      {showCompareModal && compareItems.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-brand-navy/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowCompareModal(false)}
        >
          <div
            className="cast-modal-enter bg-white w-full sm:max-w-4xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-brand-navy">
                  Comparador Técnico LG Semillas
                </h3>
                <p className="text-xs sm:text-sm text-brand-gray">
                  Comparativa directa de ciclo, tecnología, rinde y sanidad.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-brand-navy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stone-200 p-4 bg-brand-lightgray/60 space-y-3"
                >
                  <div className="border-b border-stone-200 pb-3">
                    <span className="text-xs font-bold text-brand-red">{item.categoryLabel}</span>
                    <h4 className="font-display font-extrabold text-lg text-brand-navy">
                      {item.name}
                    </h4>
                    <p className="text-xs font-semibold text-brand-gray mt-0.5">
                      {item.technology} · {item.relativeMaturity}
                    </p>
                  </div>
                  <ScoreBar label="Potencial Rinde" value={item.scores.yieldPotential} />
                  <ScoreBar label="Estabilidad" value={item.scores.stability} />
                  <ScoreBar label="Sanidad" value={item.scores.sanitaryProfile} />
                  <ScoreBar label="Caña / Estructura" value={item.scores.stalkStrength} />
                  <div className="text-xs text-brand-gray pt-1 space-y-1">
                    <p>
                      <strong className="text-brand-navy">Temprana:</strong>{' '}
                      {item.recommendedDensity.Temprana}
                    </p>
                    <p>
                      <strong className="text-brand-navy">Tardía:</strong>{' '}
                      {item.recommendedDensity.Tardía}
                    </p>
                    <p>
                      <strong className="text-brand-navy">Regiones:</strong>{' '}
                      {item.regions.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

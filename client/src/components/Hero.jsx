import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, ChevronRight, ArrowRight, Search } from 'lucide-react';

gsap.registerPlugin(useGSAP);

const HERO_SLIDES = [
  {
    id: 'slide-1',
    type: 'juntos',
    desktopBg: '/assets/hero/bg04.jpg',
    mobileBg: '/assets/hero/bg04.jpg',
    overlayArtwork: '/assets/hero/trabajamos-mejor.png',
    mobileArtwork: '/assets/hero/juntos.png',
    captionAlt: 'Juntos producimos mejor — LG Semillas',
    badge: 'Campaña 2026 · De Productor a Productor',
    quickAction: { label: 'Explorar Portfolio 2026', target: 'catalogo' },
  },
  {
    id: 'slide-2',
    type: 'somoslg',
    desktopBg: '/assets/hero/bg05.jpg',
    mobileBg: '/assets/hero/bg05-mob.jpg',
    overlayArtwork: '/assets/hero/somoslg.png',
    captionText:
      'De productor a productor, creamos semillas para agricultores en todo el mundo con el fin de ayudarlos a producir más y mejor. Trabajamos con pasión y compromiso para alcanzar cada vez mejores resultados.',
    badge: 'Girasol · Maíz · Trigo · Soja',
    quickAction: { label: 'Recomendador Agro Point', target: 'recomendador' },
  },
  {
    id: 'slide-3',
    type: 'cooperamos',
    desktopBg: '/assets/hero/bg06.jpg',
    mobileBg: '/assets/hero/bg06.jpg',
    overlayArtwork: '/assets/hero/cooperamos-agricultura-2.png',
    captionAlt: 'Cooperamos para el progreso de la agricultura',
    badge: 'Cooperativa Limagrain · 60 años',
    quickAction: { label: 'Red Líder LG', target: 'red-lider' },
  },
];

const QUICK_CROPS = [
  { id: 'maiz', label: 'Maíz', icon: '/assets/crops/maiz-icon.png' },
  { id: 'girasol', label: 'Girasol', icon: '/assets/crops/girasol-icon-r.png' },
  { id: 'trigo', label: 'Trigo', icon: '/assets/crops/trigo-icon-r.png' },
  { id: 'soja', label: 'Soja', icon: '/assets/crops/soja-icon.png' },
  { id: 'silo', label: 'Maíz Silo', icon: '/assets/crops/maiz-silo-icon.png' },
];

export default function Hero({ onQuickSearch, onSelectCrop }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState('');
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: -999, y: -999 });

  const currentSlide = HERO_SLIDES[activeIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.gsap-slide-content',
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: 'power3.out' }
        );
      });
    },
    { scope: heroRef, dependencies: [activeIndex] }
  );

  // Canvas 2D sutil de partículas orgánicas siguiendo el cursor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = Array.from({ length: width < 640 ? 14 : 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 2,
      vx: -0.2 + Math.random() * 0.4,
      vy: -0.35 - Math.random() * 0.3,
      alpha: 0.25 + Math.random() * 0.45,
    }));

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      const { x: px, y: py } = pointerRef.current;
      for (const p of particles) {
        const dx = p.x - px;
        const dy = p.y - py;
        const d = Math.hypot(dx, dy);
        if (d < 120 && d > 1) {
          p.x += (dx / d) * 1.8;
          p.y += (dy / d) * 1.8;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onQuickSearch?.(query);
  };

  const handleCropShortcut = (cropId) => {
    onSelectCrop?.(cropId);
  };

  return (
    <section
      id="inicio"
      ref={heroRef}
      onPointerMove={(e) => {
        const r = heroRef.current?.getBoundingClientRect();
        if (r) pointerRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }}
      onPointerLeave={() => {
        pointerRef.current = { x: -999, y: -999 };
      }}
      className="relative overflow-hidden bg-brand-navy text-white h-[540px] sm:h-[620px] lg:h-[680px]"
    >
      {/* Fondo Fotográfico Full-Bleed con Ken Burns suave */}
      <picture className="absolute inset-0 block w-full h-full pointer-events-none">
        <source media="(max-width: 768px)" srcSet={currentSlide.mobileBg} />
        <img
          key={currentSlide.id}
          src={currentSlide.desktopBg}
          alt={currentSlide.captionAlt || currentSlide.badge}
          className="hero-scene-zoom w-full h-full object-cover object-[24%_top] sm:object-top"
        />
      </picture>

      {/* Viñeta sutil para legibilidad sin oscurecer la fotografía natural */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(16,15,38,0.28) 0%, rgba(16,15,38,0.16) 52%, rgba(16,15,38,0.85) 100%)',
        }}
      />

      {/* Partículas interactivas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Contenido por escena fiel a la captura del sitio oficial */}
      {currentSlide.type === 'juntos' && (
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col justify-between pt-8 pb-28 sm:pb-24">
          <div className="ml-auto w-full md:w-[58%] lg:w-[54%] pt-4 sm:pt-12 flex flex-col items-center sm:items-end text-center sm:text-right">
            <img
              src={currentSlide.overlayArtwork}
              alt={currentSlide.captionAlt}
              className="gsap-slide-content hidden sm:block max-w-[440px] lg:max-w-[540px] w-full h-auto drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]"
            />
            <img
              src={currentSlide.mobileArtwork}
              alt={currentSlide.captionAlt}
              className="gsap-slide-content sm:hidden max-w-[270px] w-full h-auto mx-auto mt-4 drop-shadow-[0_4px_18px_rgba(0,0,0,0.75)]"
            />
          </div>
        </div>
      )}

      {currentSlide.type === 'somoslg' && (
        <div className="relative h-full w-full flex justify-end">
          <div className="gsap-slide-content w-full md:w-[50%] lg:w-[46%] h-full bg-brand-red/90 backdrop-blur-xs px-6 sm:px-12 lg:px-16 py-10 flex flex-col justify-center">
            <p className="text-lg sm:text-2xl lg:text-[1.75rem] font-light leading-snug text-white mb-6">
              {currentSlide.captionText}
            </p>
            <div className="flex justify-end">
              <img
                src={currentSlide.overlayArtwork}
                alt="Somos LG Semillas"
                className="w-36 sm:w-52 h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {currentSlide.type === 'cooperamos' && (
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center">
          <div className="gsap-slide-content max-w-lg sm:max-w-xl bg-brand-navy/45 backdrop-blur-sm p-5 sm:p-7 rounded-3xl border border-white/15">
            <img
              src={currentSlide.overlayArtwork}
              alt={currentSlide.captionAlt}
              className="w-full h-auto drop-shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Dock Interactivo Moderno 2026 en el pie del Hero (Buscador + Cultivos + Controles de Slider) */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-6 lg:px-10 pb-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-brand-navy/85 backdrop-blur-xl border border-white/15 rounded-2xl p-2.5 sm:p-3 shadow-2xl">
          {/* Buscador compacto */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar híbrido o variedad (ej. 30680, 5710 CL)..."
                aria-label="Buscar híbrido o variedad"
                className="w-full min-h-[40px] pl-9 pr-3 py-1.5 rounded-xl bg-white text-brand-navy text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <button
              type="submit"
              className="cast-btn-press min-h-[40px] px-4 rounded-xl bg-brand-red hover:bg-brand-darkred text-white text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0"
            >
              <span>Buscar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Accesos rápidos por cultivo */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-1.5">
            {QUICK_CROPS.map((crop) => (
              <button
                key={crop.id}
                type="button"
                onClick={() => handleCropShortcut(crop.id)}
                className="cast-btn-press min-h-[36px] sm:min-h-[38px] px-2.5 sm:px-3 py-1 rounded-xl bg-white/10 hover:bg-brand-red text-white text-[11px] sm:text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
              >
                <img
                  src={crop.icon}
                  alt=""
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain brightness-0 invert"
                />
                <span>{crop.label}</span>
              </button>
            ))}
          </div>

          {/* Indicadores y Flechas del Slider */}
          <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 sm:pl-2 border-t sm:border-t-0 sm:border-l border-white/15 shrink-0">
            <div className="flex items-center gap-1.5 mr-1">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Ver slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeIndex ? 'w-6 bg-brand-red' : 'w-2 bg-white/40 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
              }
              aria-label="Escena anterior"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-red flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
              aria-label="Escena siguiente"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-red flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

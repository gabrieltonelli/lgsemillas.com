import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

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
  },
  {
    id: 'slide-3',
    type: 'cooperamos',
    desktopBg: '/assets/hero/bg06.jpg',
    mobileBg: '/assets/hero/bg06.jpg',
    overlayArtwork: '/assets/hero/cooperamos-agricultura-2.png',
    captionAlt: 'Cooperamos para el progreso de la agricultura',
    badge: 'Cooperativa Limagrain · 60 años',
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
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
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col justify-between pt-8 pb-12 sm:pb-14">
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
              <div className="relative h-full w-full grid grid-cols-1 lg:grid-cols-2">
                <div
                  data-testid="hero-somoslg-box"
                  className="gsap-slide-content h-full bg-brand-red/90 backdrop-blur-xs px-6 sm:px-12 lg:px-16 xl:px-24 py-10 flex flex-col justify-center"
                >
                  <div className="max-w-xl">
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
              </div>
      )}

              {currentSlide.type === 'cooperamos' && (
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center">
                  <div className="gsap-slide-content max-w-lg sm:max-w-xl">
                    <img
                      src={currentSlide.overlayArtwork}
                      alt={currentSlide.captionAlt}
                      className="w-full h-auto drop-shadow-lg"
                    />
                  </div>
                </div>
              )}

              {/* Indicadores de carrusel (3 puntitos) */}
              <div
                className="absolute bottom-5 inset-x-0 z-20 flex items-center justify-center gap-2.5"
                role="tablist"
                aria-label="Seleccionar escena del carrusel"
              >
                {HERO_SLIDES.map((slide, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Ver slide ${idx + 1}`}
                      onClick={() => setActiveIndex(idx)}
                      className={`h-3 rounded-full transition-all duration-300 shadow-md ${isActive
                          ? 'w-7 bg-brand-red ring-2 ring-white/90'
                          : 'w-3 bg-white/65 hover:bg-white'
                        }`}
                    />
                  );
                })}
              </div>
            </section>
            );
}

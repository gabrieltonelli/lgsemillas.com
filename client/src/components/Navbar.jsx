import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown, ChevronRight, Compass, ShieldCheck } from 'lucide-react';
import { clientEnv } from '../config/env.js';

const PRODUCT_SUBMENU = [
  { id: 'maiz', label: 'Productos Maíz' },
  { id: 'silo', label: 'Productos Maíz Silo' },
  { id: 'girasol', label: 'Productos Girasol' },
  { id: 'trigo', label: 'Productos Trigo' },
  { id: 'soja', label: 'Productos Soja' },
];

export default function Navbar({ onSelectCropShortcut }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const jumpToCrop = (cropId) => {
    onSelectCropShortcut?.(cropId);
    setOpenDropdown(null);
    setMobileOpen(false);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-shadow duration-300 bg-white ${
        scrolled ? 'shadow-soft border-b border-stone-200' : 'border-b border-stone-200/80'
      }`}
    >
      <div className="w-full flex items-stretch justify-between">
        {/* Bloque Rojo Izquierdo Icónico LG Semillas (Fiel a la web oficial con contraste perfecto) */}
        <a
          href="#inicio"
          aria-label="Inicio LG Semillas"
          className="bg-brand-red hover:bg-brand-darkred transition-colors px-4 sm:px-7 lg:px-10 py-3 flex items-center justify-center shrink-0 min-w-[138px] sm:min-w-[185px]"
        >
          <img
            src="/assets/logo/logonuevo04.png"
            alt="LG Semillas — 60 años Limagrain Argentina"
            className="h-9 sm:h-12 w-auto object-contain transition-transform duration-200 hover:scale-[1.03]"
          />
        </a>

        {/* Barra Blanca Derecha */}
        <div className="flex-1 bg-white px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
          {/* Navegación Desktop en mayúsculas limpias */}
          <nav
            className="hidden xl:flex items-center gap-1 2xl:gap-2 mx-auto"
            aria-label="Navegación principal"
          >
            <a
              href="#inicio"
              className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-red hover:text-brand-darkred transition-colors"
            >
              HOME
            </a>
            <a
              href="#nosotros"
              className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-navy hover:text-brand-red transition-colors"
            >
              QUIÉNES SOMOS
            </a>

            {/* Dropdown Productos */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('productos')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => jumpToCrop('all')}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-navy hover:text-brand-red transition-colors"
              >
                <span>PRODUCTOS</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {openDropdown === 'productos' && (
                <div className="absolute left-0 top-full w-56 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50">
                  {PRODUCT_SUBMENU.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => jumpToCrop(item.id)}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-brand-red hover:bg-brand-lightgray transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <a
                    href="https://www.lgsemillas.com/assets/productos/CatalogoLG2026.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2.5 text-xs font-bold text-brand-navy hover:bg-brand-lightgray border-t border-stone-100 mt-1"
                  >
                    Catálogo 2026 (PDF) ↗
                  </a>
                </div>
              )}
            </div>

            <a
              href="#productos-2026"
              className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-navy hover:text-brand-red transition-colors"
            >
              PRODUCTOS 2026
            </a>

            <a
              href="#recomendador"
              className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-navy hover:text-brand-red transition-colors"
            >
              AGRO POINT
            </a>

            <a
              href="#red-lider"
              className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-navy hover:text-brand-red transition-colors"
            >
              RED LÍDER
            </a>

            {/* Dropdown Contacto */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown('contacto')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href="#contacto"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-navy hover:text-brand-red transition-colors"
              >
                <span>CONTACTO</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </a>
              {openDropdown === 'contacto' && (
                <div className="absolute right-0 top-full w-60 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50">
                  <a
                    href="#contacto"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 text-xs font-bold text-brand-red hover:bg-brand-lightgray"
                  >
                    Envianos tu consulta
                  </a>
                  <a
                    href="#contacto"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 text-xs font-bold text-brand-red hover:bg-brand-lightgray"
                  >
                    Trabajá con nosotros
                  </a>
                  <a
                    href={clientEnv.ethicsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2.5 text-xs font-bold text-brand-navy hover:bg-brand-lightgray border-t border-stone-100 mt-1"
                  >
                    Canal de denuncias éticas ↗
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Derecha: Redes oficiales + CTA rápido */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden md:flex items-center gap-2">
              <a
                href="https://www.instagram.com/lgsemillas"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram LG Semillas"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-brand-red hover:bg-brand-red hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/LG_SEMILLAS"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter LG Semillas"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-brand-red hover:bg-brand-red hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23Z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/lgsemillas"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn LG Semillas"
                className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-brand-red hover:bg-brand-red hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                </svg>
              </a>
            </div>

            <a
              href="#recomendador"
              className="cast-btn-press hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-red hover:bg-brand-darkred text-white text-xs font-extrabold uppercase tracking-wider shadow-red"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Agro Point</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-stone-200 text-brand-navy hover:border-brand-red hover:text-brand-red transition-colors active:scale-95"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Mobile de alto contraste */}
      {mobileOpen && (
        <div
          className="xl:hidden fixed inset-0 top-[68px] sm:top-[76px] z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="cast-modal-enter bg-brand-navy text-white h-[calc(100dvh-4.25rem)] w-full max-w-sm ml-auto p-5 flex flex-col justify-between overflow-y-auto shadow-2xl border-l border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-3 pb-4 border-b border-white/10">
                <img
                  src="/assets/logo/logonuevo2.png"
                  alt="LG Semillas"
                  className="h-8 w-auto object-contain"
                />
                <span className="px-2.5 py-1 rounded-full bg-brand-red text-[11px] font-bold uppercase tracking-wider text-white">
                  Menú Oficial
                </span>
              </div>

              {[
                { href: '#inicio', label: 'HOME' },
                { href: '#nosotros', label: 'QUIÉNES SOMOS' },
                { href: '#catalogo', label: 'CULTIVOS Y CATÁLOGO' },
                { href: '#productos-2026', label: 'PRODUCTOS 2026' },
                { href: '#recomendador', label: 'AGRO POINT' },
                { href: '#red-lider', label: 'RED LÍDER' },
                { href: '#novedades', label: 'ENSAYOS & VIDEOS' },
                { href: '#contacto', label: 'CONTACTO' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between min-h-[44px] px-4 py-2.5 rounded-xl text-sm font-bold tracking-wider text-stone-100 hover:bg-brand-red hover:text-white transition-colors"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-brand-coral" />
                </a>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 text-xs text-stone-300 space-y-2">
              <img
                src="/assets/logo/limagrain.png"
                alt="Limagrain"
                className="h-6 w-auto object-contain mb-2"
              />
              <p className="font-bold text-white">{clientEnv.hqAddress}</p>
              <a
                href={clientEnv.ethicsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-coral font-bold pt-1"
              >
                <ShieldCheck className="w-4 h-4" />
                Canal de denuncias éticas
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

import { useEffect, useState } from 'react';
import { Menu, X, Compass, MapPin, ShieldCheck, Phone } from 'lucide-react';
import { clientEnv } from '../config/env.js';

const NAV_LINKS = [
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#recomendador', label: 'Agro Point' },
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#red-lider', label: 'Red Líder LG' },
  { href: '#novedades', label: 'Ensayos & BPA' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Navbar({ onSelectCropShortcut }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
      {/* Barra institucional superior visible en tablet/desktop */}
      <div className="hidden md:block bg-lg-forest text-emerald-50 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 truncate">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-lg-gold shrink-0" />
              <span className="truncate">{clientEnv.hqAddress}</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-emerald-200">
              <Phone className="w-3.5 h-3.5 text-lg-gold shrink-0" />
              {clientEnv.phone}
            </span>
          </div>
          <div className="flex items-center gap-5 shrink-0">
            <span className="text-emerald-200">Grupo {clientEnv.companyGroup}</span>
            <a
              href={clientEnv.ethicsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-200 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Canal Ético
            </a>
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
        <a
          href="#inicio"
          className="flex items-center gap-2.5 group focus:outline-none"
          aria-label="Inicio LG Semillas"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-lg-forest flex items-center justify-center shadow-sm group-hover:bg-lg-green transition-colors relative overflow-hidden">
            <span className="text-white font-display font-extrabold text-lg tracking-tight">LG</span>
            <span className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-lg-gold via-lg-orange to-lg-leaf" />
          </div>
          <div className="leading-tight">
            <span className="block font-display font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
              LG Semillas
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-lg-green">
              Limagrain Argentina
            </span>
          </div>
        </a>

        {/* Links Desktop */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-lg-forest hover:bg-emerald-50/70 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA + Botón Hamburguesa */}
        <div className="flex items-center gap-2">
          <a
            href="#recomendador"
            onClick={() => onSelectCropShortcut?.('maiz')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lg-forest hover:bg-lg-green text-white text-sm font-semibold shadow-sm transition-all"
          >
            <Compass className="w-4 h-4 text-lg-gold" />
            <span>Elegir Semilla</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-stone-200 text-slate-700 hover:bg-stone-100 active:scale-95 transition"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Drawer Mobile Full Responsivo */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-slate-950/50 backdrop-blur-sm">
          <div className="bg-white h-[calc(100dvh-4rem)] w-full max-w-sm ml-auto p-5 flex flex-col justify-between overflow-y-auto shadow-2xl border-l border-stone-200">
            <div className="space-y-2">
              <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Navegación
              </p>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="flex items-center justify-between min-h-[46px] px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-emerald-50 hover:text-lg-forest transition-colors"
                >
                  <span>{link.label}</span>
                  <span className="text-lg-green text-sm">→</span>
                </a>
              ))}

              <div className="pt-4 mt-4 border-t border-stone-200">
                <a
                  href="#recomendador"
                  onClick={handleLinkClick}
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-lg-forest text-white font-semibold shadow-sm"
                >
                  <Compass className="w-4 h-4 text-lg-gold" />
                  Recomendador Agro Point
                </a>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-stone-200 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">{clientEnv.siteName}</p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-lg-green shrink-0 mt-0.5" />
                <span>{clientEnv.hqAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-lg-green shrink-0" />
                <span>{clientEnv.phone}</span>
              </p>
              <a
                href={clientEnv.ethicsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-lg-forest font-semibold pt-1"
              >
                <ShieldCheck className="w-4 h-4" />
                Código de Conducta y Canal Ético
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


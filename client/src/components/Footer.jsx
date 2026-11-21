import { Instagram, Twitter, Linkedin } from 'lucide-react';
import { clientEnv } from '../config/env.js';

export default function Footer({ onSelectCrop }) {
  const year = new Date().getFullYear();

  const handleCropJump = (crop) => {
    onSelectCrop?.(crop);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-white text-brand-gray border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Columna marca oficial (logo rojo + descripción) */}
          <div className="md:col-span-4 space-y-4">
            <a href="#inicio" className="inline-block">
              <img
                src="/assets/logo/logo3.png"
                alt="LG Semillas — Limagrain"
                className="h-14 w-auto object-contain"
              />
            </a>
            <p className="text-xs sm:text-sm text-brand-gray leading-relaxed max-w-sm">
              Somos la marca insignia de genética en cultivos extensivos del Grupo Limagrain, cooperativa agrícola internacional perteneciente a productores. Desarrollamos semillas adaptadas a cada ambiente productivo.
            </p>
          </div>

          {/* LINKS (exacto al diseño oficial en 2 subcolumnas) */}
          <div className="md:col-span-3">
            <h3 className="font-display font-bold text-brand-red text-xs uppercase tracking-widest mb-4">
              LINKS
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-brand-gray">
              <a href="#inicio" className="hover:text-brand-red transition-colors">
                Inicio
              </a>
              <a href="#red-lider" className="hover:text-brand-red transition-colors">
                Red Líder
              </a>
              <a href="#nosotros" className="hover:text-brand-red transition-colors">
                Quiénes Somos
              </a>
              <a href="#novedades" className="hover:text-brand-red transition-colors">
                Novedades
              </a>
              <a href="#productos-2026" className="hover:text-brand-red transition-colors">
                Productos
              </a>
              <a href="#contacto" className="hover:text-brand-red transition-colors">
                Contacto
              </a>
              <a href="#recomendador" className="hover:text-brand-red transition-colors">
                Agro Point
              </a>
              <a
                href={clientEnv.ethicsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-red transition-colors"
              >
                Canal Ético
              </a>
            </div>
          </div>

          {/* PRODUCTOS */}
          <div className="md:col-span-2">
            <h3 className="font-display font-bold text-brand-red text-xs uppercase tracking-widest mb-4">
              PRODUCTOS
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-brand-gray">
              {[
                { id: 'maiz', label: 'Maíz' },
                { id: 'silo', label: 'Maíz Silo' },
                { id: 'trigo', label: 'Trigo' },
                { id: 'soja', label: 'Soja' },
                { id: 'girasol', label: 'Girasol' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleCropJump(item.id)}
                    className="hover:text-brand-red text-left transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACTO */}
          <div className="md:col-span-3 space-y-2 text-xs sm:text-sm text-brand-gray">
            <h3 className="font-display font-bold text-brand-red text-xs uppercase tracking-widest mb-4">
              CONTACTO
            </h3>
            <p className="font-medium text-brand-navy">Ruta 32 Km. 2</p>
            <p>(2700) Pergamino, Buenos Aires</p>
            <p>
              <a
                href={`mailto:${clientEnv.contactEmail}`}
                className="text-brand-red hover:underline font-medium"
              >
                {clientEnv.contactEmail}
              </a>
            </p>
            <p>{clientEnv.phone}</p>
          </div>
        </div>
      </div>

      {/* Barra inferior blanca con copyright + redes en rojo + badge Limagrain */}
      <div className="border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-brand-gray text-center sm:text-left">
            <span>© {year} {clientEnv.siteName} — Todos los derechos reservados.</span>{' '}
            <span className="hidden sm:inline">· Respetá el 10% de Refugio (MRI).</span>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/lgsemillas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram LG Semillas"
                className="w-8 h-8 rounded-full flex items-center justify-center text-brand-red hover:bg-brand-red/10 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/LG_SEMILLAS"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter LG Semillas"
                className="w-8 h-8 rounded-full flex items-center justify-center text-brand-red hover:bg-brand-red/10 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/lgsemillas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn LG Semillas"
                className="w-8 h-8 rounded-full flex items-center justify-center text-brand-red hover:bg-brand-red/10 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            <div className="h-5 w-px bg-stone-200" aria-hidden="true" />

            <img
              src="/assets/logo/limagrain.png"
              alt="Limagrain"
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

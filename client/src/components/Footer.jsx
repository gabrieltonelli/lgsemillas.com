import { clientEnv } from '../config/env.js';

export default function Footer({ onSelectCrop }) {
  const year = new Date().getFullYear();

  const handleCropJump = (crop) => {
    onSelectCrop?.(crop);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#042f24] text-emerald-100 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-lg-forest font-display font-extrabold flex items-center justify-center">
                LG
              </div>
              <div>
                <p className="font-display font-extrabold text-white">LG Semillas</p>
                <p className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                  {clientEnv.companyGroup}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/85 leading-relaxed">
              Semillas de cultivos extensivos desarrolladas por agricultores para agricultores. Investigación y producción argentina desde Pergamino.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-sm mb-3">Cultivos</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { id: 'maiz', label: 'Maíz Grano (VIP3 / VT3P / RR2)' },
                { id: 'silo', label: 'Maíz Silo de Alta Digestibilidad' },
                { id: 'girasol', label: 'Girasol Clearfield & Alto Oleico' },
                { id: 'trigo', label: 'Trigo — La Tropilla del Rinde' },
                { id: 'soja', label: 'Soja STS & RR' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleCropJump(item.id)}
                    className="hover:text-lg-gold text-left transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-sm mb-3">Secciones</h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#recomendador" className="hover:text-lg-gold transition-colors">
                  Recomendador Agro Point
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-lg-gold transition-colors">
                  Quiénes Somos (Limagrain)
                </a>
              </li>
              <li>
                <a href="#red-lider" className="hover:text-lg-gold transition-colors">
                  Red Líder LG (Distribuidores)
                </a>
              </li>
              <li>
                <a href="#novedades" className="hover:text-lg-gold transition-colors">
                  Ensayos & Buenas Prácticas
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-lg-gold transition-colors">
                  Trabajá con Nosotros
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <h3 className="font-display font-bold text-white text-sm mb-3">Sede Argentina</h3>
            <p className="text-emerald-200/90">{clientEnv.hqAddress}</p>
            <p>
              <a href={`mailto:${clientEnv.contactEmail}`} className="text-lg-gold hover:underline">
                {clientEnv.contactEmail}
              </a>
            </p>
            <p>{clientEnv.phone}</p>
            <p className="pt-1">
              <a
                href={clientEnv.ethicsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-amber-200 hover:text-white"
              >
                Código de Conducta y Canal Ético
              </a>
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-300/80">
          <p>© {year} {clientEnv.siteName}. Todos los derechos reservados.</p>
          <p>Respetá siempre el 10% de Refugio (Programa MRI).</p>
        </div>
      </div>
    </footer>
  );
}


import { useState } from 'react';
import { ArrowRight, Search, Sprout, Sun, Wheat, Leaf, Sparkles } from 'lucide-react';

const CROP_SHORTCUTS = [
  { id: 'maiz', label: 'Maíz Grano', icon: Sprout, accent: 'bg-amber-400/20 text-amber-200 border-amber-300/30' },
  { id: 'silo', label: 'Maíz Silo', icon: Leaf, accent: 'bg-emerald-400/20 text-emerald-200 border-emerald-300/30' },
  { id: 'girasol', label: 'Girasol', icon: Sun, accent: 'bg-orange-400/20 text-orange-200 border-orange-300/30' },
  { id: 'trigo', label: 'Trigo La Tropilla', icon: Wheat, accent: 'bg-yellow-400/20 text-yellow-200 border-yellow-300/30' },
  { id: 'soja', label: 'Soja', icon: Sparkles, accent: 'bg-lime-400/20 text-lime-200 border-lime-300/30' },
];

export default function Hero({ company, onQuickSearch, onSelectCrop }) {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onQuickSearch(query);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShortcut = (cropId) => {
    onSelectCrop(cropId);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-br from-[#042f24] via-lg-forest to-[#0c6639] text-white"
    >
      {/* Textura orgánica sutil y halos de luz */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 22%, #eab308 0, transparent 36%), radial-gradient(circle at 85% 75%, #22c55e 0, transparent 42%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(125deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 22px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-22">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Columna principal */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs sm:text-sm font-semibold text-amber-200">
              <span className="w-2 h-2 rounded-full bg-lg-gold animate-pulse" />
              Cooperativa Limagrain · Investigación y genética en Argentina desde 2011
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[3.35rem] leading-[1.08] tracking-tight text-white">
              Genética de precisión que{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-200">
                rinde en cada lote argentino.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
              {company?.subtitle ||
                'Marca global de semillas de cultivos extensivos del grupo cooperativo francés Limagrain. Híbridos y variedades de Maíz, Maíz Silo, Girasol, Trigo y Soja evaluados a campo en todo el país.'}
            </p>

            {/* Buscador rápido */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row gap-2.5 max-w-xl bg-white/10 p-2 rounded-2xl border border-white/20 backdrop-blur-md"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-emerald-200 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar híbrido o variedad (ej. 30680, 5710 CL, Picazo...)"
                  aria-label="Buscar híbrido o variedad"
                  className="w-full min-h-[44px] pl-10 pr-3 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-lg-gold"
                />
              </div>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-lg-gold hover:bg-amber-400 text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors shrink-0"
              >
                <span>Ver Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Accesos rápidos por cultivo */}
            <div className="pt-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200/80 mb-2.5">
                Explorá por cultivo:
              </p>
              <div className="flex flex-wrap gap-2">
                {CROP_SHORTCUTS.map((crop) => {
                  const Icon = crop.icon;
                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => handleShortcut(crop.id)}
                      className={`min-h-[40px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02] hover:bg-white/20 ${crop.accent}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{crop.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tarjeta lateral KPI + Acción Directa */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Respaldo Global & Local
                  </p>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                    Ecosistema LG Semillas
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-xs font-bold text-emerald-100">
                  Pergamino · Bs. As.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {(company?.metrics || []).map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl bg-slate-950/30 border border-white/10 p-3.5 sm:p-4"
                  >
                    <p className="font-display font-extrabold text-2xl sm:text-3xl text-lg-gold">
                      {metric.value}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
                      {metric.label}
                    </p>
                    <p className="text-[11px] sm:text-xs text-emerald-100/75 mt-1 leading-snug">
                      {metric.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href="#recomendador"
                  className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-lg-forest hover:bg-emerald-50 font-bold text-sm transition-colors"
                >
                  <span>Recomendador de Lote</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#red-lider"
                  className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/30 hover:bg-white/10 text-white font-semibold text-sm transition-colors"
                >
                  Ubicar Red Líder LG
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


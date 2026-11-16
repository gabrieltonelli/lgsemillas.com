import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  CheckCircle2,
  Scale,
  X,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { apiService } from '../services/api.js';

const CATEGORY_STYLES = {
  maiz: {
    badge: 'bg-amber-100 text-amber-900 border-amber-200',
    accent: 'from-amber-500 to-yellow-500',
  },
  silo: {
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    accent: 'from-emerald-600 to-green-500',
  },
  girasol: {
    badge: 'bg-orange-100 text-orange-900 border-orange-200',
    accent: 'from-orange-500 to-amber-500',
  },
  trigo: {
    badge: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    accent: 'from-yellow-600 to-amber-600',
  },
  soja: {
    badge: 'bg-lime-100 text-lime-900 border-lime-200',
    accent: 'from-lime-600 to-emerald-600',
  },
};

const ScoreBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
      <span>{label}</span>
      <span className="font-bold text-slate-900">{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-lg-forest to-lg-leaf transition-all duration-500"
        style={{ width: `${value}%` }}
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
}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [technology, setTechnology] = useState('all');
  const [region, setRegion] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

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

  return (
    <section id="catalogo" className="py-14 sm:py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-lg-green mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Portfolio Genético Argentina
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
              Semillas diseñadas para cada ambiente
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Explorá nuestras líneas de Maíz Grano, Maíz Silo, Girasol, Trigo («La Tropilla del Rinde») y Soja. Compará hasta 3 materiales en tiempo real.
            </p>
          </div>
          <div className="text-sm font-semibold text-slate-600 shrink-0">
            Mostrando <span className="text-lg-forest font-bold">{products.length}</span> materiales
          </div>
        </div>

        {/* Pestañas de cultivos (scroll horizontal táctil en mobile) */}
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
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                  active
                    ? 'bg-lg-forest text-white shadow-soft'
                    : 'bg-white text-slate-700 border border-stone-200 hover:border-lg-green/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-2xl border border-stone-200 p-3.5 sm:p-4 mb-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar híbrido, variedad o rasgo..."
              className="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40 focus:border-lg-green"
            />
          </div>

          <div>
            <select
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              aria-label="Filtrar por biotecnología"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-lg-green/40"
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
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-lg-green/40"
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
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-slate-700 text-sm font-semibold transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Limpiar Filtros</span>
          </button>
        </div>

        {/* Grilla de productos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-80 rounded-3xl bg-white border border-stone-200 p-6 animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-3">
            <p className="font-display font-bold text-lg text-slate-900">
              No encontramos variedades con esos criterios
            </p>
            <p className="text-sm text-slate-600">
              Probá ampliando la región agroecológica o limpiando los filtros activos.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-lg-forest text-white text-sm font-semibold"
            >
              Mostrar todo el catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {products.map((item) => {
              const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.maiz;
              const isSelectedCompare = compareIds.includes(item.id);
              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-3xl border border-stone-200/90 shadow-card hover:shadow-soft hover:border-lg-green/40 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    <div className={`h-1.5 w-full bg-gradient-to-r ${style.accent}`} />
                    <div className="p-5 sm:p-6 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${style.badge}`}
                        >
                          {item.categoryLabel}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold">
                          {item.technology}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display font-extrabold text-xl text-slate-900 group-hover:text-lg-forest transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs font-semibold text-lg-green mt-0.5">
                          Ciclo: {item.cycle} · {item.relativeMaturity}
                        </p>
                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                          {item.tagline}
                        </p>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        <ScoreBar label="Potencial de Rinde" value={item.scores.yieldPotential} />
                        <ScoreBar label="Estabilidad Ambiental" value={item.scores.stability} />
                        <ScoreBar label="Sanidad Integral" value={item.scores.sanitaryProfile} />
                      </div>

                      <ul className="space-y-1.5 pt-1">
                        {item.highlights.slice(0, 2).map((hl) => (
                          <li key={hl} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-lg-green shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-stone-100 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveProduct(item)}
                      className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-lg-forest hover:bg-lg-green text-white text-sm font-semibold transition-colors"
                    >
                      <span>Ficha Técnica</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleCompare(item.id)}
                      className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                        isSelectedCompare
                          ? 'bg-amber-50 border-amber-400 text-amber-900'
                          : 'bg-white border-stone-200 text-slate-700 hover:bg-stone-50'
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
        )}
      </div>

      {/* Barra flotante de comparador */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 z-40 max-w-3xl mx-auto">
          <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <Scale className="w-5 h-5 text-lg-gold shrink-0" />
              <span className="text-sm font-semibold">
                {compareIds.length}/3 seleccionados:
              </span>
              {compareItems.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-bold text-amber-200"
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
                className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                className="flex-1 sm:flex-initial min-h-[42px] px-4 py-2 rounded-xl bg-lg-gold hover:bg-amber-400 text-slate-950 font-bold text-sm"
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
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="bg-white w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-lg-forest text-xs font-bold">
                    {activeProduct.categoryLabel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-bold">
                    {activeProduct.technology}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                  {activeProduct.name}
                </h3>
                <p className="text-sm text-slate-600 mt-1">{activeProduct.tagline}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveProduct(null)}
                aria-label="Cerrar ficha técnica"
                className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-slate-600 hover:bg-stone-100 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {activeProduct.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ciclo & Madurez
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {activeProduct.cycle} ({activeProduct.relativeMaturity})
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Fechas de Siembra
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {activeProduct.sowingDates.join(' / ')}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Densidad Temprana
                </p>
                <p className="text-sm font-semibold text-lg-forest mt-0.5">
                  {activeProduct.recommendedDensity.Temprana}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Densidad Tardía
                </p>
                <p className="text-sm font-semibold text-lg-forest mt-0.5">
                  {activeProduct.recommendedDensity.Tardía}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-lg-green" />
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
                    <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                    <p className="font-display font-extrabold text-xl text-lg-forest mt-0.5">
                      {activeProduct.sanitaryDetail[s.k]}/10
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Regiones recomendadas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeProduct.regions.map((reg) => (
                  <span
                    key={reg}
                    className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-lg-forest"
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
                className="flex-1 min-h-[48px] px-5 py-3 rounded-xl bg-lg-forest hover:bg-lg-green text-white font-bold text-sm transition-colors"
              >
                Solicitar Cotización de {activeProduct.name}
              </button>
              <button
                type="button"
                onClick={() => setActiveProduct(null)}
                className="min-h-[48px] px-5 py-3 rounded-xl border border-stone-200 text-slate-700 font-semibold text-sm hover:bg-stone-50"
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
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowCompareModal(false)}
        >
          <div
            className="bg-white w-full sm:max-w-4xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900">
                  Comparador Técnico LG Semillas
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Comparativa directa de ciclo, tecnología, rinde y sanidad.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stone-200 p-4 bg-stone-50/70 space-y-3"
                >
                  <div className="border-b border-stone-200 pb-3">
                    <span className="text-xs font-bold text-lg-green">{item.categoryLabel}</span>
                    <h4 className="font-display font-extrabold text-lg text-slate-900">
                      {item.name}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      {item.technology} · {item.relativeMaturity}
                    </p>
                  </div>
                  <ScoreBar label="Potencial Rinde" value={item.scores.yieldPotential} />
                  <ScoreBar label="Estabilidad" value={item.scores.stability} />
                  <ScoreBar label="Sanidad" value={item.scores.sanitaryProfile} />
                  <ScoreBar label="Caña / Estructura" value={item.scores.stalkStrength} />
                  <div className="text-xs text-slate-600 pt-1 space-y-1">
                    <p>
                      <strong>Temprana:</strong> {item.recommendedDensity.Temprana}
                    </p>
                    <p>
                      <strong>Tardía:</strong> {item.recommendedDensity.Tardía}
                    </p>
                    <p>
                      <strong>Regiones:</strong> {item.regions.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


import { useState } from 'react';
import { Compass, Calculator, Check, Sparkles, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api.js';
import { clientEnv } from '../config/env.js';

const CROP_OPTIONS = [
  { id: 'maiz', label: 'Maíz Grano' },
  { id: 'silo', label: 'Maíz Silo' },
  { id: 'girasol', label: 'Girasol' },
  { id: 'trigo', label: 'Trigo' },
  { id: 'soja', label: 'Soja' },
];

export default function AgroAdvisor({ regions = [], onSelectRecommended }) {
  const [crop, setCrop] = useState('maiz');
  const [region, setRegion] = useState(clientEnv.defaultRegion);
  const [sowingDate, setSowingDate] = useState('Temprana');
  const [priority, setPriority] = useState('equilibrio');
  const [areaHa, setAreaHa] = useState(120);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleRecommend = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await apiService.getRecommendations({
      crop,
      region,
      sowingDate,
      priority,
      areaHa,
    });
    setRecommendations(data.recommendations || []);
    setHasSearched(true);
    setLoading(false);
  };

  return (
    <section
      id="recomendador"
      className="py-14 sm:py-20 bg-gradient-to-b from-white to-brand-lightgray/80 border-y border-stone-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Panel de parámetros */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 shadow-soft p-6 sm:p-8 space-y-5">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-red">
                <Compass className="w-4 h-4" />
                Agro Point · Asistente de Lote
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-navy mt-1.5">
                Recomendador de Híbridos y Densidad
              </h2>
              <p className="text-sm text-brand-gray mt-2">
                Indicá tu cultivo, región y superficie para obtener la terna óptima de LG Semillas y el cálculo orientativo de bolsas.
              </p>
            </div>

            <form onSubmit={handleRecommend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-gray mb-1.5">
                  1. Cultivo a sembrar
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CROP_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCrop(opt.id)}
                      className={`cast-btn-press min-h-[42px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border ${
                        crop === opt.id
                          ? 'bg-brand-red text-white border-brand-red shadow-red'
                          : 'bg-brand-lightgray text-brand-navy border-stone-200 hover:border-brand-red/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="adv-region"
                  className="block text-xs font-bold uppercase tracking-wider text-brand-gray mb-1.5"
                >
                  2. Región Agroecológica
                </label>
                <select
                  id="adv-region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red/30"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-gray mb-1.5">
                    3. Fecha de Siembra
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Temprana', 'Tardía'].map((fecha) => (
                      <button
                        key={fecha}
                        type="button"
                        onClick={() => setSowingDate(fecha)}
                        className={`cast-btn-press min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold border ${
                          sowingDate === fecha
                            ? 'bg-brand-navy text-white border-brand-navy'
                            : 'bg-white text-brand-navy border-stone-200 hover:border-brand-navy/40'
                        }`}
                      >
                        {fecha}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="adv-area"
                    className="block text-xs font-bold uppercase tracking-wider text-brand-gray mb-1.5"
                  >
                    4. Superficie (ha)
                  </label>
                  <div className="relative">
                    <Calculator className="w-4 h-4 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="adv-area"
                      type="number"
                      min="1"
                      max="50000"
                      value={areaHa}
                      onChange={(e) => setAreaHa(e.target.value)}
                      className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="adv-priority"
                  className="block text-xs font-bold uppercase tracking-wider text-brand-gray mb-1.5"
                >
                  5. Objetivo agronómico prioritario
                </label>
                <select
                  id="adv-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red/30"
                >
                  <option value="equilibrio">Equilibrio y estabilidad multi-ambiente</option>
                  <option value="rinde">Máximo techo de rendimiento</option>
                  <option value="sanidad">Máxima sanidad (Roya / Spiroplasma)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cast-btn-press w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-red hover:bg-brand-darkred disabled:opacity-60 text-white font-bold text-sm shadow-red"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>
                  {loading
                    ? 'Calculando recomendación...'
                    : 'Calcular Recomendación para mi Lote'}
                </span>
              </button>
            </form>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-7 space-y-5">
            {!hasSearched ? (
              <div className="bg-brand-navy text-white rounded-3xl p-7 sm:p-10 shadow-soft space-y-5 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-red via-brand-crimson to-brand-coral" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/40 text-rose-200 text-xs font-bold">
                  Asesoramiento Agronómico Digital
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl leading-tight">
                  Planificá tu campaña con datos reales de redes de ensayos
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  Nuestro algoritmo combina la adaptación regional de los programas genéticos de Pergamino, el comportamiento frente a enfermedades y las densidades sugeridas por fecha de siembra.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    'Cálculo automático de bolsas por hectárea',
                    'Posicionamiento para siembra Temprana y Tardía',
                    'Opciones con Refugio MRI (RR2) integradas',
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-brand-slate/80 border border-white/10 p-3.5 text-xs sm:text-sm font-medium flex items-start gap-2"
                    >
                      <Check className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-brand-navy">
                    Top {recommendations.length} Materiales Recomendados
                  </h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-brand-red border border-red-200">
                    {region} · Siembra {sowingDate} · {areaHa} ha
                  </span>
                </div>

                {recommendations.map((rec, index) => (
                  <div
                    key={rec.id}
                    className="cast-card cast-card-enter bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-card flex flex-col sm:flex-row justify-between gap-4"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-brand-red text-white text-xs font-extrabold">
                          #{index + 1} Opción
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-brand-navy text-white text-xs font-bold">
                          {rec.technology}
                        </span>
                        <span className="text-xs font-semibold text-brand-blue">
                          Ajuste ambiental {rec.fitScore} pts
                        </span>
                      </div>
                      <h4 className="font-display font-extrabold text-xl text-brand-navy">
                        {rec.name}
                      </h4>
                      <p className="text-sm text-brand-gray">{rec.tagline}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                        <div className="rounded-xl bg-brand-lightgray border border-stone-200 p-3">
                          <p className="text-[11px] font-bold uppercase text-brand-gray">
                            Densidad Sugerida
                          </p>
                          <p className="text-sm font-bold text-brand-navy">
                            {rec.sowingEstimate?.densityGuide}
                          </p>
                        </div>
                        <div className="rounded-xl bg-red-50/80 border border-red-200 p-3">
                          <p className="text-[11px] font-bold uppercase text-brand-darkred">
                            Estimación para {rec.sowingEstimate?.areaHa} ha
                          </p>
                          <p className="text-sm font-bold text-brand-navy">
                            ~{rec.sowingEstimate?.bagsEstimated} {rec.sowingEstimate?.bagUnit}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onSelectRecommended?.(rec)}
                        className="cast-btn-press cast-btn-arrow min-h-[44px] px-4 py-2.5 rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-sm inline-flex items-center justify-center gap-1.5"
                      >
                        <span>Cotizar</span>
                        <ArrowRight className="w-4 h-4 arrow-icon" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

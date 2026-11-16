import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Search, Award } from 'lucide-react';
import { apiService } from '../services/api.js';

export default function RedLiderMap({ onSelectDistributor }) {
  const [distributors, setDistributors] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const data = await apiService.getDistributors({
        province: selectedProvince,
        search,
      });
      if (!active) return;
      setDistributors(data.items || []);
      if (data.provinces?.length) setProvinces(data.provinces);
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [selectedProvince, search]);

  return (
    <section id="red-lider" className="py-14 sm:py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-lg-gold">
              <Award className="w-4 h-4" />
              Comercialización Exclusiva · +50 Puntos en el País
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white mt-1.5 tracking-tight">
              Red Líder LG: encontrá tu distribuidor oficial
            </h2>
            <p className="text-slate-300 mt-2 text-sm sm:text-base">
              Asesoramiento agronómico personalizado, ensayos comparativos zonales y entrega directa de bolsas en todas las regiones productivas de Argentina.
            </p>
          </div>
          <div className="text-sm font-semibold text-emerald-300 shrink-0">
            {distributors.length} agentes encontrados
          </div>
        </div>

        {/* Filtros Red Líder */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 sm:p-4 mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por localidad, provincia, distribuidor o cultivo..."
              className="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-lg-gold"
            />
          </div>
          <div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              aria-label="Filtrar distribuidores por provincia"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lg-gold"
            >
              <option value="all">Todas las provincias</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tarjetas de distribuidores */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-56 rounded-3xl bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : distributors.length === 0 ? (
          <div className="rounded-3xl bg-slate-800/60 border border-slate-700 p-8 text-center">
            <p className="font-bold text-lg text-white">
              No encontramos distribuidores con ese filtro
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedProvince('all');
                setSearch('');
              }}
              className="mt-3 min-h-[42px] px-4 py-2 rounded-xl bg-lg-gold text-slate-950 font-bold text-sm"
            >
              Ver toda la Red Líder LG
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {distributors.map((dist) => (
              <article
                key={dist.id}
                className="rounded-3xl bg-slate-800/75 border border-slate-700 hover:border-lg-gold/60 p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/20 text-xs font-bold">
                      {dist.badge}
                    </span>
                    <span className="text-xs font-semibold text-amber-300">{dist.region}</span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-white">{dist.name}</h3>
                    <p className="text-xs font-semibold text-slate-300 mt-0.5">
                      {dist.city}, {dist.province}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-lg-gold shrink-0 mt-0.5" />
                      <span>{dist.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-lg-gold shrink-0" />
                      <a href={`tel:${dist.phone}`} className="hover:text-white">
                        {dist.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-lg-gold shrink-0" />
                      <a href={`mailto:${dist.email}`} className="hover:text-white truncate">
                        {dist.email}
                      </a>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dist.crops.map((crop) => (
                      <span
                        key={crop}
                        className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[11px] font-medium border border-slate-700"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDistributor?.(dist)}
                  className="w-full min-h-[44px] rounded-xl bg-white/10 hover:bg-lg-gold hover:text-slate-950 text-white font-semibold text-sm transition-colors"
                >
                  Contactar Agente {dist.city}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


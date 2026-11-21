import { useEffect, useMemo, useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Search,
  ExternalLink,
  Navigation,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { apiService } from '../services/api.js';

// Límites geográficos de cobertura (Argentina agrícola + Uruguay)
const MAP_BOUNDS = {
  latMin: -40.2,
  latMax: -25.4,
  lngMin: -68.2,
  lngMax: -54.0,
  width: 420,
  height: 480,
  padX: 28,
  padY: 28,
};

const projectCoords = (lat, lng) => {
  const xRatio = (lng - MAP_BOUNDS.lngMin) / (MAP_BOUNDS.lngMax - MAP_BOUNDS.lngMin);
  const yRatio = (MAP_BOUNDS.latMax - lat) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin);
  return {
    x: MAP_BOUNDS.padX + xRatio * (MAP_BOUNDS.width - MAP_BOUNDS.padX * 2),
    y: MAP_BOUNDS.padY + yRatio * (MAP_BOUNDS.height - MAP_BOUNDS.padY * 2),
  };
};

// Polígonos simplificados en coordenadas reales [lat, lng] para coincidir con precisión con los pines
const ARGENTINA_NORTH_CENTRAL_POLYGON = [
  [-25.6, -66.5],
  [-25.6, -58.0],
  [-27.4, -55.8],
  [-29.7, -57.1],
  [-30.2, -57.9],
  [-33.0, -58.3],
  [-34.4, -58.5],
  [-35.2, -57.3],
  [-36.3, -56.7],
  [-38.0, -57.5],
  [-38.9, -59.8],
  [-39.1, -62.1],
  [-39.9, -63.0],
  [-39.2, -66.9],
  [-35.8, -67.8],
  [-32.8, -67.5],
  [-29.2, -66.9],
  [-26.5, -66.3],
];

const URUGUAY_POLYGON = [
  [-30.2, -57.9],
  [-30.9, -55.5],
  [-32.7, -53.8],
  [-34.4, -53.8],
  [-34.9, -55.0],
  [-34.9, -56.2],
  [-34.4, -57.8],
  [-33.2, -58.3],
];

const toSvgPoints = (coords) =>
  coords
    .map(([lat, lng]) => {
      const { x, y } = projectCoords(lat, lng);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

const PROVINCE_LABELS = [
  { name: 'NOA / Chaco', lat: -26.8, lng: -63.2 },
  { name: 'Córdoba', lat: -31.8, lng: -64.1 },
  { name: 'Santa Fe', lat: -31.5, lng: -60.9 },
  { name: 'Entre Ríos', lat: -31.9, lng: -59.2 },
  { name: 'Buenos Aires', lat: -36.2, lng: -60.4 },
  { name: 'La Pampa', lat: -36.6, lng: -64.6 },
  { name: 'Uruguay', lat: -32.7, lng: -55.9 },
];

export default function RedLiderMap({ onSelectDistributor }) {
  const [distributors, setDistributors] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [showAllCards, setShowAllCards] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const data = await apiService.getDistributors({
        province: selectedProvince,
        search,
      });
      if (!active) return;
      const items = data.items || [];
      setDistributors(items);
      if (data.provinces?.length) setProvinces(data.provinces);
      if (items.length > 0) {
        setActiveId((prev) => (items.some((d) => d.id === prev) ? prev : items[0].id));
      } else {
        setActiveId(null);
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [selectedProvince, search]);

  const activeDistributor = useMemo(
    () => distributors.find((d) => d.id === activeId) || distributors[0] || null,
    [distributors, activeId]
  );

  const argentinaPoints = useMemo(() => toSvgPoints(ARGENTINA_NORTH_CENTRAL_POLYGON), []);
  const uruguayPoints = useMemo(() => toSvgPoints(URUGUAY_POLYGON), []);

  const displayedDistributors = useMemo(() => {
    if (showAllCards || selectedProvince !== 'all' || search.trim()) return distributors;
    return distributors.slice(0, 12);
  }, [distributors, showAllCards, selectedProvince, search]);

  return (
    <section
      id="red-lider"
      className="py-16 sm:py-24 bg-[#f6f6f7] text-brand-navy border-y border-stone-200 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header estilo sitio oficial con insignia Red Líder y link al portal */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src="/assets/logo/red-lider-badge.png"
              alt="Red Líder LG"
              className="w-24 sm:w-28 h-auto object-contain bg-white rounded-2xl p-2.5 shadow-sm border border-stone-200 shrink-0"
            />
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
                Comercialización Exclusiva · Argentina &amp; Uruguay
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-brand-navy mt-1.5 tracking-tight">
                Encontrá tu distribuidor <span className="text-brand-red">Red Líder LG</span>
              </h2>
              <p className="text-brand-gray mt-2 text-sm sm:text-base max-w-2xl">
                Red de referentes técnicos y comerciales para asesoramiento agronómico personalizado, genética adaptada a cada ambiente y logística directa.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <span className="px-4 py-2 rounded-full bg-white border border-stone-200 text-xs font-bold text-brand-navy shadow-sm">
              {distributors.length} agentes oficiales
            </span>
            <a
              href="http://redliderlg.rambla.la/"
              target="_blank"
              rel="noopener noreferrer"
              className="cast-btn-press inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-brand-red hover:bg-brand-darkred text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md"
            >
              Ingresá a tu cuenta LG Líder
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Pastillas de provincias */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-5">
          <button
            type="button"
            onClick={() => setSelectedProvince('all')}
            className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              selectedProvince === 'all'
                ? 'bg-brand-red text-white shadow-sm'
                : 'bg-white text-brand-navy border border-stone-200 hover:border-brand-red'
            }`}
          >
            Todas ({provinces.length})
          </button>
          {provinces.map((prov) => (
            <button
              key={prov}
              type="button"
              onClick={() => setSelectedProvince(prov)}
              className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                selectedProvince === prov
                  ? 'bg-brand-red text-white shadow-sm'
                  : 'bg-white text-brand-navy border border-stone-200 hover:border-brand-red'
              }`}
            >
              {prov}
            </button>
          ))}
        </div>

        {/* Buscador y Selector */}
        <div className="bg-white border border-stone-200 rounded-2xl p-3.5 sm:p-4 mb-8 grid grid-cols-1 md:grid-cols-3 gap-3 shadow-sm">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-brand-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por localidad, provincia, distribuidor o cultivo..."
              className="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-xl bg-brand-lightgray border border-stone-200 text-brand-navy placeholder:text-brand-gray text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
          <div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              aria-label="Filtrar distribuidores por provincia"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-brand-lightgray border border-stone-200 text-brand-navy text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red"
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

        {/* Vista Split: Mapa Geolocalizado SVG (Izq) + Tarjetas de Distribuidores (Der) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Columna izquierda: Mapa interactivo + Ficha de punto seleccionado */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl bg-brand-navy p-4 sm:p-5 text-white shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-200">
                    Mapa Red Líder Interactivo
                  </span>
                </div>
                <span className="text-[11px] font-medium text-stone-400">
                  Clic en un pin para ver detalle
                </span>
              </div>

              <div className="rounded-2xl bg-brand-slate border border-white/10 overflow-hidden">
                <svg
                  viewBox={`0 0 ${MAP_BOUNDS.width} ${MAP_BOUNDS.height}`}
                  className="w-full h-auto block select-none"
                  role="img"
                  aria-label="Mapa geolocalizado de distribuidores Red Líder LG en Argentina y Uruguay"
                >
                  <defs>
                    <pattern id="redLiderGrid" width="28" height="28" patternUnits="userSpaceOnUse">
                      <path
                        d="M 28 0 L 0 0 0 28"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>

                  <rect width={MAP_BOUNDS.width} height={MAP_BOUNDS.height} fill="url(#redLiderGrid)" />

                  {/* Siluetas geográficas calibradas */}
                  <polygon
                    points={argentinaPoints}
                    fill="#1f2542"
                    stroke="rgba(227,0,44,0.45)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points={uruguayPoints}
                    fill="#1b213b"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />

                  {/* Etiquetas regionales */}
                  {PROVINCE_LABELS.map((lbl) => {
                    const { x, y } = projectCoords(lbl.lat, lbl.lng);
                    return (
                      <text
                        key={lbl.name}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        className="fill-stone-400/75 text-[9px] font-bold uppercase tracking-wider pointer-events-none"
                      >
                        {lbl.name}
                      </text>
                    );
                  })}

                  {/* Pines de los 57 distribuidores geolocalizados */}
                  {distributors
                    .filter((d) => typeof d.lat === 'number' && typeof d.lng === 'number')
                    .map((dist) => {
                      const { x, y } = projectCoords(dist.lat, dist.lng);
                      const isActive = dist.id === activeDistributor?.id;
                      return (
                        <g
                          key={dist.id}
                          transform={`translate(${x}, ${y})`}
                          className="cursor-pointer"
                          onClick={() => setActiveId(dist.id)}
                          role="button"
                          tabIndex={0}
                          aria-label={`${dist.name} en ${dist.city}, ${dist.province}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setActiveId(dist.id);
                            }
                          }}
                        >
                          {isActive && (
                            <circle r="14" fill="rgba(227, 0, 44, 0.28)" className="animate-ping" />
                          )}
                          <circle
                            r={isActive ? 7.5 : 4.5}
                            fill={isActive ? '#ffffff' : '#E3002C'}
                            stroke={isActive ? '#E3002C' : '#ffffff'}
                            strokeWidth={isActive ? 3 : 1.2}
                          />
                          <title>{`${dist.name} — ${dist.city}, ${dist.province}`}</title>
                        </g>
                      );
                    })}
                </svg>
              </div>
            </div>

            {/* Tarjeta del distribuidor seleccionado */}
            {activeDistributor && (
              <div className="rounded-3xl bg-white border-2 border-brand-red/80 p-5 sm:p-6 shadow-md space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-red/10 text-brand-red text-[11px] font-extrabold uppercase tracking-wider">
                    {activeDistributor.badge}
                  </span>
                  <span className="text-xs font-semibold text-brand-gray">
                    {activeDistributor.region}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-xl text-brand-navy">
                    {activeDistributor.name}
                  </h3>
                  <p className="text-xs font-semibold text-brand-red mt-0.5">
                    {activeDistributor.city}, {activeDistributor.province}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-brand-gray pt-1">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                    <span>{activeDistributor.address}</span>
                  </p>
                  {activeDistributor.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-brand-red shrink-0" />
                      <a href={`tel:${activeDistributor.phone}`} className="hover:text-brand-red font-medium">
                        {activeDistributor.phone}
                      </a>
                    </p>
                  )}
                  {activeDistributor.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-red shrink-0" />
                      <a
                        href={`mailto:${activeDistributor.email}`}
                        className="hover:text-brand-red truncate font-medium"
                      >
                        {activeDistributor.email}
                      </a>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectDistributor?.(activeDistributor)}
                    className="cast-btn-press flex-1 min-h-[44px] rounded-xl bg-brand-red hover:bg-brand-darkred text-white font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-1.5"
                  >
                    Contactar Agente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {typeof activeDistributor.lat === 'number' &&
                    typeof activeDistributor.lng === 'number' && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${activeDistributor.lat},${activeDistributor.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] px-4 rounded-xl bg-brand-lightgray hover:bg-stone-200 text-brand-navy font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-brand-red" />
                        Cómo llegar
                      </a>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha: Lista/grilla de distribuidores */}
          <div className="lg:col-span-7">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-48 rounded-2xl bg-white border border-stone-200 animate-pulse" />
                ))}
              </div>
            ) : distributors.length === 0 ? (
              <div className="rounded-3xl bg-white border border-stone-200 p-8 text-center">
                <p className="font-bold text-lg text-brand-navy">
                  No encontramos distribuidores con ese filtro
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProvince('all');
                    setSearch('');
                  }}
                  className="mt-3 min-h-[44px] px-5 py-2 rounded-xl bg-brand-red text-white font-bold text-sm"
                >
                  Ver toda la Red Líder LG
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:max-h-[680px] lg:overflow-y-auto lg:pr-1">
                  {displayedDistributors.map((dist) => {
                    const isSelected = dist.id === activeDistributor?.id;
                    return (
                      <article
                        key={dist.id}
                        onClick={() => setActiveId(dist.id)}
                        className={`cast-card cursor-pointer rounded-2xl bg-white p-5 flex flex-col justify-between gap-3 border transition-all ${
                          isSelected
                            ? 'border-brand-red ring-2 ring-brand-red/20 shadow-md'
                            : 'border-stone-200 hover:border-brand-red/60 shadow-sm'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-brand-red/10 text-brand-red text-[11px] font-bold">
                              {dist.badge}
                            </span>
                            <span className="text-[11px] font-semibold text-brand-gray">
                              {dist.province}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-display font-bold text-base text-brand-navy leading-snug">
                              {dist.name}
                            </h3>
                            <p className="text-xs font-semibold text-brand-gray mt-0.5">
                              {dist.city} · {dist.region}
                            </p>
                          </div>

                          <div className="space-y-1 text-xs text-brand-gray">
                            <p className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{dist.address}</span>
                            </p>
                            {dist.phone && (
                              <p className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-brand-red shrink-0" />
                                <span>{dist.phone}</span>
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {(dist.crops || []).slice(0, 4).map((crop) => (
                              <span
                                key={crop}
                                className="px-2 py-0.5 rounded bg-brand-lightgray text-brand-navy text-[10px] font-semibold"
                              >
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveId(dist.id);
                            onSelectDistributor?.(dist);
                          }}
                          className="cast-btn-press w-full min-h-[42px] rounded-xl bg-brand-lightgray hover:bg-brand-red text-brand-navy hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
                        >
                          Contactar Agente {dist.city}
                        </button>
                      </article>
                    );
                  })}
                </div>

                {distributors.length > 12 && selectedProvince === 'all' && !search.trim() && (
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAllCards((prev) => !prev)}
                      className="min-h-[44px] px-6 py-2 rounded-full bg-white border border-stone-300 hover:border-brand-red text-brand-navy text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
                    >
                      {showAllCards ? (
                        <>
                          Mostrar resumen (12)
                          <ChevronUp className="w-4 h-4 text-brand-red" />
                        </>
                      ) : (
                        <>
                          Ver los {distributors.length} puntos Red Líder LG
                          <ChevronDown className="w-4 h-4 text-brand-red" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

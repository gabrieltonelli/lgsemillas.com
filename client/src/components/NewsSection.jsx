import { useEffect, useState } from 'react';
import { BookOpen, Clock, ArrowRight, X, Play } from 'lucide-react';
import { apiService } from '../services/api.js';

const FEATURED_VIDEOS = [
  {
    id: 'dR6MN8LLEQw',
    title: 'Enraízados en el Propósito. Cultivando el futuro.',
    description:
      'En 2025, la marca LG celebra 60 años de confianza, innovación y colaboración. LG fue creada por productores y para productores. Fundada en 1965 por Limagrain, una cooperativa en Limagne Val d´Allier, Francia, LG se convirtió en una marca confiable en 77 países que brinda soluciones para producir mejor, con inteligencia y de manera más sostenible.',
    embedUrl: 'https://www.youtube.com/embed/dR6MN8LLEQw',
    externalUrl: 'https://www.youtube.com/watch?v=dR6MN8LLEQw',
    ctaLabel: 'VER VIDEO',
  },
  {
    id: 'z1D86gh3zcA',
    title:
      '¿Hacia dónde orientan la investigación en semillas de Maíz las empresas?; con T. Reynal e I. Martínez - Limagrain',
    description:
      'El maíz es un cultivo estratégico para los Productores. La necesidad para las rotaciones, su valor en alimentación y exportación. Una charla con Tomás Reynal (Líder de Limagrain Semillas), e Ignacio Martínez Martínez (Investigador del cultivo de Maíz) sobre la visión y la inversión en mejoramiento genético. Grandes líneas de trabajo orientadas a: rinde, estabilidad, flexibilidad, tolerancias a chicharrita y enfermedades.',
    embedUrl: 'https://www.youtube.com/embed/z1D86gh3zcA',
    externalUrl:
      'https://www.agrositio.com.ar/canal-agrositio/entrevistas/240452-hacia-donde-orientan-la-investigacion-en-semillas-de-maiz-las-empresas-con-t-reynal-e-i-martinez-limagrain.html',
    ctaLabel: 'VER NOTA',
  },
];

export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loadedVideos, setLoadedVideos] = useState({});

  useEffect(() => {
    let active = true;
    apiService.getArticles().then((items) => {
      if (active) setArticles(items);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="novedades" className="py-14 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Bloque 1: Los 2 Videos / Novedades principales de la captura oficial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {FEATURED_VIDEOS.map((vid) => {
            const isActivated = Boolean(loadedVideos[vid.id]);
            return (
              <article key={vid.id} className="flex flex-col justify-between">
                <div className="space-y-5">
                  {/* Reproductor interactivo YouTube con portada nítida y carga al hacer clic (ultra rápido en Lighthouse/Playwright) */}
                  <div className="relative rounded-2xl overflow-hidden bg-brand-navy aspect-video shadow-card border border-stone-200 group">
                    {isActivated ? (
                      <iframe
                        src={`${vid.embedUrl}?autoplay=1`}
                        title={vid.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setLoadedVideos((prev) => ({ ...prev, [vid.id]: true }))}
                        aria-label={`Reproducir video: ${vid.title}`}
                        className="relative w-full h-full block text-left"
                      >
                        <img
                          src={`https://i.ytimg.com/vi/${vid.id}/hqdefault.jpg`}
                          alt={vid.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />
                        <div className="absolute top-3 left-3 right-3 flex items-center gap-2.5">
                          <img
                            src="/favicon.png"
                            alt=""
                            className="w-7 h-7 rounded-full bg-white p-0.5 object-contain"
                          />
                          <span className="text-xs sm:text-sm font-bold text-white line-clamp-1 drop-shadow">
                            {vid.title}
                          </span>
                        </div>
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-16 h-11 rounded-2xl bg-brand-red group-hover:bg-brand-darkred flex items-center justify-center shadow-2xl transition-transform duration-200 group-hover:scale-110">
                            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                          </span>
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-brand-red leading-snug">
                      <a
                        href={vid.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {vid.title}
                      </a>
                    </h3>
                    <p className="text-sm sm:text-base text-brand-gray leading-relaxed">
                      {vid.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200">
                  <a
                    href={vid.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-brand-red hover:text-brand-darkred group"
                  >
                    <span>{vid.ctaLabel}</span>
                    <img
                      src="/assets/misc/arrow-right.png"
                      alt="→"
                      className="w-5 h-auto object-contain transition-transform duration-200 group-hover:translate-x-1.5"
                    />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bloque 2: Informes Técnicos Agro Point */}
        <div className="pt-8 border-t border-stone-200">
          <div className="max-w-2xl mb-7">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-red">
              <BookOpen className="w-4 h-4" />
              Agro Point · Conocimiento Agronómico
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-navy mt-1 tracking-tight">
              Informes técnicos, ensayos y Buenas Prácticas Agrícolas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {articles.map((article) => (
              <article
                key={article.id}
                className="cast-card bg-brand-lightgray/70 rounded-3xl border border-stone-200 p-6 shadow-sm hover:bg-white hover:shadow-card hover:border-brand-red/40 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-brand-red font-bold">
                      {article.tag}
                    </span>
                    <span className="inline-flex items-center gap-1 text-brand-gray font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-brand-navy leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-brand-gray leading-relaxed">{article.excerpt}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="cast-btn-arrow self-start min-h-[40px] inline-flex items-center gap-1.5 text-sm font-bold text-brand-red hover:text-brand-darkred transition-colors"
                >
                  <span>Leer informe completo</span>
                  <ArrowRight className="w-4 h-4 arrow-icon" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de lectura técnica */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 bg-brand-navy/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="cast-modal-enter bg-white w-full sm:max-w-2xl max-h-[90dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider">
                  {selectedArticle.tag} · {selectedArticle.date}
                </span>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-brand-navy mt-1">
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                aria-label="Cerrar artículo"
                className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-brand-navy shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-brand-navy/90 leading-relaxed">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="cast-btn-press min-h-[44px] px-5 py-2.5 rounded-xl bg-brand-red text-white font-bold text-sm"
              >
                Cerrar informe
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

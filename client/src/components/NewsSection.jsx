import { useEffect, useState } from 'react';
import { BookOpen, Clock, ArrowRight, X } from 'lucide-react';
import { apiService } from '../services/api.js';

export default function NewsSection() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

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
    <section id="novedades" className="py-14 sm:py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-lg-green">
            <BookOpen className="w-4 h-4" />
            Agro Point · Conocimiento Agronómico
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 mt-1.5 tracking-tight">
            Ensayos, sanidad y Buenas Prácticas Agrícolas
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Recomendaciones técnicas desarrolladas por nuestro equipo de I+D en Pergamino para maximizar el retorno de cada bolsa sembrada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-card hover:shadow-soft hover:border-lg-green/40 transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-lg-forest font-bold">
                    {article.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{article.excerpt}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticle(article)}
                className="self-start min-h-[42px] inline-flex items-center gap-1.5 text-sm font-bold text-lg-forest hover:text-lg-green transition-colors"
              >
                <span>Leer informe completo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Modal de lectura técnica */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white w-full sm:max-w-2xl max-h-[90dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-bold text-lg-green uppercase tracking-wider">
                  {selectedArticle.tag} · {selectedArticle.date}
                </span>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 mt-1">
                  {selectedArticle.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                aria-label="Cerrar artículo"
                className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-slate-600 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-lg-forest text-white font-semibold text-sm"
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


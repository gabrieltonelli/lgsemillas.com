import { Building2, Microscope, Sprout, ShieldCheck } from 'lucide-react';

const PILLAR_ICONS = {
  cooperativa: Building2,
  pergamino: Microscope,
  bpa: Sprout,
};

export default function AboutSection({ company }) {
  return (
    <section id="nosotros" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Relato institucional */}
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-lg-green">
              Quiénes Somos · Limagrain Argentina
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
              Una cooperativa agrícola internacional con raíces profundas en Pergamino
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              <strong>LG Semillas</strong> es la marca global de cultivos extensivos del grupo{' '}
              <strong>Limagrain</strong>, una cooperativa agrícola nacida en Francia y dirigida por
              productores agropecuarios. Desde <strong>2011 en Argentina</strong>, potenciamos el
              mejoramiento genético local integrando la trayectoria histórica de{' '}
              <strong>Sursem</strong> con más de 70 programas de investigación en todo el mundo.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Nuestra base operativa, estación experimental y planta de procesamiento ubicada en{' '}
              <strong>Ruta 32 Km. 2, Pergamino (Buenos Aires)</strong> trabaja día a día para
              ofrecer semillas de alta pureza varietal, vigor germinativo y sanidad adaptada a cada
              subregión productiva.
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3.5">
              <ShieldCheck className="w-6 h-6 text-lg-forest shrink-0 mt-0.5" />
              <div>
                <p className="font-display font-bold text-slate-900 text-sm sm:text-base">
                  Compromiso con la Ética y la Sustentabilidad
                </p>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Promovemos la agricultura responsable, el cumplimiento de Programas MRI (Refugio
                  10%) y la transparencia institucional mediante nuestro Código de Conducta global.
                </p>
              </div>
            </div>
          </div>

          {/* Pilares */}
          <div className="lg:col-span-6 space-y-4">
            {(company?.pillars || []).map((pillar) => {
              const Icon = PILLAR_ICONS[pillar.id] || Sprout;
              return (
                <div
                  key={pillar.id}
                  className="rounded-3xl border border-stone-200 bg-stone-50/70 p-5 sm:p-6 flex items-start gap-4 hover:border-lg-green/40 hover:bg-white hover:shadow-card transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-lg-forest text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="w-6 h-6 text-lg-gold" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


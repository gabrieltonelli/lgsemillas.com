import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { X, Building2, Microscope, Sprout } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutSection({ company }) {
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.gsap-about-reveal', {
          y: 24,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="nosotros" ref={sectionRef} className="w-full bg-brand-lightgray overflow-hidden">
      {/* Split 50/50 exacto a la captura oficial con profundidad moderna */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Columna Izquierda 50%: Texto oficial Limagrain */}
        <div className="px-6 sm:px-12 lg:px-16 xl:px-24 py-14 sm:py-20 flex flex-col justify-center bg-brand-lightgray">
          <div className="max-w-xl space-y-5">
            <h2 className="gsap-about-reveal font-display font-bold text-3xl sm:text-4xl text-brand-red tracking-tight">
              Limagrain
            </h2>

            <h3 className="gsap-about-reveal font-narrow font-bold text-lg sm:text-xl text-brand-navy uppercase leading-snug tracking-wide">
              4to. semillero mundial, somos una cooperativa fundada y dirigida por agricultores
              franceses.
            </h3>

            <p className="gsap-about-reveal text-sm sm:text-base text-brand-gray leading-relaxed">
              Impulsores de un modelo de empresa inédito entre los líderes de la agroindustria,
              seleccionamos, producimos y comercializamos semillas de cultivos extensivos, semillas
              hortícolas y productos elaborados a base de cereales, únicos en el mercado. Desde
              nuestra tierra, en Francia, expandimos nuestros negocios a más de 56 países con la
              ayuda de más de 10.000 colaboradores.{' '}
              <img
                src="/favicon.png"
                alt="LG"
                className="inline-block w-5 h-5 mx-0.5 align-text-bottom object-contain"
              />{' '}
              es la marca global para semillas de cultivos extensivos de Limagrain.
            </p>

            {/* Métricas rápidas integradas con estética limpia */}
            <div className="gsap-about-reveal grid grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl bg-white p-3.5 border border-stone-200 shadow-sm">
                <p className="font-display font-extrabold text-xl text-brand-red">+70</p>
                <p className="text-[11px] font-bold text-brand-navy uppercase">Programas I+D</p>
              </div>
              <div className="rounded-2xl bg-white p-3.5 border border-stone-200 shadow-sm">
                <p className="font-display font-extrabold text-xl text-brand-red">56+</p>
                <p className="text-[11px] font-bold text-brand-navy uppercase">Países</p>
              </div>
              <div className="rounded-2xl bg-white p-3.5 border border-stone-200 shadow-sm">
                <p className="font-display font-extrabold text-xl text-brand-red">2011</p>
                <p className="text-[11px] font-bold text-brand-navy uppercase">En Argentina</p>
              </div>
            </div>

            <div className="gsap-about-reveal pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="cast-btn-arrow inline-flex items-center gap-2 font-narrow font-bold uppercase text-sm sm:text-base text-brand-navy hover:text-brand-red transition-colors group"
              >
                <span>Descubrí más de</span>
                <img
                  src="/assets/logo/logo3.png"
                  alt="LG Semillas"
                  className="w-6 h-6 object-contain"
                />
                <img
                  src="/assets/misc/arrow-right.png"
                  alt="→"
                  className="w-5 h-auto object-contain transition-transform duration-200 group-hover:translate-x-1.5"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha 50%: Fotografía del edificio oficial Limagrain */}
        <div className="relative min-h-[340px] sm:min-h-[460px] lg:min-h-[540px] overflow-hidden bg-brand-navy group">
          <img
            src="/assets/hero/oficina.jpg"
            alt="Edificio Corporativo Limagrain"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent"
          />
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-stone-200">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-red">
                Base Operativa Argentina
              </p>
              <p className="font-display font-bold text-sm text-brand-navy">
                Ruta 32 Km. 2 · Pergamino, Prov. de Buenos Aires
              </p>
            </div>
            <img
              src="/assets/logo/limagrain.png"
              alt="Limagrain"
              className="h-6 w-auto object-contain bg-brand-gray/90 rounded-lg px-2 py-1"
            />
          </div>
        </div>
      </div>

      {/* Modal interactivo "Descubrí más de LG" con historia real */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-brand-navy/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="cast-modal-enter bg-white w-full sm:max-w-2xl max-h-[90dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <img src="/assets/logo/logo3.png" alt="LG" className="w-10 h-10 object-contain" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-red">
                    Historia & Ciencia Genética
                  </span>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-brand-navy">
                    Limagrain y LG Semillas en Argentina
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Cerrar"
                className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-brand-navy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-brand-gray leading-relaxed">
              <p>
                Globalmente, el grupo cuenta con <strong className="text-brand-navy">71 estaciones experimentales</strong> e invierte más de <strong className="text-brand-navy">€100 millones anuales</strong> en programas de investigación y mejoramiento genético. Limagrain comenzó su programa de investigación en Argentina en <strong className="text-brand-navy">2011</strong>, logrando semillas de altísimo potencial en maíz, girasol, trigo, soja y cebada.
              </p>
              <p>
                En <strong className="text-brand-navy">2018</strong> el grupo adquirió <strong className="text-brand-navy">Sursem S.A.</strong>, compañía de 30 años con sede en Pergamino y profundo arraigo en el mercado argentino, consolidando nuestra plataforma genética para todo Sudamérica.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  icon: Building2,
                  title: 'Cooperativa Francesa',
                  text: 'Fundada en 1965 en Limagne Val d’Allier por agricultores.',
                },
                {
                  icon: Microscope,
                  title: 'Estación Pergamino',
                  text: 'Desarrollo adaptado a Zona Núcleo, Sur, Oeste y Norte.',
                },
                {
                  icon: Sprout,
                  title: 'Refugio MRI 10%',
                  text: 'Compromiso activo con las Buenas Prácticas Agrícolas.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-brand-lightgray p-4 border border-stone-200 space-y-2"
                  >
                    <Icon className="w-5 h-5 text-brand-red" />
                    <p className="font-display font-bold text-sm text-brand-navy">{item.title}</p>
                    <p className="text-xs text-brand-gray">{item.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-brand-red text-white font-bold text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

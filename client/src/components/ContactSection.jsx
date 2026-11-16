import { useEffect, useState } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Send,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { clientEnv } from '../config/env.js';
import { apiService } from '../services/api.js';

export default function ContactSection({ prefilledInquiry, careersAreas = [] }) {
  const [activeTab, setActiveTab] = useState('contact');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    province: '',
    cropInterest: 'Maíz Grano',
    message: '',
  });
  const [careerForm, setCareerForm] = useState({
    name: '',
    email: '',
    phone: '',
    area: careersAreas[0] || 'Desarrollo Técnico y Ensayos a Campo',
    linkedin: '',
    message: '',
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => {
    if (!prefilledInquiry) return;
    setActiveTab('contact');
    setContactForm((prev) => ({
      ...prev,
      cropInterest: prefilledInquiry.cropInterest || prev.cropInterest,
      province: prefilledInquiry.province || prev.province,
      message: prefilledInquiry.message || prev.message,
    }));
    setStatus({ loading: false, error: '', success: '' });
  }, [prefilledInquiry]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      const response = await apiService.submitContact(contactForm);
      setStatus({
        loading: false,
        error: '',
        success: `${response.message} (Ticket: ${response.ticketId})`,
      });
      setContactForm({
        name: '',
        email: '',
        phone: '',
        province: '',
        cropInterest: 'Maíz Grano',
        message: '',
      });
    } catch (err) {
      setStatus({
        loading: false,
        error:
          err.message ||
          'No pudimos conectar con el servidor de consultas en este momento. Podés escribirnos directo a nuestro correo institucional.',
        success: '',
      });
    }
  };

  const handleCareerSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    try {
      const response = await apiService.submitCareer(careerForm);
      setStatus({
        loading: false,
        error: '',
        success: `${response.message} (Registro: ${response.applicationId})`,
      });
      setCareerForm({
        name: '',
        email: '',
        phone: '',
        area: careersAreas[0] || 'Desarrollo Técnico y Ensayos a Campo',
        linkedin: '',
        message: '',
      });
    } catch (err) {
      setStatus({
        loading: false,
        error:
          err.message ||
          'No pudimos registrar la postulación. Por favor enviá tu CV al correo institucional.',
        success: '',
      });
    }
  };

  const whatsappUrl = `https://wa.me/${clientEnv.whatsapp}?text=${encodeURIComponent(
    'Hola LG Semillas, quisiera asesoramiento técnico sobre su catálogo de semillas.'
  )}`;

  return (
    <section id="contacto" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Información institucional */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-lg-green">
                Atención Directa · Pergamino, Argentina
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 mt-1.5 tracking-tight">
                Conectá con el equipo de LG Semillas
              </h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Realizá consultas comerciales o agronómicas, sumate a nuestro equipo en Pergamino y las regiones productivas, o accedé a nuestros canales de ética y cumplimiento.
              </p>
            </div>

            <div className="rounded-3xl bg-stone-50 border border-stone-200 p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-lg-forest shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Casa Central & Planta</p>
                  <p className="text-sm font-semibold text-slate-900">{clientEnv.hqAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-lg-forest shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Correo Institucional</p>
                  <a
                    href={`mailto:${clientEnv.contactEmail}`}
                    className="text-sm font-semibold text-lg-forest hover:underline"
                  >
                    {clientEnv.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-lg-forest shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Teléfono de Contacto</p>
                  <a
                    href={`tel:${clientEnv.phone}`}
                    className="text-sm font-semibold text-slate-900 hover:underline"
                  >
                    {clientEnv.phone}
                  </a>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Escribir por WhatsApp Comercial</span>
              </a>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-amber-950 space-y-1">
                <p className="font-bold">Código de Conducta y Canal de Denuncias Éticas</p>
                <p className="text-amber-900/90">
                  Mantenemos un canal confidencial disponible para colaboradores, productores y proveedores.
                </p>
                <a
                  href={clientEnv.ethicsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-bold text-lg-forest hover:underline pt-0.5"
                >
                  Acceder al Canal Ético Limagrain →
                </a>
              </div>
            </div>
          </div>

          {/* Panel de formularios */}
          <div className="lg:col-span-7 bg-stone-50 rounded-3xl border border-stone-200 p-5 sm:p-8 shadow-sm">
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-white p-1.5 rounded-2xl border border-stone-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('contact');
                  setStatus({ loading: false, error: '', success: '' });
                }}
                className={`min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'contact'
                    ? 'bg-lg-forest text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Consulta Técnica</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('careers');
                  setStatus({ loading: false, error: '', success: '' });
                }}
                className={`min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === 'careers'
                    ? 'bg-lg-forest text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Trabajá con Nosotros</span>
              </button>
            </div>

            {status.success && (
              <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <span>{status.success}</span>
              </div>
            )}

            {status.error && (
              <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{status.error}</span>
              </div>
            )}

            {activeTab === 'contact' ? (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Ej. Juan Pérez"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="productor@campo.com.ar"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+54 9 ..."
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Provincia / Localidad *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.province}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, province: e.target.value })
                      }
                      placeholder="Ej. Pergamino, Bs. As."
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cultivo de interés
                    </label>
                    <select
                      value={contactForm.cropInterest}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, cropInterest: e.target.value })
                      }
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40"
                    >
                      <option>Maíz Grano</option>
                      <option>Maíz Silo</option>
                      <option>Girasol</option>
                      <option>Trigo</option>
                      <option>Soja</option>
                      <option>Red Líder LG</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Consulta / Detalle del lote *
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Indicá híbrido o variedad de interés, hectáreas estimadas o consulta agronómica..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-lg-forest hover:bg-lg-green disabled:opacity-60 text-white font-bold text-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{status.loading ? 'Enviando consulta...' : 'Enviar Consulta a LG Semillas'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleCareerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={careerForm.name}
                      onChange={(e) => setCareerForm({ ...careerForm, name: e.target.value })}
                      placeholder="Tu nombre y apellido"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={careerForm.email}
                      onChange={(e) => setCareerForm({ ...careerForm, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Área de interés *
                    </label>
                    <select
                      value={careerForm.area}
                      onChange={(e) => setCareerForm({ ...careerForm, area: e.target.value })}
                      className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40"
                    >
                      {(careersAreas.length
                        ? careersAreas
                        : [
                            'Investigación y Mejoramiento Genético (I+D)',
                            'Desarrollo Técnico y Ensayos a Campo',
                            'Producción de Semillas y Planta Pergamino',
                            'Comercial y Red Líder LG',
                            'Administración, Finanzas y Supply Chain',
                          ]
                      ).map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Perfil LinkedIn o Portfolio
                    </label>
                    <input
                      type="url"
                      value={careerForm.linkedin}
                      onChange={(e) => setCareerForm({ ...careerForm, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Presentación y experiencia *
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={careerForm.message}
                    onChange={(e) => setCareerForm({ ...careerForm, message: e.target.value })}
                    placeholder="Contanos tu formación agronómica o técnica, residencia y motivación para sumarte a Limagrain Argentina..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-lg-green/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-lg-forest hover:bg-lg-green disabled:opacity-60 text-white font-bold text-sm transition-colors"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{status.loading ? 'Enviando postulación...' : 'Enviar Postulación'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


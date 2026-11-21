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

  return (
    <section
      id="contacto"
      className="relative py-16 sm:py-24 bg-brand-red text-white overflow-hidden"
    >
      {/* Fondo duotono rojo exacto del sitio oficial sobre form.jpg */}
      <img
        src="/assets/hero/form.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-35 grayscale contrast-125 mix-blend-multiply pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-brand-darkred/80 via-brand-red/75 to-brand-crimson/85 pointer-events-none"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado centrado oficial */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Contáctenos
          </h2>
          <p className="text-white/90 text-sm sm:text-base mt-3">
            Consultá por disponibilidad de híbridos y variedades, asesoramiento técnico en tu lote o sumate a nuestro equipo en Limagrain Argentina.
          </p>

          {/* Selector discreto Consultar / Trabajá con Nosotros */}
          <div className="inline-flex items-center gap-1.5 mt-5 p-1.5 rounded-full bg-black/25 backdrop-blur-sm border border-white/20">
            <button
              type="button"
              onClick={() => {
                setActiveTab('contact');
                setStatus({ loading: false, error: '', success: '' });
              }}
              className={`min-h-[40px] px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'contact'
                  ? 'bg-white text-brand-red shadow-sm'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Consulta Comercial
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('careers');
                setStatus({ loading: false, error: '', success: '' });
              }}
              className={`min-h-[40px] px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all ${
                activeTab === 'careers'
                  ? 'bg-white text-brand-red shadow-sm'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Trabajá con Nosotros
            </button>
          </div>
        </div>

        {/* Estado de envío */}
        {status.error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl bg-white text-brand-darkred px-4 py-3 text-sm font-semibold flex items-center gap-2.5 shadow-lg max-w-4xl mx-auto"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{status.error}</span>
          </div>
        )}
        {status.success && (
          <div
            role="status"
            className="mb-6 rounded-2xl bg-white text-emerald-800 px-4 py-3 text-sm font-semibold flex items-center gap-2.5 shadow-lg max-w-4xl mx-auto"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{status.success}</span>
          </div>
        )}

        {/* Formularios fieles al layout de 2 columnas del screenshot */}
        {activeTab === 'contact' ? (
          <form onSubmit={handleContactSubmit} className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Columna izquierda: 3 campos blancos apilados + cultivo/teléfono */}
              <div className="space-y-3.5">
                <div>
                  <label htmlFor="contact-name" className="sr-only">
                    Nombre y Apellido
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    minLength={2}
                    placeholder="Nombre"
                    value={contactForm.name}
                    onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white text-brand-navy placeholder:text-brand-gray text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white text-brand-navy placeholder:text-brand-gray text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>

                <div>
                  <label htmlFor="contact-province" className="sr-only">
                    Empresa o Localidad / Provincia
                  </label>
                  <input
                    id="contact-province"
                    type="text"
                    required
                    minLength={2}
                    placeholder="Empresa / Localidad y Provincia"
                    value={contactForm.province}
                    onChange={(e) => setContactForm((p) => ({ ...p, province: e.target.value }))}
                    className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white text-brand-navy placeholder:text-brand-gray text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="contact-phone" className="sr-only">
                      Teléfono (opcional)
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="Teléfono (opcional)"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/95 text-brand-navy placeholder:text-brand-gray text-xs font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-crop" className="sr-only">
                      Cultivo de interés
                    </label>
                    <select
                      id="contact-crop"
                      value={contactForm.cropInterest}
                      onChange={(e) =>
                        setContactForm((p) => ({ ...p, cropInterest: e.target.value }))
                      }
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/95 text-brand-navy text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <option value="Maíz Grano">Maíz Grano</option>
                      <option value="Maíz Silo">Maíz Silo</option>
                      <option value="Girasol">Girasol</option>
                      <option value="Trigo">Trigo</option>
                      <option value="Soja">Soja</option>
                      <option value="Red Líder LG">Red Líder LG</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Columna derecha: Textarea blanca alta */}
              <div className="flex flex-col">
                <label htmlFor="contact-message" className="sr-only">
                  Comentario
                </label>
                <textarea
                  id="contact-message"
                  required
                  minLength={8}
                  placeholder="Comentario (cultivo, localidad o consulta técnica)..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full flex-1 min-h-[180px] px-4 py-3.5 rounded-xl bg-white text-brand-navy placeholder:text-brand-gray text-sm font-medium shadow-md resize-none focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>

            <div className="text-center pt-1">
              <button
                type="submit"
                disabled={status.loading}
                className="cast-btn-press inline-flex items-center justify-center gap-2 min-h-[50px] px-12 rounded-xl bg-brand-rose hover:bg-white text-white hover:text-brand-red font-extrabold text-sm uppercase tracking-[0.18em] shadow-xl disabled:opacity-60 transition-colors"
              >
                {status.loading ? 'ENVIANDO...' : 'ENVIAR'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCareerSubmit} className="max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-3.5">
                <input
                  type="text"
                  required
                  minLength={2}
                  placeholder="Nombre y Apellido"
                  value={careerForm.name}
                  onChange={(e) => setCareerForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white text-brand-navy placeholder:text-brand-gray text-sm font-medium shadow-md focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Email de contacto"
                  value={careerForm.email}
                  onChange={(e) => setCareerForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white text-brand-navy placeholder:text-brand-gray text-sm font-medium shadow-md focus:outline-none"
                />
                <select
                  value={careerForm.area}
                  onChange={(e) => setCareerForm((p) => ({ ...p, area: e.target.value }))}
                  aria-label="Área de interés laboral"
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-white text-brand-navy text-sm font-semibold shadow-md focus:outline-none"
                >
                  {(careersAreas.length
                    ? careersAreas
                    : [
                        'Desarrollo Técnico y Ensayos a Campo',
                        'Comercial y Red Líder',
                        'Investigación y Mejoramiento (I+D)',
                        'Producción de Semillas y Planta Pergamino',
                        'Administración y Finanzas',
                      ]
                  ).map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="Perfil de LinkedIn (opcional)"
                  value={careerForm.linkedin}
                  onChange={(e) => setCareerForm((p) => ({ ...p, linkedin: e.target.value }))}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white/95 text-brand-navy placeholder:text-brand-gray text-xs font-medium shadow-sm focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <textarea
                  required
                  minLength={8}
                  placeholder="Contanos brevemente tu experiencia profesional, formación académica o ciudad de residencia..."
                  value={careerForm.message}
                  onChange={(e) => setCareerForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full flex-1 min-h-[180px] px-4 py-3.5 rounded-xl bg-white text-brand-navy placeholder:text-brand-gray text-sm font-medium shadow-md resize-none focus:outline-none"
                />
              </div>
            </div>

            <div className="text-center pt-1">
              <button
                type="submit"
                disabled={status.loading}
                className="cast-btn-press inline-flex items-center justify-center gap-2 min-h-[50px] px-12 rounded-xl bg-brand-rose hover:bg-white text-white hover:text-brand-red font-extrabold text-sm uppercase tracking-[0.18em] shadow-xl disabled:opacity-60 transition-colors"
              >
                {status.loading ? 'ENVIANDO POSTULACIÓN...' : 'POSTULARME'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Información institucional y canales directos en pie del bloque rojo */}
        <div className="mt-12 pt-8 border-t border-white/25 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="rounded-2xl bg-black/20 backdrop-blur-sm border border-white/15 p-4 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                Planta &amp; Sede Pergamino
              </p>
              <p className="text-white/90 mt-1">{clientEnv.hqAddress}</p>
              <p className="text-white/80 mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {clientEnv.phone}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 backdrop-blur-sm border border-white/15 p-4 flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                Atención Directa &amp; WhatsApp
              </p>
              <a
                href={`mailto:${clientEnv.contactEmail}`}
                className="text-white hover:underline block mt-1 font-medium"
              >
                <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                {clientEnv.contactEmail}
              </a>
              <a
                href={clientEnv.whatsappShortlink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-bold bg-white text-brand-red px-3 py-1 rounded-full hover:bg-brand-cream transition-colors"
              >
                Chat oficial WhatsApp ↗
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-black/20 backdrop-blur-sm border border-white/15 p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-white shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">
                Gobernanza &amp; Ética Limagrain
              </p>
              <p className="text-white/85 text-xs mt-1">
                Compromiso internacional con la transparencia, ética comercial y trazabilidad.
              </p>
              <a
                href={clientEnv.ethicsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1.5 text-xs font-bold text-white underline hover:text-brand-cream"
              >
                Canal de Denuncias / Whistleblowing ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

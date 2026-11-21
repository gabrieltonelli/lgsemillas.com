import { useState } from 'react';
import { X, Send, ExternalLink, Compass, Sprout, MapPin } from 'lucide-react';
import { clientEnv } from '../config/env.js';

function AgroBotMascot({ className = 'w-11 h-11' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Hoja/Brote superior */}
      <path
        d="M32 14C32 8 38 4 44 5C43 11 38 15 32 14Z"
        fill="#E3002C"
      />
      <path
        d="M32 14C30 9 25 7 21 9C23 13 27 15 32 14Z"
        fill="#ff7a4b"
      />
      {/* Antena / Tallo */}
      <path d="M32 13V18" stroke="#100f26" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cuerpo tipo semilla inteligente */}
      <path
        d="M16 36C16 24 23 17 32 17C41 17 48 24 48 36C48 48 41 55 32 55C23 55 16 48 16 36Z"
        fill="#ffffff"
        stroke="#100f26"
        strokeWidth="2.6"
      />

      {/* Gorra / Banda roja institucional LG */}
      <path
        d="M17.5 29C19.5 21 25 17 32 17C39 17 44.5 21 46.5 29H17.5Z"
        fill="#E3002C"
      />

      {/* Visor digital del bot */}
      <rect x="21" y="31" width="22" height="12" rx="6" fill="#100f26" />

      {/* Ojos expresivos */}
      <circle cx="27.5" cy="37" r="2.2" fill="#ffffff" />
      <circle cx="36.5" cy="37" r="2.2" fill="#ffffff" />
      <circle cx="28" cy="36.5" r="0.8" fill="#E3002C" />
      <circle cx="37" cy="36.5" r="0.8" fill="#E3002C" />

      {/* Sonrisa amigable */}
      <path
        d="M27.5 47.5C29.5 49.5 34.5 49.5 36.5 47.5"
        stroke="#E3002C"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Símbolo sutil de WhatsApp integrado en la base */}
      <circle cx="49" cy="49" r="9" fill="#25D366" stroke="#ffffff" strokeWidth="2" />
      <path
        d="M46.2 46.3C46.5 45.8 46.9 45.8 47.2 46.1L48.1 47.2C48.3 47.5 48.2 47.8 47.9 48.1C47.7 48.3 47.7 48.5 48 49C48.4 49.6 49 50.1 49.6 50.4C50 50.6 50.2 50.5 50.5 50.2C50.8 49.9 51.1 49.9 51.4 50.1L52.3 50.9C52.6 51.1 52.6 51.6 52.2 52C51.5 52.7 50.2 52.8 48.8 51.9C47.3 51 46.2 49.7 45.8 48.4C45.5 47.5 45.7 46.9 46.2 46.3Z"
        fill="#ffffff"
      />
    </svg>
  );
}

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: '¡Hola! Soy AgroBot de LG Semillas. ¿En qué te ayudo hoy para tu próxima campaña?',
  },
];

export default function WhatsAppChatbot({
  hasCompareBar = false,
  onSelectCrop,
  onNavigateSection,
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');

  const buildWhatsAppUrl = (customText) => {
    if (!customText && clientEnv.whatsappShortlink) {
      return clientEnv.whatsappShortlink;
    }
    const text =
      customText ||
      'Hola LG Semillas, vengo desde el portal web y quisiera asesoramiento técnico.';
    return `https://wa.me/${clientEnv.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const handleQuickAction = (action) => {
    if (action === 'catalogo') {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'user', text: 'Quiero ver el catálogo de semillas' },
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Te llevo al catálogo interactivo con Maíz Grano, Maíz Silo, Girasol, Trigo y Soja.',
        },
      ]);
      onSelectCrop?.('all');
      onNavigateSection?.('catalogo');
    } else if (action === 'recomendador') {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'user', text: 'Necesito recomendación para mi lote' },
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Abrimos el asistente Agro Point para calcular híbridos y bolsas por hectárea.',
        },
      ]);
      onNavigateSection?.('recomendador');
    } else if (action === 'red-lider') {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'user', text: 'Busco un distribuidor Red Líder LG' },
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Te muestro el buscador oficial por provincia y localidad.',
        },
      ]);
      onNavigateSection?.('red-lider');
    }
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    const cleanText = draft.trim();
    const url = buildWhatsAppUrl(cleanText);
    if (cleanText) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'user', text: cleanText },
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Abriendo WhatsApp con tu consulta para conectarte con nuestro equipo técnico.',
        },
      ]);
      setDraft('');
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`fixed right-4 sm:right-6 z-50 transition-all duration-200 ${
        hasCompareBar ? 'bottom-28 sm:bottom-24' : 'bottom-4 sm:bottom-6'
      }`}
    >
      {/* Ventana de Chatbot */}
      {open && (
        <div className="cast-modal-enter mb-3 w-[calc(100vw-2rem)] sm:w-[370px] rounded-3xl bg-white border border-stone-200 shadow-2xl overflow-hidden flex flex-col">
          {/* Header institucional */}
          <div className="bg-brand-navy text-white p-4 flex items-center justify-between gap-3 border-b-2 border-brand-red">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-white p-1 shrink-0 shadow-sm">
                <AgroBotMascot className="w-full h-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-display font-bold text-sm text-white truncate">
                    AgroBot · LG Semillas
                  </p>
                  <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0" />
                </div>
                <p className="text-[11px] text-stone-300 truncate">
                  Asistente Limagrain Argentina · WhatsApp
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chatbot de WhatsApp"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-brand-red flex items-center justify-center text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Historial de conversación */}
          <div className="p-4 bg-brand-lightgray space-y-3 max-h-60 overflow-y-auto text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-red text-white rounded-br-sm'
                      : 'bg-white text-brand-navy border border-stone-200 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Atajos interactivos */}
          <div className="px-4 py-3 bg-white border-t border-stone-100 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-gray">
              Accesos rápidos
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickAction('catalogo')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-lightgray hover:bg-red-50 hover:text-brand-red text-brand-navy text-xs font-semibold transition-colors"
              >
                <Sprout className="w-3.5 h-3.5 text-brand-red" />
                Catálogo
              </button>
              <button
                type="button"
                onClick={() => handleQuickAction('recomendador')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-lightgray hover:bg-red-50 hover:text-brand-red text-brand-navy text-xs font-semibold transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-brand-red" />
                Agro Point
              </button>
              <button
                type="button"
                onClick={() => handleQuickAction('red-lider')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-lightgray hover:bg-red-50 hover:text-brand-red text-brand-navy text-xs font-semibold transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-red" />
                Red Líder
              </button>
            </div>
          </div>

          {/* Envío directo a WhatsApp */}
          <form
            onSubmit={handleSendWhatsApp}
            className="p-3 bg-white border-t border-stone-200 space-y-2"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Escribí tu consulta para WhatsApp..."
                aria-label="Consulta para WhatsApp"
                className="flex-1 min-h-[42px] px-3 py-2 rounded-xl bg-brand-lightgray border border-stone-200 text-xs sm:text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-red/40"
              />
              <button
                type="submit"
                aria-label="Enviar por WhatsApp"
                className="cast-btn-press w-11 h-11 rounded-xl bg-[#25D366] hover:bg-[#1fb858] text-white flex items-center justify-center shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <a
              href={clientEnv.whatsappShortlink || buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[38px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-navy hover:bg-brand-red text-white text-xs font-bold transition-colors"
            >
              <span>Abrir chat oficial en WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </form>
        </div>
      )}

      {/* Botón flotante con Mascota AgroBot LG */}
      <div className="flex items-center justify-end gap-2.5">
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-stone-200 shadow-soft text-xs font-bold text-brand-navy hover:border-brand-red/50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366]" />
            <span>¿Consultas? Chateá con AgroBot LG</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Cerrar asistente WhatsApp' : 'Abrir asistente WhatsApp AgroBot LG'}
          className="cast-btn-press group relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-brand-red shadow-red flex items-center justify-center hover:scale-105 transition-transform"
        >
          <AgroBotMascot className="w-11 h-11 sm:w-12 sm:h-12 transition-transform duration-200 group-hover:rotate-3" />
        </button>
      </div>
    </div>
  );
}


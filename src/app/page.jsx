import Image from "next/image";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDot,
  Inbox,
  MessageCircleMore,
  ScanSearch,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

const contactUrl = "https://undercodeec.com/contacto/";
const crmUrl = "https://admincrm.undercodeec.com/admin/crm/login/";

const capabilities = [
  {
    number: "01",
    icon: MessageCircleMore,
    title: "Conversaciones en contexto",
    description:
      "Revisa los mensajes de WhatsApp y el historial de cada conversación desde el Inbox del CRM.",
  },
  {
    number: "02",
    icon: CircleDot,
    title: "Oportunidades visibles",
    description:
      "Organiza leads y consulta su etapa comercial para saber qué conversación necesita seguimiento.",
  },
  {
    number: "03",
    icon: ScanSearch,
    title: "Origen con evidencia",
    description:
      "Consulta la atribución disponible de las conversaciones y filtra las que tienen referencia de anuncios de Meta.",
  },
];

const steps = [
  {
    number: "01",
    title: "Llega un mensaje",
    description: "La conversación entra por WhatsApp y queda registrada para el equipo.",
    icon: MessageCircleMore,
  },
  {
    number: "02",
    title: "Se reconoce la oportunidad",
    description: "El CRM reúne contexto, origen disponible y etapa del lead.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "El equipo da seguimiento",
    description: "Las tareas que requieren atención humana quedan visibles en el Inbox.",
    icon: UserRoundCheck,
  },
];

function Brand({ footer = false }) {
  return (
    <a className={`brand${footer ? " brand-footer" : ""}`} href="#inicio" aria-label="Hermes CRM, ir al inicio">
      <Image
        src="/images/hermes-crm-logo.png"
        alt="Hermes CRM"
        width={2172}
        height={724}
        priority={!footer}
      />
    </a>
  );
}
function DashboardPreview() {
  return (
    <figure className="preview-wrap" aria-label="Vista ilustrativa del flujo de trabajo de Hermes">
      <div className="preview-card">
        <div className="preview-topbar">
          <span className="preview-title"><span className="preview-mark">H</span> Hermes <span> / Inbox</span></span>
          <span className="preview-status"><span /> En seguimiento</span>
        </div>
        <div className="preview-body">
          <div className="preview-sidebar" aria-hidden="true">
            <span className="sidebar-active"><Inbox aria-hidden="true" size={18} /></span>
            <span><CircleDot aria-hidden="true" size={18} /></span>
            <span><ScanSearch aria-hidden="true" size={18} /></span>
          </div>
          <div className="preview-list">
            <div className="preview-list-head">
              <strong>Conversaciones</strong>
              <span className="tiny-circle" />
            </div>
            <div className="preview-list-item active">
              <span className="avatar avatar-blue">C</span>
              <span><strong>Consulta nueva</strong><small>Quisiera conocer más...</small></span>
            </div>
            <div className="preview-list-item">
              <span className="avatar avatar-violet">S</span>
              <span><strong>Seguimiento</strong><small>Gracias por la información</small></span>
            </div>
            <div className="preview-list-item">
              <span className="avatar avatar-sky">P</span>
              <span><strong>Próximo contacto</strong><small>¿Podemos agendar?</small></span>
            </div>
          </div>
          <div className="preview-conversation">
            <div className="conversation-head">
              <div><span className="avatar avatar-blue">C</span><span><strong>Consulta nueva</strong><small>WhatsApp</small></span></div>
              <span className="conversation-chip">Lead abierto</span>
            </div>
            <div className="conversation-messages">
              <span className="message-date">HOY</span>
              <div className="message incoming">Hola, quisiera conocer cómo funciona Hermes.</div>
              <div className="message outgoing">Claro. Cuéntanos qué necesita tu equipo y te orientamos.</div>
              <div className="message incoming shorter">Buscamos organizar las consultas que llegan por WhatsApp.</div>
            </div>
            <div className="conversation-input"><span>Responder conversación</span><ArrowUpRight aria-hidden="true" size={16} /></div>
          </div>
        </div>
      </div>
      <figcaption className="preview-caption">Vista ilustrativa · Sin datos reales</figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#inicio">Saltar al contenido</a>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className="main-nav" aria-label="Navegación principal">
            <a href="#que-es">Qué es Hermes</a>
            <a href="#capacidades">Capacidades</a>
            <a href="#como-funciona">Cómo funciona</a>
          </nav>
          <a className="header-cta" href={crmUrl} target="_blank" rel="noopener noreferrer">Acceso CRM <ArrowUpRight aria-hidden="true" size={16} /></a>
        </div>
      </header>

      <main id="inicio" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-inner">
            <div className="hero-content">
              <span className="eyebrow"><span className="eyebrow-dot" /> HERMES CRM · GESTIÓN COMERCIAL</span>
              <h1 id="hero-title">Cada conversación puede <em>avanzar.</em></h1>
              <p>Hermes reúne conversaciones de WhatsApp, oportunidades y seguimiento comercial en un espacio de trabajo para tu equipo.</p>
              <div className="hero-actions">
                <a className="button button-primary" href={contactUrl} target="_blank" rel="noopener noreferrer">Conversemos sobre Hermes <ArrowUpRight aria-hidden="true" size={18} /></a>
                <a className="text-link" href="#que-es">Explorar la solución <ArrowRight aria-hidden="true" size={17} /></a>
              </div>
              <div className="hero-proof"><span className="proof-icon"><Check aria-hidden="true" size={16} /></span><span>De la primera consulta al seguimiento, con contexto.</span></div>
            </div>
            <DashboardPreview />
          </div>
          <div className="hero-bottom"><span>01 / UNA VISTA MÁS CLARA</span><a href="#que-es" aria-label="Ir a Qué es Hermes"><ArrowDownRight aria-hidden="true" size={20} /></a></div>
        </section>

        <section className="intro-section section" id="que-es" aria-labelledby="intro-title">
          <div className="container intro-grid">
            <div><span className="section-kicker">LA IDEA</span><h2 id="intro-title">Menos piezas sueltas.<br /><span>Más contexto para actuar.</span></h2></div>
            <div className="intro-copy"><p>Una consulta comercial no termina cuando llega el mensaje. Hay que entender de dónde vino, reconocer qué necesita la persona y darle continuidad.</p><p>Hermes conecta ese recorrido en el CRM para que el equipo pueda revisar conversaciones, leads y tareas de atención desde un mismo lugar.</p></div>
          </div>
        </section>

        <section className="capabilities-section section" id="capacidades" aria-labelledby="capabilities-title">
          <div className="container">
            <div className="section-heading"><div><span className="section-kicker">LO QUE REÚNE</span><h2 id="capabilities-title">Una operación comercial<br />más fácil de leer.</h2></div><p>Herramientas para seguir el recorrido de cada conversación sin perder su contexto.</p></div>
            <div className="capabilities-grid">
              {capabilities.map((item) => {
                const Icon = item.icon;
                return <article className="capability-card" key={item.number}><div className="card-top"><span className="capability-icon"><Icon aria-hidden="true" size={23} strokeWidth={1.8} /></span><span className="card-number">{item.number}</span></div><div><h3>{item.title}</h3><p>{item.description}</p></div></article>;
              })}
            </div>
          </div>
        </section>

        <section className="flow-section section" id="como-funciona" aria-labelledby="flow-title">
          <div className="container flow-grid">
            <div className="flow-heading"><span className="section-kicker">EL RECORRIDO</span><h2 id="flow-title">Del primer mensaje a la siguiente acción.</h2><p>Una vista simple del flujo que Hermes ayuda a organizar.</p><a className="text-link" href={contactUrl} target="_blank" rel="noopener noreferrer">Hablar con el equipo <ArrowUpRight aria-hidden="true" size={17} /></a></div>
            <ol className="steps-list" role="list">
              {steps.map((step) => {
                const Icon = step.icon;
                return <li className="step" key={step.number}><span className="step-number" aria-hidden="true">{step.number}</span><span className="step-icon"><Icon aria-hidden="true" size={23} strokeWidth={1.8} /></span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>;
              })}
            </ol>
          </div>
        </section>

        <section className="contact-section" id="contacto" aria-labelledby="contact-title"><div className="container contact-inner"><div><span className="section-kicker">SIGUIENTE PASO</span><h2 id="contact-title">Hablemos de tus conversaciones comerciales.</h2><p>Conoce cómo Hermes puede encajar en el trabajo de tu equipo.</p></div><a className="button button-light" href={contactUrl} target="_blank" rel="noopener noreferrer">Contactar a UnderCodeEC <ArrowUpRight aria-hidden="true" size={18} /></a></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><Brand footer /><span>Hermes CRM · Un producto de UnderCodeEC</span><a href="#inicio">Volver arriba ↑</a></div></footer>
    </>
  );
}

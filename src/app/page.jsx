import Image from "next/image";
import {
  Inbox,
  MessageCircle,
  CircleDot,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  MoreHorizontal,
  Send,
  Check,
  Tag,
  UserRound,
  Flag,
} from "lucide-react";
import Navigation from "./navigation";
import HeroCanvas from "./hero-canvas";
import PrimaryPreview from "./primary-preview";
import ReferenceBoard from "./reference-board";
import ScrollReveal from "./scroll-reveal";

const contactUrl = "https://undercodeec.com/contacto/";
const crmUrl = "https://admincrm.undercodeec.com/admin/crm/login/";
const contacts = [
  ["LC", "Lucía · Consulta nueva", "Quisiera más información", "Ahora"],
  ["AM", "Andrés · Seguimiento", "Gracias por la orientación", "10:42"],
  ["SR", "Sofía · Próximo contacto", "Podemos conversar mañana", "10:18"],
  ["MP", "Mateo · Información", "Me interesa conocer Hermes", "Ayer"],
  ["VP", "Valeria · Consulta", "¿Cómo funciona el Inbox?", "Ayer"],
  ["DR", "Diego · Seguimiento", "Les comparto el contexto", "Ayer"],
];
function Brand({ footer = false }) {
  return (
    <a
      href="#inicio"
      className={`brand${footer ? " brand-footer" : ""}`}
    >
      <Image
        src="/favicon.ico"
        alt=""
        width={32}
        height={32}
        unoptimized
        priority={!footer}
        loading={footer ? "eager" : undefined}
      />
      <span>Hermes ARM</span>
    </a>
  );
}
function Avatar({ initials = "LC" }) {
  return <span className="avatar">{initials}</span>;
}
function Label({ children }) {
  return <span className="label">{children}</span>;
}
function Context({ compact = false }) {
  return (
    <aside
      className={`crm-context${compact ? " compact-context" : ""}`}
      aria-label="Contexto ilustrativo del lead"
    >
      <div className="context-person">
        <Avatar />
        <strong>Lucía · Consulta nueva</strong>
        <span>Contacto de ejemplo</span>
      </div>
      <div className="context-title">
        Información del lead <MoreHorizontal size={15} />
      </div>
      <dl>
        <dt>Etapa comercial</dt>
        <dd>
          <CircleDot size={13} /> Contacto inicial
        </dd>
        <dt>Canal</dt>
        <dd>WhatsApp</dd>
        <dt>Origen disponible</dt>
        <dd>Referencia de Meta</dd>
        <dt>Atención</dt>
        <dd>
          <UserRound size={13} /> Revisión humana
        </dd>
      </dl>
      <div className="context-title">Contexto</div>
      <p>Interés en organizar las consultas comerciales del equipo.</p>
      <Label>Seguimiento</Label>
    </aside>
  );
}
function InboxMockup({ main = false }) {
  if (main) return <PrimaryPreview />;
  return (
    <figure className={`product-figure${main ? " primary-preview" : ""}`}>
      <div className="glass-frame">
        <div className="crm-window">
          <div className="crm-top">
            <span>
              <span className="crm-monogram">H</span> Hermes{" "}
              <span className="workspace-name">/ Espacio comercial</span>
            </span>
            <span className="workspace-user">
              <span className="status-dot" /> Equipo Hermes{" "}
              <Avatar initials="EH" />
            </span>
          </div>
          <div className="crm-layout">
            <aside className="crm-sidebar" aria-label="Áreas ilustrativas">
              <span className="workspace-label">ESPACIO DE TRABAJO</span>
              <span className="sidebar-item selected">
                <Inbox size={16} /> Inbox
              </span>
              <span className="sidebar-item">
                <CircleDot size={16} /> Leads
              </span>
              <span className="sidebar-item">
                <Tag size={16} /> Atribución
              </span>
              <div className="sidebar-divider" />
              <span className="workspace-label">CONVERSACIONES</span>
              <span className="sidebar-item">
                <MessageCircle size={16} /> WhatsApp
              </span>
              <span className="sidebar-item">
                <Flag size={16} /> Atención humana
              </span>
              <span className="sidebar-bottom">Hermes ARM · UnderCodeEC</span>
            </aside>
            <div className="crm-list">
              <div className="list-title">
                <strong>Inbox</strong>
                <SlidersHorizontal size={16} />
              </div>
              <div className="mock-search">
                <Search size={13} /> Buscar conversación
              </div>
              <div className="list-tabs">
                <span>Todas</span>
                <span>En seguimiento</span>
              </div>
              {contacts.map(([initials, name, text, time], index) => (
                <div
                  className={`contact-row${index === 0 ? " active" : ""}`}
                  key={initials}
                >
                  <Avatar initials={initials} />
                  <div>
                    <strong>{name}</strong>
                    <span>{text}</span>
                    <small>
                      WhatsApp ·{" "}
                      {index === 0 ? "Contacto inicial" : "Seguimiento"}
                    </small>
                  </div>
                  <time>{time}</time>
                </div>
              ))}
            </div>
            <div className="crm-chat">
              <div className="chat-title">
                <div>
                  <Avatar />
                  <span>
                    <strong>Lucía</strong>
                    <small>WhatsApp · Consulta comercial</small>
                  </span>
                </div>
                <MoreHorizontal size={18} />
              </div>
              <div className="chat-messages">
                <span className="date-label">
                  Hoy · Conversación ilustrativa
                </span>
                <div className="bubble">
                  Hola, quisiera conocer cómo funciona Hermes.
                  <small>10:45</small>
                </div>
                <div className="bubble sent">
                  Hola, Lucía. Cuéntenos qué necesita su equipo y le orientamos.
                  <small>
                    10:46 <Check size={12} />
                  </small>
                </div>
                <span className="chat-event">Contexto del lead disponible</span>
                <div className="bubble">
                  Buscamos organizar las consultas que llegan por WhatsApp.
                  <small>10:47</small>
                </div>
                <div className="bubble sent">
                  Gracias por compartirlo. Podemos revisar su flujo de atención.
                  <small>
                    10:48 <Check size={12} />
                  </small>
                </div>
              </div>
              <div className="mock-composer">
                <span>Responder conversación</span>
                <div>
                  <span>＋</span>
                  <span className="send-icon">
                    <Send size={13} />
                  </span>
                </div>
              </div>
            </div>
            <Context />
          </div>
        </div>
      </div>
      <figcaption>Vista ilustrativa · Sin datos reales</figcaption>
    </figure>
  );
}
function SectionHeading({ id, title, children }) {
  return (
    <div className="section-heading">
      <h2 id={id}>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
function FollowupVisual() {
  return (
    <div className="detail-visual">
      <div className="mini-toolbar">
        <span>Atención del equipo</span>
        <Flag size={16} />
      </div>
      {[
        ["LC", "Consulta nueva", "Revisión humana"],
        ["AM", "Seguimiento comercial", "Por revisar"],
        ["SR", "Próximo contacto", "En seguimiento"],
      ].map(([initials, title, status]) => (
        <div className="task-row" key={initials}>
          <Avatar initials={initials} />
          <div>
            <strong>{title}</strong>
            <span>Conversación de WhatsApp</span>
          </div>
          <Label>{status}</Label>
        </div>
      ))}
      <div className="mini-note">El contexto acompaña la siguiente acción.</div>
    </div>
  );
}
function SourceVisual() {
  return (
    <div className="detail-visual source-visual">
      <div className="mini-toolbar">
        <span>Origen de la conversación</span>
        <Tag size={16} />
      </div>
      <div className="source-contact">
        <Avatar />
        <div>
          <strong>Consulta nueva</strong>
          <span>WhatsApp · Contacto inicial</span>
        </div>
        <Label>Meta</Label>
      </div>
      <dl className="source-fields">
        <div>
          <dt>Referencia de anuncio</dt>
          <dd>Disponible</dd>
        </div>
        <div>
          <dt>Contexto del lead</dt>
          <dd>Consulta comercial</dd>
        </div>
        <div>
          <dt>Atribución</dt>
          <dd>Según evidencia disponible</dd>
        </div>
      </dl>
      <p className="mini-note">
        La información de origen depende de cada conversación.
      </p>
    </div>
  );
}
const features = [
  [
    "Inbox con contexto",
    "Revise mensajes de WhatsApp e historial para retomar cada consulta con información a mano.",
    "conversation",
  ],
  [
    "Origen con evidencia",
    "Consulte referencias de Meta cuando estén disponibles; no toda conversación tiene un origen identificado.",
    "source",
  ],
  [
    "Asistencia bajo supervisión",
    "Combine asistencia conversacional y atención humana según el alcance configurado.",
    "human",
  ],
  [
    "Seguimiento de leads",
    "Consulte la etapa comercial y decida cómo continuar cada oportunidad.",
    "opportunity",
  ],
];
function FeatureVisual({ type }) {
  if (type === "source")
    return (
      <div className="feature-visual">
        <SourceVisual />
      </div>
    );
  if (type === "human")
    return (
      <div className="feature-visual">
        <FollowupVisual />
      </div>
    );
  if (type === "conversation")
    return (
      <div className="feature-visual feature-chat">
        <div className="mini-toolbar">
          <span>
            <MessageCircle size={15} /> Inbox · WhatsApp
          </span>
          <Label>Contacto inicial</Label>
        </div>
        <div className="bubble">Quisiera conocer más sobre Hermes.</div>
        <div className="bubble sent">Cuéntenos qué necesita su equipo.</div>
      </div>
    );
  return (
    <div className="feature-visual feature-stages">
      {["Contacto inicial", "En seguimiento", "Próximo contacto"].map(
        (stage, index) => (
          <div key={stage}>
            <span className="stage-label">{stage}</span>
            <div className="mini-lead">
              <Avatar initials={["LC", "AM", "SR"][index]} />
              <strong>
                {["Consulta nueva", "Seguimiento", "Próximo contacto"][index]}
              </strong>
              <span>WhatsApp</span>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
export default function Home() {
  return (
    <>
      <ScrollReveal />
      <a href="#inicio" className="skip-link">
        Saltar al contenido
      </a>
      <header className="site-header">
        <Brand />
        <Navigation />
      </header>
      <main id="inicio" tabIndex={-1}>
        <section className="hero" aria-labelledby="hero-title">
          <HeroCanvas />
          <div className="hero-content">
            <div className="hero-heading">
              <span className="eyebrow">
                <span className="status-dot" /> Hermes ARM · UnderCodeEC
              </span>
              <h1 id="hero-title">
                De WhatsApp{" "}
                <br />
                <span>al siguiente paso.</span>
              </h1>
              <p>
                Hermes ARM conecta conversaciones de WhatsApp y contexto comercial
                con asistencia de IA y supervisión humana. Su equipo decide cómo
                continuar, según el alcance de cada caso.
              </p>
            </div>
            <a className="primary-button" href={contactUrl}>
              Conversemos <ArrowUpRight size={21} aria-hidden="true" />
            </a>
          </div>
        </section>
        <div className="page-sections">
          <InboxMockup main />
          <section
            className="proof-strip"
            aria-label="Capacidades del espacio de trabajo"
          >
            <p>Hermes ARM nace de la experiencia comercial de UnderCodeEC. Consulte el alcance y la disponibilidad para su caso.</p>
            <div>
              <span>
                <MessageCircle /> Conversaciones
              </span>
              <span>
                <CircleDot /> Leads y etapas
              </span>
              <span>
                <Tag /> Origen disponible
              </span>
              <span>
                <UserRound /> Atención humana
              </span>
            </div>
          </section>
          <section
            className="product-section"
            id="producto"
            aria-labelledby="conversa-title"
          >
            <SectionHeading id="conversa-title" title="Entienda antes de responder.">
              Hermes ARM reúne mensajes e información del contacto para ayudar a su
              equipo a retomar cada consulta con contexto.
            </SectionHeading>
            <InboxMockup />
          </section>
          <section
            className="product-section organize-section"
            aria-labelledby="organiza-title"
          >
            <SectionHeading
              id="organiza-title"
              title="Del contacto a la oportunidad."
            >
              Organice los leads por etapa y revise el contexto antes de decidir
              el siguiente paso comercial.
            </SectionHeading>
            <ReferenceBoard />
          </section>
          <section
            className="detail-section"
            aria-label="Seguimiento y atribución"
          >
            <article className="detail-row">
              <div className="detail-copy">
                <span className="section-label">HERMES ARM · ASISTENCIA Y EQUIPO</span>
                <h2>
                  La asistencia apoya.{" "}
                  <br />
                  Su equipo continúa.
                </h2>
                <p>
                  Hermes está diseñado para combinar asistencia conversacional y
                  atención humana. El alcance de la asistencia depende de la
                  configuración de cada caso.
                </p>
                <p style={{ marginTop: "16px" }}>
                  ARM (Agentic Relationship Management) plantea que agentes de
                  IA apoyen el trabajo con información y tareas bajo reglas y
                  supervisión humana. Hermes ARM adopta ese enfoque: busca combinar
                  asistencia conversacional y atención humana según cada caso;
                  el uso de agentes para otras tareas es una posibilidad, no una
                  capacidad garantizada. {" "}
                  <a href="https://consultordemarketing.mx/del-crm-al-arm-agentic-relationship-management" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
                    Leer sobre ARM en una fuente externa
                  </a>.
                </p>
              </div>
              <FollowupVisual />
            </article>
            <div className="flow-arrow" aria-hidden="true">
              ↶
            </div>
            <article className="detail-row reversed">
              <div className="detail-copy">
                <span className="section-label">ATRIBUCIÓN DISPONIBLE</span>
                <h2>
                  Reconozca el origen{" "}
                  <br />
                  de la conversación.
                </h2>
                <p>
                  Cuando una conversación incluye una referencia de anuncio de
                  Meta, puede consultarla. Si no hay evidencia suficiente, el
                  origen permanece desconocido.
                </p>
              </div>
              <SourceVisual />
            </article>
            <p className="illustration-note">
              Todas las interfaces son ilustrativas y no contienen datos reales.
            </p>
          </section>
          <section
            className="features-section"
            id="capacidades"
            aria-labelledby="features-title"
          >
            <SectionHeading
              id="features-title"
              title="Información para dar continuidad."
            >
              En Hermes ARM, el historial y la etapa del lead aportan contexto;
              las acciones de asistencia dependen de las reglas y configuración de cada caso.
            </SectionHeading>
            <div className="features-grid">
              {features.map(([title, description, type]) => (
                <article key={type} className={`feature-card feature-${type}`}>
                  <FeatureVisual type={type} />
                  <div className="feature-copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section className="journey-section" aria-labelledby="journey-title">
            <SectionHeading
              id="journey-title"
              title="De la consulta al seguimiento."
            >
              Un recorrido ARM que conecta contexto, asistencia delimitada y
              decisiones del equipo.
            </SectionHeading>
            <ol className="journey-grid">
              {[
                [
                  "Llega una consulta",
                  "Un mensaje de WhatsApp inicia una conversación que el equipo puede revisar en el Inbox.",
                ],
                [
                  "El lead reúne contexto",
                  "La conversación, la etapa y el origen disponible ayudan a orientar el seguimiento.",
                ],
                [
                  "La atención continúa",
                  "La asistencia conversacional apoya al equipo bajo las reglas y el alcance configurados para cada caso.",
                ],
              ].map(([title, copy], index) => (
                <li key={title}>
                  <span className="journey-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
      <footer id="contacto" className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand footer />
            <p>
              Hermes ARM: contexto, asistencia{" "}
              <br />y decisiones de su equipo.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <h2>Hermes</h2>
              <a href="#producto">Producto</a>
              <a href="#capacidades">Capacidades</a>
              <a href={crmUrl}>Acceso al espacio de trabajo ↗</a>
            </div>
            <div>
              <h2>Conversemos</h2>
              <a href={contactUrl}>Contactar a UnderCodeEC ↗</a>
              <a href="https://undercodeec.com/">UnderCodeEC ↗</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Hermes ARM · Un producto de UnderCodeEC</span>
          <a href="#inicio">Volver al inicio ↑</a>
        </div>
      </footer>
    </>
  );
}

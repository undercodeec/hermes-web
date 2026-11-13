"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Inbox, Building2, Users, LayoutGrid, ChartNoAxesColumn, MessageCircle, FileText } from "lucide-react";
import styles from "./reference-board.module.css";
import { createBoard, moveLead, nominalTotal, canAdvance, chooseRandomMove, anchorInRegion, separateCoincident } from "./reference-board-motion.mjs";

// Content and imagery are from the supplied visual reference, not CRM data.
const columns = [
  { name: "Potencial", color: "#397bf2", tone: "blue", cards: [
    ["Linear", "$10,000 anual", "Jamie Scott", "jamie", "3 min", "pcFei6ImGsHaT2JipVslLTZbo.png"],
    ["Pulley", "$1,200 anual", "Brian Kim", "brian", "1 d", "VCsqPF1LeJfKoFRGQOQh630UrgE.webp"],
    ["Carta", "$700 mensual", "Jamie Scott", "jamie", "1 d", "JvzZuu7qS520f7RZGlaFvrIRYg.webp"],
    ["Mailchimp", "$3,800 anual", "Joe Han", "joe", "5 d", "2jvkSKpvXDEnNTly53yaIzAj3qQ.webp"],
  ] },
  { name: "Pendiente", color: "#397bf2", tone: "blue", cards: [
    ["Framer", "$5,000 anual", "Jamie Scott", "jamie", "1 min", "zhqg54r0DSevhOPk4NkAsauNI34.webp"],
    ["Rippling", "$12,000 anual", "Joe Han", "joe", "3 d", "C5NIbmuoi5R8si9bwiVvF713I.webp"],
    ["Slack", "$14,000 anual", "Brian Kim", "brian", "5 d", "k27l1BHvgXH7UAsSdYI3C1THJ48.webp"],
  ] },
  { name: "Ganado", color: "#22b75b", tone: "green", cards: [
    ["Loops", "$800 mensual", "Brian Kim", "brian", "2 d", "vmNdBTZKHSSoD4OOsJFeSle0DNQ.webp"],
    ["Footprint", "$8,000 anual", "Ray Karl", "ray", "4 d", "tuvdadfOzWERwNIO35jdTiws1s.webp"],
    ["Stripe", "$20,000", "Jamie Scott", "jamie", "3 d", "gdsi7zVbxacRXpoWVZO3OS94fQ.webp"],
    ["Mintlify", "$600 mensual", "Brian Kim", "brian", "5 h", "AOtGlrpmBT4hYDarSgaFY4gryT0.webp"],
    ["Lever", "$750 mensual", "Joe Han", "joe", "6 d", "ClZdkNY3qG5exusN88Ub9ETS5A.webp"],
  ] },
  { name: "Perdido", color: "#e76b65", tone: "red", cards: [
    ["Superhuman", "$1,000 mensual", "Ray Karl", "ray", "5 d", "C03ooWTL3RgP4kLcnL13kYXSTL4.webp"],
    ["Rows.com", "$5,000 anual", "Ray Karl", "ray", "1 min", "G9zqaKaKiE9FYrLJJsn7F7SJKs.webp"],
  ] },
];
const navigation = [[Inbox, "Inbox"], [Building2, "Organizaciones"], [Users, "Personas"], [LayoutGrid, "Vistas"], [ChartNoAxesColumn, "Oportunidades"]];

function BoardViewport({ board, scope }) {
  return <div className={styles.window} data-motion-surface={scope}>
        <aside className={styles.sidebar} aria-label="Áreas ilustrativas">
          <div className={styles.logo} aria-hidden="true">H<span>Hermes</span></div>
          {navigation.map(([Icon, label], index) => <div className={`${styles.navItem} ${index === 4 ? styles.selected : ""}`} key={label}><Icon size={16} aria-hidden="true"/><span>{label}</span></div>)}
        </aside>
        <div className={styles.board} tabIndex={0} role="region" aria-label="Tablero ilustrativo de oportunidades; desplazar horizontalmente para ver todas las etapas">
          {board.map(column => <section className={styles.column} key={column.name} aria-label={column.name}>
            <div className={`${styles.columnHeading} ${styles[column.tone]}`}><span className={styles.dot} style={{ background: column.color }}/><strong>{column.name}</strong><span className={styles.count}>{column.cards.length}</span><span className={styles.total}>${nominalTotal(column.cards).toLocaleString("en-US")}</span></div>
            <div className={styles.cards} tabIndex={0} role="region" aria-label={`Tarjetas de ${column.name}`}>
              {column.cards.map(([name, amount, owner, avatar, time, logo], index) => <article className={styles.card} key={name} data-lead-id={name} data-motion-scope={scope}>
                <div className={styles.cardTitle}><img className={styles.companyIcon} src={`/board-reference/logos/${logo}`} alt="" width="24" height="24"/><strong>{name}</strong></div>
                <p>{amount}</p><div className={styles.divider}/>
                <div className={styles.cardFooter}><img className={styles.avatar} src={`/board-reference/avatars/${avatar}.webp`} alt="" width="22" height="22"/><span>{owner}</span>{index % 2 ? <FileText size={13} aria-hidden="true"/> : <MessageCircle size={13} aria-hidden="true"/>}<span>{time}</span></div>
              </article>)}
            </div>
          </section>)}
        </div>
        <div className={styles.motionLayer} aria-hidden="true" />
      </div>;
}

// The miniature is a decorative view of the same state as the readable board.
function MobileIllustration({ board }) {
  return <div className={styles.mobileIllustration} aria-hidden="true" data-motion-surface="mini">
    <div className={styles.miniTrack}>
      {board.map(column => <div className={styles.miniColumn} key={column.name}>
        <div className={`${styles.miniHeading} ${styles[column.tone]}`}><span style={{ background: column.color }}/><strong>{column.name}</strong><small>{column.cards.length}</small><b>${nominalTotal(column.cards).toLocaleString("en-US")}</b></div>
        {column.cards.map(([name, amount, owner, avatar, , logo]) => <div className={styles.miniCard} key={name} data-lead-id={name} data-motion-scope="mini">
            <div><img src={`/board-reference/logos/${logo}`} alt=""/><strong>{name}</strong></div><p>{amount}</p>
            <footer><img src={`/board-reference/avatars/${avatar}.webp`} alt=""/>{owner}</footer>
          </div>)}
      </div>)}
    </div>
    <div className={styles.motionLayer} aria-hidden="true" />
  </div>;
}

function visibleSurface(surface) {
  if (!surface?.isConnected || surface.closest("details:not([open])")) return null;
  const rect = surface.getBoundingClientRect();
  let left = Math.max(0, rect.left), right = Math.min(window.innerWidth, rect.right);
  let top = Math.max(0, rect.top), bottom = Math.min(window.innerHeight, rect.bottom);
  for (let parent = surface; parent; parent = parent.parentElement) {
    const style = getComputedStyle(parent), clip = parent.getBoundingClientRect();
    if (style.display === "none" || style.visibility === "hidden" || parent.hidden) return null;
    if (/^(auto|scroll|hidden|clip)$/.test(style.overflowX)) { left = Math.max(left, clip.left); right = Math.min(right, clip.right); }
    if (/^(auto|scroll|hidden|clip)$/.test(style.overflowY)) { top = Math.max(top, clip.top); bottom = Math.min(bottom, clip.bottom); }
  }
  return right > left && bottom > top ? { left, right, top, bottom } : null;
}

function stopAnimations(ref) {
  const current = ref.current;
  ref.current = [];
  for (const { animation, finish } of current) {
    animation.onfinish = null; animation.oncancel = null;
    animation.cancel(); finish();
  }
}

export default function ReferenceBoard() {
  const figure = useRef(null);
  const lastId = useRef(null);
  const pending = useRef(null);
  const running = useRef([]);
  const [board, setBoard] = useState(() => createBoard(columns));
  const boardRef = useRef(board);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [reduced, setReduced] = useState(null);
  const [paused, setPaused] = useState(false);
  const active = canAdvance({ visible, hidden, reduced, paused });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduced(media.matches);
    const syncVisibility = () => setHidden(document.hidden);
    syncMotion(); syncVisibility();
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    const intersecting = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) entry.isIntersecting && entry.intersectionRatio > 0 ? intersecting.add(entry.target) : intersecting.delete(entry.target);
      setVisible([...intersecting].some(visibleSurface));
    }, { threshold: 0 });
    figure.current.querySelectorAll("[data-motion-surface]").forEach(surface => observer.observe(surface));
    return () => { observer.disconnect(); media.removeEventListener("change", syncMotion); document.removeEventListener("visibilitychange", syncVisibility); };
  }, []);

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      const move = chooseRandomMove(boardRef.current, lastId.current);
      if (!move) return;
      const { id, target } = move;
      lastId.current = id;
      pending.current = [...figure.current.querySelectorAll("[data-lead-id]")]
        .filter(node => node.dataset.leadId === id && visibleSurface(node.closest("[data-motion-surface]")))
        .map(node => ({ scope: node.dataset.motionScope, rect: node.getBoundingClientRect(), clone: node.cloneNode(true) }));
      const next = moveLead(boardRef.current, id, target);
      boardRef.current = next;
      setBoard(next);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [active]);

  useLayoutEffect(() => {
    const snapshots = pending.current;
    pending.current = null;
    if (!snapshots || !active || !figure.current) return;
    for (const snapshot of snapshots) {
      const destination = [...figure.current.querySelectorAll("[data-lead-id]")].find(node => node.dataset.leadId === snapshot.clone.dataset.leadId && node.dataset.motionScope === snapshot.scope && visibleSurface(node.closest("[data-motion-surface]")));
      if (!destination) continue;
      const surface = destination.closest("[data-motion-surface]");
      const region = visibleSurface(surface);
      const layer = surface?.querySelector(`.${styles.motionLayer}`);
      if (!region || !layer) continue;
      const surfaceRect = surface.getBoundingClientRect(), endRect = destination.getBoundingClientRect();
      const width = Math.min(snapshot.rect.width, region.right - region.left);
      const height = Math.min(snapshot.rect.height, region.bottom - region.top);
      if (width <= 0 || height <= 0) continue;
      const end = anchorInRegion(endRect, region, width, height);
      const start = separateCoincident(anchorInRegion(snapshot.rect, region, width, height), end, region, width, height);
      const ghost = snapshot.clone;
      ghost.setAttribute("aria-hidden", "true");
      ghost.dataset.motionGhost = ghost.dataset.leadId;
      delete ghost.dataset.leadId; delete ghost.dataset.motionScope;
      Object.assign(ghost.style, { position: "absolute", left: `${start.left - surfaceRect.left}px`, top: `${start.top - surfaceRect.top}px`, width: `${width}px`, height: `${height}px`, margin: "0", zIndex: "1", pointerEvents: "none", overflow: "hidden" });
      layer.appendChild(ghost);
      destination.style.opacity = "0";
      const animation = ghost.animate([{ transform: "translate(0,0) scale(1)", boxShadow: "0 2px 5px #2534550a" }, { transform: `translate(${end.left - start.left}px,${end.top - start.top}px) scale(1)`, boxShadow: "0 8px 20px #25345533" }], { duration: 650, easing: "ease-in-out", fill: "both" });
      const finish = () => { destination.style.opacity = ""; ghost.remove(); running.current = running.current.filter(item => item.animation !== animation); };
      animation.onfinish = finish;
      animation.oncancel = finish;
      running.current.push({ animation, finish });
    }
  }, [board, active]);

  useEffect(() => {
    if (!active) { pending.current = null; stopAnimations(running); }
    return () => stopAnimations(running);
  }, [active]);

  useEffect(() => {
    const cancel = () => { pending.current = null; stopAnimations(running); };
    const host = figure.current;
    window.addEventListener("resize", cancel);
    host.addEventListener("toggle", cancel, true);
    return () => { window.removeEventListener("resize", cancel); host.removeEventListener("toggle", cancel, true); };
  }, []);

  return <figure ref={figure} className={`product-figure board-figure ${styles.figure}`}>
    <div className={`glass-frame ${styles.frame}`}>
      <div className={styles.desktopBoard}><BoardViewport board={board} scope="desktop" /></div>
      <MobileIllustration board={board} />
    </div>
    <figcaption>Vista de referencia · Importes nominales de ejemplo, sin normalizar periodicidad · Las marcas no indican relación comercial · Sin conexión a un sistema en vivo</figcaption>
    <div className={styles.motionControl}>{reduced ? <span>Vista estática por preferencia de movimiento reducido</span> : <button type="button" onClick={() => setPaused(value => !value)}>{paused ? "Reanudar animación" : "Pausar animación"}</button>}<span>Los leads cambian de etapa a modo de ejemplo.</span></div>
    <details className={styles.accessibleBoard}>
      <summary>Ver tablero ampliado y accesible</summary>
      <p>Desplaza el tablero horizontalmente y las columnas verticalmente para ver todas las tarjetas.</p>
      <BoardViewport board={board} scope="expanded" />
    </details>
  </figure>;
}

"use client";
import { useEffect, useRef, useState } from "react";
import { Inbox, CircleDot, Tag, Flag, Check, Bell } from "lucide-react";
import { previewModel, canPlay, advanceClock, unreadCounts } from "./primary-preview-model.mjs";
import styles from "./primary-preview.module.css";
function Avatar({ initials = "LC" }) { return <span className="avatar">{initials}</span>; }
function Bubble({ message, animate }) {
 return <div data-message-id={message.id} className={`bubble${message.direction === 'outgoing' ? ' sent' : ''} ${styles.message} ${animate ? styles.enter : ''}`}>{message.text}<small>{message.time}{message.direction === 'outgoing' && <Check size={13} aria-hidden="true" />}</small></div>;
}
function Typing({ direction, name }) {
 return <div data-typing={direction} className={`${styles.typing} ${direction === 'outgoing' ? styles.outgoing : ''}`}><span className={styles.srOnly}>{direction === 'incoming' ? name + ' está escribiendo' : 'El equipo está escribiendo · Ejemplo'}</span><span className={styles.dots} aria-hidden="true"><i/><i/><i/></span></div>;
}
export default function PrimaryPreview() {
 const figure=useRef(null), clock=useRef(0), bell=useRef(null), notificationArea=useRef(null);
 const [elapsed,setElapsed]=useState(0),[reduced,setReduced]=useState(null);
 const [visible,setVisible]=useState(false),[hidden,setHidden]=useState(true);
 const [selected,setSelected]=useState('lucia'),[cursors,setCursors]=useState({});
 const [open,setOpen]=useState(false),[staticView,setStaticView]=useState(false);
 const still=staticView||reduced===true;
 const model=previewModel(elapsed,still,selected);
 const active=canPlay({reduced,visible,hidden,staticView});
 const unread=unreadCounts(model,cursors),badge=Object.values(unread).reduce((a,b)=>a+b,0);
 const selectedIncoming=model.incoming[selected]||0;
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const preference=()=>setReduced(media.matches),visibility=()=>setHidden(document.hidden);
  preference();visibility();media.addEventListener('change',preference);document.addEventListener('visibilitychange',visibility);
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting&&entry.intersectionRatio>0),{threshold:0});
  observer.observe(figure.current);
  return ()=>{observer.disconnect();media.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);};
 },[]);
 useEffect(()=>{
  if(!active)return;
  let previous=performance.now();
  const timer=window.setInterval(()=>{const now=performance.now();clock.current=advanceClock(clock.current,now-previous,true);previous=now;setElapsed(clock.current);},50);
  return ()=>window.clearInterval(timer);
 },[active]);
 useEffect(()=>{
  if(visible&&!hidden)setCursors(prev=>prev[selected]>=selectedIncoming?prev:{...prev,[selected]:selectedIncoming});
 },[visible,hidden,selected,selectedIncoming]);
 useEffect(()=>{
  if(!open)return;
  const outside=e=>{if(!notificationArea.current?.contains(e.target)){if(notificationArea.current?.contains(document.activeElement))bell.current?.focus({preventScroll:true});setOpen(false);}};
  const escape=e=>{if(e.key==='Escape'){e.preventDefault();const restore=notificationArea.current?.contains(document.activeElement);setOpen(false);if(restore)bell.current?.focus({preventScroll:true});}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
  return ()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);};
 },[open]);
 const choose=(id,fromPanel=false)=>{
  setSelected(id);setCursors(prev=>({...prev,[id]:Math.max(prev[id]||0,model.incoming[id]||0)}));
  if(fromPanel){const restore=notificationArea.current?.contains(document.activeElement);setOpen(false);if(restore)bell.current?.focus({preventScroll:true});}
 };
 const contextLabel=model.context?'Referencia anotada por el equipo · Ejemplo':'Consulta por conocer · Revisión humana';
 return <figure ref={figure} className={`product-figure primary-preview ${styles.preview}`} data-active={active} data-run={model.epoch} data-elapsed={Math.floor(elapsed)} data-story={selected} data-static={still} aria-label="Demostración de atención de una mueblería ficticia" aria-describedby="primary-preview-hint">
  <div className="glass-frame"><div className="crm-window">
   <div className="crm-top"><span><span className="crm-monogram">H</span> Hermes <span className="workspace-name">/ Mueblería · Ejemplo ficticio</span></span><span className="workspace-user">Equipo <Avatar initials="EQ" /></span></div>
   <div className={styles.sectionBar}>
    <span>Inbox · Mueblería · Ejemplo ficticio</span>
    <div ref={notificationArea} className={styles.notificationArea}>
     <button ref={bell} type="button" className={styles.bell} aria-label={`Notificaciones: ${badge} mensajes sin leer`} aria-expanded={open} aria-controls="primary-notifications" onClick={()=>setOpen(value=>!value)}><Bell size={19} aria-hidden="true"/><span>{badge}</span><span key={model.arrival} className={still||model.arrival==='none'?styles.srOnly:styles.pulse} aria-hidden="true"/></button>
     {open&&<section id="primary-notifications" className={styles.panel} aria-label="Notificaciones de la demo">
      <strong>Mensajes recibidos · Ejemplo</strong><p>Abrir este panel no marca mensajes como leídos.</p>
      {model.notifications.length===0?<p>Aún no hay mensajes recibidos.</p>:model.notifications.map(n=><button type="button" key={n.id} onClick={()=>choose(n.id,true)} data-notification-id={n.id}><strong>{n.name} · {unread[n.id]} sin leer</strong><span>{n.latest.text}</span></button>)}
      <small>Una entrada por chat · Solo mensajes entrantes. Orden fijo de contactos.</small>
     </section>}
    </div>
   </div>
   <div className="crm-layout">
    <aside className="crm-sidebar" aria-label="Áreas ilustrativas"><span className="workspace-label">ESPACIO DE TRABAJO</span>{[[Inbox,'Inbox'],[CircleDot,'Leads'],[Tag,'Atribución'],[Flag,'Atención humana']].map(([Icon,text],i)=><span key={text} className={`sidebar-item${i===0?' selected':''}`}><Icon size={16} aria-hidden="true"/>{text}</span>)}<span className="sidebar-bottom">Hermes ARM · UnderCodeEC</span></aside>
    <div className="crm-list" aria-label="Conversaciones de ejemplo"><div className="list-title"><strong>Conversaciones</strong><span>{model.rows.length} de 6</span></div><div className={styles.contacts}>
     {model.rows.map(row=><button type="button" data-contact-id={row.id} aria-pressed={row.active} aria-label={`${row.name}${unread[row.id]?`, ${unread[row.id]} sin leer`:''}`} className={`contact-row${row.active?' active':''}`} key={row.id} onClick={()=>choose(row.id)}><Avatar initials={row.initials}/><div><strong>{row.name} {unread[row.id]>0&&<b className={styles.unread}>{unread[row.id]}</b>}</strong><span>{row.summary}</span><small>WhatsApp · Ejemplo</small></div></button>)}
    </div></div>
    <div className="crm-chat">
     <div className="chat-title"><div><Avatar initials={model.conversation.initials}/><span><strong>{model.conversation.name}</strong><small>WhatsApp · Mueblería ficticia</small></span></div></div>
     <div className={styles.notice}><span key={model.arrival} className={still?'':styles.enter}>{model.notice}</span></div>
     <div className={styles.compactContext}><span>{model.contextual}</span><small>{contextLabel}</small></div>
     <div className="chat-messages">
      {model.messages.map(message=><Bubble key={message.id} message={message} animate={!still}/>) }
      {model.typing&&!still&&<Typing key={`${selected}-${model.typing}`} direction={model.typing} name={model.conversation.name}/>}
      {model.epoch>0&&<span className={styles.historyNote}>Últimos 4 mensajes · Actualización ilustrativa por ciclos; se conserva el historial anterior.</span>}
     </div>
     <div className={`mock-composer ${styles.composer}`}><small>Atención humana · Ejemplo</small><span>Respuesta ilustrativa · Sin envío real</span></div>
    </div>
    <aside className="crm-context" aria-label="Contexto ilustrativo"><div className="context-person"><Avatar initials={model.conversation.initials}/><strong>{model.conversation.name}</strong><span>Contacto ficticio</span></div><dl><dt>Consulta</dt><dd>{model.conversation.query}</dd><dt>Producto</dt><dd>{model.conversation.product}</dd><dt>Atención</dt><dd>Revisión humana</dd></dl><div className={styles.contextCard}><strong>Referencia</strong><p>{model.contextual}</p><small>{contextLabel}</small></div></aside>
   </div>
  </div></div>
  <div className={styles.controls}><span id="primary-preview-hint">{still?'Vista estática · Seis historiales completos':`Ciclo demostrativo ${model.epoch+1} · Los historiales se conservan`}</span><label className={styles.staticSetting}><input type="checkbox" checked={staticView} onChange={e=>setStaticView(e.target.checked)}/> Vista estática</label></div>
  <figcaption>Demostración ilustrativa · Datos ficticios · Sin conexión a un sistema en vivo</figcaption>
 </figure>;
}

// One bounded deterministic timeline: six sequential conversations, four complete messages each.
export const TYPING = 750;
export const EVENT_DURATION = 1850;
export const PLAY_DURATION = 24 * EVENT_DURATION;
export const DURATION = PLAY_DURATION + 3000;
const stories = [
 ['lucia','Lucía','LC','Sofá para una sala pequeña','Sofá','Sala de 2 metros',[
 'Hola, busco un sofá para una sala pequeña.', 'Hola, Lucía. ¿Qué espacio tiene para el sofá?', 'Tengo unos 2 metros en la sala.', 'Gracias, Lucía. Anoto esa medida para revisar la consulta.']],
 ['mateo','Mateo','MT','Mesa de comedor para cuatro personas','Mesa de comedor','Espacio reducido; cuatro personas',[
 'Hola, estoy buscando una mesa de comedor.', 'Hola, Mateo. ¿Para cuántas personas sería?', 'Para cuatro, pero el espacio es reducido.', 'Gracias, Mateo. Anoto esas referencias en su consulta.']],
 ['sofia','Sofía','SF','Escritorio para portátil y pantalla','Escritorio','Portátil y pantalla',[
 'Hola, busco un escritorio.', 'Hola, Sofía. ¿Qué colocaría sobre el escritorio?', 'Un portátil y una pantalla.', 'Gracias, Sofía. Anoto ese detalle para revisar la consulta.']],
 ['diego','Diego','DG','Estantería para el estudio','Estantería','Pared estrecha del estudio',[
 'Hola, estoy buscando una estantería.', 'Hola, Diego. ¿Dónde la colocaría?', 'En una pared estrecha del estudio.', 'Gracias, Diego. Anoto la ubicación en su consulta.']],
 ['valentina','Valentina','VL','Cómoda con referencia de un metro','Cómoda','Referencia de ancho: 1 metro',[
 'Hola, busco una cómoda.', 'Hola, Valentina. ¿Tiene alguna medida de referencia?', 'Tengo aproximadamente 1 metro de ancho.', 'Gracias, Valentina. Anoto esa medida de referencia.']],
 ['andres','Andrés','AN','Mesa auxiliar junto al sofá','Mesa auxiliar','Junto al sofá, para una lámpara',[
 'Hola, estoy buscando una mesa auxiliar.', 'Hola, Andrés. ¿Dónde la usaría?', 'Junto al sofá, para colocar una lámpara.', 'Gracias, Andrés. Registro ese uso en su consulta.']]
];
export const CONVERSATIONS = stories.map(([id,name,initials,query,product,reference,texts],c)=>({
 id,name,initials,query,product,reference,messages:texts.map((text,j)=>({
 id:`${id}-${j}`,direction:j%2?'outgoing':'incoming',text,
 time:`10:${String(10+j*6+c).padStart(2,'0')}`,
 typingStart:(c*4+j)*EVENT_DURATION,sentAt:(c*4+j)*EVENT_DURATION+TYPING
 }))
}));
export const MESSAGES=CONVERSATIONS.flatMap(c=>c.messages);
export function previewModel(elapsed, staticView=false, selected='lucia') {
 const total=Number.isFinite(elapsed)?Math.max(0,elapsed):0;
 const epoch=Math.floor(total/DURATION), phase=staticView?PLAY_DURATION:total%DURATION;
 const histories={}; const incoming={}; const notifications=[];
 const rows=CONVERSATIONS.filter((c,i)=>epoch>0||staticView||i===0||phase>=c.messages[0].sentAt).map(c=>{
  const messages=c.messages.flatMap((m,j)=>{
   const current=phase>=m.sentAt, e=current?epoch:epoch-1;
   return e<0?[]:[{...m,id:`${c.id}-${e}-${j}`,epoch:e}];
  });
  histories[c.id]=messages;
  const count=epoch*2+c.messages.filter(m=>m.direction==='incoming'&&total%DURATION>=m.sentAt).length;
  incoming[c.id]=count;
  const byPublication=(a,b)=>a.epoch-b.epoch||a.sentAt-b.sentAt;
  const latest=messages.filter(m=>m.direction==='incoming').sort(byPublication).at(-1);
  if(latest)notifications.push({id:c.id,name:c.name,count,latest});
  const last=[...messages].sort(byPublication).at(-1);
  return {id:c.id,name:c.name,initials:c.initials,active:selected===c.id,
   summary:last?(last.direction==='outgoing'?'Tú: ':'')+last.text:'Sin mensajes todavía',time:last?.time??null};
 });
 const conversation=CONVERSATIONS.find(c=>c.id===selected)||CONVERSATIONS[0];
 const messages=histories[conversation.id]||[];
 const typing=staticView?null:conversation.messages.find(m=>phase>=m.typingStart&&phase<m.sentAt)?.direction??null;
 const context=messages.length>=3;
 const latestIncoming=MESSAGES.filter(m=>m.direction==='incoming'&&phase>=m.sentAt).sort((a,b)=>b.sentAt-a.sentAt)[0];
 const arrival=latestIncoming?`${epoch}-${latestIncoming.id}`:epoch>0?`${epoch-1}-${CONVERSATIONS[5].messages[2].id}`:'none';
 return {epoch,phase,rows,histories,incoming,notifications,conversation,messages,typing,context,
  contextual:context?conversation.reference:conversation.query,arrival,
  resting:phase>=PLAY_DURATION,
  notice:staticView?'Vista estática · Historial ilustrativo completo':phase>=PLAY_DURATION?'Recorrido completo · Los historiales se conservan':epoch>0&&phase<TYPING?'Nuevo ciclo demostrativo · Historiales conservados':latestIncoming?`Mensaje recibido · ${CONVERSATIONS.find(c=>c.messages.includes(latestIncoming)).name} · Ejemplo ficticio`:'Mueblería · Ejemplo ficticio · Sin mensajes todavía'};
}
export function unreadCounts(model,cursors={}) {
 return Object.fromEntries(model.rows.map(r=>[r.id,Math.max(0,(model.incoming[r.id]||0)-(cursors[r.id]||0))]));
}
export function canPlay({reduced,visible,hidden,staticView=false}) {return reduced===false&&visible&&!hidden&&!staticView;}
// Monotonic active-time clock keeps round IDs and read cursors coherent. No inactive catch-up.
export function advanceClock(elapsed,delta,active) {
 const base=Number.isFinite(elapsed)?Math.max(0,elapsed):0;
 return active&&Number.isFinite(delta)?base+Math.max(0,delta):base;
}
export function previewVisible(ratio) {return Number.isFinite(ratio)&&ratio>0;}

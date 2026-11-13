import test from 'node:test';
import assert from 'node:assert/strict';
import {previewModel,canPlay,advanceClock,CONVERSATIONS,MESSAGES,DURATION,PLAY_DURATION,EVENT_DURATION,unreadCounts,previewVisible} from '../src/app/primary-preview-model.mjs';
test('SSR first chat available, no published messages or timestamps; six static histories',()=>{
 for(const t of [0,NaN,-1,Infinity]) {const m=previewModel(t);assert.equal(m.rows.length,1);assert.equal(m.conversation.id,'lucia');assert.equal(m.messages.length,0);assert.equal(m.rows[0].summary,'Sin mensajes todavía');assert.equal(m.rows[0].time,null);}
 const staticModel=previewModel(0,true);assert.equal(staticModel.rows.length,6);assert.equal(staticModel.typing,null);for(const h of Object.values(staticModel.histories))assert.equal(h.length,4);assert.equal(Object.values(unreadCounts(staticModel)).reduce((a,b)=>a+b),0);
});
test('24 events sequential over six chats, 750ms typing + 1100ms reading, 3s rest',()=>{
 assert.equal(DURATION,47400);assert.equal(PLAY_DURATION,44400);assert.equal(MESSAGES.length,24);
 for(const [c,story]of CONVERSATIONS.entries())for(const [j,msg]of story.messages.entries()) {
  assert.equal(msg.typingStart,(c*4+j)*EVENT_DURATION);assert.equal(msg.sentAt-msg.typingStart,750);
  assert.equal(previewModel(msg.typingStart,false,story.id).typing,msg.direction);
  assert.equal(previewModel(msg.sentAt-1,false,story.id).messages.length,j);
  const m=previewModel(msg.sentAt,false,story.id);assert.equal(m.typing,null);assert.equal(m.messages.length,j+1);assert.equal(m.messages.at(-1).text,msg.text);
  assert.equal(m.rows.find(r=>r.id===story.id).summary,(j%2?'Tú: ':'')+msg.text);
  assert.equal(m.conversation.id,story.id);assert.equal(m.context,j>=2);
 }
 for(let i=1;i<6;i++){assert.equal(previewModel(CONVERSATIONS[i].messages[0].sentAt-1).rows.length,i);assert.equal(previewModel(CONVERSATIONS[i].messages[0].sentAt).rows.length,i+1);}
 assert.equal(previewModel(PLAY_DURATION).resting,true);
});
test('selection externally controlled, histories bounded and retained without reset flicker',()=>{
 for(const selected of CONVERSATIONS.map(c=>c.id))for(const t of [DURATION-1,DURATION,DURATION+100,DURATION+750,DURATION*2,DURATION*99999+1000]) {
  const m=previewModel(t,false,selected);assert.equal(m.rows.length,6);assert.equal(m.conversation.id,selected);assert.equal(m.messages.length,4);assert.equal(m.rows.filter(r=>r.active).length,1);
  for(const h of Object.values(m.histories)){assert.equal(h.length,4);assert.equal(new Set(h.map(m=>m.id)).size,4);}
 }
 const before=previewModel(DURATION-1),after=previewModel(DURATION);
 assert.deepEqual(after.histories,before.histories);assert.match(after.notice,/Nuevo ciclo/);
 const update=previewModel(DURATION+750);assert.notEqual(update.messages[0].id,before.messages[0].id);assert.deepEqual(update.messages.slice(1),before.messages.slice(1));assert.equal(update.rows[0].summary,CONVERSATIONS[0].messages[0].text);
 const untouched=previewModel(DURATION+750,false,'mateo');assert.deepEqual(untouched.messages,before.histories.mateo);assert.equal(untouched.typing,null);
});
test('unread counts incoming only, stable across rounds, cursors do not consume future arrivals',()=>{
 let cursors={};let prior=0;
 for(let t=0;t<=DURATION*3;t+=50) {
  const m=previewModel(t),counts=unreadCounts(m,cursors),n=Object.values(counts).reduce((a,b)=>a+b,0);
  assert.ok(n>=prior);prior=n;
 }
 assert.equal(prior,36);
 const t=PLAY_DURATION,m=previewModel(t);assert.equal(Object.values(unreadCounts(m)).reduce((a,b)=>a+b),12);
 cursors={lucia:2,mateo:2};assert.equal(unreadCounts(m,cursors).lucia,0);assert.equal(unreadCounts(previewModel(DURATION),cursors).lucia,0);
 assert.equal(unreadCounts(previewModel(DURATION+750),cursors).lucia,1);
 assert.equal(unreadCounts(previewModel(CONVERSATIONS[0].messages[1].sentAt),{lucia:1}).lucia,0);
 assert.equal(previewModel(DURATION+750).notifications[0].latest.text,CONVERSATIONS[0].messages[0].text);
});
test('active clock unbounded rounds, hidden/offscreen/static freeze no catchup; any intersection runs',()=>{
 const ready={reduced:false,visible:true,hidden:false};assert.equal(canPlay(ready),true);
 for(const c of [{reduced:null},{reduced:true},{visible:false},{hidden:true},{staticView:true}])assert.equal(canPlay({...ready,...c}),false);
 assert.equal(advanceClock(DURATION-1,100,true),DURATION+99);assert.equal(advanceClock(1234,999999,false),1234);assert.equal(advanceClock(1234,50,true),1284);assert.equal(advanceClock(NaN,50,true),50);
 for(const r of [.00001,.01,.1,1])assert.equal(previewVisible(r),true);for(const r of [0,-1,NaN])assert.equal(previewVisible(r),false);
});

test('new chats wait for four prior messages, without interleaving',()=>{
 const ordered=[...MESSAGES].sort((a,b)=>a.sentAt-b.sentAt);
 assert.deepEqual(ordered.map(m=>m.id),CONVERSATIONS.flatMap(c=>c.messages.map(m=>m.id)));
 for(let i=1;i<6;i++) {
  const first=CONVERSATIONS[i].messages[0],before=previewModel(first.sentAt-1);
  assert.equal(before.rows.length,i);
  for(let c=0;c<i;c++)assert.equal(before.histories[CONVERSATIONS[c].id].length,4);
  assert.ok(first.typingStart>CONVERSATIONS[i-1].messages[3].sentAt);
 }
});

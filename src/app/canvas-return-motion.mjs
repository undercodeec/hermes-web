// Geometry belongs to the stable track, never the transformed scene.
const clamp=v=>Math.max(0,Math.min(1,v));
export function mapCanvasReturn(rect, viewport) {
 if(![rect.top,rect.height,viewport].every(Number.isFinite)||rect.height<=0||viewport<=0)return null;
 // Start emergence on entry; finish expansion before the track leaves the viewport.
 const phase=clamp((viewport-rect.top)/(viewport+rect.height*.15));
 const enter=clamp(phase/.28),travel=clamp((phase-.2)/.5),exit=clamp((phase-.72)/.28);
 return {phase,x:42*(1-travel),y:65*(1-enter)-14*exit,progress:2.2*exit};
}

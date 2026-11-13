# Canvas Hermes independiente — HERMES-CANVAS-TRANSFER-001

Fecha: 2026-11-10. Origen: undercodeec_nextjs, main, HEAD 56e6a217907376e7d53707b2521a815aaa83144c.
Destino manual: Hermes Web. Comprobar allí rama/HEAD y cambios locales antes de integrar.
No se ha modificado el login operativo, autenticación, backend, pagos ni archivos originales.

## Uso sin CRM
Servir ESTA carpeta como raíz HTTP(S), por ejemplo con un servidor estático ya disponible. Abrir /index.html. No abrir por file://. Con Python ya instalado: python -m http.server 8765 --bind 127.0.0.1 desde esta carpeta. No requiere Next, React, pnpm, npm, instalación, API ni sesión.
Mantener /demos/dala/ desde la raíz del origen: el runtime contiene URLs absolutas. embed.html utiliza además <base href="/demos/dala/">. El iframe debe ser del mismo origen para que el wrapper acceda a contentDocument. No añadir sandbox sin revisar esta condición. No ejecutar scripts/prepare-dala-demo.mjs: descarga recursos y no forma parte de esta entrega.

## Estructura y procedencia
- index.html: escenario externo estático, sin login ni logotipo; reproduce rejilla/padding esenciales para referencia dimensional. No representa el login completo ni certifica igualdad visual.
- embed.html: respuesta equivalente de dala-embed: DOM Dala original + base, CSS y filtro SVG originales; CSP adicional local.
- canvas-login.js: showOriginalBrain original + polling cada 100 ms y load, ready al encontrar canvas, limpieza en pagehide.
- canvas-login.css: exclusivamente reglas del canvas y responsive/reduced-motion pertinentes, extraídas de crm.css:824-830,918-919,929,966-967. No incluye estilos CRM ajenos.
- demos/dala/:  todos los recursos de la copia pública original. Su index.html original se conserva como referencia, NO es el punto de entrada del canvas.
- INVENTARIO.json y SHA256SUMS.txt: inventario, rutas y hashes de entrega; los hashes de origen de recursos están en INVENTARIO.json.
- MODIFICACIONES.json: reemplazo exacto Intercom, índices y hashes antes/después.
- AVISOS-LICENCIAS.md: avisos encontrados y permisos pendientes; no certifica licencias.

La importación original procede de saveweb2zip-com-dala-craftedbygc-com; scripts/prepare-dala-demo.mjs:6,16-19,105-114 documenta rutas y descargas de dala.craftedbygc.com. No se realizaron descargas en esta entrega. Se mantienen DOM, stylesheet, fuentes, retratos e imágenes no demostrados innecesarios: theme.js inicializa loader, navegación, secciones, scroll y consultas DOM además de WebGL. NO se afirma mínimo exacto. Los recursos gráficos explícitos son seis texturas (sc-33.png, cd-33.png, pos-33.exr, dof-2k-10.jpg, gradient-noise.jpg, noise.jpg) y cinco GLB (py-lod1/2/3/7.glb, py-monbile.glb). Shaders y loaders vienen en los bundles.

## Apariencia y ciclo de vida
Scripts originales en orden manifest.js → vendor.js → theme.js; DOMContentLoaded inicia runtime, carga recursos, espera SiteLoader.enterSite y activa WebGL.onEnterSite. Mantener DOM y CSS para no alterar ese arranque. No añadir async ni reordenarlos.
Renderer original alpha:false; la transparencia visible se obtiene mediante filtro SVG crm-dala-black-key, no alfa nativo. El filtro externo del iframe anima color cada 18 s con fase -9 s. Conservar ambos para aproximar el login. ready solo indica que existe canvas, no garantiza escena renderizada.
Ancho máximo externo 760 px, alto clamp(360px,52vh,560px), mínimo 340 px; iframe con ancho extra y margen negativo, translateX -10vw, scale 1.1; ≤1200 px: -7vw y scale 1.05. A ≤900 px se oculta la sección, como el login; no se desmonta automáticamente el runtime. El viewport interno determina cámaras y composición; DPR de renderer original 1 escritorio / 2 móvil según detección original, no solo ancho CSS.
Mouse/touch se capturan dentro del iframe: movimiento modifica conos y cámara; mousedown/touchstart se propaga al sistema de partículas. El padre no reenvía eventos ni usa postMessage. El wrapper limpia polling/listener en pagehide, pero no hay teardown público integral GPU/ticker: retirar el iframe al desmontar en una integración SPA. Probar bfcache y remontajes. Reduced-motion externo reduce CSS pero NO detiene WebGL/GSAP interno.

## Intercom y red
Única modificación a bundles: se sustituye el setTimeout completo y único que inyectaba widget.intercom.io/widget/ee6u4z7r y llamaba a Intercom boot por void 0 comentado. Se conserva el resto byte a byte; ver MODIFICACIONES.json. Sintaxis verificada sin ejecutar bundles en Node. No se descarga ni ejecuta Intercom.
Los HTML de entrada añaden CSP para restringir cargas y conexiones al origen local, data/blob donde corresponde; sin object ni envío de formularios. Permite inline/eval por compatibilidad del runtime heredado: NO es una política de seguridad certificada para producción. Puede bloquear usos futuros y debe revisarse antes de integrar. El index.html original bajo demos/dala se conserva sin CSP adicional; su bundle también tiene Intercom neutralizado.
Quedan enlaces externos originales (Typeform, redes, términos) en DOM oculto, metadatos OG remotos sin carga visual automática y URLs de documentación/comentarios/polyfills. La cookie cookie_notice_accepted sigue en runtime original; no es auth. No se identificó otra integración externa activa en análisis estático, pero la prueba dinámica debe controlar la red. Loaders Draco/Basis están incluidos y configurados con assetsUrl original indefinido; GLB actuales sin compresión/extensiones ni URI externas no los necesitan. No sustituir modelos por comprimidos sin revisar decoders.

## Integración hero futura — fuera de esta entrega
Copiar manualmente recursos públicos y los archivos de entrada al repositorio destino autorizado. Mantener ruta /demos/dala y mismo origen. Colocar iframe como capa del hero detrás del texto y desplazar su CONTENEDOR hacia abajo; no editar cámara/modelos para esa colocación. Preservar dimensiones internas si se necesita comparación exacta. No copiar el escenario .demo-* del ejemplo como diseño comercial.
Separar stacking del texto/CTA y canvas. pointer-events:none en todo el iframe elimina interacción; overlays capturan eventos en su zona. Definir esa prioridad deliberadamente. El responsive actual oculta canvas en móvil: mostrarlo allí es un nuevo requisito y requiere validación. Revisar contraste, teclado, accesibilidad, movimiento reducido y rendimiento. Mantener iframe decorativo aria-hidden y tabindex=-1.

## Validaciones y límites
Consultar VALIDACION.json y el informe externo de navegador si se generó. Pruebas originales cubren HTML inyectado y existencia de assets, NO igualdad visual. Comparar capturas/vídeo con login original a mismo viewport, DPR, fase y puntero; probar Safari/Firefox/Chrome, transparencia sobre fondos claros/oscuros, clic/touch, pérdida de WebGL, resize, desmontaje, fugas y móvil real. No se han validado publicación, producción ni permisos comerciales.
Antes de publicar: resolver derechos y archivos LICENSE faltantes, revisión de privacidad/seguridad y visual. Ningún aviso parcial equivale a permiso de redistribución comercial. No incluye secretos, .env, node_modules, autenticación ni datos productivos.

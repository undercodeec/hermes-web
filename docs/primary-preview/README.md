## Evidencia reduced-motion corregida — 2026-11-10

La aserción reduced-motion de SEQUENTIAL-FOCUSED-CHECK.json anterior se ejecutaba con Vista estática ya activada: NO acredita aisladamente la preferencia. La evidencia de secuencia de49s y responsive estático de ese archivo sigue siendo histórica válida para su alcance, no se vuelve a ejecutar en esta corrección.

Nueva prueba aislada scripts/check-inbox-reduced.cjs, reutilizada por check-inbox-sequential.cjs: página nueva con reducedMotion=reduce y checkbox Vista estática DESMARCADO. REDUCED-ISOLATED-CHECK.json del implementador Chromium:6 contactos,4 mensajes, elapsed0 estable, cero typing, intervalos y animaciones; sin iframe ni pageerror. El script largo quedó actualizado, pero NO reejecutado ahora; solo se ejecutó la prueba aislada. No auditoría de consola ni pestaña real del SO.

Correcciones P2 del canvas y validaciones22/22/build/diff documentadas en ../canvas-transfer/RETURN-INTEGRATION.md y FAILURE-FOCUSED-CHECK.json. QA independiente fue estático, sin shell ni pruebas dinámicas ejecutadas. Sin aprobación visual del usuario, commit/push/deploy.

# Revisión actual: seis chats secuenciales — 2026-11-10

Sustituye las cronologías y afirmaciones vigentes del historial inferior. /workspace en hermesweb-opencode; rama feat/ui-ux-design-reference, HEAD ba562a5c0e396ec120b613a76dceae2de1535ff0. Cambios previos preservados; sin commit/push/deploy.

- Cuatro mensajes completos por contacto antes del siguiente. Cada bloque dura 7.4 s: typing 750 ms + lectura 1100 ms por mensaje. Primeras publicaciones: Lucía .75 s, Mateo 8.15 s, Sofía 15.55 s, Diego 22.95 s, Valentina 30.35 s, Andrés 37.75 s. Última publicación 43.3 s, reposo desde 44.4 s, ciclo total 47.4 s. No se cambió la duración total, sí el orden y los tiempos por contacto.
- Lista inicial de una fila y aparición individual al publicar el primer entrante; ciclos posteriores conservan seis filas y cuatro mensajes acotados por chat. Selección manual, panel, cursores y contadores solo entrantes conservados. Separador del panel corregido de interrogación a punto medio.
- Hover/foco NO pausan. Se congela offscreen/pestaña oculta o mediante Vista estática; reduced-motion ofrece seis historiales completos sin reloj. No anuncios live, autofocus, autoscroll ni red CRM.

## Evidencia actual y límites

- 20/20 pruebas node, pnpm build estático y git diff --check correctos (incluyen canvas).
- SEQUENTIAL-FOCUSED-CHECK.json: Chromium 158, 49 s reales, 985 muestras, transiciones 1→6 exactamente en los nuevos tiempos, selección Mateo e historial de cuatro mensajes conservados al cruzar ciclo. Panel, Escape/restauración de foco, separador, estática congelada y sin typing; overflow horizontal cero a 320/640/810/1440. Cero pageerror instrumentados. No instrumenta console.error, contraste ni recorte vertical.
- Script reproducible acotado: scripts/check-inbox-sequential.cjs. Utiliza el mismo entorno Fontconfig/NODE_PATH/LD_LIBRARY_PATH documentado abajo y servidor out/ en localhost:3000. Límite externo recomendado 90 s.
- scripts/check-primary-preview.cjs actualizado para tiempos secuenciales, nombres UTF-8 y evitar falso fallo si llega un entrante al abrir campana. Su primera ejecución falló por esa carrera de aserción; la siguiente excedió 120 s. NO se acredita ejecución completa favorable ni nuevo contraste/low-viewport a partir de ese script.
- scripts/check-primary-preview-low.cjs actualizado a Vista estática explícita y contactos seleccionables, NO ejecutado en esta revisión. Los JSON/capturas LOOP-*, SIX-* y evidencias antiguas permanecen históricos: no acreditan esta revisión.
- No hay QA independiente ni aprobación visual/UX/responsive, lector de pantalla o pestaña real del SO. El usuario revisará experiencia visual. No se afirma cobertura completa de notificaciones en navegador: conteos entrantes/ciclos están cubiertos por tests puros.

---
## Historial previo conservado, no evidencia de la revisión actual

# Revisión vigente: demo infinita de tres conversaciones — 2026-11-10

Esta sección sustituye las cronologías/controles y evidencias anteriores, conservados debajo como historial.

- Checkout original /workspace, contenedor real hermesweb-opencode (dockerhermesweb-opencode no existe). Rama feat/ui-ux-design-reference; HEAD ba562a5c0e396ec120b613a76dceae2de1535ff0. Sin commit/push/deploy ni escrituras anfitrión.
- Historia única determinista de 78 segundos activos: Lucía 0–24 s, Mateo 24–48 s, Sofía 48–72 s, reposo hasta 75 s y aviso de nuevo ciclo 75–78 s. Cada historia escribe a +1/+6/+12/+18 s y publica a +3/+8/+15/+21 s. Lista acumulada 1→2→3; solo mensajes publicados determinan resumen/hora/contexto. El loop vuelve a una fila/chat vacío, sin cambiar geometría ni reordenar al azar.
- SSR: solo primera fila, cero mensajes/horas futuras. Reduced-motion: tres filas finales y conversación Sofía completa, sin timers ni animaciones. En móvil se oculta la lista y la cabecera identifica nombre y posición 1/2/3.
- Sin botones de pausa/reanudación/reset/replay. Figura enfocável (tabIndex=0), etiqueta e indicación discretas; enfocar pausa, desenfocar continúa. Movimiento real de mouse sobre la superficie CRM pausa; abandonar continúa. Un scroll bajo cursor quieto no pausa; touch no activa hover. Sin autofocus ni live/log/alert.
- Un reloj activo modulo 78s; pausa offscreen/document.hidden con cleanup e histéresis relativa conservados. CSS dots/entradas se congelan al pausar. Sin catchup de tiempo inactivo, redes CRM ni autoscroll de aplicación.
- Contraste local: textos opacos, sin perspectiva/rotación/filtros del marco principal; entradas animan posición/fondo, no opacidad del texto. Mensajes 14px, metadata 13px; alturas reservadas y sin recortes técnicos en los tamaños comprobados. No se modificaron global CSS, page.jsx, hero/canvas ni segunda preview.

## Validación vigente

- node --test tests/*.test.mjs: 17/17.
- pnpm build: exportación estática / y /_not-found correcta.
- git diff --check: correcto.
- LOOP-TECHNICAL-CHECK.json: Chromium 158 real; ciclo completo de 78s, doce typing/publicaciones, llegada 1→2→3, correspondencia de nombres/contexto/resumen/horas y regreso vacío. Altura desktop constante 1027.796875px en las 29 muestras. Pausa hover/focus congela reloj y estilos de puntos; blur/leave continúa. hidden controlado y offscreen sin catchup. Reduced-motion inicial sin intervalos.
- 320/375/810/1024/1440 y 320×480 / 640×280: sin overflow, sin mensajes recortados, 14px, reduced-motion sin animaciones. Capturas nuevas loop-static-375.png y loop-static-1440.png.
- Contraste computado: 65 tramos visibles desktop, mínimo 4.762:1, opacidad efectiva 1, cero fallos. No sustituye auditoría completa de accesibilidad/visual.
- LOOP-LOW-320x480.json y LOOP-LOW-640x280.json: autoplay con ratio total .2781/.1669 y superficie disponible .7006/.7014, cursor centrado inmóvil tras scroll sin pausa accidental, focus/blur, touch sin sticky-hover, offscreen sin catchup, cero eventos pageerror.
- Fontconfig aislado conservado: /tmp/hermes-browser/fonts.conf, fuentes runtime DejaVu, caché temporal. Se exigió Inter realmente loaded. Sin dependencias nuevas. Solo favicon.ico del servidor fixture se responde 204; no sustitución de fuentes/UI/reloj. Sin solicitudes externas ni eventos pageerror. Los scripts vigentes solo capturan pageerror: NO instrumentan console.error ni mensajes de hydration; no se afirma ausencia de errores de consola/hydration. Las afirmaciones de consola del historial inferior pertenecen a fixtures anteriores y no prueban este loop.

Los intentos preliminares del fixture no se cuentan como aprobados: hubo latencia DevTools por canvas y una consulta DOM de resumen demasiado amplia. El fixture definitivo registra commits con MutationObserver en el navegador para no perder ventanas typing breves; no cambia ni acelera la aplicación. La primera versión del fixture dejaba pasar tiempo activo durante scroll suave: ahora el posicionamiento de prueba es instantáneo. Las evidencias LOOP-* corresponden únicamente a ejecuciones favorables definitivas; TECHNICAL-CHECK/LOW-VIEWPORT antiguos describen revisiones previas.

## Repetir dentro del contenedor

~~~sh
cd /workspace
node scripts/prepare-primary-preview-fontconfig.cjs
export FONTCONFIG_FILE=/tmp/hermes-browser/fonts.conf
export NODE_PATH=/tmp/hermes-browser/node_modules
export LD_LIBRARY_PATH=/tmp/browser-libs/usr/lib/x86_64-linux-gnu:/tmp/browser-libs/lib/x86_64-linux-gnu
node scripts/check-primary-preview.cjs
LOW_WIDTH=320 node scripts/check-primary-preview-low.cjs
LOW_WIDTH=640 node scripts/check-primary-preview-low.cjs
~~~

Requiere servidor estático out/ en localhost:3000 (fixture previo). Pruebas del implementador, NO QA independiente ni aprobación visual/UX. El coordinador reporta QA estático favorable; el QA de solo lectura tuvo ejecución denegada y no realizó una ejecución propia. Esta aclaración documental no añade ejecuciones de navegador ni nuevas validaciones de consola. Pendientes: QA independiente posterior, revisión visual/responsive del usuario, lector de pantalla y cambio de pestaña real del SO. El test hidden ejecuta evento controlado; touch verifica handler, no hardware físico.

---
# Historial conservado (no usar sus controles/cronología como estado vigente)

# Estado vigente de la revisión — 2026-11-10

**Bloqueo de fuentes resuelto.** Las notas anteriores de bloqueo que se conservan más abajo son históricas, no describen el resultado final.

- Separador corregido en primary-preview.jsx: «Consulta ilustrativa · 28 segundos», UTF-8.
- Fontconfig temporal exclusivo del test: /tmp/hermes-browser/fonts.conf apunta a las fuentes DejaVu ya disponibles en /tmp/browser-libs/usr/share/fonts; caché /tmp/hermes-browser/font-cache. La configuración anterior buscaba /usr/share/fonts, ausente en este runtime. No se modificaron UI, fuentes web, configuración global, dependencias ni otros proyectos.
- fc-list confirmó las seis fuentes DejaVu del runtime. Chromium 158 confirmó Inter loaded en ambas cargas reales a viewport inicial 320×480 y 640×280, sin warmup desktop ni sustitución/intercepción de fuentes.
- LOW-VIEWPORT-320x480.json y LOW-VIEWPORT-640x280.json y sus capturas low-*-controls.png ahora corresponden a esta revisión. Incluyen SHA-256 de los tres archivos de implementación. CURRENT y CHECK agregan exactamente esas dos ejecuciones, no son ejecuciones adicionales.
- Resultado: typing entrante automático con ratio total .24817/.15028 y superficie disponible .70267/.71211; pausa manual con estilos de los tres puntos congelados durante salida/retorno; controles enfocados y visibles de 44px; reset sin mensajes/hora; pausa automática offscreen con estilos congelados y sin catch-up; publicación tras volver a los 1544/1562ms; resize preserva avance. Errores JS/console: ninguno. Se intercepta solo favicon.ico del fixture con 204.
- TECHNICAL-CHECK.json y static-375/static-1440 también se regeneraron con la configuración corregida: SSR vacío, cuatro typings/publicaciones, resumen/hora, pausa, final sin loop, reduced-motion sin intervalo, responsive sin overflow, controles ≥44px y altura desktop estable.

Los intentos preliminares NO se contaron como aprobados. Una vez arreglado Fontconfig, el fixture low necesitó scrollIntoViewIfNeeded al reenfocar el mismo botón y 650ms para completar el scroll suave de foco existente; el fixture principal necesitó resetear tras cargar fuentes para comenzar su cronología desde cero, en lugar de intentar pausar al final del primer typing. Solo se corrigieron los scripts de prueba, sin cambiar producción para aprobar.

Repetición dentro de /workspace del mismo contenedor:

~~~sh
node scripts/prepare-primary-preview-fontconfig.cjs
export FONTCONFIG_FILE=/tmp/hermes-browser/fonts.conf
export NODE_PATH=/tmp/hermes-browser/node_modules
export LD_LIBRARY_PATH=/tmp/browser-libs/usr/lib/x86_64-linux-gnu:/tmp/browser-libs/lib/x86_64-linux-gnu
LOW_WIDTH=320 node scripts/check-primary-preview-low.cjs
LOW_WIDTH=640 node scripts/check-primary-preview-low.cjs
node scripts/check-primary-preview.cjs
~~~

No equivale a QA independiente ni aprobación visual/UX. QA estático favorable fue reportado por el coordinador. Pendientes: QA independiente de ejecución, pestaña real del SO, lector de pantalla y revisión visual. Sin commit/push/deploy. Rama feat/ui-ux-design-reference y HEAD ba562a5c0e396ec120b613a76dceae2de1535ff0 intactos.

---
# Registro histórico conservado (las afirmaciones de bloqueo inferiores fueron resueltas arriba)

# Inbox principal: evidencia técnica del implementador

Fecha: 2026-11-10. Checkout original /workspace, contenedor hermesweb-opencode. Rama feat/ui-ux-design-reference; HEAD inicial ba562a5c0e396ec120b613a76dceae2de1535ff0. Sin commit/push/despliegue.

## Estado previo preservado

Modificados antes de empezar: ESTADO-PROYECTO.md, src/app/globals.css, src/app/page.jsx. No rastreados previos: .opencode/, DESIGN.md, HERMESWEB-DIRECT-REPOSITORY-MULTIAGENT-REPORT.md, docker/, docs/, hermes-canvas-transfer-001-2026-11-10.zip, opencode.jsonc, public/canvas/, public/demos/, public/fonts/, scripts/, src/app/hero-canvas.jsx, src/app/hero-pointer-bridge.mjs, src/app/hero-scroll-bridge.mjs, src/app/navigation.jsx, start-hermes-opencode.ps1, tests/, web-original.zip. Solo se añadieron los archivos de la demo, pruebas/evidencia y una sección a ESTADO; page.jsx añade import y retorno temprano exclusivamente para main.

## Validaciones

- pnpm build: exporta / y /_not-found estáticamente.
- node --test tests/*.test.mjs: 16/16 (3 nuevas pruebas del modelo).
- git diff --check: correcto.
- TECHNICAL-CHECK.json: Chromium real 158, cronología completa y controles, pausa offscreen, visibilidad document.hidden controlada, reduced-motion inicial/cambios, ningún intervalo en carga reducida, sin animaciones CSS en figura reducida, alturas inicial/final iguales por breakpoint y sin overflow horizontal de figura/ventana. Screenshots static-375.png y static-1440.png: evidencia técnica, no aprobación visual.
- El servidor mínimo preexistente en localhost:3000 sirve out/; la comprobación intercepta exclusivamente favicon.ico con 204 porque ese fixture carece de favicon. Sin errores JS/hydration/console en la ejecución final bajo esa condición.

Repetir dentro del contenedor, con el servidor estático externo ya escuchando en 3000:

NODE_PATH=/tmp/hermes-browser/node_modules LD_LIBRARY_PATH=/tmp/browser-libs/usr/lib/x86_64-linux-gnu:/tmp/browser-libs/lib/x86_64-linux-gnu node scripts/check-primary-preview.cjs

Playwright y Chromium son herramientas temporales externas: no se añadieron dependencias. Se puede configurar PLAYWRIGHT_MODULE, CHROMIUM_PATH y PREVIEW_URL.

## Límites pendientes

No hubo cambio de pestaña real del sistema operativo: se comprobó el manejador mediante document.hidden y visibilitychange controlados. No se declara QA independiente, auditoría completa de accesibilidad, lector de pantalla, contraste ni aprobación visual o UX del propietario. La demo no se conecta al CRM ni representa capacidades adicionales del producto.

## Regresión P2: pantallas bajas

El coordinador reportó que el shell del QA fue denegado. El implementador corrigió el umbral imposible y realizó la comprobación técnica en Chromium real dentro de Docker; no se declara ejecución favorable de QA independiente.

La entrada requiere superficie equivalente al 35% de min(alto figura, alto viewport), con salida al 25% para evitar thrashing. Las mediciones solo se actualizan ante resize del viewport/figura y se coalescen en RAF; no hay polling de scroll. Se mantiene la pausa manual y el reloj activo anterior.

LOW-VIEWPORT-CHECK.json registra 320×480 (ratio total máximo 0,34419 y 0,235 con controles enfocados) y 640×280 (ratios 0,22824 y 0,16824). Reproduce automáticamente y por continuación manual. La prueba verifica controles realmente visibles y enfocados, salida completa con 5 s de espera sin catch-up al volver, persistencia de pausa manual y resize. Capturas low-320x480-controls.png y low-640x280-controls.png. 17/17 tests, build y diff correctos.

Repetición: mismo comando anterior, con FONTCONFIG_PATH=/tmp/browser-libs/etc/fonts adicional, y script scripts/check-primary-preview-low.cjs. Este contenedor necesita Fontconfig externo para inicializar fuentes; el script exige que Inter esté realmente cargada antes de medir. No se modificaron fuentes, dependencias, hero/canvas, segunda maqueta ni CSS durante esta corrección. La prueba de pestaña real del SO, QA independiente y aprobación visual siguen pendientes.

### Ejecución y limitación de infraestructura

Las ejecuciones agrupadas preliminares tuvieron fallos/timeouts intermitentes de inicialización de fuentes externas del navegador; no se contabilizan como favorables. Las dos ejecuciones finales se realizaron por separado mediante Docker, cada una exigiendo que la fuente Inter real tenga estado loaded antes de medir. LOW-VIEWPORT-320x480.json y LOW-VIEWPORT-640x280.json conservan sus resultados; LOW-VIEWPORT-CHECK.json es su agregación, no una tercera ejecución. Ambas pasaron sin errores de consola/hydration bajo el fixture documentado.

Para repetir, usar dos invocaciones Docker separadas con FONTCONFIG_PATH=/tmp/browser-libs/etc/fonts, NODE_PATH y LD_LIBRARY_PATH anteriores:

- LOW_WIDTH=320 node scripts/check-primary-preview-low.cjs
- LOW_WIDTH=640 node scripts/check-primary-preview-low.cjs

Sin LOW_WIDTH la prueba ejecuta solamente 320×480. No se degradó la aserción de carga de fuente para hacer pasar geometría sin texto.

## Revision UX WhatsApp - 2026-11-10 (evidencia vigente)

Esta seccion sustituye la cronologia anterior de dos mensajes iniciales. HEAD inicial y final sin commit: ba562a5c0e396ec120b613a76dceae2de1535ff0; rama feat/ui-ux-design-reference; contenedor real hermesweb-opencode, /workspace. Todos los cambios previos preservados.

- Modelo unico de cuatro mensajes con ID, direction, text, time, typingStart y sentAt. SSR/reset: cero mensajes montados y resumen Sin mensajes todavia sin hora. No placeholders ocultos.
- Cronologia activa: 1-3s typing entrante/publicacion a 3s; 6-8s saliente; 12-15s entrante y contexto humano; 19-22s saliente; reposo hasta 28s sin loop. Copys y horas reales previos conservados. Resumen cambia solo con lastID, con prefijo Tu para salientes.
- Burbujas suaves y colas con colores Hermes, tres puntos accesibles sin live/log/alert, animaciones CSS y pseudoelementos pausadas si data-active=false. Reduced-motion muestra final sin puntos ni intervalo.
- Solo se elimina la entrada WhatsApp del sidebar principal. El canal de contexto y la segunda maqueta siguen intactos. No se edito page.jsx, globals.css, hero/canvas, bridges ni recursos durante esta revision.
- Cambios: primary-preview-model.mjs, primary-preview.jsx, primary-preview.module.css, tests/primary-preview.test.mjs, scripts/check-primary-preview*.cjs, documentacion y evidencia de esta carpeta.

Validacion vigente: TECHNICAL-CHECK.json y capturas static-375.png/static-1440.png corresponden al nuevo flujo, Chromium 158 real. SSR DOM sin JS vacio, cuatro tramos typing/publicacion, pausa de transform/opacity de puntos, Enter en controles, reset vacio, pausa offscreen/hidden controlado, sincronizacion de resumen/hora y final one-shot; reduced-motion inicial sin setInterval y sin animaciones, breakpoints 320/375/810/1024/1440 sin overflow y controles >=44px. Altura desktop 921.796875px en las cuatro publicaciones, Inter realmente cargada antes de medir. Fixture favicon interceptado con 204. Sin errores JS/console/hydration en esa ejecucion.

Limitacion importante: las nuevas ejecuciones low-viewport 320x480 y 640x280 NO pasaron. La mayoria quedaron bloqueadas exigiendo Inter loaded (timeout o NetworkError del runtime externo; diagnostico Chromium Fontconfig/HarfBuzz sin fuentes). Un intento llego a geometria y revelo que la figura mas corta ya permite ratio total .353, por lo que se actualizo el fixture para colocar solo 70% del viewport sobre el extremo inferior y comprobar el umbral relativo menor de .35. Esta variante aun no tiene ejecucion favorable. LOW-VIEWPORT-*.json y low-*.png anteriores son historicos del diseno anterior, NO evidencia vigente; LOW-VIEWPORT-CURRENT.json deja constancia. No se quitaron las aserciones de fuentes ni se degradaron para aprobar.

Pendiente: ejecutar nuevamente ambos LOW_WIDTH con fuentes funcionales, QA independiente, cambio de pestaña real del SO, lector de pantalla/contraste y aprobacion visual/UX del usuario. No commit, push ni deploy.

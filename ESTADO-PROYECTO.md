# Estado del proyecto Hermes Web

**Fecha de corte:** 2026-11-09

**Repositorio destino:** <https://github.com/undercodeec/hermes-web>

**Carpeta local:** `D:\Documentos\Hermes\Hermes-web`

## Resumen

Se creó una base local independiente para el sitio comercial de Hermes CRM. El repositorio remoto estaba vacío al iniciar este trabajo. La primera página ya presenta el producto, capacidades documentadas, un recorrido ilustrativo y un enlace de contacto. La rama `feat/ui-ux-design-reference` contiene ahora un rediseño integral con `web-original.zip` como referencia principal y `DESIGN.md` como complemento. El QA favorable anterior no valida esta nueva implementación. Pendientes: nuevo QA independiente y revisión visual, responsive, de teclado y contraste del propietario.

## Fuente de diseño y tecnología

**Referencia vigente (2026-11-09):** `web-original.zip`, con análisis estático HTML/CSS y medidas extraídas por el diseñador. La composición se reproduce con fondo `#fcfcfc`, azul `#145aff` e Inter local. `DESIGN.md` es complementario. Los párrafos siguientes conservan la historia de la identidad de origen, no la dirección visual actual. No se ejecutó el sitio archivado ni sus rastreadores.

La referencia es el login de Hermes CRM en `D:\Documentos\undercodeec_nextjs\src\app\admin\crm\login\page.jsx`, con estilos en `src\app\admin\crm\crm.css`. Ese frontend utiliza Next.js 16.1.2, React 19.2.3 y CSS. Se reutilizó el logotipo original del login y su dirección visual: fondo claro, azul `#3f7bff`, violeta `#6a63ff`, texto oscuro, bordes suaves y tarjetas translúcidas.

El sitio nuevo usa la misma familia tecnológica y genera HTML estático mediante Next.js. No se copió la autenticación ni el backend del CRM, pues este sitio es público y comercial.

## Alcance implementado

| Elemento | Estado |
| --- | --- |
| Repositorio local independiente y remoto `origin/main` | Base publicada |
| Página de inicio responsive | Implementada como primera versión |
| Identidad visual basada en el login | Implementada |
| Vista ilustrativa del Inbox | Implementada, identificada como ilustrativa |
| Secciones de producto, capacidades y recorrido | Implementadas |
| Enlace de contacto a UnderCodeEC | Implementado |
| Acceso al CRM existente | Enlazado |
| Rediseño integral según `web-original.zip` | Implementado; build estático y diff verificados; pendiente de nuevo QA independiente y revisión visual del propietario |
| Dominio y despliegue | Pendientes de definición |

La primera versión se publicó en `main` mediante el commit `6522131` (`feat: initialize Hermes commercial website`). Esta publicación corresponde al código fuente; el sitio aún no tiene despliegue ni dominio propio.

## Contenido y límites

El contenido se apoya en el frontend CRM y en el estado documental de Hermes. Describe conversaciones de WhatsApp, leads, seguimiento humano y atribución disponible de Meta. No presenta cifras, clientes ni resultados comerciales no verificados. La interfaz del Inbox es una representación de concepto, no una captura del sistema ni datos reales.

La URL de contacto `https://undercodeec.com/contacto/` corresponde al formulario público existente. El acceso CRM apunta a `https://admincrm.undercodeec.com/admin/crm/login/`, ruta presente en el frontend de referencia; su acceso puede requerir autorización.

## Próximos pasos

1. Completar nuevo QA independiente y revisión visual responsive, de teclado y contraste del propietario para el rediseño según `web-original.zip`. El QA anterior corresponde a otra iteración.
2. Confirmar texto comercial, propuesta de valor, CTA principal, dominio y requisitos de SEO con el propietario.
3. Obtener la aprobación visual y de accesibilidad en navegador del propietario antes de desplegar. La publicación del código en la rama de desarrollo es un paso separado.
4. Habilitar indexación y desplegar cuando el contenido y el diseño estén aprobados.

## Verificación

- `pnpm install`: correcto con dependencias fijadas en `pnpm-lock.yaml`.
- `pnpm build`: correcto; Next.js prerenderizó `/` como página estática en `out/`.
- Enlace de contacto: el formulario público de UnderCodeEC responde y está disponible.
- El login CRM se toma de la ruta del frontend de referencia; no se validó una sesión autenticada desde este proyecto.
- `git push`: la rama `main` se creó correctamente en el repositorio remoto.

## Adaptación UI/UX a DESIGN.md — 2026-11-09

- Rama de trabajo: `feat/ui-ux-design-reference`; HEAD base: `21118459c76d377bca29ea605689180bda7e0c29`.
- Hero centrado con tipografía fluida y mockup frontal amplio sobre lavado lavanda, sin cuadrícula, órbitas, perspectiva 3D ni notas flotantes.
- Identidad Hermes conservada: logo, azul `#3f7bff`, violeta `#6a63ff`. Superficies claras, píldoras delineadas, radios consistentes, sombras suaves y pesos 400/500/600; sin nuevas fuentes remotas ni dependencias.
- Orden y contenido de introducción, capacidades, recorrido y contacto conservados; enlaces de UnderCodeEC y acceso CRM sin cambios. Sin clientes, métricas ni promesas nuevas.
- Navegación móvil visible, enlace para saltar al contenido, foco visible, objetivos de navegación de al menos 44 px y respeto de movimiento reducido.
- Vista identificada como “Vista ilustrativa · Sin datos reales”. Conversación a 14 px también en móvil; lista y barra lateral secundarias ocultas en pantallas pequeñas. No es una captura ni una interfaz funcional.
- `pnpm install --frozen-lockfile`: correcto; sin cambios en el lockfile.
- `pnpm build`: correcto; Next.js 16.1.2 exportó la página estática. `git diff --check`: correcto.
- Metadatos existentes y `noindex, nofollow` conservados. No se modificó autenticación ni se realizó despliegue. El propietario autorizó commit y push del código a la rama de desarrollo; su ejecución corresponde al coordinador y no se registra aquí como realizada.
- QA técnico independiente completado con resultado favorable: revisión de solo lectura del agente QA y verificaciones `pnpm build` y `git diff --check` ejecutadas por el coordinador. El recorrido usa una lista ordenada semántica (`ol`/`li`) sin duplicar la numeración accesible.
- Pendiente: revisión visual responsive, navegación por teclado, contraste en navegador y aprobación del propietario. Estas comprobaciones no se sustituyen por el QA estático ni por el build.


## Rediseño integral según web-original.zip — 2026-11-09

- Checkout original del contenedor: /workspace. Rama: feat/ui-ux-design-reference. HEAD base: ae6b85506623d69ddd97cf150f0de0a3173dfea3. Sin commit, push ni despliegue en esta tarea. Se preservan los archivos previos no rastreados.
- Referencia principal: HTML/CSS de web-original.zip, con medidas extraídas por el diseñador. No es una reinterpretación del login: se reemplazan layout, escala, tipografía, color y secuencia de secciones.
- Orden: navegación de 90 px (60 móvil), hero centrado independiente, preview grande, franja de capacidades sin logos de clientes, Conversa, Organiza, dos filas alternadas de seguimiento/origen, bento de cuatro capacidades, recorrido explicativo y footer oscuro. Sin precios, FAQ, testimonios ficticios ni banner CTA adicional.
- Geometría implementada en CSS: hero 70vh/min550/max860, radio inferior44, títulos hasta80 y36 móvil; retícula40, azul145aff y sombra interior fría. Secciones con padding desktop0/100/60, gap92 y max1400; interior max1200. Desde810 hasta1399: padding60/20/20 y gap60; móvil:60/16/16 y gap72. Preview con marco48/padding20 (36/16 intermedio,16/4 móvil), perspectiva1200 y rotateX5 desktop. Bento11 columnas, spans6+5/5+6 y alturas360/400; fila primera440 intermedia; orden móvil1,2,4,3. Footer radial oscuro y radio24/16. Son comparaciones de valores CSS con las medidas extraídas, no comparación visual de píxeles en navegador.
- Mockups DOM propios, densos y adaptables: barra lateral, conversaciones, mensajes, contexto del lead, tablero por etapas y tarjetas de atención/origen. Son representaciones ilustrativas con leyendas visibles, no capturas del CRM ni interfaces funcionales. En móvil se prioriza conversación legible; el tablero se apila sin recorte horizontal.
- Marca Hermes y enlaces reales conservados; copy limitado a WhatsApp, leads/etapas, atención humana y atribución disponible de Meta. Sin métricas, clientes o resultados inventados.
- InterVariable.woff2 y LICENSE-Inter.txt descargados del repositorio oficial rsms/inter (docs/font-files/InterVariable.woff2 y LICENSE.txt), almacenados en public/fonts. Fuente local con font-display:swap y licencia SIL Open Font License 1.1 incluida. No se copiaron fuentes propietarias ni recursos de licencia desconocida del ZIP. No hay fuentes remotas en runtime ni dependencias nuevas.
- Navegación móvil real con botón aria-expanded/aria-controls, cierre mediante Escape con retorno del foco y cierre al seleccionar enlace. Se conservan skip link, foco visible, texto estático renderizado, movimiento reducido, idioma es, noindex/nofollow y exportación estática. No se modificó autenticación.
- Validación ejecutada: pnpm build correcto (Next16.1.2, prerender estático de / y /_not-found). git diff --check correcto tras normalización de finales de línea.
- Pendientes: QA independiente de esta nueva implementación; comparación visual en navegador contra ZIP, revisión responsive real, teclado y contraste. Las geometrías fueron cotejadas a nivel de CSS, no se afirma fidelidad pixel-perfect ni aprobación visual. El coordinador decidirá cualquier commit/publicación conforme a la solicitud.


### Corrección P2 de QA: tablero sin recorte — 2026-11-09

- QA independiente detectó estáticamente que la primera columna de tres tarjetas excedía la altura fija del tablero (564 px desktop / 450 px intermedio) y quedaba recortada por overflow:hidden. Este hallazgo no constituye una aprobación global de QA.
- Corregido en src/app/globals.css: height:auto, min-height:564px (450px entre810–1399;0 móvil) y overflow:visible. Se mantienen marcos, tipografía, espaciados y columnas. La barra superior tiene sus radios superiores propios para conservar el marco sin depender del recorte. No se añade scroll ni se reduce texto para hacerlo caber.
- Verificación geométrica estática, sin navegador: a810/1024/1440 px, el ancho de figura es770/984/1200 px, el interior útil del tablero742/956/1172 px y cada columna225,33/296,67/360,67 px. El ancho de tarjeta resultante es203,33/274,67/332,67 px. Se calcularon desde padding, bordes, gaps y max-width vigentes.
- La altura ahora es max(450,103+altura intrínseca de la columna más alta) a810 y1024; max(564,117+altura intrínseca de la columna más alta) a1440. Incluye2px de borde,65px de toolbar y36/50px de padding vertical de la rejilla. La columna incorpora sus tres tarjetas y cualquier línea adicional a su altura intrínseca; no hay altura máxima ni overflow de recorte/scroll en el tablero. No se midió altura renderizada de fuentes en navegador.
- pnpm build correcto tras la corrección (exportación estática). git diff --check correcto. Sin commit, push ni despliegue. Se conservan los cambios previos.
- Pendientes: revalidación independiente del arreglo y revisión visual responsive en navegador por el propietario. No se afirma comparación pixel-perfect ni prueba de navegador.


## Canvas original detrás del hero — 2026-11-10

- Rama feat/ui-ux-design-reference; HEAD real ba562a5c0e396ec120b613a76dceae2de1535ff0. Checkout /workspace en contenedor hermesweb-opencode; cambios previos conservados. Sin commit, push ni despliegue.
- Integrado el canvas ORIGINAL del ZIP hermes-canvas-transfer-001-2026-11-10.zip, origen CRM main 56e6a217907376e7d53707b2521a815aaa83144c. DOM/runtime/CSS/modelos/texturas/fuentes y animación originales, no recreación; solo neutralización Intercom ya presente en entrega.
- Capa decorativa detrás del texto/CTA del hero, contenedor desplazado100px abajo; ancho/alto interno, filtro SVG y color18s/-9s originales conservados. Texto/CTA encima y clickeables; interaccion de puntero corregida mediante puente del hero (ver apartado posterior). No se copian autenticación, formulario, logo ni layout demo.
- Componente cliente sin iframe SSR; >900px y sin reduced-motion exclusivamente. Desmonta fuera de viewport/tab oculta/pagehide y limpia listeners/polling; remontaje reinicia escena. Fallback al fondo estático si no aparece canvas en20s. Ready significa canvas presente, no garantiza escena.
- 39 archivos públicos, 3.131.915bytes, hashes idénticos al paquete/exportación. CSP/mismo origen/noindex conservados; no se publica entrada demos/dala/index.html sinCSP. Referencias locales y orden manifest/vendor/theme comprobados sin async; sintaxis de bundles sin ejecución correcta.
- pnpm install --frozen-lockfile y pnpm build correctos en contenedor. Detalle, inventario, SHA256 y avisos en docs/canvas-transfer/INTEGRACION.md e INTEGRATED-ASSETS.json.
- Derechos de diseño, modelos, texturas y fuentes PPNeueMontreal pendientes y LICENSE de bundles ausentes: NO publicar hasta resolver permisos y revisión de seguridad/privacidad. Pendientes QA independiente, validación visual/posición/contraste/teclado del propietario, red, navegadores y GPU/rendimiento/remontajes. La evidencia de navegador del ZIP no valida esta integración.
- git diff --check correcto tras la integración; QA independiente no ejecutado por el implementador.

### Corrección de fallback tras QA estático

- Suscripciones same-origin a webglcontextlost/creationerror, error de recursos/document/window y unhandledrejection: un fallo observado desmonta el iframe y limpia listeners incluso después de ready. Fallo enclavado hasta remontar el hero completo, sin reintentos por visibilidad. Bundles/embed originales intactos.
- Ready solo indica canvas existente: shaders/errores manejados internamente y eventos anteriores a suscripciones no quedan certificados. Ver límites y pruebas de navegador pendientes en docs/canvas-transfer/INTEGRACION.md.
- Título iframe y documentación nueva reparados en UTF-8. QA independiente fue estático; no ejecutó build/comandos por shell denegado. Licencias continúan bloqueando publicación. Sin commit/push.

- Validaciones de esta corrección ejecutadas por el implementador en docker: pnpm build correcto (exportación estática), git diff --check correcto, 39 hashes de assets públicos/exportados intactos y comprobación de UTF-8 sin caracteres sustituidos en los archivos corregidos. No se ejecutaron pruebas de navegador ni QA dinámico.

### Correccion de hover y scroll del hero - 2026-11-10

- Causa: iframe hit-testable retenia rueda en su documento con ASSScroll preventDefault; texto/CTA superpuestos impedian que el mousemove llegara al window interno.
- Capa/wrapper/iframe ahora pointer-events:none; rueda/clic siguen nativos en padre. Listener pasivo en captura del hero (incluye texto/CTA) reenvia unicamente mousemove al window same-origin que realmente consume el runtime original. Sin wheel forwarding, preventDefault, scroll artificial, click/touch ni edicion de bundles.
- Mapping mediante rect del iframe a viewport interno: offsets/margenes/scale incluidos y clipping al borde. Un RAF maximo, sin rerenders por movimiento. Salida real del hero/blur/scroll/resize neutraliza centro y delta; ignora salidas de descendientes. Cleanup elimina RAF y listeners, enlazado al fallback/desmontaje existente. SSR, movil/reduced-motion, offscreen/error y animaciones preservados.
- Archivos: hero-canvas.jsx, hero-pointer-bridge.mjs, globals.css, tests/hero-pointer-bridge.test.mjs e integracion/estado. Evidencia exacta de consumidores y limites en docs/canvas-transfer/INTEGRACION.md.
- Validacion implementador: 5/5 pruebas deterministas Node, pnpm build estatico, git diff --check; 39 hashes originales intactos en public y out. No navegador ni QA independiente; pendiente revision visual y de rueda/trackpad/hover real del propietario. Licencias siguen bloqueando publicacion.
- Todas las escrituras dentro de docker hermesweb-opencode /workspace; rama feat/ui-ux-design-reference, HEAD ba562a5. Cambios anteriores conservados; sin commit, push ni despliegue.

- Seguimiento documental del QA comunicado por el coordinador: revision estatica favorable del puente con hallazgo menor de contrato desactualizado. Se corrige el contrato vigente en INTEGRACION.md (pointer-events:none y puente exclusivo mousemove, sin wheel); ESTADO revisado sin contrato de hit-testing antiguo vigente. QA no ejecuto comandos por shell denegado; las pruebas/build previos son del implementador. Esta correccion solo modifica documentacion; el coordinador valida el cierre. Sin commit.

### Fusion hero y scroll original: bloqueo real — 2026-11-10

- Hero sin borde inferior, radios ni sombra de corte; mascaras exclusivamente decorativas funden canvas/lavado/reticula hacia #fcfcfc. Texto/CTA y puntero original fuera de mascara; geometria interna y recursos originales preservados.
- Nuevo hero-scroll-bridge.mjs: mapping0→2.2 por geometria de7secciones, scroll padre pasivo/RAF, readiness separada del canvas, resize/reload/remontaje y cleanup;4tests nuevos deterministas.
- IMPORTANTE: dispersion NO restaurada. Chromium real contra out/ confirma ASScroll RAF activo y gsapVersions3.7.1 pero window.gsap y window.ScrollTrigger undefined. Via publica propuesta bloqueada; data-scroll-bridge=unavailable tras20s. No webpack interception, edicion bundles ni escena artificial. Hace falta API publica autorizada del origen o decision explicita del coordinador. Fusion CSS no equivale a dispersion shader.
- Evidencia SCROLL-RUNTIME-CHECK.json e INTEGRACION.md: rueda padre0→430, transform interno sin avance, offscreen/remount y reduced-motion/mobile comprobados. Prueba tecnica del implementador, NO QA independiente ni aprobacion visual. Playwright/bibliotecas solo temporales en contenedor; package/lockfile intactos.
- pnpm build y9/9 node --test tests/*.test.mjs correctos; git diff --check;39hashes public y39out originales intactos. Pendientes QA independiente, revision visual del propietario y licencias. Rama feat/ui-ux-design-reference HEADba562a5, cambios previos conservados, escrituras solo docker /workspace; sin commit/push/deploy.

### Correccion QA P2: fundido movil — 2026-11-10

- Hallazgo QA comunicado: media<=809 reintroducia radios inferiores28px y sombra inset azul. Se retiraron ambos overrides; las tres reglas hero heredan/mantienen borde0, radios0 y sombra none. Se corrige el alcance de la afirmacion anterior: la evidencia previa solo comprobaba1440px, no movil.
- Nueva regresion tests/hero-fusion.test.mjs;10/10 tests Node, pnpm build estatico, git diff --check y39hashes public/39out intactos.
- Chromium tecnico del implementador, reduced-motion:reduce, anchos390/809/810/900/901/1200/1440: radios0, borde0, sombra none, fondo#fcfcfc y texto sin mascara. Evidencia HERO-FUSION-BREAKPOINT-CHECK.json; no QA independiente ni aprobacion visual/canvas. Pendiente revalidacion QA y revision visual del propietario.
- API original sigue bloqueada, dispersion NO restaurada; licencias pendientes. Solo Docker /workspace, cambios previos preservados, rama feat/ui-ux-design-reference HEADba562a5; sin commit/push/deploy.


### Scroll canvas resuelto con parche mínimo local autorizado — 2026-11-10

- Este apartado sustituye el bloqueo anterior: se volvió a revisar theme.js del ZIP y se autorizó una API mínima en la copia local. El problema no era falta de shader: los globals GSAP privados y las secciones ocultas impedían conectar el progreso.
- scripts/patch-hero-runtime.mjs aplica dos inserciones únicas verificadas desde el ZIP/hash fijo: API congelada __HERMES_HERO_SCROLL__ (ready/state de lectura y setter numérico limitado0→2.2) después de inicialización; progreso externo aplicado al sectionProgress real justo antes del renderer original, evitando sobrescritura del IO oculto. Sin cambiar shaders/fórmulas/cámaras/mouse/FBO ni capturar Webpack ni crear otro RAF interno.
- hero-scroll-bridge.mjs conecta scroll nativo pasivo+RAF al adaptador. Progreso0→2.2 al recorrer70% del hero; expansión original1.1→2.2 y reagrupación al subir, sin scroll artificial del padre. Pointer-events:none, mousemove, CTA, fondo sin corte, reduced-motion/mobile/offscreen y cleanup anteriores conservados.
- Chromium158 real contra out/1440×1000: rueda+580 llevó progreso0→2.2 y los tres u_explode reales0→0.9576088417247839; rueda-580 devolvió progreso0 y uniformes0.040935579932285526. Renderer/FBO activo y tiempo avanzando; hero visible al expandirse. Remount aY430 sincroniza1.5265306122448983; mobile/reduced-motion sin iframe, offscreen desmonta, cero pageerrors y solicitudes externas. Opacidad global1 sin cambios. La transparencia original depende de smoothstep(-4.5,4,v_pos.z); la máscara CSS no es la expansión shader.
- Evidencia actual SCROLL-RUNTIME-CHECK.json; parche antes/después en SCROLL-RUNTIME-PATCH.json; explicación completa en INTEGRACION.md. 38/39 recursos idénticos al ZIP; SOLO theme.js cambia de15d3adb4… a e521e784af6da52af2b71468549c3c1af9130fbc247db1d4030aaec208cd2b31. Intercom neutralizado intacto. INTEGRATED-ASSETS actualizado; ZIP y documentos fuente de hashes/neutralización conservados, no afirmar39intactos.
- Validaciones implementador: node --test12/12, pnpm build estático, hashes39public/out contra inventario actual y git diff --check correctos. Prueba técnica headless SwiftShader, no QA independiente ni aprobación visual/rendimiento real; pendientes QA, revisión visual/responsive/UX del propietario, otros navegadores y licencias/permisos de modelos/texturas/diseño/fuentes. No publicar hasta resolverlos.
- Registro inicial /workspace feat/ui-ux-design-reference HEADba562a5c0e396ec120b613a76dceae2de1535ff0 y cambios previos preservados; todas las escrituras vía docker hermesweb-opencode. Sin tocar CRM/otros repositorios, sin commit/push/despliegue; coordinador decide siguientes acciones.


### Seguimiento P3 de QA estático y pruebas CLI — 2026-11-10

- QA estático favorable comunicado por el coordinador; auditor con shell denegado, sin ejecución propia de tests/build/navegador. El implementador ejecutó las revalidaciones siguientes; decisión de cierre a cargo del coordinador.
- Corregido UTF-8 de INTEGRACION.md y este ESTADO (interrogaciones que sustituían tildes/eñes/flechas). Sin alterar recursos fuente, ZIP ni el bundle previamente parcheado.
- Test CLI real nuevo: temporal dentro del contenedor, dos ejecuciones idénticas, rechazo no destructivo de destino con cambios ajenos y hashes fuente preservados, cleanup en finally. check-hero-scroll.cjs ahora afirma snapshotFrozen:true, no solo lo registra.
- Implementador: node --test13/13, pnpm build estático, git diff --check y hashes39public/39out correctos. Chromium158 reejecutado con assert de snapshot congelado: expansión/reversa real, mobile/reduced-motion/offscreen/remount correctos; cero pageerrors/solicitudes externas. Evidencia SCROLL-RUNTIME-CHECK.json actualizada. No QA dinámico independiente, aprobación visual ni permisos de licencia.
- Solo Docker hermesweb-opencode /workspace; feat/ui-ux-design-reference HEADba562a5c0e396ec120b613a76dceae2de1535ff0, cambios previos preservados. Sin commit/push/despliegue.

## Demo ilustrativa del Inbox principal — 2026-11-10

- Solo la primera figura usa ahora un componente cliente aislado (primary-preview.jsx), modelo puro y CSS Module; segunda maqueta, hero/canvas y bridges sin modificaciones de esta tarea.
- Recorrido único de 28 segundos activos: consulta, mensaje entrante, contexto actualizado explícitamente por el equipo, borrador ilustrativo, respuesta y reposo final. Sin red, datos reales, IA simulada, sonido, scroll/foco automáticos ni anuncios aria-live. Banda interna reservada, lista sincronizada, controles reales de pausa/continuación y reinicio/replay fuera del marco.
- Empieza con superficie visible equivalente al 35% del menor alto entre figura y viewport (salida al 25%, con histéresis); pausa al salir o esconder la pestaña y continúa sin recuperar tiempo inactivo. La pausa manual persiste. Reduced-motion muestra una vista final estática sin intervalos ni animaciones, también al cambiar la preferencia.
- Verificación del implementador: pnpm build (exportación estática), node --test tests/*.test.mjs (16/16), git diff --check. Chromium técnico: cronología, pausa/replay por teclado, fuera de pantalla, evento document.hidden controlado (NO cambio real de pestaña del SO), preferencia reducida inicial y dinámica, alturas estables inicial/final y ausencia de overflow en la figura a 320/375/810/1024/1440. Evidencia y límites: docs/primary-preview/.
- No equivale a QA independiente ni aprobación visual/responsive, contraste o lector de pantalla del propietario. Sin commit, push ni despliegue en esta tarea.

### Corrección P2: viewport bajo — 2026-11-10

- El umbral fijo .35 de toda la figura impedía reproducir en 320×480 (alto real de figura 1394,59 px; ratio máximo 0,34419). Se sustituyó por umbrales adaptativos: entrada .35 × min(alto figura, alto viewport) / alto figura; salida equivalente al .25 para evitar oscilaciones. IntersectionObserver continúa pausando fuera de pantalla; ResizeObserver y resize actualizan umbrales con una medición coalescida en RAF, sin polling de scroll ni reiniciar el reloj.
- Regresión pura añadida; node --test tests/*.test.mjs: 17/17. pnpm build y git diff --check correctos.
- Chromium real 158: 320×480 y apaisado 640×280; autoarranque con ratio total <.35, foco nativo de botones realmente dentro del viewport, pausa/continuación/reinicio por Enter, pausa manual persistente durante salida/retorno, 5 s fuera de pantalla sin catch-up, continuación al volver y resize bajo. Resultado detallado y capturas: docs/primary-preview/LOW-VIEWPORT-CHECK.json y low-*-controls.png.
- El coordinador informó shell denegado al QA. Estos resultados son del implementador ejecutando dentro de Docker: NO constituyen QA independiente ni aprobación visual. Sin cambios al hero/canvas o a la segunda maqueta. Sin commit/push/despliegue.

- Nota de infraestructura P2: ejecuciones agrupadas preliminares fallaron por inicialización de fuentes del Chromium externo. Los resultados finales retenidos son dos invocaciones Docker separadas, con Inter realmente cargada y aserción obligatoria; el JSON agregado identifica esta condición. No se presentan los intentos fallidos como QA favorable.

### 2026-11-10 - Primary preview: inicio vacio y UX de conversacion

Revision en /workspace de hermesweb-opencode, rama feat/ui-ux-design-reference, HEAD ba562a5c0e396ec120b613a76dceae2de1535ff0. Sin commit/push/deploy. Cambios previos preservados; hero/canvas/bridges/segunda maqueta intactos. Modelo unico cuatro mensajes, typing previo direccional, mensajes publicados a 3/8/15/22 segundos, contexto humano a 15 segundos, final sin loop a 28. SSR y reset sin mensajes ni hora, resumen por ultimo ID publicado y prefijo Tu saliente. Burbujas Hermes, tres puntos accesibles congelables por pausa/ocultacion, reduced-motion final sin reloj. Solo retirada entrada WhatsApp del sidebar principal.

Validacion: Chromium real con nuevo flujo, SSR DOM vacio, cuatro typings, pausas/manual/offscreen/hidden controlado, reset, final, reduced-motion sin intervalos ni CSS animado, responsive 320/375/810/1024/1440 sin overflow y controles de 44px; evidencia vigente en docs/primary-preview/TECHNICAL-CHECK.json. Pantallas bajas 320x480 y 640x280: scripts actualizados pero ejecucion bloqueada por inicializacion externa de fuentes, NO aprobadas; archivos LOW-VIEWPORT antiguos no prueban esta revision. Detalles honestos en README y LOW-VIEWPORT-CURRENT.json. QA independiente y validacion visual del usuario pendientes.

### 2026-11-10 — Resolución del entorno Chromium y corrección UTF-8

Separador del primary preview corregido a «Consulta ilustrativa · 28 segundos». Resuelto el bloqueo low-viewport mediante Fontconfig temporal exclusivo que apunta a DejaVu ya existente en el mismo runtime; sin cambio de UI, fuentes web ni configuración global. Inter loaded exigido y comprobado en Chromium 158 a 320×480 y 640×280. Ambas regresiones ahora favorables: typing, congelación manual y offscreen de puntos/reloj, controles enfocados realmente visibles, reset vacío y reanudación sin catch-up (1544/1562ms). Evidencia vigente con hashes en LOW-VIEWPORT-320x480.json y LOW-VIEWPORT-640x280.json; CURRENT/CHECK son agregaciones. También regenerados TECHNICAL-CHECK.json y capturas estáticas. Historial de fallos y correcciones del fixture documentado sin contabilizarlos como aprobados. Las notas anteriores de bloqueo quedan históricas y resueltas.

QA estático favorable reportado por coordinador; estas ejecuciones son del implementador, no QA independiente ni aprobación visual. Sin commit, push ni deploy; cambios previos preservados. Reproducción y límites en docs/primary-preview/README.md.


## Primary preview: loop ilustrativo de tres chats (2026-11-10)

En /workspace del contenedor hermesweb-opencode, rama feat/ui-ux-design-reference, HEAD ba562a5c0e396ec120b613a76dceae2de1535ff0. Se preservaron cambios previos; hero/canvas, globals.css, page.jsx y segunda preview no se editaron en esta revisión. Sin commit/push/deploy.

Cronología única 78s: Lucía/Mateo/Sofía entran a 0/24/48s con chat vacío, typing antes de cada mensaje y lista acumulada; aviso de reinicio 75–78s, loop coherente sin salto de altura. Controles eliminados; pausa sobre movimiento real de mouse en CRM o foco de figura, continúa leave/blur. Offscreen/tabhidden e histéresis conservados, reduced-motion final con tres filas sin timers. Textos locales opacos de alto contraste, mensajes 14px, mobile identifica chat activo sin lista y sin recortes técnicos. Etiqueta ilustrativa permanente, sin datos reales, automatización implícita, CRM en vivo ni redes.

Validado: 17/17 node tests; pnpm build estático; diff --check. Chromium 158: ciclo real completo, 12 typings/publicaciones, lista 1→2→3 y loop; pausa hover/focus/dots/hidden controlado/offscreen; reduced-motion sin intervalos; 320/375/810/1024/1440 y bajas 320×480/640×280 sin overflow/crops. Contraste computado desktop 65 tramos, mínimo 4.762:1 y opacidad 1. LOW autoplay con cursor quieto tras scroll y touch sin pausa sticky. Evidencia vigente docs/primary-preview/LOOP-*.json y loop-static-*.png; instrucciones y límites README. Evidencia anterior conservada como histórica.

Pendiente QA independiente posterior, revisión visual/UX del usuario, lector de pantalla y pestaña real del SO. Chromium técnico del implementador no equivale a estas aprobaciones.

### Aclaración de evidencia P3 — 2026-11-10

Los scripts vigentes check-primary-preview.cjs y check-primary-preview-low.cjs registran solo eventos pageerror; las ejecuciones LOOP-* tuvieron cero eventos pageerror. No instrumentan console.error ni mensajes de hydration: NO se afirma ausencia de errores de consola/hydration para esta revisión. Las menciones históricas de consola no acreditan el loop vigente. El coordinador reporta QA estático favorable; el QA de solo lectura tuvo ejecución denegada, sin ejecución propia. Solo se aclaró documentación, sin nuevas ejecuciones de navegador ni cambios de implementación/scripts. Sin commit/push/deploy.


## 2026-11-10 — Seis chats secuenciales y retorno del canvas

- Cuatro mensajes completos por contacto antes del siguiente. Cada bloque dura 7.4 s: typing 750 ms + lectura 1100 ms por mensaje. Primeras publicaciones: Lucía .75 s, Mateo 8.15 s, Sofía 15.55 s, Diego 22.95 s, Valentina 30.35 s, Andrés 37.75 s. Última publicación 43.3 s, reposo desde 44.4 s, ciclo total 47.4 s. No se cambió la duración total, sí el orden y los tiempos por contacto.
- Lista inicial de una fila y aparición individual al publicar el primer entrante; ciclos posteriores conservan seis filas y cuatro mensajes acotados por chat. Selección manual, panel, cursores y contadores solo entrantes conservados. Separador del panel corregido de interrogación a punto medio.
- Hover/foco NO pausan. Se congela offscreen/pestaña oculta o mediante Vista estática; reduced-motion ofrece seis historiales completos sin reloj. No anuncios live, autofocus, autoscroll ni red CRM.


Canvas original reutilizado después de journey-grid antes del footer: pista120vh/sticky100vh, entrada esquina inferior derecha, traslado al centro, expansión original final reversible por API existente. Wrapper y geometría estable separados; runtime/bundles/shaders/cámaras sin editar. Clase/mapper específicos, sin heredar reglas hero. Runtime diferido desktop, offscreen/hidden desmonta, móvil/reduced-motion sin pista ni runtime; fallback y errores latched. Prioridad entre anfitriones y relectura de geometría evitan actividad simultánea por IO antiguo al redimensionar. Hero conserva puntero; retorno sin interacción.

Validado implementador: node20/20, pnpm build estático, diff --check. Chromium158: SEQUENTIAL-FOCUSED-CHECK.json (49s reales,985 muestras, aparición secuencial, selección/historial conservados, panel/estática, overflow horizontal0 a320/640/810/1440); RETURN-TECHNICAL-CHECK.json (traslado/expansión/reversa reales, sticky, ciclo vida,900px/reduced/hidden controlado/context loss). Sin pageerror; no afirmación de consola, contraste o rendimiento real. Regresión Inbox extensa tuvo carrera inicial y timeout120s posterior; low script actualizado pero no ejecutado. Evidencias anteriores NO acreditan esta revisión. Detalles y límites actuales en docs/primary-preview/README.md y docs/canvas-transfer/RETURN-INTEGRATION.md.

Sin QA independiente ni aprobación visual/UX; usuario revisará. Pendientes otros navegadores, lector pantalla, pestaña real, rendimiento/licencias. Checkout/rama/HEAD originales preservados; todo vía docker exec, sin commit/push/deploy.


## Corrección P2 posterior a revisión estática — 2026-11-10

- Estado unavailable del bridge ahora invoca fail() existente: latch, limpieza de polling/listeners/RAF e iframe retirado; sin retry por scroll o cambio de preferencia. Afecta hero y retorno.
- Retorno fallido conserva anfitrión/orden de hooks y fallback radial, pero mide64px y no es sticky. Evita120vh vacíos; un único cambio de layout al fallo, sin transición ni montaje/desmontaje reiterado.
- Regresión focalizada: tests/canvas-failure-contract.test.mjs (contratos estáticos de cableado/estilos) y scripts/check-canvas-failure.cjs. Chromium del implementador inyecta getter contentWindow denegado después de ready: fuerza unavailable real en el bridge; ambos iframes desaparecen, fallback64px/no sticky y latch persiste tras volver/cambiar preferencia. FAILURE-FOCUSED-CHECK.json; cero pageerror instrumentados.
- Primer fixture con respuesta de bundle interceptada excedió120s y no produjo evidencia favorable; se detuvo ese proceso y sus hijos. Se sustituyó por fixture acotado sin cambiar assets/bundle, con watchdog70s. No se presenta el intento anterior como aprobado ni se afirma ejecución dinámica de timeout20s; ese plazo está cubierto por pruebas puras del bridge.
- Validado: node22/22, pnpm build estático, git diff --check y sintaxis scripts correctos. Un error inicial del nuevo test de contrato (interpolación de plantilla en el fixture) se corrigió antes del resultado22/22.
- QA independiente aportó revisión estática; no pudo ejecutar shell. Todas las ejecuciones anteriores son del implementador, NO pruebas independientes ni aprobación visual/UX. Pendientes revisión visual del usuario y límites de navegadores/rendimiento/licencias ya registrados. Sin commit/push/deploy, cambios anteriores preservados.

## Evidencia reduced-motion corregida — 2026-11-10

La aserción reduced-motion de SEQUENTIAL-FOCUSED-CHECK.json anterior se ejecutaba con Vista estática ya activada: NO acredita aisladamente la preferencia. La evidencia de secuencia de49s y responsive estático de ese archivo sigue siendo histórica válida para su alcance, no se vuelve a ejecutar en esta corrección.

Nueva prueba aislada scripts/check-inbox-reduced.cjs, reutilizada por check-inbox-sequential.cjs: página nueva con reducedMotion=reduce y checkbox Vista estática DESMARCADO. REDUCED-ISOLATED-CHECK.json del implementador Chromium:6 contactos,4 mensajes, elapsed0 estable, cero typing, intervalos y animaciones; sin iframe ni pageerror. El script largo quedó actualizado, pero NO reejecutado ahora; solo se ejecutó la prueba aislada. No auditoría de consola ni pestaña real del SO.

Correcciones P2 del canvas y validaciones22/22/build/diff documentadas en ../canvas-transfer/RETURN-INTEGRATION.md y FAILURE-FOCUSED-CHECK.json. QA independiente fue estático, sin shell ni pruebas dinámicas ejecutadas. Sin aprobación visual del usuario, commit/push/deploy.

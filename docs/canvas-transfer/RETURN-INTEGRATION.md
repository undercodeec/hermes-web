## Corrección P2 posterior a revisión estática — 2026-11-10

- Estado unavailable del bridge ahora invoca fail() existente: latch, limpieza de polling/listeners/RAF e iframe retirado; sin retry por scroll o cambio de preferencia. Afecta hero y retorno.
- Retorno fallido conserva anfitrión/orden de hooks y fallback radial, pero mide64px y no es sticky. Evita120vh vacíos; un único cambio de layout al fallo, sin transición ni montaje/desmontaje reiterado.
- Regresión focalizada: tests/canvas-failure-contract.test.mjs (contratos estáticos de cableado/estilos) y scripts/check-canvas-failure.cjs. Chromium del implementador inyecta getter contentWindow denegado después de ready: fuerza unavailable real en el bridge; ambos iframes desaparecen, fallback64px/no sticky y latch persiste tras volver/cambiar preferencia. FAILURE-FOCUSED-CHECK.json; cero pageerror instrumentados.
- Primer fixture con respuesta de bundle interceptada excedió120s y no produjo evidencia favorable; se detuvo ese proceso y sus hijos. Se sustituyó por fixture acotado sin cambiar assets/bundle, con watchdog70s. No se presenta el intento anterior como aprobado ni se afirma ejecución dinámica de timeout20s; ese plazo está cubierto por pruebas puras del bridge.
- Validado: node22/22, pnpm build estático, git diff --check y sintaxis scripts correctos. Un error inicial del nuevo test de contrato (interpolación de plantilla en el fixture) se corrigió antes del resultado22/22.
- QA independiente aportó revisión estática; no pudo ejecutar shell. Todas las ejecuciones anteriores son del implementador, NO pruebas independientes ni aprobación visual/UX. Pendientes revisión visual del usuario y límites de navegadores/rendimiento/licencias ya registrados. Sin commit/push/deploy, cambios anteriores preservados.

# Retorno decorativo del canvas original — 2026-11-10

Revisión /workspace, hermesweb-opencode, feat/ui-ux-design-reference, HEAD ba562a5c0e396ec120b613a76dceae2de1535ff0. Sin commit/push/deploy; trabajo anterior preservado.

Después de journey-grid y antes del footer: pista decorativa 120vh, viewport sticky 100vh. El wrapper emerge desde abajo/derecha, viaja al centro y solo en la fase final alimenta expansión original 0→2.2. Mapeo reversible separado en canvas-return-motion.mjs; geometría del anfitrión estable, nunca del elemento transformado. Solo transforms externos: no ediciones a bundle, shaders, cámaras ni fórmulas del runtime original.

HeroCanvas comparte OriginalFrame con variante returning, anfitrión parametrizado y mapper opcional en bridge. Conserva tamaño interno, escala y ciclo de color del embed original; clases return-brain independientes de reglas hero. Puntero original del hero conservado; retorno deliberadamente solo decorativo, sin reenviar puntero ni capturar rueda/clic. aria-hidden/tabIndex=-1 y pointer-events:none.

Carga solo intersectando escritorio >900px y no reduced-motion; elimina iframe al ocultar pestaña/pagehide/offscreen. Relee geometría estable ante IO (evita entradas antiguas de resize) y notifica ambas instancias; retorno tiene prioridad si ambos anfitriones pudieran ser visibles. Móvil/reduced-motion: display:none, cero pista vacía y cero runtime. Errores/pérdida de contexto tienen latch sin retry automático; fallback radial estático.

## Validación técnica del implementador

20/20 node tests, pnpm build estático y diff --check correctos. RETURN-TECHNICAL-CHECK.json corresponde a Chromium 158 con SwiftShader: escena de entrada progress=0, desplazamiento del wrapper; fase final progress≈2.19/explode≈.957, stickyTop=0; al subir progress=0/explode≈.041. Un iframe en muestras de entrada/salida/reversa; hero y retorno desmontan/remontan sin simultaneidad en puntos comprobados; hidden controlado, ancho900 y reduced-motion sin iframe/altura de pista; contexto perdido remueve runtime, mantiene fallback y no reintenta. Cero pageerror instrumentados; no auditoría de consola/red/rendimiento GPU.

Prueba reproducible: scripts/check-canvas-return.cjs, mismo Fontconfig y dependencias temporales de docs/primary-preview/README.md, servidor out/ localhost:3000. Primera ejecución detectó una aserción global de iframe que veía el hero tras resize; se corrigió sincronización de geometría de las instancias y la ejecución final vuelve a exigir cero iframe global después del fallo de contexto. No se contabiliza el intento preliminar como aprobado.

Pendiente QA independiente, UX/visual del propietario, Safari/Firefox/móvil real, rendimiento GPU real, bfcache y licencias/permisos ya señalados. SCROLL-RUNTIME-CHECK.json anterior prueba solo hero, no este retorno. No aprobación visual ni publicación.

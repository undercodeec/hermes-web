# HERMES-CANVAS-TRANSFER-001 — entrega final

- Fecha: 2026-11-10.
- Origen: undercodeec_nextjs, rama main, HEAD 56e6a217907376e7d53707b2521a815aaa83144c.
- Destino manual: Hermes Web; rama esperada feat/ui-ux-design-reference y HEAD de solicitud ae6b85506623d69ddd97cf150f0de0a3173dfea3. El receptor debe verificar su estado actual y preservar cambios locales.
- Solicitud: demo estática del canvas del login, sin autenticación/API ni modificaciones del login operativo. Contrato: conservar /demos/dala/ como ruta desde raíz y mismo origen del iframe.

## Contenido final y evidencia

El ZIP contiene SOLO package-final y esta documentación/evidencia seleccionada, con su contenido estático directamente en la raíz. No contiene scripts de generación, perfiles de navegador ni el primer candidato package. Ese candidato se conserva fuera del ZIP por no sobrescribir archivos; detectó una colisión de cascada responsive del escenario, corregida únicamente en el candidato final. También se añadió favicon local al wrapper final para evitar una petición implícita 404.

- 39 recursos originales, preservados salvo el bootstrap Intercom de theme.js: sustitución estrecha de 620 bytes originales, documentada en MODIFICACIONES.json.
- HTML transformado equivalente a dala-embed, wrapper estático, CSS y ciclo de vida DOM adaptado sin React. CSP local adicional, no certificada como política de producción.
- README.md, INVENTARIO.json, SHA256SUMS.txt, MODIFICACIONES.json, AVISOS-LICENCIAS.md, VALIDACION.json.
- validacion/browser-validation.json: prueba final Chrome headless 157, viewport 1440×1000; canvas 856×520 y wrapper visible. A ancho 800 la sección se oculta. 32 peticiones HTTP locales exitosas, sin excepciones JavaScript ni solicitudes externas observadas de la página. La captura muestra cerebro azul sobre fondo claro. No certifica igualdad con el login original ni toda la red del proceso Chrome.
- validacion/desktop-1440x1000.png: captura final.
- validacion/tests.txt: tres pruebas originales aprobadas. Advertencia Node sobre tipo de módulo de route.js preexistente; no se cambió package.json.

Sintaxis de tres bundles y wrapper comprobada con vm.Script, 37 referencias estáticas resueltas y cinco GLB sin URI externas/extensiones. Se preservaron los hashes de los 39 recursos de origen y los archivos previos protegidos. Inventario adicional y revisión del ZIP verifican todos sus archivos por SHA256. Los manifiestos internos originales tienen sus exclusiones autorreferenciales documentadas.

## Riesgos, pendientes y decisión

El conjunto mínimo exacto NO está certificado: DOM/loader/CSS originales requieren prudencia al podar assets. Se conservan recursos dudosos; no se identificaron recursos probadamente innecesarios para toda la interacción. No hay descargas, instalación de dependencias ni servicios privados CRM. No se incorporan .env, credenciales, node_modules, autenticación ni datos productivos.

GSAP/ScrollTrigger 3.7.1 identificables en vendor.js; Three.js identificado sin versión exacta confirmada. LICENSE.txt referenciados por bundles ausentes. Modelos, fuentes, diseño y texturas no tienen permisos de redistribución acreditados. No publicar ni asumir licencia comercial; completar revisión legal y de privacidad/seguridad.

Pendientes: integración hero, comparación visual sincronizada con login original, accesibilidad/contraste, reduced-motion WebGL, interacción touch real, navegadores adicionales, rendimiento/GPU, bfcache y desmontajes SPA. El canvas se oculta en móvil según contrato actual. Decisión requerida: copiar manualmente el ZIP al repositorio destino, verificar rama/HEAD y aprobar allí el diseño hero y las licencias antes de publicar. No se hizo commit, push, despliegue, pagos ni cambios de autenticación/backend.

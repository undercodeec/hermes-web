# Estado del proyecto Hermes Web

**Fecha de corte:** 2026-11-09

**Repositorio destino:** <https://github.com/undercodeec/hermes-web>

**Carpeta local:** `D:\Documentos\Hermes\Hermes-web`

## Resumen

Se creó una base local independiente para el sitio comercial de Hermes CRM. El repositorio remoto estaba vacío al iniciar este trabajo. La primera página ya presenta el producto, capacidades documentadas, un recorrido ilustrativo y un enlace de contacto. La adaptación UI/UX a `DESIGN.md` está implementada en la rama `feat/ui-ux-design-reference`, con QA técnico independiente favorable completado; pendiente de revisión visual responsive, teclado y contraste por el propietario.

## Fuente de diseño y tecnología

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
| Adaptación a la referencia de diseño `DESIGN.md` | Implementada; QA técnico independiente favorable; pendiente de revisión visual responsive, teclado y contraste por el propietario |
| Dominio y despliegue | Pendientes de definición |

La primera versión se publicó en `main` mediante el commit `6522131` (`feat: initialize Hermes commercial website`). Esta publicación corresponde al código fuente; el sitio aún no tiene despliegue ni dominio propio.

## Contenido y límites

El contenido se apoya en el frontend CRM y en el estado documental de Hermes. Describe conversaciones de WhatsApp, leads, seguimiento humano y atribución disponible de Meta. No presenta cifras, clientes ni resultados comerciales no verificados. La interfaz del Inbox es una representación de concepto, no una captura del sistema ni datos reales.

La URL de contacto `https://undercodeec.com/contacto/` corresponde al formulario público existente. El acceso CRM apunta a `https://admincrm.undercodeec.com/admin/crm/login/`, ruta presente en el frontend de referencia; su acceso puede requerir autorización.

## Próximos pasos

1. Completar con el propietario la revisión visual responsive, de navegación por teclado y de contraste de la adaptación a `DESIGN.md`. El QA técnico independiente ya se completó con resultado favorable.
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

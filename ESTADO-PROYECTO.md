# Estado del proyecto Hermes Web

**Fecha de corte:** 2026-11-06

**Repositorio destino:** <https://github.com/undercodeec/hermes-web>

**Carpeta local:** `D:\Documentos\Hermes\Hermes-web`

## Resumen

Se creó una base local independiente para el sitio comercial de Hermes CRM. El repositorio remoto estaba vacío al iniciar este trabajo. La primera página ya presenta el producto, capacidades documentadas, un recorrido ilustrativo y un enlace de contacto. El diseño final queda sujeto a los ejemplos de UI que compartirá el propietario.

## Fuente de diseño y tecnología

La referencia es el login de Hermes CRM en `D:\Documentos\undercodeec_nextjs\src\app\admin\crm\login\page.jsx`, con estilos en `src\app\admin\crm\crm.css`. Ese frontend utiliza Next.js 16.1.2, React 19.2.3 y CSS. Se reutilizó el logotipo original del login y su dirección visual: fondo claro, azul `#3f7bff`, violeta `#6a63ff`, texto oscuro, bordes suaves y tarjetas translúcidas.

El sitio nuevo usa la misma familia tecnológica y genera HTML estático mediante Next.js. No se copió la autenticación ni el backend del CRM, pues este sitio es público y comercial.

## Alcance implementado

| Elemento | Estado |
| --- | --- |
| Repositorio local independiente y remoto `origin` | Preparado |
| Página de inicio responsive | Implementada como primera versión |
| Identidad visual basada en el login | Implementada |
| Vista ilustrativa del Inbox | Implementada, identificada como ilustrativa |
| Secciones de producto, capacidades y recorrido | Implementadas |
| Enlace de contacto a UnderCodeEC | Implementado |
| Acceso al CRM existente | Enlazado |
| Diseño conforme a ejemplos del propietario | Pendiente de recibir referencias |
| Dominio y despliegue | Pendientes de definición |

## Contenido y límites

El contenido se apoya en el frontend CRM y en el estado documental de Hermes. Describe conversaciones de WhatsApp, leads, seguimiento humano y atribución disponible de Meta. No presenta cifras, clientes ni resultados comerciales no verificados. La interfaz del Inbox es una representación de concepto, no una captura del sistema ni datos reales.

La URL de contacto `https://undercodeec.com/contacto/` corresponde al formulario público existente. El acceso CRM apunta a `https://admincrm.undercodeec.com/admin/crm/login/`, ruta presente en el frontend de referencia; su acceso puede requerir autorización.

## Próximos pasos

1. Incorporar los ejemplos de UI y ajustar jerarquía, composición, tipografía, imágenes y comportamiento según esas referencias.
2. Confirmar texto comercial, propuesta de valor, CTA principal, dominio y requisitos de SEO con el propietario.
3. Revisar accesibilidad y presentación en navegador antes de publicar.
4. Habilitar indexación y desplegar cuando el contenido y el diseño estén aprobados.

## Verificación

- `pnpm install`: correcto con dependencias fijadas en `pnpm-lock.yaml`.
- `pnpm build`: correcto; Next.js prerenderizó `/` como página estática en `out/`.
- Enlace de contacto: el formulario público de UnderCodeEC responde y está disponible.
- El login CRM se toma de la ruta del frontend de referencia; no se validó una sesión autenticada desde este proyecto.

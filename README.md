# Hermes Web

Sitio comercial de Hermes CRM. Esta primera versión toma como base técnica y visual el login del CRM de UnderCodeEC: Next.js, React, CSS, logotipo y paleta azul/violeta.

## Desarrollo local

Requiere Node.js 22 o superior y pnpm 11.

```bash
pnpm install
pnpm dev
```

Abrir `http://localhost:3000`. Para generar el sitio estático:

```bash
pnpm build
```

El resultado queda en `out/`. La página no necesita claves ni backend para visualizarse. Los botones de contacto llevan al formulario público de UnderCodeEC; el acceso al CRM lleva al login existente.

## Estructura

- `src/app/page.jsx`: contenido y composición de la página.
- `src/app/globals.css`: estilos responsive y tokens visuales.
- `src/app/layout.jsx`: idioma y metadatos.
- `public/images/hermes-crm-logo.png`: logotipo usado en el login del CRM.
- `ESTADO-PROYECTO.md`: estado, decisiones y pendientes.

## Publicación

El proyecto produce un export estático de Next.js. Antes de publicar, definir el dominio/hosting, revisar el contenido final y actualizar los metadatos de indexación. Las referencias de UI que entregue el propietario guiarán las siguientes iteraciones.

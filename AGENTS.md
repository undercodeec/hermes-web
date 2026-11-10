# Hermes Web — desarrollo directo con OpenCode

Este repositorio Git independiente implementa el sitio comercial de Hermes CRM con Next.js 16, React 19, JavaScript y CSS. Usa pnpm 11 y exportación estática. Conserva la identidad visual Hermes, responsive, accesibilidad, SEO y rendimiento. No inventes funciones o promesas comerciales ni modifiques la autenticación del CRM. Hermes Backend y UnderCodeEC son repositorios distintos.

En la sesión independiente de Hermes Web, trabaja en el checkout original montado como `/workspace` dentro del contenedor aislado. Antes de empezar registra raíz Git, rama, HEAD, estado Git y archivos previos. Conserva esos cambios. El coordinador es el único agente principal: distribuye implementación entre frontend, diseñador y SEO; pide QA independiente y encarga las correcciones necesarias. Las tareas de desarrollo autorizan edición general y comandos locales dentro del entorno aislado, sin contratos por archivo. QA y auditores no editan código.

Identifica la rama de destino de cada solicitud. Puedes crear commits y hacer push en una rama de desarrollo si el usuario lo solicita, y en `main` solo si pide explícitamente trabajar y publicar allí. Nunca deduzcas un push de una solicitud que no lo mencione. Antes de publicar comprueba rama actual, cambios previos, archivos incluidos, validaciones y remoto de destino. No sobrescribas trabajo ajeno. No hagas despliegues sin solicitud explícita.

Usa `pnpm build` para verificar la exportación estática cuando proceda. `package.json` no declara scripts de test ni lint. El usuario realizará las revisiones visuales, responsive y de experiencia de usuario. No uses `--auto`: los permisos declarados deben cubrir las operaciones autorizadas.

En la sesión independiente de Hermes Web, la frontera de escritura del anfitrión depende del contenedor lanzado por `start-hermes-opencode.ps1`, no de estas instrucciones ni de `external_directory`. No ejecutes esa sesión independiente con shell general directamente en Windows.

Para coordinar con otro repositorio, entrega un bloque Markdown con ID, origen y destino, fecha, rama y HEAD, solicitud, contrato o archivos, evidencia, resultados, riesgos, validaciones realizadas y pendientes, y decisión requerida. La sesión receptora comprueba rama y HEAD.

## Vinculación desde UnderCodeEC

Cuando el usuario ejecute /vincular-hermes-web en la sesión principal de UnderCodeEC, esa sesión podrá trabajar en este checkout y en UnderCodeEC hasta /desvincular-hermes-web. Esta invocación autoriza desarrollo, pruebas, QA, commit y push a las ramas de desarrollo de ambos repositorios sin confirmaciones repetidas; prepara solo archivos de la tarea y preserva cambios ajenos. No publiques en main ni despliegues a producción. La sesión independiente de Hermes Web continúa usando start-hermes-opencode.ps1 y su contenedor; la sesión vinculada de UnderCodeEC usa el shell de Windows y no obtiene aislamiento físico de este contenedor. Trabaja únicamente en las dos raíces vinculadas y no abras Hermes Backend a menos que también esté activo /vincular-hermes.

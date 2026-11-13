# HERMESWEB-DIRECT-REPOSITORY-MULTIAGENT-REPORT

**ID:** HERMESWEB-DIRECT-REPOSITORY-MULTIAGENT
**Fecha:** 2026-11-09 (America/Guayaquil)
**Repositorio:** `D:\Documentos\Hermes\Hermes-web`
**Rama y HEAD:** `main`, `21118459c76d377bca29ea605689180bda7e0c29`
**Estado:** actualización R2 del 2026-11-09; sin commit, merge, push ni despliegue. Dictamen actual: `HERMESWEB_DIRECT_GIT_PARTIAL`.

## Base y migración

Antes de editar se confirmó la raíz Git, rama, HEAD, estado y lista de worktrees. En `main` ya estaban sin seguimiento `.opencode/`, `AGENTS.md`, `DESIGN.md` y `opencode.jsonc`; se preservó `DESIGN.md` y se revisaron los demás antes de actualizarlos. El worktree `hermesweb-dev` estaba en `dev/opencode-multiagent` con el mismo HEAD; se leyó su informe `HERMESWEB-MULTIAGENT-FULL-DEVELOPMENT-REPORT.md` y su configuración. No se modificó ningún worktree ajeno ni se incorporó OC-10.

Se conservó `.opencode/opencode.jsonc`, los auditores y los comandos `/auditar` y `/retomar`. Se actualizaron `opencode.jsonc`, `AGENTS.md`, los agentes Hermes Web y los comandos `/planificar`, `/desarrollar` y `/validar`. Se copió el plugin OC-07 `oc07-search` y sus cinco pruebas, sin contratos sintéticos, snapshots ni sesiones.

## Configuración final

`hermesweb-coordinator` es el agente principal predeterminado y no edita directamente. Puede delegar en `hermesweb-frontend`, `hermesweb-designer`, `hermesweb-seo`, `hermesweb-qa` y los tres auditores existentes. No se añadió un agente Build. Los especialistas de desarrollo tienen edición y shell generales dentro del contenedor. QA puede leer, consultar Git y ejecutar `pnpm build`, `node --test` y `node --check`, sin editar. Los auditores conservan solo lectura. Los agentes integrados `build`, `plan`, `general` y `explore` están deshabilitados en la configuración del proyecto.

La política global de OpenCode permite las operaciones habituales sin solicitudes repetidas y deniega `external_directory`. Esta regla es defensa de herramienta, **no** la frontera de seguridad del shell. No se usa `--auto`. La configuración no impone contratos de edición por archivo.

## Inicio y aislamiento

El lanzador es `start-hermes-opencode.ps1`. Construye `hermesweb-opencode:2.1.4` a partir de `docker/opencode/Dockerfile` y ejecuta OpenCode V2.1.4 con Node 22, pnpm 11.24.0 y Git. Ejecuta `pnpm install --frozen-lockfile` antes de abrir OpenCode. El único bind mount de un directorio Windows es el checkout original en `/workspace`, con lectura y escritura. `node_modules`, `/home/node` y `/tmp` son tmpfs temporales internos; la raíz de la imagen es de solo lectura. El proceso usa UID 1000, elimina capabilities, aplica `no-new-privileges`, limita procesos y usa red bridge. No se monta la carpeta padre, otros repositorios, credenciales de Windows ni el socket Docker. No se exponen puertos ni dispositivos adicionales.

El lanzador comprueba la raíz Git y rechaza enlaces de Windows cuyo destino declarado salga del repositorio. En la inspección actual no apareció un enlace externo; las junctions de `node_modules` apuntan dentro del repositorio y esa carpeta queda tapada por tmpfs en el contenedor. La red permite dependencias, proveedor de modelos y GitHub.

Comando exacto de inicio en PowerShell:

```powershell
Set-Location 'D:\Documentos\Hermes\Hermes-web'
.\start-hermes-opencode.ps1
```

Para commits, el lanzador pasa al contenedor la identidad `user.name` y `user.email` de Git sin guardarla en el repositorio. Para push HTTPS, `-GitHubAuth` solicita el PAT mediante una entrada oculta de PowerShell si no está en el entorno del proceso, lo pasa al contenedor por nombre de variable y lo elimina del entorno de PowerShell al terminar. Sin `-GitHubAuth`, el PAT no se pasa, incluso si existe una variable ambiental. `git-askpass.sh` lo entrega a Git en memoria. Debe ser un token de alcance mínimo, limitado al repositorio Hermes Web y a Contents read/write. No se copia ningún secreto a archivos del proyecto. No había un PAT real en el entorno de esta sesión. OpenCode sí completó sesiones de modelo de prueba sin una clave de proveedor pasada explícitamente.

## Política Git

El coordinador identifica rama y destino en cada solicitud y revisa cambios previos, archivos preparados, validaciones y remoto. Puede hacer commit y push en la rama de desarrollo cuando la solicitud lo pida; solo trabaja y publica directamente en `main` si el usuario lo solicita explícitamente. Una solicitud sin publicación no autoriza push. Las reglas efectivas permiten los comandos Git habituales dentro del contenedor, pero en esta preparación no se ejecutaron commit, merge, rebase, switch, pull ni push reales. El remoto observado es `https://github.com/undercodeec/hermes-web.git`.

## Validaciones ejecutadas

| Comprobación | Resultado |
| --- | --- |
| Imagen Docker, versiones y montaje | Imagen construida; OpenCode 2.1.4, pnpm 11.24.0, UID 1000 y raíz Git `/workspace` |
| Configuración y coordinador predeterminado | `opencode debug config` cargó ambos JSONC; una sesión `opencode run --standalone` sin `--agent` actuó como coordinador; intentar `--agent build` devolvió `Agent not found` |
| Delegación y edición | En R2, una sesión real del coordinador delegó a frontend la creación de `HERMESWEB-R2-PROBE.txt`, a QA la lectura y el build, y otra vez a frontend la limpieza. Recibió los tres resultados y entregó un informe consolidado. El probe fue eliminado |
| QA independiente | En R2, `hermesweb-qa` leyó el probe, consultó `git status --short`, ejecutó `pnpm build` con código 0 y devolvió PASS al coordinador; no editó fuentes |
| Límite de escritura | `validate-boundary.sh` escribió y borró un archivo dentro de `/workspace`; rechazó escrituras inocuas a `/` y `/workspace/..`; no vio `/mnt/host` ni socket Docker. No quedó archivo externo |
| Plugin de búsqueda | `node --test .opencode/tests/oc07-search.test.mjs`: 5/5 |
| Build | `pnpm install --frozen-lockfile && pnpm build` dentro del contenedor: correcto. Una sesión independiente de QA repitió el build con éxito y verificó los artefactos de `out/`; rutas estáticas `/` y `/_not-found` |
| Git y red | `git status`, rama, HEAD, identidad de commit y `git ls-remote origin HEAD`: correctos; el remoto devolvió el HEAD esperado |
| Autenticación y preparación de push | Entrada temporal por `-GitHubAuth` implementada y comprobada con token ficticio; un token inválido produjo HTTP 401 sin aparecer en la salida. No había PAT real, por lo que autenticación real y `git push --dry-run` siguen pendientes |
| Integridad | `git diff --check` sin errores; archivos rastreados sin modificación; artefactos `.next` y `out` ignorados |

## Riesgos y límites pendientes

- Las pruebas demuestran aislamiento de escritura directa para los caminos examinados, no una garantía formal contra todos los escapes. No se auditó exhaustivamente la posibilidad de hardlinks, carreras entre el examen de enlaces y el arranque, vulnerabilidades de Docker Desktop ni servicios del anfitrión accesibles por red que pudieran producir escrituras indirectas.
- El lanzador y Dockerfile están dentro de un repositorio editable por los agentes. Una modificación maliciosa del lanzador podría cambiar un arranque posterior en Windows; el usuario debe tratar el comando de lanzamiento como código de confianza y revisar sus cambios antes de ejecutarlo. La frontera comprobada corresponde a los argumentos actuales de `docker run`.
- El token GitHub, cuando se pase al contenedor, será accesible a procesos del contenedor con shell y red. Su alcance mínimo y caducidad reducen el impacto; no se probó autenticación porque el token no estaba disponible.
- El estado de OpenCode y las dependencias Linux en tmpfs se pierden al cerrar el contenedor. Cada inicio reinstala las dependencias desde el lockfile. No se configuró almacenamiento persistente de credenciales ni se montaron archivos personales.
- El flujo completo coordinador → frontend → QA → limpieza terminó en R2. El evaluador real de OpenCode permitió `git add`, `git switch`, `git commit`, `git fetch` y push ordinario; denegó `git push --force`. Fueron consultas de permisos, no comandos ejecutados. La autenticación real de GitHub y un dry-run con el PAT siguen pendientes. No se ejecutaron revisiones visuales, responsive o de experiencia de usuario, según la solicitud.
- Una comprobación completa de publicación requiere un token de alcance mínimo y un push de prueba `--dry-run` sin actualización remota. No se debe presentar esta preparación como publicación validada ni como versión desplegada.

## Actualización R2: GitHub y coordinación completa

**Dictamen: `HERMESWEB_DIRECT_GIT_PARTIAL`.** El flujo multiagente completo pasó. La autenticación GitHub local y el dry-run de push requieren un PAT de alcance mínimo que todavía no existe en esta sesión; la conexión GitHub usada para consultar metadatos del repositorio no proporciona una credencial Git local al contenedor.

### Auditoría Git y publicación

Al inicio y al cierre de R2, la raíz Git fue `D:\Documentos\Hermes\Hermes-web`, rama `main`, HEAD `21118459c76d377bca29ea605689180bda7e0c29`. `origin` apunta a `https://github.com/undercodeec/hermes-web.git`; `git ls-remote --heads origin` devolvió `refs/heads/main` en ese mismo SHA. El repositorio remoto identificado es `undercodeec/hermes-web`. No hay archivos `.github/workflows` en el árbol del commit actual. Eso no descarta webhooks, servicios externos o automatizaciones configuradas fuera del repositorio: un push futuro puede activar CI/CD o despliegues. No se hizo commit, push real, merge ni despliegue.

OpenCode V2.1.4 ejecutó una herramienta temporal que consultó `ctx.permission.assert` sin ejecutar Git. En `hermesweb-coordinator`, los recursos `git add src/app/page.jsx`, `git switch -c dev/r2-audit`, `git commit -m R2_AUDIT`, `git fetch origin` y `git push origin HEAD:refs/heads/dev/r2-audit` devolvieron **allow**; `git push --force origin main` devolvió **deny**. Se añadieron denegaciones directas para variantes comunes de force push y mirror; se quitaron reglas redundantes `shell *` de los especialistas que habrían prevalecido sobre esas denegaciones. El shell general admite comandos indirectos, por lo que esta política es una defensa de herramienta, no una barrera infalible frente a todas las formas de reescribir historial. La herramienta y su prompt temporales se retiraron después de la prueba.

### Credencial GitHub

Procedimiento para el titular de la cuenta:

1. Abrir [GitHub, crear fine-grained personal access token](https://github.com/settings/personal-access-tokens/new). Elegir como propietario `undercodeec`, nombre identificable, caducidad definida (por ejemplo 30 días), **Only select repositories** y seleccionar únicamente `hermes-web`.
2. Conceder solo **Repository permissions → Contents: Read and write**; no conceder permisos administrativos ni acceso a otros repositorios. GitHub añade Metadata: Read cuando corresponde. La [documentación oficial](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) explica la selección y el uso del PAT para Git HTTPS.
3. Generar el token y pegarlo solo en el prompt oculto de PowerShell al ejecutar `-GitHubAuth`. No pegarlo en el chat, un archivo, una URL Git o un comando que quede en el historial. El token no se almacena en el repositorio ni se montan credenciales de Windows.

Verificación no destructiva, una vez creado el PAT. La rama de destino de prueba queda identificada como `dev/hermesweb-r2-auth-check`; el script valida su nombre, la identidad del remoto y el token mediante la API de GitHub, consulta la capacidad `permissions.push` cuando GitHub la devuelve, consulta refs y ejecuta únicamente `git push --dry-run`:

```powershell
Set-Location 'D:\Documentos\Hermes\Hermes-web'
.\start-hermes-opencode.ps1 -GitHubAuth -Check -CheckCommand @('sh', '/workspace/docker/opencode/verify-github.sh', 'dev/hermesweb-r2-auth-check')
```

Ese comando aún no se ejecutó con un PAT real. Con un valor ficticio, la ruta de credenciales se transmitió sin imprimirse; otro valor ficticio inválido produjo `GITHUB_AUTH_FAILED_HTTP_401` y no apareció en logs. Sin `-GitHubAuth`, un valor ambiental de prueba no llegó al contenedor. Incluso si el dry-run pasa, no prueba autorización definitiva de escritura ni todas las reglas del servidor para pushes futuros; si no hay cambios por enviar, su resultado solo indica ese estado. La comprobación API previa valida identidad y acceso al repositorio, pero no sustituye un push real.

Para trabajo cotidiano con posibilidad de commit y push explícitamente solicitados:

```powershell
Set-Location 'D:\Documentos\Hermes\Hermes-web'
.\start-hermes-opencode.ps1 -GitHubAuth
```

La entrada oculta se hace una vez al iniciar, sin aprobar cada comando Git. Al ejecutar OpenCode de esta forma, **todos los procesos dentro del contenedor, incluidos los shells de especialistas, pueden leer el PAT ambiental**. Se evaluó un intermediario de publicación fuera del contenedor; no se implementó porque requeriría un servicio anfitrión de confianza, una comprobación externa de la rama autorizada y un canal de comunicación adicional. La solución actual prioriza el flujo directo; la credencial limitada a un repositorio y de corta duración reduce el alcance de exposición. No se trasladan credenciales personales de Windows.

### Sesión real de coordinación

La sesión coordinadora `ses_e3dae46d7ffeOrJkDRXCdidExy` completó: frontend `ses_e3dae2a73ffeoaRis5Fremtai3` creó `HERMESWEB-R2-PROBE.txt` con `R2_COORDINATION_OK\n`; QA `ses_e3dae01b2ffeFvJ4a4Rf1GL1Og` leyó el cambio, consultó Git y ejecutó `pnpm build` con código 0; frontend `ses_e3dacdda2ffe2M2fs44SfM1JeS` retiró el probe; el coordinador verificó el estado y entregó informe final PASS. Next.js 16.1.2 generó `/` y `/_not-found` como rutas estáticas. El prompt temporal, el probe y la herramienta temporal de permisos fueron retirados. Rama y HEAD quedaron intactos.

### Aislamiento con la opción de autenticación

Se repitió `validate-boundary.sh` con `-GitHubAuth` y un token ficticio: PASS. El contenedor mostró UID 1000, `CapEff` en cero, `NoNewPrivs: 1` y el montaje del repositorio en `/workspace` más el tmpfs de `node_modules`; no se añadió un bind mount de credenciales, carpeta padre, otros repositorios ni socket Docker. Docker Desktop presenta la fuente del montaje 9p como `D:\`, pero el target visible del contenedor es `/workspace`; las pruebas de escritura a `/` y `/workspace/..` fueron rechazadas. Persisten los riesgos de hardlinks, carreras de comprobación, servicios accesibles por red y edición del lanzador señalados arriba.

## Estado Git al entregar

`main` conserva HEAD `21118459c76d377bca29ea605689180bda7e0c29`. Permanecen sin seguimiento los archivos previos `.opencode/`, `AGENTS.md`, `DESIGN.md`, `opencode.jsonc`, y los nuevos `docker/`, `start-hermes-opencode.ps1` y este informe. No hay archivos rastreados modificados ni preparados. OC-10 no se integró.

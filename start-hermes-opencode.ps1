param(
    [switch]$Check,
    [string[]]$CheckCommand,
    [switch]$GitHubAuth
)
$ErrorActionPreference = 'Stop'
$repo = [System.IO.Path]::GetFullPath($PSScriptRoot).TrimEnd('\')
$expected = 'D:\Documentos\Hermes\Hermes-web'
if (-not [string]::Equals($repo, $expected, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Este lanzador solo admite el checkout original: $expected"
}
$gitRoot = (& git -C $repo rev-parse --show-toplevel).Trim().Replace('/', '\')
if ($LASTEXITCODE -ne 0 -or -not [string]::Equals($gitRoot, $repo, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "La raiz Git no coincide con $repo"
}
$gitName = (& git -C $repo config --get user.name).Trim()
$gitEmail = (& git -C $repo config --get user.email).Trim()
if (-not $gitName -or -not $gitEmail) { throw 'Configura user.name y user.email de Git antes de iniciar.' }
foreach ($name in @('GIT_AUTHOR_NAME', 'GIT_COMMITTER_NAME')) {
    if (-not [Environment]::GetEnvironmentVariable($name, 'Process')) { [Environment]::SetEnvironmentVariable($name, $gitName, 'Process') }
}
foreach ($name in @('GIT_AUTHOR_EMAIL', 'GIT_COMMITTER_EMAIL')) {
    if (-not [Environment]::GetEnvironmentVariable($name, 'Process')) { [Environment]::SetEnvironmentVariable($name, $gitEmail, 'Process') }
}
$prefix = $repo + '\'
$links = Get-ChildItem -LiteralPath $repo -Recurse -Force -Attributes ReparsePoint -ErrorAction Stop
foreach ($link in $links) {
    foreach ($target in @($link.Target)) {
        if ([string]::IsNullOrWhiteSpace($target)) { throw "Destino de enlace no verificable: $($link.FullName)" }
        if ([System.IO.Path]::IsPathRooted($target)) {
            $resolved = [System.IO.Path]::GetFullPath($target)
        } else {
            $resolved = [System.IO.Path]::GetFullPath((Join-Path $link.DirectoryName $target))
        }
        if (-not $resolved.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
            throw "Enlace fuera del repositorio: $($link.FullName) -> $resolved"
        }
    }
}
$dockerContext = Join-Path $repo 'docker\opencode'
& docker build --tag hermesweb-opencode:2.1.4 $dockerContext
if ($LASTEXITCODE -ne 0) { throw 'No se pudo construir la imagen aislada.' }
$run = @(
    'run', '--rm',
    '--name', 'hermesweb-opencode',
    '--user', '1000:1000',
    '--read-only',
    '--cap-drop', 'ALL',
    '--security-opt', 'no-new-privileges',
    '--pids-limit', '512',
    '--network', 'bridge',
    '--mount', "type=bind,source=$repo,target=/workspace,bind-propagation=rprivate",
    '--tmpfs', '/tmp:rw,nosuid,nodev,exec,size=512m',
    '--tmpfs', '/home/node:rw,nosuid,nodev,exec,uid=1000,gid=1000,size=1024m',
    '--tmpfs', '/workspace/node_modules:rw,nosuid,nodev,exec,uid=1000,gid=1000,size=1024m',
    '--env', 'HOME=/home/node'
)
if (-not $Check) { $run += '-it' }
$promptedToken = $false
try {
    if ($GitHubAuth -and -not [Environment]::GetEnvironmentVariable('HERMES_GITHUB_TOKEN', 'Process')) {
        $secureToken = Read-Host -Prompt 'GitHub PAT limitado a undercodeec/hermes-web' -AsSecureString
        if ($secureToken.Length -eq 0) { throw 'El token no puede estar vacio.' }
        $tokenPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
        try {
            [Environment]::SetEnvironmentVariable('HERMES_GITHUB_TOKEN', [Runtime.InteropServices.Marshal]::PtrToStringBSTR($tokenPointer), 'Process')
            $promptedToken = $true
        } finally {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($tokenPointer)
        }
    }
    foreach ($name in @('OPENAI_API_KEY', 'ANTHROPIC_API_KEY', 'GIT_AUTHOR_NAME', 'GIT_AUTHOR_EMAIL', 'GIT_COMMITTER_NAME', 'GIT_COMMITTER_EMAIL')) {
        if ([Environment]::GetEnvironmentVariable($name, 'Process')) {
            $run += @('--env', $name)
        }
    }
    if ($GitHubAuth) { $run += @('--env', 'HERMES_GITHUB_TOKEN') }
    $run += 'hermesweb-opencode:2.1.4'
    if ($Check) {
        if (-not $CheckCommand -or $CheckCommand.Count -eq 0) { throw 'Indica -CheckCommand para una comprobacion.' }
        $run += @('--check') + $CheckCommand
    }
    & docker @run
    if ($LASTEXITCODE -ne 0) { throw "El contenedor termino con codigo $LASTEXITCODE" }
} finally {
    if ($promptedToken) {
        Remove-Item -LiteralPath Env:\HERMES_GITHUB_TOKEN -ErrorAction SilentlyContinue
    }
}

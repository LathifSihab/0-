<#
.SYNOPSIS
    Runs tools/go-live.sh under Git Bash.

.DESCRIPTION
    On Windows, typing `bash` in PowerShell usually reaches the WSL stub in
    WindowsApps rather than Git Bash. On a machine without a working WSL
    distro that fails with

        WSL (8) ERROR: CreateProcessParseCommon:754: getpwuid(0) failed 2

    which says nothing about the actual problem. This wrapper finds the Git
    Bash that ships with Git for Windows and hands the wizard to that instead.

.EXAMPLE
    .\tools\go-live.ps1
#>

$ErrorActionPreference = 'Stop'

$wizard = Join-Path $PSScriptRoot 'go-live.sh'
if (-not (Test-Path $wizard)) {
    throw "Could not find go-live.sh next to this script ($PSScriptRoot)."
}

# The usual homes for Git Bash, then wherever git.exe itself lives: Git for
# Windows keeps bash.exe in ..\bin relative to cmd\git.exe.
$candidates = @(
    (Join-Path $env:ProgramFiles 'Git\bin\bash.exe'),
    (Join-Path ${env:ProgramFiles(x86)} 'Git\bin\bash.exe'),
    (Join-Path $env:LOCALAPPDATA 'Programs\Git\bin\bash.exe')
)

$git = Get-Command git -ErrorAction SilentlyContinue
if ($git) {
    $candidates += (Join-Path (Split-Path (Split-Path $git.Source -Parent) -Parent) 'bin\bash.exe')
}

$bash = $candidates | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1

if (-not $bash) {
    Write-Host ''
    Write-Host '  Git Bash was not found.' -ForegroundColor Yellow
    Write-Host '  The wizard is a bash script; install Git for Windows and try again:'
    Write-Host '  https://git-scm.com/download/win'
    Write-Host ''
    exit 1
}

# Run it from the site root so its relative paths (assets/js/config.js, tools/…) line
# up, exactly as they would in a Git Bash session opened there.
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    & $bash 'tools/go-live.sh'
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}

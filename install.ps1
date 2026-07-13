[CmdletBinding()]
param(
  [string]$DestinationRoot,
  [switch]$SkipRemotion
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

if ([string]::IsNullOrWhiteSpace($DestinationRoot)) {
  if (-not [string]::IsNullOrWhiteSpace($env:CODEX_HOME)) {
    $DestinationRoot = Join-Path $env:CODEX_HOME 'skills'
  } else {
    $DestinationRoot = Join-Path $HOME '.codex\skills'
  }
}

New-Item -ItemType Directory -Path $DestinationRoot -Force | Out-Null

function Install-SkillFolder {
  param(
    [Parameter(Mandatory = $true)][string]$Source,
    [Parameter(Mandatory = $true)][string]$DestinationName
  )

  $manifest = Join-Path $Source 'SKILL.md'
  if (-not (Test-Path -LiteralPath $manifest)) {
    throw "Skill manifest not found: $manifest"
  }

  $destination = Join-Path $DestinationRoot $DestinationName
  New-Item -ItemType Directory -Path $destination -Force | Out-Null
  Get-ChildItem -LiteralPath $Source -Force | Copy-Item -Destination $destination -Recurse -Force
  Write-Host "Installed $DestinationName -> $destination"
}

$footballSkill = Join-Path $repoRoot 'skills\edit-football-highlights'
Install-SkillFolder -Source $footballSkill -DestinationName 'edit-football-highlights'

if (-not $SkipRemotion) {
  $remotionSkill = Join-Path $repoRoot 'vendor\remotion-skills\skills\remotion-best-practices'

  if (-not (Test-Path -LiteralPath (Join-Path $remotionSkill 'SKILL.md'))) {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
      throw 'The Remotion submodule is missing and Git is not available.'
    }

    Write-Host 'Fetching the pinned Remotion skill submodule...'
    & git -C $repoRoot submodule update --init --recursive
    if ($LASTEXITCODE -ne 0) {
      throw 'Could not initialize the Remotion skill submodule.'
    }
  }

  Install-SkillFolder -Source $remotionSkill -DestinationName 'remotion-best-practices'
}

Write-Host 'Done. Restart Codex so it can discover the installed skills.'

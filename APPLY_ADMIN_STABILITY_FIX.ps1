$ErrorActionPreference = 'Stop'

$PatchRoot = $PSScriptRoot
$SourceRoot = Join-Path $PatchRoot 'patch_files'

# Support either:
# 1) patch folder extracted inside project root, or
# 2) patch contents extracted directly into project root.
if (Test-Path (Join-Path $PatchRoot 'client\src\pages\Admin\AdminApp.jsx')) {
  $ProjectRoot = $PatchRoot
} else {
  $ProjectRoot = Split-Path $PatchRoot -Parent
}

$RequiredProjectFile = Join-Path $ProjectRoot 'client\src\pages\Admin\AdminApp.jsx'
if (-not (Test-Path $RequiredProjectFile)) {
  throw "Could not find the Tripscape project root. Put this patch folder inside the folder that contains client and server, then run it again."
}

$Files = @(
  'client\src\pages\Admin\AdminApp.jsx',
  'server\src\index.js',
  'server\src\middleware\security.js',
  'server\src\routes\adminAuth.js'
)

$Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$BackupRoot = Join-Path $ProjectRoot "_backup_admin_stability_$Stamp"
New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null

foreach ($Relative in $Files) {
  $Source = Join-Path $SourceRoot $Relative
  $Target = Join-Path $ProjectRoot $Relative
  if (-not (Test-Path $Source)) { throw "Patch source missing: $Source" }
  if (-not (Test-Path $Target)) { throw "Project file missing: $Target" }

  $Backup = Join-Path $BackupRoot $Relative
  New-Item -ItemType Directory -Path (Split-Path $Backup -Parent) -Force | Out-Null
  Copy-Item $Target $Backup -Force
  Copy-Item $Source $Target -Force
  Write-Host "Patched: $Relative" -ForegroundColor Green
}

Write-Host "" 
Write-Host "Admin stability fix applied successfully." -ForegroundColor Cyan
Write-Host "Backup: $BackupRoot" -ForegroundColor Yellow
Write-Host "" 
Write-Host "Next commands:" -ForegroundColor Cyan
Write-Host "  npm run build"
Write-Host "  npm run dev"

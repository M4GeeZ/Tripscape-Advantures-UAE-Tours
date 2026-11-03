$ErrorActionPreference = 'Stop'

$PatchRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Get-Location
$Timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$BackupRoot = Join-Path $ProjectRoot ".tripscape-fix-backup-$Timestamp"

$Files = @(
  'client/src/components/ReviewsSection/ReviewsSection.jsx',
  'server/src/index.js',
  'server/src/routes/adminAuth.js',
  'server/src/routes/admin.js',
  'server/src/routes/reviews.js',
  'server/src/utils/security.js',
  'server/src/middleware/security.js',
  'server/src/models/Review.js'
)

foreach ($Relative in $Files) {
  $Source = Join-Path $PatchRoot $Relative
  $Target = Join-Path $ProjectRoot $Relative
  if (-not (Test-Path $Source)) { throw "Patch file missing: $Relative" }

  if (Test-Path $Target) {
    $Backup = Join-Path $BackupRoot $Relative
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Backup) | Out-Null
    Copy-Item $Target $Backup -Force
  }

  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Target) | Out-Null
  Copy-Item $Source $Target -Force
  Write-Host "Patched: $Relative" -ForegroundColor Green
}

Write-Host "`nPatch applied successfully." -ForegroundColor Cyan
Write-Host "Backup: $BackupRoot"
Write-Host "Next: npm run build"

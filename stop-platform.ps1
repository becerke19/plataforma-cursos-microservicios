$rootDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
Set-Location $rootDir

$escapedRoot = [regex]::Escape($rootDir)

$matchingProcs = Get-CimInstance Win32_Process | Where-Object {
  ($_.Name -eq "node.exe" -or $_.Name -eq "powershell.exe") -and
  $_.CommandLine -match $escapedRoot -and
  $_.ProcessId -ne $PID
}

foreach ($proc in $matchingProcs) {
  try {
    Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
  } catch {
  }
}

if ((Test-Path "docker-compose.yml") -or (Test-Path "compose.yml")) {
  docker compose down
}

Write-Host "Servicios del proyecto y contenedores detenidos." -ForegroundColor Yellow

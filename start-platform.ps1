$rootDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
Set-Location $rootDir

if (-not (Test-Path ".env") -and (Test-Path ".env.example")) {
  Copy-Item ".env.example" ".env"
}

docker compose up -d

$services = @(
  @{ Name = "auth-service"; Port = 3001 },
  @{ Name = "courses-service"; Port = 3002 },
  @{ Name = "progress-service"; Port = 3003 },
  @{ Name = "certificates-service"; Port = 3004 },
  @{ Name = "payments-service"; Port = 3005 }
)

foreach ($s in $services) {
  $servicePath = Join-Path $rootDir "services\$($s.Name)"
  if (Test-Path (Join-Path $servicePath "package.json")) {
    $cmd = "Set-Location '$servicePath'; if (-not (Test-Path 'node_modules')) { npm install }; npm run start:dev"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd
  }
}

$frontendPath = Join-Path $rootDir "frontend"
if (Test-Path (Join-Path $frontendPath "package.json")) {
  $frontCmd = "Set-Location '$frontendPath'; if (-not (Test-Path 'node_modules')) { npm install }; npm run dev"
  Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontCmd
}

Write-Host "Infraestructura, 5 microservicios (3001-3005) y frontend iniciados." -ForegroundColor Green

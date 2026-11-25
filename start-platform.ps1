$rootDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
Set-Location $rootDir
if (-not (Test-Path ".env") -and (Test-Path ".env.example")) { Copy-Item ".env.example" ".env" }
docker compose up -d
$services = @("auth-service", "courses-service", "progress-service", "certificates-service", "payments-service")
foreach ($s in $services) {
  $p = Join-Path $rootDir "services\$s"
  if (Test-Path (Join-Path $p "package.json")) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$p'; if (-not (Test-Path 'node_modules')) { npm install }; npm run start:dev"
  }
}
$f = Join-Path $rootDir "frontend"
if (Test-Path (Join-Path $f "package.json")) {
  Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$f'; if (-not (Test-Path 'node_modules')) { npm install }; npm run dev"
}

$rootDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
Set-Location $rootDir
$esc = [regex]::Escape($rootDir)
Get-CimInstance Win32_Process | Where-Object {
  ($_.Name -eq "node.exe" -or $_.Name -eq "powershell.exe") -and $_.CommandLine -match $esc -and $_.ProcessId -ne $PID
} | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
if ((Test-Path "docker-compose.yml") -or (Test-Path "compose.yml")) { docker compose down }

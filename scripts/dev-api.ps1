# Integration: start BFF on :3001
Set-Location $PSScriptRoot\..
if (-not (Test-Path "apps\api\node_modules")) {
  Write-Host "Installing workspaces..."
  npm install
}
npm run dev:api

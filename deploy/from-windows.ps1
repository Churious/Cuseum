# Deploy Cuseum to homelab from Windows.
# Requires: OpenSSH client, network access to the homelab host.
#
# Usage:
#   .\deploy\from-windows.ps1
#   .\deploy\from-windows.ps1 -Host 192.168.1.143 -User YOUR_USER -Port 2222

param(
  [string]$Host = "192.168.1.143",
  [string]$User = "ubuntu",
  [int]$Port = 2222,
  [string]$RemotePath = "~/cuseum"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$Archive = Join-Path $env:TEMP "cuseum-deploy.tar.gz"

Write-Host "==> Creating archive (excluding node_modules, .next, .git)"
if (Test-Path $Archive) { Remove-Item $Archive -Force }

tar --exclude=node_modules --exclude=.next --exclude=.git --exclude=data -czf $Archive .

Write-Host "==> Uploading to ${User}@${Host}:${RemotePath}"
scp -P $Port $Archive "${User}@${Host}:${RemotePath}/cuseum-deploy.tar.gz"

Write-Host "==> Building and rolling out on homelab"
$RemoteCmd = @"
set -euo pipefail
cd $RemotePath
tar -xzf cuseum-deploy.tar.gz
rm cuseum-deploy.tar.gz
bash deploy/homelab-deploy.sh
"@

ssh -p $Port "${User}@${Host}" $RemoteCmd

Write-Host ""
Write-Host "Done. Cuseum should be live at https://cuseum.swanno3o.com"

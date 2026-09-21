$ErrorActionPreference = "Stop"

$owner   = "DNAprojects-live"
$repo    = "DNAproject"
$appName = "RadialDesktop"

$installDir = Join-Path $env:LOCALAPPDATA $appName
Write-Host "Installing $appName to $installDir"

$release = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/releases/latest"
$asset   = $release.assets | Where-Object { $_.name -like "*portable*.exe" } | Select-Object -First 1

if (-not $asset) {
    Write-Host "No portable .exe found in the latest release."
    exit 1
}

New-Item -ItemType Directory -Force -Path $installDir | Out-Null
$exePath = Join-Path $installDir "$appName.exe"
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $exePath

$startMenu = [Environment]::GetFolderPath("Programs")
$shortcut  = Join-Path $startMenu "$appName.lnk"
$wsh = New-Object -ComObject WScript.Shell
$sc = $wsh.CreateShortcut($shortcut)
$sc.TargetPath = $exePath
$sc.WorkingDirectory = $installDir
$sc.Save()

$startupFolder = [Environment]::GetFolderPath("Startup")
Copy-Item $shortcut (Join-Path $startupFolder "$appName.lnk") -Force

Start-Process $exePath

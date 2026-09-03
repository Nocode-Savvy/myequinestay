$dir = Join-Path $env:LOCALAPPDATA "ms-playwright\chromium_headless_shell-1234"
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}
$zip = Join-Path $dir "shell.zip"
Write-Host "Downloading chrome-headless-shell..."
curl.exe -L "https://storage.googleapis.com/chrome-for-testing-public/151.0.7922.34/win64/chrome-headless-shell-win64.zip" -o $zip
Write-Host "Extracting..."
Expand-Archive $zip -DestinationPath $dir -Force
Remove-Item $zip -Force
$exe = Join-Path $dir "chrome-headless-shell-win64\chrome-headless-shell.exe"
Write-Host "Exists: $(Test-Path $exe)"

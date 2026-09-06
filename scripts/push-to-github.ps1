# Push HireMind project to GitHub
# Fixes "gh is not recognized" by refreshing PATH after GitHub CLI install

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + `
            [System.Environment]::GetEnvironmentVariable("Path", "User")

$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
    Write-Error "GitHub CLI not found. Install: winget install GitHub.cli"
    exit 1
}

Set-Location $PSScriptRoot\..

Write-Host "Checking GitHub login..." -ForegroundColor Cyan
& $gh auth status 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Not logged in. Run this first:" -ForegroundColor Yellow
    Write-Host '  & "C:\Program Files\GitHub CLI\gh.exe" auth login' -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

$repoName = "hiremind-mca"
Write-Host "Creating repo '$repoName' and pushing..." -ForegroundColor Cyan

& $gh repo create $repoName --public --source=. --remote=origin --push
if ($LASTEXITCODE -ne 0) {
    Write-Host "Retry with alternate name..." -ForegroundColor Yellow
    & $gh repo create "hiremind-recruitment" --public --source=. --remote=origin --push
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Done! Repository pushed to GitHub." -ForegroundColor Green
    & $gh repo view --web 2>$null
}

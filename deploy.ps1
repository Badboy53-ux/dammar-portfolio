# One-Shot Deployment Helper (PowerShell)
#
# This script does everything that CAN be automated from this machine:
#   1. Verifies the toolchain
#   2. Builds the frontend and smoke-tests the backend
#   3. Imports the schema into your hosted MySQL
#   4. Logs into Vercel and deploys the frontend
#
# It CANNOT click buttons on Railway/Render for you — those need your browser
# login. So the flow is: you create the DB + backend service (2 browser tabs),
# paste the values below, and this script finishes the rest.
#
# Usage:
#   cd "c:\Users\home\Desktop\Dammar-Portfolio"
#   .\deploy.ps1

$ErrorActionPreference = 'Stop'
$env:Path += ";C:\Program Files\nodejs;C:\Program Files\Git\cmd"

function Step($n, $text) { Write-Host "`n[$n] $text" -ForegroundColor Cyan }
function Ok($text)       { Write-Host "    OK  $text" -ForegroundColor Green }
function Warn($text)     { Write-Host "    !!  $text" -ForegroundColor Yellow }
function Fail($text)     { Write-Host "    XX  $text" -ForegroundColor Red }

Write-Host "=== Dammar Portfolio - Deployment Helper ===" -ForegroundColor White
$root = $PSScriptRoot

# ---------------------------------------------------------------------------
Step 1 'Checking toolchain'
# ---------------------------------------------------------------------------
try { $nodeV = & node --version; Ok "node $nodeV" }
catch { Fail 'node not found. Install Node.js from https://nodejs.org'; exit 1 }
try { $gitV = & git --version; Ok "$gitV" }
catch { Warn 'git not found - you will need it to push, but deploy can continue' }

# ---------------------------------------------------------------------------
Step 2 'Collecting configuration'
# ---------------------------------------------------------------------------
Write-Host "`nPaste the values from your MySQL host (Railway / Aiven)." -ForegroundColor Gray
Write-Host "Press Enter to skip any value you do not have yet.`n" -ForegroundColor Gray

$dbHost = Read-Host 'MySQL host'
$dbPort = Read-Host 'MySQL port (Enter = 3306)'; if (-not $dbPort) { $dbPort = '3306' }
$dbUser = Read-Host 'MySQL user'
$dbPass = Read-Host 'MySQL password' -AsSecureString
$dbName = Read-Host 'MySQL database name'
$backendUrl = Read-Host 'Backend URL from Render (e.g. https://xxx.onrender.com)'

# Convert secure string to plain text only at the moment of use
$dbPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPass)
)

# ---------------------------------------------------------------------------
Step 3 'Building frontend'
# ---------------------------------------------------------------------------
Push-Location "$root\frontend"
if (-not (Test-Path node_modules)) { & npm install | Out-Null }
& npm run build
if ($LASTEXITCODE -eq 0) { Ok 'frontend built to frontend\dist' } else { Fail 'frontend build failed'; Pop-Location; exit 1 }
Pop-Location

# ---------------------------------------------------------------------------
Step 4 'Smoke-testing backend locally'
# ---------------------------------------------------------------------------
Push-Location "$root\backend"
if (-not (Test-Path node_modules)) { & npm install | Out-Null }
$env:PORT = '5099'
$p = Start-Process -FilePath 'node' -ArgumentList 'server.js' -PassThru -RedirectStandardOutput 'tmp.out' -RedirectStandardError 'tmp.err'
Start-Sleep -Seconds 4
try {
  $r = Invoke-WebRequest "http://127.0.0.1:5099/api/health" -UseBasicParsing
  if ($r.StatusCode -eq 200) { Ok 'backend /api/health responds 200' }
} catch { Fail "backend did not start: $_" }
Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue
Remove-Item tmp.out, tmp.err -ErrorAction SilentlyContinue
Pop-Location

# ---------------------------------------------------------------------------
Step 5 'Importing schema into hosted MySQL'
# ---------------------------------------------------------------------------
if ($dbHost -and $dbUser -and $dbName) {
  $mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue
  if (-not $mysqlCmd) {
    Warn 'mysql client not installed - skipping automatic import.'
    Warn "Run this manually from a machine that has it:"
    Warn "  mysql -h $dbHost -P $dbPort -u $dbUser -p $dbName < backend/database/schema.hosted.sql"
  } else {
    Write-Host "    Importing backend\database\schema.hosted.sql ..." -ForegroundColor Gray
    $env:MYSQL_PWD = $dbPassPlain
    & mysql -h $dbHost -P $dbPort -u $dbUser $dbName -e "source $root\backend\database\schema.hosted.sql"
    if ($LASTEXITCODE -eq 0) { Ok 'schema imported' } else { Fail 'schema import failed - run it manually (see above)' }
    Remove-Item Env:\MYSQL_PWD
  }
} else {
  Warn 'No database details given - skipping schema import.'
}

# ---------------------------------------------------------------------------
Step 6 'Deploying frontend to Vercel'
# ---------------------------------------------------------------------------
if ($backendUrl) {
  Push-Location "$root\frontend"
  $apiUrl = "$($backendUrl.TrimEnd('/'))/api"
  Write-Host "    Setting VITE_API_URL=$apiUrl for production ..." -ForegroundColor Gray

  # Write a temporary .env.production so the build picks the value up locally.
  "VITE_API_URL=$apiUrl" | Out-File -FilePath '.env.production' -Encoding utf8

  & npx vercel env rm VITE_API_URL production --yes 2>$null | Out-Null
  $apiUrl | & npx vercel env add VITE_API_URL production

  & npx vercel --prod
  if ($LASTEXITCODE -eq 0) { Ok 'frontend deployed' } else { Fail 'vercel deploy failed - check that you are logged in (npx vercel login)' }
  Pop-Location
} else {
  Warn 'No backend URL given - skipping Vercel deploy.'
  Warn 'Re-run this script once Render gives you the backend URL.'
}

# ---------------------------------------------------------------------------
Write-Host "`n=== Done ===" -ForegroundColor White
Write-Host "Next: open your Render service and set CLIENT_URL to your Vercel URL," -ForegroundColor Gray
Write-Host "then open the site and submit the contact form to confirm the DB write." -ForegroundColor Gray

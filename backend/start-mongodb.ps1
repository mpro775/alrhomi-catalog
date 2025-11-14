# MongoDB Startup Script for Windows

Write-Host "Searching for MongoDB..." -ForegroundColor Cyan

# Search for mongod.exe in common locations
$mongodPaths = @(
    "$env:ProgramFiles\MongoDB\Server\*\bin\mongod.exe",
    "$env:ProgramFiles(x86)\MongoDB\Server\*\bin\mongod.exe",
    "C:\MongoDB\*\bin\mongod.exe",
    "$env:LOCALAPPDATA\Programs\MongoDB\*\bin\mongod.exe"
)

$mongodExe = $null
foreach ($path in $mongodPaths) {
    $found = Get-ChildItem -Path $path -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $mongodExe = $found.FullName
        Write-Host "Found MongoDB at: $mongodExe" -ForegroundColor Green
        break
    }
}

if (-not $mongodExe) {
    Write-Host "MongoDB not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions:" -ForegroundColor Yellow
    Write-Host "1. Install MongoDB from: https://www.mongodb.com/try/download/community"
    Write-Host "2. Or use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    Write-Host "3. Or use MongoDB Atlas (cloud)"
    exit 1
}

# Create data directories if they don't exist
$dbPath = "C:\data\mongodb\db"
$logPath = "C:\data\mongodb\log"

if (-not (Test-Path $dbPath)) {
    Write-Host "Creating database directory: $dbPath" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $dbPath -Force | Out-Null
}

if (-not (Test-Path $logPath)) {
    Write-Host "Creating log directory: $logPath" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $logPath -Force | Out-Null
}

# Check if MongoDB is already running
$existingProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($existingProcess) {
    Write-Host "MongoDB is already running (PID: $($existingProcess.Id))" -ForegroundColor Yellow
    Write-Host "MongoDB is ready at mongodb://localhost:27017" -ForegroundColor Green
    exit 0
}

# Try to start MongoDB as a service first
Write-Host "Attempting to start MongoDB as a service..." -ForegroundColor Cyan
try {
    $service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($service) {
        if ($service.Status -eq 'Running') {
            Write-Host "MongoDB is already running as a service" -ForegroundColor Green
            exit 0
        } else {
            Start-Service -Name "MongoDB" -ErrorAction Stop
            Write-Host "MongoDB service started successfully" -ForegroundColor Green
            exit 0
        }
    }
} catch {
    Write-Host "MongoDB is not installed as a service, starting manually" -ForegroundColor Yellow
}

# Start MongoDB manually
Write-Host "Starting MongoDB..." -ForegroundColor Cyan
Write-Host "   Database path: $dbPath" -ForegroundColor Gray
Write-Host "   Log path: $logPath\mongod.log" -ForegroundColor Gray
Write-Host ""

$logFile = Join-Path $logPath "mongod.log"

# Start MongoDB in background
Start-Process -FilePath $mongodExe -ArgumentList "--dbpath", "`"$dbPath`"", "--logpath", "`"$logFile`"", "--bind_ip", "127.0.0.1" -WindowStyle Hidden

# Wait a bit to verify startup
Start-Sleep -Seconds 3

# Verify MongoDB is running
$process = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($process) {
    Write-Host "MongoDB started successfully! (PID: $($process.Id))" -ForegroundColor Green
    Write-Host ""
    Write-Host "Connection info:" -ForegroundColor Cyan
    Write-Host "   URI: mongodb://localhost:27017" -ForegroundColor White
    Write-Host ""
    Write-Host "Note: MongoDB will stop when you close this window" -ForegroundColor Yellow
    Write-Host "   To stop manually, use: Stop-Process -Name mongod" -ForegroundColor Gray
} else {
    Write-Host "Failed to start MongoDB" -ForegroundColor Red
    Write-Host "   Check logs at: $logFile" -ForegroundColor Gray
    exit 1
}

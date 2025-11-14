# سكريبت لإيقاف MongoDB على Windows

Write-Host "🛑 إيقاف MongoDB..." -ForegroundColor Cyan

# محاولة إيقاف الخدمة أولاً
try {
    $service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($service -and $service.Status -eq 'Running') {
        Stop-Service -Name "MongoDB" -ErrorAction Stop
        Write-Host "✓ تم إيقاف MongoDB كخدمة" -ForegroundColor Green
        exit 0
    }
} catch {
    # تجاهل الخطأ إذا لم تكن الخدمة موجودة
}

# إيقاف العملية اليدوية
$processes = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($processes) {
    foreach ($process in $processes) {
        Stop-Process -Id $process.Id -Force
        Write-Host "✓ تم إيقاف MongoDB (PID: $($process.Id))" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️  MongoDB غير قيد التشغيل" -ForegroundColor Yellow
}


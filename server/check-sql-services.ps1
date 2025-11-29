# PowerShell script to check SQL Server services
Write-Host "Checking SQL Server Services..." -ForegroundColor Cyan
Write-Host ""

# Check SQL Server Browser
$browser = Get-Service | Where-Object {$_.Name -eq "SQLBrowser" -or $_.DisplayName -like "*SQL Server Browser*"}
if ($browser) {
    Write-Host "SQL Server Browser:" -ForegroundColor Yellow
    Write-Host "  Status: $($browser.Status)" -ForegroundColor $(if ($browser.Status -eq "Running") {"Green"} else {"Red"})
    Write-Host "  Name: $($browser.Name)"
    if ($browser.Status -ne "Running") {
        Write-Host ""
        Write-Host "⚠️  SQL Server Browser is NOT running!" -ForegroundColor Red
        Write-Host "   This is REQUIRED for named instances (SQLEXPRESS)" -ForegroundColor Yellow
        Write-Host ""
        $start = Read-Host "Would you like to start it now? (Y/N)"
        if ($start -eq "Y" -or $start -eq "y") {
            try {
                Start-Service $browser.Name
                Write-Host "✅ SQL Server Browser started successfully!" -ForegroundColor Green
            } catch {
                Write-Host "❌ Failed to start. You may need to run PowerShell as Administrator" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "✅ SQL Server Browser is running" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  SQL Server Browser service not found!" -ForegroundColor Red
}

Write-Host ""

# Check SQL Server (SQLEXPRESS)
$sqlServer = Get-Service | Where-Object {$_.Name -like "*MSSQL*SQLEXPRESS*" -or $_.DisplayName -like "*SQL Server (SQLEXPRESS)*"}
if ($sqlServer) {
    Write-Host "SQL Server (SQLEXPRESS):" -ForegroundColor Yellow
    Write-Host "  Status: $($sqlServer.Status)" -ForegroundColor $(if ($sqlServer.Status -eq "Running") {"Green"} else {"Red"})
    Write-Host "  Name: $($sqlServer.Name)"
    if ($sqlServer.Status -ne "Running") {
        Write-Host "⚠️  SQL Server (SQLEXPRESS) is NOT running!" -ForegroundColor Red
    } else {
        Write-Host "✅ SQL Server (SQLEXPRESS) is running" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  SQL Server (SQLEXPRESS) service not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


# Fix SQL Server Connection Timeout

## The Problem
You're getting `Failed to connect to localhost\SQLEXPRESS in 30000ms` even though SSMS connects fine.

## Most Common Solution: Start SQL Server Browser

**For named instances (like SQLEXPRESS), SQL Server Browser service MUST be running!**

### Quick Fix (PowerShell as Administrator):

```powershell
# Check if SQL Server Browser is running
Get-Service | Where-Object {$_.Name -eq "SQLBrowser"}

# Start SQL Server Browser
Start-Service SQLBrowser

# Set it to start automatically
Set-Service SQLBrowser -StartupType Automatic
```

### Or Use the Script:
1. Open PowerShell as Administrator
2. Navigate to `server` folder
3. Run: `.\check-sql-services.ps1`

### Manual Method:
1. Press `Win + R`, type `services.msc`, press Enter
2. Find **SQL Server Browser**
3. Right-click → **Start**
4. Right-click → **Properties** → Set to **Automatic**

## Alternative: Use Port Number Instead

If SQL Server Browser doesn't work, you can connect using the port number:

1. Find your SQL Server port:
   - Open SQL Server Configuration Manager
   - Go to **SQL Server Network Configuration** → **Protocols for SQLEXPRESS**
   - Right-click **TCP/IP** → **Properties** → **IP Addresses** tab
   - Scroll to **IPAll** section
   - Note the **TCP Dynamic Ports** or **TCP Port** number

2. Update `server/.env`:
   ```env
   DB_SERVER=localhost
   DB_PORT=1433
   # Remove DB_SERVER=localhost\SQLEXPRESS
   ```

## Enable TCP/IP Protocol

If TCP/IP is not enabled:

1. Open **SQL Server Configuration Manager**
2. **SQL Server Network Configuration** → **Protocols for SQLEXPRESS**
3. Right-click **TCP/IP** → **Enable**
4. **Restart SQL Server (SQLEXPRESS)** service

## Test Connection

After starting SQL Server Browser, restart your server:
```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
✅ Database tables initialized successfully
```

## Still Not Working?

Try these in order:

1. **Disable encryption temporarily** (to test):
   ```env
   DB_ENCRYPT=false
   ```

2. **Connect to master database first**:
   ```env
   DB_NAME=master
   ```

3. **Check Windows Firewall** - temporarily disable to test

4. **Run Node.js as Administrator** - sometimes helps with Windows Auth


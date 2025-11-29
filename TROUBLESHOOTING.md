# Troubleshooting SQL Server Connection Issues

## Connection Timeout Error

If you're getting `Failed to connect to localhost\SQLEXPRESS in 15000ms`, try these solutions:

### 1. Check if SQL Server is Running

**Windows:**
- Press `Win + R`, type `services.msc`, press Enter
- Look for **SQL Server (SQLEXPRESS)** or **SQL Server (MSSQLSERVER)**
- Make sure it's **Running**
- If not, right-click → **Start**

### 2. Check SQL Server Browser Service

**For Named Instances (like SQLEXPRESS), this is REQUIRED:**

- Open Services (`services.msc`)
- Find **SQL Server Browser**
- Make sure it's **Running**
- If not, right-click → **Start**
- Set it to **Automatic** startup type

### 3. Enable TCP/IP Protocol

1. Open **SQL Server Configuration Manager**
2. Go to **SQL Server Network Configuration** → **Protocols for SQLEXPRESS** (or your instance)
3. Right-click **TCP/IP** → **Enable**
4. Right-click **TCP/IP** → **Properties** → **IP Addresses** tab
5. Scroll to **IPAll** section
6. Make sure **TCP Dynamic Ports** is set (or **TCP Port** is set to 1433)
7. Click **OK**
8. **Restart SQL Server service**

### 4. Check Windows Firewall

- Windows Firewall might be blocking the connection
- Try temporarily disabling firewall to test
- Or add SQL Server to firewall exceptions

### 5. Try Different Connection Formats

Update your `server/.env` file with one of these:

**Option A: Using instance name in server (current)**
```env
DB_SERVER=localhost\SQLEXPRESS
USE_WINDOWS_AUTH=true
```

**Option B: Using separate instance name**
```env
DB_SERVER=localhost
DB_INSTANCE=SQLEXPRESS
USE_WINDOWS_AUTH=true
```

**Option C: Try with port (if you know it)**
```env
DB_SERVER=localhost
DB_INSTANCE=SQLEXPRESS
PORT=1433
USE_WINDOWS_AUTH=true
```

### 6. Test Connection with SQL Server Management Studio (SSMS)

1. Open SSMS
2. Try connecting to: `localhost\SQLEXPRESS` with Windows Authentication
3. If this works, the issue is with the Node.js connection
4. If this doesn't work, SQL Server configuration is the issue

### 7. Verify SQL Server Authentication Mode

Even for Windows Auth, make sure:
1. Open SSMS → Connect to server
2. Right-click server → **Properties** → **Security**
3. **Server authentication** should be: **SQL Server and Windows Authentication mode**
4. Click **OK** and **restart SQL Server**

### 8. Check SQL Server Error Logs

1. Open SSMS
2. Connect to your server
3. Go to **Management** → **SQL Server Logs**
4. Check for connection errors

### 9. Try Connecting to Master Database First

Temporarily change in `server/.env`:
```env
DB_NAME=master
```

This will help test if it's a database creation issue.

### 10. Alternative: Use SQL Server Authentication

If Windows Auth continues to fail, try SQL Auth:

```env
DB_SERVER=localhost\SQLEXPRESS
USE_WINDOWS_AUTH=false
DB_USER=sa
DB_PASSWORD=YourPassword
DB_NAME=FinancialTracker
```

## Quick Diagnostic Commands

Run these in PowerShell (as Administrator):

```powershell
# Check if SQL Server is running
Get-Service | Where-Object {$_.DisplayName -like "*SQL Server*"}

# Check SQL Server Browser
Get-Service | Where-Object {$_.DisplayName -like "*SQL Server Browser*"}

# Start SQL Server Browser (if not running)
Start-Service "SQLBrowser"
```

## Still Having Issues?

1. Make sure you're running the server from the correct directory: `g:\testLinkedIn\server`
2. Verify your `.env` file exists and has correct values
3. Check that Node.js can access SQL Server (try running as Administrator)
4. Verify your Windows user has permissions to access SQL Server


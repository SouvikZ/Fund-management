# Quick Setup Guide

## Step-by-Step Installation

### 1. Install Node.js
- Download from: https://nodejs.org/
- Install the LTS version
- Verify: Open terminal and run `node --version`

### 2. Install SQL Server
- Download SQL Server Express (Free): https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- During installation:
  - Choose "Basic" installation
  - Remember your `sa` password
  - Note the instance name (usually `SQLEXPRESS`)

### 3. Enable SQL Authentication
1. Open SQL Server Management Studio (SSMS)
2. Connect using Windows Authentication
3. Right-click server → Properties → Security
4. Select "SQL Server and Windows Authentication mode"
5. Click OK
6. Restart SQL Server service

### 4. Install Project Dependencies

Open terminal in the project folder and run:

```bash
# Install all dependencies
npm run install-all
```

### 5. Configure Database

1. Go to `server` folder
2. Create a file named `.env` (copy from `.env.example` if it exists)
3. Add your database settings:

```env
DB_SERVER=localhost
DB_USER=sa
DB_PASSWORD=YourSQLServerPassword
DB_NAME=FinancialTracker
DB_ENCRYPT=false
PORT=5000
```

**Important**: 
- Replace `YourSQLServerPassword` with the password you set during SQL Server installation
- If using a named instance (like SQLEXPRESS), use: `DB_SERVER=localhost\\SQLEXPRESS`

### 6. Start the Application

```bash
# From the root folder
npm run dev
```

This starts both:
- Backend server: http://localhost:5000
- Frontend app: http://localhost:3000

### 7. Open in Browser

Navigate to: **http://localhost:3000**

## Common Issues

### "Cannot connect to SQL Server"
- Make sure SQL Server is running (check Windows Services)
- Verify server name in `.env` file
- Try: `localhost\\SQLEXPRESS` if using named instance

### "Login failed"
- Double-check username and password in `.env`
- Make sure SQL Authentication is enabled
- Test connection in SSMS first

### Port already in use
- Change `PORT=5000` to `PORT=5001` in `server/.env`
- Or stop the application using port 5000

### Module not found
- Run: `npm run install-all` again
- Make sure you're in the project root folder

## Need Help?

Check the main README.md for detailed troubleshooting.


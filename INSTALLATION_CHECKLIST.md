# Installation Checklist

Use this checklist to ensure everything is set up correctly:

## Pre-Installation
- [ ] Node.js installed (v14+)
- [ ] SQL Server installed and running
- [ ] SQL Server Management Studio (SSMS) installed (optional but recommended)

## Project Setup
- [ ] Cloned/downloaded project files
- [ ] Opened terminal in project root folder
- [ ] Ran `npm run install-all` successfully
- [ ] All dependencies installed without errors

## Database Configuration
- [ ] SQL Server Authentication enabled
- [ ] Created `.env` file in `server` folder
- [ ] Added correct database credentials:
  - [ ] DB_SERVER (localhost or localhost\\SQLEXPRESS)
  - [ ] DB_USER (usually 'sa')
  - [ ] DB_PASSWORD (your SQL Server password)
  - [ ] DB_NAME (FinancialTracker)
  - [ ] DB_ENCRYPT (false for local)
  - [ ] PORT (5000)

## Testing Connection
- [ ] Can connect to SQL Server using SSMS
- [ ] Backend server starts without errors
- [ ] Database tables created automatically
- [ ] Frontend starts without errors

## Running Application
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can access application in browser
- [ ] Dashboard loads correctly
- [ ] Can add a test transaction

## Verification
- [ ] Transaction appears in Transactions page
- [ ] Dashboard shows updated balance
- [ ] Calendar shows transaction indicator
- [ ] Can create a reminder

If all items are checked, your installation is complete! 🎉


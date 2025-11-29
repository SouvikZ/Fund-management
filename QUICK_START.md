# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Database
1. Create `server/.env` file (copy from `server/env.template`)
2. Update with your SQL Server credentials:
   ```env
   DB_SERVER=localhost
   DB_USER=sa
   DB_PASSWORD=YourPassword
   DB_NAME=FinancialTracker
   DB_ENCRYPT=false
   PORT=5000
   ```

### 3. Start Application
```bash
npm run dev
```

### 4. Open Browser
Navigate to: **http://localhost:3000**

## 📋 What You Need First

- ✅ Node.js installed
- ✅ SQL Server installed and running
- ✅ SQL Server password (set during installation)

## 🎯 First Steps After Launch

1. **Add a Transaction**: Click "+ Add" on Transactions page
2. **View Dashboard**: See your financial summary
3. **Check Calendar**: Click on dates to see transactions
4. **Add Reminder**: Create payment reminders

## 💡 Tips

- All amounts are in **INR (₹)**
- Database tables are created automatically
- Use "Cash", "Card", "UPI", or "Bank Transfer" as payment methods
- Filter transactions by type and method

## ❓ Need Help?

- Check `README.md` for detailed instructions
- Check `SETUP_GUIDE.md` for step-by-step setup
- Check `INSTALLATION_CHECKLIST.md` to verify installation


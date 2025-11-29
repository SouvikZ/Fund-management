# Financial Tracker - Local Ledger / Finance

A comprehensive financial tracking application built with Node.js, React.js, and Microsoft SQL Server (MSSQL). Track your income, expenses, view transactions by calendar, and manage reminders.

## Features

- ✅ **Dashboard**: View total balance, cash balance, card balance, and financial summary
- ✅ **Transactions**: Add, update, and delete income/expense transactions
- ✅ **Calendar View**: Month-wise calendar with day-wise transaction details
- ✅ **Reminders**: Manage upcoming payments and events
- ✅ **Currency**: All amounts displayed in INR (₹)

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Database**: Microsoft SQL Server (MSSQL)
- **Styling**: CSS3

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **Microsoft SQL Server** - [Download SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
3. **SQL Server Management Studio (SSMS)** - [Download](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) (Optional, but recommended)

## Installation Guide

### Step 1: Install Node.js

1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
2. Verify installation by opening a terminal/command prompt and running:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install and Setup Microsoft SQL Server

1. **Download SQL Server Express** (Free version):
   - Visit: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   - Download "Express" edition
   - Run the installer

2. **During Installation**:
   - Choose "Basic" installation type (easiest for beginners)
   - Note down the SQL Server instance name (usually `SQLEXPRESS` or `MSSQLSERVER`)
   - Set a strong password for the `sa` (system administrator) account
   - Complete the installation

3. **Enable SQL Server Authentication**:
   - Open SQL Server Management Studio (SSMS)
   - Connect to your server using Windows Authentication
   - Right-click on the server → Properties → Security
   - Select "SQL Server and Windows Authentication mode"
   - Click OK and restart SQL Server service

4. **Create Database** (Optional - will be created automatically):
   ```sql
   CREATE DATABASE FinancialTracker;
   ```

### Step 3: Clone/Download the Project

If you have the project files, navigate to the project directory:
```bash
cd testLinkedIn
```

### Step 4: Install Dependencies

1. **Install root dependencies**:
   ```bash
   npm install
   ```

2. **Install server dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Install client dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

   **OR use the convenience script**:
   ```bash
   npm run install-all
   ```

### Step 5: Configure Database Connection

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Create `.env` file**:
   - Copy the example file or create a new `.env` file
   - Add your database credentials:

   ```env
   # Database Configuration
   DB_SERVER=localhost
   DB_USER=sa
   DB_PASSWORD=YourPassword123
   DB_NAME=FinancialTracker
   DB_ENCRYPT=false

   # Server Configuration
   PORT=5000
   ```

   **Important**: Replace the following with your actual values:
   - `DB_SERVER`: Usually `localhost` or `localhost\\SQLEXPRESS` (if using named instance)
   - `DB_USER`: Usually `sa` (system administrator)
   - `DB_PASSWORD`: The password you set during SQL Server installation
   - `DB_NAME`: `FinancialTracker` (or your preferred database name)

3. **For Named Instances**:
   If your SQL Server instance is named (e.g., `SQLEXPRESS`), use:
   ```env
   DB_SERVER=localhost\\SQLEXPRESS
   ```
   Or:
   ```env
   DB_SERVER=localhost\SQLEXPRESS
   ```

### Step 6: Start the Application

1. **Start both server and client** (from root directory):
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend React app on `http://localhost:3000`

2. **Or start them separately**:

   **Terminal 1 - Backend**:
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend**:
   ```bash
   cd client
   npm start
   ```

### Step 7: Access the Application

- Open your browser and navigate to: `http://localhost:3000`
- The application should load with the dashboard

## Database Tables

The application will automatically create the following tables on first run:

1. **Transactions**: Stores all income and expense transactions
2. **Reminders**: Stores upcoming payment reminders and events

## Troubleshooting

### Database Connection Issues

1. **"Cannot connect to SQL Server"**:
   - Verify SQL Server is running (Services → SQL Server)
   - Check if the server name is correct in `.env`
   - For named instances, use `localhost\\INSTANCENAME`

2. **"Login failed for user"**:
   - Verify username and password in `.env`
   - Ensure SQL Server Authentication is enabled
   - Try connecting with SSMS first to verify credentials

3. **"Database does not exist"**:
   - The app will create the database automatically
   - Or create it manually: `CREATE DATABASE FinancialTracker;`

### Port Already in Use

If port 5000 or 3000 is already in use:
- Change `PORT` in `server/.env` to a different port (e.g., 5001)
- Update `client/package.json` proxy setting if needed

### Module Not Found Errors

Run the installation commands again:
```bash
npm run install-all
```

## Project Structure

```
financial-tracker/
├── server/                 # Backend (Node.js/Express)
│   ├── config/
│   │   └── database.js     # Database configuration
│   ├── routes/
│   │   ├── transactions.js
│   │   ├── dashboard.js
│   │   ├── calendar.js
│   │   └── reminders.js
│   ├── index.js           # Server entry point
│   └── package.json
├── client/                # Frontend (React)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.js
│   └── package.json
└── package.json           # Root package.json
```

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Dashboard
- `GET /api/dashboard/summary` - Get financial summary
- `GET /api/dashboard/balance` - Get balance information
- `GET /api/dashboard/recent` - Get recent transactions

### Calendar
- `GET /api/calendar/month/:year/:month` - Get month transactions
- `GET /api/calendar/date/:date` - Get date transactions

### Reminders
- `GET /api/reminders` - Get all reminders
- `POST /api/reminders` - Create reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

## Usage

1. **Add Transaction**: Click "+ Add" on Transactions page
2. **View Calendar**: Navigate to Calendar page and click on any date
3. **Add Reminder**: Click "+ Add" on Reminders page
4. **View Dashboard**: See financial summary and balances

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify database connection settings
3. Ensure all dependencies are installed
4. Check that SQL Server is running

## License

This project is open source and available for personal use.


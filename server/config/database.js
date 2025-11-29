const sql = require('mssql');

// Build config based on authentication method
const buildConfig = () => {
  // Parse server name - handle both "localhost" and "localhost\INSTANCE" formats
  const serverConfig = (process.env.DB_SERVER || 'localhost').split('\\');
  const serverName = serverConfig[0];
  const instanceName = serverConfig[1] || process.env.DB_INSTANCE;

  const config = {
    server: serverName,
    database: process.env.DB_NAME || 'FinancialTracker',
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true', // Default to true (matches SSMS connection)
      trustServerCertificate: true, // Required when encrypt=true for local dev
      enableArithAbort: true,
      connectTimeout: 30000, // 30 seconds
      requestTimeout: 30000 // 30 seconds
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };

  // Add instance name if specified (for named instances like SQLEXPRESS)
  // IMPORTANT: SQL Server Browser service must be running for named instances
  if (instanceName) {
    config.options.instanceName = instanceName;
    console.log(`   Instance: ${instanceName} (SQL Server Browser must be running)`);
  }
  
  // Try port if specified (alternative to instance name)
  if (process.env.DB_PORT) {
    config.port = parseInt(process.env.DB_PORT);
    delete config.options.instanceName; // Don't use both port and instance
  }

  // Use Windows Authentication if USE_WINDOWS_AUTH is true or no user/password provided
  const useWindowsAuth = process.env.USE_WINDOWS_AUTH === 'true' || 
                         (!process.env.DB_USER && !process.env.DB_PASSWORD);
  
  if (!useWindowsAuth) {
    // SQL Server Authentication - only add user/password if not using Windows Auth
    config.user = process.env.DB_USER || 'sa';
    config.password = process.env.DB_PASSWORD || 'YourPassword123';
  }
  // For Windows Authentication, don't provide user/password - mssql will use Windows Auth automatically

  // Log connection details (without password)
  console.log('🔌 Connecting to SQL Server...');
  console.log(`   Server: ${serverName}${instanceName ? '\\' + instanceName : ''}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   Authentication: ${useWindowsAuth ? 'Windows Authentication' : 'SQL Server Authentication'}`);

  return config;
};

const config = buildConfig();

let pool = null;

const connect = async () => {
  try {
    if (pool) {
      return pool;
    }
    pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database not connected. Call connect() first.');
  }
  return pool;
};

const initializeTables = async () => {
  try {
    const pool = await connect();
    
    // Create Transactions table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Transactions]') AND type in (N'U'))
      BEGIN
        CREATE TABLE [dbo].[Transactions] (
          [id] INT IDENTITY(1,1) PRIMARY KEY,
          [amount] DECIMAL(18,2) NOT NULL,
          [category] NVARCHAR(100) NOT NULL,
          [description] NVARCHAR(500) NULL,
          [type] NVARCHAR(20) NOT NULL CHECK ([type] IN ('Income', 'Expense')),
          [method] NVARCHAR(50) NOT NULL CHECK ([method] IN ('Cash', 'Card', 'UPI', 'Bank Transfer')),
          [date] DATE NOT NULL,
          [createdAt] DATETIME2 DEFAULT GETDATE(),
          [updatedAt] DATETIME2 DEFAULT GETDATE()
        )
      END
    `);

    // Create Reminders table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Reminders]') AND type in (N'U'))
      BEGIN
        CREATE TABLE [dbo].[Reminders] (
          [id] INT IDENTITY(1,1) PRIMARY KEY,
          [title] NVARCHAR(200) NOT NULL,
          [description] NVARCHAR(500) NULL,
          [amount] DECIMAL(18,2) NULL,
          [dueDate] DATE NOT NULL,
          [type] NVARCHAR(20) NOT NULL CHECK ([type] IN ('Payment', 'Event', 'Other')),
          [isCompleted] BIT DEFAULT 0,
          [createdAt] DATETIME2 DEFAULT GETDATE(),
          [updatedAt] DATETIME2 DEFAULT GETDATE()
        )
      END
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (err) {
    console.error('❌ Error initializing tables:', err);
  }
};

module.exports = {
  connect,
  getPool,
  initializeTables
};


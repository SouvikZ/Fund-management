// Quick connection test script
const sql = require('mssql');
require('dotenv').config();

async function testConnection() {
  console.log('Testing SQL Server connection...\n');
  
  // Test 1: With instance name in options
  console.log('Test 1: Using instanceName in options');
  try {
    const config1 = {
      server: 'localhost',
      database: 'FinancialTracker',
      options: {
        instanceName: 'SQLEXPRESS',
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 10000
      }
    };
    const pool1 = await sql.connect(config1);
    console.log('✅ SUCCESS with instanceName in options!\n');
    await pool1.close();
    return;
  } catch (err) {
    console.log('❌ Failed:', err.message, '\n');
  }

  // Test 2: Without encryption
  console.log('Test 2: Without encryption');
  try {
    const config2 = {
      server: 'localhost',
      database: 'FinancialTracker',
      options: {
        instanceName: 'SQLEXPRESS',
        encrypt: false,
        enableArithAbort: true,
        connectTimeout: 10000
      }
    };
    const pool2 = await sql.connect(config2);
    console.log('✅ SUCCESS without encryption!\n');
    await pool2.close();
    return;
  } catch (err) {
    console.log('❌ Failed:', err.message, '\n');
  }

  // Test 3: Using port (common default for SQLEXPRESS)
  console.log('Test 3: Using port 1433');
  try {
    const config3 = {
      server: 'localhost',
      port: 1433,
      database: 'FinancialTracker',
      options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectTimeout: 10000
      }
    };
    const pool3 = await sql.connect(config3);
    console.log('✅ SUCCESS with port 1433!\n');
    await pool3.close();
    return;
  } catch (err) {
    console.log('❌ Failed:', err.message, '\n');
  }

  // Test 4: Try master database first
  console.log('Test 4: Connecting to master database');
  try {
    const config4 = {
      server: 'localhost',
      database: 'master',
      options: {
        instanceName: 'SQLEXPRESS',
        encrypt: false,
        enableArithAbort: true,
        connectTimeout: 10000
      }
    };
    const pool4 = await sql.connect(config4);
    console.log('✅ SUCCESS connecting to master!\n');
    await pool4.close();
    return;
  } catch (err) {
    console.log('❌ Failed:', err.message, '\n');
  }

  console.log('All connection tests failed. Please check:');
  console.log('1. SQL Server Browser service is running');
  console.log('2. TCP/IP is enabled in SQL Server Configuration Manager');
  console.log('3. SQL Server (SQLEXPRESS) service is running');
}

testConnection().catch(console.error);


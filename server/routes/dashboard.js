const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get dashboard summary
router.get('/summary', async (req, res) => {
  try {
    const { period = 'month' } = req.query; // 'week' or 'month'
    const pool = db.getPool();
    const sql = require('mssql');
    
    let dateFilter = '';
    if (period === 'week') {
      dateFilter = "AND date >= DATEADD(day, -7, GETDATE())";
    } else {
      dateFilter = "AND MONTH(date) = MONTH(GETDATE()) AND YEAR(date) = YEAR(GETDATE())";
    }
    
    const result = await pool.request().query(`
      SELECT 
        SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as totalExpense,
        COUNT(*) as transactionCount
      FROM Transactions
      WHERE 1=1 ${dateFilter}
    `);
    
    const summary = result.recordset[0];
    const netAmount = (summary.totalIncome || 0) - (summary.totalExpense || 0);
    
    res.json({
      totalIncome: summary.totalIncome || 0,
      totalExpense: summary.totalExpense || 0,
      netAmount: netAmount,
      transactionCount: summary.transactionCount || 0
    });
  } catch (err) {
    console.error('Error fetching dashboard summary:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

// Get balance summary
router.get('/balance', async (req, res) => {
  try {
    const pool = db.getPool();
    
    const result = await pool.request().query(`
      SELECT 
        SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) - 
        SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as totalBalance,
        SUM(CASE WHEN type = 'Income' AND method = 'Cash' THEN amount ELSE 0 END) - 
        SUM(CASE WHEN type = 'Expense' AND method = 'Cash' THEN amount ELSE 0 END) as cashBalance,
        SUM(CASE WHEN type = 'Income' AND method IN ('Card', 'UPI', 'Bank Transfer') THEN amount ELSE 0 END) - 
        SUM(CASE WHEN type = 'Expense' AND method IN ('Card', 'UPI', 'Bank Transfer') THEN amount ELSE 0 END) as cardBalance
      FROM Transactions
    `);
    
    const balance = result.recordset[0];
    res.json({
      totalBalance: balance.totalBalance || 0,
      cashBalance: balance.cashBalance || 0,
      cardBalance: balance.cardBalance || 0
    });
  } catch (err) {
    console.error('Error fetching balance:', err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Get recent transactions
router.get('/recent', async (req, res) => {
  try {
    const pool = db.getPool();
    const result = await pool.request().query(`
      SELECT TOP 5 *
      FROM Transactions
      ORDER BY date DESC, createdAt DESC
    `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching recent transactions:', err);
    res.status(500).json({ error: 'Failed to fetch recent transactions' });
  }
});

module.exports = router;


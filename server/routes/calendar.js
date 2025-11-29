const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get transactions for a specific month
router.get('/month/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const pool = db.getPool();
    const sql = require('mssql');
    
    const result = await pool.request()
      .input('year', sql.Int, parseInt(year))
      .input('month', sql.Int, parseInt(month))
      .query(`
        SELECT 
          CAST(date AS DATE) as date,
          COUNT(*) as transactionCount,
          SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END) as income,
          SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END) as expense
        FROM Transactions
        WHERE YEAR(date) = @year AND MONTH(date) = @month
        GROUP BY CAST(date AS DATE)
        ORDER BY date
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching calendar data:', err);
    res.status(500).json({ error: 'Failed to fetch calendar data' });
  }
});

// Get transactions for a specific date
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const pool = db.getPool();
    const sql = require('mssql');
    
    const result = await pool.request()
      .input('date', sql.Date, date)
      .query(`
        SELECT *
        FROM Transactions
        WHERE CAST(date AS DATE) = @date
        ORDER BY createdAt DESC
      `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching date transactions:', err);
    res.status(500).json({ error: 'Failed to fetch date transactions' });
  }
});

module.exports = router;


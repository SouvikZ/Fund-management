const express = require('express');
const router = express.Router();
const db = require('../config/database');
const sql = require('mssql');

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const pool = db.getPool();
    const { type, method, startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM Transactions WHERE 1=1';
    const request = pool.request();
    
    if (type && type !== 'All Types') {
      query += ' AND type = @type';
      request.input('type', sql.NVarChar, type);
    }
    
    if (method && method !== 'All Methods') {
      query += ' AND method = @method';
      request.input('method', sql.NVarChar, method);
    }
    
    if (startDate) {
      query += ' AND date >= @startDate';
      request.input('startDate', sql.Date, startDate);
    }
    
    if (endDate) {
      query += ' AND date <= @endDate';
      request.input('endDate', sql.Date, endDate);
    }
    
    query += ' ORDER BY date DESC, createdAt DESC';
    
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = db.getPool();
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Transactions WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching transaction:', err);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Create transaction
router.post('/', async (req, res) => {
  try {
    const { amount, category, description, type, method, date } = req.body;
    
    if (!amount || !category || !type || !method || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const pool = db.getPool();
    
    const result = await pool.request()
      .input('amount', sql.Decimal(18, 2), parseFloat(amount))
      .input('category', sql.NVarChar, category)
      .input('description', sql.NVarChar, description || null)
      .input('type', sql.NVarChar, type)
      .input('method', sql.NVarChar, method)
      .input('date', sql.Date, date)
      .query(`
        INSERT INTO Transactions (amount, category, description, type, method, date)
        OUTPUT INSERTED.*
        VALUES (@amount, @category, @description, @type, @method, @date)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { amount, category, description, type, method, date } = req.body;
    const pool = db.getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('amount', sql.Decimal(18, 2), parseFloat(amount))
      .input('category', sql.NVarChar, category)
      .input('description', sql.NVarChar, description || null)
      .input('type', sql.NVarChar, type)
      .input('method', sql.NVarChar, method)
      .input('date', sql.Date, date)
      .query(`
        UPDATE Transactions
        SET amount = @amount,
            category = @category,
            description = @description,
            type = @type,
            method = @method,
            date = @date,
            updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error updating transaction:', err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const pool = db.getPool();
    
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Transactions WHERE id = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;


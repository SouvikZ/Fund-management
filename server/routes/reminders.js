const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all reminders
router.get('/', async (req, res) => {
  try {
    const pool = db.getPool();
    const { upcoming } = req.query;
    
    let query = 'SELECT * FROM Reminders WHERE 1=1';
    if (upcoming === 'true') {
      query += ' AND dueDate >= CAST(GETDATE() AS DATE) AND isCompleted = 0';
    }
    query += ' ORDER BY dueDate ASC';
    
    const result = await pool.request().query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching reminders:', err);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// Get reminder by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = db.getPool();
    const sql = require('mssql');
    
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM Reminders WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching reminder:', err);
    res.status(500).json({ error: 'Failed to fetch reminder' });
  }
});

// Create reminder
router.post('/', async (req, res) => {
  try {
    const { title, description, amount, dueDate, type } = req.body;
    
    if (!title || !dueDate || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const pool = db.getPool();
    const sql = require('mssql');
    
    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description || null)
      .input('amount', sql.Decimal(18, 2), amount ? parseFloat(amount) : null)
      .input('dueDate', sql.Date, dueDate)
      .input('type', sql.NVarChar, type)
      .query(`
        INSERT INTO Reminders (title, description, amount, dueDate, type)
        OUTPUT INSERTED.*
        VALUES (@title, @description, @amount, @dueDate, @type)
      `);
    
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error('Error creating reminder:', err);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

// Update reminder
router.put('/:id', async (req, res) => {
  try {
    const { title, description, amount, dueDate, type, isCompleted } = req.body;
    const pool = db.getPool();
    const sql = require('mssql');
    
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description || null)
      .input('amount', sql.Decimal(18, 2), amount ? parseFloat(amount) : null)
      .input('dueDate', sql.Date, dueDate)
      .input('type', sql.NVarChar, type)
      .input('isCompleted', sql.Bit, isCompleted || false)
      .query(`
        UPDATE Reminders
        SET title = @title,
            description = @description,
            amount = @amount,
            dueDate = @dueDate,
            type = @type,
            isCompleted = @isCompleted,
            updatedAt = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error updating reminder:', err);
    res.status(500).json({ error: 'Failed to update reminder' });
  }
});

// Delete reminder
router.delete('/:id', async (req, res) => {
  try {
    const pool = db.getPool();
    const sql = require('mssql');
    
    const result = await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Reminders WHERE id = @id');
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json({ message: 'Reminder deleted successfully' });
  } catch (err) {
    console.error('Error deleting reminder:', err);
    res.status(500).json({ error: 'Failed to delete reminder' });
  }
});

module.exports = router;


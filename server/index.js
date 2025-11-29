const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./config/database');
const transactionRoutes = require('./routes/transactions');
const reminderRoutes = require('./routes/reminders');
const dashboardRoutes = require('./routes/dashboard');
const calendarRoutes = require('./routes/calendar');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test database connection
db.connect()
  .then(() => {
    console.log('✅ Database connected successfully');
    // Initialize database tables
    db.initializeTables();
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/calendar', calendarRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


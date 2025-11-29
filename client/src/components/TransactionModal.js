import React, { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import './TransactionModal.css';

const TransactionModal = ({ transaction, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    type: 'Expense',
    method: 'Cash',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Salary',
    'Freelance',
    'Investment',
    'Other',
  ];

  useEffect(() => {
    if (transaction) {
      const date = new Date(transaction.date);
      setFormData({
        amount: transaction.amount || '',
        category: transaction.category || '',
        description: transaction.description || '',
        type: transaction.type || 'Expense',
        method: transaction.method || 'Cash',
        date: date.toISOString().split('T')[0],
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (transaction) {
        await transactionsAPI.update(transaction.id, formData);
      } else {
        await transactionsAPI.create(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{transaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Method</label>
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add notes..."
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {transaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;


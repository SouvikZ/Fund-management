import React, { useState, useEffect } from 'react';
import { remindersAPI } from '../services/api';
import './ReminderModal.css';

const ReminderModal = ({ reminder, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    type: 'Payment',
  });

  useEffect(() => {
    if (reminder) {
      const date = new Date(reminder.dueDate);
      setFormData({
        title: reminder.title || '',
        description: reminder.description || '',
        amount: reminder.amount || '',
        dueDate: date.toISOString().split('T')[0],
        type: reminder.type || 'Payment',
      });
    }
  }, [reminder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (reminder) {
        await remindersAPI.update(reminder.id, formData);
      } else {
        await remindersAPI.create(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Failed to save reminder');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{reminder ? 'Edit Reminder' : 'Add Reminder'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="reminder-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., Rent Payment, Birthday Party"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="Payment">Payment</option>
                <option value="Event">Event</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Amount (Optional)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="form-input"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add notes..."
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {reminder ? 'Update Reminder' : 'Add Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;


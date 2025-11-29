import React, { useState, useEffect } from 'react';
import { remindersAPI } from '../services/api';
import ReminderModal from '../components/ReminderModal';
import './Reminders.css';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await remindersAPI.getAll('true');
      setReminders(response.data);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingReminder(null);
    setShowModal(true);
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await remindersAPI.delete(id);
        fetchReminders();
      } catch (error) {
        console.error('Error deleting reminder:', error);
        alert('Failed to delete reminder');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingReminder(null);
  };

  const handleSave = () => {
    fetchReminders();
    handleModalClose();
  };

  const formatCurrency = (amount) => {
    return amount ? `₹${parseFloat(amount).toFixed(2)}` : '';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const upcomingReminders = reminders.filter(r => !r.isCompleted);

  return (
    <div className="reminders-page">
      <div className="reminders-header">
        <div>
          <h1>Reminders</h1>
          <p className="subtitle">Manage upcoming payments and events</p>
        </div>
        <button className="add-btn" onClick={handleAdd}>
          + Add
        </button>
      </div>

      <div className="reminders-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : upcomingReminders.length === 0 ? (
          <div className="empty-state">No upcoming reminders</div>
        ) : (
          <div className="reminders-list">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="reminder-card">
                <div className="reminder-info">
                  <div className="reminder-title">{reminder.title}</div>
                  {reminder.description && (
                    <div className="reminder-description">{reminder.description}</div>
                  )}
                  <div className="reminder-meta">
                    <span className="reminder-date">Due: {formatDate(reminder.dueDate)}</span>
                    {reminder.amount && (
                      <span className="reminder-amount">
                        {formatCurrency(reminder.amount)}
                      </span>
                    )}
                    <span className={`reminder-type ${reminder.type.toLowerCase()}`}>
                      {reminder.type}
                    </span>
                  </div>
                </div>
                <div className="reminder-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(reminder)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(reminder.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ReminderModal
          reminder={editingReminder}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Reminders;


import React, { useState, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import TransactionModal from '../components/TransactionModal';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: 'All Types',
    method: 'All Methods',
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getAll(filters);
      const data = response.data;
      setTransactions(data);
      
      // Calculate summary
      const income = data
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      const expense = data
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
      setSummary({
        totalIncome: income,
        totalExpense: expense,
        netAmount: income - expense,
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionsAPI.delete(id);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTransaction(null);
  };

  const handleSave = () => {
    fetchTransactions();
    handleModalClose();
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <div>
          <h1>Transactions</h1>
          <p className="subtitle">Manage your income and expenses</p>
        </div>
        <button className="add-btn" onClick={handleAdd}>
          + Add
        </button>
      </div>

      <div className="summary-cards">
        <div className="summary-card income">
          <div className="summary-label">Total Income</div>
          <div className="summary-value income-value">
            {formatCurrency(summary.totalIncome)}
          </div>
        </div>
        
        <div className="summary-card expense">
          <div className="summary-label">Total Expenses</div>
          <div className="summary-value expense-value">
            {formatCurrency(summary.totalExpense)}
          </div>
        </div>
        
        <div className="summary-card net">
          <div className="summary-label">Net Amount</div>
          <div className="summary-value net-value">
            {formatCurrency(summary.netAmount)}
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-label">
          <span>🔽</span> Filters:
        </div>
        <select
          className="filter-select"
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option>All Types</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
        <select
          className="filter-select"
          value={filters.method}
          onChange={(e) => setFilters({ ...filters, method: e.target.value })}
        >
          <option>All Methods</option>
          <option>Cash</option>
          <option>Card</option>
          <option>UPI</option>
          <option>Bank Transfer</option>
        </select>
      </div>

      <div className="transactions-table-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">No transactions found</div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.method}</td>
                  <td className={transaction.type.toLowerCase()}>
                    {transaction.type === 'Income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(transaction)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Transactions;


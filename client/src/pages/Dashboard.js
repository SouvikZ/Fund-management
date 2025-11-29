import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netAmount: 0,
    transactionCount: 0,
  });
  const [balance, setBalance] = useState({
    totalBalance: 0,
    cashBalance: 0,
    cardBalance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, balanceRes, recentRes] = await Promise.all([
        dashboardAPI.getSummary(period),
        dashboardAPI.getBalance(),
        dashboardAPI.getRecent(),
      ]);
      
      setSummary(summaryRes.data);
      setBalance(balanceRes.data);
      setRecentTransactions(recentRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back, shm</p>
        </div>
      </div>

      <div className="balance-cards">
        <div className="balance-card total-balance">
          <div className="balance-card-header">
            <span>Total Balance</span>
            <button className="icon-btn">□</button>
          </div>
          <div className="balance-amount">{formatCurrency(balance.totalBalance)}</div>
        </div>
        
        <div className="balance-card cash-balance">
          <div className="balance-card-header">
            <span>Cash Balance</span>
          </div>
          <div className="balance-amount">{formatCurrency(balance.cashBalance)}</div>
        </div>
        
        <div className="balance-card card-balance">
          <div className="balance-card-header">
            <span>Card Balance</span>
          </div>
          <div className="balance-amount">{formatCurrency(balance.cardBalance)}</div>
        </div>
      </div>

      <div className="financial-summary">
        <div className="summary-header">
          <h2>Financial Summary</h2>
          <div className="period-toggle">
            <button
              className={period === 'week' ? 'active' : ''}
              onClick={() => setPeriod('week')}
            >
              This Week
            </button>
            <button
              className={period === 'month' ? 'active' : ''}
              onClick={() => setPeriod('month')}
            >
              This Month
            </button>
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card income">
            <div className="summary-label">Income</div>
            <div className="summary-value income-value">
              {formatCurrency(summary.totalIncome)}
            </div>
          </div>
          
          <div className="summary-card expense">
            <div className="summary-label">Expenses</div>
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
          
          <div className="summary-card transactions">
            <div className="summary-label">Transactions</div>
            <div className="summary-value transaction-count">
              {summary.transactionCount}
            </div>
          </div>
        </div>
      </div>

      <div className="recent-transactions">
        <h2>Recent Transactions</h2>
        {recentTransactions.length === 0 ? (
          <div className="empty-state">No transactions yet</div>
        ) : (
          <div className="transactions-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-category">{transaction.category}</div>
                  <div className="transaction-date">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type.toLowerCase()}`}>
                  {transaction.type === 'Income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;


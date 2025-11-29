import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaDollarSign, 
  FaCalendarAlt, 
  FaBell,
  FaSignOutAlt 
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="avatar">S</div>
        <div className="user-info">
          <div className="username">souvik rendi</div>
          <div className="app-name">Rendi Management System</div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'nav-item active' : 'nav-item'}
        >
          <FaHome className="nav-icon" />
          <span>Dashboard</span>
        </Link>
        <Link 
          to="/transactions" 
          className={location.pathname === '/transactions' ? 'nav-item active' : 'nav-item'}
        >
          <FaDollarSign className="nav-icon" />
          <span>Transactions</span>
        </Link>
        <Link 
          to="/calendar" 
          className={location.pathname === '/calendar' ? 'nav-item active' : 'nav-item'}
        >
          <FaCalendarAlt className="nav-icon" />
          <span>Calendar</span>
        </Link>
        <Link 
          to="/reminders" 
          className={location.pathname === '/reminders' ? 'nav-item active' : 'nav-item'}
        >
          <FaBell className="nav-icon" />
          <span>Reminders</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;


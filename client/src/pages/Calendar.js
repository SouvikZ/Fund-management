import React, { useState, useEffect } from 'react';
import { calendarAPI } from '../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateTransactions, setDateTransactions] = useState([]);
  const [showDateModal, setShowDateModal] = useState(false);

  useEffect(() => {
    fetchMonthData();
  }, [currentDate]);

  const fetchMonthData = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await calendarAPI.getMonthData(year, month);
      const data = {};
      response.data.forEach((item) => {
        data[item.date] = item;
      });
      setMonthData(data);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };

  const handleDateClick = async (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedDate(date);
    try {
      const response = await calendarAPI.getDateTransactions(dateStr);
      setDateTransactions(response.data);
      setShowDateModal(true);
    } catch (error) {
      console.error('Error fetching date transactions:', error);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week for the month
  const firstDayOfWeek = monthStart.getDay();
  const daysBeforeMonth = Array.from({ length: firstDayOfWeek }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(date.getDate() - firstDayOfWeek + i);
    return date;
  });

  // Get days after month to fill the calendar
  const daysAfterMonth = Array.from({ length: 42 - daysInMonth.length - firstDayOfWeek }, (_, i) => {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  const allDays = [...daysBeforeMonth, ...daysInMonth, ...daysAfterMonth];

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  const isSelected = (date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>Calendar</h1>
        <p className="subtitle">View transactions by date</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-nav">
          <button className="nav-btn" onClick={handlePrevMonth}>←</button>
          <h2 className="month-year">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <button className="nav-btn" onClick={handleNextMonth}>→</button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-days">
            {allDays.map((date, index) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const dayData = monthData[dateStr];
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isCurrentDay = isToday(date);
              const isSelectedDay = isSelected(date);

              return (
                <div
                  key={index}
                  className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isCurrentDay ? 'today' : ''} ${isSelectedDay ? 'selected' : ''}`}
                  onClick={() => isCurrentMonth && handleDateClick(date)}
                >
                  <div className="day-number">{format(date, 'd')}</div>
                  {dayData && dayData.transactionCount > 0 && (
                    <div className="day-indicator"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showDateModal && (
        <div className="modal-overlay" onClick={() => setShowDateModal(false)}>
          <div className="date-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transactions for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}</h2>
              <button className="close-btn" onClick={() => setShowDateModal(false)}>×</button>
            </div>
            <div className="date-transactions">
              {dateTransactions.length === 0 ? (
                <div className="empty-state">No transactions on this date</div>
              ) : (
                <div className="transactions-list">
                  {dateTransactions.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-info">
                        <div className="transaction-category">{transaction.category}</div>
                        <div className="transaction-method">{transaction.method}</div>
                        {transaction.description && (
                          <div className="transaction-description">{transaction.description}</div>
                        )}
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
        </div>
      )}
    </div>
  );
};

export default Calendar;


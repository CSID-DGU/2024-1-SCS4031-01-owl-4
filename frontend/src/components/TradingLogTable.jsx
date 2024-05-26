
import { useState } from 'react';

const TradingLogTable = ({ trading_logs }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const sortedLogs = [...trading_logs].sort((a, b) => {
    if (sortConfig.key === null) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === 'date') {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      if (sortConfig.direction === 'ascending') {
        return aDate - bDate;
      } else {
        return bDate - aDate;
      }
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;

    return `${period} ${adjustedHours}:${minutes}:${seconds}`;
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 cursor-pointer" onClick={() => requestSort('type')}>Type</th>
          <th className="py-2 cursor-pointer" onClick={() => requestSort('date')}>Date</th>
          <th className="py-2">Time</th>
          <th className="py-2 cursor-pointer" onClick={() => requestSort('coin_price')}>Coin Price</th>
          <th className="py-2 cursor-pointer" onClick={() => requestSort('rate')}>Rate</th>
        </tr>
      </thead>
      <tbody>
        {sortedLogs.map((log, index) => {
          const dateObj = new Date(log.date);
          const date = dateObj.toLocaleDateString();
          const time = formatTime(dateObj);
          return (
            <tr key={index}>
              <td className="py-2 px-4 border">{log.type}</td>
              <td className="py-2 px-4 border">{date}</td>
              <td className="py-2 px-4 border">{time}</td>
              <td className="py-2 px-4 border">{log.coin_price}</td>
              <td className="py-2 px-4 border">{log.rate !== undefined ? `${log.rate}%` : 'N/A'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TradingLogTable;


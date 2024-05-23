
const TradingLogTable = ({trading_logs}) => {
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12; // 0을 12로 변환

    return `${period} ${adjustedHours}:${minutes}:${seconds}`;
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Type</th>
          <th className="py-2">Date</th>
          <th className="py-2">Time</th>
          <th className="py-2">Coin Price</th>
          <th className="py-2">Rate</th>
        </tr>
      </thead>
      <tbody>
        {trading_logs.map((log, index) => {
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


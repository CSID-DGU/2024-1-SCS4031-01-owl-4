
const PerformanceTable = ({performance, trading}) => {
  return (
    <table className="w-full bg-white">
          <tbody>
            <tr>
              <td className="py-1 px-2 border font-semibold">Total Rate</td>
              <td className="py-1 px-2 border">{performance.total_rate}%</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold">Win Rate</td>
              <td className="py-1 px-2 border">{performance.win_rate}%</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold">Loss Rate</td>
              <td className="py-1 px-2 border">{performance.loss_rate}%</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold">Win/Loss Ratio</td>
              <td className="py-1 px-2 border">{performance.win_loss_ratio}</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold">Average Positive Trade</td>
              <td className="py-1 px-2 border">{trading.average_positive_trade}%</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold">Average Negative Trade</td>
              <td className="py-1 px-2 border">{trading.average_negative_trade}%</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold">High Loss Value Strategy</td>
              <td className="py-1 px-2 border">{performance.high_loss_value_strategy}</td>
            </tr>
          </tbody>
        </table>
  )
}

export default PerformanceTable

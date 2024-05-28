
const PerformanceTable = ({performance, trading}) => {
  return (
    <table className="w-full bg-white">
          <tbody>
            <tr>
              <td className="py-1 px-2 border font-semibold text-sm">Total Rate</td>
              <td className="py-1 px-2 border text-sm">{performance.total_rate}%</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold text-sm">Win Rate</td>
              <td className="py-1 px-2 border text-sm">{performance.win_rate}%</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold text-sm">Loss Rate</td>
              <td className="py-1 px-2 border text-sm">{performance.loss_rate}%</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold text-sm">Win/Loss Ratio</td>
              <td className="py-1 px-2 border text-sm">{performance.win_loss_ratio}</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold text-sm">Average Positive Trade</td>
              <td className="py-1 px-2 border text-sm">{trading.average_positive_trade}%</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold text-sm">Average Negative Trade</td>
              <td className="py-1 px-2 border text-sm">{trading.average_negative_trade}%</td>
            </tr>
            <tr>
              <td className="py-1 px-2 border font-semibold text-sm">High Loss Value Strategy</td>
              <td className="py-1 px-2 border text-sm">{performance.high_loss_value_strategy}</td>
            </tr>
          </tbody>
        </table>
  )
}

export default PerformanceTable

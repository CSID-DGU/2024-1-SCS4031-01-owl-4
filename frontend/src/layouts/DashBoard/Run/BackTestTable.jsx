import PerformanceTable from "../../../components/PerformanceTable"
import TradingLogTable from "../../../components/TradingLogTable"
import TradingTable from "../../../components/TradingTable"


const BackTestTable = ({trading, performance, trading_logs}) => {
  return (
    <div className="flex flex-col overflow-x-hidden">
        <div className="w-full flex justify-center px-5 py-1">
            <div className="w-full p-5 rounded-xl shadow-xl border">
                <PerformanceTable performance = {performance} trading = {trading} />
            </div>
        </div>
        <div className="w-full flex justify-center px-5 py-1">
            <div className="w-full p-5 rounded-xl shadow-xl border">
                <TradingLogTable trading_logs={trading_logs} />
            </div>
        </div>
    </div>
  )
}

export default BackTestTable


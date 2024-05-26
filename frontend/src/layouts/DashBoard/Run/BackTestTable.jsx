import PerformanceTable from "../../../components/PerformanceTable"
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import WinLossChart from "../../../components/WinLossChart";

const BackTestTable = ({trading, performance}) => {

    const calProfit = (trading.final_capital)-(trading.initial_capital)

    const updownProfitResult = calProfit >= 0 ? "text-green-500": "text-red-400 rotate-180"
    const ColorProfitResult = calProfit >= 0 ? "text-green-500" : "text-red-600"

  return (
    <div className="flex flex-col">
        <div className="h-1/3">
            <div className="flex flex-col items-center mt-3">
                <div className="flex">
                    <div className="w-[175px] h-[125px] border shadow-xl rounded-xl p-3">
                        <span className="block font-bold text-lg">{calProfit >= 0 ? "Proceeds":"Loss"} </span>
                        <span className={`block mt-2 text-xl font-bold ${ColorProfitResult}`}>{calProfit >= 0 ? "+":""}$  {calProfit}</span>
                        <span className="flex items-center mt-2 text-base justify-end text-slate-400">
                        {performance.total_rate}%
                        <FaRegArrowAltCircleUp className={`ml-3 ${updownProfitResult}`}/>
                        </span>
                    </div>
                    <div className="w-[175px] h-[125px] border shadow-xl rounded-xl p-3 ml-2">
                        <span className="block font-bold text-lg">Trade Period</span>
                        <span className="block mt-2 text-xl font-bold">{trading.average_trade_period}
                            <span className="ml-3">Days</span>
                        </span>
                    </div>
                </div>
                <div className="flex mt-5">
                    <div className="w-[175px] h-[125px] border shadow-xl rounded-xl p-3">
                        <span className="block font-bold text-lg">Max Proceeds</span>
                        <span className="block mt-1 font-bold text-xl text-green-400">$  +{performance.high_value_strategy}</span>
                    </div>
                    <div className="w-[175px] h-[125px] border shadow-xl rounded-xl p-3 ml-2">
                        <span className="block font-bold text-lg">Min Proceeds</span>
                        <span className="block mt-1 font-bold text-xl text-green-400">$  +{performance.low_value_strategy}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-full h-1/3 flex justify-center mt-3">
            <div className="w-full p-5 rounded-xl shadow-xl border">
                <PerformanceTable performance = {performance} trading = {trading} />
            </div>
        </div>
        <div className="w-full h-[232px] p-3 mt-3 border rounded-xl shadow-lg">
                <WinLossChart performance = {performance}/>
        </div>
    </div>
  )
}

export default BackTestTable
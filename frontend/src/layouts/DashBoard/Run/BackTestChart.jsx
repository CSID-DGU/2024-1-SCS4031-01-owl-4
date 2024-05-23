import { FaRegArrowAltCircleUp } from "react-icons/fa";

const BackTestChart = ({trading, performance, trading_logs}) => {

  const calProfit = (trading.final_capital)-(trading.initial_capital)

  const updownProfitResult = calProfit >= 0 ? "text-green-400": "text-red-400"
  return (
    <div className="grow-[1] flex flex-col">
      <div className="flex justify-evenly items-center mt-3">
        <div className="w-[175px] h-[100px] border shadow-xl rounded-xl p-3">
          <span className="block font-bold text-xl">{calProfit >= 0 ? "Proceeds":"Loss"} </span>
          <span className="block mt-1">{calProfit >= 0 ? "+":""}{calProfit}</span>
          <span className="flex items-center mt-1">
          {performance.total_rate}%
          <FaRegArrowAltCircleUp className={`ml-3 ${updownProfitResult}`}/>
          </span>
        </div>
        <div className="w-[175px] h-[100px] border shadow-xl rounded-xl p-3">
          <span className="block font-bold text-xl">Trade Period</span>
          <span className="mt-1">
            {trading.average_trade_period}
            <span className="ml-3">days</span>
            </span>
        </div>
        <div className="w-[175px] h-[100px] border shadow-xl rounded-xl p-3">
        <span className="block font-bold text-xl">Max Proceeds</span>
        <span className="block mt-1">+{performance.high_value_strategy}</span>
        </div>
        <div className="w-[175px] h-[100px] border shadow-xl rounded-xl p-3">
        <span className="block font-bold text-xl">Min Proceeds</span>
        <span className="block mt-1">+{performance.low_value_strategy}</span>
        </div>
        {/* <div className="px-10 py-3 rounded-xl border shadow-xl">
          <span className="block font-bold text-xl">{optProfitResult ? "Proceeds":"Loss"} </span>
          <span className="block mt-1">{optProfitResult ? "+":""}{calProfit}</span>
          <span className="flex items-center mt-1">
          {performance.total_rate}%
          <FaRegArrowAltCircleUp className="ml-3 text-green-400" />
          </span>
        </div>
        <div className="px-10 py-7 rounded-xl border shadow-xl">
          <span className="block font-bold text-xl">Trade Period</span>
          <span className="mt-1">{trading.average_trade_period}    days</span>
        </div>
        <div className="bg-blue-400 p-10 rounded-xl">
          Positive Trade
        </div>
        <div className="bg-blue-400 p-10 rounded-xl">
          Negative Trade
        </div> */}
      </div>
      <div className="grow-[1] w-full bg-red-400"></div>
      <div className="grow-[1] w-full bg-lime-400"></div>
    </div>


  )
}

export default BackTestChart
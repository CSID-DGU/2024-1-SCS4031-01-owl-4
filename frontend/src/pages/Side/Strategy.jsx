import StrategyChart from "../../layouts/DashBoard/Strategy/StrategyChart"
import StrategySetting from "../../layouts/DashBoard/Strategy/StrategySetting"

const Strategy = () => {

  return (
    <div className="w-full flex bg-slate-200">
      <section className=" w-2/3 p-10">
        <div className="w-full h-full bg-white rounded-xl">
          <StrategyChart />
        </div>
      </section>
      <section className=" w-1/3 flex flex-col p-[40px_40px_40px_10px] relative">
        <StrategySetting />
      </section>
    </div>
  )
}

export default Strategy
import Loading from "../../components/Loading"
import StrategyChart from "../../layouts/DashBoard/Strategy/StrategyChart"
import StrategySetting from "../../layouts/DashBoard/Strategy/StrategySetting"
import useResponseStore from '../../utils/useResponseStore'

const Strategy = () => {

  const {loading} = useResponseStore();

  return (
    <div className="w-full flex bg-slate-200">
      {loading ? 
        <Loading />
        :
        <div className="w-full h-full flex">
          <section className="w-2/3 p-10">
            <div className="w-full h-full bg-white rounded-xl">
              <StrategyChart />
            </div>
          </section>
          <section className="w-1/3 flex flex-col p-[40px_40px_40px_10px] relative">
            <StrategySetting />
          </section>
        </div>
      }
      
    </div>
  )
}

export default Strategy
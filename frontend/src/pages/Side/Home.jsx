import Calculater from "../../components/Calculater";
import Card from "../../components/Card";
import Coins from "../../components/Coins";
import HomeCandleChart from "../../components/HomeCandleChart";
import HomeVolumeChart from "../../components/HomeVolumeChart";
import WatchList from "../../components/WatchList";
import PortfolioInfo from "../../components/PortfolioInfo";
import useResponseStore from "../../utils/useResponseStore";
import NewLoading from "../../components/NewLoading";
import { useMemo } from "react";
import HomeCapitalChart from "../../components/HomeCapitalChart";
import HomeMarketPriceByBuySell from "../../components/HomeMarketPriceByBuySell";

const Home = () => {
  const { isAPISuccessFirst } = useResponseStore();

  const candleChart = useMemo(() => {
    return <HomeCandleChart />
  }, []);

  const barShapeChart = useMemo(() => {
    return <HomeVolumeChart />
  }, []);

  return (
    <div className="w-full h-full bg-slate-200 p-10 flex">
      <div className="w-full h-full bg-white rounded-xl shadow-lg border flex relative">
        <div className="w-[25%] h-full flex flex-col">
          <div className="w-full h-[30%] p-3">
            {isAPISuccessFirst ? <Card /> : <NewLoading />}
          </div>
          <div className="w-full h-[70%] p-3">
            {isAPISuccessFirst ? <Coins /> : <NewLoading />}
          </div>
        </div>
        <div className="w-[50%] h-full flex flex-col">
          <div className="w-full h-[30%] p-3">
            <WatchList />
          </div>
          <div className="w-full h-[40%] p-3 relative">
            {candleChart}
          </div>
          <div className="w-full h-[30%] flex">
            <div className="w-[45%] h-full p-3">
              <Calculater />
            </div>
            <div className="w-[55%] h-full p-3">
              {barShapeChart}
            </div>
          </div>
        </div>
        <div className="w-[25%] h-full flex flex-col">
          <div className="w-full h-1/3 p-3">
            <PortfolioInfo />
          </div>
          <div className="w-full h-1/3 p-3">
            <HomeCapitalChart />
          </div>
          <div className="w-full h-1/3 p-3">
          <HomeMarketPriceByBuySell />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

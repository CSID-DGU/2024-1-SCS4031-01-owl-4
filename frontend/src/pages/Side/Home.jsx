import Calculater from "../../components/Calculater";
import Card from "../../components/Card";
import Coins from "../../components/Coins";
import HomeCandleChart from "../../components/HomeCandleChart";
import HomeVolumeChart from "../../components/HomeVolumeChart";
import WatchList from "../../components/WatchList";
import PortfolioInfo from "../../components/PortfolioInfo";

const Home = () => {
  return (
    <div className="w-full h-full bg-slate-200 p-10 flex">
      <div className="w-full h-full bg-white rounded-xl shadow-lg border flex relative">
        <div className="w-[25%] h-full flex flex-col">
          <div className="w-full h-[30%] p-3">
            <Card />
          </div>
          <div className="w-full h-[70%] p-3">
            <Coins />
          </div>
        </div>
        <div className="w-[50%] h-full flex flex-col">
          <div className="w-full h-[30%] p-3">
            <WatchList />
          </div>
          <div className="w-full h-[40%] p-3">
            <HomeCandleChart />
          </div>
          <div className="w-full h-[30%] flex">
            <div className="w-1/2 h-full p-3">
              <Calculater />
            </div>
            <div className="w-1/2 h-full p-3">
              <HomeVolumeChart />
            </div>
          </div>
        </div>
        <div className="w-[25%] h-full flex flex-col">
          <div className="w-full h-1/3 p-3">
            <PortfolioInfo />
          </div>
          <div className="w-full h-1/3 p-3">
            <div className="w-full h-full p-3 rounded-lg shadow-lg border bg-white">
              Portfolio Chart 1
            </div>
          </div>
          <div className="w-full h-1/3 p-3">
            <div className="w-full h-full p-3 rounded-lg shadow-lg border bg-white">
              Portfolio Chart 2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

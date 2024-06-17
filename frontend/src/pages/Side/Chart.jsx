import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import useResponseStore from "../../utils/useResponseStore";
import { MdExplore } from "react-icons/md";
import Loading from "../../components/Loading";
import { getImageURL } from "../../utils/image-utils";
import CandleSelector from "../../components/CandleSelector";
import MainCandleChart from "../../components/MainCandleChart";
import MarketModal from "../../components/MarketModal";

function formatDate(date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}-${hours}-${minutes}`;
}

function settingVolumeData(ohlcvData) {
  let num = 0;
  return ohlcvData.map((data) => [num++, data[4], data[0] > data[1] ? -1 : 1]);
}

function processChartData(data) {
  const ohlcv = data.map((item) => [
    item.opening_price,
    item.close_price,
    item.low_price,
    item.high_price,
    item.volume,
  ]);

  const dates = data.map((item) => item.date);

  return { ohlcv, dates };
}

const Chart = () => {
  const [ohlcvData, setOhlcvData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const [open, setOpen] = useState(false);
  const [plusColor, setPlusColor] = useState("#ff0000");
  const [minusColor, setMinusColor] = useState("#0800ff");
  const [start, setStart] = useState(98);
  const [end, setEnd] = useState(100);
  const [candle, setCandle] = useState("days");
  const [coin, setCoin] = useState("비트코인");
  const { coin_name, market_name } = useResponseStore();

  let prevStart = 0;
  let prevEnd = 0;

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["candle_Infos"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8081/api/v1/charts?coin_name=" +
          coin_name +
          "&candle_name=" +
          candle
      );
      return response.data.payload;
    },
    refetchInterval: 600000, // 1분
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // 캐시를 영구적으로 사용
    throwOnError: false, // 에러를 throw하지 않음
  });

  useEffect(() => {
    if (candle === "weeks" || coin !== coin_name) {
      refetch();
      setStart(80);
      setEnd(100);
      setCoin(coin_name);
    } else if (candle === "days" || coin !== coin_name) {
      refetch();
      setStart(90);
      setEnd(100);
      setCoin(coin_name);
    } else if (candle === "months" || coin !== coin_name) {
      refetch();
      setStart(10);
      setEnd(100);
      setCoin(coin_name);
    } else if (candle === "minutes240" || coin !== coin_name) {
      refetch();
      setStart(90);
      setEnd(100);
      setCoin(coin_name);
    } else if (candle === "minutes60" || coin !== coin_name) {
      refetch();
      setStart(97);
      setEnd(100);
      setCoin(coin_name);
    } else if (candle === "minutes30" || coin !== coin_name) {
      refetch();
      setStart(77);
      setEnd(100);
      setCoin(coin_name);
    } else if (candle === "minutes15" || coin !== coin_name) {
      refetch();
      setStart(97);
      setEnd(100);
      setCoin(coin_name);
    } else if (candle === "minutes10" || coin !== coin_name) {
      refetch();
      setStart(98);
      setEnd(100);
      setCoin(coin_name);
    } else if (candle === "minutes5" || coin !== coin_name) {
      refetch();
      setStart(99);
      setEnd(100);
      setCoin(coin_name);
    } else if (candle === "minutes3" || coin !== coin_name) {
      refetch();
      setStart(99);
      setEnd(100);
      setCoin(coin_name);
    } else if (candle === "minutes1" || coin !== coin_name) {
      refetch();
      setStart(99);
      setEnd(100);
      setCoin(coin_name);
    }
  }, [setStart, candle, isLoading, refetch, coin, coin_name]);

  const chartData = useMemo(() => {
    if (!isLoading && data) {
      const { ohlcv, dates } = processChartData(data);
      return {
        ohlcv,
        volume: settingVolumeData(ohlcv),
        dates: dates.map((date) => formatDate(new Date(date))),
      };
    }
    return { ohlcv: [], volume: [], dates: [] };
  }, [data, isLoading]);

  useEffect(() => {
    if (chartData.ohlcv.length > 0) {
      setOhlcvData(chartData.ohlcv);
      setVolumeData(chartData.volume);
      setDateData(chartData.dates);
    }
  }, [chartData]);

  useEffect(() => {
    if (!isLoading && data) {
      const { ohlcv, dates } = processChartData(data);
      setOhlcvData(ohlcv);
      setVolumeData(settingVolumeData(ohlcv));
      setDateData(dates.map((date) => formatDate(new Date(date))));
    }
  }, [data, isLoading]);

  return (
    <div className="w-full bg-slate-200 p-10">
      <div className="w-full h-full bg-white rounded-xl shadow-lg border flex flex-col relative">
        <div className="w-[35px] h-[55px] group rounded-lg absolute left-3 top-[9.5%] p-1 border shadow-lg z-10 bg-white flex flex-col items-center">
          <input
            type="color"
            value={plusColor}
            className="w-[30px] h-1/2 outline-none bg-white cursor-pointer"
            onChange={(event) => setPlusColor(event.target.value)}
          />
          <input
            type="color"
            value={minusColor}
            className="w-[30px] h-1/2 outline-none bg-white cursor-pointer"
            onChange={(event) => setMinusColor(event.target.value)}
          />
        </div>
        <div className="w-full h-[60px] absolute top-0 left-0 bg-white z-10 shadow-lg border rounded-xl flex">
          <div className="w-[65%] h-full flex items-center pl-4 py-3">
            <img
              src={getImageURL(market_name.split("-")[1])}
              alt="CoinLogo"
              className="size-[40px] select-none"
            />
            <h1 className="text-xl font-bold text-slate-700 ml-3 select-none">
              {coin_name}
            </h1>
            <span className="ml-3 select-none">{market_name}</span>
            <CandleSelector
              setCandle={setCandle}
              prevEnd={prevEnd}
              prevStart={prevStart}
              setStart={setStart}
              setEnd={setEnd}
            />
            <div className={`w-[300px] h-full ml-5`}>
              <div
                className={`group flex items-center w-fit p-1 relative h-full cursor-pointer rounded-lg bg-violet-500  hover:bg-violet-600`}
                onClick={() => {
                  setOpen(true);
                  if (prevStart && prevEnd) {
                    setStart(prevStart);
                    setEnd(prevEnd);
                  }
                }}
              >
                <MdExplore className="rounded-full text-white animate-spin ml-3 size-[30px]" />
                <div className="w-full h-full text-white font-bold text-base ml-3 mr-3 select-none">
                  Coin Browse
                </div>
              </div>
            </div>
          </div>
        </div>
        {isRefetching ? (
          <Loading />
        ) : (
          <MainCandleChart
            ohlcvData={ohlcvData}
            volumeData={volumeData}
            start={start}
            end={end}
            dateData={dateData}
            prevStart={prevStart}
            prevEnd={prevEnd}
            plusColor={plusColor}
            minusColor={minusColor}
          />
        )}
      </div>
      <MarketModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Chart;

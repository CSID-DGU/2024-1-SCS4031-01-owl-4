import ReactEcharts from "echarts-for-react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import NewLoading from "./NewLoading";
import BTC from '../assets/coinLogoImages/BTC.png'

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

function separateDate(dateString) {
  const [year, month, day, hours, minutes] = dateString.split("-");
  return { year, month, day, hours, minutes };
}

let prevDate = {
  year: "2019",
  month: "01",
  day: "01",
  hours: "00",
  minutes: "00",
};

const HomeCandleChart = () => {
  const [ohlcvData, setOhlcvData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [dateData, setDateData] = useState([]);

  const { data, isLoading} = useQuery({
    queryKey: ["bitcoin_info"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8081/api/v1/dashboard/bit-charts/minutes1"
      );
      return response.data.payload;
    },
    refetchInterval: 20000,
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground:true,
    throwOnError: false,
  });


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
  

  const option = {
    xAxis: {
      type: "category",
      data: dateData,
      boundaryGap: false,
      offset: 10,
      axisLine: {
        show: false,
        onZero: false,
      },
      axisTick: {
        show: false,
        interval: 7,
      },
      axisLabel: {
        fontWeight: "bold",
        color: "#000",
        formatter: function (value) {
          const date = separateDate(value);
          const minuteDiff = Math.abs(
            parseInt(date.minutes) - parseInt(prevDate.minutes)
          );
          const hourDiff =
            Math.abs(parseInt(date.hours) - parseInt(prevDate.hours)) * 60 +
            minuteDiff;
          if (date.year !== prevDate.year) {
            prevDate = date;
            return date.year + "년";
          } else if (date.month !== prevDate.month) {
            prevDate = date;
            return date.month + "월";
          } else if (date.day !== prevDate.day) {
            prevDate = date;
            return date.day + "일";
          } else if (hourDiff >= 240) {
            // 4시간 간격
            prevDate = date;
            return date.hours + "시";
          } else if (hourDiff >= 60) {
            // 1시간 간격
            prevDate = date;
            return date.hours + "시";
          } else if (minuteDiff >= 30) {
            // 30분 간격
            prevDate = date;
            return date.minutes + "분";
          } else if (minuteDiff >= 15) {
            // 15분 간격
            prevDate = date;
            return date.minutes + "분";
          } else if (minuteDiff >= 10) {
            // 10분 간격
            prevDate = date;
            return date.minutes + "분";
          } else if (minuteDiff >= 5) {
            // 5분 간격
            prevDate = date;
            return date.minutes + "분";
          } else if (minuteDiff >= 3) {
            // 3분 간격
            prevDate = date;
            return date.minutes + "분";
          } else if (minuteDiff >= 1) {
            // 1분 간격
            prevDate = date;
            return date.minutes + "분";
          }
        },
      },
      splitLine: {
        show: true,
      },
      axisPointer: {
        label: {
          formatter: function (value) {
            const data = separateDate(value.value);
            const { hours, minutes } = data;
            return `${hours}:${minutes}`;
          },
        },
      },
    },
    yAxis: {
      scale: true,
      type: "value",
      position: "left",
      offset: 10,
      axisLine: {
        show: false,
        onZero: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show:false,
        fontWeight: "bold",
        color: "#000",
        formatter: function (value) {
          return value;
        },
      },
      axisPointer: {
        triggerEmphasis: false,
        label: {
          show: false
        }
      },
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 93,
        end: 100,
      },
    ],
    tooltip: {
      show: true,
      position: ["49.5%", "7%"],
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      extraCssText: "background: transparent; border-style: none; box-shadow: none;",
      formatter: function (parmas) {
        return `<div style='width: 350px; display: flex; justify-content: space-between; align-items: center;'>
            <div style='width: 10px; height: 10px; border-radius: 9999px; background-color: ${
              parmas[0].componentSubType === "candlestick"
                ? parmas[0].color
                : parmas[1].color
            };'></div>
            <div>
              <span style='font-weight: 700'>O</span>
              <span style='color: ${
                parmas[0].componentSubType === "candlestick"
                  ? parmas[0].color
                  : parmas[1].color
              }; font-size:12px;'>${
          parmas[0].componentSubType === "candlestick"
            ? parmas[0].data[1]
            : parmas[1].data[1]
        }</span>
            </div>
            <div>
              <span style='font-weight: 700'>H</span>
              <span style='color: ${
                parmas[0].componentSubType === "candlestick"
                  ? parmas[0].color
                  : parmas[1].color
              }; font-size:12px;'>${
          parmas[0].componentSubType === "candlestick"
            ? parmas[0].data[4]
            : parmas[1].data[4]
        }</span>
            </div>
            <div>
              <span style='font-weight: 700'>L</span>
              <span style='color: ${
                parmas[0].componentSubType === "candlestick"
                  ? parmas[0].color
                  : parmas[1].color
              }; font-size:12px;'>${
          parmas[0].componentSubType === "candlestick"
            ? parmas[0].data[3]
            : parmas[1].data[3]
        }</span>
            </div>
            <div>
              <span style='font-weight: 700'>C</span>
              <span style='color: ${
                parmas[0].componentSubType === "candlestick"
                  ? parmas[0].color
                  : parmas[1].color
              }; font-size:12px;'>${
          parmas[0].componentSubType === "candlestick"
            ? parmas[0].data[2]
            : parmas[1].data[2]
        }</span>
            </div>
            ${
              parmas[0].componentSubType === "candlestick"
                ? ""
                : `<div><span style='font-weight: 700'>V </span><span style='color : ${parmas[1].color}'>${parmas[0].data[1]}</span></div>`
            }
          </div>`;
      },
    },
    axisPointer: {
      show: true,
      label: {
        show: true,
      },
    },
    series: [
      {
        type: "candlestick",
        name: "Day",
        data: ohlcvData,
        itemStyle: {
          color: "#089981",
          color0: "#F23645",
          borderColor: "#089981",
          borderColor0: "#F23645",
        },
      },
    ],
  };

  if(isLoading) {
    return <NewLoading />
  }
  return (
    <div className="w-full h-full relative border bg-white shadow-xl rounded-xl overflow-hidden select-none">
    <ReactEcharts
      option={option}
      style={{ width: "120%", height: "116%" }}
      className="absolute -top-[8%] -left-[12%]"
    />
    <div className="absolute top-1 left-1 z-10 flex items-center">
      <img src={BTC} alt="Coin-Logo" className=" size-[30px]" />
      <h1 className="font-bold text-slate-700 tracking-widest text-2xl ml-2">BTC</h1>
    </div>
    
    </div>
  );
};

export default HomeCandleChart;


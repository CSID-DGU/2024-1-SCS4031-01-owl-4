import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import BTC from "../assets/coinLogoImages/BTC.png";
import NewLoading from "./NewLoading";

let prevDate = {
  year: "2019",
  month: "01",
  day: "01",
  hours: "00",
  minutes: "00",
};

function formatDate(date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}-${hours}-${minutes}`;
}

function separateDate(dateString) {
  const [year, month, day, hours, minutes] = dateString.split("-");
  return { year, month, day, hours, minutes };
}

function settingVolumeData(ohlcvData) {
  let num = 0;
  return ohlcvData.map((data) => [
    num++,
    data.volume,
    data.open > data.close ? -1 : 1,
  ]);
}

function processChartData(data) {
  const ohlcv = data.map((item) => [
    item.open,
    item.close,
    item.low,
    item.high,
    item.volume,
  ]);

  const dates = data.map((item) => item.date);

  return { ohlcv, dates };
}

const HomeVolumeChart = () => {
  const [ohlcvData, setOhlcvData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [dateData, setDateData] = useState([]);

  const {
    data: volume = [],
    isLoading: volumeLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["bitcoin_volume_info"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8081/api/v1/dashboard/bit-charts/minutes1/volumes"
      );
      return response.data.payload;
    },
    refetchInterval: 65000,
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    throwOnError: false,
  });

  const { data: ohlcData = [], isLoading: ohlcLoading } = useQuery({
    queryKey: ["bitcoin_ohlc_info"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8081/api/v1/dashboard/bit-charts/minutes1"
      );
      return response.data.payload;
    },
    refetchInterval: 30000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    throwOnError: false,
    enabled: isSuccess,
  });

  useEffect(() => {
    if (ohlcData.length > 0 && volume.length > 0) {
      const combinedData = ohlcData
        .map((ohlcItem) => {
          const volumeItem = volume.find((item) => item.date === ohlcItem.date);
          if (!volumeItem) {
            console.log(`Volume data not found for date: ${ohlcItem.date}`);
            return null; // 또는 기본값 처리
          }
          const date = new Date(ohlcItem.date); // 날짜 객체로 변환
          return {
            date: date,
            open: ohlcItem.opening_price,
            high: ohlcItem.high_price,
            low: ohlcItem.low_price,
            close: ohlcItem.close_price,
            volume: volumeItem.volume,
          };
        })
        .filter((item) => item !== null); // null인 항목 제거

      const { dates } = processChartData(combinedData);

      setOhlcvData(combinedData);
      setDateData(dates.map((date) => formatDate(date)));
    }
  }, [ohlcData, volume]);

  useEffect(() => {
    if (ohlcvData.length > 0) {
      setVolumeData(settingVolumeData(ohlcvData));
    }
  }, [ohlcvData]);

  const option = {
    xAxis: [
      {
        type: "category",
        data: dateData,
        boundaryGap: false,
        axisLine: {
          show: false,
          onZero: false,
        },
        axisTick: {
          show: false,
          interval: 7,
        },
        axisLabel: {
          show: true,
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
          show: false,
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
    ],
    yAxis: [
      {
        scale: true,
        type: "value",
        position: "left",
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: true,
        },
        axisPointer: {
          triggerEmphasis: false,
          label: {
            show: false,
          },
        },
      },
    ],
    tooltip: {
      show: true,
      showContent: true,
      position: ["60%", "8%"],
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      extraCssText:
        "background: transparent; border-style: none; box-shadow: none;",
      formatter: function (parmas) {
        return `<div style='width: 150px; display: flex; justify-content: center; align-items: center;'>
        <div style='width: 10px; height: 10px; border-radius: 9999px; background-color: ${
          parmas[0].color
        };'></div>
        <div>
              <span style='font-weight: 700; margin-left:5px'>Volume: </span>
              <span style='color: ${parmas[0].color}; font-size:12px;'>${parmas[0].data[1]}</span>
            </div>
        </div>`;
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 97,
        end: 100,
      },
    ],
    axisPointer: {
      show: true,
      label: {
        show: true,
      },
    },
    series: [
      {
        type: "bar",
        name: "Volume",
        data: volumeData,
        itemStyle: {
          color: function (params) {
            return params.data[2] === 1 ? "#089981" : "#F23645";
          },
        },
      },
    ],
  };

  return (
    <>
      {volumeLoading || ohlcLoading ? (
        <NewLoading />
      ) : (
        <div className="w-full h-full bg-white rounded-lg border shadow-lg p-3 relative overflow-hidden">
          <ReactEcharts
            option={option}
            style={{ width: "120%", height: "130%" }}
            className="absolute bottom-[-19%] -right-3"
          />
          <img src={BTC} alt="Coin-Logo" className="absolute top-1 left-1 size-[30px] select-none" />
          <div className="absolute top-1 left-10 font-bold text-slate-700 text-xl tracking-widest select-none">BTC</div>
        </div>
      )}
    </>
  );
};

export default HomeVolumeChart;
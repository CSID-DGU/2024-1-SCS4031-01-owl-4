import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { modifiedData } from "../../../utils/changeDate";
import { calculateMA } from "../../../utils/calMa";
import useResponseStore from "../../../utils/useResponseStore.js";

function separateDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return { year, month, day };
}

let prevDate = { year: "2015", month: "01", day: "01" };

const StrategyChart = () => {
  const [ohlcvData, setohlcvData] = useState([]);
  const {m_date, n_date} = useResponseStore();
  useEffect(() => {
    setohlcvData(modifiedData);
  }, []);

  const option = {
    legend: {
      left: "center",
      top: "top",
      data: [{ name: "MA"+m_date }, { name: "MA"+n_date }],
      padding: 20,
    },
    xAxis: {
      type: "category",
      data: ohlcvData.map((data) => data[0]),
      boundaryGap: false,
      offset: 15,
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
          if (date.year !== prevDate.year) {
            prevDate = date;
            return date.year + "년";
          } else if (date.month !== prevDate.month) {
            prevDate = date;
            return date.month + "월";
          }
          prevDate = date;
          return date.day + "일";
        },
      },
      splitLine: {
        show: true,
      },
    },
    yAxis: {
      scale: true,
      splitNumber: 10,
      type: "value",
      position: "right",
      offset: 10,
      axisLine: {
        show: false,
        onZero: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontWeight: "bold",
        color: "#000",
        formatter: function (value) {
          return value;
        },
      },
      axisPointer: {
        triggerEmphasis: false,
      },
    },
    grid: {
      show: true,
      left: 0,
      top: 50,
      right: "8%",
      bottom: 60,
      borderWidth: 0,
    },
    dataZoom: [
      {
        type: "inside",
        start: 98,
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
        type: "candlestick",
        name: "Day",
        data: ohlcvData.map((data) => data.slice(1)),
        itemStyle: {
          color: "#F23645",
          color0: "#089981",
          borderColor: "#F23645",
          borderColor0: "#089981",
        },
      },
      {
        name: "MA"+m_date,
        type: "line",
        data: calculateMA(
          m_date,
          ohlcvData.map((data) => data.slice(1))
        ),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3,
          opacity: 0.5,
        },
      },
      {
        name: "MA"+n_date,
        type: "line",
        data: calculateMA(
          n_date,
          ohlcvData.map((data) => data.slice(1))
        ),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3,
          opacity: 0.5,
        },
      },
    ],
  };

  return (
    <ReactEcharts option={option} style={{ width: "100%", height: "100%" }} />
  );
};

export default StrategyChart;

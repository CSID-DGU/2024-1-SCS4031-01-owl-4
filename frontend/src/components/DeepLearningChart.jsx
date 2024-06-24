import useTokenStore from "../utils/token";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import BTC from '../assets/coinLogoImages/BTC.png'

const formatPrevData = (dataArray) => {
  return dataArray.map((item) => {
    return {
      close: item.close_price,
      date: item.date.split("T")[0],
    };
  });
};

const formatPredictData = (dataArray) => {
  return dataArray.map((item) => {
    return {
      close: item.close,
      date: item.date.split("T")[0],
    };
  });
};

const DeepLearningChart = () => {
    const { token } = useTokenStore();
  
    const [closeValue, setCloseValue] = useState([]);
    const [dateData, setDateData] = useState([]);
  
    const { data: predictionData, isLoading: isPredictionLoading } = useQuery({
      queryKey: ["prediction"],
      queryFn: async () => {
        const response = await axios.get(
          "http://localhost:8081/api/v1/prediction",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.payload || [];
      },
    });
  
    const {
      data,
      isLoading: prevIsLoading,
    } = useQuery({
      queryKey: ["close_Infos"],
      queryFn: async () => {
        const response = await axios.get(
          "http://localhost:8081/api/v1/charts?coin_name=비트코인&candle_name=days"
        );
        return response.data.payload;
      },
      refetchInterval: 600000, // 10분
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity, // 캐시를 영구적으로 사용
      throwOnError: false, // 에러를 throw하지 않음
    });
  
    useEffect(() => {
      if (data && predictionData) { // data와 predictionData가 정의되었는지 확인
        const formattedPrevData = formatPrevData(data);
        const formattedPredictData = formatPredictData(predictionData);
        const allFormattedData = [...formattedPrevData, ...formattedPredictData];
        const closes = allFormattedData.map(item => item.close);
        const dates = allFormattedData.map(item => item.date);
        setCloseValue(closes);
        setDateData(dates);
      }
    }, [data, predictionData]);

  const option = {
    color: ["#24ae08"],
    visualMap: {
        show: false,
        dimension: 0,
        pieces: [
            {min:0, max:2363, color: '#bd79c7'},
            {min:2363, max: 2366, color: 'red'}
        ]
      },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: dateData,
        axisLine: {
          show: false,
          onZero: true,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          fontWeight: "bold",
          color: "#000",
        },
        splitLine: {
          show: true,
        },
      },
    ],
    yAxis: {
      scale: true,
      type: "value",
      position: "right",
      axisLine: {
        show: false,
        onZero: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
        fontWeight: "bold",
        color: "#000",
        formatter: function (value) {
          return value;
        },
      },
      axisPointer: {
        triggerEmphasis: false,
        label: {
          show: false,
          backgroundColor: "#6a7985",
        },
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 99,
        end: 100,
      },
    ],
    tooltip: {
      show: true,
      position: ["21%", "5.5%"],
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      extraCssText: "background: transparent; border-style: none; box-shadow: none;",
      formatter: function (parmas) {
        return `<div style='width: 200px; display: flex; align-items: center;'>
            <div style='width: 10px; height: 10px; border-radius: 9999px; background-color: ${parmas[0].color};'></div>
            <div style='display:flex; align-items:center; margin-left:10px'>
              <span style='font-weight: 700; font-size:15px;'>Close</span>
              <span style='color: ${parmas[0].color}; font-size:14px; margin-left:8px'>${parmas[0].data}</span>
            </div>
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
        name: "Close",
        type: "line",
        stack: "Total",
        areaStyle: {},
        markArea: {
            label: {
                show: true,
                fontWeight: 'bolder',
                fontSize: 16,
                distance: 12
            },
            itemStyle: {
              color: 'rgba(255, 173, 177, 0.4)'
            },
            data: [
              [
                {
                  name: 'AI Prediction Area',
                  xAxis: '2024-06-20'
                },
                {
                  xAxis: '2024-06-23'
                }
              ],
            ]
          },
        emphasis: {
          focus: "series",
        },
        data: closeValue,
      },
    ],
  };

  return (
    <div className="w-full h-full border shadow-lg flex justify-center items-center relative overflow-hidden">
      <ReactEcharts
        option={option}
        style={{ width: "120%", height: "120%" }}
        className="absolute top-[-5%] left-[-13%]"
      />
      <div className="absolute top-2 left-2 flex items-center justify-center">
      <img src={BTC} alt="Coin-Logo" className="size-[30px]" />
      <span className="ml-2 font-bold text-slate-700 tracking-widest text-2xl">BTC</span>
      </div>
    </div>
  );
};

export default DeepLearningChart;

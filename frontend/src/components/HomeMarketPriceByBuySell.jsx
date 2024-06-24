import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import NewLoading from "./NewLoading";
import useResponseStore from "../utils/useResponseStore";
import * as echarts from 'echarts';

let prevDate = {
  year: "2019",
  month: "01",
  day: "01",
  hours: "00",
  minutes: "00",
};

function separateDate(dateString) {
  const [year, month, day, hours, minutes] = dateString.split("-");
  return { year, month, day, hours, minutes };
}

function formatDateAndTime(datetime) {
  
    const dateObj = new Date(datetime);
  
    
    const year = dateObj.getFullYear().toString().slice(-2); 
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); 
    const day = dateObj.getDate().toString().padStart(2, '0');
  
    const formattedDate = `${year}/${month}/${day}`;
  
    
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');
  
    const formattedTime = `${hours}:${minutes}:${seconds}`;
  
    return { formattedDate, formattedTime };
  }


const HomeMarketPriceByBuySell = () => {

    const {autoInfo} = useResponseStore();

    useEffect(() => {
        if(autoInfo) console.log('autoInfo',autoInfo)
    },[autoInfo])

    const option = {
        color: ['#80FFA5'],
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: ['03/21', '03/27', '04/05', '04/08', '04/17', '04/19', '05/10'],
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
            }
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
                show: false,
                backgroundColor: '#6a7985'
              }
            },
          },
          dataZoom: [
            {
              type: "inside",
              start: 20,
              end: 100,
            },
          ],
          tooltip: {
            show: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
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
              name: 'rate',
              type: 'line',
              stack: 'Total',
              areaStyle: {},
              emphasis: {
                focus: 'series'
              },
              data: [0.32, 0.11, 0.42, 0.02, 0.08, 0.19, 0.23]
            },
          ]
    }

  return (
    <div className="w-full h-full relative border bg-white shadow-xl rounded-xl overflow-hidden select-none">
      <ReactEcharts
      option={option}
      style={{ width: "120%", height: "128%" }}
      className="absolute top-[-10%] left-[-15%]"
    />
    <div className="absolute top-1 left-5">
      <h1 className="font-bold text-base text-slate-700">Profit Rate</h1>
    </div>
    <div className="absolute top-1 right-6">
      <h1 className="font-bold text-base text-slate-700">1 Week</h1>
    </div>
    </div>
  );
};

export default HomeMarketPriceByBuySell;


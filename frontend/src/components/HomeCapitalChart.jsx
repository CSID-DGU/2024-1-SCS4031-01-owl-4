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

const HomeCapitalChart = () => {

    const {autoInfo} = useResponseStore();

    useEffect(() => {
        if(autoInfo) console.log('autoInfo',autoInfo)
    },[autoInfo])


    const option = {
        color: ['#80FFA5', '#FF0087', '#FFBF00'],
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
                interval: 1,
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
              name: '매수',
              type: 'line',
              stack: 'Total',
              smooth: true,
              lineStyle: {
                width: 0
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(128, 255, 165)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(1, 191, 236)'
                  }
                ])
              },
              emphasis: {
                focus: 'series'
              },
              data: [14000, 23200, 10100, 26400, 9000, 34000, 25000]
            },
            {
              name: '매도',
              type: 'line',
              stack: 'Total',
              smooth: true,
              lineStyle: {
                width: 0
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(255, 0, 135)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(135, 0, 157)'
                  }
                ])
              },
              emphasis: {
                focus: 'series'
              },
              data: [22000, 40200, 23100, 13400, 19000, 23000, 12000]
            },
            {
              name: '합계',
              type: 'line',
              stack: 'Total',
              smooth: true,
              lineStyle: {
                width: 0
              },
              showSymbol: false,
              label: {
                show: true,
                position: 'top'
              },
              areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(255, 191, 0)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(224, 62, 76)'
                  }
                ])
              },
              emphasis: {
                focus: 'series'
              },
              data: [22000, 30200, 18100, 23400, 21000, 29000, 15000]
            }
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
      <h1 className="font-bold text-base text-slate-700">Capital by Buy and Sell</h1>
    </div>
    <div className="absolute top-1 right-6">
      <h1 className="font-bold text-base text-slate-700">1 Week</h1>
    </div>
    </div>
  );
};

export default HomeCapitalChart;

// formatter: function (value) {
//   const date = separateDate(value);
//   const minuteDiff = Math.abs(
//     parseInt(date.minutes) - parseInt(prevDate.minutes)
//   );
//   const hourDiff =
//     Math.abs(parseInt(date.hours) - parseInt(prevDate.hours)) * 60 +
//     minuteDiff;
//   if (date.year !== prevDate.year) {
//     prevDate = date;
//     return date.year + "년";
//   } else if (date.month !== prevDate.month) {
//     prevDate = date;
//     return date.month + "월";
//   } else if (date.day !== prevDate.day) {
//     prevDate = date;
//     return date.day + "일";
//   } else if (hourDiff >= 240) {
//     // 4시간 간격
//     prevDate = date;
//     return date.hours + "시";
//   } else if (hourDiff >= 60) {
//     // 1시간 간격
//     prevDate = date;
//     return date.hours + "시";
//   } else if (minuteDiff >= 30) {
//     // 30분 간격
//     prevDate = date;
//     return date.minutes + "분";
//   } else if (minuteDiff >= 15) {
//     // 15분 간격
//     prevDate = date;
//     return date.minutes + "분";
//   } else if (minuteDiff >= 10) {
//     // 10분 간격
//     prevDate = date;
//     return date.minutes + "분";
//   } else if (minuteDiff >= 5) {
//     // 5분 간격
//     prevDate = date;
//     return date.minutes + "분";
//   } else if (minuteDiff >= 3) {
//     // 3분 간격
//     prevDate = date;
//     return date.minutes + "분";
//   } else if (minuteDiff >= 1) {
//     // 1분 간격
//     prevDate = date;
//     return date.minutes + "분";
//   }
// },

// axisPointer: {
//   label: {
//     formatter: function (value) {
//       const data = separateDate(value.value);
//       const { hours, minutes } = data;
//       return `${hours}:${minutes}`;
//     },
//   },
// },

// extraCssText: "background: transparent; border-style: none; box-shadow: none;",
//             formatter: function (parmas) {
//               return `<div style='width: 350px; display: flex; justify-content: space-between; align-items: center;'>
//                   <div style='width: 10px; height: 10px; border-radius: 9999px; background-color: ${
//                     parmas[0].componentSubType === "candlestick"
//                       ? parmas[0].color
//                       : parmas[1].color
//                   };'></div>
//                   <div>
//                     <span style='font-weight: 700'>O</span>
//                     <span style='color: ${
//                       parmas[0].componentSubType === "candlestick"
//                         ? parmas[0].color
//                         : parmas[1].color
//                     }; font-size:12px;'>${
//                 parmas[0].componentSubType === "candlestick"
//                   ? parmas[0].data[1]
//                   : parmas[1].data[1]
//               }</span>
//                   </div>
//                   <div>
//                     <span style='font-weight: 700'>H</span>
//                     <span style='color: ${
//                       parmas[0].componentSubType === "candlestick"
//                         ? parmas[0].color
//                         : parmas[1].color
//                     }; font-size:12px;'>${
//                 parmas[0].componentSubType === "candlestick"
//                   ? parmas[0].data[4]
//                   : parmas[1].data[4]
//               }</span>
//                   </div>
//                   <div>
//                     <span style='font-weight: 700'>L</span>
//                     <span style='color: ${
//                       parmas[0].componentSubType === "candlestick"
//                         ? parmas[0].color
//                         : parmas[1].color
//                     }; font-size:12px;'>${
//                 parmas[0].componentSubType === "candlestick"
//                   ? parmas[0].data[3]
//                   : parmas[1].data[3]
//               }</span>
//                   </div>
//                   <div>
//                     <span style='font-weight: 700'>C</span>
//                     <span style='color: ${
//                       parmas[0].componentSubType === "candlestick"
//                         ? parmas[0].color
//                         : parmas[1].color
//                     }; font-size:12px;'>${
//                 parmas[0].componentSubType === "candlestick"
//                   ? parmas[0].data[2]
//                   : parmas[1].data[2]
//               }</span>
//                   </div>
//                   ${
//                     parmas[0].componentSubType === "candlestick"
//                       ? ""
//                       : `<div><span style='font-weight: 700'>V </span><span style='color : ${parmas[1].color}'>${parmas[0].data[1]}</span></div>`
//                   }
//                 </div>`;
//             },

// {
//   name: 'Line 2',
//   type: 'line',
//   stack: 'Total',
//   smooth: true,
//   lineStyle: {
//     width: 0
//   },
//   showSymbol: false,
//   areaStyle: {
//     opacity: 0.8,
//     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//       {
//         offset: 0,
//         color: 'rgb(0, 221, 255)'
//       },
//       {
//         offset: 1,
//         color: 'rgb(77, 119, 255)'
//       }
//     ])
//   },
//   emphasis: {
//     focus: 'series'
//   },
//   data: [120, 282, 111, 234, 220, 340, 310]
// },

// {
//   name: 'Line 3',
//   type: 'line',
//   stack: 'Total',
//   smooth: true,
//   lineStyle: {
//     width: 0
//   },
//   showSymbol: false,
//   areaStyle: {
//     opacity: 0.8,
//     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//       {
//         offset: 0,
//         color: 'rgb(55, 162, 255)'
//       },
//       {
//         offset: 1,
//         color: 'rgb(116, 21, 219)'
//       }
//     ])
//   },
//   emphasis: {
//     focus: 'series'
//   },
//   data: [320, 132, 201, 334, 190, 130, 220]
// },
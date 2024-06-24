import ReactEcharts from "echarts-for-react";
import { calculateMA } from "../utils/calMa";
import { useRef } from "react";

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


const MainCandleChart = ({ ohlcvData, volumeData, start, end, dateData, prevStart, prevEnd, plusColor, minusColor }) => {
  const lastDataZoom = useRef(null);

    const handleDataZoom = (param) => {
        lastDataZoom.current = param.batch[0];
        const { start, end } = lastDataZoom.current;
        prevStart = start;
        prevEnd = end;
      };

    const option = {
        legend: {
          left: "2.5%",
          top: "7.5%",
          data: [{ name: "MA " + 20 }, { name: "MA " + 60 }],
          padding: 20,
          orient: "vertical",
          z: 10,
          itemGap: 20,
        },
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
            axisPointer: {
              label: {
                show: false,
              },
            },
            axisLabel: {
              show: false,
              fontWeight: "bold",
              color: "#000",
            },
            splitLine: {
              show: true,
            },
          },
          {
            type: "category",
            data: dateData,
            gridIndex: 1,
            offset: 16,
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
                  const { year, month, day, hours, minutes } = data;
                  return `${year}/${month}/${day} ${hours}:${minutes}`;
                },
              },
            },
          },
        ],
        yAxis: [
          {
            scale: true,
            splitNumber: 10,
            type: "value",
            position: "right",
            offset: 12,
            axisLine: {
              show: false,
              onZero: false,
            },
            axisTick: {
              show: false,
              trigger: "axis",
            },
            axisLabel: {
              fontWeight: "bold",
              color: "#000",
              formatter: function (value) {
                return value;
              },
              fontSize: 10,
            },
            axisPointer: {
              triggerEmphasis: false,
              triggerTooltip: false,
            },
          },
          {
            scale: true,
            type: "value",
            position: "right",
            gridIndex: 1,
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: true,
            },
          },
        ],
        grid: [
          {
            top: "7.3%",
            left: "0%",
            right: "6%",
            height: "71.5%",
          },
          {
            left: "0%",
            right: "6%",
            top: "81%",
            height: "10%",
          },
        ],
        tooltip: {
          show: true,
          alwaysShowContent: 'true',
          position: ["67.5%", "1.5%"],
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          extraCssText:
            "background-color: transparent; box-shadow: 0 0; border: 0;",
          formatter: function (parmas) {
            return `<div style='width: 450px; display: flex; justify-content: space-between; align-items: center;'>
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
                  }'>${
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
                  }'>${
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
                  }'>${
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
                  }'>${
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
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0, 1],
            start: start,
            end: end,
          },
        ],
        axisPointer: {
          show: true,
          link: [
            {
              xAxisIndex: "all",
            },
          ],
        },
        series: [
          {
            type: "candlestick",
            name: "Day",
            data: ohlcvData,
            itemStyle: {
              color: plusColor,
              color0: minusColor,
              borderColor: plusColor,
              borderColor0: minusColor,
            },
          },
          {
            type: "bar",
            name: "Volume",
            data: volumeData,
            itemStyle: {
              color: function (params) {
                return params.data[2] === 1 ? plusColor : minusColor;
              },
            },
            xAxisIndex: 1,
            yAxisIndex: 1,
          },
          {
            name: "MA " + 60,
            type: "line",
            data: calculateMA(60, ohlcvData),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 3,
              opacity: 0.6,
            },
          },
          {
            name: "MA " + 20,
            type: "line",
            data: calculateMA(20, ohlcvData),
            smooth: true,
            showSymbol: false,
            lineStyle: {
              width: 3,
              opacity: 0.6,
            },
          },
        ],
      };

      
    
  return (
    <ReactEcharts
            option={option}
            style={{ width: "100%", height: "100%" }}
            onEvents={{ datazoom: handleDataZoom }}
            className="absolute"
          />
  )
}

export default MainCandleChart

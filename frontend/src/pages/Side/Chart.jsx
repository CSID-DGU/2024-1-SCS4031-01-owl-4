import ReactEcharts from "echarts-for-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { IoIosArrowDropup } from "react-icons/io";
import Modal from "../../components/Modal";
import { FaSearch } from "react-icons/fa";
import Markets from "../../components/Markets";
import useResponseStore from "../../utils/useResponseStore";
import { FaBitcoin } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import Loading from "../../components/Loading";
import { calculateMA } from "../../utils/calMa";

const ITEMS_PER_PAGE = 10;

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
  return ohlcvData.map((data) => [num++, data[4], data[0] > data[1] ? -1 : 1]);
}

let prevDate = {
  year: "2019",
  month: "01",
  day: "01",
  hours: "00",
  minutes: "00",
};

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
  const [start, setStart] = useState(98);
  const [end, setEnd] = useState(100);
  const [openCandle, setOpenCandle] = useState(false);
  const [currency, setCurrency] = useState("1 Day");
  const [candle, setCandle] = useState("days");
  const [coin, setCoin] = useState("비트코인");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsData, setItemsData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { coin_name, market_name } = useResponseStore();
  const dropdownRef = useRef(null);
  const lastDataZoom = useRef(null);
  let prevStart = 0;
  let prevEnd = 0;

  const { data: marketData } = useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:8081/api/v1/charts/options"
      );
      return response.data.payload
        .filter(function (value, index) {
          return index === 0 || index % 11 === 0;
        })
        .map(function (value) {
          return value;
        });
    },
  });

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
    refetchInterval: 60000, // 1분
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // 캐시를 영구적으로 사용
    throwOnError: false, // 에러를 throw하지 않음
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenCandle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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

  useEffect(() => {
    if (!isLoading && data) {
      const { ohlcv, dates } = processChartData(data);
      setOhlcvData(ohlcv);
      setVolumeData(settingVolumeData(ohlcv));
      setDateData(dates.map((date) => formatDate(new Date(date))));
      setItemsData(marketData);
    }
  }, [data, marketData, isLoading, refetch]);

  useEffect(() => {
    const filteredData = itemsData.filter((item) => {
      return (
        item.english_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.korean_name.includes(searchQuery)
      );
    });
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    setPaginatedData(
      filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    );
  }, [itemsData, searchQuery, currentPage]);

  const handleSearchFilter = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(
    itemsData.filter((item) =>
      item.english_name.toLowerCase().includes(searchQuery.toLowerCase())
    ).length / ITEMS_PER_PAGE
  );

  const handleClick = (page) => {
    setCurrentPage(page);
  };

  const handleDataZoom = (param) => {
    lastDataZoom.current = param.batch[0];
    const { start, end } = lastDataZoom.current;
    prevStart = start;
    prevEnd = end;
    console.log(prevStart, prevEnd, "prev");
  };

  const option = {
    legend: {
      left: "0%",
      top: "7.5%",
      data: [{ name: "MA "+20 }, { name: "MA "+60 }],
      padding: 20,
      orient: 'vertical',
      z: 10,
      itemGap: 20
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
              } else if (hourDiff >= 240) { // 4시간 간격
                prevDate = date;
                return date.hours + "시";
              } else if (hourDiff >= 60) { // 1시간 간격
                prevDate = date;
                return date.hours + "시";
              } else if (minuteDiff >= 30) { // 30분 간격
                prevDate = date;
                return date.minutes + "분";
              } else if (minuteDiff >= 15) { // 15분 간격
                prevDate = date;
                return date.minutes + "분";
              } else if (minuteDiff >= 10) { // 10분 간격
                prevDate = date;
                return date.minutes + "분";
              } else if (minuteDiff >= 5) { // 5분 간격
                prevDate = date;
                return date.minutes + "분";
              } else if (minuteDiff >= 3) { // 3분 간격
                prevDate = date;
                return date.minutes + "분";
              } else if (minuteDiff >= 1) { // 1분 간격
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
          color: "#089981",
          color0: "#F23645",
          borderColor: "#089981",
          borderColor0: "#F23645",
        },
      },
      {
        type: "bar",
        name: "Volume",
        data: volumeData,
        itemStyle: {
          color: function (params) {
            return params.data[2] === 1 ? "#089981" : "#F23645";
          },
        },
        xAxisIndex: 1,
        yAxisIndex: 1,
      },
      {
        name: "MA "+60,
        type: "line",
        data: calculateMA(
          60,
          ohlcvData
        ),
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 3,
          opacity: 0.5,
        },
      },
      {
        name: "MA "+20,
        type: "line",
        data: calculateMA(
          20,
          ohlcvData
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
    <div className="w-full bg-slate-200 p-10">
      <div className="w-full h-full bg-white rounded-xl shadow-lg border flex flex-col relative">
        <div className="w-full h-[60px] absolute top-0 left-0 bg-white z-10 shadow-lg border rounded-xl flex">
          <div className="w-[65%] h-full flex items-center pl-4 py-3">
            {/* <img src="" alt="" className="w-[60px] h-full bg-slate-200" /> */}
            <FaBitcoin className="text-yellow-500 size-[39px]" />
            <h1 className="text-xl font-bold text-slate-700 ml-3 select-none">
              {coin_name}
            </h1>
            <span className="ml-3 select-none">{market_name}</span>
            <div
              className="w-[150px] ml-5 relative flex items-center bg-indigo-500 font-bold justify-between border rounded-lg shadow-lg px-2 py-1"
              onClick={() => {
                setOpenCandle(!openCandle);
                if (prevStart && prevEnd) {
                  setStart(prevStart);
                  setEnd(prevEnd);
                }
              }}
              ref={dropdownRef}
            >
              <div className="select-none text-white">{currency}</div>
              <IoIosArrowDropup
                className={`${openCandle ? "rotate-180" : ""} text-white`}
              />
              {openCandle && (
                <ul className="absolute w-full top-6 left-0 px-2 py-2 mt-2 rounded-lg bg-white z-20">
                  <li
                    className="flex cursor-pointer py-1 rounded-lg items-center justify-around bg-white hover:bg-slate-200 select-none"
                    onClick={() => {
                      setCurrency("1M");
                      setCandle("minutes1");
                      setOpenCandle(false);
                    }}
                  >
                    <span className="text-sm font-normal select-none">1 M</span>
                  </li>
                  <li
                    className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200 select-none"
                    onClick={() => {
                      setCurrency("3M");
                      setCandle("minutes3");
                      setOpenCandle(false);
                    }}
                  >
                    <span className=" text-sm font-normal select-none">
                      3 M
                    </span>
                  </li>
                  <li
                    className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
                    onClick={() => {
                      setCurrency("5 M");
                      setCandle("minutes5");
                      setOpenCandle(false);
                    }}
                  >
                    <span className=" text-sm font-normal select-none">
                      5 M
                    </span>
                  </li>
                  <li
                    className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
                    onClick={() => {
                      setCurrency("10 M");
                      setCandle("minutes10");
                      setOpenCandle(false);
                    }}
                  >
                    <span className=" text-sm font-normal select-none">
                      10 M
                    </span>
                  </li>
                  <li
                    className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
                    onClick={() => {
                      setCurrency("15 M");
                      setCandle("minutes15");
                      setOpenCandle(false);
                    }}
                  >
                    <span className=" text-sm font-normal select-none">
                      15 M
                    </span>
                  </li>
                  <li
                    className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
                    onClick={() => {
                      setCurrency("30 M");
                      setCandle("minutes30");
                      setOpenCandle(false);
                    }}
                  >
                    <span className=" text-sm font-normal select-none">
                      30 M
                    </span>
                  </li>
                  <li
                    className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
                    onClick={() => {
                      setCurrency("1 H");
                      setCandle("minutes60");
                      setOpenCandle(false);
                    }}
                  >
                    <span className=" text-sm font-normal select-none">
                      1 H
                    </span>
                  </li>
                  <li
                    className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
                    onClick={() => {
                      setCurrency("4 H");
                      setCandle("minutes240");
                      setOpenCandle(false);
                    }}
                  >
                    <span className=" text-sm font-normal select-none">
                      4 H
                    </span>
                  </li>
                  <li
                    className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
                    onClick={() => {
                      setCurrency("1 DAY");
                      setCandle("days");
                      setOpenCandle(false);
                    }}
                  >
                    <span className=" text-sm font-normal select-none">
                      1 DAY
                    </span>
                  </li>
                  <li
                    className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
                    onClick={() => {
                      setCurrency("1 Week");
                      setCandle("weeks");
                      setOpenCandle(false);
                    }}
                  >
                    <span className=" text-sm font-normal select-none">
                      1 Week
                    </span>
                  </li>
                  <li
                    className="flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200"
                    onClick={() => {
                      setCurrency("1 Month");
                      setCandle("months");
                      setOpenCandle(false);
                    }}
                  >
                    <span className=" text-sm font-normal select-none">
                      1 Month
                    </span>
                  </li>
                </ul>
              )}
            </div>
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
          {/* 
          <div className="w-1/2 h-full flex items-center justify-between font-bold">
            
          </div> */}
          {/* 
          <div className="w-full h-1/2 flex items-center justify-between px-2 font-bold">
            <GiSandsOfTime className="w-1/3" />
            
            <div className="w-1/3 text-center text-sm font-light">( Time )</div>
          </div> */}
        </div>
        {isRefetching ? (
          <Loading />
        ) : (
          <ReactEcharts
            option={option}
            style={{ width: "100%", height: "100%" }}
            onEvents={{ datazoom: handleDataZoom }}
            className="absolute"
          />
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-[800px] h-[600px] flex flex-col shadow-lg border rounded-lg">
          <div className="h-[12%] b flex justify-center items-center">
            <div className="w-[70%] border border-black rounded-lg flex items-center justify-center px-3">
              <FaSearch className="size-[20px] mr-2 " />
              <input
                type="text"
                className="w-full h-[35px] outline-none px-2"
                onChange={handleSearchFilter}
              />
            </div>
          </div>
          <div className="h-[88%] flex flex-col px-7 py-2">
            <div className="flex text-sm mb-3">
              <div className="grow-[1] text-center bg-slate-200 mr-2 p-1 rounded-lg font-bold text-slate-500">
                IMG
              </div>
              <div className="grow-[9] text-center bg-slate-200 ml-2 mr-2 p-1 rounded-lg font-bold text-slate-500">
                NAME
              </div>
              <div className="grow-[1] text-center bg-slate-200 ml-2 p-1 rounded-lg font-bold text-slate-500">
                UNIT
              </div>
            </div>
            {paginatedData.map((item) => (
              <Markets
                key={item.portfolio_id}
                item={item}
                close={() => setOpen(false)}
              />
            ))}
            <div className="flex justify-center absolute left-[15%] bottom-[6%]">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Chart;

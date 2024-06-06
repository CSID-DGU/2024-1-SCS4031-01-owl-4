import ReactEcharts from "echarts-for-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { modifiedData } from "../../utils/changeDate";
import { IoIosArrowDropup } from "react-icons/io";
import { GiSandsOfTime } from "react-icons/gi";
import Modal from "../../components/Modal";
import { FaSearch } from "react-icons/fa";



function separateDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return { year, month, day };
}

function settingVolumeData(ohlcvData){
  let num = 0
  return ohlcvData.map(data => [num++,data[5],data[1]>data[2] ? -1: 1])
}

let prevDate = {year: '2015', month: '01', day: '01'}


const Chart = () => {
  const [ohlcvData, setohlcvData] = useState([])
  const [volumeData, setVolumeData] = useState([])
  const [open, setOpen] = useState(false);
  const [openCandle, setOpenCandle] = useState(false);
  const [currency, setCurrency] = useState('');

  useEffect(() => {
    setohlcvData(modifiedData)
    setVolumeData(settingVolumeData(modifiedData))
  },[])

  // const {data} = useQuery({
  //   queryKey: ['candle_Infos'],
  //   queryFn: async () => {
  //     const response = await axios.get('http://localhost:8081/api/v1/candle/info/all?market=비트코인&to=2024-06-01T00:00:00&candle_type=days')
  //     console.log(response)
  //   }
  // })

  const option = {
    xAxis: [
      {
        type: 'category',
        data: ohlcvData.map(data => data[0]),
        boundaryGap: false,
        axisLine: {
          show: false,
          onZero: false
        },
        axisTick: {
          show:false,
          interval: 7
        },
        axisPointer: {
          label: {
            show: false
          }
        },
        axisLabel: {
          show: false,
          fontWeight: 'bold',
          color:'#000',
          formatter: function (value){
            const date = separateDate(value)
            if(date.year !== prevDate.year){
              prevDate = date
              return date.year+'년'
            } else if(date.month !== prevDate.month){
              prevDate = date
              return date.month+'월'
            }
            prevDate = date
            return date.day+"일"
          }
        },
        splitLine: {
          show: true
        },
        
      }, {
        type: 'category',
        data: ohlcvData.map(data => data[0]),
        gridIndex: 1,
        offset: 16,
        boundaryGap: false,
        axisLine: {
          show: false,
          onZero: false
        },
        axisTick: {
          show:false,
          interval: 7
        },
        axisLabel: {
          show: true,
          fontWeight: 'bold',
          color:'#000',
          formatter: function (value){
            const date = separateDate(value)
            if(date.year !== prevDate.year){
              prevDate = date
              return date.year+'년'
            } else if(date.month !== prevDate.month){
              prevDate = date
              return date.month+'월'
            }
            prevDate = date
            return date.day+"일"
          }
        },
        splitLine:{
          show: false
        }
      }
    ],
    yAxis: [
      {
        scale: true,
        splitNumber: 10,
        type: 'value',
        position: 'right',
        offset: 12,
        axisLine: {
          show: false,
          onZero: false
        },
        axisTick: {
          show:false,
          trigger: 'axis',
        },
        axisLabel: {
          fontWeight: 'bold',
          color: '#000',
          formatter: function (value){
            return value
          }
        },
        axisPointer: {
          triggerEmphasis: false,
          triggerTooltip: false
        },
      }, {
        scale: true,
        type: 'value',
        position: 'right',
        gridIndex: 1,
        axisLine:{
          show: false
        },
        axisLabel: {
          show: false
        },
        splitLine:{
          show: true
        }
      }
    ],
    grid: [
      {
        left: '0%',
        right: '6%',
        height: '72%',
      },
      {
        left: '0%',
        right: '6%',
        top: '81%',
        height: '10%'
      }
    ],
    tooltip: {
      show: true,
      position: ['66%', '2.7%'],
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function (parmas) {
        return (
          `<div style='width: 450px; display: flex; justify-content: space-between; align-items: center'>
            <div style='width: 10px; height: 10px; border-radius: 9999px; background-color: ${parmas[0].componentSubType === 'candlestick' ? parmas[0].color : parmas[1].color};'></div>
            <div>
              <span style='font-weight: 700'>O</span>
              <span style='color: ${parmas[0].componentSubType === 'candlestick' ? parmas[0].color : parmas[1].color}'>${parmas[0].componentSubType === 'candlestick' ? parmas[0].data[1]: parmas[1].data[1]}</span>
            </div>
            <div>
              <span style='font-weight: 700'>H</span>
              <span style='color: ${parmas[0].componentSubType === 'candlestick' ? parmas[0].color : parmas[1].color}'>${parmas[0].componentSubType === 'candlestick' ? parmas[0].data[2]: parmas[1].data[2]}</span>
            </div>
            <div>
              <span style='font-weight: 700'>L</span>
              <span style='color: ${parmas[0].componentSubType === 'candlestick' ? parmas[0].color : parmas[1].color}'>${parmas[0].componentSubType === 'candlestick' ? parmas[0].data[3]: parmas[1].data[3]}</span>
            </div>
            <div>
              <span style='font-weight: 700'>C</span>
              <span style='color: ${parmas[0].componentSubType === 'candlestick' ? parmas[0].color : parmas[1].color}'>${parmas[0].componentSubType === 'candlestick' ? parmas[0].data[4]: parmas[1].data[4]}</span>
            </div>
            ${parmas[0].componentSubType === 'candlestick' ? '' : `<div><span style='font-weight: 700'>V </span><span style='color : ${parmas[1].color}'>${parmas[0].data[1]}</span></div>`}
          </div>`
      )
      },
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0,1],
        start: 98,
        end: 100
      }
    ],
    axisPointer:{
      show: true,
      link: [
        {
          xAxisIndex: 'all'
        }
      ]
    },
    series: [
      {
        type: 'candlestick',
        name: 'Day',
        data: ohlcvData.map(data => data.slice(1)),
        itemStyle: {
          color: '#F23645',
          color0: '#089981',
          borderColor: '#F23645',
          borderColor0: '#089981'
        },
      },
      {
        type: 'bar',
        name: 'Volume',
        data: volumeData,
        itemStyle: {
          color: function(params) {
            return params.data[2] === 1 ? '#F23645' : '#089981'
          }
        },
        xAxisIndex: 1,
        yAxisIndex: 1,
      }
    ],
  };
  return (
    <div className="w-full bg-slate-200 p-10">
      <div className="w-full h-full bg-white rounded-xl shadow-lg border flex flex-col relative">
        <div className="w-[350px] h-[100px] absolute top-5 left-5 bg-transparent z-10 shadow-lg border rounded-xl flex flex-col">
          <div className="w-full h-1/2 flex items-center justify-between px-2 font-bold">
            <div className="w-1/3 text-center">Image</div>
            <div className="w-[150px] flex items-center justify-between border rounded-md px-2 hover:border-2 hover:border-violet-400"
            onClick={() => setOpen(true)}>
              <div>비트코인</div>
              <IoIosArrowDropup />
            </div>
            <div className="w-1/3 text-center text-sm font-light">( KRW-BTC )</div>
          </div>
          <div className="w-full h-1/2 flex items-center justify-between px-2 font-bold">
            <GiSandsOfTime className="w-1/3" />
            <div className="w-[150px] relative flex items-center justify-between border rounded-md px-2 hover:border-2 hover:border-violet-400"
            onClick={() => setOpenCandle(!openCandle)}>
              <div>{currency ? currency: '1M'}</div>
              <IoIosArrowDropup className={`${openCandle ? "rotate-180" : ""}`} />
              {openCandle && 
                <ul className='absolute w-full top-5 left-0 px-2 py-2 mt-2 rounded-lg bg-white z-20'>
                <li className='flex cursor-pointer py-1 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => setCurrency('1M')}>
                  <span className='text-sm font-normal'>1M</span>
                </li>
                <li className='flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => setCurrency('3M')}>
                  <span className=' text-sm font-normal'>3M</span>
                </li>
                <li className='flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => setCurrency('5M')}>
                  <span className=' text-sm font-normal'>5M</span>
                </li>
                <li className='flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => setCurrency('10M')}>
                  <span className=' text-sm font-normal'>10M</span>
                </li>
                <li className='flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => setCurrency('15M')}>
                  <span className=' text-sm font-normal'>15M</span>
                </li>
                <li className='flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => setCurrency('30M')}>
                  <span className=' text-sm font-normal'>30M</span>
                </li>
                <li className='flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => setCurrency('1H')}>
                  <span className=' text-sm font-normal'>1H</span>
                </li>
                <li className='flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => setCurrency('4H')}>
                  <span className=' text-sm font-normal'>4H</span>
                </li>
                <li className='flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => setCurrency('1D')}>
                  <span className=' text-sm font-normal'>1D</span>
                </li>
                <li className='flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => setCurrency('1W')}>
                  <span className=' text-sm font-normal'>1W</span>
                </li>
                <li className='flex cursor-pointer py-1 mt-2 rounded-lg items-center justify-around bg-white hover:bg-slate-200' onClick={() => setCurrency('1M(th)')}>
                  <span className=' text-sm font-normal'>1M(th)</span>
                </li>
              </ul>
              }
            </div>
            <div className="w-1/3 text-center text-sm font-light">( Time )</div>
          </div>
        </div>
        <ReactEcharts option={option} style={{width: '100%', height:'100%'}} className="absolute"/>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="w-[800px] h-[600px] flex flex-col shadow-lg border rounded-lg">
              <div className="h-[12%] b flex justify-center items-center">
                <div className="w-[70%] border border-black rounded-lg flex items-center justify-center px-3">
                  <FaSearch className="size-[20px] mr-2 "/>
                  <input type="text" className="w-full h-[35px] outline-none px-2" />
                </div>
              </div>
              <div className="h-[88%] flex flex-col px-7 py-2">
                <ul className="w-full border flex flex-col mb-1 rounded-lg">
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                  <li className="w-full flex items-center justify-around py-2 border-b px-2 hover:bg-slate-100"
                  onClick={() => setOpen(false)}>
                    <div>IMAGE</div>
                    <div className="w-[80%] h-full flex justify-around">
                      <div>BITCOIN</div>
                      <div>비트코인</div>
                    </div>
                    <div className="">KRW-BTC</div>
                  </li>
                </ul>
              </div>
        </div>
      </Modal>
    </div>
  )
}

export default Chart

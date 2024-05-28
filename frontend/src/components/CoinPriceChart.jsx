import ReactEcharts from "echarts-for-react";
import useResponseStore from '../utils/useResponseStore';

const CoinPriceChart = () => {

    const { responseBackTest } = useResponseStore();

    const {
        trading_logs
      } = responseBackTest.payload;

    const option = {
        legend: {
            data: ['매수', '매도']
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                onZero: false
            },
            data: trading_logs.map((log) =>{
                const dateObj = new Date(log.date)
                const date = dateObj.toLocaleDateString()
                return date
            })
        },
        yAxis: {
            axisLabel: {
                formatter: function(value) {
                    if(value >= 1000000) return (value / 1000000) + 'M'
                    if(value >= 1000) return (value / 1000000) + 'K'
                    return value
                }
            }
        },
        series: [
            {
                name: "매수",
                type: "bar",
                data: trading_logs.map((log) => {
                    if(log.type === '매수') return log.coin_price
                    return 0
                })
            }, 
            {
                name: '매도',
                type: 'bar',
                data: trading_logs.map((log) => {
                    if(log.type === '매도') return log.coin_price
                    return 0
                })
            }
        ]
    }

  return (
        <ReactEcharts option={option} style={{width:'96.5%', height:'100%'}} className="absolute top-0 right-4 rounded-xl shadow-xl border pt-3"/>
  )
}

export default CoinPriceChart

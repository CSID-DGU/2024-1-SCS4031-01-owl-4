import ReactEcharts from "echarts-for-react";
import useResponseStore from '../utils/useResponseStore';

const TradingProfitRateChart = () => {

  const { responseBackTest } = useResponseStore();

    const {
        trading_logs
      } = responseBackTest.payload;
    
    const tradeDate = trading_logs.map((log) =>{
      if(log.type === '매도'){
        const dateObj = new Date(log.date)
        const date = dateObj.toLocaleDateString()
        return date
      }
    })
    const tradeRate = trading_logs.map((log) => {
      if(log.type ==='매도') return log.rate
    })
    
    const option = {
        legend: {
            data: ['매도']
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                onZero: false
            },
            data: tradeDate.filter(item => item !== undefined)
        },
        yAxis: {
          scale:true,
          axisLabel: {
              formatter: function(value) {
                  return value
              }
          }
        },
        series: [
            {
                name: '매도',
                type: 'bar',
                data: tradeRate.filter(item => item !== undefined)
            }
        ]
    }



  return (
    <div className="h-full rounded-xl shadow-xl border pt-5">
      <ReactEcharts option={option} style={{width:'100%', height:'100%'}} className="relative right-0"/>
    </div>
  )
}

export default TradingProfitRateChart
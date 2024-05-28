import ReactEcharts from "echarts-for-react";
import useResponseStore from '../utils/useResponseStore';
import * as echarts from 'echarts';

const TradingProfitRateChart = () => {

  const { responseBackTest } = useResponseStore();

    const {
        trading_logs
      } = responseBackTest.payload;
    
      const tradeDate = trading_logs
      .filter(log => log.type === '매도')
      .map(log => {
        const dateObj = new Date(log.date);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      });

    const tradeRate = trading_logs
    .filter(log => log.type === '매도')
    .map((log) => {
       return log.rate
    })
    
    const labelTradeData = tradeDate.map((date , index) => {
      if(tradeRate[index] > 0){
        return '+ '+ date
      } return '- '+ date
    })

    const option = {
        legend: {
            data: ['매도']
        },
        xAxis: {
            boundaryGap: true,
            offset: 55,
            data: labelTradeData,
            axisLine: {
              show: true,
              onZero: true,
              lineStyle: {
                color: '#000'
              }
            },
            axisTick: {
              show:false
            },
            axisLabel: {
              inside: true,
              margin: 16,
              formatter: (value) => {
                return value.substring(1)
              },
              color: (value) => {
                return value.charAt(0) === '+' ? "green" : "red";
              },
              fontWeight: 'bolder'
            },
            splitLine: {
              show: false
            },
            axisPointer: {
              show: true,
              type: 'none'
            }
            
        },
        yAxis: {
          scale:true,
          offset: 25,
          axisLabel: {
              formatter: function(value) {
                  return value
              },
              fontWeight: 'bolder'
          },
          axisPointer: {
            show: true,
            type: 'line',
            triggerEmphasis: false,
            triggerTooltip: false
          }
        },
        tooltip: {
          trigger: 'axis',
        },
        dataZoom: [{
          type: 'inside'
        }],
        series: [
            {
                name: '매도',
                type: 'bar',
                data: tradeRate,
                barMaxWidth: 20,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#188df0' }
                  ])
                },
                emphasis: {
                  itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: '#2378f7' },
                      { offset: 0.7, color: '#2378f7' },
                      { offset: 1, color: '#83bff6' }
                    ])
                  }
                },
            }
        ],
    }



  return (
      <ReactEcharts option={option} style={{height:'100%'}} className=""/>
  )
}

export default TradingProfitRateChart
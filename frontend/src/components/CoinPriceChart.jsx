import ReactEcharts from "echarts-for-react";
import useResponseStore from '../utils/useResponseStore';

// JSON 데이터 배열을 요구하는 형식으로 변환하는 함수
function formatToJsonArray(tradingLogs) {
    // 날짜별로 그룹화된 매수와 매도의 coin_price를 저장하는 객체
    const groupedByDate = {};
  
    // 각 거래 로그에 대해 날짜별로 그룹화
    tradingLogs.forEach(log => {
      const date = new Date(log.date).toISOString().slice(0, 10);
  
      // 날짜별로 그룹화된 객체 생성 또는 기존 객체에 매수와 매도 coin_price를 더함
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date: date,
          매수: 0,
          매도: 0
        };
      }
  
      if (log.type === '매수') {
        groupedByDate[date].매수 += log.coin_price;
      } else if (log.type === '매도') {
        groupedByDate[date].매도 += log.coin_price;
      }
    });
  
    // 그룹화된 데이터를 배열로 변환 후 날짜로 정렬하여 요구하는 형식으로 포맷
    const formattedData = Object.values(groupedByDate)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(item => [item.date, item.매수, item.매도]);
  
    // 요구하는 형식으로 첫 번째 행 추가
    formattedData.unshift(['date', '매수', '매도']);
  
    return formattedData;
  }
  
const CoinPriceChart = ({tradingLogs}) => {

    // const { responseBackTest } = useResponseStore();

    // if (!responseBackTest || !responseBackTest.payload || !responseBackTest.payload.trading_logs) {
    //   return <div>No trading data available.</div>;
    // }

    
    const formattedData = formatToJsonArray(tradingLogs);

    const option = {

        legend: {
          top: '5%'
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            axisLine: {
                show: true,
                onZero: true,
                lineStyle: {
                  color: '#000'
                }
              },
              axisTick: {
                show:true,

              },
              axisLabel: {
                inside: false,
                margin: 32,
                fontWeight: 'bolder'
              },
        },
        yAxis: {
          position: 'left',
            axisLabel: {
                formatter: function(value) {
                    if(value >= 1000000) return (value / 1000000) + 'M'
                    if(value >= 1000) return (value / 1000000) + 'K'
                    return value
                },
                fontWeight: 'bolder',
                margin: 40
            }
        },
        dataset: {
            source: formattedData
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
          },
          dataZoom: [{
            type: 'inside'
          }],
        series: [
            {
                type: "bar",
            }, 
            {
                type: 'bar',
            }
        ]
    }
    
  return (
        <ReactEcharts option={option} style={{width:"100%", height:"100%"}} className="absolute top-0 right-0" />
  )
}

export default CoinPriceChart


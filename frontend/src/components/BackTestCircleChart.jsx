import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import useResponseStore from '../../utils/useResponseStore';


const BackTestCircleChart = () => {

    const { responseBackTest } = useResponseStore();
    const [positiveTradeCount, setPositiveTradeCount] = useState();
    const [negativeTradeCount, setnegativeTradeCount] = useState();
    const {trading} = responseBackTest.payload;
    useEffect(() =>{
        setPositiveTradeCount(trading.positive_trade_count)
        setnegativeTradeCount(trading.negative_trade_count)
    }, [trading.positive_trade_count,trading.negative_trade_count])

   const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: positiveTradeCount, name: 'Positive Trade' },
              { value: negativeTradeCount, name: 'Negative Trade' },
            ]
          }
        ]
      };


  return (
    <ReactEcharts option={option} style={{width:'100%', height:'100%'}} />
  )
}

export default BackTestCircleChart
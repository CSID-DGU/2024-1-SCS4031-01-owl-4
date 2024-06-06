import ReactEcharts from "echarts-for-react";

const PortfolioProfitChart = ({positiveTrade ,negativeTrade}) => {
    
    const calData = positiveTrade/(positiveTrade + Math.abs(negativeTrade)) * 100
    const data = Math.ceil(calData)

    const option = {
        series: [
            {
              type: 'gauge',
              startAngle: 180,
              endAngle: 0,
              center: ['50%', '80%'],
              radius: '90%',
              min: 0,
              max: 100,
              splitNumber: 8,
              axisLine: {
                lineStyle: {
                  width: 6,
                  color: [
                    [0.25, '#FF6E76'],
                    [0.5, '#FDDD60'],
                    [0.75, '#58D9F9'],
                    [1, '#7CFFB2']
                  ]
                }
              },
              pointer: {
                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                length: '12%',
                width: 20,
                offsetCenter: [0, '-60%'],
                itemStyle: {
                  color: 'auto'
                }
              },
              axisTick: {
                length: 12,
                lineStyle: {
                  color: 'auto',
                  width: 2
                }
              },
              splitLine: {
                length: 20,
                lineStyle: {
                  color: 'auto',
                  width: 5
                }
              },
              axisLabel: {
                color: '#464646',
                fontSize: 16,
                distance: -50,
                rotate: 'tangential',
                formatter: function (value) {
                  if (value === 87.5) {
                    return 'Grade A';
                  } else if (value === 62.5) {
                    return 'Grade B';
                  } else if (value === 37.5) {
                    return 'Grade C';
                  } else if (value === 12.5) {
                    return 'Grade D';
                  }
                  return '';
                }
              },
              title: {
                offsetCenter: [0, '-150%'],
                fontSize: 20
              },
              detail: {
                fontSize: 38,
                offsetCenter: [0, '-18%'],
                valueAnimation: true,
                formatter: function (value) {
                  return value + '%';
                },
                color: 'inherit'
              },
              data: [
                {
                  value: data,
                  name: 'Profit Rate'
                }
              ]
            }
          ]
    }


  return (
    <ReactEcharts option={option} style={{width:"100%", height:"100%"}} />
  )
}

export default PortfolioProfitChart
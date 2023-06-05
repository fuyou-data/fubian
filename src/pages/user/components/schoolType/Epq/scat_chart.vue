<template>
  <div>
    <div ref="chart" :style="{width:'100%',height: '400px'}"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'scatChart',
  props: {
    enData: Array
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.chart)
      myChart.setOption({
        animation: false,
        grid: {
          top: 40,
          left: 50,
          right: 40,
          bottom: 50
        },
        xAxis: {
          name: 'E',
          nameTextStyle: {
            color: '#333',
            fontWeight: 'bold',
            fontSize: 14
          },
          min: 0,
          max: 100,
          splitNumber: 10,
          splitLine: {
            show: false
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#333333' // 坐标值得具体的颜色
            }
          },
          axisLine: {
            show: true,
            lineStyle: { // 线的样式
              color: '#E5E5E5',
              width: 1,
              type: 'solid'
            }
          }
        },
        yAxis: {
          name: 'N',
          nameTextStyle: {
            color: '#333',
            fontWeight: 'bold',
            fontSize: 14
          },
          min: 0,
          max: 100,
          splitNumber: 10,
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#333333' // 坐标值得具体的颜色
            }
          },
          axisLine: {
            show: true,
            lineStyle: { // 线的样式
              color: '#E5E5E5',
              width: 1,
              type: 'solid'
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            type: 'scatter',
            symbol: 'rect',
            symbolSize: 8,
            clip: true,
            itemStyle: {
              color: '#333'
            },
            data: [this.enData],
            label: {
              show: true,
              formatter: function (param) {
                // console.log(param)
                const str = '{a|(E量表：' + param.value[0] + ';}{b|N量表：' + param.value[1] + ')}'
                return str
              },
              position: 'bottom',
              rich: {
                a: {
                  color: '#333',
                  align: 'center'
                },
                b: {
                  fontSize: 12,
                  color: '#333'
                }
              }
            },
            markLine: {
              symbolSize: 0,
              label: {
                show: false
              },
              lineStyle: {
                color: '#34B7B9',
                type: 'solid'
              },
              data: [{
                yAxis: 61.5,
                lineStyle: {
                  type: 'dashed'
                }
              }, {
                yAxis: 56.7,
                lineStyle: {
                  type: 'solid'
                }
              }, {
                yAxis: 50,
                lineStyle: {
                  type: 'solid'
                }
              }, {
                yAxis: 43.3,
                lineStyle: {
                  type: 'solid'
                }
              }, {
                yAxis: 38.5,
                lineStyle: {
                  type: 'dashed'
                }
              }, {
                xAxis: 61.5,
                lineStyle: {
                  type: 'dashed'
                }
              }, {
                xAxis: 56.7,
                lineStyle: {
                  type: 'solid'
                }
              }, {
                xAxis: 50,
                lineStyle: {
                  type: 'solid'
                }
              }, {
                xAxis: 43.3,
                lineStyle: {
                  type: 'solid'
                }
              }, {
                xAxis: 38.5,
                lineStyle: {
                  type: 'dashed'
                }
              }]
            },
            markArea: {
              z: 0,
              itemStyle: {
                color: 'rgba(52, 183, 185, 0.26)'
              },
              data: [
                [
                  {
                    yAxis: 61.5
                  },
                  {
                    yAxis: 38.5
                  }
                ],
                [
                  {
                    yAxis: 56.7
                  },
                  {
                    yAxis: 43.3
                  }
                ],
                [
                  {
                    xAxis: 61.5
                  },
                  {
                    xAxis: 38.5
                  }
                ],
                [
                  {
                    xAxis: 56.7
                  },
                  {
                    xAxis: 43.3
                  }
                ]
              ]
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>

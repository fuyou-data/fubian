<template>
  <div>
    <div ref="chart" :style="{width:'100%',height: '280px'}"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'barChart',
  props: {
    data: Array
  },
  data () {
    return {
      mobile: '',
      fontSize: 12,
      width: 45
    }
  },
  watch: {
    mobile (neValue) {
      if (neValue) {
        this.fontSize = 10
        this.width = 35
        this.init()
      } else {
        this.fontSize = 12
        this.width = 45
        this.init()
      }
    }
  },
  mounted () {
    this.mobile = window.matchMedia('(max-width: 500px)').matches
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.chart)
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '14%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          axisLine: {
            // 坐标轴 轴线
            show: false // 是否显示
          },
          axisTick: {
            show: false
          },
          splitLine: { // 水平线
            show: true,
            lineStyle: {
              color: ['#E5E5E5'],
              type: 'dashed'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
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
            axisTick: {
              show: true,
              length: 3, // 长度
              inside: false // 是否朝内
            }
          },
          {
            type: 'category',
            axisLine: {
              // 坐标轴 轴线
              show: false
            },
            axisLabel: {
              show: false,
              textStyle: {
                color: '#333333' // 坐标值得具体的颜色
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        dataset: {
          source: this.data
        },
        series: [
          {
            xAxisIndex: 0,
            type: 'bar',
            barWidth: '25%',
            seriesLayoutBy: 'row',
            label: {
              normal: {
                formatter: function (param) {
                  const str = '{a|' + param.seriesName + ':}{b|' + param.value[1] + '}\n {c|' + param.dimensionNames[2] + ':}{d|' + param.value[2] + '}'
                  return str
                },
                rich: {
                  a: {
                    fontSize: this.fontSize,
                    color: '#333',
                    align: 'center',
                    width: this.width,
                    lineHeight: 14,
                    padding: [0, 0, 45, 0]
                  },
                  b: {
                    fontSize: this.fontSize,
                    color: '#333',
                    lineHeight: 14,
                    padding: [0, 0, 45, 0]
                  },
                  c: {
                    fontSize: this.fontSize,
                    color: '#333',
                    align: 'center',
                    width: this.width,
                    lineHeight: 14,
                    padding: [25, 0, 70, 0]
                  },
                  d: {
                    fontSize: this.fontSize,
                    color: '#333',
                    lineHeight: 14,
                    padding: [25, 0, 70, 0]
                  }
                },
                show: true, // 开启显示
                position: 'bottom', // 在上方显示
                textStyle: { // 数值样式
                  color: '#333',
                  fontSize: 14
                }
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(52, 183, 185, 0.5)'
              }
            }
          },
          {
            xAxisIndex: 1,
            type: 'bar',
            barWidth: '15%',
            seriesLayoutBy: 'row',
            itemStyle: {
              normal: {
                color: '#34B7B9',
                formatter: function (param) {
                  console.log(param)
                }
              }
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

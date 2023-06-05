<template>
  <div ref="chart" class="result-chart"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Chart',
  props: {
    data: Array,
    isMobile: Boolean,
    xAxis: Array
  },
  data () {
    return {
      deg: 0,
      mobile: '',
      maxValue: 0,
      left: '5%'
    }
  },
  watch: {
    mobile (neValue) {
      if (neValue) {
        this.deg = 45
        this.left = '10%'
        this.maxValue = this.xAxis.length > 5 ? (5 / this.xAxis.length) * 100 : 100
        this.init()
      } else {
        this.deg = 45
        this.left = '5%'
        this.maxValue = 100
        this.init()
      }
    }
  },
  mounted () {
    this.mobile = window.matchMedia('(max-width: 500px)').matches
    // console.log(this.mobile)
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.chart)
      // 使用刚指定的配置项和数据显示图表。
      const normalOption = {
        animation: false,
        title: {
          text: '因子折线图：',
          padding: [10, 0, 0, 0],
          textStyle: {
            fontSize: 14
          }
        },
        grid: {
          left: this.left,
          right: 0,
          bottom: '40%',
          containLable: true
        },
        xAxis: {
          type: 'category',
          data: this.xAxis,
          axisLabel: {
            interval: 0,
            formatter: function (value) {
              let ret = '' // 拼接加\n返回的类目项
              const maxLength = 8 // 每项显示文字个数
              const valLength = value.length // X轴类目项的文字个数
              const rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
              if (rowN > 1) { // 如果类目项的文字大于5
                for (var i = 0; i < rowN; i++) {
                  var temp = '' // 每次截取的字符串
                  var start = i * maxLength // 开始截取的位置
                  var end = start + maxLength // 结束截取的位置
                  temp = value.substring(start, end) + '\n'
                  ret += temp // 凭借最终的字符串
                }
                return ret
              } else {
                return value
              }
            },
            rotate: this.deg,
            align: 'center',
            margin: 50,
            textStyle: {
              fontSize: 10,
              color: '#333333'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#E5E5E5'
            }
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        dataZoom: [{
          type: 'inside',
          zoomLock: true,
          moveOnMouseMove: true,
          preventDefaultMouseMove: false,
          show: false,
          realtime: true,
          xAxisIndex: [0],
          start: 0,
          end: this.maxValue
        }],
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333'
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: ['#E5E5E5'],
              type: 'dashed'
            }
          }
        }
      }
      if (this.Mobile) {
        normalOption.xAxis.axisLabel.rotate = 45
        normalOption.title.textStyle.fontSize = 14
      }
      const lineOption = {
        symbol: 'circle',
        symbolSize: 1,
        label: {
          show: true
        },
        itemStyle: {
          borderWidth: 0,
          color: '#707070'
        },
        lineStyle: {
          color: '#707070',
          width: 1
        }
      }
      myChart.setOption({
        ...normalOption,
        series: [{
          data: this.data,
          type: 'line',
          ...lineOption
        }]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.result-chart {
  width: 100%;
  height: 280px;
  margin-top: 15px;
}
@media screen and (max-width: 576px) {
  .result-chart {
    height: 280px;
  }
}
</style>

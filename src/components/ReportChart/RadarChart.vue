<template>
  <div>
    <div ref="echarts" style="width:100%; height:300px"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      myChart: '',
      radarData: [],
      indicator: [],
      mobile: ''
    }
  },
  props: {
    report: Array
  },
  // created () {
  //   this.$nextTick(() => {
  //     this.init()
  //   })
  // },
  mounted () {
    this.mobile = window.matchMedia('(max-width: 500px)').matches
    this.radarData = this.report.map(item => {
      return item.totalScore
    })
    this.indicator = this.report.map(item => {
      return {
        name: item.factor,
        max: item.referenceScoreScope.maxScore
      }
    })
    this.init()
    // // 监听窗口的变化
    // var that = this
    // window.addEventListener('resize', function () {
    //   that.myChart.resize()
    // })
  },
  methods: {
    init () {
      this.myChart = echarts.init(this.$refs.echarts)
      this.myChart.setOption({
        title: {
          text: ['{b|0}'],
          left: 'center',
          top: '49%',
          textAlign: 'left',
          textStyle: {
            rich: {
              b: {
                fontSize: this.mobile ? 10 : 12,
                color: '#999',
                lineHeight: 1
              }
            }
          }
        },
        radar: {
        // shape: 'circle',
          name: {
            rich: {
              a: {
                fontSize: this.mobile ? 10 : 14,
                color: '#333636',
                align: 'center',
                lineHeight: this.mobile ? 14 : 16
              },
              b: {
                color: '#999',
                fontSize: this.mobile ? 10 : 12,
                align: 'center'
              },
              triggerEvent: true
            },
            formatter: (text, value) => {
              var result = '' // 拼接加\n返回的类目项
              var maxLength = this.mobile ? 8 : 15 // 每项显示文字个数
              var valLength = text.length // X轴类目项的文字个数
              var rowNumber = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
              if (rowNumber > 1) { // 如果文字大于3,
                for (var i = 0; i < rowNumber; i++) {
                  var temp = '' // 每次截取的字符串
                  var start = i * maxLength // 开始截取的位置
                  var end = start + maxLength // 结束截取的位置
                  temp = text.substring(start, end) + '\n'
                  result += temp // 拼接生成最终的字符串
                }
                return `{a|${result}}{b|${value.max}}`
              } else {
                return `{a|${text}}\n{b|${value.max}}`
              }
            }
          },
          center: ['50%', '50%'],
          splitNumber: 4,
          splitArea: {
            areaStyle: {
              color: ['transparent']
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#E5E5E5'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E5E5E5'
            }
          },
          radius: this.mobile ? '50%' : '70%',
          indicator: this.indicator
        },
        series: [{
          type: 'radar',
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: '#34B7B9'
            }
          },
          areaStyle: {
            normal: {
              color: 'rgba(19, 173, 255, 0.5)',
              opacity: 0
            }
          },
          lineStyle: {
            normal: {
              color: '#34B7B9',
              width: 2
            }
          },
          label: {
            normal: {
              show: true,
              color: '#34B7B9',
              position: 'top'
            }
          },
          data: [this.radarData]
        }]
      })
    }
  }
}
</script>

<style>

</style>

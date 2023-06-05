<template>
  <div>
    <div ref="radar" style="width:100%;height:250px"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'radar',
  props: {
    radarData: Array,
    indicator: Array
  },
  data () {
    return {
      mobile: ''
    }
  },
  watch: {
    // mobile (neValue) {
    //   if (neValue) {
    //     this.center = ['50%', '65%']
    //     this.left = '49%'
    //     this.init()
    //   } else {
    //     this.center = ['20%', '65%']
    //     this.left = '19.6%'
    //     this.init()
    //   }
    // }
  },
  mounted () {
    this.mobile = window.matchMedia('(max-width: 500px)').matches
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init () {
      const myChart = echarts.init(this.$refs.radar)
      const maxNum = this.indicator[0].max
      myChart.setOption({
        title: {
          text: ['{b|0}'],
          left: '49%',
          top: '65%',
          padding: [0, 10, 10, 0],
          textAlign: 'left',
          textStyle: {
            rich: {
              b: {
                fontSize: 12,
                color: '#999',
                lineHeight: 1
              }
            }
          }
        },
        radar: {
          shape: 'polygon',
          splitNumber: 4,
          name: {
            rich: {
              a: {
                fontSize: 14,
                color: '#333333',
                lineHeight: '20'
              },
              b: {
                color: '#999',
                fontSize: 10,
                padding: [0, 0, 0, 0]
              },
              triggerEvent: true
            },
            formatter: (a) => {
              return `{a| ${a}}\n{b| ${maxNum}}`
            }
          },
          center: ['50%', '65%'],
          radius: '80%',
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
          data: [
            this.radarData
          ]
        }]
      })
    }
  }
}
</script>

<style>

</style>

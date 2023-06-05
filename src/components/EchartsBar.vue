<template>
  <div class="echartsBar" style="margin-top:20px">
    <div ref="echarts" :style="{width:'100%',height:height}"></div>
    <slot></slot>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'EchartsBar',
  data () {
    return {

    }
  },
  props: {
    dataX: Array,
    dataY1: Array,
    dataY2: Array,
    legend: Array,
    height: String
  },
  mounted () {
  },
  methods: {
    initBar () {
      const myChart = echarts.init(this.$refs.echarts)
      myChart.setOption({
        title: {
          text: '暂无数据',
          show: this.dataX.length === 0,
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#777',
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'none'
          },
          backgroundColor: '#fff',
          borderRadius: 4,
          extraCssText: 'box-shadow:0px 0px 5px 2px rgba(170,170,170,0.51);',
          formatter: function (params) {
            return (
              `<div style="padding:5px 8px">
                <div style="color:#333;font-size:14px"> ${params.name}</div>
                <div style="color:#666;font-size:12px;display:flex;align-items:center">
                  <span style="display:inline-block;margin-right:5px;width:25px;height:16px;background-color:${params.color}"></span>
                  ${params.seriesName}
                  <span style="margin-left: 8px">${params.value} </span>
                </div>
              </div>`
            )
          }
        },
        legend: {
          top: '0%',
          left: '10px',
          icon: 'rect',
          data: this.legend,
          textStyle: {
            color: '#000',
            fontSize: 14
          }
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.dataX,
          axisLabel: {
            color: '#333333',
            formatter: function (value) {
              let ret = '' // 拼接加\n返回的类目项
              const maxLength = 5 // 每项显示文字个数
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
            interval: 0
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              // 设置x轴颜色
              color: '#CCCCCC'
            }
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#333333'
          },
          axisTick: {
            show: false
          },
          splitLine: { // 水平线
            show: true,
            lineStyle: {
              color: '#CCCCCC',
              type: 'dashed'
            }
          }
        },
        color: ['#59ACEC', '#E18036'],
        series: [
          {
            name: this.legend[0],
            type: 'bar',
            data: this.dataY1,
            barMaxWidth: 30,
            barGap: '0%'
          },
          {
            name: this.legend[1],
            type: 'bar',
            data: this.dataY2,
            barMaxWidth: 30
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
.echartsBar{
  position: relative;
  .tipBar{
    position: absolute;
    left: 215px;
    top: 0;
    font-size: 14px;
  }
}
</style>

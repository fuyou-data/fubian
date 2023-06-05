<template>
  <div>
      <div>
        <el-select v-model="value" filterable size="mini" placeholder="请选择" @change="handleSelect" style="width:300px">
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <div ref="chart" style="width:100%;height:400px"></div>
      </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { DateFormat } from '@/utils/date'
export default {
  name: 'memberChart',
  props: {
    tableList: Array,
    options: Array
  },
  data () {
    return {
      DateFormat: DateFormat,
      value: '',
      score: [],
      date: [],
      result: [],
      isNormal: []
    }
  },
  methods: {
    handleSelect (e) {
      // this.$emit('selectTable', e)
      this.getChartData(e)
    },
    getChartData (e) {
      let data = []
      if (this.tableList) {
        this.tableList.forEach(v => {
          if (v.tableName === e) {
            data = v.statisticsResult
          }
        })
      }
      this.score = data.map(v => {
        return v.score
      })
      this.date = data.map(v => {
        return DateFormat({ date: v.timestamp * 1000, type: 'dayTime' })
      })
      this.result = data.map(v => {
        return v.result
      })
      this.isNormal = data.map(v => {
        if (v.level === 'normal') {
          return 1
        } else {
          return 0
        }
      })
      this.init()
    },
    init () {
      const myChart = echarts.init(this.$refs.chart)
      const result = this.result
      const isNormal = this.isNormal
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          borderRadius: 4,
          extraCssText: 'box-shadow:0px 0px 5px 2px rgba(170,170,170,0.51);',
          textStyle: {
            fontSize: 16,
            color: '#333'
          },
          formatter: function (params) {
            var seriesName = result[params[0].dataIndex]
            return (
              "<div style='padding:5px 8px;width:250px;white-space:normal;'>" +
              "<span style='color:#333;font-size:12px'>" +
              seriesName +
              '</span>' +
              '</div>'
            )
          },
          position: function (point, params, dom, rect, size) {
            // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
            // 提示框位置
            var x = 0 // x坐标位置
            var y = 0 // y坐标位置
            // 当前鼠标位置
            var pointX = point[0]
            var pointY = point[1]
            // 外层div大小
            // var viewWidth = size.viewSize[0];
            // var viewHeight = size.viewSize[1];
            // 提示框大小
            var boxWidth = size.contentSize[0]
            var boxHeight = size.contentSize[1]
            // boxWidth > pointX 说明鼠标左边放不下提示框
            if (boxWidth > pointX) {
              x = 5
            } else { // 左边放的下
              x = pointX - boxWidth
            }
            // boxHeight > pointY 说明鼠标上边放不下提示框
            if (boxHeight > pointY) {
              y = 5
            } else { // 上边放得下
              y = pointY - boxHeight
            }
            return [x, y]
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'none', // 默认为直线，可选为：'line' | 'shadow'
            shadowStyle: {
              color: 'rgba(229,98,44,.2)'
            }
          }
        },
        color: ['#0E9CFF'],
        grid: {
          left: 40,
          bottom: 30,
          right: 20,
          top: 40
        },
        xAxis: {
          type: 'category',
          data: this.date,
          axisLabel: {
            color: '#333333'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              // 设置x轴颜色
              color: '#EFF0F1'
            }
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          axisLabel: {
            color: '#333333'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              // 设置x轴颜色
              color: '#EFF0F1'
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            data: this.score,
            type: 'line',
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: function (params) {
                var colorIndex = isNormal[params.dataIndex]
                if (colorIndex === 0) {
                  return '#E18036'
                } else {
                  return '#0E9CFF'
                }
              }
            },
            smooth: 0.1
          }
        ]
      })
    }
  }
}
</script>

<style>

</style>

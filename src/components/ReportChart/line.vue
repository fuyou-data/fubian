<template>
  <div>
    <div ref="echarts" style="width:100%;height:250px"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'line',
  data () {
    return {
      nameLocation: 'end',
      bottom: '10%',
      right: '10%',
      mobile: ''
    }
  },
  props: {
    lineDataX: Array,
    lineDataY: Array
  },
  watch: {
    mobile (neValue) {
      if (neValue) {
        this.nameLocation = 'center'
        this.bottom = '15%'
        this.right = '2%'
        this.init()
      } else {
        this.nameLocation = 'end'
        this.bottom = '10%'
        this.right = '10%'
        this.init()
      }
    }
  },
  mounted () {
    this.mobile = window.matchMedia('(max-width: 500px)').matches
    this.init()
  },
  methods: {
    init () {
      const myChart = echarts.init(this.$refs.echarts)
      myChart.setOption({
        grid: {
          top: '15%',
          left: '2%',
          right: this.right,
          bottom: this.bottom,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          name: '测试进程',
          nameLocation: this.nameLocation,
          nameTextStyle: {
            color: '#333',
            fontSize: 14
          },
          boundaryGap: true,
          axisLine: { // 坐标轴轴线相关设置。数学上的x轴
            show: true,
            lineStyle: {
              color: '#E5E5E5',
              type: 'dashed'
            }
          },
          axisLabel: { // 坐标轴刻度标签的相关设置
            show: false
          },
          axisTick: {
            show: false
          },
          interval: 1,
          data: this.lineDataX
        }],
        yAxis: [{
          type: 'value',
          name: '波动值',
          nameTextStyle: {
            color: '#333',
            fontSize: 14,
            padding: [0, 20, 0, 0]
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E5E5E5',
              type: 'dashed'
            }
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#333333'
            }
          },
          axisTick: {
            show: false
          }
        }],
        series: [{
          type: 'line',
          smooth: true, // 是否平滑曲线显示
          symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
          symbolSize: 0,
          lineStyle: {
            normal: {
              color: '#34B8BA', // 线条颜色
              width: 3
            }
          },
          label: {
            show: false
          },
          areaStyle: { // 区域填充样式
            normal: {
              color: '#d4efef'
            }
          },
          data: this.lineDataY
        }]
      })
    }
  }
}
</script>

<style>

</style>

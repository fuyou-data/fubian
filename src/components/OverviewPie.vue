<template>
  <div ref="echarts" :style="{width:'100%',height:height,padding:padding}"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'EchartsPie',
  data () {
    return {
      samll: '',
      radius: []
    }
  },
  props: {
    dataPie: Array,
    dataColors: Array,
    title: String,
    height: String,
    padding: String
  },
  mounted () {
    this.samll = window.matchMedia('(max-width: 1500px)').matches
    this.init()
  },
  watch: {
    samll (neValue) {
      if (neValue) {
        this.radius = [40, 75]
        this.init()
      } else {
        this.radius = [55, 100]
        this.init()
      }
    }
  },
  methods: {
    init () {
      const myChart = echarts.init(this.$refs.echarts)
      myChart.setOption({
        title: {
          text: this.title,
          textStyle: {
            fontSize: 14,
            color: '#666'
          },
          left: 'center',
          top: '32%'
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: '#fff',
          borderRadius: 4,
          extraCssText: 'box-shadow:0px 0px 5px 2px rgba(170,170,170,0.51);',
          formatter: function (params) {
            return (
              `<div style="padding:5px 8px">${params.marker}
                <span style="color:#333;font-size:12px">${params.value.name}
                  <span style="margin-left:10px">${params.value.value}人</span>
                  <span style="margin-left:10px;color:${params.color}">${params.percent}%</span>
                </span>
              </div>`
            )
          }
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: '75%',
          selectedMode: false,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: '#000'
          }
        },
        color: this.dataColors,
        dataset: [{ source: this.dataPie }],
        series: [
          {
            name: '姓名',
            type: 'pie',
            radius: this.radius,
            center: ['50%', '35%'],
            label: {
              normal: {
                show: false,
                position: 'inside',
                formatter: '{d}%',
                textStyle: {
                  align: 'center',
                  fontSize: 12,
                  color: '#fff'
                }
              }
            },
            labelLine: {
              show: false
            }
          }
        ]
      })
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <!-- infoPie.height -->
    <div ref="pieEchart" :style="{width: width, height: height}"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {}
  },
  props: {
    // legendData: {
    //   type: Array
    // },
    dataPie: {
      type: Array
    },
    width: {
      type: String
    },
    height: {
      type: String
    }
  },
  watch: {
    dataPie: {
      handler: function (val, oldVal) {
        this.initChart()
        // console.log(val, oldVal)
      },
      deep: true
    }
  },
  mounted () {
    setTimeout(() => {
      this.$nextTick(() => {
        this.initChart()
      })
    }, 3)
  },
  methods: {
    initChart () {
      const pieChart = this.$refs.pieEchart
      if (pieChart) {
        this.myChart = echarts.init(pieChart)
        const mdataList = this.dataPie
        const legendHeight = this.dataPie.length === 6 ? 143 : 143
        const color = ['#00D688', '#59ECD3', '#59ACEC', '#595EEC', '#E136D0', '#E1367C', '#C0E136', '#E1C436', '#E18036', '#E13636']
        let total = 0
        const target = new Map()
        mdataList.forEach((item, i) => {
          // 计算value的和，用来算百分比
          total += Number(item.value)
          target.set(item.name, item.value)
        })
        this.myChart.setOption(
          {
            title: [{
              text: '{name|' + '总人数' + '}\n{val|' + total + '人}',
              top: '21%',
              left: '40%',
              textStyle: {
                rich: {
                  name: {
                    fontSize: 14,
                    lineHeight: 22,
                    fontFamily: 'PingFangSC - Medium, PingFang SC',
                    fontWeight: '400',
                    color: '#333',
                    padding: [10, 0]
                  },
                  val: {
                    fontSize: 16,
                    lineHeight: 22,
                    fontWeight: '500',
                    fontFamily: 'PingFangSC - Medium, PingFang SC',
                    color: '#34B7B9',
                    align: 'center'
                  }
                }
              }
            }],
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                //  console.log(params)
                var result =
                  '<div style="display:flex;width:250px;white-space:normal;align-items:center;padding:5px 2px">' +
                  params.marker +
                  params.name +
                  '：&nbsp;' +
                  params.percent +
                  '%</div>'
                return result
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
              }
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              x: 12,
              // top: 168,
              bottom: 34,
              height: legendHeight,
              pageIconColor: '#34B7B9', // 翻页箭头颜色
              pageButtonPosition: 'end',
              pageTextStyle: {
                color: '#999' // 翻页数字颜色
              }, // 翻页数字设置
              pageIconSize: 13,
              icon: 'circle',
              itemHeight: '8',
              formatter: function (name, value) {
                const iname = target.get(name)
                const ivalue = target.get(value)
                const lists = ['{a|' +
                echarts.format.truncateText(
                  name,
                  160,
                  '14px Microsoft Yahei',
                  '…'
                ) + '}{c|' + iname + '}{d|' + ivalue + '}']
                // lists.push(name + '  |  ' + ival + '-' + vnum + '%')
                return lists
              },
              tooltip: {
                show: true
              },
              textStyle: {
                rich: {
                  a: {
                    fontSize: 12,
                    color: color,
                    width: 170
                  },
                  c: {
                    color: color,
                    fontSize: 12,
                    align: 'left',
                    width: 80
                  },
                  d: {
                    color: '#999',
                    align: 'left',
                    fontSize: 12
                  }
                }
              }
            },
            dataset: [{ source: this.dataPie }],
            series: [
              {
                name: '',
                type: 'pie',
                radius: ['35%', '58%'],
                center: ['50%', '27%'],
                itemStyle: {
                  // 每块之间留缝隙
                  // normal: {
                  //   borderWidth: 6,
                  //   borderColor: '#fff'
                  // },
                  emphasis: {
                    borderWidth: 0,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                // labelLine: {
                //   normal: {
                //     length: 20,
                //     length2: 120
                //   }
                // },
                label: {
                  normal: {
                    formatter: function (params) {
                      if (params.percent !== 0) {
                        return ('{percent|' + params.percent.toFixed(0) + '%}')
                      } else {
                        return ('')
                      }
                    },
                    position: 'inner',
                    rich: {
                      percent: {
                        fontSize: 14,
                        color: '#fff'
                      }
                    }
                  }
                }
              }
            ],
            color: color
          }
        )
      }
    }
  }
}
</script>

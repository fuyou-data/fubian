<template>
  <div class="overview">
      <div class="o_top">
        <div class="o_data">
          <div class="every">
            <div class=".tips">总人数</div>
            <div class="number">{{detailData.totalNumberOfPeople}}</div>
          </div>
          <div class="every">
            <div class="tips">批次</div>
            <div class="number">{{detailData.batchNumber}}</div>
          </div>
          <div class="every">
            <div class="tips">已完成测试次数</div>
            <div class="number">{{detailData.numberOfCompleted}}</div>
          </div>
        </div>
        <div class="echarts" v-for="(item, index) in dataList" :key="index+'_only'">
          <EchartsPie :dataPie="item.dataList" :dataColors="colorList[index]" :title="title[index]" :height="'329px'" :padding="'0 10px'"></EchartsPie>
        </div>
      </div>
      <div class="o_bottom">
        <h2>测试数据概览</h2>
        <EchartsBar ref="echartsBar" :dataX="dataX" :dataY1="dataY1" :dataY2="dataY2" :legend="legend" :height="'440px'">
            <div class="tipBar">（仅展示批次内有总分的量表异常数量）</div>
        </EchartsBar>
      </div>
  </div>
</template>

<script>
import EchartsPie from '@/components/OverviewPie.vue'
import EchartsBar from '@/components/EchartsBar.vue'
import { pieData, barData, batchMine } from '@/api/index'
export default {
  name: 'overview',
  components: {
    EchartsPie,
    EchartsBar
  },
  data () {
    return {
      detailData: {},
      dataList: [],
      colorList: [
        ['#E1367C', '#59ACEC', '#E1C436'],
        ['#E1367C', '#59ACEC', '#E18036', '#595EEC', '#C0E136', '#E1C436'],
        ['#00D688', '#59ECD3', '#59ACEC', '#595EEC', '#E136D0', '#E1367C', '#C0E136', '#E18036', '#E1C436'],
        ['#E1367C', '#59ACEC', '#E18036', '#595EEC', '#C0E136', '#E1C436']
      ],
      title: ['性别占比', '婚姻状态', '文化程度', '年龄'],
      legend: ['已完成量表数', '异常数'],
      dataX: [],
      dataY1: [],
      dataY2: []
    }
  },
  mounted () {
    this.init()
    this.getInfo()
  },
  methods: {
    init () {
      pieData().then(res => {
        this.detailData = res.data
        this.dataList = res.data.data
      })
    },
    // 侧边栏的数据
    async getInfo () {
      const res = await batchMine({})
      const orgName = res.data.orgName
      this.barData(orgName)
    },
    barData (orgName) {
      barData({ orgName: orgName }).then(res => {
        const batchData = res.data.batchData
        if (batchData) {
          this.dataX = batchData.map(v => {
            return v.batchName
          })
          this.dataY1 = batchData.map(v => {
            return v.numberOfCompletedTable
          })
          this.dataY2 = batchData.map(v => {
            return v.abnormalNumber
          })
        } else {
          this.dataX = []
          this.dataY1 = []
          this.dataY2 = []
        }
        this.$nextTick(() => {
          this.$refs.echartsBar.initBar()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.overview{
  margin-left: 20px;
  margin-top: 20px;
  .o_top{
    width: 100%;
    display: flex;
    .o_data{
      width: 190px;
      height: 329px;
      background: #FFFFFF;
      box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 49px 24px;
      .every{
        white-space: nowrap;
        .tips{
          font-size: 16px;
          color: #333333;
          height: 22px;
          line-height: 1;
        }
        .number{
          height: 26px;
          font-size: 20px;
          font-weight: bold;
          line-height: 1;
          color: #34B7B9;
          margin-top: 5px;
        }
      }
    }
    .echarts{
      width: 248px;
      min-width: 194px;
      background: #FFFFFF;
      box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
      margin-left: 16px;
    }
    .echarts:last-child{
      margin-right: 20px;
    }
  }
  .o_bottom{
    margin-top: 50px;
    max-width: 1300px;
    h2{
      height: 26px;
      font-size: 20px;
      font-weight: bold;
      line-height: 26px;
      color: #34B7B9;
    }
    .selectDiv{
      margin-top: 15px;
      .tips{
        font-size: 14px;
        color: #999;
        margin-left: 15px;
      }
    }
  }
}
</style>

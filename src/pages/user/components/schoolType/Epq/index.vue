<template>
  <div>
    <!-- <div class="tips">本量表结果不适用于16岁以下的人群，结果不准确，仅供参考。</div>
    <div class="tips">您的L量表标准T分≥70分，测验结果无效！</div> -->
    <!-- epq上面的柱状图和一个小表格 -->
    <div class=" report-block">
      <div class="tips" v-for=" (item, index) in EpqData.warmTips" :key="index">
        <img style="width:15px;height:13px;margin-right:5px" src="@/assets/img/warning.png" alt="warning">
        {{item}}
      </div>
      <div>
        <h3>得分与平均分图</h3>
        <barChart :data="data"></barChart>
      </div>
      <div>
        <h3 class="">标准T分与分析</h3>
        <table class="table1" border="1">
          <tr class="head"><th>分量表</th><th style="width: 60px;">您的T分</th><th>分析/指导意见</th></tr>
          <tr v-for="item in EpqData.scoreFactors" :key="item.subScale">
            <td>{{item.subScale}}</td>
            <td>{{item.tScore}}</td>
            <td>{{item.analysis}}</td>
          </tr>
      </table>
      </div>
    </div>
    <div  class="report-block">
      <!-- epq下面的E-N关系图和一个小表格在一起 -->
      <div>
        <h3>E-N关系图</h3>
        <div class="scatClass">
        <span class="scat1">抑郁质（内向情绪不稳）</span>
        <span class="scat2">胆汁质（外向情绪不稳）</span>
        <span class="scat3">黏液质（内向情绪稳定）</span>
        <span class="scat4">多血质（外向情绪稳定）</span>
        <scatChart :enData="enData"></scatChart>
        </div>
      </div>
    <table class="table1 table2" border="1">
      <tr class="head"><th>E量表T分</th><th>E量表类型</th><th> N量表T分</th><th>N量表类型</th><th>气质类型</th><th>分析/指导意见</th></tr>
      <tr>
        <td>{{EpqData.portfolioDiagram.eScore}}</td>
        <td>{{EpqData.portfolioDiagram.eType}}</td>
        <td>{{EpqData.portfolioDiagram.nScore}}</td>
        <td>{{EpqData.portfolioDiagram.nType}}</td>
        <td>{{EpqData.portfolioDiagram.typeOfTemperament}}</td>
        <td>{{EpqData.portfolioDiagram.analysis}}</td>
      </tr>
    </table>
    </div>
  </div>
</template>

<script>
import barChart from './bar_chart'
import scatChart from './scat_chart'
export default {
  name: 'Epq',
  components: {
    barChart,
    scatChart
  },
  props: {
    report: Object
  },
  data () {
    return {
      data: [
        ['product'],
        ['得分'],
        ['平均分']
      ],
      enData: [],
      EpqData: {}
    }
  },
  created () {
    this.EpqData = this.report.detail.epqReport
  },
  mounted () {
    this.EpqData.scoreFactors.forEach(v => {
      this.data[0].push(v.subScale)
      this.data[1].push(v.score)
      this.data[2].push(v.normAverageScore)
    })
    this.enData = [this.EpqData.portfolioDiagram.eScore, this.EpqData.portfolioDiagram.nScore]
  }
}
</script>

<style lang="less" scoped>
.tips{
  height: 16px;
  font-size: 14px;
  line-height: 16px;
  color: #DB0000;
  margin: 10px 0;
  display: flex;
  align-items: center;
}
h3{
  font-size: 14px;
  font-weight: bold;
  height: 14px;
  line-height: 14px;
  padding-bottom: 22px;
  padding-top: 40px;
}
.table1 {
    width: 100%;
    padding-top: 1rem;
    .head{
        font-weight: bold;
    }
    th {
      height: 58px;
      line-height: 58px;
      text-align: center;
      background-color: #D6E2EE;
      border-color: #000;
      white-space: nowrap;
    }
    td {
      height: 40px;
      border-color: #000;
      padding: 10px 0.5rem;
      text-align: center;
      white-space: nowrap;
    }
    td:last-child{
      padding: 0;
      text-align: left;
      white-space: normal;
    }
}
.scatClass{
  position: relative;
  span{
    position: absolute;
    font-size: 14px;
  }
  .scat1{
    left: 60px;
    top: 35px;
  }
  .scat2{
    right: 60px;
    top: 35px;
  }
  .scat3{
    left: 60px;
    bottom: 65px;
  }
  .scat4{
    right: 60px;
    bottom: 65px;
  }
}
@media screen and (max-width: 576px) {
  .table1{
    th,td{
      white-space: normal;
    }
  }
  .scatClass{
    span{
      width: 72px;
      font-size: 14px;
    }
    .scat1{
      left: 50px;
      top: 35px;
    }
    .scat2{
      right: 35px;
      top: 35px;
    }
    .scat3{
      left: 35px;
      bottom: 65px;
    }
    .scat4{
      right: 50px;
      bottom: 65px;
    }
  }
}
</style>

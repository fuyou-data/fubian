<template>
  <div class="my-mmpi">
    <div class="each-table" v-for="(it, index) in report.detail.mpiReportDetail.mmpiFactorTypes" :key="index" :class="{'report-block':index === 0}">
      <div v-if="index === 0">
        <div class="tips" v-for="it in report.detail.mpiReportDetail.warmTips" :key="it">
        <img style="width:15px;height:13px;margin-right:5px" src="@/assets/img/warning.png" alt="warning">
        {{it}}
      </div>
      </div>
      <div class="space" :class="{'report-block':index !== 0}"></div>
      <div class="title" :class="{'report-block':index !== 0}">{{it.subScaleType}}</div>
      <table class="table1">
        <tr :class="{'report-block':index !== 0}">
          <td class="one">量表</td>
          <td class="two">您的原始分</td>
          <td class="three">您的标准T分</td>
          <td class="four">您的得分状态</td>
          <td class="five">分析/指导意见</td>
        </tr>
        <tr v-for="item in it.mmpiScoreFact" :key="item" :class="{'report-block':index !== 0}">
          <td class="one">{{item.subScale}}</td>
          <td class="two">{{item.score}}</td>
          <td class="three">{{item.tScore}}</td>
          <td class="four">{{item.scoreStatus}}</td>
          <td class="five">{{item.analysis}}</td>
        </tr>
      </table>
      <div class="report-block under-line" v-if="index !== 0"></div>
      <div class="space" :class="{'report-block':index !== 0}"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mmpi',
  props: {
    report: Object
  },
  data () {
    return {
      mmpiLength: [],
      mmpi: []
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.my-mmpi{
  .each-table{
    padding: 0 1px;
    width: 100%;
    overflow-x: auto;
    .tips{
      display: flex;
      align-items: center;
      line-height: 18px;
      padding-top: 1rem;
      color: #DB0000;
    }
    .space{
      height: 1rem;
      width: 100%;
    }
    .under-line{
      position: relative;
      height: 1rem;
      border-top: 1px solid #707070;
      z-index: -1;
    }
    .title{
      min-width: 600px;
      height: 3.25rem;
      width: 100%;
      border-color: #707070;
      border-style: solid;
      border-width: 1px 1px 0 1px;
      font-size: 16px;
      font-weight: 700;
      line-height: 3.25rem;
      text-align: center;
      background-color: #D6E2EE;
    }
    .table1{
      min-width: 600px;
      border-bottom: 1px solid #707070;
      tr {
        border: 1px solid #707070;
        .one{
          width: 90px;
        }
        .two{
          width: 100px;
        }
        .three{
          width: 80px;
        }
        .four{
          width: 80px;
        }
        .six{
          width: 400px;
        }
        td{
          text-align: center;
          border-right: 1px solid #707070;
          border-bottom: 1px solid #707070;
          color: #000000;
          font-size: 14px;
        }
      }
    }
  }
}
</style>

<template>
<div class="scl">
  <div>
    <div class="report-block pb-4">
      <div class="scl-text">{{report.detail.analysis}}</div>
      <SclTableOne :tableData="report.detail.evalScores"></SclTableOne>
    </div>
    <div class="scrool-box">
      <SclTableTwo :tableData="report.detail.factorScores"></SclTableTwo>
    </div>
  </div>
  <div class="report-block pt-3">
    <div class="font-weight-bold">因子折线图：</div>
    <Chart :xAxis="returnSomething(report.detail.factorScores, 2)" :data="returnSomething(report.detail.factorScores, 1)"></Chart>
  </div>
</div>
</template>

<script>
import SclTableOne from './table_one'
import SclTableTwo from './table_two'
import Chart from '@/components/ReportChart/Chart'
export default {
  name: 'Scl',
  props: {
    report: Object
  },
  components: {
    SclTableOne,
    SclTableTwo,
    Chart
  },
  methods: {
    returnSomething (arr, type) {
      const newArr = arr || []
      if (type === 1) {
        const temp = []
        newArr.forEach(e => {
          temp.push(Number(e.meanScore))
        })
        return temp
      }
      if (type === 2) {
        const text = []
        newArr.forEach(e => {
          text.push(e.factor)
        })
        return text
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .scl{
    .scl-text{
      padding-top: 10px;
      padding-bottom: 1rem;
    }
    .scrool-box{
      overflow-x:auto;
      -webkit-overflow-scrolling: touch;
      .space{
        height: 2rem;
        width: 100%;
      }
    }
  }
</style>

<template>
  <div>
    <div class="report-block pb-3">
      <div class="hamd-text">{{ name }}因子分析：</div>
      <HamdTable :tableData="report.factorScores" :totalScore="report.totalScore"></HamdTable>
    </div>
    <div class="report-block">
      <div class="hamd-text">{{ name }}因子折线图</div>
      <Chart :xAxis="returnSomething(report.factorScores, 2)" :data="returnSomething(report.factorScores, 1)"></Chart>
    </div>
  </div>
</template>

<script>
import Chart from '@/components/ReportChart/Chart'
import HamdTable from './table.vue'
export default {
  name: 'fadi-common',
  props: {
    name: String,
    report: Object
  },
  components: {
    HamdTable,
    Chart
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    returnSomething (arr, type) {
      if (type === 1) {
        const temp = []
        arr.forEach(e => {
          temp.push(Number(e.meanScore))
        })
        return temp
      }
      if (type === 2) {
        const text = []
        arr.forEach(e => {
          text.push(e.factor)
        })
        return text
      }
    }
  }
}
</script>

<style lang="less" scoped>
// .hamd{
//   .hamd-score{
//     font-size: 14px;
//     font-weight: bold;
//   }
//   .hamd-text{
//     padding-bottom: 10px;
//     font-size: 14px;
//     font-weight: bold;
//   }
//   .r_tips{
//     font-size: 14px;
//     color: #777;
//   }
// }
</style>

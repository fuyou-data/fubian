<template>
  <div class="hamd">
    <div class="report-block pb-3">
      <normal-table
        :data="table01"
        :propsArray="[
          { label: '项目', prop: 'name', minWidth: '70px' },
          { label: '得分', prop: 'totalScore', textCenter: true, minWidth: '50px' },
          { label: '参考诊断', prop: 'result', minWidth: '65px' },
          { label: '分析', prop: 'analysis', minWidth: '110px' }
        ]">
      </normal-table>
    </div>
    <common name="汉密顿抑郁量表（HAMD）" :report="hamdReport"></common>
    <common name="汉密顿焦虑量表（HAMA）" :report="hamaReport"></common>
    <front-feature-score :frontFeatureScore="frontFeatureScore"></front-feature-score>
  </div>
</template>

<script>
import common from './common.vue'
import NormalTable from './normal-table.vue'
import FrontFeatureScore from './front-feature-score.vue'
export default {
  name: 'Hamd',
  props: {
    report: Object
  },
  components: {
    common,
    NormalTable,
    FrontFeatureScore
  },
  data () {
    return {
      table01: []
    }
  },
  computed: {
    frontFeatureScore () {
      return this.report.detail.frontFeatureScore
    },
    fadiReport () {
      return this.report.detail.fadiReport || {}
    },
    hamdReport () {
      return this.fadiReport.hamdReport || {}
    },
    hamaReport () {
      return this.fadiReport.hamaReport || {}
    }
  },
  mounted () {
    this.table01.push({
      name: '汉密顿抑郁量表（HAMD）',
      totalScore: this.hamdReport.totalScore,
      result: this.hamdReport.result,
      analysis: this.hamdReport.analysis
    })
    this.table01.push({
      name: '汉密顿焦虑量表（HAMA）',
      totalScore: this.hamaReport.totalScore,
      result: this.hamaReport.result,
      analysis: this.hamaReport.analysis
    })
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.hamd{
  /deep/.hamd-score{
    font-weight: 700;
  }
  /deep/.hamd-text{
    padding-bottom: 10px;
  }
  .r_tips{
    font-size: 14px;
    color: #777;
  }
}
</style>

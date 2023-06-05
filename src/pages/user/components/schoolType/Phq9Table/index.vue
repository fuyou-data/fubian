<template>
  <div class="phq report-block">
    <div class="phq-totalScore"><span class="font-weight-bold">总分：</span>{{report.detail.totalScore}}</div>
    <div class="phq-level"><span class="font-weight-bold">测评结果：</span>{{report.detail.level}}</div>
    <div class="font-weight-bold">选项展示：</div>
    <PhqTable :tableData="report.detail.topicScores"> </PhqTable>
    <div class="php-text">{{report.detail.analysis}}</div>
  </div>
</template>

<script>
import PhqTable from './table'
export default {
  name: 'Phq',
  props: {
    report: Object
  },
  components: {
    PhqTable
  }
}
</script>

<style lang="less" scoped>
.phq{
    .phq-totalScore{
      padding-top: 20px;
    }
    .phq-level{
      padding-bottom: 1rem;
    }
    .php-text{
      padding-top: 10px;
    }
  }
</style>

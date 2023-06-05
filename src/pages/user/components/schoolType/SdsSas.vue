<template>
<div class="sds report-block">
  <div class="sds-cuden"><span class="font-weight-bold">您的总粗分：</span>{{report.detail.roughScore}}</div>
  <div class="sds-stand"><span class="font-weight-bold">标准分数为：</span>{{report.detail.totalScore}}</div>
  <div class="sds-level"><span class="font-weight-bold">测评结果：</span>{{report.detail.level}}</div>
  <div class="sds-analyse"><span class="font-weight-bold">分析：</span>{{report.detail.analysis}}</div>
</div>
</template>

<script>
export default {
  name: 'SdsSas',
  props: {
    report: Object
  }
}
</script>

<style lang="less" scoped>
.sds {
  .sds-cuden {
    // margin-top: 2rem;
    margin-top: 20px;
  }

  .sds-level {
    margin-bottom: 20px;
  }
}
</style>

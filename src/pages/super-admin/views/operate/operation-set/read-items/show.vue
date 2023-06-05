<template>
<div class="show">
  <!-- <div class="title">复变联合机构报告</div> -->
  <div class="res"><span></span><span>测试结果</span></div>
    <div class="under-box">
      <span v-for=" item in insReportDisplayType" :key="item" v-show="item !== ''">{{item}}</span>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'read-show',
  computed: {
    ...mapState({
      insReportDisplayType: state => state.operate.insReportDisplayType
    })
  }
}
</script>
<style lang="less" scoped>
  .show{
    // font-family: Source Han Sans CN;
    .title{
      border-left: 5px solid #34B7B9;
      margin-left: 36px;
      font-size: 16px;
      color: #333333;
      font-weight: bold;
      padding-left: 12px;
      margin-bottom: 36px;
      height: 16px;
      line-height: 16px;
    }
    .res{
      margin-left: 36px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      color: #666666;
      span:first-child{
        width: 5px;
        height: 5px;
        background-color: #34B7B9;
      }
      span:last-child{
        margin-left: 12px;
      }
    }
    .under-box{
      margin-left: 42px;
      span{
        // read
        display: inline-block;
        margin: 0 29px;
        font-size: 14px;
        color: #666666;
      }
    }

  }
</style>

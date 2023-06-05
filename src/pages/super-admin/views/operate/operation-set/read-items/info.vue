<template>
  <div class="main">
    <el-form ref="form" size="small" label-position="right" label-width="150px" :hide-required-asterisk="true">
      <el-form-item label="量表名称：">
        <div style="display:flex;width: 90%;max-width: 800px;">
          <span class="span1">{{tableCnName}}</span>
          <span style="margin:0 3px;font-weight:600;color:#666">;</span>
          <span class="span1">{{tableEnName}}</span>
        </div>
      </el-form-item>
      <el-form-item label="自评分类：" prop="selfTableTypeId">
        <span class="span" style="white-space: pre-wrap;">{{selfTableType.name}}</span>
      </el-form-item>
      <!-- <el-form-item label="封面图片：" prop="tableLogo">
        <div class="avatar"><img v-if="tableLogo" :src="tableLogo"></div>
      </el-form-item>
      <el-form-item label="适用人群：" prop="applicablePeople">
        <span class="span" style="white-space: pre-wrap;">{{applicablePeople}}</span>
      </el-form-item>
      <el-form-item label="评估方向：" prop="evaluationDirection">
        <div class="div" style="white-space: pre-wrap;">{{evaluationDirection}}</div>
      </el-form-item>
      <el-form-item label="介绍：" prop="introduction">
        <span class="span" style="white-space: pre-wrap;">{{introduction}}</span>
      </el-form-item> -->
      <el-form-item label="预估耗时：" prop="minTimeMinute">
        <span v-if="minTimeMinute == maxTimeMinute" class="span">{{minTimeMinute}}分钟</span>
        <span v-else class="span">{{minTimeMinute}}-{{maxTimeMinute}}分钟</span>
      </el-form-item>
      <el-form-item label="是否配置温馨提示：" prop="tips">
        <div v-if="tips.length == 0" class="div">否</div>
        <div v-else class="div" v-for="(item, index) in tips" :key="item">{{index + 1}}.&nbsp;{{item}}</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      tableCnName: state => state.operate.tableCnName,
      tableEnName: state => state.operate.tableEnName,
      selfTableType: state => state.operate.selfTableType,
      minTimeMinute: state => state.operate.minTimeMinute,
      maxTimeMinute: state => state.operate.maxTimeMinute,
      tips: state => state.operate.tips
    }),
    tableCode () {
      return this.$route.query.tableCode
    }
  }
}

</script>

<style lang="less" scoped>
.main{
  padding: 0 40px;
}
.span{
  font-size: 14px;
  color: #666666;
  display: inline-block;
  width: 90%;
  max-width:700px;
  word-break: break-all;
}
.span1{
  font-size: 14px;
  color: #666666;
  display: inline-block;
}
.div{
  font-size: 14px;
  color: #666666;
  width: 90%;
  max-width: 800px;
}
.avatar{
  width: 100px;
  height: 100px;
  border: 1px solid #707070;
  img{
    width: 98px;
    height: 98px;
  }
}
</style>

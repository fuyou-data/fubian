<template>
  <div>
    <el-button class="btn-normal" type="success">设计尺寸</el-button>
    <el-button type="success" size="mini">改变尺寸</el-button>
    <el-button type="success">正常成功</el-button>
    <el-button plain>默认线条</el-button>
    <el-button type="success" plain>成功线条</el-button>
    <el-button type="success" disabled>禁用1</el-button>
    <el-button type="success" plain disabled>禁用2</el-button>
    <el-button plain disabled>禁用3</el-button>
    <el-button type="text">文字按钮</el-button>
    <el-button class="bg-green" type="text">文字型带背景</el-button>
    <el-button class="text-red" type="text">文字按钮</el-button>
    <el-button class="btn-whole-dashed">通栏虚线按钮</el-button>
    <alert-box :number="100">
      <div slot="after">
        <el-button class="btn-normal" type="success">导出</el-button>
      </div>
    </alert-box>
    <alert-box>
      <div slot="before">共有123个项目</div>
      <div slot="after">
        <el-button class="btn-normal" type="success">导出</el-button>
      </div>
    </alert-box>
  </div>
</template>

<script>
import AlertBox from '@/components/AlertBox'
export default {
  name: 'do',
  components: {
    AlertBox
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
</style>

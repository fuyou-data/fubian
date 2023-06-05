<template>
  <div class="popout" v-if="flag">
    <div class="popout_box">
      <div class="text">即将进行系统升级</div>
      <div class="text">*升级过程中系统将暂停使用</div>
      <slot name="btn"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'popout',
  props: {
    flag: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
.popout{
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  .popout_box{
    position: relative;
    border-radius: 8px;
    width: 440px;
    height: 232px;
    background-color: #FFFFFF;
    text-align: center;
    overflow: hidden;
    padding-top: 83px;
    .text{
      color: #666666;
    }
    .btns{
      margin-top: 31px;
      /deep/.cancel{
        border: 1px solid #34B7B8;
        color: #34B7B8;
      }
    }
  }
}
</style>

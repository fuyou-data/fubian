<template>
  <div class="popout" v-if="flag">
    <div class="popout_box">
      <div class="img"><img src="../../../../assets/img/right.png" alt=""></div>
      <div class="text">系统升级成功，请刷新页面查看</div>
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
    width: 600px;
    height: 302px;
    background-color: #FFFFFF;
    text-align: center;
    overflow: hidden;
    padding-top: 60px;
    .img{
      margin-bottom: 24px;
    }
    img{
      width: 90px;
      height: 90px;
    }
    .text{
      color: #666666;
    }
    .btns{
      margin-top: 16px;
    }
  }
}
</style>

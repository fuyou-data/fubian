<template>
  <div class="popout" v-if="flag">
    <div class="popout_box">
      <div class="img"><img src="../../../../assets/img/loading.png" alt=""></div>
      <div class="text">文件上传中请稍后</div>
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
    width: 390px;
    height: 232px;
    background-color: #FFFFFF;
    text-align: center;
    overflow: hidden;
    .img{
      margin-top: 64px;
      margin-bottom: 23px;
      img{
        width: 79px;
        height: 79px;
        animation:changeright 1s linear infinite;
      }
    }
    .text{
      color: #666666;
    }
  }
}
@keyframes changeright{
  0%{-webkit-transform:rotate(0deg);}
  50%{-webkit-transform:rotate(180deg);}
  100%{-webkit-transform:rotate(360deg);}
}
</style>

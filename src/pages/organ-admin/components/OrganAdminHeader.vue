<template>
  <header class="header">
    <div class="h-left">
      <icon-font  class="iconfont mr-2"  name="#mdd-logo2" :width="33" :height="33" color="34B7B9"> </icon-font>
      <h1 @click="goToPage('/overview')">复变云愈心理测评系统</h1>
    </div>
    <div class="logout" >
      <span @click="$router.push('ucenter')">个人中心</span>
      <span @click="logout()">退出登录</span>
    </div>
  </header>
</template>

<script>
import { postLogout } from '@/api/modules/login.js'
export default {
  name: 'MainHeader',
  data () {
    return {
      loginState: false,
      userInfo: {}
    }
  },
  created () {
  },
  updated () {
  },
  methods: {
    goToPage (pagePath) {
      this.$router.push({
        path: pagePath
      })
    },
    logout () {
      postLogout().then(res => {
        this.$notify({
          title: '成功',
          message: '退出成功',
          type: 'success',
          duration: 1000
        })
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.header {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 30px;
  top:0;
  left:0;
  width: 100%;
  z-index: 10;
  color: #fff;
  background-image: linear-gradient(90deg, #32BEC0 0%, #34D3C8 100%);
  box-sizing: border-box;
  overflow: hidden;
  &::after {
    content: "";
    position: absolute;
    right: -3vw;
    bottom: -7vw;
    width: 30vw;
    height: 30vw;
    background-image: linear-gradient(268deg, #32BEC0 0%, #36DCD1 100%);
    border-radius: 30vw;
  }
}
.h-left {
  display: flex;
  align-items: center;
  h1 {
    margin-bottom: 0;
    font-size: 16px;
    cursor: pointer;
  }
}
.logout {
  z-index: inherit;
  cursor: pointer;
  span:nth-child(1) {
    padding-right: 30px;
  }
}
</style>

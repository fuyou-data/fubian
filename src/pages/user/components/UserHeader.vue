<template>
  <header class="header" :class="{ 'bg-none': !bg }">
      <!-- <icon-font  class="iconfont mr-2"  name="#mdd-logo2" :width="28" :height="28" color="34B7B9"> </icon-font> -->
    <!-- <h1>{{ title }}</h1> -->
    <div class="header-r">
      <span v-if="ucenter" class="mr-3" @click="$router.push('/ucenter')">个人中心</span>
      <span v-if="logOut" class="mr-3" @click="loginOut">退出登录</span>
      <span v-if="name">{{ name }}</span>
    </div>
  </header>
</template>

<script>
import { postLogout as userLoginOut } from '@/api/modules/login'
export default {
  name: 'UserHeader',
  props: {
    bg: {
      type: Boolean,
      default: true
    },
    name: String,
    ucenter: {
      type: Boolean,
      default: false
    },
    logOut: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    title () {
      return '复变云愈心理测评系统'
    }
  },
  methods: {
    loginOut () {
      userLoginOut().then(
        res => {
          this.$notify({
            title: '成功',
            message: '退出成功',
            type: 'success',
            duration: 1000
          })
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
        }
      )
    },
    goToPage (pagePath) {
      this.$router.push({
        path: pagePath
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  position: fixed;
  top:0;
  left:0;
  width: 100%;
  height: 50px;
  padding: 0 50px 0 20px;
  background: linear-gradient(90deg, #32BEC0 0%, #34D3C8 100%);
  color: #fff;
  box-sizing: border-box;
  z-index: 10;
  h1 {
    font-size: 16px;
    margin-bottom: 0;
  }
  &::after {
    content: '';
    width: 30%;
    height: 100%;
    background: linear-gradient(268deg, #32BEC0 0%, #36DCD1 100%);
    position: absolute;
    z-index: -1;
    right: 0;
    clip-path: ellipse(50% 100px at 64% -40%);
  }
}
.header.bg-none {
  background: none;
  &::after {
    background: none;
  }
}
.header-r {
  flex: 1;
  text-align: right;
  span {
    cursor: pointer;
  }
}
</style>

<template>
  <header class="header">
    <div class="h-left">
      <icon-font  class="iconfont mr-2"  name="#mdd-logo2" :width="33" :height="33" color="34B7B9"> </icon-font>
      <h1 @click="goToPage('/overview')">复变云愈心理测评系统</h1>
    </div>
    <div class="logout" >
      <span @click="$router.push('/ucenter')">个人中心</span>
      <span style="padding-left:30px" @click="logout()">退出登录</span>
    </div>
    <!-- <div class="header-r">
      <div class="login-content" v-if="!userInfo.username">
        <img src="@/assets/img/logo.png">
        <span class="ml-2" @click="goToPage('/login')">登录</span>
      </div>
      <el-popover
        v-else
        placement="bottom"
        width="150"
        :visible-arrow="false"
        trigger="hover">
        <div slot="reference" class="user" @click="goToPage('/login')">
          <span class="content">
            <img src="@/assets/img/logo.png">
            <span>{{userInfo.username}}</span>
          </span>
        </div>
        <div class="tip" slot>
          <div class="user" @click="goToPage('/workbench/user')">个人中心</div>
          <div class="exit" @click="logout()">登出</div>
        </div>
      </el-popover>
    </div> -->
  </header>
</template>

<script>
// import { getUser, logout } from '@/api/index.js'
import { postLogout } from '@/api/modules/login.js'
export default {
  name: 'UserHeader',
  data () {
    return {
      loginState: false,
      userInfo: {}
    }
  },
  created () {
    // this.getInfo()
  },
  updated () {
    // this.getInfo()
  },
  methods: {
    // getInfo () {
    //   this.userInfo = this.$store.state.userInfo
    //   if (Object.keys(this.userInfo).length === 0) {
    //     getUser().then(res => {
    //       this.userInfo = res.data
    //       this.$store.commit('updateUserInfo', res.data)
    //       this.loginState = true
    //       console.log(res)
    //     }).catch(err => {
    //       console.log(err)
    //     })
    //   }
    // },
    goToPage (pagePath) {
      this.$router.push({
        path: pagePath
      })
    },
    goLogin () {
      if (!this.loginState) {
        this.goToPage('/login')
      }
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
  top: 0;
  left: 0;
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
}
// .header-r {
//   flex: 1;
//   text-align: right;
//   .login-content {
//     display: flex;
//     justify-content: flex-end;
//     align-items: center;
//     img {
//       width: 40px;
//       height: 40px;
//     }
//   }
// }
// .user {
//   cursor: pointer;
//   display: inline-block;
//   .content {
//     display: flex;
//     justify-content: flex-end;
//     align-items: center;
//   }
//   img {
//     margin-right: 10px;
//   }
//   span {
//     font-size: 16px;
//     font-weight: bold;
//   }
// }

// .tip {
// text-align: center;
// div {
//   cursor: pointer;
// }
// .user {
//   border-bottom: 1px solid #aaa;
//   padding-bottom: 7px;
// }
// .exit {
//   padding-top: 7px;
// }
// }
</style>

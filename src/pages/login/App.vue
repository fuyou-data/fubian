<template>
  <div id="app">
    <div class="login">
      <div class="title">
        <div class="top">
          <div class="left">
           <div class="img">
             <img src="@/assets/img/logo-white.png" alt="logo">
           </div>
           <!-- <div>复变云愈</div> -->
          </div>
        </div>
        <h1>心理测评系统</h1>
        <!-- <div class="bottom"> -->
          <!-- <div class="en">FubianYunyu<br/>psychological assessment system</div> -->
          <!-- <div class="copyright">copyright © 2020 复变医疗科技有限公司出品</div>
        </div> -->
      </div>
      <div class="right">
        <el-form class="login-box" :model="form" :rules="rules" ref="form">
          <div class="ban">
            <div class="ban-item active">
              <div>管理员登录</div>
            </div>
          </div>
          <div>
            <el-form-item prop="username">
              <el-input v-model="form.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password" class="password">
              <el-input type="password" v-model="form.password" placeholder="密码" @keyup.enter.native="login()"></el-input>
            </el-form-item>
            <p class="login-tips" >忘记密码？请联系复变超管</p>
          </div>
          <el-form-item class="form-button">
            <el-button class="w-100" type="primary" @click="login()">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="copyright">copyright © 2020 复变医疗科技有限公司出品</div>
      </div>
    </div>
  </div>
</template>

<script>
import { postUserLogin, postAdminLogin } from '@/api/modules/login.js'
export default {
  name: 'App',
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      let flag = false
      this.$refs.form.validate(valid => {
        // console.log('valid', valid)
        if (valid) {
          flag = true
        }
      })
      if (flag) {
        this.adminLogin()
      }
    },
    userLogin () {
      const data = {
        username: this.form.phone,
        smsCode: this.form.code
      }
      postUserLogin(data).then(res => {
        this.$notify({
          title: '成功',
          message: '登录成功',
          type: 'success',
          duration: 1000
        })
        // 单设备登录轮询
        sessionStorage.replaceLogin = 'true'
        setTimeout(() => {
          window.location.href = '/user#/'
          localStorage.phone = this.form.phone
        }, 1000)
      }).catch(err => {
        console.log(err)
      })
    },
    adminLogin () {
      // const data = {
      //   username: this.form.username,
      //   password: this.form.password
      // }
      postAdminLogin(this.form).then(({ data = {} }) => {
        const { type, enableUserManage, openDiversion } = data
        if (!type) return
        this.$notify({
          title: '成功',
          message: '登录成功',
          type: 'success',
          duration: 1000
        })
        // const limitPages = {
        //   superadmin: '/admin#/',
        //   admin_org: '/admin#/',
        //   admin_table: '/admin#/',
        //   admin_operation: '/admin#/',
        //   org_superadmin: '/workbench#/',
        //   org_admin: '/workbench#/'
        // }
        localStorage.setItem('type', type)
        localStorage.setItem('enableUserManage', enableUserManage)
        localStorage.setItem('openDiversion', openDiversion)
        setTimeout(() => {
          // window.location.href = limitPages[type]
          window.location.href = '/admin#/'
        }, 1000)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less">
.cur-round {
  border-radius: 40px;
}
.login-box {
  .el-button--primary:hover{
    background: #41D7C3;
  }
  .el-input__inner {
    .cur-round;
    border-color: #34B7B9 !important;
  }
  form {
    position: relative;
  }
  // .form-button {
  //   margin-bottom: 0 !important;
  //   position: absolute;
  //   left: 40px;
  //   right: 40px;
  //   bottom: 40px;
  // }
  .el-button {
    .cur-round;
    background: #41D7C3;
    border: none;
    outline: none;
    height: 45px;
    line-height: 45px;
    font-size: 18px;
    margin-top: 2rem;
    padding: 0;
    i {
      font-weight: bold;
      font-size: 2rem;
      transform: translateY(5px);
    }
  }
  .el-form-item {
    margin-bottom: 30px;
  }
  .el-form-item__error {
    padding-top: 0;
    padding-left: 1rem;
    line-height: 30px;
  }
  .agree {
    .el-form-item__content {
      line-height: 20px;
      label {
        margin-bottom: 0;
      }
    }
  }
}

</style>

<style lang="less" scoped>
#app {
  height: 100vh;
}
.login {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(180deg, #32BEC0 0%, #34D3C8 100%);
  overflow: hidden;
  &::after{
    content: '';
    width: 150vh;
    height: 150vh;
    position: absolute;
    left: -35vh;
    top: -25vh;
    background: linear-gradient(17deg, rgba(50, 192, 193, 0) 0%, #4BDDC6 100%);
    border-radius: 50%;
    z-index: 0;
  }
}
.title {
  z-index: 999;
  position: absolute;
  top: 50%;
  left: 18.75%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  color: #fff;
  font-size: 22px;
  .top{
    display: flex;
    width: 100%;
    height: 116px;
    .left{
      img {
        width: 80px;
        height: 80px;
        margin: 0 0 8px 7px;
      }
    }
  }
  h1 {
    font-size: 32px;
    margin-top: 14px;
    font-weight: bold;
  }
  .bottom {
    margin-top: 100px;
  }
  .en {
    font-family: Microsoft Himalaya;
    font-size: 24px;
    line-height: 1;
  }
  .copyright {
    font-size: 14px;
  }
}
.right {
  z-index: 999;
  width: 360px;
  position: absolute;
  top: 50%;
  right: 19.5%;
  transform: translateY(-50%);
  .login-box {
    max-width: 360px;
    min-height: 400px;
    // width: 90%;
    background: #fff;
    box-shadow: 0px 20px 20px rgba(0, 0, 0, 0.06);
    border-radius: 10px;
    padding: 40px;
    .password{
      margin-bottom: 5px;
    }
    .ban {
      display: flex;
      justify-content: center;
      color: #000000;
      font-size: 16px;
      width: 100%;
      margin-bottom: 49px;
      .ban-item {
        width: 83px;
        div {
          cursor: pointer;
          padding-bottom: 5px;
        }
      }
      .active div {
        border-bottom: 2px solid #34B7B9;
      }
    }
    .login-tips {
      font-size: 12px;
      text-align: right;
      color: #999999;
    }
  }
  .copyright {
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
}
</style>

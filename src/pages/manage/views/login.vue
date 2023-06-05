<template>
  <div class="login">
    <el-form class="manage-login-box" :model="form" ref="form" :inline="true">
      <div class="ban">
        <div class="img">
          <img src="@/assets/img/logo-white.png" alt="logo">
        </div>
        <div class="ban-item">
          <div>系统管理员登录</div>
        </div>
      </div>
      <el-form-item prop="password" class="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" @keyup.enter.native="login()"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button plain @click="adminLogin()" :disabled="!form.password">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { postConfigLogin } from '@/api/modules/login.js'
export default {
  name: 'login',
  data () {
    return {
      form: {
        username: 'configAdmin',
        password: ''
      }
    }
  },
  methods: {
    adminLogin () {
      postConfigLogin(this.form).then(() => {
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        sessionStorage.username = this.form.username
        setTimeout(() => {
          this.$router.push('/set')
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
  border-radius: 6px;
}
.manage-login-box {
  .el-input__inner {
    .cur-round;
    border: none !important;
  }
  form {
    position: relative;
  }
  .el-button {
    .cur-round;
    color: #41D7C3;
    border: none;
    outline: none;
  }
  .el-button.is-disabled.is-plain, .el-button.is-disabled.is-plain:focus, .el-button.is-disabled.is-plain:hover {
    background-color: #B2B3B5;
    color: #fff;
  }
  .el-form-item__error {
    padding-top: 0;
    padding-left: 1rem;
    line-height: 30px;
  }
}

</style>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
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
.manage-login-box {
  z-index: 999;
  max-width: 500px;
  width: 90%;
  top: 50%;
  right: 19.5%;
  transform: translateY(-50%);
  .el-input {
    width: 410px;
  }
  .ban {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    width: 100%;
    margin-bottom: 30px;
    color: #fff;
    img {
      width: 32px;
      margin-right: 12px;
    }
  }
}
</style>

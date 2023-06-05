<template>
  <div class="center-box">
    <div class="head-photo">
      <icon-font name="#mdd-user" :width="44" :height="44" color="34B7B9"> </icon-font>
    </div>
    <div class="name">{{ orgName }}</div>
    <div class="type">账号：{{ username }}</div>
    <div class="amend" @click="dialogVisible=true">
      <icon-font name="#mdd-edit" :width="17" :height="14" color="34B7B9"> </icon-font>修改密码
    </div>
    <el-dialog class="myDialog" center :show-close="false"  width="500px"
      custom-class="{border-radius:50px}" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogVisible">
      <template slot="title">
        <div style="text-align: left;font-size:18px;color:#34B7B9;font-weight:700">修改密码</div>
      </template>
    <!-- status-icon  -->
      <el-form label-width="150px" label-position="right"  ref="myForm" :rules="rules" :model="myForm" v-show="editFlag">
        <el-row>
          <el-form-item label="原密码" prop="oldPassword" label-width="70px">
            <el-input v-model="myForm.oldPassword" size="mini" placeholder="请输入原密码" type="password" ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新密码" prop="newPassword1" label-width="70px">
            <el-input size="mini" v-model="myForm.newPassword1"  placeholder="6-20位英文/数字/符号" type="password"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="新密码" prop="newPassword2" label-width="70px">
            <el-input  v-model="myForm.newPassword2" size="mini" type="password" placeholder="6-20位英文/数字/符号"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer"  v-show="editFlag">
        <el-button type="primary"  size="mini" @click="clickSure">确 定</el-button>
        <el-button @click="clickCancel" size="mini" style="margin: 0px 20px 0px" >取 消</el-button>
      </span>
      <!-- anotherstate -->
      <div class="successShow" v-show="reverseFlag">
        <icon-font name="#mdd-zhuangtaizhengque" :width="90" :height="80" color="34B7B9"> </icon-font>
        <p>密码修改成功!</p>
        <div>
          <el-button type="primary"  size="mini" @click="initState">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import {
  adminMe, passwordUpdate
} from '@api/index'
// import IconFont from '../../../components/IconFont/IconFont.vue'
export default {
  // components: { IconFont },
  name: 'ucenter',
  data () {
    const checkPassword = (valid, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.myForm.newPassword1) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    const checkreg = (rule, value, callback) => {
      const reg = /[a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\[\]\:\"\;\'\<\>\?\,\.\/]{6,20}$/
      const flag = reg.test(value)
      console.log(value)
      console.log(flag)
      if (!flag) {
        return callback(new Error('6-20位英文/数字/符号'))
      } else {
        return callback()
      }
    }
    return {
      id: '',
      dialogVisible: false,
      username: '',
      orgName: '',
      type: '',
      editFlag: true, // 修改密码
      reverseFlag: false, // 修改密码成工
      myForm: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '密码格式错误' }
        ],
        newPassword1: [
          { required: true, message: '新密码格式错误' },
          { validator: checkreg, trigger: 'blur' }
        ],
        newPassword2: [
          { required: true, message: '新密码格式错误' },
          { validator: checkreg, trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.id = 1
    this.getinfo()
  },
  methods: {
    async getinfo () {
      const res = await adminMe({})
      // console.log(res)
      this.username = res.data.username
      this.orgName = res.data.orgName
      this.type = res.data.type
    },
    clickCancel () {
      this.dialogVisible = false
      this.$refs.myForm.resetFields()
    },
    clickSure () {
      this.$refs.myForm.validate(async (valid) => {
        if (valid) {
          const res = await passwordUpdate({
            oldPassword: this.myForm.oldPassword,
            newPassword: this.myForm.newPassword1
          })
          this.editFlag = false
          this.reverseFlag = true
          this.$refs.myForm.resetFields()
        } else {
        }
      })
    },
    initState () {
      this.dialogVisible = false
      setTimeout(() => {
        this.editFlag = true
        this.reverseFlag = false
      }, 500)
    }
  }
}
</script>
<style lang="less" scoped>
.center-box {
  text-align: center;
  width: 200px;
  min-height: 500px !important;
  margin: 60px auto 0px;
  .head-photo{
    margin: 0 auto 0;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    border: 2px solid #34B7B9;
  }
  .name{
    font-size: 26px;
    color: #333333;
    font-weight: 700;
  }
  .type{
    margin-top: 5px;
    font-size: 14px;
    color: #999999;
  }
  .amend{
    margin-top: 35px;
    color: #34B7B9;
    cursor: pointer;

  }
  .center-box[data-v-30150199]{
    text-align: left !important;
  }
  .my-title{
    font-size: 18px;
    color: #34B7B9;
    margin-bottom: 50px;
  }
  .successShow{
    text-align: center;
    p{
      font-size: 18px;
      color: #666666;
      font-weight: bold;
      margin-top: 23px;
      margin-bottom: 88px;
    }
  }
}
/deep/.el-input--mini .el-input__inner{
  width: 200px;
}
.el-row{
  /deep/.el-form-item{
    width: 324px;
    margin: 6px auto;
  }
  .el-form-item__error{
    padding-top: 0px;
  }
}
</style>

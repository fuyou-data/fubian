<template>
  <div class="set">
    <ManageHeader></ManageHeader>
    <div class="box">
      <el-form ref="myForm" :rules="rules" :model="myForm">
        <el-row class="set-box">
          <div class="title">系统名称</div>
          <el-form-item label="" prop="systemName">
            <el-input size="small" v-model.trim="myForm.systemName" :disabled="!dialogVisible" placeholder="复变云愈心理测评系统"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="set-box">
          <div class="title">系统LOGO</div>
          <el-form-item>
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :on-change="(file) => logoOnChange(file, 0)"
              :auto-upload="false"
              :disabled="!dialogVisible">
              <div
                class="img-box"
                :class="myForm.reportLogo[0].image && dialogVisible ? 'change' : ''">
                <i
                  v-if="myForm.reportLogo[0].image && dialogVisible"
                  class="el-icon-delete"
                  @click.stop="myForm.reportLogo[0].image = ''"></i>
                <img
                  v-if="myForm.reportLogo[0].image"
                  :src="myForm.reportLogo[0].image"
                />
                <div class="upload-init" v-else>
                  <i class="el-icon-plus"></i>
                  <span>上传照片</span>
                </div>
              </div>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row class="set-box">
          <div class="title">登陆方式</div>
          <el-form-item label="" prop="systemMode" style="margin-bottom: 5px;">
            <el-radio-group v-model="myForm.systemMode" :disabled="!dialogVisible" size="small">
              <el-radio label="账号密码登录"></el-radio>
              <el-radio label="批次号登录"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row class="set-box">
          <div class="title">心理疏导</div>
          <el-form-item label="" prop="openDiversion" style="margin-bottom: 5px;">
            <el-radio-group v-model="myForm.openDiversion" :disabled="!dialogVisible" size="small">
              <el-radio :label="true">开启</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row class="set-box">
          <div class="title">疏导入口名称</div>
          <el-form-item label="" prop="systemName">
            <el-input size="small" v-model.trim="myForm.systemName" :disabled="!dialogVisible" placeholder="心理疏导"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="set-box">
          <div class="title">系统ID</div>
          <el-form-item label="">
            <el-input size="small" v-model.trim="myForm.systemId" :disabled="!dialogVisible" placeholder="非必填"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="set-box">
          <div class="title">管理员账号</div>
          <el-form-item label="" prop="systemAccount">
            <el-input  v-model.trim="myForm.systemAccount" size="small" :disabled="!dialogVisible" placeholder="系统账号名"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="set-box">
          <div class="title">账号名称</div>
          <el-form-item label="" prop="systemName">
            <el-input size="small" v-model.trim="myForm.systemName" :disabled="!dialogVisible" placeholder="系统名称"></el-input>
          </el-form-item>
        </el-row>
        <el-row class="set-box">
          <div class="title">AI识别</div>
          <el-form-item label="" prop="openDiversion" style="margin-bottom: 5px;">
            <el-radio-group v-model="myForm.openDiversion" :disabled="!dialogVisible" size="small">
              <el-radio :label="true">开启</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row class="set-box">
          <div class="title">报告抬头<span class="tips">（最多可按序号顺序展示2个抬头）</span></div>
          <el-row :gutter="20">
            <el-col :span="8">
              <p class="sub-title">抬头1</p>
              <el-form-item label="">
                <el-input  v-model.trim="myForm.reportLogo[0].text" size="small" :disabled="!dialogVisible" placeholder="不填不展示"></el-input>
              </el-form-item>
              <el-form-item>
                <!-- 新版base64 -->
                <el-upload
                  v-if="myForm.reportLogo[0].image || dialogVisible"
                  class="avatar-uploader"
                  action="#"
                  :show-file-list="false"
                  :on-change="(file) => logoOnChange(file, 0)"
                  :auto-upload="false"
                  :disabled="!dialogVisible">
                  <div
                    class="img-box"
                    :class="myForm.reportLogo[0].image && dialogVisible ? 'change' : ''">
                    <i
                      v-if="myForm.reportLogo[0].image && dialogVisible"
                      class="el-icon-delete"
                      @click.stop="myForm.reportLogo[0].image = ''"></i>
                    <img
                      v-if="myForm.reportLogo[0].image"
                      :src="myForm.reportLogo[0].image"
                    />
                    <div class="upload-init" v-else>
                      <i class="el-icon-plus"></i>
                      <span>上传照片</span>
                    </div>
                  </div>
                </el-upload>
                <!-- 老版上传后端存储 -->
                <!-- <el-upload
                  v-if="myForm.reportLogo[0].image || dialogVisible"
                  class="avatar-uploader"
                  action="/api/config/upload/image"
                  :headers="{
                    'x-client-type': 'Web',
                    'x-client-version': ''
                  }"
                  :show-file-list="false"
                  :on-success="(res, file) => handleAvatarSuccess(res, file, 0)"
                  :before-upload="beforeAvatarUpload"
                  :disabled="!dialogVisible">
                  <div
                    class="img-box"
                    :class="myForm.reportLogo[0].image && dialogVisible ? 'change' : ''">
                    <i
                      v-if="myForm.reportLogo[0].image && dialogVisible"
                      class="el-icon-delete"
                      @click.stop="myForm.reportLogo[0].image = ''"></i>
                    <img
                      v-if="myForm.reportLogo[0].image"
                      :src="myForm.reportLogo[0].image"
                    />
                    <div class="upload-init" v-else>
                      <i class="el-icon-plus"></i>
                      <span>上传照片</span>
                    </div>
                  </div>
                </el-upload> -->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <p class="sub-title">抬头2</p>
              <el-form-item label="">
                <el-input  v-model.trim="myForm.reportLogo[1].text" size="small" :disabled="!dialogVisible" placeholder="不填不展示"></el-input>
              </el-form-item>
              <el-form-item>
                <el-upload
                  v-if="myForm.reportLogo[1].image || dialogVisible"
                  class="avatar-uploader"
                  action="#"
                  :show-file-list="false"
                  :on-change="(file) => logoOnChange(file, 1)"
                  :auto-upload="false"
                  :disabled="!dialogVisible">
                  <div
                    class="img-box"
                    :class="myForm.reportLogo[1].image && dialogVisible ? 'change' : ''">
                    <i
                      v-if="myForm.reportLogo[1].image && dialogVisible"
                      class="el-icon-delete"
                      @click.stop="myForm.reportLogo[1].image = ''"></i>
                    <img
                      v-if="myForm.reportLogo[1].image"
                      :src="myForm.reportLogo[1].image"
                    />
                    <div class="upload-init" v-else>
                      <i class="el-icon-plus"></i>
                      <span>上传照片</span>
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
        <el-form-item class="text-center">
          <el-button v-if="!dialogVisible" type="primary" size="small" @click="dialogVisible = true">编辑</el-button>
          <el-button v-if="dialogVisible" @click="clickCancel" size="small">取消</el-button>
          <el-button v-if="dialogVisible" type="primary" size="small" @click="clickSure">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import {
  getConfigInfo, postConfigInfo
} from '@api/modules/set'
import ManageHeader from '../components/ManageHeader'
export default {
  components: { ManageHeader },
  name: 'ucenter',
  data () {
    return {
      dialogVisible: false,
      myForm: {
        systemMode: '',
        systemName: '',
        systemId: '',
        systemAccount: '',
        openDiversion: '',
        reportLogo: [
          { image: '', text: '' },
          { image: '', text: '' }
        ]
      },
      rules: {
        systemName: [
          { required: true, message: '请输入系统名称' }
        ],
        systemAccount: [
          { required: true, message: '请输入系统账号名' }//校验
        ]
      }
    }
  },
  created () {
    this.getinfo()
  },
  methods: {
    // 获取信息
    async getinfo () {
      const res = await getConfigInfo(sessionStorage.username)
      const curForm = res.data
      if (curForm.reportLogo.length < 2) {
        if (!curForm.reportLogo[0]) curForm.reportLogo[0] = { image: '', text: '' }
        if (!curForm.reportLogo[1]) curForm.reportLogo[1] = { image: '', text: '' }
      }
      this.myForm = Object.assign({}, this.myForm, curForm)
    },
    // 上传图片(本地转base64版本)
    logoOnChange (file, index) {
      const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return
      }
      // file转base64
      const reader = new FileReader()
      reader.onloadend = () => {
        // 检测图片比例是否正确
        const image = new Image()
        image.src = reader.result
        image.onload = () => {
          if (image.width !== image.height) {
            this.$message.error('上传图片需为比例1:1')
            this.myForm.reportLogo[index].image = ''
          } else {
            this.myForm.reportLogo[index].image = reader.result
          }
        }
      }
      reader.readAsDataURL(file.raw)
    },
    // 上传成功
    // handleAvatarSuccess (res, file, index) {
    //   const image = new Image()
    //   image.src = res.data
    //   image.onload = () => {
    //     if (image.width !== image.height) {
    //       this.$message.error('上传图片需为比例1:1')
    //       this.myForm.reportLogo[index].image = ''
    //     } else {
    //       this.myForm.reportLogo[index].image = res.data
    //     }
    //   }
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    // // 上传前格式验证
    // beforeAvatarUpload (file) {
    //   const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
    //   // const isLt2M = file.size / 1024 / 1024 < 2
    //   if (!isJPG) {
    //     this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
    //   }
    //   // if (!isLt2M) {
    //   //   this.$message.error('上传图片大小不能超过 2MB!')
    //   // }
    //   return isJPG
    // },
    clickCancel () {
      this.dialogVisible = false
      this.getinfo()
    },
    clickSure () {
      this.$refs.myForm.validate(async (valid) => {
        if (valid) {
          await postConfigInfo({
            ...this.myForm
          })
          this.$message.success('保存成功')
          setTimeout(() => {
            this.clickCancel()
          }, 1000)
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.set {
  width: 1200px;
  margin: 60px auto 0px;
  padding: 15px 50px 30px 50px;
  /deep/.el-input__inner{
    width: 300px;
    color: #606266;
    background: #FAFAFA;
  }
  /deep/.el-radio__input+span.el-radio__label {
    color: #606266;
  }
  /deep/.el-radio__input.is-disabled.is-checked .el-radio__inner {
    background-color: #34B7B9;
    border-color: #34B7B9;
    &::after {
      background-color: #fff;
    }
  }
}
.img-box {
  width: 104px;
  height: 104px;
  padding: 8px;
  border-radius: 2px 2px 2px 2px;
  border: 1px solid #ECEFEF;
  position: relative;
  &.change::after {
    content: "更换";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 29px;
    text-align: center;
    font-size: 12px;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
    z-index: 9;
  }
  .el-icon-delete {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 13px;
    color: #fff;
    background: #F75234;
    border-radius: 0px 2px 0px 2px;
  }
  img {
    width: 100%;
  }
  .upload-init {
    height: 100%;
    padding-top: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #656868;
    .el-icon-plus {
      font-size: 24px;
      color: #656868;
    }
  }
}
.set-box {
  padding: 24px 30px 9px;
  margin-bottom: 12px;
  border-radius: 6px;
  background: #FAFAFA;

  .title {
    margin-bottom: 5px;
    font-size: 14px;
    color: #333636;
    .tips {
      color: #979A9A;
    }
  }
  .sub-title {
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: 400;
    color: #656868;
  }
}
</style>

<template>
  <div>
    <el-dialog
      title="批量新增"
       v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :show-close="false"
      width="30%">
      <div>
        <div class="box">
          <span>1、下载模板文件，填写文件内容</span>
          <el-button class="btntext" type="text" @click="download()">模板下载</el-button>
        </div>
        <div class="box">
          <span>2、上传文件</span>
          <el-upload
            class="upload-demo"
            accept=".xls,.xlsx"
            action="/api/admin/add/users"
            :headers="header"
            :before-upload="beforeUpload"
            :show-file-list="false"
            :on-change="uploadVideoProcess"
            :on-success="handleSuccess"
            :on-error="handleError">
            <el-button class="btntext" type="text">选择文件</el-button>
          </el-upload>
        </div>
        <div class="files">
          <span class="fileName">{{fileName}}</span>
          <el-progress class="upProgress" v-show="progressFlag" :percentage="loadProgress"></el-progress>
          <span class="tips" :style="{color: tip ==='上传成功'? '#67C23A': '#F75234'}">{{tip}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" size="small" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设置部门"
       v-if="orgVisible"
      :visible.sync="orgVisible"
      :show-close="false"
      width="30%">
      <div class="search orgBox">
        <div class="selected">将已选的{{selectOrg.length}}名成员移动至</div>
        <el-form ref="form" :model="form"  size="mini" >
          <el-form-item props="orgName">
            <el-select v-model="form.orgName" filterable placeholder="请选择部门名称" style="width: 320px;" >
              <el-option :value="t.orgName" :label="t.orgName" v-for="t in orgNames" :key="t.orgName"></el-option>
            </el-select>
            <div v-if="msg" class="selectTips">{{msg}}</div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="back"  type="success" size="small" @click="handleClose">取 消</el-button>
        <el-button type="success" size="small" @click="saveOrg">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { memberFile, setOrg } from '@/api/modules/member'
import downloadLink from '@utils/export-url.js'
export default {
  name: 'addmembers',
  data () {
    return {
      downloadLink: downloadLink,
      dialogVisible: false,
      progressFlag: false,
      loadProgress: 0,
      templateURL: '',
      fileName: '',
      tip: '',
      checkFile: false,
      orgVisible: false,
      form: {
        userNames: [],
        orgName: ''
      },
      msg: ''
    }
  },
  props: {
    selectOrg: Array,
    orgNames: Array
  },
  computed: {
    header () {
      return {
        'x-client-type': 'Web',
        'x-client-version': ''
      }
    }
  },
  methods: {
    download () {
      memberFile().then(({ data = {} }) => {
        this.templateURL = data
        console.log(this.templateURL)
        downloadLink(this.templateURL)
      }).catch(err => {
        console.log(err)
      })
    },
    uploadVideoProcess (res, file, fileList) {
      this.checkFile = file.size / 1024 / 1024 > 10
      if (this.checkFile) {
        this.$message.error('上传失败，文件大小超过限制')
      } else {
        this.fileName = file.name
        if (file.status === 'ready') {
          this.progressFlag = true // 显示进度条
          this.loadProgress = 0
          const interval = setInterval(() => {
            if (this.loadProgress >= 99) {
              clearInterval(interval)
              return
            }
            this.loadProgress += 1
          }, 20)
        }
        if (file.status === 'success') {
          this.progressFlag = true // 隐藏进度条
          this.loadProgress = 100
        }
      }
    },
    beforeUpload (file) {
    },
    handleSuccess (res, file) {
      // console.log(res, file)
      if (res.code === 0) {
        this.tip = '上传成功'
      } else {
        this.tip = res.message
      }
    },
    handleError (err, file) {
      // console.log(err)
      let myError = err.toString().replace('Error: ', '')
      myError = JSON.parse(myError)
      // console.log(myError)
      this.tip = myError.message
    },
    sure () {
      this.dialogVisible = false
      Object.assign(this.$data, this.$options.data())
      this.$parent.init()
    },
    handleClose () {
      Object.assign(this.$data, this.$options.data())
    },
    saveOrg () {
      const data = { userNames: this.selectOrg, orgName: this.form.orgName }
      if (this.form.orgName === '') {
        this.msg = '请选择部门'
      } else {
        setOrg(data).then(res => {
          this.$message.success('设置成功')
          this.msg = ''
          this.$parent.init()
          this.orgVisible = false
          Object.assign(this.$data, this.$options.data())
        }).catch(err => {
          // console.log(err)
          this.msg = err.message
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog__header{
  padding: 16px 32px;
  border-bottom: 1px solid #EBEBEB;
  .el-dialog__title {
    line-height: 24px;
    font-size: 18px;
    color: #34B7B9;
    font-weight: bold;
  }
}
/deep/.el-dialog__body{
  padding: 0 32px;
  .box{
    margin-top: 28px;
    height: 20px;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    color: #666666;
    .btntext{
      font-size: 16px;
      margin-left: 25px;
    }
  }
}
/deep/.el-dialog__footer{
  text-align: center;
  padding: 32px 50px;
}
/deep/.el-progress-bar__inner{
  background-color: #34B7B9;
}
.files{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}
.orgBox{
  padding: 30px 32px;
  display: flex;
  align-items: center;
  flex-direction: column;
  /deep/.el-input__inner{
    border: 1px solid #666;
  }
  .selected{
    width: 320px;
    height: 20px;
    font-size: 16px;
    line-height: 20px;
    color: #666666;
    margin-bottom: 16px;
  }
}
.back {
  color: #34B7B9  !important;
  border: 1px solid #34B7B9 !important;
  background-color: #FFFFFF;
}
.selectTips{
  font-size: 12px;
  line-height: 20px;
  color: #F75234;
  margin-top: 5px;
}
</style>

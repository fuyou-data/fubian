<template>
  <div class="main">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-position="right" label-width="150px" :hide-required-asterisk="true">
      <el-form-item label="量表名称：" style="margin-bottom:0!important">
        <div style="display:flex">
          <div>
            <el-form-item prop="tableCnName">
              <el-input v-model="form.tableCnName" @input="cNameHandle"  placeholder="请输入中文名称" ></el-input>
            </el-form-item>
          </div>
          <span style="margin: 0 5px;"></span>
          <div>
            <el-form-item prop="tableEnName">
              <el-input v-model="form.tableEnName" maxlength="15" placeholder="请输入英文简称" ></el-input>
            </el-form-item>
          </div>
          <span class="name_tips">(中文名称最多20字，英文简称最多15字)</span>
        </div>
      </el-form-item>
      <el-form-item label="自评分类：" prop="selfTableTypeId" ref="selfTableTypeId">
          <el-select v-model="form.selfTableTypeId" filterable placeholder="请选择自评分类">
            <el-option v-for="item in selfTypeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="预估耗时：" prop="minTimeMinute" ref="minTimeMinute">
        <el-radio-group v-model="timeType" @change="timeTypeHandle">
          <el-radio :label="0">固定时间</el-radio>
          <el-radio :label="1">时间段</el-radio>
        </el-radio-group>
        <div class="timeTtpe" v-if="timeType === 0" ><el-input  v-model="form.minTimeMinute" maxLength="3" style="width:100px"></el-input> &nbsp;&nbsp;分钟</div>
        <div class="timeTtpe" v-else-if="timeType === 1">
          <el-input  v-model="form.minTimeMinute" style="width:100px" maxLength="3"></el-input>
           ~
          <el-input  v-model="form.maxTimeMinute" style="width:100px" maxLength="3"></el-input> &nbsp;&nbsp;分钟
        </div>
      </el-form-item>
      <el-form-item label="是否配置温馨提示：" prop="tips" ref="tips">
        <el-radio-group v-model="showTip" @change="tipsHandle">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
        <div v-if="showTip != 0 " style="margin-top:15px">
          <div v-for="(item, index) in  form.tips" :key="index" class="tipContent">
            <span class="xuhao">{{index + 1}}.</span>
            <el-input  v-model="form.tips[index]" resize :rows="2" show-word-limit type="textarea" maxlength="100"  placeholder=""></el-input>
            <el-button style="width:60px;position: relative;top: 8px;" type="text" v-if="form.tips.length != 1 " @click="form.tips.splice(index, 1)">删除</el-button>
          </div>
          <el-button type="text" @click="form.tips.push('')">添加</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="saveBtn" v-if="configurationStatus == '已完成'"><el-button type="success"  @click="save">保存</el-button></div>
  </div>
</template>

<script>
import { createTableInfo, selfTableTypeList } from '@/api/modules/operate'
import { mapState } from 'vuex'
export default {
  name: 'set-info',
  data () {
    const cNameValidate = (rule, value, callback) => {
      const reg1 = /\s/
      const res1Flag = value.split('').every(item => { return reg1.test(item) === true })
      if (value === '' || res1Flag) {
        callback(new Error('请输入中文名称'))
      } else {
        callback()
      }
    }
    const eNameValidate = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9\\-]+$/
      if (!reg.test(value)) {
        callback(new Error('只能输入英文、数字或-'))
      } else if (value === '') {
        callback(new Error('请输入英文简称'))
      } else {
        callback()
      }
    }
    const selfValidate = (rule, value, callback) => {
      if (value === 0 || value === '') {
        callback(new Error('请选择自评分类'))
      } else {
        callback()
      }
    }
    const timeTypeValidate = (rule, value, callback) => {
      const reg = /^[1-9]\d*$/
      const value2 = Number(this.form.maxTimeMinute)
      const value1 = Number(value)
      const type = this.timeType
      if (type === '') {
        callback(new Error('请选择预估耗时'))
      } else if (type === 1) {
        if (value2 === '') {
          callback(new Error('请输入完整的时间段'))
        } else if (!reg.test(value2) || !reg.test(value1)) {
          callback(new Error('仅能输入非0数字'))
        } else if (value1 > value2 || value1 === value2) {
          callback(new Error('请输入正确的时间段'))
        } else {
          callback()
        }
      } else if (!reg.test(value1)) {
        callback(new Error('仅能输入非0数字'))
      } else {
        callback()
      }
    }
    const tipsValidate = (rule, value, callback) => {
      const tips = value.some(v => { return v === '' })
      const reg1 = /\s/
      const res1Flag = value.some(v => {
        return v.split('').every(item => { return reg1.test(item) === true })
      })
      if (this.showTip === '') {
        callback(new Error('请选择是否配置温馨提示'))
      } else if ((this.showTip === 1 && tips) || (this.showTip === 1 && res1Flag)) {
        callback(new Error('内容不能为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        tableCnName: '',
        tableEnName: '',
        selfTableTypeId: '',
        minTimeMinute: '',
        maxTimeMinute: '',
        tips: [''],
        tableCode: ''
      },
      rules: {
        tableCnName: [{ required: true, validator: cNameValidate, trigger: 'blur' }],
        tableEnName: [{ required: true, validator: eNameValidate, trigger: 'blur' }],
        selfTableTypeId: [{ required: true, validator: selfValidate, trigger: 'blur' }],
        minTimeMinute: [{ required: true, validator: timeTypeValidate, trigger: 'blur' }],
        tips: [{ required: true, validator: tipsValidate, trigger: 'blur' }]
      },
      uploadData: {
        token: ''
      },
      valid: '',
      showTip: '',
      timeType: '',
      oldForm: {},
      configurationStatus: '',
      tableCode: '',
      selfTypeList: [],
      result: {}
    }
  },
  computed: {
    ...mapState({
      // configurationStatus: state => state.operate.configurationStatus
    }),
    isChange () {
      Object.keys(this.oldForm).forEach((key) => {
        Object.keys(this.$store.state.operate).forEach((v) => {
          if (key === v) {
            this.oldForm[key] = this.$store.state.operate[v]
          } else if (key === 'selfTableTypeId') {
            this.oldForm[key] = this.$store.state.operate.selfTableType.id
          }
        })
      })
      if (Object.entries(this.form).toString() !== Object.entries(this.oldForm).toString()) {
        return true
      }
      return false
    }
  },
  watch: {
    'form.selfTableTypeId' (val, old) {
      if (val !== 0 || val !== '') {
        this.$refs.selfTableTypeId.clearValidate()
      }
    }
  },
  mounted () {
    this.selfType()
    this.oldForm = Object.assign({}, this.form)
    this.configurationStatus = this.$parent.configurationStatus
    this.tableCode = this.$parent.tableCode
    if (this.tableCode || this.$route.query.tableCode) {
      Object.keys(this.form).forEach((key) => {
        Object.keys(this.$store.state.operate).forEach((v) => {
          if (key === v) {
            this.form[key] = this.$store.state.operate[v]
          } else if (key === 'selfTableTypeId') {
            this.form[key] = this.$store.state.operate.selfTableType.id
          }
        })
      })
      this.$store.dispatch('getTableInfo', this.$route.query.tableCode).then(
        (res) => {
          this.result = res
        })
      if (this.form.minTimeMinute === this.form.maxTimeMinute) {
        this.timeType = 0
      } else {
        this.timeType = 1
      }
      if (this.form.tips.length === 0) {
        this.showTip = 0
      } else {
        this.showTip = 1
      }
    }
  },
  methods: {
    timeTypeHandle (e) {
      if (e !== '') {
        this.$refs.minTimeMinute.clearValidate()
      }
    },
    tipsHandle (e) {
      if (e === 1) {
        this.form.tips = ['']
      }
      if (e !== '') {
        this.$refs.tips.clearValidate()
      }
    },
    async selfType () {
      const res = await selfTableTypeList({ page: -1, pageSize: 10 })
      this.selfTypeList = res.data.tables
    },
    cNameHandle () {
      this.$forceUpdate()
      var item = this.form.tableCnName
      var length = 0
      for (var i = 0; i < item.length; i++) {
        if ((item.charCodeAt(i) & 0xff00) !== 0) {
          length++
        }
        length++
        if (length > 40) {
          this.form.tableCnName = item.substring(0, i)
          break
        }
      }
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.timeType === 0) {
            this.form.maxTimeMinute = this.form.minTimeMinute
          }
          if (this.showTip === 0) {
            this.form.tips = []
          }
          this.form.maxTimeMinute = Number(this.form.maxTimeMinute)
          this.form.minTimeMinute = Number(this.form.minTimeMinute)
          createTableInfo(this.form).then(
            res => {
              if (!this.tableCode) {
                this.$store.commit('SET_TABLE_Code', res.data.tableCode)
              }
              if (this.configurationStatus !== '已完成') {
                setTimeout(() => {
                  this.$router.replace('/setting/content?tableCode=' + res.data.tableCode)
                }, 1000)
              } else {
                this.$message({ type: 'success', message: '保存成功' })
              }
              this.$store.dispatch('getTableInfo', res.data.tableCode)
            }
          )
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form-item{
  margin-bottom: 30px !important;
}
.el-input{
  width: 12vw;
}
.el-textarea{
  width:35vw;
}
/deep/.el-form-item--small .el-form-item__error{
  white-space: nowrap;
}
/deep/.el-textarea .el-input__count{
  background: rgba(0,0,0,0);
  bottom: -9px;
  right: 2px;
  transform: scale(0.8);
  color: #CCCCCC;
}
/deep/.el-textarea__inner{
  border: 1px solid #707070;
  resize: none;
  border-radius:2px;
  padding-right: 28px;
}
/deep/.el-textarea__inner::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 5px;  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  }
/deep/.el-textarea__inner::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 3px;
  // box-shadow   : inset 0 0 2px rgba(0, 0, 0, 0.2);
  background   : #DFDFDF;
  }
/deep/.el-textarea__inner::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background   : rgba(0, 0, 0, 0);
  }
.main{
  padding: 0 40px;
}
.saveBtn{
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  max-width: 1280px;
  padding: 0 50px 50px 0;
}
.tips{
  font-size: 12px;
  color: #999;
  position: absolute;
  top: 0;
  left: 132px;
  width: 300px;
  margin: 0;
}
.name_tips{
  font-size: 12px;
  color: #999;
  margin-left: 10px;
  white-space: nowrap;
}
.timeTtpe{
    margin-top: 15px;
}
.tipContent{
  margin-bottom: 15px;
  position: relative;
}
.xuhao{
    display: inline-block;
    position: absolute;
    bottom: 26px;
    left: -20px;
}
.avatar-uploader{
      position: relative;
      width: 100px;
      height: 100px;
      border: 1px solid #707070;
      box-sizing: content-box;
      img{
        width: 100px;
      height: 100px;
      }
      span{
        display: inline-block;
        position: absolute;
        right: -70px;
        bottom: -5px;
        color: #34B7B9;
        text-decoration: underline;
        font-size: 14px;
      }
  }
    .explain{
      color: #999;
      font-size: 12px;
    }
</style>

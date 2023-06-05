<template>
<div class="show">
  <!-- <div class="title">复变联合机构报告</div> -->
  <div class="res"><span></span><span>测试结果</span></div>
    <div class="top-box">
      <el-checkbox-group v-model="insReportDisplayType">
        <el-checkbox v-for="(item, index) in topList" :key="'insReportDisplayType' + index" :label="item">{{item}}<Tooltip :index="index"></Tooltip></el-checkbox>
      </el-checkbox-group>
    </div>
  <div class="saveBtn" v-if="configurationStatus == '已完成'"><el-button type="success"  @click="save">保存</el-button></div>
</div>
</template>

<script>
import Tooltip from './tooltip.vue'
import { tableReport, tableStatus } from '@/api/modules/operate'
import { mapState } from 'vuex'
export default {
  name: 'setting-show',
  components: {
    Tooltip
  },
  data () {
    return {
      topList: ['总分', '测评结果', '分析/指导意见', '选项展示', '因子表格分析', '维度解释', '因子折线图'],
      error: false,
      errorH: false,
      insReportDisplayType: []
    }
  },
  computed: {
    tableCode () {
      return this.$store.state.operate.tableCode
    },
    ...mapState({
      configurationStatus: state => state.operate.configurationStatus,
      onlineStatus: state => state.operate.onlineStatus,
      scoreType: state => state.operate.scoreType
    }),
    isChange () {
      const oldIn = this.$store.state.operate.insReportDisplayType
      // console.log(oldIn, this.insReportDisplayType)
      if (oldIn.toString() !== this.insReportDisplayType.toString()) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    insReportDisplayType (val, newVal) {
      const scoreType = this.scoreType
      if (!scoreType.includes('总分')) {
        this.error = val.some(v => {
          return v === '总分' || v === '测评结果' || v === '分析/指导意见'
        })
        // if (this.error) {
        //   this.$message.error('请先设置总分规则')
        // }
      } else if (!scoreType.includes('因子分')) {
        this.error2 = val.some(v => {
          return v === '因子表格分析' || v === '因子折线图' || v === '维度解释'
        })
      }
    }
  },
  mounted () {
    this.insReportDisplayType = this.$store.state.operate.insReportDisplayType
  },
  methods: {
    reSort (arr, comArr) {
      let newArr = []
      arr.forEach(
        v => {
          if (comArr.indexOf(v) !== -1) newArr = [...newArr, v]
        }
      )
      return newArr
    },
    save () {
      const insReportDisplayType = this.reSort(this.topList, this.insReportDisplayType)
      const configurationStatus = '已完成'
      const onlineStatus = this.onlineStatus
      const tableCode = this.tableCode
      if (this.error || this.errorH) {
        this.$message.error('总分未设置')
      } else if (this.error2 || this.errorH2) {
        this.$message.error('因子分未设置')
      } else if (insReportDisplayType.length === 0) {
        this.$message.error('您未填写任何内容')
      } else if (insReportDisplayType.length === 0) {
        this.$message.error('您还有未填写的内容')
      } else {
        tableReport({ tableCode, insReportDisplayType }).then(res => {
          if (this.configurationStatus !== '已完成') {
            tableStatus({ tableCode, configurationStatus, onlineStatus }).then(res => {
              this.$notify({
                title: '成功',
                message: '配置完成!',
                type: 'success',
                duration: 1000
              })
              this.$router.replace({
                path: '/operate/list'
              })
            })
          } else {
            this.$message({ type: 'success', message: '保存成功' })
          }
          this.$store.dispatch('getTableInfo', tableCode)
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .show{
    // font-family: Source Han Sans CN;
    .title{
      border-left: 5px solid #34B7B9;
      margin-left: 36px;
      font-size: 16px;
      color: #333333;
      font-weight: bold;
      padding-left: 12px;
      margin-bottom: 36px;
      height: 16px;
      line-height: 16px;
    }
    .res{
      margin-left: 36px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      color: #666666;
      span:first-child{
        width: 5px;
        height: 5px;
        background-color: #34B7B9;
      }
      span:last-child{
        margin-left: 12px;
      }
    }
    .under-box{
      margin-left: 46px;
    }
    .top-box{
      margin-left: 46px;
      margin-bottom: 61px;
      display: flex;
      .my-btn{
        display: inline-block;
        border-radius: 50%;
        font-size: 8px;
        width: 14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        border: 1px solid #34B7B9;
        color: #34B7B9;
      }
    }
  }
  .saveBtn{
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  max-width: 1280px;
  padding: 0 50px 50px 0;
}
  /deep/.el-checkbox__input.is-checked+.el-checkbox__label{
    color: #666666;
  }
</style>

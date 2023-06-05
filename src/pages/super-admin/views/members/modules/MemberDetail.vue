<template>
  <div>
    <el-drawer
      title="成员详情"
      :visible.sync="drawer"
      size="60%"
      @close="handleClose"
      custom-class="drawerClass"
      :destroy-on-close="true"
      :modal="false"
      :wrapperClosable="false">
      <div class="main">
        <div class="d_header">
          <el-form class="formModel" ref="form" :model="form"  size="mini" :inline="true" :class="{editClass: isEdit}">
            <el-form-item label="账号：">
              <span>{{dataDetail.username}}</span>
            </el-form-item>
            <el-form-item v-if="isEdit" label="密码：" class="pass">
              <el-input size="mini" placeholder="请输入密码" v-model="inputForm.password">
              </el-input>
            </el-form-item>
            <!-- <el-form-item v-if="!isEdit" label="部门：">
              <span>{{dataDetail.orgName}}</span>
            </el-form-item> -->
            <el-form-item label="姓名：">
              <el-input v-if="isEdit" size="mini" placeholder="请输入姓名" maxlength="20" v-model.trim="inputForm.name">
              </el-input>
              <span v-else>{{dataDetail.name}}</span>
            </el-form-item>
            <el-form-item label="编号：">
              <el-input v-if="isEdit" size="mini" placeholder="请输入编号" maxlength="20" v-model.trim="inputForm.identifier">
              </el-input>
              <span v-else>{{dataDetail.identifier}}</span>
            </el-form-item>
          </el-form>
          <el-button v-if="!isEdit" style="height:28px" size="mini" plain @click="editBtn">编辑</el-button>
          <div v-else style="white-space: nowrap;">
            <el-button style="height:28px" size="mini" plain @click="saveBtn">保存</el-button>
            <el-button style="height:28px" size="mini" plain @click="cancleBtn">取消</el-button>
          </div>
        </div>
        <!-- <div class="d_bing">
          <h3>既往病史</h3>
          <div class="bing">{{dataDetail.pastMedicalHistory || '暂无'}}</div>
        </div> -->
        <div class="d_bing" v-if="dataDetail.tableStatistics">
          <h3>量表统计 <span class="tips">*仅展示包含总分的量表统计数据</span></h3>
          <Chart ref="echart" :tableList="dataDetail.tableStatistics" :options="options"></Chart>
        </div>
        <div class="d_content">
          <h3>所属批次({{pager.totalRow || 0}})</h3>
          <Batch ref="batch"
            :list="dataDetail.records"
            :pager="pager"
            :form="form"
            :loading="loading"
            @query="query"
            @reset="reset"
            @currentChange="currentChange">
          </Batch>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Batch from './MemberBatch.vue'
import Chart from '@/components/MemberChart.vue'
import { memberDetail, editInfo } from '@/api/modules/member'
export default {
  name: 'memberDetail',
  components: {
    Batch,
    Chart
  },
  data () {
    return {
      drawer: false,
      dataDetail: {},
      username: '',
      loading: false,
      isEdit: false,
      inputForm: {
        name: '',
        password: '',
        identifier: ''
      },
      form: {
        keyword: '',
        status: ''
      },
      pager: {
        page: 1,
        pageSize: 10
      },
      options: []
    }
  },
  computed: {
    querys () {
      let res = {}
      const { keyword, status } = this.form
      if (keyword !== '') res = { ...res, keyword }
      if (status !== '') res = { ...res, status }
      return res
    }
  },
  mounted () {
    // this.getData()
  },
  methods: {
    getData (params = {}) {
      this.loading = true
      const findJson = {
        page: this.pager.page,
        pageSize: 10,
        username: this.username,
        keyword: this.form.keyword,
        status: this.form.status
      }
      memberDetail(findJson).then(
        ({ data = {} }) => {
          this.dataDetail = data
          this.pager = data.pager
          this.loading = false
          this.inputForm.name = data.name
          this.inputForm.password = ''
          this.inputForm.identifier = data.identifier
          if (data.tableStatistics) {
            this.options = data.tableStatistics.map(v => {
              return v.tableName
            })
            this.$nextTick(() => {
              this.$refs.echart.value = this.options[0]
              this.$refs.echart.getChartData(this.options[0])
            })
          } else {
            this.options = []
          }
          this.$nextTick(() => {
            this.$refs.batch.showTips()
          })
        }
      )
    },
    editBtn () {
      this.isEdit = true
    },
    saveBtn () {
      const data = {
        username: this.username,
        ...this.inputForm
      }
      const reg = /^[A-Za-z0-9\S]{6,20}$/
      // const reg1 = /^[a-zA-Z\u4e00-\u9fa5]+$/
      // else if (!reg1.test(this.inputForm.name)) {
      //   this.$message({
      //     type: 'error',
      //     message: '姓名仅限输入中英文'
      //   })
      // }
      if (this.inputForm.name === '') {
        this.$message({
          type: 'error',
          message: '请完善成员信息后保存'
        })
      } else if (this.inputForm.password !== '' && !reg.test(this.inputForm.password)) {
        this.$message.error('密码仅限6-20位英文/数字/符号，请重新输入')
      } else {
        editInfo(data).then(res => {
          this.$message.success('保存成功')
          this.isEdit = false
          this.getData()
          this.$parent.init()
        })
      }
    },
    cancleBtn () {
      this.isEdit = false
    },
    query () {
      this.pager.page = 1
      this.getData()
    },
    reset () {
      this.form.keyword = ''
      this.form.status = ''
      this.pager.page = 1
      this.getData()
    },
    currentChange (val) {
      this.pager.page = val
      const params = this.querys
      this.getData(params)
    },
    handleClose () {
      this.$parent.showDetail = false
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-drawer__wrapper{
  // top:53px;
  .el-drawer__header{
    padding: 20px 28px;
    margin-bottom: 0;
    font-size: 18px;
    font-weight: bold;
    color: #34B7B9;
    border-bottom: 1px solid #EBEBEB;
  }
  .el-drawer__body{
    overflow-y: auto;
  }
  .el-drawer__body::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 8px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
    }
  .el-drawer__body::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 3px;
    background   : #DFDFDF;
    }
  .el-drawer__body::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 10px;
    background   : rgba(0, 0, 0, 0);
    }
}
/deep/.el-drawer__close-btn {
  padding: 0;
  i{
    font-size: 24px !important;
  }

}
.main{
  padding: 0 28px;
  width: 100%;
  /deep/.el-form-item{
    margin-bottom: 0;
    margin-right: 10%;
    white-space: nowrap;
  }
  /deep/.el-form-item__label{
    margin-bottom: 0;
    color: #666;
    font-size: 14px;
  }
  .editClass{
    /deep/.el-form-item{
      width: 30%;
      margin-bottom: 10px;
    }
  }
  .d_header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 0;
    border-bottom: 1px solid #EBEBEB;
    .formModel{
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
  }
  h3{
    font-size: 16px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20px;
  }
  .d_bing{
    padding: 24px 0;
    border-bottom: 1px solid #EBEBEB;
    .bing{
      font-size: 14px;
      color: #666;
    }
    .tips{
      font-size: 14px;
      color: #666;
      margin-left: 15px;
      font-weight: normal;
    }
  }
  .d_content{
    padding: 24px 0;
  }
}
@media (max-width: 1460px){
  .pass{
    margin-bottom: 20px !important;
  }
}
</style>

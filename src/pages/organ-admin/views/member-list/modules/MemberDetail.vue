<template>
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
        <el-form class="formModel" ref="form" :model="form"  size="mini" :inline="true">
          <el-form-item label="姓名：">
            <!-- <el-input size="mini" placeholder="请输入姓名" v-model="">
            </el-input> -->
            <span>{{dataDetail.name}}</span>
          </el-form-item>
          <el-form-item label="部门：">
            <span>{{dataDetail.orgName}}</span>
          </el-form-item>
          <el-form-item label="账号：">
            <span>{{dataDetail.username}}</span>
          </el-form-item>
        </el-form>
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
</template>

<script>
import Batch from './MemberBatch.vue'
import Chart from '@/components/MemberChart.vue'
import { memberDetail } from '@/api/modules/member'
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
    margin-right: 50px;
  }
  /deep/.el-form-item__label{
    margin-bottom: 0;
    color: #666;
    font-size: 14px;
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

</style>

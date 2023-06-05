<template>
<div class="box">
  <!-- <el-row> -->
    <div class="title">
      <div class="num">总人数: <span>{{allPerson}}人</span> </div>
      <div class="num">完成所有检测人数: <span>{{finishedPerson}}人</span> </div>
    </div>
    <h5>情绪异常统计 </h5>
    <hr>
    <div class="down-load">
      <a href="javascript:void(0)" @click="downList">下载情绪异常名单</a>
    </div>
    <!-- charts  -->
    <div class="charts" id="#f-box">
      <div class="every-box"  v-for="(item, index) in tableCharts" :key="'charts' + index">
         <h6>{{item.tableName}}</h6>
        <ecahrtspie :dataPie="item.chart"></ecahrtspie>
      </div>
     </div>
      <!-- :total="scales.length" -->
      <!-- v-show= "hasChart" -->
    <el-pagination
      v-show= "false"
      background
      layout="prev, pager, next"
      :total="8"
      :page-size="6"
      class="piePagin"
      @current-change="piePage"
      >
    </el-pagination>
    <h5>详细检查数据</h5>
    <hr>
    <h3>查询</h3>
    <el-form :model="headForm" ref="headForm" size="mini" label-position="left" class="search-form">
      <el-form-item label="关键字:" prop="keyword">
        <el-input v-model="headForm.keyword" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item label="检查状态:" prop="state">
        <el-select v-model="headForm.state" placeholder="请选择" >
          <el-option v-for="(item, index) in arr" :key="'state' + index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <div class="last-box">
        <el-button type="primary" @click="goSearch" size="mini">查询</el-button>
        <el-button @click="reSet" size="mini">重置</el-button>
      </div>
    </el-form>
    <AlertBox class="mb-2" :number="page.total || 0">
      <template slot="before"> 共{{page.total}}个项目  <span class="my-important" >*红色字体需要重点关注/处理</span> </template>
      <template slot="after">
        <el-button type="primary" v-if="tableData.length> 0" size="small" @click="myExport(1)">全部导出</el-button>
        <el-button type="primary" v-if="tableData.length> 0" size="small" @click="myExport(2)">导出</el-button>
      </template>
    </AlertBox>
    <!-- table -->
    <!-- @selection-change="handleSelectionChange" -->
    <el-table
    :data="tableData" tooltip-effect="dark" style="width: 100%"
    v-if="getDataFlag"
    ref="multipleTable"
    empty-text="暂无数据"
    @select="checkedList"
    @select-all="checkedList"
    :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }">
      <el-table-column  type="selection" width="55">
      </el-table-column>
      <el-table-column
          show-overflow-tooltip
          v-for="(item, index) in customerInfo"
          :key="'customerInfo' + index"
          :prop="`customerInfo.${item}`"
          :label="item"
          min-width="120"
        >
        </el-table-column>
          <el-table-column  label="上传时间" min-width="150">
             <template slot-scope="scope">
             <span>{{DateFormat({date:(scope.row.createdAt * 1000),format:'yyyy.MM.dd hh:mm:ss'})}}</span>
         </template>
          </el-table-column>
          <el-table-column prop="status" label="检查状态"  > </el-table-column>
          <el-table-column  label="测试完成时间" min-width="150">
             <template slot-scope="scope">
             <span>{{scope.row.finishedAt===0 ? '--':DateFormat({date:(scope.row.finishedAt * 1000),format:'yyyy.MM.dd hh:mm:ss'})}}</span>
         </template>
          </el-table-column>
      <el-table-column label="结果">
        <el-table-column  :label="item.tableName"  v-for="(item, index) in tempData"  :key="'tempData' + index" min-width="175" >
            <template slot-scope="scope">
             <span :style="{'color':isRed(scope.row.results[item.tableCode] || '') ? 'red' : '#606266' }">{{scope.row.results[item.tableCode] || '-'}}</span>
           </template>
        </el-table-column>
      </el-table-column>
      <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="downLoad(scope.row.sessionId)" :disabled="!showReport(scope.row.results)">详情下载</el-button >
          </template>
        </el-table-column>
    </el-table>
    <!--  pagination-->
    <el-pagination v-show="pageShow" :current-page="page.pageIndex" class="my-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"  :page-size="page.pageSize" layout=" prev, pager, next, jumper" :total="page.total">
    </el-pagination>
    <el-dialog
      :show-close= "false"
      :close-on-click-modal="false"
      :visible.sync="dialogFlag"
      width="40%">
      <div>
        正在导出,请前往<span class="link" style="color:#34b7b9" @click="$router.push('/task')">任务管理</span>中查看导出进度
      </div>
     <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="dialogFlag = false">好 的</el-button>
     </span>
    </el-dialog>
  <!-- </el-row> -->
</div>
</template>
<script>
// import echarts from 'echarts'
import { adminMe } from '@api/index'
import { statisticsChart, statisticsTable, abnormalList, statisticsExport, getCstTableList } from '@api/modules/batch'
import downloadLink from '@utils/export-url.js'
import AlertBox from '@components/AlertBox'
import { DateFormat } from '@/utils/date'
import ecahrtspie from '@components/ecahrtspie'
export default {
  name: 'statistic',
  components: {
    AlertBox,
    ecahrtspie
  },
  data () {
    return {
      downloadLink: downloadLink,
      DateFormat: DateFormat,
      userName: '', // 当前是谁
      currentID: '',
      allPerson: '',
      finishedPerson: '',
      dialogFlag: false, // 导出的展示
      getDataFlag: false,
      headForm: {
        keyword: '',
        state: ''
      },
      arr: [
        { label: '已完成', value: '9' },
        { label: '未完成', value: '2' },
        { label: '未开始', value: '1' }
      ],
      tableCharts: [],
      page: {
        pageSize: 10,
        pageIndex: 1,
        total: 0
      },
      rows: [],
      pageShow: true,
      flag: true, // get once tag
      tableData: [],
      allData: [], // 所有的表
      customerInfo: [],
      hasChart: true,
      pieList: [],
      showList: [] // 所有可展示的表放在一个列表里
    }
  },
  watch: {
    $route () {
      // all init
      // 去了其他批次保存的数据就不要了
      this.rows = []
      this.headForm.keyword = ''
      this.headForm.state = ''
      this.currentID = this.$route.query.id
      this.page.pageIndex = 1
      this.page.pageSize = 10
      this.getDataFlag = false
      this.getTable()
      this.getCharts()
      this.getinfo()
      this.getTableAll()
    }
  },
  computed: {
    tempData: function () {
      const temp = []
      // console.log(this.allData)
      // console.log(this.scales)
      if (this.scales) {
        this.scales.forEach(e => {
          this.allData.forEach(it => {
            if (it.tableCode === e) {
              temp.push(it)
            }
          })
        })
      }
      return temp
    }
  },
  mounted () {
    this.currentID = this.$route.query.id
    this.getinfo()
    this.getTable()
    this.getCharts()
    this.getTableAll()
  },
  methods: {
    async getinfo () {
      const res = await adminMe({})
      this.userName = res.data.username
      // console.log(res)
    },
    async getTableAll () {
      const res = await getCstTableList()
      this.allData = res.data.tables
      this.getDataFlag = true
    },
    isRed (x) {
      if (x.indexOf('重') !== -1) {
        return true
      } else if (x.indexOf('中') !== -1) {
        return true
      } else {
        return false
      }
    },
    goSearch () {
      // 这里是点击了查询table保存的数据也就不要了
      this.rows = []
      this.page.pageIndex = 1
      this.pageShow = false
      this.getTable()
    },
    reSet () {
      // this.headForm.keyword = ''
      this.page.pageIndex = 1
      this.pageShow = false
      this.$nextTick(() => {
        this.$refs.headForm.resetFields()
        this.getTable()
      })
    },
    showReport (obj) {
      const flag = Object.values(obj).some(v => {
        return v === '已完成' || v.includes('总分')
      })
      return flag
    },
    async downList () {
      const res = await abnormalList({ batchId: this.currentID })
      if (res.code === 0 && res.data !== null) {
        downloadLink(res.data.url)
      } else {
        this.$notify.info({
          title: '消息',
          message: '暂无数据'
        })
      }
    },
    async myExport (type) {
      if (type === 1) {
        const data = {
          exportAll: true,
          keyword: this.headForm.keyword,
          status: Number(this.headForm.state),
          adminName: this.userName,
          batchId: this.$route.query.id
        }
        // console.log(data)
        await statisticsExport(data)
        // console.log(res, '导出结果')
        this.dialogFlag = true
        this.$refs.multipleTable.clearSelection()
      } else if (type === 2) {
        const temp = []
        this.rows.forEach(e => {
          temp.push(...e)
        })
        const data = {
          exportAll: false,
          sessionIds: temp,
          adminName: this.userName,
          batchId: this.$route.query.id
        }
        if (temp.length > 0) {
          await statisticsExport(data)
          this.dialogFlag = true
          this.rows = []
          this.$refs.multipleTable.clearSelection()
        } else {
          this.$notify({
            title: '失败',
            message: '请选择你要导出的数据',
            type: 'error',
            duration: 1000
          })
        }
      } else {
        return false
      }
    },
    checkedList (val, vals) {
      // this.rows是存了要导出的ids,交给后端的
      // console.log(val)
      // console.log(vals)
      this.rows[0] = []
      this.rows[this.page.pageIndex] = []
      if (val.length > 0) {
        val.forEach(item => {
          this.rows[this.page.pageIndex].push(item.sessionId)
        })
        // console.log(this.rows, '这里存了数据')
      }
    },
    handleSelectionChange (val) {
      console.log(val)
      this.tableCheckbox = val
    },
    async getCharts () {
      const res = await statisticsChart({ batchId: this.currentID })
      // console.log(res, '图表的数据')
      const { total = 0, completed = 0 } = res.data || {}
      if (res.data) {
        if (res.data.tableCharts) {
          this.tableCharts = res.data.tableCharts.filter(v => {
            return v.chart !== null && v.chart.length <= 10
          })
          this.tableCharts.forEach(v => {
            v.chart = JSON.parse(JSON.stringify(v.chart).replace(/result/g, 'name').replace(/total/g, 'value'))
          })
        } else {
          this.tableCharts = []
        }
        this.allPerson = total
        this.finishedPerson = completed
        this.hasChart = true
      } else {
        this.tableCharts = []
        this.hasChart = false
        this.allPerson = ''
        this.finishedPerson = ''
      }
      this.pieList = this.tableCharts
    },
    // !有记录勾选的数据
    async getTable () {
      // this.$refs.multipleTable.clearSelection()
      const res = await statisticsTable({
        batchId: this.currentID,
        page: this.page.pageIndex,
        pageSize: this.page.pageSize,
        keyword: this.headForm.keyword,
        status: this.headForm.state
      })
      // console.log(res, '表格的数据')
      // if (res.data.records.length !== 0) {
      //   if (this.flag) {
      //     const info = res.data.records[0].customerInfo
      //     this.customerInfo = Object.keys(info)
      //     this.flag = false
      //   }
      // }
      this.customerInfo = res.data.customInfoCol
      this.scales = res.data.scales
      this.tableData = res.data.records || []
      this.page.total = res.data.page.totalRow
      this.page.pageIndex = res.data.page.page
      this.pageShow = true
      // 在勾选第一页去了第二页,又回到第一页的勾选的回显
      if (this.rows[this.page.pageIndex]) {
        // console.log(this.rows[this.page.pageIndex], '这个应该是我再次拿到的数据')
        // console.log(this.tableData, '整个表的数据')
        // console.log(this.$refs.multipleTable)
        // const temp = []
        this.tableData.forEach((item, index) => {
          if (this.rows[this.page.pageIndex].includes(item.sessionId)) {
            // temp.push(index)
            // console.log('即将执行')
            this.$nextTick(function () {
              this.$refs.multipleTable.toggleRowSelection(this.tableData[index], true)
            })
          }
        })
        // console.log(temp)
        // this.$nextTick(function () {
        //   this.rows[this.page.pageIndex].forEach(e => {
        //     console.log(e, '数组的每一项是什么')
        //     this.$refs.multipleTable.toggleRowSelection(e, true)
        //   })
        // })
      }
    },
    downLoad (id) {
      window.open(`/user#/result?sessionId=${id}`)
    },
    handleSizeChange (page) {
      // this.page.pageSize = page
      // this.getTable()
    },
    handleCurrentChange (page) {
      this.page.pageIndex = page
      this.getTable()
    },
    piePage (p) {
      console.log(p)
    }
  }
}
</script>
<style lang="less" scoped>
.el-form{
  /deep/ .el-input__inner{
    width: 177px;
  }
}
.piePagin{
  display: flex;
  justify-content: center;
}
.box {
  margin-left: 40px;
  margin-right: 40px;
  padding-top: 40px;
  max-width: 1200px;
  .title {
    display: flex;
    color: #999999;
    .num:last-child {
      margin-left: 100px;
    }
    span {
      padding-left: 10px;
      color: #34B7B9;
      font-weight: bold;
    }
  }
  h5 {
    color: #34B7B9;
    font-weight: bold;
    margin-top: 28px;
  }
  .down-load {
    margin-bottom: 20px;
    a {
      color: #34B7B9;
      text-decoration: underline;
    }
    a:hover {
      opacity: 0.6;
    }
  }
  .charts {
    display: flex;
    flex-wrap: wrap;
    .every-box {
      width: 320px;
      height: 460px;
      border-radius: 2%;
      margin-bottom: 30px;
      box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
      margin-right: 20px;
      h6 {
        text-align: center;
        margin-top: 26px;
        color: #000000;
        font-size: 16px;
      }
    }
    .every-box:nth-child(3n) {
      margin-right: 0;
    }
  }

  h3 {
    font-size: 24px;
    color: #34B7B9;
    font-weight: bold;
    margin-bottom: 20px;
  }

}
.my-pagination {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  padding-bottom: 100px;
}
.search-form{
  display: flex;
  flex-wrap: wrap;
  .el-form-item{
    margin-right: 40px;
    display: flex;
    /deep/.el-input--mini .el-input__inner{
      min-width: 100px;
    }
    .el-input--mini{
      min-width: 100px;
    }
  }
  .last-box{
    display: flex;
    justify-content: center;
    min-width: 250px;
    .el-button{
      height: 28px;
      margin: 0 10px;
    }
  }
}
/deep/#span{
 color: #34B7B9;
 cursor: pointer;
}
/deep/.el-dialog{
  div{
    text-align: center;
    .link{
      cursor: pointer;
    }
  }
  .dialog-footer{
    text-align: center;
    .el-button{
      background-color: #34b7b9;
      border:none;
    }
  }
}
.my-important{
  color: red !important;
}

@media screen  and (max-width: 1640px){
  .every-box:nth-child(3n) {
      margin-right: 20px !important;
  }
}
</style>

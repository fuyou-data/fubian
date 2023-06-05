<template>
  <div class="batch-list" style="min-width:900px">
    <!-- <p class="title">查询</p> -->
      <el-form
        ref="form"
        :model="form"
        :inline="true"
        size="mini"
        label-position="left"
        class="elForm"
      >
        <el-form-item label="量表名称：">
          <el-input v-model="form.tableName"  placeholder="请输入量表名称" maxlength="35"></el-input>
        </el-form-item>
        <el-form-item label="自评分类：">
          <el-select v-model="form.selfTableTypeId" filterable placeholder="请选择自评分类">
            <el-option :value="0" :label="'全部'"></el-option>
            <el-option v-for="item in selfTypeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配置状态：">
          <el-select v-model="form.configurationStatus" placeholder="请选择配置状态">
            <el-option value="全部" >全部</el-option>
            <el-option value="已完成" >已完成</el-option>
            <el-option value="未完成" >未完成</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上下线状态：">
          <el-select v-model="form.onlineStatus"  placeholder="请选择上下线状态" >
            <el-option value="全部">全部</el-option>
            <el-option value="上线" >上线</el-option>
            <el-option value="下线" >下线</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-date-picker
            v-model="value"
            type="daterange"
            @change="dateChange"
            value-format="timestamp"
            :clearable="false"
            range-separator="-"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            >
          </el-date-picker>
        </el-form-item>
        <div>
          <el-button type="success" size="mini" @click="query">查询</el-button>
          <el-button size="mini" plain  @click="reset" :disabled="haveQuery">重置</el-button>
        </div>
      </el-form>
    <alert-box >
      <div slot="before">
        共{{total}}个项目
      </div>
      <div slot="after">
        <el-button class="btn-normal" type="success" @click="$router.push('/setting/info')">新增</el-button>
      </div>
    </alert-box>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="tableName"
        label="量表名称"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="自评分类"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.selfTableType.name}}
        </template>
      </el-table-column>
      <el-table-column
        prop="configurationStatus"
        label="配置状态"
         align="center"
      >
      </el-table-column>
      <el-table-column
        prop="onlineStatus"
        label="上下线状态"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
      >
        <template slot-scope="scope">
          {{ DateFormat({ date: scope.row.createTime*1000 }) }}
        </template>
      </el-table-column>
      <el-table-column
        label="上线时间"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.onlineTime == 0">-</span>
          <span v-else>{{ DateFormat({ date: scope.row.onlineTime*1000 }) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button style="width:60px" type="text" v-if="scope.row.configurationStatus == '未完成'" @click="$router.push('/setting/info?tableCode=' + scope.row.tableCode)">继续配置</el-button>
          <el-button style="width:60px" type="text" v-else @click="$router.push('/read/info?tableCode=' + scope.row.tableCode)">详情</el-button>
          <el-button style="width:40px" type="text" @click="changeStatus(scope.row.tableCode,scope.row.configurationStatus,'上线')" :disabled="scope.row.configurationStatus == '未完成'   || scope.row.onlineStatus == '上线' ? true : false ">上线</el-button>
          <el-button style="width:40px" type="text" @click="changeStatus(scope.row.tableCode,scope.row.configurationStatus,'下线')" :disabled="scope.row.onlineStatus !== '上线' ">下线</el-button>
          <el-button style="width:40px" type="text" @click="deleteHandle(scope.row.tableCode)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="text-center mt-5"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import AlertBox from '@/components/AlertBox'
import { tableList, tableStatus, selfTableTypeList, selfTableDelete } from '@/api/modules/operate'
import { DateFormat } from '@/utils/date'
export default {
  name: 'operate-list',
  components: {
    AlertBox
  },
  data () {
    return {
      loading: false,
      DateFormat: DateFormat,
      page: 1,
      total: 0,
      tableData: [],
      selfTypeList: [],
      form: {
        tableName: '',
        selfTableTypeId: 0,
        configurationStatus: '全部',
        onlineStatus: '全部',
        createTimeStart: '',
        createTimeEnd: ''
      },
      value: [],
      nowDate: '',
      oldDate: ''
    }
  },
  computed: {
    querys () {
      let res = {}
      const { tableName, selfTableTypeId, configurationStatus, onlineStatus, createTimeStart, createTimeEnd } = this.form
      if (tableName !== '') res = { ...res, tableName }
      res = { ...res, selfTableTypeId }
      res = { ...res, configurationStatus }
      res = { ...res, onlineStatus }
      if (createTimeStart !== '') res = { ...res, createTimeStart }
      if (createTimeEnd !== '') res = { ...res, createTimeEnd }
      return res
    },
    haveQuery () {
      const res = Object.keys(this.form).every(v => { return this.form[v] === '' })
      return res
    }
  },
  created () {
    this.init()
    this.selfType()
    // this.nowDate = new Date().getTime()
    // this.oldDate = new Date()
    // const oldDate = this.oldDate
    // oldDate.setDate(oldDate.getDate() - 365)
    // this.oldDate = oldDate.getTime()
    // this.value = [this.oldDate, this.nowDate]
  },
  methods: {
    init () {
      this.loading = true
      const findJson = {
        page: this.page,
        pageSize: 10,
        tableName: this.form.tableName,
        selfTableTypeId: this.form.selfTableTypeId,
        configurationStatus: this.form.configurationStatus === '全部' ? '' : this.form.configurationStatus,
        onlineStatus: this.form.onlineStatus === '全部' ? '' : this.form.onlineStatus,
        createTimeStart: this.form.createTimeStart,
        createTimeEnd: this.form.createTimeEnd
      }
      tableList(findJson).then(
        ({ data = {} }) => {
          this.tableData = data.tables || []
          this.page = data.pager.page || 1
          this.total = data.pager.totalRow || 0
          this.loading = false
        }
      )
    },
    async selfType () {
      const res = await selfTableTypeList({ page: -1, pageSize: 10 })
      this.selfTypeList = res.data.tables
      this.$store.commit('SET_SELF_Type', this.tableData)
    },
    query () {
      this.page = 1
      if (this.querys.onlineStatus === '全部') {
        this.querys.onlineStatus = ''
      }
      if (this.querys.configurationStatus === '全部') {
        this.querys.configurationStatus = ''
      }
      // const params = this.querys
      this.init()
    },
    reset () {
      Object.keys(this.form).forEach(v => {
        if (v === 'configurationStatus' || v === 'onlineStatus') {
          this.form[v] = '全部'
        } else if (v === 'selfTableTypeId') {
          this.form[v] = 0
        } else {
          this.form[v] = ''
        }
      })
      this.value = []
      this.page = 1
      this.init()
    },
    dateChange () {
      // if (this.value[0] === this.value[1]) {
      //   this.value[1] = this.value[0] + 23 * 59 * 59 * 1000
      // }
      this.value[1] = this.value[1] + 23 * 59 * 59 * 1000
      this.form.createTimeStart = this.value[0] / 1000
      this.form.createTimeEnd = this.value[1] / 1000
    },
    handleCurrentChange (val) {
      this.page = val
      if (this.querys.onlineStatus === '全部') {
        this.querys.onlineStatus = ''
      }
      if (this.querys.configurationStatus === '全部') {
        this.querys.configurationStatus = ''
      }
      const params = this.querys
      this.init(params)
    },
    changeStatus (tableCode, configurationStatus, onlineStatus) {
      this.$confirm(`确定${onlineStatus === '上线' ? '上线' : '下线'}该量表吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tableStatus({ tableCode, configurationStatus, onlineStatus }).then(res => {
          this.$message({
            type: 'success',
            message: `${onlineStatus === '上线' ? '上线' : '下线'}成功`
          })
          this.init()
        }).catch((err) => {
          this.$alert(err.message, {
            confirmButtonText: '确定'
          })
        })
      }).catch(() => {})
    },
    // 删除量表
    deleteHandle (code) {
      const tableCode = code
      this.$confirm('确定删除该量表吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        selfTableDelete({ tableCode }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.init()
        }).catch((err) => {
          this.$alert(err.message, {
            confirmButtonText: '确定'
          })
        })
      }).catch(() => {})
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const arr = ['/setting/info', '/setting/content', '/setting/set', '/setting/show', '/read/info', '/read/content', '/read/set', '/read/show']
      // console.log(from)
      if (arr.includes(from.path)) {
        vm.init()
        // vm.selfType()
      } else {
        // vm.page = 1
        // vm.form.tableName = ''
        // vm.form.selfTableTypeId = ''
        // vm.form.configurationStatus = '全部'
        // vm.form.onlineStatus = '全部'
        // vm.value = []
        // vm.form.createTimeStart = ''
        // vm.form.createTimeEnd = ''
        vm.reset()
        // vm.init()
        // vm.selfType()
      }
    })
  },
  activated () {
  }
}
</script>
<style lang='less' scoped>
.el-button--text{
  text-decoration: none;
}

.list-message {
  border-radius: 8px;
  .el-message-box__message {
    font-weight: 700;
    color: #34B7B9;
  }
}
.elForm{
  flex: 1 1 0%;
  display: flex;
  flex-wrap: wrap;
}
.el-form-item{
  margin-right: 40px !important;
  display: flex;
}
/deep/.el-form-item__label{
  white-space: nowrap;
}
.el-input,.el-select{
  width: 240px;
}
.el-range-editor--mini.el-input__inner{
  width: 240px;
}
/deep/ .el-date-editor .el-range-separator{
  padding: 0;
}
.batch-list {
  padding: 40px 4%;
  &>.title {
    margin-bottom: 20px;
    font-size: 24px;
    color: #34B7B9;
  }
}
</style>
<style lang="less">
.el-picker-panel[slot=sidebar], .el-picker-panel__sidebar{
  display: none;
}
.el-picker-panel [slot=sidebar]+.el-picker-panel__body, .el-picker-panel__sidebar+.el-picker-panel__body{
  margin-left: 0;
}
</style>

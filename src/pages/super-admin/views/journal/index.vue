<template>
  <div class="batch-list">
    <!-- <p class="title">查询</p> -->
    <div class="search">
      <el-form
        ref="form"
        :model="form"
        :inline="true"
        size="mini"
      >
        <el-form-item>
          <el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleSelect"
            value-format="timestamp"
            :default-time="['00:00:00','23:59:59']"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.username" filterable placeholder="请选择账号" style="width: 178px;">
            <el-option :value="''" label="全部账号"></el-option>
            <el-option :value="item" :label="item" v-for="item in userList" :key="item.index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="query">查询</el-button>
          <el-button size="mini" plain @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <alert-box>
      <div slot="before">
        共有{{ pager.totalRow }}个项目
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
        label="时间"
        align="center"
      >
       <template slot-scope="scope">
          <span>{{DateFormat({ date: scope.row.createdAt*1000 })}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        label="操作账号"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="账号类别"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{userType(scope.row.type)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="detail"
        label="操作详情"
        align="center"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      class="text-center mt-5"
      @current-change="handleCurrentChange"
      :current-page.sync="pager.page"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="pager.totalRow"
    >
    </el-pagination>
  </div>
</template>

<script>
import AlertBox from '@/components/AlertBox'
import { DateFormat } from '@/utils/date'
import { journalList, userList } from '@/api/modules/member'
export default {
  name: 'journal',
  components: {
    AlertBox
  },
  data () {
    return {
      DateFormat: DateFormat,
      dateValue: [],
      tableData: [],
      userList: [],
      loading: false,
      form: {
        startTime: '',
        endTime: '',
        username: ''
      },
      pager: {
        page: 1,
        totalRow: 0
      }
    }
  },

  mounted () {
    userList().then(res => {
      this.userList = res.data.admins.map(v => {
        return v.username
      })
    })
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      const find = {
        page: this.pager.page,
        pageSize: 10,
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        username: this.form.username
      }
      journalList(find).then(res => {
        this.tableData = res.data.logRecords
        this.pager = res.data.pager
        this.loading = false
      })
    },
    userType (type) {
      if (type === 'superadmin') {
        return '总部管理员'
      } else if (type === 'org_superadmin') {
        return '部门管理员'
      }
    },
    handleSelect () {
      if (this.dateValue) {
        this.form.startTime = this.dateValue[0] / 1000
        this.form.endTime = this.dateValue[1] / 1000
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
    },
    query () {
      this.pager.page = 1
      this.init()
    },
    reset () {
      this.dateValue = []
      this.form.startTime = ''
      this.form.endTime = ''
      this.form.username = ''
      this.pager.page = 1
      this.init()
    },
    handleCurrentChange (val) {
      this.pager.page = val
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
.batch-list {
  padding: 40px 4%;
  &>.title {
    margin-bottom: 20px;
    font-size: 24px;
    color: #34B7B9;
  }
}
.el-form-item{
  margin-right: 40px !important;
  display: inline-block;
  vertical-align: top;

}
.el-range-editor--mini.el-input__inner{
  border-color: #ccc;
}
</style>

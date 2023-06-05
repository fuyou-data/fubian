<template>
  <div class="batch-list">
    <p class="title">查询</p>
    <div class="search">
      <el-form
        ref="form"
        :model="form"
        :inline="true"
        size="mini"
      >
        <el-form-item label="关键词：">
          <el-input v-model="form.keyword" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="success" size="mini" @click="query">查询</el-button>
          <el-button size="mini" plain :disabled="!hasQuery" @click="reset">重置</el-button>
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
      <el-table-column label="姓名" prop="name" align="center">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="部门"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="username"
        label="账号"
        align="center"
      >
      </el-table-column>
      <!-- <el-table-column
        v-for="(item, index) in normalAdminDimension"
        :key="'normalAdminDimension' + index"
        :label="item"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.scope[item] }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="text" v-if="!scope.row.isAdd" @click="handleDetail(scope.row)">详情</el-button>
        </template>
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
    <div v-if="showDetail">
      <Detail ref="drawer"></Detail>
    </div>
  </div>
</template>

<script>
import AlertBox from '@/components/AlertBox'
import Detail from './modules/MemberDetail.vue'
import { memberList } from '@/api/modules/member'
export default {
  name: 'members-list',
  components: {
    AlertBox,
    Detail
  },
  data () {
    return {
      loading: false,
      showDetail: false,
      pager: {
        page: 1,
        pageSize: 10,
        totalRow: 0
      },
      tableData: [],
      form: {
        keyword: ''
      },
      normalAdminDimension: []
    }
  },
  computed: {
    hasQuery () {
      const { keyword } = this.form
      if (keyword !== '') return true

      return false
    },
    querys () {
      let res = {}
      const { keyword } = this.form
      if (keyword !== '') res = { ...res, keyword }
      return res
    }
  },
  created () {
    this.init()
  },
  methods: {
    init (params = {}) {
      this.loading = true
      const findJson = {
        page: this.pager.page,
        pageSize: 10,
        keyword: this.form.keyword
      }
      memberList(findJson).then(
        ({ data = {} }) => {
          this.tableData = data.users || []
          this.pager = data.pager
          this.loading = false
        }
      )
    },
    query () {
      this.pager.page = 1
      this.init()
    },
    reset () {
      this.form.keyword = ''
      this.pager.page = 1
      this.init()
    },
    handleDetail (row) {
      this.showDetail = true
      this.$nextTick(() => {
        this.$refs.drawer.drawer = true
        this.$refs.drawer.username = row.username
        this.$refs.drawer.getData()
      })
    },
    handleCurrentChange (val) {
      this.pager.page = val
      const params = this.querys
      this.init(params)
    }
  }
}
</script>

<style lang="less" scoped>
.el-form{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .el-form-item{
    margin-right: 40px;
  }
  .last{
    text-align: center;
  }
}
.list-message {
  border-radius: 8px;
  .el-message-box__message {
    font-weight: 700;
    color: #34B7B9;
  }
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

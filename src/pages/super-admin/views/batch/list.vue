<template>
  <div class="batch-list">
    <div class="search">
      <el-form ref="form" :model="form" :inline="true" size="mini">
        <el-form-item label="关键字：">
          <el-input v-model="form.keyword" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <!-- <el-form-item label="部门：">
          <el-select v-model="form.orgName" filterable placeholder="请选择部门名称" style="width: 178px;">
            <el-option :value="t.orgName" :label="t.orgName" v-for="t in orgNames" :key="t.orgName"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item class="last">
          <el-button type="success" size="mini" @click="findWithParams">查询</el-button>
          <el-button size="mini" plain :disabled="!hasQuery" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <alert-box>
      <div slot="before"> 共有{{ total }}个批次</div>
      <div slot="after">
        <el-button class="btn-normal" type="success" @click="$router.push('/batch/add')">创建批次</el-button>
      </div>
    </alert-box>
    <el-table v-loading="loading" ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="name" label="批次名称"></el-table-column>
      <el-table-column prop="id" label="批次号"></el-table-column>
      <!-- <el-table-column prop="organization.orgName" label="部门名称"></el-table-column> -->
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{ DateFormat({ date: scope.row.createdAt*1000 }) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push(`/batch/detail?id=${scope.row.id}`)">详情</el-button>
          <el-button type="text" :disabled="!scope.row.canDelete" @click="deleteBatch(scope.row.id)">删除</el-button>
          <!-- <el-button type="text" @click="copy(scope.row.id)">复制</el-button> -->
          <el-button type="text" @click="$router.push(`/batch/statistic?id=${scope.row.id}`)">数据统计</el-button>
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
// import { getOrgList } from '@/api/modules/organ'
import AlertBox from '@/components/AlertBox'
import { batchLists, delBatch } from '@/api/modules/batch'
import { DateFormat } from '@/utils/date'
export default {
  name: 'list',
  components: {
    AlertBox
  },
  data () {
    return {
      loading: false,
      DateFormat: DateFormat,
      page: 1,
      total: 0,
      orgNames: [],
      tableData: [],
      form: {
        keyword: ''
      },
      multipleSelection: []
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
    // this.find()
    // getOrgList({
    //   orgName: '',
    //   page: -1,
    //   pageSize: 10
    // }).then(res => {
    //   this.orgNames = res.data.orgs
    // })
  },
  methods: {
    find (params = {}) {
      this.loading = true
      const findJson = {
        page: this.page,
        pageSize: 10,
        keyword: this.form.keyword
      }
      batchLists(findJson).then(
        ({ data = {} }) => {
          this.tableData = data.items || []
          this.page = data.pager?.page || 1
          this.total = data.pager?.totalRow || 0
          this.loading = false
        }
      )
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    findWithParams () {
      this.page = 1
      // const params = this.querys
      this.find()
    },
    reset () {
      this.form.keyword = ''
      this.page = 1
      this.find()
    },
    handleCurrentChange (val) {
      this.page = val
      const params = this.querys
      this.find(params)
    },
    deleteBatch (id) {
      this.$confirm('此操作将永久删除该批次, 是否继续?', '', {
        customClass: 'list-message',
        confirmButtonClass: 'el-button--success btn-normal',
        cancelButtonClass: 'is-plain btn-normal',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        center: true
      }).then(() => {
        delBatch(id).then(
          () => {
            this.page = 1
            this.find()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    copy (id) {
      this.$router.push({
        name: '添加批次',
        params: { id }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const arr = ['/batch/detail', '/batch/add', '/batch/statistic']
      if (arr.includes(from.path)) {
        // console.log(vm.form.orgName)
        vm.find()
      } else {
        // vm.page = 1
        // vm.form.orgName = ''
        // vm.form.batchName = ''
        // vm.form.batchId = ''
        // vm.find()
        vm.reset()
      }
    })
  },
  activated () {
    // this.find()
    // console.log('激活了')
    // console.log(this.form.orgName)
  }
}
</script>

<style lang="less" scoped>
.list-message {
  border-radius: 8px;
  .el-message-box__message {
    font-weight: 700;
    color: #34B7B9;
  }
}
.batch-list {
  padding: 40px 4%;
  .el-form-item{
    margin-right: 40px;
  }
  .title {
    margin-bottom: 20px;
    font-size: 24px;
    color: #34B7B9;
  }
}
</style>

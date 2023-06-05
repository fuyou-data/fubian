<template>
  <div class="batch-list">
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
        <!-- <el-form-item label="部门名称：">
          <el-select v-model="form.orgName" filterable placeholder="请选择部门名称" style="width: 178px;">
            <el-option :value="t.orgName" :label="t.orgName" v-for="t in orgNames" :key="t.orgName"></el-option>
          </el-select>
        </el-form-item> -->
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
      <div slot="after">
        <el-button class="btn-normal" type="success" @click="handleAdd">新增</el-button>
        <el-button class="btn-normal" type="success" @click="addMore">批量新增</el-button>
        <!-- <el-button class="btn-normal" type="success"  :disabled="selectOrg.length === 0" @click="setOrg">设置部门</el-button> -->
      </div>
    </alert-box>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column
        type="selection"
        width="55"
        align="center"
      >
      </el-table-column> -->
      <el-table-column
        prop="username"
        label="账号"
        align="center"
      >
       <template slot-scope="scope">
          <el-input v-if="scope.row.isAdd"  size="mini" placeholder="请输入账号" maxlength="30" v-model="scope.row.username">
          </el-input>
          <span v-else>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" align="center">
        <template slot-scope="scope">
          <el-input v-if="scope.row.isAdd" size="mini" placeholder="请输入姓名" maxlength="20" v-model.trim="scope.row.name">
          </el-input>
          <span v-else>{{scope.row.name || '-'}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="orgName"
        label="部门"
        align="center"
      >
       <template slot-scope="scope">
         <el-select size="mini"  v-if="scope.row.isAdd" filterable  v-model="scope.row.orgName" placeholder="请选择部门">
            <el-option v-for="t in orgNames"  :value="t.orgName" :label="t.orgName" :key="t.index"></el-option>
          </el-select>
          <span v-else>{{scope.row.orgName}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="编号" prop="identifier" align="center">
        <template slot-scope="scope">
          <el-input v-if="scope.row.isAdd" size="mini" placeholder="请输入编号" maxlength="20" v-model.trim="scope.row.identifier">
          </el-input>
          <span v-else>{{scope.row.identifier || '-'}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        v-for="item in normalAdminDimension"
        :key="item.index"
        :label="item"
        align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.isAdd">
            <el-input size="mini" v-model="scope.row.scope[item]"></el-input>
          </div>
          <span v-else>{{scope.row.scope[item] }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.isAdd" @click="handleSave(scope.row)">保存</el-button>
          <el-button type="text" v-if="scope.row.isAdd" @click="handleCancle(scope.row)">取消</el-button>
          <el-button type="text" v-if="!scope.row.isAdd" @click="handleDetail(scope.row)">详情</el-button>
          <el-button type="text" v-if="!scope.row.isAdd" :disabled="!scope.row.canDelete" @click="handleDelete(scope.row)">删除</el-button>
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
    <Dialog ref="upload" :selectOrg="selectOrg" :orgNames="orgNames"></Dialog>
    <div v-if="showDetail">
      <Detail  ref="drawer"></Detail>
    </div>
  </div>
</template>

<script>
import AlertBox from '@/components/AlertBox'
import Detail from './modules/MemberDetail.vue'
import Dialog from './modules/MemberDialog.vue'
import { memberList, addMember, deleteMember } from '@/api/modules/member'
// import { getOrgList } from '@/api/modules/organ'
export default {
  name: 'members-list',
  components: {
    AlertBox,
    Detail,
    Dialog
  },
  data () {
    return {
      loading: false,
      showDetail: false,
      orgNames: [],
      pager: {
        page: 1,
        pageSize: 10,
        totalRow: 0
      },
      tableData: [],
      selectOrg: [],
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
    // getOrgList({
    //   orgName: '',
    //   page: -1,
    //   pageSize: 10
    // }).then(res => {
    //   this.orgNames = res.data.orgs
    // })
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
    handleAdd () {
      for (const i of this.tableData) {
        if (i.isAdd) return this.$message.warning('请先保存当前编辑项')
      }
      var obj = { name: '', username: '', identifier: '', isAdd: true }
      this.tableData.unshift(obj)
    },
    addMore () {
      this.$refs.upload.dialogVisible = true
    },
    setOrg () {
      this.$refs.upload.orgVisible = true
    },
    handleSave (row) {
      const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{6,30}$/
      // const reg1 = /^[a-zA-Z\u4e00-\u9fa5]+$/
      // else if (!reg1.test(row.name)) {
      //   this.$message({
      //     type: 'error',
      //     message: '姓名仅限输入中英文'
      //   })
      // }
      if (row.username === '' || row.name === '') {
        this.$message({
          type: 'error',
          message: '请完善成员信息后保存'
        })
      } else if (!reg.test(row.username)) {
        this.$message({
          type: 'error',
          message: '账号格式不对'
        })
      } else {
        const config = { name: row.name, username: row.username, identifier: row.identifier }
        addMember(config).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            row.isAdd = false
            this.init()
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
      }
    },
    handleCancle (row) {
      this.tableData.shift()
      row.isAdd = false
    },
    handleDetail (row) {
      this.showDetail = true
      this.$nextTick(() => {
        this.$refs.drawer.drawer = true
        this.$refs.drawer.username = row.username
        this.$refs.drawer.getData()
      })
    },
    handleDelete (row) {
      this.$confirm('确定删除该成员吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMember({ username: row.username }).then(res => {
          this.init()
          this.$message({ type: 'success', message: '删除成功' })
        })
      }).catch(() => {})
    },
    handleCurrentChange (val) {
      this.pager.page = val
      const params = this.querys
      this.init(params)
    },
    handleSelectionChange (selection) {
      this.selectOrg = selection.map(v => {
        return v.username
      })
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

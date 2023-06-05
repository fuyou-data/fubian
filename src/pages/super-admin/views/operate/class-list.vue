<template>
  <div class="batch-list">
    <div style="min-height:450px">
      <alert-box >
        <div slot="before">
          共{{total}}个项目
        </div>
        <div slot="after">
          <el-button class="btn-normal" type="success" @click="handleAdd()">新增</el-button>
        </div>
      </alert-box>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="border: 1px solid #E4E4E4; margin-top:10px"
      >
        <el-table-column label="自评分类" prop="name" align="center" min-width="200">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isSet" size="mini" @input="cNameHandle(scope.row)" placeholder="请输入自评分类" v-model="scope.row.name">
            </el-input>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
              <el-button v-if="scope.row.isSet" type="text"  @click="handleSave(scope.$index,scope.row)">确定</el-button>
              <el-button v-if="scope.row.isSet" type="text"  @click="handleCancle(scope.$index,scope.row)">取消</el-button>
              <el-button v-if="!scope.row.isSet" type="text"  @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
              <el-button v-if="!scope.row.isSet" type="text" :disabled="scope.row.count === 0 ? false : true"  @click="handleDelete(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import { selfTableTypeList, selfTableTypeAdd, selfTableTypeUpdate, selfTableTypeDelete } from '@/api/modules/operate'
export default {
  data () {
    return {
      tableData: [],
      page: 1,
      total: 0,
      loading: false,
      isAdd: true
    }
  },
  components: {
    AlertBox
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      const findJson = {
        page: this.page,
        pageSize: 10
      }
      selfTableTypeList(findJson).then(
        ({ data = {} }) => {
          this.page = data.pager.page || 1
          this.total = data.pager.totalRow || 0
          const da = data.tables
          if (da) {
            da.forEach(v => {
              v.isSet = false
            })
            this.tableData = da
          } else {
            this.tableData = []
          }
          this.loading = false
        }
      )
    },
    cNameHandle (row) {
      var item = row.name
      var length = 0
      for (var i = 0; i < item.length; i++) {
        if ((item.charCodeAt(i) & 0xff00) !== 0) {
          length++
        }
        length++
        if (length > 8) {
          row.name = item.substring(0, i)
          break
        }
      }
    },
    // 新增
    handleAdd () {
      for (const i of this.tableData) {
        if (i.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      this.isAdd = true
      var scopeobj = { name: '', isSet: true }
      this.tableData.unshift(scopeobj)
    },
    // 保存
    handleSave (index, row) {
      const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
      if (row.name === '') {
        this.$message({
          type: 'error',
          message: '输入不能为空'
        })
      } else if (!reg.test(row.name)) {
        this.$message({
          type: 'error',
          message: '支持中英文及数字'
        })
      } else {
        if (this.isAdd) {
          const data = { name: row.name }
          selfTableTypeAdd(data).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              row.isSet = false
              this.init()
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
              row.isSet = true
              row.name = ''
            }
          })
        } else {
          const data = { name: row.name, id: row.id }
          selfTableTypeUpdate(data).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              row.isSet = false
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
            this.init()
          })
        }
      }
    },
    // 编辑
    handleEdit (index, row) {
      for (const i of this.tableData) {
        if (i.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      row.oldName = row.name
      this.isAdd = false
      row.isSet = true
    },
    // 取消
    handleCancle (index, row) {
      if (this.isAdd) {
        this.tableData.shift()
      } else {
        row.name = row.oldName
      }
      row.isSet = false
      this.$message.info('取消编辑')
      // this.init()
    },
    // 删除
    handleDelete (index, row) {
      this.$confirm('确定删除该分类吗?', '', {
        customClass: 'list-message',
        confirmButtonClass: 'el-button--success btn-normal',
        cancelButtonClass: 'is-plain btn-normal',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        center: true
      }).then(() => {
        selfTableTypeDelete({ id: row.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
          this.init()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCurrentChange (val) {
      // console.log(val)
      this.page = val
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
.batch-list {
  padding: 40px 4%;
}
.list-message {
  border-radius: 8px;
  .el-message-box__message {
    font-weight: 700;
    color: #34B7B9;
  }
}
.addBtn {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
}
.submitBtn {
width: 100%;
display: flex;
justify-content: center;
margin-top: 50px;
}
/deep/.el-table th{
  background: #FBFBFB;
}
/deep/.el-input--mini .el-input__inner{
  width: 200px;
}
/deep/.el-table td, .el-table th{
  padding: 0;
  height: 48px;
}
</style>

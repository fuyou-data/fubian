<template>
  <div class="table-wrap">
    <alert-box>
      <div slot="before">共有{{pager.totalRow}}个项目</div>
      <div slot="after">
        <el-button @click="create()" class="btn-normal" type="success">新建部门</el-button>
      </div>
    </alert-box>
    <el-table
      class="table"
      ref="table"
      :data="tableData"
      tooltip-effect="dark"
      size="medium"
      style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="55"></el-table-column>
      <!-- <el-table-column label="序号" header-align="center" align="center" width="80">
        <template slot-scope="scope">
          <span>{{(pager.page - 1) * pager.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="部门名称" prop="orgName" header-align="center" align="center"></el-table-column>
      <el-table-column label="管理员" prop="username" header-align="center" align="center" ></el-table-column>
      <el-table-column label="操作" header-align="center" align="center">
        <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="mini">编辑</el-button>
            <el-button :disabled="!scope.row.canDelete" @click="del(scope.row)" type="text" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @current-change="handlePageChange"
      :current-page="pager.page"
      :page-size="pager.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pager.totalRow">
    </el-pagination>
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="700px">
      <span v-if="createFlag" class="dialog-title" slot="title">新建部门</span>
      <span v-else class="dialog-title" slot="title">编辑部门</span>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <div class="form-title"><i></i>基本信息</div>
        <el-form-item prop="orgName" label="部门名称：">
          <el-input v-model.trim="form.orgName" placeholder="请输入部门名称" maxlength="20" style="width: 217px"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="orgType" label="部门性质：" >
          <el-select v-model="form.orgType" placeholder="请选择部门性质" clearable style="width: 217px">
            <el-option label="学校" value="school"></el-option>
            <el-option label="医院" value="hospital"></el-option>
          </el-select>
        </el-form-item> -->
        <div class="form-title"><i></i>超级管理员配置</div>
        <el-form-item prop="username" label="用户名：">
          <el-input v-if="createFlag" placeholder="30位以内中文/英文/数字/下划线" v-model="form.username" style="width: 217px"></el-input>
          <el-input v-else v-model="form.username" placeholder="30位以内中文/英文/数字/下划线" style="width: 217px" disabled></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input v-if="createFlag" v-model="form.password" placeholder="6-20位英文/数字/符号" style="width: 217px" show-password></el-input>
          <el-input v-else v-model="form.password" placeholder="6-20位英文/数字/符号" style="width: 217px" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="createFlag" type="success" @click="createSubmit()">确定</el-button>
        <el-button v-else type="success" @click="editSubmit()">确定</el-button>
        <el-button plain @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import AlertBox from '@/components/AlertBox'
import { checkOrgName, checkUsername, orgAdd, orgUpdate, orgDelete } from '@/api/modules/organ'
export default {
  name: 'OrganTable',
  components: {
    AlertBox
  },
  props: {
    tableData: Array,
    pager: Object
  },
  data () {
    // 验证部门名是否重复
    const validateOrgName = (rule, value, callback) => {
      if (this.createFlag || (value !== this.editTemp.orgName)) {
        checkOrgName(value).then(data => {
          callback()
        }).catch(err => {
          console.log(err)
          if (err.code === 1205) {
            callback(new Error('部门名重复'))
          } else {
            callback(new Error(err.message))
          }
        })
      } else {
        callback()
      }
    }
    // 验证用户名是否重复
    const validateUsername = (rule, value, callback) => {
      if (this.createFlag || (value !== this.editTemp.username)) {
        checkUsername(value).then(data => {
          callback()
        }).catch(err => {
          console.log(err)
          if (err.code === 1) {
            callback(new Error('用户名重复'))
          }
        })
      } else {
        callback()
      }
    }
    const legalUserName = (rule, value, callback) => {
      const reg=  /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,30}$/
      const flag = reg.test(value)
      if (!flag) {
        return callback(new Error('30位以内中文/英文/数字/下划线'))
      } else {
        return callback()
      }
    }
    const legalPassword = (rule, value, callback) => {
      const reg = /[a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+\-\=\{\}\[\]\:\"\;\'\<\>\?\,\.\/]{6,20}$/
      const flag = reg.test(value)
      if (!flag) {
        return callback(new Error('6-20位英文/数字/符号'))
      } else {
        return callback()
      }
    }
    return {
      dialogFormVisible: false,
      form: {},
      rules: {
        orgName: [
          { required: true, message: '部门名不得为空', trigger: 'blur' },
          { validator: validateOrgName, trigger: 'blur' }
        ],
        // orgType: [
        //   { required: true, message: '部门类型不得为空', trigger: 'blur' }
        // ],
        username: [
          { required: true, message: '用户名不得为空', trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' },
          { validator: legalUserName, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不得为空', trigger: 'blur' },
          { validator: legalPassword, trigger: 'blur' }

        ]
      },
      rulesPassword: [
        { required: true, message: '密码不得为空', trigger: 'blur' },
        { validator: legalPassword, trigger: 'blur' }
      ],
      createFlag: true,
      editTemp: {}
    }
  },
  computed: {
    // total () {
    //   return this.tableData.length
    // }
  },
  filters: {
    orgTypes (val) {
      switch (val) {
        case 'school':
          return '学校'
        case 'hospital':
          return '医院'
        default: return val
      }
    }
  },
  methods: {
    create () {
      // 点击新建的时候先移除上次的验证
      this.$refs.form && this.$refs.form.clearValidate()
      this.form = {}
      this.createFlag = true
      this.rules.password = this.rulesPassword
      this.dialogFormVisible = true
    },
    createSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          orgAdd(this.form).then(() => {
            this.dialogFormVisible = false
            this.$message.success('新增部门成功')
            this.query()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    edit (obj) {
      // 点击编辑的时候先移除上次的验证
      this.$refs.form && this.$refs.form.clearValidate()
      this.editTemp = obj
      this.form = Object.assign({}, obj)
      this.createFlag = false
      // this.rules.password = []
      this.dialogFormVisible = true
    },
    editSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(valid)
          orgUpdate(this.form).then(() => {
            this.dialogFormVisible = false
            this.$message.success('编辑部门成功')
            this.query()
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    del (obj) {
      this.$confirm('确定要删除该部门信息吗?', '提示', {
        customClass: 'list-message',
        confirmButtonClass: 'el-button--success btn-normal',
        cancelButtonClass: 'is-plain btn-normal',
        showClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { orgID } = obj
        orgDelete(orgID).then(() => {
          this.$message.success('删除部门成功')
          this.query()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    exportAll () {},
    exportSelect () {},
    handlePageChange (p) {
      this.$emit('changeSize', p)
    },
    query () {
      this.$emit('handleQuery')
    }
  }
}
</script>

<style lang="less" scoped>
.table-wrap {
  padding: 0 3rem 2rem;
}
.table {
  margin-top: 1rem;
}
.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}
.form-title {
  font-weight: bold;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  i {
    display: inline-block;
    width: 3px;
    height: 14px;
    background-color: #39CACC;
    margin-right: 8px;
  }
}
</style>
<style lang="less">
.dialog-title {
  color: #39CACC;
  font-weight: bold;
}
</style>

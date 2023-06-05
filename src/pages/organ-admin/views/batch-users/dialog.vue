<template>
  <div>
      <el-dialog title="测试内容选择" v-if="dialogFormVisible" :visible.sync="dialogFormVisible">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="tables" ref="tables">
            <tree-transfer
              :title="title"
              :formData="formData"
              :toData="toData"
              @getTransValue="getTransValue">
            </tree-transfer>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="save" style="margin-left:40px">确 定</el-button>
        </div>
        </el-dialog>
  </div>
</template>

<script>
import treeTransfer from './trans.vue'
export default {
  name: 'select_table',
  props: {
    batchId: {
      type: String
    },
    formData: {
      type: Array
    }
  },
  components: {
    treeTransfer
  },
  data () {
    return {
      dialogFormVisible: false,
      title: ['测试范围', '选中测试'],
      form: {
        tables: [],
        tablesName: []
      },
      rules: {
        tables: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      toData: []
    }
  },
  methods: {
    getTransValue (value, name) {
      this.form.tables = value
      this.form.tablesName = name
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('getSelectTables', this.form.tables, this.form.tablesName)
          this.form.tables = []
          this.form.tablesName = []
          this.dialogFormVisible = false
        } else {
          this.$message.error('您未选择任何测试')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

/deep/ .wl-transfer{
    .transfer-left,.transfer-right{
        border-radius: 0;
    }
    .transfer-title{
        background: #fff;
    }
    .el-input__inner{
        border: 0;
        background: #f9f9f9;
    }
    .transfer-main::-webkit-scrollbar{
        width : 5px;
        height: 5px;
    }
    .transfer-main::-webkit-scrollbar-thumb{
        border-radius: 3px;
        background: #DFDFDF;
    }
    .transfer-main::-webkit-scrollbar-track{
        border-radius: 10px;
        background: rgba(0, 0, 0, 0);
    }
    .el-checkbox{
      margin-bottom: 0;
    }
}
/deep/.el-form-item__content{
  display: flex;
  justify-content: center;
}
.dialog-footer{
  display: flex;
  justify-content: center;
  align-items: center;
}
/deep/.el-dialog{
  min-width: 820px;
}

</style>

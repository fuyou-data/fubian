<template>
  <div>
    <el-dialog title="添加成员" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="tables" ref="tables">
          <el-transfer
          filterable
          :titles="['可选成员', '已添加成员']"
          :filter-method="filterMethod"
          filter-placeholder="请输入搜索内容"
          v-model="selectData"
          :data="formatSelectArr">
          </el-transfer>
        </el-form-item>
      </el-form>
      <div class="red-box" v-show="selectFlag">
        您未选择任何成员！
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="save" style="margin-left:40px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'member',
  props: {
    formatSelectArr: {
      type: Array
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      selectData: [],
      selectFlag: false,
      form: {
        tables: []
      },
      rules: {
        tables: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      formData: [],
      toData: []
    }
  },
  watch: {
    dialogFormVisible (newV, oldV) {
      if (!newV) {
        this.selectFlag = false
      }
    }
  },
  methods: {
    filterMethod (query, item) {
      return item.label.indexOf(query) > -1
    },
    clearData () {
      this.selectData = []
    },
    save () {
      if (this.selectData.length > 0) {
        this.selectFlag = false
        this.$emit('save', this.selectData)
      } else {
        this.selectFlag = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog{
  min-width: 820px;
}
/deep/.el-transfer-panel{
  width: 280px;
  height: 450px;
}
/deep/.el-dialog__header{
  .el-dialog__title{
    font-size: 18px;
    font-weight: 700;
    color: #34B7B9;
  }
}
/deep/.el-dialog__body{
  padding: 0 20px;
}
/deep/.el-transfer-panel__list.is-filterable{
  height: 337px;
}
/deep/.el-transfer-panel__item.el-checkbox .el-checkbox__label{
  color: #666666;
}
/deep/.el-transfer-panel__filter .el-input__inner{
  border-radius: 0px;
}
.red-box{
  font-size: 12px;
  color: #F75234;
}
.dialog-footer{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
</style>

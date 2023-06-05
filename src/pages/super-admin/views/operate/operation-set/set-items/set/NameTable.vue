<template>
  <el-form :model="item" ref="myform" :rules="rules">
    <table>
      <tr class="first-tr">
        <td> </td>
        <td>因子名称<span class="small-text">(最多15字)</span></td>
        <td>计算公式<span class="small-text">(不需输入"=")</span></td>
        <td>操作</td>
      </tr>
      <tr class="or-tr" v-for="(it, index) in item.frontFactorScoreFrom " :key="'frontFactorScoreFrom' + index">
        <td><div>F{{index+1}}</div></td>
        <td>
          <!-- , -->
          <el-form-item
            :rules="[
            { required: true, message: '输入不能为空', trigger: 'submit' },
            { validator: (rule,value,callback) => checkFactorName(rule,value,callback,it,index), trigger: 'submit' }
            ]"
            :prop=" 'frontFactorScoreFrom.' + index + '.factorName' ">
            <el-input v-model="it.factorName" maxlength="15" class="small-ipt" size="small" @input="factorNameCheck($event,index)" @blur="disposeArr"></el-input>
          </el-form-item>
        </td>
        <td>
          <el-form-item
            :rules="[{ required: true, message: '输入不能为空', trigger: 'submit' },
            { validator: (rule,value,callback) => checkFfactorScoreCalcFormula(rule,value,callback,it,index), trigger: 'submit' }
            ]"
            :prop=" 'frontFactorScoreFrom.' + index + '.factorScoreCalcFormula' ">
          <el-input class="td-textarea" @input="nameTableFilter($event,index)" v-model="it.factorScoreCalcFormula"  type="textarea" spellcheck ="false" :autosize="{minRows: 2,maxRows: 5}"  resize='none'></el-input>
          </el-form-item>
        </td>
        <td><span v-if="index > 0" class="del" @click="factorDel(index)">删除</span></td>
      </tr>
    </table>
  </el-form>
</template>

<script>
export default {
  props: {
    item: Object
  },
  data () {
    return {
      rules: {}
    }
  },
  methods: {
    checkFactorName (rule, value, callback, it, index) {
      const temp = []
      this.item.frontFactorScoreFrom.forEach((e, ind) => {
        if (ind !== index) {
          temp.push(e.factorName)
        }
      })
      if (temp.includes(it.factorName)) {
        return callback(new Error('因子名称不能重复'))
      } else {
        return callback()
      }
    },
    checkFfactorScoreCalcFormula (rule, value, callback, it, index) {
      const arr = []
      const arr1 = []
      for (const k in it.factorScoreCalcFormula) {
        // console.log(it.factorScoreCalcFormula[k])
        if (it.factorScoreCalcFormula[k] === '(') {
          arr.push(it.factorScoreCalcFormula[k])
        }
        if (it.factorScoreCalcFormula[k] === ')') {
          arr1.push(it.factorScoreCalcFormula[k])
        }
      }
      const reg = /(^((\(*Z\d+\)*)|(\(*\d+\)*))$)|(^((\(*Z\d+\)*)|(\(*\d+\)*))([+\-*/]((\(*Z\d+\)*)|(\(*\d+\)*)))+$)/
      const scoreArr = value.split(/[+\-*/]/)
      const filterArr = []
      scoreArr.forEach(e => {
        if (e.indexOf('Z') !== -1) {
          filterArr.push(e.match(/\d+/g)[0])
        }
      })
      const myFlag = filterArr.every(e => {
        return e <= this.$store.state.operate.questions.length
      })
      if (arr.length !== arr1.length) {
        return callback(new Error('因子分公式不匹配'))
      } else if (!reg.test(value)) {
        return callback(new Error('请输入正确格式'))
      } else if (!myFlag) {
        return callback(new Error('请输入正确格式'))
      } else {
        return callback()
      }
    },
    factorDel (index) {
      this.$emit('factorDel', index)
    },
    disposeArr () {
      this.$emit('inputBlur')
    },
    nameTableFilter (e, index) {
      this.$emit('nameTableFilter', e, index)
    },
    factorNameCheck (e, index) {
      this.$emit('factorNameCheck', e, index)
    },
    check () {
      let flag = false
      this.$refs.myform.validate((valid) => {
        if (valid) {
          // console.log('因子名字ok')
          flag = true
        } else {
          // console.log('因子名字nook')
        }
      })
      return flag
    }
  }
}
</script>

<style lang="less" scoped>
  table{
    background: #FBFBFB;
    width: 100%;
    tr{
      td:nth-child(1){
        width: 67px;
        text-align: center;
      }
      td:nth-child(2){
        width: 270px;
        padding-right: 30px;
      }
      td:nth-child(3){
        width: 724px;
        padding-right: 30px;
      }
      td:nth-child(4){
        width: 67px;
      }
    }
    .first-tr{
      height: 50px;
      background: #EEEEEE;
      line-height: 50px;
      td{
        font-size: 16px;
        font-weight: 500;
        color: #8C8C8C;
        span{
          font-size: 12px;
          color: #999999;
        }
      }
    }
    .or-tr{
      border-bottom: 1px solid #EEEEEE;
      td{
        position: relative;
        height: 84px;
        padding-top: 10px;
        padding-bottom: 20px;
        /deep/.el-form-item{
          margin-bottom: 0;
        }
        /deep/.el-form-item__error{
          word-break: keep-all;
        }
        .del{
          color: #DC5F5F;
          cursor: pointer;
        }
      }
      td:nth-child(1){
        div{
          position: absolute;
          top: 6px;
        }
      }
      td:nth-child(2){
        /deep/.el-form-item{
          position: absolute;
          top: 6px;
        }
      }
      td:nth-child(4){
        span{
          position: absolute;
          top: 6px;
        }
      }
    }
  }
</style>

<template>
  <el-form :model="item" ref="myform" :rules="sumScoreRules">
    <table>
      <tr>
        <td>总分</td>
        <td>测评结果<span class="small-text">(最多100字)</span></td>
        <td>分析/指导意见<span class="small-text">(最多500字)</span></td>
        <td>异常</td>
        <td>操作</td>
      </tr>
      <tr v-for="(it,index) in item.scoreAnalysisForms" :key="'scoreAnalysisForms' + index">
        <!-- 1td -->
        <td class="first-td">
          <!-- 111111111 -->
          <el-form-item :rules="[{ required: true, message: '输入不能为空', trigger: 'submit' },
          { validator: (rule,value,callback) => checkMinScoreStyle(rule,value,callback,it,index), trigger: 'submit' },
          { validator: (rule,value,callback) => checkMinScore(rule,value,callback,it,index), trigger: 'submit' },
          { validator: (rule,value,callback) => checkMinScoreArea(rule,value,callback,it,index), trigger: 'submit' }
          ]"
            :prop=" 'scoreAnalysisForms.' + index + '.minScore' ">
            <el-input @input="sumScoreMinScoreFilter($event, index)" v-model="it.minScore"  maxlength="6" size="mini" class="small-ipt"></el-input>
          </el-form-item>
          <!-- 222222222 -->
          <el-form-item class="need-left" :rules="[
          { validator: (rule,value,callback) => checkMinOpt(rule,value,callback,it,index), trigger: 'submit' },
          { validator: (rule,value,callback) => checkMinOptArea(rule,value,callback,it,index), trigger: 'submit' }
          ]"
          :prop=" 'scoreAnalysisForms.' + index + '.minOpt' ">
            <el-select v-model="it.minOpt" size="small">
              <el-option label="大于等于" value=">="></el-option>
              <el-option label="大于" value=">"></el-option>
              <el-option label="等于" value="="></el-option>
            </el-select>
          </el-form-item>
          <!-- 333333333 -->
          <div class="text m-top">总分</div>
          <!-- 444444444 -->
          <el-form-item class="need-left" :rules="[
          { validator: (rule,value,callback) => checkMaxOpt(rule,value,callback,it,index), trigger: 'submit' },
          { validator: (rule,value,callback) => checkMaxOptArea(rule,value,callback,it,index), trigger: 'submit' }
          ]"
          :prop=" 'scoreAnalysisForms.' + index + '.maxOpt' ">
            <el-select v-model="it.maxOpt" size="small">
              <el-option label="小于等于" value="<="></el-option>
              <el-option label="小于" value="<"></el-option>
              <el-option label="等于" value="="></el-option>
            </el-select>
          </el-form-item >
          <!-- 555555555 -->
          <el-form-item  :rules="[{ required: true, message: '输入不能为空', trigger: 'submit' },
          { validator: (rule,value,callback) => checkMaxScoreStyle(rule,value,callback,it,index), trigger: 'submit' },
          { validator: (rule,value,callback) => checkMaxScore(rule,value,callback,it,index), trigger: 'submit' },
          { validator: (rule,value,callback) => checkMaxScoreArea(rule,value,callback,it,index), trigger: 'submit' }
          ]"
            :prop=" 'scoreAnalysisForms.' + index + '.maxScore' ">
            <el-input @input="sumScoreMaxScoreFilter($event, index)" v-model="it.maxScore" maxlength="6" class="small-ipt" size="small"></el-input>
          </el-form-item>
        </td>
        <!-- 2td -->
        <td class="f-textarea">
          <el-form-item
            :rules="[{ required: true, message: '测评结果不能为空', trigger: 'submit' },
            { validator: (rule,value,callback) => checkResult(rule,value,callback,it,index), trigger: 'submit' }
            ]"
            :prop=" 'scoreAnalysisForms.' + index + '.result' ">
            <!-- <el-input v-model="it.result"  maxlength="100" size="small"></el-input> -->
          <el-input class="td-textarea" type="textarea" spellcheck ="false" rows="1"  :autosize="{minRows: 1,maxRows: 3}" resize='none' v-model.trim="it.result" maxlength="100"></el-input>
          </el-form-item>
        </td>
        <!-- 3td -->
        <td class="f-textarea">
          <el-form-item>
          <el-input class="td-textarea" type="textarea" spellcheck ="false" rows="1"  :autosize="{minRows: 1,maxRows: 3}" resize='none' v-model.trim="it.analysis" maxlength="500"></el-input>
            <!-- <el-input v-model="it.analysis" maxlength="500"  size="small"></el-input> -->
          </el-form-item>
        </td>
        <!-- 4td -->
        <td class="toggle">
          <div @click="toggle(index)" :class="{shi: it.abnormalBool, fou: !it.abnormalBool}">
            <span>是</span>
            <span>否</span>
          </div>
        </td>
        <!-- 5td -->
        <td>
          <span v-if="index > 1" class="del" @click="del(index)">删除</span>
        </td>
      </tr>
      <tr class="last-tr">
        <el-button class="my-whole-dashed" @click="add">+添加</el-button>
      </tr>
    </table>
  </el-form>
</template>

<script>
export default {
  props: {
    item: Object,
    index: Number
  },
  data () {
    return {
      sumScoreRules: {
      }
    }
  },
  methods: {
    // 单个
    checkMinScoreStyle (rule, value, callback, it, index) {
      const nanFlag = Number.isNaN(Number(value))
      if (nanFlag || !this.checkPoint(value)) {
        return callback(new Error('请输入正确的格式'))
      } else {
        return callback()
      }
    },
    checkMaxScoreStyle (rule, value, callback, it, index) {
      const nanFlag = Number.isNaN(Number(value))
      if (nanFlag || !this.checkPoint(value)) {
        return callback(new Error('请输入正确的格式'))
      } else {
        return callback()
      }
    },
    checkPoint (value) {
      const arr = []
      for (const k in value) {
        if (value[k] === '.') {
          arr.push(value[k])
        }
      }
      if (arr.length >= 2) {
        return false
      } else {
        return true
      }
    },
    // 当前行
    checkMinScore (rule, value, callback, it, index) {
      if (it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore)) {
        if (it.maxOpt === '=') {
          if (it.minOpt !== '=') {
            return callback(new Error('请设置正确的范围'))
          } else if (+it.minScore !== +it.maxScore) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        }
        if (it.minOpt === '=') {
          if (it.maxOpt !== '=') {
            return callback(new Error('请设置正确的范围'))
          } else if (+it.minScore !== +it.maxScore) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        }
        if (it.minOpt === '>=' && it.maxOpt === '<=') {
          if (+it.minScore > +it.maxScore) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>=' && it.maxOpt === '<') {
          if (+it.minScore > +it.maxScore) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>' && it.maxOpt === '<=') {
          if (+it.minScore >= +it.maxScore) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>' && it.maxOpt === '<') {
          if (+it.minScore >= +it.maxScore) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    },
    checkMinOpt (rule, value, callback, it, index) {
      if (it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore)) {
        if (it.maxOpt === '=') {
          if (it.minOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.minScore !== +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        }
        if (it.minOpt === '=') {
          if (it.maxOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.minScore !== +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        }
        if (it.minOpt === '>=' && it.maxOpt === '<=') {
          if (+it.minScore > +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>=' && it.maxOpt === '<') {
          if (+it.minScore > +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>' && it.maxOpt === '<=') {
          if (+it.minScore >= +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>' && it.maxOpt === '<') {
          if (+it.minScore >= +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    },
    checkMaxOpt (rule, value, callback, it, index) {
      if (it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore)) {
        if (it.maxOpt === '=') {
          if (it.minOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.minScore !== +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        }
        if (it.minOpt === '=') {
          if (it.maxOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.minScore !== +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        }
        if (it.minOpt === '>=' && it.maxOpt === '<=') {
          if (+it.minScore > +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>=' && it.maxOpt === '<') {
          if (+it.minScore > +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>' && it.maxOpt === '<=') {
          if (+it.minScore >= +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>' && it.maxOpt === '<') {
          if (+it.minScore >= +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    },
    checkMaxScore (rule, value, callback, it, index) {
      if (it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore)) {
        if (it.maxOpt === '=') {
          if (it.minOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.minScore !== +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        }
        if (it.minOpt === '=') {
          if (it.maxOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.minScore !== +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        }
        if (it.minOpt === '>=' && it.maxOpt === '<=') {
          if (+it.minScore > +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>=' && it.maxOpt === '<') {
          if (+it.minScore > +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>' && it.maxOpt === '<=') {
          if (+it.minScore >= +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else if (it.minOpt === '>' && it.maxOpt === '<') {
          if (+it.minScore >= +it.maxScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    },
    // 行与行之间的比较
    checkMinScoreArea (rule, value, callback, it, index) {
      const arr = []
      this.item.scoreAnalysisForms.forEach((e, ind) => {
        if (ind !== index) {
          arr.push(e)
        }
      })
      let flag = false
      arr.forEach(e => {
        if (e.minScore !== '' && e.maxScore !== '' && it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore) && !Number.isNaN(Number(e.minScore)) && this.checkPoint(e.minScore)) {
          if (+e.maxScore < +it.minScore) {
            return
          }
          if ((+e.maxScore === +it.minScore) && ((e.maxOpt === '<') || (it.minOpt === '>'))) {
            return
          }
          if (+e.minScore > +it.maxScore) {
            return
          }
          if ((+e.minScore === +it.maxScore) && ((e.minOpt === '>') || (it.maxOpt === '<'))) {
            return
          }
          flag = true
          // return callback(new Error('区间重叠'))
        }
      })
      if (flag) {
        return callback(new Error('区间重叠'))
      } else {
        return callback()
      }
    },
    checkMinOptArea (rule, value, callback, it, index) {
      const arr = []
      this.item.scoreAnalysisForms.forEach((e, ind) => {
        if (ind !== index) {
          arr.push(e)
        }
      })
      let flag = false
      arr.forEach(e => {
        if (e.minScore !== '' && e.maxScore !== '' && it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore) && !Number.isNaN(Number(e.minScore)) && this.checkPoint(e.minScore)) {
          if (+e.maxScore < +it.minScore) {
            return
          }
          if ((+e.maxScore === +it.minScore) && ((e.maxOpt === '<') || (it.minOpt === '>'))) {
            return
          }
          if (+e.minScore > +it.maxScore) {
            return
          }
          if ((+e.minScore === +it.maxScore) && ((e.minOpt === '>') || (it.maxOpt === '<'))) {
            return
          }
          flag = true
          // return callback(new Error('区间重叠'))
        }
      })
      if (flag) {
        return callback(new Error(' '))
      } else {
        return callback()
      }
    },
    checkMaxOptArea (rule, value, callback, it, index) {
      const arr = []
      this.item.scoreAnalysisForms.forEach((e, ind) => {
        if (ind !== index) {
          arr.push(e)
        }
      })
      let flag = false
      arr.forEach(e => {
        if (e.minScore !== '' && e.maxScore !== '' && it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore) && !Number.isNaN(Number(e.minScore)) && this.checkPoint(e.minScore)) {
          if (+e.maxScore < +it.minScore) {
            return
          }
          if ((+e.maxScore === +it.minScore) && ((e.maxOpt === '<') || (it.minOpt === '>'))) {
            return
          }
          if (+e.minScore > +it.maxScore) {
            return
          }
          if ((+e.minScore === +it.maxScore) && ((e.minOpt === '>') || (it.maxOpt === '<'))) {
            return
          }
          flag = true
          // return callback(new Error('区间重叠'))
        }
      })
      if (flag) {
        return callback(new Error(' '))
      } else {
        return callback()
      }
    },
    checkMaxScoreArea (rule, value, callback, it, index) {
      const arr = []
      this.item.scoreAnalysisForms.forEach((e, ind) => {
        if (ind !== index) {
          arr.push(e)
        }
      })
      let flag = false
      arr.forEach(e => {
        if (e.minScore !== '' && e.maxScore !== '' && it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore) && !Number.isNaN(Number(e.minScore)) && this.checkPoint(e.minScore)) {
          if (+e.maxScore < +it.minScore) {
            return
          }
          if ((+e.maxScore === +it.minScore) && ((e.maxOpt === '<') || (it.minOpt === '>'))) {
            return
          }
          if (+e.minScore > +it.maxScore) {
            return
          }
          if ((+e.minScore === +it.maxScore) && ((e.minOpt === '>') || (it.maxOpt === '<'))) {
            return
          }
          flag = true
          // return callback(new Error('区间重叠'))
        }
      })
      if (flag) {
        return callback(new Error(' '))
      } else {
        return callback()
      }
    },
    // 单独
    checkResult (rule, value, callback, it, index) {
      const temp = []
      this.item.scoreAnalysisForms.forEach((it, ind) => {
        if (ind !== index) {
          temp.push(it.result)
        }
      })
      if (temp.includes(it.result)) {
        return callback(new Error('测评结果不能重复'))
      } else {
        return callback()
      }
    },
    add () {
      this.$emit('scoreAdd', this.index)
    },
    del (index) {
      this.$emit('scoreDel', this.index, index)
    },
    toggle (index) {
      this.$emit('scoreToggle', this.index, index)
    },
    sumScoreMinScoreFilter (e, index) {
      this.$emit('sumScoreMinAgeFilter', e, this.index, index)
    },
    sumScoreMaxScoreFilter (e, index) {
      this.$emit('sumScoreMaxAgeFilter', e, this.index, index)
    },
    check () {
      let flag = false
      this.$refs.myform.validate((valid) => {
        if (valid) {
          // console.log('总分表格ok')
          flag = true
        } else {
          // console.log('总分表格nook')
        }
      })
      return flag
    }
  }
}
</script>

<style lang="less" scoped>
  table{
    max-width: 1128px;
    tr{
      border-bottom: 1px solid #EEEEEE;
      td:nth-child(4){
        padding-left: 20px;
      }
      td:nth-child(5){
        padding-left: 20px;
        .del{
          line-height: 2;
          border: none;
          color: #F75234;
          cursor: pointer;
        }
        .del:hover{
          opacity: 0.7;
        }
      }
      .first-td{
        display: flex;
        /deep/.el-input--mini .el-input__inner{
          height: 32px;
        }
        .text{
          width: 50px;
          line-height: 2;
          text-align: center;
        }
        /deep/.small-ipt{
          width: 80px;
        }
        /deep/.need-left{
          margin-left: 5px;
          margin-right: 5px;
        }
        .m-top{
          padding-top: 4px;
        }
        .my-select{
          margin: 0 5px;
          /deep/.el-select{
            width: 108px;
            height: 32px;
          }
        }
      }
      .f-textarea{
        padding-top: 4px;
        /deep/.td-textarea{
          vertical-align: middle;
        }
      }
      .toggle{
        div{
          display: flex;
          margin-top: 3px;
          width: 64px;
          box-sizing: border-box;
          border:1px solid #34B7B9 ;
          cursor: pointer;
          span{
            width: 50%;
            line-height: 32px;
            font-size: 14px;
            text-align: center;
          }
        }
        .shi{
          span:first-child{
            color: white;
            background-color: #34B7B9;
          }
          span:last-child{
            color: #999999;
            background-color: white;
          }
        }
        .fou{
          span:first-child{
            color: #999999;
            background-color: white;
          }
          span:last-child{
            color: white;
            background-color: #34B7B9;
          }
        }
      }
      // -----------------use-----------------
      td{
        padding-top: 5px;
        padding-bottom: 14p;
        min-height: 50px;
        font-size: 16px;
        font-weight: 500px;
        color: #8C8C8C;
        .small-text{
          font-size: 12px;
        }
        /deep/.el-form-item__error{
          word-break: keep-all;
        }
      }
      display: flex;
      justify-content: space-around;
      td:nth-child(1){
        min-width: 500px;
        padding-left: 20px;
      }
      td:nth-child(2){
        min-width: 220px;
        margin-right: 10px;
        padding-left: 5px;
      }
      td:nth-child(3){
        min-width: 220px;
      }
      td:nth-child(4){
        min-width: 95px;
      }
      td:nth-child(5){
        min-width: 95px;
      }
    }
    tr:nth-child(1){
      background: #EEEEEE;
      border-bottom: none;
      td{
        line-height: 50px;
      }
    }
    .last-tr{
      padding: 0 15px;
      margin-top: 20px;
      .my-whole-dashed{
        width: 100%;
        border-style: dashed;
      }
    }
  }
</style>

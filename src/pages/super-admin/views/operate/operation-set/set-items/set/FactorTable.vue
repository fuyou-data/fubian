<template>
   <el-form :model="item" ref="myform">
    <table>
      <tr>
        <td>因子分</td>
        <td>测评结果<span class="small-text">(最多100字)</span></td>
        <td>分析/指导意见<span class="small-text">(最多500字)</span></td>
        <td>操作</td>
      </tr>
      <tr class="or-tr" v-for="(it, ind) in item.scoreAnalysisForms" :key="'scoreAnalysisForms' + ind">
        <td class="first-td">
          <!-- 1111111111 -->
          <el-form-item :rules="[{ required: true, message: '输入不能为空', trigger: 'submit' },
          { validator: (rule,value,callback) => checkFactorMinScoreStyle(rule,value,callback,it,ind), trigger: 'submit' },
          { validator: (rule,value,callback) => checkFactorMinScore(rule,value,callback,it,ind), trigger: 'submit' },
          { validator: (rule,value,callback) => checkFactorMinScoreArea(rule,value,callback,it,ind), trigger: 'submit' }
          ]"
            :prop=" 'scoreAnalysisForms.' + ind + '.minScore' ">
            <el-input @input="factorTableMinScoreFilter($event, ind)" v-model="it.minScore" maxlength="6" class="score-input" size="small"></el-input>
          </el-form-item>
          <!-- 2222222222 -->
          <el-form-item :rules="[
          { validator: (rule,value,callback) => checkFactorMinScoreOpt(rule,value,callback,it,ind), trigger: 'submit' },
          { validator: (rule,value,callback) => checkFactorMinScoreOptArea(rule,value,callback,it,ind), trigger: 'submit' }
          ]"
            :prop=" 'scoreAnalysisForms.' + ind + '.minOpt' ">
            <el-select v-model="it.minOpt" size="small" >
              <el-option label="大于等于" value=">="> </el-option>
              <el-option label="大于" value=">"> </el-option>
              <el-option label="等于" value="="> </el-option>
            </el-select>
          </el-form-item>
          <!-- 3333333333 -->
          <el-form-item :rules="[{ required: true, message: '输入不能为空', trigger: 'submit' },
          { validator: (rule,value,callback) => checkFactorNameArea(rule,value,callback,it,ind), trigger: 'submit' }
          ]"
            :prop=" 'scoreAnalysisForms.' + ind + '.factorName' ">
            <el-select v-model="it.factorName" size="small" placeholder="请选择">
              <el-option v-for="(it, index) in optionsArr" :key="'optionsArr' + index" :label="it" :value="it"> </el-option>
            </el-select>
          </el-form-item>
          <!-- 4444444444 -->
          <el-form-item :rules="[
          { validator: (rule,value,callback) => checkFactorMaxScoreOpt(rule,value,callback,it,ind), trigger: 'submit' },
          { validator: (rule,value,callback) => checkFactorMaxScoreOptArea(rule,value,callback,it,ind), trigger: 'submit' }
          ]"
            :prop=" 'scoreAnalysisForms.' + ind + '.maxOpt' ">
            <el-select v-model="it.maxOpt" size="small">
              <el-option label="小于等于" value="<="> </el-option>
              <el-option label="小于" value="<"> </el-option>
              <el-option label="等于" value="="> </el-option>
            </el-select>
          </el-form-item>
          <!-- 5555555555 -->
          <el-form-item :rules="[{ required: true, message: '输入不能为空', trigger: 'submit' },
          { validator: (rule,value,callback) => checkFactorMaxScoreStyle(rule,value,callback,it,ind), trigger: 'submit' },
          { validator: (rule,value,callback) => checkFactorMaxScore(rule,value,callback,it,ind), trigger: 'submit' },
          { validator: (rule,value,callback) => checkFactorMaxScoreArea(rule,value,callback,it,ind), trigger: 'submit' }
          ]"
            :prop=" 'scoreAnalysisForms.' + ind + '.maxScore' ">
            <el-input @input="factorTableMaxScoreFilter($event, ind)" v-model="it.maxScore" maxlength="6" class="score-input" size="small"></el-input>
          </el-form-item>
        </td>
        <td class="f-textarea">
          <el-form-item
            :rules="[{ required: true, message: '测评结果不能为空', trigger: 'submit' },
            { validator: (rule,value,callback) => checkFactorScore(rule,value,callback,it,ind), trigger: 'submit' }
            ]"
            :prop=" 'scoreAnalysisForms.' + ind + '.result' ">
            <!-- <el-input v-model="it.result"  maxlength="100" size="small"></el-input> -->
          <el-input class="td-textarea" type="textarea" spellcheck ="false"   :autosize="{minRows: 1,maxRows: 3}" resize='none' v-model.trim="it.result" maxlength="100"></el-input>
          </el-form-item>
        </td>
        <td class="f-textarea">
          <el-form-item>
          <el-input class="td-textarea" type="textarea" spellcheck ="false"   :autosize="{minRows: 1,maxRows: 3}" resize='none' v-model.trim="it.analysis" maxlength="500"></el-input>
            <!-- <el-input v-model="it.analysis" maxlength="500"  size="small"></el-input> -->
          </el-form-item>
        </td>
        <td class="del"><span v-if="ind > 1" @click="factorDel(ind)">删除</span></td>
      </tr>
      <tr class="last-tr">
        <el-button class="my-whole-dashed" @click="factorAdd">+添加</el-button>
      </tr>
    </table>
  </el-form>
</template>

<script>
export default {
  props: {
    item: Object,
    index: Number,
    optionsArr: Array
  },
  methods: {
    // 单个
    checkFactorMinScoreStyle (rule, value, callback, it, ind) {
      const nanFlag = Number.isNaN(Number(value))
      if (nanFlag || !this.checkPoint(value)) {
        return callback(new Error('请输入正确的格式'))
      } else {
        return callback()
      }
    },
    checkFactorMaxScoreStyle (rule, value, callback, it, ind) {
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
    // 单个合法区间
    checkFactorMinScore (rule, value, callback, it, ind) {
      // 填写了分以及选择了符号才去比较(是否要选择了才去比较)
      // console.log(it)
      // console.log(ind)
      if (it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore)) {
        if (it.minOpt === '=') {
          if (it.maxOpt !== '=') {
            return callback(new Error('请设置正确的范围'))
          } else if (+it.maxScore !== +it.minScore) {
            return callback(new Error('请设置正确的范围'))
          } else {
            return callback()
          }
        }
        if (it.maxOpt === '=') {
          if (it.minOpt !== '=') {
            return callback(new Error('请设置正确的范围'))
          } else if (+it.maxScore !== +it.minScore) {
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
          if (+it.minScore >= +it.maxScore) {
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
    checkFactorMinScoreOpt (rule, value, callback, it, ind) {
      if (it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore)) {
        if (it.minOpt === '=') {
          if (it.maxOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.maxScore !== +it.minScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        }
        if (it.maxOpt === '=') {
          if (it.minOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.maxScore !== +it.minScore) {
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
          if (+it.minScore >= +it.maxScore) {
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
    checkFactorMaxScoreOpt (rule, value, callback, it, ind) {
      if (it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore)) {
        if (it.minOpt === '=') {
          if (it.maxOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.maxScore !== +it.minScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        }
        if (it.maxOpt === '=') {
          if (it.minOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.maxScore !== +it.minScore) {
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
          if (+it.minScore >= +it.maxScore) {
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
    checkFactorMaxScore (rule, value, callback, it, ind) {
      if (it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(it.maxScore)) && this.checkPoint(it.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore)) {
        if (it.minOpt === '=') {
          if (it.maxOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.maxScore !== +it.minScore) {
            return callback(new Error(' '))
          } else {
            return callback()
          }
        }
        if (it.maxOpt === '=') {
          if (it.minOpt !== '=') {
            return callback(new Error(' '))
          } else if (+it.maxScore !== +it.minScore) {
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
          if (+it.minScore >= +it.maxScore) {
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
    // 区间与区间的比较
    checkFactorMinScoreArea (rule, value, callback, it, ind) {
      // console.log(it)
      // console.log(ind)
      // console.log(this.item)
      const arr = []
      this.item.scoreAnalysisForms.forEach((e, index) => {
        if (index !== ind && e.factorName === it.factorName && e.minScore !== '' && e.maxScore !== '' && it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(e.minScore)) && this.checkPoint(e.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore)) {
          arr.push(e)
        }
      })
      let flag = false
      arr.forEach(e => {
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
      })
      if (flag) {
        return callback(new Error('区间重叠'))
      } else {
        return callback()
      }
    },
    checkFactorMinScoreOptArea (rule, value, callback, it, ind) {
      const arr = []
      this.item.scoreAnalysisForms.forEach((e, index) => {
        if (index !== ind && e.factorName === it.factorName && e.minScore !== '' && e.maxScore !== '' && it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(e.minScore)) && this.checkPoint(e.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore)) {
          arr.push(e)
        }
      })
      let flag = false
      arr.forEach(e => {
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
      })
      if (flag) {
        return callback(new Error(' '))
      } else {
        return callback()
      }
    },
    checkFactorNameArea (rule, value, callback, it, ind) {
      const arr = []
      this.item.scoreAnalysisForms.forEach((e, index) => {
        if (index !== ind && e.factorName === it.factorName && e.minScore !== '' && e.maxScore !== '' && it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(e.minScore)) && this.checkPoint(e.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore)) {
          arr.push(e)
        }
      })
      let flag = false
      arr.forEach(e => {
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
      })
      if (flag) {
        return callback(new Error(' '))
      } else {
        return callback()
      }
    },
    checkFactorMaxScoreOptArea (rule, value, callback, it, ind) {
      const arr = []
      this.item.scoreAnalysisForms.forEach((e, index) => {
        if (index !== ind && e.factorName === it.factorName && e.minScore !== '' && e.maxScore !== '' && it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(e.minScore)) && this.checkPoint(e.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore)) {
          arr.push(e)
        }
      })
      let flag = false
      arr.forEach(e => {
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
      })
      if (flag) {
        return callback(new Error(' '))
      } else {
        return callback()
      }
    },
    checkFactorMaxScoreArea (rule, value, callback, it, ind) {
      const arr = []
      this.item.scoreAnalysisForms.forEach((e, index) => {
        if (index !== ind && e.factorName === it.factorName && e.minScore !== '' && e.maxScore !== '' && it.minScore !== '' && it.maxScore !== '' && !Number.isNaN(Number(e.minScore)) && this.checkPoint(e.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore) && !Number.isNaN(Number(it.minScore)) && this.checkPoint(it.minScore) && !Number.isNaN(Number(e.maxScore)) && this.checkPoint(e.maxScore)) {
          arr.push(e)
        }
      })
      let flag = false
      arr.forEach(e => {
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
      })
      if (flag) {
        return callback(new Error(' '))
      } else {
        return callback()
      }
    },
    // 单独的测评结果
    checkFactorScore (rule, value, callback, it, ind) {
      // console.log(it)
      // console.log(ind)
      // console.log(this.item.scoreAnalysisForms)
      const temp = []
      this.item.scoreAnalysisForms.forEach((item, index) => {
        if (index !== ind && item.factorName === it.factorName) {
          temp.push(item.result)
        }
      })
      // console.log(temp)
      if (temp.includes(it.result)) {
        return callback(new Error('测评结果不能重复'))
      } else {
        return callback()
      }
    },
    factorAdd () {
      this.$emit('tableAdd', this.index)
    },
    factorDel (index) {
      this.$emit('tableDel', this.index, index)
    },
    factorTableMinScoreFilter (e, index) {
      this.$emit('factorTableMinScoreFilter', e, this.index, index)
    },
    factorTableMaxScoreFilter (e, index) {
      this.$emit('factorTableMaxScoreFilter', e, this.index, index)
    },
    check () {
      let flag = false
      this.$refs.myform.validate((valid) => {
        // console.log(valid)
        if (valid) {
          // console.log('因子分下面表格ok')
          flag = true
        } else {
          // console.log('因子分下面表格不ok')
          // return false
        }
      })
      return flag
    }
  }
}
</script>
<style lang="less" scoped>
  table{
    width: 100%;
    background: #FBFBFB;
    tr{
      border-bottom: 1px solid #EEEEEE;
      display: flex;
      /deep/.el-form-item__error{
        word-break: keep-all;
      }
      .del{
        span{
          color: #DC5F5F;
          line-height: 50px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      td:nth-child(1){
        padding-left: 20px;
        flex: 1;
      }
      td:nth-child(2){
        width: 260px;
        padding-right: 30px;
      }
      td:nth-child(3){
        width: 260px;
        padding-right: 30px;
      }
      td:nth-child(4){
        width: 80px;
      }
    }
    tr:nth-child(1){
      background: #EEEEEE;
      border-bottom: none;
      td{
        line-height: 50px;
        font-size: 16px;
        font-weight: 500;
        color: #8C8C8C;
        .small-text{
          font-size: 12px;
          color: #999999;
        }
        /deep/.el-form-item__error{
          word-break: keep-all;
        }
      }
    }
    .or-tr{
      td{
        min-height: 64px;
      }
      .first-td{
        display: flex;
        padding-top: 4px;
        .el-form-item{
          margin-right: 5px;
        }
      }
    }
    .last-tr{
      padding: 0 15px ;
      margin-top: 20px;
      .my-whole-dashed{
        width: 100%;
        border-style: dashed;
      }
    }
  }
</style>

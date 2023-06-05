<template>
<div class="myForm">
  <!-- select -->
  <div class="top-select">
    <span>选择需要设置的内容（可多选）：</span>
    <el-checkbox-group v-model="scoreType" @change="selectChange">
      <el-checkbox v-for="(item, index) in selectArr" :key="'selectArr' + index" :label="item"> {{item}} </el-checkbox>
    </el-checkbox-group>
  </div>
  <!-- 总分 -->
  <div v-if="scoreType.includes('总分')" class="total-score">
    <p><span class="blod-span">总分设置</span><span class="text">Z为每题的得分,依次为Z1、Z2、Z3、......ZN</span></p>
    <div class="res"><span></span><span>总分计算</span><span> 计算公式支持符号: + -* / ()  (英文括号)</span></div>
    <div class="text-area">
      <!-- :rules="[{ required: true, message: '请输入正确格式', trigger: 'blur' }]" -->
      <span class="s">S=</span>
      <el-form :model="totalScoreCriteria" :rules="rules" ref="myform">
      <el-form-item  prop="totalScoreCalcFormula" class="textarea-form-item">
      <el-input class="my-area" v-model="totalScoreCriteria.totalScoreCalcFormula" @input="textareaChange"
      type="textarea" spellcheck ="false" rows="4" resize='none'></el-input>
      </el-form-item>
      </el-form>
      <span class="clear" @click="clearTextarea">清空</span>
    </div>
    <div class="res my-title"><span></span><span>诊断标准</span><span class="mytitle">(提示：测评结果请按照从轻到重的程度添加，否则会影响数据统计。)</span></div>
    <!-- 关于总分 -->
    <div v-if="scoreType.includes('总分')">
      <div class="table-box"  v-for="(item,index) in totalScoreCriteria.totalScoreAnalysis" :key="'totalScoreAnalysis' + index">
      <div class="line" v-if="index === 0"><span></span><span>标准{{index + 1}}</span><span></span></div>
      <div class="line1" v-else><span class="shan"><el-button size="mini" @click="fDel(index)">删除</el-button></span><span class="xian"></span><span class="text">标准{{index + 1}}</span><span class="xian"></span></div>
      <PublicScore ref="sumPublic" :item="item" :index="index" @minAgeFilter="minAgeFilter" @maxAgeFilter="maxAgeFilter"
      :all="totalScoreCriteria.totalScoreAnalysis" @clearAge="clearAge"></PublicScore>
      <SumScore ref="sumScore" :item="item" :index="index" @scoreAdd="scoreAdd" @scoreDel="scoreDel"
       @scoreToggle="scoreToggle" @sumScoreMinAgeFilter="sumScoreMinAgeFilter" @sumScoreMaxAgeFilter="sumScoreMaxAgeFilter"></SumScore>
      </div>
    </div>
    <div class="add-line" ><span class="add" @click="maxAdd"><el-button size="mini" >添加</el-button></span><span class="xian"></span><span class="text">标准{{ totalScoreCriteria.totalScoreAnalysis.length + 1}}</span><span class="xian"></span></div>
  </div>
  <!-- 因子分 -->
  <div v-if="scoreType.includes('因子分')">
    <div class="factor-score">
      <p><span class="blod-span">因子分设置</span><span class="text">Z为每题的得分,依次为Z1、Z2、Z3、......ZN;F为各个因子分,依次为F1、F2、F3......FN</span></p>
      <div class="res"><span></span><span>因子分计算</span><span> 计算公式支持符号: + -* / ()  (英文括号)</span></div>
      <NameTable ref="nameTable" @nameTableFilter="nameTableFilter" :item="frontFactorScoreCriteria"
       @factorNameCheck="factorNameCheck" @factorDel="factorDel" @inputBlur="inputBlur"></NameTable>
      <div class="last-tr"><el-button class="my-whole-dashed" v-if="frontFactorScoreCriteria.frontFactorScoreFrom.length < 50" @click="factorAdd">+添加</el-button></div>
      <div class="res res1"><span></span><span>因子分析</span></div>
      <div class="factor-box" v-for="(item,index) in frontFactorScoreCriteria.factorScoreAnalysis" :key="'factorScoreAnalysis' + index">
        <div class="line" v-if="index === 0"><span></span><span>标准{{index + 1}}</span><span></span></div>
        <div class="line1" v-else><span class="shan"><el-button size="mini" @click="yDel(index)">删除</el-button></span><span class="xian"></span><span class="text">标准{{index + 1}}</span><span class="xian"></span></div>
        <PublicScore ref="factorPublic" :item="item" :index="index" @minAgeFilter="minAgeFilter1" @maxAgeFilter="maxAgeFilter1"
        :all="frontFactorScoreCriteria.factorScoreAnalysis" @clearAge="clearAge1"></PublicScore>
        <FactorTable ref="factorTable" :optionsArr="optionsArr" :item="item" :index="index" @tableAdd="tableAdd"
        @factorTableMinScoreFilter="factorTableMinScoreFilter" @factorTableMaxScoreFilter="factorTableMaxScoreFilter" @tableDel="tableDel"></FactorTable>
      </div>
    <div class="add-line" ><span class="add"><el-button size="mini" @click="yAdd">添加</el-button></span><span class="xian"></span><span class="text">标准{{ frontFactorScoreCriteria.factorScoreAnalysis.length + 1}}</span><span class="xian"></span></div>
    </div>
  </div>
  <div class="save-box" v-if="state === '已完成' && scoreType.length !== 0 " ><el-button type="success" @click="save()">保存</el-button></div>
</div>
</template>

<script>
import { scoreSetting } from '@/api/modules/operate'
import SumScore from './SumScore.vue'
import PublicScore from './PublicScore.vue'
import NameTable from './NameTable.vue'
import FactorTable from './FactorTable.vue'

export default {
  name: 'setting-set',
  components: {
    SumScore,
    PublicScore,
    NameTable,
    FactorTable
  },
  data () {
    const totalScore = (rule, value, callback) => {
      const arr = []
      const arr1 = []
      for (const k in this.totalScoreCriteria.totalScoreCalcFormula) {
        if (this.totalScoreCriteria.totalScoreCalcFormula[k] === '(') {
          arr.push(this.totalScoreCriteria.totalScoreCalcFormula[k])
        }
        if (this.totalScoreCriteria.totalScoreCalcFormula[k] === ')') {
          arr1.push(this.totalScoreCriteria.totalScoreCalcFormula[k])
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
        return callback(new Error('总分公式符号不匹配'))
      } else if (!reg.test(value)) {
        return callback(new Error('请输入正确格式'))
      } else if (!myFlag) {
        return callback(new Error('请输入正确格式'))
      } else {
        return callback()
      }
    }
    return {
      selectArr: ['总分', '因子分'],
      scoreType: [],
      rules: {
        totalScoreCalcFormula: [
          { required: true, message: '请输入正确格式', trigger: 'blur' },
          { validator: totalScore, trigger: 'blur' }
        ]
      },
      textStr: '',
      optionsArr: [],
      totalScoreCriteria: { // 总分
        totalScoreCalcFormula: '', // 总分文本域\总分表格
        totalScoreAnalysis: [
          {
            maxAge: '',
            age: '所有',
            minAge: '',
            maxAgeOpt: '<=',
            minAgeOpt: '>=',
            gender: '全部',
            scoreAnalysisForms: [
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                abnormalBool: false
              },
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                abnormalBool: false
              }
            ]
          }
        ]
      },
      frontFactorScoreCriteria: { // 因子分\因子名\因子表格
        frontFactorScoreFrom: [
          {
            factorName: '',
            factorScoreCalcFormula: ''
          },
          {
            factorName: '',
            factorScoreCalcFormula: ''
          },
          {
            factorName: '',
            factorScoreCalcFormula: ''
          }
        ],
        factorScoreAnalysis: [
          {
            maxAge: '',
            age: '所有',
            minAge: '',
            maxAgeOpt: '<=',
            minAgeOpt: '>=',
            gender: '全部',
            scoreAnalysisForms: [
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                factorName: ''
              },
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                factorName: ''
              },
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                factorName: ''
              },
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                factorName: ''
              }
            ]
          }
        ]
      },
      // 对比的数据
      // compare--data
      copyscoreType: [],
      copytotalScoreCriteria: { // 总分
        totalScoreCalcFormula: '', // 总分文本域\总分表格
        totalScoreAnalysis: [
          {
            maxAge: '',
            age: '所有',
            minAge: '',
            maxAgeOpt: '<=',
            minAgeOpt: '>=',
            gender: '全部',
            scoreAnalysisForms: [
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                abnormalBool: false
              },
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                abnormalBool: false
              }
            ]
          }
        ]
      },
      copyfrontFactorScoreCriteria: { // 因子分\因子名\因子表格
        frontFactorScoreFrom: [
          {
            factorName: '',
            factorScoreCalcFormula: ''
          },
          {
            factorName: '',
            factorScoreCalcFormula: ''
          },
          {
            factorName: '',
            factorScoreCalcFormula: ''
          }
        ],
        factorScoreAnalysis: [
          {
            maxAge: '',
            age: '所有',
            minAge: '',
            maxAgeOpt: '<=',
            minAgeOpt: '>=',
            gender: '全部',
            scoreAnalysisForms: [
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                factorName: ''
              },
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                factorName: ''
              },
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                factorName: ''
              },
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                factorName: ''
              }
            ]
          }
        ]
      },
      state: '',
      changeFlag: false
    }
  },
  created () {
    this.$store.dispatch('getTableInfo', this.$route.query.tableCode).then((res) => {
      if (res.questions) {
        res.questions.forEach((item, index) => {
          this.textStr += `Z${index + 1}` + '+'
        })
        this.textStr = this.textStr.substring(0, this.textStr.length - 1)
      }
      this.state = res.configurationStatus
      // 自动填入的分数
      // console.log(this.$store.state.operate.totalScoreCriteria)
      // console.log(res)
      if (res.configStep === 2) {
        // 还未配置 需要自动填入
        this.totalScoreCriteria.totalScoreCalcFormula = this.textStr
        this.copytotalScoreCriteria.totalScoreCalcFormula = this.textStr
      }
      if (res.configStep >= 3) {
        // 已经配置过了分数需要回显
        this.scoreType = res.scoreType
        this.copyscoreType = JSON.parse(JSON.stringify(res.scoreType))
        if (res.scoreType.includes('总分')) {
          this.totalScoreCriteria = res.totalScoreCriteria
          this.copytotalScoreCriteria = JSON.parse(JSON.stringify(res.totalScoreCriteria))
        } else {
          // 不管有没有总分 自动填入永不变
          this.totalScoreCriteria.totalScoreCalcFormula = this.textStr
          this.copytotalScoreCriteria.totalScoreCalcFormula = this.textStr
        }
        if (res.scoreType.includes('因子分')) {
          this.frontFactorScoreCriteria = res.frontFactorScoreCriteria
          this.copyfrontFactorScoreCriteria = JSON.parse(JSON.stringify(res.frontFactorScoreCriteria))
          this.inputBlur()
        }
      }
      // console.log(this.scoreType)
      // console.log(this.copyscoreType)
      // console.log(this.totalScoreCriteria)
      // console.log(this.copytotalScoreCriteria)
      // console.log(this.frontFactorScoreCriteria)
      // console.log(this.copyfrontFactorScoreCriteria)
    })
  },
  watch: {
    scoreType: {
      deep: true,
      handler (newV, oldV) {
        // if (JSON.stringify(newV) === JSON.stringify(this.copyscoreType)) {
        //   this.changeFlag = false
        // } else {
        //   this.changeFlag = true
        // }
        if (newV.length === this.copyscoreType.length && JSON.stringify(newV) === JSON.stringify(this.copyscoreType)) {
          this.changeFlag = false
        } else {
          this.changeFlag = true
        }
      }
    },
    totalScoreCriteria: {
      deep: true,
      handler (newV, oldV) {
        if (JSON.stringify(newV) === JSON.stringify(this.copytotalScoreCriteria)) {
          this.changeFlag = false
        } else {
          this.changeFlag = true
        }
      }
    },
    frontFactorScoreCriteria: {
      deep: true,
      handler (newV, oldV) {
        if (JSON.stringify(newV) === JSON.stringify(this.copyfrontFactorScoreCriteria)) {
          this.changeFlag = false
        } else {
          this.changeFlag = true
        }
      }
    }
  },
  updated () {
    // console.log(this.scoreType)
    // console.log(this.copyscoreType)
    // console.log(JSON.stringify(this.totalScoreCriteria))
    // console.log(JSON.stringify(this.copytotalScoreCriteria))
    // console.log(this.changeFlag)
    // console.log(this.isChange)
  },
  computed: {
    isChange () {
      return this.changeFlag
    }
  },
  methods: {
    check () {
      let flag = false
      this.$refs.myform.validate((valid) => {
        if (valid) {
          flag = true
        } else {
          // console.log('nook')
        }
      })
      return flag
    },
    save () {
      const obj = {
        tableCode: this.$route.query.tableCode,
        scoreType: this.scoreType
      }
      if (this.scoreType.length === 0) {
        return false
      }
      const flagArr = []
      if (this.scoreType.includes('总分')) {
        flagArr.push(this.check())
        this.$refs.sumPublic.forEach(e => {
          flagArr.push(e.check())
        })
        this.$refs.sumScore.forEach(e => {
          flagArr.push(e.check())
        })
      }
      if (this.scoreType.includes('因子分')) {
        flagArr.push(this.$refs.nameTable.check())
        this.$refs.factorPublic.forEach(e => {
          flagArr.push(e.check())
        })
        this.$refs.factorTable.forEach(e => {
          flagArr.push(e.check())
        })
      }
      // 确保每个模块正确
      // console.log(flagArr)
      if (flagArr.includes(false)) {
        this.$notify({
          title: '失败',
          message: '分数设置错误',
          type: 'error',
          duration: 1000
        })
      } else {
        if (this.scoreType.includes('总分')) {
          obj.totalScoreCriteria = {}
          obj.totalScoreCriteria.totalScoreCalcFormula = this.totalScoreCriteria.totalScoreCalcFormula
          // 数据不存在ndefind和function,有问题就深拷贝
          let data = JSON.parse(JSON.stringify(this.totalScoreCriteria.totalScoreAnalysis))
          data = data.map(e => {
            return {
              age: e.age,
              gender: e.gender,
              maxAge: e.maxAge,
              minAge: e.minAge,
              maxAgeOpt: e.maxAgeOpt,
              minAgeOpt: e.minAgeOpt,
              scoreAnalysisForms: e.scoreAnalysisForms.map(it => {
                return {
                  abnormalBool: it.abnormalBool,
                  analysis: it.analysis,
                  maxOpt: it.maxOpt,
                  minOpt: it.minOpt,
                  minScore: Number(it.minScore),
                  maxScore: Number(it.maxScore),
                  result: it.result
                }
              })
            }
          })
          obj.totalScoreCriteria.totalScoreAnalysis = data
        }
        if (this.scoreType.includes('因子分')) {
          obj.frontFactorScoreCriteria = {}
          obj.frontFactorScoreCriteria.frontFactorScoreFrom = this.frontFactorScoreCriteria.frontFactorScoreFrom
          let data = JSON.parse(JSON.stringify(this.frontFactorScoreCriteria.factorScoreAnalysis))
          data = data.map(e => {
            return {
              age: e.age,
              gender: e.gender,
              maxAge: e.maxAge,
              minAge: e.minAge,
              maxAgeOpt: e.maxAgeOpt,
              minAgeOpt: e.minAgeOpt,
              scoreAnalysisForms: e.scoreAnalysisForms.map(it => {
                return {
                  factorName: it.factorName,
                  analysis: it.analysis,
                  maxOpt: it.maxOpt,
                  minOpt: it.minOpt,
                  minScore: Number(it.minScore),
                  maxScore: Number(it.maxScore),
                  result: it.result
                }
              })
            }
          })
          obj.frontFactorScoreCriteria.factorScoreAnalysis = data
        }
        scoreSetting(obj).then(res => {
          if (this.state === '未完成') {
            setTimeout(() => {
              this.$router.replace({
                path: '/setting/show',
                query: this.$route.query
              })
            }, 1000)
          } else {
            this.$message({ type: 'success', message: '保存成功' })
            this.changeFlag = false
          }
          this.$store.dispatch('getTableInfo', this.$route.query.tableCode)
        })
      }
    },
    selectChange (e) {
      if (e.length === 2) {
        // console.log('不重置')
        return false
      }
      if (!e.length) {
        // console.log('全部重置')
        this.restSum()
        this.restFactor()
      }
      if (e.includes('总分')) {
        // console.log('因子分重置')
        this.restFactor()
      }
      if (e.includes('因子分')) {
        this.restSum()
        // console.log('总分重置')
      }
    },
    restSum () {
      this.totalScoreCriteria.totalScoreCalcFormula = this.textStr
      this.totalScoreCriteria.totalScoreAnalysis = [
        {
          maxAge: '',
          age: '所有',
          minAge: '',
          maxAgeOpt: '<=',
          minAgeOpt: '>=',
          gender: '全部',
          scoreAnalysisForms: [
            {
              minScore: '',
              minOpt: '>=',
              maxScore: '',
              maxOpt: '<=',
              result: '',
              analysis: '',
              abnormalBool: false
            },
            {
              minScore: '',
              minOpt: '>=',
              maxScore: '',
              maxOpt: '<=',
              result: '',
              analysis: '',
              abnormalBool: false
            }
          ]
        }
      ]
    },
    restFactor () {
      this.frontFactorScoreCriteria.frontFactorScoreFrom = [
        {
          factorName: '',
          factorScoreCalcFormula: ''
        },
        {
          factorName: '',
          factorScoreCalcFormula: ''
        },
        {
          factorName: '',
          factorScoreCalcFormula: ''
        }
      ]
      this.frontFactorScoreCriteria.factorScoreAnalysis = [
        {
          maxAge: '',
          age: '所有',
          minAge: '',
          maxAgeOpt: '<=',
          minAgeOpt: '>=',
          gender: '全部',
          scoreAnalysisForms: [
            {
              minScore: '',
              minOpt: '>=',
              maxScore: '',
              maxOpt: '<=',
              result: '',
              analysis: '',
              factorName: ''
            },
            {
              minScore: '',
              minOpt: '>=',
              maxScore: '',
              maxOpt: '<=',
              result: '',
              analysis: '',
              factorName: ''
            },
            {
              minScore: '',
              minOpt: '>=',
              maxScore: '',
              maxOpt: '<=',
              result: '',
              analysis: '',
              factorName: ''
            },
            {
              minScore: '',
              minOpt: '>=',
              maxScore: '',
              maxOpt: '<=',
              result: '',
              analysis: '',
              factorName: ''
            }
          ]
        }
      ]
    },
    // 总分
    scoreAdd (i) {
      const obj = {
        minScore: '',
        minOpt: '>=',
        maxScore: '',
        maxOpt: '<=',
        result: '',
        analysis: '',
        abnormalBool: false
      }
      this.totalScoreCriteria.totalScoreAnalysis[i].scoreAnalysisForms.push(obj)
    },
    scoreDel (i, ii) {
      this.totalScoreCriteria.totalScoreAnalysis[i].scoreAnalysisForms.splice(ii, 1)
    },
    scoreToggle (i, ii) {
      this.totalScoreCriteria.totalScoreAnalysis[i].scoreAnalysisForms[ii].abnormalBool = !this.totalScoreCriteria.totalScoreAnalysis[i].scoreAnalysisForms[ii].abnormalBool
    },
    fDel (index) {
      // console.log(this.totalScoreCriteria.totalScoreAnalysis)
      this.totalScoreCriteria.totalScoreAnalysis.splice(index, 1)
    },
    clearTextarea () {
      this.totalScoreCriteria.totalScoreCalcFormula = ''
    },
    clearAge (i) {
      this.totalScoreCriteria.totalScoreAnalysis[i].maxAge = ''
      this.totalScoreCriteria.totalScoreAnalysis[i].maxAgeOpt = '<='
      this.totalScoreCriteria.totalScoreAnalysis[i].minAge = ''
      this.totalScoreCriteria.totalScoreAnalysis[i].minAgeOpt = '>='
    },
    // 总分标准+1
    maxAdd () {
      const obj = {
        maxAge: '',
        minAge: '',
        age: '所有',
        maxAgeOpt: '<=',
        minAgeOpt: '>=',
        gender: '全部',
        scoreAnalysisForms: [
          {
            minScore: '',
            minOpt: '>=',
            maxScore: '',
            maxOpt: '<=',
            result: '',
            analysis: '',
            abnormalBool: false
          },
          {
            minScore: '',
            minOpt: '>=',
            maxScore: '',
            maxOpt: '<=',
            result: '',
            analysis: '',
            abnormalBool: false
          }
        ]
      }
      // console.log(obj)
      this.totalScoreCriteria.totalScoreAnalysis.push(obj)
    },
    // 因子分
    factorAdd () {
      this.frontFactorScoreCriteria.frontFactorScoreFrom.push({ factorName: '', factorScoreCalcFormula: '' })
    },
    factorDel (index) {
      this.frontFactorScoreCriteria.frontFactorScoreFrom.splice(index, 1)
      this.inputBlur()
    },
    yDel (index) {
      this.frontFactorScoreCriteria.factorScoreAnalysis.splice(index, 1)
    },
    // replace
    factorNameCheck (e, index) {
      this.frontFactorScoreCriteria.frontFactorScoreFrom[index].factorName = e.replace(/[^0-9A-Za-z\u4e00-\u9fa5]/g, '')
    },
    // 因子分标准+1
    yAdd () {
      this.frontFactorScoreCriteria.factorScoreAnalysis.push(
        {
          maxAge: '',
          age: '所有',
          minAge: '',
          maxAgeOpt: '<=',
          minAgeOpt: '>=',
          gender: '全部',
          scoreAnalysisForms: [
            {
              minScore: '',
              minOpt: '>=',
              maxScore: '',
              maxOpt: '<=',
              result: '',
              analysis: '',
              factorName: ''
            },
            {
              minScore: '',
              minOpt: '>=',
              maxScore: '',
              maxOpt: '<=',
              result: '',
              analysis: '',
              factorName: ''
            },
            {
              minScore: '',
              minOpt: '>=',
              maxScore: '',
              maxOpt: '<=',
              result: '',
              analysis: '',
              factorName: ''
            },
            {
              minScore: '',
              minOpt: '>=',
              maxScore: '',
              maxOpt: '<=',
              result: '',
              analysis: '',
              factorName: ''
            }
          ]
        }
      )
    },
    tableAdd (i) {
      const obj = {
        minScore: '',
        minOpt: '>=',
        maxScore: '',
        maxOpt: '<=',
        result: '',
        analysis: '',
        factorName: ''
      }
      this.frontFactorScoreCriteria.factorScoreAnalysis[i].scoreAnalysisForms.push(obj)
    },
    tableDel (i, ii) {
      this.frontFactorScoreCriteria.factorScoreAnalysis[i].scoreAnalysisForms.splice(ii, 1)
    },
    clearAge1 (i) {
      this.frontFactorScoreCriteria.factorScoreAnalysis[i].maxAge = ''
      this.frontFactorScoreCriteria.factorScoreAnalysis[i].maxAgeOpt = '<='
      this.frontFactorScoreCriteria.factorScoreAnalysis[i].minAge = ''
      this.frontFactorScoreCriteria.factorScoreAnalysis[i].minAgeOpt = '>='
    },
    // input的repalce/allfilter
    textareaChange (e) {
      this.totalScoreCriteria.totalScoreCalcFormula = e.replace(/[^0123456789Z+\-*/()]/g, '')
    },
    minAgeFilter (index, e) {
      this.totalScoreCriteria.totalScoreAnalysis[index].minAge = e.replace(/[^0123456789]/g, '')
      if (this.totalScoreCriteria.totalScoreAnalysis[index].minAge > 100) {
        this.totalScoreCriteria.totalScoreAnalysis[index].minAge = '100'
      }
    },
    maxAgeFilter (index, e) {
      this.totalScoreCriteria.totalScoreAnalysis[index].maxAge = e.replace(/[^0123456789]/g, '')
      if (this.totalScoreCriteria.totalScoreAnalysis[index].maxAge > 100) {
        this.totalScoreCriteria.totalScoreAnalysis[index].maxAge = '100'
      }
      // if (this.totalScoreCriteria.totalScoreAnalysis[index].maxAge < 1) {
      //   this.totalScoreCriteria.totalScoreAnalysis[index].maxAge = '0'
      // }
    },
    sumScoreMinAgeFilter (e, i, ii) {
      this.totalScoreCriteria.totalScoreAnalysis[i].scoreAnalysisForms[ii].minScore = e.replace(/[^0123456789.-]/g, '')
    },
    sumScoreMaxAgeFilter (e, i, ii) {
      this.totalScoreCriteria.totalScoreAnalysis[i].scoreAnalysisForms[ii].maxScore = e.replace(/[^0123456789.-]/g, '')
    },
    // yinzi
    minAgeFilter1 (index, e) {
      this.frontFactorScoreCriteria.factorScoreAnalysis[index].minAge = e.replace(/[^0123456789]/g, '')
      if (this.frontFactorScoreCriteria.factorScoreAnalysis[index].minAge > 100) {
        this.frontFactorScoreCriteria.factorScoreAnalysis[index].minAge = '100'
      }
      // if (this.frontFactorScoreCriteria.factorScoreAnalysis[index].minAge < 1) {
      //   this.frontFactorScoreCriteria.factorScoreAnalysis[index].minAge = '0'
      // }
    },
    maxAgeFilter1 (index, e) {
      this.frontFactorScoreCriteria.factorScoreAnalysis[index].maxAge = e.replace(/[^0123456789]/g, '')
      if (this.frontFactorScoreCriteria.factorScoreAnalysis[index].maxAge > 100) {
        this.frontFactorScoreCriteria.factorScoreAnalysis[index].maxAge = '100'
      }
    },
    nameTableFilter (e, index) {
      this.frontFactorScoreCriteria.frontFactorScoreFrom[index].factorScoreCalcFormula = e.replace(/[^0123456789Z+\-*/()]/g, '')
    },
    factorTableMinScoreFilter (e, i, ii) {
      this.frontFactorScoreCriteria.factorScoreAnalysis[i].scoreAnalysisForms[ii].minScore = e.replace(/[^\d.-]/g, '')
    },
    factorTableMaxScoreFilter (e, i, ii) {
      this.frontFactorScoreCriteria.factorScoreAnalysis[i].scoreAnalysisForms[ii].maxScore = e.replace(/[^\d.-]/g, '')
    },
    // yinzi修改因子名去处理选择项
    inputBlur () {
      const arr = []
      this.frontFactorScoreCriteria.frontFactorScoreFrom.forEach(e => {
        if (e.factorName) {
          if (!arr.includes(e.factorName)) {
            arr.push(String(e.factorName))
          }
        }
      })
      // console.log(arr, '未去重的')
      this.optionsArr = [...new Set(arr)]
      // console.log(this.optionsArr, '去重的data数据')
      this.frontFactorScoreCriteria.factorScoreAnalysis.forEach((item, index) => {
        item.scoreAnalysisForms.forEach((it, ind) => {
          if (!this.optionsArr.includes(it.factorName)) {
            this.frontFactorScoreCriteria.factorScoreAnalysis[index].scoreAnalysisForms[ind].factorName = ''
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .myForm{
    min-height: 800px;
    width: 1128px;
    overflow: hidden;
    padding-bottom: 400px;
  }
  .top-select{
    line-height: 1.2;
    display: flex;
    margin-bottom: 40px;
    span{
      font-size: 16px;
      color: #333333;
      font-weight: bold;
    }
    /deep/.el-checkbox__label{
      color: #666666;
    }
    /deep/.el-checkbox__input.is-checked + .el-checkbox__label{
      color: #666666;
    }
  }
  // p
  p {
    padding-left: 10px;
    line-height: 1;
    margin-bottom: 32px;
    border-left: 5px solid #34B7B9;
    .blod-span{
      font-size: 16px;
      color: #333333;
      font-weight: bold;
    }
    .text{
      padding-left: 10px;
      font-size: 14px;
      color: #999999;
    }
  }
  // res
  .res1{
    margin: 30px 0;
  }
  // -------title
  .my-title {
    .mytitle{
      font-size: 14px;
      padding-left: 20px;
    }
  }
  .res {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    span:nth-child(1){
      width: 5px;
      height: 5px;
      background-color: #34B7B9;
    }
    span:nth-child(2){
      padding-left: 10px;
      font-size: 14px;
      color: #333333;
      font-weight: bold;
    }
    span:nth-child(3){
      padding-left: 10px;
      font-size: 14px;
      color: #999999;
    }
  }
  .text-area{
    display: flex;
    padding-left: 15px;
    margin-bottom: 48px;
    /deep/.textarea-form-item{
      .el-form-item__content{
        height: 100px;
      }
    }
    span:nth-child(1){
      padding-right: 5px;
    }
    .my-area{
      width: 380px;
      height: 64px;
    }
    .clear{
      padding-left: 5px;
      cursor: pointer;
      font-size: 14px;
      color: #34B7B9;
      font-weight: 500;
      text-decoration: underline;
    }
  }
  // 总分
  .table-box{
    min-height: 400px;
    min-width: 100px;
    max-width: 1128px;
    background: #FBFBFB;
    .line {
      height: 80px;
      display: flex;
      align-items: center;
      span:nth-child(1){
        height: 1px;
        flex: 1;
        background: #CCCCCC;
      }
      span:nth-child(3){
        height: 1px;
        flex: 1;
        background: #CCCCCC;
      }
      span:nth-child(2){
        padding: 0px 34px;
        font-size: 14px;
        color: #999999;
      }
    }
    .line1 {
      height: 80px;
      position: relative;
      display: flex;
      align-items: center;
      .shan{
        position: absolute;
        background: #FBFBFB;
        left: 0;
        width: 116px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .el-button{
        color: #FFFFFF;
        background: #DC5F5F;
        outline: 0;
        border-color:#DC5F5F ;
      }
      .text{
        padding: 0 34px;
        font-size: 14px;
        color: #999999;
      }
      .xian{
        height: 1px;
        flex: 1;
        background-color: #999999;
      }
    }
  }
  // 因子
  .add-line{
    height: 80px;
    position: relative;
    display: flex;
    background: #FBFBFB;
    align-items: center;
    .add{
      position: absolute;
      background: #FBFBFB;
      left: 0;
      width: 116px;
      display: flex;
      align-items: center;
      justify-content: center;
      .el-button{
        color: #FFFFFF;
        background: #34B7B9;
        outline: 0;
        border-color:#34B7B9 ;
      }
    }
    .text{
      padding: 0 34px;
      font-size: 14px;
      color: #999999;
    }
    .xian{
      height: 1px;
      flex: 1;
      background-color: #999999;
    }
  }
  .save-box{
    margin-top: 40px;
    display: flex;
    justify-content: center;
    .save-btn{
      background-color: #34B7B9;
      color: white;
      outline: 0;
    }
  }
  .last-tr{
    padding: 0 15px;
    .my-whole-dashed{
      width: 100%;
      border-style: dashed;
    }
  }
  // 因子
  .factor-box{
    .line {
      height: 80px;
      display: flex;
      align-items: center;
      span:nth-child(1){
        height: 1px;
        flex: 1;
        background: #CCCCCC;
      }
      span:nth-child(3){
        height: 1px;
        flex: 1;
        background: #CCCCCC;
      }
      span:nth-child(2){
        padding: 0px 34px;
        font-size: 14px;
        color: #999999;
      }
    }
    .line1 {
      height: 80px;
      position: relative;
      display: flex;
      align-items: center;
      .shan{
        position: absolute;
        background: #FBFBFB;
        left: 0;
        width: 116px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .el-button{
        color: #FFFFFF;
        background: #DC5F5F;
        outline: 0;
        border-color:#DC5F5F ;
      }
      .text{
        padding: 0 34px;
        font-size: 14px;
        color: #999999;
      }
      .xian{
        height: 1px;
        flex: 1;
        background-color: #999999;
      }
    }
  }
</style>

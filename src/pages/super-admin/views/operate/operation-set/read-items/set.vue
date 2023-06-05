<template>
<div class="my-form" >
  <div class="selec-text">选择需要设置的内容 (可多选)：<span v-for="(it, index) in scoreType" :key="'scoreType' + index">{{it}}</span></div>
  <!-- 总分 -->
    <div class="sum-score same"  v-if="scoreType.includes('总分')">
    <div class="title">总分设置<span>Z为每题的得分,依次为Z1、Z2、Z3、......Zn</span></div>
    <div class="res"><span></span><span>总分计算</span><span> 计算公式支持符号: + * / ()</span><span>(英文括号)</span></div>
    <div class="s"><span>S =</span><span>{{totalScoreCriteria.totalScoreCalcFormula}}</span></div>
    <!-- <div class="res"><span></span><span>诊断标准</span></div> -->
    <div class="res my-title"><span></span><span>诊断标准</span><span class="mytitle">(提示：测评结果请按照从轻到重的程度添加，否则会影响数据统计。)</span></div>
    <!-- 每个块 -->
    <div class="module-box" v-for="(item,index) in totalScoreCriteria.totalScoreAnalysis" :key="'totalScoreAnalysis' + index">
      <div class="line" ><span></span><span>标准{{index+1}}</span><span></span></div>
      <div class="age">年龄：{{item.age}} <div class="params" v-if="item.age === '区间' ">
        <span>{{item.minAge}}</span><span>{{returnText(item.minAgeOpt)}}</span><span>年龄</span><span>{{returnText(item.maxAgeOpt)}}</span><span>{{item.maxAge}}</span>
        </div> </div>
      <div class="gender">性别：{{item.gender}}</div>
      <table class="score-table">
        <tr class="first-tr">
          <td>总分</td>
          <td>测评结果 <span class="small-text">(最多100字)</span></td>
          <td>分析/指导意见<span class="small-text">(最多500字)</span></td>
          <td>异常</td>
        </tr>
        <tr class="or-tr" v-for="(it, index) in item.scoreAnalysisForms" :key="'scoreForms' + index">
          <td class="one">
            <div>{{it.minScore}}</div>
            <div>{{returnText((it.minOpt))}}</div>
            <div>总分</div>
            <div>{{returnText((it.maxOpt))}}</div>
            <div>{{it.maxScore}}</div>
          </td>
          <td class="two">
            <span>{{it.result}}</span>
          </td>
          <td class="three">
            <span>{{it.analysis}}</span>
          </td>
          <td class="four">
            <div :class="{shi: it.abnormalBool, fou: !it.abnormalBool}">
            <span>是</span>
            <span>否</span>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <!-- 因子分 -->
  <div class="factor-score same"  v-if="scoreType.includes('因子分')">
    <div class="title">因子分设置<span>Z为每题的得分,依次为Z1、Z2、Z3、......ZN;F为各个因子分,依次为F1、F2、F3......FN</span></div>
    <div class="res"><span></span><span>因子分计算</span><span> 计算公式支持符号: + * / ()</span><span>(英文括号)</span></div>
    <table class="name-table">
      <tr class="first-tr">
        <td></td>
        <td>因子名称<span>(最多15字)</span></td>
        <td>计算公式<span>(不需要输入"=")</span></td>
      </tr>
      <tr class="or-tr" v-for="(it,index) in frontFactorScoreCriteria.frontFactorScoreFrom" :key="it">
        <td>F{{index+1}}</td>
        <td><div class="box">{{it.factorName}}</div></td>
        <td><div class="box">{{it.factorScoreCalcFormula}}</div></td>
      </tr>
    </table>
    <div class="res"><span></span><span>因子分析</span></div>
    <div class="factor-module" v-for="(item,index) in frontFactorScoreCriteria.factorScoreAnalysis" :key="item">
      <div class="line" ><span></span><span>标准{{index+1}}</span><span></span></div>
      <div class="age">年龄：{{item.age}} <div class="params" v-if="item.age === '区间' ">
        <span>{{item.minAge}}</span><span>{{returnText(item.minAgeOpt)}}</span><span>年龄</span><span>{{returnText(item.maxAgeOpt)}}</span><span>{{item.maxAge}}</span>
        </div> </div>
      <div class="gender">性别：{{item.gender}}</div>
      <table class="factor-table">
        <tr class="first-tr">
          <td>因子分</td>
          <td>测评结果<span class="small-text">(最多100字)</span></td>
          <td>分析/指导意见<span class="small-text">(最多500字)</span></td>
        </tr>
        <tr class="or-tr" v-for="(it, index) in item.scoreAnalysisForms" :key="'scoreAnalysisForms' + index">
          <td class="first-td">
            <span>{{it.minScore}}</span>
            <span>{{returnText(it.minOpt)}}</span>
            <span>{{it.factorName}}</span>
            <span>{{returnText(it.maxOpt)}}</span>
            <span>{{it.maxScore}}</span>
          </td>
          <td><div class="same">{{it.result}}</div> </td>
          <td><div class="same">{{it.analysis}}</div></td>
        </tr>
      </table>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'read-set',
  data () {
    return {
      scoreType: [],
      totalScoreCriteria: { // 总分
        totalScoreCalcFormula: '', // 总分文本域\总分表格
        totalScoreAnalysis: [
          {
            maxAge: '',
            age: '',
            minAge: '',
            maxAgeOpt: '<=',
            minAgeOpt: '>=',
            gender: '',
            scoreAnalysisForms: [
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                abnormalBool: true
              },
              {
                minScore: '',
                minOpt: '>=',
                maxScore: '',
                maxOpt: '<=',
                result: '',
                analysis: '',
                abnormalBool: true
              }
            ]
          },
          {
            maxAge: '',
            age: '',
            minAge: '',
            maxAgeOpt: '<=',
            minAgeOpt: '>=',
            gender: '',
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
            age: '',
            minAge: '',
            maxAgeOpt: '<=',
            minAgeOpt: '>=',
            gender: '',
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
          },
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
      }
    }
  },
  created () {
    this.$store.dispatch('getTableInfo', this.$route.query.tableCode).then((res) => {
      // console.log(res, '数据')
      this.scoreType = res.scoreType
      this.totalScoreCriteria = res.totalScoreCriteria
      this.frontFactorScoreCriteria = res.frontFactorScoreCriteria
    })
  },
  methods: {
    returnText (text) {
      if (text === '<') {
        return '小于'
      } else if (text === '<=') {
        return '小于等于'
      } else if (text === '=') {
        return '等于'
      } else if (text === '>') {
        return '大于'
      } else if (text === '>=') {
        return '大于等于'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.my-form{
  width: 1128px;
  .selec-text{
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 40px;
    color: #333333;
    span{
      padding-left: 30px;
      font-size: 14px;
      font-weight: normal;
      color: #666666;
    }
  }
  .same{
    .title{
      line-height: 1;
      padding-left: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      border-left: 3px solid #34B7B9;
      margin-bottom: 33px;
      span{
        font-size: 14px;
        padding-left: 10px;
        font-weight: normal;
        color: #999999;
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
    span:nth-child(4){
      padding-left: 10px;
      font-size: 14px;
      color: #999999;
    }
    }
    .module-box{
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
      .age{
        height: 52px;
        display: flex;
        line-height: 52px;
        padding-left: 100px;
        .params{
          display: flex;
          padding-left: 250px;
          font-size: 14px;
          color: #999999;
          span{
            padding: 0 10px;
          }
          span:nth-child(3){
            padding: 0 20px;
            color: #333333;
          }
        }
      }
      .gender{
        height: 52px;
        line-height: 52px;
        padding-left: 100px;
      }
    }
  }
  .sum-score{
    .s{
      display: flex;
      margin-bottom: 30px;
      span:nth-child(1){
        padding: 0 15px;
        font-weight: bold;
      }
      span:nth-child(2){
        width: 400px;
        word-break: break-all;
      }
    }
    .score-table{
      width: 100%;
      background: #FFFFFF;
      .first-tr{
        background: #EEEEEE;
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        font-weight: 500px;
        color: #8C8C8C;
        .small-text{
          font-size: 12px;
          color: #999999;
        }
      }
      tr{
        display: flex;
        td:nth-child(1){
          flex: 1;
          display: flex;
          padding-left: 20px;
          align-items: center;
          div{
            flex: 1;
          }
        }
        td:nth-child(2){
          width: 250px;
          display: flex;
          align-content: center;
          align-items: center;
          padding-right: 20px;
          word-break: break-all;
        }
        td:nth-child(3){
          width: 250px;
          display: flex;
          align-content: center;
          align-items: center;
          padding-right: 20px;
          word-break: break-all;
        }
        td:nth-child(4){
          width: 100px;
          display: flex;
          align-items: center;
          justify-content: left;
          div{
          display: flex;
          margin-top: 3px;
          width: 64px;
          box-sizing: border-box;
          border:1px solid #34B7B9 ;
          // cursor: pointer;
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
      }
      .or-tr{
        min-height: 64px;
        border-bottom: 1px solid #CCCCCC;
      }
    }
  }
  .factor-score{
    margin-top: 20px;
    .name-table{
      background: #FBFBFB;
      margin-bottom: 20px;
      width: 1128px;
      tr{
        display: flex;
        td:nth-child(1){
          width: 100px;
          line-height: 50px;
          text-align: center;
        }
        td:nth-child(2){
          width: 200px;
        }
        td:nth-child(3){
          flex: 1;
          word-break: break-all;
        }
      }
      .first-tr{
        height: 50px;
        background: #EEEEEE;
        line-height: 50px;
        color: #8C8C8C;
        font-size: 16px;
        .small-text{
          font-size: 12px;
          color: #999999;
        }
      }
      .or-tr{
        height: 84px;
        border-bottom: 1px solid #EEEEEE;
        td{
          .box{
            padding-top: 13px;
          }
        }
      }
    }
    .factor-module{
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
      .age{
        height: 52px;
        display: flex;
        line-height: 52px;
        padding-left: 100px;
        .params{
          display: flex;
          padding-left: 250px;
          font-size: 14px;
          color: #999999;
          span{
            padding: 0 10px;
          }
          span:nth-child(3){
            padding: 0 20px;
            color: #333333;
          }
        }
      }
      .gender{
        height: 52px;
        line-height: 52px;
        padding-left: 100px;
      }
    }
    .factor-table{
      width: 1128px;
      .first-tr{
        height: 50px;
        line-height: 50px;
        background: #EEEEEE;
        color: #8C8C8C;
        font-weight: 500px;
        font-size: 16px;
        .small-text{
          font-size: 12px;
          color: #999999;
        }
      }
      .or-tr{
        border-bottom: 1px solid #EEEEEE;
        td{
          display: flex;
          align-items: center;
          justify-content: left;
          min-height: 60px;
        }
        .same{
          word-break: break-all;
        }
        .first-td{
          span{
            flex: 1;
          }
        }
      }
      tr{
        display: flex;
        td:nth-child(1){
          padding-left: 20px;
          flex: 1;
        }
        td:nth-child(2){
          width: 300px;
          padding-right: 20px;
        }
        td:nth-child(3){
          width: 300px;
          padding-right: 20px;
        }
      }
    }
  }
}
</style>

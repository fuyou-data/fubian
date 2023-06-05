<template>
<div class="self-table">
  <div class="report-block pb-3">
    <div v-if="disPlayInfo.includes('总分')"><span class="font-weight-bold">总分：</span>{{report.detail.totalScore}}</div>
    <div v-if="disPlayInfo.includes('测评结果')"><span class="font-weight-bold">测评结果：</span>{{report.detail.level}}</div>
    <div class="mt-2 d-flex" v-if="disPlayInfo.includes('分析/指导意见')"><div class="font-weight-bold">分析：</div><div v-html="report.detail.analysis" style="white-space: pre-wrap;flex: 1;"></div></div>
  </div>
   <div class="report-block" v-if="disPlayInfo.includes('总分图')">
    <div class="font-weight-bold bold-title">总分图：</div>
    <ScoreDiv :data="report.detail.totalScoreChart" :score="report.detail.totalScore" :name="report.detail.level" :scoreIndex="scoreIndex"></ScoreDiv>
  </div>
  <div class="report-block pt-3" v-if="disPlayInfo.includes('结果解释')">
    <div class="font-weight-bold bold-title">结果解释：</div>
    <div v-html="report.detail.analysis" style="white-space: pre-wrap;"></div>
  </div>
  <div v-if="disPlayInfo.includes('选项展示')" class="pt-3">
    <div class="report-block font-weight-bold bold-title">选项展示：</div>
    <table border="1" class="table1">
      <tr class="head report-block">
        <th>题目</th>
        <th>答案</th>
      </tr>
      <tr class="report-block" v-for="(it, index) in report.detail.topicScores" :key="'topicScores' + index">
        <td>{{it.index || index + 1}}.{{it.topic}}</td>
        <td style="white-space: pre-wrap;">{{it.answer}}</td>
      </tr>
    </table>
    <div v-if="disPlayInfo.includes('因子表格分析')" class="report-block table-bottom pb-3"></div>
  </div>
  <div v-if="disPlayInfo.includes('因子表格分析')" class="report-block font-weight-bold bold-title">因子表格分析：</div>
  <table v-if="disPlayInfo.includes('因子表格分析')" class="table2" border="1">
    <tr class="head report-block">
      <th :style="{minWidth: width('80px')}">因子</th>
      <th :style="{minWidth: width('60px')}">分数</th>
      <th :style="{minWidth: width('100px')}">参考分范围</th>
      <th :style="{minWidth: width('90px','65px')}">测评结果</th>
    </tr>
    <tr class="report-block" v-for="item in report.detail.factorScores" :key="item.factor">
      <td>{{item.factor}}</td>
      <td>{{item.totalScore}}</td>
      <td>{{item.referenceScoreScope ? `${item.referenceScoreScope.minScore}-${item.referenceScoreScope.maxScore}` : '-'}}</td>
      <td>{{item.level}}</td>
    </tr>
  </table>
  <div v-if="disPlayInfo.includes('因子表格分析')" class="report-block table-bottom"></div>
  <div class="pt-3" v-if="disPlayInfo.includes('维度解释')">
    <div class="report-block font-weight-bold bold-title">维度解释：</div>
    <div class="report-block jieshi" v-for="(item, index) in report.detail.factorScores" :key="'factorScores2' + index">
      <h3>{{index + 1}}.{{item.factor}}</h3>
      <div><span class="text-title">你的{{item.factor}}得分为：</span><span>{{item.totalScore}}分</span></div>
      <div style="display:flex"><span class="text-title">维度结果：</span><span>{{item.level}}</span></div>
      <div style="display:flex"><span class="text-title">维度分析：</span><span class="need-warp" style="flex:1;" v-html="item.comment"></span></div>
    </div>
  </div>
  <div class="report-block pt-3" v-if="disPlayInfo.includes('因子折线图')">
    <div class="font-weight-bold">因子折线图：</div>
    <Chart :xAxis="returnSomething(report.detail.factorScores, 2)" :data="returnSomething(report.detail.factorScores, 1)"></Chart>
  </div>
  <div class="report-block pt-3" v-if="disPlayInfo.includes('维度雷达图')">
    <div class="font-weight-bold bold-title">维度雷达图：</div>
    <RadarChart :report="report.detail.factorScores"></RadarChart>
  </div>
  <div class="report-block pt-3" v-if="disPlayInfo.includes('维度表格')">
    <div class="font-weight-bold bold-title">维度表格：</div>
    <table class="table2" border="1">
    <tr class="head">
      <th style="width:50%">维度名称</th>
      <th>你的分数</th>
      <th>参考范围</th>
    </tr>
    <tr v-for="(item, index) in report.detail.factorScores" :key="'factorScores1' + index">
      <td style="width:50%">{{item.factor}}</td>
      <td>{{item.totalScore}}</td>
      <td>{{item.referenceScoreScope.minScore}}-{{item.referenceScoreScope.maxScore}}</td>
    </tr>
  </table>
  </div>
</div>
</template>

<script>
import Chart from '@/components/ReportChart/Chart'
import ScoreDiv from '@/components/ReportChart/ScoreDiv'
import RadarChart from '@/components/ReportChart/RadarChart'
export default {
  name: 'self-tabel',
  data () {
    return {
    }
  },
  props: {
    report: Object,
    scoreIndex: Number
  },
  components: {
    Chart,
    ScoreDiv,
    RadarChart
  },
  computed: {
    disPlayInfo () {
      return this.report.disPlayInfo || []
    }
  },
  mounted () {
    if (this.report.detail.totalScore.split('')[5] === '.') {
      this.report.detail.totalScore = this.report.detail.totalScore.replace('.', '')
    }
  },
  methods: {
    returnSomething (arr, type) {
      if (type === 1) {
        const temp = []
        arr.forEach(e => {
          temp.push(isNaN(Number(e.totalScore)) ? 0 : Number(e.totalScore))
        })
        // console.log(temp)
        return temp
      }
      if (type === 2) {
        const text = []
        arr.forEach(e => {
          text.push(e.factor)
        })
        return text
      }
    },
    width (pc, mobile) {
      if (document.documentElement.clientWidth > 768) {
        return pc || 'auto'
      } else {
        return mobile || 'auto'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.table-bottom {
  position: relative;
  height: 10px;
  border-top: 1px solid #000;
  z-index: -1;
}
.bold-title{
  padding-bottom: 12px;
}
.jieshi{
  color: #333333;
  font-size: 14px;
  h3{
    font-weight: bold;
    margin-bottom: 12px;
    font-size: 14px;
  }
  div{
    margin-bottom: 5px;
  }
}
.self-table {
  // padding-top: 20px;
  .table1 {
    width: 100%;
    padding-top: 1rem;
    .head{
        font-weight: bold;
    }
    th:first-child,td:first-child{
        width: 60%;
    }
    th:last-child,td:last-child{
        width: 40%;
    }
    th {
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: #D6E2EE;
      border-color: #000;
      font-size: 14px;
    }
    td {
      height: 24px;
      line-height: 24px;
      border-color: #000;
      padding: 0 1rem;
    }
  }
  .table2 {
    width: 100%;
    .head{
        font-weight: bold;
    }
    th {
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: #D6E2EE;
      border-color: #000;
      font-size: 14px;
    }
    td {
      height: 24px;
      line-height: 24px;
      border-color: #000;
      padding: 0 1rem;
      text-align: center;
    }
  }
}
.text-title {
  font-size: 14px;
  color: #333636;
  font-weight: bold;
}
.need-warp {
  display: inline-block;
  white-space: pre-wrap;
  word-break: break-all;
}
@media screen and (max-width: 500px) {
  .self-table .table1 {
    font-size: 12px;
    width: 100%;
    td,th {
      padding: 0.3rem 0.5rem;
      height: 16px;
      line-height: 16px;
    }
  }
}
</style>

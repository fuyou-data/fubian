<template>
  <div class="hamd">
    <div class="report-block">
      <div class="hamd-score" v-if="report.tableCode === 'hamd'">您的HAMD分数为：{{report.detail.totalScore}}</div>
      <div class="hamd-score" v-if="report.tableCode === 'hama'">您的HAMA分数为：{{report.detail.totalScore}}</div>
      <div class="hamd-text">参考诊断为：{{report.detail.level}}</div>
      <HamdTable :tableData="report.detail.factorScores" :totalScore="report.detail.totalScore"></HamdTable>
    </div>
    <div class="report-block pt-3">
      <div class="hamd-score">因子折线图：</div>
      <Chart :xAxis="returnSomething(report.detail.factorScores, 2)" :data="returnSomething(report.detail.factorScores, 1)"></Chart>
    </div>
    <div class="report-block" v-if="!isShow">
      <div class="hamd-score">答题特征图</div>
      <div style="padding-top:10px;color:#333">综合得分：<span class="hamd-score" style="font-size:16px">{{overallScore}}</span></div>
      <Radar :radarData="radarData" :indicator="indicator"></Radar>
      <span class="r_tips">{{hints}}</span>
    </div>
    <div class="report-block" v-if="!isShow">
      <div class="hamd-score" style="padding:15px 0 10px">情绪波动图</div>
      <lineChart :lineDataX="lineDataX" :lineDataY="lineDataY"></lineChart>
    </div>
  </div>
</template>

<script>
import Chart from '@/components/ReportChart/Chart'
import Radar from '@/components/ReportChart/radar'
import lineChart from '@/components/ReportChart/line'
import HamdTable from './table.vue'
export default {
  name: 'Hamd',
  props: {
    report: Object
  },
  components: {
    HamdTable,
    Chart,
    Radar,
    lineChart
  },
  data () {
    return {
      radarData: [],
      overallScore: 0,
      indicator: [
        { name: '表情', max: 1000 },
        { name: '语言', max: 1000 },
        { name: '声音', max: 1000 }
      ],
      hints: '',
      lineDataX: [],
      lineDataY: [],
      isShow: false
    }
  },
  mounted () {
    const front = this.report.detail.frontFeatureScore
    if (front) {
      this.radarData = [front.videoScore, front.textScore, front.audioScore]
      this.isShow = this.radarData.every(v => { return v === 0 })
      const flag = this.radarData.every(v => { return v < 500 })
      const flag1 = this.radarData.every(v => { return v < 100 })
      const flag2 = this.radarData.every(v => { return v < 10 })
      if (flag) {
        this.indicator.forEach(v => {
          v.max = 500
        })
      }
      if (flag1) {
        this.indicator.forEach(v => {
          v.max = 100
        })
      }
      if (flag2) {
        this.indicator.forEach(v => {
          v.max = 10
        })
      }
      this.hints = front.hints
      this.overallScore = front.overallScore
      this.lineDataY = front.emotionScore || []
      this.lineDataY.forEach((v, i) => {
        this.lineDataX.push(i)
      })
    } else {
      this.isShow = true
    }
  },
  methods: {
    returnSomething (arr, type) {
      if (type === 1) {
        const temp = []
        arr.forEach(e => {
          temp.push(Number(e.meanScore))
        })
        return temp
      }
      if (type === 2) {
        const text = []
        arr.forEach(e => {
          text.push(e.factor)
        })
        return text
      }
    }
  }
}
</script>

<style lang="less" scoped>
.hamd{
  .hamd-score{
    font-size: 14px;
    font-weight: bold;
  }
  .hamd-text{
    padding-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
  }
  .r_tips{
    font-size: 14px;
    color: #777;
  }
}
</style>

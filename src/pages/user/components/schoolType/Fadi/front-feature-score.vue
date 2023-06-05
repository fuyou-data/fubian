<template>
  <div v-if="!isShow">
    <div class="report-block">
      <div class="hamd-score">答题特征图</div>
      <div style="padding-top:10px;color:#333">
        综合得分：<span class="hamd-score" style="font-size:16px">{{overallScore}}</span>
      </div>
      <Radar :radarData="radarData" :indicator="indicator"></Radar>
      <span class="r_tips">{{hints}}</span>
    </div>
    <div class="report-block">
      <div class="hamd-score" style="padding:15px 0 10px">情绪波动图</div>
      <lineChart :lineDataX="lineDataX" :lineDataY="lineDataY"></lineChart>
    </div>
  </div>
</template>

<script>
import Radar from '@/components/ReportChart/radar'
import lineChart from '@/components/ReportChart/line'
export default {
  name: 'front-feature-score',
  props: {
    frontFeatureScore: Object
  },
  components: {
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
    const front = this.frontFeatureScore
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
  }
}
</script>

<style lang="less" scoped>
.r_tips{
  font-size: 14px;
  color: #777;
}
</style>

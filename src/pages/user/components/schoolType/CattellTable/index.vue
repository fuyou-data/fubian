<template>
  <div class="mt-3">
    <!-- 这是一块 -->
    <div class="pb-4 model-height-01 report-block">
      <p class="cattell-title">Ⅰ 人格因素</p>
      <Chart :data="mainChartData"/>
    </div>
    <!-- 这一块需要拆 -->
    <div class="pb-4 model-height-02">
      <normalTable
        :data="cTableMainData01"
        :propsArray="[
          { label: '人格因素', prop: 'personalityFactor', textCenter: true },
          { label: '您的标准分', prop: 'stdScore', textCenter: true },
          { label: '您的得分状态', prop: 'scoringStatus', textCenter: true },
          { label: '分析/指导意见', prop: 'analysis' }
        ]">
      </normalTable>
      <div class="underline report-block"></div>
    </div>
    <!-- 这是一块 -->
    <div class="report-block">
        <div class="space"></div>
        <p class="text-center">基于人格因素的职业参考</p>
        <c-table
        :data="cTableMainData02"
        :propsArray="[
          { label: '人格因素', prop: 'personalityFactor', textCenter: true },
          { label: '低分者', prop: 'lowScorers' },
          { label: '高分者', prop: 'highScorers' }
        ]">
        </c-table>
    </div>
    <!-- 这是一块 -->
    <div class="pb-4 model-height-03 report-block">
      <p class="cattell-title">Ⅱ 次级人格因素</p>
      <p class="ciyuan">次级人格因素是由以上有关的基本因素标准分，经过数量均衡，连同指定常数，相加而成的。另外，以下各因素分数的高低并不就等同于心理健康状态的好坏以及成就、创造力、成长能力的水平。它只是表明人格因素对这些方面的影响程度。事实上，除了人格因素，成就大小、创造力水平、心理健康状况等还受到其它诸多因素影响。</p>
      <c-table
        :data="dimensionData"
        :propsArray="[
          { label: '次级人格因素', prop: 'secondaryFactor', textCenter: true },
          { label: '您的标准分', prop: 'stdScore', textCenter: true },
          { label: '您的得分状态', prop: 'scoringStatus', textCenter: true },
          { label: '分析/指导意见', prop: 'analysis' }
        ]">
      </c-table>
    </div>
    <!-- 这是一块 -->
    <div class="report-block">
      <p class="cattell-title">Ⅲ 综合人格因素</p>
      <p class="ciyuan">综合人格因素是由基本因素标准分，经过数量均衡，连同指定常数，相加而成的。另外，以下各因素分数的高低并不就等同于心理健康状态的好坏以及成就、创造力、成长能力的水平。
        它只是表明人格因素对这些方面的影响程度。事实上，除了人格因素，成就大小、创造力水平、心理健康状况等还受到其它诸多因素影响。
      </p>
      <c-table
        :data="synthesizeData"
        :propsArray="[
          { label: '综合人格因素', prop: 'combinedFactor', textCenter: true },
          { label: '您的标准分', prop: 'stdScore', textCenter: true },
          { label: '您的得分状态', prop: 'scoringStatus', textCenter: true },
          { label: '分析/指导意见', prop: 'analysis' }
        ]">
      </c-table>
    </div>
  </div>
</template>

<script>
import Chart from './chart'
import CTable from './table'
import normalTable from './normalTable.vue'

export default {
  name: 'CattellTable',
  props: {
    report: Object
  },
  components: {
    Chart,
    CTable,
    normalTable
  },
  data () {
    return {
      cTableMainData01: [],
      cTableMainData02: [],
      dimensionData: [],
      synthesizeData: [],
      mainChartData: []
    }
  },
  computed: {
  },
  mounted () {
    const { detail } = this.report
    this.mainChartData = []
    this.cTableMainData01 = []
    this.cTableMainData02 = []
    if (!detail.pf16Report) return
    const { personalityFactors, secondaryFactors, combinedFactors } = detail.pf16Report
    personalityFactors.forEach(
      v => {
        const {
          personalityFactor,
          scoringStatus,
          analysis,
          lowScorers,
          highScorers,
          stdScore,
          featuresOfLowScorers,
          featuresOfHighScorers
        } = v
        const personality = personalityFactor + ` (${stdScore})`
        this.mainChartData.push({
          personality: personality,
          score: stdScore,
          lowScore: featuresOfLowScorers,
          heightScore: featuresOfHighScorers
        })
        this.cTableMainData01.push({
          personalityFactor,
          scoringStatus,
          stdScore,
          analysis
        })
        if (lowScorers && highScorers) {
          this.cTableMainData02.push({
            personalityFactor,
            lowScorers,
            highScorers
          })
        }
      }
    )
    this.dimensionData = secondaryFactors
    this.synthesizeData = combinedFactors
  }
}
</script>

<style lang="less" scoped>
.cattell-title {
  font-size: 14px;
  margin-bottom: 0px;
  padding-bottom: 1rem;
  padding-top: 1rem;
}
.space{
  width: 100%;
  height: 2rem;
}
.underline{
  border-top: 1px solid #707070;
  height: 2rem;
  width: 100%;
}
.text-center{
  margin-bottom: 0px;
  padding-bottom: 1rem;
}
.ciyuan{
  margin-bottom: 0px;
  padding-bottom: 1rem;
}
</style>

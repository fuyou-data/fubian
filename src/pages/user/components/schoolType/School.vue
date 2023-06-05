<template>
  <div ref="resTemp" class="result-page">
    <div class="report-header">
      <div class="header">
        <img v-if="orgLogo" :src="orgLogo" alt="organ-logo">
        <!-- <img :src="orgLogo" alt="organ-logo"> -->
        <span class="hospital">{{orgName}}</span>
        <i v-if="fubianName || fubianLogo" class="el-icon-close"></i>
        <img v-if="fubianLogo" :src="fubianLogo" alt="fubian-logo">
        <span v-if="fubianName" class="hospital">{{fubianName}}</span>
      </div>
      <div class="text-center mb-4">{{report.reportName}}</div>
      <div class="patient-info-wrap">
        <div class="title">
          <p>个人信息</p>
          <p class="time">
            <span class="d-none d-sm-inline">报告时间：</span>
            <span class="text-right" v-html="curTime"></span>
          </p>
        </div>
        <div class="patient-info">
          <div v-if="customInfo.姓名"><span>姓名：</span><span>{{customInfo.姓名}}</span></div>
          <div v-if="customInfo.部门"><span>部门：</span><span>{{customInfo.部门}}</span></div>
          <div v-if="customInfo.编号"><span>编号：</span><span>{{customInfo.编号}}</span></div>
        </div>
        <div class="patient-info">
          <div v-if="patientInfo.age >= 0"><span>年龄：</span><span>{{patientInfo.age}}</span></div>
          <div v-if="patientInfo.gender"><span>性别：</span><span>{{patientInfo.gender}}</span></div>
          <div v-if="patientInfo.education"><span>教育程度：</span><span>{{patientInfo.education}}</span></div>
          <div v-if="patientInfo.maritalStatus"><span>婚姻状况：</span><span>{{patientInfo.maritalStatus}}</span></div>
        </div>
      </div>
      <div class="title">报告分析</div>
    </div>
    <div class="report-result">
      <component v-bind:is="componentsName" :report="report" :scoreIndex="scoreIndex"></component>
    </div>
    <div class="report-footer">
      <p>本测试结果仅作为当前测试时间段受试者心理状态的参考，不能作为疾病诊断。如果测试结果异常，并不意味着您有精神障碍或心理问题，建议您在专业的临床医生指导下进一步检查。</p>
    </div>
  </div>
</template>

<script>
import Browser from '@/utils/browser'
import SdsSas from './SdsSas'
import Phq from './Phq9Table/index'
import Mmpi from './Mmpi.vue'
import Scl from './SclTable/index'
import Hamd from './HamdTable/index'
import SelfTable from './SelfTable'
import EpqTable from './Epq/index'
import CattellTable from './CattellTable/index'
import MBTI from './MBTI/index'
import Mini from './Mini'
import Fadi from './Fadi'

import { DateFormat } from '@/utils/date'
export default {
  name: 'School',
  props: {
    customInfo: Object,
    patientInfo: Object,
    report: Object,
    orgName: String,
    orgLogo: String,
    fubianLogo: String,
    fubianName: String,
    scoreIndex: Number
  },
  components: {
    SdsSas,
    Phq,
    Scl,
    EpqTable,
    Hamd,
    Mmpi,
    Mini,
    CattellTable,
    SelfTable,
    MBTI,
    Fadi
  },
  data () {
    return {
      mobile: Browser.mobile,
      flag: false
    }
  },
  computed: {
    curTime () {
      const ms = this.report.finishedTime * 1000
      const timeObj = { date: ms, format: 'yyyy.MM.dd hh:mm:ss' }
      const res = DateFormat(timeObj)
      // if (window.matchMedia('(max-width: 576px)').matches) {
      //   return res.split(' ').join('</br>')
      // }
      return res
    },
    componentsName () {
      let name = ''
      switch (this.report.tableCode) {
        case 'sds':
          name = 'SdsSas'
          break
        case 'sas':
          name = 'SdsSas'
          break
        case 'scl90':
          name = 'Scl'
          break
        case 'phq9':
          name = 'Phq'
          break
        case 'hamd':
          name = 'Hamd'
          break
        case 'hama':
          name = 'Hamd'
          break
        case 'EPQ':
          name = 'EpqTable'
          break
        case '16PF':
          name = 'CattellTable'
          break
        case 'MBTI':
          name = 'MBTI'
          break
        case 'MMPI':
          name = 'Mmpi'
          break
        case 'MINI':
          name = 'Mini'
          break
        case 'FADI':
          name = 'Fadi'
          break
        default:
          name = 'SelfTable'
          break
      }
      return name
    }
  },
  mounted () {
    this.flag = window.matchMedia('(max-width: 500px)').matches
    // if (window.matchMedia('(min-width: 1000px)').matches) {
    //   this.$nextTick(() => {
    //     const tempHeight = this.$refs.resTemp.offsetHeight
    //     const pages = Math.ceil(tempHeight / 1308)
    //     this.$refs.resTemp.style.height = pages * 1308 - 30 + 'px'
    //     // console.log(this.$refs.resTemp.offsetHeight)
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
.report-header {
  padding-top: 40px;
  padding-bottom: 15px;
}
.result-page {
  font-size: 14px;
  position: relative;
  min-height: 1278px;
  padding-bottom: 80px;
  padding-left: 40px;
  padding-right: 40px;
  margin-bottom: 30px;
  border: 1px #fff solid;
  border-radius: 5px;
  background: white;
  color: #000;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 2rem;
    font-size: 20px;
    i {
      padding: 0 1rem;
      font-size: 1rem;
      color: #E4E4E4;
    }
    img {
      height: 2rem;
    }
    .hospital {
      margin-left: .5rem;
      font-weight: 700;
    }
  }
  // .result{
  //   margin-top: 0.5rem;
  // }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 700;
    border-bottom: 1px dashed #999999;
    p {
      margin-bottom: 0;
    }
  }
  .time {
    font-weight: normal;
  }
  .report-footer {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: calc(100% - 80px);
    padding-bottom: 20px;
    // padding: 0 40px 20px 40px;
    font-size: 14px;
    color: #666;
    transform: translateX(-50%);
  }
}
// pc
.patient-info-wrap {
  margin-bottom: 20px;
}
.patient-info {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  .need-top{
    top: 18px;
  }
  div {
    min-width: 25%;
    max-width: 25%;
    display: flex;
    span:first-child{
      white-space: nowrap;
    }
    span:last-child{
      word-break: break-all;
      overflow:hidden;
      // text-overflow:ellipsis;
      // display:-webkit-box;
      // -webkit-box-orient:vertical;
      // -webkit-line-clamp:2;
      max-height: 37px;
      padding-right: 5px;
    }
  }
}
@media screen and (max-width: 500px) {
  .result-page {
    min-height: auto;
    padding-bottom: 200px;
    .header {
      padding-bottom: 1rem;
    }
  }
}
</style>

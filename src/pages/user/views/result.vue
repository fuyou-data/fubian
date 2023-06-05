<template>
  <div class="res-page" :class="{ 'pad': isPad }">
    <user-header :bg="false"  v-if="!mobile"></user-header>
    <div class="btn-wrap" v-if="!mobile">
      <div class="left">
        <el-button v-if="reports.length > 0 && show" class="result-btn" @click="downLoad">打印报告</el-button>
      </div>
      <div class="right" v-if="!mobile && show">
        <el-button  class="shuaxin result-btn" @click="refresh" >刷新</el-button>
      </div>
    </div>
     <div class="refresh" v-if="!reportAllCompleted && !mobile && show">
      <icon-font  class="iconfont"  name="#mdd-shuaxin" :width="14" :height="14" color="ffffff"> </icon-font>
      还有部分报告未展示，请稍后刷新查看！
    </div>
    <div>
      <!-- 这是医院类型不带logo且和医院内部系统的样式一样 -->
      <div class="res-wrap" ref="res" :class="{ 'pad': isPad }">
        <School
          v-for="(report, index) in reports"
          :orgLogo="orgLogo"
          :orgName="orgName"
          :fubianLogo="fubianLogo"
          :fubianName="fubianName"
          :key="index"
          :patientInfo="patientInfo"
          :customInfo="customInfo"
          :report="report"
          :scoreIndex="index">
        </School>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import UserHeader from '../components/UserHeader'
import { ExportPDF } from '@/utils/export-pdf'
// import ExportPDF from '@/utils/export-pdf'
import Browser from '@/utils/browser'
import { getReportRes } from '@/api/modules/user'
import School from '../components/schoolType/School'
export default {
  name: 'ResPage',
  components: {
    UserHeader,
    School
  },
  data () {
    return {
      orgLogo: '',
      orgName: '',
      fubianLogo: '',
      fubianName: '',
      mobile: false,
      expPdf: null,
      customInfo: {}, // 第一行固定信息
      patientInfo: {}, // 其他信息
      reports: [],
      show: false,
      reportAllCompleted: '' // 报告是否完成
    }
  },
  computed: {
    sessionId () {
      let res = ''
      const rid = this.$route.query.sessionId
      if (rid) {
        res = rid
      } else res = this.$store.state.sessionId
      return res
    },
    isPad () {
      return this.$route.query.source === 'pad'
    }
  },
  beforeCreate () {
    document.title = '测评报告'
  },
  mounted () {
    this.mobile = Browser.android
    const { tableCode, companyName } = this.$route.query
    const params = { sessionId: this.sessionId }
    if (tableCode) params.tableCode = tableCode
    if (companyName) params.companyName = companyName
    getReportRes(params).then(
      ({ data = {} }) => {
        console.log(JSON.stringify(data))
        this.orgLogo = data.orgLogo
        this.orgName = data.orgName
        this.fubianLogo = data.fubianLogo
        this.fubianName = data.fubianName
        this.customInfo = data.customInfo
        this.reports = data.reports || []
        this.patientInfo = data.patientInfo
        this.reportAllCompleted = data.reportAllCompleted
      }
    )
  },
  updated () {
    this.show = true
  },
  destroyed () {
    document.title = '测评报告'
  },
  methods: {
    back () {
      this.$store.commit('INIT')
      this.$router.push('/')
    },
    async downLoad () {
      if (this.expPdf) {
        this.expPdf.downLoad()
        return
      }
      const loading = this.$loading({
        lock: true,
        text: '报告打印中',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      let str = ''
      Object.keys(this.customInfo).forEach((e) => {
        if (e!== '账号') {
          str += this.customInfo[e]
        }
      })
      str += '测评报告'
      str += '-' + this.sessionId
      this.expPdf = new ExportPDF()
      const reports = document.querySelectorAll('.result-page')
      console.log(reports)
      for (const report of reports) {
        const reportChild = Array.from(report.children)
        const header = reportChild[0]
        const footer = reportChild[2]
        const contentBlock = reportChild[1].querySelectorAll('.report-block')
        const content = Array.from(contentBlock).filter(v => v.clientHeight) // 对元素高度为0的进行过滤
        const res = await this.expPdf.reportToImgs({
          header,
          content,
          footer
        })
        this.expPdf.addReport(res)
      }
      this.expPdf.fileName = str
      this.expPdf.setPageSize()
      this.expPdf.downLoad()
      loading.close()
    },
    refresh () {
      location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
  .refresh {
    position: relative;
    max-width: 920px;
    margin: 20px auto;
    font-size: 14px;
    text-align: center;
    }
  .btn-wrap {
    position: relative;
    display: flex;
    justify-content: space-between;
    max-width: 920px;
    margin: 30px auto;
    .shuaxin {
      width: 92px;
    }
    .refresh{
      width: 98px;
      height: 42px;
    }
    .thisbtn {
      padding: 0 20px;
      line-height: 40px;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 4px;
      background-color: transparent;
      margin-right: 20px;
    }
  }
  .btn-wrap {
    position: relative;
    max-width: 920px;
    margin: 30px auto;
    .thisbtn {
      padding: 0 20px;
      line-height: 40px;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 4px;
      background-color: transparent;
      margin-right: 20px;
    }
  }
  .res-page {
    min-height: 100vh;
    // height: 100vh;
    padding: 10vh 5vw 0 5vw;
    color: #fff;
    background: linear-gradient(180deg, #32BEC0 0%, #34D3C8 100%);
    overflow: hidden;
    &.pad {
      padding: 0;
      background: #fff;
    }
    .title {
      position: relative;
      margin-bottom: 2vh;
      font-size: 20px;
      z-index: 2;
    }
    .wrap {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-left: .5rem;
      line-height: 2;
      z-index: 2;
      .wrap-in {
        padding-right: 5vw;
      }
    }
  }
  .result-page {
    .r-detail, .r-detail-item {
      margin-top: 2rem;
    }
  }
  .res-page.bg-ball::before {
    top: 50%;
    left: 50%;
    background: linear-gradient(260deg, rgba(255, 255, 255, 0) 0%, #4BDDC6 100%);
    transform: translate(-150%, -50%);
    animation: moveLeft .5s;
  }
  .res-page.bg-ball::after {
    top: 50%;
    right: 50%;
    background: linear-gradient(50deg, rgba(255, 255, 255, 0) 0%, #4BDDC6 100%);
    transform: translate(150%, -50%);
    animation: moveRight .5s;
  }
  @keyframes moveLeft {
    from { transform: translate(-50%, -50%); }
    to { transform: translate(-150%, -50%); }
  }
  @keyframes moveRight {
    from { transform: translate(50%, -50%); }
    to { transform: translate(150%, -50%); }
  }
  .res-wrap {
    position: relative;
    width: 920px;
    margin: 0 auto;
  }
  @media screen and (max-width: 1000px) {
    .res-page {
      padding: 0;
      background: #fff;
    }
    .res-wrap {
      width: 100%;
      font-size: 14px;
    }
  }
</style>

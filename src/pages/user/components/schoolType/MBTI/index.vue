<template>
  <div>
    <div class="report-block">
      <h3>原始得分图</h3>
      <div>
      <div class="score"><span class="leftBox">外向（E）<span class="prencent">{{e}}%</span></span><Progress :rightData="i"></Progress><span class="rightBox"><span class="prencent">{{i}}%</span>（I）&nbsp;内向</span></div>
      <div class="score"><span class="leftBox">实感（S）<span class="prencent">{{s}}%</span></span><Progress :rightData="n"></Progress><span class="rightBox"><span class="prencent">{{n}}%</span>（N）直觉</span></div>
      <div class="score"><span class="leftBox">思考（T）<span class="prencent">{{t}}%</span></span><Progress :rightData="f"></Progress><span class="rightBox"><span class="prencent">{{f}}%</span>（F）&nbsp;情感</span></div>
      <div class="score"><span class="leftBox">判断（J）&nbsp;<span class="prencent">{{j}}%</span></span><Progress :rightData="p"></Progress><span class="rightBox"><span class="prencent">{{p}}%</span>（P）知觉</span></div>
      </div>
      <h3>您的人格类型为：{{MbtiData.personalityType}}</h3>
      <div class="text ">
        <div>
          <h4>人格类型简介</h4>
          <div class="content" style="white-space: pre-line;">
            {{MbtiData.mbtiDetail.introduction}}
          </div>
        </div>
      <div>
        <h4>人格类型详细介绍</h4>
        <div class="content">
          {{MbtiData.mbtiDetail.detail}}
        </div>
      </div>
      </div>
    </div>
    <div class="text report-block">
        <h4>个人发展建议</h4>
        <div class="content">
          {{MbtiData.mbtiDetail.recommend}}
        </div>
    </div>
  </div>
</template>

<script>
import Progress from './progress'
export default {
  name: 'progress',
  components: {
    Progress
  },
  props: {
    report: Object
  },
  data () {
    return {
      e: '',
      i: '',
      s: '',
      n: '',
      t: '',
      f: '',
      j: '',
      p: '',
      MbtiData: {}
    }
  },
  created () {
    this.MbtiData = this.report.detail.mbtiReport
    const data = this.MbtiData.rawScore
    this.e = (data.extrovert / (data.introverted + data.extrovert) * 100).toFixed(1)
    this.i = (data.introverted / (data.introverted + data.extrovert) * 100).toFixed(1)
    this.s = (data.sense / (data.sense + data.nIntuition) * 100).toFixed(1)
    this.n = (data.nIntuition / (data.sense + data.nIntuition) * 100).toFixed(1)
    this.t = (data.thinking / (data.thinking + data.fEmotion) * 100).toFixed(1)
    this.f = (data.fEmotion / (data.thinking + data.fEmotion) * 100).toFixed(1)
    this.j = (data.judgment / (data.perception + data.judgment) * 100).toFixed(1)
    this.p = (data.perception / (data.perception + data.judgment) * 100).toFixed(1)
  }
}
</script>

<style lang="less" scoped>
h3{
  font-size: 14px;
  font-weight: bold;
  height: 14px;
  line-height: 14px;
  padding-bottom: 26px;
  padding-top: 20px;
}
.score{
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  margin-left: 30px;
  span{
    font-size: 14px;
    color: #000000;
    white-space: nowrap;
  }
  .prencent{
    font-size: 14px;
    color: #8C8C8C;
    display: inline-block;
    width: 40px;
  }
  .leftBox{
    margin-left: 20px;
    display: inline-block;
    .prencent{
      margin-right: 5px;
    }
  }
  .rightBox{
    margin-right: 20px;
    display: inline-block;
    .prencent{
      margin-left: 5px;
    }
  }
}
// .score:nth-of-type(4) .leftBox{
//   margin-left: 22px;
// }
.text{
  border: 1px solid rgba(0, 0, 0, 0.09019607843137255);
  width: 100%;
  border-radius: 4px;
  h4{
    height: 30px;
    line-height: 30px;
    padding: 0 16px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    background: rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid rgba(0, 0, 0, 0.09019607843137255);
    border-top: 1px solid rgba(0, 0, 0, 0.09019607843137255);
    margin: 0;
  }
  h4:first-child{
    border-top: 0;
  }
  .content{
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 20px;
    padding: 12px 16px;
  }
}
@media screen and (max-width: 576px) {
  h3:first-child{
    padding-bottom: 30px;
  }
  .score{
    position: relative;
    padding-bottom: 24px;
    margin-left: 0;
    .leftBox{
      position: absolute;
      top: -20px;
      transform: translateX(-50%);
      left: 33%;
      margin: 0 !important;
      .prencent{
        float: left;
      }
    }
    .rightBox{
      position: absolute;
      top: -20px;
      transform: translateX(-50%);
      left: 65%;
      margin: 0 !important;
      .prencent{
        float: right;
        margin-right: -8px;
      }
    }
  }
}

</style>

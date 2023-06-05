<template>
  <div>
    <div class="score-bar-container">
      <div class="score-bar-item" v-for="item in data" :key="item.index" :style="{width: (item.maxScore - item.minScore) * width + 'px'}">
        <div class="score-bar-name">
          <span>{{item.minScore}}</span>
          <span>{{item.maxScore}}</span>
        </div>
        <div class="score-bar-value" v-if="score >= item.minScore &&  score <= item.maxScore">
          <div>
            <img class="xuxian" src="@/assets/img/test/xuxian.png" alt="xuxian">
            <span class="sanjiao"></span>
          </div>
          <div class="tip"><span>{{score}}分：</span><span>{{name}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: 0,
      mobile: ''
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    score: String,
    name: String,
    scoreIndex: Number
  },
  mounted () {
    this.mobile = window.matchMedia('(max-width: 500px)').matches
    const valueLeft = document.querySelectorAll('.score-bar-value')
    // const content = document.querySelector('.score-bar-container')
    const contentWidth = 600 - (this.data.length - 1) * 10
    const count = this.data.reduce((pre, cur) => {
      return pre + (cur.maxScore - cur.minScore)
    }, 0)
    this.width = parseInt(contentWidth / count)
    this.data.forEach((item, index) => {
      if (this.score >= item.minScore && this.score <= item.maxScore) {
        if ((this.score - item.minScore) * 10 >= 260) {
          valueLeft[this.scoreIndex].style.left = '260px'
        } else {
          console.log(this.score, item.minScore, (this.score - item.minScore) * this.width)
          valueLeft[this.scoreIndex].style.left = ((this.score - item.minScore) * this.width) + 'px'
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>

.score-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 145px;
  .score-bar-item{
    background: #D6F1F1;
    margin-right: 10px;
    position: relative;
    height: 60px;
    min-width: 20px;
    max-width: 260px;
    flex-shrink: 0;
    .score-bar-name{
      position: absolute;
      width: 100%;
      left: 0;
      top: -20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #333636;
    }
    .score-bar-value{
      position: absolute;
      left: 0;
      top: 0;
      font-size: 12px;
      color: #34B7B9;
      .xuxian{
        width: 1px;
        height: 70px;
        display: block;
      }
      .sanjiao{
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #34B7B9;
        border-radius: 2px;
        position: relative;
        top: -16px;
        left: -5.5px;
      }
      .tip{
        display: flex;
        font-weight: 600;
        margin-top: -10px;
        margin-left: -5px;
        width: 160px;
        span:nth-child(1){
          white-space: nowrap;
        }
        span:nth-child(2){
          white-space: normal;
        }
      }
    }
  }
  .score-bar-item:last-child{
    margin-right: 0;
  }
}
@media screen and (max-width: 576px) {
  .score-bar-container{
    overflow-x: auto;
    justify-content:flex-start;
    height: 170px;
    .tip{
      span{
        font-size: 12px;
      }
    }
  }
}
</style>

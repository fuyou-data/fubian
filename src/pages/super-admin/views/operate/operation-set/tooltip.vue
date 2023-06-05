<template>
 <el-popover
    placement="bottom-start"
    popper-class="boxClass"
    trigger="hover">
    <table v-if="index==3">
          <tr><td>题目</td><td>答案</td></tr>
          <tr v-for="item in tip1" :key="item"><td>{{item[0]}}</td><td>{{item[1]}}</td></tr>
    </table>
    <table v-if="index==4" class="table2">
      <tr><td>因子</td><td>分数</td><td>参考分范围</td><td>测评结果</td></tr>
      <tr v-for="item in tip2" :key="item"><td>{{item[0]}}</td><td>{{item[1]}}</td><td>{{item[2]}}</td><td style="text-align: left;width:500px">{{item[3]}}</td></tr>
    </table>
    <div v-if="index==5" class="imgBox">
      <img src="@/assets/img/yinzireport.png" alt="失败">
    </div>
    <div v-if="index==3 || index==4 || index==5" class="my-div" slot="reference"><span class="my-btn" size="mini">?</span></div>
  </el-popover>
</template>

<script>
export default {
  name: 'tooltip',
  data () {
    return {
      tip1: [
        ['1.过去一个月你通常上床睡觉的时间是?（请按24小时制填写）', '上床睡觉的时间是23点00分'],
        ['2.过去一个月你每晚通常要多长时间(分钟)才能入睡?', '小于15分钟'],
        ['3.过去一个月每天早上通常什么时候起床? （请按24小时制填写）', '起床时间7点10分'],
        ['4.过去一个月你每晚实际睡眠的时间有多少?', '每晚实际睡眠的时间7小时30分钟'],
        ['5.过去一个月你是否因为不能在30分钟内入睡，而经常睡眠不好？', '每周平均不足一个晚上']
      ],
      tip2: [
        ['躯体化', '2', '0-8', '中'],
        ['强迫状态', '1.8', '0-6', '轻'],
        ['人际关系敏感', '1.6', '0-5', '轻'],
        ['抑郁', '2.8', '0-6', '重'],
        ['焦虑', '1.9', '0-4', '轻']
      ]
    }
  },
  props: {
    index: Number
  }
}
</script>

<style lang="less" scoped>
.boxClass{
  min-width: 680px;
}
.my-div{
  position: relative;
  display: inline-block;
  top: 1px;
  left: 2px;
}
.my-btn{
  display: inline-block;
  width: 14px;
  height: 14px;
  text-align: center;
  line-height: 14px;
  border-radius: 50%;
  color:#34B7B9 ;
  border:1px solid  #34B7B9;
}
table{
  min-width: 650px;
  margin: 5px;
  border-top:1px solid #707070 ;
  border-left:1px solid #707070 ;
  tr{
    height: 24px;
    td{
      padding-left: 10px;
      border-right:1px solid #707070 ;
      border-bottom:1px solid #707070 ;
    }
  }
  tr:first-child{
    background-color: #D6E2EE;
    height: 32px;
    td{
      text-align: center;
      line-height: 32px;
    }
  }
}
.table2{
  width: 750px;
  tr{
    td{
      text-align: center;
      min-height: 24px;
      line-height: 24px;
      padding: 0 5px;
    }
  }
}
.imgBox{
  width: 589px;
  height: 274px;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>

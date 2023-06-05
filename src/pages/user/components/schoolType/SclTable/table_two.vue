<template>
  <div class="table-two mb-0">
    <table border="1" :class="{space: flag}" id="tab">
      <tr class="head report-block">
        <td>因子</td>
        <td>原始分</td>
        <td>均分</td>
        <td>诊断程度</td>
        <td>均分±标准差</td>
        <td>说明</td>
      </tr>
      <tr class="report-block" v-for="(it, index) in tableData" :key="index">
        <td>{{it.factor}}</td>
        <td>{{it.totalScore}}</td>
        <td>{{it.meanScore}}</td>
        <td>{{it.level}}</td>
        <td>{{tableArr[index]}}</td>
        <td class="small-td"> <p>{{it.comment}}</p> </td>
      </tr>
    </table>
    <div class="report-block table-border-bottom"></div>
  </div>
</template>

<script>
export default {
  name: 'SclTableTwo',
  props: {
    tableData: Array
  },
  data () {
    return {
      tableArr: ['1.37±0.48', '1.62±0.58', '1.65±0.51', '1.50±0.59', '1.39±0.43', '1.48±0.56', '1.23±0.41', '1.43±0.57', '1.29±0.42'],
      mobile: false,
      flag: true
      // startx: '',
      // starty: '',
      // endx: '',
      // endy: ''
    }
  },
  watch: {
    mobile (neValue) {
      if (neValue) {
        this.flag = false
      } else {
        this.flag = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.table-border-bottom {
  height: 20px;
  margin-top: -1px;
  border-top: 1px solid #000;
}
table {
  text-align: center;
  line-height: 2;
  width: 100%;
  tr{
    display: flex;
    flex: 24;
    // td{
    //   padding: 0 1.5rem;
    // }
    td:nth-child(1){
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 60px;
      flex: 3;
    }
    td:nth-child(2){
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 2;
      min-width: 50px;
    }
    td:nth-child(3){
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 45px;
      flex: 2;
    }
    td:nth-child(4){
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 100px;
      flex: 2;
    }
    td:nth-child(5){
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
      flex: 3;
    }
    td:nth-child(6){
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 200px;
      flex: 12;
    }
  }
  .head{
    font-weight: bold;
    background-color: #D6E2EE;
  }
  td {
    padding: 7px 5px;
    p{
      line-height: 1.5;
    }
    // 1rem
  // line-height: 2;
  }
  .small-td{
    // padding: 0 0.5rem;
    text-align: left;
    p{
      margin-bottom: 0;
    }
  }
}
@media screen and (max-width: 1000px) {
  table {
    font-size: 12px;
    width: 100%;
  }
  td {
    padding: 1vw;
  }
}
</style>

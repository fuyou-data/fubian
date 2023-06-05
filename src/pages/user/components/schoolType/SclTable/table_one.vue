<template>
  <table border="1">
    <tr class="head">
      <td class="bgc-color">结果</td>
      <td class="bgc-color">原始分</td>
      <td class="bgc-color">均分±标准差</td>
    </tr>
    <tr v-for="(it, index) in tableData" :key="index">
      <td class="bgc-color">{{it.name}}</td>
      <td >{{it.score}}</td>
      <td>{{tableArr[index]}}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'SclTableOne',
  props: {
    tableData: Array
  },
  data () {
    return {
      tableArr: ['129.96±38.76', '1.44±0.43', '65.08±18.33', '24.92±18.41', '2.60±0.59']
    }
  }
}
</script>

<style lang="less" scoped>
table {
  text-align: center;
  line-height: 2;
  width: 100%;
  tr{
    display: flex;
    td{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    td:nth-child(1){
      flex: 3;
    }
    td:nth-child(2){
      flex: 2;
    }
    td:nth-child(3){
      flex: 3;
    }
  }
  .head{
    font-weight: bold;
  }
  // td {
    // padding: 5px 1rem;
  // line-height: 2;
  // }
  .bgc-color{
    background-color: #D6E2EE;
  }
}
// @media screen and (max-width: 1000px) {
//   table {
//     font-size: 12px;
//     width: 100%;
//   }
//   td {
//     padding: 1vw;
//   }
// }
</style>

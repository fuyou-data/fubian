<template>
  <table border="1">
    <!-- <tr>
      <th v-for="(th, index) in tableH" :key="th" :style="{ width: tableW(index) }">{{th}}</th>
    </tr> -->
    <!-- <tr v-for="tr in tableR" :key="tr">
      <td v-for="td in tr" :key="td">{{td}}</td>
    </tr> -->
    <tr class="head">
      <td>序号</td>
      <td>项目</td>
      <td>分数</td>
    </tr>
    <tr v-for="(it, index) in tableData" :key="index">
      <td>{{it.index}}</td>
      <td class="pos-left">{{it.topic}}</td>
      <td>{{it.score}}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'PhqTable',
  props: {
    tableData: Array
  },
  data () {
    return {
      tableArr: []
    }
  },
  computed: {
    tableH () {
      return this.tableArr[0]
    },
    tableR () {
      return this.tableArr.slice(1)
    },
    tableW () {
      return index => {
        return this.tableR[0][index] && this.tableR[0][index].length > 20 ? '300px' : 'auto'
      }
    }
  },
  created () {
    // this.tableArr = this.tableData.map(item => {
    //   return item.split(',')
    // })
  }
}
</script>

<style lang="less" scoped>
table {
  text-align: center;
  line-height: 2;
  .head{
    font-weight: bold;
    background-color: #d6e2ee;
  }
  td {
    padding: 0 1.5rem;
  // line-height: 2;
  }
  .pos-left{
    text-align: left;
  }
}
@media screen and (max-width: 500px) {
  table {
    font-size: 12px;
    width: 100%;
    td {
      padding: 0 .5rem;
    }
  }
}
</style>

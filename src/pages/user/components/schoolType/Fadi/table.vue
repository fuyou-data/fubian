<template>
<div class="container">
  <!-- 上面文案 -->
  <table border="1">
    <tr>
      <th style="width: 15%;">因子</th>
      <th style="width: 15%;">项目序号</th>
      <th style="width: 25%;">项目</th>
      <th style="width: 15%;">得分</th>
      <th style="width: 15%;">因子分</th>
      <th style="width: 15%;">总分</th>
    </tr>
    <!-- 内容 -->
    <tr v-for="(row, index) in formatArr" :key="index">
      <td
        v-if="row.factor !== ''"
        :rowspan="row.rows"
      >
        {{ row.factor }}
      </td>
      <td>{{ row.index }}</td>
      <td>{{ row.topic }}</td>
      <td>{{ row.score }}</td>
      <td
        v-if="row.meanScore !== ''"
        :rowspan="row.rows"
      >
        {{ row.meanScore }}
      </td>
      <td
        v-if="row.totals !== ''"
        :rowspan="formatArr.length"
      >
        {{ row.totals }}
      </td>
    </tr>
  </table>
</div>
</template>

<script>
export default {
  name: 'HamdTable',
  props: {
    tableData: Array,
    totalScore: Number
  },
  data () {
    return {
      formatArr: [],
      lengArr: []
    }
  },
  created () {
    // console.log('%c%s', 'color:purple', '输出结果 :', this.tableData)
    this.lengArr = this.tableData.map(v => v.topicScores.length)
    const resArr = []
    this.lengArr.forEach((len, index) => {
      let curLen = 0
      const { comment, factor, level, meanScore, topicScores } = this.tableData[index]
      while (curLen < len) {
        const obj = { comment, level, ...topicScores[curLen] }
        obj.factor = curLen ? '' : factor
        obj.meanScore = curLen ? '' : meanScore
        obj.totals = !index && !curLen ? this.totalScore : ''
        obj.rows = len
        resArr.push(obj)
        curLen++
      }
    })
    this.formatArr = resArr
  }
}
</script>

<style lang="less" scoped>
.container{
  padding: 0;
  table {
    width: 100%;
    th {
      height: 21px;
      text-align: center;
      background-color: #D6E2EE;
      border-color: #000;
    }
    td {
      height: 21px;
      text-align: center;
      border-color: #000;
    }
  }
}
@media screen and (max-width: 500px) {
  .container {
    table {
      th {
        background-color: #fff;
      }
      td {
        padding: 0 .5rem;
      }
    }
  }
}
</style>

<template>
  <table class="main-table " border="1">
    <thead class="report-block">
      <tr class="head">
        <th v-for="(item, index) in propsArray" :key="index">{{ item.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(it, inx) in data" :key="index + '-' + inx" class="report-block">
        <td v-for="(item, oinx) in propsArray" :key="oinx + 'td' + inx" :style="item.textCenter ? 'text-align: center' : ''" v-html="it[item.prop]"></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'PhqTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    propsArray: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
    // console.log(this.data)
    // console.log('%c%s', 'color:purple', '输出结果 :', this.propsArray)
  }
}
</script>

<style lang="less" scoped>
.main-table {
  width: 100%;
}
.main-table th {
  font-weight: 700;
  text-align: center;
  background-color: #D6E2EE;
}
tr{
    th:nth-child(1){
      min-width: 50px;
    }
    th:nth-child(2){
      min-width: 50px;
    }
    th:nth-child(3){
      min-width: 50px;
    }
    td:nth-child(1){
      min-width: 50px;
    }
    td:nth-child(2){
      min-width: 50px;
    }
    td:nth-child(3){
      min-width: 50px;
    }
  }
</style>

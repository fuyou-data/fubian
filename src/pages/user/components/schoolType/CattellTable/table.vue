<template>
  <table class="main-table" border="1">
    <colgroup>
      <col v-for="item in propsArray.length" :key="item + 'col'" style="min-width: 5rem;"/>
    </colgroup>
    <thead>
      <tr class="head">
        <th v-for="item in propsArray" :key="item.label">{{ item.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="it in data" :key="it">
        <td v-for="item in propsArray" :key="item + 'td'" :style="item.textCenter ? 'text-align: center' : ''" v-html="it[item.prop]"></td>
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
</style>

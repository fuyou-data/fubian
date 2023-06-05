<template>
  <table class="main-table " border="1">
    <colgroup>
      <col v-for="item in propsArray.length" :key="item + 'col'" :style="{
        minWidth: setMinWidth(propsArray[item - 1]),
        width: width(propsArray[item - 1].minWidth)
      }"/>
    </colgroup>
    <thead>
      <tr class="head">
        <th v-for="item in propsArray" :key="item.label">{{ item.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(it, index) in data" :key="index">
        <td v-for="item in propsArray" :key="it[item.prop]" :style="item.textCenter ? 'text-align: center' : ''" v-html="it[item.prop]"></td>
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
  computed: {
  },
  methods: {
    setMinWidth (item) {
      return item.minWidth || '5rem'
    },
    width (e) {
      if (document.documentElement.clientWidth < 768) {
        return e
      } else {
        return 'auto'
      }
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
  font-size: 14px;
}
</style>

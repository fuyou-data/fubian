<template>
  <div class="organ">
    <!-- <organ-search @reset="reset" @search="search" :searchForm="searchForm"></organ-search> -->
    <organ-table @handleQuery="query" :tableData="tableData" @changeSize="changeSize" :pager="pager"></organ-table>
  </div>
</template>

<script>
// import OrganSearch from './organ-search.vue'
import OrganTable from './organ-table.vue'
import { getOrgList } from '@/api/modules/organ'

export default {
  name: 'organ',
  components: {
    // OrganSearch,
    OrganTable
  },
  data () {
    return {
      pager: {
        page: 1,
        pageSize: 10,
        totalRow: 0
      },
      tableData: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query () {
      getOrgList({
        page: this.pager.page,
        pageSize: this.pager.pageSize
      }).then(({ data = {} }) => {
        this.tableData = data.orgs
        this.pager = data.pager
      }).catch(err => {
        console.log(err)
      })
    },
    changeSize (p) {
      this.pager.page = p
      this.query()
    }
  }
}
</script>

<style lang="less" scoped>
.organ{
  padding-top: 40px;
}
</style>

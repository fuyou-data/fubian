<template>
  <div class="search-wrap">
    <div class="title">查询</div>
    <el-form class="search-form" :model="searchForm" ref="searchForm" label-width="90px" size="mini" inline>
      <el-form-item class="search-form-item" label="部门名称：">
        <el-input v-model="searchForm.orgName" placeholder="请输入部门名称" clearable></el-input>
      </el-form-item>
      <el-form-item class="search-btn-wrap">
        <el-button @click="query()" type="success" size="mini" >查询</el-button>
        <el-button @click="reset()" :disabled="!hasQuery" size="mini" plain>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'OrganSearch',
  props: {
    searchForm: Object
  },
  data () {
    return {
    }
  },
  computed: {
    hasQuery () {
      const { orgName, orgType } = this.searchForm
      if (orgName !== '') return true
      if (orgType !== '') return true
      return false
    }
  },
  methods: {
    query () {
      this.$emit('search')
    },
    reset () {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="less" scoped>
.search-wrap {
  padding: 2rem 3rem 0;
  .title {
    font-size: 24px;
    color: #34B7B9;
  }
}
.search-form {
  position: relative;
  margin: 1rem 0;
  .search-form-item {
    padding-right: 2rem;
    &:nth-child(2) {
      margin-right: 122px;
    }
  }
  .search-btn-wrap {
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 0;
  }
}
</style>

<style>
.el-form-item__label {
  text-align: left;
}
</style>

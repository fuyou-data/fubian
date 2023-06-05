<template>
  <div>
    <tree-transfer
      ref="tree"
      :title="title"
      :from_data="formData"
      :to_data="toData"
      :pid="'pid'"
      :node_key="'id'"
      placeholder="请输入搜索内容"
      @addBtn="add"
      @removeBtn="remove"
      @right-check-change="rightChecked"
      height='350px'
      width="800px"
      filter
      openAll>
  </tree-transfer>
  </div>
</template>

<script>
import treeTransfer from 'el-tree-transfer'
export default {
  name: 'TreeTransfer',
  components: {
    treeTransfer
  },
  props: {
    title: {
      type: Array
    },
    formData: {
      type: Array
    },
    toData: {
      type: Array
    }
  },
  data () {
    return {
      selectData: [],
      dataValue: []
    }
  },
  methods: {
    // 监听穿梭框组件添加
    add (fromData, toData, obj) {
    // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象
      this.$refs.tree.clearChecked('right')
      this.$refs.tree.filterTo = ''
      this.$refs.tree.to_disabled = true
      this.selectData = [...this.selectData, ...obj.nodes]
      this.getTableList(this.selectData)
    },
    // 监听穿梭框组件移除
    remove (fromData, toData, obj) {
      this.$refs.tree.filterFrom = ''
      const set = obj.nodes.map(item => item.id)
      this.selectData = this.selectData.filter(item => !set.includes(item.id))
      const list = this.selectData.filter(item => !set.includes(item.id))
      this.getTableList(list)
    },
    // 右侧选中
    rightChecked (nodeObj, treeObj, checkAll) {
      // this.$refs.tree.setChecked(leftKeys = [], rightKeys = [])
      // console.log(this.$refs.tree.getChecked(), '选中')
    },
    getTableList (list) {
      // const list = this.$refs.tree.getChecked().rightNodes
      const tableList = list.filter(v => {
        return !v.children
      })
      this.dataValue = tableList.map(v => {
        return v.id
      })
      const dataName = tableList.map(v => {
        return v.tableEnName
      })
      this.$emit('getTransValue', this.dataValue, dataName)
    }
  }
}
</script>

<style>

</style>

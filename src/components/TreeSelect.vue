<template>
  <div class="main">
    <div class="left">
      <div class="header">
        <el-checkbox v-model="checkAll" @change="checkAllChange" :disabled="checkAll || isH5 || leftText !== ''">全选</el-checkbox>
      </div>
      <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="leftText" @input="emptyChange"></el-input>
      <el-tree
        class="filter-tree"
        ref="leftTree"
        :data="leftFormData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :filter-node-method="leftFilterNode"
        @check-change="handleCheckChageFun"
        @check="checkHanldle"
      >
      </el-tree>
    </div>
    <div class="left right" v-if="rightFormData && rightFormData.length">
      <div class="header">
        <el-button type="primary" class="btn-normal" size="mini" @click="deleteAll">全部删除</el-button>
      </div>
      <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="rightText"></el-input>
      <el-tree
        class="filter-tree"
        ref="rightTree"
        :data="rightFormData"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :filter-node-method="rightFilterNode"
      >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i class="el-icon-close" @click="() => remove(node, data)"></i>
        </span>
        <span>{{ node.label }}</span>
      </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeSelect',
  props: {
    leftFormData: Array, // 获取左侧树的数据
    isChangeData: { // 是否过滤掉AI心理测评
      type: Boolean,
      default: false
    },
    isH5: { // 是否过滤掉AI心理测评
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      checkAll: false,
      leftText: '',
      rightText: '',
      rightFormData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    leftText (val) {
      this.$refs.leftTree.filter(val)
    },
    rightText (val) {
      this.$refs.rightTree.filter(val)
    },
    rightFormData (val, old) {
      const value = this.$refs.leftTree.getCheckedKeys(true)
      const tableEnName = this.$refs.leftTree.getCheckedNodes(true, true).map(v => v.tableEnName)
      this.$emit('getTransValue', value, tableEnName)
    },
    isChangeData (val, old) {
      // console.log(val)
      this.leftText = ''
      this.rightText = ''
    }
  },
  mounted () {
  },
  methods: {
    leftFilterNode (value, data) {
      if (!value) return true
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    rightFilterNode (value, data) {
      if (!value) return true
      return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    // 全选
    checkAllChange () {
      if (this.checkAll) {
        this.leftFormData.forEach(v => {
          if (v.children && v.children.length > 0) {
            v.children.forEach(item => {
              this.$refs.leftTree.setChecked(item, false)
            })
          }
          this.$refs.leftTree.setChecked(v, false, true)
        })
        this.$nextTick(() => {
          this.$refs.leftTree.setCheckedNodes(this.leftFormData)
        })
        if (!this.leftText) {
          this.$nextTick(() => {
            this.rightFormData = JSON.parse(JSON.stringify(this.leftFormData))
          })
        } else {
          this.$nextTick(() => {
            this.filterData()
          })
        }
        // this.
      } else { // 取消选中
        this.$nextTick(() => {
          this.$refs.leftTree.setCheckedKeys([])
        })
      }
    },
    // 右侧全部删除
    deleteAll () {
      this.$nextTick(() => {
        this.rightFormData = []
        if (this.$refs.leftTree) {
          this.$refs.leftTree.setCheckedKeys([])
          this.leftFormData.forEach(e => {
            e.disabled = false
            e.children.forEach(it => {
              it.disabled = false
            })
          })
        }
        this.checkAll = false
        this.rightText = ''
      })
    },
    setCheckedKeys (auth) {
      this.$refs.leftTree.setCheckedKeys(auth)
      this.leftFormData.forEach((item, index) => {
        item.disabled = false
        if (item.children && item.children.length > 0) {
          item.children.forEach((v, i) => {
            v.disabled = false
          })
        }
      })
    },
    // 过滤出来的数据
    filterData () {
      const checkKeys = this.$refs.leftTree.getCheckedKeys(true)
      checkKeys.forEach((i, n) => {
        var node = this.$refs.leftTree.getNode(i)
        if (!node.visible && !node.checked) { // 过滤隐藏and选中的节点。设置为false 你大爷，已经选中你怎么敢设置false的
          this.$refs.leftTree.setChecked(i, false)
        }
      })
      const checkedNodes = this.$refs.leftTree.getCheckedNodes(true, true)
      checkedNodes.forEach(el => {
        const { parent } = this.$refs.leftTree.getNode(el)
        const children1 = []
        setTimeout(() => {
          parent.data.children.forEach((v, i) => {
            if (v.disabled) {
              children1.push(v)
            }
          })
        }, 1)
        const parentData = JSON.parse(JSON.stringify(parent.data))
        parentData.children = children1
        const i = this.rightFormData.findIndex(v => v.id === parent.data.id)
        if (i !== -1) {
          if (children1) {
            this.rightFormData[i].children = children1
          }
        } else {
          this.rightFormData.push(parentData)
        }
        this.rightFormData.sort((a, b) => { return Number(a.id) - Number(b.id) })
      })
    },
    // 右侧删除单个
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      if (children.length === 0) {
        this.$refs.rightTree.remove(parent.data)
      }
      this.leftFormData.forEach(item => {
        if (data.id === item.id) {
          item.disabled = false
          if (item.children && item.children.length > 0) {
            item.children.forEach(v => {
              v.disabled = false
            })
          }
        } else {
          item.disabled = false
          if (item.children && item.children.length > 0) {
            item.children.forEach(v => {
              if (v.id === data.id) {
                v.disabled = false
              }
            })
          }
        }
      })
      this.$refs.leftTree.setChecked(data, false, true)
      this.$forceUpdate()
      // console.log(this.leftFormData, '右侧移除')
      // console.log(this.$refs.leftTree.getCheckedNodes(true, true))
      this.dataChange(this.$refs.leftTree.getCheckedNodes(true, true))
    },
    // 左侧勾选右侧变化
    dataChange (checkedNodes) {
      checkedNodes.forEach(el => {
        // 是父节点
        if (el.children) {
          const flag = el.children.some(v => v.disabled)
          if (!flag) {
            this.rightFormData.push(el)
          }
        } else {
          // 是子节点
          const { parent } = this.$refs.leftTree.getNode(el)
          let childrenList = []
          if (parent) {
            childrenList = parent.data.children.filter((v, i) => {
              return v.disabled
            })
          }
          // 右侧放入父节点以及子节点
          const parentData = JSON.parse(JSON.stringify(parent.data))
          parentData.children = childrenList
          const i = this.rightFormData.findIndex(v => v.id === parent.data.id)
          if (i !== -1) {
            if (childrenList) {
              this.rightFormData[i].children = childrenList
            }
          } else {
            this.rightFormData.push(parentData)
          }
          this.rightFormData.sort((a, b) => { return Number(a.id) - Number(b.id) })
        }
      })
    },
    // 父节点处理
    checkFather (el, obj) {
      const { parent } = this.$refs.leftTree.getNode(obj)
      const children1 = parent.data.children.filter(v => v.id === el.id)
      const parentData = JSON.parse(JSON.stringify(parent.data))
      parentData.children = children1
      this.rightFormData = [parentData]
    },
    // 点击左侧复选框 并 处理禁选
    checkHanldle (dataNode, nodeList) {
      const checkedNodes = nodeList.checkedNodes
      if (this.isH5) {
        let obj = {}
        if (checkedNodes.length > 1) {
          obj = checkedNodes[1]
        } else {
          obj = checkedNodes[0]
        }
        if (obj.children && obj.children.length > 0) {
          this.checkFather(dataNode, obj)
        } else {
          this.checkFather(obj, obj)
        }
      } else {
        this.rightFormData.forEach((v, i) => {
          v.children.forEach((el, il) => {
            this.leftFormData[i].children.forEach((item, index) => {
              if (el.id === item.id) {
                this.leftFormData[i].children[index].disabled = true
              }
            })
          })
        })
        this.dataChange(checkedNodes)
        this.$nextTick(() => {
          this.filterData()
        })
      }
    },
    // 处理禁选 状态处理
    handleCheckChageFun (data, checked) {
      // if (this.leftText !== '') {
      //   const checkKeys = this.$refs.leftTree.getCheckedKeys()
      //   checkKeys.forEach((i, n) => {
      //     const node = this.$refs.leftTree.getNode(i)
      //     if (!node.visble ){
      //     }
      //   })
      // }
      if (this.isH5) {
        if (checked) {
          this.$refs.leftTree.setCheckedKeys([data.id], false)
          data.disabled = true
        } else {
          data.disabled = false
        }
      } else {
        this.leftFormData.forEach((item, index) => {
          if (checked) {
            if (data.id === item.id) {
              item.disabled = true
              if (item.children && item.children.length > 0) {
                item.children.forEach(v => {
                  v.disabled = true
                })
              }
            } else {
              item.disabled = false
              if (item.children && item.children.length > 0) {
                item.children.forEach(v => {
                  if (v.id === data.id) {
                    var node = this.$refs.leftTree.getNode(v.id)
                    if (!node.visible) {
                      this.$refs.leftTree.setChecked(v.id, false)
                    } else {
                      v.disabled = true
                    }
                  }
                })
                item.disabled = item.children.every(v => v.disabled)
              }
            }
          } else {
            if (data.id === item.id) {
              item.disabled = false
              // if (item.children && item.children.length > 0) {
              //   item.children.forEach((v, i) => {
              //     v.disabled = false
              //   })
              // }
            } else {
              item.disabled = false
              if (item.children && item.children.length > 0) {
                item.children.forEach((v, i) => {
                  if (v.id === data.id) {
                    v.disabled = false
                  }
                })
              }
            }
          }
        })
      }
      const flag = this.leftFormData.every(v => v.disabled)
      if (flag) {
        this.checkAll = true
      } else {
        this.checkAll = false
      }
    },
    // 清除右侧数据
    clearList () {
      this.rightFormData = []
    },
    emptyChange () {
      // console.log(this.leftFormData)
      this.leftFormData.forEach(e => {
        e.disabled = e.children.every(v => v.disabled)
        // e.children.forEach(it => {
        // var node = this.$refs.leftTree.getNode(it.id)
        // console.log(node)
        // })
      })
    }

  }
}
</script>

<style lang="less" scoped>
.main{
  display: flex;
  justify-content: space-between;
  .left{
    width: 377px;
    border: 1px solid #EEEEEE;
    /deep/.el-checkbox {
      margin-bottom: 0;
    }
    /deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
      background: #FAFAFA;
      border: 1px solid #D6D9D9;
    }
    .header{
      height: 41px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #EEEEEE;
      padding: 0 16px;
    }
    /deep/.el-input{
      width: 345px;
      margin: 10px 16px;
      background: #F9F9F9;
      .el-input__icon{
        line-height: 32px;
      }
      .el-input__inner{
        background: #F9F9F9;
        height: 32px;
        border-radius: 2px 2px 2px 2px;
        border: 0;
      }
    }
    .filter-tree{
      padding: 0 16px;
      min-height: 220px;
      max-height: 320px;
      overflow: auto;
      .el-icon-close{
        width: 14px;
        height: 14px;
        background: #FF4D4F;
        border-radius: 2px;
        color: #fff;
        font-size: 8px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-right: 5px;
      }
    }
  }
  .right{
    border-left: 0;
  }
}
</style>

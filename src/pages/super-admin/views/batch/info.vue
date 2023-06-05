<template>
  <div class="batch-edit">
    <el-form ref="form" :model="form" :rules="rules" size="small">
      <p class="module-title">基础信息设置</p>
      <el-form-item prop="name" label="批次名称：">
        <el-input v-model="form.name" maxLength="10"  placeholder="请输入批次名称" style="width:194px"></el-input>
        <span style="color:#999;font-size:12px;margin-left:10px">(支持中英文及数字，最多10位)</span>
      </el-form-item>
      <el-form-item v-if="$route.query.id" label="批次号：">
        <span class="orgLen">{{ $route.query.id }}</span>
      </el-form-item>
      <!-- <el-form-item label="关联部门：" prop="orgId">
        <el-select
          v-model="form.orgId"
          placeholder="请选择部门"
          :disabled="curRoute === 'edit'"
          @change="selectOrg"
        >
          <el-option
            :value="organ.orgID"
            :label="organ.orgName"
            v-for="organ in orgs"
            :key="organ.orgID"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <p class="module-title">检查项目配置</p>
      <!-- <el-form-item prop="configFixed">
        <span class="sub-title">量表配置方式：</span>
        <el-radio-group v-model="form.configFixed"  :disabled="curRoute === 'edit'">
          <el-radio :label="1">固定配置</el-radio>
          <el-radio :label="-1">非固定配置</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item style="max-width: 755px;">
        <p class="sub-title">自评量表</p>
        <!-- <div class="selected">
          <span style="margin-left: 16px;white-space: nowrap;">已选：</span>
          <div style="width:75%">
            <span class="selcSpan" v-for="(item, index) in selfTablesName" :key="item.index">{{item.tableName}}
              <i
                class="el-icon-close delIcon"
                v-if="curRoute !== 'edit'"
                @click="deleteSelf(item, index)"
              >
              </i>
            </span>
          </div>
        </div> -->
        <TreeSelect
          ref="treeTransfer"
          v-if="curRoute !== 'edit'"
          :leftFormData="selfTablesOfTree"
          :isH5="false"
          @getTransValue="getTransValue">
        </TreeSelect>
        <el-tree v-else :data="toDataTree" default-expand-all></el-tree>
      </el-form-item>
      <el-form-item>
        <p class="sub-title">他评量表：</p>
        <el-checkbox-group v-model="otherTables" :disabled="curRoute === 'edit'">
          <el-checkbox v-for="item in allTableTa" :key="item.index" :label="item.tableCode" :disabled="item.flag">{{item.tableName}}<span style="color:#979A9A;margin-left:5px"  v-if="item.tableCode === 'FADI'">（hamd和hama的整合升级版）</span></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop="reportDisplayEnabled">
        <span class="sub-title">报告是否展示给用户：</span>
        <el-radio-group v-model="form.reportDisplayEnabled" :disabled="curRoute === 'edit'">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="-1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="text-center">
        <el-button size="medium" plain @click="$router.go(-1)">取消</el-button>
        <el-button
          v-if="curRoute === 'edit'"
          type="success"
          size="medium"
          @click="updateSubmit"
        >
          完成
        </el-button>
        <el-button
          v-else
          type="success"
          size="medium"
          @click="createSubmit"
        >
          完成
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createBatch, updateBatch, batchInfo, getAllTable, addName } from '@/api/modules/batch'
import { getOrgList } from '@/api/modules/organ'
import TreeSelect from '@/components/TreeSelect'
export default {
  name: 'info',
  components: {
    TreeSelect
  },
  data () {
    const batchNameValidate = (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}$/
      if (value === '') {
        callback(new Error('请输入批次名称'))
      } else if (!reg.test(value)) {
        callback(new Error('名称格式不正确'))
      } else {
        const batchName = this.form.name
        const batchId = this.$route.params.id || this.$route.query.id
        if (batchId && this.curRoute === 'edit') {
          const data = { batchName, batchId }
          addName(data).then(res => {
            callback()
          }).catch(err => {
            if (err.code === 1203) {
              callback(new Error('批次名称已存在'))
            } else {
              callback()
            }
          })
        } else {
          const data = { batchName }
          addName(data).then(res => {
            callback()
          }).catch(err => {
            if (err.code === 1203) {
              callback(new Error('批次名称已存在'))
            } else {
              callback()
            }
          })
        }
      }
    }
    return {
      id: '',
      orgs: [],
      allTable: [], // 全部自评量表
      allTableTa: [], // 全部他评量表
      orgType: '',
      otherTables: [],
      selfTables: [], // 已选量表的TableCode
      selfTablesName: [], // 已选量表名称
      selctSelfTable: [], // 筛选的自评量表
      isChecked: false,
      form: {
        name: '',
        orgId: '',
        configFixed: 1,
        selfEvalCamEnabled: -1,
        aiEvalCamEnabled: 1,
        personalInfoCol: [
          'birthday',
          'gender',
          'education',
          'maritalStatus',
          'preferableColor',
          'preferableTaste'
        ],
        reportDisplayEnabled: '',
        timeLimited: -1,
        userUploader: 'org_superadmin',
        normalAdminMode: 0,
        userCountLimitation: 0
      },
      rules: {
        name: [
          { required: true, validator: batchNameValidate, trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '请选择关联部门', trigger: 'blur' }
        ],
        configFixed: [
          { required: true, message: '请选择量表配置方式', trigger: 'blur' }
        ],
        reportDisplayEnabled: [
          { required: true, message: '请选择报告是否展示给用户', trigger: 'blur' }
        ]
      },
      tableOrder: [],
      evalSelection: []
    }
  },
  created () {
    getOrgList().then(
      res => {
        this.orgs = res.data.orgs || []
      }
    )
    const BATCH_ID = this.$route.params.id || this.$route.query.id
    if (BATCH_ID) {
      batchInfo(BATCH_ID).then(
        res => {
          const {
            id,
            evalSelection,
            personalInfoCol = [],
            ...formInfo
          } = res.data
          this.id = id
          this.form = {
            ...formInfo,
            personalInfoCol
          }
          this.evalSelection = evalSelection
          this.orgType = res.data.organization.orgType
        }
      )
    }
    this.getTable()
  },
  watch: {
    otherTables (val, old) {
      const flag1 = val.some(v => {
        return v === 'hama' || v === 'hamd'
      })
      const flag2 = val.some(v => {
        return v === 'FADI'
      })
      if (flag1) {
        this.allTableTa.forEach((v, i) => {
          if (v.tableCode === 'FADI') {
            v.flag = true
          }
        })
      } else {
        this.allTableTa.forEach((v, i) => {
          if (v.tableCode === 'FADI') {
            v.flag = false
          }
        })
      }
      if (flag2) {
        this.allTableTa.forEach((v, i) => {
          if (v.tableCode === 'hama' || v.tableCode === 'hamd') {
            v.flag = true
          }
        })
      } else {
        this.allTableTa.forEach((v, i) => {
          if (v.tableCode === 'hama' || v.tableCode === 'hamd') {
            v.flag = false
          }
        })
      }
    }
  },
  computed: {
    curRoute () {
      return this.$route.meta.type
    },
    resRes () {
      const selfTables = this.selfTables
      const otherTables = this.otherTables
      const evalSelection = [...selfTables, ...otherTables]
      const { selfEvalCamEnabled, aiEvalCamEnabled, ...info } = this.form
      const res = {
        ...info,
        evalSelection
      }
      if (selfEvalCamEnabled) res.selfEvalCamEnabled = selfEvalCamEnabled
      if (aiEvalCamEnabled) res.aiEvalCamEnabled = aiEvalCamEnabled
      return res
    },
    selfTablesOfTree () {
      console.log(this.allTable)
      const map = new Map()
      this.allTable.forEach(v => {
        v.id = v.tableCode
        v.label = v.tableName
        const id = String(v.selfTableType.id)
        if (map.has(id)) {
          const oldMap = map.get(id)
          // console.log(oldMap)
          oldMap.children.push(v)
        } else {
          map.set(id, {
            id: id,
            label: v.selfTableType.name,
            children: [v]
          })
        }
      })
      const trees = [...map.values()].sort((a, b) => Number(a.id) - Number(b.id))
      // console.log(trees)
      return trees
    },
    toDataTree () {
      if (!this.selfTablesName.length) return []
      console.log(this.selfTablesOfTree)
      const test = this.selfTablesOfTree.filter(v => {
        const has = this.selfTablesName.some(self => self.selfTableType.name === v.label)
        return has
      }).map(v => {
        v.children = v.children.filter(child => {
          const has = this.selfTablesName.some(self => self.label === child.label)
          return has
        })
        return v
      })
      return test
    }
  },
  methods: {
    sortNum02 (x, y) {
      return x - y
    },
    // 获取所有表
    getTable () {
      getAllTable().then(
        res => {
          this.allTable = res.data.filter(v => {
            return v.tableType === 1
          })
          this.selctSelfTable = this.allTable
          this.tableOrder = this.allTable.map(v => v.tableCode)
          this.allTableTa = res.data.filter(v => {
            return v.tableType === 2
          })
          const BATCH_ID = this.$route.params.id || this.$route.query.id
          if (BATCH_ID) {
            this.allTable.forEach(v => {
              if (this.evalSelection.indexOf(v.tableCode) !== -1) {
                this.selfTables.push(v.tableCode)
              }
            })
            this.selfTables.forEach(item => {
              this.allTable.forEach(v => {
                if (v.tableCode === item) {
                  this.selfTablesName.push(v)
                }
              })
            })
            this.allTableTa.map(v => {
              if (this.evalSelection.indexOf(v.tableCode) !== -1) {
                this.otherTables.push(v.tableCode)
              }
            })
          }
        }
      )
    },
    // 勾选自评表
    getTransValue (e) {
      this.selfTablesName = []
      this.selfTables = e
      e.forEach(item => {
        this.allTable.forEach(v => {
          if (v.tableCode === item) {
            this.selfTablesName.push(v)
          }
        })
      })
    },
    // 选择的部门
    selectOrg (e) {
      this.orgs.forEach(v => {
        if (v.orgID === e) {
          this.orgType = v.orgType
        }
      })
    },
    // 创建批次
    createSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          createBatch(this.resRes).then(
            res => {
              this.$confirm(`<icon-font name="#mdd-wancheng1" :width="70" aria-hidden="true" :height="70" color="34B7B9"> </icon-font>
              <div style="font-size: 20px;font-weight: bold;color: #34B7B9;margin:10px 0 20px 0">配置成功</div>
              <div style="font-size: 16px;color:#666;">批次名称：${res.data.name}；批次号：${res.data.id}</div>`, {
                customClass: 'info-message',
                confirmButtonClass: 'el-button--success btn-normal',
                confirmButtonText: '确定',
                showClose: false,
                dangerouslyUseHTMLString: true,
                showCancelButton: false,
                center: true
              }).then(() => {
                this.$router.push('/batch')
              })
            }
          ).catch(err => {
            // console.log(err.response)
            this.$alert(`${err.response.data.message}：${err.response.data.detail}`, {
              customClass: 'info-message',
              confirmButtonClass: 'el-button--success btn-normal',
              confirmButtonText: '确定',
              showClose: false,
              center: true
            }).then(() => {
            })
          })
        }
      })
    },
    // 更新批次
    updateSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateBatch(this.id, this.resRes).then(
            res => {
              this.$message.success('批次修改成功')
              this.$router.push('/batch')
            }
          )
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.batch-edit {
  padding: 40px 40px 0;
}
.module-title {
  margin-top: 5px;
  margin-bottom: 30px;
  padding-left: 10px;
  line-height: 1;
  font-size: 18px;
  font-weight: 700;
  border-left: 3px solid #34B7B9;
}
.sub-title {
  position: relative;
  padding-left: 15px;
  color: #666;
  font-weight: 700;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #34B7B9;
    transform: translateY(-50%);
  }
}
</style>

<style lang="less" scoped>
.info-message {
  border-radius: 8px;
  .el-message-box__title {
    font-weight: 700;
    color: #34B7B9;
  }
  .el-message-box__message p {
    color: #333;
  }
  .el-message-box__btns .el-button{
    color:#fff;
  }
}
.el-checkbox__input.is-checked+.el-checkbox__label {
  color: #34B7B9;
}
.el-range-editor.is-active, .el-range-editor.is-active:hover {
  border-color: #34B7B9;
}
.el-date-table td.end-date span, .el-date-table td.start-date span {
  background-color: #34B7B9;
}
.el-date-table td.today span,
.el-date-table td.available:hover,
.el-time-panel__btn.confirm,
.el-picker-panel__icon-btn:hover {
  color: #34B7B9;
}
// .name_ti{
//   width: 100px;
//   // display: block;
//   border: 1px solid #000;
//   border-radius: 2px;
//   height: 28px;
// }
/deep/.el-checkbox-button--small .el-checkbox-button__inner{
    // padding: 9px 20px;
    // font-size: 12px;
    // border: 1px solid #dcdfe6;
    // border-radius: 0 !important;
    font-size: 14px;
    margin-right: 10px;
    width: 100px;
    height: 32px;
    border: 1px solid #34B7B9 !important;
    border-radius: 6px!important;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
/deep/.el-checkbox-button.is-checked .el-checkbox-button__inner{
    background-color: #34B7B9;
    border-color: #34B7B9;
    font-weight: bold;
}
.el-select-dropdown__item{
  width: 192px;
}
.el-checkbox-button__inner:hover{
  color: #34B7B9;
}
.el-tree {
  width: 328px;
  height: 343px;
  border: 1px solid #EEEEEE;
  padding: 10px;
  overflow: auto;
  margin-bottom: 20px;
}
/deep/.el-tree-node>.el-tree-node__children {
  overflow:unset
}
.el-tree::-webkit-scrollbar {
  width : 5px;
  height: 5px;
}
.el-tree::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: #DFDFDF;
}
.el-tree::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0);
}
</style>

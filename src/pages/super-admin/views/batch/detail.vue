<template>
  <div class="batch-detail">
    <el-form style="flex: 1">
      <p class="module-title">基础信息设置</p>
      <el-form-item  label="批次名称：" style="margin-bottom:0">
        <span class="orgLen">{{ info.name }}</span>
      </el-form-item>
      <el-form-item  label="批次号：">
        <span class="orgLen">{{ info.id }}</span>
      </el-form-item>
      <!-- <el-form-item  label="关联部门：">
        <span class="orgLen">{{ info.orgName }}</span>
      </el-form-item> -->
      <p class="module-title">检查项目配置</p>
      <el-form-item>
        <span class="sub-title">量表配置方式：</span>
        <span v-if="info.configFixed === 1">固定配置</span>
        <span v-else-if="info.configFixed === -1">非固定配置</span>
      </el-form-item>
      <el-form-item class="tableBox">
        <p class="sub-title mb-0 tableP">自评量表：</p>
        <div class="allTable">
          <span
            v-show="info.selfTables.length > 0"
            class="g-3"
            v-for="t in info.selfTables"
            :key="t"
          >
            {{ t }}
          </span>
        </div>
        <span v-show="info.selfTables.length === 0">无</span>
      </el-form-item>
      <el-form-item class="tableBox">
        <p class="sub-title mb-0 tableP">他评量表：</p>
        <div class="allTable">
          <span
            v-show="info.otherTables.length > 0"
            class="g-3"
            v-for="t in info.otherTables"
            :key="t"
          >
            {{ t }}
          </span>
        </div>
        <span v-show="info.otherTables.length === 0">无</span>
      </el-form-item>
      <el-form-item>
        <span class="sub-title">报告是否展示给用户：</span>
        <span v-if="info.reportDisplayEnabled === 1">是</span>
        <span v-else-if="info.reportDisplayEnabled === -1">否</span>
      </el-form-item>
    </el-form>
    <div class="text-center">
      <el-button
        size="medium"
        plain
        @click="$router.go(-1)"
      >
        返回
      </el-button>
      <el-button
        type="success"
        size="medium"
        @click="$router.push(`/batch/edit?id=${info.id}`)"
      >
        编辑
      </el-button>
    </div>
  </div>
</template>

<script>
import { batchInfo, getAllTable } from '@/api/modules/batch'
import { getOrgList } from '@/api/modules/organ'
import { DateFormat } from '@/utils/date'
export default {
  name: 'detail',
  data () {
    return {
      info: {
        selfTables: [],
        otherTables: []
      },
      DateFormat: DateFormat,
      tableSelf: [],
      tableOther: []
    }
  },
  created: async function () {
    try {
      const BATCH_ID = this.$route.query.id
      const organRes = await getOrgList()
      const batchRes = await batchInfo(BATCH_ID)
      const alltableRes = await getAllTable()
      const orgs = organRes.data.orgs || []
      const alltable = alltableRes.data
      const {
        orgId,
        evalSelection,
        ...info
      } = batchRes.data
      this.info = info
      this.info.orgName = orgs.filter(org => org.orgID === orgId).map(v => v.orgName)[0]
      // if (evalSelection.includes('hamd')) {
      //   this.info.otherTables = '汉密顿抑郁量表（HAMD）'
      // }
      // if (evalSelection.includes('hama')) {
      //   this.info.otherTables += ' 汉密顿焦虑量表（HAMA）'
      // }
      alltable.forEach(v => {
        if (v.tableType === 1) {
          this.tableSelf.push([v.tableCode, v.tableName])
        } else {
          this.tableOther.push([v.tableCode, v.tableName])
        }
      })
      this.info.selfTables = this.getInfos(evalSelection, this.selfInfo)
      this.info.otherTables = this.getInfos(evalSelection, this.otherInfo)
    } catch (err) {
      console.log(err)
    }
  },
  computed: {
    userInfo () {
      const USER_MAP = new Map([
        ['identifier', '编号'],
        ['name', '姓名'],
        ['birthday', '出生年月'],
        ['gender', '性别'],
        ['education', '教育程度'],
        ['maritalStatus', '婚姻状况'],
        ['preferableColor', '颜色喜好'],
        ['preferableTaste', '口味喜好']
      ])
      return USER_MAP
    },
    selfInfo () {
      const SELF_MAP = new Map(this.tableSelf)
      return SELF_MAP
    },
    otherInfo () {
      const SELF_MAP = new Map(this.tableOther)
      return SELF_MAP
    }
  },
  methods: {
    getInfos (infos = [], thisName) {
      let res = []
      infos.map(
        info => {
          const infoStr = thisName.get(info)
          if (infoStr) res = [...res, infoStr]
        }
      )
      return res
    }
  }
}
</script>

<style lang="less" scoped>
.batch-detail {
  // display: flex;
  // justify-content: space-between;
  // align-items: self-start;
  padding: 40px 40px 0;
  /deep/ .el-form-item__content {
    color: #333;
  }
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
  color: #666;
  font-weight: 700;
}
.report{
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}
.infoBox{
  display:flex;
  margin-left:70px !important;
  align-items: center;
  align-items:center;
  margin:20px 0;
  color: #666;
  font-size: 14px;

}
.infoList{
  font-size: 14px;
  margin: 0 10px;
  white-space: nowrap;
}
.infoTip{
  padding: 0;
  margin: 0;
  color: #666;
  white-space: nowrap;
}
.orgLen{
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
}
.tableBox{
  /deep/.el-form-item__content{
    // display: flex;
  }
  min-width: 530px;
}
.tableP::before{
  top: 20px;
}
.tableP{
  white-space: nowrap;
}
.allTable{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}
.g-3{
  width: 24%;
  white-space: nowrap;
}
@media screen and (max-width: 1320px) {
  .g-3 {
    width: 32%;
  }
}
@media screen and (max-width: 1180px) {
  .g-3 {
    width: 48%;
  }
}
</style>

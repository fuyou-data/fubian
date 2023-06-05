<template>
  <div class="num-box">
    <div class="title">查询</div>
    <el-form class="search-form" :model="searchForm" ref="searchForm" size="mini" inline>
      <el-form-item class="search-form-item" label="关键词：">
        <el-input v-model="searchForm.keyword" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item class="search-form-item" label="账号：">
        <el-input v-model="searchForm.username" placeholder="请输入账号" clearable></el-input>
      </el-form-item> -->
      <el-form-item class="search-form-item">
        <el-button @click="getList()" type="success" size="mini" >查询</el-button>
        <el-button @click="reset()" size="mini" plain>重置</el-button>
      </el-form-item>
    </el-form>
    <AlertBox>
      <div slot="before">共{{pager.totalRow}}个项目</div>
       <div slot="after">
        <el-button @click="singleAdd()" :disabled="singleAddFlag" class="btn-normal" type="success">添加</el-button>
        <el-button @click="multiAdd()" :disabled="singleAddFlag" class="btn-normal" type="success" v-if="configFixed === '1'">批量添加</el-button>
      </div>
    </AlertBox>
    <el-table class="table" ref="table" :data="records"
      tooltip-effect="dark" size="medium" style="width: 100%"
      :header-cell-style="{ textAlign: 'center'}"
      :cell-style="{ textAlign: 'center' }">
      <el-table-column type="selection" v-if="records.length > 0"></el-table-column>
      <el-table-column :label="item" v-for="item in customInfoCol" :key="item" :width="item ==='姓名' && 150 ">
        <template slot-scope="scope">
          <span v-if="!scope.row.flag">{{scope.row.customInfo[item]}}</span>
          <el-select v-model.trim="scope.row.customInfo[item]" filterable placeholder="请选择成员" size="mini" v-if="scope.row.flag === true  && item === '姓名' ">
            <el-option v-for="item in canSelectArr" :key="item.key" :label="item.name" :value="item.username"></el-option>
            <!-- 选择的是账号，姓名可以重复，而账号不可以 -->
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="测试内容"  header-align="center" align="center" width="250" v-if="records.length > 0">
        <template slot-scope="scope">
            <div v-if="scope.row.evalSelection.length>0" class="tipBox">
              <!-- 不同的测试内容下不同的表现样式 -->
              <span>{{returnName(scope.row.evalSelection)}}</span>
              <!-- <span v-for="(item, index) in scope.row.evalSelection" :key="item">
                <span v-if="scope.row.evalSelection.length <9">{{index > 9 ? '' : item + (index === scope.row.evalSelection.length -1 ? '' : '；')}}</span>
                <span v-if="scope.row.evalSelection.length >= 9">{{index > 9 ? '' : item + (index === 9? '' : '；')}}</span>
              </span> -->
              <!-- <span v-if="scope.row.evalSelection.length >= 10">...</span> -->
              <!-- hover小弹窗不同的测试内容下不同的表现样式 -->
              <div class="tips" v-if="scope.row.evalSelection.length >= 10">
                <span>{{returnNamepop(scope.row.evalSelection)}}</span>
                <span class="sanjiao"></span>
              </div>
            </div>
            <!-- 添加 -->
            <div v-if="scope.row.flag" class="tipBox">
              <img style="cursor: pointer; width:80px;height:32px" v-if="!scope.row.evalSelection.length>0"  @click="addSelect" src="@/assets/img/add.png" alt="添加">
            </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" header-align="center" align="center" width="200" v-if="records.length > 0">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.flag" @click="del(scope.row.sessionId, scope.row.canDelete)" :class="{'dark':!scope.row.canDelete}" :disabled="!scope.row.canDelete" class="del" type="text" size="mini">删除</el-button>
          <!-- <span class="details" @click="del(scope.row)">删除</span> -->
           <div v-if="scope.row.flag">
             <el-button type="text"  size="small" @click="addSure(scope.row)" class="del">保存</el-button>
             <el-button type="text"  size="small" @click="addCal()" class="del">取消</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination :current-page="1" :page-size="10" :total="pager.totalRow"
      @current-change="handlePageChange" layout="total, prev, pager, next, jumper" >
      </el-pagination>
      <!-- 测试内容 -->
      <Dialog ref="dialog" :formData="formData" :batchId="batchId" @getSelectTables="getSelectTables"></Dialog>
      <!-- 成员 -->
      <Member ref="member" @save="memberSave" :formatSelectArr="formatSelectArr"></Member>
    </div>
  </div>
</template>

<script>
import { postUserList, userCreate, deleteUser, userCreateMore } from '@/api/modules/batch-users.js'
import { getOrginTable } from '@/api/modules/organ'

import Dialog from './dialog.vue'
import Member from './member.vue'
// import { postUserList, deleteUser } from '@/api/modules/batch-users.js'
import { batchInfo, memberList } from '@/api/modules/batch'
import AlertBox from '@components/AlertBox'
export default {
  name: 'batch-users',
  components: {
    AlertBox,
    Member,
    Dialog
  },
  data () {
    return {
      batchId: this.$route.query.id,
      configFixed: this.$route.query.configFixed,
      evalSelection: [], // 选择的量表
      customInfoCol: [], // 账号姓名部门
      formData: [], // 选择测试范围
      canSelectArr: [], // 选择的成员
      formatSelectArr: [], // 穿梭框选择的成员
      searchForm: {
        keyword: ''
        // username: ''
      },
      pager: {
        page: 1,
        totalPage: 1,
        totalRow: 0
      },
      addFilterList: [],
      memberList: [], // 成员列表
      allList: [], // 当前的用户list
      records: [], // 展示的list
      singleAddFlag: false // 是否可以单个添加
    }
  },
  watch: {
    $route () {
      this.batchId = this.$route.query.id
      this.configFixed = this.$route.query.configFixed
      this.pager.page = 1
      this.evalSelection = []
      this.singleAddFlag = false
      this.searchForm = {}
      this.filterList()
      this.getBatchInfo()
      this.getList()
      // setTimeout(() => {
      //   console.log(this.evalSelection)
      //   console.log(this.records[0])
      // }, 1000)
    }
  },
  mounted () {
    // console.log(this.$route.query)
    this.filterList()
    this.getBatchInfo()
    this.getList()
  },
  methods: {
    returnName (arr) {
      if (arr.length === 1) {
        return arr[0]
      } else if (arr.length < 9 && arr.length > 1) {
        let str = ''
        arr.forEach((it, index) => {
          if (index === arr.length - 1) {
            str += it
          } else {
            str += it + '; '
          }
        })
        return str
      } else if (arr.length >= 9) {
        let str = ''
        arr.forEach((it, index) => {
          if (index < 9) {
            str += it + '；'
          }
          if (index === 9) {
            str += it + ' ...'
          }
        })
        return str
      }
    },
    returnNamepop (arr) {
      let str = ''
      arr.forEach((it, index) => {
        if (index === arr.length - 1) {
          str += it
        } else {
          str += it + '；'
        }
      })
      return str
    },
    getBatchInfo () {
      batchInfo(this.batchId).then(res => {
        this.customInfoCol = res.data.customInfoCol
        getOrginTable({ batchId: this.batchId }).then(resp => {
          if (resp.code === 0) {
            this.formData = resp.data.formData
            const temp = []
            const formArr = []
            this.formData.forEach(e => {
              e.children.forEach(it => {
                formArr.push(it)
              })
            })
            res.data.evalSelection.forEach(e => {
              const it = formArr.find(item => item.id === e)
              temp.push(it.tableEnName)
            })
            this.evalSelection = temp
          }
        }).catch(err => { console.log(err) })
      }).catch(err => { console.log(err) })
    },
    filterList () {
      postUserList({ page: -1, batchId: this.batchId }).then(res => {
        this.allList = res.data.records || []
        memberList({ page: -1 }).then(resp => {
          if (resp.code === 0) {
            this.memberList = resp.data.users
            // console.log(res.data.records, resp.data.users)
            const tempArr = []
            this.allList.forEach(e => {
              if (e.status !== 9) {
                tempArr.push(e.customInfo.账号)
              }
            })
            // console.log(tempArr, '这个批次里面没有做完的人')
            // console.log(this.memberList)
            this.canSelectArr = this.memberList.filter(e => !tempArr.includes(e.username))
            // console.log(this.canSelectArr, '可以选择的成员')
            this.formatSelectArr = []
            this.canSelectArr.forEach(e => {
              this.formatSelectArr.push({
                label: e.name,
                key: e.username
              })
            })
            // console.log(this.canSelectArr, '可以选择的成员')
            // console.log(this.formatSelectArr, '可以选择的成员')
          }
        }).catch(err => { console.log(err) })
      }).catch(err => { console.log(err) })
    },
    async getList () {
      const data = {
        batchId: this.batchId,
        keyword: this.searchForm.keyword,
        // username: this.searchForm.username,
        page: this.pager.page,
        pageSize: 10
      }
      const res = await postUserList(data)
      this.records = res.data.records || []
      this.pager = res.data.pager
    },
    async singleAdd () {
      // 单个添加
      this.singleAddFlag = true
      const row = {
        flag: true,
        customInfo: {
          姓名: ''
        }
      }
      if (this.configFixed === '1') {
        row.evalSelection = this.evalSelection
      }
      if (this.configFixed === '-1') {
        row.evalSelection = []
      }
      // console.log(row)
      this.records.unshift(row)
      // console.log(this.records)
    },
    multiAdd () {
      this.$refs.member.dialogFormVisible = true
      this.$refs.member.selectData = []
      this.$refs.member.selectFlag = false
      // 批量添加前 清下数据
    },
    memberSave (arr) {
      // console.log(arr)
      const customInfos = []
      arr.forEach(e => {
        const it = this.canSelectArr.find(item => item.username === e)
        customInfos.push(
          {
            账号: it.username,
            姓名: it.name,
            部门: it.orgName
          }
        )
      })
      if (this.configFixed === '1') {
        userCreateMore({ batchId: this.batchId, customInfos: customInfos }).then(res => {
          // console.log(res)
          this.$message.success('批量添加成功')
          this.$refs.member.dialogFormVisible = false
          this.filterList()
          this.getBatchInfo()
          this.getList()
        })
      }
      // console.log(this.canSelectArr)
      // console.log(customInfos)
    },
    del (id, flag) {
      if (flag) {
        this.$confirm('确定要删除该用户吗?', '提示', {
          showClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const data = {
            sessionId: id
          }
          await deleteUser(data)
          // console.log(res)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          })
          // 删除成功后 这个人可能可以添加了
          this.singleAddFlag = false
          this.filterList()
          this.getBatchInfo()
          this.getList()
        }).catch(() => {})
      }
    },
    getSelectTables (data, name) {
      // console.log(data, name)
      this.records[0].evalSelection = name
      this.records[0].evalSelectionData = data
    },
    addSelect () {
      this.$refs.dialog.dialogFormVisible = true
    },
    addSure (row) {
      // console.log(row)
      let kString = ''
      for (const k in row.customInfo) {
        kString = k
      }
      if (row.customInfo[kString] !== '') {
        // 填写了
        const item = this.memberList.find(e => e.username === row.customInfo[kString])
        // console.log(item)
        const data = {
          batchId: this.batchId,
          customInfo: {
            账号: item.username,
            姓名: item.name,
            部门: item.orgName
          },
          evalSelection: this.evalSelection
        }
        if (this.configFixed === '-1') {
          data.evalSelection = row.evalSelectionData || []
          if (data.evalSelection.length === 0) {
            this.$message.error('请选择测试内容')
            return false
          }
        }
        userCreate(data).then(res => {
          if (res.code === 0) {
            this.$message.success('添加成功')
            row.flag = false
            this.singleAddFlag = false
            // 调接口方便待优化
            this.filterList()
            this.getBatchInfo()
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        this.$message.error('请选择成员')
      }
      // 固定批次单个添加 查找到成员列表这个人的信息
    },
    addCal () {
      this.singleAddFlag = false
      this.records.shift()
      this.getBatchInfo()
    },
    handlePageChange (page) {
      this.pager.page = page
      this.getList()
    },
    reset () {
      this.searchForm.keyword = ''
      // this.searchForm.username = ''
      this.pager.page = 1
      this.getList()
    }
  }
}
</script>
<style lang="less" scoped>
.num-box{
  padding: 40px 4%;
  .title {
    font-size: 24px;
    color: #34B7B9;
    margin-bottom: 20px;
  }
  .search-form {
    .el-form-item {
      margin-right: 40px;
    }
  }
  /deep/.el-table__body-wrapper{
    overflow: unset;
  }
  /deep/.table td{
    border-top: none;
  }
  .el-table{
    overflow: unset;
    width: 100%;
    margin-top: 5px;
    z-index: 5;
    .del{
      color: #34B7B9;
      font-size: 14px;
      text-decoration: underline;
    }
    .dark{
      color: #C0C4CC;
    }
    .tipBox:hover .tips{
      display: block;
    }
    .tipBox:hover{
      color: #39CACC;
    }
    .tips{
      position: absolute;
      left: 0;
      top: -90%;
      background: #FFFFFF;
      width: 350px;
      border: 1px solid rgba(0, 0, 0, 0);
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
      opacity: 1;
      border-radius: 4px;
      z-index: 100;
      color: #333;
      display: none;
      padding: 5px;
    .sanjiao{
      width: 0;
      height: 0;
      border-right: 6px solid transparent;
      border-left: 6px solid transparent;
      border-top: 6px solid #fff;
      position: absolute;
      bottom: -6px;
      left: 10%;
      transform: translateX(-50%);
     }
   }
    .details{
      color: #34B7B9;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .pagination{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 60px;
  }
}
</style>

<template>
  <div class="cbt-panel">
    <!-- blocks -->
    <div class="stat-list" :class="{'open': type === 'open'}" v-if="statList.length > 0">
      <div class="fold-line">
        <div class="line-left">心理疏导统计</div>
        <div class="line-right" v-if="type === 'close'" @click="type = 'open'"><span>展开<i class="el-icon-arrow-down"></i></span></div>
        <div class="line-right" v-if="type === 'open'" @click="type = 'close'"><span>收起<i class="el-icon-arrow-up"></i></span></div>
      </div>
      <div class="fold-blocks">
        <div class="each-block" v-for="(it, index) in disponse(statList)" :key="index">
          <div class="sub-block">
            <div class="name">{{it.courseName}}</div>
            <div class="total">参与疏导人数：{{it.total}}人</div>
            <div class="total">已完成次数：{{it.finish}}次</div>
          </div>
        </div>
      </div>
    </div>
    <!-- form -->
    <el-form v-if="(enableUserManage && items.length> 0)" :inline="true" size="small" :model="searchForm">
      <el-form-item label="关键字：">
        <el-input v-model="searchForm.q" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="疏导状态：" :style="{'margin-right': '40px'}">
        <el-select v-model="searchForm.status">
          <el-option label="全部" value=""></el-option>
          <el-option label="疏导中" value="疏导中"></el-option>
          <el-option label="已疏导" value="已疏导"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search(false)">查询</el-button>
        <el-button @click="reset" class="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <alert-box v-if="(enableUserManage && items.length> 0)">
      <div slot="before"> 共有{{totalRow}}个项目</div>
    </alert-box>
    <!-- table -->
    <el-table v-if="(enableUserManage && items.length> 0)" :data="items" style="width: 100%"  :cell-style="{ 'textAlign': 'center', 'border-bottom': '1px solid #EBEEF5 ', 'color': '#909399 ' }"
    :header-cell-style="{'textAlign': 'center', 'border-bottom': '1px solid #EBEEF5 ', 'color': '#909399 '}" >
      <el-table-column prop="user_name" label="账号" width="250"></el-table-column>
      <el-table-column prop="status" label="疏导状态">
        <template slot-scope="scope">
          {{scope.row.status === 2? '疏导中': (scope.row.status === 3? '已疏导': '')}}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="完成时间">
        <template slot-scope="scope">
          {{scope.row.finish_at > 1? DateFormat({date:(scope.row.finish_at * 1000),format:'yyyy.MM.dd hh:mm:ss'}): '-'}}
        </template>
      </el-table-column>
    </el-table>
    <!-- pag -->
    <el-pagination v-if="(enableUserManage && items.length> 0)"  background layout="prev, pager, next, jumper" @current-change="handleCurrentChange" :total="totalRow" :page-size="10" :current-page="page"></el-pagination>
  </div>
</template>

<script>
import { cbtTheme, cbtUserStatistics } from '@/api/modules/stat'
import AlertBox from '@/components/AlertBox'
import { DateFormat } from '@/utils/date'

export default {
  name: 'cbt',
  components: {
    AlertBox
  },
  data () {
    return {
      DateFormat: DateFormat,
      type: 'close',
      statList: [],
      items: [],
      searchForm: {
        q: '',
        status: ''
      },
      totalRow: 0,
      page: 1,
      pageSize: 10,
      cloneQuery: {}
    }
  },
  computed: {
    enableUserManage () {
      return localStorage.enableUserManage === 'true'
    }
  },
  mounted () {
    // 非管理默认展开
    if (!this.enableUserManage) this.type = 'open'
    this.getcbtList()
    this.initList()
  },
  methods: {
    getcbtList () {
      cbtTheme().then(res => {
        this.statList = res.data.courseStatistics
      })
    },
    disponse (statList) {
      if (this.type === 'close') {
        return statList.slice(0, 4)
      } else {
        return statList
      }
    },
    search (f) {
      if (f) {
        cbtUserStatistics(this.cloneQuery).then(res => {
          this.totalRow = res.data.pager.totalRow
          this.items = res.data.items
        })
      } else {
        this.page = 1
        const query = {
          status: this.searchForm.status,
          q: this.searchForm.q,
          page: this.page,
          pageSize: this.pageSize
        }
        cbtUserStatistics(query).then(res => {
          this.totalRow = res.data.pager.totalRow
          this.items = res.data.items
          this.cloneQuery = query
        })
      }
    },
    reset () {
      this.searchForm.q = ''
      this.searchForm.status = ''
      this.page = 1
      this.search()
    },
    handleCurrentChange (p) {
      this.page = p
      this.cloneQuery.page = p
      this.search(true)
    },
    initList () {
      const query = {
        status: this.searchForm.status,
        q: this.searchForm.q,
        page: this.page,
        pageSize: this.pageSize
      }
      cbtUserStatistics(query).then(res => {
        this.totalRow = res.data.pager.totalRow
        this.items = res.data.items
        if (this.items.length <= 0) {
          this.type = 'open'
        }
        this.cloneQuery = query
      })
    }
  }
}
</script>

<style scoped lang="less">
.cbt-panel{
  padding:  48px 111px 100px 40px;
  min-width: 1200px;
  .open{
    height: 100% !important;
  }
  .stat-list{
    height: 211px;
    // min-width: 1200px;
    box-shadow: 0px 6px 12px 1px rgba(0,0,0,0.16);
    border-radius: 7px;
    padding: 28px 22px 30px;
    margin-bottom: 48px;
    .fold-line{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 16px;
      line-height: 16px;
      font-size: 16px;
      color: #333333;
      margin-bottom: 22px;
      padding: 0 10px;
      .line-left{
        color: #333333;
        font-weight: bold;
      }
      .line-right{
        color: #34B7B9;
        cursor: pointer;
        i{
          font-weight: 700;
        }
      }
    }
    .fold-blocks{
      display: flex;
      flex-wrap: wrap;
      .each-block{
        width: 25%;
        margin-bottom: 16px;
        .sub-block{
          margin: 0 8px;
          height: 122px;
          background: #FCFCFC;
          border-radius: 6px;
          border: 1px solid #EEEEEE;
          padding-top: 24px;
          padding-left: 20px;
          .name{
            color: #333333;
            height: 14px;
            line-height: 14px;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 12px;
          }
          .total{
            color: #666666;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            margin-bottom: 4px;
          }
        }
      }
    }
  }
  .el-form{
    height: 32px;
    margin-bottom: 28px;
    .el-form-item{
      margin-right: 100px;
      .el-input{
        width: 200px;
        /deep/.el-input__inner{
          border-color: #707070;
        }
      }
      .el-select{
        width: 200px;
        /deep/.el-input__inner{
          border-color: #707070;
        }
      }
      .el-button{
        width: 60px;
      }
      .reset{
        border: 1px solid #D6D9D9;
        color: #656868;
      }
    }
  }
  .el-pagination{
    text-align: center;
    margin-top: 80px;
  }
}
</style>

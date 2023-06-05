<template>
<div class="task-box">
  <div class="title">*请刷新页面,以查看导出进度</div>
  <AlertBox :style="{'margin-bottom': '8px'}">
    <div slot="before">
      导出系统数据包
    </div>
    <div slot="after">
      <el-button @click="exportPackage"  class="btn-normal" type="success" >导出数据包</el-button>
    </div>
  </AlertBox>
  <table>
    <tr class="head">
      <td>文件名</td>
      <td>所属批次</td>
      <td>大小</td>
      <td>状态</td>
      <td>创建时间</td>
      <td>操作</td>
    </tr>
    <tr class="body" v-for="item in tableData" :key="item.createdAt">
      <td>{{item.fileName}}</td>
      <td>{{item.batchId}}</td>
      <td>{{item.size}}</td>
      <td :class="{'success': item.status === 'success','fail': item.status === 'failed' }">{{retText(item.status)}}</td>
      <td>{{DateFormat({date:(item.createdAt * 1000),format:'yyyy.MM.dd hh:mm:ss'})}}</td>
      <td>
        <button v-if="false" class="has-class" @click="cancel">取消</button>
        <button v-if="item.status === 'success' " class="has-class" @click="downLoad(item.url)">下载</button>
        <button class="no-effect" v-if="item.status === 'failed' ">-</button>
      </td>
    </tr>
  </table>
  <div class="last">
  <el-pagination  v-if="tableData.length !== 0" @current-change="handleCurrentChange" :page-size="pager.pageSize"  layout="prev, pager, next, jumper" :total="pager.total">
  </el-pagination>
  <!-- <span>共有x条</span> -->
  </div>
</div>
</template>

<script>
import AlertBox from '@/components/AlertBox'
import downloadLink from '@utils/export-url.js'
import { DateFormat } from '@/utils/date'
import { adminMe } from '@api/index'
import { exportSystemData } from '@api/modules/member'
import { apiExport } from '@api/modules/batch'
export default {
  name: 'tasks',
  components: {
    AlertBox
  },
  data () {
    return {
      DateFormat: DateFormat,
      userName: '',
      tableData: [],
      pager: {
        page: 1,
        pageSize: 10,
        total: ''
      }
    }
  },
  mounted () {
    this.getinfo().then(() => this.getList())
  },
  methods: {
    async getinfo () {
      const res = await adminMe({})
      this.userName = res.data.username
      // console.log(res)
    },
    async getList () {
      const params = {
        adminName: this.userName,
        page: this.pager.page,
        pageSize: this.pager.pageSize
      }
      const res = await apiExport(params)
      this.tableData = res.data.exportRecords
      this.pager.total = res.data.pager.totalRow
    },
    handleCurrentChange (p) {
      this.pager.page = p
      this.getList()
    },
    cancel () {
      console.log('取消')
    },
    downLoad (url) {
      console.log('下载')
      downloadLink(url)
    },
    retText (text) {
      if (text === 'success') {
        return '导出成功'
      } else if (text === 'doing') {
        return '等待导出'
      } else if (text === 'failed') {
        return '导出失败'
      } else {
        return '未知错误'
      }
    },
    exportPackage () {
      this.$confirm('即将导出本系统数据，数据包包含隐私数据，请妥善保管', '', {
        customClass: 'list-message',
        confirmButtonClass: 'el-button--success btn-normal',
        cancelButtonClass: 'is-plain btn-normal',
        confirmButtonText: '确定导出',
        cancelButtonText: '取消',
        showClose: false,
        center: true
      }).then(() => {
        exportSystemData().then(() => {
          window.location.reload()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.task-box{
  padding: 40px;
  font-size: 14px;
  .title{
    margin-bottom: 15px;
  }
  table{
    width: 100%;
    margin-bottom: 48px;
    tr{
      display: flex;
      .success{
          color: #49B934;
        }
      .fail{
          color: #FF4D4F  ;
        }
      td{
        text-align: center;
        padding: 20px 0;
        button{
          background: none;
          border: 0;
          color: #34B7B9;
          &:hover{
            opacity: 0.7;
          }
        }
        .no-effect{
          &:hover{
            opacity: 1;
          }
        }
        .has-class{
          cursor: pointer;
        }
      }
      td:nth-child(1){
        min-width: 335px;
        flex: 5;
      }
      td:nth-child(2){
        min-width: 120px;
        flex: 3;
      }
      td:nth-child(3){
        min-width: 80px;
        flex: 2;
      }
      td:nth-child(4){
        min-width: 100px;
        flex: 3;
      }
      td:nth-child(5){
        min-width: 150px;
        flex: 4;
      }
      td:nth-child(6){
        min-width: 60px;
        flex: 2;
      }
    }
    .head{
      border: 1px solid #e8e8e8;
      background: #FAFAFA;
      font-weight: 700;
      height: 50px;
      line-height: 50px;
      td{
        padding: 0;
      }
    }
    .body{
      border-bottom: 1px solid #e8e8e8;
    }
  }
  .last{
    display: flex;
    justify-content: flex-end;
    span{
      padding-right: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    // /deep/.el-pager li.active{
    //   background-color:#0497fa;
    // }
    // /deep/.el-pagination button:hover{
    //   color:#0497fa;
    // }
    // .el-pagination.is-background .el-pager li:hover {
    //   color:#0497fa;
    // }
  }
  .el-pagination{
    text-align: center;
    width: 100%;
  }
}

</style>

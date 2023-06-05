<template>
  <div class="version">
    <AlertBox :style="{'margin-bottom': '8px'}">
      <template slot="before"> 当前系统版本  {{ version }}</template>
      <template slot="after">
        <el-upload
          class="upload-demo"
          action="/api/admin/upPackage/upload" multiple accept='.zip'
          :show-file-list="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-progress="handleProgress"
          :limit="100"
          >
          <el-button size="small" type="primary">上传升级包</el-button>
        </el-upload>
      </template>
    </AlertBox>
    <el-table :data="tableData"
    :header-cell-style="{ color: '#333636',backgroundColor:'#FAFAFA' }"
    :cell-style-style="{ color: '#656868' }"
     style="width: 100%">
      <el-table-column prop="name"  label="升级包名称"  min-width="200"></el-table-column>
      <el-table-column prop="createdAt"  label="上传时间"  width="200"></el-table-column>
      <el-table-column prop="size"  label="大小"  width="200"></el-table-column>
      <el-table-column label="状态"  width="200">
        <template slot-scope="scope">
          <span class="normal" v-if="scope.row.status === '已上传'">{{ scope.row.status }}</span>
          <span class="green" v-if="scope.row.status === '升级成功'">{{ scope.row.status }}</span>
          <span class="red" v-if="scope.row.status === '升级失败'">{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column   label="操作 "  width="100">
        <template slot-scope="scope">
          <span class="up same" v-if="scope.row.status === '已上传'" @click="upVersion(scope.row.id)">升级</span>
          <span  v-else>- </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination  v-if="tableData.length !== 0" @current-change="handleCurrentChange" :page-size="pageSize"  layout="prev, pager, next, jumper" :total="totalRow">
    </el-pagination>
    <Loading :flag="loadingFlag"/>
    <Updating :flag="UpdatingFlag" />
    <Next :flag="next">
      <template slot="btn">
        <div class="btns">
          <el-button size="small" class="cancel" @click="next = false, id = null">取消</el-button>
          <el-button size="small" type="primary" @click="sureUp()">确定</el-button>
        </div>
      </template>
    </Next>
    <Out :flag="out">
      <template slot="btn">
        <div class="btns">
          <el-button size="small" type="primary" @click="reload()">刷新</el-button>
        </div>
      </template>
    </Out>
    <Success :flag="success">
      <template slot="btn">
        <div class="btns">
          <el-button size="small" type="primary" @click="successUpdate()">升级</el-button>
          <el-button class="cancel" size="small" @click="success = false, id = null, getList()">稍后</el-button>
        </div>
      </template>
    </Success>
  </div>
</template>

<script>
import AlertBox from '@components/AlertBox'
import Loading from './loading.vue'
import Success from './success.vue'
import Updating from './updating.vue'
import Next from './next.vue'
import Out from './out.vue'
import { upPackageList, upPackageUp, upPackageInfo, versionInfo } from '@/api/modules/version'
export default {
  name: 'index',
  components: {
    AlertBox,
    Loading,
    Next,
    Updating,
    Out,
    Success
  },
  data () {
    return {
      id: null,
      version: '',
      page: 1,
      pageSize: 10,
      totalRow: 0,
      tableData: [],
      loadingFlag: false,
      next: false,
      UpdatingFlag: false,
      out: false,
      success: false,
      poll: null
    }
  },
  mounted () {
    this.getList()
    this.getVersion()
  },
  methods: {
    getVersion () {
      versionInfo().then(res => {
        this.version = res.data
      })
    },
    getList () {
      upPackageList({ page: this.page, pageSize: this.pageSize }).then(res => {
        this.totalRow = res.data.pager.totalRow
        this.tableData = res.data.upPackages || []
      })
    },
    upVersion (id) {
      this.id = id
      this.next = true
    },
    sureUp () {
      this.next = false
      this.UpdatingFlag = true
      upPackageUp({ id: this.id })
      this.poll = setInterval(() => {
        upPackageInfo({ id: this.id }).then(res => {
          if (res.code === 0 && res.data.status === '升级成功') {
            clearInterval(this.poll)
            this.id = null
            this.out = true
          } else {
            clearInterval(this.poll)
            this.UpdatingFlag = false
            this.id = null
            this.$message.error('升级失败')
            this.getList()
          }
        })
      }, 2000)
    },
    successUpdate () {
      this.UpdatingFlag = true
      this.success = false
      upPackageUp({ id: this.id })
      this.poll = setInterval(() => {
        upPackageInfo({ id: this.id }).then(res => {
          if (res.code === 0 && res.data.status === '升级成功') {
            clearInterval(this.poll)
            this.id = null
            this.out = true
          } else {
            clearInterval(this.poll)
            this.id = null
            this.UpdatingFlag = false
            this.getList()
            this.$message.error('升级失败')
          }
        })
      }, 2000)
    },
    handleError (e) {
      this.loadingFlag = false
      e = String(e)
      const a = e.indexOf('{')
      const b = e.indexOf('}')
      const str = JSON.parse(e.substring(a, b + 1))
      this.$message.error(str.message)
    },
    handleSuccess (e) {
      if (e.code === 0) {
        this.loadingFlag = false
        this.success = true
        this.id = e.data
      }
    },
    handleProgress (e) {
      if (e.percent !== 100) {
        this.loadingFlag = true
      } else {
        this.loadingFlag = false
      }
    },
    handleCurrentChange (p) {
      this.page = p
      this.getList()
    },
    reload () {
      window.location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
.version {
  padding: 48px 40px;
  /deep/.el-table{
    .cell{
      padding: 0 24px;
    }
    .green{
      color: #49B934;
    }
    .red{
      color: #FF4D4F;
    }
    .up{
      cursor: pointer;
    }
    .same{
      color: #34B7B9;
    }
  }
  .el-pagination{
    margin-top: 48px;
    text-align: center;
  }
}
</style>

<template>
  <div v-if="pieList.length">
    <div class="title">
      <h5>情绪异常统计</h5>
      <span class="down-load" @click="downList">下载异常名单</span>
    </div>
    <hr>
    <!-- <div class="down-load">
    <a href="javascript:void(0)" @click="downList">下载情绪异常名单</a>
    </div> -->
    <!-- charts  -->
    <div class="content" id="#f-box">
      <div class="every-box" v-if="fadiList.length">
        <div class="fadi">
          <div class="title"><h6>{{fadiList[0].tableName}}</h6></div>
          <div class="down"><span class="down-load">下载异常名单</span></div>
          <div v-for="(item, index) in fadiList[0].subTableCharts" :key="'fadiList' + index" class="form">
            <div class="every-form">
              <div class="title sub-title">{{ item.tableName }}</div>
              <echartsDoughnut :dataPie="item.chart" :width="'240px'" :height="'303px'" class="charts"></echartsDoughnut>
            </div>
            <div v-if="index != fadiList[0].subTableCharts.length - 1" class="line"></div>
          </div>
        </div>
      </div>
      <div v-for="(item, index) in newPieList" :key="'newPieList' + index">
        <div class="every-box every-form">
          <div class="title"><h6>{{ item.tableName }}</h6></div>
          <div class="down"><span class="down-load">下载异常名单</span></div>
          <echartsDoughnut :dataPie="item.chart" :width="'240px'" :height="'303px'" class="charts"></echartsDoughnut>
        </div>
      </div>
    </div>
    <el-pagination v-show="pieList.length" :current-page="page.pageIndex" class="my-pagination"
      @current-change="handleCurrentChange" :page-size="page.pageSize" layout=" prev, pager, next, jumper"
      :total="pieList.length">
    </el-pagination>
  </div>
</template>

<script>
import echartsDoughnut from '@components/echartsDoughnut.vue'
import { abnormalList } from '@api/modules/batch'
import downloadLink from '@utils/export-url.js'

export default {
  components: {
    echartsDoughnut
  },
  props: {
    pieData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      page: {
        pageIndex: 1,
        pageSize: 12
      },
      newPieList: [],
      fadiList: []
    }
  },
  mounted () {
    this.getPieList(1)
  },
  computed: {
    pieList () {
      return this.pieData
    }
  },
  watch: {
    pieData: {
      handler (newVal, oldVal) {
        this.getPieList(this.page.pageIndex)
      },
      deep: true
    }
  },
  methods: {
    async downList () {
      const res = await abnormalList({ batchId: this.$route.query.id })
      console.log('downloadList', res)
      if (res.code === 0 && res.data !== null) {
        downloadLink(res.data.url)
      } else {
        this.$notify.info({
          title: '消息',
          message: '暂无数据'
        })
      }
    },
    handleCurrentChange (page) {
      this.page.pageIndex = page
      this.getTable(page)
    },
    getPieList (page) {
      console.log(this.pieList)
      this.fadiList = this.pieList.filter(item => (item.tableCode.includes('FADI') === true))
      this.newPieList = this.pieList.filter(item => (item.tableCode.includes('FADI') === false)).slice((page - 1) * this.page.pageSize, page * this.page.pageSize)
    }
  }
}
</script>

<style lang="less" scoped>
h5 {
  color: #333636;
  margin-top: 28px;
  margin-bottom: 0;
  margin-right: 24px;
  line-height: 22px;
  font-weight: 500;
  font-family: PingFangSC-Medium, PingFang SC;
}

hr {
  margin-top: 4px;
  margin-bottom: 10px;
}

.title {
  h5 {
    display: inline-block;
  }

}
.down-load {
  display: inline-block;
  margin-top: 29px;
  padding-left: 26px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #656868;
  line-height: 22px;
  background: url('../../../../assets/img/download.png') left center / 18px no-repeat;
  cursor: pointer;
}

.content {
  display: flex;
  flex-wrap: wrap;

  .every-box {
    display: inline-block;
    position: relative;
    // width: 240px;
    height: 385px;
    border: 1px solid #ECEFEF;
    border-radius: 6px;
    margin-bottom: 12px;
    // box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.16);
    margin-right: 12px;
    .title {
      box-sizing: border-box;
      padding: 0 12px;
      text-align: center;
      font-weight: 500;
      color: #333636;
      h6 {
        margin-top: 12px;
        margin-bottom: 0;
        font-size: 14px;
        line-height: 20px;
      }
    }
    .down {
      position: absolute;
      top: 54px;
      width: 240px;
      text-align: center;
    }
    .down-load {
      margin-top: 3px;
      padding-left: 22px;
      font-size: 12px;
    }
    .fadi {
      .form {
        display: inline-block;
      }
      .down {
        position: static;
        width: auto;
      }
      .sub-title {
        font-size: 12px;
        line-height: 18px;
      }
      .line {
        display: inline-block;
        margin: 47px 5px 0;
        width: 1px;
        height: 280px;
        background-color: #ecefef;
        vertical-align: top;
      }
    }
    .charts{
      position: absolute;
      top: 82px;
      width: 240px;
    }
  }

  .every-box:nth-child(6n) {
    margin-right: 0;
  }
  .every-form {
    display: inline-block;
    width: 240px;
  }
}

.my-pagination {
  // margin-top: 50px;
  display: flex;
  justify-content: center;
  // padding-bottom: 100px;
}
</style>

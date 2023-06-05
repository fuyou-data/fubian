<template>
  <div>
    <el-form
      ref="form"
      class="formModel"
      :model="form"
      :inline="true"
      size="mini">
      <el-form-item label="关键词：" style="margin:0 20px 24px 0">
        <el-input v-model="form.keyword" placeholder="请输入关键词"></el-input>
      </el-form-item>
      <el-form-item label="检查状态："  style="margin:0 20px 24px 0">
        <el-select v-model="form.status" placeholder="请选择检查状态" style="width: 178px;">
          <el-option :value="1" label="未开始"></el-option>
          <el-option :value="2" label="未完成"></el-option>
          <el-option :value="9" label="已完成"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="last" style="margin:0 20px 24px 0">
        <el-button type="success" size="mini" @click="query">查询</el-button>
        <el-button size="mini" plain  @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="batch_m" v-loading="loading">
      <div v-if="list" style="width: 100%;">
        <div class="batch_box" v-for="item in list" :key="item.index">
          <div class="batch_h">
            <div class="batch_name">
              <div>{{item.batchName}}</div>
              <div class="batch_status" style="color:#E6A23C" v-if="item.status === '未开始'"><icon-font  class="iconfont mr-2"  name="#mdd-weikaishi" :width="16" :height="16" color="#E6A23C"> </icon-font>{{item.status}}</div>
              <div class="batch_status" style="color:#409EFF" v-if="item.status === '未完成'"><icon-font  class="iconfont mr-2"  name="#mdd-yikaishi" :width="16" :height="16" color="#409EFF"> </icon-font>{{item.status}}</div>
              <div class="batch_status" style="color:#67C23A" v-if="item.status === '已完成'"><icon-font  class="iconfont mr-2"  name="#mdd-yiwancheng" :width="16" :height="16" color="#67C23A"> </icon-font>{{item.status}}</div>
            </div>
            <el-button type="text" class="batch_report" @click="handleReport(item.sessionId)" :disabled="!showReport(item.results)">查看报告</el-button>
          </div>
          <div class="batch_c">
            <div class="c_box" v-for="(val, key) in item.results" :key="val.index">
              <div class="c_header">
                <span class="ellipsis">{{key}}</span>
                <div class="toolTip">{{key}}</div>
              </div>
              <div class="c_main">
                <span class="ellipsis2" :style="{'color':val=== '未开始'?'#999':'#333'}">{{val}}</span>
                <div class="toolTip toolTip2">{{val}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="noData">
        暂无数据
      </div>
    </div>
    <el-pagination
      class="text-center mt-5"
      @current-change="handleCurrentChange"
      :current-page.sync="pager.page"
      :page-size="10"
      layout="prev, pager, next, jumper"
      :total="pager.totalRow"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'MemberBatch',
  props: {
    list: Array,
    pager: Object,
    form: Object,
    loading: Boolean
  },
  data () {
    return {
    }
  },
  methods: {
    query () {
      this.$emit('query')
    },
    reset () {
      this.$emit('reset')
    },
    showReport (obj) {
      const flag = Object.values(obj).some(v => {
        return v === '已完成' || v.includes('总分')
      })
      return flag
    },
    showTips () {
      document.querySelectorAll('.ellipsis').forEach((v, i) => {
        if (v.clientWidth < v.scrollWidth) {
          document.querySelectorAll('.c_header')[i].onmouseover = function () {
            document.querySelectorAll('.c_header .toolTip')[i].style.display = 'flex'
          }
          document.querySelectorAll('.c_header')[i].onmouseout = function () {
            document.querySelectorAll('.c_header .toolTip')[i].style.display = 'none'
          }
        }
      })
      document.querySelectorAll('.ellipsis2').forEach((v, i) => {
        if (v.clientHeight < v.scrollHeight) {
          document.querySelectorAll('.c_main')[i].onmouseover = function () {
            document.querySelectorAll('.c_main .toolTip')[i].style.display = 'flex'
          }
          document.querySelectorAll('.c_main')[i].onmouseout = function () {
            document.querySelectorAll('.c_main .toolTip')[i].style.display = 'none'
          }
        }
      })
    },
    handleCurrentChange (val) {
      this.$emit('currentChange', val)
    },
    handleReport (id) {
      window.open(`/user#/result?sessionId=${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.formModel{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.last{
  float: right;
  margin-right: 0 !important;
  // margin-left: 35px;
}
.batch_m{
  .noData{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 250px;
    color: #666;
    font-size: 14px;
  }
  .batch_box{
    width: 100%;
    border: 2px dashed rgba(112, 112, 112, 0.5);
    border-radius: 2px;
    padding: 16px 20px;
    .batch_h{
      display: flex;
      align-items: center;
      margin-bottom: 14px;
      justify-content: space-between;
      height: 16px;
      .batch_name{
        font-size: 14px;
        line-height: 1;
        color: #333333;
        display: flex;
      }
      .batch_status{
        margin-left: 30px;
      }
    }
    .batch_c{
      display: flex;
      flex-wrap: wrap;
      .c_box{
        width: 32%;
        height: 97px;
        border: 1px solid #E4E4E4;
        border-radius: 1px;
        margin-right: 2%;
        .toolTip{
          position: absolute;
          left: -0.5%;
          top: 40px;
          background: #FFFFFF;
          box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
          width: 101%;
          display: none;
          transition: all 0.3s;
          z-index: 99;
          min-height: 40px;
          padding: 0 10px;
          justify-content: center;
          align-items: center;
          line-height: 20px;
        }
        .toolTip::before {
          content: '';
          border: 10px solid transparent;
          border-bottom-color: #fff;
          -webkit-transform: translateX(-50%);
          transform: translateX(-50%);
          top: -16px;
          left: 50%;
          position: absolute;
        }
        .c_header{
          height: 40px;
          line-height: 40px;
          text-align: center;
          background: #FBFBFB;
          border-bottom: 1px solid #E4E4E4;
          font-size: 14px;
          color: #333;
          width: 100%;
          position: relative;
          span{
            width: 100%;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 10px;
          }
        }
        .c_main{
          width: 100%;
          height: 57px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          color: #333;
          position: relative;
          span{
            padding: 0 10px;
            overflow:hidden;
            text-overflow:ellipsis;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:2;
            line-height: 18px;
          }
          .toolTip2{
            min-height: 57px;
          }
        }
      }
      .c_box:nth-child(n+4){
        margin-top: 12px;
      }
      .c_box:nth-child(3n){
        margin-right: 0;
      }
    }
  }
  .batch_box:nth-child(n+2){
    margin-top: 10px;
  }
}
</style>

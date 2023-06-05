3<template>
  <div class="con-box">
    <div class="con">
    <div class="tabs">
      <div class="box"><i @click="$router.replace(isXia ? '/setting/info?tableCode=' + tableCode :'/read/info?tableCode=' + tableCode)">量表信息</i><span v-show="myPath === '/read/info' "></span></div>
      <span class="icon"><i class="el-icon-arrow-right"></i></span>
      <div class="box"><i @click="$router.replace(isXia ? '/setting/content?tableCode=' + tableCode :'/read/content?tableCode=' + tableCode)">量表内容</i><span v-show="myPath === '/read/content' "></span></div>
      <span class="icon"><i class="el-icon-arrow-right"></i></span>
      <div class="box"><i @click="$router.replace('/read/set?tableCode=' + tableCode)">分数设置</i><span v-show="myPath === '/read/set'"></span></div>
      <span class="icon"><i class="el-icon-arrow-right"></i></span>
      <div class="box"><i @click="$router.replace( isXia ? '/setting/show?tableCode=' + tableCode :'/read/show?tableCode=' + tableCode)">报告展示</i><span  v-show="myPath === '/read/show'"></span></div>
    </div>
    <div class="right">
      <el-button class="back" :class="[ isXia ? 'edit': '']" type="success" size="mini" @click="back" >返回</el-button>
      <el-button v-if="type !== 3 || onlineStatus !== '下线'" class="edit" type="success" size="mini" :disabled="onlineStatus == '上线'" @click="edit()">编辑</el-button>
      </div>
    </div>
    <!-- <router-view ref="child"/> -->
    <!-- <router-view /> -->
    <div v-if="show">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'read',
  data () {
    return {
      myPath: '',
      flag: true,
      type: 0,
      show: false,
      price: ''
    }
  },
  watch: {
    $route () {
      this.init()
    }
  },
  computed: {
    ...mapState({
      tableCode: state => state.operate.tableCode,
      onlineStatus: state => state.operate.onlineStatus
    }),
    isXia () {
      const isXia = this.$route.query.isXia
      if (isXia) {
        return true
      }
      return false
    }
  },
  created () {
    this.$store.dispatch('getTableInfo', this.$route.query.tableCode).then(
      (res) => {
        this.show = true
        this.price = res.price
      }
    )
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.myPath = this.$route.path
      if (this.myPath === '/read/info') {
        this.type = 1
      } else if (this.myPath === '/read/content') {
        this.type = 2
      } else if (this.myPath === '/read/set') {
        this.type = 3
      } else if (this.myPath === '/read/show') {
        this.type = 4
      } else {
        this.type = 0
      }
    },
    edit () {
      const tableCode = this.tableCode
      const type = this.type
      // console.log(type)
      if (type === 1) {
        this.$router.push('/setting/info?tableCode=' + tableCode)
      } else if (type === 2) {
        this.$router.push('/setting/content?tableCode=' + tableCode)
      } else if (type === 3) {
        if (this.onlineStatus === '下线') {
          this.$router.push('/read/set?tableCode=' + tableCode)
        } else {
          this.$router.push('/setting/set?tableCode=' + tableCode)
        }
      } else if (type === 4) {
        this.$router.push('/setting/show?tableCode=' + tableCode)
      }
    },
    back () {
      const tableCode = this.tableCode
      if (this.isXia) {
        this.$router.push('/read/set?tableCode=' + tableCode)
      } else {
        this.$router.replace('/operate/list')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.con-box{
  padding-left: 40px;
}
.con{
    display: flex;
    padding-top: 32px ;
    padding-bottom: 32px ;
    padding-right: 40px;
    .tabs{
      width: 1000px;
      min-width: 500px;
      display: flex;
      height: 40px;
      background-color: #FBFBFB;
      border:1px solid #ececec;
      .box{
        flex: 9;
        position: relative;
        text-align: center;
        span{
          display: inline-block;
          position: absolute;
          width: 34px;
          height: 3px;
          background-color: #34B7B9;
          left: 50%;
          bottom: 0px;
          transform: translateX(-50%);
        }
        i{
          cursor: pointer;
          line-height: 40px;
          font-size: 18px;
          font-weight: 500;
          font-style: normal;
          color: #34B7B9;
        }
      }
      .icon{
        flex: 1;
        display: flex;
        align-items: center;
        .el-icon-arrow-right{
          font-size: 21px;
          color: #CCCCCC;
        }
      }
    }
    .right{
      margin-left: 22px;
      height: 40px;
      display: flex;
      align-items: center;
    }
}
.back {
  color: #34B7B9  !important;
  border: 1px solid #34B7B9 !important;
  background-color: #FFFFFF;
}
.edit{
  color: #FFFFFF  !important;
  border:0 !important;
  background-color: #34B7B9;
}
</style>

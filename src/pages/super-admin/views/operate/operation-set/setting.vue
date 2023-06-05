<template>
  <div class="con-box">
    <div class="con">
    <div class="tabs">
      <!-- <div>{{step}}{{contentFlag}}{{setFlag}}{{showFlag}}</div> -->
      <div class="box"><i @click="go('/setting/info', 1)" class="green">量表信息</i><span v-show="myPath === '/setting/info' "></span></div>
      <span class="icon"><i class="el-icon-arrow-right"></i></span>
      <div class="box"><i @click="go('/setting/content', 2)" :class="{green: contentFlag}">量表内容</i><span v-show="myPath === '/setting/content' "></span></div>
      <span class="icon"><i class="el-icon-arrow-right"></i></span>
      <div class="box"><i @click="go( onlineStatus ==='下线'? '/read/set?tableCode=' + tableCode + '&isXia=' + true :'/setting/set', 3)"  :class="{green: setFlag}">分数设置</i><span v-show="myPath === '/setting/set'"></span></div>
      <span class="icon"><i class="el-icon-arrow-right"></i></span>
      <div class="box"><i @click="go('/setting/show', 4)"  :class="{green: showFlag}">报告展示</i><span  v-show="myPath === '/setting/show'"></span></div>
    </div>
    <div class="right" >
      <el-button v-if="configurationStatus == '已完成'" type="success" size="mini" @click="$router.go(-1)">返回</el-button>
      <el-button v-else type="success" size="mini" @click="next" >{{type === 4 ? '完成配置': '保存并下一步'}}</el-button>
    </div>
    </div>
    <div v-if="show">
      <router-view ref="child"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'setting',
  data () {
    return {
      myPath: '',
      flag: true,
      type: 0,
      show: false,
      contentFlag: false,
      setFlag: false,
      showFlag: false,
      configurationStatus: '',
      onlineStatus: '',
      tableCode: '',
      price: 0,
      step: '' // 第几步
    }
  },
  watch: {
    $route (nV, oV) {
      this.step = this.$store.state.operate.configStep
      // 避免地址栏输入跳转
      if (this.step && nV.meta.step > this.step + 1) {
        this.$router.replace({
          path: oV.path,
          query: this.$route.query
        })
        return
      }
      this.init()
      this.set()
    }
  },
  created () {
    if (this.$route.query.tableCode) {
      this.$store.dispatch('getTableInfo', this.$route.query.tableCode).then(
        (res) => {
          // console.log(res)
          this.show = true
          this.configurationStatus = res.configurationStatus
          this.onlineStatus = res.onlineStatus
          this.tableCode = res.tableCode
          this.price = Number(res.price)
          // 存下go判断需要的东西
          this.step = this.$store.state.operate.configStep
          // console.log(this.step, '当前的step到了第几步')
          // 继续配置的重定向
          this.set()
          if (this.step === 1) {
            this.$router.replace({
              path: '/setting/content',
              query: this.$route.query
            })
          } else if (this.step === 2) {
            this.$router.replace({
              path: '/setting/set',
              query: this.$route.query
            })
          } else if (this.step === 3) {
            this.$router.replace({
              path: '/setting/show',
              query: this.$route.query
            })
          }
        }
      )
    } else {
      this.show = true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.myPath = this.$route.path
      if (this.myPath === '/setting/info') {
        this.type = 1
      } else if (this.myPath === '/setting/content') {
        this.type = 2
        this.contentFlag = true
      } else if (this.myPath === '/setting/set') {
        this.type = 3
        this.setFlag = true
      } else if (this.myPath === '/setting/show') {
        this.type = 4
        this.showFlag = true
      } else {
        this.type = 0
      }
    },
    next () {
      this.$refs.child.save()
    },
    haveChange (name) {
      if (this.$refs.child.isChange) {
        this.$confirm('切换至其他模块，未保存的内容将全部丢失', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.replace({
            path: name,
            query: this.$route.query
          })
        }).catch(() => {})
      } else {
        this.$router.replace({
          path: name,
          query: this.$route.query
        })
      }
    },
    go (name, type) {
      if (name === this.$route.path) return
      if (type === 1) {
        this.$store.dispatch('getTableInfo', this.$route.query.tableCode).then(
          (res) => {
            this.price = Number(res.price)
            this.haveChange(name)
          })
      } else if (type === 2) {
        if (this.step >= 1) {
          this.haveChange(name)
        }
      } else if (type === 3) {
        if (this.step >= 2) {
          this.haveChange(name)
        }
      } else if (type === 4) {
        if (this.step >= 3) {
          this.haveChange(name)
        }
      }
    },
    set () {
      if (this.step >= 1) {
        this.contentFlag = true
        this.setFlag = false
        this.showFlag = false
      }
      if (this.step >= 2) {
        this.setFlag = true
        this.showFlag = false
      }
      if (this.step >= 3) {
        this.showFlag = true
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
          color:#B1B1B1;
        }
        .green{
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
</style>

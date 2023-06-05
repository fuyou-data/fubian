<template>
<div class="workbench">
  <!-- header -->
  <OrganAdminHeader />
  <!-- aside -->
  <div class="workbench-aside">
    <el-menu text-color="#666666" :default-active="activerouter" active-text-color="#34B7B9" :router="true">
      <el-menu-item index="/overview">
        <span slot="title" class="big-span">数据概览</span>
      </el-menu-item>
      <el-menu-item index="/member-list">
      <!-- <el-menu-item index="/"> -->
        <span slot="title" class="big-span">成员列表</span>
      </el-menu-item>
      <el-submenu :index="batch.id + ''" v-for="batch in asideList" :key="batch.id">
        <template slot="title">
          <span class="title-span">{{ batch.name }}</span>
        </template>
        <el-menu-item-group>
          <!-- <el-menu-item class="set" index=""><span>批次管理</span></el-menu-item> -->
          <el-menu-item class="set" :index="`/batch-users?id=${batch.id}&configFixed=${batch.configFixed}`"><span>批次管理</span></el-menu-item>
          <!-- <el-menu-item class="set" index="/index"><span>数据统计</span></el-menu-item> -->
          <el-menu-item class="set" :index="`/statistic?id=${batch.id}`"><span>数据统计</span></el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/task">
        <span slot="title">任务管理</span>
      </el-menu-item>
    </el-menu>
  </div>
  <!-- content -->
  <div class="workbench-wrap">
    <router-view></router-view>
  </div>
</div>
</template>

<script>
import OrganAdminHeader from '@/pages/organ-admin/components/OrganAdminHeader.vue'
import { batchMine } from '@api/index'
export default {
  name: 'workbench-index',
  components: {
    OrganAdminHeader
  },
  data () {
    return {
      asideList: [],
      activerouter: ''
    }
  },
  created () {
    this.activerouter = this.$route.fullPath
    this.getInfo()
  },
  watch: {
    $route (newV, oldV) {
      this.activerouter = this.$route.fullPath
    }
  },
  methods: {
    // 侧边栏的数据
    async getInfo () {
      const res = await batchMine({})
      this.asideList = res.data.items
      this.orgName = res.data.items[0].organization.orgName || 0
    }
  }
}
</script>

<style lang="less">
@asideBtnW: 18px;
@menuW: @asideBtnW - 240px;
.workbench {
  height: 100%;
}
// 隐藏滚动条好看点
.workbench-aside::-webkit-scrollbar {display:none}
.workbench-aside {
  overflow: auto;
  width: 240px;
  position: fixed;
  top: 53px;
  left: 0;
  bottom: 0;
  // padding-right: @asideBtnW;
  background-color: #fff;
  border-right: 1px solid #e4e4e4;
  // border-right: none;
  box-sizing: border-box;
  z-index: 9;
  transform: translateX(0);
  transition: transform 0.3s;
  .workbench-aside-wrap {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .el-menu{
    .big-span{
      font-size: 16px;
    }
    .el-menu-item.is-active{
      span{
        padding-bottom: 5px;
        border-bottom: 1px solid #34B7B9;
      }
    }
    .el-submenu.is-active{
      .set.is-active{
        span{
          padding-bottom: 5px;
          border-bottom: 1px solid #34B7B9;
        }
      }
    }
    .el-menu-item:focus{
      background-color: #fff;
    }
    .el-menu-item:hover{
      background-color: #fff;
    }
    .el-submenu__title:hover{
      background-color: #fff;
    }
  }
}
.workbench-wrap {
  padding: 53px 0 40px 240px;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  transition: padding-left 0.3s;
}
.title-span {
  font-size: 16px;
  color: #666666;
}
</style>

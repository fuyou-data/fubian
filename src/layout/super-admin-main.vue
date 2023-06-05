<template>
  <div class="workbench">
    <!-- header -->
    <SuperAdminHeader/>
    <!-- aside -->
    <div class="workbench-aside" :class="{hidden: !show}">
      <div class="workbench-aside-wrap">
        <el-menu
          background-color="#fff"
          text-color="#666"
          active-text-color="#34B7B9"
          :default-active="routerPath"
          :router="true">
          <el-menu-item
            v-if="asideList.includes('数据概览')"
            index="/overview"
            data-menu="true"
          >
            <span class="sub-title">数据概览</span>
          </el-menu-item>
          <el-menu-item
            v-if="enableUserManage && asideList.includes('成员列表')"
            index="/members"
            data-menu="true"
          >
            <span class="sub-title">成员列表</span>
          </el-menu-item>
          <el-menu-item
            v-if="asideList.includes('批次管理')"
            index="/batch"
            data-menu="true"
          >
            <span class="sub-title">批次管理</span>
          </el-menu-item>
          <el-menu-item
            v-if="openDiversion && asideList.includes('疏导管理')"
            index="/cbt"
            data-menu="true"
          >
            <span class="sub-title">疏导管理</span>
          </el-menu-item>
          <!-- <el-submenu index="/organ" data-menu="true" v-if="currRole === 'superadmin' || currRole === 'admin_org'">
            <span class="big-title" slot="title">部门管理</span>
            <el-menu-item-group>
              <el-menu-item index="/organ">
                <span class="sub-title">部门列表</span>
              </el-menu-item>
              <el-menu-item index="/members">
                <span class="sub-title">成员列表</span>
              </el-menu-item>
              <el-menu-item index="/batch">
                <span class="sub-title">批次配置</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
          <el-submenu
            v-if="asideList.includes('量表管理') && (currRole === 'superadmin' || currRole === 'admin_table')"
            index="/operate"
          >
            <span slot="title">量表管理</span>
            <el-menu-item-group style="padding-bottom: 14px;">
              <el-menu-item index="/operate/classList" style="margin-top: -14px;">
                <span class="sub-title">自评分类</span>
              </el-menu-item>
              <el-menu-item index="/operate/list">
                <span class="sub-title">自评量表配置</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item
            v-if="asideList.includes('任务管理')"
            index="/tasks-manage"
            data-menu="true"
          >
            <span class="sub-title" slot="title">任务管理</span>
          </el-menu-item>
          <el-menu-item
            v-if="asideList.includes('日志管理')"
            index="/journal-manage"
            data-menu="true"
          >
            <span class="sub-title" slot="title">日志管理</span>
          </el-menu-item>
          <el-menu-item index="/version" data-menu="true">
            <span class="sub-title" slot="title">版本管理</span>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- <div class="workbench-aside-btn" @click="show = !show">
        <i :class="iconName"></i>
      </div> -->
    </div>
    <!-- content -->
    <div class="workbench-wrap" :class="{hidden: !show}">
      <transition name="el-fade-in">
        <router-view style="min-height: calc(100vh - 93px);" />
      </transition>
    </div>
  </div>
</template>

<script>
// import SuperAdminHeader from '@components/SuperAdminHeader'
import SuperAdminHeader from '@/pages/super-admin/components/SuperAdminHeader.vue'
import asideConfig from '@/config/aside.js'
export default {
  name: 'workbench-index',
  components: {
    SuperAdminHeader
  },
  data () {
    return {
      asideList: asideConfig.super.show,
      show: true,
      myPath: '',
      routes: [
        '/index',
        '/overview',
        '/organ',
        '/members',
        '/batch',
        '/cbt',
        '/operate/classList',
        '/operate/list',
        '/tasks-manage',
        '/journal-manage',
        '/version'
      ]
    }
  },
  computed: {
    // 是否开启疏导
    openDiversion () {
      return localStorage.openDiversion === 'true'
    },
    enableUserManage () {
      return localStorage.enableUserManage === 'true'
    },
    currRole () {
      return localStorage.type
    },
    iconName () {
      return this.show ? 'el-icon-arrow-left' : 'el-icon-arrow-right'
    },
    // 导航选中效果
    menuItemClass () {
      return (path) => {
        const isActive = this.myPath === path
        return { 'is-active': isActive }
      }
    },
    // 路由地址
    routerPath () {
      const path = this.$route.path
      const has = this.routes.find(v => path.indexOf(v) !== -1)
      if (has) {
        return has
      } else if (
        path.indexOf('/setting') ||
        path.indexOf('/read')
      ) {
        return '/operate/list'
      } else {
        return path
      }
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@asideBtnW: 18px;
@menuW: @asideBtnW - 240px;
.workbench {
  height: 100%;
}
.workbench-aside {
  width: 208px;
  position: fixed;
  top: 53px;
  left: 0;
  bottom: 0;
  // padding-right: @asideBtnW;
  background-color: #fff;
  border-right: 1px solid #E4E4E4;
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
  .el-menu {
    border: none;
    .big-title {
      font-size: 16px;
    }
  }
  .el-submenu[data-menu="true"],
  .el-menu-item[data-menu="true"] {
    border-bottom: 1px solid #E4E4E4;
  }
  .el-menu-item {
    &:hover {
      background-color: rgba(255,255,255 ,.1) !important;
    }
    &.is-active {
      background-color: rgba(255,255,255 ,.1) !important;
      font-weight: bold !important;
      .sub-title {
        border-bottom: 1px solid #34B7B9;
      }
    }
  }
  .el-submenu__title {
    &:hover {
      background-color: rgba(255,255,255 ,.1) !important;
    }
    &.is-active {
      background-color: rgba(255,255,255 ,.1) !important;
      font-weight: bold !important;
      .sub-title {
        border-bottom: 1px solid #34B7B9;
      }
    }
  }
  // .el-submenu__title {
  //   height: 50px;
  //   line-height: 50px;
  //   i {
  //     color: #fff;
  //   }
  // }
  .iconfont {
    width: 14px;
    height: 14px;
  }
  .el-submenu {
    border-bottom: 1px solid #E4E4E4;
  }
}
// .workbench-aside-btn {
//   position: absolute;
//   top: 0;
//   right: 0;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: @asideBtnW;
//   height: 100%;
//   color: #fff;
//   background-color: rgba(16, 104, 207, 1);
//   cursor: pointer;
//   &:hover {
//     background-color: rgba(16, 104, 207, 0.8);
//   }
// }
.workbench-aside.hidden {
  transform: translateX(@menuW);
}
.workbench-wrap {
  padding: 53px 0 40px 240px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  transition: padding-left 0.3s;
}
.workbench-wrap.hidden {
  padding-left: 280px + @menuW;
}
</style>

import Vue from 'vue'
import VueRouter from 'vue-router'
import MainPage from '@/layout/organ-admin-main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '分部工作台',
    redirect: 'overview',
    component: MainPage,
    children: [
      {
        path: 'index',
        name: '分部首页',
        component: resolve => require(['../views/index.vue'], resolve)
      },
      {
        path: 'batch-users',
        name: '批次用户管理',
        component: resolve => require(['../views/batch-users/batch-users.vue'], resolve)
      },
      {
        path: 'member-list',
        name: '用户管理',
        component: resolve => require(['../views/member-list/member-list.vue'], resolve)
      },
      {
        path: 'overview',
        name: '数据概览',
        component: resolve => require(['../views/overview/index.vue'], resolve)
      },
      {
        path: 'statistic',
        name: '数据统计',
        component: resolve => require(['../views/statistic.vue'], resolve)
      },
      {
        path: 'ucenter',
        name: '分部个人中心',
        component: resolve => require(['../views/ucenter.vue'], resolve)
      },
      {
        path: 'task',
        name: '任务管理',
        component: resolve => require(['../views/task.vue'], resolve)
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

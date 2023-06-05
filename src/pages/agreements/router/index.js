import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/privacy',
    name: '复变云愈隐私政策',
    component: resolve => require(['../views/privacy.vue'], resolve)
  },
  {
    path: '/user',
    name: '复变云愈用户服务协议',
    component: resolve => require(['../views/user.vue'], resolve)
  }
]

const router = new VueRouter({
  routes
})

export default router

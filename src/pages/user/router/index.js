import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/result',
    name: 'Result',
    component: resolve => require(['../views/result.vue'], resolve)
  }
]

const router = new VueRouter({
  routes
})

export default router

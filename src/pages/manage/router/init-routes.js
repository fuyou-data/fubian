const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '首页',
    component: resolve => require(['../views/login.vue'], resolve)
  },
  {
    path: '/set',
    name: '配置',
    component: resolve => require(['../views/set.vue'], resolve)
  }
]
export default routes

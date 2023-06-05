import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import IconFont from '@/components/IconFont'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/super-admin-main.css'

Vue.config.productionTip = false
Vue.use(IconFont)
Vue.use(Element)

new Vue({
  router,
  store,
  render: h => h(App)

}).$mount('#app')

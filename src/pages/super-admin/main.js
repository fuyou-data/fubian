import Vue from 'vue'
import App from './App.vue'
import router from './router'
import IconFont from '@/components/IconFont'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/super-admin-main.css'

import store from './store'
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.use(IconFont)
Vue.use(Element)

new Vue({
  store,
  router,
  render: h => h(App)

}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/super-admin-main.css'

Vue.config.productionTip = false
Vue.use(Element)

new Vue({
  render: h => h(App)
}).$mount('#app')

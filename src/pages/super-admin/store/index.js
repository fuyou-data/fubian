import Vue from 'vue'
import Vuex from 'vuex'
import operate from './modules/operate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tableCode: '',
    selfTypeList: []
  },
  mutations: {
    SET_TABLE_Code (state, value) {
      state.tableCode = value
    },
    SET_SELF_Type (state, value) {
      state.selfTypeList = value
    }
  },
  modules: {
    operate
  }
})

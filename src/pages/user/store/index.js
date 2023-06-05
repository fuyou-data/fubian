import Vue from 'vue'
import Vuex from 'vuex'
import test from './modules/test'
import { getUserBatch } from '@/api/modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    role: 0,
    sessionId: 0,
    orgName: '',
    configFixed: 0,
    userInfo: [],
    userInfoContent: {},
    reportEnabled: 0,
    cameraEnabled: 0,
    aiEvalCamEnabled: 0,
    tables: []
  },
  mutations: {
    SET_ROLES (state, value) {
      state.role = value
    },
    SET_SESSIONID (state, value) {
      state.sessionId = value
    },
    SET_ORGAN_NAME (state, value) {
      state.orgName = value
    },
    SET_CONFIG_FIXED (state, value) {
      state.configFixed = value
    },
    SET_USER_INFO (state, value) {
      state.userInfo = value
    },
    SET_REPORT (state, value) {
      state.reportEnabled = value
    },
    SET_CAMERA (state, value) {
      state.cameraEnabled = value
    },
    SET_CAMERA_OTHER (state, value) {
      state.aiEvalCamEnabled = value
    },
    SET_TABLES (state, value) {
      state.tables = value
    },
    SET_USER_INFO_CONTENT (state, value) {
      state.userInfoContent = value
    },
    INIT (state) {
      state.role = 0
      state.sessionId = 0
      state.orgName = ''
      state.configFixed = 0
      state.userInfo = []
      state.userInfoContent = {}
      state.reportEnabled = 0
      state.cameraEnabled = 0
      state.tables = []
      if (sessionStorage.tables) sessionStorage.removeItem('tables')
    }
  },
  actions: {
    getInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getUserBatch().then(
          ({ data = {} }) => {
            const {
              isOrgMember,
              sessionId,
              orgName,
              configFixed,
              selfEvalCamEnabled,
              reportDisplayEnabled,
              aiEvalCamEnabled,
              personalInfoCol,
              personalInfo,
              tables
            } = data
            if (isOrgMember === -1) {
              commit('SET_ROLES', -1)
              resolve('非机构用户')
              return
            }
            if (!tables || tables.length === 0) {
              commit('SET_ROLES', 1)
              resolve('没有待做批次')
              return
            }
            commit('SET_ROLES', 2)
            commit('SET_SESSIONID', sessionId)
            commit('SET_ORGAN_NAME', orgName)
            commit('SET_CONFIG_FIXED', configFixed)
            commit('SET_CAMERA', selfEvalCamEnabled)
            commit('SET_CAMERA_OTHER', aiEvalCamEnabled)
            commit('SET_REPORT', reportDisplayEnabled)
            commit('SET_USER_INFO', personalInfoCol)
            commit('SET_USER_INFO_CONTENT', personalInfo)
            commit('SET_TABLES', tables)
            resolve(data)
          }
        ).catch(
          err => {
            reject(err)
          }
        )
      })
    }
  },
  modules: {
    test
  }
})

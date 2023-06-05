
import { tableInfo } from '@/api/modules/operate'
export default {
  state: {
    showReadFlag: false,
    tableCode: '',
    tableName: '',
    tableCnName: '',
    tableEnName: '',
    tableLogo: '',
    selfTableType: {},
    applicablePeople: '',
    evaluationDirection: '',
    introduction: '',
    price: 0,
    minTimeMinute: 0,
    maxTimeMinute: 0,
    tableType: 0,
    questions: [],
    tips: [],
    scoreType: [],
    totalScoreCriteria: {},
    factorScoreCriteria: [],
    insReportDisplayType: [],
    hosReportDisplayType: [],
    configurationStatus: '未完成',
    onlineStatus: '--',
    configStep: 0
  },
  getters: {},
  mutations: {
    SET_TABLE_INFO (state, data) {
      const { name, value } = data
      state[name] = value
    },
    SET_TABLE_INIT (state) {
      const params = [
        ['tableCode', ''],
        ['tableName', ''],
        ['tableCnName', ''],
        ['tableEnName', ''],
        ['tableLogo', ''],
        ['selfTableType', {}],
        ['applicablePeople', ''],
        ['evaluationDirection', ''],
        ['introduction', ''],
        ['price', 0],
        ['minTimeMinute', 0],
        ['maxTimeMinute', 0],
        ['tableType', 0],
        ['questions', []],
        ['tips', []],
        ['scoreType', []],
        ['totalScoreCriteria', {}],
        ['factorScoreCriteria', []],
        ['insReportDisplayType', []],
        ['hosReportDisplayType', []],
        ['configurationStatus', '未完成'],
        ['onlineStatus', '--'],
        ['configStep', 0]
      ]
      params.forEach(item => {
        state[item[0]] = item[1]
      })
    }
  },
  actions: {
    getTableInfo ({ commit }, tableCode) {
      return new Promise((resolve, reject) => {
        commit('SET_TABLE_INIT')
        tableInfo(tableCode).then(
          ({ data = {} }) => {
            const params = [
              'tableCode',
              'tableName',
              'tableCnName',
              'tableEnName',
              'tableLogo',
              'selfTableType',
              'applicablePeople',
              'evaluationDirection',
              'introduction',
              'price',
              'minTimeMinute',
              'maxTimeMinute',
              'tableType',
              'questions',
              'tips',
              'scoreType',
              'totalScoreCriteria',
              'factorScoreCriteria',
              'insReportDisplayType',
              'hosReportDisplayType',
              'configurationStatus',
              'onlineStatus',
              'configStep'
            ]
            params.forEach(name => {
              if (data[name]) commit('SET_TABLE_INFO', { name, value: data[name] })
            })
            resolve(data)
          }
        ).catch((err) => {
          reject(err)
        })
      })
    }
  }
}

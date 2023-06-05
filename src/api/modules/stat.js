import fetch from '../http.js'

// cbt统计列表
export const cbtTheme = () => fetch({
  url: '/api/admin/cbtTheme/statistics',
  method: 'get'
})
// cbt统计table
export const cbtUserStatistics = (params) => fetch({
  url: '/api/admin/cbtUser/statistics',
  method: 'get',
  params
})

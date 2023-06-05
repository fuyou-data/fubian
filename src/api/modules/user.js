import fetch from '../http.js'

/*****************************
 *     用户测试相关配置
 *****************************/

// 获取最新未完成的批次
export const getUserBatch = () => fetch({
  url: '/api/user/batch/tables',
  method: 'get'
}, false)

/*****************************
 *           做题
 *****************************/

// 获取测试结果
export const getReportRes = (params, errMessage = true) => fetch({
  url: '/api/user/batch/report',
  method: 'get',
  params
}, errMessage)

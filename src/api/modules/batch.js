import fetch from '../http.js'

// 批次相关

// 删除批次
export const delBatch = id => fetch({
  url: '/api/batch/delete',
  method: 'post',
  data: { id }
})

// 创建批次
export const createBatch = data => fetch({
  url: '/api/batch/new',
  method: 'post',
  data
}, false)

// 更新批次
export const updateBatch = (id, info = {}) => fetch({
  url: '/api/batch/update',
  method: 'post',
  data: {
    id,
    ...info
  }
})

// 校验批次名称
export const addName = data => fetch({
  url: '/api/batch/check/batchName',
  method: 'post',
  data
}, false)

// 批次详情
export const batchInfo = id => fetch({
  url: '/api/batch/info',
  method: 'get',
  params: { id }
})

// 批次列表
export const batchLists = params => fetch({
  url: '/api/batch/find',
  method: 'get',
  params
})

// 批次管理里面添加一个用户获取的列表
export const memberList = (params) => fetch({
  url: '/api/admin/userList',
  method: 'get',
  params
})

// 获取指定批次测评结果统计饼图
export const statisticsChart = params => fetch({
  url: '/api/batch/statistics/chart',
  method: 'get',
  params
})
// 获取指定批次测评结果统计图
export const statisticsTable = params => fetch({
  url: '/api/batch/statistics/table',
  method: 'get',
  params
})
// 下载情绪异常名单
export const abnormalList = params => fetch({
  url: '/api/batch/statistics/abnormalList',
  method: 'get',
  params
})
// 新增普通管理员
export const adminConfig = (data) => fetch({
  url: '/api/batch/normalAdminConfig',
  method: 'post',
  data
})
// 配置普通管理员
export const getAdminConfig = params => fetch({
  url: '/api/batch/normalAdminConfig',
  method: 'get',
  params
})
// 更新普通管理员
export const updateConfig = (data) => fetch({
  url: '/api/batch/normalAdminConfig/update',
  method: 'post',
  data
})
// 删除普通管理员
export const deleteConfig = (data) => fetch({
  url: '/api/batch/normalAdminConfig/delete',
  method: 'post',
  data
})

// 机构导出功能
export const statisticsExport = (data) => fetch({
  url: '/api/admin/export',
  method: 'post',
  data
})
// 导出的详细列表
export const apiExport = params => fetch({
  url: '/api/admin/export',
  method: 'get',
  params
})
// 导出报告
export const reportsExport = (data) => fetch({
  url: '/api/admin/exportReport',
  method: 'post',
  data
})

// 获取所有量表（不包含下线的）
export const getAllTable = () => fetch({
  url: '/api/table/all',
  method: 'get'
})

// 获取自定义列表（所有的包含下线的）
export const getCstTableList = () => fetch({
  url: '/api/table/customization/tableList  ',
  method: 'get'
})

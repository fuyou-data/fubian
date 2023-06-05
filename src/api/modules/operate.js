import fetch from '../http.js'

// 量表列表
export const tableList = params => fetch({
  url: '/api/table/customization/tableList',
  method: 'get',
  params
})

// 提交自定义量表信息
export const createTableInfo = data => fetch({
  url: '/api/table/customization/tableInfo',
  method: 'post',
  data
})

// 获取自定义量表所有信息
export const tableInfo = tableCode => fetch({
  url: '/api/table/customization/tableInfo',
  method: 'get',
  params: { tableCode }
})

// 提交自定义量表的内容
export const postTableQuestions = (tableCode, questions) => fetch({
  url: '/api/table/customization/questions',
  method: 'post',
  data: {
    tableCode,
    questions
  }
})

// 提交报告展示信息
export const tableReport = data => fetch({
  url: '/api/table/customization/report',
  method: 'post',
  data
})

// 提交报告分数设置
export const scoreSetting = data => fetch({
  url: '/api/table/customization/scoresetting',
  method: 'post',
  data
})

// 更改配置状态和上线状态
export const tableStatus = data => fetch({
  url: '/api/table/customization/status',
  method: 'post',
  data
}, false)

// 自评分类列表
export const selfTableTypeList = params => fetch({
  url: '/api/table/selfTableType/retrieveType',
  method: 'get',
  params
})

// 自评分类新增
export const selfTableTypeAdd = data => fetch({
  url: '/api/table/selfTableType/createType',
  method: 'post',
  data
})

// 自评分类更新
export const selfTableTypeUpdate = data => fetch({
  url: '/api/table/selfTableType/updateType',
  method: 'post',
  data
})

// 自评分类删除
export const selfTableTypeDelete = data => fetch({
  url: '/api/table/selfTableType/deleteType',
  method: 'post',
  data
})

// 自评量表删除
export const selfTableDelete = data => fetch({
  url: '/api/table/customization/deleteTable',
  method: 'post',
  data
}, false)

import fetch from '../http.js'

// 成员列表
export const memberList = params => fetch({
  url: '/api/admin/userList',
  method: 'get',
  params
})

// 新增成员
export const addMember = data => fetch({
  url: '/api/admin/add/user',
  method: 'post',
  data
})

// 删除成员
export const deleteMember = data => fetch({
  url: '/api/admin/delete/user',
  method: 'post',
  data
})

// 获取成员批量新增的模板文件
export const memberFile = params => fetch({
  url: '/api/admin/getTemplate',
  method: 'get',
  params
})

// 为成员设置部门
export const setOrg = data => fetch({
  url: '/api/admin/org/set',
  method: 'post',
  data
}, false)

// 成员详情
export const memberDetail = params => fetch({
  url: '/api/admin/userDetail',
  method: 'get',
  params
})

// 更改成员的名字和密码
export const editInfo = data => fetch({
  url: '/api/admin/update/user',
  method: 'post',
  data
})

// 日志列表
export const journalList = params => fetch({
  url: '/api/admin/logRecordList',
  method: 'get',
  params
})

// 获取管理员账号列表
export const userList = params => fetch({
  url: '/api/admin/list',
  method: 'get',
  params
})

// 导出系统数据
export const exportSystemData = () => fetch({
  url: '/api/admin/export/systemData',
  method: 'post'
})

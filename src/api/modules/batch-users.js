import fetch from '../http.js'

// 获取名单上传的维度
export const getCustomInfoCol = (batchId) => fetch({
  url: '/api/batch/customInfoCol',
  method: 'get',
  params: {
    batchId
  }
})

// 获取批次用户列表
export const postUserList = (data) => fetch({
  url: '/api/batch/users/list',
  method: 'post',
  data
})

// 批次用户列表增加
export const userCreate = (data) => fetch({
  url: '/api/batch/user/create',
  method: 'post',
  data
})
export const userCreateMore = (data) => fetch({
  url: '/api/batch/users',
  method: 'post',
  data
})

// /api/batch/user/delete
export const deleteUser = (data) => fetch({
  url: '/api/batch/user/delete',
  method: 'post',
  data
})

import fetch from '../http.js'

/** 机构相关接口 **/

/** get请求 **/

// 获取机构列表
export const getOrgList = params => fetch({
  url: '/api/organ/list',
  method: 'get',
  params
})

// 获取机构信息
export const getOrgDetail = orgID => fetch({
  url: `/api/organ/detail/${orgID}`,
  method: 'get'
})

// 验证机构名是否存在
export const checkOrgName = orgName => fetch({
  url: '/api/organ/check/orgName',
  method: 'get',
  params: {
    orgName
  }
}, false)

// 验证用户名是否存在
export const checkUsername = adminName => fetch({
  url: '/api/admin/check/adminName',
  method: 'get',
  params: {
    adminName
  }
}, false)

/** post请求 **/

// 获取某个批次量表的穿梭格式信息
export const getOrginTable = params => fetch({
  url: '/api/table/shuttleFramesForBatch',
  method: 'get',
  params
})

// 添加机构
export const orgAdd = data => fetch({
  url: '/api/organ/add',
  method: 'post',
  data
})

// 更新机构信息
export const orgUpdate = data => fetch({
  url: '/api/organ/update',
  method: 'post',
  data
})

// 删除机构
export const orgDelete = orgID => fetch({
  url: `/api/organ/delete/${orgID}`,
  method: 'post'
})

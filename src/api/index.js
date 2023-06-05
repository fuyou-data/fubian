import fetch from './http.js'

// 公共信息

// 获取侧边栏批次列表
export const batchMine = () => fetch({
  url: '/api/batch/mine',
  method: 'get'
})
// 获取个人信息
export const adminMe = () => fetch({
  url: '/api/admin/me',
  method: 'get'
})
// 修改密码
export const passwordUpdate = data => fetch({
  url: '/api/admin/password/update',
  method: 'post',
  data
})
// 获取机构名称
export const organDeatil = id => fetch({
  url: `/api/organ/detail/${id}`,
  method: 'get'
})
// 发送机构的报告名称 && logo
export const sendReport = data => fetch({
  url: '/api/organ/element/upload',
  method: 'post',
  data
})
// 获取骑牛token
export const qiniuToken = params => fetch({
  url: '/api/qiniu/token',
  method: 'get',
  params
})
// 上传图片
// export const logoUpload = data => fetch({
//   url: '/api/organ/logo/upload',
//   method: 'post',
//   data
// })

// 获取数据概览饼图
export const pieData = () => fetch({
  url: '/api/admin/dataOverview/pieChart',
  method: 'get'
})

// 获取数据概览饼图
export const barData = params => fetch({
  url: '/api/admin/dataOverview/barChart',
  method: 'get',
  params
})

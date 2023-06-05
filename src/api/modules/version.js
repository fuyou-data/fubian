import fetch from '../http.js'

// 版本列表
export const upPackageList = params => fetch({
  url: '/api/admin/upPackage/list',
  method: 'get',
  params
})

// 获取升级结果
export const upPackageInfo = params => fetch({
  url: '/api/admin/upPackage/info',
  method: 'get',
  params
}, false)

// 升级
export const upPackageUp = data => fetch({
  url: '/api/admin/upPackage/up',
  method: 'post',
  data
}, false)
// 版本
export const versionInfo = () => fetch({
  url: '/api/admin/system/version/info',
  method: 'get'
}, false)

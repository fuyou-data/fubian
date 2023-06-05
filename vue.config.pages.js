const packageInfo = require('./package.json')
const pagesArr = [
  {
    name: 'super-admin',
    title: '系统管理后台',
    rename: 'admin'
  },
  {
    name: 'login',
    title: '系统管理后台'
  },
  {
    name: 'user',
    title: '系统管理后台'
  },
  {
    name: 'organ-admin',
    title: '复变云愈系统后台',
    rename: 'workbench'
  },
  {
    name: 'manage',
    title: '复变云愈超管后台'
  },
  {
    name: 'agreements',
    title: '复变云愈'
  }
]

// 页面输出
const pagesConfig = {}

pagesArr.forEach(item => {
  pagesConfig[item.name] = {
    // page 的入口
    entry: `src/pages/${item.name}/main.js`,
    // 模板来源
    template: 'public/index.html',
    // 输出文件名
    filename: `${item.rename || item.name}/index.html`,
    // 页面标题
    title: item.title,
    chunks: ['chunk-vendors', 'chunk-common', item.name],
    meta: { version: `v${packageInfo.version}` }
  }
})

module.exports = pagesConfig

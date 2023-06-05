const pagesConfig = require('./vue.config.pages.js')
const path = require('path')
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? '/' : './',

  // 构建时输出目录
  outputDir: 'dist',

  chainWebpack: config => {
    // config.resolve.symlinks(true)
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'))
      .set('@assets', path.resolve(__dirname, 'src/assets'))
      .set('@components', path.resolve(__dirname, 'src/components'))
      .set('@api', path.resolve(__dirname, 'src/api'))
      .set('@utils', path.resolve(__dirname, 'src/utils'))
  },

  devServer: {
    port: 9000,
    hot: true,
    host: '0.0.0.0',
    https: false,
    open: false, // 配置自动启动浏览器
    proxy: {
      // '/api/user/tables': { target:'http://10.0.0.19:3000/mock/44', changeOrigin: true },
      '/api': httpproxy(),
      '/data': httpproxy(),
      '/static': httpproxy()
    }
  },

  pages: pagesConfig,
  configureWebpack: {
    externals: {
      jspdf: 'jsPDF',
      marked: 'marked'
    }
  }
}
function httpproxy () {
  // 测试服务器
  var ip = '10.0.0.19'
  var port = '9030'
  return {
    target: 'http://' + ip + ':' + port
  }
}

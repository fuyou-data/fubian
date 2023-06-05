
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
// import router from '../router'

// 创建axios实例
const http = axios.create({
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'x-client-type': 'Web',
    'x-client-version': ''
    // 'x-client-version': window.navigator.userAgent
  }
})
let showMessage = true
const msgBox = thisMessageBox()
// 添加响应拦截器
http.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const res = response.data
    if (res.code !== 0) {
      if (res.code === 401) {
        msgBox('当前登录信息已失效，请重新登录')
      } else if (res.code === 606) {
        msgBox(res.message)
      } else {
        thisMessage(res.message)
      }
      // if (res.code === 10000) {
      //   router.push({
      //     path: '/login'
      //   })
      // }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  err => {
    console.log('err' + err) // for debug
    const { status, data } = err.response
    if (status === 400) {
      thisMessage(data.message)
    }
    return Promise.reject(err)
  }
)

function thisMessage (message) {
  if (showMessage) {
    Message({
      message: message || 'Error',
      type: 'error',
      duration: 2000
    })
  }
}

function thisMessageBox () {
  let timer = null
  return (message) => {
    if (timer) return
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
    }, 1000)
    MessageBox.alert(message, '', {
      confirmButtonText: '确定',
      showClose: false,
      center: true,
      customClass: 'login-message-box',
      callback: action => {
        window.location.href = '/'
      }
    })
  }
}

export default (request = {}, err = true) => {
  showMessage = err
  return http(request)
}

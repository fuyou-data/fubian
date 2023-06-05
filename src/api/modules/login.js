import fetch from '../http.js'

export const getCode = phone => fetch({
  url: '/api/user/getCode',
  method: 'get',
  params: {
    phone
  }
})

export const postUserLogin = (data) => fetch({
  url: '/api/user/login',
  method: 'post',
  data
})

export const postAdminLogin = (data) => fetch({
  url: '/api/admin/login',
  method: 'post',
  data
})

export const postLogout = () => fetch({
  url: '/api/admin/logout',
  method: 'post'
})

export const postConfigLogin = (data) => fetch({
  url: '/api/config/login',
  method: 'post',
  data
})

export const postConfigLogout = () => fetch({
  url: '/api/config/logout',
  method: 'post'
})

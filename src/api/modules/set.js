import fetch from '../http.js'

export const getConfigInfo = (username) => fetch({
  url: '/api/config/info',
  method: 'get',
  params: {
    username
  }
})

export const postConfigInfo = (data) => fetch({
  url: '/api/config/info',
  method: 'post',
  data
})

import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'

const Api      = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 1500000
})
// forge 专用请求
const ForgeApi = axios.create({
  baseURL: 'https://developer.api.autodesk.com',
  timeout: 1500000
})

Api.interceptors.request.use(
  config => config,
  error => {
    console.log('r_错误')
    console.error(error)
  })

// 错误 拦截器
Api.interceptors.response.use(
  response => {
    const res = response.data
    if (res.status === 0) return res            // 成功
    if (res.status === 100) return res.info     // 成功
    else if (res.status === 10) {               // 登录状态失效
      Message({
        showClose: true,
        message  : res.msg,
        type     : 'error',
        duration : 500,
        onClose () {
          store.dispatch('FedLogOut').then(() => {location.reload()}) // 为了重新实例化vue-router对象 避免bug
        }
      })
      return Promise.reject(new Error('未登录'))
    } else {
      Message({
        message : res.msg,
        type    : 'error',
        duration: 3 * 1000
      })
      return Promise.reject(res)
    }
  },
  error => {                     // 程序错误
    Message({
      message : error.message,
      type    : 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

const post = (url, params) => {
  return new Promise((resolve) => {
    Api.post(url, JSON.stringify(params), { headers: { 'Content-type': 'application/json;charset=UTF-8' } })
       .then(res => resolve(res))
  })
}

const get = (url, params) => {
  return new Promise((resolve) => {
    Api.get(url, { params: params })
       .then(res => {resolve(res)})
  })
}

export const deleteItem = (url, param) => {
  return new Promise((resolve) => {
    Api.delete(url, { params: param })
       .then(res => resolve(res))
  })
}

const forgePost = (url, data) => {
  return new Promise((resolve) => {
    ForgeApi
      .post(
        url,
        data, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
      .then(res => {resolve(res)})
  })
}

export { post, get, forgePost }
export default Api

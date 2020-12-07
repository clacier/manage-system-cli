import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { message } from 'ant-design-vue'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
message.config({
  duration: 3,
  maxCount: 3
})
// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: window.BASE_URL,

  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = error => {
  if (error.response) {
    const data = error.response.data

    notification.error({
      message: '错误',
      description: data.error
    })
    store.commit('set_loading', false)
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  if (!config.hideLoading) {
    store.commit('set_loading', true) // 请求加载框
  }

  config.baseURL = window.BASE_URL
  const token = '11d9e109e02b41a881f578145d552724' // storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['token'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
  store.commit('set_loading', false)
  console.log(store)
  if (response.data.code === 2000 || response.data.code === 200) {
    return response.data
  } else if (response.data.code != 2001) {
    message.error(response.data.msg)
    return false
  }
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { installer as VueAxios, request as axios }

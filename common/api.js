import MinRequest from './MinRequest'

const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request((request) => {
  return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
  return response.data
})

// 设置默认配置，使用的是MinRequest类中的setConfig()方法
minRequest.setConfig((config) => {
  config.baseURL = 'http://192.168.2.123:3000'
  return config
})

export default {
  // 这里统一管理api请求
  apis: {
    uniapp (data) {
      return minRequest.get('/wxuser/register', data)
    }
  }
}

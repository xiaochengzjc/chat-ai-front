import MinRequest from '@/common/MinRequest'
import {
	getToken
} from '@/common/token.js'
import {
	API_RETURN_CODE
} from "@/common/constant.js"
import $config from '@/common/config.js';

const request = new MinRequest()

// 请求拦截器
request.interceptors.request((request) => {
	if (getToken()) {
		request.header['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
	}
	return request
})

// 响应拦截器
request.interceptors.response((response) => {
	let res = response.data || {}
	if (res) {
		if (res.code === API_RETURN_CODE.SERVER_ERROR.code) {
			uni.showToast({
				title: response.data.msg,
				duration: 2000
			})
		} else if (res.code == API_RETURN_CODE.UNAUTHORIZED_TOKEN_TIMEOUT.code || res.code == API_RETURN_CODE
			.UNAUTHORIZED_TOKEN_ERROR.code) {
			uni.showToast({
				title: "您需要重新登录",
				duration: 1000
			})
			uni.navigateTo({
				url: '/pages/login/login',
			})
		}
		return response.data
	}
	return response
})

// 设置默认配置
request.setConfig((config) => {
	config.baseURL = $config.baseUrl
	return config
})

export default request

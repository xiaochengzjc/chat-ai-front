import request from '@/common/request.js'

export const codeLogin = (params) => {
	return request.post('/wechat/codeLogin', params)
}


export const saveWXAuthInfo = (data) => {
	return request.post('/user/saveUser', data, {
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		}
	})
}

export const phoneLogin = (data) => { 
	return request.post('/wechat/phoneLogin', data, {
		// dataType: '',
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		}
	})
}
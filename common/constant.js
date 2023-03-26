export const API_RETURN_CODE = {
	SUCCESS:{
		code: 0,
		message: '成功'
	},
	SERVER_ERROR: {
		code: 10000000,
		message: '服务异常'
	},
	UNAUTHORIZED_TOKEN_ERROR: {
		code: 10000004,
		message: '鉴权失败，Token错误'
	},
	UNAUTHORIZED_TOKEN_TIMEOUT: {
		code: 10000005
	},
}

// Storage 存储 key 合集
export const STORAGE_KEYS = {
	TOKEN: 'user_token',
	USER_INFO: 'wx_user_info'
}
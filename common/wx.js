import {
	codeLogin,
	saveWXAuthInfo,
	phoneLogin
} from "@/api/login"

import {
	API_RETURN_CODE,
	STORAGE_KEYS
} from "@/common/constant.js"
import {
	setToken
} from '@/common/token.js'

import $config from "@/common/config.js"

import store from "@/store/index.js"

// 微信登录的方法
export const getLoginCode = () => {
	return new Promise((resolve, reject) => {
		uni.login({
			provider: 'weixin',
			success: res => {
				resolve(res)
			},
			fail: err => {
				reject(err)
			}
		});
	})
}

// 获取用户信息。每次请求都会弹出授权窗口，用户同意后返回 userInfo。
export const getUserProfile = () => {
	return new Promise((resolve, reject) => {
		uni.getUserProfile({
			desc: '用户登录',
			success: (info_res) => {
				resolve(info_res)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

// 处理 getPhoneNubmber操作，如果获取失败返回reject
export const getPhoneNumber = (res) => {
	return new Promise((resolve, reject) => {
		console.log(res);
		const {
			detail
		} = res;
		// 1用户已授权 0：用户已拒绝
		if (detail.errMsg.indexOf('ok') !== -1) {
			resolve(res)
		} else if (detail.errMsg.indexOf('fail') !== -1) {
			reject(detail.errMsg)
		}
	})
}

// 2.发送获取的code到后端
export const wxLogin = (loginRes) => {
	return new Promise((resolve, reject) => {
		const {
			errMsg,
			code
		} = loginRes
		if (errMsg.indexOf('ok') !== -1) {
			codeLogin({
				code,
				app_key: $config.app.app_key,
				app_secret: $config.app.app_secret
			}).then(res => {
				const {
					code,
					msg,
					data
				} = res

				if (code == API_RETURN_CODE.SUCCESS.code) {
					console.log('res.data', res.data)
					store.commit('login', res.data);
				} else {
					uni.showToast({
						title: msg,
						duration: 2000
					})
				}
				resolve(res.data)
			}).catch((err) => {
				console.log(err);
				reject(err)
			})
		} else if (errMsg.indexOf('fail') !== -1) {
			uni.showToast({
				title: 'wx.login出错 ，请退出重新进入',
				duration: 2000
			})
			reject()
		}
	})
}

// 6.保存授权信息
export const saveAuthInfo = (info, openid) => {
	let that = this
	return new Promise((resolve, reject) => {
		const {
			nickName,
			gender,
			city,
			province,
			country,
			avatarUrl
		} = info.userInfo

		const data = {
			nickName: nickName,
			avatarUrl: avatarUrl,
			gender: gender,
			openid: openid
		}
		console.log('data ', data);
		saveWXAuthInfo(data).then(res => {
			resolve(true)
		}).catch(err => {
			reject(false)
		})
	})
}

// 15.获取手机号之后，将相关信息传往后端
export const sendPhoneLogin = (info) => {
	return new Promise((resolve, reject) => {
		const data = {
			encryptedData: info.encryptedData,
			iv: info.iv,
			openId: uni.getStorageSync(STORAGE_KEYS.WX_OPEN_ID)
		}
		console.log(data);
		phoneLogin(data).then((res) => {
			const {
				code,
				data,
				token
			} = res
			if (code === API_RETURN_CODE.SERVER_ERROR.code) {
				reject(code)
			}
			const userInfo = {
				phoneNumber: data.phone,
			}
			uni.setStorageSync(STORAGE_KEYS.USER_INFO, userInfo)
			setToken(token)
			resolve(res)
		}).catch(() => {
			reject()
		})
	})
	// return phoneLogin()
}

// 检测用户的登录状态
export const checkUserAuth = () => {
	return new Promise((resolve, reject) => {
		// 用户登录的code
		const userLoginCode = uni.getStorageSync(STORAGE_KEYS.USER_LOGIN_CODE)
		const returnRes = {
			code: 0,
			status: '',
			message: ''
		}
		if (!userLoginCode) {
			returnRes.code = userLoginCode
			returnRes.message = '未获取到登录状态码'
			reject(returnRes)
		} else if (userLoginCode === API_RETURN_CODE.USER_ERROR.code) {
			returnRes.code = userLoginCode
			returnRes.message = '异常'
			reject(returnRes)
		} else if (userLoginCode === API_RETURN_CODE.USER_AUTHOR.code) {
			// 用户已登录，已授权
			returnRes.code = userLoginCode
			returnRes.status = '已登录，已授权'
			resolve(returnRes)
		} else if (userLoginCode === API_RETURN_CODE.USER_LOGINED.code) {
			// 用户已登录，未授权
			uni.showModal({
				title: '提示',
				content: '您的账号尚未授权，是否进行授权？',
				success: function(res) {
					if (res.confirm) {
						getUserProfile().then(async infoRes => {
							const saveAuthRes = await saveAuthInfo(infoRes)
							returnRes.code = userLoginCode
							returnRes.status = '已登录，已授权'
							resolve(returnRes)
						}).catch(err => {
							console.log(err);
						})
					} else if (res.cancel) {
						returnRes.code = userLoginCode
						returnRes.status = '已登录，未授权'
						resolve(returnRes)
					}
				}
			});
		} else if (userLoginCode === API_RETURN_CODE.USER_UNLOGIN.code) {
			console.log(userLoginCode);
			uni.showModal({
				title: '提示',
				content: '您尚未登录，是否登录？',
				success: function(res) {
					returnRes.code = userLoginCode
					returnRes.status = '未登录'
					if (res.confirm) {
						uni.navigateTo({
							url: 'pages/login/index',
						})
					} else if (res.cancel) {}
					resolve(returnRes)
				}
			});
		}
	})
}

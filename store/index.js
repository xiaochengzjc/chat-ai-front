import Vue from 'vue';
import Vuex from 'vuex'
import {STORAGE_KEYS} from '@/common/constant.js'
import {setToken} from '@/common/token.js'

Vue.use(Vuex)
export default new Vuex.Store({
	state: {
		user: false,
		totalCount: 0,
		token: '',
		userInfo: {}
	},
	mutations: {
		// 登录
		login(state, res) {
			uni.setStorageSync(STORAGE_KEYS.USER_INFO, res.userInfo)
			setToken(res.token)
			state.token = res.token;
			state.userInfo = res.userInfo;
		},
		// 退出登录
		logout(state) {
			state.token = '';
			uni.removeStorageSync('token');
			uni.removeStorageSync('userInfo');
		}
	}
})

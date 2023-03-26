import App from './App'

//引入请求方法
import MinRequest from '@/common/MinRequest.js';
import minRequest from '@/common/api';

//vuex
import store from './store/index';
Vue.prototype.$store = store;

import configData from './common/configData.js';
Vue.prototype.$configData = configData;

// #ifndef VUE3
import Vue from 'vue'
import uView from "uview-ui";
Vue.use(uView);
Vue.use(MinRequest);
Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
	...App,
	minRequest
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

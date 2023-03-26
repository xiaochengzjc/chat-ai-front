<script>
	import {login, wxLogin} from "@/common/wx.js" 
	export default {
		onLaunch: async function() {
			// const login_res = await login()
			// await wxLogin(login_res)
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";

	page {
		font-size: 28rpx;
	}
</style>

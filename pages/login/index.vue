<template>
	<view class="container">
		<view class="form">
			<view class="logo">
				<u--image src="/static/logo.png" shape="circle" width="200rpx" height="200rpx">
				</u--image>
			</view>
			<u-transition :show="true" mode="slide-left">
				<view class="title">人工智能小AI</view>
			</u-transition>
			<u-transition :show="true" mode="slide-right">
				<view class="desc">AI生活 爱世界</view>
			</u-transition>
			<view class="btn-group">
				<view class="btn" @click="wxMiniLogin">
					<u-button shape="circle" :loading="loginLoading" iconColor="#ffffff" color="#55aaff" icon="edit-pen"
						text="免费注册体验">
					</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getLoginCode,
		wxLogin,
		getUserProfile,
		saveAuthInfo
	} from "@/common/wx.js"
	export default {
		data() {
			return {
				loginLoading: false,
			};
		},
		async onShow() {
			//通过code登录
			let res = await getLoginCode();
			await wxLogin(res); 
		},
		methods: {
			async wxMiniLogin() {
				console.log('111')
				//获取用户信息
				const res = await getUserProfile();
				console.log("查看vuex.state", this.$store.state);
				await saveAuthInfo(res, this.$store.state.userInfo.openid);
				//获取上一级页面地址
				let pages = getCurrentPages(); //页面对象
				let prevpage = pages[pages.length - 2]; //上一个页面对象
				let fullPath = prevpage.$page.fullPath;
				if (fullPath) {
					uni.reLaunch({
						url: fullPath, 
					})
				} else {
					uni.navigateBack({
						delta: 1
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 50%;

		.title {
			font-size: 38rpx;
			font-weight: bolder;
			margin-top: 15rpx;
		}

		.desc {
			margin-top: 15rpx;
			font-size: 28rpx;
			color: #666;
		}

		.btn-group {
			width: 80%;

			.btn {
				margin: 30rpx 0rpx;

				.u-button {
					height: 100rpx;
				}
			}
		}
	}
</style>

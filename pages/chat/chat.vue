<template>
	<view class="chat">
		<!-- 聊天记录 -->
		<mescroll-body ref="mescrollRef" :auto="false" @init="mescrollInit" :down="downOption" @down="downCallback"
			:up="upOption" @up="upCallback">
			<view class="chat-item" v-for="(item, index) in chat" :key="index">
				<!-- 问题框 -->
				<u-transition :show="true" mode="fade-right" v-if="item.question != ''">
					<view class="chat-item__right">
						<view class="chat-item__right-message" @longtap="copy(item.question)">
							{{ item.question }}
						</view>
						<u-avatar shape="square" :src="item.client_avatar"></u-avatar>
					</view>
				</u-transition>
				<!-- 答案框 -->
				<u-transition :show="true" mode="fade-left">
					<view class="chat-item__left u-flex">
						<u-avatar src="/static/avatar.png" shape="square"></u-avatar>
						<view class="chat-item__left-right">
							<view class="chat-item__left-name"> 小AI助手 </view>
							<view class="chat-item__left-bottom">
								<view class="chat-item__left-message" @longtap="copy(item.answer)">
									<text v-if="item.answer == 'error'">网路错误</text>
									<text v-if="item.answer != 'error'">{{ item.answer || "思考中..." }}</text>
								</view>
								<u-loading-icon v-if="item.answer == ''"></u-loading-icon>
								<u-icon v-if="item.answer == 'error'" name="error"></u-icon>
								<view style="margin-top:auto;">
									<u-icon v-if="item.answer && item.answer != error" @tap="copy(item.answer)"
										name="file-text"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</u-transition>
			</view>
			<view class="seize" style="height: 200rpx"></view>
		</mescroll-body>
		<!-- 底部输入框 -->
		<view class="input-box">
			<view style="flex: 1;margin-right: 10rpx;">
				<u--input placeholder="请输入内容" border="surround" v-model="question">
				</u--input>
			</view>
			<view>
				<u-button iconColor="#ffffff" color="#55aaff" size="normal" text="发送" @tap="getAnswer">
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import $config from '@/common/config.js';
	import {
		v4 as uuidv4
	} from 'uuid';
	import {getToken } from '@/common/token.js'
	import {STORAGE_KEYS} from '@/common/constant.js'
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				question: '',
				answer: '',
				show: false,
				key: '',
				chat: [],
				type: 'chat',
				nomore: false,
				pagenum: 1,
				upOption: {
					use: false,
					noMoreSize: 0
				},
				downOption: {
					auto: false
				},
				userInfo: {},
				socketTask: null,
				timer: null
			}
		},
		onLoad() {
			console.log("onLoad")
			//检测用户是否登录
			let islogin = this.checkToken();
			if (!islogin) {
				uni.navigateTo({
					url: '/pages/login/index' 
				});
				return false;
			}
			this.getUserInfo()
			this.showWelcom();
			this.connectSocket();
		},
		methods: {
			connectSocket() {
				let that = this

				if (that.userInfo == undefined) {
					return 
				}
				if (this.socketTask != null) {
					this.socketTask.close()
				}
				this.socketTask = uni.connectSocket({
					url: $config.wsUrl + '?uid=' + that.userInfo.id,
					success(res) {
						console.log("websocket连接成功");
					},
					fail(err) {
						console.log("websocket链接错误: ", err);
					}
				});

				this.socketTask.onOpen(function(res) {
					console.log('WebSocket连接已打开');
					that.heart()
				});

				this.socketTask.onMessage(function(res) {
					that.handelMessage(that, res.data)
				});


				this.socketTask.onError(function(res) {
					console.log('WebSocket发生错误: ', res);
				});

				this.socketTask.onClose((e) => {
					console.log('WebSocket连接关闭');
				});
			},

			//重新连接
			reconnect(that) {
				console.log('websocket断线重连');

				if (that.socketTask != null) {
					that.socketTask.close({
						code: 1000,
						reason: "正常关闭",
						success: function(res) {
							console.log("主动关闭成功", res);
						},
						fail: function(res) {
							console.log("主动关闭失败", res);
						}
					})
				}
				that.socketTask = null
				that.connectSocket();
			},

			sendSocketMessage(msg) {
				return new Promise((reslove, reject) => {
					this.socketTask.send({
						data: msg,
						success(res) {
							reslove({
								res: res,
								'msg': msg
							})
						},
						fail(res) {
							reject({
								res: res,
								'msg': msg
							})
						}
					});
				})
			},

			async handelMessage(that, msg) {
				let msgObj = JSON.parse(msg)
				let {
					msg_id,
					user,
					type,
					content,
					msg_time
				} = msgObj;
				if (type == "heart") {
					return;
				}

				//从后往前遍历，找到对应的msg_id
				let length = that.chat.length;
				for (let index = length - 1; index >= 0; index--) {
					let item = that.chat[index];
					if (item.msg_id == msg_id) {
						item.answer += content

						item.answer.length > 2 && item.answer.length < 5 && (item.answer = function(s) {
							return s.replace(/(^\n*)/g, "");
						}(item.answer))

						that.$set(that.chat, index, item)
						break;
					}
				}

				//滚动到最下边
				that.$nextTick(() => {
					that.mescroll.scrollTo(99999999);
				});
			},

			heart() {
				let that = this;
				if (this.timer != null) {
					clearInterval(this.timer);
				}
				this.timer = null;
				let msg = {
					"type": "heart",
					"content": "ping"
				}
				this.timer = setInterval(() => {
					that.sendSocketMessage(JSON.stringify(msg)).then(res => {
						//console.log('心跳发送成功')
					}).catch(res => {
						console.log('发送心跳失败: ', res)
					})
				}, 30000)
			},

			checkToken() {
				const token = getToken()
				if (token == '' || token == undefined) {
					return false;
				} else {
					return true;
				}
			},

			getUserInfo() {
				let userInfo = uni.getStorageSync(STORAGE_KEYS.USER_INFO);
				console.log('getUserInfo', userInfo)
				if (userInfo == '' || userInfo == undefined) {
					return false;
				} else {
					this.userInfo = userInfo
					return true;
				}
			},

			downCallback() {
				if (this.pagenum <= 1 || this.nomore) {
					this.mescroll.endErr();
					return false;
				}
				this.getAiQa(this.pagenum);
			},
			async showWelcom() {
				this.chat.push({
					question: '',
					answer: '你好，我是小AI助手，请开始你的提问吧'
				});
			},
			copy(val) {
				uni.setClipboardData({
					data: this.answer || val,
					success: function() {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				});
			},
			async getAnswer() {
				let index = this.chat.length
				if (!this.question) {
					uni.showToast({
						title: '你还没有输入问题呢！',
						icon: 'none'
					});
					return
				}
				//智能回答参数拼接，固定格式，否则不会触发chatgpt智能回答
				// let query = '';
				// this.chat.forEach(item => {
				// 	query += `Q: ${item.question}\nA: ${item.answer}。 <|endoftext|>\n`
				// })
				// query += `Q: ${this.question} + "\nA: `
				let question = this.question;
				let msg_id = uuidv4()
				this.chat.push({
					question: this.question,
					answer: '',
					msg_id: msg_id,
					client_avatar: this.userInfo.avatar
				});

				this.question = '';
				// 数据渲染完毕再隐藏加载状态
				this.$nextTick(() => {
					this.mescroll.scrollTo(99999999);
				});
				let message = {
					'type': 'req',
					'content': question,
					'msg_id': msg_id
				}
				let that = this
				this.sendSocketMessage(JSON.stringify(message)).then(function(data) {
					//发送成功 to do
					// let msgObj = JSON.parse(data.msg)
					// console.log("发送成功: ", data, msgObj)
				}, function(error) {
					uni.showToast({
						title: "发送失败",
						icon: 'none'
					})
					console.log("发送失败: ", error.res)
					let msgObj = JSON.parse(error.msg)

					if (msgObj.type == "req") {
						let length = that.chat.length
						for (let index = length - 1; index >= 0; index--) {
							let item = that.chat[index];
							if (item.msg_id == msgObj.msg_id) {
								item.answer = "网络错误，请重新发送"
								that.$set(that.chat, index, item)
								break;
							}
						}
					}
					that.reconnect(that)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.chat {
		padding: 20rpx;
		box-sizing: border-box;

		&-item {
			&__left {
				display: flex;
				margin-top: 20rpx;

				&-right {
					margin-left: 20rpx;
				}

				&-name {
					font-size: 24rpx;
				}

				&-message {
					margin-top: 10rpx;
					background: #55aaff;
					padding: 20rpx;
					border-radius: 10rpx;
					font-size: 28rpx;
					color: #fff;
					margin-right: 20rpx;
				}

				&-bottom {
					display: flex;
				}
			}

			&__right {
				display: flex;
				margin-top: 20rpx;
				justify-content: flex-end;

				&-message {
					margin-right: 20rpx;
					background: #98ff73;
					padding: 20rpx;
					border-radius: 10rpx;
					font-size: 28rpx;
				}
			}
		}
	}

	.input-box {
		display: flex;
		background: #fff;
		position: fixed;
		// #ifdef H5
		bottom: calc(env(safe-area-inset-bottom) + 50px);
		bottom: calc(constant(safe-area-inset-bottom) + 50px);
		// #endif
		// #ifndef H5
		bottom: 0;
		// #endif
		left: 0;
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
		justify-content: space-between;
		align-items: center;
	}
</style>

<template>
	<view class="scrollTools">
		<view class="components-title">
			<view>决策工具</view>
			<view class="components-title-key" @click="moreJump">更多</view>
		</view>
		<swiperTool :toolsList="toolsList" @navigatePage="navigatePage" :swiperConfigure="swiperConfigure"></swiperTool>
		<!--    <scroll-view class="articleDetail-scroll" scroll-x="true">
      <swiperTool :toolsList="toolsList" @navigatePage="navigatePage"></swiperTool>
    </scroll-view> -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import swiperTool from '../../findTools/components/swiperTool.vue';
	export default {
		components: {
			swiperTool
		},
		computed: {
			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum',
				'Lang', 'logout'
			]),
		},
		watch: {
			toolsList: {
				handler(newName, oldName) {
					this.toolsList = newName;
					console.log('scrollTools-toolsList -', this.toolsList);
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
		},
		props: {
			toolsList: {
				type: Array,
				default () {
					return [];
				},
			},
			imgWidth: {
				type: Number,
				default: () => {
					return 750;
				},
			},
			imgHeight: {
				type: Number,
				default: () => {
					return 260;
				},
			},
			swiperConfigure: {
				type: Object,
				default: () => {
					return {};
				},
			},
		},
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 0,
				tools_topBg: `${getApp().globalData.qnUrl}/zc_images/findTools/tools_topBg.png`,
				PageNav: {
					window: {
						navigationBarBackgroundColor: '#ffffff',
						navigationBarTextStyle: 'black',
						navigationBarTitleText: '',
						backgroundColor: '#f8f8f8',
						backgroundTextStyle: 'dark',
					},
				},
			};
		},
		onLoad() {
			this.init();
		},
		onUnload() {},
		methods: {
			init() {
				this.getSystemInf();
			},
			moreJump() {
				// uni.switchTab({
				// 	url: '/pages/tools/index'
				// });
				uni.navigateTo({
					url: '/pages/tools/toolsIndex',
				});
				
			},
			navigatePage(i) {
				console.log('navigatePage-i', i);
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login',
					});
					return;
				}
				// #ifdef H5
				if (this.$.isWeixin()) {
					if (this.userInfo.isBindWeiXin !== 1) {
						this.cleanCache()
						return;
					}
				}
				// #endif
				if (i == 0) {
					uni.navigateTo({
						url: '/findTools/panZhongbao/index?productId=' + this.toolsList[0].productId +
							'&item_id=' + this.toolsList[0].itemId,
					});
				} else if (i == 1) {
					uni.navigateTo({
						// url: '/ganhuo/financelist/financelist',
						url: '/findTools/dragonTigerList/index?productId=' + this.toolsList[0].productId +
							'&item_id=' + this.toolsList[0].itemId,
					});
				} else if (i == 2) {
					uni.navigateTo({
						// url: '/ganhuo/financelist/financelist',
						url: '/findTools/eventBao/index?productId=' + this.toolsList[2].productId + '&item_id=' +
							this.toolsList[2].itemId,
					});
				} else if (i == 4) {
					uni.navigateTo({
						url: '/ganhuo/financelist/financelist',
					});
				} else if (i == 3) {
					uni.navigateTo({
						url: '/findTools/saoLeiBao/index?productId=' + this.toolsList[3].productId + "&item_id=" +
							this.toolsList[3].itemId,
					});
				}  else if (i == 5) {
					uni.navigateTo({
						url: '/findTools/tuyere/index?productId=' + this.toolsList[5].productId + '&item_id=' +
							this.toolsList[5].itemId,
					});
				}  else if (i == 6) {
					uni.navigateTo({
						url: '/findTools/mechanism/index?productId=' + this.toolsList[6].productId + '&item_id=' +
							this.toolsList[6].itemId,
					});
				}
				else {
					if (!this.hasLogin) {
						uni.navigateTo({
							url: '/pages/login/login',
						});
						return;
					}
					this.serverClick();
				}
			},
			serverClick() {
				console.log('专属客服');
				let user_id = this.userInfo.user_id;
				let wxOriginId = uni.getStorageSync('wxOriginId') ?? 'gh_77e0924a5066';
				let wxMiniPath = uni.getStorageSync('wxMiniPath') ?? 'pages/index/index';
				let path = wxMiniPath + '?typeIndex=0&userId=' + user_id + '&mobile=' + this.userInfo.user_mobile;
				this.pushMiniApp(path, wxOriginId);
			},
			cleanCache: function(e) {
				var that = this
				that.$.request({
					url: that.Config.URL.logout,
					success: function(data, status, msg, code) {
						// #ifdef APP-PLUS
						plus.navigator.removeAllCookie();
						// #endif

						// #ifdef H5
						var date = new Date();
						date.setTime(date.getTime() - 10000);
						var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
						if (keys) {
							for (var i = keys.length; i--;)
								document.cookie = keys[i] + "=0; expire=" + date
								.toGMTString() + "; path=/";
						}
						// #endif
						that.$.storage.removeItem('uid');
						that.$.storage.removeItem('ukey');

						const language = uni.getStorageSync('language')

						// var app_already = uni.getStorageSync('app_already');
						// var check_state = uni.getStorageSync('check_state');

						that.$.storage.clear();
						//如果不在允许的语言内，可重置
						uni.setStorageSync('language', language);


						// #ifdef MP-WEIXIN
						var info = that.$.storage.info();

						that.setData({
							currentSize: Math.round(info.currentSize * 100) / 100,
							limitSize: Math.round((info.limitSize / 1024) * 100) /
								100
						});
						// #endif

						$cookies.remove('uid');
						$cookies.remove('ukey');


						uni.navigateTo({
							url: '/pages/login/login'
						})
						//退出登录
						that.logout(false);
					}
				})
			},

			//跳转微信小程序
			pushMiniApp(pathUrl, wxOriginId) {

				console.log('---log---', pathUrl);
				// #ifdef APP-PLUS
				// 跳转微信小程序 
				plus.share.getServices(
					res => {
						console.log('---res---', res);
						let sweixin = '';
						for (var i = 0; i < res.length; i++) {
							let t = res[i];
							if (t.id == 'weixin') {
								sweixin = t;
							}
						}
						if (sweixin) {
							sweixin.launchMiniProgram({
									// id: 'gh_915c2ca533a7',  //汽车的原始ID
									// id: 'gh_306945fe14bd',
									id: wxOriginId,
									// path: 'pages/views/home/home/home?', //  可带参数	             
									// path: 'pages/index/index?typeIndex=0&user_id='+user_id', //  可带参数	  
									path: pathUrl,
									type: 0 // 微信小程序版本类型可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
								},
								// 目标小程序点击返回App后执行的回调，在此接收微信小程序传递的参数
								res2 => {
									console.log('-----res2----', res2)
								},
								err2 => {
									console.log(err2)
								}
							);
						} else {
							uni.showToast({
								icon: 'none',
								title: '当前环境不支持微信操作!'
							})
						}
					},
					err => {
						console.log('---err-----', err)
					}
				)
				// #endif

			},

			getSystemInf() {
				// 获取手机系统信息
				const info = uni.getSystemInfoSync();
				// 设置状态栏高度（H5顶部无状态栏小程序有状态栏需要撑起高度）
				this.statusBarHeight = info.statusBarHeight;
				// 除了h5 app mp-alipay的情况下执行
				// #ifndef H5 || APP-PLUS || MP-ALIPAY
				// 获取胶囊的位置
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				// (胶囊底部高度 - 状态栏的高度) + (胶囊顶部高度 - 状态栏内的高度) = 导航栏的高度
				this.navBarHeight = menuButtonInfo.bottom - info.statusBarHeight + (menuButtonInfo.top - info
					.statusBarHeight);

				// #endif
			},
			uniRequest(data) {
				const that = this;
				uni.request({
					url: this.Config.URL.edu.getProductList,
					method: 'get',
					data: data,
					dataType: 'json',
					success: (res) => {
						const data = res.data.data;
						console.log('getList-res', res);
						if (res.statusCode == 200) {
							uni.stopPullDownRefresh();
							result.forEach(function(item, i, array) {
								// console.log('result-forEach', item, i, array);
							});
						}
					},
					fail: () => {},
					complete: () => {
						// this.contentScroll();
					},
				});
			},
		},
	};
</script>

<style lang="scss">
	// @import '@/styles/findPage/scss.scss';
	.scrollTools {
		width: 100%;

		.articleDetail-scroll {
			height: 330rpx;
		}
	}

	.tools_topBg {
		width: 750rpx;
		height: 280rpx;
	}

	.findTools {
		margin-top: 10rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		width: max-content;

		/deep/ .findTools-child {
			margin-right: 20rpx;
		}
	}

	.components-title {
		width: 100%;
		font-size: 36upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 4upx;
		padding-top: 14upx;

		&-key {
			font-size: 24upx;
			font-family: PingFangSC-Regular, PingFang SC;
			color: #999999;
			// -webkit-text-stroke:2upx #333333;
			// text-shadow: 0 0 5px #FF0000, 0 0 5px #6bf403;
		}
	}
</style>

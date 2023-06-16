<template>
	<view class="container">
		<block v-for="(item,index) in miniList" :key='index'>
			<aminicell-view :itemmodel="item" @itemClick='seletPageIndex(index)' @switchChange="switchChange(index)">
			</aminicell-view>
		</block>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	// import topTitle from '../../components/top_title/top_title.vue';

	export default {

		components: {
			// topTitle
		},

		onLoad: function(opt) {
			//测试cherrypick
			uni.setNavigationBarTitle({
				title: this.__('用户设置')
			});
		},

		data() {
			return {
				miniList: [{
						title: '基本信息',
						img: 'https://qnsp.zcskjy.com/zc_images/mine/ccxt_setting_1.png',
					},
					{
						title: '登录密码',
						img: 'https://qnsp.zcskjy.com/zc_images/mine/ccxt_setting_2.png'
					},
					{
						title: '支付密码',
						img: 'https://qnsp.zcskjy.com/zc_images/mine/ccxt_setting_2.png'
					},
					{
						title: '提现账户',
						img: 'https://qnsp.zcskjy.com/zc_images/mine/ccxt_setting_4.png'
					},
					{
						title: '实名认证',
						img: 'https://qnsp.zcskjy.com/zc_images/mine/ccxt_setting_5.png'
					},
					{
						title: '隐私政策',
						img: 'https://qnsp.zcskjy.com/zc_images/mine/ccxt_setting_6.png'
					},
					//#ifdef APP-PLUS
					{
						title: '允许推送',
						img: 'https://qnsp.zcskjy.com/zc_images/mine/ccxt_setting_7.png',
						buttonType: 'switch',
						state: true
					},
					// #endif
					{
						title: '注销账号',
						img: 'https://qnsp.zcskjy.com/zc_images/mine/ccxt_setting_6.png'
					},
					{
						title: '退出登录',
						img: 'https://qnsp.zcskjy.com/zc_images/mine/ccxt_setting_7.png'
					},
					// {
					// 	title: '圈子',
					// 	img: 'https://qnsp.zcskjy.com/zc_images/mine/ccxt_setting_7.png'
					// },
					// {title:'极光认证',img:'https://qnsp.zcskjy.com/zc_images/mine/ccxt_setting_7.png'},
					// {title:'随商个人中心',img:'../../static/mine/ccxt_setting_6.png'},
				],
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'userInfo', 'hasLogin']),

		onLoad: function(opt) {
			uni.setNavigationBarTitle({
				title: this.__('用户设置')
			});
			console.log("qnUrl=" + getApp().globalData.qnUrl)
		},

		onShow: function(opt) {

		},
		methods: {
			...mapMutations(['login', 'logout', 'forceUserInfo', 'getUserInfo']),

			goTabBar: function(e) {
				var that = this
				that.$.goToTabBar(that, e.currentTarget.dataset.url)
			},

			cleanCache: function(e) {
				var that = this
				// const index = e.currentTarget.dataset.index
				// const path = e.currentTarget.dataset.path
				that.$.confirm(that.__('确定要退出登录吗？'), function(data) {
					if (data.confirm) {
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

								//
								const language = uni.getStorageSync('language')

								// var app_already = uni.getStorageSync('app_already');
								// var check_state = uni.getStorageSync('check_state');

								that.$.storage.clear();
								//如果不在允许的语言内，可重置
								uni.setStorageSync('language', language);

								// if (app_already) {
								// 	uni.setStorage({
								// 		key: 'app_already',
								// 		data: app_already
								// 	});
								// }
								// if (check_state) {
								// 	uni.setStorage({
								// 		key: 'check_state',
								// 		data: check_state
								// 	});
								// }

								// #ifdef MP-WEIXIN
								var info = that.$.storage.info();

								that.setData({
									currentSize: Math.round(info.currentSize * 100) / 100,
									limitSize: Math.round((info.limitSize / 1024) * 100) /
										100
								});
								// #endif


								//退出登录
								that.logout(false);
								uni.switchTab({
									url: '/pages/my/my'
								})
								// uni.reLaunch({
								// 	url: '/pages/index/index'
								// });

								// setTimeout(function () {
								// 	that.$.navigateBack(1, function () {
								// 	})
								// }, 1e3)
							}
						})
					}
				}, true)
			},


			logoutFunc: function() {
				var that = this;
				that.$.request({
					url: that.Config.URL.logout,
					success: function(data, status, msg, code) {
						// #ifdef APP-PLUS
						plus.navigator.removeAllCookie();
						// #endif

						//退出登录
						that.logout(false);
						uni.switchTab({
							url: '/pages/my/my'
						})
					}
				})
			},

			//注销账户
			cancalAccount: function(e) {
				var that = this;
				console.log("---logo----", that.Config.URL.doCancel);
				that.$.confirm(that.__('您确定要注销账户吗？'), function(data) {

					if (data.confirm) {
						that.$.request({
							url: that.Config.URL.doCancel,
							success: function(data, status, msg, code) {

								console.log("---data11---", data);

								// #ifdef APP-PLUS
								plus.navigator.removeAllCookie();
								// #endif
								uni.showToast({
									icon: 'none',
									title: '您的账户注销申请已提交，3个工作日内完成!'
								})

								//退出登录
								that.logoutFunc();

								//退出登录
								// that.logout(false);
								// uni.switchTab({
								// 	url:'/pages/my/my'
								// })
							}
						})
					}
				}, true)
			},
			switchChange(index) {

				let e = this.miniList[index].state;
				console.log("switchChange", e)
				//  #ifdef  APP-PLUS
				var pushManager = plus.android.importClass("com.igexin.sdk.PushManager");
				var context = plus.android.runtimeMainActivity();
				switch (index) {
					case 6:
						if (e) {
							pushManager.getInstance().turnOnPush(context);
						} else {
							pushManager.getInstance().turnOffPush(context);
						}
						break;
				}
				//  #endif
			},

			seletPageIndex(index) {
				switch (index) {
					case 0:
						this.jump('/my/setting/data')
						  // window.location.href = 'https://syb.allinpay.com/apiweb/h5unionpay/native?key=WJul8VpiZHQ5R9nSVT2vttay';
						break;
					case 1:
						this.jump('/my/setting/bindphone')
						break;
					case 2:
						this.jump('/my/setting/paypwd')
						break;
					case 3:
						this.jump('/my/setting/bankcard-list')
						break;
					case 4:
						this.jump('/my/setting/certification')
						break;
					case 5:
						this.jump('/my/setting/protocol?id=reg_protocols_description&no_btn=1')
						break;
						//#ifdef APP-PLUS
					case 7:
						this.cancalAccount()
						break;
					case 8:
						this.cleanCache()
						break;
					case 9:
					uni.navigateTo({
						url:'../../pages/index/image'
					})
						break;
						// #endif
						//#ifndef APP-PLUS
					case 6:
						this.cancalAccount()
						break;
					case 7:
						this.cleanCache()
						break;
					case 8:
					uni.redirectTo({
						url:'../../pages/index/image'
					})
						break;
						// #endif

				}
			},

			jump(target) {
				uni.navigateTo({
					url: target
				})
			},
		},

	};
</script>

<style lang="scss">
	.container {
		background-color: #FFFFFF;
		width: 100%;
		// height: 100%;
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
	}

	.top_bottom {
		border-bottom: #F5F5F5 1rpx solid;
	}
</style>

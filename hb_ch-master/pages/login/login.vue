<template>
	<view class="login">
		<view class="auth-pop" v-if="isMpWeixin && !isAuthorizationed">
			<view class="auth-box">
				<image src="https://static.shopsuite.cn/xcxfile/appicon/shield.png"></image>
				<label>{{ __('新用户注册') }}</label>
				<text>{{ __('使用微信头像、昵称授权注册') }}</text>

				<view class="btn-row" style="margin-top: 40upx; padding: 10upx 20upx">
					<checkbox-group @change="onChangeProtocol">
						<label>
							<checkbox :checked="protocol_checked" value="1" />
						</label>
						<label @tap="showProtocol('reg_protocols_description')"> {{ __('同意') }}{{ __('《用户协议》') }}
						</label>
					</checkbox-group>
				</view>

				<button type="primary" @click="getUserProfile">{{ __('一键注册') }}</button>
			</view>
		</view>
		<view class="content" v-else>
			<view class="register">

				<view class="content">
					<view class="top_title">
						<image class="back" src="https://qnsp.zcskjy.com/zc_images/home/back.png" @click="goBack()">
						</image>
					</view>
					<text class="tip_text">手机验证码登录</text>
					<!-- 主体 -->
					<view class="main">
						<wInput v-model="user_mobile" type="text" isShowIntl @intl="intlChange"
							:placeholder="__('请输入手机号码')"></wInput>

						<wInput v-model="mobile_code" type="number" maxlength="4" :placeholder="__('请输入验证码')" isShowCode
							:codeText="__('获取验证码')" ref="runCode" @setCode="getSmsCode()"></wInput>

					</view>

					<wButton :text="__('登 录')" :bgColor="__('#FC4B21')" @click.native="startReg()"
						style="margin-top: 30rpx;"></wButton>

					<view class="m-content-bttom" style="margin:100rpx 150rpx;"
						:style="justifyCenter ? 'justify-content: center;':'justify-content: space-between;'">
						<!-- #ifdef APP-PLUS -->
						<view class="menu-item" @click="oneLogin">
							<image style="width: 90rpx; height: 90rpx;" mode="aspectFill"
								src="/static/images/login/quicklogImg.png" />
							<view class="m-title-text"> {{'一键登录(快速)'}}</view>
						</view>
						<!-- #endif -->
						<view class="menu-item" @click="wxLogin" v-if="showLogBtn">
							<image style="width: 90rpx; height: 90rpx;" mode="aspectFill"
								src="/static/images/login/weixinlogImg.png" />
							<view class="m-title-text"> {{'微信登录(推荐)'}}</view>
						</view>
					</view>

				</view>
				<view class="m-content-footer">
					<view class="checkBtn" @click="checkBtnSelect">
						<image style="width: 30rpx; height: 30rpx;display: block;margin-right: 8rpx;" mode="aspectFill"
							:src="checkBtnState ? '/static/images/login/checksel.png':'/static/images/login/checkunsel.png'" />
					</view>

					<text> {{'我已阅读并同意'}}</text>
					<navigator url="/my/setting/protocol?id=open_store_description">
						<text style="color:#FC4B21">《用户服务协议》</text>
					</navigator>
					<text>和</text>
					<navigator url="/my/setting/protocol?id=reg_protocols_description">
						<text style="color:#FC4B21">《用户隐私协议》</text>
					</navigator>
				</view>

			</view>

		</view>
	</view>
	</view>
</template>

<script>
	import wInput from '../../components/watch-login/watch-input.vue'; //input
	import wButton from '../../components/watch-login/watch-button.vue'; //button
	import imgcode from '@/components/verify-code/imgcode.vue';

	// #ifdef H5
	import $cookies from '../../helpers/vue-cookies';
	// #endif

	// #ifdef APP-PLUS
	const jv = uni.requireNativePlugin("JG-JVerification");
	// #endif
	/*
	//获取当前路由
	let curPage = getCurPage();
	//在微信小程序或是app中，通过curPage.options；如果是H5，则需要curPage.$route.query（H5中的curPage.options为undefined，所以刚好就不需要条件编译了）
	let curParam = curPage.options || curPage.$route.query;

	export function getCurPage(){
	    let pages = getCurrentPages();
	    let curPage = pages[pages.length-1];
	    return curPage
	}
	*/

	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				options: {},
				connect: {},
				providerList: [],
				hasProvider: false,
				logo: '',
				account: '',
				password: '',
				positionTop: 0,
				protocol_checked: true,

				isAuthorizationed: false,
				isMpWeixin: false,
				wxwork: 0, //是否企业微信
				isMpToutiao: false,
				plusOauthWeixin: {},

				showLogBtn: false,
				justifyCenter: false, //是否居中显示

				bind_type: 1, //1:手机号注册   2:email 注册

				user_intl: '',

				system: '', // 系统版本
				platform: '', // 平台

				client_info: '{}',

				data: {},

				isRotate: false, //是否加载旋转
				screenwidth: 375,
				screenheight: 667,
				loginToken: '',
				user_password: "",
				mobile_code: "",
				btntext: "发送",
				isUserMobile: !0,
				isUserEmail: !0,
				isNickname: !0,
				isPassword: !0,
				isSend: !0,
				sendTime: 120,
				isCode: !0,
				isImgCode: !1,
				checkBtnState: false,
				user_mobile: '',
				client_info: '{}',

				countdown: 6,
				cTimer: null,
				// #ifdef APP-PLUS
				jv,
				//#endif
			};
		},
		components: {
			wInput,
			wButton,
			imgcode
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin',
			'forcedLoginState', 'clientInfo'
		]),

		async onLoad(options) {

			uni.setNavigationBarTitle({
				title: this.__('登录'),
			});

			// this.oneLogin()

			this.setData({
				options: options
			})

			this.btntext = this.__('发送')

			let that = this;

			that.setData({
				options: options,
			});
			// 先判断 系统版本
			uni.getSystemInfo({
				success: (res) => {
					this.system = res.system;
					this.platform = res.platform;
				},
				fail: (err) => {},
				complete: () => {},
			});


			// var check_state = uni.getStorageSync('check_state');
			// var app_platform = uni.getSystemInfoSync().platform;
			// if (check_state == true && app_platform == 'ios') {
			// 	that.setData({
			// 		showLogBtn: false,
			// 		justifyCenter: true,
			// 	});
			// } else {
			that.setData({
				justifyCenter: false,
				showLogBtn: true,
			});
			// }

			// #ifndef APP-PLUS
			that.setData({
				showLogBtn: true,
				justifyCenter: true,
			});
			// #endif

			console.log('--login--showLogBtn------', that.showLogBtn);

			// #ifdef MP-TOUTIAO
			this.isMpToutiao = true;
			let login_func = that.$.login;

			login_func({
				success: function(datainfo) {
					console.info(datainfo);

					//请求服务器
					that.$.request({
						url: that.Config.URL.wx.checkAppLogin,
						data: {
							code: datainfo.code,
							wxwork: that.wxwork,
							source_store_id: that.$.getStorageSync('source_store_id'),
							source_user_id: that.$.getStorageSync('source_user_id'),
							source_ucc_code: that.$.getStorageSync('source_ucc_code'),
							client_info: that.client_info,
						},
						success: function(data, status, msg, code) {
							if (status == 200) {
								that.setData({
									isAuthorizationed: true
								});

								var id = that.$.setStorageSync('uid', data.user_id);
								var key = that.$.setStorageSync('ukey', data.key);

								that.toMain(data);
							} else {
								that.setData({
									isAuthorizationed: false
								});
							}
						},
						fail: function() {
							// fail
							// that.$.hideToast();
						},
						complete: function() {
							// complete
						},
					});
				},
			});
			// #endif

			// #ifdef MP-WEIXIN
			this.isMpWeixin = true;

			//判断是否企业微信
			let e = that.$.getSystemInfoSync();

			wx.getUserInfo({
				success: (res) => {
					that.setData({
						data: res,
					});
				},
				fail: function(err) {
					console.log('获取失败: ', err);
				},
			});

			// #ifdef APP-PLUS
			plus.push.getClientInfoAsync(function(info) {
				console.log(info);
				if (info.clientid) {
					that.client_info = JSON.stringify(info);
				}
			}, function(e) {
				console.log(JSON.stringify(e));
			})
			// #endif

			if (e.environment) {
				this.wxwork = e.environment == 'wxwork' ? 1 : 0;
			}

			this.wxwork = e.environment == 'wxwork' ? 1 : 0;

			let login_func = that.$.login;

			if (this.wxwork) {
				login_func = wx.qy.login;

				wx.getSetting({
					success: function(res) {
						if (res.authSetting['scope.userInfo']) {
							that.setData({
								isAuthorizationed: !1
							});

							login_func({
								success: function(qy_datainfo) {
									that.$.login({
										success: function(datainfo) {
											//请求服务器
											that.$.request({
												url: that.Config.URL.wx
													.checkAppLogin,
												data: {
													qy_code: qy_datainfo
														.code,
													code: datainfo.code,
													wxwork: that.wxwork,
													source_store_id: that.$
														.getStorageSync(
															'source_store_id'
														),
													source_user_id: that.$
														.getStorageSync(
															'source_user_id'
														),
													source_ucc_code: that.$
														.getStorageSync(
															'source_ucc_code'
														),
													client_info: that
														.client_info,
												},
												success: function(data,
													status, msg, code
												) {
													if (status ==
														200) {
														that.setData({
															isAuthorizationed: true
														});

														var id = that.$
															.setStorageSync(
																'uid',
																data
																.user_id
															);
														var key = that
															.$
															.setStorageSync(
																'ukey',
																data
																.key);

														that.toMain(
															data);
													} else {
														that.setData({
															isAuthorizationed: false
														});
													}
												},
												fail: function() {
													// fail
													// that.$.hideToast();
												},
												complete: function() {
													// complete
												},
											});
										},
									});
								},
							});
						} else {
							login_func({
								success: function(qy_datainfo) {
									that.$.login({
										success: function(datainfo) {
											//请求服务器
											that.$.request({
												url: that.Config.URL.wx
													.checkAppLogin,
												data: {
													qy_code: qy_datainfo
														.code,
													code: datainfo.code,
													wxwork: that.wxwork,
													source_store_id: that.$
														.getStorageSync(
															'source_store_id'
														),
													source_user_id: that.$
														.getStorageSync(
															'source_user_id'
														),
													source_ucc_code: that.$
														.getStorageSync(
															'source_ucc_code'
														),
													client_info: that
														.client_info,
												},
												success: function(data,
													status, msg, code
												) {
													if (status ==
														200) {
														that.setData({
															isAuthorizationed: true
														});

														var id = that.$
															.setStorageSync(
																'uid',
																data
																.user_id
															);
														var key = that
															.$
															.setStorageSync(
																'ukey',
																data
																.key);

														that.toMain(
															data);
													} else {
														that.setData({
															isAuthorizationed: false
														});
													}
												},
												fail: function() {
													// fail
													// that.$.hideToast();
												},
												complete: function() {
													// complete
												},
											});
										},
									});
								},
							});
						}
					},
				});
			} else {
				wx.getSetting({
					success: function(res) {
						if (res.authSetting['scope.userInfo']) {
							that.setData({
								isAuthorizationed: !1
							});

							//console.log('是否授权！是');
							//console.info(res);

							login_func({
								success: function(datainfo) {
									//console.log('是否注册！否');
									//console.info(datainfo);
									//请求服务器
									that.$.request({
										url: that.Config.URL.wx.checkAppLogin,
										data: {
											code: datainfo.code,
											wxwork: that.wxwork,
											source_store_id: that.$.getStorageSync(
												'source_store_id'),
											source_user_id: that.$.getStorageSync(
												'source_user_id'),
											source_ucc_code: that.$.getStorageSync(
												'source_ucc_code'),
											client_info: that.client_info,
										},
										success: function(data, status, msg, code) {
											if (status == 200) {
												that.setData({
													isAuthorizationed: true
												});

												var id = that.$.setStorageSync(
													'uid', data.user_id);
												var key = that.$.setStorageSync(
													'ukey', data.key);

												that.toMain(data);
											} else {
												that.setData({
													isAuthorizationed: false
												});
											}
										},
										fail: function() {
											// fail
											// that.$.hideToast();
										},
										complete: function() {
											// complete
										},
									});
								},
							});
						} else {
							login_func({
								success: function(t) {
									//console.log('是否注册！否');
									//console.info(t);
									//请求服务器
									that.$.request({
										url: that.Config.URL.wx.checkAppLogin,
										data: {
											code: t.code,
											wxwork: that.wxwork,
											source_store_id: that.$.getStorageSync(
												'source_store_id'),
											source_user_id: that.$.getStorageSync(
												'source_user_id'),
											source_ucc_code: that.$.getStorageSync(
												'source_ucc_code'),
											client_info: that.client_info,
										},
										success: function(data, status, msg, code) {
											if (status == 200) {
												that.setData({
													isAuthorizationed: true
												});

												var id = that.$.setStorageSync(
													'uid', data.user_id);
												var key = that.$.setStorageSync(
													'ukey', data.key);

												that.toMain(data);
											} else {
												that.setData({
													isAuthorizationed: false
												});
											}
										},
										fail: function() {
											// fail
											// that.$.hideToast();
										},
										complete: function() {
											// complete
										},
									});
								},
							});
						}
					},
				});
			}
			// #endif

			// #ifdef H5
			if (that.$.isWeixin()) {
				that.weixin_h5_oauth('weixin');
			} else {
				//H5
				let uid = $cookies.get('uid');
				let ukey = $cookies.get('ukey');

				if (uid && ukey) {} else {
					uid = that.$.getStorageSync('uid');
					ukey = that.$.getStorageSync('ukey');
				}
				that.setData({
					showLogBtn: false,
					justifyCenter: true,
				});

				//判断Cookie是否登录
				if (uid && ukey) {
					that.$.request({
						url: this.Config.URL.check_islogin,
						data: {
							perm_id: uid,
							perm_key: ukey
						},
						success: function(data, status, msg, code) {
							if (200 == status) {
								var id = that.$.setStorageSync('uid', uid);
								var key = that.$.setStorageSync('ukey', ukey);

								that.toMain(data);

								//返回来源页面
							} else {
								that.logout();
							}
						},
						fail: function(err, status) {
							that.logout();
						},
					});
				}
			}
			// #endif

			this.initPosition();
			this.initProvider();

			// #ifdef APP-PLUS
			plus.push.getClientInfoAsync(
				function(info) {
					console.log(info);
					if (info.clientid) {
						that.client_info = JSON.stringify(info);
					}
				},
				function(e) {
					console.log(JSON.stringify(e));
				},
			);
			// #endif

			// #ifdef H5
			//退出登录
			that.logout(false);
			// that.$store.commit('logout',false)
			// #endif


		},
		//仅 5+App 平台上支持此函数。
		onBackPress() {},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			onChangeBindType: function(bind_type) {
				var that = this;
				this.bind_type = bind_type;

				if (this.bind_type == 2) {
					uni.setNavigationBarTitle({
						title: this.__('电子邮箱登录'),
					});

					that.$.showToast({
						icon: 'none',
						title: that.__('请输入电子邮箱'),
					});
				}

				if (this.bind_type == 1) {
					uni.setNavigationBarTitle({
						title: this.__('手机号登录'),
					});

					that.$.showToast({
						icon: 'none',
						title: that.__('请输入手机号'),
					});
				}

				if (this.bind_type == 3) {
					uni.setNavigationBarTitle({
						title: this.__('账号登录'),
					});

					that.$.showToast({
						icon: 'none',
						title: that.__('请输入账号密码'),
					});
				}

				return this.bind_type;
			},

			wxLogin() {
				var that = this;
				// #ifdef H5 ||MP-WEIXIN
				if (that.$.isWeixin()) {
					that.weixin_h5_oauth('weixin');
				}
				// #endif

				// #ifdef APP-PLUS
				that.oauth('weixin')
				// #endif
			},

			intlChange: function(data) {
				this.user_intl = data;
			},
			initProvider() {
				let that = this;
				//const filters = ['weixin', 'qq', 'sinaweibo'];
				//const filters = [];

				//connect
				that.$.request({
					url: that.Config.URL.connect,
					data: {},
					loading: false,
					success: (data, status, msg, code) => {
						if (status == 200) {
							that.connect = data;
							const filters = data.filters;
							console.info(filters);

							// #ifndef H5
							that.$.getProvider({
								service: 'oauth',
								success: (res) => {
									console.log('getProvider==', res)
									if (res.provider && res.provider.length) {
										for (let i = 0; i < res.provider.length; i++) {
											if (~filters.indexOf(res.provider[i])) {
												that.providerList.push({
													value: res.provider[i],
													image: '/static/images/login/' + res
														.provider[i] + '.png',
												});
											}
										}
										that.hasProvider = true;
									}

									//增加第三方的
									let tid = 'fb';
									if (~filters.indexOf(tid)) {
										that.providerList.push({
											value: tid,
											image: '/static/images/login/' + tid + '.png',
										});
									}

									tid = 'google';
									if (~filters.indexOf(tid)) {
										that.providerList.push({
											value: tid,
											image: '/static/images/login/' + tid + '.png',
										});
									}

									console.log(that.providerList);
								},
								fail: (err) => {
									console.error('获取服务供应商失败：' + JSON.stringify(err));
								},
							});
							// #endif

							// #ifdef H5
							//判断是否为APP调用
							if (that.$.ifUniApp()) {
								//1. 初始化加载分享模块
								plus.oauth.getServices(
									function(res) {
										//console.log(JSON.stringify(res));

										if (res && res.length) {
											for (let i = 0; i < res.length; i++) {
												if (~filters.indexOf(res[i]['id'])) {
													if ('weixin' == res[i]['id']) {
														if (that.$.isWeixin()) {
															that.providerList.push({
																value: res[i]['id'],
																image: '/static/images/login/' +
																	res[i]['id'] + '.png',
															});
														}
													} else {
														that.providerList.push({
															value: res[i]['id'],
															image: '/static/images/login/' + res[i]
																['id'] + '.png',
														});
													}
												}

												if ('weixin' == res[i]['id']) {
													that.plusOauthWeixin = res[i];
												}
											}

											that.hasProvider = true;
										}
									},

									function(e) {
										alert('获取分享服务列表失败：' + e.message);
									},
								);

								//setTimeout(share, 5000)
							} else {
								let res = data.items;
								for (let i = 0; i < res.length; i++) {
									if (~filters.indexOf(res[i]['id'])) {
										if ('weixin' == res[i]['id']) {
											if (that.$.isWeixin()) {
												that.providerList.push({
													value: res[i]['id'],
													image: '/static/images/login/' + res[i]['id'] +
														'.png',
												});
											}
										} else {
											that.providerList.push({
												value: res[i]['id'],
												image: '/static/images/login/' + res[i]['id'] + '.png',
											});
										}
									}

									if ('weixin' == res[i]['id']) {
										that.plusOauthWeixin = res[i];
									}
								}

								that.hasProvider = true;
							}
							// #endif
						} else {}
					},
					fail: function() {},
					complete: function() {},
				});
			},
			initPosition() {
				let that = this;
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = that.$.getSystemInfoSync().windowHeight - 100;
			},
			bindLogin() {
				var that = this;

				//登录
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}

				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理，这里仅做示例。
				 */
				/*
            if (this.account.length < 4) {
                that.$.showToast({
                    icon: 'none',
                    title: that.__('账号最短为 4 个字符')
                });
                return;
            }

            if (this.password.length < 6) {
                that.$.showToast({
                    icon: 'none',
                    title: that.__('密码最短为 6 个字符')
                });
                return;
            }
			*/

				that.isRotate = true;
				setTimeout(function() {
					that.isRotate = false;
				}, 2000);

				/**
				 * 下面简单模拟下服务端的处理
				 * 检测用户账号密码是否在已注册的用户列表中
				 * 实际开发中，使用 that.$.request 将账号信息发送至服务端，客户端在回调函数中获取结果信息。
				 */
				//SYS.URL.login,
				if (that.bind_type == 1) {
					if (!that.$.tel(this.account, this.user_intl)) {
						uni.showToast({
							icon: 'none',
							title: that.__('手机号不正确'),
						});

						return false;
					}
				}
				const params = {
					user_account: this.account,
					user_password: this.password,
					client_info: that.client_info,
				};

				if (that.bind_type == 1) {
					params.user_account = this.user_intl + this.account;
				}

				that.$.request({
					url: this.Config.URL.login,
					data: params,
					success: function(data, status, msg, code) {
						// console.info('common_login=',JSON.stringify(data));

						if (200 == status) {
							var id = that.$.setStorageSync('uid', data.user_id);
							var key = that.$.setStorageSync('ukey', data.key);

							// #ifdef H5
							$cookies.set('uid', data.user_id);
							$cookies.set('ukey', data.key);
							// #endif

							data['user_password'] = params.user_password;

							that.toMain(data);
						} else {
							that.$.showToast({
								icon: 'none',
								title: that.__('用户账号或密码不正确'),
							});
						}
					},
					fail: function(err, status) {
						that.$.showToast({
							icon: 'none',
							title: that.__('登录有误，请重试'),
						});
					},
				});
			},
			oauth(value) {
				let that = this;
				if (!this.checkBtnState) {
					uni.showToast({
						icon: 'none',
						title: '请阅读并同意用户协议',
					});
					return;
				}

				if ('fb' == value) {
					/*
				//自研的接口
				let jyappEvents = uni.requireNativePlugin("JY-FaceBookAppEvents");
				jyappEvents.jy_facebookLogin(res=> {
					console.info(res);
					if (res.errorCode == "0")
					{
						that.$.request({
							url: that.Config.URL.do_app_login,
							type: 'POST',
							dataType: 'json',
							data: {
								bind_name: 'fb',
								code: res.data.token,
								openId: res.data.userId,
								nickName: res.data.userId,
								authResponse: JSON.stringify(res['data']),
								client_info:that.client_info
							},
							success: (data, status, msg, code) => {
								console.info(data);

								if (200 == status) {
									var id = that.$.setStorageSync('uid', data.user_id);
									var key = that.$.setStorageSync('ukey', data.key);

									// #ifdef H5
									$cookies.set('uid', data.user_id);
									$cookies.set('ukey', data.key);
									// #endif

									that.toMain(data);
								} else {
									that.$.showToast({
										icon: 'none',
										title: that.__('登录失败！')
									});
								}
							}
						});
					}
					else
					{
						that.$.showToast({
							icon: 'none',
							title: that.__('登录失败！')
						});
					}
				})
				*/

					//云插件https://ext.dcloud.net.cn/plugin?id=3639

					var facebook = uni.requireNativePlugin('sn-facebook');

					// 获取登录状态
					const rs = facebook.isLoggedIn();

					// 登出
					facebook.logout((e) => {
						console.info('---------------------');
						// 登录
						facebook.login((res) => {
							// e 对象如下
							// {
							//     result: true,
							//     data: {
							//         token: '',
							//         userId: '',
							//         name: '',
							//         email: '',
							//         gender: '',
							//         birthday: ''
							//         photo: ''
							//     }
							// }

							console.info(res);
							if (res.result == true) {
								that.$.request({
									url: that.Config.URL.do_app_login,
									type: 'POST',
									dataType: 'json',
									data: {
										bind_name: 'fb',
										code: res.data.token,
										openId: res.data.userId,
										nickName: res.data.name,
										authResponse: JSON.stringify(res['data']),
										client_info: that.client_info,
									},
									success: (data, status, msg, code) => {
										console.info(data);

										if (200 == status) {
											var id = that.$.setStorageSync('uid', data
												.user_id);
											var key = that.$.setStorageSync('ukey', data.key);

											// #ifdef H5
											$cookies.set('uid', data.user_id);
											$cookies.set('ukey', data.key);
											// #endif

											that.toMain(data);
										} else {
											that.$.showToast({
												icon: 'none',
												title: that.__('登录失败！'),
											});
										}
									},
								});
							} else {
								that.$.showToast({
									icon: 'none',
									title: that.__('登录失败！'),
								});
							}
						});
					});
				} else if ('google' == value) {
					//android 配置  https://developers.google.com/identity/sign-in/android/start
					//https://developers.google.com/identity/sign-in/android/start
					//JY-GoogleSignin
					console.info('google init');
					//JY-GoogleSignin
					let JYGoogleSignin = uni.requireNativePlugin('JY-GoogleSignin');
					JYGoogleSignin.jy_init({
							client_id: that.connect.google_app_id,
						},
						(res) => {
							//	这里不会有返回数据

							console.info('google init ok');
						},
					);

					JYGoogleSignin.jy_startLogin((res) => {
						console.info(res);
						if (res.errorCode == '0') {
							that.$.request({
								url: that.Config.URL.do_app_login,
								type: 'POST',
								dataType: 'json',
								data: {
									bind_name: 'google',
									code: res.data.idToken,
									openId: res.data.userId,
									user_email: res.data.email,
									nickName: res.data.fullName,
									avatarUrl: res.data.photoUrl,
									authResponse: JSON.stringify(res['data']),
									client_info: that.client_info,
								},

								success: (data, status, msg, code) => {
									console.info(data);

									if (200 == status) {
										var id = that.$.setStorageSync('uid', data.user_id);
										var key = that.$.setStorageSync('ukey', data.key);

										// #ifdef H5
										$cookies.set('uid', data.user_id);
										$cookies.set('ukey', data.key);
										// #endif

										that.toMain(data);
									} else {
										that.$.showToast({
											icon: 'none',
											title: that.__('登录失败！'),
										});
									}
								},
							});
						} else {
							that.$.showToast({
								icon: 'none',
								title: that.__('登录失败！'),
							});
						}
					});
				} else if ('sms' == value) {
					this.sms_oauth(value);
				} else {
					that.$.login({
						provider: value,
						success: (res) => {
							that.$.getUserInfo({
								provider: value,
								success: (infoRes) => {
									if (infoRes.errMsg == 'getUserInfo:ok') {
										//console.info(JSON.stringify(infoRes));
										//console.info(value);

										/**
										 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
										 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
										 */
										//this.toMain(infoRes.userInfo.nickName);
										var t = infoRes.userInfo;
										t.bind_name = value;

										//{"openId":"o6tGM1biEBK05U1f7-DjAhO8J864","nickName":"黄新泽","gender":1,"city":"闵行","province":"上海","country":"中国","avatarUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJBP1wRhHlbGtp9FGR1go2f3hc21LRcruDqr5hncC4uSwCVYDuyReKSyic00E33sXOXeCWNhkVEHrQ/132","unionId":"ozDRT1vHoz4_NDw7xZ4vsRDasdYg"}

										/*
									if (value == 'weixin')
									{
										let rawData = JSON.parse(infoRes.rawData);

										var encryptedData = encodeURIComponent(rawData.encryptedData); //一定要把加密串转成URI编码
										var iv = encodeURIComponent(rawData.iv);
										var code = t.openId;

										t.code = code;
										t.encryptedData = encryptedData;
										t.iv = iv;
									}
									*/
										t.code = t.openId;

										t.source_store_id = that.$.getStorageSync(
											'source_store_id');
										t.source_user_id = that.$.getStorageSync('source_user_id');
										t.source_ucc_code = that.$.getStorageSync(
											'source_ucc_code');
										t.client_info = that.client_info;

										//请求服务器
										that.$.request({
											url: that.Config.URL.do_app_login,
											data: t,
											success: function(data, status, msg, code) {
												if (status != 200) {
													// 登录错误
													that.$.showModal({
														title: '提示',
														content: '无法登录，请重试！',
														showCancel: false,
													});

													that.$.navigateBack();
													return;
												}

												var id = that.$.setStorageSync('uid',
													data.user_id);
												var key = that.$.setStorageSync('ukey',
													data.key);

												that.toMain(data);
											},
											fail: function() {
												// fail
												// that.$.hideToast();
											},
											complete: function() {
												// complete
											},
										});
									} else {}
								},
							});
						},
						fail: (err) => {
							console.error('授权登录失败：' + JSON.stringify(err));
						},
					});
				}
			},
			goBack() {
				uni.navigateBack({
					delta: 1,
				});
				// uni.reLaunch({
				// 	url: '../index/index'
				// })({
			},
			/* wap app 登录*/
			plus_oauth(value) {
				let that = this;

				// 登录操作
				function authLogin() {
					//console.info('plusOauthWeixin')
					//console.info(that.plusOauthWeixin)
					var s = that.plusOauthWeixin;

					if (!s.authResult) {
						s.login(
							function(e) {
								authUserInfo();
							},
							function(e) {
								alert('登录认证失败！');
							},
						);
					} else {
						//alert( "已经登录认证！" );

						authUserInfo();
					}
				}

				// 获取登录用户信息操作
				function authUserInfo() {
					var s = that.plusOauthWeixin;

					if (!s.authResult) {
						alert('未登录授权！');
					} else {
						s.getUserInfo(
							function(res) {
								////console.info( "获取用户信息成功："+JSON.stringify(res) );
								//alert( "获取用户信息成功："+JSON.stringify(s.userInfo) );

								var value = 'weixin';
								var infoRes = res.target;

								if (true) {
									/**
									 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
									 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
									 */
									//this.toMain(infoRes.userInfo.nickName);
									var t = infoRes.userInfo;
									t.bind_name = value;

									//{"openId":"o6tGM1biEBK05U1f7-DjAhO8J864","nickName":"黄新泽","gender":1,"city":"闵行","province":"上海","country":"中国","avatarUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJBP1wRhHlbGtp9FGR1go2f3hc21LRcruDqr5hncC4uSwCVYDuyReKSyic00E33sXOXeCWNhkVEHrQ/132","unionId":"ozDRT1vHoz4_NDw7xZ4vsRDasdYg"}

									if (value == 'weixin') {
										/*
						        let rawData = JSON.parse(infoRes.rawData);

						        var encryptedData = encodeURIComponent(rawData.encryptedData); //一定要把加密串转成URI编码
						        var iv = encodeURIComponent(rawData.iv);
						        var code = t.openId;

						        t.encryptedData = encryptedData;
						        t.iv = iv;
								*/
										t.code = t.openid;
									}

									t.source_store_id = that.$.getStorageSync('source_store_id');
									t.source_user_id = that.$.getStorageSync('source_user_id');
									t.source_ucc_code = that.$.getStorageSync('source_ucc_code');
									t.client_info = that.client_info;

									//请求服务器
									that.$.request({
										url: that.Config.URL.do_app_login,
										data: t,
										success: function(data, status, msg, code) {
											if (status != 200) {
												// 登录错误
												that.$.showModal({
													title: '提示',
													content: '无法登录，请重试！',
													showCancel: false,
												});

												that.$.navigateBack();
												return;
											}

											var id = that.$.setStorageSync('uid', data.user_id);
											var key = that.$.setStorageSync('ukey', data.key);

											that.toMain(data);
										},
										fail: function() {
											// fail
											// that.$.hideToast();
										},
										complete: function() {
											// complete
										},
									});
								} else {}
							},
							function(e) {
								alert('获取用户信息失败：' + e.message + ' - ' + e.code);
							},
						);
					}
				}
				authLogin();
				/*
		    that.$.login({
		        provider: value,
		        success: res => {
		            that.$.getUserInfo({
		                provider: value,
		                success: infoRes => {
		                    if (infoRes.errMsg == 'getUserInfo:ok')
		                    {
		                        //console.info(JSON.stringify(infoRes));
		                        //console.info(value);

		                        //this.toMain(infoRes.userInfo.nickName);
		                        var t = infoRes.userInfo;
		                        t.bind_name = value;

		                        //{"openId":"o6tGM1biEBK05U1f7-DjAhO8J864","nickName":"黄新泽","gender":1,"city":"闵行","province":"上海","country":"中国","avatarUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJBP1wRhHlbGtp9FGR1go2f3hc21LRcruDqr5hncC4uSwCVYDuyReKSyic00E33sXOXeCWNhkVEHrQ/132","unionId":"ozDRT1vHoz4_NDw7xZ4vsRDasdYg"}

		                        if (value == 'weixin')
		                        {
		                            let rawData = JSON.parse(infoRes.rawData);

		                            var encryptedData = encodeURIComponent(rawData.encryptedData); //一定要把加密串转成URI编码
		                            var iv = encodeURIComponent(rawData.iv);
		                            var code = t.openId;

		                            t.code = code;
		                            t.encryptedData = encryptedData;
		                            t.iv = iv;
		                        }

		                        t.source_store_id = that.$.getStorageSync('source_store_id');
		                        t.source_user_id = that.$.getStorageSync('source_user_id');

		                        //请求服务器
		                        that.$.request({
		                            url: that.Config.URL.do_app_login,
		                            data: t,
		                            success: function(data, status, msg, code) {
		                                if (status != 200) {
		                                    // 登录错误
		                                    that.$.showModal({
		                                        title: '提示',
		                                        content: '无法登录，请重试！',
		                                        showCancel: false
		                                    });

		                                    that.$.navigateBack();
		                                    return;
		                                }

		                                var id = that.$.setStorageSync('uid', data.user_id);
		                                var key = that.$.setStorageSync('ukey', data.key);

		                                that.toMain(data);
		                            },
		                            fail: function() {
		                                // fail
		                                // that.$.hideToast();
		                            },
		                            complete: function() {
		                                // complete
		                            }
		                        });
		                    }
		                    else
		                    {

		                    }
		                }
		            });
		        },
		        fail: err => {
		            console.error('授权登录失败：' + JSON.stringify(err));
		        }
		    });
			*/
			},

			h5_oauth(id) {
				let that = this;

				console.log('---id----', id);

				if ('fb' == id) {
					this.fb_oauth(id);
				} else if ('google' == id) {
					this.google_oauth(id);
				} else if ('weixin' == id) {
					this.weixin_h5_oauth(id);
				} else if ('sms' == id) {
					this.sms_oauth(id);
				} else if ('qq' == id) {
					this.qq_oauth(id);
				}
			},

			weixin_h5_oauth(id) {
				let that = this;

				let uid = $cookies.get('uid');
				let ukey = $cookies.get('ukey');

				if (uid && ukey) {

				} else {
					uid = that.$.getStorageSync('uid');
					ukey = that.$.getStorageSync('ukey');
				}
				//判断Cookie是否登录
				if (uid && ukey) {

					that.$.request({
						url: this.Config.URL.check_islogin,
						data: {
							perm_id: uid,
							perm_key: ukey
						},
						success: function(data, status, msg, code) {
							if (200 == status) {
								var id = that.$.setStorageSync('uid', uid);
								var key = that.$.setStorageSync('ukey', ukey);

								//data['as'] = $cookies.get('as');//作废,读取后端传值
								that.toMain(data);

								//返回来源页面
							} else {
								that.logout();
							}
						},
						fail: function(err, status) {
							that.logout();
						},
					});
				} else {
					if (getCurrentPages()[getCurrentPages().length - 1].route == 'pages/login/login' || getCurrentPages()[
							getCurrentPages().length - 1].route == '/pages/login/login') {
						//记录来源页面
						if (getCurrentPages().length > 1) {
							var prePage = getCurrentPages()[getCurrentPages().length - 2];
							if (prePage) {
								that.$.setStorageSync('pre_route', prePage.route);
								if (prePage.options) {
									that.$.setStorageSync('pre_options', prePage.options);
								}
							}
						} else {}

						//是否企业微信
						if (that.$.isQyWeixin()) {
							window.location.href = that.Config.URL.wx.mplogin + '?wxwork=1' + '&callback=' +
								encodeURIComponent(that.Config.CONFIG.base_url + '/h5/pages/login/login'); //暂时注释
						} else {
							// alert('weixin_h5_oauth')
							window.location.href = that.Config.URL.wx.mplogin + '?callback=' + encodeURIComponent(that
								.Config.CONFIG.base_url + '/h5/pages/login/login'); //暂时注释
						}
					} else {
						var prePage = getCurrentPages()[getCurrentPages().length - 1];
						if (prePage) {
							that.$.setStorageSync('pre_route', prePage.route);

							if (prePage.options) {
								that.$.setStorageSync('pre_options', prePage.options);
							}
						}
						//记录来源页面

						//是否企业微信
						if (that.$.isQyWeixin()) {
							window.location.href = that.Config.URL.wx.mplogin + '?wxwork=1' + '&callback=' +
								encodeURIComponent(that.Config.CONFIG.base_url + '/h5/pages/login/login'); //暂时注释
						} else {
							window.location.href = that.Config.URL.wx.mplogin + '?callback=' + encodeURIComponent(that
								.Config.CONFIG.base_url + '/h5/pages/login/login'); //暂时注释
						}
					}
				}
			},

			weibo_oauth(id) {
				let that = this;
			},

			qq_oauth(id) {
				let that = this;

				// #ifdef H5
				//H5调用  forcedLoginState: true,  window.location 跳转
				let pre_route = that.$.getStorageSync('pre_route');
				let pre_options = that.$.getStorageSync('pre_options');

				let base_url = that.cf.CONFIG.base_url + '/h5';
				let return_url = base_url + '/pages/my/my';
				let pre_url = '';

				if (pre_route) {
					pre_url = '/' + that.$.createUrl(pre_route, pre_options);

					pre_url = '?jump=' + encodeURIComponent(pre_url);
				} else {}

				return_url = return_url + pre_url;

				let url = that.connect.qq_url;

				/*
			if ((url.indexOf("?") != -1))
			{
				url = url + '&enbed=hybird&callback=' + encodeURIComponent(return_url);
			}
			else
			{
				url = url + '?enbed=hybird&callback=' + encodeURIComponent(return_url);
			}

			url = url + '&rand=' + Math.random()
			*/

				// #endif

				// #ifdef H5
				setTimeout(() => {
					window.location.href = url;
				}, 100);
				// #endif
			},

			fb_oauth(id) {
				let that = this;

				FB.login(function(response) {
					console.info(response.authResponse);
					if (response.authResponse) {
						console.log('Welcome!  Fetching your information.... ');
						FB.api('/me', function(me) {
							console.log('Good to see you, ' + me.name + '.');

							that.$.request({
								url: that.Config.URL.do_app_login,
								type: 'POST',
								dataType: 'json',
								data: {
									bind_name: 'fb',
									code: response['authResponse']['accessToken'],
									openId: response['authResponse']['userID'],
									nickName: me.name,
									authResponse: JSON.stringify(response['authResponse']),
								},
								success: function(data, status, msg, code) {
									console.info(data);

									if (200 == status) {
										var id = that.$.setStorageSync('uid', data.user_id);
										var key = that.$.setStorageSync('ukey', data.key);

										// #ifdef H5
										$cookies.set('uid', data.user_id);
										$cookies.set('ukey', data.key);
										// #endif

										that.toMain(data);
									} else {
										that.$.showToast({
											icon: 'none',
											title: that.__('登录失败！'),
										});
									}
								},
							});
						});
					} else {
						that.$.showToast({
							icon: 'none',
							title: that.__('User cancelled login or did not fully authorize.'),
						});
					}
				});
			},

			google_oauth(id) {
				let that = this;

				// #ifdef H5
				//H5调用  forcedLoginState: true,  window.location 跳转
				let pre_route = that.$.getStorageSync('pre_route');
				let pre_options = that.$.getStorageSync('pre_options');

				let base_url = that.cf.CONFIG.base_url + '/h5';
				let return_url = base_url + '/pages/my/my';
				let pre_url = '';

				if (pre_route) {
					pre_url = '/' + that.$.createUrl(pre_route, pre_options);

					pre_url = '?jump=' + encodeURIComponent(pre_url);
				} else {}

				return_url = return_url + pre_url;

				let url = that.connect.google_url;

				/*
			if ((url.indexOf("?") != -1))
			{
				url = url + '&enbed=hybird&callback=' + encodeURIComponent(return_url);
			}
			else
			{
				url = url + '?enbed=hybird&callback=' + encodeURIComponent(return_url);
			}

			url = url + '&rand=' + Math.random()
			*/

				// #endif

				// #ifdef H5
				setTimeout(() => {
					window.location.href = url;
				}, 100);
				// #endif
			},

			sms_oauth(id) {
				let that = this;
				that.$.gopage('/pagesub/login/sms');
				// that.$.gopage('/pagesub/login/smslogin');
			},

			toMain(userInfo) {
				// console.log('toMain1',userInfo)
				var that = this;

				that.$.request({
					url: this.Config.URL.user.overview,
					loading: false,
					success: function(data, status, msg, code) {
						userInfo = Object.assign(userInfo, data.member_info);
						that.login(userInfo);

						if (userInfo.im && that.plantformInfo.config.chat_global) {
							that.$Socket.connectserver(userInfo.im);
						}

						that.notice.postNotificationName('RefreshCart', 0);

						//判断是否需要进入激活页面
						if (2 == userInfo.user_state) {
							that.$.toActive();
						}

						/**
						 * 强制登录时使用reLaunch方式跳转过来
						 * 返回首页也使用reLaunch方式
						 */
						if (that.forcedLoginState) {
							that.$.reLaunch({
								url: '/pages/my/my',
							});
						} else {
							// #ifdef H5
							// that.$.switchTab({
							// 	url: '/pages/my/my',
							// });
							// var prePage = getCurrentPages().length;
							// alert('toMain=prePage2=',prePage.route)
							if (getCurrentPages().length >= 2) {
								var prePage = getCurrentPages()[getCurrentPages().length - 2];
								if ('pages/login/login' == prePage.route || '/pages/login/login' == prePage
									.route) {
									that.$.switchTab({
										url: '/pages/my/my',
									});
								} else {
									prePage.onLoad && prePage.onLoad(prePage.options);
									that.$.navigateBack();
								}
							} else {
								//微信登录最后走这里
								let pre_route = that.$.getStorageSync('pre_route');
								let pre_options = that.$.getStorageSync('pre_options');
								let pre_url = '';
								if (pre_route) {
									pre_url = '/' + that.$.createUrl(pre_route, pre_options);
									that.$.reLaunch({
										url: pre_url,
									});
								} else {
									that.$.switchTab({
										url: '/pages/my/my',
									});
								}
							}
							// #endif
							// #ifdef APP-PLUS
							that.$.navigateBack();
							// #endif

							// if (getCurrentPages()[getCurrentPages().length - 1].route == 'pages/login/login' ||
							// 	getCurrentPages()[getCurrentPages().length - 1].route == '/pages/login/login'
							// ) {
							// 	console.log('toMain=', "3")
							// 	if (getCurrentPages().length > 1) {
							// 		var prePage = getCurrentPages()[getCurrentPages().length - 2];
							// 		console.log('toMain=', "4")
							// 		// #ifndef H5
							// 		if ('pages/login/login' == prePage.route || '/pages/login/login' == prePage
							// 			.route) {
							// 			that.$.switchTab({
							// 				url: '/pages/my/my',
							// 			});
							// 		} else {
							// 			if (prePage.refreshData) {
							// 				prePage.refreshData(prePage.options);
							// 				that.$.navigateBack();
							// 			} else if (prePage.onLoad) {
							// 				prePage.onLoad(prePage.options);
							// 				that.$.navigateBack();
							// 			} else {
							// 				let pre_url = '/' + that.$.createUrl(prePage.route, prePage
							// 					.options);
							// 				that.$.gotopage(pre_url);
							// 			}
							// 		}
							// 		// #endif

							// 		if(that.showLogBtn == false){
							// 			that.$.switchTab({
							// 				url: '/pages/my/myself',
							// 			});
							// 		}else{
							// 			that.$.switchTab({
							// 				url: '/pages/my/my',
							// 			});
							// 		}

							// 		// if (uni.getSystemInfoSync().platform == "ios" && that.showLogBtn == false) {
							// 		// 	uni.navigateBack({
							// 		// 		delta: 1
							// 		// 	})
							// 		// }
							// 	} else {
							// 		console.log('toMain=', "5")
							// 		//回到上个页面
							// 		if(that.showLogBtn == false){
							// 			that.$.switchTab({
							// 				url: '/pages/my/myself',
							// 			});

							// 		}else{
							// 			that.$.switchTab({
							// 				url: '/pages/my/my',
							// 			});
							// 		}
							// 	}
							// } else {
							// 	console.log('toMain=', "6")
							// 	var prePage = getCurrentPages()[getCurrentPages().length - 1];

							// 	if ('pages/login/login' == prePage.route || '/pages/login/login' == prePage
							// 		.route) {
							// 		that.$.switchTab({
							// 			url: '/pages/my/my',
							// 		});
							// 	} else {
							// 		prePage.onLoad && prePage.onLoad(prePage.options);
							// 	}

							// 	//that.$.navigateBack();
							// }
						}
					},
				});
			},

			getUserProfile: function(e) {
				var that = this;

				wx.getUserProfile({
					desc: '获取你的昵称、头像、地区及性别', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res2) => {
						console.log(res2);
						that.data.userInfo = res2.userInfo;
						that.bindGetUserInfo({
							detail: that.data
						});
					},
					fail: function(err) {
						console.log('获取失败: ', err);
						that.bindGetUserInfo({
							detail: that.data
						});
					},
				});
			},

			bindGetUserInfo: function(res2) {
				var that = this;

				if (!this.protocol_checked) {
					this.$.showModal({
						title: this.__('提示'),
						content: this.__('请先阅读并同意用户协议'),
						showCancel: false,
					});

					return;
				}

				let login_func = that.$.login;
				if (this.wxwork) {
					login_func = wx.qy.login;

					//console.info(res2);
					if (res2.detail.errMsg == 'getUserInfo:ok') {
						that.setData({
							isAuthorizationed: !1
						});
						var wx_user = that.$.parseJSON(res2.detail.rawData);
						login_func({
							success: function(qy_datainfo) {
								that.$.login({
									success: function(res) {
										var t = {
											code: res.code,
											wxwork: that.wxwork,
											NickName: wx_user.nickName,
											sex: wx_user.gender,
											photo: wx_user.avatarUrl,
											WXCountry: wx_user.country,
											WXCity: wx_user.city,
											WXProvince: wx_user.province,
											Uid: 0,
											storeId: 0,
										};

										var encryptedData = encodeURIComponent(res2.detail
											.encryptedData); //一定要把加密串转成URI编码
										var iv = encodeURIComponent(res2.detail.iv);
										var code = res.code;

										//请求服务器
										that.$.request({
											url: that.Config.URL.wx.applogin,
											data: {
												qy_code: qy_datainfo.code,
												code: code,
												wxwork: that.wxwork,
												encryptedData: encryptedData,
												iv: iv,
												source_store_id: that.$.getStorageSync(
													'source_store_id'),
												source_user_id: that.$.getStorageSync(
													'source_user_id'),
												source_ucc_code: that.$.getStorageSync(
													'source_ucc_code'),
												client_info: that.client_info,
												user_info: res2.detail.userInfo,
											},
											success: function(data, status, msg,
												code) {
												if (status != 200) {
													// 登录错误
													that.$.showModal({
														title: '提示',
														content: '无法登录，请重试！',
														showCancel: false,
													});

													that.$.navigateBack();
													return;
												}

												var id = that.$.setStorageSync(
													'uid', data.user_id);
												var key = that.$.setStorageSync(
													'ukey', data.key);

												that.toMain(data);
											},
											fail: function() {
												// fail
												// that.$.hideToast();
											},
											complete: function() {
												// complete
											},
										});
									},
								});
							},
						});
					}
				} else {
					//console.info(res2);
					if (res2.detail.errMsg == 'getUserInfo:ok') {
						that.setData({
							isAuthorizationed: !1
						});
						var wx_user = that.$.parseJSON(res2.detail.rawData);
						login_func({
							success: function(res) {
								var t = {
									code: res.code,
									wxwork: that.wxwork,
									NickName: wx_user.nickName,
									sex: wx_user.gender,
									photo: wx_user.avatarUrl,
									WXCountry: wx_user.country,
									WXCity: wx_user.city,
									WXProvince: wx_user.province,
									Uid: 0,
									storeId: 0,
								};

								var encryptedData = encodeURIComponent(res2.detail
									.encryptedData); //一定要把加密串转成URI编码
								var iv = encodeURIComponent(res2.detail.iv);
								var code = res.code;

								//请求服务器
								that.$.request({
									url: that.Config.URL.wx.applogin,
									data: {
										code: code,
										encryptedData: encryptedData,
										iv: iv,
										source_store_id: that.$.getStorageSync('source_store_id'),
										source_user_id: that.$.getStorageSync('source_user_id'),
										source_ucc_code: that.$.getStorageSync('source_ucc_code'),
										client_info: that.client_info,
										user_info: res2.detail.userInfo,
									},
									success: function(data, status, msg, code) {
										if (status != 200) {
											// 登录错误
											that.$.showModal({
												title: '提示',
												content: '无法登录，请重试！',
												showCancel: false,
											});

											that.$.navigateBack();
											return;
										}

										var id = that.$.setStorageSync('uid', data.user_id);
										var key = that.$.setStorageSync('ukey', data.key);

										that.toMain(data);
									},
									fail: function() {
										// fail
										// that.$.hideToast();
									},
									complete: function() {
										// complete
									},
								});
							},
						});
					}
				}
			},

			onChangeProtocol: function(e) {
				var values = e.detail.value;

				if (values.length > 0) {
					this.protocol_checked = true;
				} else {
					this.protocol_checked = false;
				}
			},

			showProtocol: function(id) {
				uni.navigateTo({
					url: '/member/member/protocol?id=' + id,
				});
			},
			startLogin: function() {
				//登录
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}

				console.info(this.account);
				console.info(typeof this.account);
				if (this.account.length == '') {
					uni.showToast({
						icon: 'none',
						title: '用户名不能为空',
					});
					return;
				}
				if (this.password.length < 5) {
					uni.showToast({
						icon: 'none',
						title: '密码不正确',
					});
					return;
				}

				console.log('登录成功');

				_this.isRotate = true;
				setTimeout(function() {
					_this.isRotate = false;
				}, 3000);
				// uni.showLoading({
				// 	title: '登录中'
				// });
				// getLogin()
				// .then(res => {
				// 	//console.log(res)
				// 	//简单验证下登录（不安全）
				// 	if(_this.account==res.data.username && _this.password==res.data.password){
				// 		let userdata={
				// 			"username":res.data.username,
				// 			"nickname":res.data.nickname,
				// 			"accesstoken":res.data.accesstoken,
				// 		} //保存用户信息和accesstoken
				// 		_this.$store.dispatch("setUserData",userdata); //存入状态
				// 		try {
				// 			uni.setStorageSync('setUserData', userdata); //存入缓存
				// 		} catch (e) {
				// 			// error
				// 		}
				// 		uni.showToast({
				// 			icon: 'success',
				// 			position: 'bottom',
				// 			title: '登录成功'
				// 		});
				// 		uni.reLaunch({
				// 			url: '../../../pages/index',
				// 		});
				// 	}else{
				// 		_this.password=""
				// 		uni.showToast({
				// 			icon: 'error',
				// 			position: 'bottom',
				// 			title: '账号或密码错误，账号admin密码admin'
				// 		});
				// 	}
				// 	uni.hideLoading();
				// }).catch(err => {
				// 	uni.hideLoading();
				// })
			},
			// 自定义授权页面 UI 样式
			setCustomUIWithConfig: function() {
				let self = this;
				self.jv.addCustomViewsClickCallback(id => {
					console.log("Callback-:" + JSON.stringify(id));
					if (id == 'btntag1') {
						self.oauth('weixin');
					} else if (id == 'btntag2') {
						uni.navigateTo({
							url: '/pagesub/login/sms'
						})

					} else if (id == 'loginBtn') {
						self.jv.getToken(5000, result => {
							if (result.code == 2000) {
								self.loginToken = result.content;
								self.doLogin()
							} else {
								// uni.navigateBack({
								// 	delta: 1
								// })
							}
						})

					}

				});
				if (uni.getSystemInfoSync().platform == "ios") {

					if (this.showLogBtn == true) {

						this.jv.setCustomUIWithConfigiOS({
							navColor: 0xff000000,
							//页面弹窗方式
							// modalTransitionStyle: "PartialCurl",
							//导航栏是否是透明
							navTransparent: true,
							//协议页导航栏背景颜色
							agreementNavBackgroundColor: 0xff999999,

							//logo 设置的参数
							logoImg: 'static/images/login/logotop.png',
							logoWidth: 200,
							logoHeight: 56,
							logoOffsetY: 80,
							// logoConstraints:[0,-100,200,56]
							//手机号
							numberSize: 25,
							numFieldOffsetY: 200,
							// numberColor:0xffFC4B21,
							//slogan
							sloganTextColor: 0xffCCCCCC,

							//登录按钮
							// logBtnOffsetY:
							logBtnText: "本机号码一键登录",
							logBtnConstraints: [0, 0, 320, 45],
							// logBtnCornerRadius: 22,
							// logBtnBackgroundColor: 0xffFC4B21,
							logBtnImgs: ['static/images/login/login_bg.png',
								'static/images/login/login_bg.png',
								'static/images/login/login_bg.png'
							],

							//checkBox
							checkedImg: 'static/images/login/checksel.png',
							uncheckedImg: 'static/images/login/checkunsel.png',
							//协议按钮 默认选择状态
							privacyState: false,
							isAlertPrivacyVC: true,
							privacyCheckToastMessage: '请勾选协议',
							checkViewConstraints: [-165, self.screenheight / 2 - 40, 17, 17],
							//隐私条款
							privacyConstraints: [0, self.screenheight / 2 - 30, 300, 36],
							appPrivacyColor: [0xff999999, 0xffFC4B21],
							privacyTextFontSize: 12,
							privacyOffsetY: 30,
							privacyTextAlignment: "left",
							appPrivacys: [
								"同意",
								["和", "用户服务协议、隐私政策",
									"https://shop.zcskjy.com/h5/my/setting/protocol?id=reg_protocols_description&no_btn=1",
									"内部自定义条款1"
								],
								// ["、", "自定义条款2", "https://www.baidu.com/", "内部自定义条款2"],
								// ["、", "自定义条款3", "https://www.baidu.com/", "内部自定义条款3"],
								"并授权中财数科获得本机号码"
							],
							addCustomViews: [{
									type: "button",
									id: "backBtn",
									width: 20,
									height: 20,
									isFinish: true, //是否在授权页面通过自定义控件button的点击关闭授权页面
									backgroundImagePath: "static/images/login/back.png", // button正常情况下背景图片路径
									// bgColor:0xff999999,
									left: 25,
									top: 50,
									// margins: [20, 80, 0, 0],
									// align:9,
								},
								{
									type: "button",
									id: "title1",
									width: self.screenwidth,
									height: 20,
									title: "—— 其他登录方式 ——",
									textColor: 0xff666666,
									textFont: 14,
									bottom: -290,

									// backgroundColor: 0xff7b68ee,
								},
								{
									type: "button",
									id: "btntag1",
									width: 50,
									height: 50,
									left: 100,
									bottom: -200,
									isFinish: true, //是否在授权页面通过自定义控件button的点击关闭授权页面
									backgroundImagePath: "static/images/login/weixinImg.png", // button正常情况下背景图片路径
									// normalImagePath:"static/bg.jpeg"  // 设置button图片路径
								},
								{
									type: "button",
									id: "btntag2",
									width: 50,
									height: 50,
									right: -100,
									bottom: -200,
									isFinish: true, // 是否在授权页面通过自定义控件button的点击关闭授权页面
									backgroundImagePath: "static/images/login/mobileImg.png", // button正常情况下背景图片路径
									// normalImagePath:"static/bg.jpeg"  // 设置button图片路径
								},
								{
									type: "label",
									width: 100,
									height: 17,
									bottom: -160,
									left: 76,
									text: "微信登录（推荐）",
									textFont: 12,
									textAlignment: 1,
									textColor: 0xff666666,
								},
								{
									type: "label",
									width: 65,
									height: 17,
									bottom: -160,
									right: -90,
									text: "验证码登录",
									textFont: 12,
									textAlignment: 1,
									// backgroundColor: 0xff7b68ee,
									textColor: 0xff666666,
								},

							]
						})


					} else {

						this.jv.setCustomUIWithConfigiOS({
							navColor: 0xff000000,
							//页面弹窗方式
							// modalTransitionStyle: "PartialCurl",
							//导航栏是否是透明
							navTransparent: true,
							//协议页导航栏背景颜色
							agreementNavBackgroundColor: 0xff999999,

							//logo 设置的参数
							logoImg: 'static/images/login/logotop.png',
							logoWidth: 200,
							logoHeight: 56,
							logoOffsetY: 80,
							// logoConstraints:[0,-100,200,56]
							//手机号
							numberSize: 25,
							numFieldOffsetY: 200,
							// numberColor:0xffFC4B21,
							//slogan
							sloganTextColor: 0xffCCCCCC,

							//登录按钮
							// logBtnOffsetY:
							logBtnText: "本机号码一键登录",
							logBtnConstraints: [0, 0, 320, 45],
							// logBtnCornerRadius: 22,
							// logBtnBackgroundColor: 0xffFC4B21,
							logBtnImgs: ['static/images/login/login_bg.png',
								'static/images/login/login_bg.png',
								'static/images/login/login_bg.png'
							],

							//checkBox
							checkedImg: 'static/images/login/checksel.png',
							uncheckedImg: 'static/images/login/checkunsel.png',
							//协议按钮 默认选择状态
							privacyState: false,
							isAlertPrivacyVC: true,
							privacyCheckToastMessage: '请勾选协议',
							checkViewConstraints: [-165, self.screenheight / 2 - 40, 17, 17],
							//隐私条款
							privacyConstraints: [0, self.screenheight / 2 - 30, 300, 36],
							appPrivacyColor: [0xff999999, 0xffFC4B21],
							privacyTextFontSize: 12,
							privacyOffsetY: 30,
							privacyTextAlignment: "left",
							appPrivacys: [
								"同意",
								["和", "用户服务协议、隐私政策",
									"https://shop.zcskjy.com/h5/my/setting/protocol?id=reg_protocols_description&no_btn=1",
									"内部自定义条款1"
								],
								// ["、", "自定义条款2", "https://www.baidu.com/", "内部自定义条款2"],
								// ["、", "自定义条款3", "https://www.baidu.com/", "内部自定义条款3"],
								"并授权中财数科获得本机号码"
							],
							addCustomViews: [{
									type: "button",
									id: "backBtn",
									width: 20,
									height: 20,
									isFinish: true, //是否在授权页面通过自定义控件button的点击关闭授权页面
									backgroundImagePath: "static/images/login/back.png", // button正常情况下背景图片路径
									// bgColor:0xff999999,
									left: 25,
									top: 50,
									// margins: [20, 80, 0, 0],
									// align:9,
								},

							]
						})

					}


				} else {

					this.jv.setCustomUIWithConfigAndroid({

						setNavColor: 0xffffffff,
						// setNavReturnImgPath:'static/images/login/back.png',
						setNavTransparent: true,

						///*
						setPrivacyNavColor: 0xff999999,
						setNavColor: 0xff000000,
						enableHintToast: true,
						enableHintToastText: '请勾选协议',
						setLoadingViewEnable: true,
						//导航栏透明
						setStatusBarTransparent: true,

						//log
						setLogoImgPathFromJs: 'static/images/login/logotopImg.png',
						// setLogoImgPath:'static/images/login/logotop.png',
						setLogoWidth: 200,
						setLogoHeight: 56,
						setLogoOffsetY: 80,
						//手机号
						setNumberSize: 25,
						setNumFieldOffsetY: 200,
						setNumberColor: 0xff333333,
						// numberColor:0xffFC4B21,
						//slogan
						setSloganTextColor: 0xffCCCCCC,
						setSloganOffsetY: 245,
						setSloganTextSize: 12,

						//登录按钮
						setLogBtnText: "本机号码一键登录",
						// setLogBtnTextColor:0xffFFFFFF,
						// setLogBtnTextColor:0xff666666,
						// setLogBtnImgPath:'static/images/login/login_bg.png',

						setLogBtnWidth: 320,
						setLogBtnHeight: 45,
						setLogBtnTextSize: 16,
						setLogBtnOffsetY: self.screenheight / 2 - 100,

						// //协议按钮 默认选择状态
						enableHintToast: true,
						enableHintToastText: "请勾选协议",
						//条款	
						setPrivacyState: false,
						// setCheckedImgPathFromJs:'static/images/login/checksel.png',
						// setUncheckedImgPathFromJs:'static/images/login/checkunsel.png',

						setPrivacyOffsetX: 27,
						setPrivacyText: ['同意', '并授权中财数科获得本机号码'],
						setAppPrivacyColor: [0xff999999, 0xffFC4B21],
						setPrivacyTextSize: 12,
						setPrivacyCheckboxSize: 17,
						setPrivacyTopOffsetY: self.screenheight - 120,

						setPrivacyNameAndUrlBeanList: [{
							name: "服务协议、隐私条款",
							url: "https://shop.zcskjy.com/h5/my/setting/protocol?id=reg_protocols_description&no_btn=1",
							beforeName: "和",
							afterName: ","
						}],

						addCustomViews: [{
								type: "button",
								id: "backBtn",
								width: 20,
								height: 20,
								finishFlag: true, //是否在授权页面通过自定义控件button的点击关闭授权页面
								bgImgPath: "static/images/login/back.png", // button正常情况下背景图片路径
								bgColor: 0xff999999,
								margins: [20, 0, 0, 0],
								align: 9,
							},
							{
								type: "image",
								// finishFlag:true,
								id: "id222",
								width: 200,
								height: 56,
								align: 10,
								margins: [100, 50, 100, 0],
								bgImgPath: "static/images/login/logotop.png"
							},
							// {
							// 	type: "button",
							// 	id: "loginBtn",
							// 	width: 320,
							// 	height: 45,
							// 	text:'本机号码一键登录',
							// 	textColor:0xffffffff,
							// 	textSize:16,
							// 	finishFlag: true, //是否在授权页面通过自定义控件button的点击关闭授权页面
							// 	bgImgPath: "static/images/login/login_bg.png", // button正常情况下背景图片路径
							//     margins: [0, 0, 0, 0],
							// 	align:13,
							// },
							{
								type: "text",
								id: "title1",
								width: 150,
								height: 20,
								// bottom: -280,
								align: 14,
								margins: [100, 450, 100, 0],
								text: "—— 其他登录方式 ——",
								textFont: 14,
								//textColor: 0xff666666,
								textColor: 0xffFC4B21,
								// bgColor: 0xffcccccc,
							},
							{
								type: "button",
								id: "btntag1",
								width: 50,
								height: 50,
								finishFlag: true, //是否在授权页面通���自定义控件button的点击关闭授权页面
								bgImgPath: "static/images/login/weixinImg.png", // button正常情况下背景图片路径
								margins: [100, 500, 0, 50],
								align: 9,
							},
							{
								type: "button",
								id: "btntag2",
								width: 50,
								height: 50,
								finishFlag: true, // 是否在授权页面通过自定义控件button的���击关闭授权页面
								bgImgPath: "static/images/login/mobileImg.png", // button正常情况下背景图片路径
								margins: [0, 500, 100, 50],
								align: 11,
							},
							{
								type: "text",
								width: 120,
								height: 17,
								// bottom: -160,
								// left: 76,
								text: "微信登录(推荐)",
								textFont: 12,
								textColor: 0xff666666,
								margins: [76, 570, 0, 160],
								align: 9,
							},
							{
								type: "text",
								width: 80,
								height: 17,
								// bottom: -160,
								// right: -90,
								text: "验证码登录",
								textFont: 12,
								textColor: 0xff666666,
								margins: [0, 570, 80, 160],
								align: 11,
							},

						],
					})
				}
			},

			// 一键登录
			loginAuth: function() {
				let self = this;
				self.jv.checkVerifyEnable(result => {
					console.log('checkVerifyEnable', result)
					if (result.enable) {
						self.jv.loginAuth({
							autoFinish: true,
							timeout: 5000
						}, result => {
							console.log('loginAuth', JSON.stringify(result));
							self.loginToken = result.content;
							if (result.code == 6000)
								self.doLogin()
							else
								uni.navigateBack({
									delta: 1
								})
						}, event => {
							// self.showModal('loginAuth event=', JSON.stringify(event));
							console.log("loginAuthevent:" + JSON.stringify(event));
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: '当前网络不支持一键认证',
						});

					}
				})

			},
			intlChange: function(data) {
				this.user_intl = data;
			},

			checkBtnSelect() {

				this.checkBtnState = !this.checkBtnState;


			},

			/* start 图形验证码 */
			refresh: function() {
				//this.$refs.imgcode.refresh();
			},
			show: function() {
				var _self = this;
				setTimeout(function() {
					_self.refresh();
				}, 500);
			},
			onInputImgCode: function(e) {
				if (e.detail.value.toLocaleLowerCase() == uni.getStorageSync('imgcode').toLocaleLowerCase()) {
					this.setData({
						isImgCode: true
					})
				} else {
					this.setData({
						isImgCode: false
					})
				}
			},
			/* end 图形验证码 */

			inputuser_email: function(e) {
				let that = this;
				this.setData({
					user_email: e.detail.value
				}), that.$.isNull(e.detail.value) ? this.setData({
					isUserEmail: !1
				}) : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(e.detail.value) ? this.setData({
					isUserEmail: !0
				}) : this.setData({
					isUserEmail: !1
				})
			},

			async oneLogin() {
				if (!this.checkBtnState) {
					uni.showToast({
						icon: 'none',
						title: '请阅读并同意用户协议',
					});
					return;
				}
				// #ifdef APP-PLUS
				this.screenheight = uni.getSystemInfoSync().windowHeight;
				this.screenwidth = uni.getSystemInfoSync().windowWidth;

				await this.setCustomUIWithConfig()
				this.loginAuth()
				// #endif
			},

			startReg: function(e) {
				let that = this;
				if (!this.checkBtnState) {
					uni.showToast({
						icon: 'none',
						title: '请阅读并同意用户协议',
					});
					return;
				}
				//注册
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}

				if (!that.$.tel(this.user_mobile, this.user_intl)) {
					this.setData({
						isUserMobile: !1
					});

					uni.showToast({
						icon: 'none',
						title: that.__('手机号不正确')
					});

					return false;
				}


				if (this.mobile_code.length != 4) {
					uni.showToast({
						icon: 'none',
						title: that.__('验证码不正确')
					});

					return false;
				}
				this.isRotate = true;
				setTimeout(function() {
					that.isRotate = false
				}, 3000)
				this.update();
			},

			update: function() {
				var that = this;

				var params = {
					user_mobile: this.user_intl + this.user_mobile,
					rand_key: this.user_intl + this.user_mobile,
					verify_code: this.mobile_code,
					client_info: that.client_info
				};

				that.$.request({
					url: this.Config.URL.doSmsLogin,
					data: params,
					loading: false,
					success: function(data, status, msg, code) {
						if (status == 200) {
							var id = that.$.setStorageSync('uid', data.user_id);
							var key = that.$.setStorageSync('ukey', data.key);

							// #ifdef H5
							$cookies.set('uid', data.user_id);
							$cookies.set('ukey', data.key);
							// #endif

							that.toMain(data);

							/*
							that.$.showToast({
								title: that.__("登录成功!"),
								success: function() {

									that.login(data);

									if (data.im && that.plantformInfo.config.chat_global) {
										//that.$Socket.connectserver(data.im);
									}

									setTimeout(() => {
										var prePage = getCurrentPages()[
											getCurrentPages().length - 2];
										console.log("prePage", prePage);
										try {
											if (prePage.refreshData) {
												prePage.refreshData(prePage.options);
											} else if (prePage.onLoad) {
												prePage.onLoad(prePage.options);
											} else {
												prePage.toMain(data);
											}
										} catch (e) {

										}
										that.$.navigateBack(2)

									}, 200)
								}
							})
							*/
						} else {
							that.$.confirm(msg);
						}
					}

				});
			},
			inputphone: function(e) {
				let that = this;
				this.setData({
					user_mobile: e.detail.value
				});
				that.$.isNull(e.detail.value) ? this.setData({
					isUserMobile: !1
				}) : /^1[0123456789]\d{9}$/.test(e.detail.value) ? this.setData({
					isUserMobile: !0
				}) : this.setData({
					isUserMobile: !1
				})
			},


			inputcode: function(e) {
				let that = this;
				this.setData({
					mobile_code: e.detail.value
				}), that.$.isNull(e.detail.value) ? this.setData({
					isCode: !1
				}) : this.setData({
					isCode: !0
				})
			},
			getSmsCode: function() {
				let that = this;

				if (!that.$.tel(this.user_mobile, this.user_intl)) {
					this.setData({
						isUserMobile: !1
					});

					uni.showToast({
						icon: 'none',
						title: that.__('手机号不正确')
					});
					return false;
				}

				//获取验证码
				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）


				/*
                if (!this.isImgCode)
                {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入正确的图形验证码',
                    });
                    return;
                }
                */

				setTimeout(function() {
					that.$refs.runCode.$emit('runCode', 0); //假装模拟下需要 终止倒计时
				}, 60000)

				if (this.isSend) {
					this.setData({
						isSend: !1
					});
					var t = this.sendTime;
					var params = {
						mobile: this.user_intl + this.user_mobile
					};

					that.$.request({
						url: this.Config.URL.account.get_mobile_checkcode,
						data: params,
						success: function(data, status, msg, code) {
							if (status == 200) {
								var r = setInterval(function() {
									t > 0 ? that.setData({
										btntext: t-- + "s"
									}) : (that.setData({
										isSend: !0,
										sendTime: 120,
										btntext: that.__("重新发送")
									}), clearInterval(r))
								}, 1e3);
							} else {
								that.setData({
									isSend: !0
								});
								uni.showToast({
									icon: 'none',
									title: msg,
								});
								that.$refs.runCode.$emit('runCode', 0); //假装模拟下需要 终止倒计时
							}
						}
					});
				}
			},

			startTimer: function() {
				var that = this;
				if (that.cTimer == null) {
					that.countdown--;
					that.cTimer = setInterval(function() {
						that.countdown--;
						if (that.countdown == 0) {
							that.clearTimer();
						}
					}, 1000);
				}
			},
			clearTimer: function() {
				var that = this;
				clearInterval(that.cTimer);
				that.cTimer = null;
				that.countdown = 6;
			},

			doLogin() {
				var that = this;
				console.log('doLogin=', this.loginToken)
				uni.request({
					method: 'POST',
					url: this.Config.onelogin,
					data: {
						"loginToken": this.loginToken
					},
					success: function(data, status) {
						console.log("doLogin", JSON.stringify(data))
						if (200 == data.data.status) {
							var id = that.$.setStorageSync('uid', data.data.data
								.user_id);
							var key = that.$.setStorageSync('ukey', data.data.data.key);

							// #ifdef H5
							$cookies.set('uid', data.data.data.user_id);
							$cookies.set('ukey', data.data.data.key);
							// #endif

							that.toMain(data.data.data);
						} else {
							that.$.showToast({
								icon: 'none',
								title: that.__('登录失败！'),
							});
						}
					}
				})
			}
		},

		jump() {
			uni.navigateTo({
				url: target
			})
		},


		jy_facebookShareUrl() {
			let jyappEvents = uni.requireNativePlugin('JY-FaceBookAppEvents');
			jyappEvents.jy_facebookShareUrl({
					shareUrl: 'http://www.baidu.com',
					sharePic: '随便写',
				},
				(res) => {
					uni.showToast({
						icon: 'none',
						title: JSON.stringify(res),
					});
				},
			);
		},
	};
</script>

<style lang="scss">
	@import '../../styles/reg.scss';

	.cuIcon-item {
		font-size: 64upx;

		image {
			width: 64upx;
			height: 64upx;
		}
	}

	/* common/authorization-info.wxss */
	.auth-pop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		flex-wrap: wrap;
		z-index: 999;
	}

	.auth-box {
		width: 600upx;
		background-color: #fff;
		border-radius: 24upx;
		box-sizing: border-box;
		padding: 110upx 60upx;
		box-shadow: 0 10upx 30upx rgba(0, 0, 0, 0.5);
	}

	.auth-box image {
		width: 166upx;
		height: 197upx;
	}

	.auth-box label {
		font-size: 32upx;
		color: #333;
		margin: 20upx 0;
		display: inline-block;
		width: 100%;
	}

	.auth-box text {
		font-size: 24upx;
		color: #666;
	}

	.auth-box button {
		margin-top: 80upx;
	}

	.tip_text {
		width: 85%;
		font-size: 50upx;
		line-height: 50upx;
		margin-left: 56upx;
		margin-bottom: 100upx;
		font-family: PingFangSC-Medium, PingFang SC;
		color: #333333;
		margin-top: 70upx;
	}

	.topback {
		width: 100%;
		height: 50upx;
		margin-top: 110upx;
		backgroundr: red($color: #000000);
	}

	@import '../../styles/reg.scss';

	.tip_text {
		width: 85%;
		font-size: 50upx;
		line-height: 50upx;
		margin-left: 56upx;
		margin-bottom: 70upx;
		font-family: PingFangSC-Medium, PingFang SC;
		color: #333333;
		margin-top: 60upx;
	}

	.des_title {
		width: 100%;
		line-height: 20rpx;
		height: 20rpx;
		font-size: 28rpx;
		font-weight: 400;
		// font-family: PingFangSC-Medium, PingFang SC;
		color: #666666;
		margin-top: 120rpx;
		text-align: center;
	}

	.m-content-bttom {
		display: flex;
		flex-direction: row;
		align-items: center;
		/*  #ifdef H5 || MP-WEIXIN  */
		justify-content: center;
		/*  #endif  */
		/*  #ifdef APP-PLUS  */
		justify-content: space-between;

		/*  #endif  */
		.menu-item {
			width: 195rpx;
			// background-color: aqua;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.m-title-text {
				width: 100%;
				margin-top: 20rpx;
				text-align: center;
				line-height: 20rpx;
				height: 20rpx;
				font-size: 24rpx;
				font-weight: 400;
				// font-family: PingFangSC-Medium, PingFang SC;
				color: #666666;
			}
		}
	}


	.m-content-footer {
		position: fixed;
		left: 30rpx;
		bottom: 39rpx;
		height: 30rpx;
		width: 690rpx;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		color: #999999;
		font-size: 24rpx;

	}

	.top_title {
		display: flex;
		width: 100%;
		height: 88rpx;
		margin-top: calc(50rpx + var(--status-bar-height));
		align-items: center;

	}

	.back {
		width: 30rpx;
		height: 30rpx;
		margin: 30rpx;
	}

	.btn-row {
		margin-top: 50px;
		padding: 0px;

		label {
			font-size: 32upx;
			color: #333;
			margin: 20upx 0;
			display: inline;
			width: 100%;
		}
	}
</style>

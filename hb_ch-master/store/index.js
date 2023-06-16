import Vue from 'vue';
import Vuex from 'vuex';

import $ from '../helpers/util';
import Socket from '../helpers/useSocket.js';
import apiconfig from '../helpers/apiconfig.js';

// #ifdef H5
import $cookies from '../helpers/vue-cookies';
// #endif

import Config from '../config/config';
import StateCode from '../config/statecode';
import Lang from '../config/lang';

import notice from '../helpers/notice';

const MSG_INDEX = null;
const CART_INDEX = 3;
const FORCED_LOGIN_STATE = false; //true：不提示登录tips，直接跳转

Vue.use(Vuex);

// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';

var ret = uni.getStorageSync(USERS_KEY);
let default_user_info = {
	user_nickname: Lang.__('未注册用户'),
	user_avatar: 'https://static.shopsuite.cn/demodata/assets/data/avatar.png',
	user_is_new: 1,
};

uni.getSystemInfo({
	success: (res) => {
		Config.systemInfo = res;
	},
});

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLoginState: FORCED_LOGIN_STATE,
		hasLogin: uni.getStorageSync('ukey') ? true : false,
		userName: '',
		cartNum: 0,
		newMsgNum: 0,

		plantformInfo: null, //平台信息
		shopInfo: null,
		chainInfo: null,

		Config: Config, //配置信息
		StateCode: StateCode, //状态码

		$: $,
		sprintf: $.sprintf,

		$Socket: Socket,
		$apiconfig: apiconfig,

		//用户信息
		userInfo: ret ? JSON.parse(ret) : Object.assign({}, default_user_info),

		userData: null, //废弃  userInfo 取代
		userResource: null, //废弃 userInfo 取代

		//start Im
		getMsg: {},
		adduser: {},
		addgroup: {},
		msgboxuser: '',
		msgboxgroup: '',
		userstate: '', ///用户状态
		chatTolist: {}, ///当前聊天对话的里面是聊天的对象和
		currentChatPuid: '', ///当前聊天对话用户
		isNewMsg:false,// 是否有新消息
		//end Im

		notice: notice,

		__: Lang.__,
		Lang: Lang,
		clientInfo: {}, // uniapp客户端标识。
		pushMessage: {}, // 推送消息
		isBeganToMine: false, // 扫雷宝-个股扫雷是否开始搜索
		SLBsearchText: '',
		BLBstopAdd: false, //进入避雷宝控制雷达动画显示
		storagekey: uni.getStorageSync('searchCache_stocks'), // 避雷宝搜索记录
		SLNumber: 3, // 扫雷次数
		SJBNumber: 3, // 扫雷次数
		// noviceGuide:  uni.getStorageSync('guideCache_state'),// 新手引导
		noviceGuide: uni.getStorageSync('guideCache_state').toString() === '' ? true : uni.getStorageSync(
			'guideCache_state'), // 新手引导
		noviceGuideIndex: 0,

		// 自选股票groupId存储
		groupId: '',
		// 判断自选股导入来源
		formSelfStock: false,
		// 控制排序上下箭头
		showSortArrow: false,
		// 控制表格的筛选
		controlTableSort: false,
		refreUserspace: false,
	},
	mutations: {
		changTableSort(state, preload) {
			state.controlTableSort = preload
		},
		
		changeShowSort(state, preload) {
			state.showSortArrow = preload
		},
		changeFrom(state, preload) {
			state.formSelfStock = preload
		},
		getGroupId(state, groupIdInfo) {
			state.groupId = groupIdInfo
		},
		login(state, userInfo) {
			if ('user_avatar' in userInfo) {
				if (userInfo.user_avatar) {
					if (state.Config.HTTPS && userInfo.user_avatar.indexOf('https') == 0) {} else {
						if (userInfo.user_avatar.indexOf('http') == 0) {} else {
							if (state.Config.HTTPS) {
								userInfo.user_avatar = 'https:' + userInfo.user_avatar;
							} else {
								userInfo.user_avatar = 'http:' + userInfo.user_avatar;
							}
						}
					}
				} else {
					userInfo.user_avatar = 'https://static.shopsuite.cn/demodata/assets/data/avatar.png';
				}
			}

			userInfo = Object.assign(state.userInfo, userInfo);

			state.userInfo = userInfo;
			state.userName = userInfo.user_nickname || Lang.__('未注册用户');
			state.hasLogin = true;

			//保存基本信息
			uni.setStorageSync(USERS_KEY, JSON.stringify(userInfo));
			//强制授权读取小程序或者公众号手机号
			if ('as' in userInfo) {
				if (userInfo.as) {} else {
					if (Config.FORCE_BIND_MOBILE) {
						setTimeout(() => {
							$.gopage('/member/member/bindphone');
						}, 1500);

						// setTimeout(()=>{
						// 	$.confirm(Lang.__('绑定手机号码'),
						// 		function(data) {
						// 			if (data.confirm) {
						// 				//绑定手机操作

						// 			}
						// 		},true);
						// }, 2000)
					}
				}
			}
		},
		logout(state, payload) {
			if ($.source_data.source_type == StateCode.SOURCE_TYPE_APP) {
				plus.navigator.removeAllCookie();
			}

			if ($.source_data.source_type == StateCode.SOURCE_TYPE_H5) {
				console.info('-111-----key----',$cookies.keys());

				let arr = $cookies.keys();
				for (var i = 0; i < arr.length; i++) {
					$cookies.remove(arr[i]);
				}

				//$cookies.remove('uid');
				//$cookies.remove('ukey');
			}

			state.userInfo = Object.assign({}, default_user_info);
			state.userName = state.userInfo.user_nickname;
			state.hasLogin = false;

			//IM
			state.getMsg = {};
			state.adduser = {};
			state.addgroup = {};
			state.msgboxuser = '';
			state.msgboxgroup = '';
			state.userstate = ''; ///用户状态
			state.chatTolist = {}; ///当前聊天对话的里面是聊天的对象和
			state.currentChatPuid = '';

			if (payload) {
				$.toLogin(state.forcedLoginState);
			}
		},
		forceUserInfo(state, callback) {
			var that = this;

			//记录来源页面
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];

			if (page.route != 'pages/login/login' && page.route != 'pages/index/member') {
				uni.setStorageSync('pre_route', page.route);
				if (page.options) {
					uni.setStorageSync('pre_options', page.options);
				}
			}

			if (!state.hasLogin) {
				if (state.forcedLoginState) {
					$.toLogin(true);
				} else {
					$.showModal({
						title: Lang.__('未登录'),
						content: Lang.__('您未登录，需要登录后才能继续'),
						/**
						 * 如果需要强制登录，不显示取消按钮
						 */
						showCancel: !state.forcedLoginState,
						success: (res) => {
							if (res.confirm) {
								/**
								 * 如果需要强制登录，使用reLaunch方式
								 */
								$.toLogin(state.forcedLoginState);
							} else {
								uni.navigateBack();
							}
						},
					});
				}
			} else {
				//判断当前用户是否存在，不存在读取?
				callback && callback($.isEmptyObject(state.userInfo) ? null : state.userInfo);
			}
		},
		getUserInfo(state, callback) {
			callback && callback($.isEmptyObject(state.userInfo) ? null : state.userInfo);
		},

		//读取APP信息（平台 or 店铺）
		getStoreInfo: function(state, payload) {
			var that = this;
			var store_id = payload.store_id;

			let force_refresh = true;

			if (typeof payload.force_refresh == 'undefined') {
				force_refresh = true;
			}

			//读取APP信息（平台 or 店铺）
			$.request({
				url: state.Config.URL.store.info,
				data: {
					action: 'intro',
					store_id: store_id
				},
				loading: false,
				ajaxCache: {
					timeout: Config.CACHE_EXPIRE,
					forceRefresh: force_refresh,
				},
				success: function(data, status, msg, code) {
					//data.
					state.shopInfo = {
						ChannelCode: '1217898988',
						IsChannel: false,
						store_id: data.base.store_id,
						user_id: data.base.user_id,
						//"Id": 5854,
						store_name: data.base.store_name,
						store_grade_id: data.base.store_grade_id,
						store_grade_name: data.base.store_grade_name,
						CompanyName: data.company.company_name,
						LegalNumber: data.info.store_tel,
						WapLogoPath: data.base.store_logo,
						VendorInfo: data.company.company_description || '', //店铺公告
						LegalAdress: data.base.store_address,
						AllProduct: data.analytics.store_product_num,
						store_slogan: data.base.store_slogan || '', //店铺公告
						BusinessTime: null,
						NewProduct: data.analytics.store_product_new_num,
						BackGroundPath: data.info.store_banner,
						LegalPerson: data.company.contacts_name,
						store_latitude: data.base.store_latitude,
						store_longitude: data.base.store_longitude,
						rows: 10,
						IsDistribution: false,
						Level1Discount: 0,
						Level2Discount: 0,
						ValidDays: 0,
						PromotionRule: null, //活动信息
						RuleEnabled: false,
						VendorFeatureSet: '',
						ShopConfig: {
							AppIconPath: 'https://static.shopsuite.cn/xcxfile/appicon/',
						},
						store_star_num: data.analytics.store_evaluation_num ?
							(data.analytics.store_deliverycredit + data.analytics
								.store_deliverycredit + data.analytics.store_deliverycredit
								) / 3 / data.analytics.store_evaluation_num :
							5,
						analytics: data.analytics,
						info: data.info,
						base: data.base,
						company: data.company,
						im_enable: data.info.im_chat,
					};

					if (state.shopInfo.im_enable) {
						state.shopInfo.im_user_id = data.base.user_id;
						state.shopInfo.puid = data.info.puid;
					} else {
						state.shopInfo.im_user_id = data.base.user_id;
						state.shopInfo.puid = '';
					}

					state.shopInfo.imgPath = state.shopInfo.ShopConfig.AppIconPath;

					payload.callback && payload.callback(state.shopInfo);
				},

				fail: function(err) {},
			});
		},

		//读取门店信息
		getChainInfo: function(state, payload) {
			var that = this;
			var chain_id = payload.chain_id;

			//读取门店信息
			$.request({
				url: state.Config.URL.store.getChain,
				data: {
					action: 'intro',
					chain_id: chain_id
				},
				loading: false,
				ajaxCache: {
					timeout: Config.CACHE_EXPIRE,
				},
				success: function(data, status, msg, code) {
					//data.
					state.chainInfo = data;

					payload.callback && payload.callback(state.chainInfo);
				},

				fail: function(err) {},
			});
		},

		getPlantformInfo(state, callback) {
			//读取APP平台信息
			var that = this;

			state.shopInfo = {
				IsChannel: false, //是否代理渠道用户
				VendorFeatureSet: '',
				ShopConfig: {
					AppIconPath: 'https://static.shopsuite.cn/xcxfile/appicon/',
				},
			};

			if (!state.plantformInfo) {
				//读取APP信息（平台 or 店铺）
				$.request({
					url: Config.URL.info,
					data: {
						action: 'intro'
					},
					loading: false,
					/*
                    ajaxCache: {
                        timeout: Config.CACHE_EXPIRE
                    },
					*/
					success: function(data, status, msg, code) {
						state.plantformInfo = data;
						//state.plantformInfo['versionNumber'] = '2.01';

						//修改配置信息
						Config.MULTISHOP_ENABLE = data.config.multishop_enable;
						Config.EVALUATION_ENABLE = data.config.evaluation_enable;
						Config.SAAS_STATUS = data.config.saas_status;
						Config.VIRTUAL_ENABLE = data.config.virtual_enable;
						Config.O2O_ENABLE = data.config.o2o_enable;
						Config.CHAIN_ENABLE = data.config.chain_enable;

						Config.POINTS_VAUE_RATE = data.config.points_vaue_rate;
						Config.SP_VAUE_RATE = data.config.sp_vaue_rate;

						Config.PLANTFORM_FX_ENABLE = data.config.plantform_fx_enable;
						Config.STORE_FX_ENABLE = data.config.store_fx_enable;
						Config.PLANTFORM_SP_PRIZE_ENABLE = data.config.plantform_sp_prize_enable;
						Config.PLANTFORM_FX_AGENT_ENABLE = data.config.plantform_fx_agent_enable;
						Config.PLANTFORM_FX_PT_ENABLE = data.config.plantform_fx_pt_enable;
						Config.PLANTFORM_FX_WESTORE_ENABLE = data.config
						.plantform_fx_westore_enable;
						Config.PLANTFORM_DELIVERY_TIME_ENABLE = data.config
							.plantform_delivery_time_enable;
						Config.STORE_SUPPLIER_ENABLE = data.config.store_supplier_enable;
						Config.PAOTUI_ENABLE = data.config.paotui_enable;
						Config.USERSTOCK_ENABLE = data.config.userstock_enable;
						Config.ORDERCONFIRM_ENABLE = data.config.orderconfirm_enable;
						Config.MARKETORDER_ENABLE = data.config.marketorder_enable;
						Config.PLANTFORM_REBATE_ENABLE = data.config.plantform_rebate_enable;
						Config.REDPACKET_ENABLE = data.config.redpacket_enable;
						Config.CREDIT_ENABLE = data.config.credit_enable;
						Config.POINT_ENABLE = data.config.point_enable;
						Config.SP_ENABLE = data.config.sp_enable;
						Config.EXCHANGECARD_ENABLE = data.config.exchangecard_enable;
						Config.MONEY_TRANSFER_ENABLE = data.config.money_transfer_enable;
						Config.SNS_ENABLE = data.config.sns_enable;
						Config.IM_ENABLE = data.config.im_enable;
						Config.SUBSITE_ENABLE = data.config.subsite_enable;
						Config.FORCE_BIND_MOBILE = data.config.force_bind_mobile;
						Config.PLANTFORM_DELIVERY_TIME_ENABLE = data.config.delivery_time_enable;
						Config.PLANTFORM_USER_LEVEL_RATE_ENABLE = data.config
						.user_level_rate_enable;
						Config.LANG_ENABLE = data.config.multilang_enable;

						Config.B2B_FLAG = data.config.b2b_flag;
						Config.PRODUCT_SALENUM_FLAG = data.config.product_salenum_flag;
						Config.PRODUCT_ZITI_FLAG = data.config.product_ziti_flag;

						Config.CACHE_EXPIRE = data.config.cache_expire;
						Config.CACHE = data.config.cache;

						callback && callback(state.plantformInfo);
					},

					fail: function(err) {},
				});
			} else {
				callback && callback(state.plantformInfo);
			}
		},

		//用户中心资料
		reloadUserResource: function(state, callback) {
			$.request({
				url: Config.URL.user.overview,
				data: {
					action: 'reload'
				},
				loading: false,
				success: function(data, status, msg, code) {
					if (status == 200) {
						let userInfo = Object.assign(state.userInfo, data.member_info);

						state.userInfo = userInfo;

						callback && callback(state.userInfo);
					} else {
						callback && callback(state.userInfo);
					}
				},
			});
		},
		setCartNum(state, payload) {
			if ($.isObject(payload)) {
				if (payload.type == 'add') {
					state.cartNum = state.cartNum + payload.num;
				} else {
					state.cartNum = state.cartNum - payload.num;
				}
			} else {
				state.cartNum = payload;
			}
		},

		showCartNum(state, payload) {
			try {
				var pages = getCurrentPages();
				var page = pages[pages.length - 1];
				let url = page.route;

				try {
					if (Config.tabBar.list instanceof Array || true) {
						var n = !1;
						for (var r = 0; r < Config.tabBar.list.length; r++) {
							if (!n) {
								var i = Config.tabBar.list[r];
								i.pagePath == url ? (n = !0) : (n = !1);
							}
						}

						if (n && null !== CART_INDEX) {
							if (state.cartNum > 0) {
								uni.setTabBarBadge({
									index: CART_INDEX,
									text: state.cartNum + '',
								});
							} else {
								state.cartNum = 0;

								uni.removeTabBarBadge({
									index: CART_INDEX,
								});
							}
						}
					} else {}
				} catch (s) {}
			} catch (e) {}
		},

		setMsgNum(state, payload) {
			if ($.isObject(payload)) {
				if (payload.type == 'add') {
					state.newMsgNum = state.newMsgNum + payload.num;
				} else {
					state.newMsgNum = state.newMsgNum - payload.num;
				}
			} else {
				state.newMsgNum = payload;
			}

			if (null !== MSG_INDEX) {
				if (state.newMsgNum > 0) {
					uni.setTabBarBadge({
						index: MSG_INDEX,
						text: state.newMsgNum + '',
					});
				} else {
					state.newMsgNum = 0;

					uni.removeTabBarBadge({
						index: MSG_INDEX,
					});
				}
			}
		},

		//start im
		setCurrentMsg(state, provider) {
			provider.type = provider.type;
			state.getMsg = provider;
			///存储最后一句话
		},
		setmsgboxuser(state, provider) {
			state.msgboxuser = provider;
		},
		setmsgboxgroup(state, provider) {
			state.msgboxgroup = provider;
		},
		addChater(state, provider) {
			let nowDate = new Date();
			if (provider.type == 'user' || provider.type == 'friend') {
				state.chatTolist['user' + provider.val] = provider.data;
				state.chatTolist['user' + provider.val]['weidu'] = 0;
				state.chatTolist['user' + provider.val]['lasttime'] = nowDate.getHours() + ':' + nowDate
					.getMinutes();
			} else {
				state.chatTolist['group' + provider.val] = provider.data;
				state.chatTolist['group' + provider.val]['weidu'] = 0;
				state.chatTolist['group' + provider.val]['lasttime'] = nowDate.getHours() + ':' + nowDate
					.getMinutes();
			}

			//
			let msg_num = 0;
			for (let tmp_key in state.chatTolist) {
				msg_num = msg_num + state.chatTolist[tmp_key]['weidu'];
			}

			this.commit('setMsgNum', msg_num);
		},
		updateFriendlist(state, provider) {
			state.adduser = provider;
			state.userInfo.data.friend['usercharacter' + provider.firstchrater].list['user' + provider.id] =
				provider;
		},
		updateGrouplist(state, provider) {
			state.addgroup = provider;
			state.userInfo.data.group['group' + provider.id] = provider;
		},
		resetWeidu(state, provider) {
			if (provider.type == 'user' || provider.type == 'friend') {
				state.chatTolist['user' + provider.val]['weidu'] = 0;
			} else {
				state.chatTolist['group' + provider.val]['weidu'] = 0;
			}

			//
			let msg_num = 0;
			for (let tmp_key in state.chatTolist) {
				msg_num = msg_num + state.chatTolist[tmp_key]['weidu'];
			}

			this.commit('setMsgNum', msg_num);
		},
		setFriendstue(state, provider) {
			if (typeof state.chatTolist['user' + provider.val] == 'undefined') {} else {
				state.chatTolist['user' + provider.val]['status'] = provider.data; ///将状态设置为在线
			}

			state.userInfo.data.friend['usercharacter' + provider.character].list['user' + provider.val][
				'status'
			] = provider.data;
			state.userstate = 'setFriendstue' + provider.val + provider.data;
		},

		////更新某个回话的最后聊天内容
		updateChaterAttr(state, provider) {
			let nowDate = new Date();
			if (provider.type == 'user' || provider.type == 'friend') {
				console.info(provider);
				if (typeof state.chatTolist['user' + provider.val] == 'undefined') {
					this.commit('addChater', {
						data: provider.addinfo,
						type: 'user',
						val: provider.addinfo.id
					});
				}
				state.chatTolist['user' + provider.val][provider.attr] = provider.data;
				state.chatTolist['user' + provider.val]['weidu']++;
				state.chatTolist['user' + provider.val]['lasttime'] = nowDate.getHours() + ':' + nowDate
					.getMinutes();
			} else {
				if (typeof state.chatTolist['group' + provider.val] == 'undefined') {
					this.commit('addChater', {
						data: provider.addinfo,
						type: 'group',
						val: provider.addinfo.id
					});
				}
				state.chatTolist['group' + provider.val][provider.attr] = provider.data;
				state.chatTolist['group' + provider.val]['weidu']++;
				state.chatTolist['group' + provider.val]['lasttime'] = nowDate.getHours() + ':' + nowDate
					.getMinutes();
			}

			//
			let msg_num = 0;
			for (let tmp_key in state.chatTolist) {
				msg_num = msg_num + state.chatTolist[tmp_key]['weidu'];
			}

			this.commit('setMsgNum', msg_num);
		},

		////更新某个回话的最后聊天内容
		setCurrentPuid(state, puid) {
			state.currentChatPuid = puid;
		},
		//end im
		setClientInfo(state, val) {
			let clientInfo = val || {};
			if (Object.prototype.toString.call(clientInfo) !== '[object Object]') {
				clientInfo = JSON.parse(clientInfo);
			}
			state.clientInfo = clientInfo || {};
		},
		updatePushMessage(state, message) {
			let payload = message.payload || {};
			if (Object.prototype.toString.call(payload) !== '[object Object]') {
				message.payload = JSON.parse(payload);
			}
			state.pushMessage = payload || {};
		},
		updateIsBeganToMine(state, message) {
			state.isBeganToMine = message || false;
		},
		updateSLBsearchText(state, message) {
			state.SLBsearchText = message || false;
		},
		updateStoragekey(state, message) {
			state.storagekey = message || false;
		},
		updateBLBstopAdd(state, message) {
			state.BLBstopAdd = message || false;
		},
		updateSLNumber(state, message) {
			state.SLNumber = message;
		},
		updateSJBNumber(state, message) {
			state.SJBNumber = message;
		},
		updateNoviceGuide(state, message) {
			state.noviceGuide = message;
		},
		updateNoviceGuideIndex(state, message) {
			state.noviceGuideIndex = message;
		},
		updateIsNewMsg(state, message) {
			state.isNewMsg = message;
		},
		updateRefreUserspace(state, message) {
		    console.log('updateRefreUserspace', message);
			state.refreUserspace = message
		},

	},
	getters: {
		currentdilog: (state, getters) => {
			return state.chatTolist;
		},
		hasLogin: (state, getters) => {
			return state.hasLogin;
		},
		isBeganToMine: (state, getters) => {
			return state.isBeganToMine;
		},
		userinfo: (state, getters) => {
			return state.userInfo;
		},
		getClientInfo(state, val) {
			return state.clientInfo;
		},
		getIsBeganToMine(state, val) {
			return state.isBeganToMine;
		},
	},

	actions: {},
});

export default store;

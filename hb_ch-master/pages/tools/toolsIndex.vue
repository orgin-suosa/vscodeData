<template>
	<view class="content">
		<view class="m-backbtn" @click="backView()">
			<image mode="aspectFill" style="width: 44rpx;height: 44rpx;"
				src="https://qnsp.zcskjy.com/zc_images%2Fimages%2Fbackwhite.png" />
		</view>
		<scroll-view class="articleDetail-scroll" :style="{ height: scrollHeight + 'rpx' }" scroll-y="true">
			<image class="tools_topBg" :src="tools_topBg" mode=""></image>
			<findTools :toolsList="toolsList" @navigatePage="navigatePage"></findTools>
		</scroll-view>
		<noviceGuide />
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import findTools from '../../findTools/components/findTool.vue';
	import noviceGuide from '@/components/noviceGuide/index.vue';
	import toolTemplate from '../../findTools/toolTemplate/index.vue';
	export default {
		components: {
			findTools,
			noviceGuide
		},
		computed: {
			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum',
				'logout',
				'Lang'
			]),
			scrollHeight: function() {
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate);
				return winHeight;
			},
		},
		data() {
			return {
				statusBarHeight: 0,
				navBarHeight: 0,
				tools_topBg: `${getApp().globalData.qnUrl}/zc_images/findTools/tools_topBg.png` + this.$FT.versionKey(),
				toolsList: [{
						title: [{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/tools-title1.png` + this
									.$FT.versionKey(),
							},
							{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/vipTitle.png` + this.$FT
									.versionKey(),
							},
						],
						giftTitle: `${getApp().globalData.qnUrl}/zc_images/findTools/gift-pzbTitle.png`,
						text: '600位记者7*24小时获取独家资讯',
						subtitle: '机构、私募都在使用的A股超短热点题材宝库',
						price: '--',
						discountPrice: '--',
						orderStatus: false,
						productId: '',
						itemId: '',
						isPrice: true, // 是否显示价格
						isLogon: false,
						isFree: false,
						remaining: null, //权限剩余到期
						numberBuyers: null, // 购买人数
					},
					{
						title: [{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/lhb-textTitle.png` + this
									.$FT.versionKey(),
							},
							{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/lhb-title.png` + this.$FT
									.versionKey(),
							},
						],
						giftTitle: ``,
						text: '揭秘超短线模式，找寻资金背后逻辑',
						subtitle: '全方位提升：复盘能力、选股能力、交易能力',
						price: '--',
						discountPrice: '--',
						orderStatus: false,
						productId: '',
						itemId: '',
						isPrice: true, // 是否显示价格
						isLogon: false,
						isFree: false,
						remaining: null, //权限剩余到期
						numberBuyers: null, // 购买人数
					},
					{
						title: [{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/slb-textTitle.png` + this
									.$FT.versionKey(),
							},
							{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/sjb-title.png` + this.$FT
									.versionKey(),
							},
						],
						giftTitle: ``,
						text: '利好利空，一【览】无余 ',
						subtitle: '聚合每日重要事件，实时了解市场动向',
						price: '--',
						discountPrice: '--',
						orderStatus: false,
						productId: '',
						itemId: '',
						isPrice: true,
						isLogon: false,
						isFree: false,
						remaining: null, //权限剩余到期
						numberBuyers: null, // 购买人数
					},
					{
						title: [{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/tools-title3.png?r=2022080417` +
									this.$FT.versionKey(),
							},
							{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/slb-title.png` + this.$FT
									.versionKey(),
							},
						],
						giftTitle: ``,
						text: '排雷避险，一【宝】扫除',
						subtitle: '一键扫描全网股票，风险雷点早知道',
						price: '--',
						discountPrice: '--',
						orderStatus: false,
						productId: '',
						itemId: '',
						isPrice: true,
						isLogon: false,
						isFree: false,
						remaining: null, //权限剩余到期
						numberBuyers: null, // 购买人数
					},
					{
						title: [{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/caijing.png`,
							},
							{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/caijingdes.png`,
							},
						],
						giftTitle: ``,
						text: '财经日历，一手掌握',
						subtitle: '囊括全球财经事件，紧跟市场热点走向',
						price: '--',
						discountPrice: '--',
						orderStatus: true,
						productId: '',
						itemId: '',
						isPrice: true,
						isLogon: false,
						isFree: false,
						remaining: null, //权限剩余到期
						numberBuyers: null, // 购买人数
					},
					// {
					//   title: [
					//     {
					//       image: `${getApp().globalData.qnUrl}/zc_images/findTools/tools-title2.png`,
					//     },
					//     {
					//       image: `${getApp().globalData.qnUrl}/zc_images/findTools/dxb-title.png`,
					//     },
					//   ],
					//   giftTitle: ``,
					//   text: '新股、新债、新基一【宝】打尽',
					//   subtitle: '轻松解决打新难、中签难、收益难！',
					//   price: '',
					//   discountPrice: '',
					//   orderStatus: false,
					//   productId: '',
					//   itemId: '',
					//   isPrice: false,
					//   isFree: false,
					//   remaining: null, //权限剩余到期
					//   numberBuyers: null, // 购买人数
					// },
					{
						title: [{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/tuyereEtf.png` + this
									.$FT.versionKey(),
							},
							{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/invest.png` + this.$FT
									.versionKey(),
							},
						],
						// giftTitle: `${getApp().globalData.qnUrl}/zc_images/findTools/gift-pzbTitle.png`,
						text: '捕捉风口热点，深挖内在价值 基于行业事件',
						subtitle: '基于行业事件、政策驱动挖掘ETF投资机会',
						price: '--',
						discountPrice: '--',
						orderStatus: false,
						productId: '',
						itemId: '',
						isPrice: true, // 是否显示价格
						isLogon: true,
						isFree: false,
						remaining: null, //权限剩余到期
						numberBuyers: null, // 购买人数
					},
					{
						title: [{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/tools-JGJJ.png?r=2022080417` +
									this.$FT.versionKey(),
							},
							{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/tools-JGJJ-des.png` + this.$FT
									.versionKey(),
							},
						],
						giftTitle: ``,
						text: '网罗行业脱水研报，紧跟机构选股逻辑',
						subtitle: '综合多重维度指标，监控卖方和机构动向',
						price: '--',
						discountPrice: '--',
						orderStatus: false,
						productId: '',
						itemId: '',
						isPrice: true,
						isLogon: false,
						isFree: false,
						remaining: null, //权限剩余到期
						numberBuyers: null, // 购买人数
					},
				],
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
			// this.init();

		},
		onShow() {
			this.$store.commit('updateBLBstopAdd', false);
			this.init();
		},
		onUnload() {},
		methods: {
			init() {
				this.$store.commit('updateNoviceGuideIndex', 5);
				this.getSystemInf();
				this.panzhongbaoShop();

			},

			backView() {
				uni.navigateBack({
					delta: 1
				});
			},
			panzhongbaoShop() {
				const that = this;
				let params = {
					userId: that.userInfo.user_id,
				};
				// console.log('支付相关-入参', params);
				// console.log('支付相关-url', that.Config.panzhongbaoShop);
				uni.request({
					url: that.Config.panzhongbaoShop,
					method: 'GET',
					dataType: 'jsonp',
					data: params,
					success: (res) => {
						// console.log('支付相关-res', res);
						const data = JSON.parse(res.data);
						// console.log('支付相关-data', data);
						const list = data.result;
						// console.log('支付相关-list', list);
						// console.log('获取首页banner-page_code', page_code);
						if (res.statusCode == 200) {
							let pzb = list.pzb;
							let slb = list.slb;
							let sjb = list.sjb;
							let lhb = list.lhb; // 狙击龙虎榜
							let fketf = list.fketf; // 风口
							let jgjj = list.jgjj; // 风口
							//          console.log('支付相关-盘中宝---pzb--', pzb);
							//          console.log('支付相关-盘中宝---slb--', slb);
							// console.log('支付相关-盘中宝---slb--', sjb);
							that.assignTool(0, pzb);
							that.assignTool(1, lhb); // 狙击龙虎榜
							that.assignTool(3, slb); // 避雷宝
							that.assignTool(2, sjb); // 事件宝
							that.assignTool(5, fketf); // 风口ETF
							that.assignTool(6, jgjj); // 机构掘金
							// console.log('发现工具 :that.pageDetail', that.toolsList);

							if (slb.itemId) {
								uni.setStorage({
									key: 'slbItemId',
									data: slb.itemId,
								});
							}
							if (slb.productId) {
								uni.setStorage({
									key: 'slbProductId',
									data: slb.productId,
								});
							}
							if (sjb.itemId) {
								uni.setStorage({
									key: 'sjbItemId',
									data: sjb.itemId,
								});
							}
							if (sjb.productId) {
								uni.setStorage({
									key: 'sjbProductId',
									data: sjb.productId,
								});
							}

							if (lhb.itemId) {
								uni.setStorage({
									key: 'lhbItemId',
									data: lhb.itemId,
								});
							}
							if (lhb.productId) {
								uni.setStorage({
									key: 'lhbProductId',
									data: lhb.productId,
								});
							}
							if (fketf.productId) {
								uni.setStorage({
									key: 'fketfProductId',
									data: fketf.productId,
								});
							}
							if (jgjj.productId) {
								uni.setStorage({
									key: 'jgjjProductId',
									data: jgjj.productId,
								});
							}
							// var slbItemId = uni.getStorageSync('slbItemId');
							// var slbProductId = uni.getStorageSync('slbProductId');
						}
					},
					fail: (res) => {
						console.log('支付相关-fail', res);
					},
					complete: () => {},
				});
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
			assignTool(i, key) {
				let that = this;
				that.toolsList[i].discountPrice = key.unitPrice;
				that.toolsList[i].price = key.marketValue;
				that.toolsList[i].orderStatus = key.orderStatus;
				that.toolsList[i].productId = key.productId;
				that.toolsList[i].itemId = key.itemId;
				that.toolsList[i].giftTitle = key?.giftTitle || that.toolsList[i].giftTitle;
				that.toolsList[i].remaining = key?.remaining || null;
				that.toolsList[i].numberBuyers = key?.numberBuyers || null;
			},
			navigatePage(i) {
        console.log('toolsList============',this.toolsList,i);
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
						url: '/findTools/dragonTigerList/index?productId=' + this.toolsList[1].productId +
							'&item_id=' + this.toolsList[1].itemId,
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
					if (this.toolsList[3].productId) {
						uni.navigateTo({
							url: '/findTools/saoLeiBao/index?productId=' + this.toolsList[3].productId +
								'&item_id=' + this.toolsList[3].itemId,
							// url: '/findTools/saoLeiBao/scanprogress?productId='+ this.toolsList[1].productId + "&item_id=" + this.toolsList[1].itemId,
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: '接口异常，请稍后重试!',
						});
					}
				} else if (i == 5) {
					uni.navigateTo({
						url: '/findTools/tuyere/index?productId=' + this.toolsList[5].productId + '&item_id=' +
							this.toolsList[5].itemId,
					});
				}  else if (i == 6) {
					uni.navigateTo({
						url: '/findTools/mechanism/index?productId=' + this.toolsList[6].productId + '&item_id=' +
							this.toolsList[6].itemId,
					});
				}else {
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
	.tools_topBg {
		width: 750rpx;
		height: 280rpx;
	}

	.m-backbtn {
		position: fixed;
		z-index: 999;
		left: 30rpx;
		top: 60rpx;
	}

	.findTools {
		margin-top: 10rpx;
	}
</style>

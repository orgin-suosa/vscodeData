<template>
	<view class="panZhongbao" :class="!totalOrderStatus ? 'panZhongbao-price' : ''">
		<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
		<scroll-view class="panZhongbao-scroll" :class="android ? 'android' : 'platform'"
			:style="{ height: scrollHeight + 'rpx' }" scroll-y="true">
			<view id="scroll-view-content">
				<toolTemplate ref="toolTemplate" title="机构掘金" :shareDataDefault="shareData" @priceClick="priceClick"
					:productId="productId" :totalOrderStatus="totalOrderStatus" :safeTip="safeTip"
					:totalDiscountPrice="totalDiscountPrice" :totalOriginalPrice="totalOriginalPrice"
					:buttonList="buttonList" @navBack="navBack" @rightClick="onShareBox" @upper="upper"
					@toLower="toLower" @listScroll="listScroll">
					<template slot="conten-center">
						<view class="panZhongbao-content">
							<!--           <view>pushMessage:{{ pushMessage.type}}</view>
								<view>pushMessage:{{ pushMessage.type == 'pzb' }}</view> -->
							<view class="panZhongbao-content-box">
								<view class="panZhongbao-content-title">
									<image class="iconTitle" @click="navigateIntroduce" :src="iconTitle"
										mode="widthFix">
									</image>
									<view class="button-list" v-if="isAPP && hasLogin">
										<view class="button-list-child button-push" @click="clickPush" v-if="!isPush">
											<image class="iconAdd" :src="iconAdd" mode="widthFix"></image>
											<text>推送</text>
										</view>
										<image v-if="isPush" class="iconPushed" @click="clickUnPush" :src="iconPushed"
											mode="widthFix"></image>
									</view>
								</view>
								<!--    -->
								<selectedShares :selectedShareList="selectedShareList"
									:totalOrderStatus="totalOrderStatus" @priceClick="priceClick"
									@navigateDetails="navigateDetails"></selectedShares>
								<subsection class="subsectionTab" mode="button" :list="selectionList" :bold="true"
									activeColor="#333333" inactiveColor="#666666" fontSize="28rpx" bgColor="#F6F7FA"
									:current="videoCurrentIndex" @change="changeBtnIndex"></subsection>
								<u-tabs class="infList"
									:activeStyle="{ color: '#F43D3E',background:' #FFF4F4', fontWeight: 'bold',fontSize:'24rpx',padding:'5rpx 14rpx'  }"
									height="50" lineHeight="0" lineWidth="0"
									:inactiveStyle="{ color: '#666666',background: '#F9F9F9',fontSize:'24rpx',padding:'5rpx 14rpx' }"
									lineColor="#ffffff" :list="infList" :current="infTabIndex" @change="changeInfTab"
									:is-scroll="true">
								</u-tabs>

								<newChance :newChance="newChance" :totalOrderStatus="totalOrderStatus"
									@priceClick="priceClick" @navigateDetails="navigateDetails"
									@sharesListClick="sharesListClick"></newChance>


								<!-- <page-pagination :total="page.total" :showAround="true" :btnText="true" :forceEllipses="true" @change="uniListChange"> </page-pagination> -->
							</view>
						</view>
						<pushModal v-if="pushMessage.type == 'jgjj' " :pushdata="pushMessage"
							@confirmPush="confirmPush">
						</pushModal>
						<u-modal class="pushModal" content="确认不再接收此推送" :show="showSubscribe" showCancelButton
							buttonReverse @confirm="subscribeFN" @cancel="() => (showSubscribe = false)"></u-modal>
					</template>
				</toolTemplate>
			</view>

		</scroll-view>
	</view>
</template>

<script>
	import selectedShares from './components/selectedShares.vue';
	import newChance from './components/newChance.vue';
	import price from '../components/priceExp';
	import priceBottom from '../components/priceBottom';
	import subsection from '@/uni_modules/uview-ui/components/u-subsection/u-subsection.vue';
	import modal from '@/uni_modules/uview-ui/components/u-modal/u-modal.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import pushModal from '@/components/pushMessage/index.vue';
	import toolTemplate from '../toolTemplate/index.vue';
	export default {
		components: {
			selectedShares,
			newChance,
			subsection,
			modal,
			price,
			priceBottom,
			pushModal,
			toolTemplate
		},
		computed: {
			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum',
				'Lang', 'clientInfo', 'pushMessage'
			]),
			scrollHeight: function() {
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate);
				return winHeight;
			},
		},
		watch: {
			selectedShareList: {
				handler(newName, oldName) {
					this.selectedShareList = newName;
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},

			newChance: {
				handler(newName, oldName) {
					this.newChance = newName;
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			totalOrderStatus: {
				handler(newName, oldName) {
					this.totalOrderStatus = newName;
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
		},
		data() {
			return {
				shareIcon: '',
				android: false,
				isios: false,
				isApp: true,
				showPushMessage: false,
				showSubscribe: false,
				page: {
					total: 1, //总页数
					pageSize: 10, //每页条数
					pageNum: 1, //默认当前页
				},
				modalData: {
					show: false,
					content: '',
					cancelText: '取消',
					confirmText: '确认',
				},
				pushModal: {
					show: false,
					content: '您要前往查看吗?',
					cancelText: '以后看看',
					confirmText: '前往查看',
				},
				isPush: false,
				isAPP: false,
				leftIconColor: '#ffffff',
				safeTip: '限时·特惠',
				totalDiscountPrice: '',
				totalOriginalPrice: '',
				productId: '',
				itemId: '',
				totalOrderStatus: true,
				firstShares: [],
				buttonList: [{
					text: '立即购买',
				}, ],
				navTitle: '',
				navBarHeight: 0,
				statusBarHeight: 0,
				iconBack: `${getApp().globalData.qnUrl}/zc_images/images/showBtnImg.png`,
				navbarBg: `${getApp().globalData.qnUrl}/zc_images/findTools/navbar-bg.png`,
				iconTitle: `${getApp().globalData.qnUrl}/zc_images/findTools/mechanism_blurb.png`,
				iconAdd: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-add.png`,
				iconPushed: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-pushed.png`,
				selectionList: [{
						name: '全部研报',
						show_fg: 0,
					},
					{
						name: '免费试读',
						show_fg: 0,
					},
				],
				videoCurrentIndex: 0,
				selectedShareList: [
					// {
					//   authStatus: false,
					//   persons: '10594',
					//   createTime: '2022-06-21 09:09:33',
					//   id: 1048398,
					//   isFree: false,
					// },
				],
				newChance: [
					// {
					//   time: '13:30',
					//   title: '四季度收入首次突破千亿大关利润大超预期，世界上有无数的成功投资达人',
					//   subtitle: '完美世界四季度收入首次突破千亿大关 利润大超预期 贝佐斯将卸任CEO 股价盘后涨超1%',
					// },
				],

				scrollTop: 0,
				old: {
					scrollTop: 0,
					reverseOpacity: 0,
				},
				PageNav: {
					window: {
						navigationBarBackgroundColor: '#ffffff',
						navigationBarTextStyle: 'black',
						navigationBarTitleText: '',
						backgroundColor: '#f8f8f8',
						backgroundTextStyle: 'dark',
					},
				},
				isNavbar: false, //自定义导航栏是否显示
				cart_id: '0',
				stockCode: '',
				backgroundObj: {
					backgroundImage: 'url(/static/zeroPurchase/titleBg.png)',
					backgroundSize: '100% 100%',
					opacity: 1,
				},
				cid: '2322444343',
				operateType: 0,
				WXsharePmr: `${getApp().globalData.qnUrl}/zc_images/findTools/WXshare_pmr.jpg` + this.$FT.versionKey(),
				shareData: {},
				infTabIndex: 0,
				infList: [{
						name: '全部',
					},
					{
						name: '策略共识',
					},
					{
						name: '行业深度',
					},
					{
						name: '个股共识',
					},
					{
						name: '机构听风',
					}
				],
			};
		},
		created() {
			this.onShareBox();
		},
		onShow() {
			//  console.log('PZB-onShow');
			this.panzhongbaoShop();
			//  #ifdef  APP-PLUS
			plus.navigator.setFullscreen(false);
			this.isApp = true;
			//  #endif
			//  #ifndef  APP-PLUS
			this.isApp = false;
			//  #endif
		},
		//如果不加这句，会导致跳转到别的页面后也是全屏
		onHide() {
			//  #ifdef  APP-PLUS
			plus.navigator.setFullscreen(false);
			//  #endif
		},
		onLoad(option) {
			//  console.log('onLoad-option', option);
			this.options(option);
			this.init();
			//  #ifdef  APP-PLUS
			this.isAPP = true;
			//  #endif

		},
		onUnload() {
			//  #ifdef  APP-PLUS
			plus.navigator.setFullscreen(false);
			//  #endif
		},
		methods: {
			...mapMutations(['setClientInfo', 'updatePushMessage']),
			options(option) {
				this.productId = option.productId;
				//  console.log('options-productId', this.productId);
			},
			async init() {
					this.$FT.clearArr(this.firstShares);
					this.$FT.clearArr(this.selectedShareList);
					this.$FT.clearArr(this.newChance);

					//  #ifdef  APP-PLUS
					this.shareIcon = 'share-square';
					//  #endif
					// this.getSystemInf();
					this.getSystem();
					await this.topShouYiList();
					await this.newsList();

					// await this.panoSelectedList(0);
					// await this.panoSelectedList(1);

					await this.panzhongbaoShop();
					await this.PZBUserBinding();

					function Promise(fn) {
						let state = 'pending'
						let value = null
						const callbacks = [] this.then = function(onFulfilled, onRejected) {
							return new Promise((resolve, reject) => {
								handle({
									onFulfilled,
									onRejected,
									resolve,
									reject,
								})
							})
						}
						this.catch = function(onError) {
							this.then(null, onError)
						}
						this.finally = function(onDone) {
							this.then(onDone, onError)
						}
						this.resolve = function(value) {
							if (value && value instanceof Promise) {
								return value
							}
							if (value && typeof value === 'object' && typeof value.then === 'function') {
								const {
									then
								} = value
								return new Promise((resolve) => {
									then(resolve)
								})
							}
							if (value) {
								return new Promise(resolve => resolve(value))
							}
							return new Promise(resolve => resolve())
						}
						this.reject = function(value) {
							return new Promise(((resolve, reject) => {
								reject(value)
							}))
						}
						this.all = function(arr) {
							const args = Array.prototype.slice.call(arr) return new Promise(((resolve, reject) => {
								if (args.length === 0) return resolve([]) let remaining = args.length
								function res(i, val) {
									try {
										if (val && (typeof val === 'object' || typeof val ===
												'function')) {
											const {
												then
											} = val
											if (typeof then === 'function') {
												then.call(val, (val) => {
													res(i, val)
												}, reject) return
											}
										}
										args[i] = val
										if (--remaining === 0) {
											resolve(args)
										}
									} catch (ex) {
										reject(ex)
									}
								}
								for (let i = 0; i res(i, args[i])
								}
							}))
						}
						this.race = function(values) {
							return new Promise(((resolve, reject) => {
								for (let i = 0, len = values.length; i values[i].then(resolve, reject)
								}
							}))
						}

						function handle(callback) {
							if (state === 'pending') {
								callbacks.push(callback) return
							}
							const cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected
							const next = state === 'fulfilled' ? callback.resolve : callback.reject
							if (!cb) {
								next(value) return
							}
							try {
								const ret = cb(value) next(ret)
							} catch (e) {
								callback.reject(e)
							}
						}

						function resolve(newValue) {
							const fn = () => {
								if (state !== 'pending') return
									if (newValue && (typeof newValue === 'object' || typeof newValue ===
											'function')) {
										const {
											then
										} = newValue
										if (typeof then ===
											'function') { // newValue 为新产生的 Promise,此时resolve为上个 promise 的resolve          // 相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调          then.call(newValue, resolve, reject)          return        }      }      state = 'fulfilled'      value = newValue      handelCb()    }    setTimeout(fn, 0)  }  function reject(error) {    const fn = () => {      if (state !== 'pending') return      if (error && (typeof error === 'object' || typeof error === 'function')) {        const { then } = error        if (typeof then === 'function') {          then.call(error, resolve, reject)          return        }      }      state = 'rejected'      value = error      handelCb()    }    setTimeout(fn, 0)  }  function handelCb() {    while (callbacks.length) {      const fn = callbacks.shift()      handle(fn)    }  }  fn(resolve, reject)}

										},
										bubbleSort(arr) {
												for (var i = 0; i < arr.length - 1; i++) {
													for (var j = 0; j < arr.length - 1 - i; j++) {
														var tem = arr[j + 1];
														arr[j + 1] = arr[j];
														arr[j] = tem;
													}
												}
											},
											getSystem() {
												let that = this;
												let port = uni.getSystemInfoSync().platform;
												switch (port) {
													case 'android':
														that.android = true;
														//  console.log('运行Android上', port); //android
														break;
													case 'ios':
														that.isios = true;
														//  console.log('运行iOS上', port); // ios
														break;
													default:
														//  console.log('运行在开发者工具上'); //devtools
														break;
												}
											},
											clickPush() {
												//  console.log('clickPush：', this.hasLogin);
												if (!this.hasLogin) {
													uni.navigateTo({
														url: '/pages/login/login',
													});
													return;
												}
												this.isPush = true;
												uni.showToast({
													icon: 'none',
													title: '已打开推送',
												});
												//  console.log('PZBoperate-params', this.clientInfo);
												let cid = this.clientInfo?.clientid || '';
												let params = {
													userId: this.userInfo.user_id,
													cid: cid,
													busType: 9, // 机构掘金
													operateType: 0, // 打开推送
												};
												//  console.log('PZBoperate-params', params);
												this.PZBoperate(params);
											},
											confirmPush(data) {
												console.log('confirmPush:', data);
												this.updatePushMessage(data);
											},
											async subscribeFN() {
													this.showSubscribe = false;
													this.isPush = false;
													let cid = this.clientInfo?.clientid || '';
													let params = {
														userId: this.userInfo.user_id,
														cid: cid,
														busType: 0,
														operateType: 1, // 关闭推送
													};
													//  console.log('PZBoperate-params', params);
													await this.PZBoperate(params);

													uni.showToast({
														icon: 'none',
														title: '已关闭推送',
													});
												},
												clickUnPush() {
													this.showSubscribe = true;
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
													this.navBarHeight = menuButtonInfo.bottom - info
														.statusBarHeight + (menuButtonInfo.top - info
															.statusBarHeight);

													// #endif
												},
												PZBUserBinding() {
													const that = this;
													let params = {
														userId: that.userInfo.user_id,
														type: 9,
													};
													//  console.log('查询用户绑定情况-入参', params);
													//  console.log('查询用户绑定情况-url', that.Config.PZBUserBinding);
													uni.request({
														url: that.Config.PZBUserBinding,
														method: 'get',
														dataType: 'jsonp',
														data: params,
														success: (res) => {
															const data = JSON.parse(res.data);
															console.log('查询用户绑定情况-data', data);
															const result = data.result;
															//  console.log('查询用户绑定情况-result', result);
															that.isPush = result.isOpenPush;
															console.log('查询用户绑定情况-isPush', that.isPush,
																result.isOpenPush);
														},
														fail: (res) => {
															//  console.log('查询用户绑定情况-fail', res);
														},
														complete: () => {},
													});
												},
												PZBoperate(params) {
													// operateType=0开启推送，1关闭推送
													const that = this;
													//  console.log('开/关推送-入参', params);
													//  console.log('开/关推送-url', that.Config.PZBoperate);
													uni.request({
														url: that.Config.PZBoperate,
														method: 'POST',
														dataType: 'jsonp',
														data: params,
														success: (res) => {
															//  console.log('开/关推送-res', res);
															const data = JSON.parse(res.data);
															console.log('开/关推送-data', data);
															// that.isPush = data.result;
															//  console.log('开/关推送-result-isPush', data.result, that.isPush);
														},
														fail: (res) => {
															//  console.log('开/关推送-fail', res);
															uni.showToast({
																icon: 'none',
																title: '操作失败,请稍后再试!',
															});
														},
														complete: () => {
															this.PZBUserBinding();
														},
													});
												},
												panzhongbaoShop() {
													const that = this;
													let params = {
														userId: that.userInfo.user_id,
													};
													uni.request({
														url: that.Config.panzhongbaoShop,
														method: 'get',
														dataType: 'jsonp',
														data: params,
														success: (res) => {
															const data = JSON.parse(res.data);
															const list = data.result;
															if (res.statusCode == 200) {
																let jgjj = list.jgjj;
																that.totalDiscountPrice = jgjj
																	.unitPrice;
																that.totalOriginalPrice = jgjj
																	.marketValue;
																that.totalOrderStatus = jgjj
																	.orderStatus;
																that.productId = jgjj.productId;
																that.itemId = jgjj.itemId;

															}
														},
														fail: (res) => {
															//  console.log('支付相关-fail', res);
														},
														complete: () => {},
													});
												},
												newsList() {
													let uniList_params = {
														sonType: this.infTabIndex - 1,
														clsType: 'JGJJ',
														userId: this.userInfo.user_id,
														pageNum: this.page.pageNum,
														pageSize: this.page.pageSize,
													};
													console.log("newsList-videoCurrentIndex", this
														.videoCurrentIndex)
													if (this.videoCurrentIndex == 0) {
														this.uniList(uniList_params);

													} else {
														this.freeList(uniList_params);

													}
												},
												uniList(params, type) {
													/**
													 * type=0 查询收费和免费，type=1 查询免费试看列表
													 *
													 */
													const that = this;
													// let params = {
													//   type: type,
													//   userId: that.userInfo.user_id,
													//   pageNum: that.page.pageNum,
													//   pageSize: that.page.pageSize,
													// };
													//  console.log('盘中宝-panzhongbaoList-入参', params);
													//  console.log('盘中宝-panzhongbaoList-url', that.Config.panzhongbaoList);

													uni.request({
														url: that.Config.URL.newsUrl.payList,
														method: 'get',
														dataType: 'jsonp',
														data: params,
														success: (res) => {
															////  console.log('盘中宝-res', res);
															const data = JSON.parse(res.data).result;
															console.log('机构掘金-panzhongbaoList-data',
																data);
															const list = data.list;
															//  console.log('盘中宝-panzhongbaoList-list', list);
															////  console.log('获取首页banner-page_code', page_code);
															if (res.statusCode == 200) {
																uni.stopPullDownRefresh();
																// that.newChance = list;
																list.forEach(function(item, i, array) {
																	let ctime = item.ctime;
																	that.newChance.push({
																		// ctime: ctime.substring(5, ctime.length),
																		ctime: ctime,
																		title: item
																			.title,
																		previewcontent: item
																			.previewcontent,
																		authStatus: item
																			.authStatus, // 是否解锁
																		isFree: item
																			.isFree,
																		id: item.id,
																		visited: item
																			?.visited ||
																			false,
																		stocksInfo: item
																			.stocksInfo
																	});
																});

																//  console.log('盘中宝 :that.newChance', that.newChance, that.newChance.length);
															}
														},
														fail: (res) => {
															//  console.log('盘中宝-fail', res);
														},
														complete: () => {},
													});
												},
												freeList(params, type) {
													/*
													
													
													机构掘金：
													全部：-1
													策略共识 0
													行业深度 1
													个股共识 2
													机构听风 3
													*/

													const that = this;

													uni.request({
														url: that.Config.URL.newsUrl.freeList,
														method: 'get',
														dataType: 'jsonp',
														data: params,
														success: (res) => {
															const data = JSON.parse(res.data).result;
															console.log('机构掘金-panzhongbaoList-data',
																data);
															const list = data.list;
															if (res.statusCode == 200) {
																uni.stopPullDownRefresh();
																list.forEach(function(item, i, array) {
																	let ctime = item.ctime;
																	that.newChance.push({
																		// time: ctime.substring(11, ctime.length),
																		ctime: ctime,
																		title: item
																			.title,
																		previewcontent: item
																			.previewcontent,
																		authStatus: item
																			.authStatus, // 是否解锁
																		isFree: item
																			.isFree,
																		id: item.id,
																		visited: item
																			?.visited ||
																			false,
																		stocksInfo: item
																			.stocksInfo
																	});
																});

															}
														},
														fail: (res) => {
															//  console.log('盘中宝-fail', res);
														},
														complete: () => {},
													});
												},
												topShouYiList() {
													const that = this;
													let params = {
														userId: that.userInfo.user_id,
														clsType: 'JGJJ'
													}
													uni.request({
														url: that.Config.URL.newsUrl.topShouYiList,
														method: 'get',
														dataType: 'jsonp',
														data: params,
														success: (res) => {
															const data = JSON.parse(res.data).result;
															console.log('机构掘金-最新战绩', data);
															if (res.statusCode == 200) {
																uni.stopPullDownRefresh();
																that.selectedShareList = data;

															}
														},
														fail: (res) => {
															//  console.log('盘中宝-fail', res);
														},
														complete: () => {},
													});
												},

												navigateIntroduce() {
													uni.navigateTo({
														url: '/findTools/mechanism/introduce',
													});
												},
												priceClick(text) {
													const that = this;
													//  console.log('盘中宝-productId', text, that.productId, this.hasLogin);
													if (!this.hasLogin) {
														uni.navigateTo({
															url: '/pages/login/login',
														});
														return;
													}
													uni.navigateTo({
														url: '/edu/course/class-detail?product_id=' + that
															.productId + '&item_id=' + that.itemId,
													});
													// uni.navigateTo({
													//   url: '/edu/order/checkout?cart_id=' + this.cart_id + '|' + 1,productId
													// });
													//这一步直接跳立即购买checkout页面
												},
												async changeBtnIndex(type) {
														// this.$FT.clearArr(this.newChance);
														const that = this;
														that.videoCurrentIndex = type;
														that.infTabIndex = 0;
														this.page.pageNum = 1;
														let params = {
															sonType: this.infTabIndex - 1,
															clsType: 'JGJJ',
															userId: this.userInfo.user_id,
															pageNum: this.page.pageNum,
															pageSize: this.page.pageSize,
														};

														console.log("newsList-videoCurrentIndex", type)
														if (type == 0) {

															await uni.request({
																url: that.Config.URL.newsUrl.payList,
																method: 'get',
																dataType: 'jsonp',
																data: params,
																success: (res) => {
																	const data = JSON.parse(res.data)
																		.result;
																	console.log(
																		'机构掘金-panzhongbaoList-data',
																		data);
																	const list = data.list;

																	if (res.statusCode == 200) {
																		uni.stopPullDownRefresh();
																		that.newChance = list;
																	}
																},
																fail: (res) => {
																	//  console.log('盘中宝-fail', res);
																},
																complete: () => {

																},
															});
														} else {
															await uni.request({
																url: that.Config.URL.newsUrl.freeList,
																method: 'get',
																dataType: 'jsonp',
																data: params,
																success: (res) => {
																	const data = JSON.parse(res.data)
																		.result;
																	console.log(
																		'机构掘金-panzhongbaoList-data',
																		data);
																	const list = data.list;
																	if (res.statusCode == 200) {
																		uni.stopPullDownRefresh();
																		that.newChance = list;
																	}
																},
																complete: () => {

																},
															});

														}
														// this.videoCurrentIndex = type;
														// this.infTabIndex = 0;
													},
													async changeInfTab(e) {
															this.infTabIndex = e.index;
															this.$FT.clearArr(this.newChance);
															this.page.pageNum = 1;
															await this.newsList();

														},
														navigateDetails(id) {
															//  console.log('详情-参数-navigateDetails', id);
															if (!this.hasLogin) {
																uni.navigateTo({
																	url: '/pages/login/login',
																});
																return;
															}
															uni.navigateTo({
																url: '/findTools/mechanism/articleDetails?pageID=' +
																	id,
															});
														},
														sharesListClick(item, authStatus, id) {
															console.log("涨跌幅-sharesListClick", item)
															const that = this;
															let short = item.obj.substr(0, 2);
															let code = item.obj.substr(2, item.obj.length);
															let setcode;
															if (short == 'SZ') {
																setcode = 0;
															} else if (short == 'SH') {
																setcode = 1;
															} else if (short == 'BJ') {
																setcode = 2;
															}
															// console.log("sharesListClick-item,code", item, short, code, setcode);
															let baseUrl = that.Config.ApiUrl
															let urls = baseUrl +
																'/hq-H5/h5/index.html#/page_detail/page-detail/page-detail?code=' +
																code +
																'&setcode=' + setcode + '&stockName=' + item
																.zhongWenJianCheng;
															// #ifdef H5
															window.location.href = urls;
															// #endif

															//#ifdef APP-PLUS
															uni.navigateTo({
																url: `/my/webview/webview_live?url=${urls}`,
															});
															// #endif
														},
														navigate(href) {
															//  console.log('navigate', href);
															window.location = href;
														},
														navBack() {
															//  console.log('盘中宝-back');
															//  #ifdef  APP-PLUS
															uni.navigateBack();
															//  #endif

															//  #ifdef  H5
															history.back();
															//  #endif
														},
														clickLeft() {
															uni.switchTab({
																url: '/pages/findPage/index',
															});
														},
														upper: function(e) {
															const that = this;
															that.page.pageNum++;
															console.log('机构掘金-toLower:', e);
															this.newsList();
														},
														toLower: function(e) {
															const that = this;
															that.page.pageNum++;
															console.log('机构掘金-toLower:', e);
															this.newsList();
														},
														listScroll(e) {

														},
														onShareBox() {
															let that = this;

															let $href = that.$.sprintf(
																'%s/h5/findTools/mechanism/index?uid=%d', that
																.Config.SiteUrl, that.userInfo
																.user_id, '&showOpenApp=true');

															// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
															// #ifdef APP-PLUS
															$href = that.$.sprintf(
																'%s/h5/findTools/mechanism/index?uid=%d', that
																.Config.SiteUrl, that.userInfo
																.user_id, '&showOpenApp=true');
															// #endif
															// #ifdef MP-WEIXIN
															$href = '/h5/findTools/mechanism/index?uid=' + that
																.userInfo.user_id + '&showOpenApp=true';
															// #endif
															that.setData({
																shareData: {
																	shareTitle: '机构掘金',
																	shareText: '网罗行业脱水研报，紧跟机构选股逻辑',
																	href: $href,
																	image: that.WXsharePmr,
																},
															});
															console.log('分享入参：', that.shareData);
															// // #ifndef MP-WEIXIN
															// this.$refs.shareBoxApp.show();
															// // #endif
														},
														goTop: function(e) {
															this.scrollTop = this.old.scrollTop;
															this.$nextTick(function() {
																this.scrollTop = 0;
															});
														},
									},
							};
</script>

<style lang="scss">
	@import '@/styles/findPage/panZhongbao.scss';
	@import '@/styles/home/pushModal.scss';
	$navbar-bg2: 'https://qnsp.zcskjy.com/zc_images/findTools/mechanism_navBar.png';

	.panZhongbao {
		::v-deep .toolTemplate {
			.toolTemplatenav {
				&-navbar {
					width: 750rpx;
					height: 100%;
					background: url($navbar-bg2) no-repeat center !important;
					background-size: 458rpx 99rpx !important;
					background-position: center 35% !important;
					;
				}
			}
		}

		&-content {
			&-title {
				.iconTitle {
					width: 246rpx;
					height: 52rpx;
				}
			}

		}
	}

	.subsectionTab {
		margin-bottom: 0;
	}

	/deep/ .safe-bottom-tip {
		width: 160rpx;
	}

	.infList {
		margin-bottom: 6rpx;

		/deep/ .u-tabs__wrapper__nav__item {
			padding: 0 10rpx;
		}
	}
</style>

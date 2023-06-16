<template>
	<!-- #ifndef H5-->
	<view class="articleDetail articleDetail_Nh5" :class="(authStatus || isFree) &&  sharesAbstractList.length !=0 ? 'articleDetailHidden' : ''">
	<!-- #endif -->
	<!-- #ifdef H5-->
	<view class="articleDetail articleDetail_h5" :class="(authStatus || isFree) &&  sharesAbstractList.length !=0 ? 'articleDetailHidden' : ''">
	<!-- #endif -->

		<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
		<toolTemplate
		  ref="toolTemplate"
		  title="详情"
		  :navbarType="navbarType"
		  :shareDataDefault="shareData"
		  @priceClick="priceClick"
		  :productId="productId"
		  :totalOrderStatus="totalOrderStatus"
		  :safeTip="safeTip"
		  :totalDiscountPrice="totalDiscountPrice"
		  :totalOriginalPrice="totalOriginalPrice"
		  :buttonList="buttonList"
		  @navBack="navBack"
		  @rightClick="onShareBox" 
		>
		<template slot="conten-center">
				<view class="statusBarHeight" :style="{ height: statusBarHeight + 'px' }"></view>
			     <sharesAbstract v-if="(authStatus || isFree) &&  sharesAbstractList.length !=0" :showSharesAbstract="showSharesAbstract"
					:sharesAbstractList="sharesAbstractList" @navigateClick="navigateClick"></sharesAbstract>
				<scroll-view class="articleDetail-scroll" :class="!authStatus && !isFree ? 'priceConent' : ''"
					:style="{ height: scrollHeight + 'rpx' }" :scroll-y="!showSharesAbstract">
					<view class="articleDetail-scroll-content" :style="{ paddingBottom: safeAreaHeight + 'px' }">
						<view class="pageDetail">
							<view class="pageDetail-content">
								<view class="pageDetail-content-title">{{ pageTitle }}</view>
								<view class="pageDetail-content-time">{{ pageTime }}</view>
								<view class="pageDetail-content-tip">{{ pageTip }}</view>
								<view class="pageDetail-content-Brief">{{ pageBrief }}</view>
							</view>
							<!-- <view class="fullText" v-html="pageContent"></view> -->
							<uParse class="fullText uparseFullText" :content="pageContent" @preview="uparsePreview"
								@navigate="uparseNavigate" noData="" />
							<!-- <uParse class="fullText" :content="pageContent" @navigate="navigate"></uParse> -->
							<view class="button-list">
								<view class="button-list-child" v-if="!authStatus && !isFree" @click="priceClick">
									<image class="iconLock" :src="iconLock" mode=""></image>
									<text class="button-list-child-text">解锁查看全文</text>
								</view>
								<!-- <view class="button-list-child" v-else @click="navigateDetails(item.authStatus)">
				<text class="button-list-child-text">查看全文</text>
			  </view> -->
							</view>
						</view>
						<view class="specialColumn">
							<view class="specialColumn-title">
								<image class="iconColumn" :src="iconColumn" mode="widthFix"></image>
								<text class="specialColumn-title-text">所属专栏</text>
							</view>
							<findTools :toolsList="toolsList" :isPrice="false"></findTools>
							<firstShares :firstShares="firstShares"></firstShares>
						</view>
					</view>
				</scroll-view>
				<u-popup :safeAreaInsetBottom="false" :safeAreaInsetTop="false" :mode="popupData.mode"
					:show="showSharesAbstract" :round="popupData.round" :overlay="popupData.overlay"
					:borderRadius="popupData.borderRadius" :closeOnClickOverlay="popupData.closeOnClickOverlay"
					@close="closeSharesPopup" @open="openSharesPopup">
					<view class="u-popup-slot">
						<view class="popup-sharesList">
							<view class="popup-sharesList-child" @click="sharesListClick(item)"
								v-for="(item, index) in popupSharesList" :key="index">
								<view class="popup-sharesList-child-left">
									<view class="popup-sharesList-child-left-name">{{ item.zhongWenJianCheng }}</view>
									<view class="popup-sharesList-child-left-code">{{ item.obj }}</view>
								</view>
								<view class="popup-sharesList-child-right" :class="item.zhangFu < 0 ? 'sharesFall' : ''">
									<view class="popup-sharesList-child-addnember">{{ item.zuiXinJia }}</view>
									<view class="popup-sharesList-child-percent" v-if="item.zhangFu > 0"> +{{ item.zhangFu }} %
									</view>
									<view class="popup-sharesList-child-percent" v-if="item.zhangFu <= 0"> {{ item.zhangFu }} %
									</view>
								</view>
							</view>
						</view>
					</view>
			</u-popup>
		</template>

		<template slot="priceBottom">
			<priceBottom v-if="!authStatus && !isFree" :productId="productId" :safeTip="safeTip"
				:totalDiscountPrice="totalDiscountPrice" :totalOriginalPrice="totalOriginalPrice" :buttonList="buttonList"
				@priceClick="priceClick"></priceBottom>
		</template>
		</toolTemplate>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import findTools from '../components/findTool.vue';
	import firstShares from '../components/firstShares.vue';
	import priceBottom from '../components/priceBottom';
	import sharesAbstract from '../components/sharesAbstract';
	import shareGApp from '@/components/share-g-app.vue';
	import uParse from '@/components/u-parse/u-parse.vue';
	import pushModal from '@/components/pushMessage/index.vue';
	import toolTemplate from '../toolTemplate/index.vue';
	export default {
		components: {
			findTools,
			firstShares,
			priceBottom,
			sharesAbstract,
			shareGApp,
			uParse,
			pushModal,
			toolTemplate
		},
		computed: {
			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin',
				'pushMessage'
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
				shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg` + this.$FT.versionKey(),
				shareCLSSD: `${getApp().globalData.qnUrl}/zc_images/images/share_CLSSD.png` + this.$FT.versionKey(),
				iconLock: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-lock.png`,
				iconColumn: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-column.png`,
				shareIcon:'',
				shareData: {},
				navbarType:0,
				statusBarHeight: 0,
				navBarHeight: 0,
				safeAreaHeight:0,
				buttonList: [{
					text: '立即购买',
				}, ],
				popupSharesList: [
					// {
					//   name: '农发种业',
					//   code: '3600313',
					//   addnember: '13.89',
					//   percent: '+0.37%',
					// },
					// {
					//   name: '农发种业',
					//   code: '3600313',
					//   addnember: '13.89',
					//   percent: '+0.37%',
					// },
					// {
					//   name: '农发种业',
					//   code: '3600313',
					//   addnember: '13.89',
					//   percent: '+0.37%',
					// },
				],
				sharesAbstractList: [
					{
					  type: 'text',
					  key: '相关板/股',
					  val: '3',
					},
					{
					  type: 'text',
					  key: '农发种业',
					  val: '3600313',
					},
					{
					  type: 'number',
					  key: '13.89',
					  val: '+0.37%',
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
				firstShares: [{
					name: '长源电力',
					increase: '+21.98%',
					text: ' 6月10日热点分享（000966长源电力——国资委+光伏发电+月线向上拐点出现），昨晚道指下跌1.94％，纳指下跌2.75％，标普下跌2.38％，欧洲股市也下跌 ',
				}, ],
				selectedShareList: [],
				toolsList: [{
					title: [{
							image: `${getApp().globalData.qnUrl}/zc_images/findTools/tools-title1.png`,
						},
						{
							image: `${getApp().globalData.qnUrl}/zc_images/findTools/vipTitle.png`,
						},
					],
					text: '600位记者7*24小时获取独家资讯',
					subtitle: '机构、私募都在使用的A股超短热点题材宝库',
					price: '12380.00',
					discountPrice: '9888.00',
				}, ],
				showSharesAbstract: false,
				stockCode: '',
				safeTip: '限时·双重福利·买好公司享盘中宝',
				totalDiscountPrice: '',
				totalOriginalPrice: '',
				productId: '',
				itemId: '',
				pageID: '',
				totalOrderStatus: false,
				cart_id: '',
				pageDetail: [],
				pageTitle: '',
				pageTime: '2022-03-31 09:41:11',
				pageBrief: '',
				pageTip: '财联社声明:文章内容仅供参考，不构成投资建议。投资者据此操作，风险自担',
				authStatus: true,
				isFree: false,
				pageContent: '',
				pageJieshuo: '',
				stocks: '',
				popupData: {
					overlay: true,
					mode: 'top',
					borderRadius: '',
					closeable: true,
					closeOnClickOverlay: true, 
				},
				timer: null,
			};
		},
		created() {
		   this.initShareData();
		},
		onShow(option) {
			// console.log('PZBDet-onShow');
			const that = this;
			this.showInit();
			// this.clientInfo = JSON.parse(this.clientInfo);
			// // console.log('clientInfo:', this.clientInfo);
		},
		onLoad(option) {
			const that = this;
			this.init(option);
		},
		onUnload() {
			if (this.timer != null) {
				clearInterval(this.timer);
			}
			this.timer = null;
		},
		methods: {
			...mapMutations(['updatePushMessage']),
			async showInit() {
				//  #ifdef  APP-PLUS
				this.shareIcon = 'share-square';
				//  #endif
				this.$FT.clearArr(this.popupSharesList);
				this.$FT.clearArr(this.firstShares);
				this.getSystemInf();
				await this.panzhongbaoDetail();
				await this.panzhongbaoShop();
				await this.panoSelectedList(0);
			},
			async init(option) {
				//  #ifdef  APP-PLUS
				this.shareIcon = 'share-square';
				//  #endif
				// console.log('盘中宝-option', option);
				this.stockCode = option?.stockCode;
				this.pageID = option?.pageID;
				this.$FT.clearArr(this.popupSharesList);
				this.$FT.clearArr(this.firstShares);
				this.getSystemInf();
				await this.panzhongbaoDetail();
				await this.panzhongbaoShop();
				await this.panoSelectedList(0);

				// console.log('stockCode:', option.stockCode, this.stockCode);
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
					method: 'get',
					dataType: 'jsonp',
					data: params,
					success: (res) => {
						// console.log('支付相关-res', res);
						const data = JSON.parse(res.data);
						// console.log('支付相关-data', data);
						const list = data.result;
						// console.log('支付相关-list', list);
						// // console.log('获取首页banner-page_code', page_code);
						if (res.statusCode == 200) {
							let pzb = list.pzb;
							// console.log('支付相关-盘中宝', pzb);
							that.totalDiscountPrice = pzb.unitPrice;
							that.totalOriginalPrice = pzb.marketValue;
							that.totalOrderStatus = pzb.orderStatus;
							that.productId = pzb.productId;
							that.itemId = pzb.itemId;

							// // console.log('发现工具 :that.pageDetail', that.toolsList);
						}
					},
					fail: (res) => {
						// console.log('支付相关-fail', res);
					},
					complete: () => {},
				});
			},
			panzhongbaoDetail() {
				const that = this;
				let params = {
					userId: that.userInfo.user_id,
					id: that.pageID,
				};
				// console.log('盘中宝详情-入参', params);
				// console.log('盘中宝详情-url', that.Config.panzhongbaoDetail);
				uni.request({
					url: that.Config.panzhongbaoDetail,
					method: 'get',
					dataType: 'jsonp',
					data: params,
					success: (res) => {
						// console.log('盘中宝详情-res', res);
						const data = JSON.parse(res.data);
						// console.log('盘中宝详情-data', data);
						const list = data.result;
						// console.log('盘中宝详情-list', list);
						// // console.log('获取首页banner-page_code', page_code);
						if (res.statusCode == 200) {
							that.pageTitle = list?.title;
							that.pageTime = list?.ctime;
							that.pageBrief = list?.brief;
							that.pageJieshuo = JSON.parse(list.jieshuo)?.content;
							that.authStatus = list?.authStatus;
							that.isFree = list?.isFree;
							that.pageContent = list?.content;
							that.stocks = list?.stocks;
						}
					},
					fail: (res) => {
						// console.log('盘中宝详情-fail', res);
					},
					complete: () => {
						that.initShareData();
						if (this.timer != null) {
							clearInterval(this.timer);
						}
						// console.log('盘中宝-刷新涨跌幅-入参 :that.stockCode', that.stocks, that.authStatus);
						that.getStocksPrice(that.stocks);
						if (that.authStatus || that.isFree) {
							this.timer = window.setInterval(() => {
								// console.log('刷新涨跌幅', that.stocks);
								setTimeout(that.getStocksPrice(that.stocks), 0);
							}, 10000);
						}
						// this.$once('hook:onUnload', () => {
						//   clearInterval(this.timer);
						// });
					},
				});
			},
			panoSelectedList(type) {
				/**
				 * type=0是置顶，等于1是主编精选
				 *
				 */
				const that = this;
				let params = {
					type: type,
					userId: that.userInfo.user_id,
					pageNum: 1,
					pageSize: 20,
				};
				// console.log('盘中宝-panoSelectedList-入参', params);
				// console.log('盘中宝-panoSelectedList-url', that.Config.panoSelectedList);
				uni.request({
					url: that.Config.panoSelectedList,
					method: 'get',
					dataType: 'jsonp',
					data: params,
					success: (res) => {
						// // console.log('盘中宝-res', res);
						const data = JSON.parse(res.data).result;
						// console.log('盘中宝-panoSelectedList-data', data);
						const list = data?.list || [];
						// console.log('盘中宝-panoSelectedList-list', list);
						// // console.log('获取首页banner-page_code', page_code);
						if (res.statusCode == 200) {
							uni.stopPullDownRefresh();
							if (type == 0) {
								that.firstShares = list;
								list.forEach(function(item, i, array) {
									let ctime = item.ctime;
									that.stockCode = item.stockCode;
								});
								// console.log('盘中宝-panoSelectedList :that.firstShares', that.firstShares);
							} else if (type == 1) {
								that.selectedShareList = list;
							}

							// // console.log('盘中宝 :that.newChance', that.newChance);
						}
					},
					fail: (res) => {
						// console.log('盘中宝-fail', res);
					},
					complete: () => {},
				});
			},
			getStocksPrice(stocks) {
				const that = this;
				let params = {
					st: stocks,
				};
				// console.log('涨跌幅-入参', params);
				// console.log('涨跌幅-url', that.Config.getStocksPrice);
				uni.request({
					url: that.Config.getStocksPrice,
					method: 'get',
					dataType: 'jsonp',
					data: params,
					success: (res) => {
						console.log('涨跌幅-data', res);
						const list = JSON.parse(res.data);
						// console.log('涨跌幅-list', list);
						// // console.log('获取首页banner-page_code', page_code);
						if (res.statusCode == 200) {
							list.forEach(function(item, i, array) {
								item.zhangFu = that.$FT.returnFloat(item.zhangFu);
								if (i < 1) {
									const sharesAbstractList = [{
											type: 'text',
											key: '相关个股',
											val: list.length,
										},
										{
											type: 'text',
											key: item.obj,
											val: item.zhongWenJianCheng,
										},
										{
											type: 'number',
											key: item.zuiXinJia,
											val: item.zhangFu,
										},
									];
									that.sharesAbstractList = sharesAbstractList;
								}
								console.log('涨跌幅 :that.sharesAbstractList', that.sharesAbstractList);
								// that.popupSharesList.push({
								//   name: item.zhongWenJianCheng,
								//   code: item.obj,
								//   addnember: item.zuiXinJia,
								//   percent: item.zhangFu + '%',
								//   length: list.length,
								// });
							});
							that.popupSharesList = list;
							// console.log('涨跌幅 :that.popupSharesList', that.popupSharesList);
						}
					},
					fail: (res) => {
						// console.log('涨跌幅-fail', res);
					},
					complete: () => {},
				});
			},
			getSystemInf() {
				// 获取手机系统信息
				const info = uni.getSystemInfoSync();
				console.info("getSystemInf========",info,info.screenHeight - info.safeArea.height)
				// 设置状态栏高度（H5顶部无状态栏小程序有状态栏需要撑起高度）
				this.statusBarHeight = info.statusBarHeight;
				// 除了h5 app mp-alipay的情况下执行
				// #ifndef H5 || APP-PLUS || MP-ALIPAY
				// 获取胶囊的位置
				const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
				// (胶囊底部高度 - 状态栏的高度) + (胶囊顶部高度 - 状态栏内的高度) = 导航栏的高度
				this.navBarHeight = menuButtonInfo.bottom - info.statusBarHeight + (menuButtonInfo.top - info
					.statusBarHeight);
				this.safeAreaHeight=info.screenHeight - info.safeArea.height;
				// #endif
			},
			navigateClick() {
				// console.log('navigateClick-1111');
				if (this.showSharesAbstract) {
					this.showSharesAbstract = false;
				} else {
					this.showSharesAbstract = true;
				}
			},
			// obj: "SZ002540"
			// zhangFu: -7.11
			// zhongWenJianCheng: "亚太科技"
			// zuiXinJia: 6.4

			// 0 深证SZ 1 上证SH 2 北交BJ
			sharesListClick(item) {
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
				let urls = baseUrl + '/hq-H5/h5/index.html#/page_detail/page-detail/page-detail?code=' + code +
					'&setcode=' + setcode + '&stockName=' + item.zhongWenJianCheng;
				// #ifdef H5
				window.location.href = urls;
				// #endif

				//#ifdef APP-PLUS
				uni.navigateTo({
					url: `/my/webview/webview_live?url=${urls}`,
				});
				// #endif
			},
			closeSharesPopup() {
				this.showSharesAbstract = false;
			},
			openSharesPopup() {
				this.showSharesAbstract = true;
			},
			uparsePreview(src, e) {
				//事件：点击富文本里的图片
				// console.log('事件：点击富文本里的图', src, e);
				return;
				// do something
			},
			uparseNavigate(href, e) {
				//事件：点击富文本里的链接
				let pageID = this.$FT.getUrlKey('article_id', href);
				let that = this;
				uni.navigateTo({
					url: '/findTools/panZhongbao/articleDetails?pageID=' + pageID,
				});
				return;
				// do something
			},
			navBack() {
				// console.log('clickLeft');

				//  #ifdef  APP-PLUS
				uni.navigateBack();
				//  #endif

				//  #ifdef  H5
				history.back();
				//  #endif
			},
			priceClick(text) {
				const that = this;
				// console.log('盘中宝-productId', text, that.productId);
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login',
					});
					return;
				}
				uni.navigateTo({
					url: '/edu/course/class-detail?product_id=' + that.productId + '&item_id=' + that.productId,
				});
				// uni.navigateTo({
				//   url: '/edu/order/checkout?cart_id=' + this.cart_id + '|' + 1,productId
				// });
				//这一步直接跳立即购买checkout页面
			},
			confirmPush(data) {
				// console.log('confirmPush:', data);
				this.updatePushMessage(data);
			},
			initShareData(){
				let that = this;
				
				let $href = that.$.sprintf('%s/h5/findTools/panZhongbao/articleDetails?uid=%d', that.Config.SiteUrl, that.userInfo.user_id + '&pageID=' + that.pageID, '&showOpenApp=true');
				
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				$href = that.$.sprintf('%s/h5/findTools/panZhongbao/articleDetails?uid=%d', that.Config.SiteUrl, that.userInfo.user_id + '&pageID=' + that.pageID, '&showOpenApp=true');
				// #endif
				// #ifdef MP-WEIXIN
				$href = '/h5/findTools/panZhongbao/articleDetails?uid=' + that.userInfo.user_id + '&pageID=' + that.pageID  + '&showOpenApp=true';
				// #endif
				
				var path, title, image, shareText;
				
				if (that.$.isNull(that.ProductInfo)) {
					title = that.pageTitle || '盘中宝';
					shareText = that.pageBrief;
				} else {
					title = that.__('我发现这个商品很好，非常适合你哦！');
				}
				// console.log('分享入参：', $href, title, image, shareText);
				that.setData({
					shareData: {
						shareTitle: title,
						shareText: shareText,
						href: $href + '&pageID=' + that.pageID,
						image: that.shareCLSSD,
					},
				});
				console.log('分享入参：', that.shareData);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			},
			onShareBox() {
				this.initShareData();
				// #ifndef MP-WEIXIN
				// this.$refs.shareGApp.show();
				// #endif
			},
		},
	};
</script>

<style lang="scss">
	@import url('@/components/u-parse/u-parse.css');
	@import '@/styles/findPage/articleDetails.scss';

	.statusBarHeight {
		background-color: #ffffff;
	}

	.articleDetailHidden {
		// height: 100%;
		overflow: hidden;
		padding-bottom: 0rpx;

		.articleDetail-scroll {
			box-sizing: border-box;
			// spadding-bottom: 0rpx;
		}

		// .articleDetail-scroll{
		// 	height: calc(100vh - 44px - 100rpx - var(--status-bar-height)) !important;
		// }
		// .articleDetail-scroll-content{
		// 	height: calc(100vh - 44px - 100rpx - var(--status-bar-height)) !important;
		// }
	}
</style>

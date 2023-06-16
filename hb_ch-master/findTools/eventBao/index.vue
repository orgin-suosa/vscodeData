<template>
	<view class="uni-tab-bar page" style="background-color: #ffffff">

		<aheader-view :bgImg="aheaderModel.bgImg" :showShare="true" :backWhite="aheaderModel.backWhite"
			@rightClick="onShareBox" @back="backView()"></aheader-view>

		<view class="m-swiper-header" style="">
			<scroll-view id="tab_tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft"
				v-if="tabBars.length > 1">
				<view v-for="(tab, index) in tabBars" :key="tab.id" class="swiper-tab-list"
					:class="{'active':tabIndex == index}" :id="'tab_' + tab.id" :data-current="index"
					@click="tapTabClick">
					<view class="text"
						:style="index == tabIndex ?'color:#F43D3E;font-size: 34rpx;':'font-size: 32rpx;'">
						{{tab.category_name || "　"}}
					</view>
					<view class="bg-main" :style="tabIndex==index ? '':'background-color: #FFFFFF;'"></view>
				</view>
			</scroll-view>
			<view class="calendar-btn" style="position: relative;" v-show="calendarBtnShow">
				<view style="">
					<view class="datepicker-view" style="padding-top: 25rpx;">
						<uni-datetime-picker type="date" v-model="selectDay" @change="changedata" >
							<image style="width: 40rpx; height: 40rpx;" mode="aspectFill"
								src="https://qnsp.zcskjy.com/zc_images/images/calendarImg.png" />
						</uni-datetime-picker>
					</view>
				</view>
			</view>
		</view>

		<view class="datatime-view">
			<view class="borderbtn-view" style="" @click="beforeWeek">
				<image :src="tabIndex !==1 ? 'https://qnsp.zcskjy.com/zc_images/images/left-btn.png':'' "
					mode="aspectFill" style="width: 12rpx; height: 26rpx"></image>
			</view>
			<view class="select-dataview" v-show=" tabIndex == 1">
				<block v-for="(model, index1) in monthsArr" :key="index1">
					<view class="btn-view" :class="monethIndex == index1 ? 'select' : 'unselect'" style="position: relative"
						@click="dataBtnClick(index1)">
						<view class="month-title" :class="monethIndex == index1 ? 'data-select' : 'undata-select'"
							style="">{{ model.label }}</view>
						<view class="month-title" :class="monethIndex == index1 ? 'data-select' : 'undata-select'"
							style="">{{ model.data }}</view>
						<view class=""  v-show=" model.fulltime == todayMonth || model.fulltime == nextMonth" 
							style="width: auto;height: 34rpx;padding-left: 8rpx;padding-right: 8rpx; border-radius: 15rpx;position: absolute;top: -17rpx;right: -17rpx;
							background-color: #EF4642;color: #ffffff;font-size: 22rpx;line-height: 34rpx;text-align: center;">
							{{ model.fulltime == todayMonth ? funtterNowMonthCount : funtterNextMonthCount }}</view>	
					</view>
				</block>
			</view>
			<view class="select-dataview" v-show=" tabIndex !== 1" >
				<block v-for="(model, index1) in dateArr" :key="index1">
					<view class="btn-view" :class="dataIndex == index1 ? 'select' : 'unselect'" style="position: relative"
						@click="dataBtnClick(index1)">
						<view class="day-title" :class="dataIndex == index1 ? 'title-select' : 'untitle-select'"
							style="">{{ model.label }}</view>
						<view class="data-title" :class="dataIndex == index1 ? 'data-select' : 'undata-select'"
							style="">{{ model.data }}</view>
							
						<view class="" v-show="model.fulltime == todayTime" 
							style="width: auto;height: 34rpx;padding-left: 8rpx;padding-right: 8rpx;border-radius: 15rpx;position: absolute;top: -17rpx;right: -17rpx;
							background-color: #EF4642;color: #ffffff;font-size: 22rpx;line-height: 34rpx;text-align: center;">
							{{ tabIndex == 2 ? eventModelCount : marketModelCount}}</view>	
					</view>
				</block>
			</view>
			<view class="borderbtn-view" style="" @click="nextWeek">
				<image :src=" tabIndex !==1 ? 'https://qnsp.zcskjy.com/zc_images/images/nav.png':''" mode="aspectFill"
					style="width: 12rpx; height: 26rpx"></image>
			</view>
		</view>

	    <marketsort v-show="tabIndex == 0" @sortClick="sortClick" :stateIndex1="stateIndex1" :stateIndex2="stateIndex2"
			:stateIndex3="stateIndex3"> </marketsort>

		<swiper v-if="loadPageFlag" :current="tabIndex" style="height: auto" class="swiper-box" :duration="300"
			@change="swiperChangeTab">
			<swiper-item v-for="(tab, index1) in tabBars" :key="index1">

				<scroll-view class="list" scroll-y @scrolltolower="scrolltolower()" style="background-color: #FCFCFC;"
					v-if="itemsModelArr.length >0 && tabIndex == 1">
					<block v-for="(itemmodel, index2) in itemsModelArr" :key="index2">
						<futteritem :itemmodel="itemmodel" @click='futterItemClick(index2)'></futteritem>
					</block>
					<uni-load-more :status="status"></uni-load-more>
					<aexplan-view v-if="itemsModelArr.length >0"></aexplan-view>
				</scroll-view>

				<scroll-view class="list" scroll-y @scrolltolower="scrolltolower()" style="background-color: #FCFCFC;"
					v-if="itemsModelArr.length >0 && tabIndex == 2">
					<view class=""
						style="padding: 15rpx;height: 50rpx;line-height: 50rpx;color:#333333;font-size: 36rpx;font-weight: 500;">
						{{ '最新机会' }}
					</view>
					<block v-for="(itemmodel, index2) in itemsModelArr" :key="index2">
						<eventitem :itemmodel="itemmodel" @click="eventItemClick(index2)"
							@clicktitle="eventTitleClick(index2)"></eventitem>
					</block>
					<uni-load-more :status="status"></uni-load-more>
					<aexplan-view v-if="itemsModelArr.length >0"></aexplan-view>
				</scroll-view>

				<scroll-view class="list" scroll-y @scrolltolower="scrolltolower()" style="background-color: #FCFCFC;"
					v-if="itemsModelArr.length >0 && tabIndex == 0">
					<block v-for="(itemmodel, index2) in itemsModelArr" :key="index2">
						<marketitem :itemmodel="itemmodel" @leftBtnClick="hangyeClick(index2)"
							@rightBtnClick="longtouClick(index2)"></marketitem>
					</block>
					<uni-load-more :status="status"></uni-load-more>
					<aexplan-view v-if="itemsModelArr.length >0"></aexplan-view>
				</scroll-view>

				<view class=""
					style="height:100%;display: flex;flex-direction: column;align-items: center;justify-content: center;"
					v-else>
					<aempty-view showTitle="当日数据暂未更新"></aempty-view>
				</view>
			</swiper-item>
		</swiper>
		
        <view class="" style="z-index: 999;">
        	<priceBottom v-if="!totalOrderStatus" @priceClick="priceClick" :productId="productId" :totalOrderStatus="totalOrderStatus"
        		:safeTip="safeTip" :safeTipText="SJBNumber" :safeTipUnit="safeTipUnit"
        		:totalDiscountPrice="totalDiscountPrice" :totalOriginalPrice="totalOriginalPrice"
        		:buttonList="buttonList"></priceBottom>
        </view>
		
		<modal :showModal="showTipModal" :titleModal="titleModal" :contentModal="contentModal"
			:confirmText="confirmText" @confirmModal="confirmModal" @closeModal="closeModal"></modal>

		<shareGApp :shareDataDefault="shareData" ref="shareBoxApp" />
		<!-- <aexplan-view style="position: relative;left: 0;bottom: 0;"></aexplan-view> -->
	</view>
</template>
<script>
	
	import shareGApp from '@/components/share-g-app.vue';
	import futteritem from '../components/eventBao/futterViewItem.vue';
	import eventitem from '../components/eventBao/eventViewItem.vue';
	import marketitem from '../components/eventBao/marketViewItem.vue';
	import marketsort from '../components/eventBao/marketSortitem.vue';
	import dateitem1 from '../components/eventBao/dateTimeItem1.vue';
	import dateitem2 from '../components/eventBao/dateTimeItem2.vue';
	import dateitem3 from '../components/eventBao/dateTimeItem3.vue';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import modal from '../components/saoleiBao/modal.vue';

	import {
		initWeChatActivity,
		addListenWeChatForward,
		wxClose
	} from '@/helpers/initWXShare.js';
	import priceBottom from '../components/priceBottom';

	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		components: {
			futteritem,
			eventitem,
			marketitem,
			marketsort,
			dateitem1,
			dateitem2,
			dateitem3,
			shareGApp,
			priceBottom,
			modal
		},

		data() {
			return {
				options: {},
				todayMonth: '202208', //当月日期
				nextMonth: '202208', //下月日期
				todayTime: '2022-05-06', //当天日期
				selectDay: '2022-05-03', //选择的日期 默认当天日期
				selectMonth: '2022-08', //选择的日期 默认当天日期

				dataIndex: 5, // 日期索引记录
				monethIndex: 5, // 月份索引记录
					
				currntTimeStamp: '', //当前记录的时间戳
				canNextBtnClickTime: false, // 下一周按钮是否可以点击

				//请求是否完成   默认false 请求完成改为true
				loadPageFlag: true,
				//日历按钮隐藏

				ShareImg: '',
				ShareTitle: '',
				scrollLeft: 0,
				isClickChange: false,
				//加载更多的显示
				status: 'more',
				//aheader-view 的数据
				aheaderModel: {
					title: '财经日历',
					backWhite: true,
					detailtitle: '聚合每日重要事件，实时了解市场动向',
					bgImg: 'https://qnsp.zcskjy.com/zc_images/images/zc_sjb2.png'
				},
				dateArr: ['01', '02', '03', '04', '05', '06', '07'],
				monthsArr: ['01', '02', '03', '04', '05', '06', '07'], //月份数组

				//盘口异动 选中的排序索引  1 代表无状态箭头  0 向下 2向上  
				stateIndex1: 1,
				stateIndex2: 1,
				stateIndex3: 1,
                
				//未来大事的个数 
				funtterNowMonthCount: 0,
				funtterNextMonthCount: 0,
				//当天的事件掘金的个数
				eventModelCount: 0,
				//盘口异动的个数 
				marketModelCount: 0,
				
				//选中的 tabbar 默认选择的是第一个
				tabIndex: 0,
				//tabBar 的列表数据
				tabBars: [],
				//存储单个的tab 是否已经加载过数据状态的数组
				stateItemsArr: [],
				//展示的列表数据   所有列表数据
				itemsListArr: [],
				//展示的列表数据
				itemsModelArr: [],
				//url 接口列表的数组
				// urlArr: ['/v1/news/calendar/list?', '/v1/news/calendar/event/list?', '/v1/news/calendar/holiday/list?'],

				// https://shop-qa.zcskjy.com/zc-news/v1/sjb/futureEvents/list?userId=&month=202208&pageNum=1&pageSize=20   未来大事
				// https://shop-qa.zcskjy.com/zc-news/v1/sjb/industryChange/list ? userId=&day=20220816&pageNum=&pageSize=  盘口异动 
				shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg` + this.$FT.versionKey(),
				shareData: {},


				showTipModal: false,
				titleModal: '温馨提示',
				contentModal: '今日免费使用权限已完，如需无限次使用可购买事件宝权限。',
				confirmText: '立即购买',
                deminingStocksNumber:100,
				
				safeTip: '今日免费使用权限剩',
				// safeTipText: '3',
				safeTipUnit: '次',
				productId: '',
				itemId: '',
				totalDiscountPrice: '--',
				totalOriginalPrice: '--',
				totalOrderStatus: false,
				buttonList: [{
					text: '立即购买',
				}],
				// priceBottom: {
				//   safeTip: '今日免费使用权限剩',
				//   productId: '',
				//   itemId: '',
				//   totalDiscountPrice: '--',
				//   totalOriginalPrice: '--', // 原价
				//   totalOrderStatus: false, // 是否购买
				//   buttonList: [
				//     {
				//       text: '立即购买',
				//     },
				//   ],
				// },
				// urlArr: ['/v1/sjb/futureEvents/list?', '/v1/sjjj/getList?', '/v1/sjb/industryChange/list?',],
				urlArr: ['/v1/sjb/industryChange/list?','/v1/sjb/futureEvents/list?', '/v1/sjjj/getList?'],
			};
		},

		computed: {
			
			...mapState(['Config', 'userInfo', 'hasLogin','SJBNumber']),
			...mapMutations(['updateIsBeganToMine', 'updateSJBNumber']),
			//日历按钮展示
			calendarBtnShow: function() {
				return this.tabIndex !== 1 && this.totalOrderStatus;
				// return this.tabIndex !== 1;
			},
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			console.info('----eventindex----onShow---', this.options);
			if (this.options.productId && this.options.item_id) {
				console.info('----eventindex----onShow--111-', this.options);
				this.panzhongbaoShop();
				
				// this.deminingStocksNumber = this.SJBNumber;
				// this.$store.commit('updateSJBNumber', 5);
				//获取事件宝 可用次数 
				this.getUserEnableCount();
			}
		},

		/**
		 * 生命周期函数--监听页面 开始渲染
		 */
		onLoad(options) {
			this.options = options;
			console.info('----eventindex----onLoad---', options);

			var that = this;
			//获取当天的日期
			that.getTodayTime();

			// 当前的时间戳
			const timestamp = Date.now();
			// this.currntTimeStamp = timestamp;

			//获取当天是星期几
			// that.getDatWeek(timestamp);
			let date1 = new Date(timestamp);
			date1 = this.addDate(date1, 1);
			// date1 = this.addDate(date1, 0);
			const weekTimestamp = new Date(date1);
			this.currntTimeStamp = weekTimestamp;
			// that.getDateWeek(weekTimestamp);
			that.getMonthDayArr(weekTimestamp);
             
			//下个月的未来事件数据条数 
			that.loadnextMonthData(); 
			//页面数据初始化
			that.initPageData();
            //分享
			that.initShareData();
			that.getSignature();
		},



		methods: {

			// https://shop-qa.zcskjy.com/zc-news/v1/news/calendar/list?userId=&data=2022-08-26&pageNum=1&pageSize=20
			// https://shop-qa.zcskjy.com/zc-news/v1/news/calendar/list?date=2022-08-26&pageNum=1&pageSize=20
            
			//点击 事件 
			sjbNumItemClick() {
				
				// this.firstComeIn = true
				// console.info('-----sjb------');
				let that = this;
				that.deminingStocksNumber = that.SJBNumber;
				
				console.info('-----sjb------',that.deminingStocksNumber,that.SJBNumber);
				if (that.SJBNumber > 0) {
					that.deminingStocksNumber--;
				} else {
					console.info('-----sjb-----111-');
					that.showTipModal = true;
					return false;
				}
				console.info('-----sjb-----13-');
				that.$store.commit('updateSJBNumber', that.deminingStocksNumber);
                
				return true; 
			},

			closeModal(state) {
				this.showTipModal = state;
			},
			
			confirmModal(state) {
				
				this.showTipModal = state;
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login',
					});
					return;
				}
				uni.navigateTo({
					// url: '/edu/course/class-detail?product_id=' + productIds+ '&item_id=' + itemId,
					url: '/edu/order/checkout?cart_id=' + this.itemId + '|' + 1,
				});
			},

			//返回上一级页面
			backView() {
				//  #ifdef  APP-PLUS
				uni.navigateBack();
				//  #endif
				
				//  #ifdef  H5
				history.back();
				//  #endif
			},

			//分享
			onShareBox() {
				this.initShareData();
				// #ifndef MP-WEIXIN
				this.$refs.shareBoxApp.show();
				// #endif
			},


			priceClick(text) {
				const that = this;
				console.info('-----事件宝-productId', text, that.productId, that.hasLogin);
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login',
					});
					return;
				}
				uni.navigateTo({
					url: '/edu/order/checkout?cart_id=' + that.itemId + '|' + 1,
					// url: '/edu/course/class-detail?product_id=' + that.productId + '&item_id=' + that.itemId,
				});
				
				//这一步直接跳立即购买checkout页面
			},

			panzhongbaoShop() {
				const that = this;
				let params = {
					userId: that.userInfo.user_id,
				};
				uni.request({
					url: that.Config.panzhongbaoShop,
					method: 'GET',
					dataType: 'jsonp',
					data: params,
					success: (res) => {
						// console.log('支付相关-res', res);
						const data = JSON.parse(res.data);
						const list = data.result;
						// console.log('获取首页banner-page_code', page_code);
						if (res.statusCode == 200) {

							let slb = list.sjb;
							console.info('----slb---13--', slb);

							that.totalDiscountPrice = slb.unitPrice;
							that.totalOriginalPrice = slb.marketValue;
							that.totalOrderStatus = slb.orderStatus;
							that.productId = slb.productId;
							that.itemId = slb.itemId;

							// console.log('发现工具 :that.pageDetail', that.toolsList);
						}
					},
					fail: (res) => {
						// console.log('支付相关-fail', res);
					},
					complete: () => {},
				});
			},

			//排序按钮点击
			sortClick(data) {

				console.info('----sortClick----data---', data);
				let index = data.index;
				if (index == 0) {
					if (this.stateIndex1 == 0) {
						this.stateIndex1 = 2;
					} else if (this.stateIndex1 == 1) {
						this.stateIndex1 = 0;
					} else if (this.stateIndex1 == 2) {
						this.stateIndex1 = 0;
					}
					this.stateIndex2 = 1;
					this.stateIndex3 = 1;
					console.info('----sortClick----inde1111---', this.stateIndex1, this.stateIndex2, this.stateIndex3);

				} else if (index == 1) {

					console.info('----sortClick----index---', index);
					if (this.stateIndex2 == 0) {
						this.stateIndex2 = 2;
					} else if (this.stateIndex2 == 1) {
						this.stateIndex2 = 0;
					} else if (this.stateIndex2 == 2) {
						this.stateIndex2 = 0;
					}
					this.stateIndex1 = 1;
					this.stateIndex3 = 1;

				} else if (index == 2) {
					if (this.stateIndex3 == 0) {
						this.stateIndex3 = 2;
					} else if (this.stateIndex3 == 1) {
						this.stateIndex3 = 0;
					} else if (this.stateIndex3 == 2) {
						this.stateIndex3 = 0;
					}
					this.stateIndex1 = 1;
					this.stateIndex2 = 1;
				}
				
				//请求具体的 列表的数据  默认第一个tab 的id 为0  第一次加载的页面为1
				this.loadBrandsAndProduncts(this.tabIndex, 0, 1, true);
				
			},

			//未来大事点击事件
			futterItemClick(index) {
			    let canUse = this.sjbNumItemClick();
				if(canUse){
					let model = this.itemsModelArr[index];
					console.info('---futterItemClick--');
					uni.navigateTo({
						url: '/ganhuo/eventDetail/futureEvent?blockCode=' + model.blockCode + '&blockName=' + model
							.blockName + '&product_id=' + this.productId + '&item_id=' + this.itemId,
					});
				}
			},

			//事件点击标题 跳转到文章详情
			eventTitleClick(index) {
				let canUse = this.sjbNumItemClick();
				if(canUse){
					let model = this.itemsModelArr[index];
					if(!model.articleId || model.articleId == null){
						uni.showToast({
							icon:'none',
							title:'暂无新闻详情'
						})
						return;
					}
					uni.navigateTo({
						url: '/ganhuo/eventDetail/eventInfoDetail?articleId=' + model.articleId + '&fromType=' + model.fromType + '&product_id=' + this.productId + '&item_id=' + this.itemId,
					});
				}
			},
			// 事件 点击index
			eventItemClick(index) {
                let canUse = this.sjbNumItemClick();
                if(canUse){
					let model = this.itemsModelArr[index];
					uni.navigateTo({
						url: '/ganhuo/eventDetail/futureEvent?blockCode=' + model.code + '&blockName=' + model.name +
							'&fromType=' + model.fromType + '&product_id=' + this.productId + '&item_id=' + this.itemId,
					});
				}
			},

			//盘口异动 点击事件
			// 行业异动
			hangyeClick(index) {
				let canUse = this.sjbNumItemClick();
				if(canUse){
					let model = this.itemsModelArr[index];
					uni.navigateTo({
						url: '/ganhuo/eventDetail/panMouthMovement?day=' + model.day + '&industryCode=' + model
							.industryCode + '&product_id=' + this.productId + '&item_id=' + this.itemId,
					});
				}
			},
			//异动龙头 
			longtouClick(index) {
				let canUse = this.sjbNumItemClick();
				if(canUse){
					let model = this.itemsModelArr[index];
					console.info('---model--111-', model);
					uni.navigateTo({
						url: '/ganhuo/eventDetail/selfStockChange?day=' + model.day + '&stockCode=' + model
							.changeLeadStockCode + '&market='+ model.changeLeadStockMarket + '&stockName=' + model.changeLeadStockName + '&product_id=' + this.productId + '&item_id=' + this.itemId,
					});
				}
			},

			//时间选择器 的操作
			changedata(e) {
				// let canUse = this.sjbNumItemClick();
				// if(canUse){
					console.info('----change事件:----', e);
					this.selectDay = e;
					//需要计算一下 周围7天的日期
				
					let date1 = new Date(this.selectDay);
					let insert = 6 - this.dataIndex;
					date1 = this.addDate(date1, insert);
					const weekTimestamp = new Date(date1);
					// console.log('weekTimestamp------', weekTimestamp);
					this.getDateWeek(weekTimestamp);
				// }	
			},

			//获取初始 日期初始化
			getMonthDayArr(timestamp) {
				//将时间数组 清零初始化

				let monthResultArr = [];
				this.monthsArr = [];
				const dateMonth = Array.from(new Array(7)).map((_, i) => {
                    
					const nowTimestamp = Date.now();
					const weekTimestamp = new Date(nowTimestamp);
					let insert = 6 - this.dataIndex;
					var monthStr = String(weekTimestamp.getMonth() + 1 - i + insert);
		
					//月份时间
					var fulltime;
					if (monthStr < 1) {
						monthStr = String(parseInt(monthStr) + 12);
						//月份时间
						 fulltime = String(weekTimestamp.getFullYear() -1 ) + monthStr.padStart(2, '0');
					}else{
						//月份时间
						 fulltime = String(weekTimestamp.getFullYear()) + monthStr.padStart(2, '0');
					}
					// const date = String(new Date(weekTimestamp).getMonth() +1 ) + '月';
					const date = monthStr + '月';
					monthResultArr.unshift({
						data: date,
						label: date,
						fulltime: fulltime
					});
				});

				this.dateArr = [];
				let dayResultArr = [];
				// 日期 时间	
				const dateWeek = Array.from(new Array(7)).map((_, i) => {
					/* 得到当前周每一天的时间戳 */
					const weekTimestamp = new Date(timestamp - i * 24 * 60 * 60 * 1000);
					const fulltime = String(weekTimestamp.getFullYear()) + '-' + String(weekTimestamp.getMonth() +
						1).padStart(2, '0') + '-' + String(new Date(weekTimestamp).getDate()).padStart(2, '0');
					const date = String(new Date(weekTimestamp).getDate()).padStart(2, '0');
					const value = JSON.stringify(i);
					/* 得到周几后转换 */
					let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
					let label = weeks[weekTimestamp.getDay()];
					dayResultArr.unshift({
						data: date,
						label: label,
						fulltime: fulltime
					});
				});

				for (let i = 0; i < monthResultArr.length; i++) {
					let map = monthResultArr[i];
					if (map.fulltime == this.todayMonth) {
						map.label = '本月';
					}
				}
				for (let i = 0; i < dayResultArr.length; i++) {
					let map = dayResultArr[i];
					if (map.fulltime == this.todayTime) {
						map.label = '今天';
					}
				}
				this.setData({
					monthsArr: monthResultArr,
					dateArr: dayResultArr,
				});

			},

			getDateWeek(timestamp) {
				//将时间数组 清零初始化

				let resultArr = [];
				//月份
				if (this.tabIndex == 1) {


				} else {
					this.dateArr = [];
					// 日期 时间	
					// const timestamp = new Date(2019, 7, 30, 0, 0, 0, 0).getTime()
					const dateWeek = Array.from(new Array(7)).map((_, i) => {
						/* 得到当前周每一天的时间戳 */
						const weekTimestamp = new Date(timestamp - i * 24 * 60 * 60 * 1000);
						const fulltime = String(weekTimestamp.getFullYear()) + '-' + String(weekTimestamp
							.getMonth() +
							1).padStart(2, '0') + '-' + String(new Date(weekTimestamp).getDate()).padStart(2,
							'0');

						// const month = String(weekTimestamp.getMonth() + 1).padStart(2, '0') + '.' +
						// 	String(new Date(weekTimestamp).getDate()).padStart(2, '0')
						const date = String(new Date(weekTimestamp).getDate()).padStart(2, '0');
						const value = JSON.stringify(i);

						/* 得到周几后转换 */
						let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
						let label = weeks[weekTimestamp.getDay()];

						resultArr.unshift({
							data: date,
							label: label,
							fulltime: fulltime
						});
					});
				}

				if (this.tabIndex == 1) {
					for (let i = 0; i < resultArr.length; i++) {
						let map = resultArr[i];
						if (map.fulltime == this.todayMonth) {
							map.label = '本月';
						}
					}
					this.setData({
						monthsArr: resultArr,
					});
					
				} else {

					for (let i = 0; i < resultArr.length; i++) {
						let map = resultArr[i];
						if (map.fulltime == this.todayTime) {
							map.label = '今天';
						}
					}
					this.setData({
						dateArr: resultArr,
					});

					// console.info('--------dateArr---',this.dateArr);
				}


				if (this.stateItemsArr.length > 0) {

					this.dataBtnClick(this.dataIndex);
				}
			},

			//点击日期切换
			dataBtnClick(index) {
               
				// this.stateIndex1 = 1;
				// this.stateIndex2 = 1;
				// this.stateIndex3 = 1;
				
				if(this.tabIndex == 1){
					this.setData({
						monethIndex: index,
					});
				}else{
					this.setData({
						dataIndex: index,
					});
				}
				 
				if (this.tabIndex == 1) {
					let map = this.monthsArr[index];
					this.selectMonth = map.fulltime;
				} else {
					let map = this.dateArr[index];
					this.selectDay = map.fulltime;
				}

				//切换日期之后  需要将之前的大数组数据清除  状态数组清空
				this.itemsListArr = [];
				this.stateItemsArr = [];
				//stateItemsArr
				let ary = [];
				for (let i = 0, length = this.tabBars.length; i < length; i++) {
					ary.push({
						loadPageFlag: false,
						pageNum: 1,
						totalPage: 1,
						tabType_id: this.tabBars[i].tabType_id
					});
					this.itemsListArr.push([]);
				}
				this.stateItemsArr = ary;

				//掉用接口数据
				this.loadBrandsAndProduncts(this.tabIndex, this.tabBars[this.tabIndex].tabType_id || 0, 1, true);
			},

			addDate(date, n) {
				date.setDate(date.getDate() + n);
				return date;
			},

			//上一周的数据
			beforeWeek() {

				const that = this;
				//改进的方法
				//6 - this.datIndex 是计算出这一周最后一天的数据    //-7 是下一周的数据
				let insert = 6 - this.dataIndex - 7;

				//计算前面的月份
				if (that.tabIndex == 1) {

				} else {
					let date1 = new Date(this.selectDay);
					date1 = this.addDate(date1, insert);
					const weekTimestamp = new Date(date1);
					this.currntTimeStamp = weekTimestamp;
					this.getDateWeek(weekTimestamp);
				}
			},
			//下一周的数据
			nextWeek() {
				const that = this;
				//6 - this.datIndex 是计算出这一周最后一天的数据    //加7 是下一周的数据
				let insert = 6 - this.dataIndex + 7;
				if (that.tabIndex == 1) {


				} else {
					//改进的方法
					let date1 = new Date(this.selectDay);
					date1 = this.addDate(date1, insert);
					const weekTimestamp = new Date(date1);
					this.$nextTick(() => {
						that.currntTimeStamp = weekTimestamp;
						that.getDateWeek(weekTimestamp);
					});
				}
			},

			// 获取今日日期 
			getTodayTime() {
				let nowDate = new Date();
				let date = {
					year: nowDate.getFullYear(),
					month: nowDate.getMonth() + 1,
					date: nowDate.getDate(),
					nextMonth: nowDate.getMonth(),
				};

				if (parseInt(date.month) < 10) {
					date.month = '0' + date.month;
				}
				if (parseInt(date.date) < 10) {
					date.date = '0' + date.date;
				}
                
				//如果当月月份是 12 
				if (parseInt(date.month) == 12) {
				
					this.nextMonth = date.year + 1 + '01';
					
				}else{
					console.info('----nextMonth--00--', parseInt(date.month));
					if (parseInt(date.month) < 9) {
						date.nextMonth = '0' + String(parseInt(date.month) + 1);
						console.info('----nextMonth--11--', date.nextMonth);
					}else{
						date.nextMonth = String(parseInt(date.month) + 1);
						console.info('----nextMonth--22--', date.nextMonth);
					}
				    this.nextMonth = date.year + date.nextMonth;
				}
				
				console.info('----nextMonth--33--', this.nextMonth);
							
				//获取当前日期 当前月
				this.selectDay = date.year + '-' + date.month + '-' + date.date;
				this.todayTime = date.year + '-' + date.month + '-' + date.date;
				this.todayMonth = date.year + date.month;
				this.selectMonth = this.todayMonth;
			},

			initPageData: function() {
				let that = this;

				let tmp = [];
				tmp.push({
					'id': 0,
					tabType_id: 0,
					category_name: that.__('盘口异动')
				});
				tmp.push({
					'id': 1,
					tabType_id: 1,
					category_name: that.__('未来大事')
				});
				tmp.push({
					'id': 2,
					tabType_id: 2,
					category_name: that.__('事件掘金')
				});
				
				// tmp.push({
				// 	'id': 3,
				// 	tabType_id: 3,
				// 	category_name: that.__('财经日历')
				// });
				that.setData({
					tabBars: tmp,
				});

				that.itemsListArr = [];
				//stateItemsArr
				let ary = [];
				for (let i = 0, length = that.tabBars.length; i < length; i++) {
					ary.push({
						loadPageFlag: false,
						pageNum: 1,
						totalPage: 1,
						status: 'more',
						tabType_id: that.tabBars[i].tabType_id
					});
					that.itemsListArr.push([]);
				}
				that.stateItemsArr = ary;

				//请求具体的 列表的数据  默认第一个tab 的id 为0  第一次加载的页面为1
				that.loadBrandsAndProduncts(that.tabIndex, 0, 1, true);
			},
            
			// 请求具体的数据列表
			loadnextMonthData() {
				var that = this;
				let params = {
				};
				params.userId = that.userInfo.userId;
				params.month = that.nextMonth;
				params.pageNum = 1;
				params.pageSize = '20';
				// console.info('----loadnex---params----', params);
				uni.request({
					method: 'GET',
					data: params,
					url: that.Config.newsUrlStr + that.urlArr[1],
					success: function(data, status) {
			           
						if (data.statusCode == 200) {
							
							console.info('---loadnext-----', data.data);
							that.funtterNextMonthCount = data.data.result.total;
							
						} else {
			
						}
					},
				});
			},
			
			
			// 请求具体的数据列表
			loadBrandsAndProduncts(index, tabType_id, pageNum, force_refresh) {
				var that = this;
				let params = {};
				// https://shop-qa.zcskjy.com/zc-news/v1/sjb/futureEvents/list?userId=&month=202208&pageNum=1&pageSize=20
				params.userId = that.userInfo.userId;
				if (index == 1) {
					// params.month = that.selectMonth.replaceAll('-','');
					params.month = that.selectMonth.replace(/[-]/g, '');
				} else if (index == 0) {
					params.day = that.selectDay.replace(/[-]/g, '');
				} else {
					params.date = that.selectDay;
				}
				
				if(that.tabIndex == 0){
					if(that.stateIndex1 == 0){
						params.count = 'desc';
					}
					if(that.stateIndex1 == 2){
						params.count = 'asc';
					}
					if(that.stateIndex2 == 0){
						params.index ='desc';
					}
					if(that.stateIndex2 == 2){
						params.index = 'asc';
					}
					if(that.stateIndex3 == 0){
						params.money = 'desc';
					}
					if(that.stateIndex3 == 2){
						params.money = 'asc';
					}
				}
				
				params.pageNum = pageNum;
				params.pageSize = '20';
				
				console.info('----reuqest---params----', params);

				uni.request({
					method: 'GET',
					data: params,
					url: that.Config.newsUrlStr + that.urlArr[index],
					success: function(data, status) {

						if (data.statusCode == 200) {
							uni.stopPullDownRefresh();
							that.status = 'more';
							let modelArr = data.data.result.list;
							
							let tmp = that.stateItemsArr[index];
							tmp.loadPageFlag = true;
							tmp.totalPage = data.data.result.totalPage;
							tmp.status = 'more';
							if (modelArr.length < 20) {
								tmp.status = 'noMore';
								that.status = 'noMore';
							}
							tmp.pageNum = pageNum;
							that.$set(that.stateItemsArr, index, tmp);

							// 为true 的时候  下拉刷新的操作
							//为 false 的时候 拼接数组 否则直接赋值
							if (force_refresh) {
								//替换model大数组 里面对应的单页面的小数组
								that.$set(that.itemsListArr, index, modelArr);
							} else {
								modelArr = that.itemsModelArr.concat(modelArr);
								// console.info('---model---length--', modelArr.length);
								// let loadArr = that.itemsListArr[index];
								// loadArr = loadArr.concat(modelArr);
								// that.$set(that.itemsListArr, index, loadArr);
							}
							
                            console.info('-----modelArr--01--', modelArr.length);
							//页面是否加载完成
							that.setData({
								loadPageFlag: true,
								itemsModelArr: modelArr
								// itemsModelArr: that.itemsListArr[index],
							});
                            
							//时间掘金 当天有多少条数据 
							if( that.tabIndex == 2 && that.selectDay == that.todayTime){
							  that.eventModelCount = data.data.result.total;
							}
							if(that.tabIndex == 0 && that.selectDay == that.todayTime){
							  that.marketModelCount = data.data.result.total;
							}
							if(that.tabIndex ==1 && that.selectMonth == that.todayMonth){
							   that.funtterNowMonthCount = data.data.result.total;
							}
						
							console.info('---itemsModelArr---111--', that.itemsModelArr.length);

						} else {

							uni.showToast({
								icon: 'none',
								title: data.message
							})
							// that.$.confirm(msg);
						}
					},
				});
			},

			//初始化数据
			initData: function(force_refresh) {
				var that = this;
				//掉用接口数据
				that.loadBrandsAndProduncts(that.tabIndex, this.tabBars[this.tabIndex].tabType_id || 0, 1,
					force_refresh);
			},

			loadMore() {
				let that = this;
				that.status = 'loading';
				let tmp = that.stateItemsArr[that.tabIndex];
				tmp.status = 'loading';
				that.$set(that.stateItemsArr, that.tabIndex, tmp);
				setTimeout(() => {
					that.addData(that.tabIndex);
				}, 500);
			},

			addData(e) {
				if (this.stateItemsArr[e].totalPage <= this.stateItemsArr[e].pageNum) {
					this.status = 'noMore';
					let tmp = this.stateItemsArr[e];
					tmp.status = 'noMore';
					this.$set(this.stateItemsArr, e, tmp);
					return;
				}
				let tabType_id = this.tabBars[this.tabIndex].tabType_id;
				this.loadBrandsAndProduncts(this.tabIndex, tabType_id, this.stateItemsArr[e].pageNum + 1, false);
			},

			async swiperChangeTab(e) {
				console.info('---swiper--Tab---', e);
				let that = this;
				let index = e.target.current;
                
				//滑动到了月份
				if(index == 1){
					that.setData({
						itemsModelArr: [],
						monethIndex: 5,
					});
					
					that.isClickChange = false;
					that.tabIndex = index;
					
					let map = that.monthsArr[that.monethIndex];
					that.selectMonth = map.fulltime;
					
					let tabType_id = that.tabBars[index].tabType_id;
					that.loadBrandsAndProduncts(index, tabType_id, 1, true);
				    return;		
				}
				
				  
				//先清空列表数据
				that.setData({
					itemsModelArr: [],
				});
                // console.info('---swiper--itemsModelArr--1---', that.itemsModelArr);
				//如果loadPageFlag 说明那个index 没有加载过数据 发送请求
				if (!that.stateItemsArr[index].loadPageFlag) {
                    // console.info('---swiper---', that.itemsModelArr);
					let tabType_id = that.tabBars[index].tabType_id;
					that.loadBrandsAndProduncts(index, tabType_id, 1, true);

				} else {
                     // console.info('---swiper--itemsModelArr--2---', that.itemsModelArr);
					let tmp = that.stateItemsArr[index];
					that.setData({
						status: tmp.status,
						loadPageFlag: true,
						itemsModelArr: that.itemsListArr[index],
					});
					// console.info('---swiper--itemsModelArr--3---', that.itemsModelArr);
				}

				let tmp = that.stateItemsArr[index];
				that.status = tmp.status;

				if (that.isClickChange) {
					that.tabIndex = index;
					that.isClickChange = false;
					return;
				}
                this.isClickChange = false;
                this.tabIndex = index;
				
				let tabBar = await that.getElSize('tab-bar'),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].id);
					width += result.width;
				}

				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].id),
					nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth / 2) {
					this.scrollLeft = tabBarScrollLeft + nowWidth;
				}
				if (width + nowWidth - tabBarScrollLeft < winWidth / 2) {
					this.scrollLeft = 0;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				// this.isClickChange = false;
				// this.tabIndex = index;

				//切换tab 的时候 将pageNum 重置
				for (var i = 0, length = that.stateItemsArr.length; i < length; i++) {
					let tmp = that.stateItemsArr[i];
					tmp.pageNum = 1;
					that.$set(that.stateItemsArr, i, tmp);
				}
			},

			getElSize(id) {
				//得到元素的size
				return new Promise((res, rej) => {
					uni
						.createSelectorQuery()
						.select('#tab_' + id)
						.fields({
								size: true,
								scrollOffset: true,
							},
							(data) => {
								res(data);
							},
						)
						.exec();
				});
			},

			async tapTabClick(e) {
				//点击tab-bar

				console.info('----点击进行tab 切换----');
				let that = this;
				let tabIndex = e.currentTarget.dataset.current;

				if (this.tabIndex === tabIndex) {
					return false;
				} else {
					
                    // console.info('----点击进行tab 切换----');
					//先清空列表数据
					that.setData({
						itemsModelArr: [],
					});

					this.isClickChange = true;
					this.tabIndex = tabIndex;

					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft

					let width = 0;
					for (let i = 0; i < tabIndex; i++) {
						let result = await this.getElSize(this.tabBars[i].id);
						width += result.width;
					}
					let winWidth = uni.getSystemInfoSync().windowWidth,
						nowElement = await this.getElSize(this.tabBars[tabIndex].id),
						nowWidth = nowElement.width;

					if (width + nowWidth - tabBarScrollLeft > winWidth / 2) {
						this.scrollLeft = tabBarScrollLeft + nowWidth;
					}
					if (width + nowWidth - tabBarScrollLeft < winWidth / 2) {
						this.scrollLeft = 0;
					}
				}

				//切换tab 的时候 将pageNum 重置
				for (var i = 0, length = that.stateItemsArr.length; i < length; i++) {
					let tmp = that.stateItemsArr[i];
					tmp.pageNum = 1;
					that.$set(that.stateItemsArr, i, tmp);
				}
			},

			scrolltolower: function() {
				console.log('scrolltolower');
				this.loadMore();
			},

			getUserEnableCount() {
				const that = this;
				let params = {
					userId: that.userInfo.user_id,
					type:'sjb'
				};

				uni.request({
					url: that.Config.URL.newsUrl.getUserEnableCount,
					method: 'GET',
					dataType: 'jsonp',
					data: params,
					success: (res) => {

						const data = JSON.parse(res.data);
						console.info('------未购买用户询剩余次数data----', data, that.isNum(data.result));
						that.deminingStocksNumber = that.isNum(data.result) ? data.result : 0;
						// that.$store.commit('updateSJBNumber', 5);
						that.$store.commit('updateSJBNumber', that.deminingStocksNumber);
					},
					fail: (res) => {
						// console.log('避雷宝-未购买用户询剩余次数-fail', res);
					},
					complete: () => {},
				});
			},

			isNum(value) {
				return typeof value === 'number' && !isNaN(value);
			},

			initShareData() {
				let that = this;
				let $href = that.$.sprintf('%s/h5/findTools/eventBao/index?uid=%d', that.Config.SiteUrl, that.userInfo
					.user_id, '&showOpenApp=true');
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				$href = that.$.sprintf('%s/h5/findTools/eventBao/index?uid=%d', that.Config.SiteUrl, that.userInfo.user_id,
					'&showOpenApp=true');
				// #endif
				// #ifdef MP-WEIXIN
				$href = '/h5/findTools/eventBao/index?uid=' + '&showOpenApp=true';
				// #endif

				that.setData({
					shareData: {
						shareTitle: '事件宝',
						shareText: '聚合每日重要事件,实时了解重要市场机会',
						href: $href,
						image: that.shareLogo,
					},
				});
				console.log('分享入参：', that.shareData);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			},
			
			async checkAuthProcess(signature) {
				let that = this;
				console.info('长乘资质--初始化微信流程------------>signature---1.2', signature);
				const ua = navigator.userAgent.toLowerCase();
				const isWeChat = ua.indexOf('micromessenger') !== -1;
				console.info('长乘资质------是否处于微信环境------------->1.2', isWeChat);
				if (!isWeChat) return;

				// 初始化微信活动主流程
				await initWeChatActivity(signature);
				// 监听微信转发
				addListenWeChatForward(this.handleForwardData(), () => {
					// 转发回调，增加转发记录
					console.info('长乘资质-转发数据', this.handleForwardData());
				});
			},
			// 转发参数处理
			handleForwardData() {
				return {
					title: this.shareData.title,
					desc: this.shareData.shareText,
					imgUrl: this.shareData.image,
					link: this.shareData.href,
				};
			},
			
			async getSignature() {
				const that = this;
				let _href = encodeURIComponent(location.href.split('#')[0]);
				const params = {
					url: encodeURIComponent(_href), // url
					// url: 'https://shop-qa.zcskjy.com/h5/', // url
				};
				console.log('---params-----', params);
				console.log('---WXSignature---url', that.Config.URL.WXSignature);
				uni.request({
					url: that.Config.URL.WXSignature,
					method: 'get',
					data: params,
					dataType: 'json',
					success: (res) => {
						const data = res.data;
						console.log('----data---1--', data);
						let result = res.data.result;
						console.log('----complete-res-----', result);
					},
					fail: () => {},
					complete: (res) => {
						let result = res.data?.result;

						that.signature = {
							// appId: 'wx1935506901780516', // 小程序的唯一标识
							appId: 'wxd74f2b85b1b724a7', // 必填，公众号的唯一标识
							timestamp: result?.timestamp, // 必填，生成签名的时间戳
							nonceStr: result?.nonceStr, // 必填，生成签名的随机串
							signature: result?.signature, // 必填，签名，见附录1
						};
						// console.log('-checkAuthProcess-参数', that.signature);
						that.checkAuthProcess(that.signature);
					},
				});
			},

		},

		mounted() {},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.initData(true);
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		
	};
</script>

<style lang="scss">
	@import '../../styles/_variables';
	@import '../../styles/layout.scss';

	.uni-tab-bar-loading {
		text-align: center;
		font-size: 28upx;
		color: #999;
	}

	.page {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		// min-height: 100%;
		background-color: #ffffff;
		background-size: cover !important;
		background-position: top center !important;
		margin-bottom: var(--window-bottom);
	}
  
	.datepicker-view {
		background-color: #fff;
		padding: 10rpx;
		height: 50rpx;
	}

	.m-swiper-header {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		justify-content: space-between;
		background: #ffffff;
		height: 92rpx;
		width: 100%;
		border-radius: 24rpx 24rpx 0rpx 0rpx;
		margin-top: -30rpx;
		z-index: 1;
		border-bottom: #F0F0F0 1rpx solid;

		.calendar-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 120rpx;
			margin-right: 30rpx;
			height: 85rpx;
		}

		.uni-swiper-tab {
			line-height: 72rpx;
			white-space: nowrap;
			background: #ffffff;
			border: 0;
			height: 72rpx;
			width: 670rpx;

			margin: 10rpx 10rpx 0rpx 30rpx::-webkit-scrollbar {
				width: 0;
				height: 0;
				color: transparent;
			}

			.swiper-tab-list {
				width: auto;
				margin-right: 0rpx;
				padding-left: 36rpx;

				&:first-child {
					padding-left: 0rpx;
				}

				line-height: 70rpx;
				height: 70rpx;

				.bg-main {
					height: 10rpx;
					width: 40rpx;
					border-radius: 10rpx;
					background-color: #F43D3E;
				}
			}
		}
	}

	.datatime-view {
		// background-color: #0077AA;
		height: 96rpx;
		padding: 25rpx 5rpx;
		width: 100%;
		display: flex;
		overflow: hidden;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		.select-dataview {
			flex: 1;
			height: 100%;
			display: flex;
			// overflow: hidden;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			.select {
				// background-color: #ff9661;
				background: -wbkit-linear-gradient(to right, #FF6161, #FF9661);
				background: linear-gradient(to right, #FF6161, #FF9661);
			}

			.unselect {
				background-color: #f9f9f9;
			}

			.btn-view {
				width: 75rpx;
				height: 96rpx;
				border-radius: 10rpx;
				// overflow: hidden;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				// padding: 5rpx 0rpx;

				.title-select {
					color: #ffffff;
				}

				.untitle-select {
					color: #999999;
				}

				.data-select {
					color: #ffffff;
				}

				.undata-select {
					color: #333333;
				}

				.day-title {
					padding-top: 10rpx;
					font-size: 22rpx;
					line-height: 30rpx;
					height: 30rpx;
					text-align: center;
				}

				.data-title {
					padding-bottom: 10rpx;
					font-size: 28rpx;
					line-height: 30rpx;
					font-weight: bold;
					height: 30rpx;
					text-align: center;
				}

				.month-title {
					text-align: center;
					height: 96rpx;
					line-height: 96rpx;
					font-size: 30rpx;
					font-weight: 500;
					font-family: PingFangSC-Medium, PingFang SC;
				}
			}
		}

		.borderbtn-view {
			width: 50rpx;
			height: 90rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
		}
	}
</style>

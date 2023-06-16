<template>
	<!-- #ifdef APP-PLUS-->
	<view class="content content_app" :class="isios ? 'isios' : 'platform'">
		<!-- #endif -->
		<!-- #ifndef APP-PLUS-->
		<view class="content content_h5" :class="isios ? 'isios' : 'platform'">
			<!-- #endif -->
			<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
			<view class="top-safe">
				<!-- 	  <view class="safe-height"></view> -->
				<view class="uni-tabNav-content">
					<view class="uni-tabNav">
						<view v-for="(item, index) in navList" :key="index" class="nav-item"
							:class="{ current: tabCurrentIndex === index }" @click="tabClick(index)">
							{{ item.text }}
						</view>
					</view>
					<view class="brandList" v-if="tabCurrentIndex == 0">
						<view class="brandList-child" v-for="(item, index) in brandList" :key="index"
							:class="{ active: currentbrand === index }" @click="tabBrandClick(index, item.text)">
							<!--        <image :src="item.image" mode="widthFix"></image> -->
							<text class="brandList-child-text">{{ item.text }}</text>
						</view>
					</view>

				</view>
				<view class="" style="padding:20rpx 37rpx;background-color: #ffffff;" v-if="tabCurrentIndex ==2">

					<subsection :subsectionIndex="newsCurrentIndex" :selectionList="sub_selection_list"
						@changeBtnIndex="changeBtnIndex"></subsection>

				</view>
			</view>
			<scroll-view scroll-y="true" @scrolltolower="listScroll" :style="{ height: scrollHeight + 'rpx' }">
				<view class="safe-height"></view>
				<!-- 显示区域 -->
				<view class="content-scroll liveScroll" v-if="tabCurrentIndex === 0">
					<!-- #ifdef APP-PLUS-->
					<!-- <view class="fixed-seat" :style="{ height: scrollHeight+'rpx', maxHeight: scrollHeight+'rpx' }"></view> -->
					<!-- #endif -->
					<view class="tab-live">
						<view class="list" v-for="(item, index) in navList" :key="index">
							<view class="list-live" v-if="tabCurrentIndex === index">
								<view class="list-live-content bannerList">
									<!--              <view class="list-live-content-text">
	            <image class="icon-live2" src="https://qnsp.zcskjy.com/zc_images/findPage/live2.png" mode="widthFix"></image>
	            <text>可预约 {{ viewersNumber }} 人已预约</text>
	          </view> -->
									<swiperImages :imgWidth="690" :imgHeight="388" @bannerJump="bannerJump"
										:defaultDannerList="defaultNoData" :bannerList="bannerList"
										:swiperConfigure="swiperConfigure"></swiperImages>
									<!-- <web-view :src="liveData.page_url"></web-view> -->
								</view>
							</view>
						</view>
						<!-- 	今日热播 -->
						<view class="uni-content">
							<view class="uni-play-history">
								<view class="history-title">
									<text class="history-title-key">今日热播</text>
									<text class="todayDate">{{ todayDate }}</text>
								</view>
							</view>
							<view class="curriculum-list hideScrollbar">
								<view class="curriculum-chilldList" v-for="(item, index) in curriculumList"
									:key="index">
									<view class="list-live" v-if="curriculumList.length != 0">
										<view class="list-live-content _dashed"
											@click="videoJump(item.pageUrl, item.state)">
											<view class="list-live-content-text">
												<text>{{ item.number }}</text>
											</view>
											<image class="list-live-image" :src="item.image" mode="aspectFill"></image>
										</view>
										<view class="dot" :class="{ firstDot: index === 0 }"></view>
										<view class="button-list">
											<text class="uni-time">{{ item.startTime }}</text>
											<view class="button-list-state" v-if="item.state === 1">
												<image class="icon-live"
													src="https://qnsp.zcskjy.com/zc_images/findPage/live1.png"
													mode="widthFix"></image>
												<text class="button-list-state-text">直播</text>
											</view>
											<view class="button-list-state order look-button"
												:class="{ ordered: item.isordered }" v-if="item.state === 0">
												<view v-if="!item.isordered"
													@click="videoJump(item.pageUrl, item.state)">
													<image class="icon-live2"
														src="https://qnsp.zcskjy.com/zc_images/findPage/live4.png"
														mode="widthFix"></image>
													<text class="button-list-state-text">查看</text>
												</view>
												<view v-else class="ordered">
													<text class="button-list-state-text">查看</text>
												</view>
											</view>
											<view class="button-list-state order" v-if="item.state === 2">
												<image class="icon-live2"
													src="https://qnsp.zcskjy.com/zc_images/findPage/live3.png"
													mode="widthFix"></image>
												<text class="button-list-state-text">回放</text>
											</view>
										</view>
									</view>
								</view>
								<noData v-if="curriculumList.length == 0"></noData>
							</view>
							<!-- 精彩回放/节目列表 -->
							<view class="uni-tabVideo">
								<view v-for="(item, index) in tabVideoList" :key="index" class="nav-item"
									:class="{ select: videoCurrentIndex === index }" @click="tabVideoClick(index)">
									<view class="iconTab"></view>
									<text class="videoLisText"> {{ item.text }}</text>
								</view>
							</view>
							<!--         <view class="uni-screen" v-if="tabCurrentIndex === 0">
	        <ep-select v-if="videoCurrentIndex === 0 && wonderfulPlayback.length != 0" :default-value="0" v-model="screenSelect" :options="screenOptions" @change="screenChange"></ep-select>
	        <ep-select v-if="videoCurrentIndex === 1 && playbackAreaList.length != 0" v-model="programSelect" :options="programOptions" @change="programChange"></ep-select>
	      </view> -->
							<!-- 显示区域 -->
							<view class="noData-content"
								v-if="(videoCurrentIndex == 0 && wonderfulPlayback.length == 0) || (videoCurrentIndex === 1 && playbackAreaList.length == 0)">
								<noData></noData>
							</view>
							<view class="playback-area"
								v-if="(videoCurrentIndex == 0 && wonderfulPlayback.length != 0) || (videoCurrentIndex == 1 && playbackAreaList.length != 0)"
								:class="{ programGuides: videoCurrentIndex === 1 }">
								<view class="playback-area-list" v-if="videoCurrentIndex === 0">
									<!--              <web-view :src="item.pageUrl"></web-view> -->
									<view class="playback-area-content" @click="videoJump(item.pageUrl, item.state)"
										v-for="(item, index) in wonderfulPlayback" :key="index">
										<view class="playback-area-child">
											<view class="list-live-content-text">
												<view class="button-list-state playback">
													<view class="button-list-state-text">回放</view>
												</view>
												<view class="playback-area-text hideScrollbar">{{ item.text }}</view>
											</view>
											<image class="list-live-image" :src="item.image" mode="aspectFill"></image>
										</view>
										<view class="playback-area-describe">
											<view class="playback-area-describe-text">{{ item.describe }}</view>
											<view class="playback-area-describe-bottom">
												<view class="speaker"> 主讲: {{ brandText }}特邀主编</view>
											</view>
										</view>
									</view>
								</view>

								<view class="playback-area-list" v-if="videoCurrentIndex === 1">
									<view class="" v-for="(item, index) in playbackAreaList" :key="index">
										<view class="playback-area-time" v-if="!item.isDitto">{{ item.time }}</view>
										<view class="playback-area-content"
											@click="videoJump(item.pageUrl, item.state)">
											<view class="playback-area-child">
												<view class="list-live-content-text" v-if="item.state === 1">
													<view class="button-list-state">
														<image class="icon-live"
															src="https://qnsp.zcskjy.com/zc_images/findPage/live1.png"
															mode="widthFix"></image>
														<view class="button-list-state-text">直播</view>
													</view>
													<view class="playback-area-text hideScrollbar">{{ item.text }}
													</view>
												</view>
												<view class="list-live-content-text" v-if="item.state === 0">
													<view class="button-list-state order">
														<view class="button-list-state-text">预告</view>
													</view>
													<view class="playback-area-text hideScrollbar">{{ item.text }}
													</view>
												</view>
												<image class="list-live-image" :src="item.image" mode="aspectFill">
												</image>
											</view>
											<view class="playback-area-describe">
												<view class="playback-area-describe-text">{{ item.describe }}</view>
												<view class="playback-area-describe-bottom">
													<view class="speaker">主讲: {{ brandText }}特邀主编</view>
													<!--       <view @click="bookCourse(index, item.pageUrl)" class="order-button" v-if="item.state === 0 && videoCurrentIndex === 1 && !item.isordered">
	                    <text>去预约</text>
	                  </view> -->
													<!--          <view class="order-button ordered-button" v-else-if="item.isordered">
	                    <text>查看</text>
	                  </view> -->
												</view>
											</view>
										</view>
									</view>
									<!--       <noData v-if="playbackAreaList.length == 0"></noData> -->
								</view>
							</view>
							<view v-if="isToast" ref="uniToast" class="uni-toast">{{ toastText }}</view>
						</view>
					</view>
				</view>
				<!-- <view class="content-scroll program-scroll" v-if="tabCurrentIndex === 1" :style="{ height: contentScrollHeight + 'px', maxHeight: contentScrollHeight + 'px' }"> -->
				<view class="content-scroll program-scroll" v-if="tabCurrentIndex === 1">
					<!-- 干货 -->
					<view class="tab-driedFood" style="background-color: #f8f8f8">

						<atablistview key="video" :style="notchScreen ? 'padding-top: 10rpx;':''" ref="videoList"
							eltmType="1" encodeUrl :tabbarItemArr="videoTabTitleArr" :requestUrl="videoUrlList">
						</atablistview>

					</view>
				</view>
				<view class="content-scroll program-scroll " v-if="tabCurrentIndex == 2">
					<view class="tab-driedFood" style="background-color: #f8f8f8;">
						<!-- 7*24 快讯 -->
						<atablistview key="quick" v-if="newsCurrentIndex == 0"
							:style="notchScreen ? 'position: absolute;top: 150rpx;padding-top: 25rpx;' : 'position: absolute;top: 100rpx;padding-top: 25rpx;'"
							ref="quickList" loadMoreUrl="/ganhuo/newslistpage/newslistpage" eltmType="2"
							:tabbarItemArr="quickTabTitleArr" :requestUrl="newsUrlList"></atablistview>
						<atablistview key="news" v-if="newsCurrentIndex == 1"
							:style="notchScreen ? 'position: absolute;top:150rpx;padding-top: 25rpx;':'position: absolute;top: 100rpx;padding-top: 25rpx;'"
							ref="newsList" loadMoreUrl="/ganhuo/newslistpage/newslistpage" eltmType="0"
							:tabbarItemArr="newsTabTitleArr" :requestUrl="newsUrlList"></atablistview>
					</view>
				</view>
				<view v-if="tabCurrentIndex != 2" class="navBarHeight" :style="{ height: navBarHeight + 'rpx' }"></view>
				<!--<view class="nomore-tip">
	  	<u-loadmore
	  		    :line="true"
	  		status="loading"
	  		loadingText="到底啦"
	  		color="#909399"
	  	></u-loadmore>
	  </view> -->
			</scroll-view>
			<pushModal :pushdata="pushMessage" @confirmPush="confirmPush"></pushModal>
			<pushModal :pushdata="pushMessage"></pushModal>
			<view class="text-area"> </view>
			<noviceGuide />
		</view>
</template>

<script>
	import swiperImages from '../../components/swiper-images/index.vue';
	import quickcompview from '../../components/asecheader-view/quickcompview';
	import noData from '../../components/no-data/index.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import statusBar from '../../components/status-bar.vue';
	import pushModal from '@/components/pushMessage/index.vue';
	import atablistview from '@/components/atab-view/atablist-view.vue';
	// import subsection from '@/uni_modules/uview-ui/components/u-subsection/u-subsection.vue';
	import subsection from '@/components/subsection/index.vue';
	import noviceGuide from '@/components/noviceGuide/index.vue';
	export default {
		components: {
			swiperImages,
			quickcompview,
			noData,
			statusBar,
			atablistview,
			subsection,
			pushModal,
			noviceGuide
		},
		data() {
			return {
				isLoadmore: true,
				loadText: '已经到底了',
				isios: false,
				PageNav: {
					window: {
						navigationBarBackgroundColor: '#ffffff',
						navigationBarTextStyle: 'black',
						navigationBarTitleText: '',
						backgroundColor: '#f8f8f8',
						backgroundTextStyle: 'dark',
					},
				},
				title: 'Hello',
				tabCurrentIndex: 0,
				videoCurrentIndex: 1,
				currentbrand: 0,
				brandText: '长乘学堂',

				newsCurrentIndex: 0,
				sub_selection_list: [{
						name: '7*24快讯',
						show_fg: 0
					},
					{
						name: '市场要闻',
						show_fg: 0
					}
				],

				defaultNoData: [{
					image: `${getApp().globalData.qnUrl}/zc_images/findPage/banner0.png` + this.$FT.versionKey(),
				}, ],
				defaultDrand0: [{
					image: `${getApp().globalData.qnUrl}/zc_images/findPage/banner0.png` + this.$FT.versionKey(),
				}, ],
				defaultDrand1: [{
					image: `${getApp().globalData.qnUrl}/zc_images/findPage/banner01.png` + this.$FT.versionKey(),
				}, ],
				defaultDrand2: [{
					image: `${getApp().globalData.qnUrl}/zc_images/findPage/banner_puShi.png` + this.$FT
						.versionKey(),
				}, ],
				playbackFilter: '',
				screenSelect: '',
				programSelect: '',
				screenOptions: [{
						value: '0',
						label: '默认'
					},
					{
						value: '1',
						label: '最新'
					},
					{
						value: '2',
						label: '最热'
					},
				],
				programOptions: [{
						value: '0',
						label: '今天'
					},
					{
						value: '1',
						label: '明天'
					},
					{
						value: '2',
						label: '后天'
					},
				],
				toastText: '',
				isToast: false,
				isUniToast: false,
				bannerList: [],
				// 顶部轮播图列表
				navList: [{
						//state为切换内容
						//state: 0,
						text: '直播',
					},
					{
						//state为切换内容
						//state: 0,
						text: '视频',
					},
					{
						//state为切换内容
						//state: 0,
						text: '资讯',
					},
				],
				tabVideoList: [{
						//state为切换内容
						//state: 0,
						text: '精彩回放',
					},
					{
						//state为切换内容
						//state: 0,
						text: '节目单',
					},
				],
				wonderfulPlayback: [],
				playbackReverse: [],
				playbackJust: [],
				/*
	  直播状态：-1全部；0未开始；1直播中；2已结束
	  */
				playbackAreaList: [
					// {
					//   describe: 'A股转向，从战术谨慎到战术乐观',
					//   image: 'https://wechatapppro-1252524126.file.myqcloud.com/appu1xj9ycr8795/image/b_u_6263a574dfe27_ipldNCN6/l2zyigcp010j.jpg',
					//   isordered: true,
					//   pageUrl:
					//     'https://appu1xj9ycr8795.h5.xiaoeknow.com/content_page/eyJ0eXBlIjoiMiIsInJlc291cmNlX3R5cGUiOjQsInJlc291cmNlX2lkIjoibF82MjdhMzIwYWU0YjAxYTQ4NTFmZDBhODAiLCJhcHBfaWQiOiJhcHB1MXhqOXljcjg3OTUiLCJwcm9kdWN0X2lkIjoiIn0',
					//   speaker: '杨安榕,haven,手机尾号1395用户,手机尾号0878用户,辜若飞',
					//   state: 0,
					//   isDitto: false,
					//   time: '3月23日 星期三',
					//   text: '05月13日 184.4万人观看',
					// },
					// {
					//   describe: 'A股转向，从战术谨慎到战术乐观',
					//   image: 'https://wechatapppro-1252524126.file.myqcloud.com/appu1xj9ycr8795/image/b_u_6263a574dfe27_ipldNCN6/l2zyigcp010j.jpg',
					//   isordered: true,
					//   pageUrl:
					//     'https://appu1xj9ycr8795.h5.xiaoeknow.com/content_page/eyJ0eXBlIjoiMiIsInJlc291cmNlX3R5cGUiOjQsInJlc291cmNlX2lkIjoibF82MjdhMzIwYWU0YjAxYTQ4NTFmZDBhODAiLCJhcHBfaWQiOiJhcHB1MXhqOXljcjg3OTUiLCJwcm9kdWN0X2lkIjoiIn0',
					//   speaker: '杨安榕,haven,手机尾号1395用户,手机尾号0878用户,辜若飞',
					//   state: 1,
					//   isDitto: false,
					//   time: '3月23日 星期三',
					//   text: '05月13日 184.4万人观看',
					// },
				],
				/*
	  今日热播
	  state:直播状态：-1全部；0预约/未开始；1直播中；2回放/已结束
	  */
				curriculumList: [{
					state: 0, // 直播状态 0 1  2
					number: '2.1W已约',
					image: 'https://wechatapppro-1252524126.file.myqcloud.com/appu1xj9ycr8795/image/b_u_6263a574dfe27_ipldNCN6/l2zyigcp010j.jpg',
					isordered: false,
					startTime: '20:00',
					pageUrl: 'https://appu1xj9ycr8795.h5.xiaoeknow.com/content_page/eyJ0eXBlIjoiMiIsInJlc291cmNlX3R5cGUiOjQsInJlc291cmNlX2lkIjoibF82MjdhMzIwYWU0YjAxYTQ4NTFmZDBhODAiLCJhcHBfaWQiOiJhcHB1MXhqOXljcjg3OTUiLCJwcm9kdWN0X2lkIjoiIn0',
				}, ],
				viewersNumber: '7.9w',
				todayDate: '5月11日',
				toyeardayDate: '2022-05-05',
				timer: null,
				contentScrollHeight: 'auto',
				brandList: [{
						text: '长乘·投教',
					},
					{
						text: '淳石·投资',
					},
					{
						text: '朴石·地产',
					},
				],
				liveData: [],
				screenTimeStamp: '', //当前记录的时间戳
				swiperConfigure: {
					current: 0, //当前图片
					indicatorDots: true, //是否显示面板指示点
					autoplay: true, //是否自动切换
					interval: 400000, //自动切换时间间隔
					duration: 0, //滑动动画时长
					circular: true, //是否采用衔接滑动，即播放到末尾后重新回到开头
					previousMargin: '0px', //前边距
					nextMargin: '0px', //后边距
					isTitle: false,
				},
				// 干货模块

				quickTabTitleArr: ['要闻', 'A股', '港股', '美股', '基金', '商品', '外汇', '其他'],
				//标题数组
				newsTabTitleArr: ['要闻', 'A股', '港股', '美股', '基金', '保险', '地产'],

				videoTabTitleArr: ['推荐', '股票', '保险', '基金', '路演厅', '财经会', '公开课'],

				financeTabTitleArr: ['数据', '事件', '假期'],
				//请求url
				// videoUrlList: this.Config.URL.newsUrl.videolist,
				// newsUrlList: this.Config.URL.newsUrl.newslist,
				videoUrlList: '',
				newsUrlList: '',

				financeUrlArr: [
					// this.Config.URL.newsUrl.calendarlist,
					// this.Config.URL.newsUrl.eventlist,
					// this.Config.URL.newsUrl.holidaylist,
				],
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
					orderStatus: false,
					productId: '',
					itemId: '',
				}, ],
				statusBarHeight: 0,
				navBarHeight: 0,

				//刘海屏
				notchScreen: false,

				NavData: {
					PH: 0,
					navHeight: 0,
				},
				page: {
					total: 1, //总页数
					pageSize: 10, //每页条数
					pageNum: 1, //默认当前页
				},
			};
		},
		watch: {
			bannerList: {
				handler(newName, oldName) {
					this.bannerList = newName;
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			curriculumList: {
				handler(newName, oldName) {
					this.curriculumList = newName;
					// console.log('今日热播-curriculumList -', newName, this.curriculumList);
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			playbackAreaList: {
				handler(newName, oldName) {
					this.playbackAreaList = newName;
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			wonderfulPlayback: {
				handler(newName, oldName) {
					this.wonderfulPlayback = newName;
					// console.log('精彩回放-wonderfulPlayback -', newName, this.wonderfulPlayback);
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			toolsList: {
				handler(newName, oldName) {
					this.toolsList = newName;
					// console.log('精彩回放-wonderfulPlayback -', newName, this.wonderfulPlayback);
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			page: {
				handler(newName, oldName) {
					this.page = newName;
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
		},
		computed: {
			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum',
				'Lang', 'pushMessage'
			]),
			scrollHeight: function() {
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate);
				return winHeight;
			},
		},

		onUnload() {

			this.notice.removeNotification("changeFindView", this);
		},

		onShow: function() {
			console.log('---onshow---');
			if (this.hasLogin) {
				this.getEUid()
			}
			this.$store.commit('updateNoviceGuideIndex', 3);
			
			console.log('--this.tabCurrentIndex---',this.tabCurrentIndex);
			
			if (this.tabCurrentIndex == 1) {
			
				this.$refs.videoList.initLoadPageData();
				
			} else if (this.tabCurrentIndex == 2) {
				console.log('---onshow---刷新盘中宝数据');
				// this.panzhongbaoShop();
				if(this.newsCurrentIndex == 0){
					this.$refs.quickList.initLoadPageData();
				}else if(this.newsCurrentIndex == 1){
					this.$refs.newsList.initLoadPageData();
				} 
			}
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			console.log('---onPullDownRefresh----');
			const data = {
				tag: this.brandText,
				riqi: '', // this.toyeardayDate,
				alive_state: -1,
				page_num: this.page.pageNum,
				page_size: this.page.pageSize,
				rank_type: 0,
			};
			this.getList(data);
		},
		onReady() {
			// let that=this;
			// uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
			// 	success(res) { //成功回调函数
			// 		that.NavData.pH=res.windowHeight //windoHeight为窗口高度，主要使用的是这个
			// 		let titleH=uni.createSelectorQuery().select(".sv"); //想要获取高度的元素名（class/id）
			// 		titleH.boundingClientRect(data=>{
			// 			let pH=that.NavData.pH;
			// 			that.NavData.navHeight=pH-data.top  //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			// 		}).exec()
			// 	}
			// })
		},
		onLoad() {

			let tmpArr = [
				this.Config.URL.newsUrl.calendarlist,
				this.Config.URL.newsUrl.eventlist,
				this.Config.URL.newsUrl.holidaylist,
			];

			this.setData({
				videoUrlList: this.Config.URL.newsUrl.videolist,
				newsUrlList: this.Config.URL.newsUrl.newslist,
				financeUrlArr: tmpArr,
			});


			this.init();
			this.notice.addNotification("changeFindView", this.changeFindView, this);

			// #ifdef APP-PLUS
			if (plus.navigator.hasNotchInScreen()) {
				this.setData({
					notchScreen: true,
				});
			} else {
				this.setData({
					notchScreen: false,
				});
			}
			console.log('----liuhaiping-----', )
			// #endif 
		},
		methods: {
			...mapMutations(['updatePushMessage']),
			async init() {
				this.$store.commit('updateNoviceGuideIndex', 3);

				this.getTodayDate();
				this.getDateWeek();
				this.getSystem();
				// this.contentScroll();
				if (this.timer) {
					//注销定时器
					console.log('注销定时器');
					clearTimeout(this.timer);
					this.timer = null;
				}
				this.initPageArr();
				const data = {
					tag: this.brandText,
					riqi: '', // this.toyeardayDate,
					alive_state: -1,
					page_num: this.page.pageNum,
					page_size: this.page.pageSize,
					rank_type: 0,
				};
				this.initGetList(data);
				this.panzhongbaoShop();
				this.getSystemInf();
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

			changeFindView() {

				this.setData({
					tabCurrentIndex: 2,
					newsCurrentIndex: 1,
				});
			},

			changeBtnIndex(type) {
				// var Lst = [];
				// this.sub_selection_list = Lst;

				this.newsCurrentIndex = type;
				console.log('理财智库-index:', type);


			},

			getEUid() {
				var uid = this.$.getStorageSync('uid').toString();
				var eUrl = this.Config.getEuid
				uni.request({
					method: 'POST',
					url: eUrl,
					data: {
						"uid": uid,
					},
					success: function(data, status) {
						if (data.data.result?.userId)
							uni.setStorage({
								key: 'e_uid',
								data: data.data.result.userId
							});
					}
				})
			},

			panzhongbaoShop() {
				const that = this;
				let params = {
					userId: that.userInfo.user_id,
				};
				console.log('支付相关-入参', params);
				console.log('支付相关-url', that.Config.panzhongbaoShop);
				uni.request({
					url: that.Config.panzhongbaoShop,
					method: 'get',
					dataType: 'jsonp',
					data: params,
					success: (res) => {
						console.log('支付相关-res', res);
						const data = JSON.parse(res.data);
						console.log('支付相关-data', data);
						const list = data.result;
						console.log('支付相关-list', list);
						// console.log('获取首页banner-page_code', page_code);
						if (res.statusCode == 200) {
							let pzb = list.pzb;
							console.log('支付相关-盘中宝', pzb);
							that.toolsList[0].discountPrice = pzb.unitPrice;
							that.toolsList[0].price = pzb.marketValue;
							that.toolsList[0].orderStatus = pzb.orderStatus;
							that.toolsList[0].productId = pzb.productId;
							that.toolsList[0].itemId = pzb.itemId;


							console.log('发现工具 :that.pageDetail', that.toolsList);
						}
					},
					fail: (res) => {
						console.log('支付相关-fail', res);
					},
					complete: () => {},
				});
			},
			getSystem() {
				let that = this;
				let port = uni.getSystemInfoSync().platform;
				switch (port) {
					case 'android':
						console.log('运行Android上', port); //android
						break;
					case 'ios':
						that.isios = true;
						console.log('运行iOS上', port); // ios
						break;
					default:
						console.log('运行在开发者工具上'); //devtools
						break;
				}
			},
			initTabVideo(type) {
				console.log('initTabVideo-type', type);
				if (type != 'tabVidoeList' && type != 'wonderfulPlayback' && type != 'playbackAreaList') {
					if (this.playbackAreaList.length == 0) {
						this.videoCurrentIndex = 0;
					} else if (this.wonderfulPlayback.length == 0) {
						this.videoCurrentIndex = 1;
					} else {
						this.videoCurrentIndex = 1;
					}
				}
			},
			listScroll(e) {
				const that = this;
				console.log('滑动加载', e);
				that.page.pageNum++;
				let params = {
					tag: this.brandText,
					riqi: '', // this.toyeardayDate,
					alive_state: -1,
					page_num: that.page.pageNum,
					page_size: that.page.pageSize,
					rank_type: 0,
				};
				that.getList(params);
			},
			initPageArr() {
				this.$FT.clearArr(this.bannerList);
				this.$FT.clearArr(this.curriculumList);
				this.$FT.clearArr(this.playbackAreaList);
				this.$FT.clearArr(this.wonderfulPlayback);
			},
			getList(data, type = 'all') {
				const that = this;
				uni.request({
					url: that.Config.liveList,
					method: 'POST',
					dataType: 'jsonp',
					data: data,
					success: (res) => {
						const result = JSON.parse(res.data).result;
						// console.log('getList-res', result);
						if (res.statusCode == 200) {
							uni.stopPullDownRefresh();
							that.liveListResult(result, type)
						}
					},
					fail: () => {},
					complete: () => {
						// that.initTabVideo(type);
						// this.contentScroll();
					},
				});
			},
			initGetList(data, type = 'all') {
				// 发现页面  直播模块  精彩回访 和节目单初始化  没有节目单数据的时候  显示精彩回放
				const that = this;
				uni.request({
					url: that.Config.liveList,
					method: 'POST',
					dataType: 'jsonp',
					data: data,
					success: (res) => {
						const result = JSON.parse(res.data).result;
						// console.log('getList-res', result);
						if (res.statusCode == 200) {
							uni.stopPullDownRefresh();
							that.liveListResult(result, type)
						}
					},
					fail: () => {},
					complete: () => {
						that.initTabVideo(type);
						// this.contentScroll();
					},
				});
			},
			liveListResult(result, type = 'all') {
				const that = this;
				result.forEach(function(item, i, array) {
					// console.log('result-forEach', item, i, array);
					let lastStartTime = '';
					if (i != 0) {
						lastStartTime = array[i - 1].alive_start_at;
					}

					const startTime = item.alive_start_at;
					const PlaybackLiveTime = startTime.substring(5, 7) + '月' + startTime
						.substring(8, 10) + '日 ';
					let userName = '';
					if (item.guest_list.length != 0) {
						userName = item.guest_list
							.map((item) => {
								return item.user_name;
							})
							.toString();
					}
					let view_num = item.view_num;
					let hotNum = item?.hotNum || 0;
					if (type == 'all' || type == 'bannerList') {
						if (that.bannerList.length < 3) {
							if (item.alive_state == 0) {
								// 预约
								that.bannerList.push({
									number: '可预约 ' + view_num + '人已约',
									image: item.img_url,
									page_url: item.page_url,
								});
							} else if (item.bannerList == 1) {
								// 直播
								that.bannerList.push({
									number: '直播中' + view_num + '人在观看',
									image: item.img_url,
									page_url: item.page_url,
								});
							} else {
								that.bannerList.push({
									number: PlaybackLiveTime + view_num + '人观看',
									image: item.img_url,
									page_url: item.page_url,
								});
							}
						}
					}
					if (type == 'all' || type == 'curriculumList') {
						if (item.alive_state == 0) {
							// 预约
							that.curriculumList.push({
								state: item.alive_state, // 直播状态
								number: hotNum + '已约',
								image: item.img_url,
								isordered: false,
								startTime: startTime.substring(11, 16),
								pageUrl: item.page_url,
							});
						} else if (item.alive_state == 1) {
							// 直播
							that.curriculumList.push({
								state: item.alive_state, // 直播状态
								number: view_num + '观看',
								image: item.img_url,
								startTime: startTime.substring(11, 16),
								pageUrl: item.page_url,
							});
						} else {
							that.curriculumList.push({
								state: item.alive_state,
								// number: PlaybackLiveTime + view_num + '观看',
								number: view_num + '观看',
								image: item.img_url,
								startTime: startTime.substring(11, 16),
								pageUrl: item.page_url,
							});
						}
					}
					const backVidoeList = ['all', 'playbackAreaList', 'tabVidoeList'];
					if (backVidoeList.includes(type)) {
						const getWeek = that.getWeek(startTime.substring(0, 10));
						const lastMonthDays = lastStartTime.substring(5, 7) + '月' +
							lastStartTime.substring(8, 10) + '日 ';
						const monthDays = startTime.substring(5, 7) + '月' + startTime
							.substring(8, 10) + '日 ';
						const liveTime = monthDays + getWeek;
						// console.log('与上字段日期是否相同：', lastMonthDays, monthDays, lastMonthDays == monthDays);
						if (item.alive_state == 0) {
							// 预约
							// const liveTime = monthDays + startTime.substring(11, 16) ;
							that.playbackAreaList.push({
								state: item.alive_state, // 直播状态
								text: monthDays + startTime.substring(11, 16),
								describe: item.title,
								speaker: userName,
								isordered: false,
								isDitto: lastMonthDays == monthDays,
								time: liveTime,
								image: item.img_url,
								pageUrl: item.page_url,
							});
						}
						if (item.alive_state == 1) {
							// const getWeek = that.getWeek(startTime.substring(0, 10));
							// const liveTime = startTime.substring(5, 7) + '月' + startTime.substring(8, 10) + '日 ' + getWeek;
							that.playbackAreaList.push({
								state: item.alive_state, // 直播状态
								text: view_num + '观看',
								describe: item.title,
								speaker: userName,
								isordered: false,
								isDitto: lastMonthDays == monthDays,
								time: liveTime,
								image: item.img_url,
								pageUrl: item.page_url,
							});
						}
					}
					const playVidoeList = ['all', 'wonderfulPlayback', 'tabVidoeList'];
					if (playVidoeList.includes(type)) {
						// const PlaybackLiveTime = startTime.substring(5, 7) + '月' + startTime.substring(8, 10) + '日 ';
						if (item.alive_state == 2) {
							that.wonderfulPlayback.push({
								state: item.alive_state, // 直播状态
								text: PlaybackLiveTime + view_num + '观看',
								describe: item.title,
								speaker: userName,
								isordered: false,
								image: item.img_url,
								pageUrl: item.page_url,
							});
						}
					}
				});
				console.log('getList-bannerList', that.bannerList);
				console.log('getList-curriculumList', that.curriculumList);
				console.log('getList-playbackAreaList', that.playbackAreaList);
				console.log('getList-wonderfulPlayback', that.wonderfulPlayback);
				console.log('getList-videoCurrentIndex', that.videoCurrentIndex);
			},
			bannerJump(item, state) {
				console.log("大图跳转-bannerJump-item", item, state);
				console.log("大图跳转-bannerJump-state", state);
				let selectType = item?.selectType || "9";
				console.log("大图跳转-bannerJump-selectType", selectType, selectType == "1");
				let url = item?.page_url || '';
				let did = parseInt(item.did);
				console.log("大图跳转-bannerJump-did", did);
				if (selectType == "1") {
					uni.navigateTo({
						url: '/edu/course/class-detail?product_id=' + did + '&item_id=' + did,
					});
				} else {
					this.videoJump(url, state)
				}
			},
			// videoJump(url, state) {
			//   // uni.navigateTo({
			//   // 	url: `/pages/findPage/webview?url=${url}`
			//   // })
			//   console.log('videoJump-url, state', item, state, state != 0);
			//   // 新开窗口
			//   this.openWebview(item.page_url);
			// },
			videoJump(url, state) {
				// uni.navigateTo({
				// 	url: `/pages/findPage/webview?url=${url}`
				// })
				let zc_notitle = this.$FT.getUrlKey('zc_notitle', url)
				console.log('videoJump-zc_notitle', zc_notitle);
				console.log('videoJump-url, state', url, state);
				// 新开窗口
				// window.open(url, '_blank');
				let webview_live = '/my/webview/webview_live';
				let webview = '/my/webview/webview';
				if (zc_notitle == 0) {
					this.openWebview(url);
				} else {
					this.webview_live(url);
				}

			},
			webview_live(urls) {
				console.log('openWebview-hasLogin', this.hasLogin);
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				// #ifdef H5
				var e_uid = uni.getStorageSync('e_uid');
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						uni.showToast({
							icon: 'none',
							title: data,
						});
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							window.location.href = target;
						} else {
							window.location.href = urls;
						}
						// // #ifdef APP-PLUS
						// plus.runtime.openURL(target) //这里默认使用外部浏览器打开而不是内部web-view组件打开
						// // #endif
					},
				});
				// #endif

				//#ifdef APP-PLUS
				var e_uid = uni.getStorageSync('e_uid');
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							uni.navigateTo({
								url: `/my/webview/webview_live?url=${target}`,
							});
						} else {
							uni.navigateTo({
								url: `/my/webview/webview_live?url=${urls}`,
							});
						}
					},
				});
				// #endif
			},
			openWebview(urls, path) {
				console.log('openWebview-hasLogin', this.hasLogin);
				if (!this.hasLogin) {
					// uni.showToast({
					// 	icon: 'none',
					// 	title: '请登录后再试',
					// });
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				// #ifdef H5
				var e_uid = uni.getStorageSync('e_uid');
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						uni.showToast({
							icon: 'none',
							title: data,
						});
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							window.location.href = target;
						} else {
							window.location.href = urls;
						}
						// // #ifdef APP-PLUS
						// plus.runtime.openURL(target) //这里默认使用外部浏览器打开而不是内部web-view组件打开
						// // #endif
					},
				});
				// #endif

				//#ifdef APP-PLUS
				var e_uid = uni.getStorageSync('e_uid');
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							uni.navigateTo({
								url: `/my/webview/webview?url=${target}`,
							});
						} else {
							uni.navigateTo({
								url: `/my/webview/webview?url=${urls}`,
							});
						}
					},
				});
				// #endif
			},
			contentScroll() {
				// let h= document.querySelector('uni-tabNav-content').getBoundingClientRect().height;
				//    this.contentScrollHeight = document.body.clientHeight -h + 'px';
				let h = document.querySelector('.content-scroll').getBoundingClientRect().height + document.querySelector(
					'.uni-tabNav-content').getBoundingClientRect().height;
				this.contentScrollHeight = h + 'px';
			},
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
				this.page.pageNum = 1;
				this.page.pageSize = 10;
				this.tabRefreshData(index);

				// this.contentScroll();
			},
			tabRefreshData(index) {
				const that = this;
				if (index == 0) {
					console.log('---onshow---刷新直播数据');
					that.initPageArr();
					const data = {
						tag: that.brandText,
						riqi: '', // this.toyeardayDate,
						alive_state: -1,
						page_num: that.page.pageNum,
						page_size: that.page.pageSize,
						rank_type: 0,
					};
					that.getList(data);
				} else if (index == 2) {

					console.log('---onshow---刷新盘中宝数据');

					that.panzhongbaoShop();


				}
			},
			tabBrandClick(index, text) {
				console.info('tabBrandClick', index, text);
				this.initPageArr();
				this.currentbrand = index;
				this.page.pageNum = 1;
				this.page.pageSize = 10;
				if (index == 0) {
					this.defaultNoData = this.defaultDrand0;
				} else if (index == 1) {
					this.defaultNoData = this.defaultDrand1;
				} else if (index == 2) {
					this.defaultNoData = this.defaultDrand2;
				}
				let searchText = '';
				switch (text) {
					case '长乘·投教':
						searchText = '长乘学堂'
						break;
					case '淳石·投资':
						searchText = '淳石集团'
						break;
					case '朴石·地产':
						searchText = '朴石集团'
						break;
				};
				this.brandText = searchText;
				const data = {
					tag: searchText,
					riqi: '', // this.toyeardayDate,
					alive_state: -1,
					page_num: this.page.pageNum,
					page_size: this.page.pageSize,
					rank_type: 0,
				};
				this.initGetList(data);

			},

			tabVideoClick(index) {
				this.videoCurrentIndex = index;
				const date = new Date(); //创建日期对象
				const dates = date.getDate();
				console.log('dates-i:', dates, index);
				this.$FT.clearArr(this.playbackAreaList);
				this.$FT.clearArr(this.wonderfulPlayback);
				this.page.pageNum = 1;
				this.page.pageSize = 10;
				const data = {
					tag: this.brandText,
					riqi: '', // this.toyeardayDate,
					alive_state: -1,
					page_num: this.page.pageNum,
					page_size: this.page.pageSize,
				};
				this.initGetList(data, 'tabVidoeList');
				//  if(index == 1){
				//   this.screenOptions = this.getDateWeek();
				//  }else{
				// this.screenOptions =[{value:"0",label:"默认"},{value:"1",label:"最新"},{value:"2",label:"最热"}];
				//  }
			},

			getTodayDate() {
				let nowDate = new Date();
				let date = {
					year: nowDate.getFullYear(),
					month: nowDate.getMonth() + 1,
					date: nowDate.getDate(),
				};

				if (parseInt(date.date) < 10) {
					date.date = '0' + date.date;
				}
				this.todayDate = date.month + '月' + date.date + '日';
				this.toyeardayDate = date.year + '-' + date.month + '-' + date.date;
				// this.todayDate = date.getMonth() + date.getDate();
			},
			getWeek(date) {
				let weekArray = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');

				let week = weekArray[new Date(date).getDay()]; //注意此处必须是先new一个Date

				return week;
			},
			getDateWeek() {
				/* 得到当前日期的时间戳 */
				const timestamp = Date.now();
				// const timestamp = new Date(2019, 7, 30, 0, 0, 0, 0).getTime()
				const dateWeek = Array.from(new Array(7)).map((_, i) => {
					/* 得到当前周每一天的时间戳 */
					const weekTimestamp = new Date(timestamp + i * 24 * 60 * 60 * 1000);

					const date = String(weekTimestamp.getMonth() + 1).padStart(2, '0') + '.' + String(new Date(
						weekTimestamp).getDate()).padStart(2, '0');
					const value = JSON.stringify(i);
					/* 得到周几后转换 */
					let label = weekTimestamp.getDay();

					switch (label) {
						case 0:
							label = '周日';
							break;
						case 1:
							label = '周一';
							break;
						case 2:
							label = '周二';
							break;
						case 3:
							label = '周三';
							break;
						case 4:
							label = '周四';
							break;
						case 5:
							label = '周五';
							break;
						case 6:
							label = '周六';
							break;
					}
					return {
						value,
						date,
						label,
					};
				});
				dateWeek[0].label = '今天';
				dateWeek[1].label = '明天';
				this.programOptions = dateWeek;
				console.log('dateWeek：', this.programOptions, this.programOptions[0].label);
			},
			bookCourse(index, url) {
				// uni.navigateTo({
				//   url: `/pages/findPage/webview_live?url=${url}`,
				// });
				this.openWebview(url);
				// this.showToast('预约成功，您将收到开播提醒');
				// this.playbackAreaList[index].isordered = true;
				// console.log('bookCourse', this.playbackAreaList[index].isordered);
			},
			orderToday(i, url) {
				// uni.navigateTo({
				//   url: `/pages/findPage/webview_live?url=${url}`,
				// });
				this.openWebview(url);
				// this.showToast('预约成功，您将收到开播提醒');
				// this.curriculumList[i].isordered = true;
			},
			showToast(title) {
				this.toastText = title;
				this.isToast = true;
				this.timer = setTimeout(() => {
					this.isToast = false;
				}, 1000);
				console.log('showToast', this.$refs.uniToast, title);
			},
			screenChange() {
				this.wonderfulPlayback.length = 0;
				this.wonderfulPlayback.splice(0, 0);
				const data = {
					tag: this.brandText,
					riqi: '', // this.toyeardayDate,
					alive_state: -1,
					page_num: this.page.pageNum,
					page_size: this.page.pageSize,
					rank_type: this.screenSelect,
				};
				// console.log('节目单日期筛选-week-data：', data);
				this.getList(data, 'wonderfulPlayback');

				console.log('精彩回放-1：', this.screenSelect);
			},
			priceClick(text) {
				console.log('priceClick:', text);
				if (text == '去购买') {
					uni.navigateTo({
						url: '/pages/findPage/index',
					});
				}
			},
			confirmPush(articleId) {
				this.updatePushMessage(data);
			},
			programChange() {
				this.playbackAreaList.length = 0;
				this.playbackAreaList.splice(0, 0);
				const that = this;
				const result = [];
				const now = new Date();
				let date = {
					year: now.getFullYear(),
					month: now.getMonth() + 1,
					date: now.getDate(),
				};

				Date.prototype.getMonthDay = function() {
					let getDate = this.getDate();
					let getMonth = this.getMonth() + 1;
					if (parseInt(this.getDate()) < 10) {
						getDate = '0' + getDate;
					}
					if (parseInt(this.getMonth()) < 10) {
						getMonth = '0' + getMonth;
					}
					return this.getFullYear() + '-' + getMonth + '-' + getDate;
				};
				result.push(now.getMonthDay());
				for (let i = 0; i < 6; i++) {
					now.setDate(now.getDate() + 1);
					result.push(now.getMonthDay());
				}
				const selecText = result[this.programSelect];
				// console.log('节目单日期筛选-当前时间-selecText', this.programOptions[this.programSelect].label, selecText);
				// console.log('节目单日期筛选-week-1：', result);
				// console.log('节目单日期筛选-筛选前:', that.playbackAreaList);

				const data = {
					tag: this.brandText,
					riqi: selecText, // this.toyeardayDate,
					alive_state: -1,
					page_num: this.page.pageNum,
					page_size: this.page.pageSize,
					rank_type: 0,
				};
				// console.log('节目单日期筛选-week-data：', data);
				this.getList(data, 'playbackAreaList');
				// console.log('节目单日期筛选-areaList:', that.playbackAreaList);
			},
		},
	};
</script>

<style lang="scss">
	@import '@/styles/findPage/discoveryPage.scss';

	.curriculum-list {
		height: 270upx;
	}
</style>

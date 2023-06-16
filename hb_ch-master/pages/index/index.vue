<template>
	<!-- #ifdef APP-PLUS-->
	<view class="content home-content home-content_app" :class="isios ? 'isios' : 'platform'">
		<!-- #endif -->
		<!-- #ifndef APP-PLUS-->
		<view class="content home-content home-content_h5" :class="isios ? 'isios' : 'platform'">
			<!-- #endif -->
			<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
			<view class="top-safe">
				<!-- 		<zcTitle ref="zcTitle" :title="htmlTitle" left-text="" right-text="" @click-left="goBack"></zcTitle> -->
				<!-- 	   <view class="safe-height"></view> -->
				<view class="search">
					<view>
						<view class="searchNavigate" @click="searchStart()">
							<image src="https://qnsp.zcskjy.com/zc_images/home/icon-home-1.png" mode="aspectFit"
								class="search-icon"></image>
							<view class="input-placeholder">请输入关键词搜索</view>
						</view>
					</view>
					<image v-if="searchText.length > 0" src="https://qnsp.zcskjy.com/zc_images/images/false.png"
						mode="widthFix" @click="clearSearch()" class="clear-icon"></image>
					
						<messageCenter />
					<image src="https://qnsp.zcskjy.com/zc_images/home/icon-home-8.png" mode="widthFix"
						@click="customer(10001)" class="customer-icon"></image>
				</view>
				<!-- 	  <view class="search-seat"></view> -->
			</view>
			<scroll-view class="scrollto-view" :style="{ height: scrollHeight + 'rpx' }" :scroll-top="scrollTop"
				scroll-y="true" @scroll="noviceGuideNext">
				<view class="safe-height"></view>
				<!-- #ifdef APP-PLUS-->
				<!-- 				<view class="search-seat"  :style="{ height: contentScrollHeight, maxHeight: contentScrollHeight }"></view> -->
				<!-- #endif -->
				<!-- 显示区域 -->
				<!-- <view class="content-scroll liveScroll" :style="{ height: contentScrollHeight + 'px', maxHeight: contentScrollHeight + 'px' }"> -->
				<view class="content-scroll liveScroll">
					<view class="tab-live">
						<view class="list" v-for="(item, index) in navList" :key="index">
							<view class="list-live" v-if="tabCurrentIndex === index">
								<view class="list-live-content bannerList">
									<swiperImages :imgWidth="680" :imgHeight="260" @bannerJump="bannerJump"
										:defaultDannerList="defaultNoData" :bannerList="bannerList"
										:swiperConfigure="swiperConfigure"></swiperImages>
								</view>
							</view>
						</view>
						<view class="nav-curriculum">
							<view v-for="(item, index) in curriculumTypeList" :key="index" class="nav-item"
								:class="{ hot: index === 3 }" @click="tabcurriCulumType(index)">
								<image class="nav-curriculum-image" :src="item.image"></image>
								<!-- <view class="nav-curriculum-image"></view> -->
								<text class="videoLisText"> {{ item.text }}</text>
							</view>
						</view>
						<!-- 	大咖直播 -->
						<view class="uni-content">
							<view class="uni-play-history live-play-history">
								<view class="history-title">
									<text class="history-title-key">大咖直播</text>
									<text class="todayDate" @click="navigateUrl">更多</text>
								</view>
							</view>
							<view class="">
								<swiperLive @videoJump="videoJump" :defaultDannerList="defaultNoData"
									:bannerList="curriculumList" :swiperConfigure="liveConfigure"
									:liveDuration="liveDuration"></swiperLive>
							</view>
							<view>
								<view class="uni-play-history">
									<view class="history-title">
										<text class="history-title-key">精品课程</text>
										<text class="todayDate" @click="moreJump">更多</text>
									</view>
								</view>
								<subsection :subsectionIndex="videoCurrentIndex" :selectionList="selectionList"
									@changeBtnIndex="changeBtnIndex"></subsection>
								<!-- 显示区域 -->
								<view class="course-area" :class="{ programGuides: videoCurrentIndex === 1 }">
									<courseIntroduction :isshow="isCourseIntroduction" :list="courseIntroductionList"
										:listTitle="courseIntroductionTitle">
									</courseIntroduction>
									<!-- 限时秒杀 -->
									<seckill :isshow="iseckill" :list="seckillList" :listTitle="seckillTitle"
										v-if="false"></seckill>
									<!-- 精彩活动 -->
									<imageList class="wonderfulActivity" @clickNavigate="clickNavigate"
										:list="activityList" :listTitle="activityTitle"></imageList>
									<!--热门课程 -->
									<recommend :isshow="isRecommend" :list="recommendList" :listTitle="recommendTitle">
									</recommend>
									<scrollTool :swiperConfigure="scrollToolConfig" :toolsList="toolsList"></scrollTool>
									<ahomeview ref='homeList' loadMoreUrl='/ganhuo/recomvideolist/recomvideolist'
										title='精选视频' :requestUrl=videoUrlList eltmType='1'></ahomeview>

									<ahomeview ref='homeList' @itemClick="changeFindtab()"
										loadMoreUrl='/ganhuo/newslistpage/newslistpage' title='热门资讯'
										:requestUrl=newsUrlList eltmType='0'>
									</ahomeview>

									<imageList class="qualificationCertificate platform" @clickNavigate="clickNavigate"
										:list="qualificationsList" :listTitle="qualificationsTitle"></imageList>
								</view>
							</view>

						</view>
					</view>
				</view>
				<!-- 	  <view class="nomore-tip">
	  	<u-loadmore
		    :line="true"
	  		status="loading"
	  		loadingText="到底啦"
	  		color="#909399"
	  	></u-loadmore>
	  </view> -->
			</scroll-view>
			<pushModal :pushdata="pushMessage" @confirmPush="confirmPush"></pushModal>
			<!-- :style="'height:'+ 2000+'rpx'" -->
			<view :class="['msk']" style="z-index: 999999 !important;" @tap="onPopClose" v-if="showPopFlag">
				<view class="msk_box">
					<image :src="index_pop_wap_img" style='width:100%' mode="widthFix" @tap="onPopClick"></image>
					<view class="msk_box_info" style='right:16%;top:40%;'></view>
					<!-- <view class="btn_cancel" @tap="onPopClose">✕</view> -->
					<view class="btn_close" @tap="onPopClose">
						<image :src="btn_closeImg" style='width:70rpx;height: 70rpx;'></image>
					</view>
				</view>
			</view>
			<noviceGuide @noviceGuideNext="noviceGuideNext" />
			<!-- 		<u-modal
		  class="pushModal"
		  :content="pushMessage.content"
		  :show="showPushModal"
		  showCancelButton
		  cancelText="以后看看"
		  confirmText="前往查看"
		  @confirm="confirmPush(pushMessage)"
		  @cancel="() => (showPushModal= false)"
		></u-modal> -->
		</view>
</template>
<script>
	import swiperImages from '../../components/swiper-images/index.vue';
	import swiperLive from '../../components/swiper-images/liveScroll.vue';
	import quickcompview from '../../components/asecheader-view/quickcompview';
	import courseIntroduction from '../../components/home/courseIntroduction';
	import seckill from '../../components/home/seckill.vue';
	import imageList from '../../components/home/list.vue';
	import recommend from '../../components/home/recommend.vue';
	// import countdown from '../../components/home/countdown.vue';
	import guessYouLike from '@/components/guess-you-like.vue'
	import pushModal from '@/components/pushMessage/index.vue';
	import ahomeview from "../../components/add-new/ahome-view.vue"
	import scrollTool from "../tools/scrollTools.vue"
	import noviceGuide from '@/components/noviceGuide/index.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import subsection from '@/components/subsection/index.vue';
	import statusBar from '../../components/status-bar.vue';

	// import zcTitle from '../../components/zc-title/index.vue';

	// #ifdef APP-PLUS
	const jv = uni.requireNativePlugin("JG-JVerification");
	// #endif
	import messageCenter from '@/components/messageTip.vue';
	var intervalCt;
	export default {
		components: {
			swiperImages,
			swiperLive,
			quickcompview,
			courseIntroduction,
			seckill,
			imageList,
			recommend,
			subsection,
			statusBar,
			// zcTitle,
			guessYouLike,
			ahomeview,
			pushModal,
			scrollTool,
			noviceGuide,
			messageCenter
		},
		computed: {
			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum',
				'Lang', 'pushMessage', 'noviceGuide', 'noviceGuideIndex'
			]),
			...mapMutations(['updateNoviceGuide', 'updateNoviceGuideIndex']),
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
				showPushModal: false,
				pushdata: null,
				htmlTitle: '首页',
				showshop: false,
				shopList: [],
				isios: false,
				isNewMessaaage: true,
				tabCurrentIndex: 0,
				videoCurrentIndex: 1,
				tabcurriCulumIndex: 0,
				toastText: '',
				isToast: false,
				isUniToast: false,
				courseIntroductionTitle: '理财智库',
				seckillTitle: '限时秒杀',
				activityTitle: '精彩活动',
				qualificationsTitle: '平台资质',
				recommendTitle: '热门课程',
				isCourseIntroduction: false,
				iseckill: false,
				isQualifications: false,
				isRecommend: false,

				//首页弹窗用到的参数
				showPopFlag: false,
				index_pop_wap_img: '',
				index_pop_wap_url: '',

				videoUrlList: '',
				newsUrlList: '',
				// videoUrlList: this.Config.URL.newsUrl.videolist,
				// newsUrlList: this.Config.URL.newsUrl.newslist,

				btn_closeImg: `${getApp().globalData.qnUrl}/zc_images/images/btn_close.png`,
				defaultNoData: [{
					image: `${getApp().globalData.qnUrl}/zc_images/findPage/banner0.png`,
				}, ],
				bannerList: [], // 顶部轮播图列表
				navList: [{
						//state为切换内容
						//state: 0,
						text: '直播',
					},
					{
						//state为切换内容
						//state: 0,
						text: '干货',
					},
					// {
					//   //state为切换内容
					//   //state: 0,
					//   text: '工具',
					// },
				],
				curriculumTypeIndex: 0,
				curriculumTypeList: [{
						text: '7*24快讯',
						image: `${getApp().globalData.qnUrl}/zc_images/home/icon-tab1.png`,
					},
					{
						text: '热门资讯',
						image: `${getApp().globalData.qnUrl}/zc_images/home/icon-tab3.png`,
					},
					{
						text: '精选视频',
						image: `${getApp().globalData.qnUrl}/zc_images/home/icon-tab4.png`,
					},
					{
						text: '大咖秀',
						image: `${getApp().globalData.qnUrl}/zc_images/home/icon-tab6.png`,
					},
				],

				tabVideoList: [{
						text: '精品课',
					},
					{
						text: '训练营',
					},
					{
						text: '导师课',
					},
				],
				selectionList: [{
						name: '导师课',
						show_fg: 0,
					},
					{
						name: '训练营',
						show_fg: 0,
					},
					{
						name: '精品课',
						show_fg: 0,
					},
				],
				wonderfulPlayback: [],
				playbackReverse: [],
				playbackJust: [],
				/*
					直播状态：-1全部；0未开始；1直播中；2已结束
				*/
				playbackAreaList: [],
				describeList: [],
				courseIntroductionList: [
					// {
					// 	classSection: '30',
					// 	className: '寻找好基金',
					// 	classDescribe: '一门课带你建立基金投资体系',
					// 	days: '7',
					// 	price: '¥ 1899.10',
					// 	image:`${getApp().globalData.qnUrl}/zc_images/home/fundImage5.png`),
					// 	portrait:require(`${getApp().globalData.qnUrl}/zc_images/home/fundImage5.png`),
					// 	speaker:'杨如意',
					//    }
				],
				seckillList: [
					// 	{
					// 		className: '基金投资训练营',
					// 		classDescribe: '从入门到精通的基金实操课',
					// 		days: '7',
					// 		hour:'00',
					// 		minute:'14',
					// 		second:'32',
					// 		studentsNumber: '2.57',
					// 		price: '39.9',
					// priceSpike:'1.9',
					// 		image:`${getApp().globalData.qnUrl}/zc_images/home/fundImage3.png,
					//   },
				],
				activityList: [{
						image: `${getApp().globalData.qnUrl}/zc_images/home/activityimage6.png`,
					},
					// {
					//   image:`${getApp().globalData.qnUrl}/zc_images/home/activityimage3.png`),
					// },
					{
						image: `${getApp().globalData.qnUrl}/zc_images/home/activityimage7.png`,
					},
					// {
					//   image:`${getApp().globalData.qnUrl}/zc_images/home/activityimage1.png`,
					// },
				],
				qualificationsList: [{
						image: `${getApp().globalData.qnUrl}/zc_images/home/activityimage4.png`,
					},
					{
						image: `${getApp().globalData.qnUrl}/zc_images/home/activityimage5.png`,
					},
				],
				recommendList: [
					// {
					//   classSection: '30',
					//   className: '寻找好基金',
					//   classDescribe: '一门课学会价值投资',
					//   days: '7',
					//   studentsNumber: '2.57',
					//   price: '¥ 1899.10',
					//   image:`${getApp().globalData.qnUrl}/zc_images/home/activityimage8.png`),
					//   }
				],
				/*
				  今日热播
				  state:直播状态：-1全部；0预约/未开始；1直播中；2回放/已结束
				  */
				curriculumList: [],
				viewersNumber: '7.9w',
				todayDate: '5月11日',
				toyeardayDate: '2022-05-05',
				timer: null,
				timerGuideNext: null,
				contentScrollHeight: '',
				currentbrand: 0,
				brandList: [{
						text: '长乘学堂',
					},
					{
						text: '淳石集团',
					},
					{
						text: '变量中国',
					},
				],
				liveData: [],
				screenTimeStamp: '2022062113', //当前记录的时间戳
				swiperConfigure: {
					current: 0, //当前图片
					indicatorDots: false, //是否显示面板指示点
					autoplay: true, //是否自动切换
					interval: 4000, //自动切换时间间隔
					duration: 0, //滑动动画时长
					circular: true, //是否采用衔接滑动，即播放到末尾后重新回到开头
					previousMargin: '11px', //前边距
					nextMargin: '11px', //后边距
					isTitle: false,
				},
				liveConfigure: {
					current: 0, //当前图片
					freeMode: true,
					indicatorDots: false, //是否显示面板指示点
					autoplay: false, //是否自动切换
					interval: 4000, //自动切换时间间隔
					duration: 0, //滑动动画时长
					circular: true, //是否采用衔接滑动，即播放到末尾后重新回到开头
					previousMargin: '0px', //前边距
					nextMargin: '0px', //后边距
					isTitle: true,
				},
				scrollToolConfig: {
					current: 0, //当前图片											
					indicatorDots: false, //是否显示面板指示点
					autoplay: false, //是否自动切换
					interval: 4000, //自动切换时间间隔
					duration: 0, //滑动动画时长
					circular: true, //是否采用衔接滑动，即播放到末尾后重新回到开头
					previousMargin: '20px', //前边距
					nextMargin: '30px', //后边距
					isTitle: false,
				},
				liveDuration: 20000,
				searchText: '',
				intervalCt: '',
				days: '',
				hours: '',
				minutes: '',
				seconds: '',
				// #ifdef APP-PLUS
				jv,
				// #endif
				toolsList: [{
						title: [{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/tools-title1.png`,
							},
							{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/vipTitle.png`,
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
						isFree: false,
						remaining: null, //权限剩余到期
						numberBuyers: null, // 购买人数
					},
					{
						title: [{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/slb-textTitle.png`,
							},
							{
								image: `${getApp().globalData.qnUrl}/zc_images/findTools/sjb-title.png`,
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
						isFree: false,
						remaining: null, //权限剩余到期
						numberBuyers: null, // 购买人数
					},
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
				scrollTop: 0,
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
		watch: {
			courseIntroductionList: {
				handler(newName, oldName) {
					this.courseIntroductionList = newName;
					// // console.log('节目单seckillList -', newName, this.seckillList);
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			seckillList: {
				handler(newName, oldName) {
					this.seckillList = newName;
					// console.log('seckillList -', newName, this.seckillList);
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			activityList: {
				handler(newName, oldName) {
					this.activityList = newName;
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			recommendList: {
				handler(newName, oldName) {
					this.recommendList = newName;
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			qualificationsList: {
				handler(newName, oldName) {
					this.qualificationsList = newName;
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			toolsList: {
				handler(newName, oldName) {
					this.toolsList = newName;
					// // console.log('精彩回放-wonderfulPlayback -', newName, this.wonderfulPlayback);
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
			curriculumTypeList: {
				handler(newName, oldName) {
					this.curriculumTypeList = newName;
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
		},
		onLoad() {
			// uni.setStorage({
			// 	key: 'guideCache_state',
			// 	data: true,
			//   });

			console.info("圈子-大咖.1.5");
			// 'noviceGuide', 'noviceGuideIndex'
			//  ...mapMutations(['updateNoviceGuide','updateNoviceGuideIndex']),
			this.setData({
				videoUrlList: this.Config.URL.newsUrl.videolist,
				newsUrlList: this.Config.URL.newsUrl.newslist,
			});

			this.appPlatform();
			this.init();
			this.initPreLogin();

			//新手指引的时候  不展示首页开机活动弹窗
			if (!this.noviceGuide) {
				this.loadBrandsAndProduncts();
			}
		},

		onShow() {
			this.appPlatform();
			this.init();
			if (this.hasLogin) {
				this.getEUid()
			}
		},

		onUnload() {
			clearInterval(intervalCt);
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'setCartNum',
				'updatePushMessage'
			]),
			async init() {
				this.scrollTop = 0;
				this.$store.commit('updateNoviceGuideIndex', 0);
				// this.pushdata = _.cloneDeep(this.pushMessage);
				const that = this;
				await this.getTodayDate();
				await this.getDateWeek();
				// this.contentScroll();
				if (this.timer) {
					//注销定时器
					// console.log('注销定时器');
					clearTimeout(this.timer);
					this.timer = null;
				}
				if (this.timerGuideNext) {
					//注销定时器
					// console.log('注销定时器');
					clearTimeout(this.timerGuideNext);
					this.timerGuideNext = null;
				}

				await this.getSystem();
				const getList_data = {
					tag: '',
					riqi: '', // this.toyeardayDate,
					alive_state: -1,
					page_num: 1,
					page_size: 10,
					rank_type: 0,
				};
				this.getList(getList_data);
				let type_id;
				if (that.videoCurrentIndex == 0) {
					type_id = 2;
				} else if (that.videoCurrentIndex == 1) {
					type_id = 1;
				} else if (that.videoCurrentIndex == 2) {
					type_id = 0;
				}

				// 理财智库
				const getCourse_data = {
					/**
				* 平台商品分类   category_id: 固定 2025
				  教育商品类型   kind_id:  value = "订单种类(ENUM): 1201-实物 ; 1202-虚拟  ; 1203-电子卡券  ; 1204-外卖订单;1005-教育"
				  商品状态 product_state_id:   value = "商品状态:1001-正常;1002-下架仓库中;1003-待审核; 1000-违规禁售"˚
				*/
					page: 1,
					rows: 10,
					//type_id	课程类型(ENUM) : 0-精品课；1-训练营；2-导师课
					type_id: type_id,
					category_id: 2025,
					kind_id: 1205,
					product_state_id: 1001,
					source_type: 2312, //来源于H5端s
					source_from: 2320, // 来源于其它
					store_is_open: 1 // 店铺状态开启，0关闭

				};

				await this.getBanner();
				await this.getCourse(getCourse_data);
				// await this.getShopsList();
				await this.getGuessULike();
				await this.getSecKill();
			},
			appPlatform() {

				//盘中宝数据
				this.panzhongbaoShop();

				this.curriculumTypeList.pop();
				let curriculumTypeArr = this.curriculumTypeList;
				curriculumTypeArr.push({
					text: '工具',
					image: 'https://qnsp.zcskjy.com/zc_images/home/icon-tab2.png',
				});
				this.setData({
					curriculumTypeList: curriculumTypeArr
				});

				// // console.log('---index-curriculumTypeList--',this.curriculumTypeList);

			},
			goBack() {
				// #ifdef APP-PLUS
				uni.navigateBack({
					delta: 1, //返回层数，2则上上页
				})
				// #endif
				// #ifdef H5
				history.back();
				// #endif
			},


			onPopClose: function() {
				this.setData({
					showPopFlag: false
				})
			},
			//跳转活动页面
			onPopClick: function() {
				// this.index_pop_wap_url = 'https://shop.zcskjy.com/activity/h5/index.html';
				if (this.index_pop_wap_url.includes('http://') || this.index_pop_wap_url.includes('https://')) {
					const target = this.index_pop_wap_url;

					// uni.navigateTo({
					// 	url: `/my/webview/webview?url=${target}`,
					// });
					this.httpJump(target);

				} else {
					///activity/mid_autumn/mid_autumn
					this.$.gopage(this.index_pop_wap_url)
				}
			},

			loadBrandsAndProduncts() {
				var that = this;
				let params = {};
				that.$.request({
					url: that.Config.URL.index_app,
					data: params,
					success: function(data, status, msg, code) {
						// console.info('---data--index_app--', data);
						that.setData({
							// showPopFlag: true ,
							showPopFlag: data?.index_pop_wap_enable,
							index_pop_wap_img: data.index_pop_wap_img,
							// index_pop_wap_img:'/static/images/loading.gif',
							index_pop_wap_url: data?.index_pop_wap_url,
							// index_pop_wap_url:'/my/zc-coupon/zc-coupon-more',
						});
					}
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
							let slb = list.slb;
							let sjb = list.sjb;
							let lhb = list.lhb; // 狙击龙虎榜
							let fketf = list.fketf; // 风口
							let jgjj = list.jgjj; // 机构掘金
			
							that.assignTool(0, pzb);
							that.assignTool(1, lhb); // 狙击龙虎榜
							that.assignTool(3, slb); // 避雷宝
							that.assignTool(2, sjb); // 事件宝
							that.assignTool(5, fketf); // 风口ETF
							that.assignTool(6, jgjj); // 机构掘金

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
							// console.log('发现工具 :that.pageDetail', that.toolsList);
						}
					},
					fail: (res) => {
						// console.log('支付相关-fail', res);
					},
					complete: () => {},
				});
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
			getSystem() {
				let that = this;
				let port = uni.getSystemInfoSync().platform;
				switch (port) {
					case 'android':
						// console.log('运行Android上', port); //android
						break;
					case 'ios':
						that.isios = true;
						// console.log('运行iOS上', port); // ios
						break;
					default:
						// console.log('运行在开发者工具上'); //devtools
						break;
				}
			},
			moreJump() {
				uni.navigateTo({
					url: '/edu/course/course',
				});
			},

			/*
			 * 读取商品数据
			 */
			getShopsList() {
				const that = this;
				const params = {
					category_id: 2025,
					store_is_open: 1,
					page: 1,
					rows: 6,
					product_state_id: 1001,
					kind_id: 1001,
					curpage: 1,
				};


				that.$.request({
					url: that.Config.URL.edu.getProductList,
					data: params,
					dataType: 'json',
					success: function(data, status, msg, code) {

						if (status == 200) {

							data.product_base?.forEach(function(item, i, array) {

								that.shopList.push({
									classSection: item.chapter.chapterNum,
									className: item.brand_name,
									classDescribe: item.product_tips,
									price: item.item_unit_price,
									image: item.product_image,
									studentsNumber: item.buy_num,
									product_id: item.product_id,
									item_id: item.brand_id,
								});
							});
						}
					},
					fail: () => {
						that.showshop = true;
					},
					complete: () => {
						if (that.shopList.length == 0) {
							that.showshop = true;
						}
					},
				});
			},



			tabcurriCulumType(index) {
				this.tabcurriCulumIndex = index;

				switch (index) {
					case 0:
						uni.navigateTo({
							url: '/ganhuo/quicknewspage/quicknewspage'
						})
						break
					case 1:
						uni.navigateTo({
							url: '/ganhuo/newslistpage/newslistpage'
						})
						break
					case 2:
						uni.navigateTo({
							url: '/ganhuo/recomvideolist/recomvideolist'
						})
						break
					case 3:
						//盘中宝页面
						// uni.navigateTo({
						// 	url: '/findTools/panZhongbao/index?productId=' + this.toolsList[0].productId +
						// 		"&item_id=" + this.toolsList[0].itemId,
						// });
						uni.navigateTo({
							url: '/pages/tools/toolsIndex',
						});
						break
					default:
						break;
				}
			},
			//之前版本 小白课、训练营、导师课
			//   tabcurriCulumType(index) {
			//     this.tabcurriCulumIndex = index;

			//     // console.log('课程切换-index', index, index == 3);
			//     if (index == 3) {
			//       // console.log('课程切换-index-22', index, index == 3);
			//       uni.switchTab({
			//         url: '/pages/findPage/index',
			//         success(res) {
			//           // console.log('成功啦', res);
			//         },
			//         fail(err) {
			//           // console.log('失败啦', err);
			//         },
			//       });
			//     } else {
			// let btnCurrentIndex = index +1;
			// uni.setStorageSync('options',{btnCurrentIndex:btnCurrentIndex, path:'pages/index'})
			//       uni.switchTab({
			//         url: '/pages/course/study',
			//         success(res) {
			// 	// getApp().globalData.btnCurrentIndex=btnCurrentIndex;
			//           // console.log('成功啦', res);
			//         },
			//         fail(err) {
			//           // console.log('失败啦', err);
			//         },
			//       });
			//     }
			//   },

			changeBtnIndex(type) {
				this.videoCurrentIndex = type;
				// console.log('理财智库-index:', type);
				this.$FT.clearArr(this.courseIntroductionList);
				this.$FT.clearArr(this.describeList);
				let type_id;
				if (type == 0) {
					type_id = 2;
				} else if (type == 1) {
					type_id = 1;
				} else if (type == 2) {
					type_id = 0;
				}

				// 理财智库
				const data = {
					/**
				* 平台商品分类   category_id: 固定 2025
				  教育商品类型   kind_id:  value = "订单种类(ENUM): 1201-实物 ; 1202-虚拟  ; 1203-电子卡券  ; 1204-外卖订单;1005-教育"
				  商品状态 product_state_id:   value = "商品状态:1001-正常;1002-下架仓库中;1003-待审核; 1000-违规禁售"˚
				*/
					page: 1,
					rows: 10,
					//type_id	课程类型(ENUM) : 0-精品课；1-训练营；2-导师课
					type_id: type_id,
					category_id: 2025,
					kind_id: 1205,
					product_state_id: 1001,
					source_type: 2312, //来源于H5端s
					source_from: 2320, // 来源于其它
					store_is_open: 1 // 店铺状态开启，0关闭
				};
				this.getCourse(data);
			},
			tabVideoClick(index) {
				this.videoCurrentIndex = index;
				// console.log('理财智库-index:', index);
				this.$FT.clearArr(this.courseIntroductionList);
				// 理财智库
				const data = {
					/**
				* 平台商品分类   category_id: 固定 2025
				  教育商品类型   kind_id:  value = "订单种类(ENUM): 1201-实物 ; 1202-虚拟  ; 1203-电子卡券  ; 1204-外卖订单;1005-教育"
				  商品状态 product_state_id:   value = "商品状态:1001-正常;1002-下架仓库中;1003-待审核; 1000-违规禁售"˚
				*/
					page: 1,
					rows: 10,
					//type_id	课程类型(ENUM) : 0-精品课；1-训练营；2-导师课
					type_id: index,
					kind_id: 1205, // -- 虚拟产品（就是投教的课程商品）
					category_id: 2025,
					product_state_id: 1001,
					source_type: 2312, //来源于H5端s
					source_from: 2320, // 来源于其它
					store_is_open: 1 // 店铺状态开启，0关闭
				};
				this.getCourse(data);
			},
			searchStart: function() {
				uni.navigateTo({
					url: '/home/searchPage/search',
				});
			},
			message() {
				console.log('消息中心');
				uni.navigateTo({
					url: '/member/member/message',
				});
				// uni.navigateTo({
				// 	url: '/activity/618Activity/index',
				// });
			},
			customer(e) {
				let chat_url = this.$.sprintf('/im/chat/chat?uid=%s', e);
				uni.navigateTo({
					url: chat_url,
					success(res) {
						// console.log('客服跳转-成功啦', res);
					},
					fail(err) {
						// console.log('客服跳转-失败啦', err);
					},
				});
			},
			navigateUrl() {
				// uni.switchTab({
				// 	url: '/pages/findPage/index',
				// });
				uni.navigateTo({
					url: '/pages/tools/toolsIndex',
				});
			},
			clickNavigate(i, listTitle) {
				// console.log('clickNavigate', i, listTitle);
				if (listTitle == '精彩活动') {
					if (i == 0) {
						uni.navigateTo({
							url: '/my/zc-coupon/zc-coupon-more',
						});
					} else if (i == 1) {
						uni.navigateTo({
							url: '/home/shareEarnCommission',
						});
					}
				} else if (listTitle == '平台资质') {
					if (i == 0) {
						// 长乘资质
						// console.log('clickNavigate', '长乘资质');
						uni.navigateTo({
							url: '/home/ccxy_introduce',
						});
					} else if (i == 1) {
						// 明星师资：
						uni.navigateTo({
							url: '/home/teachers_introduce',
						});
					}
				}

				// 5.长乘资质：h5/pages/home/ccxy_introduce
				// 6.明星师资：h5/pages/home/teachers_introduce
			},
			getBanner() {
				/**
				 * 获取首页banner，返回参数中 page_code 这个list是banner数据,eltType
				 * 可全局搜索 that.Config.URL.index_app 查看使用
				 */
				const that = this;
				var params = {
					eltmType: 7,
				};
				that.$.request({
					url: that.Config.URL.index_app,
					data: params,
					dataType: 'json',
					loading: false,
					success: function(data, status, msg, code) {
						// // console.log('获取首页banner-res', data, status);
						// const data = res.data.data;
						const page_code = JSON.parse(data.page_code);
						// // console.log('获取首页banner-data', data);
						// // console.log('获取首页banner-page_code', page_code);
						if (status == 200) {
							uni.stopPullDownRefresh();
							that.bannerList = []
							page_code?.forEach(function(item, i, array) {
								if (parseInt(item.eltmType) != 3) return;
								item.eltm3.data?.forEach(function(item, i, array) {
									// console.info('获取首页-forEach-22222-page_code', item)
									that.bannerList.push({
										image: item.path,
										page_url: item.AppUrl,
										did: item.did,
										selectType: item.selectType,
										appId: item.AppId ? item.AppId : ''
									});
								});
							});

							// // console.log('获取首页banner:that.bannerList', that.bannerList);
						}
					},
					fail: () => {},
					complete: () => {},
				});
			},
			// 理财智库
			getCourse(parameter) {
				const that = this;
				that.$.request({
					url: that.Config.URL.edu.getProductList,
					method: 'get',
					data: parameter,
					dataType: 'json',
					loading: false,
					success: function(data, status, msg, code) {
						// // console.log('理财智库data, status', data, status);
						// const data = res.data.data;
						let tagList;
						// con sole.log('精品课程-getProductList-data', data);
						if (status == 200) {
							uni.stopPullDownRefresh();
							that.courseIntroductionList = []
							data.items?.forEach(function(item, i, array) {
								tagList = item.product_tag_names;
								// // console.log('精品课程：', item, i, array);
								if (i > 2) return;
								that.courseIntroductionList.push({
									classSection: item.chapter.chapterNum,
									className: item.product_name,
									classDescribe: item.product_tips,
									days: '30',
									price: item.item_unit_price,
									image: item.product_image,
									portrait: item.user_avatar,
									speaker: item.user_nickname,
									product_id: item.product_id,
									item_id: item.item_id,
									is_buy: item?.is_buy || false,
									tagList: tagList
								});
								if ((tagList ?? '') == '') return;
								// tagList.forEach(function(item, i, array) {
								// 	// // console.log('理财智库-product_tag_names.', item, i, array);
								// 	if (that.describeList.length > 2) return;
								// 	that.describeList.push(item);
								// });
							});
							// console.log('理财智库-banner:courseIntroductionList', that.courseIntroductionList);
							// that.setData({
							// 	responseData: data,
							// 	//banner数据
							// 	PageContent: JSON.parse(data.page_code),
							// });
						}
					},
					fail: () => {
						that.isCourseIntroduction = true;
					},
					complete: () => {
						if (that.courseIntroductionList.length == 0) {
							that.isCourseIntroduction = true;
						}
						// this.contentScroll();
					},
				});
			},
			// 限时秒杀
			getSecKill() {
				const that = this;
				const params = {
					activity_type_ids: '1103',
					kind_id: '1205',
				};
				that.$.request({
					url: that.Config.URL.edu.getProductList,
					method: 'get',
					data: params,
					dataType: 'json',
					loading: false,
					success: function(data, status, msg, code) {
						// console.log('限时秒杀:data, status', data, status);
						// const data = res.data.data;
						if (status == 200) {
							uni.stopPullDownRefresh();
							that.seckillList = []
							data.items?.forEach(function(item, i, array) {
								// // console.log('限时秒杀', item, i, array);
								// // console.log('限时秒杀-product_sale_time', item.product_sale_time);
								let days = '00',
									hours = '00',
									minutes = '00',
									seconds = '';
								let endtime = '',
									end_diff_time = '';
								let priceSpike = item.item_sale_price;
								// // console.log("activity_item_row", item.activity_item_row.activity_endtime)
								if (!item.activity_item_row) return;
								if (item.activity_item_row) {
									endtime = item?.activity_item_row?.activity_endtime;
									end_diff_time = new Date(endtime.replace(/-/g, '/')).getTime() -
										new Date().getTime();
									// // console.log('限时秒杀-end_diff_time-1', end_diff_time);
									const n = (end_diff_time -= 1e3);
									if (n < 0) {
										days = '00';
										(hours = '00'), (minutes = '00'), (seconds = '00');
									} else {
										days: that.$.doubleNum(Math.floor(n / 1e3 / 60 / 60 / 24)),
										(hours = that.$.doubleNum(Math.floor(n / 1e3 / 60 / 60))),
										(minutes = that.$.doubleNum(Math.floor((n / 1e3 / 60) % 60))),
										(seconds = that.$.doubleNum(Math.floor((n / 1e3) % 60)));
									}
								} else {
									days = '00';
									(hours = '00'), (minutes = '00'), (seconds = '00');
								}

								that.seckillList.push({
									className: item.product_name,
									classDescribe: item.product_tips,
									days: parseInt(days),
									hour: parseInt(hours),
									minute: parseInt(minutes),
									second: parseInt(seconds),
									studentsNumber: item.v_buy_course_num,
									price: item.item_unit_price,
									priceSpike: priceSpike, // 折扣价
									image: item.product_image,
									product_id: item.product_id,
									item_id: item.item_id,
									// studentsNumber: item?.buy_num,
								});
							});
						}
					},
					fail: () => {
						that.iseckill = true;
					},
					complete: () => {
						if (that.seckillList.length == 0) {
							that.iseckill = true;
						}
					},
				});
			},
			// 猜你喜欢
			getGuessULike() {
				const that = this;
				const params = {
					category_id: 2025,
					store_is_open: 1,
					page: 1,
					rows: 5,
					product_state_id: 1001,
					kind_id: 1205,
					curpage: 1,
				};
				that.$.request({
					url: that.Config.URL.edu.getProductList,
					data: params,
					dataType: 'json',
					loading: false,
					success: function(data, status, msg, code) {
						// // console.log('猜你喜欢ss:data, status', data, status);
						// const data = res.data.data;
						// // console.log('猜你喜欢-data', data);
						if (status == 200) {
							uni.stopPullDownRefresh();
							that.recommendList = []
							data.items?.forEach(function(item, i, array) {
								// // console.log('猜你喜欢-item', item, i, array);
								if (i > 1) return;
								that.recommendList.push({
									classSection: item.chapter.chapterNum,
									className: item.product_name,
									classDescribe: item.product_tips,
									price: item.item_unit_price,
									image: item.item_image_other,
									studentsNumber: item.buy_num,
									product_id: item.product_id,
									item_id: item.item_id,
									// speaker:item.user_nickname ,
								});
							});
							// console.log('猜你喜欢:that.recommendList', that.recommendList);
						}
					},
					fail: () => {
						that.isRecommend = true;
						// console.log("猜你喜欢-是否显示暂无数据-fail", that.isRecommend)
					},
					complete: () => {
						if (that.recommendList.length == 0) {
							that.isRecommend = true;
							// console.log("猜你喜欢-是否显示暂无数据complete", that.isRecommend)
						}
					},
				});
			},
			clearSearch() {
				const _this = this;
				this.searchText = '';
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
						// // console.log('getList-res', result);
						if (res.statusCode == 200) {
							uni.stopPullDownRefresh();
							that.curriculumList = []
							result?.forEach(function(item, i, array) {
								// // console.log('result-forEach', item, i, array);
								let lastStartTime = '';
								if (i != 0) {
									lastStartTime = array[i - 1].alive_start_at;
								}

								const startTime = item.alive_start_at;
								const PlaybackLiveTime = startTime.substring(5, 7) + '月' + startTime
									.substring(8, 10) + '日 ';
								let userName = '';
								if (item.guest_list.length != 0) {
									// // console.log('prototype-guest_list:', Object.prototype.toString.call(Array.from(item.guest_list)));
									userName = item.guest_list
										.map((item) => {
											return item.user_name;
										})
										.toString();
								}
								let view_num = item.view_num;
								if (type == 'all' || type == 'curriculumList') {

									if (i < 5) {
										if (item.alive_state == 0) {
											// 预约
											that.curriculumList.push({
												state: item.alive_state, // 直播状态
												number: PlaybackLiveTime + startTime.substring(
													11, 16),
												image: item.img_url,
												isordered: false,
												startTime: startTime.substring(11, 16),
												page_url: item.page_url,
												speaker: userName,
												title: item.title,
											});
										} else if (item.alive_state == 1) {
											// 直播
											that.curriculumList.push({
												state: item.alive_state, // 直播状态
												number: view_num + '观看',
												image: item.img_url,
												startTime: startTime.substring(11, 16),
												page_url: item.page_url,
												speaker: userName,
												title: item.title,
											});
										} else {
											that.curriculumList.push({
												state: item.alive_state,
												number: PlaybackLiveTime + view_num + '观看',
												image: item.img_url,
												startTime: startTime.substring(11, 16),
												page_url: item.page_url,
												speaker: userName,
												title: item.title,
											});
										}
									}
								}
							});
							// console.log('bannerList', that.bannerList);
							// console.log('---curriculumList----', that.curriculumList);
						}
					},
					fail: () => {
						// console.log('---bannerList--fail--');
					},
					complete: () => {
						// this.contentScroll();
					},
				});
			},
			bannerJump(item, state) {
				console.info("大图跳转-bannerJump-item", item, state);
				// console.log("大图跳转-bannerJump-state", state);
				let selectType = item?.selectType || "9";
				// console.log("大图跳转-bannerJump-selectType", selectType, selectType == "1");
				let url = item?.page_url || '';
				let did = parseInt(item.did);

				// console.log("大图跳转-618Activity", url.includes('618Activity'));
				if (selectType == "1") {
					uni.navigateTo({
						url: '/edu/course/class-detail?product_id=' + did + '&item_id=' + did,
					});
				} else if (selectType == "7" && item.appId) {

					let wxOriginId = item.appId ? item.appId : 'gh_77e0924a5066';
					let wxMiniPath = item.page_url ? item.page_url : 'pages/index/fangindex';
					this.pushMiniApp(wxMiniPath, wxOriginId);

				} else if (selectType == "9") {
					if (url.includes('http://') || url.includes('https://')) {
						this.httpJump(url)
					} else {
						this.$.gopage(url)
						// this.$.gopage('/activity/mid_autumn/mid_autumn')
					}
				}
			},

			//跳转微信小程序
			pushMiniApp(pathUrl, wxOriginId) {
				// console.log('---log---', pathUrl);
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

			videoJump(url, state) {
				// uni.navigateTo({
				// 	url: `/pages/findPage/webview?url=${url}`
				// })
				let zc_notitle = this.$FT.getUrlKey('zc_notitle', url)
				// console.log('videoJump-zc_notitle', zc_notitle);
				// console.log('videoJump-url, state', url, state);
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
			httpJump(url) {
				let zc_notitle = this.$FT.getUrlKey('zc_notitle', url)
				// #ifdef H5
				window.location.href = url;
				// #endif
				//#ifdef APP-PLUS
				if (zc_notitle == 0) {
					uni.navigateTo({
						url: `/my/webview/webview?url=${url}`,
					});
				} else {
					uni.navigateTo({
						url: `/my/webview/webview_live?url=${url}`,
					});
				}
				// #endif
			},
			webview_live(urls) {
				// console.log('openWebview-hasLogin', this.hasLogin);
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
				console.log('getEUid=e_uid=', e_uid)
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						console.log('getEUid=xeLogin=', data)
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
				// console.log('openWebview-hasLogin', this.hasLogin);
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
				console.log('getEUid=e_uid=', e_uid)
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						console.log('getEUid=xeLogin=', data)
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							console.log('getEUid=target=', target)
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
			initPreLogin() {
				// #ifdef APP-PLUS  
				let self = this;
				self.jv.isInitSuccess(result => {
					// console.log("jauth isInitSuccess=", JSON.stringify(result))
					if (result.enable) {
						self.jv.preLogin(5000, result => {
							// console.log("jauth preLogin=", JSON.stringify(result))
						})
					}
				})
				// #endif  
			},
			contentScroll() {
				// let h= document.querySelector('.uni-tabNav').getBoundingClientRect().height;
				//    this.contentScrollHeight = document.body.clientHeight -h + 'px';
				this.contentScrollHeight = document.querySelector('.content-scroll').getBoundingClientRect().height + 'px';
			},
			changeTab(e) {
				this.tabCurrentIndex = e.target.current;
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			tabBrandClick(index, text) {
				// console.log('tabBrandClick', text);
				this.currentbrand = index;
				const data = {
					tag: text,
					riqi: '2022-05-05', // this.toyeardayDate,
					alive_state: -1,
					page_num: 1,
					page_size: 10,
				};
				this.getList(data);
			},

			getTodayDate() {
				let nowDate = new Date();
				let date = {
					year: nowDate.getFullYear(),
					month: nowDate.getMonth() + 1,
					date: nowDate.getDate(),
					hours: nowDate.getHours(),
					minutes: nowDate.getMinutes(),
					seconds: nowDate.getSeconds(),
					screenTimeStamp: ''
				};

				if (parseInt(date.month) < 10) {
					date.month = '0' + date.month;
				}
				if (parseInt(date.date) < 10) {
					date.date = '0' + date.date;
				}
				this.todayDate = date.month + '月' + date.date + '日';
				this.toyeardayDate = date.year + '-' + date.month + '-' + date.date;
				this.screenTimeStamp = date.year + '' + date.month + '' + date.date + '' + date.hours + '' + date.minutes;
				this.addVersion(this.curriculumTypeList, this.screenTimeStamp)
				// this.todayDate = date.getMonth() + date.getDate();
				// console.log('todayDate-screenTimeStamp:', this.toyeardayDate, this.screenTimeStamp, date);
			},
			addVersion(ary, screenTimeStamp) {
				let ver = "?r=" + screenTimeStamp;
				// let res =ary.map(function (item,index,ary ) {
				// 	// console.log("addVersion-ary- item.image", item.image + ver);
				// 	return item.image + ver;
				// })
				ary?.forEach(function(item, i, array) {
					// console.log('addVersion-forEach', item, i, array);
					item.image = item.image + ver;
					return item.image + ver;
				});
				// console.log("addVersion-ary", ary);
				// console.log("addVersion-screenTimeStamp:", screenTimeStamp);

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
					// // console.log('label', label);
					return {
						value,
						date,
						label,
					};
				});
				dateWeek[0].label = '今天';
				dateWeek[1].label = '明天';
				this.programOptions = dateWeek;
				// console.log('dateWeek：', this.programOptions, this.programOptions[0].label);
			},
			bookCourse(index, url) {
				window.open(url, '_blank');
				// this.showToast('预约成功，您将收到开播提醒');
				// this.playbackAreaList[index].isordered = true;
				// // console.log('bookCourse', this.playbackAreaList[index].isordered);
			},
			orderToday(i, url) {
				window.open(url, '_blank');
				// this.showToast('预约成功，您将收到开播提醒');
				// this.curriculumList[i].isordered = true;
			},
			confirmPush(data) {
				// let articleId = payload?.articleId || '';
				// console.log("confirmPush:", data)
				this.updatePushMessage(data);
			},
			changeFindtab() {
				console.info('-----changeFindtab---');
				let that = this;
				uni.switchTab({
					url: '/pages/findPage/index',
					success(res) {

						setTimeout(function() {
							that.notice.postNotificationName("changeFindView")
							// that.notice.postNotificationName("changeLearnView")
						}, 100);
						// console.log('成功啦1111', res);
					},
					fail(err) {
						// console.log('失败啦---1----', err);
					},
				});
			},
			showToast(title) {
				this.toastText = title;
				this.isToast = true;
				this.timer = setTimeout(() => {
					this.isToast = false;
				}, 1000);
				// console.log('showToast', this.$refs.uniToast, title);
			},
			scrollViewScroll(index) {

			},
			uniScrollTo(firstDM, currDm, toPx, index) {
				const that = this;
				firstDM.boundingClientRect(data => {
					currDm.boundingClientRect(res => {
						console.info("uniScrollTo--------------------pageScrollTo-top-res", res);
						console.info("uniScrollTo--------------------pageScrollTo-top-data", data);
						that.scrollTop = res.top - data.top - toPx;
						that.$store.commit('updateNoviceGuideIndex', index);
					}).exec()
				}).exec()
			},
			getEUid() {
				var uid = this.$.getStorageSync('uid').toString();
				var eUrl = this.Config.getEuid
				console.log('getEUid=uid=', uid)
				uni.request({
					method: 'POST',
					url: eUrl,
					data: {
						"uid": uid,
					},
					success: function(data, status) {
						console.log('getEUid=uid=', data)
						if (data.data.result?.userId)
							uni.setStorage({
								key: 'e_uid',
								data: data.data.result.userId
							});
					}
				})
			},

			noviceGuideNext(index) {
				// console.info("pageScrollTo-index",index);
				const that = this;
				let firstDM = uni.createSelectorQuery().in(this).select('.scrollto-view');
				this.timerGuideNext = setTimeout(() => {
					if (index == 1) {
						let wonderfulActivity = uni.createSelectorQuery().in(this).select('.wonderfulActivity');
						let wfpx = that.$FT.rpxToPx(450);
						that.uniScrollTo(firstDM, wonderfulActivity, wfpx, index)
					} else if (index == 2) {
						let qualificationCertificate = uni.createSelectorQuery().in(this).select(
							'.qualificationCertificate');
						let qcpx = that.$FT.rpxToPx(-3000);
						that.uniScrollTo(firstDM, qualificationCertificate, qcpx, index)
					}
				}, 200);


			}
		},
	};
</script>

<style lang="scss">
	@import '@/styles/findPage/discoveryPage.scss';
	@import '@/styles/home/home.scss';

	.platform {
		padding-bottom: 30upx;
	}

	::v-deep .u-line {
		height: 40upx;

		.u-line-react {
			height: 40upx !important;
		}
	}

	// ::v-deep .banner-wrap{
	// 	.banner-swiper{
	// 		.banner-swiper-item{
	// 			.banner-swiper-img{
	// 				width: 680upx;
	// 				height: 230upx;
	// 			}

	// 		}
	// 		.banner-swiper-img.active{
	// 			height: 260upx;
	// 		}
	// 	}
	// }
</style>

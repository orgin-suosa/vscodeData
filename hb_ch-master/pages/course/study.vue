<template>
	<view class="page" style="background-color:#fff;">
		<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
		<!-- 顶部 -->
		<view class="top">
			<view class="section_1" style="margin-left:10rpx;margin-right:10rpx;position: relative;top: 0rpx;">
				<view class="left_tab_bar"
					style="display: flex;flex-direction: row;align-items: center;justify-content: center;">
					<u-tabs name="name" :activeStyle="{ color: '#333333', fontSize: '44rpx', fontWeight: 'Regular'}"
						:inactiveStyle="{ color: '#878787', fontSize: '36rpx', fontWeight:'Regular'}" :duration="0"
						ref="uTabs" lineWidth="10" lineHeight="5" active-color="#333333" inactive-color="#878787"
						lineColor="#f43d3e" :list="index_tab" :current="currentT" @change="changeTabIndx"
						:is-scroll="true" itemStyle="margin-bottom:1px;">
					</u-tabs>
					<image style="width: 40rpx;height: 40rpx;position: absolute;right: 28rpx;"
						src="../../static/images/seach.png" @click="goCsSearch" v-if="showCsCourse"></image>
				</view>
			</view>
			<!-- <u-icon class='service' name="https://qnsp.zcskjy.com/zc_images/edu_pic/kefu.png" size="21" @click="gochat(10001)"></u-icon> -->
		</view>
		<block v-if="tabindex==1">

			<view class="lecturer">
				<!-- u-tabs -->
				<view class="section_1" style="margin-bottom: 25rpx;">
					<view class="left_tab_bar">
						<u-tabs name="name" style="margin-left: -7rpx"
							:activeStyle="{ color: '#f43d3e', fontWeight: 'bold',fontSize:'34rpx' }" ref="uTabs"
							height="50" lineHeight="4" :inactiveStyle="{ color: '#333333',fontSize:'32rpx' }"
							lineColor="#f43d3e" :list="categoryList" :current="currentF" @change="changeCategory"
							:is-scroll="true">
						</u-tabs>
					</view>
					<view
						style="width:750rpx;margin-left: -30rpx;margin-top:-2rpx;margin-bottom:10rpx;border-bottom:1rpx solid #F0F0F0;">
					</view>
				</view>
				<view class="flex-col group_2">
					<!-- 分段器 -->
					<u-subsection class="layout-row" mode="button" :list="sub_selection_list" :bold="true"
						activeColor="#333333" inactiveColor="#666666" fontSize="28rpx" bgColor="#F6F7FA"
						:current="btnCurrentIndex" @change="changeBtnIndex"></u-subsection>
					<!-- 课程列表 -->
					<block v-if="!coursePageNull && showPage">
						<courseIntroduction @click="goCourseDetail(item.product_id,item.item_id)" class="courseList"
							:isshow="isCourseIntroduction" :list="courseList"></courseIntroduction>
					</block>
					<block v-else>
						<view class="nocontent" @click="goSearch">
							<image src="https://qnsp.zcskjy.com/zc_images/edu_pic/edu_19.png"
								style="width: 320rpx;height:240rpx;"></image>
							<view
								style="font-size: 26rpx;font-family: PingFangSC-Regular, PingFang SC;padding: 30rpx 0">
								暂无课程</view>
						</view>
					</block>
				</view>
			</view>

			<view class="lecturer">
				<view
					style="height: 50rpx;width:100%;display: flex;justify-content: space-between;align-items: center;padding: 0 10rpx;">
					<text
						style="font-size:36rpx;font-weight: 550;height:50rpx;line-height: 50rpx;color:#333333;font-family: PingFangSC-Medium, PingFang SC;">大咖讲师</text>
		<!-- 			<text
						style="font-size:24rpx;font-weight: 400;color:#999;line-height:33rpx;height:33rpx;padding-right: 10rpx"
						@click="goTeachers(1)">更多</text> -->
				</view>
				<!-- 讲师列表 -->
				<view class="scroll-view_H">
				<!-- 	<navigator :url="'/edu/lecturer/detail?userId=' + (item.user_id)" v-for="(item,i) in lectureList" -->
					<navigator :url="'/community/community/userspace?uid=' + (item.teacherId)" v-for="(item,i) in lectureList"
						:key="i" hover-class="none" class="scroll-view-item_H"
						style="width:238rpx;height:280rpx;margin-top:22rpx;background-color: #F8F7FF;border-radius: 10rpx;">
						<view class="m-store-item-image">
			<!-- 				<image :src="item.user_avatar" mode="aspectFill" -->
							   <image :src="item.portraitUrl" mode="aspectFill"
								style="width: 100rpx;height:100rpx;border-radius: 100px;">
						</view>
						<view
							style="overflow-x:hidden!important;height:37rpx;width:242rpx;font-size:26rpx;color: #000000;font-family: PingFangSC-Medium, PingFang SC;font-weight: bold;line-height: 37rpx;margin-top:-138rpx;">
					<!-- 		{{item.teacherName}} -->{{item.teacherName}}
						</view>

						<view style="font-size:22rpx;color:#666;">
							<!-- 	v-html="item.lecturer_introduce" -->
							<label
								style="color:#999;display: block;color: rgb(153, 153, 153);white-space: normal;height: 70rpx;line-height: 34rpx;display: block;overflow: hidden; text-overflow: ellipsis;margin-left:18rpx;margin-right:17rpx;margin-top:14rpx;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;"
								v-html="item.teacherDesc">
							</label>
						</view>
					</navigator>
				</view>
			</view>
		</block>

		<block v-if="tabindex==2">
			<view class="" @click="goTarget()" v-if="learnTarget.set_target == 0">
				<image class="target-img" src="https://qnsp.zcskjy.com/zc_images%2Fedu_pic%2Ftarget.png"
					mode="aspectFill"></image>
			</view>
			<view v-else class="learn-target-box">
				<view style="text-align: left!important;font-size: 12px;color: #333333;padding-left: 50rpx">
					每日多学一点，财富多涨一点
				</view>
				<view class="time" @click="goTarget()">
					<view>
						<view>
							<text class="number">{{learnTarget.day_learn_time}}</text>
							<text>/{{learnTarget.target_learn_time}}分钟</text>
						</view>
						<view>今日任务 > </view>
					</view>
					<view>
						<view>
							<text class="number">{{learnTarget.month_learn_time}}</text>
							<text>分钟</text>
						</view>
						<view>本周学习</view>
					</view>
					<view>
						<view>
							<text class="number">{{learnTarget.sum_learn_time}}</text>
							<text>天</text>
						</view>
						<view style="color: #8E5223">累计学习</view>
					</view>
				</view>
			</view>
			<!-- 在学 -->
			<view class="lecturer">
				<label style="font-size: 36rpx;margin-left: 10rpx; font-weight: 550;">我的课程</label>
				<view class="flex-col group_2">
					<!-- 分段器 -->
					<u-subsection style="margin-bottom:30rpx;" class="layout-row" mode="button"
						:list="sub_study_selection_list" :bold="true" activeColor="#333333" inactiveColor="#666666"
						fontSize="28rpx" bgColor="#F6F7FA" :current="btnzxSubSectionIndex" @change="changeZxBtnIndex">
					</u-subsection>
					<!-- 我的课程 -->
					<block v-if="buyCourseList.length!= 0">
						<view class="flex-col group_14">
							<view class="list-item flex-row" :key="index" v-for="(item ,index) in buyCourseList"
								style="height:245rpx;padding-bottom:0;padding-top:0;">
								<view class="items-box" @click="goCourseDetail(item.product_id,item.item_id)">
									<image :src="item.product_image" :lazy-load="true"
										style="width:180rpx;height:220rpx;" class="image_11" mode="aspectFill">
									</image>
									<view class="list-item-course-info">
										<view style="display: flex;flex-direction: column;margin-top:-22rpx;">
											<text class="font"
												style="font-size:36rpx;height: 25px; display: block; line-height: 32px; text-overflow: ellipsis;  overflow: hidden;">{{ item.product_name }}</text>
											<text class="font"
												style="line-height:1;font-size: 24rpx;font-family: PingFangSC-Regular, PingFang SC;color: #666666; line-height: 30rpx;height: 24rpx; overflow: hidden;">{{ item.product_tips }}</text>
											<view class="font"
												style="display: flex;flex-direction: row;font-size: 24rpx;color: #666666;margin-top:0rpx;">

												<u-icon v-if="item.course_file_type == 0" labelSize="23rpx"
													labelColor="rgb(102, 102, 102)" size="12"
													name="https://qnsp.zcskjy.com/zc_images/edu_pic/zxvideo.png"
													style="float:left;margin-top:-4rpx;margin-right:10rpx;"></u-icon>
												<text style="font-size: 24rpx;padding-right: 10rpx"
													v-else-if="item.course_file_type == 1"
													class="iconfont icon-a-ziyuan11"></text>
												<text style="font-size: 24rpx;padding-right: 10rpx" v-else
													class="iconfont icon-yinpin"></text>
												<view
													style="width:170rpx;font-family: PingFangSC-Regular, PingFang SC;float: left;font-size: 24rpx;color: #666666;"
													v-if="item.chapterNum">
													{{item.chapterNum+"节课时"}}
												</view>
												<view
													style="width:170rpx;float: left;font-family: PingFangSC-Regular, PingFang SC;font-size: 24rpx;color: #666666;"
													v-else>
													{{"0节课时"}}
												</view>
											</view>
											<view
												style="display: flex;flex-direction: row;justify-content: space-between;align-items: center;margin-top:-24rpx;">
												<view style="padding-left: 4px;width: 50%">
													<view
														style="font-size:24rpx;font-family: PingFangSC-Regular, PingFang SC;color: #666666;display: inline-block;">
														{{"已学 "+item.course_schedule+"%"}}
													</view>
													<view style="color: #F43D3E;width: 100%">
														<progress :percent="item.course_schedule" stroke-width="5"
															color="#ff7a61" />
													</view>
												</view>
												<view>
													<!-- <a class="items-box-a-bnt" style="font-size: x-small;"	@click="goCourseDetail(item.product_id,item.item_id)">{{__('继续学习')}}</a> -->
													<span class="apply"
														style="width: 120rpx;height: 50rpx;margin-top: 38rpx;background: linear-gradient(90deg, #FF6161 0%, #FF9661 100%);border-radius: 25rpx;margin-left: 0; font-size: x-small; display: block;float:right">{{__('继续学习')}}</span>
												</view>

											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>
					<block v-else>
						<view class="nocontent" @click="goSearch">
							<image src="https://qnsp.zcskjy.com/zc_images/edu_pic/edu_19.png"
								style="width: 320rpx;height:240rpx;">
								<view
									style="font-size: 26rpx;font-family: PingFangSC-Regular, PingFang SC;padding: 40rpx 0">
									暂无课程</view>
						</view>
					</block>
				</view>
			</view>
		</block>

		<block v-if="tabindex==3">

			<view
				style="padding:10rpx 37rpx;background-color: #ffffff;z-index: 999 !important;position: relative;top: 10rpx;">

				<subsection :subsectionIndex="tradeCurrentIndex" :selectionList="trade_selection_list"
					@changeBtnIndex="changeTradeIndex"></subsection>

			</view>
			<view class="content-scroll program-scroll">

				<view style="background-color:#000000;">

					<!-- 	<atablistview key="quick" v-if="tradeCurrentIndex == 0"
						:style="notchScreen ? 'position: absolute;top: 150rpx;padding-top: 25rpx;' : 'position: absolute;top: 100rpx;padding-top: 25rpx;'"
						ref="newsList" loadMoreUrl="/ganhuo/newslistpage/newslistpage" eltmType="2"
						:tabbarItemArr="quickTabTitleArr" :requestUrl="newsUrlList">
						</atablistview> -->

					<CsVideoList key="productvideo" v-if="tradeCurrentIndex == 0"
						:style="notchScreen ? 'position: absolute;top: 180rpx;padding-top: 15rpx;' : h5Version ? 'position: absolute;top: 100rpx;padding-top: 25rpx;': 'position: absolute;top: 130rpx;padding-top: 15rpx;'"
						ref="productList" eltmType="1" encodeUrl :tabbarItemArr="productTabTitleArr" :mobile="mobile"
						:requestUrl="requestUrl">
					</CsVideoList>

					<CsVideoList key="skillvideo" v-if="tradeCurrentIndex == 1"
						:style="notchScreen ? 'position: absolute;top: 180rpx;padding-top: 15rpx;' : h5Version ? 'position: absolute;top: 100rpx;padding-top: 25rpx;':'position: absolute;top: 130rpx;padding-top: 15rpx;'"
						ref="skillList" eltmType="1" encodeUrl :tabbarItemArr="skillTabTitleArr" :mobile="mobile"
						:requestUrl="requestUrl">
					</CsVideoList>

				</view>
			</view>
		</block>

		<view class="youlike" v-if="tabindex!=3">
			<view
				style="font-size:36rpx; width:148rpx;height:50rpx;margin-left: 15rpx; font-weight: 550;color:#333;line-height: 50rpx;">
				热门课程</view>
			<!-- 猜你喜欢数据 -->
			<view class="like-product" v-for="(item,i) in guessULike" :key="i" @click="goAppaly(item.item_id)">
				<view>
					<image :src="item.item_image_other" :lazy-load="true" class="like-img" mode="aspectFill"></image>
					<view style="padding: 0  15rpx 30rpx 15rpx;">
						<view class="like-product-name"
							style="font-size: 34rpx;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #333333;">
							<label for="">{{item.product_name}}</label>
						</view>
						<view
							style="display: flex;justify-content: space-between;align-items: center;flex-direction: row;padding: 0 10rpx">
							<view style="display: flex;align-items: center;flex-direction: row;row;">
								<u-icon name="https://qnsp.zcskjy.com/zc_images/edu_pic/detail_video.png" size="23rpx">
								</u-icon>
								<span v-if="item.chapter"
									style="font-size: 24rpx;color:#666666;font-family: PingFangSC-Regular, PingFang SC;padding: 0 10rpx">{{item.chapter.chapterNum}}节课时</span>
								<span v-else
									style="font-size: 24rpx;color:#666666;font-family: PingFangSC-Regular, PingFang SC;padding: 0 10rpx;">0节课时</span>
							</view>
							<span
								style="font-size: 24rpx;color:#666666;font-family: PingFangSC-Regular, PingFang SC;">{{item.v_buy_course_num}}人已学</span>
						</view>
						<view style="line-height: 50rpx;height: 50rpx;">
							<label style="color:red;font-size:12px;display: block;float:left"
								v-if="item.course_free !== 1">￥</label>
							<span v-if="item.course_free !== 1"
								style="font-size:16px;color:red;font-weight: bold;;display: block;float:left">{{item.product_unit_price}}</span>
							<span v-else
								style="font-size:16px;color:red;font-weight: bold;;display: block;float:left">{{"免费"}}</span>
							<span class="apply"
								style="width: 120rpx;height: 50rpx;background: linear-gradient(90deg, #FF6161 0%, #FF9661 100%);border-radius: 25rpx;margin-left: 0; font-size: x-small; display: block;float:right">立即报名</span>
						</view>
					</view>
				</view>
			</view>
		</view>
		<noviceGuide />
	</view>

</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import PayBox from "../../components/pay-box";
	import statusBar from '../../components/status-bar.vue';
	import courseIntroduction from '../../components/home/courseIntroduction';
	import noviceGuide from '@/components/noviceGuide/index.vue';
	import subsection from '@/components/subsection/index.vue';
	import atablistview from '@/components/atab-view/atablist-view.vue';
	import CsVideoList from '@/components/cs-video-list/cs-video-list.vue'

	export default {
		components: {
			PayBox,
			statusBar,
			courseIntroduction,
			noviceGuide,
			subsection,
			atablistview,
			CsVideoList
		},
		data() {
			return {
				tabindex: 1,
				coursePageNull: 0,
				showPage: false,
				showCsCourse: false,
				buyCourseList: [],
				guessULike: [],
				treeDataF: [], // 一级分类数据
				treeDataS: [], // 二级分类数据
				currentF: 0, // 一级选中项
				currentS: 0, // 二级选中项

				currentT: 0, //顶部选中
				tradeCurrentIndex: 0,
				trade_selection_list: [{
						name: '产品培训',
						show_fg: 0
					},
					{
						name: '技能提升',
						show_fg: 0
					}
				],
				sub_selection_list: [{
						'name': '全部',
						'show_fg': 0
					},
					{
						'name': '导师课',
						'show_fg': 1
					},
					{
						'name': '训练营',
						'show_fg': 1
					},
					{
						'name': '精品课',
						'show_fg': 0
					}
				],
				sub_study_selection_list: [{
						'name': '学习中',
						'show_fg': 0
					},
					{
						'name': '已学完',
						'show_fg': 1
					},
					{
						'name': '已购买',
						'show_fg': 0
					}
				],
				btnCurrentIndex: 0,
				checkCourseType: -1,
				btnzxCurrentIndex: 1002,
				btnzxSubSectionIndex: 0,
				show: false, // 筛选弹框显隐
				leftSelect: 0, // 左侧分类选中项
				flag: false, // 进入页面第一次旗帜
				categoryIndex: 0,
				checkCategoryId: 0,
				categoryList: [],
				courseList: [],
				lectureList: [],
				index_p: 0,
				options: {},
				index_tab: [{
						children: [],
						course_category_id1: 1,
						name: "课程"
					},
					{
						children: [],
						course_category_id1: 2,
						name: "在学"
					},
					// {
					// 	children: [],
					// 	course_category_id: 3,
					// 	course_category_name: "培训"
					// }
				],
				course_category_id1: 0,
				learnTarget: {
					set_target: 0,
					target_learn_time: '',
					month_learn_time: '',
					sum_learn_time: '',
					day_learn_time: '',
				},
				PageNav: {
					window: {
						"navigationBarBackgroundColor": "#ffffff",
						"navigationBarTextStyle": "black",
						"navigationBarTitleText": "",
						"backgroundColor": "#f8f8f8",
						"backgroundTextStyle": "dark"
					}
				},
				//刘海屏
				notchScreen: false,
				h5Version: false, //H5版本
				hasOnShow: false,
				newsUrlList: '',
				isCourseIntroduction: false,
				productTabTitleArr: [],
				skillTabTitleArr: [],
				mobile: '',
				requestUrl: ''
			}
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options = {}) {
			this.init(options)
			this.options = options;
			// this.repleaceParamName1(this.index_tab);
			this.notice.addNotification("changeLearnView", this.changeLearnView, this);
			this.setData({
				requestUrl: this.Config.getCsVideoList
			});

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

			// #ifdef H5
			this.setData({
				h5Version: true,
			});
			// #endif 

		},
		// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
		onReady() {},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow() {
			if (this.hasLogin) {
				this.mobile = this.userInfo.user_mobile.includes('+86') ? this.userInfo.user_mobile.slice(3) : this
					.userInfo.user_mobile;
			}
			// this.getCsTabData();
			this.getParameter();
			this.$store.commit('updateNoviceGuideIndex', 4);
			if (this.hasOnShow) {
				this.init(this.options)
			}
		},
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {},
		watch: {
			btnCurrentIndex: {
				handler(newName, oldName) {
					this.btnCurrentIndex = newName;
					console.log('pages/course/study-学习-课程切换-btnCurrentIndex', newName, this.btnCurrentIndex);
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
		},
		computed: {
			...mapState(['Config', 'userInfo', 'notice', 'hasLogin']),
			rightText() {
				return (item) => {
					if (item.item_unit_price === '0' || item.item_unit_price == null) {
						return '免费'
					} else {
						return '￥' + item.item_unit_price / 100
					}
				}
			}
		},
		methods: {
			getParameter() {
				let option = uni.getStorageSync('options');
				console.log("传参：", option); // {id: 123, val: reLaunch}
				if (option.path == 'pages/index') {
					this.btnCurrentIndex = option.btnCurrentIndex;
					this.setData({
						btnCurrentIndex: option.btnCurrentIndex,
					});
					this.changeBtnIndex(this.btnCurrentIndex)
					console.log("this.btnCurrentIndex", this.btnCurrentIndex)
				}
			},
			getPrice(price) {
				if (price) {
					return price.toFixed(2)
				}
				return 0
			},
			getLearnTime() {
				var that = this;
				that.$.request({
					url: that.Config.URL.edu.getLearnTime,
					loading: false,
					success: function(data, status, msg, code) {
						if (status === 200 && data) {
							that.learnTarget = data
						}
						that.hasOnShow = true
					}
				});
			},
			// 页面数据初始化函数
			init(options) {
				this.getCategories()
				this.getBuyCourseList(this.btnzxCurrentIndex, 1, 20)
				this.getLecturerList()
				this.getGuessULikeList(1, 2)
				this.getLearnTime()
			},
			// 请求分类数据
			getCategories() {
				var that = this;
				that.$.request({
					url: that.Config.URL.edu.getCategoryList,
					loading: false,
					data: {
						course_category_pid: 0
					},
					success: function(data, status, msg, code) {
						if (status === 200 && data) {
							that.repleaceParamName(data);
							if (that.checkCategoryId === 0) {
								that.checkCategoryId = data[0].course_category_id;
							}
							that.showCourseView = true;
							that.getProductList(that.checkCategoryId, 1, 10);
						}
					}
				});
			},

			//tags替换参数名称
			repleaceParamName(data) {
				const res = data;
				this.categoryList = res.map(function(item) {
					return {
						course_category_id: item.course_category_id,
						name: item.course_category_name
					};
				});
			},

			//tags替换参数名称
			repleaceParamName1(data) {
				const res1 = data;
				this.index_tab = res1.map(function(item) {
					return {
						course_category_id1: item.course_category_id,
						name: item.course_category_name
					};
				});
			},

			// getLecturerList() {
			// 	var that = this;
			// 	that.$.request({
			// 		url: that.Config.URL.edu.getLectureList,

			// 		loading: false,
			// 		success: function(data, status) {
			// 			if (status === 200 && data) {
			// 				that.lectureList = data.items
			// 			}
						
			// 		}
			// 	});
			// },
			getLecturerList() {
				var that = this;
				uni.request({
					url: that.Config.teacherListDate,
					methods:'GET',
					loading: false,
					success: function(res) {
						console.log("getLecturerList",res)
						that.lectureList  = res?.data?.result;
						
					}
				});
			},
			goCsSearch() {
				uni.navigateTo({
					url: '/edu/cs-search/cs-search'
				})
			},

			changeBtnIndex(type) {
				var Lst = [];
				if (type == 0) {
					Lst = [{
							'name': '全部',
							'show_fg': 0
						},
						{
							'name': '导师课',
							'show_fg': 1
						},
						{
							'name': '训练营',
							'show_fg': 1
						},
						{
							'name': '精品课',
							'show_fg': 0
						}
					]
				}

				if (type == 1) {
					Lst = [{
							'name': '全部',
							'show_fg': 0
						},
						{
							'name': '导师课',
							'show_fg': 0
						},
						{
							'name': '训练营',
							'show_fg': 1
						},
						{
							'name': '精品课',
							'show_fg': 0
						}
					]
				}

				if (type == 2) {
					Lst = [{
							'name': '全部',
							'show_fg': 1
						},
						{
							'name': '导师课',
							'show_fg': 0
						},
						{
							'name': '训练营',
							'show_fg': 0
						},
						{
							'name': '精品课',
							'show_fg': 0
						}
					]
				}

				if (type == 3) {
					Lst = [{
							'name': '全部',
							'show_fg': 1
						},
						{
							'name': '导师课',
							'show_fg': 1
						},
						{
							'name': '训练营',
							'show_fg': 0
						},
						{
							'name': '精品课',
							'show_fg': 0
						}
					]
				}
				this.sub_selection_list = Lst;
				this.btnCurrentIndex = type;
				uni.setStorageSync('options', {
					btnCurrentIndex: type,
					path: 'pages/index'
				});
				this.checkCourseType = type - 1;
				this.getProductList(this.checkCategoryId, 1, 20);
				this.$FT.clearArr(this.courseList);
			},

			changeTradeIndex(type) {
				this.tradeCurrentIndex = type;
			},

			changeZxBtnIndex(index) {
				var that = this;
				this.btnzxSubSectionIndex = index;
				var Lst = [];
				if (index == 0) {
					Lst = [{
							'name': '学习中',
							'show_fg': 0
						},
						{
							'name': '已学完',
							'show_fg': 1
						},
						{
							'name': '已购买',
							'show_fg': 0
						}
					]
				}

				if (index == 1) {
					Lst = [{
							'name': '学习中',
							'show_fg': 0
						},
						{
							'name': '已学完',
							'show_fg': 0
						},
						{
							'name': '已购买',
							'show_fg': 0
						}
					]
				}

				if (index == 2) {
					Lst = [{
							'name': '学习中',
							'show_fg': 1
						},
						{
							'name': '已学完',
							'show_fg': 0
						},
						{
							'name': '已购买',
							'show_fg': 0
						}
					]
				}
				this.sub_study_selection_list = Lst;

				if (index === 0) {
					index = 1002
				}
				if (index === 1) {
					index = 1003
				}
				if (index === 2) {
					index = 1001
				}
				that.btnzxCurrentIndex = index;

				this.getBuyCourseList(index, 1, 20)
			},

			getBuyCourseList(learnState, pageNum, pageSize) {
				var that = this
				that.$.request({
					url: that.Config.URL.edu.getBuyCourseList,
					loading: false,
					data: {
						learnState: learnState,
						pageNum: pageNum,
						pageSize: pageSize,
					},
					success: function(data, status) {
						if (status === 200 && data) {
							that.buyCourseList = data.items
						}
					}
				});
			},

			onNavigationBarButtonTap() {
				uni.navigateTo({
					url: '/edu/course/search'
				});
			},

			// 切换一级分类
			currentFChange(item) {
				var that = this;
				this.currentF = item.index;
				that.setTreeDataS(item.index)
			},

			changeTabIndx(item) {
				var that = this;
				this.currentT = item.index;
				this.tabindex = this.currentT + 1
			},

			changeLearnView() {
				this.setData({
					currentT: 1,
					tabindex: 2,
				});
			},

			// 一级切换时更换二级列表
			setTreeDataS(index, sId) {
				var that = this;
				that.treeDataS = [{
					name: '全部',
					id: ''
				}]
				that.currentS = sId ? sId : ''
				if (that.treeDataF[index] && that.treeDataF[index].children) {
					that.treeDataS = [{
						name: '全部',
						id: ''
					}, ...that.treeDataF[index].children]
				}
				that.currentSChange(that.currentS)
			},
			// 推荐课程详情
			openCourse(id) {
				uni.vk.navigateTo('/uni_modules/uce-course/pages/detail/class-detail?_id=' + id, false);
			},
			// 筛选完成
			screen(fIndex, sId) {
				var that = this;
				that.show = false
				this.$nextTick(() => {
					that.currentF = fIndex
					that.setTreeDataS(fIndex, sId)
				})
			},


			changeCategory(category) {
				var that = this;
				that.checkCategoryId = category.course_category_id;
				that.getProductList(that.checkCategoryId, 1, 20);
			},
			getProductList(course_category_id, pageNum, pageSize) {
				var that = this
				let type = that.checkCourseType === -1 ? null : that.checkCourseType
				//type_id 0-精品课；1-训练营；2-导师课
				let newType = null
				if (type == 0) {
					newType = 2
				} else if (type == 2) {
					newType = 0
				} else if (type == 1) {
					newType = 1
				} else {

				}
				that.$.request({
					url: that.Config.URL.edu.getProductList,
					loading: false,
					data: {
						type_id: newType,
						category_id: 2025,
						course_category_id: course_category_id,
						store_is_open: 1,
						page: pageNum,
						rows: 50,
						product_state_id: 1001,
						kind_id: 1205,
					},
					success: function(data, status) {
						let tagList;
						if (status === 200) {
							// console.info('getProductList',data.items)
							that.courseList = []
							// that.courseList = data.items
							data.items.forEach(function(item, i, array) {
								tagList = item.product_tag_names;
								// if (i > 2) return;
								// that.courseList =[]
								that.courseList.push({
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
							});
							if (data.items.length <= 0) {
								that.coursePageNull = 1;
							} else {
								that.coursePageNull = 0;
							}
							that.showPage = true;
						}
					}
				});
			},

			getGuessULikeList(pageNum, pageSize) {
				let that = this
				that.$.request({
					url: that.Config.URL.edu.getProductList,
					loading: false,
					data: {
						category_id: 2025,
						store_is_open: 1,
						page: pageNum,
						rows: pageSize,
						product_state_id: 1001,
						kind_id: 1205,
						curpage: 1,
					},
					success: function(data, status) {
						if (status === 200) {
							that.guessULike = data.items
						}
					}
				});
			},
			getCourseList(course_category_id, pageNum, pageSize) {
				let that = this
				let type = that.checkCourseType === -1 ? null : that.checkCourseType
				that.$.request({
					url: that.Config.URL.edu.getCourseList,
					loading: false,
					data: {
						course_type: type,
						course_category_id: course_category_id,
						pageNum: pageNum,
						pageSize: pageSize,
					},
					success: function(data, status, msg, code) {
						if (status === 200) {
							that.courseList = data.items
							if (that.courseList && that.courseList.length > 0) {
								for (var i = 0; i < that.courseList.length; i++) {
									let product_tag_names = that.courseList[i].product_tag_names
									if (product_tag_names) {
										that.courseList[i].product_tag_names = product_tag_names.split(",")
									}
								}
							}
						}
					}
				});
			},
			goCourseDetail(product_id, item_id) {
				let again_url = this.$.sprintf("/edu/course/class-detail?product_id=%d&item_id=%d", product_id, item_id);
				uni.navigateTo({
					url: again_url
				})
			},
			gochat(e) {
				let chat_url = this.$.sprintf("/im/chat/chat?uid=%s", e);
				uni.navigateTo({
					url: chat_url
				})
			},
			goagain(e) {
				let again_url = this.$.sprintf("/edu/course/class-detail?product_id=%s", e);
				uni.navigateTo({
					url: again_url
				})
			},
			goAppaly(e) {
				let appaly_url = this.$.sprintf("/edu/course/class-detail?item_id=%s", e);
				uni.navigateTo({
					url: appaly_url
				})
			},
			goTeachers() {
				let teacher_url = this.$.sprintf("/edu/lecturer/list");
				uni.navigateTo({
					url: teacher_url
				})
			},
			goSearch() {
				let teacher_url = this.$.sprintf("/edu/course/course");
				uni.navigateTo({
					url: teacher_url
				})
			},
			goTarget() {
				if (this.userInfo.user_id) {
					let target_url = this.$.sprintf("/edu/course/learn/target");
					uni.navigateTo({
						url: target_url
					})
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}

			},
			getCsTabData() {
				console.log('this.getCsTabData=', '1')
				let that = this
				if (!that.hasLogin) {
					that.isShowCsCourse(false)
					return
				}
				console.log('this.userInfo=', that.mobile)
				uni.request({
					url: that.Config.getCsTab,
					data: {
						mobile: that.mobile,
					},
					success: (res) => {
						let {
							result
						} = res.data
						if (result && result.isInWhiteList) {
							let {
								peiXun,
								tiSheng
							} = result
							that.setData({
								productTabTitleArr: peiXun.length > 0 ? peiXun : [],
								skillTabTitleArr: tiSheng.length > 0 ? tiSheng : []
							})
							that.isShowCsCourse(true)
						} else {
							that.isShowCsCourse(false)
						}
					}
				})
			},

			isShowCsCourse(val) {
				let that = this;
				that.showCsCourse = val
				if (val) {
					let newCourse = {
						children: [],
						course_category_id1: 3,
						name: "培训"
					};
					let newTab = that.index_tab;
					newTab[2] = newCourse
					that.setData({
						index_tab: newTab,
					})
				} else {
					that.setData({
						index_tab: [{
								children: [],
								course_category_id1: 1,
								name: "课程"
							},
							{
								children: [],
								course_category_id1: 2,
								name: "在学"
							},
						],
						currentT: 0,
						tabindex: 1
					})
				}
			}
		},
		onUnload() {
			uni.$off('courseReload');
			this.notice.removeNotification("changeLearnView", this);
		},
	}
</script>

<style lang="scss" scoped>
	@import '@/components/audio/font/iconfont.css';

	.nocontent {
		color: #999;
		text-align: center;
		width: 650rpx;
		margin-left: 20rpx;
		font-size: 26rpx;
		margin-top: 60rpx;
		margin-bottom: 60rpx;
	}

	/deep/ .uni-progress-bar {
		border-radius: 10rpx !important;
		overflow: hidden;
	}

	/deep/ .uni-progress-inner-bar {
		border-radius: 10rpx !important;
		overflow: hidden;
		background: linear-gradient(287deg, #739DFF 0%, #4385FF 100%) linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
	}

	::v-deep .u-subsection {
		.u-line {
			.u-line-react {
				height: 40rpx !important;
			}
		}
	}

	page {
		background-color: #FFFFFF;
		font-family: PingFangSC-Semibold, PingFang SC;
		height: 100%;
		overflow-y: scroll;
	}

	.fix {
		padding-top: 5rpx !important;
	}

	.fix1 {
		height: 40rpx !important;
		width: 58rpx !important;
	}

	.again {
		width: 80px;
		/* border:1px solid #FF7F61; */
		font-size: 14px;
		position: relative;
		top: -17px;
		left: 155px;
		height: 30px;
		display: inline-block;
		text-align: center;
		background: linear-gradient(to right, #FF7F61, #ffaf5e);
		color: #fff;
		line-height: 30px;
		border-radius: 30px;
	}

	.strip {
		/* 父元素相对定位 */
		position: relative;
		width: 240rpx;
		height: 12rpx;
		color: rgba(80, 80, 80, 1);
		background-color: #F5F5F5;
		border-radius: 7rpx;
		font-size: 28rpx;
		line-height: 150%;
		text-align: center;
	}

	.blue {
		height: 12rpx;
		color: rgba(80, 80, 80, 1);
		background-color: #FF7F61;
		border-radius: 7rpx;
		font-size: 28rpx;
		line-height: 150%;
		text-align: center;
	}

	.layout-row {
		margin-left: 17rpx;
		margin-right: 17rpx;
		width: 95%;
	}

	.proImg {
		width: 84rpx;
		height: 76rpx;
		/* 子元素绝对定位   */
		position: absolute;
		/* 定位方向：属性值 */
		top: -30rpx
	}

	.target-img {
		height: 200rpx;
		width: 690rpx;
		border-radius: 10rpx;
		position: relative;
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin-top: 20rpx;
	}

	.apply {
		height: 50rpx;
		line-height: 50rpx;
		margin-left: 90rpx;
		border: 1px solid linear-gradient(to right, #F44344, #FF9460);
		width: 120rpx;
		display: inline-block;
		font-size: 24rpx;
		text-align: center;
		background: linear-gradient(to right, #F44344, #FF9460);
		color: #fff;
		border-radius: 25px;
	}

	.youlike {
		/* width: 0rpx; */
		/* height:380rpx; */
		margin-top: 30rpx;
		font-size: 40rpx;
		float: left;
		overflow: hidden;
		width: 96%;
		margin-left: 4%;
	}

	.like-product-name {
		font-size: 22px;
		line-height: 31px;
		height: 31px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: normal;
	}

	.like-product {
		font-size: 16px;
		float: left;
		width: 45%;
		/* height:380rpx; */
		text-align: left;
		box-shadow: 0px 4px 0px #F4F4F5;
		border-radius: 10rpx;
		margin-top: 27rpx;
		margin-right: 5%;
		margin-bottom: 30rpx;
		box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.07);
	}

	.like-img {
		height: 180rpx;
		width: 100%;
		border-radius: 6rpx 6rpx 0px 0px;
	}

	.category-boder {
		width: 40rpx;
		height: 10rpx;
		background-color: #F43D3E;
		position: relative;
		left: 26px;
		top: 9px;
		border-radius: 5rpx;
	}

	.category-boder4 {
		width: 15px;
		height: 5px;
		background-color: red;
		border: 1px solide red;
		position: relative;
		left: 44px;
		top: -3px;
		border-radius: 2px;
	}

	.active-category {
		color: red !important;
	}

	.scroll-view-item_H {
		width: 195rpx;
		height: 80rpx;
		margin-left: 10rpx;
		margin-top: 20rpx;
		background-color: #F8F7FF;
		line-height: 0 !important;
	}

	.teacher {
		justify-items: center;
		position: relative;
		display: flex;
		flex-direction: row;
	}

	.list-item {
		padding: 30rpx 10rpx;
	}

	.left-text-wrapper {
		font-size: 12px;
		float: left;
		margin-right: 10px;
		color: #FFA312;
		padding: 0 20rpx;
		border: 1px solid #FFF5ED;
		text-align: center;
		background-color: #FFF3EF;
		border-radius: 2px;
	}

	.image_11 {
		object-fit: cover;
		height: 220rpx;
		width: 180rpx;
		float: left;
		border-radius: 10rpx;
	}

	.text_11 {
		padding: 15px;
	}

	uni-page-body {
		background-color: #fff !important;
	}

	.scroll-view_H {
		width: 100%;
		display: flex;
		overflow-x: scroll;
	}

	.m-store-item-name label {
		width: 50rpx;
		height: 42rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: #333;
		line-height: 37rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.m-store-item-image {
		width: 100rpx;
		height: 100rpx;
		background: #F8F7FF;
		padding: 24rpx 70rpx 156rpx 70rpx;
	}

	.scroll-view-item {
		height: 300rpx;
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
	}

	.scroll-view-item_H {
		display: inline-block;
		/* height: 260rpx; */
		line-height: 300rpx;
		text-align: center;
		font-size: 36rpx;
		margin-right: 20rpx;
	}

	.course {
		font-size: 28rpx;
		padding-left: 29rpx;
		padding-top: 5rpx;
		width: 90rpx;
		float: left;
		padding-bottom: 15rpx;
		height: 62rpx;
	}

	.more {
		font-size: 24rpx;
		color: #999;
	}

	.service {
		float: right;
		margin-top: -60rpx;
		margin-right: 30rpx;
	}

	.lecturer {
		font-size: 40rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;

		.courseList {
			padding: 25rpx 0;
		}
	}

	.learning {
		height: 62rpx;
		line-height: 40rpx;
		font-size: 28rpx;
		padding-left: 40rpx;
		padding-top: 24rpx;
		padding-bottom: 24rpx;
		width: 90rpx;
		float: left;
	}

	.select {
		font-size: 44rpx;
	}

	.no-select {
		padding-top: 30rpx;
	}

	.border1 {
		width: 20rpx;
		height: 10rpx;
		background-color: red;
		border-radius: 5rpx;
		position: absolute;
		top: 80rpx;
		left: 70rpx;
		/*  #ifdef APP-PLUS  */
		top: 132rpx;
		/*  #endif  */
		/*  #ifdef APP-PLUS  */
		left: 65rpx;
		/*  #endif  */
	}

	.border2 {
		width: 20rpx;
		height: 10rpx;
		background-color: red;
		border-radius: 5rpx;
		position: absolute;
		top: 77rpx;
		left: 162rpx;
		/*  #ifdef APP-PLUS  */
		top: 132rpx;
		/*  #endif  */
		/*  #ifdef APP-PLUS  */
		left: 158rpx;
		/*  #endif  */
	}

	.top {
		border-bottom: 1rpx solid #eee;
		width: 749rpx;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #fff;
		/* margin-bottom:20rpx; */
	}

	.layout-row {
		margin-left: 5rpx;
		margin-right: 5rpx;
		width: 100%;
	}

	.demo-layout {
		height: 40px;
		width: 84px;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
	}

	.bg-purple {
		background: #F7F8FB;
	}

	.bg-purple-light {
		background: #F7F8FB;
	}

	.bg-purple-dark {
		background: #F7F8FB;
	}

	.layout-btn {
		margin-top: 3rpx;
		height: 74rpx;
		background: #F7F8FB;
	}

	.layout-btn-active {
		margin-top: 3rpx;
		height: 74rpx;
		background-color: rgb(255, 255, 255);
	}

	.group {
		flex: 1 1 auto;
		overflow-y: auto;

		.section_1 {
			background-color: rgb(255, 255, 255);
			box-shadow: 0px 6rpx 12rpx 0px rgba(0, 0, 0, 0.1);
			position: relative;
			height: 80rpx;

			.left_tab_bar {
				width: 88%;
				height: 56rpx;
			}

			.text_1 {
				margin: 7rpx 0 6rpx;
				color: rgb(51, 51, 51);
				font-size: 28rpx;
				white-space: nowrap;
			}

			.text_2 {
				margin: 7rpx 0 6rpx 50rpx;
				color: rgb(102, 102, 102);
				font-size: 28rpx;
				line-height: 34rpx;
				white-space: nowrap;
			}

			.text_3 {
				margin: 7rpx 0 6rpx 50rpx;
				color: rgb(102, 102, 102);
				font-size: 28rpx;
				line-height: 34rpx;
				white-space: nowrap;
			}

			.group_1 {
				margin-left: 50rpx;
				padding: 7rpx 0 6rpx;
				width: 100rpx;
				position: absolute;
				right: 20rpx;
				top: 0;
				background-image: linear-gradient(90deg,
						rgba(255, 255, 255, 0) 0%,
						rgba(255, 255, 255, 0) 3.05%,
						rgba(255, 255, 255, 0.98) 15.1%,
						rgb(255, 255, 255) 100%,
						rgb(255, 255, 255) 100%);
				z-index: 999;

				.image_1 {
					margin-left: 20rpx;
					width: 36rpx;
					height: 36rpx;
				}
			}
		}

		.group_2 {
			padding-top: 10rpx;

			.second_tabs {
				display: flex;
				padding: 20 20rpx;

				.second_tabs_item {
					color: #999999;
					font-size: 24rpx;
					line-height: 42rpx;
					white-space: nowrap;
					border-radius: 21rpx;
					width: 118rpx;
					height: 42rpx;
					text-align: center;
				}

				.select_item {
					background-color: rgb(255, 150, 12);
					color: rgb(255, 255, 255);
				}
			}
		}
	}

	.pop_bg {
		padding: 30rpx;
		box-sizing: border-box;
		height: 100%;

		.title {
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
		}

		.main {
			height: calc(100% - 50rpx);
			margin-top: 10rpx;
			overflow: hidden;
			display: flex;

			.left_scroll {
				height: 100%;
				width: 30%;

				.u-tab-item {
					height: 110rpx;
					background: #f6f6f6;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
					color: #444;
					font-weight: 400;
					line-height: 1;
				}

				.u-tab-item-active {
					position: relative;
					color: #000;
					font-size: 26rpx;
					font-weight: 600;
					background-color: #FFFFFF;
				}

				.u-tab-item-active::before {
					content: "";
					position: absolute;
					border-left: 4px solid #FF960C;
					height: 32rpx;
					left: 0;
					top: 39rpx;
				}
			}

			.right_scroll {
				width: 70%;
				padding: 30rpx 0 0 20rpx;

				.page-view {
					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;

					.thumb-box {
						background: #F5F5F5;
						border-radius: 6px;
						width: 47%;
						padding: 21rpx 0;
						text-align: center;
						margin-bottom: 30rpx;
					}
				}
			}
		}
	}

	.list-item-course-info {
		padding-left: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.list-item-course-info .font {
		padding: 8rpx;
	}

	.course-item-buy-state {
		font-size: small;
		padding: 6rpx 25rpx;
		border-radius: 50rpx;
		color: #FFFFFF;
		background: -webkit-linear-gradient(to right, #FF6161, #FF9661);
		/* Safari 5.1-6.0 */
		background: -o-linear-gradient(to right, #FF6161, #FF9661);
		/* Opera 11.1-12.0 */
		background: -moz-linear-gradient(to right, #FF6161, #FF9661);
		/* Firefox 3.6-15 */
		background: linear-gradient(to right, #FF6161, #FF9661);
	}

	.items-box-a-bnt {
		padding: 10rpx 20rpx;
		border-radius: 50rpx;
		color: #FFFFFF;
		background: -webkit-linear-gradient(to right, #FF6161, #FF9661);
		/* Safari 5.1-6.0 */
		background: -o-linear-gradient(to right, #FF6161, #FF9661);
		/* Opera 11.1-12.0 */
		background: -moz-linear-gradient(to right, #FF6161, #FF9661);
		/* Firefox 3.6-15 */
		background: linear-gradient(to right, #FF6161, #FF9661);
	}

	.learn-target-box {
		align-items: center;
		background: #FFF2F0 linear-gradient(270deg, #F8D6D2 0%, #F6E1BE 100%);
		border-radius: 10rpx;
		margin: 30rpx 25rpx 10rpx;
		padding: 10rpx;
	}

	.learn-target-box .time {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		font-size: 12px;
		color: #333333;
	}

	.learn-target-box .number {
		font-size: 22px;
	}
</style>

<template>
	<view>
		<view class="context_box">
			<view class="course-tabs" style="margin: 0 30rpx;">
				<view class="flex-col" v-if="tapindex === 2">
					<view class="u-btns1">
						<u-button type="default" :class="btns1Index === 0 ? 'u-btns1-1-active' : 'u-btns1-1'" text="精彩回放" @click="changeBtnStyle1(0)">
							<image src="https://qnsp.zcskjy.com/zc_images/edu_pic/video.png" class="icon_image"><text style="margin-left: 30rpx;">精彩回放</text></image>
						</u-button>
						<u-button type="default" :class="btns1Index === 1 ? 'u-btns1-1-active' : 'u-btns1-1'" text="节目单" @click="changeBtnStyle1(1)">
							<image src="https://qnsp.zcskjy.com/zc_images/edu_pic/videolist.png" class="icon_image"><text style="margin-left: 30rpx;">节目单</text></image>
						</u-button>	
					</view>
					
					<view class="playback-area programGuides">
						<view class="playback-area-list" v-if="btns1Index === 0 && wonderfulPlayback.length >0">
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
						<view class="playback-area-list" v-else-if="btns1Index === 1 &&playbackAreaList.length >0">
							<view class="" v-for="(item, index) in playbackAreaList" :key="index">
								<view class="playback-area-time" v-if="!item.isDitto">{{ item.time }}</view>
								<view class="playback-area-content" @click="videoJump(item.pageUrl, item.state)">
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
										</view>
									</view>
								</view>
							</view>
						</view>
						<view v-else>
							<noData></noData>
						</view>
					</view>
				
				</view>
				<view class="flex-col"  v-else>
					<z-paging ref="paging" :empty-view-img-style="{'width':'300rpx','height':'300rpx','margin-top':'50%','transform':'translateY(-50%)'}" empty-view-text="暂无课程" :empty-view-title-style="{'margin-top':'-40%','transform':'translateY(-50%)'}" empty-view-img="https://qnsp.zcskjy.com/zc_images/edu_pic/edu_19.png" :refresher-enabled="false" :use-page-scroll="true" v-model="courseList" :empty-view-fixed="false"
							@query="getCourseList" :fixed="false" :hide-loading-more-when-no-more-by-limit="5">
					<view class="course_list" v-for="item in courseList">
						<view class="flex-col-content" @click="jumpDetail(item)">
							<image class="col_image" :src="item.product_image"></image>
							<view class="col_text1">{{item.product_name}}</view>
							<view class="col_text2" style="height:38rpx;line-height: 38rpx;overflow: hidden;">{{item.product_tips}}</view>
							<view style="margin-bottom: 10rpx; height: 10rpx;">
							<view v-for="it in item.product_tag_names" class="tags_text">
								<span class="tag-text">{{it}}</span>
							</view>
							</view>
							<br/>
							<u-button class="col_text5" type="default" shape="circle" size="small">
								<u-icon :label="item.courseItems" labelSize="16rpx" labelColor="#5B2111" size="12" name="https://qnsp.zcskjy.com/zc_images/edu_pic/video_tag.png"></u-icon>
								<view v-if="item.chapter">
									<text style="margin-left: 10rpx;font-size: 16rpx;white-space: nowrap;">{{item.chapter.chapterNum}}节课时</text>
								</view>
							</u-button>
							<view class="col_textBottom" style="display: flex;">
								<view class="col_text4">
									<view class="course-item-buy-state" style="" v-if="item.is_buy">
										<text style="font-weight: 500;font: 24rpx;">{{__("去学习")}}</text>
									</view>
									<view v-else>
										<text v-if="item.product_unit_price != 0" style="font-size: 40rpx;"><span style="font-size: 20rpx;">
										￥</span>{{getPrice(item.product_unit_price)}}</text>
										<text v-else>免费</text>
									</view>
								</view>
								
								<view class="col_text3">{{item.buy_num}}人已学习</view>
							</view>
								
						</view>
					</view>
					</z-paging>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import noData from '@/components/no-data/index.vue';
	
	import {
			mapState,
			mapMutations
		} from 'vuex'
	
		var that; // 当前页面对象
		export default {
			name:"live",
			props: {
			  tapindex: {
			    type: Number,
			    default() {
			      return 3;
			    },
			  },
			  options: {
			    type: Object,
			    default() {
			      return {};
			    },
			  },
			  
			},
			data() {
				return {
					userInfoHeight: 210,
					isShowAllContent:false,
					txt_content: '',
					lecturerId: 0,
					tempContent: '',
					show: false,
					indexPicker: 1,
					array: ['昨天', '今天', '明天'],
					btns1Index: 0,
					btns2Index: 0,
					liveBackVideo: 0,
					lecturerDetail: '',
					subText: '+订阅',
					list: [{
						name: '直播'
					}, {
						name: '课程'
					}],
					liveVideoList: [{
						name: '定在当下投向未来',
						imageUrl: 'http://mallsuite.oss-accelerate.aliyuncs.com/mall/images/media/store/1215/20220410/ecd53ede15d1499fabdf0a571928ab80.jpg',
						introduction: '看直播领好礼',
						lecturer: '王亚飞',
						time: '3月23日 星期三'
					}],
					courseList:[],
					current: 1,
					
					brandText: '长乘学堂',
					//列表数组
					itemsModelArr: [],
					wonderfulPlayback: [],
					playbackAreaList: [],
					// options:null
				}
			},
			components: {
				noData
			},
			// 函数
			computed: {
				...mapState(['Config','hasLogin']),
			},
			
			created(options = {}) {
				that = this;
				// that.options = options;
				console.log("live",that.options)
				that.lecturerId = options.uid
				that.getLecturerDeatil(that.options)
				that.isSubLecturer(that.options)
				that.getHighlightsList(that.options)
			},
			onLoad(options = {}) {
				// that = this;
				// that.options = options;
				// that.lecturerId = options.userId
				// that.getLecturerDeatil(that.options)
				// that.isSubLecturer(that.options)
				// that.getHighlightsList(that.options)
			},
			methods: {
				getPrice(price) {
					if (price) {
						return price.toFixed(2)
					}
					return 0
				},
				// tabs通知swiper切换
				tabsChange(item) {
					this.current = item.index;
				},
				PickerChange(e) {
				},
				goback(){
					uni.navigateBack()
				},
				changeBtnStyle1(index){
					that.btns1Index = index;
					that.liveBackVideo = index;
					that.getHighlightsList(that.options)
				},
				changeBtnStyle2(index){
					that.btns2Index = index;
				},
				  toggleDescription(context_length) {
					if (that.isShowAllContent) {
						that.isShowAllContent = false
						that.tempContent = that.txt_content
						//这里判断些简介长度，如太长太短在这里大致判断
						if(context_length<50){
							that.userInfoHeight = that.userInfoHeight - 70
						}
						if(context_length<100){
							that.userInfoHeight = that.userInfoHeight - 20
						}
						if(context_length<140){
							that.userInfoHeight = that.userInfoHeight + 100
						}else if(context_length<160){
							that.userInfoHeight = that.userInfoHeight + context_length + 20
						}else if(context_length<240){
							that.userInfoHeight = that.userInfoHeight + context_length + 40
						}else if(context_length<360){
							that.userInfoHeight = that.userInfoHeight + context_length + 50
						}else{
							that.userInfoHeight = that.userInfoHeight + context_length + 100
						}
					} else {
						that.isShowAllContent = true
						that.tempContent = that.txt_content.substring(0, 45) + "..."
						that.userInfoHeight = 210
					}
				},
				jumpDetail(item){
					let again_url = this.$.sprintf('/edu/course/class-detail?product_id=%d&item_id=%d', item.product_id, item.item_id);
					uni.navigateTo({
						url: again_url
					});
				},
				// 获取讲师详情
				getLecturerDeatil(options) {
					that.$.request({
						url: this.Config.URL.edu.getLecturerDetail,
						data: {
							userId: options.uid
						},
						loading:false,
						dataType: 'json',
						success: function(data, status, msg, code) {
							if (status == 200) {
								that.lecturerDetail = data;
								that.txt_content = that.lecturerDetail.lecturer_introduce
								const txtCntIndex = that.lecturerDetail.lecturer_introduce.length
								if (txtCntIndex > 50) {
									that.isShowAllContent = true
									that.tempContent = that.txt_content.substr(0, 50) + "..."
								} else {
									that.isShowAllContent = false
									that.tempContent = that.txt_content
								}
							}
						}
					});
				},
				
				// 获取精彩回放列表数据
				getHighlightsList(options) {
					let userId = options.uid;
					let params = {
						riqi: "",
						teacher_id: userId,
						page_num: 1,
						page_size: 10,
						rank_type: 0,
						alive_state: -1,
						// kind_id: 1205,
					};
				
					var that = this;
					uni.request({
						method: 'POST',
						data: params,
						dataType: 'json',
						url: that.Config.getListByTeacherId,
						success: function(data, status) {
							// console.info('----data1-----', data, status);
							if (data.statusCode == 200) {
								let tmp = data.data.result;
								that.setData({
									itemsModelArr: tmp,
									// wonderfulPlayback: tmp,
								});
				
								console.info('---tmp---', tmp);
				
								var result = [];
								for (let index in tmp) {
									let item = tmp[index];
									const startTime = item.alive_start_at;
									const PlaybackLiveTime = startTime.substring(5, 7) + '月' + startTime
										.substring(8, 10) + '日 ';
									let userName = '';
									if (item.guest_list.length != 0) {
										userName = item.guest_list.map((item) => {
											return item.user_name;
										}).toString();
									}
				
									result.push({
										state: item.alive_state, //直播状态
										text: PlaybackLiveTime + item.view_num + '观看',
										describe: item.title,
										speaker: userName,
										isordered: false,
										image: item.img_url,
										pageUrl: item.page_url,
									})
				
									let lastStartTime = item.alive_start_at;
				
									const getWeek = that.getWeek(startTime.substring(0, 10));
									const lastMonthDays = lastStartTime.substring(5, 7) + '月' +
										lastStartTime.substring(8, 10) + '日 ';
									const monthDays = startTime.substring(5, 7) + '月' + startTime
										.substring(8, 10) + '日 ';
									const liveTime = monthDays + getWeek;
				
									if (item.alive_state == 0) {
										// 预约
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
									}else if (item.alive_state == 1) {
				
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
				
								that.wonderfulPlayback = result;
				
								console.info('----wonderfulPlayback----', that.wonderfulPlayback);
								console.info('----playbackAreaList----', that.playbackAreaList);
				
							} else {
				
							}
						},
						fail: function() {
							console.info('----fail----', );
						}
					});
				
				},
				
				getWeek(date) {
					let weekArray = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
				
					let week = weekArray[new Date(date).getDay()]; //注意此处必须是先new一个Date
				
					return week;
				},
				
				// 获取课程列表
				getCourseList(pageNo, pageSize) {
					that.$.request({
						url: this.Config.URL.edu.getProductList,
						method: 'get',
						data: {
							'page': pageNo,
							'rows': pageSize,
							'lecturer_id': that.lecturerId,
							'type': that.type,
							'store_is_open': 1,
							'kind_id': 1205,
						},
						loading:false,
						dataType: 'json',
						success: function(data, status, msg, code) {
							if (status == 200) {
								that.$refs.paging.complete(data.items);
								// that.courseList = data.items;
							}
						}
					});
				},
				
				//讲师订阅状态
				isSubLecturer(options){
					that.$.request({
						url: this.Config.URL.edu.isSubscribe,
						data: {
							lecturerId: options.userId
						},
						dataType: 'json',
						loading:false,
						success: function(data, status, msg, code) {
							if (status == 200) {
								data === 0? that.subText = '+订阅':that.subText = '取消订阅'
							}
						},
					});
				},
				//订阅/取消订阅讲师
				subLecturer(userId){
					that.$.request({
						url: this.Config.URL.edu.subscribeLecturer,
						data: {
							lecturerId: userId
						},
						dataType: 'json',
						loading:false,
						success: function(data, status, msg, code) {
							if (status == 200) {
								data === 0? that.subText = '+订阅':that.subText = '取消订阅'
							}
						}
					});
				},
				
				
				videoJump(url, state) {
				
					let zc_notitle = this.$FT.getUrlKey('zc_notitle', url)
					console.log('videoJump-zc_notitle', zc_notitle);
					console.log('videoJump-url, state', url, state);
				
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
				
			}
		}
	</script>
</script>

<style lang="scss" scoped>
@import '@/components/audio/font/iconfont.css';
page{
	background-color: #FFFFFF !important;
	min-height: 100% !important;
	height: 100% !important;
}
.course-item-buy-state{
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
.course_nav{
	position:absolute;
	width: 100%;
	height: 50rpx;
	z-index: 999;
	padding: 0rpx 30rpx;
	margin-top: 20rpx;
	box-sizing: border-box;
	.course_nav_left{
		float: left;
		color: #ffffff;
	}
	.course_nav_right{
		float: right;
		width: 260rpx;
		height: 50rpx;
		border-radius: 25rpx;
		background: rgba(0,0,0,0.3);
		line-height: 50rpx;
		font-size: 24rpx;
		text-align: center;
		margin: 5rpx;
		color: #FFFFFF;
	}
}
.lecturer_info {
	background-image: url('https://qnsp.zcskjy.com/zc_images/edu_pic/lecturer_back.jpg');
	background-size: 100% 100%;
	.user_avatar{
		position: relative;
		width: 300rpx;
		height: 350rpx;
		top: 70rpx;
		left: 0rpx;
	}
	.sub_btn {
		position: relative;
		bottom: 300rpx;
		left: 260rpx;
		width: 160rpx;
		height: 60rpx;
		background-color: rgb(186,61,67);
		border-radius: 30px;
		font-size: 24rpx;
		color: #FFFFFF;
		border-color: rgb(186,61,67);
	}
	.nick_name {
		position: relative;
		bottom: 240rpx;
		left: 300rpx;
		height: 50rpx;
		width: 180rpx;
		color: #FFFFFF;
		font-size: 36rpx;
		font-weight: 500;
		display: -webkit-box;
		overflow:hidden;
		white-space:nowrap;
		text-overflow:ellipsis;
	}
	.lecturer_introduct {
		padding-right: 30rpx;
		width: 56%;
		position: relative;
		bottom: 290rpx;
		left: 300rpx;
		color: #FFFFFF;
		font-size: 26rpx;
	}
}
.context_box {
	position: relative;
	top: -20rpx;
	border-top-left-radius: 20rpx;
	border-top-right-radius: 20rpx;
	background-color: #FFFFFF;
	min-height: 1275rpx;
	height: 100%;
	.u-btns1 {
		margin-left: 20rpx;
		margin-right: 20rpx;
		margin-top: 30rpx;
		height: 90rpx;
		.u-btns1-1-active {
			border: 7rpx solid #F7F8FB;
			background: #FFFFFF;
			font-weight: 500;
			color: #333333;
			width: 50%;
			float: left;
		}
		.u-btns1-1 {
			border-radius: 6rpx solid #F7F8FB;
			background: #F7F8FB;
			font-weight: 400;
			color: #666666;
			width: 50%;
			float: left;
		}
		.icon_image {
			width: 34rpx;
			height: 34rpx;
		}
	}
	.u-btns2 {
		margin-left: 20rpx;
		height: 100rpx;	
		.u-btns2-2-active {
			width: 20rpx;
			float: left;
			margin: 10rpx;
			background-color: #FFF3EF;
			color: #FA6029;
			width: 140rpx;
			height: 60rpx;
			float: left;
		}
		.u-btns2-2 {
			width: 20rpx;
			float: left;
			margin: 10rpx;
			background: #F7F7F7;
			color: black;
			width: 140rpx;
			height: 60rpx;
			float: left;
		}
	}

	.time_spicker {
		padding-left: 20rpx;
		padding-right: 20rpx;
		font-size: 18rpx;
		font-size: 26rpx;
		border-radius: 10rpx;
		margin-right: 20rpx;
		float: right;
		background: #F7F8FB;
	}
	
	.live_video_items{
		.videoTime {
			font-size: 26rpx;
			color: #999999;
			line-height: 37rpx;
			margin: 0 30rpx;
		}
		.flex-col-content{
			height: 230rpx;
			.col_image {
				float: left;
				// margin-left: 20rpx;
				height: 220rpx;
				width: 180rpx;
			}
			.col_text1{
				margin-left: 350rpx;
				font-weight: bold;
			}
			.col_text2{
				margin-left: 350rpx;
				color: #BEBEBE;
				font-size: 16rpx;
				margin-bottom: 20rpx;
			}
			.col_text3{
				margin-left: 350rpx;
				color: #BEBEBE;
				font-size: 16rpx;
			}
		}
	}
	
	.course_list{
		padding-left: 30rpx;
		padding-right: 10rpx;
		margin-top: 20rpx;
		.flex-col-content{
			height: 244rpx;
			overflow: hidden;
			.col_image {
				float: left;
				border-radius: 10rpx;
				height: 220rpx;
				width: 180rpx;
			}
			.tags_text {
				margin-left: 210rpx;
			}
			.tag-text {
				float: left;
				padding-left: 10rpx;
				padding-right: 10rpx;
				line-height: 40rpx;
				height: 40rpx;
				margin-left: 10rpx;
				color: #FFA71D;
				font-size: 20rpx;
				justify-content: center;
				background-color: #FFF5ED;
				border-radius: 5upx;
			}
			.col_text1{
				height: 55rpx;
				white-space:nowrap;
				overflow:hidden;
				text-overflow:ellipsis;
				margin-left: 220rpx;
				font-weight: bold;
				font-size: 36rpx;
			}
			.col_text2{
				margin-left: 220rpx;
				color: #666666;
				font-size: 24rpx;
			}
			.col_text3{
				// position: relative;
				// bottom: 20rpx;
				// margin-left: 230rpx;
				color: #BEBEBE;
				font-size: 24rpx;
			}
			.col_text4{
				// float: right;
				// margin-right: 20rpx;
				color: red;
				font-size: 32rpx;
			}
			.col_text5{
				background: linear-gradient(90deg, #FDECD8 0%, #FFDEAE 100%);
				width: 160rpx;
				position: relative;
				right: 50%;
				top: 35rpx;
				height: 40rpx;
				color: #5B2111;
			}
			.col_textBottom{
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: relative;
				bottom: 38rpx;
				 margin-left: 230rpx;
			}
		}
	}
}

.yd-content {
	line-height: 45rpx;
	font-weight: 400;
	color: #FFFFFF;
}

.yd-content-left {
	display:flex ;
	justify-content: flex-end;

	image {
		width: 40rpx;
		height: 40rpx;
	}
	
	.yd-content-img {
		transition: all 0.5s;
		transform: rotate(180deg);
	}
}

	.playback-area {
		padding-top: 10rpx;

		.list-live-image {
			width: 312upx !important;
			height: 175upx !important;
			border-radius: 10upx;
			// position: absolute;
			// left: 0;
			// top: 0;
		}

		&-child {
			position: relative;

		}

		&-time {
			font-size: 26upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			padding-bottom: 27upx;
		}

		&-list {
			// padding-top: 56upx
			animation: 100s;
		}

		&-content {
			padding: 0 30rpx;
			width: 690upx;
			padding-bottom: 24upx;
			height: 175upx;
			display: flex;
			align-items: flex-start;
			position: relative;
			border-radius: 5px;
			overflow: hidden;
			// justify-content: space-between;
		}

		&-text {
			padding: 0 8upx;
			transform: scale(0.8) translateX(-11%);
			white-space: nowrap;
			// width: 240upx;
			max-width: 240upx;
			// overflow-x: auto;
		}

		&-describe {
			width: 100%;
			height: 100%;
			font-size: 32upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			padding-left: 29upx;


			&-text {
				max-width: 362upx;
				max-height: 156upx;
				line-height: 42upx;
				overflow: hidden;
				text-overflow: ellipsis;
				/* 弹性伸缩盒子模型显示 */
				display: -webkit-box;
				/* 限制在一个块元素显示的文本的行数 */
				-webkit-line-clamp: 2;
				/* 设置或检索伸缩盒对象的子元素的排列方式 */
				-webkit-box-orient: vertical;
			}

			&-bottom {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.speaker {
					font-size: 26upx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #666666;
					// position: absolute;
					bottom: 35upx;
					max-width: 432upx;
					max-height: 48upx;
					overflow: hidden;
					text-overflow: ellipsis;
					/* 弹性伸缩盒子模型显示 */
					display: -webkit-box;
					/* 限制在一个块元素显示的文本的行数 */
					-webkit-line-clamp: 1;
					/* 设置或检索伸缩盒对象的子元素的排列方式 */
					-webkit-box-orient: vertical;
				}

				.order-button {
					width: 120upx;
					height: 50upx;
					background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
					border-radius: 25upx;
					display: flex;
					align-items: center;
					justify-content: space-evenly;
					font-size: 24upx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #ffffff;
					position: absolute;
					bottom: 26upx;
					right: 0;

					&::active {
						opacity: 0.75;
					}

					&::active.icon-live2 {
						display: none;
					}
				}

				// div:active{
				// 	background-image: url(1118.02.png);
				// 	background-size: 400px;
				// }
				.ordered-button {
					opacity: 0.75;
				}
			}
		}

		.list-live-content-text {
			width: auto;
			max-width: 312upx;
			height: 38upx;
			line-height: 38upx;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			background: rgba(0, 0, 0, 0.4);
			border-radius: 0 0 6upx 0;
			// border-radius: 0 10upx 10upx 0;
			overflow: hidden;
			font-size: 20upx;
			font-family: DINAlternate-Bold, DINAlternate;
			color: #ffffff;
			padding: 0 0;
			margin-left: 0;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 999;


			.button-list-state-text {
				font-size: 20upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				transform: scale(0.8) translateX(0%);
			}
		}

		.button-list-state {
			width: 58upx;
			max-width: 58upx;
			height: 40upx;
			line-height: 40upx;
			padding: 0 0;
			// width: 71upx;
			// padding: 10upx 12upx 10upx 10upx;
			background: #ffc43d linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
			border-radius: 6upx 0 0 0;
			overflow: hidden;
			font-size: 20upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #ffffff;
			white-space: nowrap;

			.icon-live {
				margin-left: 8upx;
			}
		}

		.button-list-state.order {
			background: linear-gradient(90deg, #efae33 1%, #fe9c26 100%);
		}

		.button-list-state.playback {
			background: linear-gradient(287deg, #739dff 0%, #4385ff 100%);
		}

		.button-list-state.playBackButton {
			background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%) linear-gradient(287deg, #739dff 0%, #4385ff 100%);
		}
	}

	.programGuides {
		position: relative;
		// top:-10upx;
		// min-height: 680upx;

		.speaker {
			// max-width: 232upx;
		}

		.playback-area-list {
			position: relative;
			// top:-60upx;
		}

		.playback-area-time {
			padding-top: 10upx;
		}
	}



</style>

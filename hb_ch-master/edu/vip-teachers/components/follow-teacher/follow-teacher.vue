<template>
	<view class="container">
		<view class="empty-view" v-if="isNoData">
			<view class="top-view">
				<image style="width: 320rpx;height: 240rpx;margin-bottom: 50rpx;"
					src="https://qnsp.zcskjy.com/zc_images/emptyhot.png" mode="aspectFill"></image>
				<view class="empty-text">
					{{ '你当前还没有关注大咖哦～'}}
				</view>
			</view>
			<view class="find-view" @click="gotoFindDaKa()">
				{{ '去找大咖'}}
			</view>
		</view>
		<view class="sc_part3" v-else>
			<swiper class="scroll_follow" :autoplay="false" next-margin='60rpx' @change="changeSwiper">
				<swiper-item style="width: 100%;height:280rpx;" v-for="data in showTeachers">
					<view class="item_main">
						<view class="part1">
							<image class="teacher_icon2" :src="data.portraitUrl" mode="aspectFill"></image>

							<view class="info">
								<text class="name">{{data.teacherName}}</text>

								<view class="fans">
									<text class="text1">粉丝</text>
									<text class="text2">{{data.fans}}</text>
									<!-- <text class="text3">万</text> -->
								</view>

							</view>
							<text v-if='weatherShow(data.teacherId)' :class="data.focusFlag?'attention':'noattention'"
								@click.stop="tochat(data.teacherId)">{{data.focusFlag?'去私信':'去关注'}}</text>
						</view>
						<text class="part2">{{data.teacherDesc}}</text>
					</view>
				</swiper-item>

			</swiper>

			<u-sticky offsetTop="-100rpx" bgColor="#fff">
				<u-tabs :current="followCurrentIndex" @change="changeFollowTab" bgColor="#fff" :list="tabData"
					lineWidth="40rpx" lineHeight="10rpx" lineColor="#f56c6c" :activeStyle="{
		            color: '#303133',
		            fontWeight: 'bold',
		            transform: 'scale(1.05)',
		        }" :inactiveStyle="{
		            color: '#606266',
		            transform: 'scale(1)'
		        }" itemStyle="padding-left: 30rpx; padding-right: 30rpx; height: 100rpx;background-color:#fff">
				</u-tabs>
			</u-sticky>

			<teacherPost ref='teachersposts' :teacherId="currentTeacherId" v-if="followCurrentIndex==0"></teacherPost>

			<!-- zhibo -->
			<view class="" v-show="followCurrentIndex == 1">
				<!-- <hottabview ref='homeList' :list="curriculumList" @itemClcik='lookVideoJump' 
				    :eltmType='2' style="padding:30rpx 12rpx;"></hottabview> -->
				<waterflowview ref='lookwaterView' :eltmType='2' :list="curriculumList" @itemClick='lookVideoJump'></waterflowview>
				<view class="" style="height: auto;" v-if="curriculumList.length == 0">
					<aempty-view style="margin-top:100rpx;" showTitle="暂无数据"></aempty-view>
				</view>	
			</view>
			<!-- duanshipin -->
			<view class="" v-show="followCurrentIndex == 2">
				<!-- :requestUrl='videoUrlList' -->
				<!-- <hottabview ref='videoList' :list="videoItemsArr" @videoClick='videoItemClick' 
				    :eltmType='1' style="padding:30rpx 12rpx;"></hottabview> -->
				<waterflowview ref='videowaterView' :eltmType='1' :list="videoItemsArr" 
				    @itemClick='videoItemClick'></waterflowview>	
				<view class="" style="height: auto;" v-if="videoItemsArr.length == 0">
					<aempty-view style="margin-top:100rpx;" showTitle="暂无数据"></aempty-view>
				</view>	
			</view>
			<!-- kecheng -->
			<view class="" v-show="followCurrentIndex == 3">
				<block v-if="showPage">
					<courseIntroduction @click="goCourseDetail(product_id,item_id)" class="courseList"
						style="padding: 25rpx 30rpx;background-color: #ffffff;" :list="hotCourseArr">
					</courseIntroduction>
				</block>
				<block v-else>
					<view class="" style="height: auto;" >
						<aempty-view style="margin-top:100rpx;" showTitle="暂无数据"></aempty-view>
					</view>	
					<!-- <view class="nocontent">
						<image src="https://qnsp.zcskjy.com/zc_images/edu_pic/edu_19.png"
							style="width: 320rpx;height:240rpx;"></image>
						<view style="font-size: 26rpx;font-family: PingFangSC-Regular, PingFang SC;padding: 30rpx 0">
							暂无课程</view>
					</view> -->
				</block>
			</view>

			<policyDecision v-if="followCurrentIndex==4"></policyDecision>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import policyDecision from "@/components/community/policyDecision.vue";
	import teacherPost from '@/edu/vip-teachers/components/teacher-post/teacher-post.vue';
	import courseIntroduction from '@/components/home/courseIntroduction'
	import hottabview from '@/components/add-new/tabVideo-view.vue'
    import waterflowview from '@/components/add-new/waterflow-view.vue'
   
	export default {

		props: {
			viewHeight: {
				type: Number,
				default: 0
			}
		},
		components: {
			policyDecision,
			teacherPost,
			hottabview,
			courseIntroduction,
			waterflowview
		},
		data() {
			return {
				showTeachers: [],
				teachesIdsArr: [], //老师id 列表
				followCurrentIndex: 3,
				indexList: [],
				currentTeacheIndex: 0,
				currentTeacherId: '',
				isNoData: true,
				urls: [
					'https://cdn.uviewui.com/uview/album/1.jpg',
					'https://cdn.uviewui.com/uview/album/2.jpg',
					'https://cdn.uviewui.com/uview/album/3.jpg',
					'https://cdn.uviewui.com/uview/album/4.jpg',
					'https://cdn.uviewui.com/uview/album/5.jpg',
					'https://cdn.uviewui.com/uview/album/6.jpg',
					'https://cdn.uviewui.com/uview/album/7.jpg',
					'https://cdn.uviewui.com/uview/album/8.jpg',
					'https://cdn.uviewui.com/uview/album/9.jpg',
					'https://cdn.uviewui.com/uview/album/10.jpg',
				],
				tabData: [{
					name: '观点'
				}, {
					name: '直播',
					badge: {
						isDot: true
					}
				}, {
					name: '短视频'
				}, {
					name: '课程',
					// badge: {
					// 	value: 5,
					// }
				}, {
					name: '工具包'
				}],

				showPage: true,
				videoUrlList: '',

				//直播数组
				curriculumList: [],
				//短视频数组
				videoItemsArr: [],
				//课程数组
				hotCourseArr: [],

				//记录页面索引的数组
				pagesIndexArr: [1, 1, 1, 1, 1],
				current_user_id: ''

			}
		},
		created() {
			let that = this;
			if (this.hasLogin) {
				that.setData({
					current_user_id: that.userInfo.user_id
				})
			}
	        //实际要用这个
			// that.getUserBuyTeacher();
			//暂时用这个
			that.getTeacherList();

			//直播接口 通过传递 url 的方式
			that.setData({
				videoUrlList: this.Config.URL.newsUrl.videolist
			});

		},

		// 函数
		computed: {
			...mapState(['Config', 'hasLogin', 'userInfo']),
		},
		methods: {


			loadRefresh() {
				// console.info('--follow----loadRefresh-----', this.followCurrentIndex,this.currentTeacherId);
				// uni.stopPullDownRefresh();
				// console.info('--follow----loadRefresh---000--', this.followCurrentIndex);
				// console.info('--follow----hasLogin--', this.hasLogin);
				
				if(this.hasLogin && this.isNoData){
					console.info('--follow----hasLogin--1111');
					this.getTeacherList();
					
				}
				
				if(this.hasLogin==false){
					this.setData({
						isNoData: true,
					});
					return;
				}
				
				if (this.followCurrentIndex == 0) {
					if(this.currentTeacherId !==''){
						this.$refs.teachersposts.loadRefresh(this.currentTeacherId);
					}
				} else if (this.followCurrentIndex == 1) {
					this.pagesIndexArr[1] = 1;
					this.getLiveVideoList(1);

				} else if (this.followCurrentIndex == 2) {

					this.pagesIndexArr[2] = 1;
					this.getMediaList(1);
				} else if (this.followCurrentIndex == 3) {

					this.pagesIndexArr[3] = 1;
					this.getCourseList(1);
				} else if (this.followCurrentIndex == 4) {

					uni.stopPullDownRefresh();
				}
			},

			loadmore() {

				if (this.followCurrentIndex == 0) {

					this.$refs.teacherpost.loadmore(this.currentTeacherId);
				} else if (this.followCurrentIndex == 1) {

					let pageNum = this.pagesIndexArr[1] + 1;
					this.getLiveVideoList(pageNum);
				} else if (this.followCurrentIndex == 2) {

					let pageNum = this.pagesIndexArr[2] + 1;
					this.getMediaList(pageNum);
				} else if (this.followCurrentIndex == 3) {

					let pageNum = this.pagesIndexArr[3] + 1;
					this.getCourseList(pageNum);
				} else if (this.followCurrentIndex == 4) {

				}
			},

			//跳转大咖列表页面
			gotoFindDaKa() {
				// console.info('--找大咖---');
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				uni.navigateTo({
					url: '/edu/teacher-more/teacher-more'
				})
			},

			weatherShow(tId) {
				return this.current_user_id != tId
			},

			changeFollowTab(event) {
				let that = this;
				this.followCurrentIndex = event.index;

				console.info('----this.followCurrentIndex ---', this.followCurrentIndex);
			},

			tochat(id) {
				uni.navigateTo({
					url: "/im/chat/chat?uid=" + id,
				})
			},

			getTeacherList() {
				let that = this;
				let uid = that.userInfo.user_id;
				uni.request({
					url: that.Config.teacherListDate,
					methods: 'GET',
					data: {
						userId: uid
					},
					loading: false,
					success: function(res) {

						console.info('--follow--teacherList---', res);
						if (res.statusCode == 200) {

							let teacherData = res?.data?.result;
							that.showTeachers = [];
							that.teachesIdsArr = [];
							teacherData.forEach(function(item, i, array) {
								// console.info('---teachflag---', item.focusFlag);
								if (item.focusFlag == true) {
									that.showTeachers.push(item);
									that.teachesIdsArr.push(item.teacherId);
								}
							});
							
							if(that.hasLogin){
								if(that.teachesIdsArr.length >0){
									let teacherId =that.teachesIdsArr[0];
									that.setData({
										currentTeacherId: teacherId,
									});
								}
								//直播接口
								that.getLiveVideoList(1);
								//视频列表接口
								that.getMediaList(1);
								// //课程接口
								that.getCourseList(1);
							}
							if (that.showTeachers.length == 0) {
								that.isNoData = true;
							} else {
								that.isNoData = false;
							}
						} else {

						}
					}
				});
			},

			changeSwiper(event) {
				let currentI = event.detail.current;
				this.currentTeacheIndex = currentI;
				let teacherId = this.showTeachers[currentI].teacherId;
				this.setData({
					currentTeacherId: teacherId
				});
				console.info('---Swiper---TeacherId-----', this.currentTeacherId);
				//重新刷新请求当页的数据
				this.loadRefresh();

			},

			getUserBuyTeacher() {
				let that = this;
				let uid = that.userInfo.user_id;
				uni.request({
					url: that.Config.userAuthList,
					data: {
						userId: uid,
						labelType: 4,
						//orderStatus：1 已购买  0未购买
						orderStatus: 0
					},
					success(res) {
						console.info('----info---getUserBuyTeacher--', res);
						if (res.statusCode == 200) {
							if (res?.data?.result?.teacher && res?.data?.result?.teacher.length > 0) {

								that.setData({
									showTeachers: res.data.result.teacher,
								})
							} else {

							}
						} else {

						}
					}
				})
			},

			//短视频
			getMediaList(pageNum) {
				var that = this;
				let teaIdsArr = [that.currentTeacherId];
				uni.request({
					url: that.Config.URL.getTeacherMediaList,
					loading: false,
					method: 'POST',
					data: {
						tidList: teaIdsArr,
						pageNum: pageNum,
						pageSize: 20,
					},
					success: function(res) {

						let tagList;
						if (res.statusCode === 200) {
							let result = res.data.result;
							//下拉刷新的时候 才重置清空数组
							if (pageNum == 1) {
								uni.stopPullDownRefresh();
								that.videoItemsArr = [];
							}
							//修改pagenum
							if (pageNum <= result.totalPage) {
								that.pagesIndexArr[2] = pageNum;
							}
							// console.info('---getMediaList---result-----',result.list);

							that.setData({
								videoItemsArr: that.videoItemsArr.concat(result.list),
							});
							
							that.$refs.videowaterView.addList(that.videoItemsArr)
							// console.info('---videoItemsArr-----', that.videoItemsArr);

							if (pageNum >= result.totalPage) {
								// uni.showToast({
								// 	icon: 'none',
								// 	title: '暂无更多数据了'
								// })
							}

							if (that.videoItemsArr.length <= 0) {
								that.showVideoPage = false;
							} else {
								that.showVideoPage = true;
							}
						}
					}
				});
			},

			getCourseList(pageNum) {
				var that = this;
				let type = 1;
				//type_id 0-精品课；1-训练营；2-导师课
				let newType = null;
				uni.request({
					url: that.Config.URL.edu.getProductList,
					loading: false,
					data: {
						// type_id: newType,
						category_id: 2025,
						course_category_id: 0,
						store_is_open: 1,
						page: pageNum,
						rows: 50,
						product_state_id: 1001,
						kind_id: 1205,
					},
					success: function(res) {
						let tagList;
						if (res.statusCode === 200) {

							let data = res.data.data;
							// console.info('--getCourseList-111-',data);
							if (pageNum == 1) {
								that.hotCourseArr = [];
							}
							if (pageNum <= data.total) {
								that.pagesIndexArr[3] = pageNum;
							}
							if (pageNum >= data.total) {
								// uni.showToast({
								// icon: 'none',
								// title: '暂无更多数据了'
								// })
							}

							data.items.forEach(function(item, i, array) {
								tagList = item.product_tag_names;
								if (that.currentTeacherId == item.user_id) {
									that.hotCourseArr.push({
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
								}
							});

							if (that.hotCourseArr.length == 0) {
								that.showPage = false;
							} else {
								that.showPage = true;
							}
						}
					}
				});
			},

			getDateDiff(startTime, endTime, diffType = 'minute') {
				//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
				startTime = startTime.replace(/\-/g, "/");
				endTime = endTime.replace(/\-/g, "/");
				diffType = diffType.toLowerCase();
				var sTime = new Date(startTime); //开始时间
				var eTime = new Date(endTime); //结束时间
				//作为除数的数字
				var timeType = 1;
				switch (diffType) {
					case "second":
						timeType = 1000;
						break;
					case "minute":
						timeType = 1000 * 60;
						break;
					case "hour":
						timeType = 1000 * 3600;
						break;
					case "day":
						timeType = 1000 * 3600 * 24;
						break;
					default:
						break;
				}
				return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
			},

			getLiveVideoList(pageNum) {

				console.info('---直播----loadmore---list--');
				const that = this;
				let teaIdsArr = [that.currentTeacherId];
				const params = {
					tidList: teaIdsArr,
					pageNum: pageNum,
					pageSize: 20,
				};
				uni.request({
					url: that.Config.URL.getTeacherLiveList,
					method: 'POST',
					dataType: 'jsonp',
					data: params,
					success: (res) => {

						const result = JSON.parse(res.data).result;
						if (res.statusCode == 200) {
							if (pageNum == 1) {
								uni.stopPullDownRefresh();
								that.curriculumList = [];
							}
							if (pageNum <= result.totalPage) {
								that.pagesIndexArr[1] = pageNum;
							}
							if (pageNum >= result.totalPage) {
								// uni.showToast({
								// 	icon: 'none',
								// 	title: '没有更多数据了！'
								// })
							}

							let list = result.list;
							list?.forEach(function(item, i, array) {
								const startTime = item.alive_start_at;
								let playlengTime = that.getDateDiff(item.alive_start_at, item
									.alive_stop_at);
								
								that.curriculumList.push({
									state: item.alive_state, // 直播状态
									number: item.view_num + '观看',
									image: item.img_url,
									playlengTime: playlengTime,
									startTime: startTime.substring(11, 16),
									page_url: item.page_url,
									portraitUrl: item.portraitUrl,
									teacherName: item.teacherName,
									title: item.title,
									summary:item.summary,
									comment_count:item.comment_count,
									comment_user_count:item.comment_user_count,
								});
							});
							
							//改成瀑布流的数据
							that.$refs.lookwaterView.addList(that.curriculumList);
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

			videoItemClick(item) {

				console.info('-video--item--', item);
				uni.navigateTo({
					url: '/ganhuo/recomvideolist/mediaPlay?media_url=' + item.media_url + '&media_name=' + item
						.media_name + '&media_time' + item.media_time
				});
			},

			lookVideoJump(url) {
				let zc_notitle = this.$FT.getUrlKey('zc_notitle', url)
				// console.log('----zc_notitle', zc_notitle);

				let webview_live = '/my/webview/webview_live';
				let webview = '/my/webview/webview';
				if (zc_notitle == 0) {
					this.openWebview(url);
				} else {
					this.webview_live(url);
				}
			},

			webview_live(urls) {

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

		}
	}
</script>

<style lang="scss" scoped>
	.empty-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;

		.top-view {
			width: 100%;
			height: 330rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			margin-bottom: 180rpx;

			.empty-text {
				color: #999999;
				line-height: 33rpx;
				// margin-left: 4rpx;
				text-align: center;
				font-size: 24rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
			}
		}

		.find-view {
			width: 300rpx;
			height: 80rpx;
			background: #F64D54;
			border-radius: 40rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 30rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
		}

	}


	.tab_page3 {
		width: 100%;
		height: auto;
		flex-direction: column;
		display: flex;
		align-items: center;
	}

	.nocontent {
		color: #999;
		text-align: center;
		width: 650rpx;
		margin-left: 20rpx;
		font-size: 26rpx;
		margin-top: 60rpx;
		margin-bottom: 60rpx;
	}

	.scroll_follow {
		width: 750rpx;
		height: 280rpx;
		display: flex;
		flex-direction: row;


		.item_main {
			width: 690rpx;
			height: 240rpx;
			background-color: #fff;
			border-radius: 20rpx;
			margin-top: 20rpx;
			margin-left: 20rpx;
			margin-right: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.part1 {
			width: 640rpx;
			height: 100rpx;
			margin-top: 24rpx;
			background-color: #fff;
			margin-bottom: 26rpx;
			display: flex;
			flex-direction: row;
		}

		.teacher_icon2 {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50rpx;
		}

		.info {
			flex: 1;
			display: flex;
			flex-direction: column;
			margin-left: 27rpx;
			justify-content: center;
		}

		.attention {
			width: 120rpx;
			height: 60rpx;
			background: #F43D3E;
			border-radius: 30rpx;
			margin-top: 9rpx;
			font-size: 28rpx;
			text-align: center;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			line-height: 60rpx;
		}

		.noattention {
			width: 120rpx;
			height: 60rpx;
			background: #EDEDED;
			border-radius: 30rpx;
			margin-top: 9rpx;
			font-size: 28rpx;
			text-align: center;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			line-height: 60rpx;
		}

		.name {
			height: 45rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #3F3F3F;
			line-height: 45rpx;

		}

		.fans {
			display: flex;
			flex-direction: row;
			height: 45rpx;
		}

		.text1 {
			height: 33rpx;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			margin-top: 10rpx;
			line-height: 33rpx;
		}

		.text2 {
			height: 45rpx;
			font-size: 36rpx;
			font-family: DIN-Bold, DIN;
			font-weight: bold;
			margin-left: 20rpx;
			color: #333333;
			line-height: 44rpx;
		}

		.text3 {
			height: 33rpx;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: bold;
			color: #333333;
			margin-top: 10rpx;
			line-height: 33rpx;
		}

		.follow_space {
			width: 100%;
			height: 1000rpx;
			background-color: antiquewhite;
		}

		.sc_part3 {
			width: 100%;
			height: 100%;
			background-color: #F43D3E;
			display: flex;
			flex-direction: column;
		}

		.nodata_part {
			width: 750rpx;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.container {
			width: 100%;
			height: 100%;
		}

		.part2 {
			width: 640rpx;
			height: 70rpx;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #3F3F3F;
			line-height: 35rpx;
			display: -webkit-box;
			overflow: hidden;
			text-overflow: ellipsis;
			word-wrap: break-word;
			white-space: normal !important;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
	}
</style>

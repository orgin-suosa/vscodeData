<template>
	<view class="tab_page2">

		<block v-if="curriculumList.length ==0 ">
			  <noData noDataText="暂无课程"></noData>
		</block>
		<block v-else>
			
			<view class="look-tabview">
				<view>
					<hottabview ref='videoList' :list="videoItemsArr" :requestUrl='videoUrlList'
						@videoClick='videoItemClick' :eltmType='1' style="padding:30rpx 12rpx;"></hottabview>
					<view class="" style="height: auto;" v-if="videoItemsArr.length == 0">
						<aempty-view style="margin-top:120rpx;" showTitle="暂无数据"></aempty-view>
					</view>	
				</view>
			</view>
		</block>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import hottabview from '@/components/add-new/tabVideo-view.vue'
   import noData from '@/components/no-data/index.vue';
	export default {
		props: {
			viewHeight: {
				type: Number,
				default: 1000
			},
			options: {
			  type: Object,
			  default() {
			    return {};
			  },
			},
		},
		components: {
			hottabview,
			noData
		},

		data() {
			return {

				showTeachers: [], //直播
				teachesIdsArr: [], //直播
				tabData: [{
					name: '观点'
				}, {
					name: '直播',
				}, {
					name: '短视频'
				}, {
					name: '课程',
				}],
				followCurrentIndex: 1,
				showCoursePage: true,
				showVideoPage: true,
				//直播数组
				curriculumList: [],
				//热门课程数组
				videoUrlList: '',
				videoItemsArr: [],
				//热门课程数组
				hotCourseArr: [],

				currentTeacherId: '', // 老师观点
				//记录页面索引的数组
				pagesIndexArr: [1, 1, 1, 1],

				indexList: [],
				urls: [
					'https://cdn.uviewui.com/uview/album/1.jpg',
					'https://cdn.uviewui.com/uview/album/2.jpg',
					'https://cdn.uviewui.com/uview/album/3.jpg',
					'https://cdn.uviewui.com/uview/album/4.jpg',
					'https://cdn.uviewui.com/uview/album/5.jpg',
				],

			}
		},
		// 
		computed: {
			...mapState(['Config', 'hasLogin', 'userInfo']),
		},

		created() {

			let that = this;
			that.setData({
				videoUrlList: this.Config.URL.newsUrl.videolist
			});
			console.info('----UrlList----', that.videoUrlList);

			that.getTeacherList();


			// let ary = [];
			// for (let i = 0, length = that.tabData.length; i < length; i++){
			// 	ary.push({loadPageFlag:false,pageNum:1,totalPage:1,status:'more'});
			// }	
			// that.pagesIndexArr = ary;
		},

		methods: {

			//跳转大咖列表页面
			gotoFindDaKa() {
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

			//下拉刷新
			loadRefresh() {
				
				if (this.followCurrentIndex == 0) {
					
					if(this.currentTeacherId !==''){
						this.$refs.teacherpost.loadRefresh(this.currentTeacherId);
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
				}
			},

			loadmore() {
				if (this.followCurrentIndex == 0) {
					// console.info('--hot---圈子----loadmore-----');
					this.$refs.teacherpost.loadmore(this.currentTeacherId);
				} else if (this.followCurrentIndex == 1) {
					// console.info('--hot---直播----loadmore---000--');
					let pageNum = this.pagesIndexArr[1] + 1;
					this.getLiveVideoList(pageNum);
				} else if (this.followCurrentIndex == 2) {
					// console.info('--hot---短视频----loadmore-----');
					let pageNum = this.pagesIndexArr[2] + 1;
					this.getMediaList(pageNum);
				} else if (this.followCurrentIndex == 3) {
					// console.info('--hot---课堂-----loadmore-----');
					let pageNum = this.pagesIndexArr[3] + 1;
					this.getCourseList(pageNum);
				}
			},

			changeFollowTab(event) {
				let that = this;
				this.followCurrentIndex = event.index;
				// console.log('---changeFollowTab---', event.index, this.followCurrentIndex);
			},

			goCourseDetail(product_id, item_id) {

				let again_url = this.$.sprintf("/edu/course/class-detail?product_id=%d&item_id=%d", product_id, item_id);
				uni.navigateTo({
					url: again_url
				})
			},

			getTeacherList() {
				let that = this;
				let uid = that.options.uid;
				uni.request({
					url: that.Config.teacherListDate,
					methods: 'GET',
					data: {
						userId: uid
					},
					loading: false,
					success: function(res) {
						let teacherData = res?.data?.result;
						that.showTeachers = [];
						that.teachesIdsArr = [];
						teacherData.forEach(function(item, i, array) {
							if (item.focusFlag == true) {
								that.showTeachers.push(item);
								that.teachesIdsArr.push(item.teacherId);
							}
						});
						
						console.info('---teachesIdsArr---', that.teachesIdsArr);
						
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
					}
				});
			},

			// getTeacherLiveList: auth + '/v1/live/getTeacherLiveList',
			// getTeacherMediaList: auth + '/v1/mall/getTeacherMediaList',

			//短视频
			getMediaList(pageNum) {
				var that = this;
				uni.request({
					url: that.Config.URL.getTeacherMediaList,
					loading: false,
					method: 'POST',
					data: {
						tidList: that.teachesIdsArr,
						pageNum: pageNum,
						pageSize: 20,
					},
					success: function(res) {
						uni.stopPullDownRefresh();
						let tagList;
						if (res.statusCode === 200) {
							let result = res.data.result;
							//下拉刷新的时候 才重置清空数组
							if (pageNum == 1) {
							
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

							// result.list.forEach(function(item, i, array) {
							// 	that.videoItemsArr.push({
							// 	});
							// });

							console.info('---videoItemsArr-----', that.videoItemsArr);

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
					// success: function(data, status) {
					success: function(res) {

						// console.info('---getCourseList---data-----', res);
						uni.stopPullDownRefresh();
						let tagList;
						if (res.statusCode === 200) {
							let data = res.data.data;
							//下拉刷新的时候 才重置清空数组
							if (pageNum == 1) {
								that.hotCourseArr = [];
							}
							console.info('---getCourseList---data--0---', data);
							//修改pagenum
							if(pageNum <= data.total) {
								that.pagesIndexArr[3] = pageNum;
							}
							
							data.items.forEach(function(item, i, array) {
								tagList = item.product_tag_names;
								if (that.teachesIdsArr.includes(String(item.user_id))) {
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

							if (pageNum >= data.total) {
								// uni.showToast({
								// 	icon: 'none',
								// 	title: '暂无更多数据了'
								// })
							}

							if (that.hotCourseArr.length <= 0) {
								that.showCoursePage = false;
							} else {
								that.showCoursePage = true;
							}
						}
					}
				});
			},

			getDateDiff(startTime, endTime, diffType = 'minute') {
				//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
				startTime = startTime.replace(/\-/g, "/");
				endTime = endTime.replace(/\-/g, "/");
				//将计算间隔类性字符转换为小写
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
				const that = this;
				const params = {
					tidList: that.teachesIdsArr,
					pageNum: pageNum,
					pageSize: 20,
				};
				
				uni.request({
					url: that.Config.URL.getTeacherLiveList,
					method: 'POST',
					dataType: 'jsonp',
					data: params,
					success: (res) => {
						
						uni.stopPullDownRefresh();

						const result = JSON.parse(res.data).result;
						if (res.statusCode == 200) {

							if (pageNum == 1) {
								that.curriculumList = [];
							}

							if (pageNum <= result.totalPage) {
								that.pagesIndexArr[1] = pageNum;
							}
							let list = result.list;
							
							list.forEach(function(item, i, array) {

								const startTime = item.alive_start_at;
								let playlengTime = that.getDateDiff(item.alive_start_at, item
									.alive_stop_at);
								let userName = '';
								if (item.group_tag !== null) {
									let tagArr = item.group_tag.split('|');
									userName = tagArr[1];
								}

								let view_num = item.view_num;

								// if (item.alive_state == 0) {
								// 	// 预约
								// 	that.curriculumList.push({
								// 		state: item.alive_state, // 直播状态
								// 		// number: PlaybackLiveTime + startTime.substring(11, 16),
								// 		playlengTime:playlengTime,	
								// 		image: item.img_url,
								// 		isordered: false,
								// 		startTime: startTime.substring(11, 16),
								// 		page_url: item.page_url,
								// 		speaker: userName,
								// 		title: item.title,
								// 	});
								// } else if (item.alive_state == 1) {
								// 直播
								that.curriculumList.push({
									state: item.alive_state, // 直播状态
									number: view_num + '观看',
									image: item.img_url,
									playlengTime: playlengTime,
									startTime: startTime.substring(11, 16),
									page_url: item.page_url,
									speaker: userName,
									title: item.title,
								});
							});

							// console.info('--curriculumList-----', that.curriculumList);
							if (pageNum >= result.totalPage) {
								// uni.showToast({
								// 	icon: 'none',
								// 	title: '没有更多数据了！'
								// })
							}
						}
					},
					fail: () => {

					},
					complete: () => {

					},
				});
			},

			//短视频点击item
			videoItemClick(item) {

				console.info('---短视频---video-item--', item);	
				uni.navigateTo({
					url: '/ganhuo/recomvideolist/mediaPlay?media_url=' + item.media_url +'&media_name='+ item.media_name +'&media_time'+ item.media_time
				});
			},

			videoJump(url) {
				let zc_notitle = this.$FT.getUrlKey('zc_notitle', url)
				// console.log('videoJump-zc_notitle', zc_notitle);

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
	.tab_page2 {
		width: 100%;
		// height: auto;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		// background-color: #F7F7F7;

		.look-tabview {
			margin-top: 10rpx;
			width: 100%;
			height: 85rpx;
			background-color: #fff;

			.nocontent {
				color: #999;
				text-align: center;
				width: 650rpx;
				margin-left: 20rpx;
				font-size: 26rpx;
				margin-top: 100rpx;
				margin-bottom: 60rpx;
			}
		}

		.top-hotView {
			width: 710rpx;
			height: 150rpx;
			background-color: #ffffff;
			padding: 40rpx 20rpx 20rpx;
			// display: flex;
			// overflow-x: scroll;
			// flex-direction: row;
			//  align-items: center;
			// justify-content: flex-start;			

			.hot-item {
				margin: 0 30rpx;
				width: 110rpx;
				height: 100%;
				display: inline-block;
				position: relative;
				// display: flex;
				// flex-direction: row;
				// align-items: center;
				// justify-content: flex-start;	

				.hot-image {
					width: 100rpx;
					height: 100rpx;
					background-color: #ffffff;
					border-radius: 50%;
					border-style: solid;
					border-width: 5rpx;
					border-color: #ffffff;
					z-index: 1;
					position: absolute;
					left: 0;
					top: 0;
				}

				.hot-Tv-text {
					background-color: #FF5151;
					color: #FFFFFF;
					width: 68rpx;
					height: 28rpx;
					font-size: 20rpx;
					text-align: center;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 28rpx;
					position: absolute;
					top: 80rpx;
					// left: 0;
					z-index: 99;
					border-radius: 4rpx;
					overflow: hidden;
					margin-left: 20rpx;
					margin-right: 20rpx;
				}

				.hot-item-text {
					position: absolute;
					// z-index: 99;
					bottom: 0rpx;
					color: #3F3F3F;
					line-height: 33rpx;
					height: 33rpx;
					text-align: center;
					width: 100%;
					font-size: 24rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}

			}
		}

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

	}
</style>

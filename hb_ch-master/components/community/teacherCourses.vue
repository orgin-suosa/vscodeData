<template>
	<view class="tab_page2">
		<view class="look-tabview">
				<view class="">
					<block  v-if="showCoursePage">
						<courseIntroduction @click="goCourseDetail(product_id,item_id)" class="courseList"
							style="padding: 25rpx 30rpx;background-color: #ffffff;" :list="hotCourseArr">
						</courseIntroduction>
					</block>
					<block v-else>
						<noData noDataText="暂无课程"></noData>
						
					</block>
				</view>
			</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import courseIntroduction from '@/components/home/courseIntroduction'
	import hottabview from '@/components/add-new/tabVideo-view.vue'
   import noData from '@/components/no-data/index.vue';
	export default {
		props: {
			viewHeight: {
				type: Number,
				default: 1000
			},
			page: {
			  type: Number,
			  default() {
			    return 1;
			  },
			},
			options: {
			  type: Object,
			  default() {
			    return {};
			  },
			},
		},
		components: {
			courseIntroduction,
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
				followCurrentIndex: 3,
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
			that.getCourseList(that.page);
		},

		methods: {
			goCourseDetail(product_id, item_id) {

				let again_url = this.$.sprintf("/edu/course/class-detail?product_id=%d&item_id=%d", product_id, item_id);
				uni.navigateTo({
					url: again_url
				})
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

						console.info('---getCourseList---data-----', res);
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
								// 筛选当前大咖课程
								if (that.options.uid == item.user_id) {
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
							console.log("hotCourseArr",that.hotCourseArr)
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


		}
	}
</script>

<style lang="scss" scoped>
	.tab_page2 {
		width: 100%;
		height: auto;
		// height: 100%;
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

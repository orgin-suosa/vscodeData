<template>
	<view class="flex-col group">
		<view class="flex-col">
			<view class="section_1">
				<view class="left_tab_bar">
					<u-tabs name="name" :activeStyle="{ color: 'red', fontWeight: 'bold' }" ref="uTabs" height="50"
						:duration="0" active-color="#FF960C" inactive-color="#666666" lineColor="#F43D3E"
						:list="categoryList" :current="currentF" @change="currentFChange" :is-scroll="true"></u-tabs>
				</view>
			</view>
			<view class="flex-col group_2">
				<subsection class="layout-row" mode="button" :list="sub_selection_list" :bold="true"
					activeColor="#333333" inactiveColor="#666666" fontSize="28rpx" bgColor="#F6F7FA"
					:current="btnCurrentIndex" @change="changeBtnIndex"></subsection>
				<view class="flex-col group_14" v-show="showCourseView">
					<z-paging ref="paging"
						:empty-view-img-style="{'width':'300rpx','height':'300rpx','margin-top':'50%','transform':'translateY(-50%)'}"
						empty-view-text="暂无课程"
						:empty-view-title-style="{'margin-top':'-40%','transform':'translateY(-50%)'}"
						empty-view-img="https://qnsp.zcskjy.com/zc_images/edu_pic/edu_19.png" :auto="false"
						v-model="courseList" :empty-view-fixed="false" @query="getCourseList" :fixed="false"
						:hide-loading-more-when-no-more-by-limit="5">
						<view class="list-item flex-row" v-for="item in courseList">
							<view class="items-box" @click="jumpDetail(item)">
								<image :src="item.product_image" :lazy-load="true" class="image_11" mode="aspectFill">
								</image>
								<view class="right-group flex-col">
									<view class="text_11">{{ item.product_name }}</view>
									<view class="text_12">{{ item.product_tips }}</view>
									<view class="text_13">
										<view v-for="it in item.product_tag_names">
											<view class="tag-text">{{ it }}</view>
										</view>
									</view>
									<u-button class="text_15" type="default" shape="circle" size="small">
										<u-icon :label="item.courseItems" labelSize="16rpx" labelColor="rgb(91,33,17)"
											size="12"
											name="https://qnsp.zcskjy.com/zc_images/edu_pic/video_tag.png">
										</u-icon>
										<text
											style="margin-left: 10rpx;font-size: 22rpx;">{{ item.chapter.chapterNum }}节课时</text>
									</u-button>
									<view style="height: 50rpx;margin-top: -20rpx;">
										<image class="lecturer_avater" :src="item.user_avatar"></image>
										<view class="lecturer_nickname">讲师：{{ item.user_nickname }}</view>
										<view v-if="!item.is_buy" class="text_14">
											<text v-if="item.product_unit_price != 0">
												￥
												<span
													style="font-size: 36rpx;">{{ getPrice(item.product_unit_price) }}</span>
											</text>
											<text v-else style="font-size: 30rpx;font-weight: 600;">0元</text>
										</view>
										<view v-else class="study">
											<text >去学习</text>
										</view>
									</view>
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
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import subsection from '@/uni_modules/uview-ui/components/u-subsection/u-subsection.vue';
	var that; // 当前页面对象
	export default {
		components: {
			subsection,
		},
		data() {
			// 页面数据变量
			return {
				flag: false, // 进入页面第一次旗帜
				courseList: [],
				type_id: 0,
				checkIndexBtnValue: 0,
				categoryList: [],
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
				showCourseView: false,
				treeDataS: [], // 二级分类数据
				currentF: 0, // 一级选中项
				currentS: 0, // 二级选中项
				btnCurrentIndex: 0,
				show: false, // 筛选弹框显隐
				leftSelect: 0 // 左侧分类选中项
			};
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options = {}) {
			// that = this;
			// that.init(options);
		},
		// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
		onReady() {},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow(options = {}) {
			that = this;
			that.init(options);
		},
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {},
		// 函数
		computed: {
			...mapState(['Config']),
			rightText() {
				return item => {
					if (item.item_unit_price == '0' || item.item_unit_price == null) {
						return '0元';
					} else {
						return '￥' + item.item_unit_price / 100;
					}
				};
			}
		},
		methods: {
			getPrice(price) {
				if (price) {
					return price.toFixed(2)
				}
				return 0
			},
			// 页面数据初始化函数
			init(options) {
				that.getCategories();
			},
			// 请求分类数据
			getCategories() {
				var that = this;
				that.$.request({
					url: that.Config.URL.edu.getCategoryList,
					data: {
						course_category_pid: 0
					},
					loading: false,
					success: function(data, status, msg, code) {
						if (status === 200 && data) {
							that.repleaceParamName(data);
							that.checkIndexBtnValue = data[0].course_category_id;
							that.$refs.paging.reload();
							that.showCourseView = true;
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

			changeBtnIndex(index) {
				var Lst = [];
				if (index == 0) {
					Lst = [{
							name: '全部',
							show_fg: 0
						},
						{
							name: '导师课',
							show_fg: 1
						},
						{
							name: '训练营',
							show_fg: 1
						},
						{
							name: '精品课',
							show_fg: 0
						}
					]
				}

				if (index == 1) {
					Lst = [{
							name: '全部',
							show_fg: 0
						},
						{
							name: '导师课',
							show_fg: 0
						},
						{
							name: '训练营',
							show_fg: 1
						},
						{
							name: '精品课',
							show_fg: 0
						}
					]
				}

				if (index == 2) {
					Lst = [{
							name: '全部',
							show_fg: 1
						},
						{
							name: '导师课',
							show_fg: 0
						},
						{
							name: '训练营',
							show_fg: 0
						},
						{
							name: '精品课',
							show_fg: 0
						}
					]
				}

				if (index == 3) {
					Lst = [{
							name: '全部',
							show_fg: 1
						},
						{
							name: '导师课',
							show_fg: 1
						},
						{
							name: '训练营',
							show_fg: 0
						},
						{
							name: '精品课',
							show_fg: 0
						}
					]
				}
				this.sub_selection_list = Lst;
				that.btnCurrentIndex = index;
				that.type_id = index;
				// //重载数据
				this.$refs.paging.reload();
			},

			onNavigationBarButtonTap() {
				uni.navigateTo({
					url: '/edu/course/search'
				});
			},

			eachReplaceKey(data) {
				let item = [];
				data.map(list => {
					let newData = {};
					newData.id = list.id;
					newData.name = list.label;
					newData.parent_id = list.pid;
					newData.children = list.children;
					if (list.children) {
						newData.children = that.eachReplaceKey(list.children);
					}
					item.push(newData);
				});
				return item;
			},

			currentFChange(item) {
				this.currentF = item.index;
				this.checkIndexBtnValue = item.course_category_id;
				this.$refs.paging.reload();
			},
			jumpDetail(item) {
				let again_url = this.$.sprintf('/edu/course/class-detail?product_id=%d&item_id=%d', item.product_id, item
					.item_id);
				uni.navigateTo({
					url: again_url
				});
			},
			// 获取课程列表
			getCourseList(pageNo, pageSize) {
				let type_id = that.type_id - 1;
				let type_ids;
				if (type_id == 0) {
					type_ids = 2;
				} else if (type_id == 1) {
					type_ids = 1;
				} else if (type_id == 2) {
					type_ids = 0;
				} else {
					type_ids = '';
				}

				that.$.request({
					url: this.Config.URL.edu.getProductList,
					method: 'get',
					data: {
						page: pageNo,
						rows: pageSize,
						type_id: type_ids,
						category_id: 2025,
						store_is_open: 1,
						course_category_id: this.checkIndexBtnValue,
						kind_id: 1205,
						product_state_id: 1001
					},
					loading: false,
					dataType: 'json',
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.$refs.paging.complete(data.items);
						}
					}
				});
			},
			// 筛选完成
			screen(fIndex, sId) {
				that.show = false;
				this.$nextTick(() => {
					that.currentF = fIndex;
					that.setTreeDataS(fIndex, sId);
				});
			}
		},
		onUnload() {
			uni.$off('courseReload');
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #ffffff !important;
		min-height: 100% !important;
		height: 100% !important;
	}

	.layout-row {
		margin-left: 17rpx;
		margin-right: 17rpx;
		width: 95%;
	}

	.demo-layout {
		height: 40px;
	}

	.bg-purple {
		background: rgb(246, 247, 250);
	}

	.bg-purple-light {
		background: rgb(246, 247, 250);
	}

	.bg-purple-dark {
		background: rgb(246, 247, 250);
	}

	.layout-btn {
		margin-top: 1rpx;
		height: 78rpx;
		background: #f7f8fb;
	}

	.layout-btn-active {
		margin-top: 1rpx;
		height: 78rpx;
		background-color: rgb(255, 254, 255);
	}

	.banner-nav {
		/* position: absolute; */
		width: 100%;
		height: 88upx;
		z-index: 999;
		display: flex;
		align-items: center;
		/* justify-content: center; */
		justify-content: space-around;
		background-color: rgba(0, 0, 0, 0);
	}

	.xx-box {
		/* margin-top: 20upx; margin-left: 22upx; */
		width: 50upx;
		height: 50upx;
	}

	.xx {
		/* position: fixed;*/
		/* top: 20upx; left: 22upx; */
		width: 50upx;
		height: 50upx;
		z-index: 999;
		border-radius: 100%;
		opacity: 0.8;
		background-color: #fafafa;
		border: 1upx solid #fafafa;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.xx1 {
		width: 35upx;
		height: 35upx;
		margin: 9upx;
	}

	.group {
		flex: 1 1 auto;
		overflow-y: auto;

		.section_1 {
			padding-bottom: 7rpx;
			background-color: rgb(255, 255, 255);
			position: relative;
			height: 80rpx;
			border-bottom: 1px solid #f0f0f0;

			.left_tab_bar {
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
			margin-top: 20rpx;

			.second_tabs {
				display: flex;
				padding: 0 20rpx;

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

			.group_14 {
				margin-top: 25rpx;
				padding: 0 30rpx;
				/* #ifdef H5 */
				height: calc(100vh - 336rpx);
				/* #endif */
				/* #ifdef APP */
				height: calc(100vh - 146rpx);
				/* #endif */
				overflow: hidden;

				.list-item {
					border-bottom: 1px solid #f0f0f0;

					&:not(:first-of-type) {
						margin-top: 40rpx;
					}

					.items-box {
						overflow: hidden;
						height: 250rpx;
					}

					.image_11 {
						float: left;
						border-radius: 8rpx;
						height: 220rpx;
						width: 180rpx;
					}

					.right-group {
						margin-left: 10rpx;
						width: 500rpx;
						float: left;
						flex: 1 1 auto;

						.text_11 {
							margin-left: 20rpx;
							height: 50rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							font-weight: 500;
							color: rgb(51, 51, 51);
							font-size: 36rpx;
							text-align: left;
						}

						.text_12 {
							height: 45rpx;
							margin-left: 25rpx;
							color: #666666;
							font-size: 24rpx;
							text-align: left;
							display: -webkit-box;
							overflow: hidden;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 3;
						}

						.text_13 {
							height: 40rpx;
							margin-bottom: 20rpx;
							width: 520rpx;
							overflow: hidden;
						}

						.text_14 {
							float: right;
							font-size: 20rpx;
							color: red;
							font-weight: bold;
						}
						
						.study {
							float: right;
							font-size: small;
							height: 40rpx;
							padding: 12rpx 25rpx;
							border-radius: 50rpx;
							font-weight: 500;
							font-size: 24rpx;
							color: #ffffff;
							background: -webkit-linear-gradient(to right, #ff6161, #ff9661);
							/* Safari 5.1-6.0 */
							background: -o-linear-gradient(to right, #ff6161, #ff9661);
							/* Opera 11.1-12.0 */
							background: -moz-linear-gradient(to right, #ff6161, #ff9661);
							/* Firefox 3.6-15 */
							background: linear-gradient(to right, #ff6161, #ff9661);
						}

						.text_15 {
							background: linear-gradient(90deg, #fdecd8 0%, #ffdeae 100%);
							border-radius: 20px;
							width: 160rpx;
							position: relative;
							top: 45rpx;
							left: -350rpx;
							height: 40rpx;
							color: #5b2111;
						}

						.lecturer_avater {
							float: left;
							border-radius: 50%;
							width: 50rpx;
							height: 50rpx;
							margin-left: 10rpx;
							margin-right: 10rpx;
						}

						.lecturer_nickname {
							float: left;
							height: 60rpx;
							width: 220rpx;
							overflow: hidden;
						}

						.tag-text {
							float: left;
							height: 40rpx;
							margin-left: 20rpx;
							padding: 0 10rpx;
							color: #ffa71d;
							font-size: 20rpx;
							line-height: 40rpx;
							background: #FFF5ED;
							border-radius: 5upx;
						}

						.center-group {
							margin-top: 33rpx;
							color: rgb(255, 150, 12);
							font-size: 20rpx;
							line-height: 28rpx;
							white-space: nowrap;

							.left-text-wrapper {
								background-repeat: no-repeat;
								padding: 4rpx 14rpx;
								margin-right: 20rpx;
								background: rgba(255, 150, 12, 0.12);
								border: 1rpx solid #ff960c;
								border-radius: 16rpx;
							}
						}

						.text_17 {
							margin-top: 19rpx;
							color: rgb(153, 153, 153);
							font-size: 20rpx;
							line-height: 24rpx;
							white-space: nowrap;
						}

						.text_19 {
							float: right;
							color: rgb(246, 21, 21);
							font-size: 30rpx;
							margin-top: 4rpx;
							white-space: nowrap;
						}
					}
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
					background-color: #ffffff;
				}

				.u-tab-item-active::before {
					content: '';
					position: absolute;
					border-left: 4px solid #ff960c;
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
						background: #f5f5f5;
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
</style>

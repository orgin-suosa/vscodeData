<template>
	<view class="page_bg">
		<z-paging ref="paging" class="z-paging" v-model="chapterList" @query="getExamList" :empty-view-fixed="false"
			:hide-loading-more-when-no-more-by-limit="1">
			<u-collapse :head-style="collHeadStyle" :item-style="itemStyle" :accordion="false" ref="colla">
				<u-collapse-item :title="item.exam_name" v-for="item in chapterList"
					:key="item.exam_id">
					<block>
						<view class="section" :key="item.paper_id">
							<view class="left_circle">
								<view class="direct"></view>
							</view>
							<view class="middle_text">
								<view class="title">{{item.exam_name}}</view>
								<view class="line_bg">
								</view>
							</view>
							<view class="btns">
								<block>
									<view class="btn r_btn" @tap="starPractice(item.exam_id, item.paper_id, item.exam_name)">{{doExamShow()}}</view>
								</block>
							</view>
						</view>
					</block>
				</u-collapse-item>
			</u-collapse>
		</z-paging>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	
	var that; // 当前页面对象
	export default {
		data() {
			// 页面数据变量
			return {
				topic_category_name: '',
				topic_category_id: '',
				product_id: 0,
				treeDataF: [],
				chapterList: [],
				collHeadStyle: {
					padding: '28rpx 20rpx'
				},
				itemStyle: {
					borderBottom: '2rpx solid #f9f9f9'
				},
				show: false,
				leftSelect: 0, // 左侧分类选中项
			}
		},
		// 监听 - 页面每次【加载时】执行(如：前进)
		onLoad(options = {}) {
			that = this;
			that.product_id = options.product_id;
			that.init(options)
		},
		// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
		onReady() {},
		// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
		onShow() {},
		// 监听 - 页面每次【隐藏时】执行(如：返回)
		onHide() {},
		// 函数
		computed: {
			...mapState(['Config']),
			// 做题按钮状态
			doExamShow() {
				return (sec) => {
					return '开始做题'
				}
			}
		},
		methods: {
			init(options) {
				that.topic_category_id = options.topic_category_id
				that.topic_category_name = options.topic_category_name
				uni.$on('chapterUpdate', function(data) {
					that.getExamList()
				})
			},
			// 请求考试数据
			getExamList(pageNo, pageSize) {
				// 根据id获取题库信息
				that.$.request({
					url: this.Config.URL.edu.getUserExamList,
					data: {
						'pageNum': pageNo,
						'pageSize': pageSize,
					},
					dataType: 'json',
					success: function(data, status, msg, code) {
						//保留
						that.$refs.paging.complete(data.items);
					}
				});
			},
			// 筛选完成
			screen(son) {
				this.show = false
				this.$nextTick(() => {
					this.topic_category_id = son.topic_category_id
					this.topic_category_name = this.treeDataF[this.leftSelect].topic_category_name + son
						.topic_category_name
					that.$refs.paging.reload();
				})
			},
			// 开始做题
			starPractice(exam_id, paper_id, paper_name) {
				uni.navigateTo({
					url: '/edu/course/exam/practice-page?pageTitle=章节练习&paper_id=' + paper_id + "&paper_name=" + paper_name + "&exam_id=" + exam_id + "&product_id=" + that.product_id
				})
			},
		},
		onUnload() {
			uni.$off('chapterUpdate')
		}
	}
</script>

<style lang="scss" scoped>
	.page_bg {
		height: 100vh;
		background-color: #F5F5F5;
		position: relative;
	}

	.section_1 {
		padding: 16rpx 20rpx 14rpx 21rpx;
		color: rgb(51, 51, 51);
		font-size: 28rpx;
		line-height: 34rpx;
		white-space: nowrap;
		background-color: rgb(253, 211, 3);
		box-shadow: 0px 3rpx 6rpx 0px rgba(255, 150, 12, 0.32);
		border-radius: 32rpx;
		position: absolute;
		top: 14rpx;
		left: 30rpx;

		.u-icon {
			margin-left: 6rpx;
		}
	}

	.z-paging {
		background-color: #FFFFFF;

		.section {
			display: flex;
			align-items: center;
			padding: 16rpx 20rpx 24rpx 42rpx;
			font-size: 24rpx;
			color: #333333;
			position: relative;

			.left_circle {
				width: 20rpx;
				height: 20rpx;
				background: rgba(255, 255, 255, 0.39);
				border: 2rpx solid #FDD303;
				border-radius: 50%;
				margin-right: 28rpx;
			}

			.middle_text {
				flex: 1;
				margin-right: 14rpx;

				.title {
					margin-bottom: 8rpx;
					word-break: break-all;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.line_bg {
					width: 172rpx;
					display: flex;
					align-items: center;

					.info {
						margin-left: 20rpx;
					}
				}
			}

			.btns {
				display: flex;
				align-items: center;

				.btn {
					padding: 9rpx 27rpx;
					border-radius: 30rpx;
					border: 1rpx solid #333333;
					background: #FFFFFF;
					margin-left: 12rpx;
					font-size: 20rpx;
				}

				.r_btn {
					background: #333333;
					color: #FFFFFF;
				}

				.n_btn {
					background: #999;
					border: 1rpx solid #999;
					color: #FFFFFF;
				}
			}

			.direct {
				width: 0;
				height: 60%;
				border-left: 2rpx solid #AEAEAE;
				position: absolute;
				bottom: 75%;
				left: 51rpx;
				opacity: 0.8;
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
</style>

<template>
	<view class="page_bg">
		<hr style='background-color:#F0F0F0; height:1px; border:none;'/>
		<view style="margin-left: 20rpx;margin-top: 20rpx;height: 20%;">
			<view class="exam-title">考试内容：</view>
			<view class="exam-context">{{ examInfo.exam_name }}</view>
			<view class="exam-title">考试时间：</view>
			<view class="exam-context">{{ exam_long_time_str }}</view>
		</view>
		<view class="box"></view>
		<view class="star-practice" @tap="starPractice">开始考试</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

var that; // 当前页面对象
export default {
	data() {
		// 页面数据变量
		return {
			exam_start_date: '',
			exam_end_date: '',
			exam_long_time: '', //考试时长
			exam_long_time_str: '', //考试时长(用于显示)
			product_id: 0,
			classes_id: 0,
			timeData: {},
			treeDataF: [],
			examInfo: {},
			collHeadStyle: {
				padding: '28rpx 20rpx'
			},
			itemStyle: {
				borderBottom: '2rpx solid #f9f9f9'
			},
			show: false,
			leftSelect: 0 // 左侧分类选中项
		};
	},
	// 监听 - 页面每次【加载时】执行(如：前进)
	onLoad(options = {}) {
		that = this;
		that.product_id = options.product_id;
		that.classes_id = options.classes_id;
		that.init(options);
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
			return sec => {
				return '开始做题';
			};
		}
	},
	methods: {
		init(options) {
			that.getExamList();
		},
		timeDifference(s1,s2){
			var reDate = /\d{4}-\d{1,2}-\d{1,2} /
			s1 = new Date(
			  (reDate.test(s1) ? s1 : '2018-1-1 ' + s1).replace(/-/g, '/')
			)
			s2 = new Date(
			  (reDate.test(s2) ? s2 : '2018-1-1 ' + s2).replace(/-/g, '/')
			)
			var ms = s2.getTime() - s1.getTime()
			let mss = ms / 1000 / 60
			that.exam_long_time =  mss
			const hour = Math.floor(mss / 60)
			const minute = Math.floor(mss % 60)
			let returnStr = ''
			if (hour > 0) {
			  returnStr += hour + '小时'
			}
			if (minute > 0) {
			  returnStr += minute + '分钟'
			}
			if (mss > 0 && hour <= 0 && minute <= 0) {
			  returnStr += '小于1分钟'
			}
			that.exam_long_time_str =  returnStr
		},
		// 请求考试数据
		getExamList(pageNo, pageSize) {
			// 根据id获取题库信息
			that.$.request({
				url: that.Config.URL.edu.getExamByClassesId,
				data: {
					pageNum: pageNo,
					pageSize: pageSize,
					classes_id: that.classes_id
				},
				dataType: 'json',
				success: function(data, status, msg, code) {
					that.examInfo = data.data;
					that.exam_start_date = data.exam_start_date;
					that.exam_end_date = data.exam_end_date;
					that.timeDifference(that.exam_start_date, that.exam_end_date);
				}
			});
		},
		// 筛选完成
		screen(son) {
			this.show = false;
			this.$nextTick(() => {
				this.topic_category_id = son.topic_category_id;
				this.topic_category_name = this.treeDataF[this.leftSelect].topic_category_name + son.topic_category_name;
				that.$refs.paging.reload();
			});
		},
		// 开始做题
		starPractice() {
			uni.navigateTo({
				url:
					'/edu/course/exam/practice-page?&paper_id=' +
					this.examInfo.paper_id +
					'&paper_name=' +
					this.examInfo.paper_name +
					'&exam_id=' +
					this.examInfo.exam_id +
					'&course_id=' +
					that.product_id +
					'&exam_long_time=' + this.exam_long_time
			});
		}
	},
	onUnload() {
		uni.$off('chapterUpdate');
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #FFFFFF !important;
	height: 100% !important;
}

.page_bg {
	background-color: #FFFFFF !important;
	height: 100% !important;
}

.box {
	height: 68% !important;
}

.exam-title {
	margin: 0rpx 10rpx;
	font-size: 32rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: bold;
	color: #333333;
	line-height: 45rpx;
}

.exam-context {
	margin: 10rpx;
	font-size: 32rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #666666;
	line-height: 45rpx;
}

.star-practice {
	font-size: 32rpx;
	line-height: 90rpx;
	text-align: center;
	font-weight: 500;
	color: #ffffff;
	width: 90%;
	margin-left: 5%;
	margin-right: 5%;
	height: 90rpx;
	background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
	border-radius: 45rpx;
}
</style>

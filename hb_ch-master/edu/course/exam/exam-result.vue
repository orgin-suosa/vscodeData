<template>
	<view class="page_bg">
		<hr style='background-color:#F0F0F0; height:1px; border:none;'/>
		<view class="exam_result_main">
			<view class="probability">
				<view style="font-size: 28rpx;padding-top: 60rpx;">正确率</view>
				<view style="font-size: 32rpx;margin-top: -30rpx;margin-left: 20rpx;"><span style="font-size: 80rpx;font-weight: 500;">
				{{ rightVal }}
				</span>%</view>
			</view>
			<view class="rightFalse">
				<view class="right_context">
					<image class="right_pic" src="https://qnsp.zcskjy.com/zc_images/edu_pic/right.png"></image>
					<text class="context_text1">正确</text>
					<text class="">{{ rightLength }}道</text>
				</view>
				<view class="fail_context">
					<image class="fail_pic" src="https://qnsp.zcskjy.com/zc_images/edu_pic/wrong.png"></image>
					<text class="context_text1">错误</text>
					<text class="">{{ questionLength - rightLength }}道</text>
				</view>
			</view>
		</view>
		<!-- <hr /> -->
		<view class="list_item">
			<view :class="item.status == 1 ? 'paper_item_right': 'paper_item_wrong'" @click="btnToCheck(item.no)" v-for="item in topicList">{{item.no}}</view>
		</view>
		<view class="end_btns">
			<block>
				<view class="btn" @tap="jumpToCheck">全部解析</view>
				<view class="btn wrong" @tap="getCertificate" v-if="exam_id!=null">获得奖状</view>
				<view class="btn wrong" @tap="jumpToCourseDetail" v-else>下一步</view>
			</block>
		</view>
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
			paper_id: '',
			exam_id: '',
			course_id: '',
			chapter_id: '',
			item_id: '',
			typeId: '',
			title: '',
			type: '',
			time: '',
			data: '',
			course_id: 0,
			questionLength: 0,
			rightLength: 0,
			param:{},
			topicList:[],
			single: [],
			more: [],
			judge: [],
			rightVal: 0,
			certOption: {},
		};
	},
	// 监听 - 页面每次【加载时】执行(如：前进)
	onLoad(options = {}) {
		let param = JSON.parse(decodeURIComponent(options.param))
		this.paper_id = param.paper_id;
		this.exam_id = param.exam_id;
		this.course_id = param.course_id;
		this.course_id = param.course_id;
		this.chapter_id = param.chapter_id;
		this.item_id = param.item_id;
		that = this;
		that.init(param);
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
		cType() {
			return item => {
				switch (item.status) {
					case 1:
						return 'right';
					case 2:
						return 'wrong';
					default:
						return '';
				}
			};
		}
	},
	methods: {
		// 页面数据初始化函数
		init(options) {
			this.typeId = options.id;
			this.type = options.type;
			this.time = options.time;
			let data = uni.getStorageSync('exam-result');
			if (!data) return console.log('data is null!');
			this.questionLength = data.questions.length;
			data.questions.map(v => {
				let obj = { no: v.no, status: null };
				let obj2 = data.answerCardNow[v.topic_id];
				if (obj2) obj.status = obj2.a != null ? obj2.r : null;
				if (obj.status == 1) this.rightLength++;
				that.topicList.push(obj)
				// switch (v.topic_type) {
				// 	case 1:
				// 		that.single.push(obj);
				// 		break;
				// 	case 2:
				// 		that.more.push(obj);
				// 		break;
				// 	case 0:
				// 		that.judge.push(obj);
				// 		break;
				// }
			});
			that.getRightVal();
		},

		getRightVal() {
			const numbers = (this.rightLength / this.questionLength) * 100;
			that.rightVal = Math.round(numbers * 10) / 10;
		},
		pageBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		// 跳转课程详情
		jumpToCourseDetail(){
			// let again_url = this.$.sprintf('/edu/course/class-detail?product_id=%d&item_id=%d', this.product_id, this.item_id);
			// uni.navigateTo({
			// 	url: again_url
			// });
			uni.navigateBack({
				delta: 2, //返回层数，2则上上页
			})
		},
		// 跳转解析
		jumpToCheck() {
			this.param.pageTitle = that.type;
			this.param.exam_id = that.exam_id;
			this.param.check = true;
			this.param.course_id = that.course_id;
			this.param.paper_id = that.paper_id;
			this.param.chapter_id = that.chapter_id;
			this.param.saveExamBtn = 1;
			this.param.showAllTopic = true;
			uni.navigateTo({
				url:
					'/edu/course/exam/exam-check?param=' + encodeURIComponent(JSON.stringify(this.param))
			});
		},
		// 单个按钮选择
		btnToCheck(item) {
			this.param.pageTitle = this.type;
			this.param.exam_id = this.exam_id;
			this.param.check = true;
			this.param.paper_id = this.paper_id;
			this.param.course_id = this.course_id;
			this.param.chapter_id = this.chapter_id;
			this.param.saveExamBtn = 1;
			this.param.showAllTopic = false;
			this.param.currentIndex = item;
			this.saveExamBtn = 1;
			uni.navigateTo({
				url:
					'/edu/course/exam/exam-check?param=' + encodeURIComponent(JSON.stringify(this.param))
			});
		},
		//获取证书
		getCertificate() {
			this.$.request({
				url: this.Config.URL.edu.getCourseCert,
				title: '提交中...',
				data: {
				 exam_id: this.exam_id,
			     paper_id: this.paper_id,
				 product_id: this.course_id,
				},
				success(res) {
					if(res.enable_certificate == 0){
						that.$refs.uToast.show({
							title: '课程未设置证书',
							message: '课程未设置证书',
							type: 'warning',
							duration: 1000
						});
						return;
					}
					if(!res.setting_exam){
						that.$refs.uToast.show({
							title: '课程证书未开启考试',
							message: '课程证书未开启考试',
							type: 'warning',
							duration: 1000
						});
						return;
					}
					if(res.issue){
						uni.navigateTo({
							url:
								'/edu/course/exam/exam-cert?show=true&res=' + encodeURIComponent(JSON.stringify(res))
						});	
					}
					if(!res.issue){
						uni.navigateTo({
							url:
								'/edu/course/exam/exam-cert?show=false&res=' + encodeURIComponent(JSON.stringify(res))
						});
					}
				}
			});
		},
		open() {
		},
		close() {
			this.show = false;
		}
	}
};
</script>

<style lang="scss" scoped>
page{
	background-color: #FFFFFF !important;
}
.page_bg {
	width: 100%;
	height: 100%;

	.exam_result_main {
        background: #FFFFFF;
		height: 237rpx;
		border-radius: 0px 0px 20rpx 20rpx;
	}

	.probability {
		float: left;
		width: 50%;
		text-align: center;
		font-size: 50rpx;
	}
	.rightFalse {
		float: left;
		height: 300rpx;
		width: 50%;
		text-align: center;
		.context_text1 {
			margin-right: 40rpx;
		}
		.right_context {
			position: relative;
			top: 60rpx;
			right: 30rpx;
			.right_pic {
				position: relative;
				top: 12rpx;
				width: 35rpx;
				height: 35rpx;
				margin-bottom: 5rpx;
				margin-right: 10rpx;
			}
		}
		.fail_context {
			position: relative;
			top: 80rpx;
			right: 30rpx;
			.fail_pic {
				position: relative;
				top: 12rpx;
				width: 35rpx;
				height: 35rpx;
				margin-bottom: 5rpx;
				margin-right: 10rpx;
			}
		}
	}

	.paper_item_right {
		width: 60rpx;
		margin: 43rpx;
		float: left;
		height: 60rpx;
		text-align: center;
		border-radius: 50%;
		color: #ffffff;
		font-size: 30rpx;
		background-color: rgb(35, 163, 102);
		border: 1rpx solid rgb(35, 163, 102);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.paper_item_wrong {
		width: 60rpx;
		margin: 43rpx;
		float: left;
		height: 60rpx;
		text-align: center;
		border-radius: 50%;
		color: #ffffff;
		font-size: 30rpx;
		background-color: rgb(250, 96, 41);
		border: 1rpx solid rgb(250, 96, 41);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.group_12 {
		display: flex;
		flex-wrap: wrap;

		.title {
			width: 100%;
			padding: 28rpx 0 12rpx 20rpx;
		}

		.base_circle {
			width: 72rpx;
			height: 72rpx;
			background: rgba(255, 255, 255, 0.39);
			border: 2rpx solid #999999;
			border-radius: 50%;
			text-align: center;
			line-height: 72rpx;
			margin: 0 4.4% 20rpx;
		}

		.wrong {
			color: #ffffff;
			background-color: #f90909;
			border-color: #f90909;
		}

		.right {
			color: #ffffff;
			background-color: #333;
			border-color: #333;
		}
	}

	.status_bar,
	.top_view {
		background-color: #fdcf03;
	}

	.top_nav {
		padding-bottom: 24rpx;
		color: rgb(51, 51, 51);
		font-size: 34rpx;
		line-height: 41rpx;
		white-space: nowrap;
		// height: 90rpx;
		position: relative;

		.image_1 {
			left: 21rpx;
			top: 27rpx;
			width: 19rpx;
			height: 35rpx;
			position: absolute;
		}

		.cate {
			width: 100%;
			padding: 20rpx 0;
			color: rgb(51, 51, 51);
			font-size: 34rpx;
			font-weight: 500;
			line-height: 41rpx;
			white-space: nowrap;
			text-align: center;
		}
	}

	.end_btns {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 50rpx 20rpx;
		background: #ffffff;
		font-size: 28rpx;
		display: flex;
		justify-content: space-around;

		.btn {
			width: 320rpx;
			height: 85rpx;
			background: #F4F4F4;
			border-radius: 45px;
			border: 2rpx solid rgb(244,244,244);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.wrong {
			color: #FFFFFF;
			border: 1rpx solid orange;
			background: linear-gradient(to right,#FF6F61,#FF9061);
		}
	}

	.cert {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 1350rpx;
		background-color: pink;
		.cert-image {
			width: 100%;
			height: 1350rpx;
		}
	}
	
	.list_item {
		background: #fff;
		width: 100%;
		height: 100%;
		margin-top: 10rpx;
		margin-left: 5rpx;
	}
}
</style>

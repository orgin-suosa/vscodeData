<template>
	<view class="page_bg">
		<hr style='background-color:#F0F0F0; height:1px; border:none;'/>
		<view class="main" v-show="showPaparView">
			<view ref="paging" class="z-paging" v-model="questionList" :empty-view-fixed="false" :hide-loading-more-when-no-more-by-limit="1">
				<view v-for="(item, index) in questionList">
					<scroll-view scroll-y class="scroll_bg" v-show="currentIndex == index || showAllTopic">
						<view class="item_body">
							<view style="float: left;">{{ index + 1 }}、</view>
							<view style="float: left;" v-html="item.topic_content"></view>
							<view style="float: left;">() ( {{ qType(item.topic_type) }} )</view>
						</view>
						<!-- 单选或判断 -->
						<view class="single" v-if="item.topic_type == 1 || item.topic_type == 0">
							<template>
								<view
									class="answer_item"
									v-for="(answer, a_index) in item.optionDTOList"
									:key="item.topic_id + a_index"
									@tap="choose(a_index, item.topic_answer, item, item.topic_type)"
									:class="{'item_success_selected':(a_index == answercard[item.topic_id].a),'item_fail_selected':(a_index != answercard[item.topic_id].a) }"
								>
									<view class="left_icon" :class="{'selected':(a_index == answercard[item.topic_id].a),'no_selected':(a_index != answercard[item.topic_id].a), }">{{ answer.option }}</view>
									<view style="width: 80%;">
										<text v-html="answer.content" style="float: left;"></text>
										<image v-if="a_index == answercard[item.topic_id].a" class="or_right" style="float: right;" src="https://qnsp.zcskjy.com/zc_images/edu_pic/dui.png"></image>
										<image v-else class="or_right" style="float: right;" src="https://qnsp.zcskjy.com/zc_images/edu_pic/chuo.png"></image>
									</view>
								</view>
							</template>
						</view>

						<!-- 多选 -->
						<view class="single" v-if="item.topic_type == 2">
							<view
								class="answer_item"
								v-for="(answer, a_index) in item.optionDTOList"
								:key="item.topic_id + a_index"
								@tap="choose(a_index, item.topic_answer, item, item.topic_type)"
								:class="{'item_success_selected':(answercard[item.topic_id].a && answercard[item.topic_id].a.indexOf(a_index) != -1),'item_fail_selected':(answercard[item.topic_id].a && answercard[item.topic_id].a.indexOf(a_index) == -1)}"
							>
								<view class="left_icon" :class="{'selected':(answercard[item.topic_id].a && answercard[item.topic_id].a.indexOf(a_index) != -1),'no_selected':(answercard[item.topic_id].a && answercard[item.topic_id].a.indexOf(a_index) == -1)}">
									{{ letter[a_index] }}
								</view>
								<view style="width: 80%;">
									<text v-html="answer.content" style="float: left;"></text>
									<image v-if="answercard[item.topic_id].a && answercard[item.topic_id].a.indexOf(a_index) != -1" class="or_right" style="float: right;" src="https://qnsp.zcskjy.com/zc_images/edu_pic/dui.png"></image>
									<image v-else class="or_right" style="float: right;" src="https://qnsp.zcskjy.com/zc_images/edu_pic/chuo.png"></image>
								</view>
							</view>
						</view>

						<view class="answer_check" v-if="checkAnswer">
							<view class="check_title">参考答案</view>
							<view class="right_answer">
								<text v-if="item.topic_type != 0">正确答案：{{ formatMoreTopic(item.topic_answer) }}</text>
								<text v-else>正确答案：{{ judgeAnswerShowTitle(item.topic_answer) }}</text>
								<text style="margin-left: 100rpx; color: rgb(250, 96, 41);">你的答案：{{ judgeUserAnswerShowTitle(userAnswer[index]) }}</text>
							</view>
							<view style="color: #000000;font-size: 35rpx;margin-top: 40rpx;">
								<text>题目解析</text>
								<text v-html="item.topic_analysis"></text>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<u-modal :show="modalShow" :content="content" :show-cancel-button="true" @cancel="gotoCancel" @confirm="sendExamAnswer"></u-modal>
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
			show: false,
			showPaparView: false,
			typeId: '',
			pageTitle: '',
			exam_id: '',
			paper_id: '',
			course_id: '',
			chapter_id: '',
			paper_name: '',
			product_id: 0,
			detail: [],
			questionList: [],
			userAnswer: [], //回显用户答案
			// 各类问题
			single: false,
			more: false,
			judge: false,
			saveExamBtn: 0, //交卷按钮
			currentIndex: -1, //单体解析
			showAllTopic: true, //显示所有题目
			cardHidden: true,
			checkAnswer: false,
			letter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'G', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
			// 保存提示模态框
			modalShow: false,
			content: '',
			outWay: 1 // 退出方式 0左上角退出 1交卷退出
		};
	},
	// 监听 - 页面每次【加载时】执行(如：前进)
	onLoad(options = {}) {
		that = this;
		that.product_id = options.product_id;
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
		qType() {
			return type => {
				switch (type) {
					case 1:
						return '单选';
					case 2:
						return '多选';
					case 0:
						return '判断';
				}
			};
		}
	},

	methods: {
		// 页面数据初始化函数
		init(options) {
			let param = JSON.parse(decodeURIComponent(options.param))
			this.paper_id = param.paper_id;
			this.paper_name = param.paper_name;
			this.exam_id = param.exam_id;
			this.course_id = param.course_id;
			this.chapter_id = param.chapter_id;
			if (param.check) this.checkAnswer = true;
			this.getInfo(this.exam_id, this.paper_id, this.course_id, this.chapter_id);
			//去除集合元素
			if (param.currentIndex) {
				const current = param.currentIndex - 1;
				this.typeId = param.id;
				this.pageTitle = param.pageTitle;
				this.currentIndex = Number(current);
				this.showAllTopic = param.showAllTopic
			}
		},
		open() {},
		close() {
			this.show = false;
		},
		pageBack() {
			if (!this.cardHidden) {
				this.cardHidden = true;
				return;
			}
			this.saveExam();
		},
		gotoCancel() {
			this.modalShow = false;
		},
		// 获取信息
		getInfo(exam_id, paper_id, course_id, chapter_id) {
			let str = 'client/quest-bank/kh/chapter/getOneChapter';
			that.$.request({
				url: this.Config.URL.edu.getTopicListByPaperId,
				data: {
					exam_id: exam_id,
					paper_id: paper_id,
					course_id: course_id,
					chapter_id: chapter_id
				},
				dataType: 'json',
				success: function(data, status, msg, code) {
					that.paper_id = data.paper_id;
					that.detail = data.item;
					that.questionList = data.item;
					let temp = {};
					let num = 1;
					//这个是判断历史有没有做过题，有的话拿出来然后回显数据
					let obj = that.arrayToJson(data.history, 'topic_id');
					data.item.forEach(v => {
						v.no = num;
						num++;
						if (v.topic_type == 1) that.single = true;
						if (v.topic_type == 2) that.more = true;
						if (v.topic_type == 0) that.judge = true;
						if (obj != null && obj[v.topic_id] != null) {
							temp[v.topic_id] = { a: that.formatTopicAnswer(v), r: obj[v.topic_id].r };
							if (obj[v.topic_id].a != null) {
								that.userAnswer.push(obj[v.topic_id].a);
							} else {
								that.userAnswer.push('未选');
							}
							//用户重复提交试卷，如果可以重复提交，注掉下面一行代码
							// that.saveExamBtn = 1
						} else {
							temp[v.topic_id] = {
								a: null,
								r: 0
							};
						}
					});
					that.showPaparView = true;
					that.answercard = temp;
				}
			});
		},
		arrayToJson(list, key) {
			let json = {};
			for (let i in list) {
				let item = list[i];
				json[item[key]] = item;
			}
			return json;
		},
		formatMoreTopic(topic){
			let arr = topic.split(',');
			var result = '';
			arr.sort((s, t) => {
				var a = s.toLowerCase();
				var b = t.toLowerCase();
				if (a < b) return -1;
				if (a > b) return 1;
				return 0;
			})
			for (var i = 0; i < arr.length; i++) {
				result += (arr[i]) + '、';
			}
			return result.slice(0, result.length - 1);
		},
		judgeAnswerShowTitle(selectNum) {
			switch (selectNum) {
				case '0':
					return 'A';
				case '1':
					return 'B';
				case '2':
					return 'C';
				case '3':
					return 'D';
			}
		},
		formatTopicAnswer(item){
			if(item.topic_type == 2){
				const arr = item.topic_answer.split(',');
				var result = '';
				for (var i = 0; i < arr.length; i++) {
					result += that.formatTopicAnswerOption(arr[i]) + ',';
				}
				return result.slice(0, result.length - 1);
			}else if(item.topic_type == 1){
				return that.formatTopicAnswerOption(item.topic_answer)
			}else{
				return Number(item.topic_answer)
			}
		},
		formatTopicAnswerOption(topicAnswer) {
			switch (topicAnswer) {
				case 'A':
					return 0;
				case 'B':
					return 1;
				case 'C':
					return 2;
				case 'D':
					return 3;
			}
		},
		judgeUserAnswerShowTitle(selectAnswer) {
			if (selectAnswer == '未选') {
				return selectAnswer;
			}
			const arr = selectAnswer.split(',');
			var result = '';
			for (var i = 0; i < arr.length; i++) {
				result += that.judgeAnswerShowTitle(arr[i]) + '、';
			}
			return result.slice(0, result.length - 1);
		},
		choose(index, right, item, type) {
			return false
		},
	}
};
</script>

<style lang="scss" scoped>
.page_bg {
	background-color: #ffffff;
	width: 100%;
	height: 100vh;
	overflow-y: auto;

	.status_bar,
	.top_view {
		background-color: #ffffff;
	}

	.main {
		height: calc(100vh - 188rpx);
		display: flex;
		flex-direction: column;

		.exam_title {
			font-size: 28rpx;
			font-weight: bold;
			color: #999999;
			padding: 36rpx 20rpx;
		}

		.z-paging {
			flex: 1;

			.item_top {
				margin-top: 30rpx;
				font-size: 24rpx;
				display: flex;
				justify-content: space-between;
				padding: 0 30rpx;

				.item_type {
					display: inline-block;
					padding: 5rpx 10rpx;
					background: linear-gradient(163deg, #fdd303 0%, #ff960c 100%);
					border-radius: 4rpx;
				}

				.number {
					color: #999999;
					display: flex;
					align-items: center;

					text {
						font-size: 28rpx;
						font-weight: bold;
						color: #333333;
						margin-right: 4rpx;
					}
				}
			}

			.item_body {
				font-size: 32rpx;
				line-height: 52rpx;
				font-weight: bold;
				color: #333333;
				padding: 10rpx 20rpx;
				margin-top: 20rpx;
				// min-height: 10vh;
				overflow: hidden;
			}

			.answer_item {
				display: flex;
				font-size: 32rpx;
				height: 100rpx;
				align-items: center;
				background-color: rgb(249, 249, 249);
				margin: 20rpx;
				-webkit-border-radius: 50px;
				border-radius: 50px;
				.left_icon {
					width: 60rpx;
					height: 60rpx;
					display: flex;
					margin-left: 20rpx;
					justify-content: center;
					align-items: center;
					border: 2rpx solid rgb(232, 232, 232);
					background: rgb(232, 232, 232);
					border-radius: 50%;
					font-size: 34rpx;
					color: #333333;
					margin-right: 30rpx;
				}
				
				.or_right{
					width: 30rpx;
					height: 30rpx;
					padding-top: 15rpx;
					margin-right: 15rpx;
				}

				.selected {
					color: #ffffff;
					background: #23A366;
					// box-shadow: 0px 3rpx 6rpx rgba(255, 150, 12, 0.26);
				}
				.no_selected {
					color: #ffffff;
					background: rgb(250, 96, 41);
					border-color: rgb(250, 96, 41);
					// box-shadow: 0px 3rpx 6rpx rgba(255, 150, 12, 0.26);
				}
			}

			.item_success_selected {
				background: #E6FFF3;
				color: rgb(102,102,102);
				width: 92%;
				margin-left: 4%;
				margin-right: 4%;
			}
			
			.item_fail_selected {
				background: #fff4f0;
				color: rgb(102,102,102);
				width: 92%;
				margin-left: 4%;
				margin-right: 4%;
			}

			.answer_check {
				border-top: 1px;
				padding: 40rpx 30rpx;
				margin-top: 20rpx;

				.check_title {
					font-size: 32rpx;
					margin-bottom: 10rpx;
				}

				.right_answer {
					color: rgb(35, 163, 102);
					font-size: 35rpx;
					font-weight: 400;
				}
			}
		}
	}
}
</style>

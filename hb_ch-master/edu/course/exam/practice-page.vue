<template>
	<view class="page_bg">
		<hr style='background-color:#F0F0F0; height:1px; border:none;'/>
		<view class="main" v-show="showPaparView">
			<pw-swiper ref="swiper" class="pw_swiper" :list="questionList" :dataIndex="currentIndex" @change="change">
				<template v-slot:default="{ item, index }">
					<scroll-view scroll-y class="scroll_bg">
						<view class="item_top">
							<text class="number">
								<text>
									共{{ questionList.length }}题 (
									<text style="color: rgb(250, 96, 41);">{{ index + 1 }}</text>
								</text>
								/{{ questionList.length }} )
							</text>
								<u-count-down
										:time="exam_long_time"
										format="DD:HH:mm:ss"
										autoStart
										@change="onChange"
										@finish="onFinish"
										v-if="exam_long_time!=0"
									>
										<view class="time">
											<text class="time__item">倒计时：</text>
											<text class="time__item" v-show="timeData.days>0">{{ timeData.days }}:</text>
											<text class="time__item" v-show="timeData.hours>0">{{ timeData.hours>10?timeData.hours:'0'+timeData.hours}}:</text>
											<text class="time__item"><text v-show="timeData.minutes<10">0</text>{{ timeData.minutes }}:</text>
											<text class="time__item"><text v-show="timeData.seconds<10">0</text>{{ timeData.seconds }}</text>
										</view>
									</u-count-down>
						</view>
						<u-line-progress
							style="margin: 30rpx;"
							activeColor="#FA6029"
							height="5"
							:percentage="salesprogress(index + 1, questionList.length)"
							:showText="false"
						></u-line-progress>
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
									:class="{ item_selected: a_index == answercard[item.topic_id].a }"
								>
									<view class="left_icon" :class="{ selected: a_index == answercard[item.topic_id].a }">{{ answer.option }}</view>
									<text v-html="answer.content"></text>
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
								:class="{'item_selected':(answercard[item.topic_id].a && answercard[item.topic_id].a.indexOf(a_index) != -1) }"
							>
								<view class="left_icon" :class="{ selected: answercard[item.topic_id].a && answercard[item.topic_id].a.indexOf(a_index) != -1 }">
									{{ letter[a_index] }}
								</view>
								<text v-html="answer.content"></text>
							</view>
						</view>

						<view class="answer_check" v-if="checkAnswer">
							<view class="check_title">参考答案</view>
							<view class="right_answer">
								<text v-if="item.topic_type != 0">正确答案：{{ item.topic_answer }}</text>
								<text v-else>正确答案：{{ judgeAnswerShowTitle(item.topic_answer) }}</text>
								<text style="margin-left: 100rpx; color: rgb(250, 96, 41);">你的答案：{{ judgeUserAnswerShowTitle(userAnswer[index]) }}</text>
							</view>
							<view style="font-size: 35rpx;">
								<text style="font-family: SimHei;">题目解析</text>
								<text v-html="item.topic_analysis"></text>
							</view>
							<!--<mp-html class="check_detail" :content="item.analysis"></mp-html> -->
						</view>
					</scroll-view>
				</template>
			</pw-swiper>
			<view class="end_nav" :class="{ end_nav_show: !cardHidden }">
				<block v-if="cardHidden">
					<view class="btn" :class="{ cant: currentIndex == 0 }" @tap="changeIndex('before')">上一题</view>
					<!-- <view class="icon">
						<image src="/static/images/edu_pic/edu_07.png" class="image_8" />
						<view class="text" @tap="cardHidden = false">答题卡</view>
					</view>
					<view class="icon" v-if="checkAnswer == false" @tap="checkAnswer = true">
						<image src="/static/images/edu_pic/edu_15.png" class="image_8" />
						<view class="text">答案解析</view>
					</view> -->
					<block v-if="detail && currentIndex < detail.length - 1"><view class="btn" @tap="changeIndex('after')">下一题</view></block>
					<block v-else>
						<view v-show="saveExamBtn == 0"><view class="btn" @tap="sendExam()">提交</view></view>
						<view v-show="saveExamBtn == 1"><view class="noNextTopic">下一题</view></view>
					</block>
				</block>
				<block v-else>
					<scroll-view scroll-y class="card_bg">
						<view class="card_top">
							<text class="ready"></text>
							已选
							<text class="not_ready"></text>
							未选
						</view>
						<view class="card_main">
							<!-- 单选 -->
							<block v-if="single">
								<view class="title">单选</view>
								<view
									class="item_bg"
									v-for="item in detail"
									:key="item.topic_id"
									v-if="item.topic_type == 1"
									@tap="
										cardHidden = true;
										currentIndex = item.no - 1;
									"
								>
									<view class="item" :class="{ selected: answercard[item.topic_id].r != 0 }">{{ item.no }}</view>
								</view>
							</block>
							<!-- 多选 -->
							<block v-if="more">
								<view class="title">多选题</view>
								<view
									class="item_bg"
									v-for="item in questionList"
									:key="item.topic_id"
									v-if="item.topic_type == 2"
									@tap="
										cardHidden = true;
										currentIndex = item.no - 1;
									"
								>
									<view class="item" :class="{ selected: answercard[item.topic_id].r != 0 }">{{ item.no }}</view>
								</view>
							</block>
							<!-- 判断 -->
							<block v-if="judge">
								<view class="title">判断题</view>
								<view
									class="item_bg"
									v-for="item in questionList"
									:key="item.topic_id"
									v-if="item.topic_type == 0"
									@tap="
										cardHidden = true;
										currentIndex = item.no - 1;
									"
								>
									<view class="item" :class="{ selected: answercard[item.topic_id].r != 0 }">{{ item.no }}</view>
								</view>
							</block>
						</view>
					</scroll-view>
					<view v-show="saveExamBtn == 0"><view class="save_btn" @tap="sendExam()">交卷</view></view>
				</block>
			</view>
			<view class="cancel-order-dialog" v-show="showOrderDialog">
				<view class="box">
					<view style="padding: 50rpx 80rpx">
						<view style="color: #191919;font-weight: 600;font-size: 32rpx;margin-bottom: 15rpx;">提交答案</view>
						<view style="color: #979797">{{content}}</view>
					</view>
					<view class="box-btn-group">
						<a class="box-btn-cancel" @click="showOrderDialog = false">{{ __('取消') }}</a>
						<a class="box-btn-await" @click="sendExamAnswer">{{ __('确认') }}</a>
					</view>
				</view>
			</view>
			<view class="aclass-detail-order-dialog" v-show="autoCommitExamDialog">
				<view class="abox">
					<text class="abox-title">{{__("温馨提示")}}</text>
					<view class="abox-evaluation-font">{{__("考试时间已到，将自动提交试卷！")}}</view>
					<view class="abox-btn-group">
						<a class="abox-btn-pay" @click="authCommitExam">{{__("知道了")}}</a>
					</view>
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
			autoCommitExamDialog: false,
			typeId: '',
			exam_id: '',
			course_id: '',
			chapter_id: '',
			item_id: '',
			paper_id: '',
			product_id: 0,
			timeData: {},
			exam_long_time: 0,//考试时长
			detail: [],
			questionList: [],
			userAnswer: [], //回显用户答案
			answercard: {}, //留有最新结果的答题版
			answercardNew: {}, //本次答的题目，用于统计
			answercardForRest: [],
			param:{},
			// 各类问题
			single: false,
			more: false,
			judge: false,
			saveExamBtn: 0, //交卷按钮
			unAnsweredNum: 0,//未答题数
			autoCommitContextShow: false,//自动提示文字
			currentIndex: 0,
			cardHidden: true,
			checkAnswer: false,
			letter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'G', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
			// 保存提示模态框
			showOrderDialog: false,
			modalShow: false,
			content: '',
			outWay: 1 // 退出方式 0左上角退出 1交卷退出
		};
	},
	// 监听 - 页面每次【加载时】执行(如：前进)
	onLoad(options = {}) {
		that = this;
		if(!options.exam_long_time){
			uni.setNavigationBarTitle({
			    title:this.__('章节练习')
			});
		}
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
			this.paper_id = options.paper_id;
			this.exam_id = options.exam_id;
			this.course_id = options.course_id;
			this.item_id = options.item_id;
			this.chapter_id = options.chapter_id;
			if (options.currentIndex) {
				this.typeId = options.id;
				this.currentIndex = Number(options.currentIndex);
				this.saveExamBtn = options.saveExamBtn;
			}
			//倒计时
			if(options.exam_long_time){
				this.exam_long_time = options.exam_long_time * 60 * 1000
			}
			if (options.check) this.checkAnswer = true;
			this.getInfo(this.exam_id, this.paper_id, this.course_id, this.chapter_id);
		},
		salesprogress(num, total) {
			const num1 = Math.floor(100 / total);
			const num2 = num1 * num;
			if (num == total && num2 < 100) {
				return 100;
			}
			return num2;
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
		authCommitExam() {
			this.autoCommitExamDialog = false;
			this.sendExamAnswer();
		},
		// 获取信息
		getInfo(exam_id, paper_id, course_id, chapter_id) {
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
						//如果存在历史记录
						// if (obj != null && obj[v.topic_id] != null) {
						// 	temp[v.topic_id] = { a: obj[v.topic_id].a, r: obj[v.topic_id].r };
						// 	if (obj[v.topic_id].a != null) {
						// 		that.userAnswer.push(obj[v.topic_id].a);
						// 	} else {
						// 		that.userAnswer.push('未选');
						// 	}
						// 	//用户重复提交试卷，如果可以重复提交，注掉下面一行代码
						// 	// that.saveExamBtn = 1
						// } else {
						// 	temp[v.topic_id] = {
						// 		a: null,
						// 		r: 0
						// 	};
						// }
						// 不回显答案
						temp[v.topic_id] = {
							a: null,
							r: 0
						};
					});
					that.showPaparView = true;
					that.answercard = temp;
				}
			});
		},
		onChange(e) {
			this.timeData = e
		},
		onFinish(e){
			//时间到了自动交卷
			//this.autoCommitContextShow = true;
			this.autoCommitExamDialog = true;
			// this.sendExamAnswer();
		},
		arrayToJson(list, key) {
			let json = {};
			for (let i in list) {
				let item = list[i];
				json[item[key]] = item;
			}
			return json;
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
			//选择的时候判断对错，并封装到answercard中
			let res = this.answercard[item.topic_id];
			if (!Array.isArray(res.a) && res.a != null) {
				const resA = '[' + res.a + ']';
				res.a = JSON.parse(resA);
			}
			//单选 判断
			let single_index = 0;
			if (type == 1 || type == 0) {
				if (type == 1) {
					switch (index) {
						case 0:
							single_index = 'A';
							break;
						case 1:
							single_index = 'B';
							break;
						case 2:
							single_index = 'C';
							break;
						case 3:
							single_index = 'D';
							break;
					}
				}
				if (type == 1) {
					res = {
						a: index,
						r: single_index == right ? 1 : 2
					};
				} else {
					res = {
						a: index,
						r: index == right ? 1 : 2
					};
				}
			} else if (type == 2) {
				// debugger
				if (res.a == null) {
					//第一次选择
					res.a = [index];
				} else {
					const params = {};
					params.topic_id = item.topic_id;
					params.a = res.a;
					params.r = res.r;
					//判断是选中还是取消
					const find_index = res.a.indexOf(index);
					if (find_index > -1) {
						if (res.a.length < 2) {
							this.$refs.uToast.show({
								title: '请至少选择一个答案',
								message: '请至少选择一个答案',
								type: 'warning',
								duration: 1000
							});
							return;
						}
						res.a.splice(find_index, 1);
					} else {
						res.a.push(index);
					}
				}
				//判断答案是否正确
				let my_choice = res.a
					.sort(function(a, b) {
						return a - b;
					})
					.join(',');
				let answerArr = [];
				let topic_answer = item.topic_answer.split(',');
				//对答案进行处理
				topic_answer.forEach((item, index) => {
					switch (item) {
						case 'A':
							answerArr.push(0);
							break;
						case 'B':
							answerArr.push(1);
							break;
						case 'C':
							answerArr.push(2);
							break;
						case 'D':
							answerArr.push(3);
							break;
					}
				});
				let answer_str = answerArr
					.sort(function(a, b) {
						return a - b;
					})
					.join(',');
				res.r = my_choice == answer_str ? 1 : 2;
			}

			if (Array.isArray(res.a)) {
				res.a = res.a.toString();
				this.answercard[item.topic_id] = res;
				this.answercardNew[item.topic_id] = res;
			} else {
				this.answercard[item.topic_id] = res;
				this.answercardNew[item.topic_id] = res;
			}
		},
		change(e) {
			this.currentIndex = e;
		},
		changeIndex(type) {
			if (type == 'before' && this.currentIndex > 0) {
				this.$refs.swiper.goPrevious();
				return;
			}
			if (type == 'after' && this.currentIndex < this.detail.length - 1) {
				this.$refs.swiper.goNext();
				return;
			}
		},
		getNowFormatDate() {
			let dateTime;
			let yy = new Date().getFullYear();
			let mm = new Date().getMonth() + 1 < 10 ? '0' + new Date().getMonth() : new Date().getMonth();
			let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
			let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
			let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
			let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
			dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
			return dateTime;
		},
		// 退出前弹框提示
		saveExam() {
			this.content = '退出并保存当前进度么？';
			this.modalShow = true;
			this.outWay = 0;
		},
		// 交卷提示
		sendExam() {
			const userAnswerJSON = JSON.stringify(that.answercard)
			const userAnswerObj = JSON.parse(userAnswerJSON)
			for (let userAnswer in userAnswerObj) {
				if(userAnswerObj[userAnswer].a == null){
					this.unAnsweredNum = this.unAnsweredNum + 1
				}
			}
			if(this.unAnsweredNum >= 1){
				this.content = '你还有' + this.unAnsweredNum + '未作答，确认提交吗？';	
			}else{
				this.content = '确认交卷么？';
			}
			this.showOrderDialog = true
			// this.modalShow = true;
			// this.outWay = 1;
			this.unAnsweredNum = 0;
		},

		async saveExam() {
			that.$.request({
				url: this.Config.URL.edu.saveExam,
				data: {
					exam_id: that.exam_id,
					paper_id: that.paper_id,
					course_id: that.course_id,
					chapter_id: that.chapter_id,
					user_answer: JSON.stringify(that.answercard)
				},
				dataType: 'json',
				success: function(data, status, msg, code) {
					that.chapters = data;
				}
			});
		},

		// 交卷
		sendExamAnswer() {
			this.showOrderDialog = false
			let cateInfo = uni.getStorageSync('bank_cate');
			// 只更新本次选择过的答案
			that.saveExam();
			// 退出方式为点交卷
			let result = {
				answerCardNow: that.answercard,
				questions: that.questionList
			};
			let time = that.getNowFormatDate();
			that.modalShow = false;
			uni.setStorageSync('exam-result', result);
			if(that.autoCommitContextShow){
				that.$refs.uToast.show({
					title: '考试时间已到，将自动提交试卷！',
					message: '考试时间已到，将自动提交试卷！',
					type: 'error',
					duration: 1200
				});
			}else{
				that.$refs.uToast.show({
					title: '交卷成功',
					message: '交卷成功',
					type: 'success',
					duration: 1200
				});
			}
			this.param.id = this.typeId;
			this.param.paper_id = this.paper_id;
			this.param.exam_id = this.exam_id;
			this.param.product_id = this.product_id;
			this.param.course_id = this.course_id;
			this.param.chapter_id = this.chapter_id;
			this.param.item_id = this.item_id;
			setTimeout(
				() =>
					uni.navigateTo({
						url:
							'/edu/course/exam/exam-result?param=' + encodeURIComponent(JSON.stringify(this.param))
					}),
				1200
			);
			//防止返回时重复提交
			this.saveExamBtn = 1
		}
	}
};
</script>

<style lang="scss" scoped>
	.time {
	    @include flex;
	    align-items: center;
	    &__item {
	         color: #666666;
	         font-size: 12px;
	     }
	}
.page_bg {
	background-color: #ffffff;
	width: 100%;
	height: 100vh;
	overflow-y: auto;

	.status_bar,
	.top_view {
		background-color: #ffffff;
	}
	
	.aclass-detail-order-dialog {
		position: fixed;
		display: flex;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		text-align: center;
		z-index: 2002;
		background: rgba(0, 0, 0, 0.5);
		justify-content: center;
		align-items: center;
	}
	
	.aclass-detail-order-dialog .abox {
		margin-top: -24%;
		height: 20%;
		width: 75%;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	
	}
	
	.aclass-detail-order-dialog .abox-title {
		display: inline-block;
		padding: 35rpx 0 15rpx 0;
		color: #333333;
	
	}
	
	.aclass-detail-order-dialog .abox-evaluation-font {
		padding: 0 60rpx 35rpx;
		color: rgba(51, 51, 51, 0.56);
	}
	
	.abox-btn-group {
		bottom: 0;
		float: bottom;
	}
	
	.abox-btn-pay {
		color: #F43D3E;
		background: #FFFFFF;
		display: block;
		padding: 20rpx 0;
		border-bottom-left-radius: 15rpx;
		border-bottom-right-radius: 15rpx;
		border-top: 1.75rpx solid #f5f5f5;
		font-weight: bold;
	}

	.noNextTopic {
		width: 320rpx;
		height: 80rpx;
		color: rgb(102, 102, 102);
		background: rgb(244, 244, 244);
		border-radius: 33rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.cancel-order-dialog {
		position: fixed;
		display: flex;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		text-align: center;
		z-index: 2002;
		background: rgba(0, 0, 0, 0.5);
		justify-content: center;
		align-items: center;
	}
	
	.cancel-order-dialog .box {
		margin: 0 auto;
		width: 80%;
		background-color: #ffffff;
		border-radius: 20rpx;
	}
	
	.box-btn-group {
		justify-content: space-between;
		display: flex;
		flex-direction: row;
		border-top: 1rpx solid #eeeeee;
	}
	
	.box-btn-group a {
		display: inline-block;
		padding: 20rpx 20rpx;
		font-size: 32rpx;
		font-weight: 500;
	}
	
	.box-btn-cancel {
		width: 50%;
		border-right: 1rpx solid #eeeeee;
		color: #000000;
	}
	
	.box-btn-await {
		width: 50%;
		color: #f43d3e;
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

		.pw_swiper {
			flex: 1;

			.scroll_bg {
				height: 100%;
			}

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
				padding: 28rpx 30rpx;
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

				.selected {
					color: #ffffff;
					background: rgb(250, 96, 41);
					border-color: rgb(250, 96, 41);
					box-shadow: 0px 3rpx 6rpx rgba(255, 150, 12, 0.26);
				}
			}

			.item_selected {
				background: #fff4f0;
				color: #fa6029;
			}

			.answer_check {
				border-top: 1px solid #f0f0f0;
				padding: 40rpx 30rpx;
				margin-top: 20rpx;

				.check_title {
					font-family: SimHei;
					font-size: 35rpx;
					margin-bottom: 10rpx;
				}

				.right_answer {
					color: rgb(35, 163, 102);
					font-size: 35rpx;
					font-weight: 400;
				}
			}
		}

		.end_nav {
			position: fixed;
			left: 0;
			bottom: 0;
			right: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 50rpx 20rpx;
			background-color: #ffffff;

			.btn {
				color: #ffffff;
				background-color: #333333;
				border-radius: 45rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 320rpx;
				height: 80rpx;
				background: linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
			}

			.cant {
				width: 320rpx;
				color: rgb(102, 102, 102);
				background: rgb(244, 244, 244);
			}

			.icon {
				text-align: center;
				font-size: 20rpx;
				font-weight: 400;
				color: #333333;

				.image_8 {
					width: 42rpx;
					height: 42rpx;
				}

				.u-icon {
					margin-bottom: 6rpx;
				}
			}

			.card_bg {
				height: 100%;
				width: 100%;

				.card_top {
					display: flex;
					align-items: center;
					margin-bottom: 65rpx;

					.ready,
					.not_ready {
						display: inline-block;
						width: 44rpx;
						height: 44rpx;
						border-radius: 50%;
						margin: 0 22rpx;
					}

					.ready {
						background: rgba(255, 150, 12, 1);
						box-shadow: 0px 3rpx 6rpx rgba(255, 150, 12, 1);
					}

					.not_ready {
						border: 2rpx solid #999999;
						margin-left: 60rpx;
					}
				}

				.card_main {
					display: flex;
					flex-wrap: wrap;

					.title {
						font-size: 30rpx;
						font-weight: bold;
						margin-bottom: 28rpx;
						width: 100%;
					}

					.item_bg {
						width: 20%;
						display: flex;
						align-items: center;
						margin-bottom: 36rpx;

						.item {
							width: 72rpx;
							height: 72rpx;
							background: rgba(255, 255, 255, 0.39);
							border: 2rpx solid #999999;
							border-radius: 50%;
							display: flex;
							justify-content: center;
							align-items: center;
							margin-left: 20rpx;
						}

						.selected {
							color: #ffffff;
							background: #ff960c;
							border-color: #ff960c;
							box-shadow: 0px 3rpx 6rpx rgba(255, 150, 12, 0.26);
						}
					}
				}
			}

			.save_btn {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 98rpx;
				background: #333333;
				color: #ffffff;
				line-height: 98rpx;
				text-align: center;
			}
		}

		.end_nav_show {
			margin-top: 30rpx;
			height: calc(100vh - 230rpx);
			box-shadow: none;
		}
	}
}
</style>

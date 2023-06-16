/** * @tpl 直播 - 实时聊天模板 - nvue内嵌式 * @user_nickname andy by 2019-10-27 */

<template>
	<view class="wrap__floatInputPanel" :style="{ height: winHeight, width: winWidth }" v-if="(showFloatInputView)">
		<view class="floatInput-mask" @tap="close"></view>
		<scroll-view class="floatInput-body">
			<scroll-view class="wrap_fastMsgTpl" scroll-x show-scrollbar="false" v-if="false">
				<text class="mtpl_item">666👍</text>
				<text class="mtpl_item">高颜值</text>
				<text class="mtpl_item">盘他🐶</text>
				<text class="mtpl_item">为TA疯狂打call</text>
				<text class="mtpl_item">老司机带带我</text>
				<text class="mtpl_item">确认过眼神，遇上对的人</text>
			</scroll-view>
			<view class="wrap__editorPanel">
				<switch color="#feb719" style="transform: scale(0.7,0.7)" v-if="false" />
				<view class="wrap_editor">
					<textarea
						class="editor"
						v-model="editorText"
						show-confirm-bar="false"
						cursor-spacing="15"
						:selection-start="editorLastCursor"
						:selection-end="editorLastCursor"
						auto-height
						@input="bindEditorInput"
						@focus="bindEditorFocus"
						@blur="bindEditorBlur"
						placeholder="与TA聊点什么"
					/>
				</view>
				<view class="wrap_editor_btn" @tap="handleShowEmotion"><text class="iconfont  editor_btn_ico">&#xe67e;</text></view>
				<view class="wrap_editor_btn btn_submit" @tap="handleSubmit"><text class="iconfont editor_btn_ico">&#xe62c;</text></view>
			</view>
			<view v-if="showEmotionView" class="wrap_emotion nlv_borT">
				<view class="emotion__cells">
					<swiper class="emotion-swiper" :indicator-dots="true" :duration="200" indicator-color="#dbdbdb" indicator-active-color="#999">
						<swiper-item v-for="(item, index) in emotionList" :key="index">
							<view class="face_list">
								<block v-for="(item2, index2) in item.nodes" :key="index2">
									<view class="face_list_item" @tap="handleEmotionTaped(item2)">
										<image v-if="item2 == 'del'" class="face-del" src="/static/emotion_del.png" mode="widthFix" />
										<text v-else class="face-emoj">{{ item2 }}</text>
									</view>
								</block>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

const emotionJson = require('./mock-emotion.js');
export default {
	data() {
		return {
			showFloatInputView: false,
			showEmotionView: false,
			editorText: '',
			editorLastCursor: null,
			emotionList: emotionJson,
			rollMsgList: [],
			winHeight: 0,
			winWidth: 0,
		};
	},
	computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', '__', 'sprintf', 'getMsg', '$Socket', '$apiconfig']),

	props: ['vlist', 'anchor'],
	watch: {
		anchor: function(newVal, oldVal) {
			console.info('anchor');

			if (typeof oldVal.zid == 'undefined') {
				//加入群
			} else {
				if (newVal.zid != oldVal.zid) {
					//退出旧的群组，进入新群

					//退出群
					var mine = {
						id: this.userInfo.im.puid,
						user_id: this.userInfo.user_id,
						mine: true
					};

					var to = {
						id: oldVal.puid,
						zid: oldVal.zid,
						type: 'leave_group'
					};

					var chat_data = {
						mine: mine,
						to: to
					};

					this.$Socket.nsend(chat_data);
				}
			}

			//加入新群组
			setTimeout(() => {
				var mine = {
					id: this.userInfo.im.puid,
					user_id: this.userInfo.user_id,
					mine: true
				};

				var to = {
					id: newVal.puid,
					zid: newVal.zid,
					type: 'join_group'
				};

				var chat_data = {
					mine: mine,
					to: to
				};

				this.$Socket.nsend(chat_data);
			}, 100);

			console.info(typeof oldVal.zid == 'undefined');
			console.info(newVal);
		},
		getMsg: function(val) {
			let that = this;
			let cacheid = 0;
			console.log('获取到数据');
			console.log(val);
		}
	},
	beforeCreate() {
		// #ifdef APP-PLUS
		const domModule = weex.requireModule('dom');
		domModule.addRule('fontFace', {
			fontFamily: 'zc',
			src: "url('../../../static/fonts/zc_iconfont.ttf')"
		});
		// #endif
	},
	created: function() {
		let that = this;
		// #ifdef MP-WEIXIN
		
		this.winHeight = uni.getSystemInfoSync().windowHeight;
		this.winWidth = uni.getSystemInfoSync().windowWidth;
		// #endif
	},
	destroyed() {
		console.log('A组件被destroyed');

		//退出群
		var mine = {
			id: this.userInfo.im.puid,
			user_id: this.userInfo.user_id,
			mine: true
		};

		var to = {
			id: this.anchor.puid,
			zid: this.anchor.zid,
			type: 'leave_group'
		};

		var chat_data = {
			mine: mine,
			to: to
		};

		this.$Socket.nsend(chat_data);
	},
	methods: {
		...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'showCartNum', 'resetWeidu']),
		show(index) {
			this.rollMsgList = this.vlist[index].rollmsg;
			this.showFloatInputView = true;
			this.updateHeights();
		},

		updateHeights() {
			this.$nextTick(() => {
				uni.createSelectorQuery()
					.in(this)
					.selectAll('.wrap__floatInputPanel')
					.boundingClientRect(res => {
						var heights = 0;
						if (res.length > 0) {
							heights = res.map(item => item.height);
						}

				
					this.updateHeight(this.winHeight - 54)
					})
					.exec();
			});
		},
		close() {
			this.showFloatInputView = false;
			this.showEmotionView = false;
			this.updateHeight(this.winHeight,1)
			uni.hideKeyboard();
		},
		handleShowEmotion() {
			uni.hideKeyboard();
			console.log(this.winHeight)
			console.log(this.winHeight)
			this.updateHeight(this.winHeight - 338)
			this.showEmotionView = true;
		},
		bindEditorInput(e) {
			this.editorLastCursor = e.detail.cursor;
		},
		bindEditorFocus(e) {
			console.log(e.detail.height);
			var h = uni.getSystemInfoSync().windowHeight;
			var heights = e.detail.height;
			// this.$emit('confirm', h - heights);
		},
		bindEditorBlur(e) {
			this.editorLastCursor = e.detail.cursor;
			// this.updateHeight(this.winHeight,1)
		},
		handleEmotionTaped(emoj) {
			if (emoj == 'del') return;
			let startStr = this.editorText.substr(0, this.editorLastCursor);
			let endStr = this.editorText.substr(this.editorLastCursor);
			this.editorText = startStr + `${emoj}` + endStr;
		},

		isEmpty(html) {
			return html.replace(/\r\n|\n|\r/, '').replace(/(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, '') == '';
		},
		handleSubmit() {
			
			this.updateHeight(this.winHeight,1)
			if (this.isEmpty(this.editorText)) {
				return;
			}
			
			

			//todo IM群组发送消息
			let msglist = this.rollMsgList;
			let len = msglist.length;
			let data = { id: `20190${++len}`, uname: this.userInfo.user_nickname + '：', content: this.editorText };
			msglist.unshift(data); //插入到数组第一个
			this.rollMsgList = msglist;

			//发送消息给主播
			let type = 'text';
			let content = { text: this.editorText };
			let message_id = 0;
			var mine = {
				username: this.userInfo.user_nickname,
				avatar: this.userInfo.user_avatar,
				id: this.userInfo.im.puid,
				user_id: this.userInfo.user_id,
				content: content.text || content.url,
				length: type == 'voice' ? content.length : 0,
				w: type == 'img' ? content.w : 0,
				h: type == 'img' ? content.h : 0,
				item_id: typeof content.item_id != 'undefined' ? content.item_id : 0,
				type: type,
				mine: true
			};
			console.info(this.anchor);
			console.info(JSON.stringify(this.anchor));
			var to = {
				id: this.anchor.puid,
				zid: this.anchor.zid,
				friend_id: this.anchor.user_id,
				user_id: this.anchor.user_id,
				name: this.anchor.name,
				avatar: this.anchor.avatar,
				type: this.anchor.type
			};

			var chat_data = {
				mine: mine,
				to: to
			};
			this.$Socket.nsend(chat_data);

			this.editorText = '';
			this.showFloatInputView = false;
			this.showEmotionView = false;

	
			uni.hideKeyboard();
		},
		
		updateHeight(h,t) {
			// #ifdef MP-WEIXIN
			this.$emit('confirm',h,t);
			// #endif
		},
	}
};
</script>

<style scoped>
.iconfont {
	/* #ifdef APP-PLUS-NVUE */
	font-family: zc;
	/* #endif */

	/* #ifndef APP-PLUS-NVUE */
	font-family: 'zc' !important;
	font-size: 46upx;
	font-style: normal;
	line-height: 1;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/* #endif */
}
.nlv_borT {
	border-color: #ebebeb;
	border-style: solid;
	border-top-width: 1upx;
}
.wrap__floatInputPanel {
}
.floatInput-mask {
	background-color: #000;
	opacity: 0.6;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 201910;
}
.floatInput-body {
	overflow: hidden;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 201911;
}
.wrap_fastMsgTpl {
	/* #ifndef APP-PLUS-NVUE */
	white-space: nowrap;
	/* #endif */
	flex: 1;
	flex-direction: row;
	margin-bottom: 20upx;
}
.mtpl_item {
	background-color: #fff;
	border-radius: 50upx;
	color: #353535;
	font-size: 28upx;
	margin: 0 10upx;
	padding: 0 20upx;
	line-height: 70upx;
}
.wrap__editorPanel {
	flex-direction: row;
	align-items: center;
	background-color: #fff;
	padding: 20upx 30upx;
	padding-left: 10upx;
}
.wrap_editor {
	flex: 1;
	overflow: hidden;
}
.editor {
	font-size: 14px;
	line-height: 1.2;
}
.wrap_editor_btn {
	justify-content: center;
	padding: 0 4px;
	height: 28px;
}
.editor_btn_ico {
	color: #999;
	font-size: 22px;
}
.btn_submit {
	border-radius: 20px;
	font-size: 14px;
	margin-left: 5px;
	padding: 0 3px;
	line-height: 28px;
}
.wrap_emotion {
	background-color: #f7f8f9;
	height: 580upx;
}
.emotion__cells {
	flex: 1;
	position: relative;
}
.emotion-swiper {
	flex: 1;
}
.face_list {
	flex-direction: row;
	flex-wrap: wrap;
	margin-right: -15upx;
	padding: 30upx 0 0 20upx;
}
.face_list_item {
	align-items: center;
	justify-content: center;
	margin-top: 40upx;
	margin-right: 15upx;
	height: 90upx;
	width: 90upx; /*background: red;*/
}
.face-emoj {
	font-size: 50upx;
}
.face-del {
	height: 60upx;
	width: 60upx;
}

.show_is {
	display: none;
}
</style>

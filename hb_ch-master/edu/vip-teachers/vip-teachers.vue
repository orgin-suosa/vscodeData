<template>
	<view class="container">
		<view class="status-bar"></view>
		<text class="page_title">大咖观点</text>
		<subsection style="width: 690rpx;margin-left: 30rpx;margin-right: 30rpx;margin-top: 30rpx;"
			:subsectionIndex="currentIndex" :selectionList="selectionList" @changeBtnIndex="changeBtnIndex">
		</subsection>

		<scroll-view scroll-y="true" :style="{ height: clientHeight + 'px' }" @scrolltolower="scrolltolower">

			<findTeacher ref="findT" v-if="currentIndex==0" :viewHeight="clientHeight" :followPartHeight="followPartHeight">
			</findTeacher>

			<look-hot-teacher ref="lookhot" v-if="currentIndex==1" :viewHeight="clientHeight"></look-hot-teacher>

			<followTeacher ref="followT" v-if="currentIndex==2" :viewHeight="clientHeight"></followTeacher>
		</scroll-view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import subsection from '../../components/subsection/index.vue';

	import findTeacher from '@/edu/vip-teachers/components/find-teacher/find-teacher.vue';
	import followTeacher from '@/edu/vip-teachers/components/follow-teacher/follow-teacher.vue';
	import lookHotTeacher from '@/edu/vip-teachers/components/look-hot/look-hotview.vue';

	export default {
		components: {
			subsection,
			findTeacher,
			followTeacher,
			lookHotTeacher
		},
		data() {
			return {
				//tab的index
				currentIndex: 0,
				//内容高度
				clientHeight: 0,
				selectionList: [{
						name: '找大咖',
						show_fg: 0,
					},
					{
						name: '看热点',
						show_fg: 0,
					},
					{
						name: '跟大咖',
						show_fg: 0,
					},
				],
			}
		},
		// 函数
		computed: {
			...mapState(['Config', 'hasLogin']),
		},

		onReady() {
			let that = this;
			// uni.getSystemInfo({
			// 	success(res) {
			// 		//228是title和tab的高度和
			// 		that.clientHeight = res.windowHeight - res.statusBarHeight - uni.upx2px(198);
			// 		that.followPartHeight = that.clientHeight - uni.upx2px(350)
			// 	}
			// })
		},

		onLoad() {
			let that = this;
			uni.$on('attentionChange', res => { //单条记录的刷新
			     // alert('attentionChange='+res)
			})

			uni.getSystemInfo({
				success(res) {
					//228是title和tab的高度和
					that.clientHeight = res.windowHeight - res.statusBarHeight - uni.upx2px(198);
					that.followPartHeight = that.clientHeight - uni.upx2px(350)
				}
			})

		},
		onUnload() {
			uni.$off('attentionChange')
		},
		
		onShow() {
			 this.$refs.findT.refresh()
		},
		methods: {
			changeBtnIndex(type) {
				this.currentIndex = type;
			},

			getClientStatusBarHeight() {
				const res = uni.getSystemInfoSync();
				const system = res.platform;
				if (system === 'ios') {
					return res.statusBarHeight
				} else if (system === 'android') {
					return res.statusBarHeight
				} else {
					return 0;
				}
			},
			scrolltolower() {
				if (this.currentIndex == 2)
					this.$refs.followT.loadmore()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: #FAFAFD;
	}

	.status-bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #fff;
	}

	.page_title {
		width: 100%;
		height: 88rpx;
		text-align: center;
		font-size: 36rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 88rpx;
		background-color: #fff;
		border-bottom: 1px #E6E5E5 solid;
	}

	.tab_page2 {}

	.tab_page3 {
		width: 100%;
		height: auto;
		flex-direction: column;
		display: flex;
		align-items: center;
	}
</style>

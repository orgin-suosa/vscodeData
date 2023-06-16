<template>
	<view>
		<scroll-view class="list" scroll-y @scrolltolower="scrolltolower()">
			<view class="video-contentview " style="">
				<block v-for="(model, index2) in itemsModelArr" :key="index2">
					<videoitem :itemmodel="model" @click="onVideoClick(index2)"> </videoitem>
				</block>
			</view>
			<view style="width: 100%;text-align: center;" v-if="!itemsModelArr.length>0">暂无数据</view>
			<!-- <uni-load-more :status="status" ></uni-load-more> -->
			<aexplan-view v-if="itemsModelArr.length >0"></aexplan-view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import videoitem from '@/components/cd-video-item/cd-video-item.vue'


	export default {

		name: "cs-video-list",

		components: {
			videoitem
		},
		computed: {
			...mapState(['Config', 'userInfo', 'notice', 'hasLogin']),
		},
		data() {
			return {
				//展示的列表数据  
				itemsModelArr: [],
				loadPageFlag: true,
				requestUrl:'',
				mobile:''
			}
		},

		onLoad() {
			let that = this;
			that.mobile = that.userInfo.user_mobile.includes('+86') ? this.userInfo.user_mobile.slice(3) : this
				.userInfo.user_mobile;
			that.getData(-1)
		},
		methods: {
			
			getData(val) {
				
				var that = this;
				let params = {
					'mobile': that.mobile,
				};
				uni.request({
					url: that.Config.getPsVideoList,
					data: params,
					success: (res) => {
						if (res.data && res.data.result) {
							that.setData({
								loadPageFlag: true,
								itemsModelArr: res.data.result,
							});
						}
					}
				})
			},
			// 组件点击事件
			onVideoClick(index) {
				// console.log(index, tag);
				let model = this.itemsModelArr[index];
				let title = model.mediaName;
				let url = model.mediaUrl;
				let time = model.mediaTime;
				let cover = model.cover;
				uni.navigateTo({
					url: `/edu/cs-video-play/cs-video-play?title=${title}&url=${url}&time=${time}&cover=${cover}`
				});
			},
			scrolltolower: function() {

				console.log('----scrolltolower---loadMore----');
			},
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		width: 100%;
		height: 100%;
	}

	.video-contentview {

		// background-color: #0077AA;
		padding: 20rpx 20rpx;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		align-content: flex-start;
		flex-wrap: wrap;
		justify-content: space-between;
	}
</style>

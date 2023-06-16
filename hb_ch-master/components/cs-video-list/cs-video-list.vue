<template>

	<view class="uni-tab-bar page" style="background-color: #fff;">

		<view style="border-bottom:#F0F0F0 1rpx solid;padding:85rpx 30rpx 0rpx;">
			<scroll-view id="tab_tab-bar" style="" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft"
				style="background: #ffffff;border: 0;">
				<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list"
					:class="tabIndex==index ? 'active' : ''" :id="'tab_'+tab.id" :data-current="index" style=""
					@click="tapTab">
					<view class="text"
						:style="index == tabIndex ?'color:#F43D3E;font-size: 34rpx;':'font-size: 32rpx;'">
						{{tab.name || "　"}}
					</view>
					<view class="bg-main" :style="tabIndex==index ? '' : 'background-color: #FFFFFF;'"></view>
				</view>
			</scroll-view>
		</view>

		<!-- v-if="loadPageFlag" -->

		<swiper :current="tabIndex" style="height:auto;" class="swiper-box" :duration="300" @change="changeTab">
			<swiper-item v-for="(tab, index1) in tabBars" :key="index1">
				<!-- <view class="" v-if="itemsModelArr.length > 0" > -->
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

			</swiper-item>
		</swiper>



	</view>
</template>

<script>
	import videoitem from '@/components/cd-video-item/cd-video-item.vue'


	export default {

		name: "cs-video-list",

		components: {
			videoitem
		},

		props: {
			//元素类型
			eltmType: 0,
			mobile: '',
			//tabBar 的标题数组 数据
			tabbarItemArr: Array,
			requestUrl: ''
		},

		data() {
			return {

				scrollLeft: 0,
				loadPageFlag: true,
				isClickChange: false,
				//加载更多的显示
				status: 'more',
				// view默认高度
				viewHeight: 420, //在viewHeight 里面带单位
				//选中的 tabbar 默认选择的是第一个
				tabIndex: 0,
				//存储单个的tab 是否已经加载过数据状态的数组
				newsitems: [],
				// 切换之后 的数组 
				tabBars: [],
				//展示的列表数据 所有列表数据
				itemsListArr: [],
				//展示的列表数据  
				itemsModelArr: [],
			}
		},

		created: function() {
			//页面数据初始化
			this.initLoadPageData();
		},

		onLoad: function() {
			console.log('---onLoad---');
		},

		watch: {
			tabbarItemArr: {
				handler(newValue, oldValue) {
					//do ...
					this.initLoadPageData()
				},
				deep: true
			}
		},

		methods: {


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

			initLoadPageData() {
				let that = this;
				console.log(JSON.stringify(that.tabbarItemArr))
				that.setData({
					tabBars: that.tabbarItemArr
				})
				that.itemsListArr = [];
				that.getData(that.tabBars[0]?.gallery_id)
			},

			getData(val) {
				var that = this;
				let params = {
					'mobile': that.mobile,
					'galleryId': val
				};
				uni.request({
					url: that.requestUrl,
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



			async changeTab(e) {

				console.log('--changeTab--');

				let that = this;
				let index = e.target.current;

				that.getData(that.tabBars[index].gallery_id)
				that.tabIndex = index

			},

			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#tab_" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},

			async tapTab(e) { //点击tab-bar

				console.log('点击进行tab 切换');
				let that = this;
				let tabIndex = e.currentTarget.dataset.current;
				if (this.tabIndex === tabIndex) {
					return false;
				} else {

					this.isClickChange = true;
					this.tabIndex = tabIndex;

					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft

					let width = 0;
					for (let i = 0; i < tabIndex; i++) {
						let result = await this.getElSize(this.tabBars[i].id);
						width += result.width;
					}
					let winWidth = uni.getSystemInfoSync().windowWidth,
						nowElement = await this.getElSize(this.tabBars[tabIndex].id),
						nowWidth = nowElement.width;
					console.log('nowWidth-------', nowWidth);

					if (width + nowWidth - tabBarScrollLeft > winWidth / 2) {
						this.scrollLeft = tabBarScrollLeft + nowWidth;
					}
					if (width + nowWidth - tabBarScrollLeft < winWidth / 2) {
						this.scrollLeft = 0;
					}
				}

				//切换tab 的时候 将pageNum 重置
				for (var i = 0, length = that.newsitems.length; i < length; i++) {
					let tmp = that.newsitems[i];
					tmp.pageNum = 1;
					that.$set(that.newsitems, i, tmp);
				}
			},


			scrolltolower: function() {

				console.log('----scrolltolower---loadMore----');
			},

		},
	}
</script>

<style lang="scss" scoped>
	@import "../../styles/_variables";
	@import '../../styles/layout.scss';


	.page {
		position: absolute;
		// top: 0;
		top: var(--status-bar-height);
		left: 0;
		width: 100%;
		bottom: 0;
		// min-height: 100%;
		background-color: #ffffff;
		background-size: cover !important;
		background-position: top center !important;
		margin-bottom: var(--window-bottom);
	}

	.m-section-header {
		height: 80rpx;
		width: auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 10rpx 30rpx 0rpx;
		// background-color: #007AFF;

		.m-section-title {
			line-height: 50rpx;
			font-size: 36rpx;
			font-weight: bold;
			color: #333333;
			text-align: left;
			width: 200rpx;
		}

		.m-section-more {
			height: 60rpx;
			width: 200rpx;
			line-height: 60rpx;
			font-size: 24rpx;
			text-align: right;
			color: #999999;
			// background-color: #007AFF;
		}

	}

	.uni-swiper-tab {

		line-height: 72rpx;
		height: 72rpx;
		border: 0;
		width: 690rpx;
		white-space: nowrap;

		::-webkit-scrollbar {
			width: 0;
			height: 0;
			color: transparent;
		}

		.swiper-tab-list {

			width: auto;
			margin-right: 0rpx;
			padding-left: 36rpx;
			line-height: 70rpx;
			height: 70rpx;
			background-color: #ffffff;

			&:first-child {
				padding-left: 0rpx;
			}

			.bg-main {
				// bottom: 10rpx;
				height: 10rpx;
				width: 40rpx;
				border-radius: 10rpx;
				background-color: #F43D3E;
			}
		}
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

	.content-item-view {

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: auto;
		padding: 16rpx 30rpx;
		border-bottom: #E9E9E9 1rpx solid;
	}
</style>

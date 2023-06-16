<template>
	<view class="page" :class="{ noData: noData }">
		<search :is-focus="false" :theme="themeClass" :show-want="true" :speechEngine="''" :hot-list="hot_list"
			:search-his-list="search_his_list" :suggest-text="suggest_text" @getSearchText="getSearchText"
			@clearSearch="clearSearch"></search>
		<scroll-view scroll-y v-if="!noData && showSearchResult">
			<view class="video-contentview " style="">
				<block v-for="(model, index2) in itemsModelArr" :key="index2">
					<videoitem :itemmodel="model" @click="onVideoClick(index2)"> </videoitem>
				</block>
			</view>
			<!-- <uni-load-more :status="status"></uni-load-more> -->
			<aexplan-view v-if="itemsModelArr.length >0"></aexplan-view>
		</scroll-view>


		<view v-if="noData" class="no-data">
			<image class="icon_nodata" src="https://qnsp.zcskjy.com/zc_images/findPage/no-data.png" mode=""></image>
			<view>暂无相关数据，换个关键词试试</view>
		</view>
	</view>
</template>

<script>
	import search from '@/components/search-new/noSearchHistory.vue';
	import videoitem from '@/components/cd-video-item/cd-video-item.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		components: {
			search,
			videoitem
		},
		data() {
			return {
				themeClass: 'circle',
				noData: false,
				speechEngine: 'baidu', //语音识别引擎
				search_his_list: [],
				hot_list: [],
				suggest_text: '',
				showSearchResult: false,
				isLookMore: false,
				//加载更多的显示
				status: 'more',
				loadPageFlag: true,
				describeList: [],
				itemsModelArr: [],
				resultList: [

				],
			};
		},
		computed: {
			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
			scrollHeight: function() {
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate);
				return winHeight;
			},
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: this.__('搜索'),
			});
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			clearSearch(e) {
				console.log('clearSearch', e);
				if (e == 'clearSearch') {
					this.showSearchResult = false;
					this.noData = false;
				} else if (e == 'clearHList') {
					this.noData = false;
				}
			},


			async getSearchText(e) {
				console.log('getSearchText:', e);
				var that = this;
				if (that.$.isNull(e)) {
					that.$.confirm('请输入您要搜索的关键词!');
					that.showSearchResult = false;
				} else {
					console.log('getSearchText-开始搜');
					that.$FT.clearArr(that.describeList);
					that.$FT.clearArr(that.resultList);
					that.getData(e);
				}

			},
			getData(e) {
				var that = this;
				let phone =that.userInfo.user_mobile.includes('+86')?that.userInfo.user_mobile.slice(3):that.userInfo.user_mobile;
				let params = {
					'mobile': phone,
					'galleryId': -1,
					'search': e
				};
				console.log('getData开始搜', params);
				uni.request({
					url: that.Config.getCsVideoList,
					data: params,
					success: (res) => {
						console.info('getData res==', res.data)
						if (res.data && res.data.result) {
							that.setData({
								loadPageFlag: true,
								itemsModelArr: res.data.result,
							});

						}
						if (that.itemsModelArr.length == 0) {
							that.noData = true
							that.showSearchResult = false
						} else {
							that.noData = false;
							that.showSearchResult = true
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
		},

		scrolltolower: function() {

			console.log('----scrolltolower---loadMore----');

		},



	};
</script>

<style lang="scss">
	@import '../../styles/_variables';

	uni-page-body {
		background-color: #ffffff !important;
	}

	.page {
		width: 750upx;
		background-color: #ffffff !important;
		min-height: 100%;
		height: auto;
	}

	.s-circle {
		.header {
			border-bottom: 0;
		}

		width: 750upx;
		height: 100%;
		background: #ffffff;
		position: fixed;
		overflow: hidden;
	}

	.no-data {
		background: #ffffff;
		font-size: 26upx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-top: 358upx;

		.icon_nodata {
			width: 300upx;
			height: 224upx;
			margin: 0 auto;
			margin-bottom: 50upx;
		}
	}

	/deep/ .playback-area {
		padding-top: 30upx;
		background: #ffffff;
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

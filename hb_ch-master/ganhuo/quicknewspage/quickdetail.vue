<template>
	<view class="page" style="background-color: #FFFFFF;width: 100%;height: 100%;">

		<!-- <scroll-view scroll-y="true" > -->

		<view class="web-view" :style="'height:'+ webHeight +'rpx;'" v-if="loadPageFlag">
			<web-view style="height: 1000rpx;" :style="'height:'+ webHeight +'rpx;'" :src="linkUrl"></web-view>
		</view>

		<view class="" v-else>
			<view class="article-content">
				<!-- {{content}} -->
				<rich-text :nodes="content"></rich-text>
			</view>
			<view class="time-title">
				{{time}}
			</view>

			<!-- <view class="share-title" style=""  >
				   {{'分享至'}}
				</view>
				<view class="share-view" >
				    <view class="share-item">
						<image class="m-image-img" mode="aspectFill" src="https://qnsp.zcskjy.com/zc_images/images/my/weixin.png" />
					</view>
					<view class="share-item">
						<image class="m-image-img" mode="aspectFill" src="https://qnsp.zcskjy.com/zc_images/images/my/weixinline.png" />
					</view>
					<view class="share-item">
						<image class="m-image-img" mode="aspectFill" src="https://qnsp.zcskjy.com/zc_images/images/my/weibo.png" />
					</view>
				</view> -->
		</view>

		<aexplan-view style=""></aexplan-view>

		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
		<!-- </scroll-view> -->

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	// import htmlParser from '@/common/html-parser'
	import shareBoxApp from '@/components/share-box-app.vue';

	export default {
		data() {
			return {
				// 页面是否展示的判断
				loadPageFlag: false,
				title: '',
				content: '',
				time: '',
				linkTitle: '',
				linkUrl: '',
				webHeight: 1000,
				//分享数组
				shareData: {},
				shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg`,
			}
		},

		computed: {
			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'userInfo', 'hasLogin']),
		},

		components: {
			shareBoxApp
		},

		onNavigationBarButtonTap(e) {

			// uni.showToast({
			// 	title: e.index === 0 ? "你点了分享按钮" : "你点了收藏按钮",
			// 	icon: "none"
			// })

			this.onShareBox();
		},

		onLoad(event) {

			let that = this;
			console.log('event-----', event.linkUrl);
			console.log('event-----', event.linkTitle);
			//获取linkurl
			if (event.linkUrl == 'null' || event.linkUrl == 'undefined' || event.linkUrl == '') {
				that.setData({
					loadPageFlag: false,
				});
			} else {
				that.linkUrl = event.linkUrl;
				//需要encode 的url 
				// this.linkUrl =`http://30.30.127.22:5500/pdf.html?url=${encodeURIComponent(this.url)}` //pdf地址添加参数
				// that.linkUrl = 'https://m.thepaper.cn/baijiahao_17971928';
				that.setData({
					loadPageFlag: true,
				});
			}

			//若上一页传递了标题过来，则设置导航栏标题
			if (event.linkTitle == 'null' || event.linkTitle == 'undefined' || event.linkTitle == '') {
				uni.setNavigationBarTitle({
					title: '7*24快讯详情'
				})
			} else {
				that.title = event.linkTitle;
				uni.setNavigationBarTitle({
					title: event.linkTitle
				})
			}

			if (event.content !== 'null') {
				that.setData({
					content: event.content,
				});
			}
			if (event.time !== 'null') {
				that.setData({
					time: event.time,
				});
			}
		},
		onReady() {

			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					var windowHeight = res.windowHeight;
					let viewheight = (windowHeight - 210 - 60) * 2;
					let height = viewheight - 30;
					that.setData({
						webHeight: height,
					});
					// console.log('windowHeight-----',windowHeight,that.webHeight);	 
				}
			});
		},
		methods: {
			// 请求页面详情数据
			requestData() {

			},

			loadData(data) {
				console.log('---data----111-', data);
				//如果上一页未传递标题过来（如搜索直达详情），则从新闻详情中读取标题
				if (this.title == '' && data.title) {
					this.title = data.title
					uni.setNavigationBarTitle({
						title: data.title
					})
				}
			},

			onShareBox() {
				let that = this;

				// uni.navigateTo({
				// 	url: '/ganhuo/quicknewspage/quickdetail?linkTitle='+model.linkTitle
				// 	+'&linkUrl='+model.linkUrl+'&content='+model.content+'&time='+model.time
				// });

				let shareModel = '';
				let pagetitle = 'linkTitle=' + this.title;
				shareModel += pagetitle;

				let linkUrl = '&linkUrl=' + that.linkUrl;
				shareModel += linkUrl;

				let content = '&content=' + this.content;
				shareModel += content;

				let time = '&time=' + this.time;
				shareModel += time;

				let $href = that.$.sprintf('%s/h5/ganhuo/quicknewspage/quickdetail?%s', that.Config.SiteUrl, shareModel);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				$href = that.$.sprintf('%s/h5/ganhuo/quicknewspage/quickdetail?%s', that.Config.SiteUrl, shareModel);
				// #endif
				// #ifdef MP-WEIXIN
				$href = '/h5/ganhuo/quicknewspage/quickdetail?%s' + shareModel;
				// #endif

				var title, shareText;
				title = '7*24 快讯详情';
				shareText = that.content;

				console.log('分享入参：1', $href);

				this.setData({
					shareData: {
						shareTitle: title,
						shareText: shareText,
						href: $href,
						image: that.shareLogo,
					},
				});

				console.log('分享入参：', that.shareData);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				this.$refs.shareBoxApp.show();
				// #endif
			},

		}
	}
</script>


<style lang="scss">
	.page {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		// min-height: 100%;
		background-color: #ffffff;
		background-size: cover !important;
		background-position: top center !important;
		margin-bottom: var(--window-bottom);
	}

	.web-view {
		background-color: #FFFFFF;
		height: 1000rpx;
		width: 100%;
		padding-bottom: 30rpx;
	}

	.article-content {
		// margin-right: 20rpx;
		background-color: #FFFFFF;
		// height: 100%;
		// width: 100%;
		padding: 30rpx;
		overflow: hidden;
		line-height: 55rpx;
		color: #333333;
		font-size: 32rpx;
		font-weight: 400;
		font-family: PingFangSC-Regular, PingFang SC;
	}

	.time-title {

		padding: 30rpx;
		height: 33rpx;
		line-height: 33rpx;
		color: #999999;
		text-align: left;
		font-size: 24rpx;
		font-weight: 400;
		font-family: PingFangSC-Regular, PingFang SC;
	}

	.share-title {
		padding-top: 80rpx;
		height: 42rpx;
		line-height: 42rpx;
		color: #999999;
		text-align: center;
		font-size: 30rpx;
		font-weight: 400;
		font-family: PingFangSC-Regular, PingFang SC;
		// background-color: #0077AA;
	}

	.share-view {

		padding-top: 10rpx;
		margin: auto;
		height: 80rpx;
		width: 350rpx;
		// background-color: #0077AA;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		.share-item {
			width: 80rpx;
			height: 80rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			// background-color: #0077AA;
			.m-image-img {
				width: 40rpx;
				height: 40rpx;
			}
		}

	}
</style>

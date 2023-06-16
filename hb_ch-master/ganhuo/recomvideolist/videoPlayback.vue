<template>
	<view class="videoDetails">
		<!-- #ifdef H5 -->
		<nav-bar @clickLeft="back" @clickRight="share" background-color="#FFFFFF"
			leftIcon="https://qnsp.zcskjy.com/zc_images/images/backback.png" rightIcon="" title="精选视频"></nav-bar>
		<!-- #endif -->

		<!-- rightIcon="https://qnsp.zcskjy.com/zc_images/findPage/share.png" -->
		<!-- <nav-bar @clickLeft="back" @clickRight="share" background-color="#FFFFFF" leftIcon="https://qnsp.zcskjy.com/zc_images/images/backback.png" rightIcon="" title="我的主页"></nav-bar> -->

		<!-- <nav-bar @clickLeft="back" @clickRight="share" background-color="#FFFFFF" leftIcon="https://qnsp.zcskjy.com/zc_images/images/backback.png" rightIcon="" title="我的主页"></nav-bar> -->

		<video id="myVideo" :src="urlStr" :poster="cover" @timeupdate="timeupdate" show-fullscreen-btn></video>

		<view class="videoDetails-content">
			<view class="videoDetails-title">
				<view>直播介绍</view>
				<view class="video-title">{{ title }}</view>
			</view>
			<view class="createTime">{{ getLocalTime() }}</view>
			<view class="classification">{{ classification }}</view>
			<!-- <view class="classification">{{ sourceDesc }}</view> -->
		</view>

		<aexplan-view style=""></aexplan-view>

		<uni-popup ref="share" type="share" safeArea backgroundColor="#fff">
			<!--   	<uni-popup-share></uni-popup-share> -->
			<view class="share-content">
				<view class="share-content-channel">
					<view class="channelChild">
						<image src="https://qnsp.zcskjy.com/zc_images/findPage/wechat.png" mode="widthFix"></image>
						<view class="">微信</view>
					</view>
					<view class="">
						<image src="https://qnsp.zcskjy.com/zc_images/findPage/WechatMoments.png" mode="widthFix">
						</image>
						<view class="">朋友圈</view>
					</view>
				</view>
				<view class="cancel" @click="closeShare">取消</view>
			</view>

		</uni-popup>

		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import shareBoxApp from '@/components/share-box-app.vue';

	import navBar from '@/components/nav-bar/uni-nav-bar.vue';
	export default {
		data() {
			return {
				//视频 id
				id: 0,
             
				videoDetails: Object,
				// videoDetails: {
				title: '一张医保卡，全家都能用',
				//  cover: 'https://qnrs.zcskjy.com/prod/image/cover/4fc9fb4fd211853ded86464ebd1b5377_80.jpg',
				//  url: 'https://img2.huizecdn.com/video/20220407/8342b37c-72dc-43ed-9ea2-4067f3f7178d.MP4',
				cover: '',
				urlStr: '',
				urlMp4: null,
				urlM3u8: null,
				classification: '保险',
				duration: null,
				publishTime: 0,
				status: 0,
				sourceId: 2,
				sourceDesc: '慧择保险',
				introduction: '',
				tagSource: '社保',
				tag: null,
				goodNum: null,
				viewNum: null,
				createTime: '2022-04-13T16:00:00.000+00:00',
				aspectRatio: '1',

				//分享数组
				shareData: {},
				shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg`,
				// },
			};
		},

		components: {
			navBar,
			shareBoxApp
		},

		computed: {
			...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'userInfo', 'hasLogin']),
		},

		mounted() {},

		onLoad(event) {
			//获取真实新闻id，通常 id 来自上一个页面
			// if(event.linkUrl){
			// 	this.linkUrl = event.linkUrl
			// }
			console.log('event---', event.id);

			if (event.id) {
				this.id = event.id;
				this.requestData();
			}
		},
		onUnload() {
			console.info('onUnload==', 'onUnload')
		},

		onNavigationBarButtonTap(e) {

			this.onShareBox();
		},

		methods: {

			onShareBox() {
				let that = this;

				// uni.navigateTo({
				// 	url: '/ganhuo/quicknewspage/quickdetail?linkTitle='+model.linkTitle
				// 	+'&linkUrl='+model.linkUrl+'&content='+model.content+'&time='+model.time
				// });

				let $href = that.$.sprintf('%s/h5/ganhuo/recomvideolist/videoPlayback?id=%s', that.Config.SiteUrl, that
				.id);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				$href = that.$.sprintf('%s/h5/ganhuo/recomvideolist/videoPlayback?id=%s', that.Config.SiteUrl, that.id);
				// #endif
				// #ifdef MP-WEIXIN
				$href = '/h5/ganhuo/recomvideolist/videoPlayback?id=%s' + that.id;
				// #endif

				var title, shareText;
				title = that.title;
				shareText = that.classification;

				console.log('---$href---1-1--', $href);

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


			back() {

				uni.navigateBack({
					delta: 1,
				});
			},

			getLocalTime() {
				// return new Date(parseInt(this.publishTime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');

				let time = new Date(this.publishTime * 1000)
				let year = time.getFullYear()
				let month = time.getMonth() + 1
				let date = time.getDate()
				let hours = time.getHours()
				let minute = time.getMinutes()
				let second = time.getSeconds()
				if (month < 10) {
					month = '0' + month
				}
				if (date < 10) {
					date = '0' + date
				}
				if (hours < 10) {
					hours = '0' + hours
				}
				if (minute < 10) {
					minute = '0' + minute
				}
				if (second < 10) {
					second = '0' + second
				}
				return year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
			},


			requestData() {
				var that = this;
				let params = {};
				params.id = this.id;
				// params.id = '202205042367805898';
				console.log('params----', params);

				uni.request({
					method: 'GET',
					data: params,
					url: that.Config.URL.newsUrl.videodetail,
					success: function(data, status) {
						console.log('data----', data);
						let result = data.data.result;
						if (data.statusCode == 200) {
							//设置标题
							if (result.content === null) {
								//页面是否加载完成
								
								uni.showToast({
									title: `返回数据为null `,
									icon: 'none',
								});
							} else {
								//页面是否加载完成
								that.setData({
								
									title: result.title,
									cover: result.cover,
									urlStr: result.url,
									urlMp4: result.urlMp4,
									urlM3u8: result.urlM3u8,
									classification: result.classification,
									duration: result.duration,
									publishTime: result.publishTime,
									status: result.status,
									sourceId: result.sourceId,
									sourceDesc: result.sourceDesc,
									introduction: result.introduction,
									tagSource: result.tagSource,
									tag: result.tag,
									goodNum: result.goodNum,
									viewNum: result.viewNum,
									createTime: result.createTime,
									aspectRatio: result.aspectRatio
								});

								if (result.title !== '') {
									console.log('--title---', result.title);
									// uni.setNavigationBarTitle({
									// 	title:'一场直播'
									// })
								}

								// console.log('video----',this.videoDetails);
							}
						} else {
							that.$.confirm(msg);
						}
					},
				});
			},

			closeShare() {
				this.$refs.share.close();
			},

			share() {
				// this.$refs.share.open()
				// uni.showToast({
				//   title: '点击了菜单',
				// });
			},
			timeupdate(event) {
				let time = event.detail.currentTime;
				console.info('time==', time)
			},
		},
	};
</script>
<style lang="less" scoped>
	.videoDetails {
		uni-video {
			width: 750upx;
		}

		&-content {
			padding: 0 30upx;
			background: #ffffff;
		}

		&-title {
			font-size: 32upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;

			.video-title {
				padding-top: 16upx;
			}
		}

		.createTime {
			font-size: 24upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
		}

		.classification {
			font-size: 26upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			padding-bottom: 100upx;
		}

		&-clause {
			padding: 0 30px;
			font-size: 26upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;

			.clause-title {
				font-size: 32upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				padding-top: 48upx;
				color: #222222;
			}

			.clause-text {
				width: 690upx;
			}
		}

		.share-content {
			position: fixed;
			bottom: 0;
			text-align: center;

			&-channel {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 750upx;
				height: 251upx;
				background: #f5f5f5;
				overflow: hidden;
				border-radius: 16upx 16upx 0px 0px;
				font-size: 24upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
			}

			.channelChild {
				width: 96upx;
				text-align: center;
				margin-right: 64upx;
			}

			uni-image {
				width: 96upx;
				height: 96upx;
			}

			.cancel {
				width: 750upx;
				height: 114upx;
				line-height: 114upx;
				background: #ffffff;
				font-size: 36upx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
				text-align: center;
			}
		}

		/deep/ .uni-navbar__header-btns-left {
			uni-image {
				// width: 30upx !important;
				// height:60upx !important;
			}
		}
	}
</style>

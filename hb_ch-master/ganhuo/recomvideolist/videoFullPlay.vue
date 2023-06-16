<template>
	<view class="contentview">
		<!-- <nav-bar
		@clickLeft="back"
		@clickRight="share"
		background-color="#FFFFFF"
		 leftIcon="https://qnsp.zcskjy.com/zc_images/images/backback.png"
		rightIcon="https://qnsp.zcskjy.com/zc_images/findPage/share.png"
		title="我的主页"
	></nav-bar>
	 -->

		<!-- <view class="contentview-top" style="height:var(–status-bar-height);width:100%" ></view> -->

		<!-- object-fit='fill' -->
		<!-- <video id="myVideo" :style="'height:'+ viewheight +'rpx'" :poster= 'cover' 
	:src="url" enable-play-gesture  @fullscreenchange=""></video>
	 -->

		<video id="myVideo" :poster="cover" :style="'height:' + viewheight + 'rpx'" direction='0' show-center-play-btn
			object-fit="contain" :src="url" enable-play-gesture></video>

		<!-- <view class="contentview-bottom" style="height:env(safe-area-inset-bottom);width:100%" ></view> -->

		<!-- <view class="contentview-rightview" >
	   <view class="contentview-btnView" @click="favorClick">
	       <image class="m-image-img" style="width: 40rpx;height: 40rpx;" mode="widthFix"
			:src="isfavor?'https://qnsp.zcskjy.com/zc_images/images/aixinred.png':'https://qnsp.zcskjy.com/zc_images/images/aixin.png'" />
			<view  style="padding-top: 5rpx;height: 28rpx;line-height: 28rpx;text-align: center;color: #E6E6E6;">{{ favorCount }} </view>
	   </view>
	   <view class="contentview-btnView" @click="share">
		   <image class="m-image-img" style="width: 40rpx;height: 40rpx;" mode="widthFix" 
		   src="https://qnsp.zcskjy.com/zc_images/images/shareImg.png" />
		   <view class="text" style="padding-top: 5rpx;height: 28rpx;line-height: 28rpx;text-align:center;color:#E6E6E6;">{{ shareCount }} </view>
	   </view>
	</view> -->


		<view class="contentview-bottomView" v-if="noNativeApp" @click="showBtnClick"
			:style="showDetail ? 'height:220rpx;' : 'height:45rpx'">
			<view class="video-title">{{ title }}</view>
			<view class="explan-text">本页面转载上述内容传递更多信息之目的，不代表长乘学堂观点。 长乘学堂力求但不保证数据的完全准确，如有错漏请以证监会指定上市公司信息披露平台为准，
				各类信息服务基于人工智能算法，投资者据此操作，风险自担。</view>
			<image class="m-image-img" mode="aspectFill" src="https://qnsp.zcskjy.com/zc_images/images/hiddenBtn.png"
				v-if="showDetail" />
			<image class="m-image-img" mode="aspectFill" src="https://qnsp.zcskjy.com/zc_images/images/showBtnImg.png"
				v-else />
		</view>

		<uni-popup ref="share" type="share" safeArea backgroundColor="#fff">
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
				showDetail: false,
				viewheight: 1000,
				fullScreenPlay: false,
				content: Object,
				title: '',
				//  cover: 'https://qnrs.zcskjy.com/prod/image/cover/4fc9fb4fd211853ded86464ebd1b5377_80.jpg',
				//  url: 'https://img2.huizecdn.com/video/20220407/8342b37c-72dc-43ed-9ea2-4067f3f7178d.MP4',
				cover: '',
				url: '',
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
				isfavor: false, // 是否点赞
				favorCount: 0, //点赞数量
				shareCount: 0, //分享数量

				//是否是原生APP
				noNativeApp: true,
				shwoAllNativeText: false,
				screenHeight: 0,
				topMargin: 0,
				view2: Object,
				view: null,
				//分享数组
				shareData: {},
				shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg`,
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


		onUnload() {

			this.view.close();
			this.view2.close();
		},

		onLoad(event) {
			//获取真实新闻id，通常 id 来自上一个页面
			// console.log('event---', event.id);

			uni.getSystemInfo({
				success: (res) => {
					let windowHeight = res.windowHeight;
					let phoneHeight = res.windowHeight * (750 / res.windowWidth);
					console.log('---windowHeight---', windowHeight, phoneHeight);
					this.setData({
						screenHeight: res.screenHeight,
						viewheight: phoneHeight,
					});
				},
			});


			// #ifdef APP-PLUS
			//原生APP 隐藏底部的html 框架
			this.setData({
				noNativeApp: false,
				topMargin: this.screenHeight - 165,
			});
			// #endif


			if (event.id) {
				this.id = event.id;
				//查询视频详情
				this.requestData();
				//查询是否点赞
				this.videoIsfavor();
			}
		},

		onNavigationBarButtonTap(e) {

			this.onShareBox();
		},

		methods: {

			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
			
			
			

			onLoadNativeView() {


				// let topMargin =	this.screenHeight - 165;
				// var view = new plus.nativeObj.View('head',{top: topMargin +'px',left:'20px',height:'140px',width:'100%'});
				// // view.drawRect({color:'#fff'}, {top: '100px',left:'20px',width:'100%',height:'100%'});
				// view.drawText(this.title, {top:'0px',left:'0px',width:'100%',height:'20px'}, {size:'16px',color:'#ffffff',weight:500,align:'left'});
				// // 绘制文本
				// view.drawText('本页面转载上述内容传递更多信息之目的，不代表长乘学堂观点。 长乘学堂力求但不保证数据的完全准确，如有错漏请以证监会指定上市公司信息披露平台为准，各类信息服务基于人工智能算法，投资者据此操作，风险自担。',
				// 	{top:'20px',left:'0px',width:'90%',height:'100px'}, {size:'14px',color:'#ffffff',weight:400,align:'left',whiteSpace:'normal'});

				// let topMargin =	this.screenHeight - 165;
				this.view = new plus.nativeObj.View('head', {
					top: this.topMargin + 'px',
					left: '20px',
					height: '62px',
					width: '100%'
				});
				this.view.drawText(this.title, {
					top: '0px',
					left: '0px',
					width: '100%',
					height: '20px'
				}, {
					size: '16px',
					color: '#ffffff',
					weight: 500,
					align: 'left'
				});
				this.view.drawText('本页面转载上述内容传递更多信息之目的，不代表长乘学堂观点。 长乘学堂力求但不保证数据的完全准确...', {
					top: '20px',
					left: '0px',
					width: '90%',
					height: '40px'
				}, {
					size: '14px',
					color: '#ffffff',
					weight: 400,
					align: 'left',
					whiteSpace: 'normal'
				});
				//返回添加事件
				this.view.addEventListener("click", this.onViewclick, false);

				this.view2 = new plus.nativeObj.View('head', {
					top: this.topMargin + 'px',
					left: '20px',
					height: '120px',
					width: '100%'
				});
				this.view2.drawText(this.title, {
					top: '0px',
					left: '0px',
					width: '100%',
					height: '20px'
				}, {
					size: '16px',
					color: '#ffffff',
					weight: 500,
					align: 'left'
				});
				// 绘制文本
				this.view2.drawText(
					'本页面转载上述内容传递更多信息之目的，不代表长乘学堂观点。 长乘学堂力求但不保证数据的完全准确，如有错漏请以证监会指定上市公司信息披露平台为准，各类信息服务基于人工智能算法，投资者据此操作，风险自担。', {
						top: '25px',
						left: '0px',
						width: '90%',
						height: '90px'
					}, {
						size: '14px',
						color: '#ffffff',
						weight: 400,
						align: 'left',
						whiteSpace: 'normal'
					});
				//返回添加事件
				this.view2.addEventListener("click", this.onViewclick2, false);

				let that = this;
				setTimeout(function() {
					that.view.show();
				}, 500)
			},

			onViewclick() {
				console.log('---1---');
				this.view.close();
				this.view2.show();

				this.view = new plus.nativeObj.View('head', {
					top: this.topMargin + 'px',
					left: '20px',
					height: '62px',
					width: '100%'
				});
				this.view.drawText(this.title, {
					top: '0px',
					left: '0px',
					width: '100%',
					height: '20px'
				}, {
					size: '16px',
					color: '#ffffff',
					weight: 500,
					align: 'left'
				});
				this.view.drawText('本页面转载上述内容传递更多信息之目的，不代表长乘学堂观点。 长乘学堂力求但不保证数据的完全准确...', {
					top: '20px',
					left: '0px',
					width: '90%',
					height: '40px'
				}, {
					size: '14px',
					color: '#ffffff',
					weight: 400,
					align: 'left',
					whiteSpace: 'normal',
					backgroundColor: '#f0c125'
				});
				//返回添加事件
				this.view.addEventListener("click", this.onViewclick, false);
			},
			onViewclick2() {

				console.log('---2---');
				this.view.show();
				this.view2.close();

				this.view2 = new plus.nativeObj.View('head', {
					top: this.topMargin + 'px',
					left: '20px',
					height: '120px',
					width: '100%'
				});
				this.view2.drawText(this.title, {
					top: '0px',
					left: '0px',
					width: '100%',
					height: '20px'
				}, {
					size: '16px',
					color: '#ffffff',
					weight: 500,
					align: 'left'
				});
				// 绘制文本
				this.view2.drawText(
					'本页面转载上述内容传递更多信息之目的，不代表长乘学堂观点。 长乘学堂力求但不保证数据的完全准确，如有错漏请以证监会指定上市公司信息披露平台为准，各类信息服务基于人工智能算法，投资者据此操作，风险自担。', {
						top: '25px',
						left: '0px',
						width: '90%',
						height: '90px'
					}, {
						size: '14px',
						color: '#ffffff',
						weight: 400,
						align: 'left',
						whiteSpace: 'normal'
					});
				//返回添加事件
				this.view2.addEventListener("click", this.onViewclick2, false);

			},


			getLocalTime() {
				return new Date(parseInt(this.publishTime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
			},

			showBtnClick() {
				this.showDetail = !this.showDetail;
			},

			requestData() {
				var that = this;
				let params = {};
				params.id = this.id;
				// console.log('params----',params);
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
								that.setData({
									loadPageFlag: true,
								});
								uni.showToast({
									title: `返回数据为null `,
									icon: 'none',
								});
							} else {
								//页面是否加载完成
								that.setData({
									loadPageFlag: true,

									title: result.title,
									cover: result.cover,
									url: result.url,
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
									favorCount: result.favorCount,
									createTime: result.createTime,
									aspectRatio: result.aspectRatio,
								});

								if (result.title !== '') {
									// console.log('--title---',result.title);
									// uni.setNavigationBarTitle({
									// 	title:'一场直播'
									// })
								}

								// #ifdef APP-PLUS
								that.onLoadNativeView();
								// #endif


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

			//视频是否点赞
			videoIsfavor() {
				var uid = uni.getStorageSync('uid');

				var that = this;
				let params = {};
				params.newsId = this.id;
				params.userId = uid;
				console.log('--params----', params);
				uni.request({
					method: 'GET',
					data: params,
					url: that.Config.URL.newsUrl.incidental_validate,
					success: function(data, status) {
						console.log('data----', data);
						let result = data.data.result;
						if (data.statusCode == 200) {
							//页面是否加载完成
							that.isfavor = result;
							// that.setData({
							// 	that.isfavor = result;
							// });
						} else {
							let msg = data.data.msg;
							that.$.confirm(msg);
						}
					},
				});
			},

			//点赞按钮
			favorClick() {
				var uid = uni.getStorageSync('uid');

				var that = this;
				let params = {};
				params.newsId = this.id;
				params.userId = uid;
				params.operateType = '2'; //操作点赞
				//是点赞状态 则取消点赞
				if (that.isfavor) {
					params.clickType = '2'; //取消点赞
				} else {
					params.clickType = '1'; // 新增点赞
				}
				console.log('params----', params);
				uni.request({
					method: 'POST',
					data: params,
					url: that.Config.URL.newsUrl.incidental_operate,
					success: function(data, status) {
						console.log('data----', data);
						let result = data.data.result;
						if (data.statusCode == 200) {
							if (that.isfavor) {
								that.favorCount -= 1;
								uni.showToast({
									title: '取消点赞',
								});
							} else {
								that.favorCount += 1;
								uni.showToast({
									title: '点赞成功',
								});
							}
							that.isfavor = !that.isfavor;
						} else {
							that.$.confirm(msg);
						}
					},
				});
			},

			//分享按钮
			share() {
				this.$refs.share.open();
				// uni.showToast({
				//   title: '点击了菜单',
				// });
			},

			onShareBox() {
				let that = this;

				// uni.navigateTo({
				// 	url: '/ganhuo/quicknewspage/quickdetail?linkTitle='+model.linkTitle
				// 	+'&linkUrl='+model.linkUrl+'&content='+model.content+'&time='+model.time
				// });

				let $href = that.$.sprintf('%s/h5/ganhuo/recomvideolist/videoFullPlay?id=%s', that.Config.SiteUrl, that.id);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				$href = that.$.sprintf('%s/h5/ganhuo/recomvideolist/videoFullPlay?id=%s', that.Config.SiteUrl, that.id);
				// #endif
				// #ifdef MP-WEIXIN
				$href = '/h5/ganhuo/recomvideolist/videoFullPlay?id=%s' + that.id;
				// #endif

				var title, shareText;
				title = that.title;
				shareText = that.classification;

				console.log('----$href-----', $href);

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
			
		},
	};
</script>
<style lang="less" scoped>
	.contentview {
		width: 100%;
		height: 100%;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// justify-content: space-between;
		// margin-top: env(safe-area-inset-top);
		// margin-bottom: env(safe-area-inset-bottom);

		&-top {
			// height:var(–status-bar-height);
			height: env(safe-area-inset-top);
			width: 100%;
			background-color: #007aff;
		}

		&-bottom {
			// height:env(–status-bar-height);
			height: env(safe-area-inset-bottom);
			width: 100%;
		}

		uni-video {
			width: 100%;
			// height: 100%;
			flex: 1;
			position: fixed;
			top: 0;
			left: 0;
			// height:var(–status-bar-height);
			// padding-top: env(safe-area-inset-top);
			// padding-bottom: env(safe-area-inset-bottom);
		}

		&-rightview {
			width: 84rpx;
			height: 260rpx;
			background-color: rgba(102, 102, 102, 0.7);
			border-radius: 42rpx;
			position: fixed;
			right: 40rpx;
			bottom: 200rpx;
			border: #979797 1rpx solid;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			padding: 20rpx 0;
			// z-index: 999;
		}

		&-btnView {
			width: 60rpx;
			height: 90rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			color: #e6e6e6;
			font-size: 20rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, PingFang SC;
		}

		&-bottomView {
			padding-left: 20rpx;
			padding-right: 156rpx;
			padding-bottom: 110rpx;
			height: 80rpx;
			position: fixed;
			bottom: 110rpx;
			color: #ffffff;
			overflow: hidden;
			// background-color: #00BFFF;
			z-index: 999;

			.m-image-img {
				width: 22rpx;
				height: 12rpx;
				position: fixed;
				bottom: 130rpx;
				right: 135rpx;
				// background-color: #FF0000;
			}

			.showInfo {
				height: 200rpx;
			}

			.hiddenInfo {
				height: 90rpx;
			}

			.video-title {
				font-size: 30rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				height: auto;
				// background-color: #F0AD4E;
			}

			.explan-text {
				font-size: 26rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
				height: auto;
				// background-color: #007AFF;
			}
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
	}
</style>

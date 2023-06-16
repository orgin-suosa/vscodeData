<template>
	<view class="page">

		<view class="" style="background-color:#FFFFFF;width: 100%;
		position: relative;">
			<view style="padding:25rpx 22rpx 0rpx 22rpx;">
				<image mode="scaleToFill" src="https://qnsp.zcskjy.com/zc_images/images/my/serveTopImg.png" style="width: 100%;background-color: #FFFFFF;height: 254rpx;
				 position:relative;" />
				<view class="m-section-top" style="">
					<view class="m-title-title">{{'我的私人管家'}}</view>
					<view class="m-des-title">{{'不知道怎么加入课程学习？'}}</view>
				</view>
				<view class="m-section-bottom" style="">
					<view class="m-common-title">{{'贴心为您推荐和制定学习计划'}}</view>
					<view class="m-bottom-rightview" style="" @click="serverClick">
						{{'立即联系'}}
					</view>
				</view>
			</view>
		</view>
		<view class="m-section-header" style="">
			{{'课程服务'}}
		</view>

		<view style="height: auto;" v-if="itemsModelArr.length > 0">
			<block v-for="(model, index) in itemsModelArr" :key="index">
				<acourse-item :itemmodel="model" @itemClick="goDetail(index)"> </acourse-item>
			</block>
		</view>
		<view class="m-empty-view" style="height: auto;" v-else>
			<aempty-view style="margin-top:120rpx;align-self: center;"></aempty-view>
		</view>
	</view>
</template>

<script>
	// import acourseitem from '@/components/amy-subcomp/acourse-item.vue'

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			// 'acourseitem':acourse-item
		},
		data() {
			return {

				loadComplete: true,
				//加载更多的显示
				status: 'more',
				//页面数据
				pageNum: 1,
				//scrollView 页面高度
				viewHeight: 500,
				//展示的列表数据  
				itemsModelArr: [],
				// itemsModelArr:['1','2','3'],
			}
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'userInfo', 'hasLogin']),

		methods: {
			...mapMutations([
				'login',
				'logout',
				'forceUserInfo',
				'getUserInfo',
			]),

			serverClick() {
				console.log('专属客服');
				let user_id = this.userInfo.user_id;
				let path = 'pages/index/index?typeIndex=0&userId=' + user_id + '&mobile=' + this.userInfo.user_mobile;
				this.pushMiniApp(path);
			},

			// {
			// 	"product_tips": "ceshi",
			// 	"item_id": 16,
			// 	"user_id": 20010,
			// 	"product_image": "http://zcsk.oss-cn-shanghai.aliyuncs.com/mall/images/media/store/1239/20220610/60d64765e676433db0ec64c1d3a440cc.jpg",
			// 	"product_id": 16,
			// 	"course_state": 1001,
			// 	"course_schedule": 0,
			// 	"product_name": "ceshi0610",
			// 	"course_stock_id": 1021,
			// 	"chapterNum": 0,
			// 	"course_file_type": 0
			// }

			goDetail(index) {
				
				
				let model = this.itemsModelArr[index];
				console.info('---model----', model);
				// let user_id = this.userInfo.user_id;
				let typeIndex;
				
				// type_id	课程类型(ENUM) : 0-精品课；1-训练营；2-导师课
				if (model.course_type == 2) {
					typeIndex = 2;
				}else if (model.course_type == 1) {
					typeIndex = 1;
				}else if (model.course_type == 0) {
					typeIndex = 0;
				}else {
					typeIndex = 0;
				}
				
				// let wxMiniId = uni.getStorageSync('wxMiniId') ?? '';
				let wxOriginId = uni.getStorageSync('wxOriginId') ?? 'gh_77e0924a5066';
				let wxMiniPath = uni.getStorageSync('wxMiniPath') ?? 'pages/index/index';
				let path = wxMiniPath +'?typeIndex=' + typeIndex + '&courseType=' + model.course_type +
					'&userId=' + model.user_id + '&productId=' + model.product_id+ '&mobile=' + this.userInfo.user_mobile;
				this.pushMiniApp(path,wxOriginId);
			},

			//跳转微信小程序
			pushMiniApp(pathUrl,wxOriginId) {

				console.log('---log---', pathUrl);
				// #ifdef APP-PLUS
				// 跳转微信小程序 
				plus.share.getServices(
					res => {
						console.log('---res---', res);
						let sweixin = '';
						for (var i = 0; i < res.length; i++) {
							let t = res[i];
							if (t.id == 'weixin') {
								sweixin = t;
							}
						}
						if (sweixin) {
							sweixin.launchMiniProgram({
									// id: 'gh_915c2ca533a7',  //汽车的原始ID
									// id: 'gh_306945fe14bd',
									id: wxOriginId,
									// path: 'pages/views/home/home/home?', //  可带参数	             
									// path: 'pages/index/index?typeIndex=0&user_id='+user_id', //  可带参数	  
									path: pathUrl,
									type: 0 // 微信小程序版本类型可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
								},
								// 目标小程序点击返回App后执行的回调，在此接收微信小程序传递的参数
								res2 => {
									console.log('-----res2----', res2)
								},
								err2 => {
									console.log(err2)
								}
							);
						} else {
							uni.showToast({
								icon: 'none',
								title: '当前环境不支持微信操作!'
							})
						}
					},
					err => {
						console.log('---err-----', err)
					}
				)
				// #endif

				// #ifdef MP-WEIXIN
				uni.navigateToMiniProgram({
					appId: 'wx1935506901780516', // 此为生活缴费appid
					// path:'pages/index/index?typeIndex=0&user_id='+user_id,
					path: pathUrl,
					envVersion: "release",
					success: res => {
						// 打开成功
						console.log("打开成功", res);
					},
					fail: err => {
						console.log(err);
					}
				});
				// #endif
			},

			initPageData: function() {
				let that = this;
				//请求具体的列表的数据
				that.loadModelList(1, true)
			},

			scrolltolower: function(index) {

				console.log('scrolltolower');
				// this.status = 'loading';
				// this.loadMore();
			},

			loadMore() {
				let that = this;
				that.status = 'loading';
				setTimeout(() => {
					that.addData();
				}, 500);
			},

			addData() {

				// if (this.pageNum <= this.pageNum) {
				// 	this.status = 'noMore';				
				// 	return;
				// }
				this.loadModelList(this.pageNum + 1, false);
			},

			// 请求列表数据
			loadModelList(pageNum, force_refresh) {

				var that = this;
				//1001 已购买  1002学习中 1003 已学完
				var params = {
					learnState: 1001,
					pageNum: pageNum,
					pageSize: 20,
				};
				that.$.request({

					url: this.Config.URL.edu.getBuyCourseList,
					data: params,
					loading: false,
					success: function(data, status, msg, code) {
						uni.stopPullDownRefresh()
						that.setData({
							loadComplete: true
						})

						if (200 == status) {
							console.log('---data------', data);
							if (data.page >= data.total) {
								that.setData({})
							} else {
								that.setData({})
							}

							let modelArr = data.items;
							that.status = 'more';
							if (pageNum >= data.records) {
								that.status = 'noMore';
							}

							if (force_refresh) {

							} else {
								modelArr = that.itemsModelArr.concat(modelArr);

							}

							console.log('--model---', modelArr.length);
							//页面是否加载完成
							that.setData({
								itemsModelArr: modelArr
							});

						} else {

							uni.showToast({
								icon: 'none',
								title: msg
							})
						}
					},
					fail: function(data) {
						that.setData({
							loadComplete: true
						});
						uni.showToast({
							icon: 'error',
							title: "网络异常请重试！"
						})
					}
				});
			},

		},

		onLoad: function(opt) {

			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					var windowHeight = res.windowHeight;
					let viewheight = (windowHeight - 160 - 35 - 60) * 2;
					that.setData({
						viewHeight: viewheight,
					});
					// console.log('windowHeight-----',windowHeight,viewheight);	 
				}
			});

			//页面数据初始化
			this.initPageData();
		},

		onShow: function(opt) {

		},

		onReady: function() {

		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.initPageData(true)
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {

			// this.$refs.guessYouLike.scrollbottom();
		},


	}
</script>

<style lang="scss" scoped>
	.page {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		/* min-height: 100%; */
		background-color: #ffffff;
		background-size: cover !important;
		background-position: top center !important;
		margin-bottom: var(--window-bottom);
	}

	.m-section-header {

		padding: 8rpx 30rpx;
		height: 50rpx;
		line-height: 50rpx;
		color: #333333;
		text-align: left;
		font-size: 36rpx;
		font-weight: 500;
		font-family: PingFangSC-Medium, PingFang SC;
	}


	.m-section-top {

		position: absolute;
		left: 232rpx;
		top: 50rpx;
		height: 100rpx;
		// background-color: #007AFF;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;

		.m-title-title {
			// background-color: #FF0000;
			height: 60rpx;
			line-height: 60rpx;
			color: #8E5223;
			font-size: 40rpx;
			font-weight: 600;
			font-family: PingFangSC-Bold, PingFang SC;
		}

		.m-des-title {
			height: 40rpx;
			line-height: 40rpx;
			color: #8E5223;
			font-size: 28rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, PingFang SC;
		}
	}

	.m-section-bottom {

		position: absolute;
		/* width: 630rpx; */
		width: auto;
		left: 232rpx;
		bottom: 70rpx;
		right: 50rpx;
		height: 60rpx;
		display: flex;
		// background-color: #007AFF;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;

		.m-bottom-rightview {
			height: 60rpx;
			width: 177rpx;
			color: #984E13;
			border-radius: 45rpx;
			font-size: 32rpx;
			font-weight: 500;
			text-align: center;
			font-family: PingFangSC-Medium, PingFang SC;
			background: -wbkit-linear-gradient(to left, #FF9661, #FFD29C);
			background: linear-gradient(to left, #FF9661, #FFD29C);
		}

		.m-common-title {

			height: 42rpx;
			line-height: 42rpx;
			color: #8E5223;
			font-size: 20rpx;
			font-weight: 400;
			font-family: PingFangSC-Bold, PingFang SC;
		}
	}
</style>

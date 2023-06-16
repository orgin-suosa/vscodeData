<template>
	<view class="content">
		<swiper class="swiper" :indicator-dots="true" :autoplay="autoplay" :duration="duration">
			<!-- <swiper-item v-for="(item, si) in items" :key="si">
				<view class="swiper-item">
					<image :src="item" mode="aspectFit"></image>
				</view>
				<view v-if="item_lastindex!==si" class="jump-over" @tap="launchFlag()">{{jumpover}}</view>
				<view v-else class="experience" @tap="launchFlag()">{{experience}}</view>
			</swiper-item> -->

			<swiper-item v-for="(item, si) in items" :key="si">
				<view class="swiper-item" @click="guideClickIndex(si)">
					<!-- <image :src="item"  mode="aspectFit"></image> -->
					<image :src="item.adImg" mode="scaleToFill"></image>
				</view>
				<view v-if="item_lastindex == si" class="experienceImg" @tap="launchFlag()">
					<!-- <text>{{experience}}</text> -->
					<image :src="logInImage" mode="widthFix"></image>
					<!-- https://qnsp.zcskjy.com/zc_images%2Fimages%2FtiyanBtnImg.png -->
				</view>
				<!-- <view class="jump-over" @tap="launchFlag()">
					<text>{{jumpover}}</text>
				</view> -->
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	// var Interval;

	export default {
		data() {
			return {
				background: ['color1', 'color2', 'color3'],
				items: [],
				// items:["/static/images/guide1.jpeg","/static/images/guide1.jpeg","/static/images/guide1.jpeg"],
				item_lastindex: 0,
				logo: '',
				autoplay: false,
				duration: 500,
				jumpover: '5S跳过',
				logInImage: `${getApp().globalData.qnUrl}/zc_images/images/tiyanBtnImg.png`,
				durationTime: 5,    //5s 倒计时
				// experience: '点击跳转至详情页'
				experience: '立即体验'
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {

			uni.setNavigationBarTitle({
				title: this.__('')
			});
			
			const value = uni.getStorageSync('launchFlag');
			console.info('---launchFlag---value--', value);
			if (value) {
			    if (value == true) {
			        uni.switchTab({
			            url: '/pages/index/index'
			        });
					return;
			    }
			}
			
			// let tmp = ["/static/images/yingxiao.png","/static/images/yingxiao.png","/static/images/yingxiao.png"],
			// this.setData({
			// 	// items:tmp,
			// 	item_lastindex:this.items.length-1,
			// });

			this.appGuideRequest();

		},
        onUnload() {
        	// clearInterval(Interval)
        },
		onHide: function() {
			// clearInterval(Interval)
		},

		onShow: function() {
			// var that = this;
			// Interval = setInterval(function() {
			// 	if (that.durationTime == 0) {
					
			// 		that.launchFlag();
			// 	} else {
			// 		that.setData({
			// 			jumpover: that.durationTime + 'S' + '跳过',
			// 		});
			// 	}
			// 	that.durationTime = that.durationTime - 1;
			// 	console.log("-1111---", that.durationTime);
			// },
			// 1000)
		},
		methods: {

			//引导页
			guideClickIndex(index) {
				
                // clearInterval(Interval)
				
				console.log('---index---', index);
				let model = this.items[index];
				uni.switchTab({
					url: '/pages/index/index'
				});
				
				uni.navigateTo({
					url: model.defaultTargetUrl
				});
			},

			//APP 引导页信息请求
			appGuideRequest() {

				let that = this;
				let params = {
					type: 0,
					location: 0,
					userId: 0,
				};
				uni.request({
					method: 'GET',
					data: params,
					url: that.Config.URL.config.guideList,
					success: function(data, status) {
						console.info('---guideList-----10000----', data.data.result);
						if (data.statusCode == 200) {

							let resultArr = data.data.result;
							// console.info('---resultArr--', resultArr);
							if(resultArr.length == 0){
								
								that.launchFlag();
							}else{
								that.setData({
									item_lastindex: resultArr.length - 1,
									items: resultArr,
								});
							}
						} else {
							
							that.launchFlag();
						}
					},
					fail: function(data) {
						console.info('---fail-----', data);
					
						that.launchFlag();
					},
				});
			},


			launchFlag: function() {
				
				//清除定时器
				// clearInterval(Interval)
				
				/**
				 * 向本地存储中设置launchFlag的值，即启动标识；
				 */
				uni.setStorage({
					key: 'launchFlag',
					data: true,
				});
               
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		}
	}
</script>
<style>
	page {
		width: 100%;
		height: 100%;
		background-size: 100% auto;
		padding: 0;
	}

	.content {
		width: 100%;
		/* #ifdef H5 */
		height: calc(100vh - 88rpx - 100rpx);
		/* #endif */
		/* #ifdef APP-PLUS */
		height: 100vh;
		/* #endif */

		height: 100vh;
	}

	.swiper {
		width: 100%;
		height: 100%;
		background: #FFFFFF;
	}

	.swiper-item {
		width: 100%;
		height: 100%;
		text-align: center;
		position: relative;
		display: flex;
		/* justify-content: center; */
		align-items: flex-end;
		flex-direction: column-reverse
	}


	.swiper-item image {
		margin: 0 auto;
		width: 100%;
		height: 100%;
	}

	.swiper-item-img {
		width: 100%;
		height: auto;
		margin: 0 auto;
	}

	.swiper-item-img image {
		width: 80%;
	}

	.uniapp-img {
		height: 20%;
		background: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.uniapp-img image {
		width: 40%;
	}

	.jump-over,
	.experience {
		position: absolute;
		height: 50upx;
		line-height: 50upx;
		color: #454343;
		/* border: 1px solid #454343; */
		z-index: 999;
		text-align: center;
		background: rgba(0, 0, 0, 0.2);
		font-size: 34rpx;
		color: #FFFFFF;
	}

	.jump-over {
		padding: 7rpx 25upx;
		right: 30upx;
		top: 65upx;
		border-radius: 32rpx;
		font-size: 30rpx;
		font-weight: 400;
		font-family: PingFangSC-Regular, PingFang SC;
	}

	.experience {
		right: 50%;
		margin-right: -200rpx;
		bottom: 150rpx;
		height: 90rpx;
		width: 400rpx;
		padding: 60rpx 45rpx;
		border-radius: 78rpx;
		font-weight: 500;
		font-family: PingFangSC-Medium, PingFang SC;
		/* 	background-color: #000000;
		opacity:0.2; */
	}
	
	.experienceImg {
		position: absolute;
		left: 50%;
		margin-left: -200rpx;
		bottom: 130rpx;
		/* background-color: aqua; */
		height: 90rpx;
		width: 400rpx;
		overflow: hidden;
		
	}
	.experienceImg>image{
		height: 90rpx;
		width: 400rpx;
	}
	
</style>

<template>
  <view class="openApp"> 
		<view class="openApp_right">
			<image class="shareLogo" :src="shareLogo" mode="widthFix"></image>
			<view class="openAppText">
				<view class="openAppText-title">长乘学堂</view>
				<view>有温度的陪伴式投教学习基地</view>
			</view>
		</view>

		<view class="openApp_button" @tap="openDouyin(downloadUrl)">打开APP
		</view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    isWithdrawal: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
		shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg`,
		downloadUrl:'https://shop.zcskjy.com/zc-config/v1/downloadUrl/query'
	};
  },
  onLoad() {},
  onUnload() {},
  methods: {
	  openDouyin(url) {
	   
	  				// #ifdef APP-PLUS
	  				// 判断平台  
	  				if (plus.os.name == 'Android') {
	  					plus.runtime.openURL(encodeURI(url),
	  						function(res) {
	  							console.log(res)
	  						},
	  						'com.ss.android.ugc.aweme'
	  					)
	  				} else if (plus.os.name == 'iOS') {
	  					plus.runtime.openURL(encodeURI(url),
	  						function(res) {
	  							console.log(res)
	  						}
	  					)
	  				}
	  				// #endif
	   
	  				// #ifdef H5
	  				window.location.href = url;
	  				// #endif
	   
	  			},
  },
};
</script>

<style lang="scss">
	.openApp{
		width: 750rpx;
		height: 100rpx;
		padding: 0 30rpx;
		display: flex;
		flex-direction: initial;
		align-items: center;
		justify-content: space-between;
		border-bottom:1rpx solid #F1F3F8 ;
		position: fixed;
		top:  var(--window-top);
		z-index:999;
		// top: calc( 44px + var(--window-top));
		background: #FFFFFF;
		overflow: hidden;
		box-sizing: border-box;

		.shareLogo{
			width: 70rpx;
			border-radius: 10rpx;
			overflow: hidden;
		}
		&_right{
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.openAppText{
			font-size: 22rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			padding-left: 16rpx;
			&-title{
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #000000;
			}
		}
		&_button{
			width: 140rpx;
			height: 54rpx;
			line-height: 54rpx;
			background: #FB0404;
			border-radius: 27rpx;
			font-size: 26rpx;
			font-family: SourceHanSansSC-Medium, SourceHanSansSC;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
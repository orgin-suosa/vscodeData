<template>
  <view class="itemGuide">
	  <view class="itemGuide_skip" @tap="buttonSkip">跳过</view>
	  <view class="itemGuide-react">
		  <view class="react-left">
			  <view class="react-index">{{itemGuide.index}}</view>
			  <image class="react-image" :src="itemGuide.image" mode="widthFix"></image>
		  </view>
		  
		  <view class="react-right">
			  <view class="react-right-title">{{itemGuide.title}}</view>
			  <view class="react-right-describe">{{itemGuide.describe}}</view>
		  </view>
		  <view class="itemGuide-next" @tap="noviceGuideNext(itemGuide.nextIndex)">下一步</view>
	  </view>
	  <view class="itemGuide-iconReact"></view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    itemGuide: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
		numberBg: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/icon-numberBg.png`,
	};
  },
  onLoad() {},
  onUnload() {},
  methods: {
	  noviceGuideNext(index){
		  console.info("itemGuide-index",index)
		this.$emit('noviceGuideNext', index);
	  },
	  buttonSkip(){
		  this.$emit('buttonSkip');
	  }
  },
};
</script>

<style lang="scss">
	.itemGuide{
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		// overflow: hidden;
		.itemGuide_skip{
			width: 120rpx;
			height: 60rpx;
			line-height: 60rpx;
			background: rgba(0,0,0,0.25);
			border-radius: 30rpx;
			font-size: 32rpx;
			font-family: SourceHanSansSC-Regular, SourceHanSansSC;
			font-weight: 400;
			color: #FFFFFF;
			text-align: center;
			margin: 20rpx;
			align-self: flex-end;
		}
		&-react{
			width: 710rpx;
			height: 304rpx;
			margin: 0 auto;
			background: #FFFFFF;
			border-radius: 20rpx;
			position: relative;
			display: flex;
			overflow: hidden;
			
		}
		.react-index{
			width: 57rpx;
			height: 38rpx;
			line-height: 38rpx;
			background: url('https://qnsp.zcskjy.com/zc_images/home/noviceGuide/icon-numberBg.png');
			background-size:100% 100%;
			background-position: center;
			background-repeat: no-repeat;
			text-align: center;
			font-size: 30rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(255, 97, 97, 1);
			position: absolute;
			left: 0;
			top:0;
			
		}
		.react-image{
			width: 180rpx;
			height: auto;
			margin-top: 46rpx;
			margin-left: 30rpx;
			margin-right: 30rpx;
		}
		.react-right{
				margin-top: 46rpx;
			&-title{
				font-size: 42rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #333333;
				white-space: nowrap;
			}
			&-describe{
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
			}
		}
		&-next{
			width: 180rpx;
			height: 72rpx;
			line-height: 72rpx;
			background: linear-gradient(to right, rgba(255, 97, 97, 1),rgba(255, 150, 97, 1));
			align-self: flex-end;
			border-radius: 36rpx;
			font-size: 36rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #FFFFFF;
			text-align: center;
			cursor: pointer;
			position: absolute;
			bottom: 20rpx;
			right: 30rpx;
			z-index: 999;
		}
		&-iconReact{
			position: absolute;
			left: 120rpx;
			bottom: -14rpx;
			background-color: #FFFFFF;
			width: 28rpx;
			height: 28rpx;
			-webkit-transform: rotate(45deg);
			transform: rotate(45deg);
			border-radius: 2rpx;
		}
	}
</style>
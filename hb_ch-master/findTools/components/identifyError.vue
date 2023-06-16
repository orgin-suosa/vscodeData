<template>
	<view class="showError">
		<view class="errorImg">
			<image src="https://qnsp.zcskjy.com/zc_images/findTools/choose.png" mode=""></image>
		</view>
		<view class="errorContent">
			<view class="">
				图片不清晰或未包含股票名称
			</view>
			<view class="">
				请重新选择
			</view>
		</view>
		<u-button class="btn" text="重新选择" type="default" @click="againChoose"></u-button>
	</view>
</template>

<script>
	export default{
		methods:{
			againChoose(){
				uni.navigateTo({
					url:'/findTools/saoLeiBao/downShares'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.showError{
		text-align: center;
		margin-top: 286rpx;
		margin-bottom: 44rpx;
	}
	.errorImg uni-image{
		width: 198rpx;
		height: 256rpx;
	}
	.errorContent{
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
		margin-bottom: 198rpx;
	}
	.btn{
		width: 520rpx;
		height: 90rpx;
		line-height: 90rpx;
		background: #FA6029 linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
		border-radius: 45rpx;
		font-size: 30rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
	}
</style>
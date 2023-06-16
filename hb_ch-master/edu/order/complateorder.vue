<template>
	<view class="content-view">
		<view class="image-view">
			<image class="m-image-img" src="https://qnsp.zcskjy.com/zc_images/images/order-wait.png" />
		</view>
		<view class="order-state">{{"若您已完成付款"}}</view>
		<view class="order-state" style="margin-top: 10rpx;">{{"请联系您的助教开通权限"}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
            
			
		}
	}
</script>


<style lang="scss" scoped>
	
	.content-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		// padding: 30rpx;
        
		
		.image-view {
			padding-top: 93rpx;
			display: block;
            width: 200rpx;
			height: 188rpx;
			.m-image-img {
				width: 200rpx;
				height: 186rpx;
			}
		}

		.order-state {
			text-align: center;
			margin-top: 37rpx;
			height: 50rpx;
			line-height: 50rpx;
			color: #333333;
			font-size: 36rpx;
			font-weight: 500;
			font-family: PingFangSC-Medium, PingFang SC;
		}

		

	}
</style>

<template>
	<view class="noAccess">
		<image class="img"  :src="picture" mode="widthFix"></image>
		<view class="content">
			<view class="">
				暂无添加自选股权限
			</view>
			<view class="">
				请先开通避雷宝后再添加
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				picture:`${getApp().globalData.qnUrl}/zc_images/findTools/noAccess.png`+ this.$FT.versionKey(),
			}
		}
	}
</script>

<style lang="scss" scoped>
	.noAccess{
		// text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		// margin: 235rpx 0 20rpx 0;
		margin-top: 235rpx;
		.img{
			width: 148rpx; 
			height: 123rpx;
			margin-bottom: 20rpx;
		}
		.content{
			font-size: 26rpx;
			font-weight: 400;
			color: #999999;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
		}
	}
</style>
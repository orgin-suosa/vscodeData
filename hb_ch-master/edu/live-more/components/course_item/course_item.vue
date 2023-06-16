<template>
	<view class="main">
		<view class="left_part">
			<image class="cover_bg" src="../../../../static/images/zc_stock_img1.png" mode="aspectFill"></image>
			<view class="status">测试123</view>
			<view class="watch">8095观看</view>
		</view>
		<view class="right_part">
			<text class="title">战法体系发掘重大机会121312</text>
			<text class="tag">11月22日 9:00-9:30</text>
			<view class="right_bottom">
				<text class="text1">334122人已开通</text>
				<text class="text2">开通VIP</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			courseData: {
				type: Object
			}
		},
		created() {

		},

		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.main {
		width: 690rpx;
		height: 180rpx;
		margin: 16rpx 0rpx;
		background-color: #fff;
		display: flex;
		flex-direction: row;
	}

	.left_part {
		width: 280rpx;
		height: 100%;
		display: flex;
		position: relative;
		border-radius: 10rpx;
	}

	.right_part {
		width: 375rpx;
		height: 100%;
		margin-left: 35rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.cover_bg {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.status {
		position: absolute;
		width: 95rpx;
		height: 30rpx;
		background: #FFC43D linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
		border-radius: 6px 0px 0px 0px;
		width: 95rpx;
		height: 28rpx;
		font-size: 20rpx;
		text-align: center;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 28rpx;

	}

	.watch {
		position: absolute;
		margin-left: 95rpx;
		width: 95rpx;
		height: 30rpx;
		background: #000000;
		border-radius: 0px 0px 6px 0px;
		opacity: 0.2;
		width: 95rpx;
		height: 28rpx;
		font-size: 20rpx;
		text-align: center;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
		line-height: 28rpx;
	}

	.title {
		width: 375rpx;
		height: 53rpx;
		font-size: 38rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 53rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.right_bottom {
		flex: 1;
		display: flex;
		position: relative;
	}

	.tag {
		width: 240rpx;
		height: 38rpx;
		background-color: #FFF5ED;
		border-radius: 6rpx;
		font-size: 26rpx;
		font-family: DINAlternate-Bold, DINAlternate;
		font-weight: bold;
		color: #FFA312;
		line-height: 30rpx;
		display: -webkit-box;
		text-align: center;
		margin-top: 5rpx;
		padding: 5rpx 14rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;

	}
	
	.text1{
		position: absolute;
		bottom: 2rpx;
		width: 180rpx;
		height: 28rpx;
		font-size: 20rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		line-height: 28rpx;
	}
	
	.text2{
		position: absolute;
		bottom: 0rpx;
		right: 0rpx;
		width: 100rpx;
		height: 40rpx;
		font-size: 22rpx;
		text-align: center;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		background: #FFDF8F linear-gradient(90deg, #FFE1B2 0%, #FFDD74 100%);
		color: #AE3B3B;
		border-radius: 20rpx;
		line-height: 40rpx;
	}
</style>

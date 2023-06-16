<template>
	<view class="content-item-view">
		<view class="item-top-view">
			<view class="m-top-title">{{timeStr(itemmodel)}}</view>
			<image class="m-image-img" mode="aspectFill" :src="itemmodel.countryUrl" />
			<view class="m-top-title">{{ itemmodel.title ? itemmodel.title :'中国/香港特别行政区成立纪念日'}} </view>
		</view>
		<view class="item-content">{{ itemmodel.name ? itemmodel.title :'香港交易所北向交易关闭。' }}</view>
	</view>
</template>

<script>
	export default {
		name: "dateitem1",
		props: {
			itemmodel: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {

			};
		},
		methods: {

			timeStr(itemmodel) {
				if (itemmodel.time !== 'null' && itemmodel.time ) {
					let arr = itemmodel.time.split(' ');
					if (arr.length == 2) {
						return arr[1];
					}
				}
				return itemmodel.time;
			},
		},

	}
</script>

<style lang="scss" scoped>
	.content-item-view {
		display: flex;
		flex-direction: column;
		// align-items: center;
		align-items: flex-start;
		justify-content: flex-start;
		height: auto;
		margin: 10rpx 30rpx;
		padding: 30rpx 30rpx 30rpx;
		border-radius: 10rpx;
		background-color: #F9F9F9;
		
		// border-bottom: #E9E9E9 1rpx solid;

		.item-top-view {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			height: 33rpx;
			// width: 100%;
			// padding-top: 30rpx;
            margin-bottom: 20rpx;
			
			.m-top-title {
				height: 30rpx;
				line-height: 30rpx;
				font-size: 26rpx;
				font-weight: Medium;
				color: #666666;
				text-align: left;
				width: auto;
				margin-right: 24rpx;
				font-size: 26rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
			}
			
			.m-image-img {
				height: 30rpx;
				width: 45rpx;
				margin-right: 24rpx;
			}
		}

		.item-content {
			width: 100%;
			height: auto;
			line-height: 40rpx;
			color: #333333;
			text-align: left;
			font-size: 28rpx;
			font-weight: 500;
			font-family: PingFangSC-Medium, PingFang SC;
		}
	}
</style>

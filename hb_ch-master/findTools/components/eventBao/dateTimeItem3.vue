<template>
	<view class="content-item-view">
		<view class="item-top-view">
			<view class="m-topleft">
				<view class="m-top-title">{{timeStr(itemmodel)}}</view>
				<image class="m-image-img" mode="aspectFill" :src="(itemmodel.countryUrl ||itemmodel.countryUr )" />
				<view class="m-comfrom">{{itemmodel.affect ==0 ? '待确定':'已公布'}} </view>
			</view>
			<view class="m-xingview" style="">
				<block v-for="count in 5">
					<image class="m-xing-img" mode="aspectFill" :src="imageStr(itemmodel.star,count)" />
				</block>
			</view>
		</view>
		<view class="item-content">{{ itemmodel.name }}</view>
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
				//状态数组
				statrImgArr: [
					'https://qnsp.zcskjy.com/zc_images/images/stateImg0.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg1.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg2.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg3.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg4.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg5.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg6.png',
				],
			};
		},
		methods: {

			imageStr: function(star, index) {
				if (star < index) {
					return 'https://qnsp.zcskjy.com/zc_images/images/xing3.png'
				} else {
					return 'https://qnsp.zcskjy.com/zc_images/images/xing2.png'
				}
			},

			stateImage: function(itemmodel) {
				return this.statrImgArr[itemmodel.affect];
			},

			timeStr(itemmodel) {
				if (itemmodel.time !== 'null' && itemmodel.time) {
					let arr = itemmodel.time.split(' ');
					if (arr.length == 2) {
						return arr[1];
					}
				}
				return itemmodel.time;
			},

			numStr(title) {
				if (title == null || title == 'null') {
					return '--';
				}
				return title;
			},

			clickItem() {
				this.$emit("click", {});
			}
		},

	}
</script>

<style lang="scss" scoped>
	.content-item-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
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
			justify-content: space-between;
			height: 33rpx;
			width: 100%;
			margin-bottom: 25rpx;

			.m-topleft {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;

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

				.m-comfrom {
					height: 33rpx;
					line-height: 33rpx;
					color: #666666;
					font-size: 24rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}
			}

			.m-xingview {
				height: 40rpx;
				width: 160rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-around;

				.m-xing-img {
					width: 28rpx;
					height: 26rpx;
				}
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

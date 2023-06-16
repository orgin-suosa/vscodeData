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
		<view class="item-center-view">
			<view class="m-center-title">{{itemmodel.title || itemmodel.note}}</view>
			<view class="m-affectview" style="">
				<image class="m-affect-img" mode="aspectFit" :src="stateImage(itemmodel)" />
			</view>
		</view>
		<view class="item-botterm-view">
			<view class="m-bottom-title">{{'前值: '+'  '+numStr(itemmodel.previous)}}</view>
			<view class="m-bottom-title">{{'预期: '+'  '+numStr(itemmodel.consensus)}}</view>
			<view class="m-bottom-title">{{'公布: '+'  '+numStr(itemmodel.actual)}}</view>
		</view>
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
			padding-top: 18rpx;

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

		.item-center-view {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			height: auto;
			padding-top: 10rpx;
			padding-bottom: 10rpx;
			width: 100%;

			.m-center-title {
				width: 60%;
				height: auto;
				line-height: 40rpx;
				color: #333333;
				font-weight: Medium;
				color: #333333;
				text-align: left;
				font-size: 28rpx;
				font-weight: 600;
				font-family: PingFangSC-Medium, PingFang SC;
			}

			.m-affectview {
				height: 48rpx;
				width: 190rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.m-affect-img {
					height: 44rpx;
					width: 188rpx;
				}
			}
		}

		.item-botterm-view {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			height: 30rpx;
			width: 100%;
			padding-bottom: 18rpx;

			.m-bottom-title {
				height: 30rpx;
				line-height: 30rpx;
				font-size: 22rpx;
				color: #666666;
			}
		}
	}
</style>

<template>
	<view class="selected-shares">
		<view class="selected-shares-title">
			<text class="">最新战绩</text>
		</view>
		<view class="selected-shares-content">
			<view class="selected-shares-scroll-box">
				<view class="selected-shares-scroll">
					<view class="selected-shares-child" v-for="(item, index) in selectedShareList" :key="index">
						<view class="" @click="navigateDetails(item)">
							<view class="selected-shares-child-name">{{item.stockName}}</view>
							<view class="selected-shares-child-rate">{{item.zhangFu}}%
							</view>
							
							<view class="selected-shares-child-scale">{{item.desc}}</view>
							<view class="selected-shares-child-release ">{{item.ctime}}发布</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		props: {
			selectedShareList: {
				type: Array,
				default () {
					return [];
				},
			},
			totalOrderStatus: {
				type: Boolean,
				default () {
					return true;
				},
			},
		},
		watch: {
			selectedShareList: {
				handler(newName, oldName) {
					this.selectedShareList = newName;
					console.log('selectedShareList-组件 ', this.selectedShareList);
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
		},
		data() {
			return {
				iconTime1: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-time1.png`,
				iconTime2: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-time2.png`,
				iconTime3: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-time3.png`,
				iconFire: `${getApp().globalData.qnUrl}/zc_images/findTools/fire.png`,
			};
		},
		onLoad() {},
		onUnload() {},
		methods: {
			priceClick() {
				this.$emit('priceClick');
			},
			navigateDetails(item) {
				console.log('navigateDetails', item);
				this.$emit('navigateDetails', item.id);
				//   uni.navigateTo({
				//     url: '/findTools/panZhongbao/introduce',
				//   });
			},
		},
	};
</script>

<style lang="scss">
	.selected-shares {
		width: 750rpx;
		overflow: hidden;

		.selected-shares-title {
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			padding-top: 10rpx;
			padding-bottom:15rpx;

			.iconFire {
				width: 29rpx;
				height: 35rpx;
				margin-right: 10rpx;
				vertical-align: middle;
			}
		}

		.selected-shares-content {
			width: 750rpx;
			max-width: 750rpx;
			overflow: hidden;
		}

		.selected-shares-scroll-box {
			width: 100%;
			height: 250rpx;
			overflow-x: auto;
			position: relative;
		}

		.selected-shares-scroll {
			width: max-content;
			height: 100%;
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;

			.selected-shares-child {
				width: 220rpx;
				height: 240rpx;
				background: linear-gradient(180deg, #FEF5ED 0%, #FFFFFF 100%);
				box-shadow: 0px 2rpx 10rpx 0px rgba(250, 96, 41, 0.1);
				border-radius: 10rpx;
				border: 2rpx solid #FFFFFF;
				margin-right: 20rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				text-align: center;
				// color: #af5d35;
			}

			.selected-shares-child:last-child {
				margin-right: 60rpx;
			}

			.selected-shares-child {
				padding: 0 26rpx;
				display: flex;
				align-items: flex-start;
				justify-content: space-evenly;
				flex-direction: column;
				box-sizing: border-box;

				r &-name {
					font-size: 32px;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #333333;
				}

				&-rate {
					font-size: 42rpx;
					font-family: DIN-Medium, DIN;
					font-weight: 500;
					color: #DA3649;
					.rate-key{
						max-width: 100%;
						max-height: 75rpx;
						line-height: 75rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						word-break: break-all;
						display: -webkit-box;
						white-space: normal;
						-webkit-line-clamp: 1;
					} 
				}

				&-scale,
				&-release {
					transform: scale(0.85);
					white-space: nowrap;
					transform-origin: 15% 100%;
				}

				&-release {
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
				}

				&-bottom {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				&-middle {
					width: 100%;
					max-width: 100%;
					max-height: 130rpx;
					line-height: 42rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					font-size: 28rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
				}

				&-top {
					display: flex;
					align-items: center;
					justify-content: flex-start;

					// padding-bottom: 30rpx;
					.iconTime {
						width: 24rpx;
						height: 24rpx;
						margin-right: 10rpx;
						vertical-align: middle;
					}
				}
			}

			.button-list {
				&-child {
					width: 160rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
					border-radius: 45rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #ffffff;
				}
			}
		}
	}
</style>

<template>

	<!-- @click="videoJump(itemmodel.)" -->
	<view class="content-view">
		<view class="left-view">
			<image class="image-view" :src="imagePathStr()" mode="aspectFill"></image>
		</view>
		<view class="right-view">
			<view class="m-top-view">
				<text class="m-title-label">{{ itemmodel.className }}</text>
				<text class="m-des-label">{{ itemmodel.classDescribe }}</text>
			</view>
			<view class="m-bottom-view" @click="itemClick()">
				<view class="m-price-view">
					<text class="m-price-tit" style="">{{'￥'}}</text>
					<text class="m-price-title">{{ itemmodel.price }}</text>
				</view>
				<!-- <text class="m-share-title">{{ itemmodel.speaker }}</text> -->
				<text class="m-share-title">{{ '分享赚 ￥' + itemmodel.commission }}</text>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		name: "agoodsitem",
		props: {
			itemmodel: {
				type: Object,
				default () {
					return {
						classDescribe: "重点基础提升",
						className: "收益赚钱课",
						image: "http://mallsuite.oss-accelerate.aliyuncs.com/mall/images/media/store/1001/20220512/a07a6b99c3bb4dd4b8e9adb935ecb250.jpg",
						price: 99,
						commission: '11',
						speaker: "长乘讲师",
					}
				},
			},
		},
		data() {
			return {}
		},
		created: function() {},
		methods: {

			itemClick() {
				this.$emit('itemClick');
			},

			imagePathStr() {

				if (this.itemmodel.image == 'null' ||
					this.itemmodel.image == 'undefined' ||
					this.itemmodel.image == null ||
					this.itemmodel.image == '' ||
					this.itemmodel.image == ' ') {

					return 'https://qnsp.zcskjy.com/zc_images/images/my/courseImg.png';
				} else {
					return this.itemmodel.image;
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	.content-view {

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: 170rpx;
		padding: 15rpx 30rpx;
		border-bottom: #E9E9E9 1rpx solid;
		// background-color: #0077AA;

		.left-view {

			margin-right: 30rpx;
			height: 100%;
			width: 140rpx;
			// background-color: #F12F5B;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			.image-view {
				width: 100%;
				height: 100%;
				border-radius: 5rpx;
				// background-color: #F0AD4E;
			}
		}

		.right-view {
			height: 100%;
			// background-color:rgba(255, 140, 151, 1);
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;

			.m-top-view {

				height: 110rpx;
				// background-color: #0077AA;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: space-between;

				.m-title-label {
					height: 50rpx;
					line-height: 50rpx;
					width: 450rpx;
					color: #333333;
					font-size: 36rpx;
					font-weight: 500;
					font-family: PingFangSC-Medium, PingFang SC;
					display: -webkit-box;
					overflow: hidden;
					text-overflow: ellipsis;
					word-wrap: break-word;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}

				.m-des-label {

					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					height: 65rpx;
					line-height: 30rpx;
					color: #666666;
					font-size: 24rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}
			}

			.m-bottom-view {

				height: 50rpx;
				width: 100%;
				// background-color: #F0AD4E;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;

				.m-price-view {

					height: 42rpx;
					line-height: 42rpx;
					color: #F43D3E;
					font-size: 30rpx;
					font-weight: 600;
					font-family: PingFangSC-bold, PingFang SC;

					.m-price-tit {
						height: 24rpx;
						line-height: 24rpx;
						font-size: 20rpx;
						font-weight: 600;
						font-family: PingFangSC-bold, PingFang SC;
					}

					.m-price-title {

						font-size: 36rpx;
						font-weight: 600;
						font-family: PingFangSC-bold, PingFang SC;
					}
				}



				.m-share-title {
					width: 220rpx;
					height: 50rpx;
					border-radius: 25rpx;
					line-height: 50rpx;
					color: #FFFFFF;
					font-size: 24rpx;
					font-weight: 400;
					text-align: center;
					font-family: PingFangSC-Regular, PingFang SC;
					background: -wbkit-linear-gradient(to right, #FF6161, #FF9661);
					background: linear-gradient(to right, #FF6161, #FF9661);

				}
			}



			.m-comfrom {

				font-size: 26rpx;
				height: 40rpx;
				line-height: 40rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				color: #999999;
			}
		}
	}
</style>

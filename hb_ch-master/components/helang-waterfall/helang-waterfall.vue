<template>
	<view class="video-item-content" @click="onTap">
		<view class="item-top-view" style="height: 260rpx;">
			<view class="item-image-content">
				<image class="curriculum-image" :src="itemmodel.image" mode=""></image>
			</view>
			<view class="item-state-label" v-if="false">{{ 'SVIP免费' }}</view>
			<view class="item-time-view">
				<image style="width: 14rpx;height: 17rpx;"
					src="https://qnsp.zcskjy.com/zc_images/images/whiteplay.png" mode="aspectFit"></image>
				<view class="item-time-label">{{ itemmodel.playlengTime+':00' }}</view>
			</view>
		</view>
		<view class="item-bottom-view">
			<view class="item-bottom-des">{{ itemmodel.title + '测试数' }}</view>
			<view class="item-bottom-con" style="width: 100%;">
				<view class="" style="display: flex;align-items: flex-start;">
					<image class="bottom-image-content" :src="itemmodel.portraitUrl"></image>
					<view class="bottom-name-title">{{ itemmodel.teacherName }}</view>
				</view>
				<view class="" style="display: flex;align-items: center;">
					<image class="" style="width:26rpx;height: 24rpx;"
						src="https://qnsp.zcskjy.com/zc_images/images/dianzan.png"></image>
					<view class="bottom-name-title" style="font-size: 22rpx;margin-left:8rpx ;">
						{{ itemmodel.comment_count }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "helang-waterfall",
		props: {
			itemmodel: {
				type: Object,
				default () {
					return {}
				}
			},
			tag: {
				type: String | Number,
				default: ''
			},
			index: {
				type: Number,
				default: -1
			}
		},
		data() {
			return {

			};
		},
		methods: {
			// 发出组件高度信息，在此处可以区分正确和错误的加载，给予错误的提示图片
			emitHeight(e) {
				const query = uni.createSelectorQuery().in(this);
				// query.select('.waterfall-item').boundingClientRect(data => {
				query.select('.video-item-content').boundingClientRect(data => {	
					let height = Math.floor(data.height);
					this.$emit("height", height, this.$props.tag);
				}).exec();
			},
			onTap() {
				this.$emit("click", this.$props.index);
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.video-item-content {
		background-color: #ffffff;
		height: auto;
		min-height: 420rpx;
		width: 358rpx;
		// position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
		
		.item-top-view {
			position: relative;
			// background-color: blue;
			width: 358rpx;
			height: 480rpx;
			
			.item-time-view{
				width: 95rpx;
				height: 36rpx;
				padding-left: 15rpx;
				padding-right: 12rpx;
				background-color: rgba(0, 0, 0, 0.5);
				border-radius: 18rpx;
				overflow: hidden;
				// background-color: #000000;
				position: absolute;
				bottom: 10rpx;
				right: 10rpx;
	            display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				
				.item-time-label{
					height: 27rpx;
					line-height: 27rpx;
					width: auto;
					color: #ffffff;
					font-size: 22rpx;
					font-weight: 500;
					font-family: PingFangSC-Medium, PingFang SC;
				}
			}
			
			.item-state-label{
				// background-color: ;
				position: absolute;
				left: 0;
				bottom: 0;
				width: 115rpx;
				height: 28rpx;
				border-radius: 0 17rpx 0 0;
				overflow: hidden;
				z-index: 1;
				text-align: center;
				line-height: 28rpx;
				color:#AE3B3B;
				font-size: 20rpx;
				font-weight: 500;
				font-family: PingFangSC-Medium, PingFang SC;
				background:-wbkit-linear-gradient(to right,#FFDC6B,#FFE2B9);
				background:linear-gradient(to right,#FFDC6B,#FFE2B9);
			}
			
			.item-image-content {
				position: absolute;
			    width: 100%;
				height: 100%;
				border-radius: 20rpx 20rpx 0 0;
				overflow: hidden;
			    // position: absolute;
				// left: 0;
				// top: 0;
				
				.curriculum-image {
					width: 100%;
					height: 100%;
				}
			}
		}
		
		.item-bottom-view{
			padding: 18rpx 15rpx;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			
			.item-bottom-con{
				height: 60rpx;
				width: auto;
				display: flex;
				// align-items: flex-start;
				align-items: center;
				justify-content: space-between;
				
				.bottom-image-content{
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 20rpx;
				}
				.bottom-name-title{
					height: 60rpx;
					line-height: 60rpx;
					color:#3F3F3F;
					text-align:left;
					font-size: 24rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}
			}
			
			.item-bottom-des{
				margin-bottom: 10rpx;
				width: 328rpx;
				height: auto;
				color:#101115;
				text-align:left;
				max-height: 95rpx;
				line-height: 45rpx;
				font-size: 32rpx;
				font-weight: 600;
				font-family: PingFangSC-Semibold, PingFang SC;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}	
	}	
			
	
	.waterfall-item {
		position: relative;
		padding: 16rpx;
		background-color: #fff;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #666;
		margin-bottom: 20rpx;
		overflow: hidden;

		image {
			display: block;
			width: 100%;
			// 默认设置一个图片的大约值
			height: 350rpx;
		}

		.content {
			margin-top: 16rpx;

			.money {
				color: #fa3534;
				margin-top: 8rpx;
			}

			.label {
				background-color: #fa3534;
				color: #fff;
				font-size: 20rpx;
				padding: 4rpx 16rpx;
				border-radius: 20rpx;
			}

			.shop-name {
				font-size: 20rpx;
				color: #999;
			}


			// padding: 14rpx;
			// display: flex; 
			// flex-direction: column;
			// align-items: center;
			// justify-content: space-between;

			.m-title {
				// margin-bottom: 20rpx;
				width: 100%;
				height: 70rpx;
				line-height: 35rpx;
				font-size: 26rpx;
				// font-weight:bold;
				// font-family:HelveticaNeue;
				// white-space: nowrap;
				color: #333333;
				text-align: left;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.m-content {
				width: 100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				// font-size:26rpx;
				// height:40rpx;
				// line-height:40rpx;
				// color:#999999;

				.m-seecontent {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;

					.m-small-img {
						// background-color: #0077AA;
						width: 24rpx;
						height: 18rpx;
						padding-right: 10rpx;
					}

				}

				.m-detail {
					font-size: 20rpx;
					height: 28rpx;
					line-height: 28rpx;
					color: #909090;

				}
			}

		}



	}
</style>

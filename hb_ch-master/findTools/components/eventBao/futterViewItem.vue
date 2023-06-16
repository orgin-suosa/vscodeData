<template>
	<view class="content-view" @tap="onTap">

		<!-- <image :src="itemmodel.image" mode="aspectFill"
		 style="width: 337rpx;height: 240rpx;"></image> -->

		<view class="m-timeTitle" style="margin-bottom:10rpx;">{{ itemmodel.dateTime +'  '+itemmodel.week  }}</view>
		<view class="m-module-title" style="margin-bottom:10rpx;">{{ itemmodel.eventDesc ? itemmodel.eventDesc : '--' }}</view>

		<view class="m-item-view">
			<view class="m-top-view">
				<view class="m-top-left">
					<view class="m-top-title">
						{{ itemmodel.blockName ? itemmodel.blockName : '--' }}</view>
					<view class="m-top-destitle" :style="itemmodel.blockIndex > 0 ? 'color:#F43D3E':'color:#00A846'">
					{{   itemmodel.blockIndex ? itemmodel.blockIndex > 0 ? '+'+ itemmodel.blockIndex +'%' : itemmodel.blockIndex +'%' :'0.00%' }}</view>
				</view>
				<view class="m-top-right">
					{{'影响板块'}}
				</view>
			</view>
        <!--    <image class="m-small-img" style="" mode="aspectFit"
            	src="https://qnsp.zcskjy.com/zc_images/images/eye.png" /> -->
			<view class="m-bottom-view" style="">
				
				<view class="m-bottom-left m-bottom-item" style="">
				    <text class="m-bitem-title">{{ '上涨/下跌(个）' }}</text>
				    <view class="m-line"></view>
					<view class="m-bl-view">
						<text class="m-detail" style="color:#F43D3E;">{{ itemmodel.upNumber ? itemmodel.upNumber : '0'}}</text>  
						<text class="m-detail" style="color:#333333;">{{ '/' }}</text>  
						<text class="m-detail" style="color: #00A846;">{{ itemmodel.downNumber ? itemmodel.downNumber : '0'}}</text>  
					</view>
				</view>
				<view class="m-bottom-center m-bottom-item" style="">
					<text class="m-bitem-title">{{ '涨停(个）' }}</text>
				    <view class="m-line"></view>
					<text class="m-detail" style="color:#333333;">{{ itemmodel.limitNumber ? itemmodel.limitNumber : '0'}}</text>
				</view>
				<view class="m-bottom-right m-bottom-item" style="">
					<text class="m-bitem-title">{{ '领涨股' }}</text>
					<view class="m-line"></view>
					<view class="m-br-view" style="display: flex;align-items: center;justify-content: space-between;width: 100%;">
						<text class="m-detail">{{ itemmodel.leadingStockName ? itemmodel.leadingStockName : '--'}}</text>
						<text class="m-detail" :style="itemmodel.leadingStockIndex > 0 ? 'color:#F43D3E':'color:#00A846'">
						{{ itemmodel.leadingStockIndex ? itemmodel.leadingStockIndex > 0 ? '+'+ itemmodel.leadingStockIndex +'%' : itemmodel.leadingStockIndex +'%' :'0.00%' }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "futteritem",
		props: {
			itemmodel: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {};
		},
		methods: {
			// 发出组件高度信息，在此处可以区分正确和错误的加载，给予错误的提示图片
            daytimeStr() {
            	if (this.itemmodel.time !== 'null' && this.itemmodel.time) {
            		let arr = this.itemmodel.time.split(' ');
            		if (arr.length == 2) {
            			return arr[1];
            		}
            	}
            	return this.itemmodel.time;
            },
			
			videoNum() {

				return 10000 + (this.itemmodel.viewCount + 10) * 6;
			},

			onTap() {
				this.$emit("click", {});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content-view {

		// width: 337rpx;
		// height: 360rpx;
		// position: relative;
		// border-radius: 10rpx;
		// font-size: 28rpx;
		// color: #666;
		// overflow: hidden;
       
		background-color: #FCFCFC;
		margin: 20rpx 30rpx 10rpx;
       
		.m-timeTitle{
			height: 33rpx;
			line-height: 33rpx;
			color: #666666;
			font-size: 24rpx;
			font-weight: 400;
			background-color: #FCFCFC;
			font-family: PingFangSC-Regular, PingFang SC;
		}  
		.m-module-title{
			// height: 45rpx;
			height: auto;
			line-height: 45rpx;
			color: #333333;
			font-size: 32rpx;
			font-weight: 500;
			background-color: #FCFCFC;
			font-family: PingFangSC-Regular, PingFang SC;
		}

		.content-view>image {
			display: block;
			width: 100%;
			height: 320rpx;
			border-radius: 10rpx 10rpx 0 0;
		}

		.m-item-view {
			padding: 20rpx 0rpx 20rpx 20rpx;
			height: 220rpx;
			// background: #F9F9F9;
			background-color: #ffffff;
			border-radius: 8rpx;
            // box-shadow: 5rpx 5rpx 5rpx #FCFCFC;
			
			
            .m-top-view{
				
				display: flex;
                flex-direction: row;
                align-items: center;
				justify-content: space-between;
				height:56rpx;
								
				.m-top-left{
					
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: flex-start;
					height:56rpx;
					
					.m-top-title{
						height: 56rpx;
						line-height: 56rpx;
						color: #000000;
						font-size: 40rpx;
						font-weight: 500;
						font-family: PingFangSC-Medium, PingFang SC;
					}
					
					.m-top-destitle{
						height: 35rpx;
						line-height: 35rpx;
						color: #F43D3E;
						margin-left: 15rpx;
						font-size: 34rpx;
						font-weight: 600;
						font-family: PingFangSC-Bold, PingFang SC;
					}
				}
				
				.m-top-right{
					width: 120rpx;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					color: #ffffff;
					border-radius: 20rpx 0 0 20rpx;
					font-size: 22rpx;
					font-weight: 400;
					font-family: PingFangSC-Medium, PingFang SC;
					background: -wbkit-linear-gradient(to right, #FF8B4A, #FFBE98);
					background: linear-gradient(to right, #FF8B4A, #FFBE98);
				}
			}
			 

			.m-title {
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
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.m-bottom-view {
				
				// width: 100%;
				height: 140rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				// background-color: #F43D3E;
				margin-top: 20rpx;
				padding-right: 30rpx;
				border-radius: 8rpx;
				
				.m-line{
					width: 100%;
					height: 2rpx;
					background-color: #F0F0F0;
				}
				
				.m-bottom-item{
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: space-between;
					background-color: #F9F9F9;
					border-radius: 8rpx;
					padding: 20rpx 10rpx 15rpx 10rpx;
				}
				
                .m-bottom-left{
					width: 180rpx;
					height: 100rpx;
				} 
				
				.m-bottom-center{
					width: 120rpx;
					height: 100rpx;
				} 
				
				.m-bottom-right{
					width: 260rpx;
					height: 100rpx;
				} 
				
				.m-bitem-title{
					height: 35rpx;
					line-height: 35rpx;
					color: #333333;
					padding-bottom:12rpx;
					// margin-left: 15rpx;
					font-size: 26rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}	
				
			}
		}
	}
</style>

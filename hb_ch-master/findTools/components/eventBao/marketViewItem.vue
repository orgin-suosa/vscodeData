<template>
	<view class="content-view" >

		<view class="m-item-view">
			<view class="m-top-view" @click="leftBtnClick">
				<view class="m-top-left">
					<view class="m-top-title">
						{{ itemmodel.industryName ? itemmodel.industryName :'--'}}</view>
					<view class="m-top-destitle" :style="itemmodel.industryIndex > 0 ? 'color:#F43D3E':'color:#00A846'">
					{{ itemmodel.industryIndex ? itemmodel.industryIndex > 0 ? '+'+ itemmodel.industryIndex +'%' : itemmodel.industryIndex +'%' :'0.00%'}}</view>	
				
				</view>
				<view class="m-top-right" :style="itemmodel.mainCapitalInflow > 0 ? 'color:#F43D3E':'color:#00A846'">
					{{  itemmodel.mainCapitalInflow ? itemmodel.mainCapitalInflow > 0 ? '+'+ itemmodel.mainCapitalInflow +'万' : itemmodel.mainCapitalInflow +'万' :'0.00%' }}
				</view>
			</view>
     
			<view class="m-bottom-view" style="">
				<view class="m-bottom-left m-bottom-item" style="">
				    <view class="m-br-item" @click="leftBtnClick">
						<view class="">
							<text class="m-detail-title" style="padding-right: 10rpx;">{{ '行业异动次数' }}</text>
							<image src="https://qnsp.zcskjy.com/zc_images/images/market-icon.png" mode="aspectFill" style="width: 22rpx;height: 22rpx;"></image> 
						</view>
				    	<image src="https://qnsp.zcskjy.com/zc_images/images/nav.png" mode="aspectFill" style="width: 15rpx;height: 25rpx;"></image> 
				    </view>
				    <view class="m-line"></view>
					<view  class="m-br-item">
						<text class="m-bnum-title" style="color:#F43D3E;">{{itemmodel.indusChgUpCount? itemmodel.indusChgUpCount +'↑':'0' }}</text>
						<text class="m-bnum-title" style="color:#00A846;">{{itemmodel.indusChgDownCount? itemmodel.indusChgDownCount +'↓':'0' }}</text>
					</view>
				</view>
			
				<view class="m-bottom-right m-bottom-item" @click="rightBtnClick">
					<view class="m-br-item" >
						<text class="m-detail-title">{{ '异动龙头股' }}</text>
						<image src="https://qnsp.zcskjy.com/zc_images/images/nav.png" mode="aspectFill" style="width: 15rpx;height: 25rpx;"></image> 
					</view>
					 <view class="m-line"></view>
					<view  class="m-br-item" style="">
						<text class="m-detail-title" style="font-weight: 500;font-family: PingFangSC-Medium, PingFang SC;padding-top: 15rpx;">{{ itemmodel.changeLeadStockName ? itemmodel.changeLeadStockName:'--' }}</text>
						
						<view class="m-detail-title" style="color:#F43D3E;padding-top: 15rpx;" :style="itemmodel.changeLeadStockIndex > 0 ? 'color:#F43D3E':'color:#00A846'">
						{{ itemmodel.changeLeadStockIndex ? itemmodel.changeLeadStockIndex > 0 ? '+'+ itemmodel.changeLeadStockIndex +'%' : itemmodel.changeLeadStockIndex +'%' :'0.00%' }}</view>	
										
						<!-- <text class="m-detail-title">{{ '+5.60%' }}</text> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "marketitem",
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
			
		    leftBtnClick() {
		     	this.$emit("leftBtnClick", {});
		    },
			
			rightBtnClick() {
				this.$emit("rightBtnClick", {});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content-view {
       
		background-color: #FCFCFC;
		margin: 20rpx 30rpx 10rpx;
       
		.m-timeTitle{
			height: 33rpx;
			line-height: 33rpx;
			color: #666666;
			font-size: 24rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, PingFang SC;
		}  
		
		.m-module-view{
			
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			
			.m-module-title{
				height: 45rpx;
				line-height: 45rpx;
				color: #333333;
				font-size: 32rpx;
				font-weight: 500;
				background-color: #FCFCFC;
				font-family: PingFangSC-Medium, PingFang SC;
			}
			
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
					// width: 120rpx;
					height: 32rpx;
					line-height: 32rpx;
					text-align: right;
					color: #333333;
					font-size: 28rpx;
					font-weight: 600;
					font-family: PingFangSC-bold, PingFang SC;
					// border-radius: 20rpx 0 0 20rpx;
					// background: -wbkit-linear-gradient(to right, #FF9675, #FF5F57);
					// background: linear-gradient(to right, #FF9675, #FF5F57);
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
				padding-right: 20rpx;
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
					padding: 20rpx 20rpx 15rpx 20rpx;
				}
				
                .m-bottom-left{
					width: 280rpx;
					height: 110rpx;
				} 
				
				.m-bottom-right{
					width: 280rpx;
					height: 110rpx;
					background-color:#F9F9F9;
					// padding: 0rpx 10rpx 0rpx 10rpx;
				} 
				
				.m-br-item{
					 display: flex;
					 flex-direction: row;
					 align-items: center;
					 justify-content: space-between;
					 width: 100%;
					 height: 60rpx;
					 // padding-left: 8rpx;
					 // padding-right: 8rpx;
					 border-radius: 8rpx;
					// padding-right: 10rpx;
					
					.m-detail-title{
						height: 37rpx;
						line-height: 37rpx;
						color: #333333;
						// padding-bottom:12rpx;
						font-size: 26rpx;
						font-weight: 400;
						font-family: PingFangSC-Regular, PingFang SC;
					}
					
					.m-bnum-title{
						height: 35rpx;
						line-height: 35rpx;
						padding-top:15rpx;
						font-size: 28rpx;
						font-weight: 500;
						font-family: PingFangSC-Medium, PingFang SC;
					}
					
					
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

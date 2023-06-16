<template>
	<view class="content-view" >
		<view class="m-timeTitle" style="margin-bottom:10rpx;">{{ timeStr(itemmodel)}}</view>
		<view class="m-module-view" style="margin-bottom:10rpx;" @click="clickTitleItem">
			<text class="m-module-title">{{ itemmodel.title ? itemmodel.title:'--' }}</text>  
			<image src="https://qnsp.zcskjy.com/zc_images/images/nav.png" mode="aspectFill" style="width: 15rpx;height: 25rpx;"></image> 
		</view>

		<view class="m-item-view" @click="clickModelItem">
			<view class="m-top-view">
				<view class="m-top-left">
					<view class="m-top-title">
						{{itemmodel.name ? itemmodel.name:'--' }}</view>
					<view class="m-top-destitle" :style="itemmodel.banKuaiZhangFu > 0 ? 'color:#F43D3E':'color:#00A846'">
						{{ itemmodel.banKuaiZhangFu ? itemmodel.banKuaiZhangFu > 0 ? '+'+ itemmodel.banKuaiZhangFu +'%' : itemmodel.banKuaiZhangFu +'%' :'0.00%' }}</view>
				</view>
				<view class="m-top-right">
					{{'机会板块'}}
				</view>
			</view>
     
			<view class="m-bottom-view" style="" @click="clickModelItem">
				<view class="m-bottom-left m-bottom-item" style="">
				    <text class="m-bitem-title">{{ '上涨/下跌/平盘(个）' }}</text>
				    <view class="m-line"></view>
				    <view class="m-bl-view">
						<text class="m-detail-title" style="color:#F43D3E;font-size: 28rpx;">{{ itemmodel.shangZhangNum ? itemmodel.shangZhangNum :'0' }}</text>  
						<text class="m-detail-title" style="color:#333333;font-size: 28rpx;">{{ '/' }}</text>  
						<text class="m-detail-title" style="color: #00A846;font-size: 28rpx;">{{ itemmodel.xiaDieNum ? itemmodel.xiaDieNum :'0'}}</text>
						<text class="m-detail-title" style="color:#333333;font-size: 28rpx;">{{ '/' }}</text>
						<text class="m-detail-title" style="color: #333333;font-size: 28rpx;">{{ itemmodel.pingPanNum ? itemmodel.pingPanNum :'0'}}</text>  
					</view>
				</view>
		
				<view class="m-bottom-right m-bottom-item" style="display: flex;flex-direction: column; align-items: center;justify-content: space-between;font-size: 26rpx;">
					<view class="m-br-item" v-show="relationShow">
						<text class="m-detail-title">{{ relationModel.name }}</text>
						<view class="m-detail-title" :style="relationModel.zhangFu > 0 ? 'color:#F43D3E':'color:#00A846'">
							{{  relationModel.zhangFu ? relationModel.zhangFu > 0 ? '+' + relationModel.zhangFu +'%' : relationModel.zhangFu +'%' :'0.00%' }}</view>	
					</view>
					<view  class="m-br-item" v-show="relationShow2" >
						<text class="m-detail-title">{{  relationModel2.name }}</text>
						<view class="m-detail-title" :style="relationModel2.zhangFu > 0 ? 'color:#F43D3E':'color:#00A846'">
							{{ relationModel2.zhangFu ? relationModel2.zhangFu > 0 ? '+'+ relationModel2.zhangFu +'%' : relationModel2.zhangFu +'%':'0.00%' }}</view>	
					</view> 
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "eventitem",
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
				relationModel:Object,
				relationModel2:Object,
				relationShow:false,
				relationShow2:false,
			};
		},
		
		onLoad:function(){
		
		    // console.info('-----onLoad----',this.itemmodel );	
		},
		
		created:function(){
		
		    if(this.itemmodel.relationCodes){
				if( this.itemmodel.relationCodes.length > 0){
					this.relationModel = this.itemmodel.relationCodes[0];
					this.relationShow = true;
				} 
				if( this.itemmodel.relationCodes.length > 1){
					this.relationModel2 = this.itemmodel.relationCodes[1];
					this.relationShow2 = true;
				} 
			}
		},
		
		methods: {
			
			timeStr(itemmodel) {
				
				if (itemmodel.time !== 'null' && itemmodel.time) {
					let arr = itemmodel.time.split(' ');
					if (arr.length == 2) {
						return arr[1];
					}
					if (arr.length == 1) {
						return arr[0];
					}
					return itemmodel.time;
				}else if (itemmodel.date !== 'null' && itemmodel.date){
					
					return itemmodel.date;
				}
			},
		    
		    //
			clickModelItem() {
				
				this.$emit("click");
			},
			
			clickTitleItem() {
				this.$emit("clicktitle");
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
				// height: 45rpx;
				height: auto;
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
			// background-color: aqua;
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
					background: -wbkit-linear-gradient(to right, #FF9675, #FF5F57);
					background: linear-gradient(to right, #FF9675, #FF5F57);
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
					width: 335rpx;
					height: 110rpx;
				} 
				
				.m-bottom-right{
					width: 260rpx;
					height: 140rpx;
					background-color: #ffffff;
					padding: 0rpx 10rpx 0rpx 10rpx;
				} 
				
				.m-br-item{
					 display: flex;
					 align-items: center;
					 justify-content: space-between;
					 width: 100%;
					 height: 60rpx;
					 background-color:#F9F9F9;
					 padding-left: 8rpx;
					 padding-right: 8rpx;
					 border-radius: 8rpx;
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

<template>
	
	<!-- @click="videoJump(itemmodel.)" -->
	<view class="content-view">
	  <view class="left-view" >
		<image class="image-view" :src="itemmodel.buyer_user_avatar" mode="aspectFill"></image>
	  </view>
	  <view class="right-view">
		<view class="m-top-view">
			<view class="m-top-imgview" style="">
				<image class="m-photo-image" :src="itemmodel.buyer_user_avatar"  mode="aspectFill"></image>
				 <text class="m-title-label">{{ itemmodel.buyer_user_nickname }}</text>
			</view>	
			<view class="m-price-view">
				<text class="m-price-tit" style="">{{'￥'}}</text>
				<text class="m-price-title">{{ itemmodel.uo_buy_commission }}</text>
			</view>
		</view>
		<view class="m-bottom-view">
		  <text class="m-order-title">{{'成交订单: '+itemmodel.order_id }}</text>
		  <text class="m-state-title " :class="itemmodel.uo_active == 0 ? 'm-state-Hightitle': ''">{{ orderState() }}</text>
		</view>
	  </view>
	</view>
	
</template>

<script>
	export default {
		name:"aorder-item",
		props: {
			itemmodel: {
				type: Object,
				default () {
					return {
						buyer_user_avatar: '',
						user_avatar:'',
						buyer_user_nickname: '',
						user_nickname:'',
						uo_buy_commission: '',
						uo_directseller_commission:'',
						order_id:'订单号:',
						uo_active: 0,  //订单状态
					}
				},
			},
		},
		data() {
			return {
			}
		},
		created: function() {
		},
		methods: {
			
			itemClick(){
				
				this.$emit('itemClick',{id:this.itemmodel.id});
			},
						
			orderState(){
				
               if(this.itemmodel.uo_active == 0){
				   return '未达成';
			   }else if(this.itemmodel.uo_active == 1){
				    return '收益';
			   }else{
				    return '未达成';
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
	  height: 122rpx;
	  padding: 20rpx 30rpx;
	  border-bottom: #F5F5F5 1rpx solid;
	  // background-color: #0077AA;
	  
	  .left-view{
		  margin-right: 30rpx;
		  height: 100%;
		  width: 100rpx;
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  justify-content: center;
		 
		  .image-view{
			  width: 100%;
			  height:100%;
		  }
	  }
	  
	  .right-view{
		  margin: 6rpx 0rpx;
		  // height: 100%;
		  // background-color: #F3A73F;
		  flex: 1;
		  display: flex;
		  flex-direction: column;
		  align-items: center;
		  justify-content: space-between;
		  
		.m-top-view{
			width: 100%;
			// background-color: #0077AA;
			height: 60rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin-bottom:  10rpx;
			
			.m-top-imgview{
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
			
				.m-photo-image{
					 width: 60rpx;
					 height: 60rpx;
					 margin-right: 14rpx;
					 border-radius: 30rpx;
				}
				.m-title-label{
					 height: 40rpx;
					 line-height:40rpx;
					 color: #333333;
					 font-size: 32rpx;
					 font-weight: 500;
					 font-family: PingFangSC-Medium, PingFang SC;
				}
				
			}
			
			
			.m-price-view{
				
				height: 42rpx;
				line-height:42rpx;
				color: #333333;
				font-size: 36rpx;
				font-weight: 600;
				font-family: PingFangSC-bold, PingFang SC;
				
				.m-price-tit{
					height: 24rpx;
					line-height:24rpx ;
					font-size: 20rpx;
					font-weight: 600;
					font-family: PingFangSC-bold, PingFang SC;
				}
				
				.m-price-title{
			
					font-weight: 600;
					font-family: PingFangSC-bold, PingFang SC;
				}
			}
			
			.m-des-label{
				
				height: 42rpx;
				line-height:42rpx;
				color: #333333;
				font-size: 30rpx;
				font-weight: 600;
				font-family: PingFangSC-bold, PingFang SC;
			}
		}
		.m-bottom-view{
			
			height: 40rpx;
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			
			line-height:40rpx ;
			color: #999999;
			font-size: 24rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, PingFang SC;
			
			.m-order-title{
				color: #999999;
				text-align: left;
			}
			
			.m-state-Hightitle{
				color: #F43D3E;
				text-align: right;
			}
			
			.m-state-title{
				text-align: right;
			}
		}
	  }
	}
	
</style>

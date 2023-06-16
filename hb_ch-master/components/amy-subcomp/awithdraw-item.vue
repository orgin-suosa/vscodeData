<template>
	
	<!-- @click="videoJump(itemmodel.)" -->
	<view class="content-view">
	 
		<view class="m-top-view">
		   <text class="m-title-label">{{ '提现' }}</text>
		   <view class="m-price-view">
		      <text class="m-price-tit" style="">{{'￥'}}</text>
		   	  <text class="m-price-title">{{ itemmodel.withdraw_amount }}</text>
		   </view>
		</view>
		<view class="m-bottom-view">
		  <text class="m-time-title">{{'时间:'+ itemmodel.withdraw_time }}</text>
		  <text :class="itemmodel.withdraw_state == 0 ? 'm-state-title':'m-passstate-title'">{{ orderStateStr() }}</text>
		</view>
	 
	</view>
	
</template>

<script>
	export default {
		name:"awithdrawitem",
		props: {
			itemmodel: {
				type: Object,
				default () {
					return {
					
						title: '央行：增加天津市、重庆市、杭州市等城市作',
						withdraw_amount: '1.10',
						withdraw_time:'一门课学会价值投资',
						withdraw_state: '',
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
			orderStateStr(){
				
				if(this.itemmodel.withdraw_state == 0){
					return '驳回';
				}else if(this.itemmodel.withdraw_state == 1){
					return '通过'
				}
			},			
			timeStr(){
				
			},
	
		}
	}
</script>

<style lang="scss" scoped>

	.content-view {
	  	
	  height: 85rpx;
	  padding: 25rpx 30rpx 10rpx ;
	  border-bottom: #F5F5F5 1rpx solid;
	  // background-color: #0077AA;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: space-between;
		  
		.m-top-view{
			width: 100%;
			height: 42rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			
			.m-title-label{
				 height: 40rpx;
				 line-height:40rpx;
				 color: #333333;
				 font-size: 32rpx;
				 font-weight: 500;
				 font-family: PingFangSC-Medium, PingFang SC;
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
				font-size: 36rpx;
				font-weight: 600;
				font-family: PingFangSC-bold, PingFang SC;
			}
		}
		.m-bottom-view{
			
			// height: 40rpx;
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			
			height: 40rpx;
			line-height:40rpx;
			color: #999999;
			font-size: 20rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, PingFang SC;
			
			.m-time-title{
			
				font-size: 20rpx;
			}
			
			.m-state-title{
				
				color: #666666;
				font-size: 24rpx;
				text-align: right;
			}
			
			.m-passstate-title{
			
				color: #F43D3E;
				font-size: 24rpx;
				text-align: right;
			}
		}
	  
	}
	
</style>

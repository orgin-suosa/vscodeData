
<template>
	
	<!-- @click="videoJump(itemmodel.)" -->
	<view class="content-view">
	  <view class="left-view" >
		<image class="image-view" src="https://qnsp.zcskjy.com/zc_images/images/quickbgImg.png"  mode="aspectFill"></image>
	  </view>
	  <view class="right-view">
		<view class="m-top-view">
		   <text class="m-title-label">{{ itemmodel.title }}</text>
		   <view class="m-price-view">
		      <text class="m-price-tit" style="">{{'￥'}}</text>
		   	  <text class="m-price-title">{{ itemmodel.price }}</text>
		   </view>
		   
		</view>
		<view class="m-bottom-view">
		  <text class="m-order-title">{{ itemmodel.order }}</text>
		  <text class="m-state-title">{{ itemmodel.state }}</text>
		</view>
	  </view>
	</view>
	
</template>

<script>
	export default {
		name:"apromote-item",
		props: {
			itemmodel: {
				type: Object,
				default () {
					return {
						img: '',
					   
						title: '央行：增加天津市、重庆市、杭州市等城市作',
						price: '29.10',
						order:'一门课学会价值投资',
						state: '分享赚 ￥9.08',
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
						
			timeStr(){
				
				// if(this.itemmodel.time !== 'null'){
				// 	let arr = this.itemmodel.time.split(' ');
				// 	if(arr.length == 2){
				// 		return arr[1];
				// 	}
				// }
				// return this.itemmodel.time;
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
	  height: 80rpx;
	  padding: 19rpx 30rpx;
	  border-bottom: #F5F5F5 1rpx solid;
	  // background-color: #0077AA;
	  
	  .left-view{
		  margin-right: 30rpx;
		  height: 100%;
		  width: 80rpx;
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  justify-content: center;
		 
		  .image-view{
			  width: 100%;
			  height:100%;
			  border-radius: 5rpx;
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
			
			height: 40rpx;
			width: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			
			
			.m-order-title{
				height: 40rpx;
				line-height:40rpx;
				color: #999999;
				font-size: 20rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
			}
			
			.m-state-title{
				height: 40rpx;
				line-height:40rpx;
				color: #999999;
				font-size: 24rpx;
				font-weight: 400;
				text-align: right;
				font-family: PingFangSC-Regular, PingFang SC;
			}
		}
	  }
	}
	
</style>

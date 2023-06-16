<template>
	<view class="waterfall-item" @tap="onTap">
		<!-- <image :src="itemmodel.cover" mode="widthFix" 
		@load="emitHeight" @error="emitHeight" style="border-radius: 10rpx;"></image> -->
	<!-- 	<image :src="itemmodel.cover" mode="widthFix"
		@load="emitHeight" style="border-radius: 10rpx;"></image>
		 -->
		 
		<image :src="itemmodel.cover" mode="aspectFill"
		 style="width: 320rpx;height: 240rpx; border-radius: 10rpx;"></image>
		 
		<image class="m-video-img" 
		style="position: absolute;right:26rpx;top: 26rpx;width: 26rpx;
		height: 26rpx;z-index: 999;" mode="aspectFit" src="/static/images/iconplay.png"/>
		
		<view class="content">
			<view class="m-title" style="margin-bottom:10rpx;">
			{{itemmodel.title}}</view>
			
			<view class="m-content">
				<text class="m-detail">{{itemmodel.sourceDesc}}</text> 
				<view class="m-seecontent">
					<image class="m-small-img" style="" mode="aspectFit" src="/static/images/eye.png"/>
					<text  class="m-detail">{{itemmodel.viewCount}}</text>
					<!-- <text  class="m-detail">{{itemmodel.viewNum}}</text> -->
				</view>
			</view>
			
			<!-- <view>{{itemmodel.title}}</view>
			<view class="money">{{itemmodel.money}}元</view>
			<view style="margin: 0 0 8rpx 0;">
				<text class="label">{{itemmodel.label}}</text>
			</view>
			<view class="shop-name">{{itemmodel.shop}}</view>
			-->
		</view> 
	</view>
</template>

<script>
	export default {
		name:"helang-waterfall",
		props:{
			itemmodel:{
				type: Object,
				default(){
					return {}
				}
			},
			tag:{
				type:String | Number,
				default:''
			},
			index:{
				type:Number,
				default:-1
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			// 发出组件高度信息，在此处可以区分正确和错误的加载，给予错误的提示图片
			emitHeight(e){
				const query = uni.createSelectorQuery().in(this);
				query.select('.waterfall-item').boundingClientRect(data => {
					let height = Math.floor(data.height);
					this.$emit("height",height,this.$props.tag);
				}).exec();
			},
			onTap(){
				this.$emit("click",this.$props.index,this.$props.tag);
			}
		}
	}
</script>

<style lang="scss" scoped>
.waterfall-item{
	position: relative;
	padding: 16rpx;
	background-color: #fff;
	border-radius: 10rpx;
	font-size: 28rpx;
	color: #666;
	margin-bottom: 20rpx;
	overflow: hidden;
	
	image{
		display: block;
		width: 100%;
		// 默认设置一个图片的大约值
		height: 350rpx;
	}
	
	.content{
		margin-top: 16rpx;
		
		.money{
			color: #fa3534;
			margin-top: 8rpx;
		}
		
		.label{
			background-color: #fa3534;
			color: #fff;
			font-size: 20rpx;
			padding: 4rpx 16rpx;
			border-radius: 20rpx;
		}
		
		.shop-name{
			font-size: 20rpx;
			color: #999;
		}
	
			  
	  // padding: 14rpx;
	  // display: flex; 
	  // flex-direction: column;
	  // align-items: center;
	  // justify-content: space-between;
			  
	   .m-title{
		  // margin-bottom: 20rpx;
		  width:100%;
		  height:70rpx;
		  line-height:35rpx;
		  font-size: 26rpx;
		  // font-weight:bold;
		  // font-family:HelveticaNeue;
		  // white-space: nowrap;
		  color:#333333;
		  text-align:left;
		  overflow: hidden;
		  text-overflow: ellipsis;
	  }
	  
	   .m-content{
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items:center ;
		justify-content: space-between;
		// font-size:26rpx;
		// height:40rpx;
		// line-height:40rpx;
		// color:#999999;
		   
		   .m-seecontent{
			   display: flex;
			   flex-direction: row;
			   align-items:center ;
			   justify-content: space-between;
			   
			   .m-small-img {
				   // background-color: #0077AA;
				   width: 24rpx;
				   height:18rpx;
				   padding-right: 10rpx;
			   }
			   
		   }
		   
		   .m-detail{
				font-size:20rpx;
				height:28rpx;
				line-height:28rpx;
				color:#909090;
				
			}
	    }
			  
	}
	
	
	
}
</style>

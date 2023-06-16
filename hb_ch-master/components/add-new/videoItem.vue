<template name="videoitem">
	<view class="video-item" @tap="onTap">
		<!-- <image :src="itemmodel.cover" mode="widthFix" 
		@load="emitHeight" @error="emitHeight" style="border-radius: 10rpx;"></image> -->
	<!-- 	<image :src="itemmodel.cover" mode="widthFix"
		@load="emitHeight" style="border-radius: 10rpx;"></image>
		 -->
		 
		<image :src="itemmodel.cover" mode="aspectFill"
		 style="width: 337rpx;height: 240rpx;"></image>
		 
		<view class="m-item-view">
			<view class="m-title" style="margin-bottom:10rpx;">{{itemmodel.title ? itemmodel.title : '测试标题' }}</view>
			
			<view class="m-bottom-content" style="">
				<view class="m-detail timeStr">{{ timeStr() }}</view> 
				<view class="m-seecontent">
					<image class="m-small-img" style="" mode="aspectFit" src="https://qnsp.zcskjy.com/zc_images/images/eye.png"/>
					<text  class="m-detail">{{videoNum()}}</text>
				</view>
			</view>
		</view> 
	</view>
</template>

<script>
	export default {
		name:"videoitem",
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
			
			timeStr(){
				let time = new Date(this.itemmodel.publishTime * 1000)
				let year = time.getFullYear()
				let month = time.getMonth() + 1
				let date = time.getDate()
				let hours = time.getHours()
				let minute = time.getMinutes()
				let second = time.getSeconds()
				if (month < 10) { month = '0' + month }
				if (date < 10) { date = '0' + date }
				if (hours < 10) { hours = '0' + hours }
				if (minute < 10) { minute = '0' + minute }
				if (second < 10) { second = '0' + second }
				let timeString = year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second;
				// console.log('--timeString---',timeString);
				return timeString;
				
			},
			
			videoNum(){
				
				return 10000 + (this.itemmodel.viewCount +10) *6;
			},
			onTap(){
				this.$emit("click",{});
			}
		}
	}
</script>

<style lang="scss" scoped>
	
.video-item{
	width: 337rpx;
	height: 360rpx;
	position: relative;
	// padding: 16rpx;
	background-color: #fff;
	border-radius: 10rpx;
	font-size: 28rpx;
	color: #666;
	margin-bottom: 20rpx;
	overflow: hidden;
	
	image{
		display: block;
		width: 100%;
		height: 320rpx;
		border-radius: 10rpx 10rpx 0 0;
	}
	
	.m-item-view{
		padding: 0 14rpx;
		padding-top: 16rpx;
		height: 120rpx;
		background: #F9F9F9;
		border-radius: 0 0 10rpx 10rpx;
	   .m-title{
		
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
		  display: -webkit-box;
		  -webkit-line-clamp: 2;
		  -webkit-box-orient: vertical;
	  }
	  
	   .m-bottom-content{
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items:center ;
		justify-content: space-between;
		// font-size:26rpx;
		height:40rpx;
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
				white-space: nowrap;
			}
			.timeStr{
				max-width: 70%;
				overflow: hidden;
			}
	    }
			  
	}
}
</style>

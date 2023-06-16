
<template>
	
	<view class="content-view" @click="itemClick">
	  <view class="left-view" >

		<image class="image-view" :src="imagePathStr()" mode="aspectFill"></image>
	  </view>
	  <view class="right-view">
		<view class="m-top-view">
		  <text class="m-title-label">{{ itemmodel.product_name }}</text>
		  <text class="m-des-label">{{ itemmodel.product_tips }}</text>
		</view>
		<view class="m-bottom-view">
		  <view class="" style="display: flex;flex-direction: row;align-items: center;">
			  <image class="m-video-view" src="https://qnsp.zcskjy.com/zc_images/images/my/videoImg.png"  mode="aspectFill"></image>
			  <text class="m-price-title">{{ itemmodel.course_schedule+'节课时' ||itemmodel.chapterNum+'章节'   }}</text>
		  </view>	
		  
		  <text class="m-share-title">{{ '联系老师' }}</text>
		</view>
	  </view>
	</view>
	
</template>

<script>
	export default {
		name:"acourseitem",
		props: {
			itemmodel: {
				type: Object,
				default () {
					return {
						product_image: '',
						product_name: '',
						product_tips:'',
						course_file_type: 0, //课时类型
						course_schedule: '', //课时
						chapterNum: '3', //章节数字
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
				this.$emit('itemClick');
			},
						
			imagePathStr(){
				
                if(this.itemmodel.product_image == 'null' 
				|| this.itemmodel.product_image == 'undefined' 
				||this.itemmodel.product_image == null
				||this.itemmodel.product_image == ''
				||this.itemmodel.product_image == ' '){
					
					return 'https://qnsp.zcskjy.com/zc_images/images/my/courseImg.png';
				}else{
					return this.itemmodel.product_image; 
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
	  // border-bottom: #E9E9E9 1rpx solid;
	  // background-color: #0077AA;
	  
	  .left-view{
		
		  margin-right: 30rpx;
		  height: 100%;
		  width: 140rpx;
		  // background-color: #F12F5B;
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  justify-content: center;
		  
		  .image-view{
			  width: 100%;
			  height:100%;
			  border-radius: 6rpx;
			  // background-color: #F0AD4E;
		  }
	  }
	  
	  .right-view{
		  height: 100%;
		  // background-color:rgba(255, 140, 151, 1);
		  flex: 1;
		  display: flex;
		  flex-direction: column;
		  align-items: flex-start;
		  justify-content: space-between;
		  
		.m-top-view{
			
			height: 90rpx;
			// background-color: #0077AA;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;
			
			.m-title-label{
				 height: 50rpx;
				 line-height:50rpx ;
				 color: #333333;
				 font-size: 36rpx;
				 font-weight: 500;
				 font-family: PingFangSC-Medium, PingFang SC;
			}
			.m-des-label{
				
				height: 33rpx;
				line-height:33rpx ;
				color: #666666;
				font-size: 24rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
			}
		}
		.m-bottom-view{
			
			height: 50rpx;
			width: 100%;
			// background-color: #F0AD4E;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			
			
			.m-video-view{
				width: 23rpx;
				height: 23rpx;
				padding-right: 10rpx;
			}
			
			.m-price-title{
				height: 33rpx;
				line-height:33rpx;
				color: #666666;
				font-size: 24rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
			}
			
			.m-share-title{
				width: 180rpx;
				height: 50rpx;
				border-radius: 25rpx;
				line-height:50rpx ;
				color: #FFFFFF;
				font-size: 24rpx;
				font-weight: 400;
				text-align: center;
				font-family: PingFangSC-Regular, PingFang SC;
				background:-wbkit-linear-gradient(to right,#FF6161,#FF9661);
				background:linear-gradient(to right,#FF6161,#FF9661);
				
			}
		}
		
		
	  }
	}
	
</style>


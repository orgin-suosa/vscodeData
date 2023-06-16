<template name="asecheader-view">
	
	<view class="m-section-header" style="position:absolute;left: 25rpx;top: 25rpx;" >
		<view class="m-section-title" style="margin-right: 250rpx;">{{title}}</view>
		<navigator :url='urlStr' hover-class="none">
			 <view class="m-section-more" @click="moreBtnClick"> {{__('更多')}}</view>
		</navigator>
	</view>
	
</template>

<script>

    import $ from "../../helpers/util";

	export default {
		name: "asecheader-view",
		props: {		
			
			title: '',
			urlStr:'',
			// moreBtn: '',
		},
		data() {
			return {
			}
		},
		created: function() {
			
		},
		methods: {
			
			moreBtnClick(){
				this.$emit('moreBtnClick');
			}
		}
	}
</script>


<style lang="scss" scoped>
	
	.m-section-header{
		  height: 90rpx;
		  width: auto;
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  justify-content: space-between;
		  margin: 10rpx 30rpx 0rpx;
		  // background-color: #007AFF;
		 
		.m-section-title{
			line-height:50rpx;
			font-size: 36rpx;
			font-weight:bold;
			color:#333333;
			text-align:left;
			width: 200rpx;
		}
		
		.m-section-more{
			height: 60rpx;
			width: 200rpx;
			line-height:60rpx;
			font-size: 24rpx;
			text-align: right;
			color:#999999;
		}
			 
	}
	
	

	
</style>

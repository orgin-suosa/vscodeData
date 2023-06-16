<template name="aheader-view">
	<view class="m-custom-nav" style="padding:0rpx;">
	   <u-icon 
	   v-if="showShare"
	   class="shareButton"
	   :name="shareIcon" 
	   color="#ffffff" 
	   @tap="rightClick" 
	   size="20"></u-icon>
		<image class="m-image-img" mode="widthFix" :src="(bgImg)"/>
		<view class="m-backbtn"  @click="backView()">
			<image mode="aspectFill" style="width: 44rpx;height: 44rpx;"
			:src="backWhite ?'https://qnsp.zcskjy.com/zc_images%2Fimages%2Fbackwhite.png':'https://qnsp.zcskjy.com/zc_images/images/backback.png'" />
		</view>
		<view class="m-headerview" >
			<view  v-if="showImg">
				<image mode="aspectFill" style="width: 211rpx;height: 44rpx;"
				src="https://qnsp.zcskjy.com/zc_images/images/kuaibg.png" />
			</view>
			<text class="m-header-title" v-else>{{title}}</text>
			<text class="m-detail-title" >{{detailtitle}}</text>
		</view>
	</view>
</template>

<script>

    import $ from "../../helpers/util";

	export default {
		name: "headerview",
		props: {
   //          itemmodel: {
			// 	type: Object,
			// },
		    backWhite:false,
			bgImg: '',
			title: '',
			detailtitle: '',
			showImg:false,
			showShare: {
			    type: Boolean,
			    default() {
			      return false;
			    },
			},
		},
		data() {
			return {
				shareIcon: '',
			}
		},
		created: function() {
			//  #ifdef  APP-PLUS
			this.shareIcon = 'share-square';
			//  #endif
		},
		methods: {
			rightClick() {
				this.$emit('rightClick');
			},
			backView(){
				this.$emit('back');
			}
		}
	}
</script>


<style lang="scss" scoped>
	$openAppHeight: 100rpx;
	.m-custom-nav{
		
		.m-image-img{
			width: 100%;
			background-color: #FFFFFF;
			height: calc(260rpx + var(--status-bar-height));
		}
		
		.m-backbtn{
			position: absolute;
			top: calc(15rpx + var(--status-bar-height));
			left: 30rpx;
			width: 100rpx;
			height: 70rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			// background-color: aqua;
		}
		::v-deep .shareButton{
			background: transparent !important;
			position: absolute;
			right: 30rpx;
			top: calc(30rpx + var(--status-bar-height));
			z-index: 9;
			.u-navbar--fixed{
				width: 100rpx;
				height: 90rpx;
				top: calc(15rpx + var(--status-bar-height));
				left: inherit;
				right: 0rpx;
				overflow: hidden;
				background: transparent !important;
			}
			.u-navbar__content__title,.u-navbar__content__left{
				width: 0 !important;
				display: none;
			}
			.u-navbar__content__right{
				background: transparent !important;
			}
			.u-navbar__content{
				background: transparent !important;
			}
		}
		.m-headerview{
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;
		    height:120rpx; 
		    padding:0rpx 20rpx;
		    margin:20rpx 10rpx;
			position: absolute;
			top: calc(80rpx + var(--status-bar-height));
			left: 50rpx;
			
			.m-header-title{
				margin-top:20rpx;
				height: 50rpx;
				line-height:50rpx;
				font-weight:bold;
				margin-bottom: 20rpx;
				text-align:left;
				font-size:50rpx;
				color:#3D3F4D;
			}
			.m-detail-title{
				line-height:50rpx;
				text-align:left;
				font-size: 30rpx;
				color:#3D3F4F;
			}	 
		}
	}
	

	
</style>

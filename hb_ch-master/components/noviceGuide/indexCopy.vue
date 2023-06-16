<template>
	  <!-- #ifdef APP-PLUS-->
	  <view class="animationContent animationContent_app" v-if="noviceGuide" >
	  	<!-- #endif -->
	  	<!-- #ifndef APP-PLUS-->
	  	<view class="animationContent animationContent_h5" v-if="noviceGuide" >
	<!-- #endif -->
	  <view class="mask"></view>
	  <view class="to-index">
		  <view class="to-index_animation" v-if="noviceGuideIndex == 0 ">
			  <view class="indexAnimation">
			  	<view class="indexAnimation-top">
					  <view class="trademark" style="width: 750rpx; height: 750rpx">
						<hx-lottie ref="animationData" :options="animationData" />
					  </view>
					  <img class="seasTrademarks" :src="seasTrademark" alt="" srcset="">
					  <view class="trademark-shadow">
						<view class="trademark-shadow-content"></view>
					  </view>
				  </view>
			  </view>
			  <view class="indexAnimation_button">
				  <image class="startGuide" @tap="noviceGuideNext(1)" :src="noviceGuide01" mode="widthFix"></image>
				  <view class="button_skip" @tap="buttonSkip">跳过</view>
			  </view>

		  </view>

		<!--  精彩活动 -->
		  <view class="index_wf"  v-if="noviceGuideIndex == 1">
			  <itemGuide  @noviceGuideNext="noviceGuideNext" @buttonSkip="buttonSkip" :itemGuide='indexWF'/>
			  <image class="itemGuideImage" :src="newYorker02" mode="widthFix"></image>
		  </view>
		<!--  长乘资质-->
		  <view class="index_certificate"  v-if="noviceGuideIndex  == 2 ">
			  <itemGuide :itemGuide='indexCertificate' @noviceGuideNext="noviceGuideNext" @buttonSkip="buttonSkip"/>
			  <image class="itemGuideImage" :src="certification02" mode="widthFix"></image>
		  </view>
		  <!--  发现 -->
		    <view class="findPage"   v-if="noviceGuideIndex  == 3 ">
		  	  <itemGuide :itemGuide='findGuide' @noviceGuideNext="noviceGuideNext" @buttonSkip="buttonSkip"/>
			  <image class="itemGuideImage" :src="iconFind" mode="widthFix"></image>
		    </view>
			<!--  学习 -->
			  <view class="studyPage"   v-if="noviceGuideIndex  == 4">
				  <itemGuide :itemGuide='study' @noviceGuideNext="noviceGuideNext" @buttonSkip="buttonSkip"/>
				   <image class="itemGuideImage" :src="iconLearn" mode="widthFix"></image>
			  </view>
			  <!--  工具 -->
			    <view class="toolsPage" v-if="noviceGuideIndex  == 5">
			  	  <itemGuide :itemGuide='tools' @noviceGuideNext="noviceGuideNext" @buttonSkip="buttonSkip"/>
				   <image class="itemGuideImage" :src="iconTool" mode="widthFix"></image>
			    </view>
	  </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import itemGuide from './itemGuide'
export default {
  components: {
	  itemGuide
  },
  props: {

  },
  watch:{
	currentRoute: {
		handler(newName, oldName) {
			this.currentRoute = newName;
			this.$forceUpdate();
		},
		deep: true,
		immediate: true,
	},
	noviceGuide: {
		handler(newName, oldName) {
			this.showGuide = newName;
			this.$forceUpdate();
		},
		deep: true,
		immediate: true,
	},
	
  },
  computed: {
	  ...mapState(['noviceGuide', 'noviceGuideIndex']),
	  ...mapMutations(['updateNoviceGuide','updateNoviceGuideIndex']),
  	animationData() {
  	  return {
  	    path: 'https://qnsp.zcskjy.com/zc_images/json/takeALong/data.json',
  	  };
  	},
  },
  data() {
    return {
		showindex:0,
		showGuide:true,
		imageUrl:`${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/`,
		seasTrademark: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/Seas-trademark.png`,
		noviceGuide01: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/noviceGuide01.png`,
		newYorker02: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/newYorker02.png`,
		certification02: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/certification02.png`,
		
		iconFind: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/icon-find.png`,
		iconLearn: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/icon-learn.png`,
		iconTool: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/icon-tool.png`,
		indexWF:{
			index:1,
			nextIndex:2,
			image: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/newYorker01.png`,
			title:'新客享好礼',
			describe:'新客见面礼 分享赚佣金',
			
		},
		indexCertificate:{
			index:2,
			nextIndex:3,
			image: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/certification01.png`,
			title:'陪伴式投教学习基地',
			describe:'公司介绍 团队介绍',
			
		},
		findGuide:{
			index:3,
			nextIndex:4,
			image: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/find01.png`,
			title:'聚合市场财经资讯',
			describe:'经直播、热点短视频、市场资讯',
		},
		study:{
			index:4,
			nextIndex:5,
			image: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/study.png`,
			title:'全品类的专业课程',
			describe:'涵盖股票、基金、保险、房产、财商等',
		},
		tools:{
			index:5,
			nextIndex:6,
			image: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/tools.png`,
			title:'智能化的决策工具',
			describe:'盘中宝、避雷宝、事件宝等AI工具',
		},
		currentRoute:null,
		navBarHeight:50
		// SeasTrademark: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/Seas-trademark.png`,
		// SeasTrademark: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/Seas-trademark.png`,
		// SeasTrademark: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/Seas-trademark.png`,
		// SeasTrademark: `${getApp().globalData.qnUrl}/zc_images/home/noviceGuide/Seas-trademark.png`,
	};
  },
  onLoad() {
	  this.currentRoute = this.$FT.currentRoute();
	  this.showGuide = uni.getStorageSync('guideCache_state');
	  console.log("guideCache_state-noviceGuide-onLoad:",uni.getStorageSync('guideCache_state'));
  },
  onUnload() {},
  methods: {
	  noviceGuideNext(index){
		 console.info("noviceGuideNext-下一步",index)
		  const _this = this;
		  this.showindex = index;
		  this.$store.commit('updateNoviceGuideIndex',index);
			if(index == 3){
				uni.switchTab({
					url: '/pages/findPage/index'
				});
			}else if(index == 4){
				uni.switchTab({
					url: '/pages/course/study'
				});
			}else if(index == 5){
				uni.switchTab({
					url: '/pages/tools/index'
				});
			}
			else if(index == 6){
				this.buttonSkip();
				return;
			}
			else{
				this.$emit('noviceGuideNext', index);
			}
	  },
	  buttonSkip(){
		  const _this = this;
		  this.showGuide = false;
		  this.$store.commit('updateNoviceGuideIndex',0);
		  this.$store.commit('updateNoviceGuide',false);
		  uni.getStorage({
		   key: 'guideCache_state',
		   success(res) {
		    let list = res.data;
			console.log("buttonSkip----guideCache_state-list",list)
		    let t = true;
			uni.setStorage({
			  key: 'guideCache_state',
			  data:  _this.noviceGuide
			});
		  },
		  fail() {
			uni.setStorage({
			  key: 'guideCache_state',
			  data:   _this.noviceGuide,
			});
		  },
		});
		  console.log("guideCache_state-buttonSkip-5555555555:",uni.getStorageSync('guideCache_state'));
	  }
  },
};
</script>

<style lang="scss">

	.animationContent{
		display: none;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 9999999;
		width: 750rpx;
		height: 100%;
		overflow: hidden;
		.indexAnimation{
			width: 100%;
			animation: arriveTo 2s linear infinite;
			animation-delay:0.25s;
			animation-iteration-count:1;
			position: absolute;
			z-index: 9999999;
			top:35%;
			left:53%;
			visibility: visible;
			transform: translateX(-50%) translateY(-42%);
			&-top{
				position: relative;
			}
		}
		.indexAnimation_button{
			position: absolute;
			z-index: 9999999;
			top:64%;
			left:53%;
			transform: translateX(-50%);
			margin-top: 50rpx;
			opacity: 1;
			animation: opacityTo 4s linear infinite;
			animation-delay:0.25s;
			animation-iteration-count:1;
		}
		.trademark{

			 // animation: arriveTo 2s linear infinite;
			 // animation-delay:0.5s;
			 // animation-iteration-count:1;
		}
		.seasTrademarks{
			width: 93rpx;
			height: auto;
			position: absolute;
			right: 129rpx;
			top:-4.3%;
		}
		.trademark-shadow{
			position: relative;
			top:-80rpx;
			// animation: shadow 10s linear infinite;
			&-content{
				width: 178rpx;
				height: 28rpx;
				margin: 0 auto;
				transform: scale(1);
				background: rgba(81, 76, 76, 1);
				border-radius: 61%;
				animation: arriveToShadow 2s linear infinite;
				animation-delay:0.5s;
				animation-iteration-count:1;
			}
		}
		.mask{
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			position: absolute;
			top:0;
			left: 0;
		}
		.startGuide{
			width: 491rpx;
			height: auto;
			margin: 0 auto;
			display: flex;
			margin-top: 20rpx;
			margin-bottom: 86rpx;
		}
	}
	.button_skip{
		font-size: 34rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		text-align: center;
	}
	.itemGuideImage{
			width: 340rpx;
			height: auto;
			margin-top: 35rpx;
			margin-left: 20rpx;
			transform: scale(1.05);
	}
	.index_wf{
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		// top:7.6%;
		// top: calc(5.7% + var(--window-top));
		top: calc(5.62%  + var(--status-bar-height) + var(--window-top) );
		.itemGuideImage{
			margin-top: 40rpx;
			margin-left: 8rpx;
		}
	}
	.index_certificate{
		position: absolute;
		bottom: var(--window-bottom);
		// bottom:calc(var(--window-bottom) +0rpx);
		left: 51%;
		transform: translateX(-50%);
		margin-bottom: 20rpx;
		.itemGuideImage{
			margin-left: 8rpx;
		}
	}
	.findPage,.studyPage,.toolsPage{
		position: absolute;
		left: 50%;
		bottom: calc(35rpx + var(--window-bottom));
		transform: translateX(-50%);
		.itemGuideImage{
			width: 150rpx;
			height: 98rpx;
			position: fixed;
			// bottom: 0;
			z-index: 9999999999999;
			display: none;
		}
		// margin-bottom: 35rpx;
	}
	.findPage{
		 /deep/ .itemGuide-iconReact{
			left: 200rpx;
		}
		.itemGuideImage{
			left: 110rpx;
		}
	}
	.studyPage{
		 /deep/ .itemGuide-iconReact{
			left: 342rpx;
		}
		.itemGuideImage{
			position: absolute;
			left: 265rpx;
		}
	}
	.toolsPage{
		 /deep/ .itemGuide-iconReact{
			left: 495rpx;
		}
		.itemGuideImage{
			position: absolute;
			left: 422rpx;
		}
	}
	.animationContent_h5{
		.findPage,.studyPage,.toolsPage{
			.itemGuideImage{
				display: block;
			}
		}
	}
	.animationContent_app{
		.index_wf{
			top: calc( 50px + var(--window-top) );
		}
	}
	@keyframes shadow{
		0% {
			transform: scale(1);
			background: rgba(81, 76, 76, 1);
		}
		100%{
			transform: scale(1.85);
			background: rgba(81, 76, 76, 0.9);
		}
		
	}
	@keyframes arriveTo{
		0% {
			visibility: hidden;
			top:0;
		}
		100%{
			visibility: visible;
			top:35%;
		}
		
	}
	
	@keyframes opacityTo{
		0% {
			opacity: 0;
			visibility: hidden;
		}
		90% {
			opacity: 0;
			visibility: hidden;
		}
		100%{
			opacity: 1;
			visibility: visible;
		}
		
	}
	@keyframes arriveToShadow{
		0% {
		  transform: scale(2.2);
		  background: rgba(81, 76, 76, 0);
		}
		25% {
		  transform: scale(1.5);
		  background: rgba(81, 76, 76, 0.25);
		}
		50%{
		  transform: scale(1.25);
		  background: rgba(81, 76, 76, 0.5);
		}
		75%{
		  transform: scale(1.15);
		  background: rgba(81, 76, 76, 0.75);
		}
		100%{
			transform: scale(1);
			 background: rgba(81, 76, 76, 1);
		}
	}	
	
	@media screen and (max-width: 400px) and (max-height: 710px) {
	  .animationContent_h5 {
		  .indexAnimation-top{
			// position: relative;
			// top: 40rpx;
		  }
		  .seasTrademarks{
			 top:-5.8%; 
		  }
		  .startGuide{
			 margin-bottom: 30rpx;
		  }
	    .index_wf {
	    	top: calc(7.5%  + var(--status-bar-height) + var(--window-top));
	    }
	  }
	}
	@media screen and (max-width: 413px) and (max-width: 371px) {
	  .animationContent_h5 {
	    .index_wf {
	    	top: calc(8%  + var(--status-bar-height) + var(--window-top));
	    }
	  }
	}
	@media screen and (max-height: 735px) and (min-height: 651px) {
	  .animationContent_h5 {
	    .index_wf {
	    	top: calc(8%  + var(--status-bar-height) + var(--window-top));
	    }
	  }
	}
	@media screen and (width: 428px) {
	  .animationContent_h5 {
	    .index_wf {
	    	top: calc(7%  + var(--status-bar-height) + var(--window-top));
	    }
	  }
	}
	@media screen and (width: 384px) and (height: 837px) {
	  .animationContent_app {
	    .index_wf {
	    	top: calc(1.84%  + var(--status-bar-height) + var(--window-top));
	    }
	  }
	 }
	
</style>
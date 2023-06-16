<template>
<view class="load-cont">
  <view class="line"></view>
  <view class="line"></view>
  <view class="line"></view>
  <view class="line"></view>
  <view class="line"></view>
  <view class="line"></view>
  <view class="loadText">
  <text>{{loadText}}</text>
  <text class="dot">...</text>
  </view>
</view>
</template>

<script>
export default {
  components: {},
  props: {
	loadText: {
      type: String,
      default: '请稍等'
	}
  },
  data() {
    return {};
  },
  onLoad() {},
  onUnload() {},
  methods: {},
};
</script>

<style lang="scss">
	$rotateDeg:0deg,30deg,60deg,90deg,120deg,150deg;
	$direction:0s,0.1s,0.2s,0.3s,0.4s,0.5s;
	.load-cont {
		width: 318rpx;
		height: 287rpx;
		border-radius: 20rpx;
		position: relative;
		margin: 0 auto;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	  }
	  .line {
		position: absolute;
		left: 50%;
		top: 20%;
		width: 4rpx;
		height: 100rpx;
		@for $i from 1 through 6 {
			 &:nth-child(#{$i}) {
				 &:before {
						animation: loading 1.2s linear 0s infinite;
						animation-delay: 0.1 * $i - 0.1 +s;	
				}
				&::after {
					animation: loading 1.2s linear 0.6s infinite;
					animation-delay: 0.1 * $i + 0.5 +s;	
				}
			}
		}
		
	  }
	  @each $c in $rotateDeg{
		   $i:index($rotateDeg,$c);        // 获取 $c 在数组中的索引，并赋值给 $i 赋值用冒号，不是等号~！
		   .line:nth-child( #{$i} ){      // 经典的地方来了，SCSS 循环是从 1 开始，不是 0 哦~
			  transform: rotate($c);    // hover 后的颜色
		   }
		}
	  .loadText{
		 position: absolute;
		 bottom: 20%; 
		 font-size: 28rpx;
		 font-family: PingFangSC-Regular, PingFang SC;
		 font-weight: 400;
		 color: #FFFFFF;
	  }
	  .line::before{
		position: absolute;
		top: 0;
		display:block;
		content: '';
		width: 7rpx;
		height: 28rpx;
		background-color: #FFFFFF;
		border-radius: 5rpx 5rpx 0 0;
	  }
	  
	  .line::after {
		position: absolute;
		bottom: 0;
		display:block;
		content: '';
		width: 5rpx;
		height: 25rpx;
		background-color: white;
		border-radius: 0 0 5rpx 5rpx;
	  }
	  @keyframes loading {
		from {
		  opacity: 0;
		}
		to {
		  opacity: 1;
		}
	  }
	  .dot {
	  	display: inline-block;
	  	height: 1em;
	  	line-height: 1;
	  	text-align: left;
	  	vertical-align: -.25em;
	  	overflow: hidden;
	  }
	  
	  .dot::before {
	  	display: block;
	  	content: '...\A..\A.';
	  	white-space: pre-wrap;
	  	animation: dot 3s infinite step-start both;
	  }
	  
	  @keyframes dot {
	  	33% {
	  		transform: translateY(-2em);
	  	}
	  }
</style>
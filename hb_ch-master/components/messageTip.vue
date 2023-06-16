<template>
<view class="messageCenter">
	<view  v-if="newMsgNum != 0 ">
		<view class="messageCenter-tip" v-if="newMsgNum  < 99 ">
			<view class="messageCenter-tip-text">
			{{newMsgNum}}
			</view>
		</view>
		<view class="messageCenter-tip messageCenter-moreTip" v-if="newMsgNum  >= 99">
			<view class="messageCenter-tip-text">99</view>
		
		</view>
	</view>
	
	<image 
		:src="newsImg" mode="widthFix" @click="message()"
		class="message-icon newMessage"></image>
</view>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
export default {
	props:{
		newsImg: {
		  type: String,
		  default() {
		    return 'https://qnsp.zcskjy.com/zc_images/images/my/newsImg.png';
		  },
		},
	},
  components: {},
  // props: {
  //   newMsgNum: {
  //     type: Number,
  //     default() {
  //       return false;
  //     },
  //   },
  // },

  computed: {
  	  ...mapState([ 'newMsgNum']),
  },
  data() {
    return {
		isNewMessaaage:true
	};
  },
  onLoad() {},
  onUnload() {},
  methods: {
	  message() {
	  	console.log('消息中心');
	  	uni.navigateTo({
	  		url: '/member/member/message',
	  	});
	  },
  },
};
</script>

<style lang="scss">
	.messageCenter {
		position: relative;
		height: 42upx;
		.messageCenter-tip{
			position: absolute;
			top: -12rpx;
			right: -23rpx;
			width: 23rpx;
			height: 23rpx;
			line-height: 23rpx;
			text-align: center;
			background: #EF3737;
			font-size: 16rpx;
			color: #ffffff;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			&-text{
				font-size: 16rpx;
				line-height: 16rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				transform: scale(0.7);
				transform-origin:center;
			}
		}
		.messageCenter-moreTip{
			.messageCenter-tip-text{
				transform-origin:top;
			}
		}
	}
	.message-icon{
		width: 42upx;
		height: 42upx;
	
	}
</style>
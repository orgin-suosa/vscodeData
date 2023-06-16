<template name="aexplan-view">
	<view class="content-view">
	  <view class="clause-title">免责声明</view>
	  <view class="clause-text">本页面转载上述内容传递更多信息之目的，不代表长乘学堂观点。长乘学堂力求但不保证数据的完全准确，如有错漏请以证监会指定上市公司信息披露平台为准，各类信息服务基于人工智能算法，投资者据此操作，风险自担。</view>
	</view>
</template>

<script>

	export default {
		name: "aexplan-view",
		props: {
            
		},
		data() {
			return {
			}
		},
		created: function() {
		},
		methods: {
			
			
		}
	}
</script>


<style lang="scss" scoped>

	// &-clause 
	.content-view{
		  padding: 50rpx 30rpx 40rpx;
		  font-size: 24rpx;
		  height: 300rpx;
		  font-family: PingFangSC-Regular, PingFang SC;
		  font-weight: 400;
		  color: #999999;
		  background-color: #F8F8F8;
		.clause-title {
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			// padding-top: 48rpx;
			color: #222222;
		  }
		.clause-text{
			padding-top:20rpx;
			width: 690rpx;
		}
	}
</style>

<template>
	<view class="container">
		<image class="bg_main" mode="widthFix" src="https://qnsp.zcskjy.com/zc_images/zc_images/images/mid_autumn.png?t=12322">
		</image>
		<view class="rule" @click="ruleClick"></view>
		<view class="course1" @click="courseClick(55)"></view>
		<view class="course2" @click="courseClick(65)"></view>
		<view class="course3" @click="courseClick(66)"></view>
		<view class="course4" @click="courseClick(67)"></view>
		<view class="tools" @click="toolsClick()"></view>

		<!-- 弹窗 -->
		<u-popup :show="showDialog" mode="center" :closeOnClickOverlay="true" :round="10" @close="close" @open="open">
			<view class="popup">
				<view class="pop_title">活动规则</view>
				<view class="pop_content">本课程为线上内容服务，基于在线内容的特殊性及产品的整体性，购买使用全部或者部分内容后不支持退款、转让，希望您知悉并理解。</view>
			    <view class="pop_line"></view>
				<view class="pop_close" @click="close">知道了</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showDialog: false,
			}
		},
		methods: {
			ruleClick() {
				this.showDialog = true
			},
			courseClick(val) {
				uni.navigateTo({
				  url: '/edu/course/class-detail?product_id=' + val + '&item_id=' + val,
				});
			},
			open() {
				// console.log('open');
			},
			close() {
				this.showDialog = false
				// console.log('close');
			},
			toolsClick(){
				uni.switchTab({
					url:'/pages/tools/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		width: 100%;
		height: auto;
		position: relative;
		flex-direction: column;
		align-items: center;
	}

	.bg_main {
		width: 100%;
		height: auto;
	}

	.rule {
		position: absolute;
		width: 200rpx;
		height: 120rpx;
		right: 0;
		top: 50rpx;
	}

	.course1 {
		position: absolute;
		width: 640rpx;
		top: 720rpx;
		height: 280rpx;
		// background-color: antiquewhite;
		// opacity: 0.5;
	}

	.course2 {
		position: absolute;
		width: 640rpx;
		top: 1010rpx;
		height: 280rpx;
	}

	.course3 {
		position: absolute;
		width: 640rpx;
		top: 1300rpx;
		height: 280rpx;
	}

	.course4 {
		position: absolute;
		width: 640rpx;
		top: 1590rpx;
		height: 280rpx;
	}

	.popup {
		width: 560rpx;
		height: auto;
		border-radius: 30rpx;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;

		.pop_title {
			margin-top: 50rpx;
			height: 44rpx;
			font-size: 34rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			line-height: 44rpx;
		}
		
		.pop_content{
			margin:18rpx 43rpx ;
			font-size: 26rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(51,51,51,0.56);
			line-height: 39rpx;
		}
		
		.pop_line{
			width: 560rpx;
			height: 1rpx;
			border-bottom: 1rpx solid #CCCCCC;
			margin-top: 22rpx;
		}
		
		.pop_close{
			width: 500rpx;
			height: 95rpx;
			font-size: 32rpx;
			font-weight: 500;
			text-align:center;
			color: #F43D3E;
			line-height: 95rpx;
		}
	}
	.tools{
		position: absolute;
		width: 680rpx;
		top: 1950rpx;
		height: 640rpx;
	}
</style>

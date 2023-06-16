<template>
	<view class="content-view">
		<view class="image-view" >
			<image class="m-image-img"  src="https://qnsp.zcskjy.com/zc_images/images/order-wait.png" />
		</view>
		<view class="order-state">{{"您的订单已生成，请及时支付！"}}</view>
		<view class="order-des">
		    <text> {{'您可以通过以下方式进行银行卡转账付款，付款后截图保留付款凭证，点击'}}</text>
			<text style="color:#FC4B21">{{"“我已完成付款”"}}</text>
			<text >{{"，工作人员核对信息无误后将为您开通权限！"}}</text>
		</view>
		<view class="content-center">
			<view class="center-title">{{"银联转账"}}</view>
			<view class="item-view">
				<view class="item-title">{{"公司名称："}}</view>
				<view class="item-content">{{"中财数科智能科技（上海）有限公司"}}</view>
			</view>
			<view class="item-view">
				<view class="item-title">{{"开户银行："}}</view>
				<view class="item-content">{{"招商银行上海分行四平支行"}}</view>
			</view>
			<view class="item-copy">
				<view class="item-view">
					<view class="item-title">{{"银行账号："}}</view>
					<view class="item-content">{{bankNum}}</view>
				</view>
				<view class="copyBtn-view" @click="copyBtnClick">{{"一键复制"}}</view>
			</view>
		</view>
		<view class="content-bottom">
			<view class="bottom-btn" @click="complateBtnClick">{{"我已完成付款"}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bankNum: "1219 4522 2110 301"
			}
		},
		methods: {
            
			//完成
			complateBtnClick(){
				
				uni.navigateTo({
					url:"/edu/order/complateorder",
				})
			},
			
			//拷贝按钮
			copyBtnClick() {
				uni.setClipboardData({
					data: this.bankNum, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							icon: 'none',
							title: '卡号复制成功'
						})
					}
				});
			}
		}
	}
</script>


<style lang="scss" scoped>
	
	.content-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		// padding: 30rpx;
        
		.content-bottom{
			position: fixed;
			left: 0;
			bottom: 0;
			// width: 100%;
			padding: 35rpx 30rpx;
			width: 710rpx;
			height: 90rpx;
			line-height: 90rpx;
			
			.bottom-btn{
				border-radius: 45rpx;
				font-size: 32rpx;
				font-weight: 500;
				text-align: center;
				color: #ffffff;
				font-family: PingFangSC-Medium, PingFang SC;
				background: -wbkit-linear-gradient(to right, #FF6161, #FF9661);
				background: linear-gradient(to right, #FF6161, #FF9661);
			}
		}
		
		.content-center {

			margin: 62rpx 30rpx 0;
			width: 630rpx;
			height: 250rpx;
			background-color: #F5F5F5;
			border-radius: 8rpx;
			padding: 24rpx 30rpx;

			.copyBtn-view {
				font-size: 24rpx;
				font-weight: 400;
				text-align: center;
				line-height: 50rpx;
				color: #ffffff;
				width: 144rpx;
				height: 50rpx;
				border-radius: 25rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				background: -wbkit-linear-gradient(to right, #FF6161, #FF9661);
				background: linear-gradient(to right, #FF6161, #FF9661);
			}

			.center-title {
				padding-bottom: 6rpx;
				text-align: left;
				height: 50rpx;
				line-height: 50rpx;
				color: #333333;
				font-size: 36rpx;
				font-weight: 500;
				font-family: PingFangSC-Medium, PingFang SC;
			}

			.item-copy {

				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
			}


			.item-view {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;
				padding-top: 15rpx;
				padding-bottom: 15rpx;
				height: 37rpx;
				line-height: 37rpx;
				text-align: left;
				font-size: 26rpx;

				.item-title {
					color: #333333;
					font-weight: 500;
					font-family: PingFangSC-Medium, PingFang SC;
				}

				.item-content {
					color: #666666;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}
			}
		}


		.image-view {
			padding-top: 93rpx;
			display: block;
            width: 200rpx;
			height: 188rpx;
			.m-image-img {
				width: 200rpx;
				height: 188rpx;
			}
		}


		.order-state {
			text-align: center;
			margin-top: 37rpx;
			height: 50rpx;
			line-height: 50rpx;
			color: #333333;
			font-size: 36rpx;
			font-weight: 500;
			font-family: PingFangSC-Medium, PingFang SC;
		}

		.order-des {
			padding: 54rpx 30rpx 0;
			text-align: left;
			height: 110rpx;
			line-height: 35rpx;
			color: #333333;
			font-size: 26rpx;
			font-weight: 500;
			font-family: PingFangSC-Medium, PingFang SC;
		}

	}
</style>

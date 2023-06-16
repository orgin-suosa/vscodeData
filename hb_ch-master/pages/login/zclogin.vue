<template>
	<view class="container">
		<scroll-view scroll-y="true">
			<view class="main">
				<view class="nav_top">
					<image class="back" src="${getApp().globalData.qnUrl}/zc_images/images/login/back.png"></image>
					<text class="question">常见问题</text>
				</view>
				<text class="tip_text">账号密码登录</text>
				<input class="account" v-model="account" type="number" placeholder="请输入账号"></input>
				<view class="pwd_main">
					<input v-model="pwd" placeholder="请输入密码" :password="!showPassword" />
					<text class="uni-icon pwd" :class="[!showPassword ? 'uni-eye-active' : '']"
						@click="changePassword">&#xe568;</text>
				</view>

				<view class="btn_login">
					<text class="tip">登录</text>
				</view>

				<text class="code_login">手机号验证码登录</text>



				<view class="bottom_tip tip">
					<checkbox style="transform:scale(0.7)" :checked="isChecked"></checkbox>
					<text>点击获取，即代表阅读并同意</text>
					<text style="color:#FC4B21">隐私政策</text>
					<text>和</text>
					<text style="color:#FC4B21">用户协议</text>
				</view>

			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: '',
				pwd: '',
				showPassword: false,
				isChecked: false
			}
		},
		onLoad(options) {

		},
		methods: {
			changePassword() {
				this.showPassword = !this.showPassword;
			},

		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		width: 100%;
		flex-direction: column;
		align-items: center;

		.main {
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #fff;
		}

		.nav_top {
			display: flex;
			width: 100%;
			flex-direction: row;
			margin-top: 95upx;
			justify-content: space-between;
			align-items: center;

			.back {
				width: 30upx;
				height: 30upx;
				margin: 30upx;
			}

			.question {
				font-size: 30upx;
				font-family: PingFangSC-Regular, PingFang SC;
				color: #333333;
				margin-right: 30upx;
				line-height: 42upx;
			}
		}

		.tip_text {
			width: 85%;
			font-size: 50upx;
			line-height: 50upx;
			font-family: PingFangSC-Medium, PingFang SC;
			color: #333333;
			margin-top: 73upx;
		}

		@mixin input_bg {
			width: 85%;
			height: 90upx;
			background: #F9F9F9;
			border-radius: 45upx;
			padding-left: 45upx;

		}

		.account {
			@include input_bg margin-top: 113upx;
		}

		.pwd_main {
			@include input_bg display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			margin-top: 40upx;

			.pwd {
				padding-right: 45upx;
			}
		}

		.btn_login {
			width: 85%;
			height: 90upx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #CCCCCC;
			border-radius: 45px;
			margin-top: 183upx;

			.tip {
				font-size: 32upx;
				font-family: PingFangSC-Regular, PingFang SC;
			}
		}

		.code_login {
			width: 78%;
			height: 40upx;
			font-size: 28upx;
			font-family: PingFangSC-Regular, PingFang SC;
			color: #FC4B21;
			margin-top: 36upx;
			margin-bottom: 500upx;
			line-height: 40upx;
		}

		.bottom_tip {
			display: flex;
			flex-direction: row;
			position: absolute;
			width: 100%;
			height: 50upx;
			bottom: 40upx;
			align-items: center;
			justify-content: center;
		}

		.tip {
			font-size: 24upx;

		}
	}
</style>

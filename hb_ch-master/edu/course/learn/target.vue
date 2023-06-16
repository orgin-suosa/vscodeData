<template>
	<view class="page">
		<!-- #ifdef APP-PLUS -->
		<view style="margin-top: 30rpx;"></view>
		<!-- #endif -->
		<view style="width: 100%;height: 20rpx;background-color: #F7F7F7;"></view>
		<view class="m-cells m-cells-form">
			<view class="m-cell" style="height:45px; height: 80rpx; border-bottom:1rpx solid #EEEEEE;">
				<picker style="width: 100%" mode="time" @change="bindTimeChange">
					<view v-if="!form.remind_time" style="font-size: 32rpx;color: #CCCCCC;padding: 0 14px;">请选择设置提醒时间</view>
					<view v-else style="font-size: 32rpx;line-height: 40rpx; font-weight: 500;color: #333333;padding: 0 14px;">{{ form.remind_time }}</view>
				</picker>
				<!-- <text class="iconfont icon-jiantouxia"></text> -->
				<u-icon name="arrow-down"></u-icon>
			</view>
			<view class="m-cell" style="height:45px;height: 80rpx; font-size:22px;border-bottom:1rpx solid #EEEEEE;">
				<view class="m-cell-bd"><input class="u-input" type="digit" style="margin-left:22px;" placeholder="请设定学习时间(分钟)" v-model="form.target_learn_time" /></view>
			</view>
			<view class="m-cell" style="height:45px;height: 80rpx;border-bottom: #EEEEEE;">
				<view>
					<label class="mrtx" for="">每日提醒</label>
					<br />
					<span class="tip">以推送消息的形式提醒</span>
				</view>

				<view class="m-cell-bd"><switch @change="switchChange" color="#FA6029" :checked="form.remind_enable" style="float: right;" /></view>
			</view>
		</view>
		<view style="margin-top: 25%">
			<button
				class="u-btn u-btn-default"
				@click="showOrderDialog = true"
				style="margin-left: 9%; margin-right: 9%; font-size: 30rpx; width: 82%; height: 90rpx; line-height:90rpx;border-radius:45rpx;display:flex;justify-content:center;align-items:center;background: linear-gradient(90deg, #FF6161 0%, #FF9661 100%);"
			>
				{{ __('保存') }}
			</button>
		</view>

		<view class="cancel-order-dialog" v-show="showOrderDialog">
			<view class="box">
				<view style="padding: 50rpx 80rpx">
					<view style="color: #191919;font-weight: 600;font-size: 17px;">保存设置</view>
					<view style="color: #979797">确定保存您设定的学习提醒目标</view>
				</view>
				<view class="box-btn-group">
					<a class="box-btn-cancel" @click="showOrderDialog = false">{{ __('我再想想') }}</a>
					<a class="box-btn-await" @click="setLearnTarget">{{ __('确定保存') }}</a>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	data: function() {
		return {
			showOrderDialog: false,
			form: {
				remind_enable: true,
				target_learn_time: undefined,
				remind_time: ''
			},
			options: {},
			targe_time: '',
			learn_time: '',
			time: '',
			value: ''
		};
	},
	computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
	components: {},
	onLoad: function(options) {
		uni.setNavigationBarTitle({
			title: this.__('设定每日目标')
		});
		let that = this;
		that.setData({
			options: options
		});
		// 获取用户设置的目标
		this.getLearnTarget();
	},
	methods: {
		...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
		setLearnTarget: function(e) {
			let that = this;
			let params = Object.assign({}, this.form);

			let remindTime = params.remind_time;
			if (!remindTime) {
				this.showOrderDialog = false;
				that.$.confirm('请选择设置提醒时间');
				return;
			}

			let target_learn_time = params.target_learn_time;
			if (!target_learn_time) {
				this.showOrderDialog = false;
				that.$.confirm('请设定学习时间');
				return;
			}

			params.remind_enable = params.remind_enable ? 1 : 0;

			that.$.request({
				url: that.Config.URL.edu.setLearnTarget,
				method: 'POST',
				data: params,
				loading:false,
				success: function(data, status, msg) {
					that.showOrderDialog = false;
					if (status === 200) {
						uni.navigateBack({
							delta: 1 //返回层数，2则上上页
						});
					}
					that.$.alert(msg);
				}
			});
		},

		getLearnTarget() {
			let that = this;
			that.$.request({
				url: that.Config.URL.edu.getLearnTarget,
				loading:false,
				success: function(data, status, msg) {
					if (status === 200 && data) {
						that.form = {
							remind_enable: !!data.remind_enable,
							remind_time: data.remind_time,
							target_learn_time: data.target_learn_time,
							user_id: data.user_id
						};
					}
				}
			});
		},

		bindTimeChange(e) {
			this.form.remind_time = e.detail.value;
		},
		switchChange(e) {
			console.log(e);
		}
	}
};
</script>

<style lang="scss">

page {
	font-family: PingFangSC-Regular, PingFang SC;
	height: 100%;
	background-color: #ffffff;
}

.mrtx {
	margin-left: 30rpx;
	font-size: 32rpx;
	margin-top: -32px;
	font-weight: 500;
	width: 50%;
}

.tip {
	font-size: 12px;
	margin-left: 30rpx;
	width: 800rpx;
	color: #9f9f9f;
}

uni-page-body {
	background-color: #fff !important;
}

.uni-page-head {
	background-color: #fff !important;
}

.m-cell-bd label {
	color: #888;
}

.m-cell-vcode {
	padding-top: 0;
	padding-right: 0;
	padding-bottom: 0;
}

.m-vcode-img {
	width: 216upx;
	height: 88upx;
}

.btn_box {
	padding: 20upx;
}

.m-code {
	right: 210upx;
}

.m-vcode-btn {
	width: 150upx;
	text-align: center;
}

.test {
	text-align: center;
	padding: 10px 0;
}

button {
	margin: 20upx;
	font-size: 28upx;
}

/deep/ .u-input .input-placeholder {
	font-size: 32rpx;
	color: #cccccc;
}

.m-cell-bd .u-input {
	font-size: 32rpx;
	margin-left: 15px !important;
}

.cancel-order-dialog {
	position: fixed;
	display: flex;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	text-align: center;
	z-index: 2002;
	background: rgba(0, 0, 0, 0.5);
	justify-content: center;
	align-items: center;
}

.cancel-order-dialog .box {
	margin: 0 auto;
	background-color: #ffffff;
	border-radius: 20rpx;
}

.box-btn-group {
	justify-content: space-between;
	display: flex;
	flex-direction: row;
	border-top: 1.75rpx solid #f5f5f5;
}

.box-btn-group a {
	display: inline-block;
	padding: 20rpx 20rpx;
	font-size: 16px;
	font-weight: 500;
}

.box-btn-cancel {
	width: 50%;
	border-right: 1.75rpx solid #f5f5f5;
	color: #000000;
}

.box-btn-await {
	width: 50%;
	color: #f43d3e;
}


/deep/ uni-switch .uni-switch-input {
    -webkit-appearance: none;
    appearance: none;
    position: relative;
    width: 52px;
    height: 25px;
    margin-right: 5rpx;
    border: 1rpx solid #dfdfdf;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #dfdfdf;
    -webkit-transition: background-color .1s,border .1s;
    transition: background-color .1s,border .1s;
}

/deep/ uni-switch .uni-switch-input:after, uni-switch .uni-switch-input:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    height: 23px;
    border-radius: 15px;
    transition: -webkit-transform .3s;
    -webkit-transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s,-webkit-transform .3s;
}

/deep/ uni-switch .uni-switch-input.uni-switch-input-checked:after {
    -webkit-transform: translateX(27px);
    transform: translateX(27px);
}
/deep/ uni-switch .uni-switch-input:after, uni-switch .uni-switch-input:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    height: 23px;
    border-radius: 15px;
    transition: -webkit-transform .3s;
    -webkit-transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s,-webkit-transform .3s;
}

/deep/ uni-switch .uni-switch-input:after {
    width: 23px;
    background-color: #fff;
}
/deep/ uni-switch .uni-switch-input:before {
		background-color: #fdfdfd;
}
</style>

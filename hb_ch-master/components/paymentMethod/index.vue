<template>
  <view>
	  <u-popup
	  	:safeAreaInsetBottom="true"
	  	:safeAreaInsetTop="true"
	  	:mode="popupData.mode"
	  	:show="isPay"
	  	:round="popupData.round"
	  	:overlay="popupData.overlay"
	  	:borderRadius="popupData.borderRadius"
	  	:closeable="popupData.closeable"
	  	:closeOnClickOverlay="popupData.closeOnClickOverlay"
	  	@close="openPopup"
	  	@open="openPopup"
	  >
	  	<view
	  		class="u-popup-slot"
	  		:style="{
	  			width: ['bottom', 'top'].includes(popupData.mode) ? '750rpx' : '200px',
	  			marginTop: ['left', 'right'].includes(popupData.mode) ? '480rpx' : '0',
	  		}"
	  	>
	  		<view class="pay-content">
				<view class="pay-title">请选择支付方式</view>
				<view class="pay-title pay-child" @click="payClick('alipay')">
					<image class="iconPay" :src="iconPaypal" mode="widthFix"></image>
					<view>支付宝</view>
				</view>
				<view class="pay-title pay-child" @click="payClick('wxpay')">
					<image class="iconPay" :src="iconWX" mode="widthFix"></image>
					<view>微信</view>
				</view>
			</view>
	  	</view>
	  </u-popup>
</view>
</template>

<script>
export default {
  components: {},
  props: {
    showPay: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  watch: {
  	showPay: {
  	  handler(newName, oldName) {
  	    this.showPay = newName;
		this.isPay = newName;
  	    this.$forceUpdate();
  	  },
  	  deep: true,
  	  immediate: true,
  	},
  },
  data() {
    return {
		iconPaypal: `${getApp().globalData.qnUrl}/zc_images/activity/icon-paypal.png`,
		iconWX: `${getApp().globalData.qnUrl}/zc_images/activity/icon-wx.png`,
		isPay:false,
		popupData: {
			overlay: true,
			mode: 'bottom',
			borderRadius: '',
			round: 10,
			closeable: true,
			closeOnClickOverlay: true
		},
	};
  },
  onLoad() {
	this.isPay = this.showPay;
  },
  onUnload() {},
  methods: {
	  openPopup(popupData) {
	  	// this.popupData = popupData
	  	uni.$u.sleep().then(() => {
	  		this.isPay = !this.isPay
	  	})
		this.$emit('openPopup', this.isPay);
	  },
	  payClick(data){
		this.$emit('payClick', data); 
	  },
	  navigateBack() {
	  	uni.navigateBack()
	  },
	  open() {
		  this.isPay = true;
	  	// console.log('open');
	  },
	  close() {
	  	this.isPay = false
	  	// console.log('close');
	  }
  },
};
</script>

<style lang="scss">
	.pay-content{
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
	}
	.pay-title{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 35rpx 0;

	}
	.pay-child{
		padding-left: 271rpx;
		justify-content: flex-start;
	}
	.iconPay{
		width: 44rpx;
		height: 44rpx;
		margin-right: 30rpx;
	}
</style>
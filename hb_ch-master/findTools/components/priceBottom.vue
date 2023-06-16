<template>
  <view class="safe-bottom"  :class="safeTip == ''? 'safe-bottom-one' : ''">
    <view class="safe-bottom-tip" v-if="safeTip !== ''">
		<text>{{ safeTip }}</text>
		<text  v-if="safeTipText !== ''">{{safeTipText}}</text><text v-if="safeTipUnit != ''">{{safeTipUnit}}</text>
	</view>
    <price @priceClick="priceClick" :orderStatus="totalOrderStatus" :discountPrice="totalDiscountPrice" :price="totalOriginalPrice" :buttonList="buttonList"></price>
    <view :style="{ height: statusBarHeight + 'rpx' }"></view>
  </view>
</template>

<script>
import price from '../components/price';
import { mapState, mapMutations } from 'vuex';
export default {
  components: { price },
  props: {
    statusBarHeight: {
      type: String,
      default() {
        return '';
      },
    },
    totalOrderStatus: {
      type: Boolean,
      default() {
        return false;
      },
    },
    safeTip: {
      type: String,
      default() {
        return '';
      },
    },
	safeTipUnit: {
      type: String,
      default() {
        return '';
      },
    },
	safeTipText: {
	  type:[Number,String],
	  default() {
	    return '';
	  },
	},
    totalDiscountPrice: {
      type: String,
      default() {
        return '';
      },
    },
    totalOriginalPrice: {
      type: String,
      default() {
        return '';
      },
    },
    productId: {
      type: String,
      default() {
        return '';
      },
    },
    buttonList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
  },
  data() {
    return {
	};
  },
  onLoad() {
  },
  onUnload() {},
  methods: {
    priceClick() {
      this.$emit('priceClick');
    },
  },
};
</script>

<style lang="scss">
$iconRibbon: 'https://qnsp.zcskjy.com/zc_images/findTools/icon-ribbon.png';
.safe-bottom {
  width: 750rpx;
  height: 160rpx;
  background: #ffffff;
  position: fixed;
  bottom: 0;
  z-index: 999;
  box-shadow: 6rpx 4rpx 60rpx rgba(0, 0, 0, 0.35);

  &-tip {
    width: 413rpx;
    height: 56rpx;
	line-height: 56rpx;
    background: url($iconRibbon) no-repeat center;
    background-size: 100% 100%;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 55, 57, 0.9);
    text-align: center;
  }

  ::v-deep .price-content {
        padding: 0 20rpx;
        box-sizing: border-box;

    .originalPrice {
      padding-left: 30rpx;
    }

    .button-list {
      &-child {
        width: 280rpx;
        height: 90rpx;
        line-height: 90rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        letter-spacing: 2rpx;
      }
    }
  }
}
.safe-bottom-one{
	.price-parent{
		height: 100%;
	}
	::v-deep .price-content{
		height: 100%;
		.button-list{
			height: 100%;
			display: flex;
			align-items: center;
		}
	}
	
}
</style>

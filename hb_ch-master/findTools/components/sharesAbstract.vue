<template>
  <view class="sharesAbstract" :class="showSharesAbstract ? 'popupSharesAbstract' : ''">
    <view class="sharesAbstract-child" >
      <view class="sharesAbstract-child-text" @tap="navigateClick">
        <view class="listFlex" :class="item.val < 0 ? 'sharesFall' : ''" v-for="(item, index) in sharesAbstractList" :key="index">
          <text class="sharesAbstract-key">{{ item.key }}</text>
          <view class="sharesAbstract-val-content">
            <text class="sharesAbstract-val" v-if="item.type == 'text'">({{ item.val }})</text>
            <text class="sharesAbstract-val" v-if="item.type == 'number' && item.val > 0">+{{ item.val }} %</text>
            <text class="sharesAbstract-val" v-if="item.type == 'number' && item.val <= 0">{{ item.val }} %</text>
          </view>
        </view>
      </view>
      <view class="sharesAbstract-arrow" mode="widthFix" @tap="navigateClick"></view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    sharesAbstractList: {
      type: Array,
      default() {
        return [];
      },
    },
    showSharesAbstract: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      iconArrow: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-arrow.png`,
      stockCode: '',
    };
  },
  onLoad(option) {
    // this.stockCode = option.stockCode;
    // console.log('stockCode:', option.stockCode);
  },
  onUnload() {},
  methods: {
    navigateClick(state) {
      this.$emit('navigateClick');
      console.log('navigateClick', state);
      // this.showSharesAbstract = true;
    },
  },
};
</script>

<style lang="scss">
$iconArrow: 'https://qnsp.zcskjy.com/zc_images/findTools/icon-arrow.png';
.sharesAbstract {
  width: 750rpx;
  height: 100rpx;
  background: #f1f3f8;
  position: fixed;
  top: calc(44px + var(--status-bar-height));
  z-index: 9999999;

  &-child {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 9999999;
    .listFlex {
      display: flex;
    }
    &-text {
      width: 90%;
      font-size: 26rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 9999999;
      .sharesAbstract-key {
        padding-right: 10rpx;
      }
      .sharesAbstract-val-content {
      }
      .listFlex:nth-child(1) {
        .sharesAbstract-val {
          color: #f43d3e;
        }
      }
      .listFlex:nth-child(3) {
        color: #f43d3e;
      }
      .sharesFall:nth-child(3) {
        .sharesAbstract-key {
          color: #24b842;
        }
        .sharesAbstract-val {
          color: #24b842;
        }
      }
    }
    .sharesAbstract-arrow {
      width: 24rpx;
      height: 13rpx;
      background: url($iconArrow);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
.popupSharesAbstract {
  .sharesAbstract-arrow {
    transform: rotate(180deg);
  }
  .sharesAbstract-child {
    &-text {
      .listFlex {
        visibility: hidden;
      }
      .listFlex:nth-child(1) {
        visibility: visible;
      }
    }
  }
}
</style>

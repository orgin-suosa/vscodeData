<template>
  <view class="selected-shares">
    <view class="selected-shares-title">
      <image class="iconFire" :src="iconFire" mode="widthFix"></image>
      <text class="">主编精选</text>
    </view>
    <view class="selected-shares-content">
      <view class="selected-shares-scroll-box">
        <view class="selected-shares-scroll">
          <view class="selected-shares-child" v-for="(item, index) in selectedShareList" :key="index">
            <view class="" @click="navigateDetails(item)">
              <view class="selected-shares-child-top">
                <!-- 	<image class="iconTime" :src="iconTime1" mode="widthFix"></image> -->
                <view class="iconTime"></view>
                <text>{{ item.createTime.substring(5, 16) }}</text>
              </view>
              <view class="selected-shares-child-middle">
                <view class="">{{ item.articleTitle }}</view>
              </view>
            </view>

            <view class="selected-shares-child-bottom">
              <view class="">{{ item.buyCount }}人已解锁</view>
              <view class="button-list">
                <view class="button-list-child" v-if="!totalOrderStatus && !item.isFree" @click="priceClick">立即解锁</view>
                <!-- 		  <view class="button-list-child">去查看</view> -->
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    selectedShareList: {
      type: Array,
      default() {
        return [];
      },
    },
    totalOrderStatus: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  watch: {
    selectedShareList: {
      handler(newName, oldName) {
        this.selectedShareList = newName;
        console.log('selectedShareList-组件 ', this.selectedShareList);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      iconTime1: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-time1.png`,
      iconTime2: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-time2.png`,
      iconTime3: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-time3.png`,
      iconFire: `${getApp().globalData.qnUrl}/zc_images/findTools/fire.png`,
    };
  },
  onLoad() {},
  onUnload() {},
  methods: {
    priceClick() {
      this.$emit('priceClick');
    },
    navigateDetails(item) {
      console.log('navigateDetails', item);
      this.$emit('navigateDetails', item.id);
      //   uni.navigateTo({
      //     url: '/findTools/panZhongbao/introduce',
      //   });
    },
  },
};
</script>

<style lang="scss">
.selected-shares {
  width: 750rpx;
  overflow: hidden;
  .selected-shares-title {
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    padding: 30rpx 0;
    .iconFire {
      width: 29rpx;
      height: 35rpx;
      margin-right: 10rpx;
      vertical-align: middle;
    }
  }
  .selected-shares-content {
    width: 750rpx;
    max-width: 750rpx;
    overflow: hidden;
  }
  .selected-shares-scroll-box {
    width: 100%;
    height: 310rpx;
    overflow-x: auto;
    position: relative;
  }
  .selected-shares-scroll {
    width: max-content;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    // @for $i from 1 through 3 {
    //   .selected-shares-child:nth-child(3n + #{$i} - 1) {
    //     width: 413rpx;
    //     height: 310rpx;
    //     background: url('https://qnsp.zcskjy.com/zc_images/findTools/selected-bg#{$i}.png') no-repeat center;
    //     background-size: 100% 100%;
    //   }
    // }
    .selected-shares-child:nth-child(3n + 1) {
      background: url('https://qnsp.zcskjy.com/zc_images/findTools/selected-bg1.png') no-repeat center;
      background-size: 100% 100%;
      .iconTime {
        background: url('https://qnsp.zcskjy.com/zc_images/findTools/icon-time1.png') no-repeat center;
        background-size: 100% 100%;
      }
    }

    .selected-shares-child:nth-child(3n + 2) {
      background: url('https://qnsp.zcskjy.com/zc_images/findTools/selected-bg2.png') no-repeat center;
      background-size: 100% 100%;
      color: #4b5d85;
      .iconTime {
        background: url('https://qnsp.zcskjy.com/zc_images/findTools/icon-time2.png') no-repeat center;
        background-size: 100% 100%;
      }
    }

    .selected-shares-child:nth-child(3n) {
      background: url('https://qnsp.zcskjy.com/zc_images/findTools/selected-bg3.png') no-repeat center;
      background-size: 100% 100%;
      color: #333333;
      .iconTime {
        background: url('https://qnsp.zcskjy.com/zc_images/findTools/icon-time3.png') no-repeat center;
        background-size: 100% 100%;
      }
    }
    .selected-shares-child {
      width: 413rpx;
      height: 310rpx;
      margin-right: 30rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #af5d35;
    }
    .selected-shares-child:last-child {
      margin-right: 60rpx;
    }
    .selected-shares-child {
      padding: 0 26rpx;
      display: flex;
      align-items: flex-start;
      justify-content: space-evenly;
      flex-direction: column;
      box-sizing: border-box;
      &-bottom {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      &-middle {
        width: 100%;
        max-width: 100%;
        max-height: 130rpx;
        line-height: 42rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        font-size: 28rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
      }
      &-top {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        // padding-bottom: 30rpx;
        .iconTime {
          width: 24rpx;
          height: 24rpx;
          margin-right: 10rpx;
          vertical-align: middle;
        }
      }
    }
    .button-list {
      &-child {
        width: 160rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
        border-radius: 45rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
      }
    }
  }
}
</style>

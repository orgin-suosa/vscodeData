<template>
  <view class="shares">
    <view class="shares-child" @click="navigateDetails(item)" v-for="(item, index) in firstShares" :key="index">
      <view class="shares-top">
        <view class="shares-name">{{ item.stockName }}</view>
        <view class="shares-rate">
          <view class="shares-rate-key">发现至今最高涨幅</view>
          <view class="shares-rate-val">{{ item.maxIncr }}</view>
        </view>
      </view>
      <view class="shares-bottom">{{ item.summary }}</view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    firstShares: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  onLoad() {},
  onUnload() {},
  methods: {
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
.shares {
  width: 690rpx;
  height: 280rpx;
  margin: 0 auto;
  margin-top: 25rpx;
  background: linear-gradient(90deg, #5b5f81 0%, #363755 100%);
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  &-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-name {
    margin-left: 20rpx;
    font-size: 40rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }

  &-rate {
    min-width: 377rpx;
    height: 70rpx;
	padding: 0 10rpx;
    background: url('https://qnsp.zcskjy.com/zc_images/findTools/shares-bg.png') no-repeat center;
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-right: 30rpx;
    font-size: 20rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;

    &-key {
      transform: scale(0.85) translateX(-0.5%);
	  padding-top: 4rpx;
      white-space: nowrap;
	  font-size: 20rpx;
	  font-family: PingFangSC-Regular, PingFang SC;
	  font-weight: 400;
	  color: #FFFFFF;
    }

    &-val {
      font-size: 40rpx;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #ff0001;
	      transform: translateX(-4.5%);
    }
  }

  &-bottom {
    padding-top: 28rpx;
    padding-left: 20rpx;
    padding-right: 30rpx;
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    margin-left: 20rpx;
	max-width: 100%;
	max-height: 168rpx;
	line-height: 45rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
  }
}
</style>

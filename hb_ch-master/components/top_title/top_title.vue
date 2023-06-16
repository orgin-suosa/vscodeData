<template>
  <view>
    <view class="top_title">
      <image class="back" src="https://qnsp.zcskjy.com/zc_images/home/back.png" @click="goBack()"></image>
      <text class="question">{{ title }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'top_title',
  props: ['title'],
  data() {
    return {};
  },
  onLoad() {},
  methods: {
    goBack() {
      // this.$emit('itemClick');
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss">
.top_title {
  display: flex;
  width: 100%;
  height: 88rpx;
  background-color: #ffffff;
  align-items: center;

  .question {
    flex: 1;
    height: 50rpx;
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 50rpx;
    text-align: center;
    align-self: center;
    margin-right: 90rpx;
  }
}

.back {
  width: 30rpx;
  height: 30rpx;
  margin: 30rpx;
}
</style>

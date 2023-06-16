<template>
  <view class="withdrawalSucceeded">
    <view class="withdrawalSucceeded-content">
      <image class="withdrawalSucceeded-icon" src="https://qnsp.zcskjy.com/zc_images/home/icon-success.png" mode=""></image>
      <view class="">已提交申请</view>
      <view class="withdrawalSucceeded-content-tip">等待人工审核通过后2天内到账</view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  onLoad() {},
  onUnload() {},
  methods: {},
};
</script>

<style lang="scss">
.withdrawalSucceeded {
  height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-items: center;
  background-color: #ffffff;
  &-content {
    font-size: 34upx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    text-align: center;
    margin: 0 auto;
    margin-top: 200upx;
    &-tip {
      font-size: 30upx;
      color: rgba(153, 153, 153, 1);
    }
  }

  &-icon {
    width: 128upx;
    height: 128upx;
  }
}
</style>

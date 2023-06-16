<template>
  <view class="list-live-content wrap-title">
    <view class="list-live-content">
      <view class="list-live-content-text" v-if="state === 1">
        <view class="button-list-state button-list-live">
          <image class="icon-live" src="${getApp().globalData.qnUrl}/zc_images/findPage/live1.png" mode="widthFix"></image>
          <view class="button-list-state-text">直播</view>
        </view>
        <text class="playback-area-text">{{ number }}</text>
      </view>
      <view class="list-live-content-text" v-if="state === 0">
        <view class="button-list-state look-button">
          <view class="button-list-state-text">预告</view>
        </view>
        <text class="playback-area-text">{{ number }}</text>
      </view>
      <view class="list-live-content-text" v-if="state === 2">
        <view class="button-list-state playback">
          <view class="button-list-state-text">回放</view>
        </view>
        <text class="playback-area-text">{{ number }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'index-swiper',
  props: {
    state: {
      type: Number,
      default: () => {
        return;
      },
    },
    number: {
      type: String,
      default: () => {
        return;
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    swiperChange(e) {
      let { current, source } = e.detail;
      //只有页面自动切换，手动切换时才轮播，其他不允许
      if (source === 'autoplay' || source === 'touch') {
        this.swiperConfigure.current = current;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// @import '@/styles/findPage/discoveryPage.scss';
.list-live-content {
  position: relative;
  text-align: left;
  display: flex;
  align-items: center;
  font-size: 22upx;
  font-family: DINAlternate-Bold, DINAlternate;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 6upx 0upx 6upx 0upx;
  z-index: 2;
  .list-live-content-text {
    position: absolute;
    left: 0;
    text-align: left;
    display: flex;
    align-items: center;
    font-size: 22upx;
    font-family: DINAlternate-Bold, DINAlternate;
    color: #ffffff;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 6upx 0upx 6upx 0upx;
    padding: 0px 0;
    margin-left: 0;
    overflow: hidden;
    .button-list-state-text {
      font-size: 20upx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      transform: scale(0.8) translateX(0%);
    }
  }
}
.button-list-state {
  width: 58upx;
  max-width: 58upx;
  height: 40upx;
  line-height: 40upx;
  padding: 0 0;
  // width: 71upx;
  // padding: 10upx 12upx 10upx 10upx;
  background: #ffc43d linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
  border-radius: 6upx 0 0 0;
  overflow: hidden;
  font-size: 20upx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  white-space: nowrap;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .icon-live {
    margin-left: 8upx;
  }
}
.button-list-live {
  width: 71upx;
  max-width: 71upx;
}
.button-list-state.look-button {
  background: linear-gradient(90deg, #efae33 1%, #fe9c26 100%);
}

.button-list-state.playback {
  background: linear-gradient(287deg, #739dff 0%, #4385ff 100%);
}

.button-list-state.playBackButton {
  background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%) linear-gradient(287deg, #739dff 0%, #4385ff 100%);
}
.playback-area-text {
  padding: 0 8upx;
  transform: scale(0.8) translateX(-11%);
  white-space: nowrap;
  max-width: 240upx;
  // overflow-x: auto;
}
.wrap-title {
  position: absolute;
  top: 20upx;
  left: 0;
}
.icon-live {
  width: 17upx;
  height: 22upx;
}
</style>

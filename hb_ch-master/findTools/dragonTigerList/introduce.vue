<template>
  <view class="content">
    <status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
    <scroll-view scroll-y="true" :style="{ height: scrollHeight + 'rpx' }">
      <image style="width: 100%; height: auto" class="intro" :src="introduce" mode="widthFix"></image>
    </scroll-view>
  </view>
</template>

<script>
export default {
  components: {},
  computed: {
    scrollHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      return winHeight;
    },
  },
  data() {
    return {
      introduce: `${getApp().globalData.qnUrl}/zc_images/findTools/introduce_lhb.jpeg`+ this.$FT.versionKey(),
      PageNav: {
        window: {
          navigationBarBackgroundColor: '#ffffff',
          navigationBarTextStyle: 'black',
          navigationBarTitleText: '',
          backgroundColor: '#f8f8f8',
          backgroundTextStyle: 'dark',
        },
      },
    };
  },
  onLoad() {},
  onUnload() {},
  methods: {},
};
</script>

<style lang="scss"></style>

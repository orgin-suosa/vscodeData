<template>
  <view class="container">
	<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
    <scroll-view scroll-y="true">
      <image class="intro" :src="imgUrl" mode="widthFix"></image>
    </scroll-view>
  </view>
</template>

<script>

export default {
  components: {
    // topTitle,
  },
  data() {
    return {
      imgUrl: `${getApp().globalData.qnUrl}/zc_images/home/cc_adv_1.jpg`,
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
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss">
.container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #fff6f6;
}

.intro {
  width: 100%;
  height: 100%;
}
</style>

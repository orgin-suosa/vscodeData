<template>
  <view class="content">
<!--    <view class="statusBarHeight" :style="{ height: statusBarHeight + 'px' }"></view>
    <status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar> -->
    <scroll-view class="articleDetail-scroll" :style="{ height: scrollHeight + 'rpx' }" scroll-y="true"> 
	  <!--  <image class="m-code-image" show-menu-by-longpress="true" :src="cordImgUrl"></image> -->
		<img class="m-code-image" :src="cordImgUrl" :show-menu-by-longpress="true" />

	</scroll-view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  components: {},
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum', 'Lang']),
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
      statusBarHeight: 0,
      navBarHeight: 0,
      cordImgUrl: ``,
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
  onLoad() {
    this.init();
  },
  onUnload() {},
  methods: {
    init() {
      this.qrCode();
    },
    qrCode(data) {
		// https://shop.zcskjy.com/h5/pages/index/index
      const that = this;
	        uni.request({
	          method: 'GET',
	          data: {},
	          url: 'https://shop.zcskjy.com/zc-config/v1/qrCode/query',
	          success: function (data, status) {
	            console.log('--data---1-', data);
	            if (data.statusCode == 200) {
	              let qrCodeUrl = data.data.result.qrCodeUrl;
	              if (qrCodeUrl) {
	                //页面是否加载完成
	                that.cordImgUrl = qrCodeUrl;
	                // that.setData({
	                //   cordImgUrl: qrCodeUrl,
	                // });
	              }
	            } else {
	              that.cordImgUrl = 'https://qnsp.zcskjy.com/img/hmgj_default.png';
	            }
	          },
	          fail: function (data) {
	            that.cordImgUrl = 'https://qnsp.zcskjy.com/img/hmgj_default.png';
	          },
	        });
    },
  },
};
</script>

<style lang="scss">
// @import '@/styles/findPage/scss.scss';
.content{
	width: 750rpx;
	/deep/ .uni-scroll-view-content{
		display: flex;
		align-items: flex-start;
		justify-content: center;
	}
	.m-code-image {
	  width: 640rpx;
	  height: 640rpx;
	  margin: 0 auto;
	}
}

</style>
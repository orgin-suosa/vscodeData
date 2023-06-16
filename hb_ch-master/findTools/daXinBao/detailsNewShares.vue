<template>
  <view class="content">
	<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
	<u-navbar
	  class="navbar-text"
	  :background="backgroundObj"
	  :is-fixed="true"
	   :title="newSharesTitle"
      @leftClick="navBack"
      :is-back="true"
	  :border-bottom="false"
	/>
	<view class="statusBarHeight" :style="{ height: statusBarHeight + 'px' }"></view>
    <scroll-view class="newShares-scroll" :style="{ height: scrollHeight + 'rpx' }" scroll-y="true">
		<view class="newShares-content">
			<view class="newShares-name">
				<view class="icon-name">创</view>
				<view>
					<text>艾布鲁（ 301529）</text>
				</view>
			</view>
			<view class="stockDetails-key-content">
				<view class="stockDetails-key-content-child">
					<view class="stockDetails-key-box">
						<view class="stockDetails-key">
							<view class="stocKey">股票名称</view>
							<view class="stocVal">艾布鲁</view>
						</view>
						<view class="stockDetails-key">
							<view class="stocKey">顶格申购</view>
							<view class="stocVal">2222</view>
						</view>
					</view>
					<view class="stockDetails-key-box">
						<view class="stockDetails-key">
							<view class="stocKey">股票名称</view>
							<view class="stocVal">艾布鲁</view>
						</view>
						<view class="stockDetails-key">
							<view class="stocKey">顶格申购</view>
							<view class="stocVal">2222</view>
						</view>
					</view>
				</view>
				<view class="stockDetails-key-content-child">
					<view class="stockDetails-key-box">
						<view class="stockDetails-key">
							<view class="stocKey">股票名称</view>
							<view class="stocVal">艾布鲁</view>
						</view>
						<view class="stockDetails-key">
							<view class="stocKey">顶格申购</view>
							<view class="stocVal">2222</view>
						</view>
					</view>
				</view>
			</view>
		</view>

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
	  newSharesTitle:'新股详情',
	  backgroundObj: {
	    backgroundImage: 'url(/static/zeroPurchase/titleBg.png)',
	    backgroundSize: '100% 100%',
	    opacity: 1,
	  },
      statusBarHeight: 0,
      navBarHeight: 0,
      activity: `${getApp().globalData.qnUrl}/zc_images/activity/618Activity.png`,
	  leftIconColor: '#ffffff',
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
      this.getSystemInf();
    },
	navBack(e) {
	  //  #ifdef  APP-PLUS
	  uni.navigateBack();
	  //  #endif
	
	  //  #ifdef  H5
	  history.back();
	  //  #endif
	},
    getSystemInf() {
      // 获取手机系统信息
      const info = uni.getSystemInfoSync();
      // 设置状态栏高度（H5顶部无状态栏小程序有状态栏需要撑起高度）
      this.statusBarHeight = info.statusBarHeight;
      // 除了h5 app mp-alipay的情况下执行
      // #ifndef H5 || APP-PLUS || MP-ALIPAY
      // 获取胶囊的位置
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
      // (胶囊底部高度 - 状态栏的高度) + (胶囊顶部高度 - 状态栏内的高度) = 导航栏的高度

      // #endif
    },
    uniRequest(data) {
      const that = this;
      uni.request({
        url: this.Config.URL.edu.getProductList,
        method: 'get',
        data: data,
        dataType: 'json',
        success: (res) => {
          const data = res.data.data;
          console.log('getList-res', res);
          if (res.statusCode == 200) {
            uni.stopPullDownRefresh();
            result.forEach(function (item, i, array) {
              // console.log('result-forEach', item, i, array);
            });
          }
        },
        fail: () => {},
        complete: () => {
          // this.contentScroll();
        },
      });
    },
  },
};
</script>

<style lang="scss">
// @import '@/styles/findPage/scss.scss';
.newShares-content{
	padding:  0 30rpx;
}
.newShares-scroll{
	padding-top: 44px;
}
.newShares-name{
	font-size: 34rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #222222;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	.icon-name{
		width: 34rpx;
		height: 34rpx;
		line-height: 34rpx;
		text-align: center;
		background: #4D62FF;
		border-radius: 4rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		margin-right: 10rpx;
	}
}
.stockDetails-key-content{
	width: 100%;
	&-child{
		padding-top: 30rpx;
		width: 100%;
		border-bottom: 1rpx solid #F2F2F3;
		// display: flex;
		// justify-content: space-between;
		.stockDetails-key-box{
			width: 100%;
			display: flex;
			justify-content: space-between;
		}
		.stockDetails-key-box:last-child{
			padding-bottom: 46rpx;
		}
	}
	&-child:first-child{
		padding-top: 5rpx;
	}
	&-child:last-child{
		border-bottom: 0;
	}
	.stockDetails-key{
		display: flex;
		width: 44%;
		justify-content: space-between;
		align-items: center;
	}
	.stocKey{
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 500;
		color: #999999;
	}
	.stocVal{
		font-size: 28rpx;
		font-family: DIN-Medium, DIN;
		font-weight: 500;
		display: flex;
		align-items: center;
	}	
}
</style>
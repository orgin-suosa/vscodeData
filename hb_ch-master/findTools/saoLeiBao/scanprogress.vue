<template>
  <view class="content-view">
    <view class="top-view">
      <image src="https://qnsp.zcskjy.com/zc_images/scantopimg.png?t=12313" mode="aspectFit" style="width: 260rpx; height: 70rpx"></image>
    </view>

    <view class="center-view" @click="btnClick">
      <text> {{ '正在扫描全市场' }}</text>
<!--      <text style="color: #fc4b21">{{ BLBTotalStockCount }}</text> -->
	  <u-count-to
	  	:startVal="0"
	  	:endVal="stockCount"
	  ></u-count-to>
      <text>{{ '只股票，请耐心等待...' }}</text>
    </view>
    <view style="width: 650rpx; height: 650rpx">
      <hx-lottie ref="lottieWeb" :options="options" />
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

var Interval;
export default {
  data() {
    return {
      totalStockCount: 1235,
      stopAdd: false,
      productId: '',
      itemId: '',
      timer: null,
      scanData: {
        totalStockCount: 1235,
        stopAdd: false,
      },
    };
  },
  props: {
    stockCount: {
      type: [Number, String],
      default: 1235,
    },
  },
  computed: {
    ...mapState(['Config', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'BLBstopAdd']),
    ...mapMutations(['updateBLBstopAdd']),
    options() {
      return {
        path: 'https://qnsp.zcskjy.com/zc_images/json/sweep.json',
      };
    },
  },
  onUnload: function () {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    clearInterval(Interval);
  },

  onLoad: function (option) {
    this.productId = option.productId;
    this.itemId = option.item_id;
    this.scanData = this.BLBstopAdd;
    this.totalStockCount = this.stockCount;
    let that = this;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (Interval) {
      clearInterval(Interval);
    }
  //   Interval = setInterval(function () {
  //     if (!that.BLBstopAdd) {
  //       let addCount = Math.floor(Math.random() * 100 + 1);
  //       that.totalStockCount += addCount;

  //       if (that.totalStockCount > 4500) {
  //         that.totalStockCount = 2025;
  //       }
		// // that.$store.commit("updateBLBTotalStockCount",that.totalStockCount);
  //     }
  //   }, 30);
    // this.marketScanner();
  },

  methods: {
    //点击跳转
    btnClick() {
      uni.navigateTo({
        url: '/findTools/saoLeiBao/scanresult',
      });
    },

    marketScanner() {
      const that = this;
      let params = {
        userId: that.userInfo.user_id,
      };
      uni.request({
        method: 'GET',
        data: params,
        url: that.Config.marketScanner,
        success: function (data, status) {
          console.info('---success----data---', data, status);

          if (data.statusCode == 200) {
            let result = data.data.result;
            if (that.timer) {
              clearTimeout(that.timer);
            }
            that.timer = setTimeout(function () {
              //获取结果之后
              clearInterval(Interval);
              that.setData({
                stopAdd: true,
                totalStockCount: result.totalStockCount,
              });
      	      that.$store.commit("updateBLBstopAdd",true);
              // uni.redirectTo({
              // 	url: '/findTools/saoLeiBao/index?productId='+ that.productId + "&item_id=" + that.itemId,
              // })
            }, 500);
          } else {
            let result = data.data.result;
            if (that.timer) {
              clearTimeout(that.timer);
            }
            that.timer = setTimeout(function () {
              //获取结果之后
              clearInterval(Interval);
              that.setData({
                stopAdd: true,
                totalStockCount: 4844,
              });
               that.$store.commit("updateBLBstopAdd",true);
              // uni.redirectTo({
              // 	url: '/findTools/saoLeiBao/index?productId='+ that.productId + "&item_id=" + that.itemId,
              // })
            }, 500);
          }
        },
        fail: (res) => {
          console.info('---fail---data---', res);
          if (that.timer) {
            clearTimeout(that.timer);
          }
          that.timer = setTimeout(function () {
            //获取结果之后
            clearInterval(Interval);
            that.setData({
              stopAdd: true,
              totalStockCount: 4844,
            });
            that.$emit('scanprogress', that.stopAdd);
            // uni.redirectTo({
            // 	url: '/findTools/saoLeiBao/index?productId='+ that.productId + "&item_id=" + that.itemId,
            // })
          }, 500);
        },

        complete: () => {
          console.info('----complete-----');
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content-view {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  // bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  background: -wbkit-linear-gradient(to bottom, #010e27, #001c53);
  background: linear-gradient(to bottom, #010e27, #001c53);

  .center-view {
    margin-top: 40rpx;
    margin-bottom: 50rpx;
    text-align: center;
    height: 34rpx;
    line-height: 34rpx;
    color: #5088fd;
    font-size: 28rpx;
    font-weight: 400;
    font-family: PingFangSC-Medium, PingFang SC;
  }

  .top-view {
    margin-top: 160rpx;
    height: 120rpx;
    color: #ffffff;
  }
  /deep/ .u-count-num{
  	font-size: 28rpx !important;;
  	font-family: PingFangSC-Medium, PingFang SC;
  	font-weight: 500;
  	color: #fc4b21 !important;
  }
}

</style>

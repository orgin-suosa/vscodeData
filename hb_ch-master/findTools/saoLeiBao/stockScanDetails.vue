<template>
  <!-- #ifndef H5-->
  <view class="content">
    <!-- #endif -->
    <!-- #ifdef H5-->
    <view class="content content_h5">
      <!-- #endif -->
      <!-- #ifdef H5-->
      <open-app v-if="stopAdd" />
      <!-- #endif -->
      <u-navbar class="navbar-text" v-if="stopAdd" :is-fixed="true" :title="newSharesTitle" leftIconColor="#303133" :is-back="false" :border-bottom="false" @rightClick="onShareBox" :rightIcon="shareIcon" @leftClick="navBack">
        <template slot="center">
          <view class="newSharesTitle" @click="gotoDetail">{{newSharesTitle}}</view>
        </template>
      </u-navbar>

      <view v-if="!stopAdd" class="scanLoading">
        <view class="top-view">
          <view class="top-title">{{ stockName }}</view>
          <view class="top-number">{{ stockCode }}</view>
        </view>
        <view style="width: 650rpx; height: 650rpx">
          <hx-lottie ref="lottieWeb" :options="options" />
        </view>
        <view class="bottom-view" @click="btnClick">
          <text> {{ '正在扫描第' }}</text>
          <text style="color: #fc4b21">{{ scanNum }}</text>
          <text>{{ '项，请耐心等待…' }}</text>
        </view>
      </view>
      <scanresult ref="scanresult" class="scanresult" :positionlist="positionlist" :score="score" :riskCount="riskCount" :safeCount="safeCount" :totalCount="totalCount" :stockCode="stockCode" :stockName="stockName" :market="market" :courseConfig="courseConfig" @changeStatus="changeStatus" v-if="stopAdd"></scanresult>
      <shareGApp :shareDataDefault="shareData" ref="shareGApp"></shareGApp>
      <!-- 	<image v-if="stopAdd" class="goEdu" :src="goEdu" @click="goEduFN" mode="widthFix"></image> -->
    </view>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex';
import scanresult from '../components/saoleiBao/scanresult';
import shareGApp from '@/components/share-g-app.vue';
import { initWeChatActivity, addListenWeChatForward, wxClose } from '@/helpers/initWXShare.js';
import { log } from '../../components/QS-tabs-wxs-list/js/config';
var Interval;
export default {
  components: {
    scanresult,
    shareGApp
  },
  data () {
    return {
      localData: [],
      stockItem: {},
      scanNum: '1',
      stockName: '',
      stockCode: '',
      market: '',
      stopAdd: false,
      positionlist: [],
      score: '',
      riskCount: '',
      safeCount: '',
      totalCount: '',
      newSharesTitle: '新股详情',
      courseConfig: {},
      shareIcon: 'share-square',
      shareData: {},
      shareBlb: `${getApp().globalData.qnUrl}/zc_images/images/share_blb.png` + this.$FT.versionKey(),
    };
  },

  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum',
      'Lang'
    ]),

    options () {
      return {
        path: 'https://qnsp.zcskjy.com/zc_images/json/sweep.json',
      };
    },
  },
  watch: {
    scanNum: {
      handler (newName, oldName) {
        this.scanNum = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  created () {
    this.getSystem();
    this.initShareData();
  },
  onShow: function () {
    this.getStockRiskTypeCount();
    this.stockScannerDetail();
    this.slbConfig();
  },
  onLoad: function (option) {
    if (option.item) {
      this.stockItem = JSON.parse(option.item)
    }
    console.log('fff', this.stockItem);
    //  #ifdef  APP-PLUS
    this.shareIcon = 'share-square';
    //  #endif
    this.stockCode = option.stockCode;
    this.stockName = option.stockName;
    this.market = option.market;
    this.newSharesTitle = this.stockName + '(' + this.stockCode + ') >';
    this.getSignature();
    //查询股票详情
    //    this.getStockRiskTypeCount();
    //    this.stockScannerDetail();
    // this.slbConfig();
    let that = this;
    Interval = setInterval(function () {
      if (!that.stopAdd) {
        that.scanNum += 1;
        if (that.scanNum > 80) {
          that.scanNum = 45;
        }
      }
    }, 25);
  },

  onUnload: function () {
    clearInterval(Interval);
  },

  methods: {
    changeStatus (status) {
      console.log('status=========', status);
      uni.getStorage({
        //key值为custom
        key: `stockDate`,
        success: (res) => {
          console.log('143------------', res.data);
          this.localData = res.data
          let index = res.data.findIndex((item) => {
            console.log(item, 'item==================');
            return Number(item.nameCode.val2) === Number(this.stockCode)
          })
          console.log('index===========', index);
          if (index == -1) {
            console.log('添加');
            this.localData.unshift(this.stockItem)
            uni.setStorage({
              key: 'stockDate',
              data: this.localData
            })
            uni.getStorage({
              //key值为custom
              key: `stockDate`,
              success: (res) => {
                console.log('22移除后的this.localData=======',res.data);
              }
            })
          } else {
            console.log('删除');
            // 此时是删除，匹配到了数据
            this.localData.splice(index, 1)
            console.log('222index===this.localData=========', this.localData);
            uni.setStorage({
              key: 'stockDate',
              data: this.localData
            })
            uni.getStorage({
              //key值为custom
              key: `stockDate`,
              success: (res) => {
                console.log('22移除后的this.localData=======',res.data);
              }
            })
          }
        },
      })


    },
    async checkAuthProcess (signature) {
      let that = this;
      console.info('长乘资质--初始化微信流程------------>signature---1.2', signature);
      const ua = navigator?.userAgent.toLowerCase();
      const isWeChat = ua?.indexOf('micromessenger') !== -1;
      console.info('长乘资质------是否处于微信环境------------->1.2', isWeChat);
      if (!isWeChat) return;

      // 初始化微信活动主流程
      await initWeChatActivity(signature);
      // 监听微信转发
      addListenWeChatForward(this.handleForwardData(), () => {
        // 转发回调，增加转发记录
        console.info('长乘资质-转发数据', this.handleForwardData());
      });
    },
    // 转发参数处理
    handleForwardData () {
      return {
        title: this.shareData.title,
        desc: this.shareData.shareText,
        imgUrl: this.shareData.image,
        link: this.shareData.href,
      };
    },
    async getSignature () {
      const that = this;
      let _href = encodeURIComponent(location.href.split('#')[0]);
      const params = {
        url: encodeURIComponent(_href), // url
        // url: 'https://shop-qa.zcskjy.com/h5/', // url
      };
      console.log('getSignature-params', params);
      console.log('getSignature-url', that.Config.URL.WXSignature);
      uni.request({
        url: that.Config.URL.WXSignature,
        method: 'get',
        data: params,
        dataType: 'json',
        success: (res) => {
          const data = res.data;
          console.log('getSignature-data', data);
          let result = res.data.result;
          // console.log('getSignature-complete-res', result);
        },
        fail: () => { },
        complete: (res) => {
          let result = res.data?.result;
          console.log('getSignature-complete-res', result);
          that.signature = {
            // appId: 'wx1935506901780516', // 小程序的唯一标识
            appId: 'wxd74f2b85b1b724a7', // 必填，公众号的唯一标识
            timestamp: result?.timestamp, // 必填，生成签名的时间戳
            nonceStr: result?.nonceStr, // 必填，生成签名的随机串
            signature: result?.signature, // 必填，签名，见附录1
          };
          console.log('getSignature-checkAuthProcess-参数', that.signature);
          that.checkAuthProcess(that.signature);
        },
      });
    },
    getSystem () {
      let that = this;
      let port = uni.getSystemInfoSync().platform;
      const ua = navigator?.userAgent.toLowerCase();
      const isWeChat = ua?.indexOf('micromessenger') !== -1;

      switch (port) {
        case 'android':
          that.android = true;
          console.log('运行Android上', port); //android
          break;
        case 'ios':
          if (isWeChat) {
            wxClose();
          };

          that.isios = true;
          console.log('运行iOS上', port); // ios
          break;
        default:
          console.log('运行在开发者工具上'); //devtools
          break;
      }
    },
    //点击跳转
    btnClick () {
      let that = this;
      console.info('----that.stockCode----', that.stockCode, that.stockName);
      console.info('----that.market', that.market);
      uni.redirectTo({
        url: '/findTools/saoLeiBao/scanresult?stockCode=' + that.stockCode + '&stockName=' + that
          .stockName,
      });
    },
    gotoDetail () {
      const that = this;
      let setcode;
      if (that.market == 0 || that.market == 4) {
        setcode = 1;
      } else if (that.market == 1 || that.market == 3) {
        setcode = 0;
      } else {
        setcode = that.market;
      }
      console.log("---------", that.stockCode, that.stockName, that.market, setcode);
      let baseUrl = that.Config.ApiUrl
      let urls = baseUrl + '/hq-H5/h5/index.html#/page_detail/page-detail/page-detail?code=' + that.stockCode +
        '&setcode=' + setcode + '&stockName=' + that.stockName;
      // #ifdef H5
      window.location.href = urls;
      // #endif

      //#ifdef APP-PLUS
      uni.navigateTo({
        url: `/my/webview/webview_live?url=${urls}`,
      });
      // #endif
    },
    navBack (e) {
      //  #ifdef  APP-PLUS
      uni.navigateBack();
      //  #endif

      //  #ifndef  APP-PLUS
      history.back();
      //  #endif
    },
    slbConfig () {
      const that = this;
      let params = {
        userId: that.userInfo.user_id,
      };
      uni.request({
        url: that.Config.URL.config.slbConfig,
        method: 'get',
        dataType: 'jsonp',
        data: params,
        success: (res) => {

          const data = JSON.parse(res.data);
          that.courseConfig = data.result;
          console.log('避雷宝-股票详情-课程配置', that.courseConfig)

        },
        fail: (res) => {
          // console.log('避雷宝-未购买用户询剩余次数-fail', res);
        },
        complete: () => { },
      });
    },
    stockScannerDetail () {
      const that = this;
      let params = {
        userId: that.userInfo.user_id,
        stockCode: that.stockCode,
      };
      uni.request({
        method: 'GET',
        data: params,
        url: that.Config.stockScannerDetail,
        success: function (data, status) {
          console.info('--stockScannerDetail---', data.data.result);
          if (data.statusCode == 200) {
            let result = data.data.result;
            that.setData({
              positionlist: result.first,
              score: result.score,
              riskCount: result.riskCount,
              safeCount: result.safeCount,
              totalCount: result.totalCount,
            });
            console.log("positionlist:", that.positionlist)
          } else {
            uni.showToast({
              icon: 'none',
              title: data.errMsg,
            });
          }
        },
        fail: (res) => {
          console.log('---fail', res);
        },
        complete: () => { },
      });
    },
    initShareData () {
      let that = this;
      let $href = that.$.sprintf('%s/h5/findTools/saoLeiBao/index?uid=%d', that.Config.SiteUrl, this.userInfo.user_id, '&showOpenApp=true');

      // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
      // #ifdef APP-PLUS
      $href = that.$.sprintf('%s/h5/findTools/saoLeiBao/index?uid=%d', that.Config.SiteUrl, this.userInfo.user_id, '&showOpenApp=true');
      // #endif
      // #ifdef MP-WEIXIN
      $href = '/h5/findTools/saoLeiBao/index?uid=' + this.userInfo.user_id + '&showOpenApp=true';
      // #endif

      // var path, title, image, shareText;

      // if (that.$.isNull(this.ProductInfo)) {
      // 	title = that.pageTitle || '';
      // 	shareText = that.pageBrief;
      // } else {
      // 	title = that.__('我发现这个商品很好，非常适合你哦！');
      // }
      // console.log('分享入参-避雷宝：', $href, title, image, shareText);
      this.setData({
        shareData: {
          type: 2,
          shareTitle: '避雷宝',
          shareText: '排雷避险，一【宝】扫除一键扫描全网股票，风险雷点早知道',
          href: $href,
          image: that.shareBlb,
        },
      });
      console.log('分享入参-避雷宝：', that.shareData);
    },
    onShareBox () {
      this.initShareData();
      // #ifndef MP-WEIXIN
      this.$refs.shareGApp.show();
      // #endif
    },
    //扫描结果
    getStockRiskTypeCount () {
      const that = this;
      let params = {
        userId: that.userInfo.user_id,
      };
      uni.request({
        method: 'GET',
        data: params,
        url: that.Config.getStockRiskTypeCount,
        success: function (data, status) {
          console.info('------success---1--', data);
          if (data.statusCode == 200) {
            setTimeout(function () {
              //获取结果之后
              clearInterval(Interval);
              that.setData({
                stopAdd: true,
                scanNum: data.data.result,
              });
              // uni.redirectTo({
              // 	   url: '/findTools/saoLeiBao/scanresult?stockCode='+ that.stockCode + '&stockName='+ that.stockName
              // })
            }, 500);
          } else {
            setTimeout(function () {
              //获取结果之后
              clearInterval(Interval);
              that.setData({
                stopAdd: true,
                scanNum: 79,
              });
              // uni.redirectTo({
              // 	   url: '/findTools/saoLeiBao/scanresult?stockCode='+ that.stockCode + '&stockName='+ that.stockName
              // })
            }, 500);
          }
        },
        fail: (res) => {
          console.info('---fail---1--', res);

          setTimeout(function () {
            //获取结果之后
            clearInterval(Interval);
            that.setData({
              stopAdd: true,
              scanNum: 79,
            });
            // uni.redirectTo({
            // 	   url: '/findTools/saoLeiBao/scanresult?stockCode='+ that.stockCode + '&stockName='+ that.stockName
            // })
          }, 500);
        },
        complete: () => {
          console.info('--complete--1---');
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$openAppHeight: 100rpx;
.scanLoading {
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

  .bottom-view {
    margin-top: 40rpx;
    text-align: center;
    height: 34rpx;
    line-height: 34rpx;
    color: #5088fd;
    font-size: 28rpx;
    font-weight: 500;
    font-family: PingFangSC-Medium, PingFang SC;
  }

  .top-view {
    margin-top: 160rpx;
    height: 120rpx;
    color: #ffffff;

    // background-color: #ffffff;
    // border-radius: 8rpx;
    // padding: 24rpx 30rpx;
    .top-title {
      font-size: 40rpx;
      font-weight: 500;
      text-align: center;
      line-height: 56rpx;
      height: 56rpx;
      font-family: PingFangSC-Medium, PingFang SC;
    }

    .top-number {
      font-size: 40rpx;
      font-weight: 500;
      text-align: center;
      line-height: 50rpx;
      height: 50rpx;
      font-family: PingFangSC-Medium, PingFang SC;
    }
  }
}

.navbar-text {
  position: relative;
  z-index: 999;

  /deep/ .u-status-bar {
    height: var(--status-bar-height) !important;
  }
}

.scanresult {
  padding-top: calc(44px + var(--status-bar-height));

  /deep/ .center-view {
    padding-bottom: 0;
  }
}

.newSharesTitle {
  text-align: center;
  font-size: 16px;
  color: #303133;
}

/deep/ .u-count-num {
  font-size: 28rpx !important;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #fc4b21 !important;
}

/deep/ .content-view {
  background-color: #ffffff;
}

.content {
  stext-align: center;
}

.goEdu {
  width: 714rpx;
  height: 144rpx;
  display: inline-block;
  margin: 0 auto;
}
.content_h5 {
  ::v-deep .u-navbar--fixed {
    top: 98rpx;
  }
  .scanresult {
    padding-top: calc(44px + #{$openAppHeight});
  }
}
</style>

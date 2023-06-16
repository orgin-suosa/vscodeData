<template>
  <view class="content">
    <status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
    <view v-if="!isWX" class="statusBarHeight"></view>
    <u-navbar v-if="!isWX" @leftClick="clickLeft" :is-fixed="true" title="钜惠7月" @rightClick="onShareBox" :rightIcon="shareIcon" :border-bottom="false" />
    <scroll-view class="articleDetail-scroll" :style="{ height: scrollHeight + 'rpx' }" scroll-y="true">
      <image class="activity" :src="activity" mode="widthFix"></image>
      <view class="receiveBenefits" id="receiveBenefits">
        <image class="receiveBenefits-title" v-if="$.getStorageSync('receivedCode') != 1001" :src="activityTitle"></image>
        <image class="receiveBenefits-title" v-if="$.getStorageSync('receivedCode') == 1001" :src="receivedTitle"></image>
        <view class="receiveBenefits-content">
          <view class="receivedSuccessfully">
            <view class="couponBg">
              <view class="couponBg-left">
                <view class="couponBg-left-content">
                  <view class="coupon-price">
                    <view class="coupon-unit">¥</view>
                    <view>{{ coupon.price }}</view>
                  </view>
                  <view class="coupon-tip">{{ coupon.tip }}</view>
                </view>
              </view>
              <view class="couponBg-right">
                <view class="couponBg-right-content">
                  <view class="couponBg-name">{{ coupon.name }}</view>
                  <view class="couponBg-useTime">{{ coupon.useTime }}</view>
                </view>
              </view>
            </view>
            <image v-if="$.getStorageSync('receivedCode') != 1001" @click="appletMarkingLogin" class="buttonUse buttonUse_app" :src="buttonReceive"></image>
            <image v-if="$.getStorageSync('receivedCode') == 1001" @click="loginJump" class="buttonUse buttonUse_app" :src="buttonUse"></image>
          </view>
        </view>
      </view>
      <view class="statusBarHeight"></view>
    </scroll-view>
    <share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import shareBoxApp from '@/components/share-box-app.vue';
import verifyLogin from '@/components/verifyLogin/index.vue';
// var jweixin = require('jweixin-module');
// var jweixin = require('jweixin-module');
// import jweixin from '../../helpers/jweixin';
// #ifndef APP-PLUS
var wx = require('jweixin-module');
// #endif
export default {
  components: { shareBoxApp, verifyLogin },
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
      showModal: false,
      isReceived: false,
      popupData: {
        overlay: true,
        mode: 'center',
        borderRadius: '',
        closeable: true,
        closeOnClickOverlay: true,
      },
      coupon: {
        name: '钜惠七月专享优惠券',
        price: '3800',
        tip: '',
        useTime: '有效期至：2022-07-31',
      },
      shareIcon: '',
      shareData: {
        shareTitle: '寻找好公司+盘中宝',
        shareText: '学会寻找好公司,长期获得超额收益',
        href: '',
        image: '',
      },
      activity: `${getApp().globalData.qnUrl}/zc_images/activity/618Activity.png`+ this.$FT.versionKey(),
      activityButton: `${getApp().globalData.qnUrl}/zc_images/activity/618Activity01.png`+ this.$FT.versionKey(),
      activityTitle: `${getApp().globalData.qnUrl}/zc_images/activity/618Activity02.png`+ this.$FT.versionKey(),
      modalSure: `${getApp().globalData.qnUrl}/zc_images/activity/modalSure.png`+ this.$FT.versionKey(),
      modalClose: `${getApp().globalData.qnUrl}/zc_images/activity/modalClose.png`+ this.$FT.versionKey(),
      addAdviser: `${getApp().globalData.qnUrl}/zc_images/activity/addAdviser.png`+ this.$FT.versionKey(),
      receivedTitle: `${getApp().globalData.qnUrl}/zc_images/activity/received-title.png`+ this.$FT.versionKey(),
      //   couponBg: `${getApp().globalData.qnUrl}/zc_images/activity/coupon-bg.png`,
      buttonUse: `${getApp().globalData.qnUrl}/zc_images/activity/buttonUse.png`+ this.$FT.versionKey(),
      buttonReceive: `${getApp().globalData.qnUrl}/zc_images/activity/buttonReceive.png`+ this.$FT.versionKey(),
      PageNav: {
        window: {
          navigationBarBackgroundColor: '#ffffff',
          navigationBarTextStyle: 'black',
          navigationBarTitleText: '',
          backgroundColor: '#f8f8f8',
          backgroundTextStyle: 'dark',
        },
      },
      weixin: null,
      AppletRawID: 'gh_77e0924a5066',
      timer: '', //接收定时器
      activityId: '1773',
      source_user_id: '',
      shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg`+ this.$FT.versionKey(),
      activityShare: `${getApp().globalData.qnUrl}/zc_images/activity/activityShare.png`+ this.$FT.versionKey(),
      isWXconfig: true,
      isWX: null,
      htmTitle: '',
      appletPath: 'pages/staffCard/staffCard.html',
      screenTimeStamp: '',
    };
  },
  watch: {
    appletPath: {
      handler(newName, oldName) {
        this.appletPath = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    isReceived: {
      handler(newName, oldName) {
        this.isReceived = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  onLoad() {
    this.init();
    console.info('优惠卷版本1.4.3');
  },
  onUnload() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  methods: {
    async init() {
      let that = this;
      //  #ifdef  APP-PLUS
      this.shareIcon = 'share-square';
      //  #endif
      await this.isHasVoucher();
      // #ifndef APP-PLUS
      console.log('非app,跳转H5页');
      uni.navigateTo({
        url: '/activity/618Activity/index_h5',
      });
      await this.WXSignature();

      // #endif
      this.isWeixin();
      this.nosupTip();
      // this.getTodayDate();
    },
    getTodayDate() {
      let nowDate = new Date();
      let date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
        hours: nowDate.getHours(),
        minutes: nowDate.getMinutes(),
        seconds: nowDate.getSeconds(),
      };

      if (parseInt(date.month) < 10) {
        date.month = '0' + date.month;
      }
      if (parseInt(date.date) < 10) {
        date.date = '0' + date.date;
      }
      this.screenTimeStamp = date.year + '' + date.month + '' + date.date + '' + date.hours + '' + date.minutes;
      this.activity = this.activity + '?r=' + this.screenTimeStamp;
      this.activityShare = this.activityShare + '?r=' + this.screenTimeStamp;
      this.shareLogo = this.shareLogo + '?r=' + this.screenTimeStamp;
      this.receivedTitle = this.receivedTitle + '?r=' + this.screenTimeStamp;
    },
    // 标签内图片和文字大小自适应，rpx转px
    // 如果375的设计稿，量出100px,即在uniapp中是200rpx，这里num就传200
    getRealSize(num) {
      return uni.upx2px(num);
    },
    modalConfirm() {
      this.showModal = false;
      this.isReceived = true;
      this.miniApp();
    },
    loginJump: function (code) {
      let n = this;
      console.log('618主页-loginJump', code);
      if (code == 1001) {
        n.isReceived = true;
      }
      if (n.timer) {
        clearTimeout(n.timer);
      }
      n.timer = setTimeout(() => {
        console.log('618主页-小程序跳转');
        let user_id = this.userInfo.user_id;
        // let path = 'pages/index/index?typeIndex=0&userId=' + user_id + '&mobile=' + this.userInfo.user_mobile;
        this.pushMiniApp(n.appletPath);
      }, 0);
    },
    miniApp() {
      console.log('this.userInfo', this.userInfo);
      let user_id = this.userInfo.user_id;
      // let path = 'pages/index/index?typeIndex=0&userId=' + user_id + '&mobile=' + this.userInfo.user_mobile;
      this.pushMiniApp(this.appletPath);
    },
    appletMarkingLogin() {
      //  #ifdef  APP-PLUS
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/login/login',
        });
        return;
      }
      //  #endif
      const that = this;
      let source_user_id, activityId;
      //  #ifdef  APP-PLUS
      source_user_id = this.userInfo.user_id;
      activityId = '1773';
      //  #endif
      // #ifndef APP-PLUS
      source_user_id = this.$FT.getUrlKey('source_user_id', location.href) || this.userInfo.user_id;
      activityId = this.$FT.getUrlKey('activityId') || '1773';
      // #endif
      const params = {
        // user_mobile: this.userInfo.user_mobile,
        // rand_key: this.userInfo.user_mobile,
        // verify_code: this.mobile_code,
        user_id: this.userInfo.user_id,
        activity_id: activityId, // 活动ID
        source_user_id: source_user_id, // 分享ID
      };
      console.info('userInfo-params', this.userInfo);
      console.info('appletMarkingLogin-params', params);
      uni.request({
        url: that.Config.URL.appletMarkingLogin,
        method: 'get',
        data: params,
        dataType: 'json',
        success: (res) => {
          const data = res.data;
          let code = data?.code || 0;
          console.info('AppletMarkingLogin-res', res);
          console.info('AppletMarkingLogin-user_id', data?.data?.userId);
          uni.showToast({
            icon: 'none',
            title: data?.msg,
          });

          if (data.status == 200) {
            let userId = data?.data?.userId || '';
            console.info('AppletMarkingLogin-user_id', userId);
            that.$.setStorageSync('618userId', userId);
          }
        },
        fail: () => {},
        complete: (res) => {
          const data = res.data;
          let code = data?.code || 0;
          console.info('AppletMarkingLogin-complete', data);
          that.$.setStorageSync('receivedCode', code);
          console.info('AppletMarkingLogin-complete-receivedCode', this.$.getStorageSync('receivedCode'));
          this.loginJump(code);
        },
      });
    },
    //跳转微信小程序
    pushMiniApp(path) {
      // let path = 'pages/index/index'
      console.log('---log---', path);
      // #ifdef APP-PLUS
      // 跳转微信小程序
      plus.share.getServices(
        (res) => {
          console.log('---res---', res);
          let sweixin = '';
          for (var i = 0; i < res.length; i++) {
            let t = res[i];
            if (t.id == 'weixin') {
              sweixin = t;
            }
          }
          // that.typeIndex = options.typeIndex;
          // that.user_id = options.user_id;
          if (sweixin) {
            sweixin.launchMiniProgram(
              {
                // id: 'gh_d43f693ca31f',  // 原始ID
                // id: 'gh_915c2ca533a7',  //汽车的原始ID
                // id: 'gh_306945fe14bd',
                id: 'gh_dc6594c4715f',

                // path: `pages/tslogin/tslogin?do=login&appName=暴漫APP`,
                // path: 'pages/views/home/home/home?', //  可带参数
                // path: 'pages/index/index?typeIndex=0&user_id='+ user_id, //  可带参数
                path: path,
                type: 0, // 微信小程序版本类型可取值： 0-正式版； 1-测试版； 2-体验版。 默认值为0。
              },
              // 目标小程序点击返回App后执行的回调，在此接收微信小程序传递的参数
              (res2) => {
                console.log('-----res2----', res2);
              },
              (err2) => {
                console.log(err2);
              },
            );
          } else {
            uni.showToast({
              icon: 'none',
              title: '当前环境不支持微信操作!',
            });
          }
        },
        (err) => {
          console.log('---err-----', err);
        },
      );
      // #endif

      // #ifdef MP-WEIXIN
      uni.navigateToMiniProgram({
        appId: 'wx1935506901780516', // 此为生活缴费appid
        // path:'pages/index/index?typeIndex=0&user_id='+user_id,
        path: pathUrl,
        envVersion: 'release',
        success: (res) => {
          // 打开成功
          console.log('打开成功', res);
        },
        fail: (err) => {
          console.log(err);
        },
      });
      // #endif
    },
    evokeApplet() {
      var n = this;
	  let wxOriginId = uni.getStorageSync('wxOriginId') ?? 'gh_77e0924a5066';
      n.sweixin
        ? n.sweixin.launchMiniProgram({
            id: wxOriginId,
            // id: 'wx1935506901780516',
          })
        : uni.showToast({
            icon: 'none',
            title: n.__('当前环境不支持微信操作'),
          });
    },
    isHasVoucher() {
      const userId = this.$.getStorageSync('618userId').toString() || '';
      //  #ifdef  APP-PLUS
      this.activityId = '1773';
      //  #endif
      // #ifndef APP-PLUS

      this.activityId = this.$FT.getUrlKey('activityId') || '1773';
      // #endif
      const that = this;
      const params = {
        userId: userId, // 活动ID
        activityId: this.activityId, // 分享ID
      };
      console.log('isHasVoucher-params', params);
      uni.request({
        url: that.Config.URL.isHasVoucher,
        method: 'get',
        data: params,
        dataType: 'json',
        success: (res) => {
          const data = res.data;
          console.log('isHasVoucher-data', data);
          let status = data?.data?.status || false;
          if (data.status == 200) {
            that.isReceived = status;
            console.log('isHasVoucher-res-isReceived', that.isReceived);
          }
        },
        fail: () => {},
        complete: () => {},
      });
    },
    WXSignature() {
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
        fail: () => {},
        complete: (res) => {
          let result = res.data?.result;
          console.log('getSignature-complete-res', result);
          let jweixin_data = {
            // appId: 'wx1935506901780516', // 小程序的唯一标识
            appId: 'wxd74f2b85b1b724a7', // 必填，公众号的唯一标识
            timestamp: result?.timestamp, // 必填，生成签名的时间戳
            nonceStr: result?.nonceStr, // 必填，生成签名的随机串
            signature: result?.signature, // 必填，签名，见附录1
          };
          console.log('getSignature-complete-res', result);
          that.getConfig(jweixin_data);
        },
      });
    },
    // 判断是否是微信浏览器
    isWeixin() {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        this.isWX = true;
        return true;
      } else {
        this.isWX = false;
        return false;
      }
    },
    nosupTip() {
      if (!this.isWeixin()) {
        // #ifndef APP-PLUS
        uni.showToast({
          icon: 'none',
          title: this.__('请复制链接至微信中打开'),
        });
        // #endif
      }
    },
    getConfig(data) {
      let that = this;
      console.log('getConfig:', data);
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['wx-open-launch-weapp'],
        openTagList: ['wx-open-launch-weapp'],
      });
      wx.ready((res) => {
        console.log('初始化js-sdk成功');
        // this.$nextTick(() => {
        //   // let btn = document.getElementById('launch-btn');
        //   // let btn = document.querySelector('.launch-btn');
        //   // btn.addEventListener('launch', (e) => {
        //   //   that.isWXconfig = true;
        //   //   console.log('success');
        //   // });
        //   // btn.addEventListener('error', (e) => {
        //   //   alert('小程序打开失败');
        //   //   console.log('fail', e.detail);
        //   // });
        // });
      });
      wx.error((res) => {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名
        this.isWXconfig = false;
        console.log('wx-error', res, this.isWXconfig);
      });
    },
    // 监听跳转
    handleLaunch() {
      console.log('跳转');
    },
    // 监听错误
    handleError() {
      console.log('失败');
    },
    clickLeft() {
      console.log('clickLeft');

      //  #ifdef  APP-PLUS
      uni.navigateBack();
      //  #endif

      //  #ifdef  H5
      history.back();
      //  #endif
    },
    initShareDate() {
      let that = this;
      let siteUrl = that.Config?.SiteUrl || '';
      let user_id = that.Config?.user_id || '';
      that.source_user_id = this.userInfo.user_id;
      // #ifndef APP-PLUS
      that.activityId = this.$FT.getUrlKey('activityId') || '1773';
      // #endif
      that.shareData.href = that.$.sprintf('%s/h5/activity/618Activity/index?uid=%d', siteUrl, user_id);

      // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
      // #ifdef APP-PLUS
      that.shareData.href = that.$.sprintf('%s/h5/activity/618Activity/index?uid=%d', siteUrl, user_id);
      // #endif
      // #ifdef MP-WEIXIN
      that.shareData.href = '/h5/activity/618Activity/index?uid=' + user_id;
      // #endif
      that.setData({
        shareData: {
          shareTitle: '寻找好公司+盘中宝',
          shareText: '学会寻找好公司,长期获得超额收益',
          href: that.shareData.href + '&source_user_id=' + that.source_user_id + '&activityId=' + that.activityId,
          image: that.activityShare || that.shareLogo,
        },
      });
      console.log('分享入参：', that.shareData);
    },
    onShareBox() {
      let that = this;
      let siteUrl = that.Config?.SiteUrl || '';
      let user_id = that.Config?.user_id || '';
      that.source_user_id = this.userInfo.user_id;
      // #ifndef APP-PLUS
      that.activityId = this.$FT.getUrlKey('activityId') || '1773';
      // #endif
      that.shareData.href = that.$.sprintf('%s/h5/activity/618Activity/index_h5?uid=%d', siteUrl, user_id);

      // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
      // #ifdef APP-PLUS
      that.shareData.href = that.$.sprintf('%s/h5/activity/618Activity/index_h5?uid=%d', siteUrl, user_id);
      // #endif
      // #ifdef MP-WEIXIN
      that.shareData.href = '/h5/activity/618Activity/index_h5?uid=' + user_id;
      // #endif
      that.setData({
        shareData: {
          shareTitle: '寻找好公司+盘中宝',
          shareText: '学会寻找好公司,长期获得超额收益',
          href: that.shareData.href + '&source_user_id=' + that.source_user_id + '&activityId=' + that.activityId,
          image: that.activityShare || that.shareLogo,
        },
      });
      console.log('分享入参：', that.shareData);
      // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
      // #ifdef APP-PLUS
      that.$refs.shareBoxApp.show();
      // #endif
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/activity/618Activity.scss';
</style>

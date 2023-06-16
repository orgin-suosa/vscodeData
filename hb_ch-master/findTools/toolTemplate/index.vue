<template>
  <view class="toolTemplate" :class="isH5 ? 'toolTemplate_h5' : 'toolTemplate_Nh5'">
	<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
    <!-- #ifdef H5-->
    <open-app />
    <!-- #endif -->
    <scroll-view
      class="toolTemplate-scroll"
      :class="android ? 'android' : 'platform'"
      :style="{ height: scrollHeight + 'rpx' }"
      :scroll-top="scrollTop"
      scroll-y="true"
      :throttle="false"
      @scrolltoupper="upper"
      @scrolltolower="toLower"
      @scroll="listScroll"
    >
      <view class="toolTemplate-navbar" :class="navbarType == 0 ? 'normal_navbar' : ''">
        <slot name="navbar">
          <view v-if="navbarType == 0">
			  <view class="normal_navbarContent">
				  <u-navbar class="normal_navbar" @leftClick="navBack" :is-fixed="true" :title="title" :rightIcon="rightIcon" @rightClick="rightClick" :border-bottom="false"> </u-navbar>
			  </view>
		
          </view>
          <view class="animation_navbar" v-if="navbarType == 1">
            <u-navbar
              class="animation_navbar"
              :background="backgroundObj"
              :is-fixed="true"
              bgColor="rgba(255, 255, 255,0)"
              :leftIconColor="leftIconColor"
              :title="eventTitle1"
              :titleStyle="titleStyle"
              :rightIconColor="leftIconColor"
              :rightIcon="rightIcon"
              @rightClick="rightClick"
              @leftClick="navBack"
              :is-back="true"
              :border-bottom="false"
            />
            <u-navbar
              class="navbar-text"
              :style="{ opacity: old.reverseOpacity }"
              :background="backgroundObj"
              :is-fixed="true"
              :title="title"
              :rightIcon="rightIcon"
              leftIcon=""
              :is-back="false"
              :border-bottom="false"
            />
            <view class="toolTemplatenav" :style="{ opacity: backgroundObj.opacity }">
              <u-navbar class="toolTemplatenav-navbar" :is-back="false" leftIcon="" :rightIcon="rightIcon" :border-bottom="false" />
            </view>
          </view>
        </slot>
      </view>

      <view class="toolTemplate-content-top">
        <slot name="content-top"></slot>
      </view>
      <view class="toolTemplate-content" :class="totalOrderStatus ? '' : 'toolTemplate-content-price'" v-if="showToolTemplate">
        <view class="toolTemplate-content-box">
          <view class="topTabs">
            <slot name="topTabs">
              <u-tabs
                v-if="topNavList.length != 0"
                :current="tabCurrent"
                :list="topNavList"
                lineColor="#F43D3E"
                :activeStyle="{
                  color: '#F43D3E',
                  fontWeight: 700,
                }"
                @change="firstTabChange"
                :scrollable="false"
              >
              </u-tabs>
            </slot>
          </view>
          <view class="subsection-content">
            <slot name="subsection">
              <subsection
                v-if="selectionList.length != 0"
                class="layout-row"
                :subMode="subMode"
                :selectionList="subsectionList"
                :subold="subold"
                :subActiveColor="subActiveColor"
                :subInactiveColor="subActiveColor"
                :subFontSize="subActiveColor"
                :subBgColor="subBgColor"
                :subsectionIndex="videoCurrentIndex"
                @changeBtnIndex="changeBtnIndex"
              ></subsection>
            </slot>
          </view>

          <view class="toolTemplate-content-center">
            <slot name="conten-center"></slot>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="subsection-content">
      <slot name="priceBottom">
        <priceBottom
          v-if="!totalOrderStatus"
          @priceClick="priceClick"
          :productId="productId"
          :totalOrderStatus="totalOrderStatus"
          :safeTip="safeTip"
          :safeTipText="safeTipText"
          :safeTipUnit="safeTipUnit"
          :totalDiscountPrice="totalDiscountPrice"
          :totalOriginalPrice="totalOriginalPrice"
          :buttonList="buttonList"
        ></priceBottom>
      </slot>
    </view>
    <shareGApp :shareDataDefault="shareData" ref="shareGApp" />
  </view>
</template>

<script>
/**
 * topNavList 自定义导航栏
 * * * @property {String}       title   标题
 * *   @property {Array}          topNavList  具名插槽:topTabs的 默认展示tab切换组件所需数组，length=0不显示
 * * * @property {Array}        subsectionList  具名插槽:subsection的 默认展示tab切换组件所需数组	length=0不显示
 * * * * @property {Number}     subsectionIndex  具名插槽:subsection的切换控制属性
 * * * * @property {Function}   changeBtnIndex  具名插槽:subsection的监听修改的函数
 * *  * *@property {Function}   navBack    u-navbar的leftClick函数
 *  * * *@property {Function}   listScroll  scroll-view的scroll函数
 * *  * *@property {Function}   toLower  scroll-view的scrolltolower函数
 * *  * *@property {Function}   upper  scroll-view的scrolltoupper函数
 *  * *  @property {css}   .toolTemplatenav  u-navbar同步title栏的大背景图，可进行换图操作详见-toolTemplate.scss
 *  *  * @property {css}   .toolTemplatenav-navbar   u-navbar同步title栏的文字背景图，可进行换图操作详见-toolTemplate.scss
 */
import navbar from '@/components/nav-bar/index.vue';
import subsection from '@/components/subsection/index.vue';
// import subsection from '@/uni_modules/uview-ui/components/u-subsection/u-subsection.vue';
import modal from '@/uni_modules/uview-ui/components/u-modal/u-modal.vue';
import { mapState, mapMutations } from 'vuex';
import shareGApp from '@/components/share-g-app';
import priceBottom from '../components/priceBottom';
import { initWeChatActivity, addListenWeChatForward, wxClose } from '@/helpers/initWXShare.js';
export default {
  name: 'toolTemplate',
  components: {
    navbar,
    subsection,
    modal,
    shareGApp,
    priceBottom,
  },
  props: {
    position:{
      type:String,
      default(){
        return ''
      }
    },
    stockInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    PageNav: {
      type: Object,
      default() {
        return {
          window: {
            navigationBarBackgroundColor: '#ffffff',
            navigationBarTextStyle: 'black',
            navigationBarTitleText: '',
            backgroundColor: '#f8f8f8',
            backgroundTextStyle: 'dark',
          },
        };
      },
    },
    // 是否显示模板
    showToolTemplate: {
      type: Boolean,
      default() {
        return true;
      },
    },
    // navbar导航类型：0为常规导航，1：是盘中宝变化导航
    navbarType: {
      type: Number,
      default() {
        return 1;
      },
    },
    // 价格栏-文案提示
    safeTip: {
      type: String,
      default() {
        return '';
      },
    },
    // 价格栏-避雷宝-权限次数控制
    safeTipText: {
      type: [Number, String],
      default() {
        return '';
      },
    },
    // 价格栏-避雷宝-权限次数控制-单位
    safeTipUnit: {
      type: String,
      default() {
        return '';
      },
    },
    productId: {
      type: String,
      default() {
        return '';
      },
    },
    // 价格栏-是否购买状态
    totalOrderStatus: {
      type: Boolean,
      default() {
        return true;
      },
    },
    // 价格栏-折扣价格
    totalDiscountPrice: {
      type: String,
      default() {
        return '';
      },
    },
    // 价格栏-原价
    totalOriginalPrice: {
      type: String,
      default() {
        return '';
      },
    },
    // 价格栏-按钮列表
    buttonList: {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      default() {
        return '';
      },
    },
    eventTitle: {
      type: String,
      default() {
        return '';
      },
    },
    // 顶部-navbar-右侧图标
    rightIcon: {
      type: String,
      default() {
        return 'share-square';
      },
    },
    topNavList: {
      type: Array,
      default() {
        return [];
      },
    },
    subsectionList: {
      type: Array,
      default() {
        return [
          // {
          //   name: '最新机会',
          //   show_fg: 0,
          // },
          // {
          //   name: '免费试读',
          //   show_fg: 0,
          // },
        ];
      },
    },
    firstTabIndex: {
      type: Number,
      default() {
        return 0;
      },
    },
    subsectionIndex: {
      type: Number,
      default() {
        return 0;
      },
    },
    titleStyle: {
      type: [Object, String],
      default() {
        return '';
      },
    },
    shareDataDefault: {
      type: Object,
      default() {
        return {
          type: 0, // 0	图文	weixin、sinaweibo,1	纯文字	weixin、qq,2	纯图片	weixin、qq,5	小程序	weixin
          shareTitle: '',
          shareText: '',
          href: '',
          image: '',
        };
      },
    },
  },
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum', 'Lang', 'clientInfo', 'pushMessage']),
    scrollHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      return winHeight;
    },
  },
  watch: {
    subsectionList: {
      handler(newName, oldName) {
        this.selectionList = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    firstTabIndex: {
      handler(newName, oldName) {
        this.tabCurrent = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    subsectionIndex: {
      handler(newName, oldName) {
        this.videoCurrentIndex = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    shareDataDefault: {
      handler(newName, oldName) {
        this.shareData = newName;
        console.log('shareDataDefault:', this.shareData);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      eventTitle1: '',
      shareIcon: 'share-square',
      isH5: false,
      android: false,
      isios: false,
      isAPP: false,
	  isWeChat:false,
      leftIconColor: '#ffffff',
      navBarHeight: 0,
      statusBarHeight: 0,
      backgroundObj: {
        backgroundImage: 'url(/static/zeroPurchase/titleBg.png)',
        backgroundSize: '100% 100%',
        opacity: 1,
      },
      scrollTop: 0,
      old: {
        scrollTop: 0,
        reverseOpacity: 0,
      },
      selectionList: [],
      subMode: 'button',
      subold: true,
      subActiveColor: '#333333',
      // subActiveColor: '#666666',
      // subActiveColor: '28rpx',
      subBgColor: '#F6F7FA',
      tabCurrent: 0,
      videoCurrentIndex: 0,
      isNavbar: false, //自定义导航栏是否显示
      navbarBg1: `${getApp().globalData.qnUrl}/zc_images/findTools/navbar-bg1.png`,
      navbarBg2: `${getApp().globalData.qnUrl}/zc_images/findTools/navbar-bg2.png`,
      shareData: {},
      signature: null,
    };
  },
  created() {
    this.getSystem();
    console.log('checkAuthProcess-shareDataDefault:', this.shareDataDefault);
    this.getSignature();
    this.init();
    this.eventTitle1 = this.eventTitle;
  },
  onShow() {},
  onHide() {},
  onLoad(option) {
    console.log('onLoad-option', option);
    this.options(option);
    this.init();
  },
  onUnload() {},
  methods: {
    ...mapMutations(['setClientInfo', 'updatePushMessage']),
    options(option) {
      // this.productId = option.productId;
      // console.log('options-productId', this.productId);
    },
    async init() {
      //  #ifdef  APP-PLUS
      this.$FT.isNull(this.rightIcon) ? (this.shareIcon = 'share-square') : (this.shareIcon = this.rightIcon);
      this.isAPP = true;
      this.isH5 = false;
      //  #endif
      //  #ifndef  APP-PLUS
      this.isAPP = false;
      this.isH5 = true;
      //  #endif

      this.selectionList = this.subsectionList;
      this.videoCurrentIndex = this.subsectionIndex;
      // this.position 注释:增加此条件是由于这个设置影响了避雷宝的逻辑
      if(!this.position){
        this.tabCurrent = this.firstTab;
      }
    },
    async checkAuthProcess(signature) {
      let that = this;
	  //  #ifndef  APP-PLUS
      console.info('长乘资质--初始化微信流程------------>signature---1.6', signature);
      if (!that.isWeChat) return;
     //  #endif
      // 初始化微信活动主流程
      await initWeChatActivity(signature);
      // 监听微信转发
      addListenWeChatForward(this.handleForwardData(), () => {
        // 转发回调，增加转发记录
        console.info('长乘资质-转发数据', this.handleForwardData());
      });
    },
    // 转发参数处理
    handleForwardData() {
      return {
        title: this.shareDataDefault.title,
        desc: this.shareDataDefault.shareText,
        imgUrl: this.shareDataDefault.image,
        link: this.shareDataDefault.href,
      };
    },
    async getSignature() {
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
    priceClick() {
      this.$emit('priceClick');
    },
    getSystem() {
      let that = this;
	  let port = uni.getSystemInfoSync().platform;
	  //  #ifndef  APP-PLUS
      const ua = navigator.userAgent.toLowerCase();
      that.isWeChat = ua.indexOf('micromessenger') !== -1;
	//  #endif
      switch (port) {
        case 'android':
          that.android = true;
          console.log('运行Android上', port); //android
          break;
        case 'ios':
          if ( that.isWeChat) {
            wxClose();
          }

          that.isios = true;
          console.log('运行iOS上', port); // ios
          break;
        default: //devtools
          console.log('运行在开发者工具上');
          break;
      }
    },
    confirmPush(data) {
      console.log('confirmPush:', data);
      // this.updatePushMessage(data);
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
      this.navBarHeight = menuButtonInfo.bottom - info.statusBarHeight + (menuButtonInfo.top - info.statusBarHeight);

      // #endif
    },
    navigateIntroduce() {
      // uni.navigateTo({
      //   url: '/findTools/toolTemplate/introduce',
      // });
    },
    firstTabChange(data) {
      this.tabCurrent = data.index;
      this.$emit('firstTabChange', data.index);
    },
    changeBtnIndex(data) {
      this.videoCurrentIndex = data;
      this.$emit('changeBtnIndex', data);
    },
    navigateDetails(id) {
      console.log('详情-参数-navigateDetails', id);
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/login/login',
        });
        return;
      }
      // uni.navigateTo({
      //   url: '/findTools/toolTemplate/articleDetails?pageID=' + id,
      // });
    },
    navBack(e) {
      // //  #ifdef  APP-PLUS
      // uni.navigateBack();
      // //  #endif

      // //  #ifndef  APP-PLUS
      // history.back();
      // //  #endif
      this.$emit('navBack', e);
    },
    upper: function (e) {
      this.$emit('upper', e);
      console.log(e);
      this.eventTitle1 = this.eventTitle;
      console.log(this.eventTitle1);
    },
    toLower: function (e) {
      this.$emit('toLower', e);
      const that = this;
      // that.page.pageNum++;
      // let params = {
      //   type: that.videoCurrentIndex,
      //   userId: that.userInfo.user_id,
      //   pageNum: that.page.pageNum,
      //   pageSize: that.page.pageSize,
      // };
      // that.uniList(params);
    },
    listScroll(e) {
      this.navScroll(e);
      this.$emit('listScroll', e);
    },
    navScroll(e) {
      if (this.old.scrollTop > 50) {
        this.eventTitle1 = '';
      }
      let _opacity = 100 / parseInt(this.old.scrollTop);
      const scrollTop = e.detail.scrollTop;
      this.old.scrollTop = scrollTop;
      // 导航条颜色透明渐变
      let minVariable = this.statusBarHeight + 50;
      let maxVariable = this.statusBarHeight + 200;
      // console.log('scroll-minVariable', minVariable);
      if (scrollTop <= minVariable) {
        this.isNavbar = false;
      } else {
        this.isNavbar = true;
      }
      if (minVariable < scrollTop <= maxVariable) {
        this.backgroundObj.opacity = (100 - scrollTop) / 100;
        this.old.reverseOpacity = (1 * scrollTop) / 60;
      }
      if (this.old.reverseOpacity >= 0.68) {
        this.leftIconColor = '#303133';
      } else {
        this.leftIconColor = '#ffffff';
      }
    },

    rightClick() {
      let that = this;
      console.log('分享入参-模板：', that.shareDataDefault);
      // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
      // #ifndef  MP-WEIXIN
      this.$refs.shareGApp.show();
      // #endif
      this.$emit('rightClick');
    },
    goTop: function (e) {
      this.scrollTop = this.old.scrollTop;
      this.$nextTick(function () {
        this.scrollTop = 0;
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/findPage/toolTemplate.scss';
</style>

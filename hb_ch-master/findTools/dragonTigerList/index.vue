<template>
	<view class="panZhongbao dragonTigerList" :class="!totalOrderStatus ? 'panZhongbao-price' : ''">
     <status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
    <scroll-view
      class="panZhongbao-scroll"
      :class="android ? 'android' : 'platform'"
      :style="{ height: scrollHeight + 'rpx' }"
      scroll-y="true"
    >
      <toolTemplate
        ref="toolTemplate"
        title="狙击龙虎榜"
		:shareDataDefault="shareData"
		@priceClick="priceClick"
		:productId="productId"
		:totalOrderStatus="totalOrderStatus"
		:safeTip="safeTip"
		:totalDiscountPrice="totalDiscountPrice"
		:totalOriginalPrice="totalOriginalPrice"
		:buttonList="buttonList"
		@navBack="navBack"
		@toLower="toLower"
		@rightClick="onShareBox" 
      >
	              <template slot="conten-center">
				      <view class="panZhongbao-content">
				        <view class="panZhongbao-content-box">
				          <view class="panZhongbao-content-title">
				            <image class="iconTitle" @click="navigateIntroduce" :src="iconTitle" mode="widthFix"></image>
				            <!-- <view class="button-list" v-if="isAPP && hasLogin"> -->
							 <view class="button-list">
				              <view class="button-list-child button-push" @click="clickPush" v-if="!isPush">
				                <image class="iconAdd" :src="iconAdd" mode="widthFix"></image>
				                <text>推送</text>
				              </view>
				              <image v-if="isPush" class="iconPushed" @click="clickUnPush" :src="iconPushed" mode="widthFix"></image>
				            </view>
				          </view>
				          <!--    -->
				          <firstShares :firstShares="firstShares" @navigateDetails="navigateDetails"></firstShares>
				          <selectedShares :selectedShareList="selectedShareList" :totalOrderStatus="totalOrderStatus" @priceClick="priceClick" @navigateDetails="navigateDetails"></selectedShares>
				          <subsection
				            class="subsectionTab"
				            mode="button"
				            :list="selectionList"
				            :bold="true"
				            activeColor="#333333"
				            inactiveColor="#666666"
				            fontSize="28rpx"
				            bgColor="#F6F7FA"
				            :current="videoCurrentIndex"
				            @change="changeBtnIndex"
				          ></subsection>
				          <newChance :newChance="newChance" :totalOrderStatus="totalOrderStatus" @priceClick="priceClick" @navigateDetails="navigateDetails"></newChance>
				          <!-- <page-pagination :total="page.total" :showAround="true" :btnText="true" :forceEllipses="true" @change="uniListChange"> </page-pagination> -->
				        </view>
				      </view>
					  <pushModal v-if="pushMessage.type == 'lhb' " :pushdata="pushMessage" @confirmPush="confirmPush"></pushModal>
					  <u-modal class="pushModal" content="确认不再接收此推送" :show="showSubscribe" showCancelButton buttonReverse @confirm="subscribeFN" @cancel="() => (showSubscribe = false)"></u-modal>
	         </template>
      </toolTemplate>
    </scroll-view>
  </view>
</template>

<script>
import selectedShares from '../components/selectedShares.vue';
import firstShares from '../components/firstShares.vue';
import newChance from '../components/newChance.vue';
import price from '../components/priceExp';
import priceBottom from '../components/priceBottom';
import subsection from '@/uni_modules/uview-ui/components/u-subsection/u-subsection.vue';
import modal from '@/uni_modules/uview-ui/components/u-modal/u-modal.vue';
import { mapState, mapMutations } from 'vuex';
import pushModal from '@/components/pushMessage/index.vue';
import toolTemplate from '../toolTemplate/index.vue';
export default {
  components: {
    selectedShares,
    firstShares,
    newChance,
    subsection,
    modal,
    price,
    priceBottom,
    pushModal,
	toolTemplate
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
    selectedShareList: {
      handler(newName, oldName) {
        this.selectedShareList = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    newChance: {
      handler(newName, oldName) {
        this.newChance = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
	  shareIcon: '',
      android: false,
      isios: false,
	  isApp:true,
      showPushMessage: false,
      showSubscribe: false,
      page: {
        total: 1, //总页数
        pageSize: 20, //每页条数
        pageNum: 1, //默认当前页
      },
      modalData: {
        show: false,
        content: '',
        cancelText: '取消',
        confirmText: '确认',
      },
      pushModal: {
        show: false,
        content: '财联社6月9日电，北京疫情防控工作发布会通报: 6月9日0时至15时，北京新增本土新冠肺炎病毒感染者3例。您要前往查看吗?',
        cancelText: '以后看看',
        confirmText: '前往查看',
      },
      // pushMessage: '财联社6月9日电，北京疫情防控工作发布会通报: 6月9日0时至15时，北京新增本土新冠肺炎病毒感染者3例。您要前往查看吗?',
      isPush: false,
      isAPP: false,
      leftIconColor: '#ffffff',
      safeTip: '狙击龙虎榜·财联社VIP栏目',
      totalDiscountPrice: '',
      totalOriginalPrice: '',
      productId: '',
      itemId: '',
      totalOrderStatus: true,
      firstShares: [],
      buttonList: [
        {
          text: '立即购买',
        },
      ],
      navTitle: '',
      navBarHeight: 0,
      statusBarHeight: 0,
      iconBack: `${getApp().globalData.qnUrl}/zc_images/images/showBtnImg.png`,
      navbarBg: `${getApp().globalData.qnUrl}/zc_images/findTools/navbar-bg.png`,
      iconTitle: `${getApp().globalData.qnUrl}/zc_images/findTools/page-lhbTitle.png`,
      iconAdd: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-add.png`,
      iconPushed: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-pushed.png`,
      selectionList: [
        {
          name: '最新机会',
          show_fg: 0,
        },
        {
          name: '免费试读',
          show_fg: 0,
        },
      ],
      videoCurrentIndex: 0,
      selectedShareList: [
        // {
        //   authStatus: false,
        //   persons: '10594',
        //   createTime: '2022-06-21 09:09:33',
        //   id: 1048398,
        //   isFree: false,
        // },
      ],
      newChance: [
        // {
        //   time: '13:30',
        //   title: '四季度收入首次突破千亿大关利润大超预期，世界上有无数的成功投资达人',
        //   subtitle: '完美世界四季度收入首次突破千亿大关 利润大超预期 贝佐斯将卸任CEO 股价盘后涨超1%',
        // },
      ],
      scrollTop: 0,
      old: {
        scrollTop: 0,
        reverseOpacity: 0,
      },
      PageNav: {
        window: {
          navigationBarBackgroundColor: '#ffffff',
          navigationBarTextStyle: 'black',
          navigationBarTitleText: '',
          backgroundColor: '#f8f8f8',
          backgroundTextStyle: 'dark',
        },
      },
      isNavbar: false, //自定义导航栏是否显示
      cart_id: '0',
      stockCode: '',
      backgroundObj: {
        backgroundImage: 'url(/static/zeroPurchase/titleBg.png)',
        backgroundSize: '100% 100%',
        opacity: 1,
      },
      cid: '2322444343',
      operateType: 0,
	  shareCLSVIP: `${getApp().globalData.qnUrl}/zc_images/images/share_CLSVIP.png` + this.$FT.versionKey(),
	  shareData: {},
    };
  },
  created() {
     this.onShareBox();
  },
  onShow() {
   //  console.log('PZB-onShow');
    this.panzhongbaoShop();
    //  #ifdef  APP-PLUS
    plus.navigator.setFullscreen(false);
	this.isApp = true;
    //  #endif
	//  #ifndef  APP-PLUS
	this.isApp = false;
	//  #endif
  },
  //如果不加这句，会导致跳转到别的页面后也是全屏
  onHide() {
    //  #ifdef  APP-PLUS
    plus.navigator.setFullscreen(false);
    //  #endif
  },
  onLoad(option) {
   //  console.log('onLoad-option', option);
    this.options(option);
    this.init();
    //  #ifdef  APP-PLUS
    this.isAPP = true;
    //  #endif
  },
  onUnload() {
    //  #ifdef  APP-PLUS
    plus.navigator.setFullscreen(false);
    //  #endif
  },
  methods: {
    ...mapMutations(['setClientInfo', 'updatePushMessage']),
    options(option) {
      this.productId = option.productId;
     //  console.log('options-productId', this.productId);
    },
    async init() {
      this.$FT.clearArr(this.firstShares);
      this.$FT.clearArr(this.selectedShareList);
      this.$FT.clearArr(this.newChance);
	  //  #ifdef  APP-PLUS
	  this.shareIcon = 'share-square';
	  //  #endif
      // this.getSystemInf();
      let uniList_params = {
        type: this.videoCurrentIndex,
        userId: this.userInfo.user_id,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
		clsType:'LHB'
      };
      this.getSystem();
      await this.uniList(uniList_params);
      await this.panoSelectedList(0);
      await this.panoSelectedList(1);
      await this.panzhongbaoShop();
      await this.PZBUserBinding();
    },
    getSystem() {
      let that = this;
      let port = uni.getSystemInfoSync().platform;
      switch (port) {
        case 'android':
          that.android = true;
         //  console.log('运行Android上', port); //android
          break;
        case 'ios':
          that.isios = true;
         //  console.log('运行iOS上', port); // ios
          break;
        default:
         //  console.log('运行在开发者工具上'); //devtools
          break;
      }
    },
    clickPush() {
     //  console.log('clickPush：', this.hasLogin);
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/login/login',
        });
        return;
      }
      this.isPush = true;
      uni.showToast({
        icon: 'none',
        title: '已打开推送',
      });
      let cid = this.clientInfo?.clientid || '';
      let params = {
        userId: this.userInfo.user_id,
        cid: cid,
        busType: 1,
        operateType: 0, // 打开推送
      };
      this.PZBoperate(params);
    },
    confirmPush(data) {
     //  console.log('confirmPush:', data);
      this.updatePushMessage(data);
    },
    async subscribeFN() {
      this.showSubscribe = false;
      this.isPush = false;
      let cid = this.clientInfo?.clientid || '';
      let params = {
        userId: this.userInfo.user_id,
        cid: cid,
        busType: 1,// 龙虎榜
        operateType: 1, // 关闭推送
      };
     //  console.log('PZBoperate-params', params);
      await this.PZBoperate(params);

      uni.showToast({
        icon: 'none',
        title: '已关闭推送',
      });
    },
    clickUnPush() {
      this.showSubscribe = true;
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
    PZBUserBinding() {
	  //	Type 0盘中宝，1龙虎榜
      const that = this;
      let params = {
        userId: that.userInfo.user_id,
        type: 1,
      };
     //  console.log('查询用户绑定情况-入参', params);
     //  console.log('查询用户绑定情况-url', that.Config.PZBUserBinding);
      uni.request({
        url: that.Config.PZBUserBinding,
        method: 'get',
        dataType: 'jsonp',
        data: params,
        success: (res) => {
          const data = JSON.parse(res.data);
         console.log('查询用户绑定情况-data', data);
          const result = data.result;
         //  console.log('查询用户绑定情况-result', result);
          that.isPush = result.isOpenPush;
          console.log('查询用户绑定情况-isPush', that.isPush, result.isOpenPush);
        },
        fail: (res) => {
         //  console.log('查询用户绑定情况-fail', res);
        },
        complete: () => {},
      });
    },
    PZBoperate(params) {
      // operateType=0开启推送，1关闭推送
	  // busType 0盘中宝，1龙虎榜
      const that = this;
     //  console.log('开/关推送-入参', params);
     //  console.log('开/关推送-url', that.Config.PZBoperate);
      uni.request({
        url: that.Config.PZBoperate,
        method: 'POST',
        dataType: 'jsonp',
        data: params,
        success: (res) => {
          console.info('开/关推送-res', res);
          const data = JSON.parse(res.data);
          console.log('开/关推送-data', data);
          that.isPush = data.result;
          console.log('开/关推送-result-isPush', data.result, that.isPush);
        },
        fail: (res) => {
         //  console.log('开/关推送-fail', res);
          uni.showToast({
            icon: 'none',
            title: '操作失败,请稍后再试!',
          });
        },
        complete: () => {
          this.PZBUserBinding();
        },
      });
    },
    panzhongbaoShop() {
      const that = this;
      let params = {
        userId: that.userInfo.user_id,
      };
     ////  console.log('支付相关-入参', params);
     //  console.log('支付相关-url', that.Config.panzhongbaoShop);
      uni.request({
        url: that.Config.panzhongbaoShop,
        method: 'get',
        dataType: 'jsonp',
        data: params,
        success: (res) => {
         //  console.log('支付相关-res', res);
          const data = JSON.parse(res.data);
         //  console.log('支付相关-data', data);
          const result = data.result;
         //  console.log('支付相关-list', list);
          ////  console.log('获取首页banner-page_code', page_code);
          if (res.statusCode == 200) {
            let list = result.lhb;
           //  console.log('支付相关-狙击龙虎榜', pzb);
            that.totalDiscountPrice = list.unitPrice;
            that.totalOriginalPrice = list.marketValue;
            that.totalOrderStatus = list.orderStatus;
            that.productId = list.productId;
            that.itemId = list.itemId;

            ////  console.log('发现工具 :that.pageDetail', that.toolsList);
          }
        },
        fail: (res) => {
         //  console.log('支付相关-fail', res);
        },
        complete: () => {},
      });
    },
    uniListChange(pageNum, type) {
     //  console.log('点击了' + type + '，当前页：' + pageNum);
      const that = this;
      this.page.pageNum = pageNum;
      let params = {
        type: that.videoCurrentIndex,
        userId: that.userInfo.user_id,
        pageNum: that.page.pageNum,
        pageSize: that.page.pageSize,
		clsType:'LHB'
      };
      that.uniList(params);
    },
    uniList(params, type) {
      /**
       * type=0 查询收费和免费，type=1 查询免费试看列表
       *
       */
      const that = this;
      // let params = {
      //   type: type,
      //   userId: that.userInfo.user_id,
      //   pageNum: that.page.pageNum,
      //   pageSize: that.page.pageSize,
      // };
     //  console.log('狙击龙虎榜-panzhongbaoList-入参', params);
     //  console.log('狙击龙虎榜-panzhongbaoList-url', that.Config.panzhongbaoList);
      uni.request({
        url: that.Config.panzhongbaoList,
        method: 'get',
        dataType: 'jsonp',
        data: params,
        success: (res) => {
          ////  console.log('狙击龙虎榜-res', res);
          const data = JSON.parse(res.data).result;
         //  console.log('狙击龙虎榜-panzhongbaoList-data', data);
          const list = data.list;
         //  console.log('狙击龙虎榜-panzhongbaoList-list', list);
          ////  console.log('获取首页banner-page_code', page_code);
          if (res.statusCode == 200) {
            uni.stopPullDownRefresh();
            // that.newChance = list;
            list.forEach(function (item, i, array) {
              let ctime = item.ctime;
              that.newChance.push({
                // time: ctime.substring(11, ctime.length),
                ctime: ctime.substring(5, ctime.length),
                title: item.title,
                brief: item.brief,
                authStatus: item.authStatus, // 是否解锁
                isFree: item.isFree,
                id: item.id,
                visited: item?.visited || false,
              });
            });

           //  console.log('狙击龙虎榜 :that.newChance', that.newChance, that.newChance.length);
          }
        },
        fail: (res) => {
         //  console.log('狙击龙虎榜-fail', res);
        },
        complete: () => {},
      });
    },
    panoSelectedList(type) {
      /**
       * type=0是置顶，等于1是主编精选
       *
       */
      const that = this;
      let params = {
        type: type,
        userId: that.userInfo.user_id,
        pageNum: 1,
        pageSize: 20,
		clsType:'LHB'
      };
     //  console.log('狙击龙虎榜-panoSelectedList-入参', params);
     //  console.log('狙击龙虎榜-panoSelectedList-url', that.Config.panoSelectedList);
      uni.request({
        url: that.Config.panoSelectedList,
        method: 'get',
        dataType: 'jsonp',
        data: params,
        success: (res) => {
          ////  console.log('狙击龙虎榜-res', res);
          const data = JSON.parse(res.data).result;
         //  console.log('狙击龙虎榜-panoSelectedList-data', data);
          const list = data?.list || [];
         //  console.log('狙击龙虎榜-panoSelectedList-list', list);
          ////  console.log('获取首页banner-page_code', page_code);
          if (res.statusCode == 200) {
            uni.stopPullDownRefresh();
            if (type == 0) {
              that.firstShares = list;
              list.forEach(function (item, i, array) {
                let ctime = item.ctime;
                that.stockCode = item.stockCode;
                // if(that.firstShares.length >0) return;
                // that.firstShares.push({
                //   name: item.stockName,
                //   increase: item.maxIncr,
                //   text: item.summary,
                //   id: item.id,
                //   authStatus: item.authStatus, // 是否解锁
                //   isFree: item.isFree,
                // });
              });
             //  console.log('狙击龙虎榜-panoSelectedList :that.firstShares', that.firstShares);
            } else if (type == 1) {
              that.selectedShareList = list;
              // list.forEach(function (item, i, array) {
              //   let ctime = item.ctime;
              //   that.selectedShareList.push({
              //     time: item.createTime.substring(5, 16) || '--',
              //     text: item.articleTitle || '--',
              //     persons: item.buyCount,
              //     authStatus: item.authStatus,
              //     id: item.id,
              //     isFree: item.isFree,
              //   });
              // });
             //  console.log('狙击龙虎榜-panoSelectedList :that.selectedShareList', that.selectedShareList);
            }

            ////  console.log('狙击龙虎榜 :that.newChance', that.newChance);
          }
        },
        fail: (res) => {
         //  console.log('狙击龙虎榜-fail', res);
        },
        complete: () => {},
      });
    },
    navigateIntroduce() {
      uni.navigateTo({
        url: '/findTools/dragonTigerList/introduce',
      });
    },
    priceClick(text) {
      const that = this;
     //  console.log('狙击龙虎榜-productId', text, that.productId, this.hasLogin);
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/login/login',
        });
        return;
      }
      uni.navigateTo({
        // url: '/edu/course/class-detail?product_id=' + that.productId + '&item_id=' + that.itemId,
		url: '/edu/order/checkout?cart_id=' + that.itemId + '|' + 1,
      });
      // uni.navigateTo({
      //   url: '/edu/order/checkout?cart_id=' + this.cart_id + '|' + 1,productId
      // });
      //这一步直接跳立即购买checkout页面
    },
    changeBtnIndex(type) {
      this.videoCurrentIndex = type;
      this.$FT.clearArr(this.newChance);
      let uniList_params = {
        type: type,
        userId: this.userInfo.user_id,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
		clsType:'LHB'
      };
      this.uniList(uniList_params);
    },
    navigateDetails(id) {
     //  console.log('详情-参数-navigateDetails', id);
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/login/login',
        });
        return;
      }
      // uni.navigateTo({
      //   url: '/findTools/dragonTigerList/articleDetails?stockCode=' + this.stockCode + '&id=' + id + '&product_id=' + this.productId + '&item_id=' + this.itemId,
      // });
      uni.navigateTo({
        url: '/findTools/dragonTigerList/articleDetails?pageID=' + id,
      });
    },
    navigate(href) {
     //  console.log('navigate', href);
      window.location = href;
    },
    navBack() {
     //  console.log('狙击龙虎榜-back');
      //  #ifdef  APP-PLUS
      uni.navigateBack();
      //  #endif

      //  #ifdef  H5
      history.back();
      //  #endif
    },
    clickLeft() {
      uni.switchTab({
        url: '/pages/findPage/index',
      });
    },
    upper: function (e) {
     //  console.log(e);
    },
    toLower: function (e) {
      const that = this;
      that.page.pageNum++;
      let params = {
        type: that.videoCurrentIndex,
        userId: that.userInfo.user_id,
        pageNum: that.page.pageNum,
        pageSize: that.page.pageSize,
		clsType:'LHB'
      };
      that.uniList(params);
    },
	onShareBox() {
		let that = this;
		
		let $href = that.$.sprintf('%s/h5/findTools/dragonTigerList/index?uid=%d', that.Config.SiteUrl, that.userInfo.user_id,'&showOpenApp=true');
		
		// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
		// #ifdef APP-PLUS
		$href = that.$.sprintf('%s/h5/findTools/dragonTigerList/index?uid=%d', that.Config.SiteUrl, that.userInfo.user_id, '&showOpenApp=true');
		// #endif
		// #ifdef MP-WEIXIN
		$href = '/h5/findTools/dragonTigerList/index?uid=' + that.userInfo.user_id + '&showOpenApp=true';
		// #endif
		that.setData({
			shareData: {
				shareTitle: '狙击龙虎榜',
				shareText: '全方位提升：复盘能力、选股能力、交易能力',
				href: $href,
				image: that.shareCLSVIP,
			},
		});
		console.log('分享入参：', that.shareData);
		// // #ifndef MP-WEIXIN
		// this.$refs.shareBoxApp.show();
		// // #endif
	},
    goTop: function (e) {
      this.scrollTop = this.old.scrollTop;
      this.$nextTick(function () {
        this.scrollTop = 0;
      });
      // uni.showToast({
      //   icon: 'none',
      //   title: '纵向滚动 scrollTop 值已被修改为 0',
      // });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/findPage/panZhongbao.scss';
@import '@/styles/home/pushModal.scss';
$navbar-bg2: 'https://qnsp.zcskjy.com/zc_images/findTools/navbar-lhbbg2.png';
.dragonTigerList {
	::v-deep .toolTemplate{
		&-navbar{
			.animation_navbar{
				.toolTemplatenav{
					&-navbar {
					  width: 750rpx;
					  height: 100%;
					  // height: calc(165rpx + var(--status-bar-height));
					  background: url($navbar-bg2) no-repeat center !important;
					  background-size: 498rpx 45rpx !important;
					  background-position: center !important;
					}
				}
			}
		}
	}
	.iconTitle{
		width: 315rpx;
		height: 33rpx;
	}
}
// page-lhbTitle.png
</style>

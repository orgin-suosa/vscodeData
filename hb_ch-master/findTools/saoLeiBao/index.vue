<template>
  <view class="content" :class="BLBstopAdd ? 'noGuide' : 'isGuide'">
    <view class="statusBarHeight" :style="{ height: statusBarHeight + 'px' }"></view>
    <status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>

    <scroll-view class="articleDetail-scroll" :style="{ height: scrollHeight + 'rpx' }" scroll-y="true">
      <toolTemplate ref="toolTemplate" :position="position" :title="title" :topNavList="topNavList" :firstTabIndex="firstTabIndex" :subsectionList="selectionList" :shareDataDefault="shareData" @priceClick="priceClick" :productId="priceBottom.productId" :totalOrderStatus="priceBottom.totalOrderStatus" :safeTip="priceBottom.safeTip" :safeTipText="SLNumber" safeTipUnit="次" :totalDiscountPrice="priceBottom.totalDiscountPrice" :totalOriginalPrice="priceBottom.totalOriginalPrice" :buttonList="priceBottom.buttonList" @firstTabChange="firstTabChange" @navBack="navBack" @upper="upper" @toLower="toLower" @listScroll="listScroll">
        <template slot="conten-center">
          <!-- 将v-if修改为v-show,由于表格排序，当切换tab时，sort默认值会重新修改为默认，保留不了当初的状态，v-show不会造成组件销毁和重建 -->
          <!-- 	市场扫描  -->
          <marketScanning :rderStatus="priceBottom.totalOrderStatus" :marketIndex="marketIndex" :stockShow="stockShow" :userInfo="userInfo" :redHeiBang="redHeiBang" v-if="firstTabIndex == 0" @changeBtnIndex="changeBtnIndex" @itemClick="itemClick"></marketScanning>

          <!-- 自选排雷 :redHeiBang="selfShares" 这里的true要注释掉-->
          <selectedDemining v-show="firstTabIndex == 1" :redHeiBang="selfShares" :totalOrderStatus="priceBottom.totalOrderStatus" @toSelfSweep="toSelfSweep" @itemClick="itemClick1" @changeSortDate="changeSortDate"></selectedDemining>

          <!-- 个股扫雷 -->
          <deminingStocks :stockShow="stockShow" :pageNum="pageNum" v-if="firstTabIndex == 2" @itemClick="itemClick"></deminingStocks>

          <modal :showModal="showTipModal" :titleModal="titleModal" :contentModal="contentModal" :confirmText="confirmText" @confirmModal="confirmModal" @closeModal="closeModal"></modal>
          <!-- 价格 -->
          <!--          <priceBottom
            class="priceBottom"
            v-if="!priceBottom.totalOrderStatus"
            @priceClick="priceClick"
            :productId="priceBottom.productId"
            :totalOrderStatus="priceBottom.totalOrderStatus"
            :safeTip="priceBottom.safeTip"
            :safeTipText="SLNumber"
            safeTipUnit="次"
            :totalDiscountPrice="priceBottom.totalDiscountPrice"
            :totalOriginalPrice="priceBottom.totalOriginalPrice"
            :buttonList="priceBottom.buttonList"
          ></priceBottom> -->
        </template>
      </toolTemplate>
    </scroll-view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import toolTemplate from '../toolTemplate/index.vue';
import marketScanning from '../components/saoleiBao/marketScanning';
import deminingStocks from '../components/saoleiBao/deminingStocks';
import priceBottom from '../components/priceBottom';
import modal from '../components/saoleiBao/modal';
import scanprogress from './scanprogress';
import selectedDemining from '../components/saoleiBao/selectedDemining';
var Interval;
export default {
  components: {
    toolTemplate,
    marketScanning,
    deminingStocks,
    priceBottom,
    modal,
    scanprogress,
    selectedDemining,
  },
  computed: {
    ...mapState(['groupId', 'formSelfStock', 'Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum', 'Lang', 'isBeganToMine', 'BLBstopAdd', 'SLNumber']),
    ...mapMutations(['updateIsBeganToMine', 'updateBLBstopAdd', 'updateSLNumber']),
    scrollHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      return winHeight;
    },
    // options
    options () {
      return {
        path: 'https://qnsp.zcskjy.com/zc_images/json/sweep.json', //'https://qnsp.zcskjy.com/zc_images/json/sweep.json',
      };
    },
  },
  data () {
    return {
      stockData: [],
      firstComeIn: false,
      position: '',
      groupsId: '',
      title: '避雷宝',
      firstTabIndex: 0, // 市场扫描  个股扫雷tab
      marketIndex: 1, // 红黑榜tab
      statusBarHeight: 0,
      navBarHeight: 0,
      PageNav: {
        window: {
          navigationBarBackgroundColor: '#ffffff',
          navigationBarTextStyle: 'black',
          navigationBarTitleText: '',
          backgroundColor: '#f8f8f8',
          backgroundTextStyle: 'dark',
        },
      },
      topNavList: [
        {
          name: '市场扫描',
        },
        {
          name: '自选排雷',
        },
        {
          name: '个股扫雷',
        },
      ],
      videoCurrentIndex: 0,
      selectionList: [],
      stockShow: {
        totalStockCount: '--', // 总股票
        riskRate: '--', // 有风险股票占比
        riskStockCount: '--',
        safeStockCount: '--', // 无风险股票
        updTime: '--',
      },
      redHeiBang: {
        theadList: [
          {
            id: 'nameCode',
            name: '名称/代码',
          },
          {
            name: '总得分',
            id: 'totalScore',
          },
          {
            name: '总检查项',
            id: 'totalCheckItems',
          },
          {
            name: '安全项',
            id: 'safetyItems',
          },
          {
            name: '风险项',
            id: 'riskItems',
          },
        ],
        fixedTB: [
          {
            nameCode: {
              val: '--',
              val2: '--',
              type: 'normal',
              icon: '',
              val2Color: '#999999',
            },
            totalScore: {
              val: '--',
              type: 'normal',
              fontColor: '#F43D3E',
            },
            totalCheckItems: {
              val: '--',
              type: 'normal',
            },
            safetyItems: {
              val: '--',
              type: 'normal',
            },
            riskItems: {
              val: '--',
              type: 'normal',
              fontColor: '#24B842',
            },
          },
        ],
      },
      selfShares: {
        theadList: [
          {
            id: 'nameCode',
            name: '名称/代码',
          },
          {
            name: '总得分',
            id: 'totalScore',
          },
          {
            name: '总检查项',
            id: 'totalCheckItems',
          },
          {
            name: '安全项',
            id: 'safetyItems',
          },
          {
            name: '风险项',
            id: 'riskItems',
          },
        ],
        fixedTB: [
          {
            nameCode: {
              val: '--',
              val2: '--',
              type: 'normal',
              icon: '',
              val2Color: '#999999',
            },
            totalScore: {
              val: '--',
              type: 'normal',
              fontColor: '#F43D3E',
            },
            totalCheckItems: {
              val: '--',
              type: 'normal',
            },
            safetyItems: {
              val: '--',
              type: 'normal',
            },
            riskItems: {
              val: '--',
              type: 'normal',
              fontColor: '#24B842',
            },
          },
        ],
      },
      // showModal: false,
      showTipModal: false,
      titleModal: '温馨提示',
      contentModal: '今日免费使用权限已完，如需无限次使用可购买扫雷宝权限。',
      confirmText: '立即购买',
      pageNum: 1, //每页条数
      redHeiPageNum: 20,
      option: '',
      priceBottom: {
        safeTip: '今日免费使用权限剩',
        productId: '',
        itemId: '',
        totalDiscountPrice: '--',
        totalOriginalPrice: '--', // 原价
        totalOrderStatus: false, // 是否购买
        buttonList: [
          {
            text: '立即购买',
          },
        ],
      },
      totalStockCount: 1235,
      stopAdd: false,
      scanData: {
        totalStockCount: 1235,
        stopAdd: false,
      },
      productId: '',
      itemId: '',
      showToolTemplate: false,
      deminingStocksNumber: 3,
      iconSearch: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-search.png` + this.$FT.versionKey(),
      shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg` + this.$FT.versionKey(),
      shareBlb: `${getApp().globalData.qnUrl}/zc_images/images/share_blb.png` + this.$FT.versionKey(),
      shareData: {
        mode: 'image',
        shareTitle: '',
        shareText: '',
        href: '',
        image: '',
      }
    };
  },
  created () {
    this.initShareData();
  },
  onLoad (option) {
    console.log('userInfo', this.userInfo);
    if (option.position) {
      this.firstTabIndex = 1
      this.$store.commit('changTableSort', true)
    } else {
      this.$store.commit('changTableSort', false)
    }
    this.option = option;
    this.position = option.position
    this.init(option);
  },
  onShow: function () {
    console.info('--onShow---', this.option);
    // this.iconSearch=this.$FT.addVersion(this.iconSearch);
    console.info("避雷宝分享1.9")
    this.deminingStocksNumber = this.SLNumber;
    this.getUserEnableCount();
    this.marketScanner();
    if (this.option.productId && this.option.item_id) {
      this.panzhongbaoShop();
    }
    // 返回
    if (this.firstTabIndex == 0 && this.firstComeIn) {
      this.$FT.clearArr(this.selfShares.fixedTB);
      this.getShareList()
      this.firstComeIn = false
    }
    if (this.firstTabIndex == 2 && this.firstComeIn) {
      this.$FT.clearArr(this.selfShares.fixedTB);
      this.getShareList()
      this.firstComeIn = false
    }
    console.log('333this.firstTabIndex',this.firstTabIndex);
    console.log('333this.firstComeIn',this.firstComeIn);
    if (this.firstTabIndex == 1 && this.firstComeIn) {
      uni.getStorage({
        //key值为custom
        key: `stockDate`,
        success: (res) => {
          console.log('22移除后的this.localData=======', res.data);
          this.selfShares.fixedTB = res.data
          console.log('333this.selfShares.fixedTB',this.selfShares.fixedTB);
        }
      })
      
    }

  },

  onUnload () { },
  methods: {
    init (option) {
      // console.log("getSystemInfoSync",ssuni.getSystemInfoSync())
      let that = this;
      this.priceBottom.productId = option.productId;
      this.$FT.clearArr(this.redHeiBang.fixedTB);
      this.$FT.clearArr(this.selfShares.fixedTB);
      let redHeiParams = {
        userId: this.userInfo.user_id,
        type: this.marketIndex,
        pageNum: 1,
        pageSize: 20,
      };
      this.marketScanner();
      this.slbBand(redHeiParams);
      // 获取自选股
      if (!this.firstComeIn) {
        this.getShareList();
      }
      this.panzhongbaoShop();
      this.initShareData();

      // this.getUserEnableCount();
    },
    scanprogress (e) {
      console.info('scanprogress:', e);
      this.showToolTemplate = e;
    },
    toSelfSweep () {
      this.firstTabIndex = 2
    },
    itemClick (model, index, type) {
      this.firstComeIn = true
      console.log('ddddd', model, index, type);
      // console.info('---infomdel---122--',model);

      let _this = this;
      // console.log('marketScanning-model,index-SLNumber', model, index, _this.SLNumber);
      this.deminingStocksNumber = this.SLNumber;
      // console.log('marketScanning-model,index', _this.deminingStocksNumber);
      if (_this.SLNumber > 0) {
        _this.deminingStocksNumber--;
      } else {
        _this.showTipModal = true;
        return;
      }
      _this.$store.commit('updateSLNumber', _this.deminingStocksNumber);

      // console.log('marketScanning-SLNumber', _this.SLNumber);
      if (index == 0 && type == 'table') {
        this.toHq(model);
      } else {
        uni.navigateTo({
          url: '/findTools/saoLeiBao/stockScanDetails?stockCode=' + model.stockCode + '&stockName=' + model.stockName + '&market=' + model.market,
        });
      }
    },
    itemClick1 (model, index, item) {
      this.firstComeIn = true
      console.log('ddddd', model, index, item);
      let _this = this;
      this.deminingStocksNumber = this.SLNumber;
      if (_this.SLNumber > 0) {
        _this.deminingStocksNumber--;
      } else {
        _this.showTipModal = true;
        return;
      }
      _this.$store.commit('updateSLNumber', _this.deminingStocksNumber);

      // console.log('marketScanning-SLNumber', _this.SLNumber);
      if (index == 0) {
        this.toHq(model);
      } else {
        uni.navigateTo({
          url: '/findTools/saoLeiBao/stockScanDetails?stockCode=' + model.stockCode + '&stockName=' + model.stockName + '&market=' + model.market + '&item=' + JSON.stringify(item),
        });
      }
    },
    toHq (data) {
      const that = this;
      if (data.nameCode) {
        let { val, val2, market } = data.nameCode;
        let setcode;
        if (market == 0 || market == 4) {
          setcode = 1;
        } else if (market == 1 || market == 3) {
          setcode = 0;
        } else {
          setcode = market;
        }
        let baseUrl = that.Config.ApiUrl;
        let urls = baseUrl + '/hq-H5/h5/index.html#/page_detail/page-detail/page-detail?code=' + val2 + '&setcode=' + setcode + '&stockName=' + val;
        // #ifdef H5
        window.location.href = urls;
        // #endif

        //#ifdef APP-PLUS
        uni.navigateTo({
          url: `/my/webview/webview_live?url=${urls}`,
        });
        // #endif
      }
    },
    closeModal (state) {
      this.showTipModal = state;
    },
    confirmModal (state) {
      this.showTipModal = state;
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/login/login',
        });
        return;
      }
      uni.navigateTo({
        // url: '/edu/course/class-detail?product_id=' + productIds+ '&item_id=' + itemId,
        url: '/edu/order/checkout?cart_id=' + this.priceBottom.itemId + '|' + 1,
      });
    },
    upper: function (e) {
      // console.log('扫雷宝upper:', e);
    },
    toLower (e) {
      // console.log('扫雷宝-toLower:', e);
      if (this.firstTabIndex == 0) {
        const that = this;
        // console.log('滑动加载', e);
        that.pageNum++;
        let redHeiParams = {
          userId: that.userInfo.user_id,
          type: that.marketIndex,
          pageNum: that.pageNum,
          pageSize: 20,
        };
        let params = {
          userId: this.userInfo.user_id,
          queryType: "1"
        }
        // redHeiParams.pageNum = redHeiParams.pageNum ++;
        this.slbBand(redHeiParams);
      }
      // 下拉获取信息
      // this.getShareList(params);
      // let params = {
      //   type: that.videoCurrentIndex,
      //   userId: that.userInfo.user_id,
      //   pageNum: that.page.pageNum,
      //   pageSize: that.page.pageSize,
      // };
      // that.uniList(params);
    },
    listScroll (e) {
      // // console.log('扫雷宝-scroll:', e, this.tableList.theadList[0]);
    },
    navBack () {
      uni.switchTab({
        url: '/pages/tools/index'
      });
    },
    firstTabChange (data) {
      this.firstTabIndex = data;
      // this.updateIsBeganToMine(false);
      if (this.firstTabIndex == 2) {
        this.$store.commit('updateIsBeganToMine', false);
      }
      if (this.firstTabIndex == 1) {
        this.$store.commit('changTableSort', true);
      } else {
        this.$store.commit('changTableSort', false);
      }
    },
    priceClick (text) {
      const that = this;
      let productId = that.priceBottom.productId;
      let itemId = that.priceBottom.itemId;
      // console.log('扫雷宝-productId', text, productId, this.hasLogin);
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/login/login',
        });
        return;
      }
      uni.navigateTo({
        // url: '/edu/course/class-detail?product_id=' + productIds+ '&item_id=' + itemId,
        url: '/edu/order/checkout?cart_id=' + itemId + '|' + 1,
      });
    },
    getSystemInf () {
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
    changeBtnIndex (data) {
      // console.log('changeBtnIndex', data);
      this.marketIndex = data;
      this.$refs.toolTemplate.goTop();
      this.$FT.clearArr(this.redHeiBang.fixedTB);
      let params = {
        userId: this.userInfo.user_id,
        type: this.marketIndex,
        pageNum: 1,
        pageSize: 20,
      };
      this.slbBand(params);
    },
    panzhongbaoShop () {
      const that = this;
      let params = {
        userId: that.userInfo.user_id,
      };
      // console.log('支付相关-入参', params);
      // console.log('支付相关-url', that.Config.panzhongbaoShop);
      uni.request({
        url: that.Config.panzhongbaoShop,
        method: 'get',
        dataType: 'jsonp',
        data: params,
        success: (res) => {
          // console.log('支付相关-res', res);
          const data = JSON.parse(res.data);
          const list = data.result;
          // // console.log('获取首页banner-page_code', page_code);
          if (res.statusCode == 200) {
            let slb = list.slb;
            that.priceBottom.totalDiscountPrice = slb.unitPrice;
            that.priceBottom.totalOriginalPrice = slb.marketValue;
            that.priceBottom.totalOrderStatus = slb.orderStatus;
            that.priceBottom.productId = slb.productId;
            that.priceBottom.itemId = slb.itemId;

            // // console.log('发现工具 :that.pageDetail', that.toolsList);
          }
        },
        fail: (res) => {
          // console.log('支付相关-fail', res);
        },
        complete: () => { },
      });
    },

    getUserEnableCount () {
      const that = this;
      let params = {
        userId: that.userInfo.user_id,
      };
      // console.log('避雷宝-未购买用户询剩余次数-入参', params);
      // console.log('避雷宝-未购买用户询剩余次数-url',  that.Config.URL.newsUrl.getUserEnableCount);
      uni.request({
        url: that.Config.URL.newsUrl.getUserEnableCount,
        method: 'get',
        dataType: 'jsonp',
        data: params,
        success: (res) => {

          const data = JSON.parse(res.data);
          console.log('避雷宝-未购买用户询剩余次数data', data, that.isNum(data.result));
          that.deminingStocksNumber = that.isNum(data.result) ? data.result : 0;
          that.$store.commit('updateSLNumber', that.deminingStocksNumber);

        },
        fail: (res) => {
          // console.log('避雷宝-未购买用户询剩余次数-fail', res);
        },
        complete: () => { },
      });
    },
    isNum (value) {
      return typeof value === 'number' && !isNaN(value);

    },
    slbBand (params) {
      const that = this;
      // console.log('红黑榜-入参', params);
      // console.log('红黑榜-url', that.Config.PZBUserBinding);
      uni.request({
        url: that.Config.slbBand,
        method: 'get',
        dataType: 'jsonp',
        data: params,
        success: (res) => {
          const data = JSON.parse(res.data);
          console.log('红黑榜-data', data);
          const result = data.result;
          // // console.log('红黑榜esult.list', result.list);
          let scoreColor;
          result.list.forEach(function (item, i, array) {
            // // console.log('红黑榜-item, i, array', item, i, array);
            if (Number(item.score) > 60) {
              scoreColor = '#F43D3E';
            } else {
              scoreColor = '#24B842';
            }
            that.redHeiBang.fixedTB.push({
              nameCode: {
                val: item.stockName,
                val2: item.stockCode,
                type: 'normal',
                // icon:'创',
                market: Number(item.market),
                val2Color: '#999999',
              },
              totalScore: {
                val: item.score + '分',
                type: 'normal',
                fontColor: scoreColor,
              },
              totalCheckItems: {
                val: item.totalCount,
                type: 'normal',
              },
              safetyItems: {
                val: item.safeCount,
                type: 'normal',
              },
              riskItems: {
                val: item.riskCount,
                type: 'normal',
                fontColor: '#24B842',
              },
            });
          });

          //  // console.log('红黑榜-result', result);
          // // console.log('红黑榜that.redHeiBang', that.redHeiBang);
        },
        fail: (res) => {
          // console.log('红黑榜-fail', res);
        },
        complete: () => { },
      });
    },
    // changeDateUp (val) {
    //   // 点击排序
    //   this.getShareList(val)
    // },
    changeSortDate (val) {
      this.getShareList(val)
    },
    // 存储排序后的数据
    saveSortData (sortData) {
      console.log('排好存储前的数据====>', sortData);
      let arr = []
      sortData.forEach(item => {
        arr.push(Object.assign({}, { market: item.market, code: item.stockCode }))
      })
      console.log(arr);
      let data = {
        "userId": this.userInfo.user_id,
        "groups": [
          {
            "groupId": this.groupId,
            "codes": arr
          }
        ]
      }
      uni.request({
        url: this.Config.slbSortStockData,
        method: 'POST',
        data: data,
        success (res) {
          console.log('排序后的数据=========>', res);
        }
      })
    },
    // 获取分数等数据
    getOtherDate (params, vall) {
      console.log('vall', vall);
      let that = this;
      uni.request({
        url: this.Config.slbFindOtherData,
        method: 'POST',
        data: params,
        success: (res) => {
          const data = res.data;
          if (data.code == '0' && this.position == '2' && this.formSelfStock) {
            uni.showToast({
              title: '您已成功导入自选股',
              icon: 'none',
              duration: 2000
            });
          }
          this.$store.commit('changeFrom', false)
          console.log('没有排序的数据========>', data.result);
          let scoreColor;
          // 默认是依据之前的数据类型，如果是升序就是升序，如果是降序就是降序，如果是没有排序就是没用排序
          // true为升序，false为降序
          // if (vall) {
            if (vall) {
              this.$FT.clearArr(this.selfShares.fixedTB);
              data.result.sort(this.$FT.compare('score', true))
              console.log('true=====》', data.result);
            } else {
              this.$FT.clearArr(this.selfShares.fixedTB);
              data.result.sort(this.$FT.compare('score', false))
              console.log('false=====》', data.result);
            }

          // }
          this.saveSortData(data.result)
          data.result.forEach(item => {
            if (Number(item.score) > 60) {
              scoreColor = '#F43D3E';
            } else {
              scoreColor = '#24B842';
            }
            that.selfShares.fixedTB.push({
              nameCode: {
                val: item.stockName,
                val2: item.stockCode,
                type: 'normal',
                // icon:'创',
                market: Number(item.market),
                val2Color: '#999999',
              },
              totalScore: {
                // item.score
                val: item.score + '分',
                type: 'normal',
                fontColor: scoreColor,
              },
              totalCheckItems: {
                val: item.totalCount,
                type: 'normal',
              },
              safetyItems: {
                val: item.safeCount,
                type: 'normal',
              },
              riskItems: {
                val: item.riskCount,
                type: 'normal',
                fontColor: '#24B842',
              },
            })

          });
          console.log('that.selfShares.fixedTB', that.selfShares.fixedTB);
          uni.setStorage({
            key: 'stockDate',
            data: that.selfShares.fixedTB
          })
        }
      })
    },
    // 获取自选排雷列表
    getShareList (vall) {
      console.log(vall);
      let params = {
        userId: this.userInfo.user_id,
        queryType: "1"
      }
      const that = this;
      console.log('自选-入参', params);
      console.log('自选-url', that.Config.slbStock);
      uni.request({
        url: that.Config.slbStock,
        method: 'post',
        dataType: 'jsonp',
        data: params,
        success: (res) => {
          const data = JSON.parse(res.data);
          console.log('自选-data', data.result.groups);
          const result = data.result;
          // let scoreColor;
          result.groups.forEach(item => {
            this.groupsId = item.groupId
            this.$store.commit('getGroupId', item.groupId);
          })

          console.log(this.groupsId);
          result.groups.forEach(function (item, i, array) {
            let arr = []
            item.codes.map(item1 => {
              arr.push(Object.assign({}, item1, {
                "stockCode": item1.code,
                "stockName": item1.name,
                "channel": item1.channel,
                "selfDate": item1.selfDate,
                "codeType": 1,
                "market": item1.market
              }))
            })
            let dd = { "stockCodes": arr, "userId": that.userInfo.user_id }
            that.getOtherDate(dd, vall)

            // 	  console.log('自选-item, i, array', item, i, array);
            // 	  if (Number(item.score) > 60) {
            // 	    scoreColor = '#F43D3E';
            // 	  } else {
            // 	    scoreColor = '#24B842';
            // 	  }
            // 	  that.selfShares.fixedTB.push({
            // 	    nameCode: {
            // 	      val: item.name,
            // 	      val2: item.code,
            // 	      type: 'normal',
            // 	      // icon:'创',
            // 	      market: Number(item.market),
            // 	      val2Color: '#999999',
            // 	    },
            // 	    totalScore: {
            // 	  	  // item.score
            // 	      val: 100 + '分',
            // 	      type: 'normal',
            // 	      fontColor: scoreColor,
            // 	    },
            // 	    totalCheckItems: {
            // 	      val: item.totalCount,
            // 	      type: 'normal',
            // 	    },
            // 	    safetyItems: {
            // 	      val: item.safeCount,
            // 	      type: 'normal',
            // 	    },
            // 	    riskItems: {
            // 	      val: item.riskCount,
            // 	      type: 'normal',
            // 	      fontColor: '#24B842',
            // 	    },
            //   })

            // });
          });
        },
        fail: (res) => {
          console.log('红黑榜-fail', res);
        },
        complete: () => { },
      });
    },
    //点击跳转
    btnClick () {
      uni.navigateTo({
        url: '/findTools/saoLeiBao/scanresult',
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
    marketScanner () {
      const that = this;
      let params = {
        userId: that.userInfo.user_id,
      };
      console.info('marketScanner--- that.Config.marketScanne-', that.Config.marketScanner);

      uni.request({
        method: 'GET',
        data: params,
        url: that.Config.marketScanner,
        success: function (data, status) {
          console.info('marketScanner---success----data---', data, status);
          let result = data.data.result;
          that.stockShow = result;

          if (data.statusCode == 200) {
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
              that.$store.commit('updateBLBstopAdd', true);
              console.log('获取id=====', that.$store.state.groupId);
              // uni.redirectTo({
              // 	url: '/findTools/saoLeiBao/index?productId='+ that.productId + "&item_id=" + that.itemId,
              // })
            }, 500);
          } else {
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
              that.$store.commit('updateBLBstopAdd', true);
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
            that.$store.commit('updateBLBstopAdd', true);
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

<style lang="scss">
@import "@/styles/findPage/saoLeiBao.scss";
@import "@/styles/home/pushModal.scss";
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
}
::v-deep .u-subsection--button {
  background-color: #eeeeef !important;
  .u-subsection--button__bar {
    background-color: #ffffff !important;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #ffffff !important;
      border-radius: 6rpx !important;
    }
  }
}
.scanprogress {
  position: fixed;
  opacity: 1;
  z-index: 9999999999999999999999;
}
.noGuide {
  /deep/ .scanprogress {
    display: none;
    // opacity: 0;
    // animation: mymove 2s 1;
  }
}
@-webkit-keyframes mymove {
  /* Safari and Chrome */
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    display: none;
  }
}
</style>

<template>
  <view class="content-view">
    <view class="top-view" style="position: relative;">
      <image :src="scantop" mode="scaleToFill" style="position: absolute;width: 750rpx;height:485rpx;"></image>
      <image class="button_intro" @click="toIntroduce" :src="button_intro"></image>
      <view class="loading-view" style="z-index: 995;">
        <hx-lottie ref="lottieWeb" :options="options">
        </hx-lottie>

        <view class="info-view" style="z-index: 998;">
          <view class="grade-title"> {{ score }}</view>
          <view class="grade-text">{{ '股票得分' }}</view>
        </view>
      </view>
      <view class="gradeinfo-view" style="">
        <view class="menus-view">
          <view class="menu-view">
            <view class="menu-grade">{{ totalCount }}</view>
            <view class="menu-grade-info">
              <image src="https://qnsp.zcskjy.com/zc_images/checkIcon.png" mode="aspectFit" style="width: 25rpx;height: 25rpx;"></image>
              <view class="menu-title">{{ '总检查项' }}</view>
            </view>
          </view>
          <view class="menu-view">
            <view class="menu-grade">{{ riskCount }}</view>
            <view class="menu-grade-info">
              <image src="https://qnsp.zcskjy.com/zc_images/riskIcon.png" mode="aspectFit" style="width: 25rpx;height: 25rpx;"></image>
              <view class="menu-title">{{ '风险项' }}</view>
            </view>
          </view>
          <view class="menu-view">
            <view class="menu-grade">{{ safeCount }}</view>
            <view class="menu-grade-info">
              <image src="https://qnsp.zcskjy.com/zc_images/safeIcon.png" mode="aspectFit" style="width: 25rpx;height: 25rpx;"></image>
              <view class="menu-title">{{ '安全项' }}</view>
            </view>
          </view>
        </view>
      </view>
      <u-button class="addSelfStock" @click="addSelf">
        <view v-if="status">
          -
        </view>
        <u-icon v-if="!status" class="delect" width="16rpx" height="16rpx" space="12rpx" name="https://qnsp.zcskjy.com/zc_images/findTools/plus.png"></u-icon>
        <text style="margin-left: 15rpx;">{{stockText}}</text>
      </u-button>
    </view>

    <view class="center-view" style="">

      <view class="flex-col-title" v-for="(item,index) in positionlist" :key="item.id">
        <!-- :style="checkChapterId === item.id ? 'padding-bottom: 20rpx ':'padding-bottom: 40rpx'"  -->
        <view class="flex-col-content" style="" @click="checkChapterId = (checkChapterId === item.id ? '' : item.id)">
          <view class="flex-col-left" style="">
            <u-icon labelSize="20rpx" size="40rpx" style="padding-right: 19rpx;" :name="'https://qnsp.zcskjy.com/zc_images/'+ iconArr[index]+ '.png'">
            </u-icon>
            <view class="col-content-title">{{item.name}}</view>
            <u-icon labelSize="20rpx" size="40rpx" style="padding-left: 9rpx;" :name="item.risk == true ? 'https://qnsp.zcskjy.com/zc_images/riskImg.png':
									'https://qnsp.zcskjy.com/zc_images/safeImg.png'">
            </u-icon>
          </view>
          <view class="flex-col-right">
            <!-- :style="item.riskCount == 0 ? 'color':'#333333':'color':'#F43D3E'" -->
            <text style="font-size:28rpx;height:40rpx;line-height:40rpx;" :style="item.riskCount == 0 ? 'color:#333333' : 'color:#F43D3E'">{{ item.riskCount + '项'}}</text>
            <view v-show="checkChapterId === item.id" class="iconfont icon-jiantoushang" style="padding: 8rpx 17rpx;font-size: x-small"></view>
            <view v-show="checkChapterId !== item.id" class="iconfont icon-jiantouxia" style="padding: 8rpx 17rpx;font-size: x-small"></view>
          </view>
        </view>

        <view class="content-list-items" v-if="item.second.length > 0">

          <view class="content-list-item" v-for="item2 in item.second" :key="item2.id" v-show="checkChapterId === item2.pid">

            <view class="" v-if="item2.thread.length > 0 ">

              <view class="flex-col-content" style="padding: 10rpx 0rpx;" @click="checkTwoChapterId = (checkTwoChapterId === item2.id? '':item2.id)">
                <view class="flex-col-left" style="">
                  <view class="content-list-name" :style="item2.risk == false? 'color:#333333':'color:#F43D3E'">{{item2.name}} </view>
                  <view v-show="checkTwoChapterId === item2.id" class="iconfont icon-jiantoushang" style="padding: 0rpx 15rpx;font-size: x-small"></view>
                  <view v-show="checkTwoChapterId !== item2.id" class="iconfont icon-jiantouxia" style="padding: 0rpx 15rpx;font-size: x-small">
                  </view>
                </view>
                <view class="flex-col-right">
                  <u-icon labelSize="20rpx" size="28rpx" style="padding-right: 10rpx;" :name="item2.risk == false? 
									'https://qnsp.zcskjy.com/zc_images/images/greenicon.png':
											'https://qnsp.zcskjy.com/zc_images/images/redicon.png'">
                  </u-icon>
                </view>
              </view>
              <view class="content-list-item" v-for="(item3, index3) in item2.thread" :key="item3.id" v-show="checkTwoChapterId === item3.pid">
                <view class="checked-item" style="padding-left:40rpx;" @click="dialogBtnClick(item3)">
                  <text class="content-list-name" :style="item3.risk == false? 'color:#333333':'color:#F43D3E'">{{item3.name}}</text>
                  <view class="check-item-click">
                    <u-icon labelSize="20rpx" size="28rpx" style="padding-right: 10rpx;" :name="item3.risk == false? 
										'https://qnsp.zcskjy.com/zc_images/images/greenicon2.png':
												'https://qnsp.zcskjy.com/zc_images/images/redicon2.png'">
                    </u-icon>
                  </view>
                </view>
              </view>
            </view>

            <view class="" v-else>
              <view class="checked-item" @click="dialogBtnClick(item2)">
                <text class="content-list-name" :style="item2.risk == false? 'color:#333333':'color:#F43D3E'">{{item2.name}}</text>
                <view class="check-item-click">
                  <u-icon labelSize="20rpx" size="28rpx" style="padding-right: 10rpx;" :name="item2.risk == false ?
									 'https://qnsp.zcskjy.com/zc_images/images/greenicon2.png':
												'https://qnsp.zcskjy.com/zc_images/images/redicon2.png'">
                  </u-icon>
                </view>

              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <image class="goEdu" :src="goEdu" @click="goEduFN" mode="widthFix"></image>

    <aexplan-view class="disclaimers"></aexplan-view>

    <view class="dialog-bg" v-show="showDialog">
      <view class="dialog-view" style="">
        <view class="dialog-title" :class="{'red-color': dialogRisk }">{{ dialogTitle }}</view>
        <scroll-view scroll-y="true" class="dialog-scrollview" v-if="dialogDesc" show-scrollbar>
          <rich-text class="dialog-warnDes" :class="{'red-color': dialogRisk }" v-html="dialogDesc"></rich-text>
          <!-- <text class="dialog-warnDes" :class="{'red-color': dialogRisk }" >{{ dialogDesc }}</text> -->
        </scroll-view>
        <scroll-view scroll-y="true" class="dialog-scrollview" style="max-height: 450rpx;padding:20rpx 25rpx 30rpx;">
          <text class="dialog-remark1">{{ dialogRemark }}</text>
        </scroll-view>
        <view class="dialog-btn" @click="dialogBtnClick()">{{'我知道了'}}</view>
      </view>
    </view>

  </view>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex';

export default {
  data () {
    return {
      newDate: '',
      env: '',
      choose: [],
      status: false,
      stockText: '添加自选',
      arr: [],
      newSharesTitle: '新股详情',
      backgroundObj: {
        backgroundImage: 'url(/static/zeroPurchase/titleBg.png)',
        backgroundSize: '100% 100%',
        opacity: 1,
      },
      //弹窗是否展示隐藏
      showDialog: false,
      dialogTitle: '',
      dialogDesc: '',
      dialogRemark: '',
      dialogRisk: false,

      statusBarHeight: 0,
      navBarHeight: 0,
      scantop: `${getApp().globalData.qnUrl}/zc_images/findTools/scantop.png?t=123123`,
      button_intro: `${getApp().globalData.qnUrl}/zc_images/findTools/button_intro.png`,
      // leftIconColor: '#ffffff',
      leftIconColor: '#303133',
      PageNav: {
        window: {
          navigationBarBackgroundColor: '#f511ff',
          navigationBarTextStyle: 'black',
          navigationBarTitleText: '111',
          backgroundColor: '#f8f8f8',
          backgroundTextStyle: 'dark',
        },
      },

      checkChapterId: '', // 当前展开的目录
      checkTwoChapterId: '', // 当前展开的二级列表的目录
      goEdu: `${getApp().globalData.qnUrl}/zc_images/findTools/go_edu.png` + this.$FT.versionKey(),
      iconArr: ['moneyicon', 'markeicon', 'sealicon', 'blb_xyjf', 'tuishiicon', 'sealicon', 'tuishiicon'],
      productId: '27',// 寻找好公司
      itemId: '27',
      // positionlist: Array,
    }
  },
  props: {
    stockName: {
      type: String,
      default: '',
    },
    market: {
      type: String,
      default: '',
    },
    stockCode: {
      type: String,
      default: '',
    },
    score: {
      type: [Number, String],
      default: '',
    },
    riskCount: {
      type: [Number, String],
      default: '',
    },
    safeCount: {
      type: [Number, String],
      default: '',
    },
    totalCount: {
      type: [Number, String],
      default: '',
    },
    positionlist: {
      type: Array,
      default () {
        return [];
      },
    },
    courseConfig: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum', 'groupId']),
    options () {
      return {
        // path: this.list[this.curr].path,
        path: 'https://qnsp.zcskjy.com/zc_images/json/sweep.json',
      }
    }
  },
  watch: {
    courseConfig: {
      handler (newName, oldName) {
        this.courseConfig = newName;
        if (!this.$FT.isNull(newName.imgUrl)) {
          this.goEdu = newName.imgUrl + this.$FT.versionKey();
        }

        if (!this.$FT.isNull(newName.product_id)) {
          this.productId = newName.product_id;
        }
        if (!this.$FT.isNull(newName.item_id)) {
          this.itemId = newName.item_id;
        }
        console.log("courseConfig-newName.imgUrl", newName, newName.imgUrl)
      },
      deep: true,
      immediate: true,
    },
  },
  onLoad: function (option) {
    console.log('ff=====', option);

    this.init();
    console.log('market======>', this.market);
  },
  created () {
    this.getSelfStocks()
  },
  methods: {
    getSelfStocks () {
      let params = {
        userId: this.userInfo.user_id,
        queryType: "1"
      }
      // 重置
      this.arr = [];
      uni.request({
        url: this.Config.slbStock,
        method: 'post',
        dataType: 'jsonp',
        data: params,
        success: (res) => {
          const data = JSON.parse(res.data);
          console.log('数据', data.result.groups);
          data.result.groups.forEach(item => {
            item.codes.forEach(i => {
              this.arr.push(i.name)
            })
          })
          console.log('000000this.arr', this.arr);
          this.status = this.arr.includes(this.stockName)
          console.log('000000=====》', this.status);
          if (this.status === true) {
            this.stockText = '删除自选'
          } else {
            this.stockText = '添加自选'
          }
          console.log('arr', this.arr);

        },
        fail: (res) => {
          console.log('红黑榜-fail', res);
        },
        complete: () => { },
      });
    },
    getEnv () {
      let port = uni.getSystemInfoSync().platform;
      switch (port) {
        case 'android':
          this.env = 4
          break;
        case 'ios':
          this.env = 3
          break;
        default:
          this.env = 2
          break;
      }
    },
    getNowTime () {
      let d = new Date()
      let y = d.getFullYear()
      let m = d.getMonth() + 1
      let dd = d.getDate()
      console.log(y, m, dd);
      this.newDate = y + '-' + m + '-' + dd
      console.log(this.newDate);
    },
    // 添加
    createStock () {
      this.choose = []
      // 判断环境
      this.getEnv();
      // 获取时间
      this.getNowTime();
      this.choose.push(Object.assign({}, {
        "code": this.stockCode,
        "name": this.stockName,
        "channel": this.env,
        "selfDate": this.newDate,
        "codeType": 1,
        "market": this.market
      }))
      console.log(this.choose);
      let params = {
        "groups": [
          {
            "groupId": this.groupId,
            "codes": this.choose
          }
        ],
        "userId": this.userInfo.user_id
      }
      console.log('params=======>', JSON.stringify(params))
      uni.request({
        url: this.Config.createStock,
        method: 'POST',
        data: params,
        success: (res) => {
          if (res.data.code == '0') {
            uni.showToast({
              title: '已添加自选',
              icon: 'none',
              duration: 2000
            });
            this.getSelfStocks();
          }
          this.$emit('changeStatus',this.status)
        }
      })
    },
    // 删除
    deleteStock () {
      this.choose = []
      // 判断环境
      this.getEnv();
      // 获取时间
      this.getNowTime();
      this.choose.push(Object.assign({}, {
        "code": this.stockCode,
        "market": this.market,
      }))
      console.log(this.choose);
      let params = {
        "groups": [
          {
            "groupId": this.groupId,
            "codes": this.choose
          }
        ],
        "userId": this.userInfo.user_id
      }
      console.log('删除params=======>', JSON.stringify(params))
      uni.request({
        url: this.Config.deleteStock,
        method: 'POST',
        data: params,
        success: (res) => {
          console.log(res.data.code);
          if (res.data.code == '0') {
            uni.showToast({
              title: '已删除自选',
              icon: 'none',
              duration: 2000
            });
            this.getSelfStocks();
          }
          this.$emit('changeStatus',this.status)
        },
      })
    },
    // 添加自选股
    addSelf () {
      if (this.status) {
        // 删除
        this.deleteStock()
      } else {
        // 添加
        this.createStock()
      }

    },
    init () {

      this.newSharesTitle = this.stockName;
      //设置标题
      uni.setNavigationBarTitle({
        title: this.stockName + '(' + this.stockCode + ')'
      });
    },
    toIntroduce () {
      uni.navigateTo({
        url: `/findTools/saoLeiBao/lightningProtectionDescription`,
      });
    },
    dialogBtnClick (item) {
      var that = this;
      console.log('--item---', item);
      that.showDialog = !that.showDialog;
      if (item) {
        that.dialogTitle = item.name;
        let content = item.desc;
        if (content) {
          content = content.replace(/\\n/g, '<br/>');
          content = content.replace(/\n/g, '<br/>');
          that.dialogDesc = content;
        }
        that.dialogRemark = item.remark;
        that.dialogRisk = item.risk;
      } else {
        that.dialogTitle = '';
        that.dialogDesc = '';
        that.dialogRemark = ''
        that.dialogRisk = '';
      }
      // console.info('--this.dialogDesc--',this.dialogDesc);
      // this.$emit('dialogBtnClick')

    },

    goEduFN () {
      let that = this;
      uni.navigateTo({
        url: '/edu/course/class-detail?product_id=' + that.productId + '&item_id=' + that.itemId,
      });

    },
    navBack (e) {
      //  #ifdef  APP-PLUS
      uni.navigateBack();
      //  #endif
      //  #ifdef  H5
      uni.navigateBack();
      //  #endif
    },

  }
}
</script>

<style lang="scss" scoped>
@import "@/components/audio/font/iconfont.css";
.addSelfStock {
  position: absolute;
  bottom: -31rpx;
  width: 208rpx;
  height: 62rpx;
  line-height: 62rpx;
  background: linear-gradient(90deg, #1d51d2 0%, #6d81f3 100%);
  border-radius: 31rpx;
  font-size: 28rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #ffffff;
  border: 0;
}
.content-view {
  text-align: center;
  .dialog-bg {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999 !important;

    .dialog-view {
      background-color: #ffffff;
      padding: 30rpx 20rpx 8rpx;
      border-radius: 20rpx;
      width: 560rpx;
      position: fixed;
      top: 50%;
      left: 50%;
      // bottom: 0;
      // right: 0;
      color: #333333;
      transform: translate(-50%, -50%);

      .red-color {
        color: #f43d3e;
      }

      .dialog-title {
        height: 44rpx;
        line-height: 44rpx;
        font-size: 32rpx;
        font-weight: 500;
        font-family: PingFangSC-Medium, PingFang SC;
      }

      .scrollview {
        width: 500rpx;
        height: 200rpx;
        line-height: 40rpx;
        font-size: 26rpx;
        font-weight: 500;
        font-family: PingFangSC-Medium, PingFang SC;
        max-height: 300rpx;
        overflow: hidden;
      }

      .dialog-scrollview {
        width: 500rpx;
        padding: 40rpx 25rpx 20rpx;
        height: auto;
        // height: 200rpx;
        line-height: 40rpx;
        font-size: 26rpx;
        font-weight: 500;
        font-family: PingFangSC-Medium, PingFang SC;
        text-align: left;
        max-height: 300rpx;
        overflow: hidden;

        .dialog-warnDes {
          line-height: 40rpx;
          font-size: 26rpx;
          font-weight: 500;
          font-family: PingFangSC-Medium, PingFang SC;
          text-align: left;
        }

        .dialog-remark1 {
          line-height: 40rpx;
          color: #999999;
          font-size: 24rpx;
          font-weight: 400;
          font-family: PingFangSC-Regular, PingFang SC;
          text-align: left;
        }
      }
      .uni-scroll-view-content {
        text-align: left;
      }
      .dialog-des {
        padding: 40rpx 25rpx 20rpx;
        height: auto;
        line-height: 40rpx;
        font-size: 26rpx;
        font-weight: 500;
        font-family: PingFangSC-Medium, PingFang SC;
        max-height: 300rpx;
        overflow: hidden;
      }

      .dialog-remark {
        padding: 10rpx 25rpx 60rpx;
        height: auto;
        line-height: 40rpx;
        color: #999999;
        font-size: 24rpx;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
        max-height: 450rpx;
        overflow: hidden;
      }

      .dialog-btn {
        height: 84rpx;
        // border-top: #CCCCCC  1rpx solid;
        line-height: 84rpx;
        font-size: 32rpx;
        font-weight: 500;
        font-family: PingFangSC-Medium, PingFang SC;
        position: relative;
        overflow: hidden;
        &:before {
          content: "";
          position: absolute;
          top: 0;
          left: -50%;
          width: 200%;
          height: 1rpx;
          border-top: #cccccc 1rpx solid;
          transform: scale(0.5);
        }
      }
    }
  }

  .btnView {
    // padding: 40rpx 20rpx;
    background-color: #f03055;
    position: absolute;
    // top: calc(94rpx + var(--status-bar-height));
    // top: 50%;
    left: 50%;
    margin-top: -50rpx;
    margin-left: -60rpx;
    width: 150rpx;
    height: 80rpx;
  }

  .center-view {
    padding: 30rpx;
    margin-top: 30rpx;
    height: auto;
    line-height: 40rpx;
    color: #333333;
    font-size: 28rpx;
    font-weight: 500;
    font-family: PingFangSC-Medium, PingFang SC;

    .flex-col-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .flex-col-left {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }

      .flex-col-right {
        display: flex;
        flex-direction: row;
        // flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: center;
      }
    }

    .flex-col-title {
      // clear: both;
      //line-height: 80rpx;

      padding: 40rpx 20rpx;
      background-color: #ffffff;
      box-shadow: 0rpx 7rpx 12rpx 5rpx #e5e5e5;
      margin-bottom: 30rpx;
      border-radius: 10rpx;

      .content-list-item {
        .checked-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 10rpx 0;
          height: 40rpx;
          line-height: 40rpx;
          // background-color: #32B5FF;
          // margin-bottom:5rpx;

          .check-item-click {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            width: 100rpx;
            height: 40rpx;
            // text-align: right;
          }
        }

        .content-list-name {
          height: 40rpx;
          line-height: 40rpx;
          color: #333333;
          font-weight: 400;
          font-family: PingFangSC-Regular, PingFang SC;
        }
      }

      .col-content-title {
        font-weight: 500;
        float: left;
        font-family: PingFangSC-Medium, PingFang SC;
      }

      .col-content-name {
        float: left;
        margin-left: 20upx;
      }
    }
  }

  .top-view {
    // margin-top: calc(var(--status-bar-height));
    width: 750rpx;
    height: 485rpx;
    background: #001032;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: relative;

    .gradeinfo-view {
      position: absolute;
      left: 30rpx;
      bottom: 36rpx;
      width: 690rpx;
      height: 250rpx;
      border-radius: 10rpx;
      border-width: 1rpx;
      border-color: #2f5fc5;
      z-index: 99;
      background-color: rgba(0, 87, 135, 0.2);
      // background-color: #005787;
      // opacity: 0.2;

      .menus-view {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        // padding-bottom: 10rpx;
        position: absolute;
        bottom: 10rpx;
        left: 0;
        width: 100%;

        .menu-view {
          width: 130rpx;
          // background-color: #2F5FC5;
          text-align: center;

          .menu-grade {
            margin-bottom: 5rpx;
            height: 48rpx;
            line-height: 48rpx;
            color: #ffffff;
            font-size: 40rpx;
            font-weight: 600;
            font-family: PingFangSC-Bold, PingFang SC;
          }

          .menu-grade-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            .menu-title {
              padding-left: 10rpx;
              height: 48rpx;
              line-height: 48rpx;
              color: #ffffff;
              font-size: 24rpx;
              font-weight: 400;
              font-family: PingFangSC-Regular, PingFang SC;
            }
          }
        }
      }
    }

    .loading-view {
      width: 450rpx;
      height: 450rpx;
      margin-top: -20rpx;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      // background-color: #32B5FF;

      .info-view {
        position: absolute;
        // top: calc(94rpx + var(--status-bar-height));
        top: 50%;
        left: 50%;
        margin-top: -93rpx;
        margin-left: -93rpx;
        width: 180rpx;
        height: 180rpx;
        background-color: #ffffff;
        border-radius: 50%;
        border: 3rpx solid #32b5ff;
        // border-width: 5rpx;
        // border-color: #32B5FF;
        color: #666666;
        // display: flex;
        // flex-direction: column;
        // align-items: center;
        // justify-content: flex-start;
        text-align: center;
        font-weight: 600;
        font-family: PingFangSC-Medium, PingFang SC;
        .grade-title {
          margin-top: 16rpx;
          height: 78rpx;
          // line-height: 78rpx;
          color: #333333;
          font-size: 55rpx;
        }
        .grade-text {
          font-size: 24rpx;
          letter-spacing: 2rpx;
          padding-left: 9ssrpx;
        }
        .grade-des-title {
          height: 33rpx;
          line-height: 33rpx;
          color: #666666;
          font-size: 24rpx;
          font-weight: 400;
          font-family: PingFangSC-Medium, PingFang SC;
        }
      }
    }
  }
}
.button_intro {
  width: 187rpx;
  height: 48rpx;
  position: absolute;
  right: 25rpx;
  top: 25rpx;
}
.disclaimers {
  text-align: left;
}
.goEdu {
  width: 714rpx;
  height: auto;
  display: inline-block;
  margin: 0 auto;
}
</style>

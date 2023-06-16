<template>
  <view class="withdrawal">
    <view class="withdrawal-content">
      <view class="withdrawal-content-child">
        <view class="withdrawal-content-child-title">提现金额</view>
        <view class="withdrawal-content-child-input">
          <view class="unit-amount">¥</view>
          <uinput type="digit" :placeholder="placeholderText" border="none" v-model="withdrawalAmount" @change="amountchange" autocomplete="off"></uinput>

          <view class="allWithdrawal" @click="allWithdrawal">全部提现</view>
        </view>
      </view>
      <view class="withdrawal-content-child withdrawal-bankCard">
        <view class="withdrawal-content-child-title">到账账户</view>
        <uActionSheet
          class="bank-action"
          :clickItem="clickItem"
          @clickItemEvent="bindNewCard"
          :actions="bankCardList"
          @select="selectClick"
          @close="close"
          :title="title"
          :show="showBankList"
        ></uActionSheet>
        <view v-if="isOpenSheetList" @click="openSheet()">
          <u-cell-group>
            <u-cell v-for="(item, index) in openSheetList" :key="index" :label="item.subname" :title="item.name" isLink>
              <!-- <image slot="icon" class="icon-brank" :src="item.iconUrl" mode="widthFix"></image> -->
            </u-cell>
          </u-cell-group>
        </view>
        <view v-if="!isOpenSheetList" @click="bindNewCard()">
          <u-cell-group>
            <u-cell v-for="(item, index) in clickItem" :key="index" :label="item.subname" :title="item.name" isLink>
              <image slot="icon" class="icon-brank" :src="item.iconUrl" mode="widthFix"></image>
            </u-cell>
          </u-cell-group>
        </view>
        <view @click="openPopuPassword" :class="{ disableButton: isWithdrawal }" class="withdrawal-button">申请提现</view>
      </view>
      <view class="withdrawalRule">
        <view class="withdrawalRule-title">提现规则</view>
        <view class="withdrawalRule-text">每月10日可以申请提现，最低提现额度为100元。提现金额需要确认已购买且已在学习中，才可以申请提现。</view>
      </view>
    </view>
    <u-popup
      :safeAreaInsetBottom="true"
      :safeAreaInsetTop="true"
      :closeOnClickOverlay="false"
      :mode="popupData.mode"
      :show="showPopuPassword"
      :round="popupData.round"
      :overlay="popupData.overlay"
      :borderRadius="popupData.borderRadius"
      :closeable="popupData.closeable"
      @close="closePopuPassword"
      @open="openPopuPassword"
    >
      <view
        class="u-popup-slot"
        :style="{
          width: ['bottom', 'top'].includes(popupData.mode) ? '750rpx' : '200px',
          marginTop: ['left', 'right'].includes(popupData.mode) ? '480rpx' : '0',
        }"
      >
        <view class="u-demo-block">
          <view class="u-demo-block__title">
            <view>支付密码验证</view>
            <view class="u-demo-sure" @click="submitdata">确定</view>
          </view>

          <view class="u-demo-block__content">
            <view class="inputPassWord-content">
              <u--input value="" border="none" autocomplete="off" style="display: none" password clearable v-model.trim="password"></u--input>
              <u--input value="" border="none" autocomplete="off" @input="passWordChange" password clearable v-model.trim="password"></u--input>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import uinput from '@/uni_modules/uview-ui/components/u--input/u--input.vue';
import uActionSheet from '@/uni_modules/uview-ui/components/u-action-sheet/u-bank-action.vue';
import { mapState, mapMutations } from 'vuex';
export default {
  components: {
    uinput,
    uActionSheet,
  },
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
    scrollH: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      return winHeight;
    },
  },
  data() {
    return {
      withdrawalAmount: '',
      placeholderText: '可转出金额0',
      userMoney: '0',
      title: '选择到款账户',
      showBankList: false,
      isWithdrawal: false,
      isOpenSheetList: true,
      openSheetList: [
        {
          // name: '北京银行（尾号0330）',
          // subname: '人工审核后到账',
          // iconUrl: '',
        },
      ],
      openSheetName: '',
      openSheetSubname: '人工审核通过后2天内到账',
      clickItem: [
        {
          name: '添加提现账户',
          subname: '',
          iconUrl: `${getApp().globalData.qnUrl}/zc_images/home/icon-card.png`,
        },
      ],
      bankCardList: [
        // {
        //   name: '北京银行（尾号0330)',
        //   subname: '人工审核通过后2天内到账',
        //   image:`../../static/home/icon-BOB.png`,
        // },
        // {
        //   name: '中国银行（尾号5330)',
        //   subname: '人工审核通过后2天内到账',
        //   image:`../../static/home/icon-PBC.png`,
        // },
        // {
        //   name: '招商银行（尾号5330)',
        //   subname: '人工审核通过后2天内到账',
        //   image:`../../static/home/icon-CMB.png`,
        // },
      ],
      showPopuPassword: false,
      popupData: {
        overlay: true,
        mode: 'bottom',
        closeable: true,
        closeOnClickOverlay: false,
        closeOnClickAction: false,
      },
      CashType: 0, //现金类型
      Price: 0,
      BankAccount: '',
      BankName: '',
      password: '',
      isPrice: !0,
      isbankAccount: !0,
      isbankName: !0,
      passwordTimer: null,
    };
  },
  onLoad() {
    this.init();
  },
  onUnload() {
    if (this.passwordTimer) {
      //注销定时器
      console.log('注销定时器');
      clearTimeout(this.passwordTimer);
      this.passwordTimer = null;
    }
  },
  methods: {
    async init() {
      this.clearArr(this.openSheetList);
      this.clearArr(this.bankCardList);
      // 银行卡列表
      await this.userBank();
      await this.asset();
      // await this.consumeWithdraw();
    },
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    clearArr(arr) {
      arr.length = 0;
      arr.splice(0, 0);
    },
    passWordChange(e) {
      console.log('passWordChange', e);
    },
    allWithdrawal() {
      this.withdrawalAmount = this.userMoney;
    },
    // 获取可提现余额
    async payAsset() {
      const that = this;
      uni.request({
        url: that.Config.URL.pay.asset,
        // method: 'get',
        // data: data,
        dataType: 'json',
        success: (res) => {
          console.log('获取可提现余额-res', res);
          const data = res.data.data;
          if (res.statusCode == 200 && res.data.code == 0) {
            uni.stopPullDownRefresh();
            data?.items.forEach(function (item, i, array) {
              console.log('获取可提现余额-forEach', item, i, array);
              // that.placeholderText = '可转出金额' + 84270.02;
            });
          } else {
            console.log('asse-异常-res', res.data.msg);
            let params = {
              type: 'default',
              title: '默认主题',
              message: res.data.msg,
              iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/default.png',
            };
            that.showToast(params);
          }
        },
        fail: () => {},
        complete: () => {
          // this.contentScroll();
        },
      });
    },
    //  todo 佣金提现
    consumeWithdraw() {
      const that = this;
      this.CashType == 0
        ? that.$.isNull(this.withdrawalAmount)
          ? this.setData({
              isPrice: !1,
            })
          : parseInt(this.withdrawalAmount) < 100 || this.withdrawalAmount % 100 > 0
          ? (this.setData({
              isPrice: !1,
            }),
            that.$.alert(that.__('亲~提现金额必须是100的整数倍才能提现哟！')))
          : this.setData({
              isPrice: !0,
            })
        : this.setData({
            isPrice: !0,
          }),
        this.BankAccount
          ? /^\d{15,20}$/.test(this.BankAccount)
            ? this.setData({
                isbankAccount: !0,
              })
            : this.setData({
                isbankAccount: !1,
              })
          : this.setData({
              isbankAccount: !0,
            }),
        this.BankAccount
          ? that.$.isNull(this.BankName)
            ? this.setData({
                isbankName: !1,
              })
            : this.setData({
                isbankName: !0,
              })
          : this.setData({
              isbankName: !0,
            });
      const params = {};
      if (this.isPrice && this.isbankAccount && this.isbankName) {
        params = {
          withdraw_amount: this.withdrawalAmount,
          // withdraw_mobile: this.UserPhone,
          withdraw_account_no: this.BankAccount,
          // withdraw_account_name: this.UserRealName,
          withdraw_bank: this.BankName,
          password: this.password,
        };
      }
      uni.request({
        url: this.Config.URL.pay.consume_withdraw_add,
        // method: 'get',
        data: params,
        dataType: 'json',
        success: (res) => {
          console.log('佣金提现-res', res);
          const data = res.data.data;
          if (res.statusCode == 200 && res.data.code == 0) {
            uni.stopPullDownRefresh();
            data?.items.forEach(function (item, i, array) {
              console.log('佣金提现-forEach', item, i, array);
            });
          } else {
            console.log('佣金提现-异常-res', res.data.msg);
            let params = {
              type: 'default',
              title: '默认主题',
              message: res.data.msg,
              iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/default.png',
            };
            that.showToast(params);
          }
        },
        fail: () => {},
        complete: () => {
          // this.contentScroll();
        },
      });
    },
    showToast(params) {
      this.$refs.uToast.show({
        ...params,
        complete() {
          params.url &&
            uni.navigateTo({
              url: params.url,
            });
        },
      });
    },
    remove(type) {
      console.log('remove', type);
      this.$refs[type].removeAttribute('readonly');
    },
    closePopuPassword(e) {
      this.showPopuPassword = false;
      console.log('closePopuPassword', this.showPopuPassword);
    },
    openPopuPassword(e) {
      console.log('提现-111', !this.isWithdrawal);
      const that = this;
      console.log('submitdata-withdrawalAmount:', this.withdrawalAmount, that.$.isNull(this.withdrawalAmount));
      console.log('submitdata-userMoney:', this.userMoney);
      that.showPopuPassword = false;
      if (this.withdrawalAmount > this.userMoney) {
        // let params = {
        //   type: 'default',
        //   title: '默认主题',
        //   message: '请输入密码',
        //   iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/default.png',
        // };
        // that.showToast(params);
        that.$.showModal('可提现余额不足！');
        return;
      } else if (that.$.isNull(this.withdrawalAmount) || parseInt(this.withdrawalAmount) == 0) {
        that.$.showModal('请输入有效的提现金额！');
        return;
      }
      if (!this.isWithdrawal) {
        this.showPopuPassword = true;

        this.passwordTimer = setTimeout(() => {
          // 业务逻辑
          that.password = '';
        }, 900);
      }
    },
    selectClick(data) {
      this.openSheetList[0].name = data.name;
      // this.openSheetName = data.name;
      console.log('selectClick:', data.name);
    },
    bindNewCard() {
      console.log('绑定新卡');
      uni.navigateTo({
        url: '/member/cash/bankcard-add?bank_id',
      });
    },
    close() {
      console.log('close');
      this.showBankList = false;
    },

    openSheet() {
      this.showBankList = true;
    },
    amountchange(value) {
      console.log('change', value);
      let that = this;
      this.withdrawalAmount = value;
      that.$.isNull(value) ? (that.isPrice = !1) : (that.isPrice = !0);
    },
    userBank: function () {
      // 银行卡列表
      var that = this;
      var params = {};
      that.$.request({
        url: this.Config.URL.pay.list_user_bank,
        data: params,
        success: function (data, status, msg, code) {
          if (data?.items.length > 0) {
            that.isOpenSheetList = true;
            that.setData({
              openSheetName: data.items[0].bank_name + '(' + data.items[0].user_bank_card_code + ')',
            });
            that.clearArr(that.openSheetList);
            that.clearArr(that.bankCardList);
            data?.items.forEach(function (item, i, array) {
              console.log('银行卡列表-forEach', item, i, array);
              if (i == 0) {
                that.openSheetList.push({
                  name: item.bank_name + '(' + item.user_bank_card_code + ')',
                  subname: '人工审核通过后2天内到账',
                  // iconUrl:`../../static/home/icon-BOB.png`,
                });
              }

              that.bankCardList.push({
                name: item.bank_name + '(' + item.user_bank_card_code + ')',
                subname: '人工审核通过后2天内到账',
                // iconUrl:`../../static/home/icon-BOB.png`,
              });
            });
            that.$forceUpdate();
          } else {
            that.isOpenSheetList = false;
          }
        },
      });
    },
    asset: function () {
      // 获取可提现余额
      const params = {},
        that = this;
      that.$.request({
        url: this.Config.URL.pay.asset,
        data: params,
        success: function (data, status, msg, code) {
          console.log('获取可提现余额-asset', data, status, msg, code);
          if (status == 200) {
            // TotalPrice: 0, // 佣金
            let user_money = data.user_money || 0;
            (that.placeholderText = '可转出金额' + user_money), //余额
              (that.userMoney = user_money);
          }
        },
      });
    },
    submitdata: function () {
      const that = this;
      if (that.$.isNull(this.password)) {
        that.$.showModal('请输入密码！');
        return;
      }
      // this.CashType == 0
      //   ? that.$.isNull(this.withdrawalAmount)
      //     ? this.setData({
      //         isPrice: !0,
      //       })
      //     : parseInt(this.withdrawalAmount) < this.userMoney || this.withdrawalAmount < 0
      //     ? (this.setData({
      //         isPrice: !0,
      //       }),
      //       that.$.alert(that.__('请输入有效的提现金额！')))
      //     : this.setData({
      //         isPrice: !0,
      //       })
      //   : this.setData({
      //       isPrice: !0,
      //     }),
      //   // this.BankAccount
      //   //   ? /^\d{15,20}$/.test(this.BankAccount)
      //   //     ? this.setData({
      //   //         isbankAccount: !0,
      //   //       })
      //   //     : this.setData({
      //   //         isbankAccount: !1,
      //   //       })
      //   //   : this.setData({
      //   //       isbankAccount: !0,
      //   //     }),
      //   this.BankAccount
      //     ? that.$.isNull(this.openSheetList[0].name)
      //       ? this.setData({
      //           isbankName: !1,
      //         })
      //       : this.setData({
      //           isbankName: !0,
      //         })
      //     : this.setData({
      //         isbankName: !0,
      //       });
      // const params = {};
      // console.log('submitdata-isPrice:', this.isPrice);
      // console.log('submitdata-isbankName:', this.isbankName);
      // if (this.isPrice && this.isbankName) {
      //   const params = {
      //     withdraw_amount: this.withdrawalAmount,
      //     // withdraw_mobile: this.UserPhone,
      //     withdraw_account_no: this.BankAccount,
      //     // withdraw_account_name: this.UserRealName,
      //     withdraw_bank: this.BankName,
      //     password: this.password,
      //   };
      //   console.log('submitdata-params-111:', params);
      // }
      const params = {
        withdraw_amount: this.withdrawalAmount,
        // withdraw_mobile: this.UserPhone,
        withdraw_account_no: this.BankAccount,
        // withdraw_account_name: this.UserRealName,
        withdraw_bank: this.BankName,
        password: this.password,
      };
      console.log('submitdata-params:', params);
      // todo 佣金提现
      that.$.request({
        url: this.Config.URL.pay.consume_withdraw_add,
        data: params,
        success: function (data, status, msg, code) {
          console.log('佣金提现-forEach', data, status, msg, code);
          if (200 == status) {
            // that.$.showModal(that.__('已申请提现！'));

            setTimeout(function () {
              // that.$.navigateBack(1, function () {});
              uni.navigateTo({
                url: '/home/withdrawal/withdrawalSucceeded',
                success(res) {
                  console.log('申请提现-成功啦', res);
                },
                fail(err) {
                  console.log('申请提现失败啦', err);
                },
              });
            }, 2e3);
          } else {
            console.log('佣金提现-else', data, status, msg, code);
            if (that.$.isNull(msg)) {
              that.$.showModal('提现失败，请稍后再试！');
            } else {
              that.$.showModal(msg);
            }
          }
        },
        fail: (err) => {
          //失败操作
          that.$.showModal('请求接口失败！');
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/withdrawal/withdrawal.scss';
::v-deep .u-action-sheet__item-wrap__item__text__content {
  align-items: flex-start;
}
</style>

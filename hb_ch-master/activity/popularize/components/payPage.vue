<template>
  <view>
	  <paymentMethod :showPay="showPay" @openPopup="openPopup" @payClick="payClick"></paymentMethod> 
</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import paymentMethod from '@/components/paymentMethod/index.vue';
export default {
  components: {paymentMethod},
  props: {
    showPay: {
      type: Boolean,
      default() {
        return false;
      },
    },
	cartId: {
      type: String,
      default() {
        return '58|1';
      },
    },
  },
  watch: {
  	showPay: {
  	  handler(newName, oldName) {
  	    this.showPay = newName;
  	    this.$forceUpdate();
  	  },
  	  deep: true,
  	  immediate: true,
  	},
  },
  data() {
    return {
		// showPay:false,
		      // cart_id: '57|1',
			  cart_id:this.cartId,
		      showPayBox: false,
		      is_paid: undefined,
		      orderSelMoneyAmount: 0,
		      voucher_use_row: {},
		      voucher_items: [],
		      order_id: '',
		      product_id: undefined,
		      paymentData: {
		        order_id: undefined,
		        orderSelMoneyAmount: undefined,
		        user_money: undefined,
		        user_points: undefined,
		        user_recharge_card: undefined,
		        user_sp: undefined,
		      },
		      // cart_id: '',
		      course: {},
		      chapter: {},
		      item_row: {},
		      product: {},
		      checkAgreement: false,
		      providerList: [
		        {
		          name: '支付宝',
		          id: 'alipay',
		          loading: false,
		        },
		        {
		          name: '微信',
		          id: 'wxpay',
		          loading: false,
		        },
		      ],
	};
  },
  onLoad() {},
  onUnload() {},
    computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
  methods: {
	...mapMutations(['reloadUserResource', 'getUserInfo']),
	  payClick(data){
		  console.log("payPage",data);
		  if(data == 'alipay'){
			  this.confirmPayment('alipay');
		  }else if(data == 'wxpay'){
			 this.confirmPayment('wxpay') ;
		  }
	  },
	  openPopup(state){
	  	console.log("state",state);
	    this.$emit('openPopup', state); 
	  	// this.showPay = state;
	  },
	  confirmPayment: function (type) {
	        let that = this;
	        let params = {
	          cart_id: that.cart_id,
	          ifcart: 0,
	          chain_id: 0,
	          payment_type_id: 1302,
	          delivery_time_id: 1,
	          invoice_type_id: 1,
	          is_edu: 1,
	        };
	        console.info('----submitOrder---click--', type);
	  
	        that.$.request({
	          url: that.Config.URL.edu.order_add,
	          data: params,
	          loading: false,
	          success: function (data, status, msg, code) {
	            console.info('----submitOrder---order_add--', data);
	            console.info('----submitOrder---order_add--', status);
	            if (200 === status) {
	              that.is_paid = data.is_paid;
	              let is_paid = data.is_paid;
	              if (is_paid) {
	                // 支付完成
	                that.order_id = data.order_id.join(',');
	                that.paymentData.orderSelMoneyAmount = data.orderSelMoneyAmount;
	                that.onPaid();

	                // return
	              } else {
	                if (data.order_id) {
	                  console.info('----submitOrder---data.order_id---', data.order_id);
	                  that.order_id = data.order_id;
	                  // #ifdef H5
	                  if (that.$.isWeixin()) {
	                    that.mpPay();
	                  } else {
	                    that.h5Pay(type);
	                  }
	                  // #endif
	                }
	              }
	            } else {
	              if (code === 77011) {
	                that.$.gotopage('/member/member/bindphone');
	              } else {
	                that.$.showToast({
	                  title: msg,
	                });
	              }
	            }
	          },
	          fail: function (data, status, msg, code) {
	            that.$.showToast({
	              title: msg,
	            });
	          },
	        });
	      },
	  
	      async h5OldPay(e) {
	        console.info('----submitOrder---', 'h5OldPay');
	        let that = this;
	        //console.log("发起支付");
	        // this.loading = true;
	  
	        //页面直接跳转支付模式
	        var id = uni.getStorageSync('uid');
	        var key = uni.getStorageSync('ukey');
	  
	        let appid = '';
	        let payment_channel_code = e;
	  
	        if (e == 'wxpay') {
	          payment_channel_code = 'wx_native';
	        }
	  
	        var pm_money = 0;
	        var pm_recharge_card = 0;
	        var pm_points = 0;
	        var pm_credit = 0;
	  
	        var password = this.password;
	        var pay_sn = this.order_id;
	  
	        if (this.userMoney) {
	          pm_money = this.paymentDataDefault.orderSelMoneyAmount;
	        }
	  
	        let params = {
	          perm_id: id,
	          perm_key: key,
	  
	          pay_sn: pay_sn,
	          password: password,
	          pm_recharge_card: pm_recharge_card,
	          pm_money: pm_money,
	          pm_points: pm_points,
	          pm_credit: pm_credit,
	          payment_channel_code: payment_channel_code,
	          mp_flag: 0,
	          old_mp_flag: 1,
	          appid: appid,
	          typ: 'e',
	        };
	  
	        // #ifdef H5
	  
	        // #endif
	  
	        let url = that.$.createUrl(that.cf.URL.pay.pay, params);
	  
	        // #ifdef APP-PLUS
	        that.$.gotopage('/pagesub/webpage/webpage?u=' + encodeURIComponent(url));
	  
	        // #endif
	  
	        // #ifdef H5
			that.openPopup(false);
	        that.$.showModal({
	          title: that.__('提示'),
	          content: that.__('是否支付完成？'),
	          success: (res) => {
	            if (res.confirm) {
	              let redirect_url = that.cf.SiteUrl + '/h5/edu/order/detail?on=' + that.order_id;
	  
	              if (that.kind == 'order') {
	              } else if (that.kind == 'favorable') {
	                redirect_url = that.cf.SiteUrl + '/h5/chain/chain/favorabledetail?order_id=' + that.order_id;
	              } else {
	              }
	  
	              window.location.href = redirect_url;
	            } else if (res.cancel) {
	              let redirect_url = that.cf.SiteUrl + '/h5/edu/order/detail?on=' + that.order_id;
	              if (that.kind == 'order') {
	              } else if (that.kind == 'favorable') {
	                redirect_url = that.cf.SiteUrl + '/h5/chain/chain/favorabledetail?order_id=' + that.order_id;
	              } else {
	              }
	  
	              window.location.href = redirect_url;
	            }
	          },
	        });
	  
	        console.info('h5OldPay=url=', url);
	        window.location.href = url;
	        // #endif
	      },
	      async h5Pay(e) {
	        console.info('----submitOrder---', 'h5Pay');
	        let that = this;
	        //console.log("发起支付");
	        this.loading = true;
	        let result = await this.getOrderInfo(e);
	        console.info('----submitOrder--result-', result);
	        let orderInfo = result.data;
	        if (result.status !== 200) {
	          //console.log("获得订单信息失败", orderInfo);
	          if (result.code == 101) {
	            that.$.showModal({
	              title: that.__('提示'),
	              content: that.__('未设置支付密码，去设置？'),
	              success: (res) => {
	                if (res.confirm) {
	                  let redirect_url = '/member/member/paypwd';
	                  that.$.gopage(redirect_url);
	                } else if (res.cancel) {
	                }
	              },
	            });
	          } else if (result.code == 201) {
	            that.$.showModal({
	              content: result.msg || that.__('微信订单已存在'),
	              showCancel: false,
	            });
	          } else {
	            that.$.showModal({
	              content: result.msg || that.__('获得订单信息失败'),
	              showCancel: false,
	            });
	          }
	  
	          this.loading = false;
	          return;
	        } else {
	        }
	  
	        if (orderInfo.paid) {
	          this.loading = false;
	  
	          this.onPaid();
	        } else {
			  that.openPopup(false);
	          that.$.showModal({
	            title: that.__('提示'),
	            content: that.__('是否支付完成？'),
	            success: (res) => {
	              if (res.confirm) {
	                this.onPaid();
	              } else if (res.cancel) {
	                this.onFail();
	              }
	            },
	          });
	  
	          if (e == 'alipay') {
	            window.location.href = orderInfo.mweb_url;
	            //window.open(orderInfo.data.mweb_url);
	          } else {
	            let redirect_url = that.cf.SiteUrl + '/h5/edu/order/detail?init_pay_flag=1&on=' + that.order_id;
	            if (that.kind == 'order') {
	            } else if (that.kind == 'favorable') {
	              redirect_url = that.cf.SiteUrl + '/h5/chain/chain/favorabledetail?init_pay_flag=1&order_id=' + that.order_id;
	            } else {
	            }
	            //页面已经跳转走了
	            window.location.href = orderInfo.mweb_url + '&redirect_url=' + encodeURIComponent(redirect_url);
	          }
	        }
	  
	        this.loading = false;
	      },
	  
	      async mpPay() {
	        let that = this;
	        //console.log("发起支付");
	        this.loading = true;
	        let result = await this.getOrderInfo('wxpay');
	  
	        let orderInfo = result.data;
	        if (result.status !== 200) {
	          if (result.code == 101) {
	            that.$.showModal({
	              title: that.__('提示'),
	              content: that.__('未设置支付密码，去设置？'),
	              success: (res) => {
	                if (res.confirm) {
	                  let redirect_url = '/member/member/paypwd';
	                  that.$.gopage(redirect_url);
	                } else if (res.cancel) {
	                }
	              },
	            });
	          } else {
	            that.$.showModal({
	              content: result.msg || that.__('获得订单信息失败'),
	              showCancel: false,
	            });
	          }
	  
	          this.loading = false;
	          return;
	        } else {
	        }
	  
	        if (orderInfo.paid) {
	          this.loading = false;
	  
	          this.onPaid();
	        } else {
	          wPay(
	            {
	              appId: orderInfo.data.appId,
	              timeStamp: orderInfo.data.timeStamp,
	              nonceStr: orderInfo.data.nonceStr,
	              signature: orderInfo.data.signType,
	              package: orderInfo.data.package,
	              paySign: orderInfo.data.paySign,
	            },
	            (res) => {
	              //console.log('调用成功!');
	              //进入订单页面
	  
	              //console.log("success", res);
	              this.onPaid();
	            },
	            (fail) => {
	              console.log('orderInfo', orderInfo);
	              //console.log('调用失败!');
	              console.info(fail);
	              that.$.showModal({
	                content: that.__('支付失败'),
	                showCancel: false,
	              });
	              this.onFail();
	            },
	          );
	        }
	      },
	  
	      async pCheckout(cart_id) {
	        let params = {
	          ifcart: 0,
	          chain_id: 0,
	          cart_id: cart_id,
	          is_delivery: 0,
	          if_virtual: 1,
	        };
	        let that = this;
	        that.$.request({
	          url: this.Config.URL.cart.checkout,
	          data: params,
	          loading: false,
	          success: function (data, status, msg, code) {
	            if (200 === status) {
	              if (data && data.items) {
	                that.item_row = data.items[0].items[0];
	                that.product_id = data.items[0].items[0].product_id;
	                that.voucher_items = data.items[0].voucher_items;
	                if (that.item_row) {
	                  that.course = data.items[0].items[0].course;
	                  that.chapter = data.items[0].items[0].course.chapter;
	                }
	  
	                that.reloadUserResource(function (user_info) {
	                  that.paymentData.user_money = user_info.user_money;
	                  that.paymentData.user_points = user_info.user_points;
	                  that.paymentData.user_recharge_card = user_info.user_recharge_card;
	                  that.paymentData.user_sp = user_info.user_sp;
	                  that.orderSelMoneyAmount = data.orderSelMoneyAmount.toFixed(2);
	                  if (data.order_id) {
	                    that.order_id = data.order_id;
	                    that.paymentData.order_id = data.order_id;
	                    that.paymentData.orderSelMoneyAmount = that.orderSelMoneyAmount;
	                    that.showPayBox = true;
	                  } else {
	                    that.paymentData.orderSelMoneyAmount = that.orderSelMoneyAmount;
	                  }
	                });
	              }
	            } else {
	              let item_id = Number(cart_id.split('|')[0]);
	              that.$.confirm(that.__(msg), function (a) {
	                if (a.confirm) {
	                  that.$.navigateTo({
	                    url: '/edu/course/class-detail?item_id=' + item_id,
	                  });
	                  // uni.navigateBack({
	                  //   delta:1,//返回层数，2则上上页
	                  // })
	                }
	              });
	            }
	          },
	          fail: function (err, ms) {
	            that.$.confirm(err);
	          },
	        });
	      },
	  
	      getOrderInfo(payment_channel_code) {
	        console.info('order-pay=', 'getOrderInfo=' + 'payment_channel_code=' + payment_channel_code);
	        let that = this;
	        if (payment_channel_code == 'wxpay') {
	          payment_channel_code = 'wx_native';
	        }
	        console.info('order-pay=payment_channel_code=', payment_channel_code);
	        let appid = '';
	        // #ifdef APP-PLUS
	        appid = plus.runtime.appid;
	        // #endif
	  
	        var pm_money = 0;
	        var pm_recharge_card = 0;
	        var pm_points = 0;
	        var pm_sp = 0;
	        var pm_credit = 0;
	  
	        var password = this.password;
	        var pay_sn = this.order_id;
	  
	        if (this.userMoney) {
	          pm_money = this.paymentDataDefault.orderSelMoneyAmount;
	        }
	  
	        if (this.userPoints) {
	          pm_points = this.paymentDataDefault.user_points;
	        }
	  
	        if (this.userSp) {
	          pm_sp = this.paymentDataDefault.user_sp;
	        }
	  
	        if (this.userRechargeCard) {
	          pm_recharge_card = this.paymentDataDefault.user_recharge_card;
	        }
	  
	        let params = {
	          pay_sn: pay_sn,
	          password: password,
	          pm_recharge_card: pm_recharge_card,
	          pm_money: pm_money,
	          pm_points: pm_points,
	          pm_sp: pm_sp,
	          pm_credit: pm_credit,
	          payment_channel_code: payment_channel_code,
	          appid: appid,
	          typ: 'json',
	        };
	  
	        // #ifdef APP-PLUS
	        params['prepayapp_flag'] = 1;
	        // #endif
	  
	        // #ifdef MP-WEIXIN
	        params['prepay_flag'] = 1;
	        params['openid'] = openid;
	        // #endif
	  
	        // #ifdef H5
	  
	        if (that.$.isWeixin()) {
	          params['mp_flag'] = 1;
	        } else {
	          //H5支付 微信
	          params['return_flag'] = 1;
	        }
	        // #endif
	  
	        let url = that.cf.URL.pay.pay;
	        console.info('order-pay=url=', url);
	        console.info('order-pay=params=', params);
	  
	        return new Promise((res) => {
	          that.$.request({
	            url: url,
	            data: params,
	            success: (data, status, msg, code) => {
	              console.info('order-pay=success=', data);
	              res({
	                data: data,
	                status: status,
	                msg: msg,
	                code: code,
	              });
	            },
	            fail: (err, status) => {
	              console.info('order-pay=fail=', err);
	              res({
	                data: err,
	                status: status,
	              });
	            },
	          });
	        });
	      },
	  
	      async requestPayment(e, index) {
	        console.info('order-pay=', 'requestPayment 1' + 'e=' + e + ' index=' + index);
	        let that = this;
	  
	        this.loading = true;
	        this.providerList[index].loading = true;
	        let result = await this.getOrderInfo(e.id);
	        console.info('order-pay=', 'requestPayment 2');
	        let orderInfo = result.data;
	        console.log(JSON.stringify(result));
	        if (result.status !== 200) {
	          if (result.code == 101) {
	            that.$.showModal({
	              title: that.__('提示'),
	              content: that.__('未设置支付密码，去设置？'),
	              success: (res) => {
	                if (res.confirm) {
	                  let redirect_url = '/member/member/paypwd';
	                  that.$.gopage(redirect_url);
	                } else if (res.cancel) {
	                }
	              },
	            });
	          } else if (result.code == 201) {
	            that.$.showModal({
	              content: result.msg || that.__('微信订单已存在'),
	              showCancel: false,
	            });
	          } else {
	            that.$.showModal({
	              content: result.msg || that.__('获得订单信息失败'),
	              showCancel: false,
	            });
	          }
	  
	          this.loading = false;
	          return;
	        } else {
	        }
	  
	        if (orderInfo.paid) {
	          this.loading = false;
	          console.info('order-pay=', 'requestPayment 3 paid');
	          this.onPaid(orderInfo);
	        } else {
	          let pay_params = Object.assign({}, orderInfo.data);
	          delete pay_params['order_id'];
	  
	          pay_params['partnerid'] = pay_params['partnerid'] + '';
	          pay_params['timestamp'] = pay_params['timestamp'] + '';
	          console.info('order-pay=', 'requestPayment 4 requestPayment');
	          that.$.requestPayment({
	            provider: e.id,
	            orderInfo: e.id == 'alipay' ? orderInfo.mweb_url : pay_params,
	            success: (e) => {
	              //console.log("success", e);
	              //进入订单页面
	              console.info('order-pay=', 'requestPayment 5 onPaid');
	              this.onPaid(orderInfo);
	            },
	            fail: (e) => {
	              console.info('order-pay=', 'requestPayment 6 fail');
	              console.log('fail', e);
	              that.$.showModal({
	                content: that.__('支付失败'),
	                showCancel: false,
	              });
	  
	              this.onFail();
	            },
	            complete: () => {
	              console.info('order-pay=', 'requestPayment 7 complete');
	              this.loading = false;
	              this.providerList[index].loading = false;
	            },
	          });
	        }
	      },
	  
	      onPaid: function (e) {
	        //重新加载用户资源数据
	        let that = this;
	        that.reloadUserResource(function (user_info) {
	          that.returnUrl(that.order_id);
	        });
	      },
	  
	      onFail: function (e) {
	        let that = this;
	        uni.navigateBack();
	        // that.$.gotopage("/member/order/detail?on=" + this.order_id)
	      },
	  
	      returnUrl: function (order_id) {
	        let url = this.$.sprintf('/edu/order/pay-result?order_id=%s', order_id);
	        this.$.gotopage(url);
	      },
  },
};
</script>

<style lang="scss"></style>
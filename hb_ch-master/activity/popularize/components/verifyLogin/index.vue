<template>
  <view class="signIn">
    <!-- 主体 -->
	<view class="signIn_content">
		<view class="main">
		  <wInput class="user_mobile" type="number" v-model="user_mobile" isShowIntl @intl="intlChange" :placeholder="__('请输入手机号码')"></wInput>
		
		  <wInput
		    class="mobileCode"
		    v-model="mobile_code"
		    type="number"
		    maxlength="4"
		    :placeholder="__('请输入验证码')"
		    isShowCode
		    :codeText="__('获取验证码')"
		    ref="runCode"
		    @setCode="getSmsCode()"
		  ></wInput>
		</view>
		
		<wButton class="signIn-button" :bgColor="buttonColor" :text="signInButtonText" @click.native="loginJump()"></wButton>
	</view>
	<slot name="signInbutton">
		<image class="buyButton" :src="buy" mode="widthFix" @click.native="loginJump()"></image>
	</slot>
  </view>
</template>

<script>
import wInput from '@/components/watch-login/watch-input.vue'; //input
import wButton from '@/components/watch-login/watch-button.vue'; //button

import { mapState, mapMutations } from 'vuex';
export default {
  components: {
    wInput,
    wButton,
  },
  props: {
	  buy: {
	    type: String,
	    default() {
	      return '';
	    },
	  },
    signInButtonText: {
      type: String,
      default() {
        return '';
      },
    },
    buttonColor: {
      type: String,
      default() {
        return '';
      },
    },
  },
  data() {
    return {
      user_mobile: '',
      mobile_code: '',
      user_intl: '',
      btntext: '',
      isSend: !0,
      isUserMobile: !0,
      sendTime: 120,
      isRotate: false,
      data: {},
    };
  },
  computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'forcedLoginState', 'clientInfo']),
  onLoad() {
	  // const that = this;
	  // this.$nextTick(function() {
		 //  that.$on('loginButton', function() {
			//   console.log('我是子组件方法');
			//   that.loginJump();

		 //  });

	  // });
  },
  onUnload() {},
  methods: {
    intlChange: function (data) {
      this.user_intl = data;
    },
    loginJump: function (e) {
      let that = this;
	  that.$emit('goTop');
      //注册
      if (this.isRotate) {
        //判断是否加载中，避免重复点击请求
        return false;
      }
      //  #ifdef  APP-PLUS
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/login/login',
        });
        return;
      }
      //  #endif
	  if (that.$FT.isNull(this.user_mobile)) {
	    this.setData({
	      isUserMobile: !1,
	    });
	  
	    uni.showToast({
	      icon: 'none',
	      title: that.__('请输入手机号'),
	    });
	  
	    return false;
	  }
      // if (!that.$FT.validatemobile(this.user_mobile)) {
	if (!that.$FT.validatemobile(this.user_mobile)) {
        this.setData({
          isUserMobile: !1,
        });

        uni.showToast({
          icon: 'none',
          title: that.__('手机号不正确'),
        });

        return false;
      }

      if (this.mobile_code.length != 4) {
        uni.showToast({
          icon: 'none',
          title: that.__('验证码不正确'),
        });

        return false;
      }
      this.isRotate = true;
      setTimeout(function () {
        that.isRotate = false;
      }, 3000);
	  this.update();
    },
    getSmsCode: function () {
      //  #ifdef  APP-PLUS
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/login/login',
        });
        return;
      }
      //  #endif
      let that = this;
	  //   校验手机号位数
	if (!that.$FT.validatemobile(this.user_mobile)) {
        this.setData({
          isUserMobile: !1,
        });

        uni.showToast({
          icon: 'none',
          title: that.__('手机号不正确'),
        });
        return false;
      }

      //获取验证码
      this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）

      setTimeout(function () {
        that.$refs.runCode.$emit('runCode', 0); //假装模拟下需要 终止倒计时
      }, 60000);

      if (this.isSend) {
        this.setData({
          isSend: !1,
        });
        var t = this.sendTime;
        var params = {
          mobile: this.user_intl + this.user_mobile,
        };

        that.$.request({
          url: this.Config.URL.account.get_mobile_checkcode,
          data: params,
          success: function (data, status, msg, code) {
            if (status == 200) {
              var r = setInterval(function () {
                t > 0
                  ? that.setData({
                      btntext: t-- + 's',
                    })
                  : (that.setData({
                      isSend: !0,
                      sendTime: 120,
                      btntext: that.__('重新发送'),
                    }),
                    clearInterval(r));
              }, 1e3);
            } else {
              that.setData({
                isSend: !0,
              });
              uni.showToast({
                icon: 'none',
                title: msg,
              });
              that.$refs.runCode.$emit('runCode', 0); //模拟需要 终止倒计时
            }
          },
        });
      }
    },
	update: function() {
		var that = this;
	
		var params = {
			user_mobile: this.user_intl + this.user_mobile,
			rand_key: this.user_intl + this.user_mobile,
			verify_code: this.mobile_code,
			client_info: that.client_info
		};
	
		that.$.request({
			url: this.Config.URL.doSmsLogin,
			data: params,
			loading: false,
			success: function(data, status, msg, code) {
				if (status == 200) {
					var id = that.$.setStorageSync('uid', data.user_id);
					var key = that.$.setStorageSync('ukey', data.key);
	
					// #ifdef H5
					$cookies.set('uid', data.user_id);
					$cookies.set('ukey', data.key);
					// #endif
					that.$emit('loginJump');
				} else {
					that.$.confirm(msg);
				}
			}
	
		});
	},
  },
};
</script>

<style lang="scss">
	.user_mobile{
		overflow: hidden;
	}
	.buyButton{
		width: 750rpx;
		height: 209rpx;
		margin: 0 auto;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 9;
	}
</style>

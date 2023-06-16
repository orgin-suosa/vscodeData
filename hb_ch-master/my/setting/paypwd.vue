<template>
    <view class="page">
        <view class="m-cells m-cells-form">
            <view class="m-cell" v-if="isSet">
                <view class="m-cell-hd"><label class="u-label">{{__('原支付密码')}}</label></view>
                <view class="m-cell-bd">
					<input class="u-input" v-model="old_pay_password" :password="showOldPwd" 
					:placeholder="__('请输入原支付密码')"  placeholder-style='color:#CCCCCC'/>
				</view>
                <view class="m-eye-view"  style="" 
				     @click="changePassword(1)">
					<image :src=" showOldPwd ? 'https://qnsp.zcskjy.com/zc_images/images/my/eyeshow.png':'https://qnsp.zcskjy.com/zc_images/images/my/eyeshide.png' "
					 mode="aspectFit"
					 style="width: 50rpx;height: 50rpx;"/>
				</view>
               <!-- <view v-if="!old_pay_password" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view> -->
            </view>

            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('支付密码')}}</label></view>
                <view class="m-cell-bd">
                    <input class="u-input" v-model="pay_password"  :placeholder="__('请输入支付密码')"  
					:password="showNewPwd"  placeholder-style='color:#CCCCCC'/>
                </view>

				<view class="m-eye-view"  style=""
				     @click="changePassword(2)">
					<image :src=" showNewPwd ? 'https://qnsp.zcskjy.com/zc_images/images/my/eyeshow.png':'https://qnsp.zcskjy.com/zc_images/images/my/eyeshide.png' "
					 mode="aspectFit"
					 style="width: 50rpx;height: 50rpx;"/>
				</view>
				
              <!--  <view v-if="!pay_password" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view> -->
            </view>
            <view class="m-cell">
                <view class="m-cell-hd"><label class="u-label">{{__('确认密码')}}</label></view>
                <view class="m-cell-bd"><input class="u-input" v-model="pay_password2" :password="showSureNewPwd" 
				:placeholder="__('请再次输入新支付密码')"  placeholder-style='color:#CCCCCC'/></view>
				<view class="m-eye-view"  style=""
				     @click="changePassword(3)">
					<image :src=" showSureNewPwd ? 'https://qnsp.zcskjy.com/zc_images/images/my/eyeshow.png':'https://qnsp.zcskjy.com/zc_images/images/my/eyeshide.png' "
					 mode="aspectFit"
					 style="width: 50rpx;height: 50rpx;"/>
				</view>
				
              <!--  <view class="uni-icon uni-icon-eye m-cell-ft"  style="width: 100upx;text-align: center;"  
				:class="[!showPassword ? 'uni-active' : '']" @click="changePassword(3)"></view> -->
               <!-- <view v-if="!pay_password2" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view> -->
            </view>
            <view class="m-cell m-cell-vcode" v-if="false">
                <view class="m-cell-hd"><label class="u-label">{{__('验证码')}}</label></view>
                <view class="m-cell-bd"><input class="u-input" type="number" :placeholder="__('请输入验证码')" maxlength="6" @input="inputcode"  placeholder-style='color:#CCCCCC' /></view>
               <!-- <view v-if="!isCode" class="m-cell-ft">
                    <view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
                </view> -->
                <view v-if="isSend" @tap="sendmessage" class="m-vcode-btn">{{btntext}}</view>
                <view v-else class="m-vcode-btn">{{btntext}}</view>
            </view>
        </view>
        <view class="btn_box"><button class="u-btn-hlight" @tap="submitdata">{{__('保存')}}</button></view>
    </view>
</template>


<script>

import { mapState, mapMutations } from 'vuex';

export default {
    name: 'asset',
    data: function() {
        return {
            old_pay_password: '',
            pay_password: '',
            pay_password2: '',
            isSet: false,
			
			showOldPwd: true, // 显示原密码
			showNewPwd: true,  //显示新支付密码
            showSureNewPwd: true, //确认支付密码

            Phone: '',
            Code: '',
            btntext: this.__('发送'),
            isSend: !0,
            isPhone: !0,
            sendTime: 120,
            isCode: !0
        };
    },
    computed: mapState([
        'Config',
        'StateCode',
        'notice',
        'plantformInfo',
        'shopInfo',
        'userInfo',
        'hasLogin'
    ]),
    onLoad: function(options) {
        uni.setNavigationBarTitle({
            title:this.__('支付密码')
        });

        var that = this;
        this.Phone == this.userInfo.user_mobile;

        this.refreshData();
    },
    methods: {
        ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
        
		refreshData: function(e) {
            let that = this;
            that.$.request({
                url: this.Config.URL.pay.get_pay_passwd,
                data: {},
                success: function(data, status, msg, code) {
                    if (status == 200) {
                        that.isSet = true;
                    } else {
                        that.isSet = false;
                    }
                }
            });
        },
		
        inputphone: function(e) {
            let that = this;
            this.setData({
                Phone: e.detail.value
            });

            if (that.$.isNull(e.detail.value)) {
                this.setData({
                    isPhone: !1
                });
            } else {
                /^1[34578]\d{9}$/.test(e.detail.value)
                    ? this.setData({
                          isPhone: !0
                      })
                    : this.setData({
                          isPhone: !1
                      });
            }
        },
		
        inputcode: function(e) {
            let that = this;
            this.setData({
                Code: e.detail.value
            }),
			that.$.isNull(e.detail.value)
				? this.setData({
					  isCode: !1
				  })
				: this.setData({
					  isCode: !0
				  });
        },
		
        sendmessage: function() {
            let that = this;
            if (that.$.isNull(this.Phone)) {
                this.setData({
                    isPhone: !1
                });
            } else if (/^1[2345789]\d{9}$/.test(this.Phone)) {
                if (this.Phone == this.userInfo.user_mobile) that.$.confirm('你已经绑定过该手机！');
                else if (this.isSend) {
                    this.setData({
                        isSend: !1
                    });

                    var t = this.sendTime;
                    var params = {
                        mobile: this.Phone
                    };
                    that.$.request({
                        url: this.Config.URL.account.get_mobile_checkcode,
                        data: params,
                        success: function(data, status, msg, code) {
                            if (status == 200) {
                                var r = setInterval(function() {
                                    t > 0
                                        ? that.setData({
                                              btntext: t-- + 's'
                                          })
                                        : (that.setData({
                                              isSend: !0,
                                              sendTime: 120,
                                              btntext: that.__('重新发送')
                                          }),
                                          clearInterval(r));
                                }, 1e3);
                            } else {
                                that.setData({
                                    isSend: !0
                                }),
                                    that.$.alert(msg);
                            }
                        }
                    });
                }
            } else {
                this.setData({
                    isPhone: !1
                });
            }
        },
       
		submitdata: function() {
			
            let that = this;
			if(that.isSet){
				if (!this.old_pay_password) {
					uni.showToast({
						icon:'none',
						title:'请输入原支付密码'
					})
					return;
				}
			}
			
			if (!this.pay_password) {
				// that.$.confirm('请输入支付密码');
				uni.showToast({
					icon:'none',
					title:'请输入支付密码'
				})
				return;
			}
			if (!this.pay_password2) {
				// that.$.confirm('请输入支付密码');
				uni.showToast({
					icon:'none',
					title:'请输入支付密码'
				})
				return;
			}
			if(this.pay_password != this.pay_password2)
			{
				// that.$.confirm(that.__('两次输入密码不一致！'));
				uni.showToast({
					icon:'none',
					title:'两次输入密码不一致！'
				})
				return;
			}
			
            var params = {
                old_pay_password: this.old_pay_password,
                new_pay_password: this.pay_password,
                pay_password: this.pay_password
            };

            that.$.request({
                url: this.Config.URL.pay.change_paypasswd,
                data: params,
                success: function(data, status, msg, code) {
                    if (status == 200) {
                        // that.$.showModal('支付密码设置成功！', function() {
                        //     that.$.backpage(1);
                        // });
						
						uni.showToast({
							icon:'success',
							title:'付密码设置成功！'
						})
						setTimeout(function () {
							that.$.navigateBack(1, function () {
							})
						}, 1e3)
						
                    } else {
                     
						uni.showToast({
							icon:'error',
							title:msg
						})
                    }
                }
            });
        },
        
		changePassword: function(index) {
			
			if(index==1){
				this.showOldPwd = !this.showOldPwd;
			}else if(index==2){
				this.showNewPwd = !this.showNewPwd;
			}else if(index==3){
				this.showSureNewPwd = !this.showSureNewPwd;
			}  
        }
    }
};
</script>


<style lang="scss">
@import '../../styles/_variables.scss';

 //    .page{
	// 	background-color: #FFFFFF;
	// 	width: 100%;
	//     display: flex;
	// 	flex-direction: column;
	// 	position: absolute;
	// 	left: 0;
	// 	top: 0;
	// 	bottom:0;
	// }
	
	
	.m-cells::before{border: none;}
	.m-cells::after{border: none;}
	
	.m-cell{
		padding: 25rpx 30rpx;
		border-bottom:#EEEEEE 1rpx solid ;
		display: flex;
		align-items: center;
		
		.m-eye-view{
			
			width: 80upx;
			height: 50rpx;
			text-align: center;
		}
		
		.m-cell-hd, .m-cell-bd{
			height: 50rpx;
			line-height: 50rpx;
			color: #333333;
			font-size: 32rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, PingFang SC;
		
			.u-input{
				height: 50rpx;
				line-height: 50rpx;
			}
		}
	}
	

.m-cell-vcode {
    padding-top: 0;
    padding-right: 0;
    padding-bottom: 0;
}

.m-vcode-img {
    width: 216upx;
    height: 88upx;
}

.btn_box {
	
	margin-top: 80rpx;
    // padding: 20upx;
}

.m-code {
    right: 210upx;
}

.m-vcode-btn {
    width: 150upx;
    text-align: center;
}
</style>

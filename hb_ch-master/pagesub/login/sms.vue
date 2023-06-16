<template>
	<view class="register">

		<view class="content">
		<view class="top_title">
			<image class="back" src="https://qnsp.zcskjy.com/zc_images/home/back.png" @click="goBack()"></image>
		</view>
		 <text class="tip_text">手机验证码登录</text>
			<!-- 主体 -->
			<view class="main">
				<wInput
					v-model="user_mobile"
					type="text"
					isShowIntl
					@intl="intlChange"
					:placeholder="__('请输入手机号码')"
				></wInput>

				<wInput
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

			<wButton 
				:text="__('登 录')"
				:bgColor="__('#FC4B21')"
				@click.native="startReg()" style="margin-top: 30rpx;"
			></wButton>
         
		 <view class="m-content-bttom" style="margin:100rpx 150rpx;">
			 <view class="menu-item">
				 <image style="width: 90rpx; height: 90rpx;"
				 mode="aspectFill" src="/static/images/login/quicklogImg.png" />
				<view class="m-title-text"> {{'一键登录（快速）'}}</view> 
			 </view>
			 <view class="menu-item">
				<image style="width: 90rpx; height: 90rpx;"
				 mode="aspectFill" src="/static/images/login/weixinlogImg.png" />
				<view class="m-title-text"> {{'微信登录（推荐）'}}</view> 
			 </view>
		 </view> 
		 
		</view>
		<view class="m-content-footer"  >
			 <view class="checkBtn" @click="checkBtnSelect">
				 <image style="width: 30rpx; height: 30rpx;display: block;margin-right: 8rpx;"
				 mode="aspectFill" :src="checkBtnState ? '/static/images/login/checksel.png':'/static/images/login/checkunsel.png'" />
			 </view>
				 
				 <text> {{'我已同意'}}</text> 
				 <text style="color:#FC4B21">《用户服务协议》</text>
				 <text>和</text>
				 <text style="color:#FC4B21">《用户隐私协议》</text>

			 </view>
			
		 </view> 
		 
		</view>
	</view>
</template>

<script>
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
    import imgcode from '@/components/verify-code/imgcode.vue';

    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        data: function() {
            return {
				logo: "",
                user_intl: "",
                user_mobile: "",
                user_avatar: "https://static.shopsuite.cn/demodata/assets/data/avatar.png",
                user_password: "",
                mobile_code: "",
                btntext: "发送",
                isUserMobile: !0,
                isUserEmail: !0,
                isNickname: !0,
                isPassword: !0,
                isSend: !0,
                sendTime: 120,
                isCode: !0,
                isImgCode: !1,
                checkBtnState:false,

				client_info: '{}',
			
					countdown: 6,
					cTimer: null,

				isRotate: false //是否加载旋转
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			wInput,
			wButton,
            imgcode
		},
        onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('手机验证码登录')
            });

			this.setData({
				options: options
			})

            this.btntext = this.__('发送')
			
			setTimeout(()=>{
				this.getPlantformInfo((plantformInfo)=> {
					this.logo = plantformInfo.logo;
				});
			}, 200);

            this.show();
			
			
			// #ifdef APP-PLUS
			plus.push.getClientInfoAsync(function(info) {
				console.log(info);
				if (info.clientid) {
					that.client_info = JSON.stringify(info);
				}
			}, function(e) {
				console.log(JSON.stringify(e));
			})
			// #endif
        },
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			intlChange:function(data){
				this.user_intl = data;
			},
            
			checkBtnSelect() {
				
				this.checkBtnState = !this.checkBtnState;
				
				
			},
			
            /* start 图形验证码 */
            refresh:function(){
                //this.$refs.imgcode.refresh();
            },
            show:function(){
                var _self=this;
                setTimeout(function(){
                    _self.refresh();
                },500);
            },
            onInputImgCode:function(e){
                if (e.detail.value.toLocaleLowerCase() == uni.getStorageSync('imgcode').toLocaleLowerCase())
                {
                    this.setData({isImgCode: true})
                }
                else
                {
                    this.setData({isImgCode: false})
                }
            },
            /* end 图形验证码 */

            inputuser_email: function (e) {
                let that = this;
                this.setData({user_email: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isUserEmail: !1}) : /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(e.detail.value) ? this.setData({isUserEmail: !0}) : this.setData({isUserEmail: !1})
            },
			
            startReg: function (e) {
				let that = this;

				//注册
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}

				if (!that.$.tel(this.user_mobile, this.user_intl))
				{
					this.setData({isUserMobile: !1});

					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: that.__('手机号不正确')
					});

					return false;
				}


				if (this.mobile_code.length != 4) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: that.__('验证码不正确')
					});

					return false;
				}
				this.isRotate=true;
				setTimeout(function(){
					that.isRotate=false
				},3000)
				this.update();
            },

            update: function () {
                var that = this;

                var params = {
                    user_mobile: this.user_intl + this.user_mobile,
                    rand_key: this.user_intl + this.user_mobile,
                    verify_code: this.mobile_code,
					client_info:that.client_info
                };

                that.$.request({
                    url: this.Config.URL.doSmsLogin,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (status == 200)
                        {
							var id = that.$.setStorageSync('uid', data.user_id);
							var key = that.$.setStorageSync('ukey', data.key);
						
							// #ifdef H5
							$cookies.set('uid', data.user_id);
							$cookies.set('ukey', data.key);
							// #endif
								
                            that.$.showToast({
                                title: that.__("登录成功!"), success: function () {

                                    that.login(data);

                                    if (data.im && that.plantformInfo.config.chat_global)
                                    {
                                        that.$Socket.connectserver(data.im);
                                    }

									setTimeout(() => {
										var prePage = getCurrentPages()[getCurrentPages().length - 2];
										console.log("prePage",prePage);
										try
										{
										    if (prePage.refreshData)
										    {
										        prePage.refreshData(prePage.options);
										    }
										    else if (prePage.onLoad)
										    {
										        prePage.onLoad(prePage.options);
										    }else{
												prePage.toMain(data);
											}
										}
										catch (e)
										{

										}
										that.$.navigateBack(2)

									}, 200)
                                }
                            })
                        }
                        else
                        {
                            that.$.confirm(msg);
                        }
                    }

                });
            },
            inputphone: function (e) {
                let that = this;
                this.setData({user_mobile: e.detail.value});
                that.$.isNull(e.detail.value) ? this.setData({isUserMobile: !1}) : /^1[0123456789]\d{9}$/.test(e.detail.value) ? this.setData({isUserMobile: !0}) : this.setData({isUserMobile: !1})
            },


            inputcode: function (e) {
                let that = this;
                this.setData({mobile_code: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isCode: !1}) : this.setData({isCode: !0})
            },
            getSmsCode: function () {
                let that = this;

				if (!that.$.tel(this.user_mobile, this.user_intl))
				{
					this.setData({isUserMobile: !1});

					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: that.__('手机号不正确')
					});
					return false;
				}

				//获取验证码
				this.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）


				/*
                if (!this.isImgCode)
                {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入正确的图形验证码',
                    });
                    return;
                }
                */

				setTimeout(function(){
					that.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
				},60000)

                if (this.isSend)
                {
                    this.setData({isSend: !1});
                    var t = this.sendTime;
                    var params = {
                        mobile: this.user_intl + this.user_mobile
                    };

                    that.$.request({
                        url: this.Config.URL.account.get_mobile_checkcode,
                        data: params,
                        success: function (data, status, msg, code) {
                            if (status == 200)
                            {
                                var r = setInterval(function () {
                                    t > 0 ? that.setData({btntext: t-- + "s"}) : (that.setData({
                                        isSend: !0,
                                        sendTime: 120,
                                        btntext: that.__("重新发送")
                                    }), clearInterval(r))
                                }, 1e3);
                            }
                            else
                            {
                                that.setData({isSend: !0});
                                that.$.alert(msg)

								that.$refs.runCode.$emit('runCode',0); //假装模拟下需要 终止倒计时
                            }
                        }
                    });
                }
            },

			startTimer: function() {
				var that = this;
				if (that.cTimer == null) {
					that.countdown--;
					that.cTimer = setInterval(function() {
						that.countdown--;
						if (that.countdown == 0) {
							that.clearTimer();
						}
					}, 1000);
				}
			},
			clearTimer: function() {
				var that = this;
				clearInterval(that.cTimer);
				that.cTimer = null;
				that.countdown = 6;
			}
        }
    };
</script>


<style lang="scss" scoped>
	
	@import '../../styles/reg.scss';
	.tip_text {
		width: 85%;
		font-size: 50upx;
		line-height: 50upx;
		margin-left: 56upx;
		margin-bottom: 70upx;
		font-family: PingFangSC-Medium, PingFang SC;
		color: #333333;
		margin-top: 60upx;
	}
	
	.des_title {
		width: 100%;
		line-height: 20rpx;
		height: 20rpx;
	    font-size: 28rpx;
		font-weight: 400;
		// font-family: PingFangSC-Medium, PingFang SC;
		color: #666666;
		margin-top: 120rpx;
		text-align: center;
	}
	
	.m-content-bttom{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		
		.menu-item{
			width: 195rpx;
			// background-color: aqua;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content:center;
			
			.m-title-text{
				width: 100%;
				margin-top:20rpx;
				text-align: center;
				line-height: 20rpx;
				height: 20rpx;
				font-size: 24rpx;
				font-weight: 400;
				// font-family: PingFangSC-Medium, PingFang SC;
				color: #666666;
			}
		}
	}
	
	
	.m-content-footer{
		position: fixed;
		left:30rpx;
		bottom: 39rpx;
		height: 30rpx;
		width: 690rpx;
		
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content:center;
		
		color:#999999;
		font-size: 24rpx;
		
	}
	
	.top_title {
		display: flex;
		width: 100%;
		height: 88rpx;
		margin-top: calc(40rpx + var(--status-bar-height));
		align-items: center;
	
	}
	.back {
		width: 30rpx;
		height: 30rpx;
		margin: 30rpx;
	}
	
	
</style>

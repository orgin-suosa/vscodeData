<template>
	<view class="register">

		<view class="content">
			<!-- 头部logo -->
			  <text class="tip_text">手机号注册</text>
			<!-- 主体 -->
			<view class="main">
				<wInput
					v-if="bind_type==1"
					v-model="user_account"
					type="text"
					isShowIntl
					@intl="intlChange"
					:placeholder="__('请输入手机号码')"
				></wInput>

				<wInput
					v-if="bind_type==2"
					v-model="user_account"
					type="text"
					:placeholder="__('请输入电子邮箱')"
				></wInput>

				<wInput
					v-model="user_password"
					type="password"
					:placeholder="__('请输入登录密码')"
					isShowPass
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


				<wInput
						v-model="seladstr"
						type="text"
						:placeholder="seladstr"
						v-if="Config.PLANTFORM_FX_AGENT_ENABLE"
						@click.native="showbox"
				></wInput>

				<wInput
						v-model="source_user_id"
						type="text"
						:placeholder="__('请输入推荐人编号')"
						v-if="Config.PLANTFORM_FX_ENABLE"
				></wInput>
			</view>

			<wButton
				:text="__('注 册')"
				:rotate="isRotate"
				@click.native="startReg()" style="margin-top: 30rpx;"
			></wButton>


			<view class="other_login cuIcon" style="margin-top:40rpx">
				<view class="login_icon">
					<view class="cuIcon-item" style="height: 32px;"><image src="/static/images/login/phone.png" @tap="onChangeBindType(1)"></image></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-item" style="height: 32px;"><image src="/static/images/login/email.png" @tap="onChangeBindType(2)"></image></view>
				</view>
			</view>

			<!-- 底部信息 -->
			<view class="footer">
				<text
					@tap="isShowAgree"
					class="cuIcon"
					:class="showAgree?'cuIcon-radiobox':'cuIcon-round'"
				>{{__('同意')}}</text>
				<!-- 协议地址 -->
				<navigator url="/member/member/protocol?id=reg_protocols_description" open-type="navigate">《{{__('注册协议和隐私协议')}}》</navigator>
			</view>
		</view>

		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
						   @onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>



<script>
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
    import imgcode from '@/components/verify-code/imgcode.vue';
    import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'

    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        data: function() {
            return {
                user_account: "",
                user_nickname: "",
				logo: "",
                user_intl: "",
                user_mobile: "",
                user_email: "",
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
                source_user_id: '',
				source_ucc_code: '',


                bind_type: 1,  //1:手机号注册   2:email 注册
                bind_mobile: 1,  //1:手机号注册   2:email 注册
                bind_email: 2,  //1:手机号注册   2:email 注册

                isDistrict: !0,

                Pindex: 0,
                selectedProId: 0,
                selectedCityId: 0,
                selectedCountyId: 0,
                selectedPro: '',
                selectedCity: '',
                selectedCounty: '',
                seladstr: "请选择所属地区",

                cityPickerValueDefault: [0, 0, 0],
                themeColor: '#007AFF',


					protocol_text:'',
					bannerShow:false,
					countdown: 6,
					cTimer: null,


				showAgree:false, //协议是否选择
				isRotate: false //是否加载旋转
            }
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			wInput,
			wButton,
            imgcode,
            mpvueCityPicker
		},
        onLoad: function(options) {
            uni.setNavigationBarTitle({
                title:this.__('注册')
            });

			this.setData({
				options: options
			})

            this.bind_type = options.bind_type==2 ? this.onChangeBindType(this.bind_email) : this.onChangeBindType(this.bind_mobile);

            this.btntext = this.__('发送')
            this.seladstr = this.__('请选择所属地区')

            let source_user_id = this.$.getStorageSync('source_user_id');
			this.setData({source_user_id: source_user_id})
			let source_ucc_code = this.$.getStorageSync('source_ucc_code');
			this.setData({source_ucc_code: source_ucc_code})

			setTimeout(()=>{
				this.getPlantformInfo((plantformInfo)=> {
					this.logo = plantformInfo.logo;
				});
			}, 200);

            this.show();
        },
        methods: {
            ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			onChangeBindType:function(bind_type){
				this.bind_type = bind_type;

				if (this.bind_email == this.bind_type)
				{
					uni.setNavigationBarTitle({
						title:this.__('电子邮箱注册')
					});
				}

				if (this.bind_mobile == this.bind_type)
				{
					uni.setNavigationBarTitle({
						title:this.__('手机号注册')
					});
				}

				return this.bind_type;
			},

			intlChange:function(data){
				this.user_intl = data;
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


            startReg: function (e) {
				let that = this;

				//注册
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}

				if (that.bind_type == that.bind_mobile)
				{
					if (!that.$.tel(this.user_account, this.user_intl))
					{
						this.setData({isUserMobile: !1});

						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: that.__('手机号不正确')
						});

						return false;
					}
				}
				else if (that.bind_type == that.bind_email)
				{
					if (!that.$.email(this.user_account))
					{
						this.setData({isUserEmail: !1});

						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: that.__('电子邮箱不正确')
						});

						return false;
					}
				}
				/*
                if (that.$.isNull(this.user_nickname))
                {
                    this.setData({isNickname: !1});
                }

                if (that.$.isNull(this.mobile_code))
                {
                    this.setData({isCode: !1});
                }
                */

                if (!that.$.minlength(this.user_password, 6))
                {
                    this.setData({isPassword: !1});

					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: that.__('密码至少大约6位')
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


                if (that.$.isNull(this.selectedProId) || that.$.isNull(this.selectedCityId) || that.$.isNull(this.selectedCountyId))
                {
					if (that.cf.PLANTFORM_FX_AGENT_ENABLE)
					{
						this.setData({isDistrict: !1});

						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: that.__('请选择地区信息')
						});

						return ;
					}
                }

				this.update();
            },

            update: function () {
                var that = this;

				if (!this.showAgree)
				{
					that.$.confirm(that.__('请先同意注册协议'));

					uni.showToast({
						icon: 'none',
						title: that.__('请先同意注册协议'),
					});

					return;
				}

                var params = {
					user_account: this.user_account,
					user_mobile: '',
                    user_email: '',

                    user_nickname: this.user_nickname,
                    user_password: this.user_password,
                    user_avatar: this.user_avatar,

                    rand_key: this.user_intl + this.user_account,
                    verify_code: this.mobile_code,
					source_user_id: this.source_user_id,
					source_ucc_code: this.source_ucc_code,
                };

                params.bind_type = that.bind_type; //1:手机号注册   2:Email注册

				if (that.bind_type == that.bind_mobile)
				{
					params.user_account = this.user_intl + this.user_account;
					params.user_mobile  = this.user_intl + this.user_account;

					params.rand_key     = this.user_intl + this.user_account;
				}
				else if (that.bind_type == that.bind_email)
				{
					params.user_account = this.user_account;
					params.user_email   = this.user_account;
					params.rand_key     = this.user_account;
				}


                if (that.cf.PLANTFORM_FX_AGENT_ENABLE)
                {
                    params.user_province_id = that.selectedProId;
                    params.user_city_id = that.selectedCityId;
                    params.user_county_id = that.selectedCountyId;
                }

                that.$.request({
                    url: this.Config.URL.register,
                    data: params,
                    success: function (data, status, msg, code) {
                        if (status == 200)
                        {
                            that.$.showToast({
                                title: that.__("注册成功!"), success: function () {									
									var id = that.$.setStorageSync('uid', data.user_id);
									var key = that.$.setStorageSync('ukey', data.key);
									
									// #ifdef H5
									$cookies.set('uid', data.user_id);
									$cookies.set('ukey', data.key);
									// #endif
									
                                    that.login(data);

                                    if (data.im && that.plantformInfo.config.chat_global)
                                    {
                                        that.$Socket.connectserver(data.im);
                                    }

                                    //判断是否需要进入激活页面
									if (2 == data.user_state)
									{
										that.$.toActive();
									}

									setTimeout(() => {
										var prePage = getCurrentPages()[getCurrentPages().length - 2];

										try
										{
										    if (prePage.refreshData)
										    {
										        prePage.refreshData(prePage.options);
										    }
										    else if (prePage.onLoad)
										    {
										        prePage.onLoad(prePage.options);
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

            onInputNickname: function (e) {
                let that = this;
                this.setData({user_nickname:e.detail.value})
                that.$.isNull(e.detail.value) ? this.setData({isNickname: !1}) : this.setData({isNickname: !0})
            },

            onInputPassword: function (e) {
                let that = this;
                this.setData({user_password:e.detail.value})
                that.$.isNull(e.detail.value) ? this.setData({isPassword: !1}) : this.setData({isPassword: !0})
            },

            inputcode: function (e) {
                let that = this;
                this.setData({mobile_code: e.detail.value}), that.$.isNull(e.detail.value) ? this.setData({isCode: !1}) : this.setData({isCode: !0})
            },
            upImgs: function (e) {
                var that = this;

                that.$.chooseImage({
                    count: 1, sizeType: ["compressed"], success: function (n) {
                        that.$.showLoading();
                        var r = n.tempFilePaths;
                        that.$.uploadFile({
                            url: that.Config.URL.upload,
                            method: "POST",
                            filePath: r[0],
                            name: "upfile",
                            //header: {"content-type": "multipart/form-data"},
                            success: function (n) {
                                that.$.hideLoading();

                                var up_res = that.$.parseJSON(n.data);
                                var s = up_res.data.url;
                                that.setData({user_avatar: s})
                            },
                            fail: function (e) {
                                that.$.hideLoading()
                            },
                            complete: function (e) {
                                that.$.hideLoading()
                            }
                        })
                    },
                    fail: function (e) {
                        that.$.hideLoading()
                    },
                    complete: function (e) {
                        that.$.hideLoading()
                    }
                })
            },
            getSmsCode: function () {
                let that = this;
				let url = this.Config.URL.account.get_mobile_checkcode;
				var params = {
				};

				if (that.bind_type == that.bind_mobile)
				{
					if (!that.$.tel(this.user_account, this.user_intl))
					{
						this.setData({isUserMobile: !1});

						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: that.__('手机号不正确')
						});
						return false;
					}

					url = this.Config.URL.account.get_mobile_checkcode;
					params = {
					    mobile: this.user_intl + this.user_account
					};
				}
				else if (that.bind_type == that.bind_email)
				{
					if (!that.$.email(this.user_account))
					{
						this.setData({isUserEmail: !1});

						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: that.__('电子邮箱不正确')
						});

						return false;
					}

					url = this.Config.URL.account.get_email_checkcode
					params = {
					    email: this.user_account
					};
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

                    that.$.request({
                        url: url,
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

            // 三级联动选择
            showbox() {
            	/*
            	this.setData({
            	    isShow: !0
            	})
            	*/
            	this.$refs.mpvueCityPicker.show()
            },

            onCancel(e) {
            	//console.log(e)
            },

            onConfirm(e) {
            	let that = this;
                //console.info(e);
                //console.info(JSON.stringify(e));
            	this.pickerText = JSON.stringify(e)

                this.setData({
                    isDistrict:true,
                    Pindex: this.cityCode,
                    selectedProId: e.value[0],
                    selectedCityId: e.value[1],
                    selectedCountyId: e.value[2],
                    selectedPro: e.label[0],
                    selectedCity: e.label[1],
                    selectedCounty: e.label[2],
                    seladstr: that.$.isNull(e.label.toString()) ? that.__("请选择地址") : e.label.toString()
                });
            },

			onChangeProtocol:function(e){
				var values = e.detail.value;

				if (values.length > 0)
				{
					this.showAgree = true;
				}
				else
				{
					this.showAgree = false;
				}
			},
			closeBanner: function() {
				this.bannerShow = false;
			},
			showBanner: function() {
				let that = this;

				that.$.request({
				    url: that.Config.URL.protocol,
				    data: {},
				    success: function (data, status, msg, code) {
				        if (status == 200)
				        {
							that.bannerShow = true;
							that.protocol_text = data.document;
				        }
				        else
				        {
				            that.$.confirm(msg);
				        }
				    }
				});

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
			},

			isShowAgree(){
            	let that = this;

				//是否选择协议
				that.showAgree = !that.showAgree;
			},

			showProtocol:function(id){
				uni.navigateTo({
					url:'/member/member/protocol?id=' + id
				})
			}
        }
    };
</script>


<style lang="scss">
	@import '../../styles/reg.scss';
.tip_text {
  width: 85%;
  font-size: 50upx;
  line-height: 50upx;
  margin-left: 56upx;
  margin-bottom: 50upx;
  font-family: PingFangSC-Medium, PingFang SC;
  color: #333333;
  margin-top: 73upx;
}
	.cuIcon-item{
		font-size: 64upx;

		image{
			width: 64upx;
			height: 64upx;
		}
	}
</style>

<template>
	<view class="page">
		<view class="m-cells m-cells-form">
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('收款方式')}}</label></view>
				<view class="m-cell-bd">
					 <picker @change="bindPickerChange" :value="index" :range="banklists" range-key="bank_remark">
					        <view class="">{{banklists[index] ? banklists[index]['bank_name'] : __('请选择收款方式')}}</view>
					  </picker>
				</view>

			</view>
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('姓名')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="(user_bank_card_name)" :placeholder="__('输入收款人姓名')" maxlength="20" @input="inputReName" />
				</view>
				<view v-if="(!isName)" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>

			<view class="m-cell">
				<view class="m-cell-hd">
					<label class="u-label">{{__('收款账号')}}</label>
				</view>
				<view class="m-cell-bd">
					<input class="u-input" type="text" :value="(user_bank_card_code)" :placeholder="__('输入银行卡号或支付宝账号')" @input="inputbankAccount" />
				</view>
				<view v-if="(!isbankAccount)" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd">
					<label class="u-label">{{__('银行名称')}}</label>
				</view>
				<view class="m-cell-bd">
					<input class="u-input" :disabled="bank_name_disable" type="text" :value="(user_bank_card_address)" :placeholder="__('如选择微信/支付宝该项不填')" @input="inputbankName" />
				</view>
				<view v-if="(!isbankName)" class="m-cell-ft">
					<icon class="m-icon-warn" type="warn"></icon>
				</view>
			</view>
			<view class="m-cell">
				<view class="m-cell-hd"><label class="u-label">{{__('手机号码')}}</label></view>
				<view class="m-cell-bd">
					<input class="u-input" type="number" :placeholder="__('请输入手机号码')" maxlength="11" @input="inputphone" :value="user_bank_card_mobile" />
				</view>
				<view v-if="(!isUserMobile)" class="m-cell-ft">
					<view class="m-icon-warn uni-icon uni-icon-info" type="warn"></view>
				</view>
			</view>

		</view>

		<button class="u-btn-hlight" @click="submitInfo" style="margin-top:50upx;">{{__('保存')}}</button>

	</view>
</template>


<script>

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
                options:{},
				user_id: 0,
				user_bank_card_name: "",  //姓名
				user_bank_card_code: "",   //账号
				user_bank_card_address: "",  //支行名称
				bank_name_disable:!1,   //银行名称是否可输入
				
				user_idcard: "",
				isName: !0,
				isCardNo: !0,
				
				BankName: "",
				isbankAccount: !0,
				isbankName: !0,
				banklists: [],
				index: 0, //默认选中第0个数据
				user_bank_card_mobile:"",
				isUserMobile: !0,
				bank_name: "", // 收款方式 银行名称 支付宝、微信
				bank_id: 0,
				id: 0,
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
		},
		
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('收款账号')
			});
			//
            console.log('--onLoad--options---',options);
			
			let that = this;
            that.setData({
                options: options,
            });
			
            if(options.ud_id)
            {
            	that.setData({
            		id: options.ud_id
            	});
            }
			
			this.load()

		},
		onShow: function(opt) {
			
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			load: function()
			{
				var that =this;
				var params = {
				}
				that.$.request({
					url: this.Config.URL.pay.list_user_bank,
					data: params,
					success: function(data, status, msg, code) {
						
						that.setData({
							banklists: data.bank_list.items
						})
                        
						console.log('---item----',that.banklists);
						//有 账户id  再查询信息
						if(that.id)
						{
							that.getUserBank()
						}
						
						//
						if(that.banklists[that.index]['bank_name'] == '微信' || that.banklists[that.index]['bank_name'] == '支付宝')
						{
							that.setData({
								bank_name_disable:!0,
								user_bank_card_address:''
							})
						}else{   
							that.setData({
								bank_name_disable:!1,
							})
						}	
					}
				})
			},
            
			//获取用户账户信息
			getUserBank: function() {
				var that =this;
				var params = {
					id: that.id
				}
				that.$.request({
					url: this.Config.URL.pay.get_user_bank,
					data: params,
					success: function(data, status, msg, code) {
						if(status == 200)
						{
							console.log('----data----',data);
							that.setData({
								bank_id: data.bank_id,
								bank_name: data.bank_name,
								user_bank_card_name: data.user_bank_card_name,
								user_bank_card_address: data.user_bank_card_address,
								user_bank_card_mobile: data.user_bank_card_mobile,
								user_bank_card_code: data.user_bank_card_code
							})
							
							
							for (var r = 0; r < that.banklists.length; r++) {
								if (that.banklists[r]['bank_id']  == data.bank_id)
								{
									that.index = r;
									break;
								}
							}
						}
					}
				})
			},

			inputphone: function(e) {
				let that = this;
				that.setData({
					user_bank_card_mobile: e.detail.value
				})
				
				console.log('---1---',e.detail.value);
				if(uni.$u.test.mobile(e.detail.value)){
					console.log('---000---');
					that.setData({
						isUserMobile: !0
					})
				}else{
					console.log('---111--');
				}
			},

			inputReName: function(e) {
				this.setData({
					user_bank_card_name: e.detail.value
				})
			},
             
			//
			inputbankAccount: function(e) {
				var that = this;
				this.setData({
					user_bank_card_code: e.detail.value,
				});
				
				if(this.banklists[this.index]['bank_name'] == '微信' || this.banklists[this.index]['bank_name'] == '支付宝')
				{
					if (e.detail.value != '') {
						this.setData({
							isbankAccount: !0
						})
					} else {
						this.setData({
							isbankAccount: !1
						})
					}
				}
				else
				{
					if ( e.detail.value && /^\d{5,25}$/.test(e.detail.value)) {
						this.setData({
							isbankAccount: !0
						})
					} else {
						this.setData({
							isbankAccount: !1
						})
						
						console.log('---bankAccount---',this.isbankAccount);
					}
				}
			},
			
			inputbankName: function(e) {
				this.setData({
					user_bank_card_address: e.detail.value
				})
			},
          
			inputICard: function(e) {
				let that = this;
				if (that.$.isNull(e.detail.value)) {
					this.setData({
						isCardNo: !0,
						user_idcard: e.detail.value
					});
					return
				}
				this.IdentityCodeValid(e.detail.value) ? this.setData({
					isCardNo: !0
				}) : this.setData({
					isCardNo: !1
				}), 
				this.setData({
					user_idcard: e.detail.value
				})
			},
           
		    //收款方式 
			bindPickerChange: function(e) {
				let that = this;
				var r = e.target.value;
				this.index = r;
				this.bank_id = that.banklists[r].bank_id;
				this.bank_name = that.banklists[r].bank_name;
				
				//判断选择的是微信还是支付宝
				if(this.bank_name == '微信' || this.bank_name == '支付宝')
				{	
					this.setData({
						bank_name_disable:!0,
						user_bank_card_address:''
					})
				}
				else
				{   
					this.setData({
						bank_name_disable:!1,
					})
				}			
			},
            
			// 提交按钮
			submitInfo: function(e) {
				let that = this;
				
				if(!uni.$u.test.mobile(this.user_bank_card_mobile)){
					uni.showToast({
						icon:'none',
						title:'手机号输入不正确'
					});
					this.setData({
						isUserMobile: !1
					})
					return
				}else{
					
					this.setData({
						isUserMobile: !0
					})
				}
				
				this.update();


				/*
				if (!that.$.isNull(this.user_idcard) && !this.isCardNo) {
					return;
				}
				*/
			   
				/*
				if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(this.user_email))
				{
					this.setData({isUserEmail: !1});
					return
				}*/

				/*
				if (!that.$.isNull(this.user_mobile)) {
					this.update();
				} else if (that.$.isNull(this.user_mobile)) {
					this.setData({
						isUserMobile: !1
					});
				} else if (!/^1[23456789]\d{9}$/.test(this.user_mobile)) {
					this.setData({
						isUserMobile: !1
					});
				} else if (this.user_mobile == this.userInfo.user_mobile) {
					that.$.confirm("你已经绑定过该手机！");
				} else if (that.$.isNull(this.mobile_code)) {
					this.setData({
						isCode: !1
					});
				} else {}
				*/
			},
            // 接口方法
			update: function() {
				var that = this;
				
				//判断是否是收款账户
				if(this.banklists[this.index]['bank_name'] == '微信' || this.banklists[this.index]['bank_name'] == '支付宝')
				{
					this.user_bank_card_code ? this.setData({
						isbankAccount: !0
					}) : this.setData({
						isbankAccount: !1
					}) 
				}
				else
				{
					  /^\d{5,25}$/.test(this.user_bank_card_code) ? this.setData({
						isbankAccount: !0
					}) : this.setData({
						isbankAccount: !1
					}) 
				}
			
				this.user_bank_card_address ? that.$.isNull(this.user_bank_card_address) ? this.setData({
					isbankName: !1
				}) : this.setData({
					isbankName: !0
				}) : this.setData({
					isbankName: !0
				}); 
				
				that.$.isNull(this.user_bank_card_name) ? this.setData({
					isName: !1
				}) : this.setData({
					isName: !0
				});


				if(this.isbankName && this.isName  && this.isbankAccount)
				{
					var params = {
						bank_name: this.bank_name ? this.bank_name : that.banklists[0]['bank_name'],
						bank_id: this.bank_id ? this.bank_id : that.banklists[0]['bank_id'],
						user_bank_card_address: this.user_bank_card_address,
						user_bank_card_code: this.user_bank_card_code,
						user_bank_card_name: this.user_bank_card_name,
						user_bank_card_mobile: this.user_bank_card_mobile,
					};

					if(that.id)
					{
						var url = this.Config.URL.pay.edit_user_bank
						params.id = that.id
					}
					else
					{
						var url = this.Config.URL.pay.add_user_bank
					}

					that.$.request({
						url: url,
						data: params,
						success: function(data, status, msg, code) {
							if (status == 200) {
								
								let message;
								if(that.id){
									message = '编辑成功';
								}else{
									message = '添加成功';
								}
								uni.showToast({
									icon:'success',
									title: message,
									success:function(){
										setTimeout(function () {
											that.$.navigateBack(1, function () {
											})
										}, 1e3)
									}
								})
						
							} else {
								that.$.confirm(msg);
							}
						}
					});
				}
			},

			IdentityCodeValid: function(e) {
				var t = {
						11: "北京",
						12: "天津",
						13: "河北",
						14: "山西",
						15: "内蒙古",
						21: "辽宁",
						22: "吉林",
						23: "黑龙江 ",
						31: "上海",
						32: "江苏",
						33: "浙江",
						34: "安徽",
						35: "福建",
						36: "江西",
						37: "山东",
						41: "河南",
						42: "湖北 ",
						43: "湖南",
						44: "广东",
						45: "广西",
						46: "海南",
						50: "重庆",
						51: "四川",
						52: "贵州",
						53: "云南",
						54: "西藏 ",
						61: "陕西",
						62: "甘肃",
						63: "青海",
						64: "宁夏",
						65: "新疆",
						71: "台湾",
						81: "香港",
						82: "澳门",
						91: "国外 "
					},
					n = !0;
				if (!e || !/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(
						e)) {
					n = !1;
				} else if (!t[e.substr(0, 2)]) {
					n = !1;
				} else if (e.length == 18) {
					e = e.split("");
					var r = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
						i = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2],
						s = 0,
						o = 0,
						u = 0;
					for (var a = 0; a < 17; a++) {
						o = e[a], u = r[a], s += o * u;
					}
					var f = i[s % 11];
					i[s % 11] != e[17].toUpperCase() && (n = !1)
				}
				return n
			},



		}
	};
</script>

<style lang="scss" scoped>
	// @import "../../styles/_variables";
   
    .page{
		background-color: #FFFFFF;
		width: 100%;
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		bottom:0;
    }
   
   .m-cells::before{border: none;}
   .m-cells::after{border: none;}
   
   .m-cell{
	   
		padding: 25rpx;
		border-bottom:#EEEEEE 1rpx solid ;
		display: flex;
		align-items: center;
		// background-color: #007AFF;
		.m-cell-hd {
			height: 50rpx;
			line-height: 50rpx;
			color: #333333;
			font-size: 32rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, PingFang SC;
			// background-color: #007AFF;	
		}
		
		.m-cell-bd{
			height: 50rpx;
			line-height: 50rpx;
			color: #333333;
			font-size: 32rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, PingFang SC;
			// background-color: #007AFF;
			
			.m-input-style{
				height: 50rpx;
				line-height: 50rpx;
				width: 400rpx;
			}
			
		}

   }
   
   
	.m-cell-bd label {
		color: #888;
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
		padding: 20upx;
	}

	.m-code {
		right: 210upx;
	}

	.m-vcode-btn {
		width: 150upx;
		text-align: center;
	}

	.uni-uploader__file {
		width:120upx;
		height:120upx;
		.uni-uploader__img {
			width:100%;
			height:100%;
			border-radius: 50%;
		}
	}
</style>

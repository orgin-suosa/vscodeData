<template name="payment-box">
	<view>
		<view>
			<view class="uni-list">
				<label class="uni-list-cell uni-list-cell-pd"
					v-if="defaultUserMoney && paymentDataDefault.user_money && blanceChannel.money">
					<view style="color: #333333;font-size: 26rpx;">
						{{sprintf(__('账户余额 (￥%s)'), paymentDataDefault.user_money)}}
					</view>
					<view>
						<switch @change="switchMoney" />
					</view>
				</label>
				<label class="uni-list-cell uni-list-cell-pd"
					v-if="defaultUserMoney && paymentDataDefault.user_points && blanceChannel.points">
					<view style="color: #333333;font-size: 26rpx;">
						{{sprintf(__('账户积分 (￥%s)'), paymentDataDefault.user_points)}}
					</view>
					<view>
						<switch @change="switchPoints" />
					</view>
				</label>

				<label class="uni-list-cell uni-list-cell-pd"
					v-if="defaultUserMoney && paymentDataDefault.user_recharge_card && blanceChannel.recharge_card">
					<view style="color: #333333;font-size: 26rpx;">
						{{sprintf(__('充值余额 (￥%s)'), paymentDataDefault.user_recharge_card)}}
					</view>
					<view>
						<switch @change="switchRechargeCard" />
					</view>
				</label>

				<label class="uni-list-cell uni-list-cell-pd"
					v-if="defaultUserMoney && paymentDataDefault.user_sp && blanceChannel.sp">
					<view style="color: #333333;font-size: 26rpx;">
						{{sprintf(__('现金券 (￥%s)'), paymentDataDefault.user_sp)}}
					</view>
					<view>
						<switch @change="switchSp" />
					</view>
				</label>

				<label v-if="defaultUserMoney && (userMoney || userPoints || userSp || userRechargeCard)"
					class="uni-list-cell uni-list-cell-pd" style="line-height: 50px;height: 50px;padding: 0upx 30upx;">
					<view>
						<input style="color:#666666;font-size:26rpx;width:100%;" class="uni-input" password type="text"
							:placeholder="__('请输入支付密码')" name="password" :value="password" @input="passwordChange" />
					</view>
				</label>


				<!-- #ifdef MP-WEIXIN || MP-TOUTIAO -->
				<radio-group @change="paymentChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in providerList"
						v-if="$.inArray(h5WeChatMPpayList, item.id)" :key="index">
						<view style="line-height: 35px;height: 35px;">
							<image
								:src="'/static/images/pay_type/' + (item.id=='wxpay' ? 'wx_native' : item.id) + '.png'"
								mode="heightFix" style="height: 35px;"></image>
						</view>
						<view>
							<radio :value="index+''" :checked="index==paymentIndex" />
						</view>
					</label>
				</radio-group>
				<!-- #endif -->

				<!-- #ifdef APP-PLUS -->
				<radio-group @change="paymentChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in providerList" :key="index">
						<view
							style="line-height: 44rpx;height: 44rpx;display: flex;flex-direction: row;align-items: center;">
							<!-- <image
								:src="'/static/images/pay_type/' + (item.id=='wxpay' ? 'wx_native' : item.id) + '.png'"
								mode="heightFix" style="height: 35px;"></image> -->
							<image :src="'/static/images/pay_type/' + item.id + 'icon.png'"
								style="width: 44rpx;height: 44rpx;"></image>
							<text class=""
								style="line-height: 44rpx;height: 44rpx;color:background-color: aqua; 32rpx;padding-left: 25rpx;font-weight: 400;font-family: PingFangSC-Regular, PingFang SC;">{{item.name}}</text>

						</view>
						<view>
							<radio :value="index+''" :checked="index==paymentIndex ? true : false" />
						</view>
					</label>
				</radio-group>
				<!-- #endif -->

				<!-- #ifdef H5 -->
				<radio-group @change="paymentChange" v-if="isWeixin">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in providerList"
						v-if="$.inArray(h5WeChatpayList, item.id)" :key="index">
						<view
							style="line-height: 44rpx;height: 44rpx;display: flex;flex-direction: row;align-items: center;">
							<!-- <image
								:src="'/static/images/pay_type/' + (item.id=='wxpay' ? 'wx_native' : item.id) + '.png'"
								mode="heightFix" style="height: 35px;"></image> -->
							<image :src="'/static/images/pay_type/' + item.icon + '.png'"
								style="width: 44rpx;height: 44rpx;"></image>
							<text class=""
								style="line-height: 44rpx;height: 44rpx;color: #333333;font-size: 32rpx;padding-left: 25rpx;font-weight: 400;font-family: PingFangSC-Regular, PingFang SC;">{{item.name}}</text>

						</view>
						<view>
							<radio :value="index+''" :checked="index==paymentIndex" />
						</view>
					</label>
				</radio-group>
				<radio-group @change="paymentChange" v-else>
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in providerList" :key="index">
						<view
							style="line-height: 44rpx;height: 44rpx;display: flex;flex-direction: row;align-items: center;">
							<!-- <image
								:src="'/static/images/pay_type/' + (item.id=='wxpay' ? 'wx_native' : item.) + '.png'"
								mode="heightFix" style="height: 35px;"></image> -->
							<!-- 	<image
									:src="'/static/images/pay_type/' + item.icon + '.png'"
									mode="heightFix" style="width: 44rpx;height: 44rpx;"></image> -->

							<image :src="'/static/images/pay_type/' + item.icon + '.png'"
								style="width: 44rpx;height: 44rpx;"></image>
							<text class=""
								style="line-height: 44rpx;height: 44rpx;color: #333333;font-size: 32rpx;padding-left: 25rpx;font-weight: 400;font-family: PingFangSC-Regular, PingFang SC;">{{item.name}}</text>
						</view>
						<view>
							<radio :value="index+''" :checked="index==paymentIndex" />
						</view>
					</label>
				</radio-group>
				<!-- #endif -->
			</view>
			<view class="pay-agreement">
				<label class="pay-agreement-label" style="display: flex;align-content: center;align-items: flex-end;">
					<radio :checked="checkAgreement" @click="agreement" style="font-size: 24rpx;">
						<text
							style="color: rgba(204, 204, 204, 1);font-size: 20rpx;margin-right:10rpx;">{{__('已阅读并同意')}}</text>
					</radio>
					<navigator :url="'/edu/order/protocol?product_id='+product_id"
						style="color: rgba(76, 111, 232, 1);font-size: 20rpx;" open-type="navigate">{{__('课程服务协议')}}
					</navigator>
				</label>
			</view>
			<view class="pay-foot">
				<view class="pay-foot-div">
					<text class="pay-foot-font">商品合计:</text>
					<text class="pay-foot-price-symbol">¥</text>
					<text class="pay-foot-price">{{paymentDataDefault.orderSelMoneyAmount}}</text>
				</view>
				<view class="pay-foot-div">
					<button class="pay-foot-button" @tap="confirmPayment" :loading="loading">{{__('立即支付')}}</button>
				</view>

			</view>
		</view>
	</view>

</template>


<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';

	// #ifdef H5

	import wPay from "../helpers/pPay";

	// #endif


	export default {
		name: "payment-box",
		props: {
			order_id: {
				type: String,
				default: ''
			},
			product_id: {
				type: Number,
				default: 0
			},
			kind: {
				type: String,
				default: 'order' //favorable
			},
			defaultUserMoney: {
				type: Boolean,
				default: true
			},
			paymentDataDefault: {
				type: Object,
				default () {
					return {
						order_id: '',
						orderSelMoneyAmount: 0,
						user_money: 0,
						user_points: 0,
						user_recharge_card: 0,
						user_sp: 0
					}
				},
			}
		},
		data() {
			return {
				checkAgreement: true,
				loading: false,
				isHistoryLoading: false,
				// h5payList:['paypal', 'redsys', 'payu', 'ccav','alipay'],
				h5payList: ['paypal', 'redsys', 'payu', 'ccav'],
				h5WeChatpayList: ['wxpay', 'bankpay'],
				h5WeChatMPpayList: ['wxpay'],
				providerList: [{
						name: '支付宝',
						id: 'alipay',
						icon: 'alipayicon',
						loading: false
					},
					{
						name: '微信',
						id: 'wxpay',
						icon: 'wxpayicon',
						loading: false
					},
					// {
					// 	name: '银行卡支付',
					// 	id: 'bankpay',
					// 	icon: 'bankpayicon',
					// 	loading: false
					// },
					{
						name: 'Paypal',
						id: 'paypal',
						icon: 'wxpayicon',
						loading: false
					},
				],
				blanceChannel: {
					money: false,
					points: false,
					recharge_card: false,
					sp: false
				},
				showBoxView: true,
				userMoney: false,
				userPoints: false,
				userRechargeCard: false,
				userSp: false,
				password: '', //支付密码
				paymentIndex: 0,
				isWeixin: false,

				order_id_box: this.order_id
			}
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
		created: function() {

			let that = this;
			// #ifdef APP-PLUS
			uni.getProvider({
				service: "payment",
				success: (e) => {

					console.log("----payment success----", e);

					this.providerList = e.provider.map((value) => {

						switch (value) {
							case 'alipay':
								return {
									name: '支付宝',
										id: value,
										icon: 'alipayicon',
										loading: false
								}
								case 'wxpay':
									return {
										name: '微信',
											id: value,
											icon: 'wxpayicon',
											loading: false
									}


									/*
																case 'baidu':
																	return {
																		name: '百度',
																		id: value,
																		loading: false
																	}*/
						}
					})

					// this.providerList.push({
					// 	name: 'Paypal',
					// 	id: 'paypal',
					// 	loading: false
					// });


					// this.providerList.push({
					// 	name: 'Redsys',
					// 	id: 'redsys',
					// 	loading: false
					// });

					// this.providerList.push({
					// 	name: 'Payu',
					// 	id: 'payu',
					// 	loading: false
					// });

					// this.providerList.push({
					// 	name: 'Ccav',
					// 	id: 'ccav',
					// 	loading: false
					// });

					// this.providerList.push({
					// 	name: 'Cash on delivery',
					// 	id: 'offline',
					// 	loading: false
					// });

					console.log("---providerList111---", this.providerList);

					this.providerList = this.providerList.filter(n => n);
					console.log("---providerList112---", this.providerList);

					// for(item of this.providerList){

					// 	console.log('---item---',item );

					// }

				},
				fail: (e) => {
					//console.log("获取登录通道失败：", e);
				}
			});
			// #endif

			// #ifdef H5
			if (that.$.isWeixin()) {
				this.setData({
					isWeixin: true
				});
			} else {}
			// #endif

			//处理有效的支付方式
			setTimeout(() => {
				this.getPlantformInfo((plantformInfo) => {
					if (typeof plantformInfo.payment_channel_code_row != 'undefined') {

						console.log("----payment--list-1---", this.providerList);

						var tk = this.providerList.length;

						while (tk--) {
							let tmp_code = this.providerList[tk].id;
							//如果启用了支付方式
							if (that.$.inArray(plantformInfo.payment_channel_code_row,
									tmp_code)) {

							} else {
								//删除
								this.providerList.splice(tk, 1);
							}
						}

						//判断余额支付途径blanceChannel
						let tmpList = ['money', 'points', 'recharge_card', 'sp']
						for (var tk in tmpList) {
							//如果启用了支付方式
							if (that.$.inArray(plantformInfo.payment_channel_code_row, tmpList[tk])) {
								this.blanceChannel[tmpList[tk]] = true;
							} else {
								//删除
								this.blanceChannel[tmpList[tk]] = false;
							}
						}

						this.providerList.push({
							name: '银行卡支付',
							id: 'bankpay',
							icon: 'bankpayicon',
							loading: false
						});
						if (that.$.isWeixin()) {
							this.setData({
								h5WeChatpayList: ['wxpay', 'bankpay', 'tlpay'],
							});
							this.providerList.push({
								name: '通联支付',
								id: 'tlpay',
								icon: 'tlpay',
								loading: false
							});
						}
						console.log("----payment--list--2--", this.providerList);

						this.$forceUpdate();
					}
				});
			}, 200);
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			confirmPayment(e) {
				let that = this;
				if (that.isHistoryLoading) {
					return;
				}
				that.isHistoryLoading = true;
				// 检验课程服务协议是否选择
				if (!this.checkAgreement) {
					that.$.showModal({
						content: that.__("请阅读并同意课程服务协议！"),
						showCancel: false
					});
					return;
				}

				if ((this.userMoney || this.userPoints || this.userSp || this.userRechargeCard) && !this.password) {
					that.$.showModal({
						content: that.__("请输入余额支付密码！"),
						showCancel: false
					});

					return
				}

				this.$emit('submitOrder', 1, (res) => {
					if (res) {
						console.log('----submitOrder---res---', res);
						that.order_id_box = res;
						// #ifdef APP-PLUS
						if (this.providerList[this.paymentIndex].id == 'bankpay') {

							console.log('----submitOrder--APP-PLUS--bankpay---');
							let redirect_url = '/edu/order/waitorder';
							that.$.gopage(redirect_url);

						} else if (that.$.inArray(this.h5payList, this.providerList[this.paymentIndex].id)) {
							this.h5OldPay(this.providerList[this.paymentIndex], this.paymentIndex)
						} else {
							this.requestPayment(this.providerList[this.paymentIndex], this.paymentIndex);
						}
						// #endif

						// #ifdef MP-WEIXIN
						wx.login({
							success: res => {
								// 登录注册接口
								if (res.code) {
									// 调用服务端登录接口，发送 res.code 到服务器端换取 openId, sessionKey, unionId并存入数据库中
									let params = {
										'code': res.code
									};

									that.$.request({
										url: that.cf.URL.get_miniapp_open_id,
										data: params,
										success: (data, status, msg, code) => {
											that.weixinPay(data.openid)
										},
										fail: (err, status) => {
											////console.info(err);
											////console.info(status);
										}
									})
								} else {
									that.$.showModal({
										content: that.__("授权失败"),
										showCancel: false
									})
								}
							}
						});
						// #endif
						// #ifdef H5
						if (that.$.isWeixin()) {

							//银联支付
							if (this.providerList[this.paymentIndex].id == 'bankpay') {

								console.log('----submitOrder---isWeixin---');
								let redirect_url = '/edu/order/waitorder';
								that.$.gopage(redirect_url);

							} else if (this.providerList[this.paymentIndex].id == 'tlpay') {
								that.tlpay()

							} else {
								this.mpPay();
							}

						} else {

							//银联支付
							if (this.providerList[this.paymentIndex].id == 'bankpay') {

								console.log('----submitOrder---222---');
								let redirect_url = '/edu/order/waitorder';
								that.$.gopage(redirect_url);

							} else if (this.providerList[this.paymentIndex].id == 'wxpay') {
								//this.h5OldPay(this.providerList[this.paymentIndex], this.paymentIndex)
								this.h5Pay(this.providerList[this.paymentIndex], this.paymentIndex)
							} else if (that.$.inArray(this.h5payList, this.providerList[this.paymentIndex].id)) {
								this.h5OldPay(this.providerList[this.paymentIndex], this.paymentIndex)
							} else {
								this.h5Pay(this.providerList[this.paymentIndex], this.paymentIndex)
							}
						}
						// #endif


						// #ifdef MP-BAIDU
						this.baiduPay()
						// #endif
					}
				})
			},
			switchMoney(e) {
				// #ifdef MP_BAIDU
				this.userMoney = e.detail.checked;
				// #endif

				// #ifndef MP_BAIDU
				this.userMoney = e.detail.value;
				// #endif
			},
			agreement() {
				this.checkAgreement = !this.checkAgreement
			},
			tlpay() {
				let that = this
				let uid = that.userInfo.user_id;
				let key = uni.getStorageSync('ukey');
				let params = {
					userId: uid, //先用手机号，后面会加一个userId
					productId:that.product_id,
					payWay: "W01",
					token:`Bearer ${key}`,
					// userVoucherId:''
				}
				
				uni.request({
					// url: 'https://shop-qa.zcskjy.com/api/mobile/account/autoLogin/autoLoginAndOffer',
					url: that.cf.URL.autoLoginAndOffer,
					method: 'POST',
					data: params,
					success: (res) => {
						
						// alert(res.data.data.payStr)
						if (res?.data?.data?.payStr) {
							window.location.href = res.data.data.payStr
						} else {
							alert('订单生成异常，请联系相关开发人员')
						}
						// window.location.href = that.response
					}
				});
				// that.$.request({
				// 	url: 'https://shop-qa.zcskjy.com/api/mobile/account/autoLogin/autoLoginAndOffer',
				// 	data: params,
				// 	loading: false,
				// 	success: function(data, status, msg, code) {
				// 			alert('s='+data)
				// 	},
				// 	fail: function(data, status, msg, code) {
				// 			alert('e='+msg)
				// 	}
				// });

			},
			switchPoints(e) {
				// #ifdef MP_BAIDU
				this.userPoints = e.detail.checked;
				// #endif

				// #ifndef MP_BAIDU
				this.userPoints = e.detail.value;
				// #endif
			},

			switchRechargeCard(e) {
				// #ifdef MP_BAIDU
				this.userRechargeCard = e.detail.checked;
				// #endif

				// #ifndef MP_BAIDU
				this.userRechargeCard = e.detail.value;
				// #endif
			},

			switchSp(e) {
				// #ifdef MP_BAIDU
				this.userSp = e.detail.checked;
				// #endif

				// #ifndef MP_BAIDU
				this.userSp = e.detail.value;
				// #endif
			},



			passwordChange(e) {
				this.password = e.target.value;
			},

			paymentChange(e) {
				//console.log("type:" + e.detail.value);
				let payment_index = parseInt(e.detail.value);
				this.paymentIndex = payment_index;
			},
			async weixinPay(openid) {
				let that = this;
				//console.log("发起支付");
				this.loading = true;

				let result = await this.getOrderInfo('wxpay', openid);
				let orderInfo = result.data;

				if (result.status !== 200) {
					//console.log("获得订单信息失败", orderInfo);
					if (result.code == 101) {
						that.$.showModal({
							title: that.__('提示'),
							content: that.__('未设置支付密码，去设置？'),
							success: res => {
								if (res.confirm) {
									let redirect_url = '/member/member/paypwd';
									that.$.gopage(redirect_url);
								} else if (res.cancel) {}

							}
						});
					} else {
						that.$.showModal({
							content: result.msg || that.__("获得订单信息失败"),
							showCancel: false
						})
					}

					this.loading = false;
					return;
				} else {}

				if (orderInfo.paid) {
					this.loading = false;

					this.$emit('onPaid', orderInfo);
				} else {

					let paymentData = orderInfo.data;
					that.$.requestPayment({
						timeStamp: paymentData.timeStamp + '',
						nonceStr: paymentData.nonceStr,
						package: paymentData.package,
						signType: paymentData.signType,
						paySign: paymentData.paySign,
						success: (res) => {
							this.$emit('onPaid', orderInfo);
						},
						fail: (res) => {
							that.$.showModal({
								content: that.__("支付失败"),
								showCancel: false
							})

							this.$emit('onFail');
						},
						complete: () => {
							this.loading = false;
						}
					})
				}

			},
			async baiduPay() {
				let that = this;
				this.loading = true;

				let result = await this.getOrderInfo('baidu');
				let orderInfo = result.data;

				if (result.status !== 200) {
					//console.log("获得订单信息失败", orderInfo);
					if (result.code == 101) {
						that.$.showModal({
							title: that.__('提示'),
							content: that.__('未设置支付密码，去设置？'),
							success: res => {
								if (res.confirm) {
									let redirect_url = '/member/member/paypwd';
									that.$.gopage(redirect_url);
								} else if (res.cancel) {}

							}
						});
					} else {
						that.$.showModal({
							content: result.msg || that.__("获得订单信息失败"),
							showCancel: false
						})
					}

					this.loading = false;
					return;
				} else {}

				if (orderInfo.paid) {
					this.loading = false;

					this.$emit('onPaid', orderInfo);
				} else {

					let paymentData = orderInfo.data;
					that.$.requestPayment({
						timeStamp: paymentData.timeStamp,
						nonceStr: paymentData.nonceStr,
						package: paymentData.package,
						signType: 'MD5',
						paySign: paymentData.paySign,
						success: (res) => {
							this.$emit('onPaid', orderInfo);
						},
						fail: (res) => {
							////console.info(res.errMsg);
							that.$.showModal({
								content: that.__("支付失败"),
								showCancel: false
							})

							this.$emit('onFail');
						},
						complete: () => {
							this.loading = false;
						}
					})
				}

			},

			async requestPayment(e, index) {
				let that = this;

				this.loading = true;
				this.providerList[index].loading = true;
				let result = await this.getOrderInfo(e.id);

				let orderInfo = result.data;
				console.log(JSON.stringify(result))
				if (result.status !== 200) {
					if (result.code == 101) {
						that.$.showModal({
							title: that.__('提示'),
							content: that.__('未设置支付密码，去设置？'),
							success: res => {
								if (res.confirm) {
									let redirect_url = '/member/member/paypwd';
									that.$.gopage(redirect_url);
								} else if (res.cancel) {}

							}
						});
					} else if (result.code == 201) {
						that.$.showModal({
							content: result.msg || that.__("微信订单已存在"),
							showCancel: false
						})
					} else {
						that.$.showModal({
							content: result.msg || that.__("获得订单信息失败"),
							showCancel: false
						})
					}

					this.loading = false;
					return;
				} else {}

				if (orderInfo.paid) {
					this.loading = false;

					this.$emit('onPaid', orderInfo);
				} else {
					let pay_params = Object.assign({}, orderInfo.data);
					delete pay_params['order_id'];

					pay_params['partnerid'] = pay_params['partnerid'] + "";
					pay_params['timestamp'] = pay_params['timestamp'] + "";

					that.$.requestPayment({
						provider: e.id,
						orderInfo: e.id == 'alipay' ? orderInfo.mweb_url : pay_params,
						success: (e) => {
							//console.log("success", e);
							//进入订单页面

							this.$emit('onPaid', orderInfo);
						},
						fail: (e) => {
							console.log("fail", e);
							that.$.showModal({
								content: that.__("支付失败"),
								showCancel: false
							})


							this.$emit('onFail');
						},
						complete: () => {

							this.loading = false;
							this.providerList[index].loading = false;
						}
					})
				}
			},
			async h5OldPay(e, index) {
				let that = this;
				//console.log("发起支付");
				this.loading = true;
				this.providerList[index].loading = true;

				//页面直接跳转支付模式
				var id = uni.getStorageSync('uid');
				var key = uni.getStorageSync('ukey');


				let appid = "";
				let payment_channel_code = e.id;

				if (e.id == 'wxpay') {
					payment_channel_code = 'wx_native';
				}

				var pm_money = 0;
				var pm_recharge_card = 0;
				var pm_points = 0;
				var pm_credit = 0;

				var password = this.password;
				var pay_sn = this.order_id_box;

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
					typ: 'e'
				}

				// #ifdef H5

				// #endif

				let url = that.$.createUrl(that.cf.URL.pay.pay, params);


				// #ifdef APP-PLUS
				that.$.gotopage(
					'/pagesub/webpage/webpage?u=' +
					encodeURIComponent(url)
				);

				// #endif


				// #ifdef H5
				that.$.showModal({
					title: that.__('提示'),
					content: that.__('是否支付完成？'),
					success: res => {
						if (res.confirm) {
							let redirect_url = that.cf.SiteUrl +
								'/h5/edu/order/detail?on=' + that
								.order_id_box;

							if (that.kind == 'order') {} else if (that.kind ==
								'favorable') {
								redirect_url = that.cf.SiteUrl +
									'/h5/chain/chain/favorabledetail?order_id=' +
									that.order_id_box;
							} else {

							}

							window.location.href = redirect_url;
						} else if (res.cancel) {

							let redirect_url = that.cf.SiteUrl +
								'/h5/edu/order/detail?on=' + that
								.order_id_box;
							if (that.kind == 'order') {} else if (that.kind ==
								'favorable') {
								redirect_url = that.cf.SiteUrl +
									'/h5/chain/chain/favorabledetail?order_id=' +
									that.order_id_box;
							} else {

							}

							window.location.href = redirect_url;
						}
					}
				});

				window.location.href = url;
				// #endif
			},
			async h5Pay(e, index) {
				let that = this;
				//console.log("发起支付");
				this.loading = true;
				this.providerList[index].loading = true;

				let result = await this.getOrderInfo(e.id);
				let orderInfo = result.data;
				if (result.status !== 200) {
					//console.log("获得订单信息失败", orderInfo);
					if (result.code == 101) {
						that.$.showModal({
							title: that.__('提示'),
							content: that.__('未设置支付密码，去设置？'),
							success: res => {
								if (res.confirm) {
									let redirect_url = '/member/member/paypwd';
									that.$.gopage(redirect_url);
								} else if (res.cancel) {}

							}
						});
					} else if (result.code == 201) {
						that.$.showModal({
							content: result.msg || that.__("微信订单已存在"),
							showCancel: false
						})
					} else {
						that.$.showModal({
							content: result.msg || that.__("获得订单信息失败"),
							showCancel: false
						})
					}

					this.loading = false;
					return;
				} else {}

				if (orderInfo.paid) {
					this.loading = false;

					this.$emit('onPaid', orderInfo);
				} else {

					that.$.showModal({
						title: that.__('提示'),
						content: that.__('是否支付完成？'),
						success: res => {
							if (res.confirm) {
								this.$emit('onPaid', orderInfo);
							} else if (res.cancel) {
								this.$emit('onFail');
							}
						}
					});

					if (e.id == 'alipay') {
						window.location.href = orderInfo.mweb_url;
						//window.open(orderInfo.data.mweb_url);
					} else {
						let redirect_url = that.cf.SiteUrl +
							'/h5/edu/order/detail?init_pay_flag=1&on=' + that
							.order_id_box;
						if (that.kind == 'order') {} else if (that.kind == 'favorable') {
							redirect_url = that.cf.SiteUrl +
								'/h5/chain/chain/favorabledetail?init_pay_flag=1&order_id=' +
								that.order_id_box;
						} else {

						}
						//页面已经跳转走了
						window.location.href = orderInfo.mweb_url + '&redirect_url=' +
							encodeURIComponent(
								redirect_url);
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
							success: res => {
								if (res.confirm) {
									let redirect_url =
										'/member/member/paypwd';
									that.$.gopage(redirect_url);
								} else if (res.cancel) {}

							}
						});
					} else {
						that.$.showModal({
							content: result.msg || that.__("获得订单信息失败"),
							showCancel: false
						})
					}

					this.loading = false;
					return;
				} else {}

				if (orderInfo.paid) {
					this.loading = false;

					this.$emit('onPaid', orderInfo);
				} else {
					wPay({
						appId: orderInfo.data.appId,
						timeStamp: orderInfo.data.timeStamp,
						nonceStr: orderInfo.data.nonceStr,
						signature: orderInfo.data.signType,
						package: orderInfo.data.package,
						paySign: orderInfo.data.paySign
					}, res => {
						//console.log('调用成功!');
						//进入订单页面

						//console.log("success", res);
						this.$emit('onPaid', orderInfo);

					}, fail => {
						console.log("orderInfo", orderInfo);
						//console.log('调用失败!');
						console.info(fail)
						that.$.showModal({
							content: that.__("支付失败"),
							showCancel: false
						})

						this.$emit('onFail');
					})
				}
			},
			getOrderInfo(payment_channel_code, openid) {
				let that = this;
				if (payment_channel_code == 'wxpay') {
					payment_channel_code = 'wx_native';
				}

				let appid = "";
				// #ifdef APP-PLUS
				appid = plus.runtime.appid;
				// #endif

				var pm_money = 0;
				var pm_recharge_card = 0;
				var pm_points = 0;
				var pm_sp = 0;
				var pm_credit = 0;

				var password = this.password;
				var pay_sn = this.order_id_box;

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
					typ: 'json'
				}

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

				return new Promise((res) => {
					that.$.request({
						url: url,
						data: params,
						success: (data, status, msg, code) => {
							res({
								data: data,
								status: status,
								msg: msg,
								code: code
							});
						},
						fail: (err, status) => {
							res({
								data: err,
								status: status
							});
						}
					})
				})
			},
		}
	}
</script>

<style>
	.m-panel-sp-icon {
		position: absolute;
		right: 20upx;
		top: 10upx;
	}

	.rmbLogo {
		font-size: 40upx;
	}

	.pay-foot {
		left: 0;
		padding: 30rpx 0;
		width: 100%;
		position: fixed;
		transform: translateZ(0);
		bottom: env(safe-area-inset-bottom);
		box-shadow: 0rpx -5rpx 14rpx #e3e6e6;
		bottom: constant(safe-area-inset-bottom);
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
		z-index: 9999;
		background-color: #ffffff;
	}

	.pay-foot-div {
		padding: 0 30rpx;
	}

	.pay-foot-price {
		padding: 0 5rpx;
		font-size: 36rpx;
		font-weight: 600;
		color: #F43D3E;
	}

	.pay-foot-price-symbol {
		font-size: 20rpx;
		color: #F43D3E;
		padding: 0 5rpx;
	}

	.pay-foot-font {
		font-weight: 500;
	}

	/deep/ .pay-foot-button {
		border-radius: 50rpx;
		background-color: #FF6860;
		padding: 0 60rpx;
		color: #FFFFFF;
	}

	.pay-agreement-label {
		display: flex;
		flex-direction: row;
		font-family: PingFangSC-Regular;
		font-size: xx-small;
	}

	/deep/ .pay-agreement-label .uni-radio-input {
		width: 22rpx;
		height: 22rpx;
	}

	/deep/ .pay-agreement-label .uni-radio-input-checked:before {
		font-size: 28rpx;
	}

	.pay-agreement {
		padding: 20rpx 30rpx;
	}

	/deep/ .uni-list::before {
		position: absolute;
		z-index: 10;
		right: 0;
		top: 0;
		left: 0;
		height: 0px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	/deep/ .uni-list-cell::after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 15px;
		height: 1rpx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #EEEEEE;
	}

	/deep/.uni-list:after {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1rpx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #EEEEEE;
	}

	/deep/ .uni-switch-input {
		-webkit-appearance: none;
		appearance: none;
		position: relative;
		width: 38px;
		height: 18px;
		margin-right: 5px;
		border: 1px solid #dfdfdf;
		outline: 0;
		border-radius: 16px;
		box-sizing: border-box;
		background-color: #dfdfdf;
		-webkit-transition: background-color .1s, border .1s;
		transition: background-color .1s, border .1s;
	}

	/deep/ uni-switch .uni-switch-input:after,
	uni-switch .uni-switch-input:before {
		width: 15px;
		content: " ";
		position: absolute;
		top: 0;
		left: 0;
		height: 15px;
		border-radius: 15px;
		transition: -webkit-transform .3s;
		-webkit-transition: -webkit-transform .3s;
		transition: transform .3s;
		transition: transform .3s, -webkit-transform .3s;
	}

	/deep/ uni-switch .uni-switch-input:before {
		width: 0px;
		background-color: #fdfdfd;
	}

	/deep/ uni-radio .uni-radio-input-checked {
		background-color: #FB6729 !important;
		border-color: #FB6729 !important;
		color: #fff !important;
	}

	/deep/ uni-switch .uni-switch-input.uni-switch-input-checked {
		background-color: #FB6729 !important;
		border-color: #FB6729 !important;
		color: #fff !important;
	}
</style>

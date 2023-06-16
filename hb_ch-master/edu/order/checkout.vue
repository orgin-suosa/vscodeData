<template>
	<view class="order-page">
		<hr style='background-color:#afafaf; height:3rpx; border:none;' />
		<view>
		</view>
		<view class="order-course-page">
			<view>
				<h4 class="order-course-title">商品信息</h4>
				<view class="order-course-detail">
					<view class="order-course-cover">
						<img :src="item_row.product_image" alt="">
					</view>
					<view class="order-course-info">
						<view>
							<h3>{{item_row.product_name}}</h3>
							<view class="order-font">{{item_row.product_tips}}</view>
							<view class="order-course-class order-font">
								<view>
									<image style="width: 23rpx;height: 23rpx;margin-top: 15rpx;"
										src="https://qnsp.zcskjy.com/zc_images/edu_pic/detail_video.png"
										v-if="course.course_file_type === 0"></image>
									<text v-else-if="course.course_file_type === 1" v-else
										class="iconfont icon-a-ziyuan11"
										style="font-size: small;padding-right: 10rpx"></text>
									<text v-else class="iconfont icon-yinpin"
										style="font-size: small;padding-right: 10rpx"></text>
									<text style="margin-left: 10rpx;">{{chapter.chapterNum}}节课时</text>
								</view>
								<view>有效期：{{course.product_valid_period}}</view>
							</view>
						</view>
						<view>
							<text class="order-course-price-symbol">¥</text>
							<text class="order-course-price">{{getPrice(item_row.item_unit_price)}}</text>
						</view>

					</view>
				</view>
			</view>

			<view class="m-cells total-info" v-if="(voucher_items.length>0)">
				<!-- 优惠券，初始为0，选择优惠券后再修改 -->
				<view class="m-cell" @click="suitcouponlist">
					<view class="m-cell-bd">
						<text>{{__('优惠券')}}</text>
						<text class="highlight12">
							({{voucher_items.length}}{{__('张优惠券可用')}})
						</text>
						<!-- <text class="highlight12" v-else>{{__('(无可用优惠券)')}}</text> -->
					</view>
					<view class="m-cell-ft m-order-typetxt" v-if="(voucher_use_row && voucher_use_row.voucher_price)">
						-{{__('￥')}}{{voucher_use_row.voucher_price}}
					</view>
					<view class="arrow m-cell-access">
						<view class="m-cell-ft "></view>
					</view>
				</view>
			</view>
			<!-- <view
				style="width: 100%;padding: 20rpx 30rpx;clear:both;box-sizing:border-box;line-height: 45rpx;font-size: 32rpx;color:#333333;font-weight: 600; border-bottom: 1px solid #F5F5F5;">
				支付方式
			</view> -->
			<view class="order-course-pay-type" v-show="showPayBox">

				<view class="order-course-pay">
					<payment-box :product_id="product_id" :paymentDataDefault="paymentData" :order_id="order_id"
						ref="paymentBox" @onCancel="onCancel" @submitOrder="submitOrder" @onPaid="onPaid"
						@onFail="onFail"></payment-box>
				</view>

			</view>
		</view>
		<view class="order-foot" v-if="order_id">
			<view class="order-foot-div">
				<text class="order-foot-font">商品合计:</text>
				<text class="order-foot-price-symbol">¥</text>
				<text class="order-foot-price">{{paymentData.orderSelMoneyAmount}}</text>
			</view>
			<!-- <view class="order-foot-div">
				<form report-submit="true" @submit="submitOrder">
					<button class="order-foot-button" formType="submit">{{__("提交订单")}}</button>
				</form>
			</view> -->
		</view>
	</view>
</template>

<script>
	import paymentBox from '@/components/payment-box-edu.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import $ from "../../helpers/util";
	export default {
		data() {
			return {
				showPayBox: false,
				is_paid: undefined,
				orderSelMoneyAmount: 0,
				voucher_use_row: {},
				voucher_items: [],
				order_id: "",
				product_id: undefined,
				paymentData: {
					order_id: undefined,
					orderSelMoneyAmount: undefined,
					user_money: undefined,
					user_points: undefined,
					user_recharge_card: undefined,
					user_sp: undefined,
				},
				cart_id: '',
				distributor_user_id: '',
				course: {},
				chapter: {},
				item_row: {},
				product: {},
				checkAgreement: false,
				providerList: [{
						name: '支付宝',
						id: 'alipay',
						loading: false
					},
					{
						name: '微信',
						id: 'wxpay',
						loading: false
					},
					{
						name: '银行卡支付',
						id: 'bankpay',
						loading: false
					}
				],
			}
		},
		components: {
			paymentBox
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			this.showPayBox = true
			let cart_id = options.cart_id
			let distributor_user_id = options.distributor_user_id
			this.cart_id = cart_id
			if (options.distributor_user_id)
				this.distributor_user_id = distributor_user_id
			this.pCheckout(cart_id)
			this.notice.addNotification("RefreshCoupon", this.RefreshCoupon, this);
		},
		onUnload: function() {
			//移除通知
			var that = this
			this.notice.removeNotification("RefreshCoupon", that);
		},
		onBackPress() {

		},

		methods: {
			...mapMutations(['reloadUserResource', 'getUserInfo']),
			suitcouponlist: function(e) {
				let params = {
					val: JSON.stringify(this.voucher_items),
					user_voucher_id: this.voucher_use_row.user_voucher_id,
				}
				var that = this;
				var url = that.$.createUrl("/activity/coupon/member", params);
				that.$.navigateTo({
					url: url
				})
			},
			RefreshCoupon: function(options) {
				let user_voucher_id = options.user_voucher_id;
				if (user_voucher_id) {
					let voucher = this.voucher_items.find(s => s.user_voucher_id === user_voucher_id)
					if (voucher) {
						this.voucher_use_row = voucher
						let order_amount = parseFloat((this.orderSelMoneyAmount - voucher.activity_rule.voucher_price)
							.toFixed(12));
						order_amount = Math.max(0, order_amount)
						this.paymentData.orderSelMoneyAmount = order_amount
					}
				} else {
					this.voucher_use_row = {}
					this.$set(this.paymentData, "orderSelMoneyAmount", this.orderSelMoneyAmount)
				}
			},
			getPrice(item_unit_price) {
				if (item_unit_price || item_unit_price === 0) {
					return item_unit_price.toFixed(2)
				}
				return ""
			},
			agreement() {
				this.checkAgreement = !this.checkAgreement
			},
			pay() {
				uni.redirectTo({
					url: '/edu/order/pay-result' // 传递参数 id，值为1
				});
			},

			async pCheckout(cart_id) {
				console.info('----Order---ppppp--', cart_id);
				let params = {
					ifcart: 0,
					chain_id: 0,
					cart_id: cart_id,
					is_delivery: 0,
					if_virtual: 1,
				}
				let that = this
				that.$.request({
					url: this.Config.URL.cart.checkout,
					data: params,
					loading: false,
					success: function(data, status, msg, code) {

						if (200 === status) {
							console.info('-----ppppp----data---', data);
							if (data && data.items) {
								that.item_row = data.items[0].items[0];
								that.product_id = data.items[0].items[0].product_id
								that.voucher_items = data.items[0].voucher_items
								if (that.item_row) {
									that.course = data.items[0].items[0].course
									that.chapter = data.items[0].items[0].course.chapter
								}

								that.reloadUserResource(function(user_info) {

									console.info('---reloadUserRes---', user_info);

									that.paymentData.user_money = user_info.user_money
									that.paymentData.user_points = user_info.user_points
									that.paymentData.user_recharge_card = user_info
										.user_recharge_card
									that.paymentData.user_sp = user_info.user_sp
									that.orderSelMoneyAmount = data.orderSelMoneyAmount.toFixed(2)
									if (data.order_id) {
										that.order_id = data.order_id;
										that.paymentData.order_id = data.order_id
										that.paymentData.orderSelMoneyAmount = that
											.orderSelMoneyAmount
										that.showPayBox = true
									} else {
										that.paymentData.orderSelMoneyAmount = that
											.orderSelMoneyAmount
									}
								});

								console.info('---pppp---paymentData---', that.paymentData);
								console.info('---ppppp----that.order_id---', that.order_id);
							}
						} else {
							let item_id = Number(cart_id.split("|")[0]);
							that.$.confirm(that.__(msg), function(a) {
								if (a.confirm) {
									that.$.navigateTo({
										url: "/edu/course/class-detail?item_id=" + item_id
									})
									// uni.navigateBack({
									//   delta:1,//返回层数，2则上上页
									// })
								}
							});
						}
					},
					fail: function(err, ms) {
						that.$.confirm(err);
					}
				});
			},
			onFail: function(e) {
				let that = this;
				uni.navigateBack()
				// that.$.gotopage("/member/order/detail?on=" + this.order_id)
			},
			onCancel: function(e) {
				uni.navigateBack()
			},
			onPaid: function(e) {
				console.log('---order----onPaid----', e);
				//重新加载用户资源数据
				let that = this;
				that.reloadUserResource(function(user_info) {
					that.returnUrl(that.order_id);
				});
			},
			submitOrder: function(data, cab) {
				let that = this
				let disId = ""
				if (that.distributor_user_id != 'undefined')
					disId = that.distributor_user_id
				let params = {
					cart_id: that.cart_id,
					distributor_user_id: disId,
					ifcart: 0,
					chain_id: 0,
					payment_type_id: this.StateCode.PAYMENT_TYPE_ONLINE,
					delivery_time_id: 1,
					invoice_type_id: 1,
					is_edu: 1,
				}
				console.info('----submitOrder---click--');
				let voucher_use_row = this.voucher_use_row
				if (voucher_use_row && voucher_use_row.user_voucher_id) {
					params.user_voucher_ids = JSON.stringify([voucher_use_row.user_voucher_id])
				}

				that.$.request({
					url: that.Config.URL.edu.order_add,
					data: params,
					loading: false,
					success: function(data, status, msg, code) {
						console.info('----submitOrder---order_add--');
						if (200 === status) {
							that.is_paid = data.is_paid
							let is_paid = data.is_paid
							if (is_paid) {
								// 支付完成
								that.order_id = data.order_id.join(',')
								that.paymentData.orderSelMoneyAmount = data.orderSelMoneyAmount
								that.onPaid()
								// return 
							}

							that.setData({
								order_id: data.order_id.join(','),
							});
							console.log('----submitOrder-----addorder----order_id----', that.order_id);
							that.orderSelMoneyAmount = data.orderSelMoneyAmount.toFixed(2)

							that.setData({
								'paymentData': {
									order_id: that.order_id,
									orderSelMoneyAmount: that.orderSelMoneyAmount,
									user_money: data.user_money,
									user_points: data.user_points,
									user_recharge_card: that.userInfo.user_recharge_card,
									user_sp: that.userInfo.user_sp
								}
							});
							console.log('----submitOrder-----addorder---paymentData---', that.paymentData);
							console.log('----submitOrder-----addorder---cart_id---', that.cart_id);
							//重载数据
							// that.pCheckout(that.cart_id);
							return cab(that.order_id);
						} else {
							if (code === 77011) {
								that.$.gotopage("/member/member/bindphone");
							} else {
								return cab(null);
							}
						}
					},
					fail: function(data, status, msg, code) {
						that.$.showToast({
							title: msg
						})
					}
				});

			},
			returnUrl: function(order_id) {
				console.log('---order--checkout---order_id----', order_id);
				let url = this.$.sprintf("/edu/order/pay-result?order_id=%s", order_id);
				this.$.gotopage(url);
			}
		},
	};
</script>

<style>
	@import '@/components/audio/font/iconfont.css';

	page {
		background-color: #FFFFFF !important;
		min-height: 100% !important;
		height: 100% !important;
		font-family: PingFangSC-Medium, PingFang SC;
	}

	.order-course-page {
		background-color: #FFFFFF;
		padding: 0 25rpx;
	}

	.order-course-title {
		padding: 10rpx 0;
		font-size: 32rpx;
	}

	.order-course-detail {
		padding: 20rpx 0;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}

	.order-font {
		color: #666666;
		font-size: 24rpx;
	}

	.order-course-info {
		flex: 1;
		padding: 0 20rpx;
	}

	.order-course-cover {
		position: relative;
		display: block;
	}

	.order-course-cover img {
		width: 82px;
		height: 108px;
		border-radius: 3px;
	}

	.order-course-class {
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: space-between;
	}

	.order-course-class .icon-shipin {}

	.order-course-price-symbol {
		font-size: 20rpx;
		color: #F43D3E;
		padding: 0 5rpx;
	}

	.order-course-price {
		padding: 0 5rpx;
		font-size: 36rpx;
		font-weight: 600;
		color: #F43D3E;
	}

	/deep/ .order-foot-button {
		border-radius: 50rpx;
		background-color: #FF6860;
		padding: 0 60rpx;
		color: #FFFFFF;
	}

	.order-foot {
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
		background-color: #ffffff;
	}

	.order-foot-div {
		padding: 0 30rpx;
	}

	.order-foot-price {
		padding: 0 5rpx;
		font-size: x-large;
		font-weight: 500;
		color: #D84F4E;
	}

	.order-foot-price-symbol {
		font-size: small;
		color: #D84F4E;
		padding: 0 5rpx;
	}

	.order-foot-font {
		font-weight: 500;
	}

	.order-course-pay {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.m-order-typetxt {
		color: #DB384C;
	}
</style>

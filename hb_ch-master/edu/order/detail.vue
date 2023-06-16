<template>
	<view class="detail-page">
		<view class="order-detail">
			<view class="order-course-detail" @click="jumpDetail(item_id)">
				<view class="order-course-cover">
					<img :src="course.product_image" alt="">
				</view>
				<view class="order-course-info">
					<view>
						<h3>{{course.product_name}}</h3>
						<view>{{course.product_tips}}</view>
						<view class="order-course-class">
							<view style="display: flex;align-items: center">
								<u-icon labelSize="23rpx" labelColor="rgb(91,33,17)" size="28rpx"
									name="https://qnsp.zcskjy.com/zc_images/edu_pic/video_tag.png">
								</u-icon>
								<text style="padding: 0 10rpx">{{course.chapterNum}}节课时</text>
							</view>
							<view style="line-height: 60rpx">有效期：{{course.product_valid_period}}</view>
						</view>
					</view>
					<view style="color: #F43D3E;font-family: PingFangSC-Semibold, PingFang SC">
						<text style="font-size: xx-small;padding-right: 5rpx">¥</text>
						<text style="font-size: large;">{{getPrice(course.item_unit_price)}}</text>
					</view>

				</view>
			</view>
			<view class="order-detail-info">
				<view class="order-detail-info-title">
					<text class="icon"></text>
					<text>{{__("订单详情")}}</text>
				</view>
				<view class="order-detail-info-items">
					<view class="item" v-if="order.order_state_id !== 2010">
						<text>{{__("商品名称")}}</text>
						<text class="font">{{course.product_name}}</text>
					</view>
					<view class="item">
						<text>{{__("订单编号")}}</text>
						<text class="font">{{order.order_id}}</text>
					</view>
					<view class="item">
						<text>{{__("下单时间")}}</text>
						<text class="font">{{order.order_time}}</text>
					</view>
					<view class="item">
						<text>{{__("支付方式")}}</text>
						<text class="font">{{order.order_payment_name}}</text>
					</view>
					<view class="item">
						<text>{{__("商品总额")}}</text>
						<text class="font">{{"¥ "+getPrice(course.item_unit_price)}}</text>
					</view>
					<view class="item" v-if="order.order_state_id !== 2010">
						<text>{{__("课程协议")}}</text>
						<navigator :url="'/edu/order/protocol?product_id='+product_id" class="font"
							style="color: #4C6FE8">查看协议</navigator>
					</view>
				</view>
			</view>
			<view v-if="order.order_state_id === 2010"
				style="display: flex;flex-direction: row;justify-content:flex-end;padding: 120rpx 0;align-items: center">
				<text>{{__("需支付：")}}</text>
				<view style="color: #F43D3E;font-family: PingFangSC-Semibold, PingFang SC">
					<text style="font-size: xx-small;padding-right: 5rpx">{{__("¥")}}</text>
					<text style="font-size: large;">{{getPrice(order.trade_payment_money)}}</text>
				</view>
			</view>


		</view>
		<view class="order-detail-foot" v-if="order.order_state_id === 2010">
			<button class="order-detail-foot-button cancel" @click="cancelOrder" type="default">{{__("取消订单")}}</button>
			<button class="order-detail-foot-button pay" type="default" @click="toPay">{{__("立即支付")}}</button>
		</view>
		<view class="order-detail-foot-customer" v-else>
			<view>如果有问题，请 </view>
			<view style="color: #4C6FE8;padding-left: 10rpx" @click="jumpChat">联系客服</view>
		</view>
		<view class="cancel-order-dialog" v-show="showOrderDialog">
			<view class="box">
				<view class="box-title">{{__("这个商品好评如潮，建议留下他哦")}}</view>
				<view class="box-evaluation">
					<view class="box-evaluation-font">{{__("其它用户这样评价他")}}</view>
				</view>
				<view class="box-btn-group">
					<button class="box-btn-cancel" @click="cancelOrder" type="default">{{__("取消订单")}}</button>
					<button class="box-btn-await" @click="showOrderDialog = false"
						type="default">{{__("我再想想")}}</button>
				</view>
			</view>
		</view>
		<payment-box :paymentDataDefault="paymentData" :order_id="order_id" ref="paymentBox" @onCancel="onCancel"
			@onPaid="onPaid" @onFail="onFail"></payment-box>
	</view>
</template>

<script>
	import paymentBox from '@/components/payment-box.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import $ from "../../helpers/util";
	export default {
		data() {
			return {
				showOrderDialog: false,
				order_id: "",
				product_id: "",
				item_id: "",
				paymentData: {},
				course: {},
				order: {},
			}
		},
		components: {
			paymentBox
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			this.order_id = options.order_id
			this.getOrderData(options.order_id)
		},
		onUnload: function() {},

		methods: {
			onFail: function(e) {},
			onCancel: function(e) {},
			
			onPaid: function(e) {
				this.getOrderData(e.order_id)
				
				if (this.$refs.paymentBox.showBoxView) {
					this.$refs.paymentBox.cancel();
				}
			},
			getPrice(price) {
				if (price || price === 0) {
					return price.toFixed(2)
				}
				return ""
			},
			jumpChat(){
				uni.navigateTo({
					url: '/im/chat/chat?uid=10001'
				});
			},
			jumpDetail(item_id) {
				let again_url = this.$.sprintf('/edu/course/class-detail?item_id=%d', item_id);
				uni.navigateTo({
					url: again_url
				});
			},
			getOrderData(order_id) {
				let that = this
				let params = {
					user_id: this.userInfo.user_id,
					order_id: order_id
				}
				that.$.request({
					url: this.Config.URL.user.order_detail,
					data: params,
					success: function(data, status, msg, code) {
						if (200 === status && data) {
							data.order_time = that.$.datetimeFormatter(data.order_time, 'yyyy-MM-dd hh:mm:ss')
							let item = data.items[0];
							let course = data.course;
							that.product_id = item.product_id
							that.item_id = item.item_id
							that.setData({
								course: {
									product_name: course.product_name,
									product_tips: course.product_tips,
									item_unit_price: item.item_unit_price,
									course_file_type: course.course_file_type,
									chapterNum: course.chapterNum,
									product_valid_period: course.product_valid_period,
									product_image: course.product_image,
								},
							})
							that.setData({
								order: {
									order_id: data.order_id,
									order_time: data.order_time,
									trade_payment_money: data.trade.trade_payment_amount,
									order_payment_name: data.order_payment_name,
									order_payment_amount: data.order_payment_amount,
									order_state_name: data.order_state_name,
									order_state_id: data.order_state_id,
								},
							})
							that.setData({
								'paymentData': {
									order_id: that.order_id,
									orderSelMoneyAmount: data.trade.trade_payment_amount.toFixed(2),
									user_money: that.userInfo.user_money,
									user_points: that.userInfo.user_points,
									user_recharge_card: that.userInfo.user_recharge_card,
									user_sp: that.userInfo.user_sp
								}
							});
						}
					}
				});
			},
			cancelOrderDialog() {
				this.showOrderDialog = true;
			},
			cancelOrder() {
				let that = this;
				var params = {
					order_id: this.order.order_id
				};
				that.$.confirm(that.__("是否取消订单?"), function(a) {
						if (a.confirm) {
							that.$.request({
								url: that.Config.URL.user.order_cancel,
								data: params,
								success: function(data, status, msg, code) {
									if (200 === status) {
										setTimeout(function() {
											that.getOrderData(that.order_id)
										}, 1000)
									} else {
										$.alert(msg);
									}
								}
							});
						}
					},
					!0)
				// this.showOrderDialog = false
			},
			toPay() {
				setTimeout(() => {
					this.$refs.paymentBox.show();
				}, 400)
			},
		}
	}
</script>

<style>
	@import '@/components/audio/font/iconfont.css';

	page {
		background-color: #fff !important;
		min-height: 100% !important;
		height: 100% !important;
		padding: 25rpx;
		box-sizing: border-box;
	}

	.order-course-cover img {
		width: 180rpx;
		height: 220rpx;
		border-radius: 5rpx;
	}

	.order-course-detail {
		display: flex;
		flex-direction: row;
		padding: 20rpx 0;
	}

	.order-course-info {
		width: 100%;
		padding-left: 25rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.order-course-class {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		font-family: PingFangSC-Regular, PingFang SC;
		color: #666666;
	}

	.order-detail-info-items {
		display: flex;
		flex-direction: column;
	}

	.order-detail-info-items .item {
		display: flex;
		flex-direction: row;
		padding-top: 20rpx;
		color: #333333;
		justify-content: space-between;
		font-family: PingFangSC-Regular, PingFang SC;
	}

	.order-detail-info-items .font {
		font-family: PingFangSC-Regular, PingFang SC;
		color: #666666;
	}

	.order-detail-info-title .icon {
		border-left: 4px solid #F43D3E;
		padding-right: 15rpx;
	}

	.order-detail-foot {
		left: 0;
		width: 100%;
		bottom: 0rpx;
		padding: 30rpx 0rpx;
		position: fixed;
		background: #FFFFFF;
		transform: translateZ(0);
		bottom: env(safe-area-inset-bottom);
		box-shadow: 0rpx -5rpx 14rpx #e3e6e6;
		bottom: constant(safe-area-inset-bottom);
		display: flex;
	}

	.order-detail-foot-customer {
		color: #666666;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		width: 100%;
		left: 0;
		bottom: 0rpx;
		bottom: calc(120rpx + env(safe-area-inset-bottom));
		position: fixed;
		display: flex;
		justify-content: center
	}

	/deep/ .order-detail-foot-button {
		width: 40%;
		border-radius: 50rpx;
	}

	/deep/ .pay {
		color: #FFFFFF;
		background: -webkit-linear-gradient(to right, #FF6161, #FF9661);
		/* Safari 5.1-6.0 */
		background: -o-linear-gradient(to right, #FF6161, #FF9661);
		/* Opera 11.1-12.0 */
		background: -moz-linear-gradient(to right, #FF6161, #FF9661);
		/* Firefox 3.6-15 */
		background: linear-gradient(to right, #FF6161, #FF9661);
		/* 标准语法 */
	}

	/deep/ .cancel {
		border: 1px solid #FA6029;
		background-color: #FFFFFF;
		color: #FA6029;
	}

	.cancel-order-dialog {
		position: fixed;
		display: flex;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		text-align: center;
		z-index: 2002;
		background: rgba(0, 0, 0, 0.5);
		justify-content: center;
		align-items: center;
	}

	.cancel-order-dialog .box {
		height: 30%;
		width: 75%;
		margin: 0 auto;
		background-color: #FFFFFF;
		border-radius: 10rpx;
	}

	.cancel-order-dialog .box-title {
		font-family: PingFangSC-Medium, PingFang SC;
		padding: 25rpx 0;
	}

	.cancel-order-dialog .box-evaluation {
		background: #F9F9F9;
		border-radius: 5px;
		height: 45%;
		width: 85%;
		margin: 0 auto;
		text-align: left;
	}

	.cancel-order-dialog .box-evaluation-font {
		padding-top: 15rpx;
		padding-left: 20rpx;
		color: #999999;
		font-family: PingFangSC-Regular, PingFang SC;
	}

	.box-btn-group {
		padding: 40rpx 0;
		display: flex;
		flex-direction: row;
	}

	/deep/ .box-btn-cancel {
		width: 40%;
		border-radius: 50rpx;
		background: #F4F4F4;
	}

	/deep/ .box-btn-await {
		width: 40%;
		border-radius: 50rpx;
		color: #FFFFFF;
		background: -webkit-linear-gradient(to right, #FF6161, #FF9661);
		/* Safari 5.1-6.0 */
		background: -o-linear-gradient(to right, #FF6161, #FF9661);
		/* Opera 11.1-12.0 */
		background: -moz-linear-gradient(to right, #FF6161, #FF9661);
		/* Firefox 3.6-15 */
		background: linear-gradient(to right, #FF6161, #FF9661);
		/* 标准语法 */
	}
</style>

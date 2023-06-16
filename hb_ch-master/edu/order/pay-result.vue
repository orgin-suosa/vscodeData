<template>
	<view class="pay-reuslt-page">
		<view class="pay-reuslt">
			<view class="pay-result-detal">
				<image :src="pay_pic"></image>
				<view class="pay-result-detal-info">
					<text class="pay-result-title">{{ msg }}</text>
					<text>
						<text>实付：</text>
						<text class="pay-result-price-symbol">¥</text>
						<text class="pay-result-price">{{payMoney}}</text>
					</text>
				</view>
			</view>
		</view>
		<view class="pay-reuslt-bnt">
			<!-- <a class="bnt1" href="" @click="toCourseDetail">{{__("学习新课程")}}</a> -->
			<a class="bnt1" href="" @click="toCourseDetail">{{__("学习新课程")}}</a>
			<a class="bnt2" href="" @click="toOrderDetail">{{__("查看我的订单")}}</a>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import Image from "../../pages/index/image";
	export default {
		components: {
			Image
		},
		data() {
			return {
				order_id: "",
				pay_state: false,
				item_id: "",
				amount: 0,
				trade: {},
				msg: "",
				pay_pic: ""
			}
		},
		onLoad: function(options) {
			
			console.info('----onLoad--item_id--',options.order_id);
				
			this.order_id = options.order_id
			// this.pay_state = options.pay_state
			// this.item_id = options.item_id
			// this.amount = options.amount
			this.getOrderDetail(options.order_id)
		},
		computed: {
			...mapState(['Config', 'StateCode']),
			payMoney() {
				let trade = this.trade
				if(!trade) return 0;
				let trade_payment_money = trade.trade_payment_money
				let trade_payment_amount = trade.trade_payment_amount
				if (trade_payment_money) return trade_payment_money;
				if (trade_payment_amount) return trade_payment_amount;
				return 0;
			}
		},
		methods: {
			
			toCourseDetail() {
				
				console.info('----order---item_id--',this.item_id);
				
				var slbProductId = uni.getStorageSync('slbProductId');
				var sjbProductId = uni.getStorageSync('sjbProductId');
				var lhbProductId = uni.getStorageSync('lhbProductId');
				var fketfProductId = uni.getStorageSync('fketfProductId');
				var jgjjProductId = uni.getStorageSync('jgjjProductId');
				
				if(this.item_id == slbProductId || this.item_id == sjbProductId || this.item_id == lhbProductId|| this.item_id == fketfProductId || this.item_id == jgjjProductId){
					//扫雷宝
					uni.navigateBack({
						delta:1
					})
				}else{
					
					let url = this.$.sprintf("/edu/course/class-detail?item_id=%d", this.item_id);
					// this.$.gotopage(url);
					uni.navigateBack({
						delta:1
					})
				}
			},
			toOrderDetail() {
			
				let url = this.$.sprintf("/edu/order/detail?order_id=%s", this.order_id);
				this.$.gotopage(url);
			},
			
			getOrderDetail(order_id) {
				let that = this
				that.$.request({
					url: that.Config.URL.user.order_detail,
					data: {
						order_id: order_id,
					},
					success: function(data, status, msg, code) {
						if (200 === status && data) {
							that.trade = data.trade
							that.item_id = data.items[0].item_id
							that.msg = '支付成功'
							that.pay_pic = "https://qnsp.zcskjy.com/img/right.png"
						} else if (250 === status) {
							that.msg = data.msg
							that.pay_pic = "https://qnsp.zcskjy.com/img/wrong.png"
						}
					}
				});
			},
		}
	};
</script>

<style lang="scss">
	@import '@/components/audio/font/iconfont.css';

	page {
		background-color: #fff !important;
		min-height: 100% !important;
		height: 100% !important;
		font-family: DINAlternate-Bold, DINAlternate;
	}

	.pay-reuslt-page {
		height: 100%;
	}

	.pay-reuslt {
		height: 50%;
	}

	.pay-result-detal {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.pay-result-detal image {
		height: 100px;
		width: 110px;
		object-fit: cover;
	}

	.pay-reuslt-bnt {
		height: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.pay-reuslt-bnt a {
		width: 80%;
		text-align: center;
		text-decoration: none;
		color: black;
		display: block;
		border: 1px solid #FA5F29;
		padding: 15rpx 0;
		margin: 20rpx 0;
		border-radius: 50rpx;
		font-size: initial;
		font-weight: 500;
	}

	.pay-reuslt-bnt .bnt1 {
		background: -webkit-linear-gradient(to right, #FF6161, #FF9661);
		/* Safari 5.1-6.0 */
		background: -o-linear-gradient(to right, #FF6161, #FF9661);
		/* Opera 11.1-12.0 */
		background: -moz-linear-gradient(to right, #FF6161, #FF9661);
		/* Firefox 3.6-15 */
		background: linear-gradient(to right, #FF6161, #FF9661);
		color: #FFFFFF;
	}

	.pay-reuslt-bnt .bnt2 {
		border-width: 2rpx;
		border-color: #FA5F29;
		background-color: #FFFFFF;
		color: #FA5F29;
	}

	.pay-result-detal-info {
		padding-top: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.pay-result-price {
		padding: 0 5rpx;
		font-size: large;
		font-weight: 400;
		color: #FA6029;
	}

	.pay-result-price-symbol {
		padding: 0 5rpx;
		font-size: small;
		color: #D84F4E;
	}

	.pay-result-title {
		font-size: large;
		color: #FA6029;
	}
</style>

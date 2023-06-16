<template>
	<view class="page">
		        <view class="sstouch-inp-con">
		            <view class="form-box">
		                <view class="form-item">
		                    <view class="h4">{{__('买家')}}:</view>
		                    <view class="input-box">
								<input class="inp" type="text" disabled="disabled"  :value="orderdetail.buyer_user_name" id="g_name" autocomplete="off" readonly="readonly" @input="onInputProductname"/>
		                        <text class="input-del"></text>
		                    </view>
		                </view>
		                <view class="form-item">
		                    <view class="h4">{{__('订单号')}}:</view>
		                    <view class="input-box">
								<input class="inp" type="text" disabled="disabled" :value="orderdetail.order_id" @input="onInputUnitprice"/>
		                        <text class="input-del"></text>
		                    </view>
		                </view>
		                <view class="form-item">
		                    <view class="h4">{{__('收款时间')}}:</view>
		                    <view class="input-box">
								<picker mode="date" @change="bindDateChange"  >
										<label style="padding:0 40upx;">{{deposit_notify_time}}</label>
								</picker>
		                    </view>
		                </view>
		                <view class="form-item">
		                    <view class="h4">{{__('金额')}}:</view>
		                    <view class="input-box">
								<input class="inp" type="text" disabled="true"  :value="deposit_total_fee" @input="inpufee"/>
		                        <text class="input-del"></text>
		                    </view>
		                </view>
		            <!--    <view class="form-item">
		                    <view class="h4">支付凭证:</view>
		                    <view class="input-box">
								<input class="inp" type="text"  :value="deposit_trade_no" @input="inputrade"/>
		                        <text class="input-del"></text>
		                    </view>
		                </view> -->
		                <view class="form-item">
		                    <view class="h4">
		                        <text class="i" style="color: red;">*</text>
		                        {{__('支付方式')}}:
		                    </view>
		                    <view class="input-box" >
								<block v-if="(payment.length > 0)">
								  <picker mode="selector" @change="bindChange" :value="index" :range="payment" range-key="payment_channel_name" >
									<label style="padding:0 40upx;">{{payment[index].payment_channel_name}}</label>
								  </picker>
								</block>
		                    </view>
		                </view>
						<view class="form-item" style="border-bottom: solid #EEE 2upx;">
						    <view class="h4">{{__('备注')}}:</view>
						    <view class="input-box">
								<input class="inp"  type="text"  :value="trade_remark" @input="inputremarks"/>
						        <text class="input-del"></text>
						    </view>
						</view>
		            </view>
		            <view class="error-tips"></view>
		            <view class="form-btn ok" @click="payOrder">
		                <view class="btn" >{{__('确定')}}</view>
		            </view>
		        </view>

	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		data() {
			return {
				order_id:'',
				payment:[],
				index:0,
				deposit_notify_time:'',
				trade_remark:'',
				deposit_trade_no:'1',
				deposit_total_fee:0,
				pm_recharge_card:0,
				orderdetail:{},
				channel_id:'',
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
		components: {


		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			var that = this;
			that.setData({
				options:options,
				order_id:options.on,
				deposit_notify_time:that.$.datetimeFormatter(Date.parse(new Date())/1000,'yyyy-MM-dd')
			})
			//console.log(that.deposit_notify_time)
			that.getOrderDetail()
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			getOrderDetail: function(){
				var that =this;
				var params = {
					order_id:that.order_id
				}
				that.$.request({
					url: this.Config.URL.seller.getOrderDetail,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==200){
							that.setData({
								orderdetail:data,
								deposit_total_fee:data.order_payment_amount,
							})
							that.getpayment()
						}
					}
				})
			},

			getpayment: function(){
				var that = this;
				var params = {

				};
				that.$.request({
					url: this.Config.URL.admin.lists.payment_channel,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==200){
							that.setData({
								payment:data.items,
							})
						}
					}
				})
			},

			bindChange: function (e){
				var that = this;
				var t = e.detail.value
				that.setData({
					index:t,
					channel_id:that.payment[t].payment_channel_id
				})
			},


			bindDateChange: function (e){
				this.setData({
					deposit_notify_time: e.detail.value
				})
			},




			inpufee: function (e) {
				this.setData({
					deposit_total_fee:e.detail.value
				})
			},

			inputrade: function(e){
				this.setData({
					deposit_trade_no:e.detail.value
				})
			},

			inputSearch:  function(e){
				this.setData({
					search_name:e.detail.value
				})
			},

			inputremarks: function(e){
				this.setData({
					trade_remark:e.detail.value
				})
			},


			payOrder:function(){
				//console.log(this.order_id)
				var that = this;
				var id = that.index
				var params = {
					deposit_notify_time:that.deposit_notify_time,
					trade_remark:that.trade_remark,
					deposit_trade_no : that.deposit_trade_no,
					deposit_total_fee:that.deposit_total_fee,
					pm_money:0,
					pm_recharge_card:that.payment[id].payment_channel_id,
					order_id:that.orderdetail.order_id,
					is_received:1,
					order_state_id:2040
				};
				that.$.request({
					url: this.Config.URL.admin.pay.offline,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==200){
							that.$.confirm(that.__("收款成功"), function (a) {
								var options = {};
								that.$.navigateBack(1, function() {
								    //console.info('SelectAddress')
								    that.notice.postNotificationName("RefreshOrder", options)
								})

							})

						}else{
							that.$.alert(msg)
						}
					}
				})
			},

		}
	}
</script>

<style lang="scss">
	@import "../../styles/base.scss";
	@import "../../styles/sstouch_member.scss";
	@import "../../styles/sstouch_common.scss";
	@import "../../styles/_variables";

	.m-upImg-item {
		width: 60upx;
		height: 60upx;
		// display: inline-block;
		vertical-align: middle;
		position: relative;
		font-size:left;
	}

	.m-upImg {
		box-sizing: border-box;
		padding: 20upx;
		background-color: #fff;
		display: inline-block;
		// height:60upx;
	}

	.m-upImg-item image {
		width: 100%;
		height: 100%;
	}

	.u-del-item {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 40upx;
		background-color: rgba(0, 0, 0, 0.5);
		text-align: center;
		line-height: 40upx;
		color: #fff;
		z-index: 5;
	}
	.u-del-item label {
		font-size: 28upx;
	}
	.upSelect {
		width: 60upx;
		height: 60upx;
		background-color: #eee;
		text-align: center;
		line-height: 60upx;
	}
	.upSelect label {
		font-size: 40upx;
	}
	.m-submitComment {
		position: fixed;
		height: 100upx;
		width: 100%;
		z-index: 999;
		left: 0;
		bottom: 0;
		background:rgba(51,51,51,1);
		box-shadow:0px 0px 4px 0px rgba(0,0,0,0.1);
	}
	.m-subBtn {
		padding: 0 35%;
		width:100%;
		height: 100%;
		background:rgba(51,51,51,1);
		color:rgba(255,255,255,1);
		font-size: 28upx;
		line-height: 100upx;

	}

	.sstouch-inp-con uni-view uni-view {
		display: inline-block;
		padding:0 20upx;
		margin-left:0;
	}

	.sstouch-inp-con {
		background:#FFF;
	}

	.m-cell::before {
		border-top: 0px solid #ebebe7;
	}


	.form-item {
		width:100%;
	}

	.input-box uni-label {
		font-size:26upx !important;
	}

	.uni-list-cell::after {
		height:0;
	}

	.uni-drawer__content {
		width:100%;
	}

	.m-tab {
		width: 100%;
	}

	.m-navbar-item {
		padding: 20upx 0;
		font-size: 24upx;
	}

	.m-orderlist {
		padding-top: 170upx;
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}

	.m-navbar-item:after {
		border: none;
	}

	.m-navbar-item.m-navbar-item-on {
		background-color: #fff;
		color: $default-skin-bg;
	}

	.m-navbar-item.m-navbar-item-on::before {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height:
				6upx;
		border-bottom: 6upx solid $default-skin-bg;
		color: #CCCCCC;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 3;
	}

	.u-tuan-label {
		padding: 5upx;
		background-color: $default-skin-bg;
		border-radius: 4upx;
		font-size: 24upx;
		color:#fff;
		margin-right: 5upx;
	}

	.nav-image {
		width:12upx;
		height:24upx;
		float:right;
		padding-top:12upx;
	}

	.input-box {
		// width: 50%;
		font-size:26upx;
		padding-left:20upx;
	}

	.u-input {
		width: 50%;
		height:90upx;;
		border: 0;  // 去除未选中状态边框
		outline: none; // 去除选中状态边框
		background-color: rgba(0, 0, 0, 0);// 透明背景
	}



</style>

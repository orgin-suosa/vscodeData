<template>
	<view class="page">
		<view :class="(show?'cover':'')">

		</view>
		<view class="m-product-all">
			<view style="width: 96%;margin-left: 2%;margin-right: 2%;">
			<u-tabs :list="order_text_list" @click="changeTabs" lineColor="red" lineHeight="5" :itemStyle="	{ width: '20%',height: '44px',background: '#fff' }" :scrollable="false"></u-tabs>
			</view>
			<view v-if="loadComplete">
				<scroll-view v-if="(orderlist.length>0)" scroll-y="true" class="m-orderlist"
					@scrolltolower="scrollbottom">
					<view v-for="(items, i) in orderlist" :key="i" class="m-panel">
						<view class="m-panel-hd">
							<text style="font-size: 24rpx;">{{__('订单编号：')}}{{items.order_id}}</text>
							<text style="font-size: 20rpx;padding-left: 6rpx;"		
							<label v-if="items.order_state_id === 2010">
								待支付
							</label>
							<label v-if="items.order_state_id === 2060">
								交易成功
							</label>
							<label v-if="items.order_state_id === 2070">
								已取消
							</label>
						</view>

						<view class="m-product-list">
							<!-- :url="'/edu/course/class-detail?item_id=' + (item.item_id)" -->
							<view v-for="(item, ii) in items.item" :key="ii" class="m-product-item" @click="gotoCourseDetail(item.item_id)">
						<!-- 	<navigator :url="'/edu/course/class-detail?item_id=' + (item.item_id)"
								v-for="(item, ii) in items.item" :key="ii" class="m-product-item"> -->
								<view class="m-product-img">
									<image :src="(item.order_item_image)" mode="aspectFill" />
								</view>
								<view class="m-product-info" style="height: 230rpx;">
									<view class="m-product-name">
										<!-- items.OrderType == 1 拼团 -->
										<label><text
												v-if="(item.activity_type_id==StateCode.ACTIVITY_TYPE_GROUPBOOKING)"
												class="u-tuan-label">{{__('拼团')}}</text>{{item.item_name}}</label>
										<label class="m-min-name"
											style="overflow:hiddentext-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">{{item.activity_type_name==null?"":item.activity_type_name}}</label>
									</view>
									
									<view class="m-product-tips">
										{{item.course_data==null?"":item.course_data.product_tips}}
									</view>
									
									<view class="m-spec-info">
										<u-icon labelSize="23rpx" labelColor="#5b2111" size="23rpx" name="https://qnsp.zcskjy.com/img%2Fvideo_show.png"
										style="float: left; margin-top: 5rpx;margin-right: 10rpx;">
										</u-icon>
										<label class="m-min-name"
											style="overflow:hiddentext-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">{{item.course_data==null?"":item.course_data.chapter.chapterNum}}节课时</label>
									</view>

									<view class="m-product-price">
										<block v-if="items.trade_payment_amount">
											<label>{{__('￥')}}</label>{{items.trade_payment_amount}}
										</block>
										
										<block>
											<label style="float: right;color: #999999;font-size: 18rpx;font-weight: 400;">创建时间：{{items.order_time}}</label>
										</block>

										<block v-if="item.item_unit_points">
											<label
												style="margin: auto 10upx;">+</label>{{item.item_unit_points}}{{__('积分')}}
										</block>

										<block v-if="item.item_unit_sp">
											<label
												style="margin: auto 10upx;">+</label>{{item.item_unit_sp}}{{__('众宝')}}
										</block>
									</view>
								</view>
							</view>
						</view>
						<!-- items.Type==2 ???? -->
						<view class="m-product-item" v-if="(items.Type==2)" style="height:154upx">
							<view class="m-product-img">
								<image :src="(items.store_logo)" mode="aspectFill" style="width:172upx;height:172upx" />
							</view>
							<view class="m-product-info2" style="padding:20upx 0">
								<view class="m-product-name">
									<label>{{items.store_name}}</label>
								</view>
							</view>
						</view>
						<view class="m-total-info">
							<view
								v-if="items.order_payment_amount !== items.trade_payment_amount && items.trade_payment_amount > 0">
								{{__('待付款')}}：
								<block v-if="items.order_payment_amount">
									<text style="">{{__('￥')}}</text><label
										class="m-total-price">{{items.trade_payment_amount}}</label>
								</block>
							</view>

							<block v-if="items.order_resource_ext1"></block>
							<label class="m-total-price" v-if="items.order_resource_ext1" style="margin: auto 10upx;"> +
								{{items.order_resource_ext1}}{{__('积分')}}</label>
							<label class="m-total-price" v-if="items.order_resource_ext2" style="margin: auto 10upx;"> +
								{{items.order_resource_ext2}}{{__('众宝')}}</label>
						</view>
						<view class="m-total-btn">
							<navigator :url="'/edu/order/detail?order_id=' + (items.order_id)" class="view_detail">
								{{__('查看详情')}}</navigator>
								<u-icon labelSize="27rpx" labelColor="#5b2111" size="27rpx" name="https://qnsp.zcskjy.com/img%2Fjiantou.png"
								style="float: left; margin-top: 22rpx;margin-left: 5rpx;">
								</u-icon>
								<button :data-on="(items.order_id)"
									:data-order_payment_amount="(items.trade_payment_amount)"
									v-if="(items.order_state_id === StateCode.ORDER_STATE_WAIT_PAY )"
									class="to_pay" @click="gotopay" formType="submit">{{__('去支付')}}</button>
								<button :data-on="(items.order_id)" v-if="(items.if_buyer_cancel)" class="cancel_order"
									@click="cancelOrder">{{__('取消订单')}}</button>
								<button :data-on="(items.order_id)"
									:data-order_payment_amount="(items.trade_payment_amount)"
									v-if="(items.order_state_id === StateCode.ORDER_STATE_CANCEL )"
									class="to_pay" @click="gotopay" formType="submit">{{__('重新支付')}}</button>
						</view>
					</view>
					<view class="m-loading-box">
						<block v-if="(ispage)">
							<view class="u-loadmore">
								<label class="u-loading"></label>
								<text class="u-loadmore-tips">{{__('正在加载')}}</text>
							</view>
							<view>
								<text></text>
							</view>
						</block>
						<block v-else>
							<view class="u-loadmore u-loadmore-line">
								<text class="u-loadmore-tips">{{__('没有更多了')}}</text>
							</view>
						</block>
					</view>
				</scroll-view>

				<navigator url="" redirect="true" class="m-nullpage" v-else>
					<view class="m-nullpage-middle" v-if="(!flag)">
						<view class="m-null-tip">
							<label style="font-size:32upx;">{{__('亲~您还没有订单哦')}}</label>
							<!-- <label class="highlight-link">{{__('快去看看吧')}}</label> -->
						</view>
					</view>
				</navigator>
			</view>
			<view class="alert" v-if="(show)">
				<image style="width:50upx;height:50upx" src="/static/images/true.png"></image>
				<text style="margin-left:20upx">{{Info}}</text>
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

	export default {
		data() {
			return {
				isdata: false,
				tapindex: 1,
				page: 1,
				rows: 10,
				ispage: !0,
				flag: !0,
				type: 0,
				kind_id: 0,
				formId: "",
				orderlist: [],
				imgLogo: "",
				show: !1,
				Info: "",
				order_id: "",
				paymentData: {},
				loadComplete: false ,// 没有加载数据前不显示的对应内容
				order_text_list: [{
					name: '全部订单',
				}, {
					name: '待支付',
				}, {
					name: '已取消'
				}, {
					name: '已完成'
				}]
			}
		},
		components: {
			paymentBox
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {

           
			this.setData({
				tapindex: options.sl ? options.sl : 1,
				page: 1,
				rows: 10,
				orderlist: [],
				type: options.type ? options.type : 0,
				// kind_id: options.kind_id ? options.kind_id : 1205
			});
            
			
			// #ifndef APP-PLUS
			this.setData({
				kind_id: options.kind_id ? options.kind_id : 1205
			});
			// #endif
			
			
			uni.setNavigationBarTitle({
				title: this.__('我的订单')
			});

			var t = this;
			this.notice.addNotification("RefreshMessage", t.RefreshMessage, t);
			this.getOrderlist()
		},
		onShow: function() {},

		onUnload: function() {
			//移除通知
			// 离开页面，注销事件
			var that = this
			this.notice.removeNotification("RefreshMessage", that);


			if (this.$refs.paymentBox.showBoxView) {
				this.$refs.paymentBox.cancel();
			}
		},
		onBackPress() {
			if (this.$refs.paymentBox.showBoxView) {
				this.$refs.paymentBox.cancel();

				return true;
			}
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.getOrderlist();
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			RefreshMessage: function(e) {
				this.setData({
					tapindex: 1,
					page: 1,
					rows: 10,
					orderlist: [],
					ispage: !0,
					flag: !0,
					type: 0,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			changeTabs: function(item) {
				const index = item.index;
				if (index === 0) {
					this.allOrders()
				} else if (index === 1) {
					this.toBePaid()
				} else if (index === 2) {
					this.toBeCancelled()
				} else if (index === 3) {
					this.toBeEvaluated()
				}
			},
			allOrders: function() {
				this.setData({
					tapindex: 1,
					page: 1,
					rows: 10,
					orderlist: [],
					ispage: !0,
					flag: !0,
					type: 0,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			toBePaid: function() {
				this.setData({
					tapindex: 2,
					page: 1,
					rows: 10,
					orderlist: [],
					ispage: !0,
					flag: !0,
					type: this.StateCode.ORDER_STATE_WAIT_PAY,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			toBeShipping: function() {
				this.setData({
					tapindex: 5,
					page: 1,
					rows: 10,
					orderlist: [],
					ispage: !0,
					flag: !0,
					type: this.StateCode.ORDER_STATE_WAIT_SHIPPING,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			receiptOfGoods: function() {
				this.setData({
					tapindex: 3,
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
					orderlist: [],
					type: this.StateCode.ORDER_STATE_SHIPPED,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			toBeEvaluated: function() {
				this.setData({
					tapindex: 4,
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
					orderlist: [],
					type: this.StateCode.ORDER_STATE_FINISH,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			toBeCancelled: function() {
				this.setData({
					tapindex: 3,
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
					orderlist: [],
					type: this.StateCode.ORDER_STATE_CANCEL,
					kind_id: this.kind_id,
					loadComplete: !1
				}), this.getOrderlist()
			},
			scrollbottom: function() {
				if (this.flag) {
					var that = this;
					that.setData({
						flag: !1
					});

					clearTimeout(t);
					var t = setTimeout(function() {
						that.setData({
							state_type: that.type,
							flag: !1,
							page: parseInt(that.page) + 1,
							rows: 10
						});

						that.getOrderlist()
					}, 100)
				}
			},
			getOrderlist: function() {
				var that = this;
				var params = {
					page: that.page,
					rows: that.rows,
					state_type: that.type,
					kind_id: this.kind_id
				};
				that.$.request({
					url: this.Config.URL.user.order_lists,
					data: params,
					loading:false,
					success: function(data, status, msg, code) {
						console.info('----order_lists----',data)
						if (200 == status && data.items.length > 0) {
							if (data.page >= data.total) {
								that.setData({
									flag: !1,
									ispage: !1,
									orderlist: that.orderlist.concat(data.items)
								})
							} else {
								that.setData({
									flag: !0,
									ispage: !0,
									orderlist: that.orderlist.concat(data.items)
								})
							}

							that.setData({
								isdata: !0,
								loadComplete: !0
							})

						} else {
							that.setData({
								flag: !1,
								ispage: !1,
								isdata: !1,
								loadComplete: !0
							})
						}
					},
					fail: function(data) {
						that.setData({
							loadComplete: !0
						});
						that.$.alert("网络异常请重试！");
					}
				});
			},
			cancelOrder: function(e) {
				var that = this,
					params = {
						order_id: e.currentTarget.dataset.on
					};
				that.$.confirm(that.__("是否取消订单"), function(e) {
					if (e.confirm) {
						that.$.request({
							url: that.Config.URL.user.order_cancel,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									that.$.alert("取消成功！", function() {
										that.setData({
											orderlist: [],
											page: 1
										});
										that.getOrderlist();
									});
								}
							}
						});
					}
				}, !0)
			},
			writeOrder: function(e) {
				var that = this,
					params = {
						order_id: e.currentTarget.dataset.on
					};
				that.$.confirm("是否核销订单？", function(e) {
					if (e.confirm) {
						that.$.request({
							url: that.Config.URL.user.order_receive,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									that.$.alert("核销成功！", function() {
										that.setData({
											orderlist: [],
											page: 1,
											Info: msg
										});
										that.getOrderlist();
									});
								} else {
									(that.setData({
										show: !0
									}), setTimeout(function() {
										that.setData({
											show: !1
										})
									}, 2e3)), that.getOrderlist()
								}
							}
						});
					}

				}, !0)
			},
			confirmReceipt: function(obj) {
				var params = {
					order_id: obj.currentTarget.dataset.on
				};

				var that = this;
				that.$.confirm(that.__("是否确认收货？"), function(e) {
					if (e.confirm) {
						that.$.request({
							url: that.Config.URL.user.order_receive,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									that.$.alert(that.__("收货成功！"), function() {
										that.setData({
											orderlist: [],
											page: 1
										});
										that.getOrderlist();
									});
								}
							}
						});
					}

				}, !0)
			},
			gotopay: function(e) {
				var that = this;
				that.setData({
					order_id: e.currentTarget.dataset.on,
					'paymentData': {
						order_id: e.currentTarget.dataset.on,
						orderSelMoneyAmount: e.currentTarget.dataset.order_payment_amount,

						user_money: this.userInfo.user_money,
						user_points: this.userInfo.user_points,
						user_recharge_card: this.userInfo.user_recharge_card,
						user_sp: this.userInfo.user_sp
					}
				});
             
				this.$refs.paymentBox.show();
				return true;


				this.setData({
					formId: e.detail.formId
				});
				var param = {
					order_id: e.currentTarget.dataset.on,
					openid: this.userInfo.openId,
					typ: 'json',
					payment_channel_code: 'wx_native',
					prepay_flag: 1
				};

				that.$.request({
					url: this.Config.URL.pay.pay,
					data: param,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.$.requestPayment({
								timeStamp: data.timeStamp,
								nonceStr: data.nonceStr,
								"package": data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: function() {
									that.sendMessage(e.currentTarget.dataset.on), that.$.alert(
										that.__("支付成功！"),
										function() {
											that.setData({
												orderlist: [],
												page: 1
											}), that.getOrderlist()
										})
								},
								fail: function(e) {
									// that.$.alert(that.__("支付成功！"), e)
								}
							})
						} else {
							that.$.alert(msg)
						}
					},

					fail: function(err) {}
				});
			},

			onCancel: function(e) {
				return
			},
			onPaid: function(e) {
				
				let that = this
				that.$.alert(that.__('支付成功'), function() {
					that.$.gotopage("/edu/order/detail?order_id=" + that.order_id)
				}, 2000)

				if (this.$refs.paymentBox.showBoxView) {
					this.$refs.paymentBox.cancel();
				}
			},
			onFail: function(e) {},

			sendMessage: function(order_id) {
				
				let that = this;
				var params = {
					api: orderapi.OrderPaySuccessWXMessage,
					pages: "/member/order/detail?on=" + order_id,
					formId: this.formId,
					WeiXinOpenId: this.userInfo.openId,
					value: {
						order_id: order_id
					}
				};
				that.$.sendTpl(params)
			},
				
			gotoCourseDetail(item_id){
				
				console.info('----order---item_id--',item_id);
				var slbProductId = uni.getStorageSync('slbProductId');
				var sjbProductId = uni.getStorageSync('sjbProductId');
				var lhbProductId = uni.getStorageSync('lhbProductId');
				var fketfProductId = uni.getStorageSync('fketfProductId');
				var jgjjProductId = uni.getStorageSync('jgjjProductId');
				
				if(item_id == slbProductId){
					
					uni.redirectTo({
					    url: '/findTools/saoLeiBao/index?productId='+ slbProductId + "&item_id=" + slbProductId,
					})  
				}else if(item_id == sjbProductId){
					
					uni.redirectTo({
					    url: '/findTools/eventBao/index?productId='+ sjbProductId + "&item_id=" + sjbProductId,
					})  
				}else if(item_id == lhbProductId){
					
					uni.redirectTo({
					    url: '/findTools/dragonTigerList/index?productId='+ lhbProductId + "&item_id=" + lhbProductId,
					})  
				}else if(item_id == fketfProductId){
					
					uni.redirectTo({
						url: '/findTools/tuyere/index?productId='+ fketfProductId + "&item_id=" + fketfProductId,
					})  
			    }else if(item_id == jgjjProductId){
						
					uni.redirectTo({
						url: '/findTools/mechanism/index?productId='+ jgjjProductId + "&item_id=" + jgjjProductId,
					})  
			    }else{
				
					uni.navigateTo({
						url:'/edu/course/class-detail?item_id=' + item_id
					})
			    }
		    }
		}	
	};
</script>

<style lang="scss">
	@import "../../styles/_variables";

	.m-navbar-item {
		padding: 20upx 0;
		font-size: 24upx;
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
	
	.m-panel {
		width: 96%;
		margin-left: 2%;
		margin-right: 2%;
		height: 442rpx;
		background: #FFFFFF;
		box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
	}

	.m-panel-hd label {
		float: right;
		color: #F43D3E;
		font-size: 26upx;
	}

	.m-total-info {
		text-align: right;
		padding: 10upx;
		font-size: 24upx;
	}

	.m-total-info label {
		font-size: 32upx;
		color: $default-skin-bg;
	}

	.m-total-info text {
		font-size: 24upx;
		color: $default-skin-bg;
	}

	.m-total-btn {
		text-align: right;
		padding: 20upx 20upx 20upx 20upx;
		position: relative;
	}

	.m-total-btn::before {
		content: " ";
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		height: 1px;
		border-top: 1px solid #ebebe7;
		color: #ebebe7;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform:
			scaleY(0.5);
		transform: scaleY(0.5);
	}

	.m-total-btn .u-link-btn {
		margin: 0 10upx;
		vertical-align: middle;
		display: inline-block;
		line-height: 30rpx;
		background-color: #fff;
		font-size: 24rpx;
	}
	
	.view_detail {
		margin-top: 20rpx;
		margin-left: 10rpx;
		font-weight: 400;
		color: #666666;
		line-height: 33rpx;
		font-size: 24rpx;
		float: left;
	}
	
	.to_pay {
		font-size: 20rpx;
		line-height: 56rpx;
		color: #fff;
		height: 56rpx;
		width: 160rpx;
		background: linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
		border-radius: 50rpx;
		float: right;
	}
	
	.cancel_order {
		margin-right: 20rpx;
		font-size: 20rpx;
		line-height: 50rpx;
		background-color: #fff;
		color: #666666;
		width: 160rpx;
		height: 55rpx;
		border-radius: 50rpx;
		border: 1rpx solid #666666;
		float: right;
	}

	.m-sort {
		position: relative
	}

	.m-sort image {
		width: 24upx;
		height: 24upx;
		position: absolute;
		/*top: 50%;*/
		margin-top: 10upx;
		margin-left: 2upx;
	}

	.m-product-price {
		font-size: 35rpx;
		line-height: 28rpx;
		color: #F43D3E;
		font-weight: 600;
		margin-top: 30rpx;
		margin-left: 6upx
	}

	.m-tab {
		position: fixed;
		width: 100%;
		top: var(--window-top);
		z-index: 2;
	}

	.m-orderlist {
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}


	.u-tuan-label {
		padding: 5upx;
		background-color: $default-skin-bg;
		border-radius: 4upx;
		font-size: 24upx;
		color: #fff;
		margin-right: 5upx;
	}

	.alert {
		font-size: 32upx;
		width: 70%;
		height: 200upx;
		padding: 0 40upx;
		position: absolute;
		left: 10%;
		top: 40%;
		background: #fff;
		border-radius: 10upx;
		justify-content: center;
		display: flex;
		align-items: center;
		z-index: 999;
	}

	.cover {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0px;
		background: rgba(0, 0, 0, 0.4);
		overflow: hidden;
		z-index: 998
	}

	.m-product-name {
		font-size: 36rpx;
		font-weight: 500;
		height: 40rpx;
		color: #333333;
		overflow: hidden;
	}
	
	.m-product-tips {
		width: 312rpx;
		height: 33rpx;
		font-size: 24rpx;
		font-weight: 400;
		color: #666666;
		line-height: 33rpx;
		overflow: hidden;
	}
	
	.m-spec-info {
		font-size: 24rpx;
		font-weight: 400;
		color: #666666;
		line-height: 33rpx;
	}

	.m-product-img {
		image {
			object-fit: cover;
			width: 180rpx;
			height: 220rpx;
			border-radius: 10rpx;
			margin-left: 10rpx;
			margin-right: 20rpx;
		}
	}

	.m-product-item {
		margin-top: 0rpx;
	}

	.scroll-view_H {
		width: 100%;
		white-space: nowrap;
		height: 84rpx;

		.m-navbar-item {
			display: inline-block;
			padding-left: 20rpx;
			padding-right: 20rpx;

			min-width: 110rpx;
		}
	}
</style>

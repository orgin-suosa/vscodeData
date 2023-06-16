<template>
	<view class="page">
		<view class="sstouch-main-layout">
			<view class="top">
				<view  right-icon="scan" style="width: 80%;float:left;padding:10upx 20upx;">
					<view class="input-view" style="width: 100%;">
						<input  style="font-size:26upx;background:#ffffff"  class="input" type="text" :value="search_name" :placeholder="__('输入订单号进行搜索')" @input="inputSearch">
						<image style="width:30upx;height:30upx;float:left;margin:18rpx auto;z-index:9" src="/static/images/false.png" mode="aspectFill" @click="gocancel" />
					</view>
				</view>
				<image style="width:50upx;height:50upx;float:left;padding:16upx 0;" src="/static/images/tabBar6.png" mode="aspectFill" @click="goSearch" />
			</view>
			<view class="m-tab">
				<view class="m-navbar">
					<view :class="['m-navbar-item', tapindex==0?'m-navbar-item-on':'']" @click="allOrder">
						{{__('全部')}}
					</view>
					<view :class="['m-navbar-item', tapindex==1?'m-navbar-item-on':'']" @click="pendingPayment">
						{{__('待付款')}}
					</view>
					<view :class="['m-navbar-item', tapindex==2?'m-navbar-item-on':'']" @click="toBeaudited" v-if="false">
						{{__('待审核')}}
					</view>
					<view :class="['m-navbar-item', tapindex==3?'m-navbar-item-on':'']" @click="toBeshipped">
						{{__('待发货')}}
					</view>
					<view :class="['m-navbar-item', tapindex==4?'m-navbar-item-on':'']" @click="shipped">
						{{__('已发货')}}
					</view>
					<view :class="['m-navbar-item', tapindex==5?'m-navbar-item-on':'']" @click="toBeCompleted">
						{{__('已完成')}}
					</view>
					<view :class="['m-navbar-item', tapindex==6?'m-navbar-item-on':'']" @click="tocancel" v-if="false">
						{{__('已取消')}}
					</view>
				</view>
			</view>
		</view>
		<scroll-view v-if="(orderlist.length>0)" scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom">
			<view v-for="(items, i) in orderlist"  :key="i" class="m-panel m-panel-access" style="margin-top:20upx;">
				<view class="m-panel-hd">{{__('订单编号：')}}{{items.order_id}}
					<label>{{items.order_time_date}}</label>
				</view>

				<view class="m-product-list">
					<navigator :url="'/seller/order/detail?on=' + (items.order_id)" v-for="(item, ii) in items.item"
					 :key="ii" class="m-product-item">
						<view class="m-product-img">
							<image :src="(item.order_item_image)" mode="aspectFill" />
						</view>
						<view class="m-product-info">
							<view class="m-product-name">
								<!-- items.OrderType == 1 拼团 -->
								<label><text v-if="(item.activity_type_id==StateCode.ACTIVITY_TYPE_GROUPBOOKING)" class="u-tuan-label">{{__('拼团')}}</text>{{item.item_name}}</label>
								<label class="m-min-name" style="overflow:hiddentext-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">{{item.activity_type_name==null?"":item.activity_type_name}}</label>
							</view>
							<view class="m-product-name" style="width:50%;height:40upx;">
								<label class="m-min-name">{{__('买家')}}：{{items.buyer_user_name}}</label>
							</view>

							<view class="m-product-price">
								<block v-if="item.order_item_unit_price">
									<label>{{__('￥')}}</label>{{item.order_item_unit_price}}
								</block>
								<text style="float: right;margin-right: 60upx;">x{{item.order_item_quantity}}</text>
							</view>
						</view>
					</navigator>
				</view>


				<view class="m-total-info">
					<text>{{__('共')}}{{items.item_quantity}}{{__('件商品，合计')}}:</text>
					<block >
						<label class="m-total-price">{{__('￥')}}{{items.order_payment_amount}}</label>
					</block>
					<block >
						<label class="m-freight" style="color: #999;font-size:20upx;">({{__('含运费')}}：{{items.order_shipping_fee}})</label>
					</block>
				</view>
				<view class="m-total-btn">
		            <view :data-on="(items.order_id)" v-if="(items.order_lock_status)" class="u-link-btn">{{__('退款/退货中...')}}</view>
				<block >
					<label class="u-link-btn" style="color: #999;border: 1px solid #CCC;padding:4upx">{{items.order_state_name}}</label>
				</block>
				<block v-if="(items.order_state_id == StateCode.ORDER_STATE_WAIT_SHIPPING)">
					<navigator :url="'/seller/order/deliver?on=' + (items.order_id)" class="u-link-btn">{{__('发货')}}</navigator>
				</block>

				<block v-if="(items.order_state_id == StateCode.ORDER_STATE_PICKING)">
					<view :data-order_id="items.order_id" :data-buyer_name="items.buyer_user_name" :data-index="i" class="u-link-btn" @click="Outstock">{{__('出库')}}</view>
				</block>

				<block v-if="(items.order_state_id == StateCode.ORDER_STATE_WAIT_PAY)">
					<navigator :url="'/seller/order/pay?on=' + (items.order_id)"  class="u-link-btn">{{__('收款')}}</navigator>
					<view  class="u-link-btn" :data-id="items.order_id" @click="showbutton">{{__('取消订单')}}</view>
				</block>
				<block v-if="(items.order_state_id == StateCode.ORDER_STATE_WAIT_REVIEW)">
					<view :data-order_id="items.order_id" :data-buyer_name="items.buyer_user_name"  class="u-link-btn" @click="Orderaudit">{{__('待订单审核')}}</view>
				</block>
				<block v-if="(items.order_state_id == StateCode.ORDER_STATE_WAIT_FINANCE_REVIEW)">
					<view :data-order_id="items.order_id" :data-buyer_name="items.buyer_user_name" class="u-link-btn" @click="Financialaudit">{{__('待财务审核')}}</view>
				</block>

				</view>
			</view>
			<view class="m-loading-box" style="padding-top:100upx;">
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
						<text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
					</view>
				</block>
			</view>

		</scroll-view>
		<view redirect="true" class="m-nullpage" v-else>
		    <view class="m-nullpage-middle">
		        <label class="iconfont icon-sousuo-sousuo"></label>
		        <view class="m-null-tip">
		            <text>{{__('暂无数据')}}</text>
		        </view>
		    </view>
		</view>
		<!-- 弹出层 -->
				<view class="uni-banner" style="height:320upx" v-if="bannerShow">
					<block v-if="(iscancel == 1)">
						<view class="m-tip">
							<view class="m-conter">
								<view>
									{{__('订单号')}}：{{order_id}}
								</view>
								<view>
									{{__('取消原有：无法备齐货物')}}
								</view>
							</view>
						</view>
						<view>
							<view class="button-sp-area" @click="cancelOrder">
							      <button class="mini-btn" type="warn" size="mini">{{__('确定')}}</button>
							</view>
							<view class="button-sp-area" @click="cancelbutton">
							      <button class="mini-btn" type="warn" size="mini">{{__('取消')}}</button>
							</view>
						</view>
					</block>
					<block v-if="(iscancel == 2)">
						<view class="m-tip">
							<view class="m-conter" >
								<view>{{__('审核')}}</view>
								<view>
									{{__('买家')}}：{{buyername}}
								</view>
								<view>
									{{__('订单号')}}：{{order_id}}
								</view>
							</view>
						</view>
						<view>
							<view class="button-sp-area"  @click="setaudit">
							      <button class="mini-btn" type="warn" size="mini">{{__('确定')}}</button>
							</view>
							<view class="button-sp-area"  @click="cancelbutton">
							      <button class="mini-btn" type="warn" size="mini">{{__('取消')}}</button>
							</view>
						</view>
					</block>
					<block v-if="(iscancel == 3)">
						<view class="m-tip">
							<view class="m-conter">
								<view>{{__('出库')}}</view>
								<view>
									{{__('买家')}}：{{buyername}}
								</view>
								<view>
									{{__('订单号')}}：{{order_id}}
								</view>

							</view>
						</view>
						<view >
							<view class="button-sp-area"  @click="outOrder">
							      <button class="mini-btn" type="warn" size="mini">{{__('确定')}}</button>
							</view>
							<view class="button-sp-area"  @click="cancelbutton">
							      <button class="mini-btn" type="warn" size="mini">{{__('取消')}}</button>
							</view>
						</view>
					</block>
					<block v-if="(iscancel == 4)">
						<view class="m-tip">
							<view class="m-conter">
								<view>{{__('财务审核')}}</view>
								<view>
									{{__('买家')}}：{{buyername}}
								</view>
								<view>
									{{__('订单号')}}：{{order_id}}
								</view>

							</view>
						</view>
						<view class="button">
							<view class="button-sp-area"  @click="setFinancialaudit">
							      <button class="mini-btn" type="warn" size="mini">{{__('确定')}}</button>
							</view>
							<view class="button-sp-area"  @click="cancelbutton">
							      <button class="mini-btn" type="warn" size="mini">{{__('取消')}}</button>
							</view>
						</view>
					</block>
				</view>
				<view class="uni-mask" v-if="bannerShow"></view>
				<!-- 弹出层 -->
	</view>
</template>

<script>
	import paymentBox from '../../components/payment-box.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		data() {
			return {
				isdata: false,
				tapindex: 0,
				page: 1,
				rows: 10,
				ispage: !0,
				flag: !0,
				type: 0,
				order_state_id: [],
				formId: "",
				orderlist: [],
				imgLogo: "",
				show: !1,
				Info: "",
	            order_id: [],
	            paymentData:{},
				sord: 'desc',
				bannerShow:false,
				iscancel:0,
				items:[],
				// deposit_notify_time:'',
				// trade_remark:'',
				// deposit_trade_no:'',
				// deposit_total_fee:0,
				// pm_recharge_card:0,
				// orderpayment:{},
				// payment:[],
				// id:0,
				channel_id:0,
				search_name:'',
				buyername:''
			}
		},
	    components: {
	        paymentBox,
			uniPopup
	    },
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			var that =this;

			uni.setNavigationBarTitle({
				title:this.__('订单管理')
			});



			this.setData({
				tapindex: options.sl ? options.sl : 0,
				page: 1,
				rows: 10,
				orderlist: [],
				type: options.type ? options.type : 0,
				order_state_id: options.order_state_id ? options.order_state_id.split(',') : 0
			});

			var t = this;
			this.notice.addNotification("RefreshMessage", t.RefreshMessage, t);
			this.notice.addNotification("RefreshOrder", that.RefreshOrder, that);
			this.getOrderlist()
		},
		onShow: function() {},

	    onUnload: function() {
	        //移除通知
	        // 离开页面，注销事件
	        var that = this
	        this.notice.removeNotification("RefreshMessage", that);


			this.notice.removeNotification("RefreshOrder", that);


	//         if (this.$refs.paymentBox.showBoxView) {
	//             this.$refs.paymentBox.cancel();
	//         }
	    },
	    onBackPress() {
	//         if (this.$refs.paymentBox.showBoxView) {
	//             this.$refs.paymentBox.cancel();

	//             return true;
	//         }
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
					order_state_id: this.order_state_id
				}), this.getOrderlist()
			},

			allOrder: function() {
				this.setData({
					tapindex: 0,
					page: 1,
					rows: 10,
					orderlist: [],
					ispage: !0,
					flag: !0,
					type: 0,
					order_state_id: 0
				}), this.getOrderlist()
			},

			pendingPayment: function() {
				this.setData({
					tapindex: 1,
					page: 1,
					rows: 10,
					orderlist: [],
					ispage: !0,
					flag: !0,
					type: 0,
					order_state_id: this.StateCode.ORDER_STATE_WAIT_PAY
				}), this.getOrderlist()
			},
			toBeaudited: function() {
				this.setData({
					tapindex: 2,
					page: 1,
					rows: 10,
					orderlist: [],
					ispage: !0,
					flag: !0,
					order_state_id: [2011,2013],
				}), this.getOrderlist()
			},
			toBeshipped: function() {
				this.setData({
					tapindex: 3,
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
					orderlist: [],
					order_state_id: [2020,2030],
				}), this.getOrderlist()
			},
			shipped: function() {
				this.setData({
					tapindex: 4,
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
					orderlist: [],
					order_state_id: this.StateCode.ORDER_STATE_SHIPPED,
				}), this.getOrderlist()
			},
			toBeCompleted: function() {
				this.setData({
					tapindex: 5,
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
					orderlist: [],
					order_state_id: this.StateCode.ORDER_STATE_FINISH,
				}), this.getOrderlist()
			},

			tocancel: function() {
				this.setData({
					tapindex: 6,
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
					orderlist: [],
					order_state_id: this.StateCode.ORDER_STATE_CANCEL,
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

			goSearch: function(e){
				this.setData({
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
					orderlist: [],
				})
				this.getOrderlist()
			},

			gocancel: function(e){
				this.setData({
					search_name:''
				})
			},

			inputSearch:  function(e){
				this.setData({
					search_name:e.detail.value
				})
			},

			showbutton: function(e) {
				this.setData({
					bannerShow:true,
					order_id:e.currentTarget.dataset.id,
					iscancel:1
				})
			},

			Outstock: function(e) {

				this.setData({
					bannerShow:true,
					order_id:e.currentTarget.dataset.order_id,
					buyername:e.currentTarget.dataset.buyer_name,
					iscancel:3,

				})


			},

			Orderaudit: function(e) {
				this.setData({
					bannerShow:true,
					order_id:e.currentTarget.dataset.order_id,
					buyername:e.currentTarget.dataset.buyer_name,
					iscancel:2
				})
			},

			Financialaudit: function(e) {
				this.setData({
					bannerShow:true,
					order_id:e.currentTarget.dataset.order_id,
					buyername:e.currentTarget.dataset.buyer_name,
					iscancel:4
				})
			},

			setaudit: function(){
				var that = this;
				var	params = {
						order_id:JSON.stringify(that.order_id)
					};
					that.$.request({
						url: that.Config.URL.seller.review,
						data: params,
						success: function(data, status, msg, code) {
							if (status == 200) {
								that.$.alert(that.__("审核成功！"), function() {
									that.setData({
										orderlist: [],
										page: 1,
										bannerShow:false,
										order_id:[],
										iscancel:0
									});
									that.getOrderlist();
								});
							}else{
								that.$.alert(that.__('审核失败'), function() {

								});
							}
						}
					})
			},

			setFinancialaudit: function(){
				var that = this;
				var	params = {
						order_id:JSON.stringify(that.order_id)
					};
					that.$.request({
						url: that.Config.URL.seller.review_finance,
						data: params,
						success: function(data, status, msg, code) {
							if (status == 200) {
								that.$.alert(that.__("审核成功！"), function() {
									that.setData({
										orderlist: [],
										page: 1,
										bannerShow:false,
										order_id:[],
										iscancel:0
									});
									that.getOrderlist();
								});
							}else{
								that.$.alert(that.__('审核失败'), function() {

								});
							}
						}
					})
			},




			outOrder: function() {
				var that = this;

				var params = {
					order_id:JSON.stringify(that.order_id),
				}
				//console.log(params)
				that.$.request({
					url: this.Config.URL.seller.review_picking,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==200){
							that.$.confirm(that.__("出库成功"), function (a) {
								that.setData({
									page: 1,
									rows: 10,
									ispage: !0,
									flag: !0,
									orderlist:[],
									bannerShow:false
								})
								that.getOrderlist()
							})
						}else{
							that.$.confirm(that.__('操作失败'), function (a) {

							})
						}
					}
				})
			},


			cancelbutton:function () {
				this.setData({
					bannerShow:false
				})
			},
			getOrderlist: function() {
				var that = this;
				var params = {
					page: that.page,
					rows: that.rows,
					state_type: that.type,
					order_state_id: that.order_state_id.toString(),
					sidx:'order_time',
					order_id:that.search_name,
					sord:this.sord
				};

				that.$.request({
					url: this.Config.URL.seller.order_lists,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status && data.items.length > 0) {
							for (var i = 0; i < data.items.length; i++) {
								data.items[i]['item_quantity'] = data.items[i]['item'].length
							}
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
								isdata: !0
							})

						} else {
							that.setData({
								flag: !1,
								ispage: !1,
								isdata: !1
							})
						}
					}
				});
			},
			cancelOrder: function(e) {
				var that = this;
				var	params = {
						reason: that.__('无法备齐货物'),
						order_id:JSON.stringify(that.order_id)
					};
					that.$.request({
						url: that.Config.URL.seller.cancel_order,
						data: params,
						success: function(data, status, msg, code) {
							if (status == 200) {
								that.$.alert(that.__("取消成功！"), function() {
									that.setData({
										orderlist: [],
										page: 1,
										bannerShow:false,
										order_id:[],
										iscancel:0
									});
									that.getOrderlist();
								});
							}else{
								that.$.alert(msg, function() {

								});
							}
						}
					})

			},
			writeOrder: function(e) {
				var that = this,
					params = {
						order_id: e.currentTarget.dataset.on
					};
				that.$.confirm(that.__("是否核销订单？"), function(e) {
					if (e.confirm) {
						that.$.request({
							url: that.Config.URL.user.order_receive,
							data: params,
							success: function(data, status, msg, code) {
								if (status == 200) {
									that.$.alert(that.__("核销成功！"), function() {
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
	                    user_points:this.userInfo.user_points
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
									that.sendMessage(e.currentTarget.dataset.on), that.$.alert(that.__("支付成功！"), function() {
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
	            that.$.alert(that.__('支付成功'), function(){that.$.gotopage("/member/order/detail?on=" + e.order_id)}, 2000)

	            if (this.$refs.paymentBox.showBoxView) {
	                this.$refs.paymentBox.cancel();
	            }
	        },
	        onFail: function(e) {
	        },

			RefreshOrder: function(e) {
				this.setData({
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
					orderlist: [],
				})
				this.getOrderlist()
			},

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
			}
		}
	};
</script>

<style lang="scss">
	@import "../../styles/base.scss";
	@import "../../styles/sstouch_member.scss";
	@import "../../styles/sstouch_common.scss";
	@import "../../styles/_variables";


	.input-view {
		width: 100%;
		display: flex;
		background-color: #FFFFFF;
		height: 30px;
		flex-wrap: nowrap;
		/*margin: 7px 0;*/
		line-height: 30px;
		// border:2upx solid #ebebe7;
		border-radius:15upx;
	}

	.input-view .uni-icon {
		line-height: 30px !important;
	}

	.input-view .input {
		height: 30px;
		background-color: #FFFFFF;
		border-radius: 15px;
		line-height: 30px;
		width: 80%;
		border: 0;  // 去除未选中状态边框
		outline: none; // 去除选中状态边框
		background-color: rgba(0, 0, 0, 0);// 透明背景
		padding:0 20upx;

	}

	input::placeholder{
			width:357upx;
			height:25upx;
			font-size:26upx;
			font-family:Alibaba PuHuiTi;
			font-weight:400;
			color:#6DA62F;
		}

	.sstouch-main-layout{
		position: fixed;
		width: 100%;
		top: var(--window-top);
		z-index: 2;
	}

	.m-tab {
		width: 100%;
	}

	.m-navbar-item {
		padding: 20upx 0;
		font-size: 24upx;
	}

	.m-orderlist {
		position: absolute;
		// top: calc(var(--status-bar-height) + 208upx);
		padding-top: 160upx;
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
	.m-panel-hd {
		padding:20upx;
	}
    .m-panel-hd label {
		float: right;
		color: $default-skin-bg;
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
		line-height: 40upx;
		background-color: #fff;

		font-size: 24rpx;
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

	.m-product-price text {
		font-size: 24upx;
		color: #999999;
		margin-left: 6upx
	}
	 

	.m-freight {
		color: #999;
		font-size:20upx;
	}

	.u-loadmore {
		width:100%;
	}


	.m-product-name{
		font-size: 24rpx;
	}

	.m-product-img {
		image {
			padding: 20upx;
		}
	}

	.m-product-item {
		margin-top: 0rpx; 
    }

	/* 遮罩层 */
	.uni-mask {
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 1;
	}

	/* 弹出层形式的广告 */
	.uni-banner {
		width: 70%;
		height: 20%;
		position: fixed;
		left: 50%;
		top: 50%;
		border-radius: 10upx;
		z-index: 99;
		transform: translate(-50%, -50%);
		background:#FFFFFF;
	}

	.m-conter {
		width:100%;
		height:200upx;
		margin-top:20upx;
	}

	.u-link-btn {
		padding:4upx;
	}
	.u-label{
		width:120upx;
	}

	.m-cell::before {
		border-top: 0px solid #ebebe7;
	}

	.m-nullpage {
		padding-top:100upx;
	}


	.top {
		width:100%;
		background:#f5f5f5;
		overflow:hidden;
		z-index:99;
		/*height:82upx;
		line-height:82upx;
		padding:20upx 0;*/
	}

	.m-product-name {
		height:100upx;
	}

	.button-sp-area {
		text-align:center;
		float:left;
		width:50%;

	}

	.m-tip {
		padding:10upx 30upx;
	}

	.m-product-info {
		padding:20upx 0;
	}
</style>

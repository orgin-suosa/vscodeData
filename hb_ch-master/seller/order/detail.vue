<template>
	<view class="page">
		<block v-if="(isdata)">
		<view class="m-cells">
			<view class="m-cell ">
				<view class="m-cell-bd">
					<text>{{sprintf(__('编号：%s'), orderdetail.order_id)}}</text>
					<text style="font-size: 20rpx;margin-left: 6rpx;">{{(orderdetail.payment_type_id==StateCode.PAYMENT_TYPE_DELIVER   || orderdetail.payment_type_id==StateCode.PAYMENT_TYPE_OFFLINE) ? __('货到付款') : __('在线支付')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">{{orderdetail.order_state_name}}</view>
			</view>

		</view>




		<view class="m-cells total-info" v-for="(item, ii) in orderdetail.state_employee"  :key="ii" >
			<view class="m-cell">
				<view class="m-cell-bd">
					<text>{{sprintf(__('店 员：%s'), item.user_account)}}</text>
				</view>
			</view>
		</view>




		<view class="m-product-all" v-if="(order_items_material.length > 0)">
			<view class="m-cells" style="background-color: #f5f5f5;">
				<view>
					<view class="m-cell">
						<view class="m-cell-bd">
							<text>{{__('商品明细')}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="m-product-list">
				<view v-for="(item, i) in order_items_material"  :key="i"
				 class="m-product-item">
					<view class="m-product-img">
						<image lazy-load :src="(item.order_item_image)" mode="aspectFill" />
					</view>
					<view class="m-product-info">
						<view class="m-product-name">
							<label style="webkit-line-clamp:1">{{item.item_name}}</label>
							<label class="m-min-name" style="overflow:hiddentext-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">
								{{item.spec_info?item.spec_info:""}}
							</label>
						</view>
						<view class="m-product-price">
							<block v-if="item.order_item_unit_price">
								<label>{{__('￥')}}</label>{{item.order_item_unit_price}}
							</block>
							<label class="pre-info-price" v-if="(item.order_item_discount_amount)">
								-{{__('￥')}}{{item.order_item_discount_amount}}
							</label>
							<text style="float: right;margin-right: 60upx;">x{{item.order_item_quantity}}</text>

						</view>

					</view>
				</view>
			</view>
		</view>

		<view class="m-product-all" v-if="(order_items_fictitious.length > 0)">
			<view class="m-cells" style="background-color: #f5f5f5;">
				<view>
					<view class="m-cell">
						<view class="m-cell-bd">
							<text>{{__('项目明细')}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="m-product-list">
				<view v-for="(item, i) in order_items_fictitious"  :key="i"
				 class="m-product-item">
					<view class="m-product-img">
						<image lazy-load :src="(item.order_item_image)" mode="aspectFill" />
					</view>
					<view class="m-product-info">
						<view class="m-product-name">
							<label style="webkit-line-clamp:1">{{item.item_name}}</label>
							<label class="m-min-name" style="overflow:hiddentext-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">
								{{item.spec_info?item.spec_info:""}}
							</label>
						</view>
						<view class="m-product-price">
							<block v-if="item.order_item_unit_price">
								<label>{{__('￥')}}</label>{{item.order_item_unit_price}}
							</block>
							<label class="pre-info-price" v-if="(item.order_item_discount_amount)">
								-{{__('￥')}}{{item.order_item_discount_amount}}
							</label>
							<text style="float: right;margin-right: 60upx;">x{{item.order_item_quantity}}</text>

						</view>

					</view>
				</view>
			</view>
		</view>

		<view class="m-cells total-info">
			<view class="m-cell">
				<view class="m-cell-bd">
					<text>{{__('商品总额')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">{{__('￥')}}{{orderdetail.order_item_amount}}</view>
			</view>

			<view class="m-cell" v-if="(0 && !(orderdetail.PointAsCash==0))">
				<view class="m-cell-bd">
					<text>{{__('积分抵现')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">-{{__('￥')}}{{orderdetail.PointAsCash}}</view>
			</view>
			<view class="m-cell" v-if="(0 && deduction>0)">
				<view class="m-cell-bd">
					<text>{{__('余额抵扣')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">-{{__('￥')}}{{deduction}}</view>
			</view>

		<!-- 	<view class="m-cell" v-if="(0 || orderdetail.if_delivery)">
				<view class="m-cell-bd">
					<text>{{__('运费')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">+{{__('￥')}}{{orderdetail.order_shipping_fee}}</view>
			</view> -->
		<!-- 	<view class="m-cell" v-if="(1 || orderdetail.if_delivery)">
				<view class="m-cell-bd">
					<text>{{__('订货人')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt">{{orderdetail.buyer_mobile}}</view>
			</view> -->
			<view class="m-cell" v-if="(1 || orderdetail.if_delivery)" @click="Discount">
				<view class="m-cell-bd">
					<text>{{__('其它费用')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt" v-if="(orderdetail.order_discount_amount || orderdetail.order_state_id ==  StateCode.ORDER_STATE_FINISH)">{{__('￥')}}{{orderdetail.order_discount_amount}}</view>
				<view class="m-cell-ft m-order-typetxt" v-else style="color:rgba(153,153,153,1);">{{__('请输入金额')}}</view>
			</view>

			<view class="m-cell" v-if="( orderdetail.order_state_id ==  StateCode.ORDER_STATE_FINISH)" @click="setQmin">
				<view class="m-cell-bd">
					<text>{{__('签名')}}</text>
				</view>
				<view class="m-cell-ft m-order-typetxt"  style="color:rgba(153,153,153,1);">{{__('请输入客户签名')}}</view>
			</view>
			<view class="m-cell ">
				<view class="m-cell-bd">
				</view>
				<view class="m-cell-ft m-total-info">
					{{__('实付款：')}}
					<label class="m-total-price">{{__('￥')}}{{orderdetail.order_payment_amount}}</label>
					<view class="m-total-time">{{sprintf(__('下单时间：%s'), orderdetail.order_time)}}</view>
				</view>
			</view>
			<view style="height:108upx;">
			</view>
		</view>
		<block  v-if="(false)">
			<view class="m-cells">
				<view class="m-cell">
					<view class="m-cell-bd">
						<text>{{__('订单跟踪信息')}}</text>
					</view>
				</view>
			</view>
			<view class="m-cells" style="color:#09BB07" >
				<view class="uni-timeline" style="padding: 30upx 20upx;background-color: #fff;" >
					<view class="uni-timeline-item uni-timeline-first-item" v-for="(item,index) in state_log_items" :key="index">
						<view class="uni-timeline-item-divider"></view>
						<view class="uni-timeline-item-content">
							<view>
								<text>{{sprintf(__('操 作 人：%s'), item.user_nickname)}}</text>
							</view>
							<view>
								<text>{{sprintf(__('操 作 类 别：%s'), item.order_state_note)}}</text>
							</view>
							<view class="datetime">
								<text>{{sprintf(__('操 作 时 间：%s'), item.order_state_time)}}</text>
							</view>
						</view>
					</view>
				</view>
				<view style="height:108upx;"></view>
			</view>
		</block>

		<view class="m-footer-btn" v-if="(orderdetail.order_state_id == StateCode.ORDER_STATE_WAIT_PAY)">

			<view class="handle" order_state_id="2010" buyer_name="seller">
			    <!-- <view class="u-link-btn" style="border: 2upx solid #CCC;color: #555!important;">{{orderdetail.order_state_name}}</view> -->
				<block>
					<view class="m-footer-btn">
							<view class="m-footer-btn-main m-footer-desable" style="width:30%;background:rgba(255,255,255,1);color:rgba(51,51,51,1);margin-left:20upx;" @click="showbutton">
								<label>{{__('取消订单')}}</label>
							</view>
						<navigator :url="'/seller/order/pay?on=' + orderdetail.order_id"  class="m-footer-btn-main m-footer-desable" style="float:right;margin-right:20upx;"  @click="ckselectsp">
								{{__('收款')}}
						</navigator>
					</view>
				</block>

			</view>
		</view>

		</block>

		<view redirect="true" class="m-nullpage" v-else>
		    <view class="m-nullpage-middle">
		        <label class="iconfont icon-sousuo-sousuo"></label>
		        <view class="m-null-tip">
		            <text>{{__('亲~找不到您想要的商品')}}</text>
		        </view>
		    </view>
		</view>
		<!-- 弹出层 -->
				<view class="uni-banner" style="height:320upx" v-if="bannerShow">
					<block v-if="(iscancel == 1)">
						<view style="padding: 40upx 30upx;">
							<view class="m-conter" style="height:100%;">
								<view>
									{{__('订单号')}}：{{orderdetail.order_id}}
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

					<block v-if="(iscancel == 5)">
						<view style="padding: 40upx 30upx;">
							<view class="m-conter" style="height:100%;">
								<view>
									{{__('订单号')}}：{{orderdetail.order_id}}
								</view>
								<view class="m-cell" style="padding:0;">
								    <view class="m-cell-hd"><label class="u-label">{{__('金额')}}</label></view>
								    <view class="m-cell-bd">
								        <input class="u-input" type="text" :placeholder="__('请输入优惠金额')"  @input="inputamount" :value="discount_amount"/>
								    </view>
								</view>

							</view>
						</view>
						<view class="button">
							<view class="button-sp-area"  @click="editFee">
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
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				data_info:
					{ order: {item:{}}, comment_image: [] }
				,
				options:{},
				isdata: !1,
				order_id:'',
				orderdetail:{},
				receiving:{},
				order_items:[],
				bannerShow:false,
				iscancel:0,
				orderpayment:[],
				id:0,
				payment:[],
				deposit_notify_time:'',
				trade_remark:'',
				deposit_trade_no:'',
				deposit_total_fee:0,
				pm_recharge_card:0,
				state_log_items:[],
				lengths:0,
				order_amount:0,
				discount_amount:0,
				order_items_material:[],
				order_items_fictitious:[]
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			var that = this;
			uni.setNavigationBarTitle({
				title:this.__('订单详情')
			});
			that.setData({
				options:options,
				order_id:options.on,
			})

			that.getOrderDetail()
		},

		onShow: function() {
			this.getOrderDetail();
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
							data.order_time = that.$.datetimeFormatter(data.order_time)
							that.setData({
								order_items_material:[],
								order_items_fictitious:[]
							})

							var amount = 0
							for(var t in data.items)
							{
								if(data.items[t].kind_id == 1201)
								{

									that.order_items_material.push(data.items[t])
								}
								else
								{
									that.order_items_fictitious.push(data.items[t])

								}

								amount = amount + data.items[t].order_item_unit_price * data.items[t].order_item_quantity

							}


							that.setData({
								orderdetail:data,
								order_items:data.items,
								order_amount:amount,
								discount_amount: data.order_discount_amount,
								isdata: !0
							})

							for(var i in data.state_log_items)
							{
								that.state_log_items.unshift(data.state_log_items[i])
							}


						}else{
							that.setData({
								isdata: !1
							})
						}
					}
				})
			},

			setQmin: function() {
					var that = this;
								var urlArgs = {};
								var url = '';

								url = "/seller/order/autograph";
								urlArgs.order_id = that.order_id;


								that.$.navigateTo({
									url: that.$.createUrl(url, urlArgs)
								});

			},

			cancelbutton:function () {
				this.setData({
					bannerShow:false
				})
			},

			payOrder:function(){

				var that = this;
				var id = that.id
				var params = {
					deposit_notify_time:that.deposit_notify_time,
					trade_remark:that.trade_remark,
					deposit_trade_no : that.deposit_trade_no,
					deposit_total_fee:that.deposit_total_fee,
					pm_money:0,
					pm_recharge_card:that.payment[id].payment_channel_id,
					order_id:that.orderdetail.id
				};
				that.$.request({
					url: this.Config.URL.admin.pay.offline,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==200){
							that.$.confirm(that.__("收款成功"), function (a) {
								that.getOrderlist()
							})
						}
					}
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

			inputremarks: function(e){
				this.setData({
					trade_remark:e.detail.value
				})
			},

			bindDateChange: function (e){
				this.setData({
					deposit_notify_time: e.detail.value
				})
			},

			showbutton: function(e) {
				this.setData({
					bannerShow:true,
					iscancel:1
				})
			},

			Discount: function(e) {
				if(this.orderdetail.order_state_id ==  this.StateCode.ORDER_STATE_WAIT_PAY)
				{
					this.setData({
						bannerShow:true,
						iscancel:5
					})
				}

			},

			inputamount: function(e) {
				this.setData({
					discount_amount:e.detail.value
				})
			},



			Orderaudit: function(e) {
				this.setData({
					bannerShow:true,
					iscancel:2
				})
			},

			Outstock: function(e) {
				this.setData({
					bannerShow:true,
					iscancel:3
				})
			},

			Financialaudit: function(e) {
				this.setData({
					bannerShow:true,
					iscancel:4
				})
			},

			setaudit: function(){
				var that = this;
				var	params = {
						order_id:JSON.stringify(that.orderdetail.id)
					};
					that.$.request({
						url: that.Config.URL.seller.review,
						data: params,
						success: function(data, status, msg, code) {
							if (status == 200) {
								that.$.alert("审核成功！", function() {
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
								that.$.alert('审核失败', function() {

								});
							}
						}
					})
			},

			editFee: function() {
				var that = this;
				var params = {
					order_id:that.order_id,
					discount_amount:that.discount_amount,
				}

				that.$.request({
					url: this.Config.URL.seller.edit_discount,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==200){
							that.bannerShow = false
							that.$.confirm(that.__("修改成功"), function (a) {
								if (a.confirm)
								{
								    that.setData({
								    	page: 1,
								    	rows: 10,
								    	ispage: !0,
								    	flag: !0,
								    	orderlist:[],
								    	bannerShow:false
								    })
								    that.getOrderDetail()
								}


							})
						}else{
							that.$.confirm('操作失败', function (a) {

							})
						}
					}
				})
			},

			outOrder: function() {
				var that = this;
				var params = {
					order_id:JSON.stringify(that.orderdetail.id),
				}

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
							that.$.confirm('操作失败', function (a) {

							})
						}
					}
				})
			},

			setFinancialaudit: function(){
				var that = this;
				var	params = {
						order_id:JSON.stringify(that.orderdetail.id)
					};
					that.$.request({
						url: that.Config.URL.seller.review_finance,
						data: params,
						success: function(data, status, msg, code) {
							if (status == 200) {
								that.$.alert("审核成功！", function() {
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
								that.$.alert('审核失败', function() {

								});
							}
						}
					})
			},


			cancelOrder: function(e) {
				var that = this;
				var	params = {
						reason: '无法备齐货物',

					};
				params.order_id =[]
				params.order_id.push(that.orderdetail.id)
					that.$.request({
						url: that.Config.URL.seller.cancel_order,
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
							}else{
								that.$.alert(msg, function() {

								});
							}
						}
					})

			},

			ImgTap: function(e) {
				var that = this,
					urls = [];

				for (var i in this.data_info.comment_image) {
					urls.push(this.data_info.comment_image[i]);
				}
				var s = e.target.dataset.src;

				that.$.previewImage({ current: s, urls: urls });
			},

			delImg: function(e) {
				//console.info(e);
				var dataInfo = this.data_info;
				var that = this;
				that.$.confirm(
					'是否放弃上传本张图片?',
					function(n) {
						if (n.confirm) {
							var i = [];
							for (let s = 0; s < dataInfo.comment_image.length; s++) {
								if (s != e.target.dataset.index) {
									var o = dataInfo.comment_image[s];
									i.push(o);
								}
							}
							dataInfo.comment_image = i;

							that.setData({ data_info: dataInfo });
						}
					},
					!0
				);
			},

			upImgs: function(e) {
				var that = this;
				var orderId = e.currentTarget.dataset.order_id
				if (dataInfo.comment_image && dataInfo.comment_image.length == 5) {
					that.$.alert('最多上传5张图片！');
					return;
				}
				var  dataInfo = this.data_info;

				that.$.showLoading();
					that.$.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						success: function(n) {
							that.$.showLoading();
							var r = n.tempFilePaths;
							that.$.uploadFile({
								url: that.Config.URL.upload,
								method: 'POST',
								filePath: r[0],
								name: 'upfile',
								//header: { 'content-type': 'multipart/form-data' },
								success: function(n) {
									that.$.hideLoading();
									var up_res = that.$.parseJSON(n.data);

									var s = up_res.data.url;
									dataInfo.comment_image.push(s);
									that.setData({ data_info: dataInfo});

								},
								fail: function(e) {
									that.$.hideLoading();
								},
								complete: function(e) {
									that.$.hideLoading();
								}
							});
						},
						fail: function(e) {
							that.$.hideLoading();
						},
						complete: function(e) {
							that.$.hideLoading();
						}
					});
			},

			uploadimg: function () {
				var that = this;
				var	params = {
						design_file_first: that.data_info.comment_image[0]?that.data_info.comment_image[0]:'',
						design_file_second: that.data_info.comment_image[1]?that.data_info.comment_image[1]:'',
						design_file_third: that.data_info.comment_image[2]?that.data_info.comment_image[2]:'',
						design_file_fourth: that.data_info.comment_image[3]?that.data_info.comment_image[3]:'',
						design_file_fifth: that.data_info.comment_image[4]?that.data_info.comment_image[4]:'',
					};

				that.$.request({
					url: that.Config.URL.seller.multiUpload,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.$.alert("上传成功！", function() {
							;
							});
						}else{
							that.$.alert(msg, function() {

							});
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">

	@import "../../styles/_variables";

	.input-view {
		width: 100%;
		display: flex;
		background-color: #FFFFFF;
		height: 30px;
		border-radius: 15px;
		padding: 0 4%;
		flex-wrap: nowrap;
		margin: 7px 0;
		line-height: 30px;
	}

	.input-view .uni-icon {
		line-height: 30px !important;
	}

	.input-view .input {
		height: 30px;
		line-height: 30px;
		width: 94%;
		padding: 0 3%;

	}

	.img {
		width:120upx;
		height:120upx;
	}



	.u-link-btn {
		margin:0 10upx;
		padding:0;
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
		margin:20upx 0;
	}

	.u-label{
		width:120upx;
	}

	.input-view {
		border:2upx solid #ebebe7;
		border-radius:10upx;

	}

	.m-cell::before {
		border-top: 0px solid #ebebe7;
	}



	input::placeholder{
			width:357upx;
			height:25upx;
			font-size:26upx;
			font-family:Alibaba PuHuiTi;
			font-weight:400;
			color:#6DA62F;
		}

	.m-upImg-item {
		width: 120upx;
		height: 120upx;
		border: 1px solid #eee;
		display: inline-block;
		margin: 9upx;
		border-radius: 4upx;
		vertical-align: middle;
		position: relative;
	}

	.m-upImg {
		box-sizing: border-box;
		padding: 20upx;
		background-color: #fff;
	}

	.m-upImg-item image {
		width: 100%;
		height: 100%;
	}

	.u-del-item label {
		font-size: 28upx;
	}

	.upSelect {
		background-color: #eee;
		text-align: center;
		line-height: 120upx;
	}
	.upSelect label {
		font-size: 40upx;
	}

	.m-cell {
		padding-top:20upx;
	}








	//分割


	.m-cells {
		font-size: 28upx;
	}

	.m-order-typetxt {
		color: $default-skin-bg;
		font-size: 28rpx;

		text{
			font-size: 24rpx;
		}
	}

	.m-total-price {
		text{
			font-size: 24rpx;
		}
	}


	.m-addres-info {
		padding: 32upx 0;
		background-color: white;
		overflow: hidden;
		position: relative;
		margin-top: 20upx;
	}

	.m-ad-name {
		display: -webkit-box;
		position: relative;
		margin-left: 40upx;
		-webkit-box-flex: 1;
		height: 20px;
		line-height: 20px;
		font-weight: 400;
		font-size: 14px;
	}

	.m-ad-name text {
		margin: 0 20upx;
	}

	.m-ad-name::after {
		content: "\e7e0";
		position: absolute;
		left: -25upx;
		width: 30upx;
		height: 30upx;
		font-family: "iconfont" !important;
		text-align: center;
		line-height: 35upx;
		font-size: 60upx;
		background-size: cover;
		top: 50%;
		margin-top: -14upx;
	}

	.m-ad-address {
		width: 650upx;
		margin-left: 20upx;
		display: -webkit-box;
		-webkit-box-flex: 1;
		line-height: 40upx;
		font-weight: 400;
		font-size: 14px;
		position: relative;
		padding-left: 40upx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		color: #888;
	}

	.m-product-all {
		margin-top: 20upx;
	}

	.total-info {
		margin-top: 20upx;
	}

	.m-panel-hd::after {
		border: none;
	}

	.m-total-info {
		padding: 10upx;
		font-size: 24upx;
		color: #000;
	}

	.m-total-info label {
		font-size: 32upx;
		color: $default-skin-bg;
	}

	.m-total-time {
		color: #888;
	}

	.m-footer-btn {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		text-align: right;
		box-sizing: border-box;
		padding: 20upx;

		&:before {
			content: " ";
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			height: 1px;
			border-top: 1px solid #E5E5E5;
			color: #E5E5E5;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
		}
	}

	.u-link-btn {
		margin: 0 10upx;
		vertical-align: middle;
		display: inline-block;
		line-height: 40upx;

		font-size: 24rpx;
	}

	.m-product-price text {
		font-size: 28upx;
		color: #888;
		background-color: #fff;
	}

	.massage {
		width: 100%;
		height: 100upx;
		display: flex;
		border-bottom: 2upx solid #d9d9d9;
		background: #fff;
		font-size: 28upx;
		color: #000;
	}

	.massage-name {
		margin-left: 40upx;
	}

	.massage-tel {
		margin-left: 40upx;
	}

	.code1 {
		width: 100%;
		display: flex;
		flex-flow: column;
		align-items: center;
		align-content: space-between;
	}

	.code image {
		width: 50%;
	}

	.code text {
		font-size: 24upx;
		color: #717171;
	}

	.move-area {
		/*
		position: absolute;
		min-height: 100%;
		width: 100%;
		*/
	}

	.move-img {
		height: 126upx;
		width: 100upx;
		z-index: 5;
		margin-top: 70%;
		margin-left: 650upx;
	}

	.move-img image {
		height: 126upx;
		width: 100upx;
	}

	.shareRPK {
		position: fixed;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		top: 0;
		left: 0;
		z-index: 5;
	}

	.shareRPKBox {
		width: 640upx;
		height: 698upx;
		background-color: red;
		position: absolute;
		top: 40%;
		left: 50%;
		margin-left: -320upx;
		margin-top: -349upx;
	}

	.sendRPK {
		width: 222upx;
		height: 70upx;
		position: absolute;
		left: 50%;
		margin-left: -100upx;
		top: 50%;
		margin-top: 140upx;
	}

	.closeRPK {
		width: 50upx;
		height: 50upx;
		position: absolute;
		left: 50%;
		margin-left: -22upx;
		bottom: 25upx;
	}

	.shareCodeImg {
		height: 800upx;
	}

	.m-product-name{
		font-size: 24rpx;
	}

	.m-product-img {
		image {
			padding: 20upx;
		}
	}

	.u-link-btn {
		padding:6upx 10upx;
	}

	.button-sp-area {
		text-align:center;
		float:left;
		width:50%;

	}

	.m-tips {
		padding:18upx 30upx;
	}

 
	.m-cells::before{border: none;}


	/*底部按钮 start*/
	.m-footer-btn {
		height: 98upx;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background:rgba(229,229,229,1);
		text-align: center;
		z-index: 3;
		padding:0;
	}

	.m-footer-btn-list {
		width: 50%;
		height: 100%;
		position: relative;
		float: left;
		text-align: center;
		line-height:98upx;

	}

	.m-footer-btn-list label {
		font-size:36upx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(51,51,51,1);
	}

	.m-footer-btn-list::before {
		content: " ";
		position: absolute;
		left: 0;
		top: -2upx;
		right: 0;
		height: 2upx;
		border-bottom: 2upx solid #d5d5d5;
		color: #CCCCCC;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 3;

	}

	.m-footer-btn-item {
		position: relative;
		float: left;
		width: 33.3333333333333%;
		font-size: 24upx;
		color: #888;
		line-height: 40upx;
		padding: 15upx 0;
		// border-right: 1upx solid #d5d5d5;
		box-sizing: border-box;
	}

	.m-footer-btn-item::last-child {
		border: none;
	}

	.m-footer-btn-icon {
		width: 40upx;
		height: 28upx;
		// margin: 0 auto;
		position: relative;
		line-height:28upx;
		top:28upx;
	}

	.m-footer-btn-item image {
		width: 40upx;
		height: 40upx;
	}

	.m-footer-btn-item contact-button {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		opacity: 0;
	}

	.m-footer-btn-main {
		width:50%;
		height: 76upx;
		float: left;
		background:rgba(230,0,18,1);
		border-radius:38upx;
		font-size: 32upx;
		line-height:76upx;
		margin:12upx auto;
		font-size:36upx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(255,255,255,1);

	}
</style>


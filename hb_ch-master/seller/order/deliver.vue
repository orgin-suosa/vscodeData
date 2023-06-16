<template>
	<view class="page">
		<view class="sstouch-main-layout mb20">
		    <view class="sstouch-oredr-detail-block">
		        <view class="h3"><label class="b" style="color:orange;margin-right:10upx;">{{__('第一步')}}</label> <label class="m-title">{{__('选择出库单')}}</label>
		            <block v-if="(orderStock.length > 0)">
		              <picker mode="selector" @change="selectOrderStock"  :value="id" :range="orderStock" range-key="stock_bill_id" style="float:right">
		            	<label style="padding:0 40upx;">{{orderStock[id].stock_bill_id}}</label>
		              </picker>
					</block>
		        </view>
		    </view>
		    <view class="sstouch-oredr-detail-block ">
		        <view class="sstouch-order-item" id="stock_bill" style="border-bottom:0px;"></view>
		    </view>
		    <view class="sstouch-oredr-detail-block mt5">
		        <view class="h3"><label class="b" style="color:orange;margin-right:10upx;">{{__('第二步')}}</label> <label class="m-title">{{__('确认发货信息')}}</label> </view>
		    </view>
		    <view class="sstouch-oredr-detail-block ">
		        <view class="sstouch-oredr-detail-add">
		            <view class="dl" id="address_list">
		                <view class="sstouch-oredr-detail-add">
		                    <view class="m-ber-image" style="width:10%;float:left">
		                    	<view class="iconfont zc zc-shouhuodizhi1 i-type" style="opacity:0.7"></view>
		                    </view>
		                    <view class="dl">
		                        <view class="dt" style="font-size:28upx;">{{__('收货人')}}：
		                            <text class="span">{{delivery.da_name}}</text>
		                            <text class="span">{{delivery.da_mobile}}</text>
		                        </view>
		                        <view class="dd">{{__('收货地址')}}：{{delivery.da_province}}/{{delivery.da_city}}/{{delivery.da_county}} {{delivery.da_address}}</view>
		                    </view>
		                </view>
		            </view>
		        </view>
		    </view>
		    <view class="sstouch-oredr-detail-block mt5">
		        <view class="h3"><label class="b" style="color:orange;margin-right:10upx;">{{__('第三步')}}</label><label class="m-title">{{__('选择物流服务')}}</label> </view>
		    </view>
		    <view class="sstouch-oredr-detail-block ">
		        <view class="tabBox" id="tabBox1">
					<view style="display: inline-block;" v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="ontabtap">
					    <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
					</view>
		            <view class="tempWrap" style="overflow:hidden; position:relative;padding:0upx 36upx">
						<swiper :current="tabIndex" class="swiper-box" style="flex: 1;height:500upx;" :duration="300" @change="ontabchange">
						    <swiper-item class="swiper-item">
								<view class="m-cell">
								    <view class="m-cell-hd" style="margin-top:20upx"><label class="u-label">{{__('发货时间')}}</label></view>
									<view class="m-cell-bd" style="margin-top:20upx;">
											<picker mode="date"  @change="bindDateChange" style="border:2upx solid #ebebe7;width: 58%;height:60upx;border-radius:10upx;line-height:60upx;">
												<label>{{delivertime}}</label>
											</picker>
									</view>
								</view>
								<view class="m-cell">
								    <view class="m-cell-hd"><label class="u-label">{{__('物流单号')}}</label></view>
								    <view class="input-view">
								    	<input  style="font-size:26upx;margin:10upx auto;"  class="input" type="text"  @input="inputnumber">
								    </view>
								</view>
								<view class="m-cell">
								    <view class="m-cell-hd"><label class="u-label">{{__('物流公司')}}</label></view>
									<picker :value="indexs" :range="logistics_company" range-key="logistics_name"  @change="inputcompany" style="border:2upx solid #ebebe7;width: 40%;height:60upx;border-radius:10upx;line-height:60upx;">
										<label>{{logistics_company[indexs].logistics_name}}</label>
									</picker>
								</view>
								<view class="m-cell">
								    <view class="m-cell-hd"><label class="u-label">{{__('备注')}}</label></view>
								    <view class="input-view">
								    	<input  style="font-size:26upx;margin:10upx auto;" class="input" type="text" @input="inputremarks">
								    </view>
								</view>

								 <view class="button-sp-area" style="text-align:center;padding-top:20upx;" @click="detebutton">
								       <button class="mini-btn" type="warn" size="mini">{{__('确定')}}</button>
								 </view>
							</swiper-item>
							<swiper-item class="swiper-item">
								<view class="m-conter">
									<label>{{__('如果订单中的商品无需物流运送，您可以直接点击确认')}}</label>
								</view>
								<view class="button-sp-area" style="text-align:center;padding-top:20upx;" @click="detebutton">
								      <button class="mini-btn" type="warn" size="mini">{{__('无需物流')}}</button>
								</view>
							</swiper-item>
						</swiper>
		            </view>
		        </view>
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
				id:0,
				orderinfo:{},
				delivery:{},
				newsList: [],
				cacheTab: [],
				tabIndex: 0,
				delivertime:'',
				logistics_number:'',
				logistics_company:[
					{logistics_name:'选择快递公司'}
				],
				order_remarks:'',
				logistics_id:0,
				indexs:0,
				orderStock: [],
				tabBars:[
					{
						name: '物流运输',
						id: 1
					},
					{
						name: '无需物流运输',
						id: 2
					}
				]
			}

		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('发货')
			});

			var t = this;
			this.setData({
				order_id:options.on
			})
			this.getOrderdetail();


		},

		onShow: function(){
			this.getlogistics();
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			getOrderdetail:function () {
				var that = this;
				var params = {
					order_id:that.order_id
				};
				//console.log(params)

				that.$.request({
					url: this.Config.URL.seller.getOrderStock,
					data: params,
					success: function(data, status, msg, code) {
						//console.log(data)
						if(status == 200){
							that.setData({
								orderinfo : data.order_detail,
								delivery : data.order_detail.delivery,
								orderStock : data.stock_bill
							})
						}


					}
				})
			},

			selectOrderStock: function (e){
				this.setData({
					id: e.detail.value,
				})

				//console.log(this.id)
			},


			getlogistics: function (){
				var that = this;
					var params = {
						logistics_is_enable:1
					};
					that.$.request({
						url: this.Config.URL.seller.lists_express_logistics,
						data: params,
						success: function(data, status, msg, code) {
							if(status == 200){
								if (data.items.length > 0)
								{
									that.setData({
										logistics_company : data.items,
									})
									//console.log(that.logistics_company)
								}
							}
						}
					})

			},
			ontabtap(e) {
				//console.log(e.currentTarget.dataset.current)
			    this.setData({
					tabIndex:e.currentTarget.dataset.current
				})
			},

			bindDateChange: function (e){
				this.setData({
					delivertime: e.detail.value
				})
			},

			inputnumber: function (e){
				this.setData({
					logistics_number: e.detail.value
				})
			},
			inputcompany: function (e){
				this.setData({
					indexs: e.detail.value,
				})
			},
			inputremarks: function (e){
				this.setData({
					order_remarks: e.detail.value
				})
			},

			detebutton: function (){
				var that = this;
				var id = that.indexs
				var t = that.id
					var params = {
						order_id:that.order_id,
						stock_bill_id: that.orderStock[t].stock_bill_id,
						logistics_time:that.delivertime,
						order_tracking_number:that.logistics_number,
						logistics_id:that.logistics_company[id].logistics_id,
						logistics_explain:that.order_remarks
					};

					that.$.request({
						url: this.Config.URL.seller.saveOrderLogistics,
						data: params,
						success: function(data, status, msg, code) {
							if(status == 200){
								that.$.alert("发货成功！", function() {
									setTimeout(function () {
										that.$.gotopage("/seller/order/lists?order_state_id=2040&sl=4")
									}, 1500)
								})
							}else{
								that.$.alert('操作失败')
							}
						}
					})
			},

			nobutton: function(){
				//console.log(565)
			},
			ontabchange: function(e){
				//console.log(e)
			},


		}
	};
</script>

<style lang="scss">
	@import "../../styles/base.scss";
	@import "../../styles/sstouch_member.scss";


	.uni-tab-item {
	    /* #ifndef APP-PLUS */
	    display: inline-block;
	    /* #endif */
	    flex-wrap: nowrap;
	    padding-left: 34upx;
	    padding-right: 34upx;
	}

	.uni-tab-item-title {
	    color: #555;
	    font-size: 30upx;
	    height: 80upx;
	    line-height: 80upx;
	    flex-wrap: nowrap;
	    /* #ifndef APP-PLUS */
	    white-space: nowrap;
	    /* #endif */
	}

	.uni-tab-item-title-active {
	    color: #e44d4d;
	}

	.tabs {
	    flex: 1;
	    flex-direction: column;
	    overflow: hidden;
	    background-color: #ffffff;
	    /* #ifdef MP-ALIPAY || MP-BAIDU */
	    height: 100vh;
	    /* #endif */
	}

	.line-h {
	    height: 1upx;
	    background-color: #cccccc;
	}

	.m-cell {
		padding:10upx 0;
	}

	.m-cell::before {
		border-top: 0px solid #ebebe7;
	}

	.input-view {
		width: 40%;
		height:60upx;
		border:2upx solid #ebebe7;
		border-radius:10upx;
		line-height:60upx;
	}

	.input-view .input {
		background-color: #FFFFFF;
		border: 0;  // 去除未选中状态边框
		outline: none; // 去除选中状态边框
		background-color: rgba(0, 0, 0, 0);// 透明背景

	}



	uni-button {
		width:100%;
		height:80upx;
		background: #ff6700;
		line-height:80upx;
		font-size:30upx;
	}

	.m-conter {
		color: #999;
		text-align: center;
		padding: 10upx 0;
	}

	.b {
		font-size:26upx;
	}

	.m-title {
		font-size:30upx;
		color: #555;
	}

	.dt {
		font-size:30upx;
		color: #555;
	}

	.span {
		font-size:28upx;
		color: #555;
	}


</style>

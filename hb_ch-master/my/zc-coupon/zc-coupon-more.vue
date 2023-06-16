<template>
	<view class="page">
		<view  v-if="(ispage)">
				<view class='coupon-box' v-if="VoucherList.length>0">
					<view v-for="(item, i) in VoucherList" :key="i"
						:class='["coupon-item"]'>
						<view class="coupon_bg">
							<view class="left_bg">
								<image class="left_img" src="https://qnsp.zcskjy.com/zc_images/mine/zc_coupon_bg.png"></image>
								<view class='price'><label>{{__('￥')}}</label>{{item.activity_rule.voucher_price}}</view>
								<view class='price_access'>{{sprintf(__('满￥%s可用'), item.activity_rule.requirement.buy.subtotal)}}</view>
								<!-- <view class='price_access'>满{{item.activity_rule.requirement.buy.subtotal}}可用</view> -->
							</view>
				
							<view class="right_part">
								<text class="right_te1">{{item.activity_name}}</text>
								<text class="right_te2">{{sprintf(__('有效日期至：%s'), item.activity_endtime)}}</text>
								<view class="right_b">
									<navigator 
										:url='"/activity/coupon/detail?cid=" + item.activity_id + "&couponItemId=" + item.id'
										:data-id="item.activity_id">
										<view style="display: flex;align-items: center;">
											<!-- <text class="tip">使用说明</text>
											<image style="width:24rpx ;height: 24rpx;margin-left: 10rpx;"
												src="https://qnsp.zcskjy.com/zc_images/mine/zc_coupon_more.png"></image> -->
										</view>
									</navigator>
									<text class="use" @click="doReceive(i,$event)">立即领取</text>
				                   
								</view>
							</view>
							
						</view>
					</view>
				</view>

			<view class="m-nullcontent" v-else>
				<view class="m-nullpage-middle">
					<label class="iconfont icon-meiyougengduo"></label>
					<view class="m-null-tip">
						<text>{{__('亲~什么都没有')}}</text>
						<text>{{__('没有可领的优惠券~')}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="msk1" v-if="(!flag)" @click="outertouch">
			<view class="m-coupon-box" @click.stop="innertouch">
				<view class="m-coupon-box-top">

				</view>
				<view class="m-coupon-box-content">

					<view class="m-coupon-box-title">
						{{__('优惠券领取成功')}}
						<view class="m-coupon-box-tip">{{__('点击右上角分享给好友')}}</view>
					</view>
					<scroll-view scroll-y="true" class="m-coupon-box-list">
						<view class="m-coupon-box-item" v-for="(item, index) in Coupons" :key="index">
							<label>{{item.activity_rule.voucher_price}}</label>
							<text>{{item.activity_name}}</text>
						</view>
					</scroll-view>
				</view>
				<view class="m-coupon-box-bottom">

				</view>
				<view class="closeRPK" @click.stop="outertouch">
					<image lazy-load style="width:50upx;height:50upx" src="https://qnsp.zcskjy.com/zc_images/images/delete.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import $ from "../../helpers/util";
	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		data() {
			return {
				options: {},
				ispage: !1,
				VoucherList: [],
				Coupons: [],
				flag: !0,
				Id: 0,
				Code: "",
				index: 0,
				needed_point: 0,
				store_id: 0,
				activity_id:''
			};
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin'
		]),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('领取优惠券')
			});
			console.log(options.store_id)
			this.setData({
				options:options,
			})
			var that = this;
			$.isNull(this.userInfo) ? this.getUserInfo(function() {
					that.getCouponlist()
				},
				options.uid) : that.getCouponlist()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			doReceive(i,e) {
			
			    console.log('---e111----',i);
			    console.log('---e00----',e.currentTarget);
			     
				let storeModel = this.VoucherList[i];
				this.store_id = storeModel.store_id;
				this.activity_id = storeModel.activity_id;
				console.log('---storemodel----',storeModel);
				 
				var that = this;
				// if (e.currentTarget.dataset.isreceive == -1) {			
				// 	that.$.navigateTo({
				// 	    url: "/pagesub/index/store?store_id=" + e.currentTarget.dataset.store_id
				// 	})
				// 	return;
				// }
				// if(e.currentTarget.dataset.store_id){
				// 	that.setData({
				// 		Id: e.currentTarget.dataset.id,
				// 		needed_point: e.currentTarget.dataset.point,
				// 		store_id: e.currentTarget.dataset.store_id,
				// 	});
				// }
				// console.log('---store_id--1--',this.store_id);
				 
				// that.getUserReceiveCoupon();
				that.addVoucher();
			},
			outertouch: function() {
				this.setData({
					flag: !0
				})
			},
			innertouch: function() {
				this.setData({
					flag: !1
				})
			},
			
			getCouponlist: function() {
				var params = {
					store_id:this.options.store_id
				},
				that = this;
				
				that.$.request({
					url: this.Config.URL.point.voucher,
					data: params,
					loading:false,
					success: function(data, status, msg, code) {
						console.log('---datalist---',data.items);
						
						for (let i = 0; data.items.length > i; i++) {
							data.items[i].activity_endtime = $.dateFormat(data.items[i].activity_endtime, "yyyy-MM-dd");
						}
						if (200 == status) {
							that.setData({
								VoucherList: data.items,
								ispage: !0
							})
						} else {
							that.setData({
								flag: !1,
								ispage: !1
							})
						}
					},
					fail: function(data) {
						that.setData({
							flag: !1,
							ispage: !1
						})
					}
				});
			},
			
			getUserReceiveCoupon: function() {
				var point = this.needed_point,
					that = this;
				if (point > 0) {
					$.confirm(that.sprintf(that.__('确定消耗 %d 兑换优惠券?'), point), function(e) {
						if (e.confirm) {
							that.addVoucher();
						}
					}, !0);
				} else {
					that.addVoucher();
				}
			},
			
			addVoucher: function() {
				var that = this;
				var params = {
					activity_id: this.activity_id,
				};
							
				that.$.request({
					url: this.Config.URL.user.voucher_add,
					data: params,
						loading:false,
					success: function(data, status, msg, code) {
					
						if (200 == status) {
							that.$.confirm(that.__("领取成功!去消费"), function(a) {
								
								if (a.confirm){
									// uni.navigateBack({
									// 	delta: 1
									// });
								
									that.$.redirectTo({
										url: "/member/product/coupon?store_id=" + data.store_id + "&voucher_item_id=" + data.item_id
									})
								}
							});
						} else {
							
							uni.showToast({
								icon:'none',
								title:msg
							})
						}
					},
				});
			},
			
			onShareAppMessage: function() {
				// #ifdef MP-WEIXIN
				wx.showShareMenu({
					withShareTicket: true,
					menus: ['shareAppMessage', 'shareTimeline']
				});
				// #endif

				return {
					title: this.shopInfo.store_name,
					desc: this.shopInfo.VendorInfo,
					path: "/activity/coupon/list?uid=" + this.userInfo.user_id
				}
			},

			/**
			 * 用户点击右上角分享朋友圈
			 */
			onShareTimeline: function () {
				return {
					title: this.shopInfo.store_name,
					query: {
						uid: this.userInfo.user_id
					}
				}
			},

			receivenowWeixin: function(e) {
				// //console.log("领取卡券：", e.currentTarget.dataset.cardid);
				var that = this,
					params = {
						activity_id: e.currentTarget.dataset.cardid,
						openid: this.userInfo.openId
					};
				// 微信卡券
				/*$.xsr($.makeUrl(userapi.receiveWeixinCoupons, n), function (n) {
                    //console.log("领取成功1", n), $.addCard({
                        cardList: [{
                            cardId: n.Info.cardId,
                            cardExt: '{"openId": "' + this.userInfo.openId + '", "timestamp": "' + n.Info.timestamp + '", "signature":"' + n.Info.signature + '","nonce_str":"' + n.Info.nonce_str + '",}'
                        }], success: function (r) {
                            //console.log("领取成功", r);
                            var i = {code: r.cardList[0].code, access_token: n.Info.access_token};
                            $.xsr($.makeUrl(userapi.codeDecode, i), function (n) {
                                //console.log("解码成功：", $.parseJSON(n.Info));
                                var r = $.parseJSON(n.Info);
                                that.setData({Code: r.code, Id: e.currentTarget.dataset.id}), that.getUserReceiveCoupon()
                            })
                        },
                        fail: function (e) {
                            //console.log("领取失败", e)
                        },
                        complete: function (e) {
                            //console.log("领取成功或者失败", e)
                        }
                    })
                })*/
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../styles/_variables";
    
	.page{
		background-color: #FCFCFC;
		width: 100%;
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
	}


	.m-coupon-list {
		margin-top: 36upx
	}

	.m-coupon-item {
		width: 700upx;
		height: 192upx;
		margin: 10upx auto;
		background: url(https://static.shopsuite.cn/xcxfile/appicon/Coupon_V2.png) no-repeat;
		background-size: contain;
		box-sizing: border-box;
		padding: 12upx;
	}

	.m-coupon-info {
		float: left;
		width: 485upx;
		margin-left: 30upx;
		margin-top: 9.5upx;
	}

	.m-coupon-btn {
		float: left;
		width: 110upx;
		margin-left: 30upx;
		line-height: 35upx;
		text-align: center;
		font-size: 24upx;
		color: #fff;
	}

	.btn-coupon {
		display: inline-block;
		width: 28upx;
	}

	.btn-coupon-gray {
		color: #888;
	}

	.m-coupon-text {
		float: left;
		width: 300upx;
	}

	.m-coupon-text label {
		display: inline-block;
		color: #333;
		font-size: 28upx;
		width: 350upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 32rpx;
	}

	.m-coupon-text text {
		display: inline-block;
		width: 350upx;
		font-size: 24upx;
		color: #888;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 32rpx;
	}

	.m-coupon-price {
		float: left;
		height: 132upx;
		color: $default-skin-bg;
		font-weight: bold;
		line-height: 132upx;
		width: 180upx;
		position: relative;
		font-size: 64upx;
	}

	.price-content-box {
		position: absolute;
		left: -35upx;
		text-align: center;
		width: 220upx;
	}

	.price-content-box label {
		font-size: 32upx;
	}

	.closeRPK {
		width: 50upx;
		height: 50upx;
		position: absolute;
		left: 50%;
		margin-left: -30upx;
		bottom: -80upx;

	}
	.coupon_bg {
		display: flex;
		width: 92%;
		height: 220rpx;
		margin-left: 4%;
		margin-top: 10rpx;
		margin-bottom: 15rpx;
		overflow: hidden;
		border-radius: 15rpx;
		position: relative;
	}
	
	.left_bg {
		width: 247rpx;
		height: 220rpx;
	}
	
	.left_img {
		width: 247rpx;
		height: 220rpx;
	}
	
	.price {
		position: absolute;
		font-size: 80rpx;
		line-height: 80upx;
		width: 247rpx;
		color: #FFFFFF;
		font-weight: bold;
		text-align: center;
		top: 40rpx;
	}
	
	.price label {
		font-size: 30rpx;
		display: inline-block;
	}
	
	.price_access {
		position: absolute;
		font-size: 26rpx;
		line-height: 28rpx;
		width: 220rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
		color: #FFFFFF;
		text-align: center;
		top: 127rpx;
	}
	
	.right_part {
		flex: 1;
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		justify-content: center;
		align-items: center;
	}
	
	.right_te1 {
		width: 383rpx;
		height: 78rpx;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 39rpx;
	}
	
	.right_te2 {
		width: 383rpx;
		height: 33rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		line-height: 33rpx;
	}
	
	.right_b {
		width: 383rpx;
		height: 50rpx;
		margin-top: 5rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.tip {
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		line-height: 33rpx;
	}
	
	.use {
		width: 130rpx;
		height: 50rpx;
		text-align: center;
		color: #FFFFFF;
		margin-top: 10rpx;
		font-size: 24rpx;
		line-height: 50rpx;
		border-radius: 25rpx;
		background: -webkit-linear-gradient(left, #ff6161, #ff9561);
	}
	
	.use_2 {
		width: 130rpx;
		height: 50rpx;
		text-align: center;
		color: #ff6161;
		font-size: 24rpx;
		line-height: 50rpx;
	}
</style>

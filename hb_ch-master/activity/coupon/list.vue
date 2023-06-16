<template>
	<view class="page">
		<scroll-view scroll-y="true" class="m-product-all u-pa" @scrolltolower="scrollbottom" :scroll-top="scposition"
			@scroll="scrolltoupper">
			<view class="m-coupon-list">
				<block v-if="(VoucherList.length>0)">

					<view class="m-coupon-item" v-for="(item, index) in VoucherList" :key="index">
						<view class="m-coupon-info">
							<view class="m-coupon-text">
								<label>{{item.activity_name}} <span
										style="font-size: 18upx;margin-left:8upx;color:#FF9933">{{item.store_name}}</span></label>
								<text>{{sprintf(__('满￥%s可用，消耗 %s 积分领取。%s'), item.activity_rule.requirement.buy.subtotal, item.activity_rule.requirement.points.needed, item.activity_remark)}}</text>
								<text>{{sprintf(__('有效日期至：%s'), item.activity_endtime)}}</text>
							</view>
							<view class="m-coupon-price">
								<view class="price-content-box ">
									<label>{{__('￥')}}</label>{{item.activity_rule.voucher_price}}
								</view>
							</view>
						</view>
						<view class="m-coupon-btn" @click="doReceive" :data-isreceive="(item.if_gain ? '1' : '-1')"
							:data-id="(item.activity_id)" :data-point="(item.activity_rule.requirement.points.needed)"
							:data-store_id="(item.store_id)">
							<block v-if="(item.if_gain)">
								<label
									:class="['btn-coupon', item.if_gain ? '' : 'btn-coupon-gray']">{{ __('立即领取')}}</label>
							</block>
							<block v-else>
								<label
									:class="['btn-coupon', item.if_gain ? '' : 'btn-coupon-gray']">{{__('已经领取')}}</label>
								<label
									:class="['btn-coupon', item.if_gain ? '' : 'btn-coupon-gray']">{{__('去消费')}}</label>
							</block>
							<!-- <label :class="['btn-coupon', item.if_gain ? '' : 'btn-coupon-gray']">{{item.if_gain ? __('立即领取'):__('已经领取 去消费') }}</label> -->
						</view>
					</view>

				</block>
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
			<!-- <view class="msk1" v-if="(!flag)" @click="outertouch">
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
						<image lazy-load style="width:50upx;height:50upx" src="/static/images/delete.png"></image>
					</view>
				</view>
			</view> -->
			<view class="m-loading-box">
			    <block v-if="(ispage)">
			        <view class="u-loadmore">
			            <label class="u-loading"></label>
			            <text class="u-loadmore-tips">{{__('正在加载')}}</text>
			        </view>
			    </block>
			    <block v-else>
			        <view class="u-loadmore u-loadmore-line">
			            <text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
			        </view>
			    </block>
			</view>
		</scroll-view>
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
				ispage: !0,
				VoucherList: [],
				Coupons: [],
				flag: !0,
				old: {
					scposition: 0
				},
				post:{
					page: 1,
				},
				scposition: '',
				Id: 0,
				Code: "",
				index: 0,
				needed_point: 0,
				store_id: 0,
			};
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: this.__('领取优惠券')
			});
			console.log(options.store_id)
			this.setData({
				options: options,
			})
			var that = this;
			$.isNull(this.userInfo) ? this.getUserInfo(function() {
					that.getCouponlist()
				},
				options.uid) : that.getCouponlist()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			doReceive: function(e) {

				var that = this;
				if (e.currentTarget.dataset.isreceive == -1) {
					that.$.navigateTo({
						url: "/pagesub/index/store?store_id=" + e.currentTarget.dataset.store_id
					})
					return;
				}
				that.setData({
					Id: e.currentTarget.dataset.id,
					needed_point: e.currentTarget.dataset.point,
					store_id: e.currentTarget.dataset.store_id,
				});

				that.getUserReceiveCoupon();
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
						store_id: this.options.store_id,
						page: this.post.page
					},
					that = this;
				$.request({
					url: this.Config.URL.point.voucher,
					data: params,
					// ajaxCache: {
					// 	timeout: this.Config.CACHE_EXPIRE
					// },
					success: function(data, status, msg, code) {
						for (let i = 0; data.items.length > i; i++) {
							data.items[i].activity_endtime = $.dateFormat(data.items[i].activity_endtime,
								"yyyy-MM-dd");
						}
						
					
						
						if (200 == status && data.items.length > 0) {
							
							if (data.page >= data.total) {
								that.setData({
									flag: !1,
									VoucherList: that.VoucherList.concat(data.items),
									ispage: !1,
								})
							} else {
								that.setData({
									flag: !0,
									VoucherList: that.VoucherList.concat(data.items),
									ispage: !0
								})
							}
						} else {
							that.setData({
								flag: !1,
								ispage: !1,
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
					activity_id: this.Id,
					Code: this.Code,
					user_is_new: 0
				};
				$.request({
					url: this.Config.URL.user.voucher_add,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							that.$.confirm(that.__("领取成功!去消费"), function(a) {
								if (a.confirm) {
									that.$.navigateTo({
										url: "/pagesub/index/store?store_id=" + that
											.store_id
									})
								}

							});



							// that.getCouponlist()
						} else {
							// $.alert(msg);
							that.$.confirm(that.__(msg));
							// that.$.confirm(that.__("已经领取!去消费"),function(a) {
							// 	if (a.confirm)
							// 	{
							// 		that.$.navigateTo({
							// 		    url: "/pagesub/index/store?store_id=" + that.store_id
							// 		})
							// 	}

							// });
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
			onShareTimeline: function() {
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
			},
			scrollbottom: function(e) {
			    if (this.flag) {
			        var that = this;
			        that.setData({ flag: !1 }), clearTimeout(n);
			
			        var post = this.post;
					/*
			        post.sidx = 'product_unit_price';
			        post.sord = this.sort == 1 ? 'DESC' : 'ASC';
					*/
			        post.page = parseInt(that.post.page) + 1;
			
			        var n = setTimeout(function() {
			            that.setData({
			                post: post
			            }),
			                that.getCouponlist();
			        }, 500);
			    }
			},
			scrolltoupper: function(t) {
				this.old.scposition = t.detail.scrollTop;
			},
		}
	}
</script>



<style lang="scss">
	@import "../../styles/_variables";

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
</style>

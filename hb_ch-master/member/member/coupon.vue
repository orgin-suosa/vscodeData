<template>
	<view class="page">
		<view class="m-tab">
			<view class="m-navbar">
				<view :class="'m-navbar-item ' + (tapindex==0?'m-navbar-item-on':'')" @click="neverused">
					{{__('未使用')}}({{numNeverUsed}})
				</view>
				<view :class="'m-navbar-item ' + (tapindex==1?'m-navbar-item-on':'')" @click="alreadyused">
					{{__('已使用')}}({{numAlreadyused}})
				</view>
				<view :class="'m-navbar-item ' + (tapindex==2?'m-navbar-item-on':'')" @click="outdated">
					{{__('已过期')}}({{numOutdated}})
				</view>
			</view>
		</view>

		<block v-if="UserCoupon.length>0">
			<view class="m-scrollBox" scroll-y="true" @scrolltolower="scrollbottom">
				<view class='coupon-box' v-if="UserCoupon.length>0">
					<view v-for="(item, i) in UserCoupon" :key="i" :class='["coupon-item", tapindex==1?"is-user":"", tapindex==2?"is-overdue":""]'>
						<navigator hover-class='none' class='cl' :url="'/activity/coupon/detail?cid=' + item.activity_id + '&couponItemId=' + item.id">
							<view class='clt'>{{item.activity_name}}
							</view>
							<view class='clb'>
								<view class='clb-where'>{{sprintf(__('满￥%s可用'), item.voucher_subtotal)}}</view>
								<view class='clb-time'>{{sprintf(__('有效日期至：%s'), item.voucher_end_date)}}</view>
							</view>
							<view class='m-coupon-more m-cell-access'>
								<view style='color:#9B9B9B;font-size:22rpx;flex:1;'><label>{{__('更多详情')}}</label><label style='color:#FFCA81' v-if="item.AllowOfflineWriteOff">{{__('（支持线下使用）')}}</label></view>
								<text class="m-cell-ft"></text>
							</view>
						</navigator>
						<view class='cr'>
							<view class='crt'><label>{{__('￥')}}</label>{{item.voucher_price}}
							</view>
							<view class='crb'>
								<navigator :url='"/activity/coupon/detail?cid=" + item.activity_id + "&couponItemId=" + item.id' v-if="item.AllowOfflineWriteOff" :data-id="item.activity_id">{{__('立即使用')}}
								</navigator>
								<label v-if="(tapindex==0)" @click="useVoucher" :data-item_id="(item.item_id)" :data-store_id="(item.store_id)">{{__('立即使用')}}</label>
							</view>
						</view>
					</view>
				</view>
				<view class="m-loading-box">
					<block v-if="ispage">
						<view class="u-loadmore"><label class="u-loading"></label>
							<text class="u-loadmore-tips">{{__('正在加载')}}</text>
						</view>
					</block>
					<block v-else>
						<view class="u-loadmore u-loadmore-line">
							<text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
						</view>
					</block>
				</view>
			</view>
		</block>
		<view class="m-nullcontent" v-else>
			<view class="m-nullpage-middle"><label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{__('亲~什么都没有')}}</text>
					<text>{{__('赶快去领券中心吧')}}</text>
				</view>
			</view>
		</view>
		<view class="u-top-default" v-if="false">
			<navigator url='/pages/index/index' open-type="switchTab" class="u-back2">
				<image src='https://static.shopsuite.cn/xcxfile/appicon/img/gohome.png'></image>
			</navigator>
		</view>
		<view class='my_coupon'>
			<view class='my_coubut' @tap='listCoupon'>{{__('领取更多优惠券')}}
			</view>
		</view>


		<scroll-view class="m-scrollBox" scroll-y="true" @scrolltolower="scrollbottom" v-if="false">
			<block v-if="(UserCoupon.length>0)">
				<view class="m-coupon-item" v-for="(item, i) in UserCoupon" :key="i">
					<image lazy-load :src="(tapindex==0?'https://static.shopsuite.cn/xcxfile/appicon/images/coupon_red.png':'https://static.shopsuite.cn/xcxfile/appicon/images/coupon_gray.png')"
					 class="item-bg"></image>
					<view class="coupon-item-left">
						<view class="item-left-top">{{__('￥')}}<label>{{item.voucher_price}}</label></view>
						<view class="item-left-bottom">{{sprintf(__('满￥%s可用'), item.voucher_subtotal)}}</view>
					</view>
					<view class="coupon-item-right">
						<view :class="'item-title ' + (tapindex==0?'item-title-black':'')">{{item.Name}}</view>
						<view class="item-middle">
							<label class="item-time">{{sprintf(__('有效日期至：%s'), item.voucher_end_date)}}</label>
							<label class="item-usenow" v-if="(tapindex==0)" @click="useVoucher" :data-item_id="(item.item_id)" :data-store_id="(item.store_id)">{{__('立即使用')}}</label>
						</view>

						<view class="item-desc">{{item.CouponUserDesc}}</view>
					</view>
					<label :class="'iconfont ' + (tapindex==2?'icon-yiguoqi':'icon-yishiyong') " v-if="(tapindex==1 || tapindex==2)"></label>
				</view>
			</block>
			<view class="m-nullcontent" v-else>
				<view class="m-nullpage-middle">
					<label class="iconfont icon-meiyougengduo"></label>
					<view class="m-null-tip">
						<text>{{__('亲~什么都没有')}}</text>
						<text>{{__('赶快去领券中心吧')}}</text>
					</view>
				</view>
			</view>
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
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		name: "asset",
		data: function() {
			return {
				page: 1,
				rows: 10,
				tapindex: 0,
				voucher_state_id: 1501,
				ispage: !0,
				flag: !0,
				UserCoupon: [],
				numNeverUsed: 0,
				numAlreadyused: 0,
				numOutdated: 0
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: this.__('优惠券')
			});

			this.setData({
				UserCoupon: []
			}), this.getCouponlist()
		},
		onReachBottom: function () {
			this.scrollbottom()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			neverused: function() {
				this.setData({
					tapindex: 0,
					voucher_state_id: 1501,
					UserCoupon: [],
					page: 1
				}), this.getCouponlist()
			},
			alreadyused: function() {
				this.setData({
					tapindex: 1,
					voucher_state_id: 1502,
					UserCoupon: [],
					page: 1
				}), this.getCouponlist()
			},
			outdated: function() {
				this.setData({
					tapindex: 2,
					voucher_state_id: 1503,
					UserCoupon: [],
					page: 1
				}), this.getCouponlist()
			},
			useVoucher: function(e) {
				let that = this;
				var t = e.currentTarget.dataset.store_id;
				var item_id = e.currentTarget.dataset.item_id;
				that.$.redirectTo({
					url: "/member/product/coupon?store_id=" + t + "&voucher_item_id=" + item_id
				})
			},
			listCoupon: function(e) {
				let that = this;
				that.$.redirectTo({
					url: "/activity/coupon/list"
				})
			},

			getCouponlist: function() {
				var params = {
						page: this.page,
						rows: this.rows,
						voucher_state_id: this.voucher_state_id
					},
					that = this;
				that.$.request({
					url: this.Config.URL.user.eachVoucherNum,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setData({
								numNeverUsed: data.voucher_unused_num,
								numAlreadyused: data.voucher_used_num,
								numOutdated: data.voucher_timeout_num
							});
						} else {
							that.setData({
								numNeverUsed: -1,
								numAlreadyused: -1,
								numOutdated: -1
							});
						}
					}
				});
				that.$.request({
					url: this.Config.URL.user.voucherList,
					data: params,
					success: function(data, status, msg, code) {
						if (status == 200) {
							if (data.items.length > 0) {
								for (let i = 0; i < data.items.length; i++) {
									data.items[i]['voucher_start_date'] = that.$.dateFormat(data.items[i]['user_voucher_time'], "yyyy-MM-dd");
									data.items[i]['voucher_end_date'] = that.$.dateFormat(data.items[i]['voucher_end_date'], "yyyy-MM-dd");
								}
								if (data.page >= data.total) {
									that.setData({
										UserCoupon: that.UserCoupon.concat(data.items),
										flag: !1,
										ispage: !1
									})
								} else {
									that.setData({
										UserCoupon: that.UserCoupon.concat(data.items),
										flag: !0,
										ispage: !0
									})
								}
							} else {
								that.setData({
									flag: !1,
									ispage: !1
								})
							}
						}
					}
				});
			},
			scrollbottom: function() {
				if (this.flag) {
					var e = this;
					e.setData({
						flag: !1
					}), clearTimeout(t);
					var t = setTimeout(function() {
							e.setData({
								page: parseInt(e.page) + 1
							}), e.getCouponlist()
						},
						500)
				}
			}
		}
	};
</script>


<style lang="scss">
	@import "../../styles/_variables";

	.m-tab {
		position: fixed;
		width: 100%;
		top: var(--window-top);
		z-index: 2;
	}

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
		height: 6upx;
		border-bottom: 6upx solid $default-skin-bg;
		color: #CCCCCC;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 3;
	}


	.m-scrollBox {
		padding: 96rpx 10rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		width: 100%;
		margin-bottom: 58rpx;
	}

	/* .coupon-box{padding:0 10rpx} */
	.coupon-item {
		display: flex;
		background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/use-coupon.png) no-repeat;
		background-size: cover;
		position: relative;
	}

	.cl {
		width: auto;
		flex-grow: 1;
		box-sizing: border-box;
		padding: 10rpx 20rpx 10rpx 30rpx;
	}

	.clt {
		height: 53rpx;
		font-size: 28rpx;
		line-height: 53rpx;
		color: #3a3a3a;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 380rpx;
	}

	.clb {
		align-items: center;
		border-bottom: 1px dashed #d5d5d5;
		flex-wrap: wrap;
		width: 100%
	}

	.clb-where {
		font-size: 24rpx;
		color: #DB384C;
		line-height: 40upx;
	}

	.clb-time {
		font-size: 24rpx;
		color: #999;
		line-height: 48upx
	}

	.cr {
		flex-basis: 50%;
		height: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		padding: 0 0 20rpx 0;
		color: #fff;
		flex-direction: column;
	}

	.crt {
		font-size: 70rpx;
	}

	.crt label {
		font-size: 28rpx;
		display: inline-block;
	}

	.crb {
		border-radius: 8rpx;
		border: 1px solid #edf0f1;
		font-size: 24rpx;
		padding: 0 20rpx;
		line-height: 40rpx;
	}

	.is-user {
		filter: grayscale(100%);
		background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/un-coupon.png) no-repeat;
		background-size: cover;
	}

	.is-user::after {
		content: "";
		position: absolute;
		width: 178rpx;
		height: 142rpx;
		right: 200rpx;
		top: 50%;
		margin-top: -71rpx;
		background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/already.png) no-repeat;
		background-size: cover;
	}

	.is-overdue {
		filter: grayscale(100%);
		background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/un-coupon.png) no-repeat;
		background-size: cover;
	}

	.is-overdue::after {
		content: "";
		position: absolute;
		width: 178rpx;
		height: 142rpx;
		right: 200rpx;
		top: 50%;
		margin-top: -71rpx;
		background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/overdue.png) no-repeat;
		background-size: cover;
	}

	.u-back2 image {
		border-radius: 100%;
		width: 77rpx;
		height: 77rpx;
		border: 1px solid #eee;
		font-size: 20rpx;
		text-align: center;
		background-color: #fff;
		box-shadow: 0px 4rpx 8rpx rgba(0, 0, 0, 0.35);
		z-index: 999;
		opacity: 0.8;
		line-height: 77rpx;
		margin-bottom: 20rpx;
	}

	.m-coupon-more {
		width: 411rpx;
		line-height: 55rpx;
		display: flex;
	}

	.my_coupon {
		width: 100%;
		height: 108rpx;
		background: #fff;
		position: fixed;
		bottom: 0
	}

	.my_coubut {
		width: 93%;
		margin: 16rpx auto;
		height: 79rpx;
		background: #DB384C;
		border-radius: 10px;
		font-size: 28rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 79rpx
	}
</style>

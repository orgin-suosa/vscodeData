<template>
	<view class="page">
		
		<!-- <view class="m-tab">
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
		</view> -->
        
		<view class="" style="width: 100%;z-index: 2;position: fixed;background-color: #FCFCFC;top: var(--window-top);">
			<view class="m-tabview" >
					<view  class="nav-item"
				   :class="[tapindex== 0 ?'nav-item-on':'']" @click="neverused()">
					    <text class="m-fans-Text"> {{__('未使用')}}</text>
				   </view>
				   <view class="line-view" v-if="tapindex ==2 "></view>
				   <view  class="nav-item"
				   :class="[tapindex== 1 ?'nav-item-on':'']" @click="alreadyused()">
					   <text class="m-fans-Text"> {{__('已使用')}}</text>
				   </view>
				   <view class="line-view" v-if="tapindex ==0 "></view>
				   <view  class="nav-item"
				   :class="[tapindex== 2 ?'nav-item-on':'']" @click="outdated()">
					   <text class="m-fans-Text"> {{__('已过期')}}</text>
				   </view>
			  
			</view>
			
		</view>
		
		 
		<block v-if="UserCoupon.length>0">
			<view class="m-scrollBox" scroll-y="true" @scrolltolower="scrollbottom">
				<view class='coupon-box' style="margin-bottom: 108rpx;" v-if="UserCoupon.length>0">
					<view v-for="(item, i) in UserCoupon" :key="i"
						:class='["coupon-item",  tapindex==2?"is-overdue":""]'>
						<view class="coupon_bg">
							<view class="left_bg">
								<image class="left_img" src="https://qnsp.zcskjy.com/zc_images/mine/zc_coupon_bg.png"></image>
								<view class='price'><label>{{__('￥')}}</label>{{item.voucher_price}}</view>
								<view class='price_access'>{{sprintf(__('满￥%s可用'), item.voucher_subtotal)}}</view>
							</view>
							<view class="right_part">
								<text class="right_te1">{{item.activity_name}}</text>
								<text class="right_te2" >{{sprintf(__('有效日期至：%s'), item.voucher_end_date)}}</text>
								<!-- <view class="right_b" >
									<navigator 
										:url='"/activity/coupon/detail?cid=" + item.activity_id + "&couponItemId=" + item.id'
										:data-id="item.activity_id">
										<view style="display: flex;align-items: center;">
											<text class="tip">使用说明</text>
											<image style="width:24rpx ;height: 24rpx;margin-left: 10rpx;"
												src="https://qnsp.zcskjy.com/zc_images/mine/zc_coupon_more.png"></image>
										</view>
									</navigator>
									<text class="use" v-if="(tapindex==0)" @click="useVoucher">立即使用</text>
									<text class="use_2" v-if="(tapindex==1)">生效中</text>
									<text class="use_2" v-if="(tapindex==2)">已过期</text>
								</view> -->
								
								<view class="right_b" >
									<view style="display: flex;align-items: center;" @click="showExplain(i)">
										<text class="tip">使用说明</text>
										<image style="width:24rpx ;height: 24rpx;margin-left: 10rpx;"
											:src="showExpalain == i ? 'https://qnsp.zcskjy.com/zc_images/mine/zc_coupon_less.png':'https://qnsp.zcskjy.com/zc_images/mine/zc_coupon_more.png'"></image>
									</view>
									<text class="use" v-if="(tapindex==0)" @click="useVoucher(i)">立即使用</text>
									<text class="use_2" v-if="(tapindex==1)">生效中</text>
									<text class="use_2" v-if="(tapindex==2)">已过期</text>
								</view>
							</view>
						</view>
						<view class="coupon_explain" style="" 
						v-if="showExpalain == i">
						    <view class='explain-text'>{{'使用条件:'}}</view>
							<view class='explain-text'><label>{{'1、仅限于课程类商品使用；'}}</label></view>
							<view class='explain-text'>{{sprintf(__('2、满￥%s可用；'), item.voucher_subtotal)}}</view>
							<view class='explain-text'>{{'3、最终解释权归长乘学院所有。'}}</view>
						</view>
					</view>
				</view>
				<view class="m-loading-box" style="">
					<block v-if="ispage">
						<view class="u-loadmore"><label class="u-loading"></label>
							<text class="u-loadmore-tips">{{__('正在加载')}}</text>
						</view>
					</block>
					<!-- <block v-else>
						<view class="u-loadmore u-loadmore-line">
							<text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
						</view>
					</block> -->
				</view>
			</view>
		</block>
		
		<view class="m-nullcontent" v-else>
			<!-- <view class="m-nullpage-middle"><label class="iconfont icon-meiyougengduo"></label>
				<view class="m-null-tip">
					<text>{{__('亲~什么都没有')}}</text>
					<text>{{__('赶快去领券中心吧')}}</text>
				</view>
			</view> -->
			<view class="" style="height:100%;display: flex;flex-direction: column;
			align-items: center;justify-content: center;">
			   <!-- <aempty-view ></aempty-view> -->
				   <view class="empty-view" >
						<image class="m-image-img" mode="aspectFill" src="https://qnsp.zcskjy.com/zc_images/images/my/empty_coupon.png" />
						<view class="m-title" style="">暂无优惠券</view>
				   </view>
			</view>
			
		</view>
		
		<view class='my_coupon'>
			<view class='u-btn-hlight' @tap='listCoupon'>{{__('领取更多优惠券')}}
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
				numOutdated: 0,
				showExpalain:-1,
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: this.__('我的优惠券')
			});

			this.setData({
				UserCoupon: []
			}), this.getCouponlist()
		},
		onReachBottom: function() {
			this.scrollbottom()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
            
			//解释说明
			showExplain(index){
				
				if(this.showExpalain == index){
					index = -1;
				}
				this.setData({
					showExpalain: index,
				}),
				console.log('--showExplain-index--',this.showExpalain);
			},
			
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
			useVoucher: function(index) {
				
				let that = this;
				let model = that.UserCoupon[index];
				console.log('--t---item_id---',model);
				that.$.redirectTo({
					url: "/member/product/coupon?store_id=" + model.store_id + "&voucher_item_id=" + model.item_id
				})
			},
			listCoupon: function(e) {
				let that = this;
				that.$.redirectTo({
					url: "zc-coupon-more"
				})
			},

			getCouponlist: function() {
				
				//请求数据之后 清除之前的选中状态
				this.setData({
					showExpalain: -1,
				});
				
				var params = {
						page: this.page,
						rows: this.rows,
						voucher_state_id: this.voucher_state_id
					},
					that = this;
					
				that.$.request({
					url: this.Config.URL.user.eachVoucherNum,
					data: params,
					loading:false,
					success: function(data, status, msg, code) {
						if (status == 200) {
							console.log('---datta111---',data);
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
					loading:false,
					success: function(data, status, msg, code) {
						
						console.log('-data-优惠券----',that.Config.URL.user.voucherList,data);
						// console.log('-params-----',params);
						for (let i = 0; i < data.items.length; i++) {
							let model = data.items[i];
						}
						
						if (status == 200) {
							if (data.items.length > 0) {
								for (let i = 0; i < data.items.length; i++) {
									data.items[i]['voucher_start_date'] = that.$.dateFormat(data.items[i][
										'user_voucher_time'
									], "yyyy-MM-dd");
									data.items[i]['voucher_end_date'] = that.$.dateFormat(data.items[i][
										'voucher_end_date'
									], "yyyy-MM-dd");
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
	
	// @import "../../styles/_variables";
    
	.page{
		background-color: #FCFCFC;
		width: 100%;
		// height: 100%;
		display: flex;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
	}
	
	.m-tabview{
		
		height: 70rpx;
		width: 690rpx;
		margin: 30rpx 30rpx 25rpx;
		padding: 5rpx;
		border-radius: 6rpx;
		display: flex;
	    flex-direction: row;		
		align-items: center;
		justify-content: space-around;
		background-color: #F7F8FB;
		
		.line-view{
			background-color: #CCCCCC;
			width: 2rpx;
			height: 40rpx;
		}
		
		.nav-item{
			border-radius: 6rpx;
			width: 223rpx;
			height: 70rpx;
			text-align: center;
			color: #666666;
			font-family: PingFangSC-Regular, PingFang SC;
		}
		.nav-item-on{
			border-radius: 6rpx;
			width: 223rpx;
			height: 70rpx;
			background-color: #FFFFFF;
			text-align: center;
			color: #333333;
			font-family: PingFangSC-Medium, PingFang SC;
		}
		.m-fans-Text{
			height: 70rpx;
			line-height: 70rpx;
			font-size: 28rpx;
			font-weight: 400;
			// font-family: PingFangSC-Medium, PingFang SC;
		}
	}
	
	 
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
		// color: $default-skin-bg;
		color:#ff6161;
	}

	.m-navbar-item.m-navbar-item-on::before {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 6upx;
		// border-bottom: 6upx solid $default-skin-bg;
		border-bottom: 6upx solid #ff6161;
		color: #CCCCCC;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 3;
	}

	.m-scrollBox {
		padding: 116rpx 10rpx 0rpx;
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		width: 100%;
		margin-bottom: 128rpx;
	}

	/* .coupon-box{padding:0 10rpx} */
	.coupon-item {
		display: flex;
		// background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/use-coupon.png) no-repeat;
		background-size: cover;
		position: relative;
		flex-direction: column;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	
	.is-user {
		filter: grayscale(100%);
		// background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/un-coupon.png) no-repeat;
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
		// background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/already.png) no-repeat;
		background-size: cover;
	}

	.is-overdue {
		// filter: grayscale(100%);
		 opacity: 0.5;
		// background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/un-coupon.png) no-repeat;
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
		// background: url(https://static.shopsuite.cn/xcxfile/appicon/coupon/overdue.png) no-repeat;
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
		height: 128rpx;
		background: #fff;
		position: fixed;
		bottom: 0
	}

	.my_coubut {
		width: 93%;
		margin: 16rpx auto;
		height: 79rpx;
			background: -webkit-linear-gradient(left, #ff6161, #ff9561);
		border-radius: 10px;
		font-size: 28rpx;
		color: #FFFFFF;
		text-align: center;
		line-height: 79rpx
	}

	.coupon_bg {
		display: flex;
		width: 92%;
		height: 220rpx;
		margin-left: 4%;
		// margin-top: 10rpx;
		// margin-bottom: 10rpx;
		overflow: hidden;
		border-radius: 15rpx;
		position: relative;
	}
    
	.coupon_explain {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		width: 92%;
		height: 160rpx;
		margin-left: 4%;
		overflow: hidden;
		border-radius:0rpx 0rpx 15rpx 15rpx;
		position: relative;
		padding-top: 20rpx;
		background-color: #FFFFFF;
		box-shadow: 0px 4rpx 4rpx rgba(0, 0, 0, 0.3);
		.explain-text{
			color: #999999;
			line-height: 30rpx;
			font-size: 22rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, PingFang SC;
			margin-bottom: 10rpx;
			padding-left: 25rpx;
		}
	} 
	 
	
	.empty-view {	
	  display: flex;
	  flex-direction: column;
	  justify-content: flex-start;
	  align-items: center;
	  height: 400rpx;
	  padding: 30rpx;
		.m-image-img{
			height: 240rpx;
			width: 320rpx;
		}
		.m-title{
			height:40rpx;
			line-height:40rpx;
			margin-top: 50rpx;
			color:#999999;
			text-align:center;
			font-size: 26rpx;
			font-weight:Medium;
			font-family: PingFangSC-Medium, PingFang SC;
		} 
	  
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
		font-size: 28rpx;
		line-height: 28rpx;
		width: 247rpx;
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
		margin-bottom: 5rpx;
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

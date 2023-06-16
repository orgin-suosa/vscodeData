<template name="merchant-backstage" >
	<view class="page">
		<view class="m-banner-img">
			<view class="member-top">
				<view class="m-user-info">
					<image lazy-load :src="(store_info.store_logo)" mode="scaleToFill" />
					<view class="m-name">
						<label>{{store_info.store_name}}</label>
						<label style="position: relative;" v-if="hasLogin"><label class="sup">{{store_info.store_grade_name}}</label></label>
					</view>
				</view>
				<view class="g-flex member-order-tab">
					<view hover-class="none"  class="g-flex-items">
						<view>{{orders.yestoday_num}}</view>
						{{__('昨日订单数')}}
					</view>
					<view hover-class="none"  class="g-flex-items">
						<view>{{orders.month_num}}</view>
						{{__('当月订单数')}}
					</view>
					<view class="g-flex-item hide"></view>
					<view hover-class="none"  class="g-flex-items">
						<view>{{orders.pay_amount}}</view>
						{{__('成交总金额')}}
					</view>
				</view>
			</view>
		</view>

		<view class="m-ber">

				<view class="m-cell m-cell-access m-info-sp">
					<view class="m-cell-bd">
						<navigator url="/seller/order/lists" class="m-order-title" hover-class="none">
							<view class="m-ber-image" style="color:#009688;opacity: 0.6;">
								<view class="iconfont zc zc-wodedingdan i-type"></view>
							</view>
							<label class="m-ber-n">{{__('订单管理')}}</label>
							<label>
								<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
								<label class="m-ber-n" style="float:right;margin-right:20upx;color:#999">{{__('查看全部订单')}}</label>
							</label>
						</navigator>
					</view>
				</view>

			<view class="m-ber-quan">
				<view class="g-flex m-ber-l">
					<navigator url="/seller/order/lists?order_state_id=2010&sl=1" class="g-flex-item" hover-class="none">
						<uni-badge v-if="(orders.wait_pay_num >0)" :text="orders.wait_pay_num" type="purple"></uni-badge>
						<view class="iconfont zc zc-daifukuan i-type"></view>
						{{__('待付款')}}
					</navigator>
					<navigator url="/seller/order/lists?order_state_id=2020,2030&sl=3" class="g-flex-item" hover-class="none">
						<uni-badge v-if="(orders.wait_shipping_num >0)" :text="orders.wait_shipping_num" type="purple"></uni-badge>
						<view class="iconfont zc zc-daishouhuo i-type"></view>
						{{__('待发货')}}
					</navigator>

					<navigator url="/seller/order/lists?order_state_id=2040&sl=4" class="g-flex-item">
						<uni-badge v-if="(orders.ship_num >0)" :text="orders.ship_num" type="purple"></uni-badge>
						<view class="iconfont zc zc-yifahuo i-type"></view>
						{{__('已发货')}}
					</navigator>

					<navigator url="/seller/order/lists?order_state_id=2060&sl=5" class="g-flex-item" hover-class="none">
						<uni-badge v-if="(orders.fin_num >0)" :text="orders.fin_num" type="purple"></uni-badge>
						<view class="iconfont zc zc-dingdanwancheng i-type"></view>
						{{__('已完成')}}
					</navigator>
					<navigator v-if="false" url="/seller/order/lists?order_state_id=2070&sl=6" class="g-flex-item" hover-class="none">
						<!-- <uni-badge v-if="(orders.ship_num >0)" :text="orders.ship_num" type="purple"></uni-badge> -->
						<view class="iconfont zc zc-yifahuo i-type"></view>
						{{__('已取消')}}
					</navigator>
				</view>
			</view>
		</view>

		<view class="m-ber">
			<view class="m-cell m-cell-access m-info-sp">
				<view class="m-cell-bd">
					<navigator url="/seller/product/sale" class="m-order-title" hover-class="none">
						<view class="m-ber-image" style="color: #009688;opacity: 0.6;">
							<view class="iconfont zc zc-tihuohexiao i-type"></view>
						</view>
						<label class="m-ber-n">{{__('销售开单')}}</label>
						<label>
							<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
						</label>
					</navigator>
				</view>
			</view>

			<view class="m-ber-quan">
				<view class="g-flex m-ber-l">
					<navigator url="/seller/product/lists?type=1001&sl=1" class="g-flex-item" hover-class="none">
						<uni-badge v-if="(commodity.normal_num >0)" :text="commodity.normal_num" type="warning"></uni-badge>
						<view class="iconfont zc zc-chushou i-type"></view>
						{{__('出售中')}}
					</navigator>
					<navigator url="/seller/product/lists?type=1002&sl=2" class="g-flex-item" hover-class="none">
						<uni-badge v-if="(commodity.off_num >0)" :text="commodity.off_num" type="warning"></uni-badge>
						<view class="iconfont zc zc-cangkuzhong i-type"></view>
						{{__('仓库中')}}
					</navigator>

					<navigator url="/seller/product/lists?type=1000&sl=3" class="g-flex-item" hover-class="none">
						<uni-badge v-if="(commodity.illegal_num >0)" :text="commodity.illegal_num " type="warning"></uni-badge>
						<view class="iconfont zc zc-weiguishangpin i-type"></view>
						{{__('违规商品')}}
					</navigator>
					<navigator url="/seller/product/add" class="g-flex-item">
						<view class="iconfont zc zc-shangpinfabu i-type"></view>
						{{__('发布商品')}}
					</navigator>
				</view>
			</view>
		</view>

		<view class="m-cells" style="margin-top:20upx;">
		<!-- 	<view class="m-cell m-cell-access m-info-sp">
				<view class="m-cell-bd">
					<navigator url="/seller/product/sale" class="m-order-title" hover-class="none">
						<view class="m-ber-image" style="color: #009688;opacity: 0.6;">
							<view class="iconfont zc zc-tihuohexiao i-type"></view>
						</view>
						<label class="m-ber-n">销售开单</label>
						<label>
							<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
						</label>
					</navigator>
				</view>
			</view> -->
			<view class="m-cell m-cell-access m-info-sp">
				<view class="m-cell-bd">
					<navigator url="/seller/order/write" class="m-order-title" hover-class="none">
						<view class="m-ber-image" style="color: #009688;opacity: 0.6;">
							<view class="iconfont zc zc-tihuohexiao i-type"></view>
						</view>
						<label class="m-ber-n">{{__('扫码核销')}}</label>
						<label>
							<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
						</label>
					</navigator>
				</view>
			</view>
			<view class="m-cell m-cell-access m-info-sp">
				<view class="m-cell-bd">
					<navigator url="/seller/store/account" class="m-order-title" hover-class="none">
						<view class="m-ber-image" style="color: #e50dbb;opacity: 0.6;">
							<view class="iconfont zc zc-yonghushezhi1 i-type"></view>
						</view>
						<label class="m-ber-n">{{__('店铺信息设置')}}</label>
						<label>
							<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
						</label>
					</navigator>
				</view>
			</view>
			<view class="m-cell m-cell-access m-info-sp">
				<view class="m-cell-bd">
					<navigator url="/seller/store/express" class="m-order-title" hover-class="none">
						<view class="m-ber-image" style="color: #03A9F4;opacity: 0.6;">
							<view class="iconfont zc zc-wuliukuaidi i-type"></view>
						</view>
						<label class="m-ber-n">{{__('物流公司管理')}}</label>
						<label>
							<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
						</label>
					</navigator>
				</view>
			</view>
		</view>



		<view class="m-cells" style="margin-top:20upx;">
			<view class="m-cell m-cell-access m-info-sp">
				<view class="m-cell-bd">
					<navigator :url="'/pagesub/index/store?store_id='+store_info.store_id" class="m-order-title" hover-class="none">
						<view class="m-ber-image" style="color: #009688;opacity: 0.6;">
							<view class="iconfont zc zc-dianpu i-type"></view>
						</view>
						<label class="m-ber-n">{{__('店铺首页')}}</label>
						<label>
							<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
						</label>
					</navigator>
				</view>
			</view>

			<view class="m-cell m-cell-access m-info-sp">
				<view class="m-cell-bd">
					<navigator url="/seller/product/pool" class="m-order-title" hover-class="none">
						<view class="m-ber-image" style="color: #009688;opacity: 0.6;">
							<view class="iconfont zc zc-daishouhuo i-type"></view>
						</view>
						<label class="m-ber-n">{{__('产品池')}}</label>
						<label>
							<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
						</label>
					</navigator>
				</view>
			</view>
			<!--
			<view class="m-cell m-cell-access m-info-sp">
				<view class="m-cell-bd">
					<navigator url="/seller/user/add" class="m-order-title" hover-class="none">
						<view class="m-ber-image" style="color: #ff6700;opacity: 0.6;">
							<view class="iconfont zc zc-member i-type"></view>
						</view>
						<label class="m-ber-n">新增会员</label>
						<label>
							<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
						</label>
					</navigator>
				</view>
			</view> -->
		</view>

		<view class="m-cells" style="margin-top:20upx;">
			<view class="m-cell m-cell-access m-info-sp">
				<view class="m-cell-bd">
					<navigator url="/seller/store/address" class="m-order-title" hover-class="none">
						<view class="m-ber-image" style="color: #962d77;opacity: 0.6;">
							<view class="iconfont zc zc-shouhuodizhi1 i-type"></view>
						</view>
						<label class="m-ber-n">{{__('发货地址管理')}}</label>
						<label>
							<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
						</label>
					</navigator>
				</view>
			</view>
			<view class="m-cell m-cell-access m-info-sp">
				<view class="m-cell-bd">
					<view  class="m-order-title" @click="cleanCache">
						<view class="m-ber-image" style="color: #48e5ad;opacity: 0.6;">
							<view class="iconfont zc zc-qingchuhuancun i-type" style=""></view>
						</view>
						<label class="m-ber-n">{{__('清除缓存')}}</label>
						<label>
							<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
						</label>
					</view>
				</view>
			</view>
		</view>

		<view class="m-tips" style="margin:30upx 0" v-if="(!IsChannel)">
			<view class="m-tips-logo">
				<image lazy-load mode="aspectFit" src="/static/images/logo_tech.png"></image>
			</view>
			<view class="m-tips-str">{{__('商城套件系统提供技术支持')}} {{versionNumber}}</view>
		</view>
		<view class="m-tips" style="margin:30upx 0" v-else>
			<view class="m-tips-str">{{versionName}}{{versionNumber}}</view>
		</view>
		<view class='msk' v-if='(isGetnum&&isStorage&&isFlagPhoto&&isWexinMobile)'>
			<view class='model'>
				<view class='hint'>
					<view class='title'>{{__('绑定手机号')}}</view>
					<view class='content'>{{__('您当前尚未绑定手机号，建议您绑定以获得更多优惠资讯')}}</view>
				</view>
				<view class='operation'>
					<view class='cancel' @click='cancel'>{{__('取消')}}</view>
					<button class='success' bindgetphonenumber='getPhoneNumber' open-type='getPhoneNumber'>{{__('确定')}}</button>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
import guessYouLike from '@/components/guess-you-like.vue'
import uniBadge from '@/components/uni-badge.vue';
import { mapState, mapMutations } from 'vuex';

export default {
    data() {
        return {
            Info: '',
            UserInfo: {
                user_nickname: '新用户1',
                user_avatar: 'https://static.shopsuite.cn/demodata/assets/data/avatar.png'
            },
            resource: {
                user_points: 100
            },
            versionNumber: '',
            versionName: '',
            IsChannel: !0,
            PersonalCenterList: {},
            isMembership: !0,
            isCoupon: !0,
            isCutPrice: !0,
            isECashCard: !0,
            isMemDist: !0,
            isFightGrp: !0,
            isAbtVendor: !0,
            currentSize: 0,
            limitSize: 0,

			store_info:{},
			orders:{},
			commodity:{},

            isStorage: false,
            isGetnum: false
        };
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
		guessYouLike,
		uniBadge

	},
   onLoad: function(opt) {
		uni.setNavigationBarTitle({
			title:this.__('商家中心')
		});

		var that = this;
		//console.log(this.isshow)
        this.forceUserInfo(function(user) {});

        that.load();
    },


	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		// this.$refs.guessYouLike.scrollbottom();
	},
    methods: {
        ...mapMutations([
            'login',
            'logout',
            'getPlantformInfo',
            'forceUserInfo',
            'getUserInfo',
            'showCartNum'
        ]),
        load: function() {
            var that = this;
			var params = {}
            that.$.request({
                url: this.Config.URL.seller.dashboard,
                data: params,
                success: function(data, status, msg, code) {
                  if(status == 200){
					  that.setData({
						  store_info:data.store_info,
						  orders:data.order,
						  commodity:data.product,
					  })
				  }
                }
            });

        },

        cancel: function() {
			let that = this;
            this.setData({
                isGetnum: !1
            }),
                that.$.setStorage({
                    key: 'cancel',
                    data: 'yes'
                });
        },

        getPhoneNumber: function(e) {
            var that = this;
            that.$.login({
                success: function(n) {
                    var r = {
                        //vendorId: that.cf.storeId,
                        userId: that.userInfo.Id,
                        encryptData: e.detail.encryptedData,
                        encryptDataIV: e.detail.iv,
                        code: n.code
                    };
                    //console.log(r);

                        /*that.$.xsr(that.$.makeUrl(user.UpdateUserWexinMobile, r), function(e) {
                            e.Code == 0 &&
                                ((that.userInfo.Phone = e.Info),
                                that.setData({
                                    isGetnum: !1
                                }));
                        });*/
                }
            });
        },

        selectAddress: function(e) {
            var that = this;
            that.$.gopage('/member/address/list');
            /*that.$.chooseAddress({
						success: function (that)
						{
								that.$.navigateTo("/member/address/list");
						}, fail: function (that)
						{
								that.$.navigateTo("/member/address/list");
						}
				})*/
        },

        goTabBar: function(e) {
            var that = this;
            that.$.goToTabBar(that, e.currentTarget.dataset.url);
        },

        cleanCache: function(e) {
            var that = this;
            const index = e.currentTarget.dataset.index;
            const path = e.currentTarget.dataset.path;

            that.$.confirm(
			that.__('确定要清除缓存吗？'),
                function(data) {
                    if (data.confirm) {
                        //退出登录
                        that.logout(true);

                        // #ifdef MP-WEIXIN
                        var info = that.$.storage.info();

                        that.setData({
                            currentSize: Math.round(info.currentSize * 100) / 100,
                            limitSize: Math.round((info.limitSize / 1024) * 100) / 100
                        });
                        // #endif
                    }
                },
                true
            );
        },
        distributionWeStore: function(e) {
            var that = this;
            that.$.gopage('/pagesub/westore/index');

            //let url = that.$.sprintf('%s/tmpl/member/plantform_invite.html?u_id=%d&opener=uni&sss=ssss', that.Config.WapSiteUrl, that.userInfo.user_id);
            //that.$.gopage("/pagesub/webpage/webpage?u=" + encodeURIComponent(url) + "&tn=" + '推广中心' + "&tc=" + '#ff6700' + "&tb=" + 'white')
        }
    }
};
</script>



<style lang="scss">
@import "../../styles/_variables";

.page{
	margin-bottom:var(--window-bottom)
}

.member-top {
    -webkit-animation: changeBg 20s infinite;
    animation: changeBg 20s infinite;
    background-color: #ff6700;
    background-image: url('data:image/png;base64,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');
    background-size: cover;
    text-align: center;
    width: 100%;
    /*height: 11rem;*/

    overflow: hidden;
    height: 480upx; /* 320 */

    color: #fff;
    position: relative;
    z-index: 1;
}

@-webkit-keyframes changeBg {
    0% {
        background-color: #ff6700;
    }

    90% {
        background-color: #ff6700;
    }

    10% {
        background-color: #fb6e52;
    }

    20% {
        background-color: #ffce55;
    }

    30% {
        background-color: #a0d468;
    }

    40% {
        background-color: #48cfae;
    }

    50% {
        background-color: #4fc0e8;
    }

    60% {
        background-color: #5d9cec;
    }

    70% {
        background-color: #ac92ed;
    }

    80% {
        background-color: #ec87bf;
    }
}

@keyframes changeBg {
    0% {
        background-color: #ff6700;
    }

    90% {
        background-color: #ff6700;
    }

    10% {
        background-color: #fb6e52;
    }

    20% {
        background-color: #ffce55;
    }

    30% {
        background-color: #a0d468;
    }

    40% {
        background-color: #48cfae;
    }

    50% {
        background-color: #4fc0e8;
    }

    60% {
        background-color: #5d9cec;
    }

    70% {
        background-color: #ac92ed;
    }

    80% {
        background-color: #ec87bf;
    }
}

.m-banner-img {
    width: 100%;
    /*height: 200upx;*/
    vertical-align: top;
    position: relative;
}

	.m-user-info {
		text-align: center;
		/*
		position: absolute;
		top: 115upx;
		width: 140upx;
		height: 140upx;
		left: 50%;
		margin-left: -70upx;
		*/
		z-index: 3;
		color: #666;
		margin-top:100upx;
	}

	.m-user-info image {
		width: 140upx;
		height: 140upx;
		border-radius: 120upx;
		border: 1px solid #fff;
		vertical-align: middle;
		box-shadow: 0px 2upx 15upx rgba(0, 0, 0, 0.35);

		position: absolute;
		left:305upx;
	}

	.m-user-info .m-name {
		position: absolute;
		top:260upx;
		text-align: center;
		width: 750upx;
	}

	.m-user-info text, .m-user-info label {
		line-height: 70upx;

		font-size: 28upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color: #fff;
		font-weight: bold;

		.sup {
		    font-size: .45rem;
		    line-height: .6rem;
		    background-color: #ff6700;
		    height: .6rem;
		    padding: 0 .1rem;
		    margin-left: .2rem;
		    border-radius: .1rem;
		    box-shadow: 1px 1px 1px rgba(0,0,0,.15)
		}
	}
.m-user-info .Phone {
    width: 140upx;
    height: 140upx;
    border-radius: 120upx;
    border: 1px solid #fff;
    vertical-align: middle;
    box-shadow: 0px 2upx 15upx rgba(0, 0, 0, 0.35);
    overflow: hidden;
}

.m-user-info .NickName {
    line-height: 70upx;
    display: block;
    font-size: 28upx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.member-order-tab {
    font-size: 12px;
    text-align: center;
    background: rgba(0, 0, 0, 0.1);
    line-height: 20px;


    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}

.i-type {
    font-size: 40upx;
}

.m-cell-hd {
    text-align: center;
    line-height: 56upx;
}

.member-order-tab .g-flex-item {
    padding: 28upx 0 20upx 0;
}

.member-order-tab .g-flex-item:active {
    background-color: #ececec;
}

.my_od {
    border-left: 1px solid #dfdfdf;
}

.all_order {
    position: relative;
    display: block;
}

.m-panel-bd {
    margin-top: 20upx;
}

.m-panel-bd label {
    vertical-align: middle;
    font-size: 50upx;
    margin: 0upx 10upx;
}

.m-cell-primary {
    font-size: 24upx;
    margin-top: 10upx;

    label {
        font-size: 24upx;
    }
}

.m-animate-img {
    width: 100%;
    height: 250upx;
    overflow: hidden;
    -webkit-animation: imageAnimation 15s linear infinite alternate;
    animation: imageAnimation 15s linear infinite alternate;
    webkit-backface-visibility: hidden;
    -webkit-filter: blur(5px);
    filter: blur(5px);
    margin-top: -20px;
}

.m-animate-warp {
    overflow: hidden;
    height: 200upx;
    -webkit-animation: imageAnimation 15s linear infinite alternate;
    animation: imageAnimation 15s linear infinite alternate;
}

@-webkit-keyframes imageAnimation {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 0 100%;
    }
}

@keyframes imageAnimation {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 0 100%;
    }
}

.iconBoxLattice .m-cell {
    display: inline-block;
    width: 25%;
    box-sizing: border-box;
    text-align: center;
    border-right: 1upx solid #f8f8f8;
    border-bottom: 1upx solid #f8f8f8;
}

.iconBoxLattice .m-cell .iconfont {
    font-size: 60upx;
}

.iconBoxLattice .m-cell::before {
    border: none;
}

.iconBoxLattice .m-cell p {
    font-size: 24upx;
}

.iconBoxLattice .m-cell label {
    font-size: 24upx;
}

.iconBoxLattice .m-cell label.iconfont {
    font-size: 60upx;
}

.iconBoxLattice .m-cell label.zc {
	font-size: 48upx;
}

.iconBoxLattice .m-cell image {
    display: inline-block !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 60upx !important;
    height: 60upx !important;
}

.iconBoxLattice .m-cell-ft {
    display: none;
}

.msk {
    position: fixed;
    top: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
}

.model {
    width: 80%;
    height: 290upx;
    background: #fff;
    border-radius: 6upx;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.hint {
    height: 200upx;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    position: relative;
}

.hint::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 200%;
    height: 200%;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: left top;
    transform-origin: left top;
}

.hint .title {
    font-size: 36upx;
}

.hint .content {
    width: 80%;
    color: #999999;
    font-size: 30upx;
    margin-top: 20upx;
}

.operation {
    height: 90upx;
    display: flex;
    align-items: center;
}

.cancel,
.success {
    flex: 1;
    background: #fff;
    height: 90upx;
    font-size: 36upx;
}

button::after {
    line-height: none;
}

.cancel {
    position: relative;
    text-align: center;
    line-height: 90upx;
}

.success {
    color: #3cc51f;
    padding: 0;
}

.cancel::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    border-right: 2px solid #e5e5e5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 200%;
    height: 200%;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: left top;
    transform-origin: left top;
}

.m-cell-bd label {
    margin: 0upx 5upx;
}

	.m-ber {
		/* padding:20upx; */
		margin-top:20upx;
		background:rgba(255,255,255,1);

		.m-cell {
			&::after{

				content: " ";
				position: absolute;
				left: 0;
				bottom: 0;
				right: 0;
				height: 1px;
				border-bottom: 1px solid #ebebe7;
				color: #ebebe7;
				-webkit-transform-origin: 0 0;
				transform-origin: 0 0;
				-webkit-transform: scaleY(0.5);
				transform: scaleY(0.5);
				left: 30upx;
			}
			&::before{
				border: none;
			}
		}
	}

	.m-ber-image {
		width:46upx;
		height:46upx;
		float:left;
		margin-top:-2upx;
		margin-right:10upx;

	}

	.m-ber-image img {
		width:100%;
		height:100%;
	}

	.m-ber-n {
		// padding-left:30upx;

	}

	.nav-image {
		width:12upx;
		height:24upx;
		float:right;
		padding-top:12upx;
	}

	.m-ber-quan {
		width:100%;
		background:rgba(255,255,255,1);
		padding-top:40upx;
		padding-bottom: 20upx;
	}

	.m-ber-l {
		font-size: 12px;
		text-align: center;
		background:rgba(255,255,255,1);
		line-height: 20px;
		position: relative;
		color:#999;
	}

	.m-cell{
		/* padding:24upx 20upx; */
	}

	.g-flex-items {
		padding: 15px 0 11px 0;
		-webkit-box-flex: 1;
		flex: 1;
		line-height: 1;
	}
</style>

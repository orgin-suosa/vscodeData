<template>
    <view>
        <scroll-view @scrolltolower="scrollbottom" class="test" scroll-y="true">
            <view class="m-search-box">
                <view class="u-input-search">
                    <label class="iconfont icon-sousuo-sousuo"></label>
                    <input @confirm="SelectProductList"
                                                                                                       @input="startinput"
                                                                                                       focus="true"
                                                                                                       :placeholder="__('请输入搜索关键字')"
                                                                                                       type="text"
                                                                                                       v-model="value"/>
                    <view @tap="SelectProductList" class="u-btn">{{__('搜索')}}</view>
                </view>
                <view class="person_box"></view>
            </view>
            <block>
                <view class="m-product-all" v-if="cartlist.length>0">
                    <view class="m-product-list">
                        <block v-for="(item, index) in cartlist" :key="index">
                            <view
                                  class="m-product-item" :data-id="item.item_id">
                                <view :class="['m-item-c', (item.item_id==selItemId)?'del':'']">
                                    <view @click.stop="quanbu" class="m-cart-ck" :data-id="item.item_id"
                                          :data-isck="item.checked" :data-sid="item.item_id">
                                        <uni-icons :color="item.checked?'#DB384C':'#d5d5d5'"
                                              :type="item.checked?'circle-filled':'circle' "/>
                                    </view>
                                    <navigator class="m-product-img"
                                               :url="'../productdetail/productdetail?pid=' + item.item_id">
                                        <image :src="item.product_image"/>
                                    </navigator>
                                    <view class="m-product-info">
                                        <navigator :url="'../productdetail/productdetail?pid=' + item.item_id">
                                            <view class="m-product-name"><label
                                                    style="padding-top:15rpx;">{{item.product_name}}</label><label
                                                    class="m-min-name"
                                                    style="overflow:hiddentext-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">{{item.speStr==null?"":item.speStr}}</label>
                                            </view>
											<view class="product_tips">{{item.product_tips}}</view>
											<view class="playback-area-describe-list">
											  <view class="describe-list-child" v-for="(key, i) in item.product_tag_names" :key="i"
											    ><text class="describe-list-child-text">{{ key }}</text>
											  </view>
											</view>
                                            <view class="m-product-price"><label>{{__('￥')}}</label>{{item.product_unit_price}}
                                                </view>
                                        </navigator>
                                        <block></block>
                                    </view>
                                </view>
                            </view>
                        </block>
                    </view>
                </view>
                <view class='weizhaodao' v-else>{{__('没有找到您想搜索的商品，请重新输入')}}</view>
            </block>
            <view class="m-loading-box" v-if="cartlist.length>0">
                <block v-if="ispage">
                    <view class="u-loadmore"><label class="u-loading"></label>
                        <text class="u-loadmore-tips">{{__('正在加载')}}</text>
                    </view>
                    <view class="u-cleanbox"></view>
                </block>
                <block v-else>
                    <view class="u-loadmore u-loadmore-line" style='margin-bottom:100rpx;background-color: #fff'>
                        <text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
                    </view>
                </block>
            </view>
        </scroll-view>
        <view class='fabu_box'>
            <view class='fabu_box_fb' @tap="AddMemberPosts">{{__('确定')}}</view>
        </view>
    </view>
</template>

<script>
    import dateUtil from "../../helpers/util_date";
    import {mapMutations, mapState} from 'vuex'

    import statusBar from '../../components/status-bar.vue'
    import uniIcons from '@/components/uni-icons/uni-icons.vue';
    import courseIntroduction from './courseIntroduction.vue';
	// import courseIntroduction from '@/components/home/courseIntroduction';
    export default {
        data: function () {
            return {
                options: {},
                isckall: !1,
                isckall1: !1,
                isck: !1,
                cartlist: [],
				courseList:[],
                X_Start: 0,
                X_End: 0,
                selItemId: 0,
                Sel_Id: [],
                ispage: !1,
                flag: !0,
                isdata: !1,
                page: 1,
                ProductName: "",
                objlist: [],
                value: "",
                num: 0,
                listlength: 0
            }
        },
        components: {
            statusBar,
            uniIcons,
			courseIntroduction
        },
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
        onLoad: function (options) {
            uni.setNavigationBarTitle({
                title:this.__('推荐商品')
            });

            var that = this;
            this.setData({
                options: options
            });


            this.setData({num: options.num}), this.SelectProductList()
        },

        onHide: function () {
        },

        onShow: function () {
            var that = this;
        },

        onUnload: function () {
            let that = this;
        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {
        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },

        /**
         * 页面滚动触发事件的处理函数
         */
        onPageScroll: function () {
        },

        methods: {
            ...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getStoreInfo']),
            SelectProductList: function () {

                var that = this;
                that.setData({cartlist: [], page: 1});

                that.carlist();

            },
            carlist: function () {
                let that = this;

                this.setData({ flag: !1 });
                var params = {keywords: that.value || "", page: that.page};
                that.$.request({
                    url: this.Config.URL.store.product,
                    data: params,
                    ajaxCache: {
                        timeout: this.Config.CACHE_EXPIRE
                    },
                    success: function(data, status, msg, code) {

                        let items = data.items;
						console.log("items---carlist",items)
                        for (var i = 0; i < items.length; i++) {
                            items[i]['id'] = items[i]['item_id'];
                            items[i]['DefaultProductSkuId'] = items[i]['item_id'];
                            items[i]['ProductName'] = items[i]['product_name'];
                            items[i]['ProductTips'] = items[i]['product_tips'];
                            items[i]['SalesName'] = items[i]['product_name'];
                            items[i]['ProductPic'] = items[i]['product_image'];
                            items[i]['ItemSalePrice'] = items[i]['product_unit_price'];
                            items[i]['SaleNum'] = items[i]['product_sale_num'];
                            items[i]['Stock'] = items[i]['product_quantity'];
                            items[i]['HasManualSku'] = items[i]['item_color'].length > 1;
                            items[i]['DefaultProductSkuId'] = items[i]['item_id'];
                            items[i]['user_cart_quantity'] = 1;
							items[i]['chapter'] = items[i]['chapter'];;
                        }
/*
                        if (that.assist.length == 0)
                        {
                            that.setData({
                                assist: assist
                            })
                        }*/

                        items.length > 0
                            ? that.page == 1 && items.length < 10
                            ? that.setData({
                                cartlist: that.cartlist.concat(items),
                                flag: !1,
                                ispage: !1
                            })
                            : that.setData({
                                cartlist: that.cartlist.concat(items),
                                flag: !0,
                                ispage: !0
                            })
                            : that.setData({
                                flag: !1,
                                ispage: !1
                            });
                    }
                });
            },
            quanbu: function (t) {
                var that = this, e = [];
                if (that.setData({listlength: that.objlist.length}), that.listlength < that.num)
                {
                    for (var s = 0; s < that.cartlist.length; s++)
                    {
                        if (that.cartlist[s].item_id == t.currentTarget.dataset.id)
                        {
                            var i = that.cartlist[s];
                            that.cartlist[s].checked ? i.checked = !1 : i.checked = !0, e.push(i)
                        }
                        else
                        {
                            e.push(that.cartlist[s]);
                        }
                    }
                    that.setData({cartlist: e});
                    var l = [];
                    for (s = 0; s < this.cartlist.length; s++)
                    {
                        this.cartlist[s].checked && l.push(this.cartlist[s]);
                    }
                    that.setData({objlist: l})
                }
                else
                {
                    for (s = 0; s < that.cartlist.length; s++)
                    {
                        if (that.cartlist[s].item_id == t.currentTarget.dataset.id)
                        {
                            i = that.cartlist[s];
                            that.cartlist[s].checked && (i.checked = !1, that.setData({listlength: that.listlength - 1})), e.push(i)
                        }
                        else
                        {
                            e.push(that.cartlist[s]);
                        }
                    }
                    that.setData({cartlist: e});
                    for (l = [], s = 0; s < this.cartlist.length; s++)
                    {
                        this.cartlist[s].checked && l.push(this.cartlist[s]);
                    }
                    that.setData({objlist: l}), that.listlength >= that.num && that.$.alert(that.sprintf(that.__("最多可添加%s个"), that.num))
                }
            },
            AddMemberPosts: function () {
                var that = this;
                that.$.backpage(1, function () {
                    var data = {couponItemId: that.objlist};
                    that.notice.postNotificationName("RefreshCoupon", data)
                })
            },
            startinput: function (t) {
                this.setData({value: t.detail.value})
            },
            scrollbottom: function (t) {
                var that = this;
                if (this.flag)
                {
                    this.setData({flag: !1}), clearTimeout(e);
                    var e = setTimeout(function () {
                        that.setData({page: parseInt(that.page) + 1}), that.carlist()
                    },
            500)
                }
            }
        }
    }
</script>


<style lang="scss">
    @import "../../styles/_variables";
    @import '../../styles/layout.scss';
    .m-search-box {
        padding: 20rpx;
        background-color: #EFEFF4;
        overflow: hidden
    }

    .u-input-search {
        width: 100%;
        height: 70rpx;
        background-color: white;
        float: left;
        border-radius: 8rpx;
        overflow: hidden;
        border: 1rpx solid #DFDFDF;
    }

    .u-input-search input {
        font-size: 28rpx;
        height: 100%;
        width: 400rpx;
        float: left;
    }

    .u-input-search label {
        display: block;
        float: left;
        width: 60rpx;
        height: 70rpx;
        position: relative;
        text-align: center;
        line-height: 79rpx;
        font-size: 80rpx;
        color: #888;
    }

    .u-input-search .u-btn {
        height: 70rpx;
        line-height: 70rpx;
        border-left: 1rpx solid #DFDFDF;
        display: block;
        float: right;
        text-align: center;
        text-decoration: none;
        color: #999;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        font-size: 28rpx;
    }

    .phone_one {
        display: flex;
        position: relative;
        justify-content: space-between;
        width: 100rpx;
        height: 70rpx;
        float: left;
    }

    .phone_personal {
        width: 100rpx;
        height: 70rpx;
        line-height: 70rpx;
        text-align: center;
        font-size: 28rpx;
    }

    .phone_select {
        margin-top: 0;
        z-index: 100;
        position: absolute;
    }

    .select_one {
        text-align: center;
        width: 100rpx;
        height: 70rpx;
        line-height: 70rpx;
        font-size: 28rpx;
        position: absolute;
        top: 52rpx;
        left: 3rpx;
        background-color: white;
    }

    .select_two {
        text-align: center;
        width: 100rpx;
        height: 70rpx;
        line-height: 70rpx;
        font-size: 28rpx;
        position: absolute;
        top: 100rpx;
        left: 3rpx;
        background-color: white;
    }

    .personal_image {
        z-index: 100;
        position: absolute;
        right: 2.5%;
        width: 34rpx;
        height: 20rpx;
        margin: 40rpx 20rpx 40rpx 0;
        transition: All 0.4s ease;
        -webkit-transition: All 0.4s ease;
    }

    .rotateRight {
        transform: rotate(180deg);
    }

    .m-search-box-img {
        width: 29rpx;
        height: 22rpx;
        float: left;
        margin-top: 13rpx;
    }

    .m-search-box-image {
        width: 29rpx;
        height: 22rpx;
    }

    .u-cart-num {
        position: absolute;
        bottom: 20rpx;
        right: 20rpx;
        z-index: 2;
    }

    .m-cart-ck {
        float: left;
        width: 90rpx;
        background-color: #fff;
        height: 100%;
        position: relative;
    }

    .m-cart-ck .uni-icons,
    .m-cart-ck icon {
        position: absolute;
        top: 50%;
        left: 51%;
        margin-top: -23rpx;
        margin-left: -12rpx;
        overflow: visible
    }

    .m-product-info {
        width: 438rpx;
        padding: 10rpx;
    }

    .m-product-info::before {
        border: none;
    }

    .m-product-item {
        border-bottom: 1rpx solid #eee;
        position: relative;
        overflow: hidden;
        height: 212rpx
    }

    .m-shop-item {
        display: flex;
        border-bottom: 1rpx solid #eee;
        position: relative;
        overflow: hidden;
        height: 74rpx;
        background-color: #fff;
        line-height: 68rpx;
        margin-top: 20rpx;
        align-items: center
    }

    .quan {
        margin-top: 34rpx;
        margin-left: 33rpx
    }

    .title {
        font-size: 28rpx;
        margin-left: 10rpx;
        margin-top: 5rpx;
    }

    .title_logo {
        width: 40rpx;
        height: 40rpx;
        float: left;
        padding-bottom: 10rpx;
        padding-left: 30rpx;
    }

    .title_logo_img {
        width: 40rpx;
        height: 40rpx;
    }

    .m-item-c {
        position: absolute;
        height: 100%;
        width: 850rpx;
    }

    .u-del {
        width: 100rpx;
        background-color: #DB384C;
        float: right;
        height: 100%;
        color: #fff;
        font-size: 28rpx;
        text-align: center;
        line-height: 212rpx;
    }

    /*底部按钮 start*/
    .m-footer-btn {
        height: 100rpx;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #fff;
        border-top: 1rpx solid #d5d5d5;
        z-index: 3
    }

    .m-footer-btn-list {
        width: 75%;
        height: 100%;
        position: relative;
        float: left;
    }

    .m-footer-btn-item {
        position: relative;
        float: left;
        width: 50%;
        font-size: 24rpx;
        color: #888;
        line-height: 40rpx;
        padding: 15rpx 0;
        box-sizing: border-box;
        height: 100%;
    }

    .m-footer-btn-main {
        width: 25%;
        height: 100%;
        float: left;
        background-color: #DB384C;
        color: #fff;
        line-height: 100rpx;
        font-size: 32rpx;
        text-align: center;
    }

    .m-cart-total {
        text-align: right;
        padding-right: 20rpx;
    }

    .m-cart-total text {
        font-size: 36rpx;
        color: #DB384C;
    }

    .m-cart-total label {
        color: #DB384C;
    }

    .m-cart-del {
        line-height: 70rpx;
        font-size: 32rpx;
    }

    /*底部按钮 end*/
    .del {
        -webkit-animation: mdel .2s 1;
        animation: mdel .2s 1;
        left: -100rpx;
    }

    @-webkit-keyframes mdel {
        0% {
            left: 0;
        }
        100% {
            left: -100rpx;
        }
    }

    @keyframes mdel {
        0% {
            left: 0;
        }
        100% {
            left: -100rpx
        }
    }

    .m-product-img {
        /*margin-top: 15rpx;*/
    }

    .m-product-name {
        /*height: 100rpx;*/
    }

    .m-product-price label {
        font-size: 32rpx;
    }

    .fabu_box_fb {
        background: #e73533;
        color: #fff;
        width: 750rpx;
        text-align: center;
        float: left;
        line-height: 80upx;
    }

    .fabu_box {
        height: 79rpx;
        line-height: 79rpx;
        font-size: 30rpx;
        position: fixed;
        bottom: 0;
        display: flex
    }

    .test {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff
    }

    .weizhaodao {
        height: 800rpx;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #666;
        background-color: #fff
    }
@import "@/styles/community/selectShop.scss";
</style>

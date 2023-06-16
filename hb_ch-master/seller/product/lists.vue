<template>
	<view class="page">
		<view class="sstouch-main-layout">
		  <view class="top">
		   	<view   right-icon="scan" style="width: 80%;float:left;;padding:10upx 20upx;">
		   		<view class="input-view" style="width: 100%;">
		   			<input  style="font-size:26upx;"  class="input" type="text" :value="search_name" :placeholder="__('请输入商品标题进行搜索')" @input="inputSearch">
		   			<image style="width:30upx;height:30upx;float:left;margin:12upx auto;z-index:9" src="/static/images/false.png" mode="aspectFill" @click="gocancel" />
		   		</view>
		   	</view>
		   	<image style="width:50upx;height:50upx;float:left;padding:26upx 0;" src="/static/images/tabBar6.png" mode="aspectFill" @click="goSearch" />
		   </view>

			<view class="m-navbar">
				<scroll-view class="scroll-view_S" scroll-x >
					<block >
						<view :class="(parent_id == 0 ?'m-navbar-mu':'m-navbar-item')" data-id="0" @click="all">
							{{__('全部')}}
						</view>
					</block>
					<block v-for="(val,index) in product_category" :key="index" >
						<view :class="(parent_id ==val.category_id ?'m-navbar-mu':'m-navbar-item')" :data-id="val.category_id" @click="setparentcategoryid">
							{{val.category_name}}
						</view>
					</block>
				</scroll-view>
			</view>

			<view class="m-navbar" style="margin-top:4upx;">
				<scroll-view class="scroll-view_S" scroll-x >
					<block v-for="(category,key) in detail" :key="key" >
						<view :class="(category_id ==category.category_id ?'m-navbar-mu':'m-navbar-item')" :data-id="category.category_id" @click="setcategoryid">
							{{category.category_name}}
						</view>
					</block>
				</scroll-view>
			</view>
			<view class="m-tab">
				<view class="m-navbar">
					<view :class="['m-navbar-item', tapindex==1?'m-navbar-item-on':'']" @click="toInale">
						{{__('出售中')}}
					</view>
					<view :class="['m-navbar-item', tapindex==2?'m-navbar-item-on':'']" @click="toWarehouse">
						{{__('仓库中')}}
					</view>
					<view :class="['m-navbar-item', tapindex==3?'m-navbar-item-on':'']" @click="toViolation">
						{{__('违规商品')}}
					</view>
				</view>
			</view>
		</view>

		<scroll-view v-if="(productlist.length>0)" scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom">
		<view class="sstouch-order-list" >
		    <view class="ul" id="order-list" v-for="(items, i) in productlist"  :key="i">
		        <view class="sstouch-order-item">
		            <view class="sstouch-order-item-con">
		                <navigator :url="'/seller/product/save?id='+items.product_id" class="goods-block">
		                    <view class="goods-pic">
								<img class="img" :src="items.product_image" style="border:solid 1px #ccc;padding:1px;"></view>
		                    <view class="goods-info" style="padding-left:20upx;">
		                        <view class="goods-name" style="width:100%;height:50upx;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 1;overflow: hidden;">{{items.product_name}}</view>
								<view class="goods-type" style="font-size:26upx;line-height: 40rpx;height: 40rpx;" v-if="false">{{__('库存')}}：{{items.product_quantity}}</view>
		                        <view class="goods-type" style="font-size:26upx;line-height: 40rpx;height: 40rpx;">￥{{items.product_unit_price}}</view>
		                        <view class="goods-type" style="font-size:26upx;line-height: 40rpx;height: 40rpx;">{{__('日期')}}：{{items.product_sale_time}}</view>
		                    </view>
		                    <view class="goods-subtotal">
		                        <navigator class="hide" url="javascript:void(0)" :item_id="items.product_id">{{__('编辑')}}</navigator>
								<block v-if="(items.product_state_id == 1001)">
									<view class="btn offline-goods"  :data-item_id="items.product_id" style="margin-bottom: 10px;" @click.stop="cancelLower">{{__('下架')}}
									</view>
								</block>
								<block v-if="(items.product_state_id == 1002)">
									<view class="btn offline-goods" :data-state_id="items.product_state_id" :data-item_id="items.product_id" style="margin-bottom: 10px;" @click.stop="Uppershelf">{{__('上架')}}
									</view>
								</block>
								<block v-if="(items.product_state_id == 1000)">
									<view class="btn offline-goods" :data-state_id="items.product_state_id" :data-item_id="items.product_id" style="margin-bottom: 10px;">{{__('禁售')}}
									</view>
								</block>

		                        <view class="btn delete-goods"  :data-item_id="items.product_id" @click.stop="cancelproduct">{{__('删除')}}</view>
		                    </view>
		                </navigator>
		            </view>
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
		</view>
		</scroll-view>
		<view redirect="true" class="m-nullpage" v-else>
		    <view class="m-nullpage-middle">
		        <label class="iconfont icon-sousuo-sousuo"></label>
		        <view class="m-null-tip">
		            <text>{{__('亲~找不到您想要的商品')}}</text>
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
				isdata: false,
				tapindex: 1,
				page: 1,
				rows: 10,
				ispage: !0,
				flag: !0,
				type: 0,
				product_state_id:1001,
				formId: "",
				productlist: [],
				imgLogo: "",
				show: !1,
				Info: "",
				sord: 'desc',
				bannerShow:false,
				iscancel:0,
				search_name:'',
				product_category:[],
				category_id:0,
				curIndex:0,
				detail: [],

				parent_id:0,

			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('商品管理')
			});

			this.setData({
				tapindex: options.sl ? options.sl : 1,
				page: 1,
				rows: 10,
				productlist: [],
				type: options.type ? options.type : 0,
				product_state_id:options.type ? options.type : 1001
			});
			var t = this;
			this.notice.addNotification("RefreshMessage", t.RefreshMessage, t);
			t.$.request({
			    url: t.Config.URL.product.category,
			    loading: false,
			    ajaxCache: {
			        timeout: t.Config.CACHE_EXPIRE
			    },
			    success(data) {
			        t.setData({
			            product_category: data.items,
						parent_id: data.items[t.curIndex].category_id
			        })

			        t.loadCategory(true)
			    }
			});
			// this.getProductlist()
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			toInale:function (){
				this.setData({
					tapindex: 1,
					page: 1,
					rows: 10,
					productlist: [],
					ispage: !0,
					flag: !0,
					type: 0,
					product_state_id: 1001
				}), this.getProductlist()
			},
			toWarehouse:function (){
				this.setData({
					tapindex: 2,
					page: 1,
					rows: 10,
					productlist: [],
					ispage: !0,
					flag: !0,
					type: 0,
					product_state_id: 1002
				}), this.getProductlist()
			},
			toViolation:function (){
				this.setData({
					tapindex: 3,
					page: 1,
					rows: 10,
					productlist: [],
					ispage: !0,
					flag: !0,
					type: 0,
					product_state_id: 1000
				}), this.getProductlist()
			},

			getProductlist: function() {
				var that = this;
				var params = {
					page: that.page,
					product_state_id: that.product_state_id,
					category_id:that.category_id,
					product_name:that.search_name,
					sidx:'product_add_time',
					sord:that.sord,
				};

				that.$.request({
					url: this.Config.URL.seller.lists_product,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status && data.items.length > 0) {
							//console.log(data)
							if (data.page >= data.total) {
								that.setData({
									flag: !1,
									ispage: !1,
									productlist: that.productlist.concat(data.items)
								})
							} else {
								that.setData({
									flag: !0,
									ispage: !0,
									productlist: that.productlist.concat(data.items)
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

			inputSearch:  function(e){
				this.setData({
					search_name:e.detail.value
				})
			},

			gocancel: function(e){
				this.setData({
					search_name:''
				})
			},

			goSearch: function(e){
				this.setData({
					page: 1,
					rows: 10,
					productlist: [],
					ispage: !0,
					flag: !0,
					type: 0,
				}), this.getProductlist()
			},

			all: function() {
				this.loadCategory(true)
			},

			setparentcategoryid: function(e){
				var that = this
				that.setData({
					parent_id:e.currentTarget.dataset.id
				})
				that.loadCategory()
			},

			setcategoryid: function(e){
				this.setData({
					category_id:e.currentTarget.dataset.id,
					page: 1,
					productlist:[]
				})

				this.getProductlist()
			},

			loadCategory(t) {
				var that = this;
				that.$.request({
					url: that.Config.URL.product.category,
					data: {
						category_id: that.parent_id,
						recursive: 1
					},
					ajaxCache: {
						timeout: that.Config.CACHE_EXPIRE
					},
					success(data) {
						var category = []
						for(var i=0;i < data.items.length; i++)
						{
							category = category.concat(data.items[i].sub)
						}
						that.setData({
							detail: category,
							category_id: t ?  0 : category[0].category_id,
							parent_id:t ? 0 : that.parent_id,
							page: 1,
							rows: 10,
							productlist: [],
							ispage: !0,
							flag: !0,
							type: 0,
						})

						that.getProductlist()
					}
				});
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

							that.getProductlist()
						}, 100)
				}
			},

			cancelLower: function (e) {
			    var that = this;

			    that.$.confirm(that.__("是否下架商品?下架还可以在仓库中上架"), function (a) {
			            if (a.confirm)
			            {
			                var params = {
			                    product_id: e.currentTarget.dataset.item_id,
								product_state_id: 1002
			                };

			                that.$.request({
			                    url: that.Config.URL.seller.edit_state,
			                    data: params,
			                    success: function (data, status, msg, code) {
			                        if (200 == status) {
										that.$.showToast({title: that.__("操作成功"), icon: "success", duration: 2e3}), clearTimeout(t);
										var t = setTimeout(function () {
											that.toInale();
										}, 1500)
			                        } else {
			                        }
			                    }
			                });
			            }
			        },
			        !0)
			},

			cancelproduct: function (e) {
			    var that = this;

			    that.$.confirm(that.__("是否删除商品?删除后系统将不再保存"), function (a) {
			            if (a.confirm)
			            {
			                var params = {
			                    product_id: e.currentTarget.dataset.item_id,
			                };

			                that.$.request({
			                    url: that.Config.URL.seller.remove_product,
			                    data: params,
			                    success: function (data, status, msg, code) {
			                        if (200 == status) {
										that.$.showToast({title: that.__("操作成功"), icon: "success", duration: 2e3}), clearTimeout(t);
										var t = setTimeout(function () {
											that.setData({
												page: 1,
												rows: 10,
												productlist: [],
												ispage: !0,
												flag: !0,
												type: 0,
											}), that.getProductlist()

										}, 1500)
			                        } else {
										that.$.showToast({title: that.__(msg)})
			                        }
			                    }
			                });
			            }
			        },
			        !0)
			},

			Uppershelf: function (e){
				var that = this;

				that.$.confirm(that.__("是否上架商品?上架后可以正常销售"), function (a) {
				        if (a.confirm)
				        {
				            var params = {
				                product_id: e.currentTarget.dataset.item_id,
								product_state_id: 1001
				            };

				            that.$.request({
				                url: that.Config.URL.seller.edit_state,
				                data: params,
				                success: function (data, status, msg, code) {
				                    if (200 == status) {
										that.$.showToast({title: that.__("操作成功"), icon: "success", duration: 2e3}), clearTimeout(t);
										var t = setTimeout(function () {
											that.toWarehouse();
										}, 1500)
				                    } else {
				                    }
				                }
				            });
				        }
				    },
				    !0)
			},
		}
	}
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
		margin: 7px 0;
		line-height: 30px;
		// border:2upx solid #ebebe7;
		border-radius:15upx;
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
		padding-top: 380upx;
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

	.img {
		width:140upx;
		height:140upx;
	}

	.u-loadmore {
		width:100%
	}



	.m-nullpage {
		padding-top:100upx;
	}

	.top {
		width:100%;
		height:82upx;
		background:#f5f5f5;
		overflow:hidden;
		z-index:99;
		line-height:82upx;
		padding:20upx 0;
	}

	.m-product-name {
		height:100upx;
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



	/*全部商品 start*/
	.m-navbar-item {
			// width:228upx;
			padding: 20upx 30upx;
			font-size: 24upx;
			 display: inline-block;
		}

		.m-navbar {
			height:76upx;
			position: relative;
			// margin-top:240upx;
			z-index:99;
		}

	.scroll-view_S{
			  white-space: nowrap;
			}

	.m-navbar-mu {
		padding: 20upx 30upx;
		font-size: 24upx;
		 display: inline-block;
		color:#DB384C;

	}

	.m-navbar:after {
		border-bottom: 0px solid #CCCCCC;
	}

	.goods-name {
		width:100%;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
</style>

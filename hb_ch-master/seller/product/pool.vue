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
		   	<image style="width:50upx;height:50upx;float:left;padding:26upx 0;" src="/static/images/seach.png" mode="aspectFill" @click="goSearch" />
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
		</view>

		<scroll-view v-if="(productlist.length>0)" scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom">
		<view class="sstouch-order-list" >
		    <view class="ul" id="order-list" v-for="(items, i) in productlist"  :key="i">
		        <view class="sstouch-order-item">
		            <view class="sstouch-order-item-con">
		                <view class="goods-block">
		                    <view class="goods-pic">
								<img class="img" :src="items.product_image" style="border:solid 1px #ccc;padding:1px;"></view>
		                    <view class="goods-info" style="padding-left:20upx;">
		                        <view class="goods-name">{{items.product_name}}</view>
		                        <view class="goods-type">￥{{items.product_market_price}}<br class="br">{{__('店铺')}}：{{items.store_name}}</view>
		                    </view>
		                    <view class="goods-subtotal" style="top:80upx;width:180upx;">
		                        <navigator class="hide" url="javascript:void(0)" :item_id="items.product_id">{{__('编辑')}}</navigator>
								<block v-if="(items.product_is_dist == 1)">
									<view class="btn delete-goods">{{__('已经分销')}}
									</view>
								</block>
								<block v-else>
									<view class="btn delete-goods" style="color:#fff !important;background-color: #1A1A1A;margin-bottom: 10px;"  :data-product_id="items.product_id"  @click="AddDistProduct">{{__('加入商品库')}}
									</view>
								</block>
		                    </view>
		                </view>
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
				rows: 100,
				ispage: !0,
				flag: !0,
				type: 0,
				formId: "",
				productlist: [],
				imgLogo: "",
				show: !1,
				Info: "",
				sord: 'desc',
				bannerShow:false,
				iscancel:0,
				search_name:'',
				product_verify_id: 3001,
				product_state_id: 1001,
				product_category: [],
				category_id:0,
				parent_id:0,
				leaf_items:[],
				curIndex:0,
				detail: [],
				product_items: [],

			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			var that = this

			uni.setNavigationBarTitle({
				title:this.__('商品管理')
			});

			this.setData({
				page: 1,
				rows: 100,
				productlist: [],
				type: options.type ? options.type : 0,
				product_state_id:options.type ? options.type : 1001
			});
			var t = this;
			this.notice.addNotification("RefreshMessage", t.RefreshMessage, t);

			that.$.request({
			    url: that.Config.URL.product.category,
			    loading: false,
			    ajaxCache: {
			        timeout: that.Config.CACHE_EXPIRE
			    },
			    success(data) {
			        that.setData({
			            product_category: data.items,
						parent_id: data.items[that.curIndex].category_id
			        })

			        that.loadCategory(true)
			    }
			});

		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),


			getProductlist: function() {
				var that = this;
				var params = {
					product_verify_id: that.product_verify_id,
					product_state_id: that.product_state_id,
					product_fx_enable: 1,
					store_type: 2,
					rows: that.rows,
					page: that.page,
					sidx:'product_order',
					sord:that.sord,
					product_name:that.search_name,
					category_id: that.category_id,
				};

				that.$.request({
					url: this.Config.URL.seller.product_pool,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status && data.items.length > 0) {

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

			setparentcategoryid: function(e){
				var that = this
				that.setData({
					parent_id:e.currentTarget.dataset.id
				})
				that.loadCategory()
			},

			all: function() {
				this.loadCategory(true)
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
							productlist: [],
							ispage: !0,
							flag: !0,
							type: 0,
						})

						that.getProductlist()
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
					rows: 100,
					productlist: [],
					ispage: !0,
					flag: !0,
					type: 0,
				}), this.getProductlist()
			},

			setcategoryid: function(e){
				this.setData({
					category_id:e.currentTarget.dataset.id,
					page: 1,
					product_name:'',
					productlist:[]
				})

				this.getProductlist()
			},



			AddDistProduct: function(e){
				var that = this;

				var	params = {
						product_id: e.target.dataset.product_id,
						product_is_dist: 1
					};
					that.$.request({
						url: that.Config.URL.seller.add_DistProduct,
						data: params,
						success: function(data, status, msg, code) {
							if(status ==  200){
								that.$.alert(that.__("分销成功！"), function() {
									setTimeout(function () {
										that.setData({
											page: 1,
											rows: 100,
											productlist: [],
											ispage: !0,
											flag: !0,
											type: 0,
										})
										that.getProductlist()
									}, 1500)
								})
							}
						}
					})
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
								rows: that.rows
							});

							that.getProductlist()
						}, 1000)
				}
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
		padding-top: 300upx;
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

	.img {
		width:122upx;
		height:122upx;
	}
</style>

<template>
	<view class="page">
		<view class="top">
			<view class="m-user-info" >
				<view class="m-user-index" @click="obtainUserInfo">
					<view class="m-user-left">
						<image style="float:left;" lazy-load :src="(UserInfo.user_avatar)" mode="scaleToFill" />
						<view class="m-info" style="float:left;">
							<label>{{UserInfo.user_account}}</label><label style="margin-left:20upx">{{UserInfo.user_licenseplate}}</label>
							<view class="m-mobile">{{UserInfo.user_mobile}}</view>
						</view>
					</view>

				</view>
			</view>

			<view class="m-top-seach">
				<view class="m-seach-input">
					<view class="m-seach-image" @click="goSearch">
						<image  src="/static/images/seach.png"></image>
					</view>
					<input  type="text" :value="search_name" :placeholder="__('输入商品名进行搜索')"  @input="inputSearch">
				</view>
				<view class="m-seach-text" @click="goSearch">{{__('搜索')}}</view>
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

		<scroll-view v-if="(productlist.length>0)" :scroll-top="scrollTop" scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom">
		<view class="sstouch-order-list" >
			<view class="product-list" v-for="(items, i) in productlist"  :key="i">
				<view class="product-list-item">
					<view class="product-item-image">
						<img :src="items.product_image" />
					</view>
					<view class="product-item-details">
						<view class="product-item-name">
							{{items.item_name}}
						</view>
						<view class="product-item-info">
							<view>{{__('￥')}}{{items.item_unit_price}}</view>
							<view>{{__('库存')}}：{{items.item_quantity}}</view>
						</view>
						<view class="example-body" style="float:right;position: relative;bottom:-20upx;">
							<uni-number-box  :min="0" :max="items.item_quantity"  :value="numberValue" :price="items.item_unit_price" @change="changes($event,items.item_id,items.item_unit_price,items.product_image,items.product_item_name)" />
						</view>
					</view>
				</view>
			</view>

			<view class="m-footer-btn">
					<view class="m-footer-btn-list">
						<label>{{__('合计：')}}</label>
						<label>￥ {{price}}</label>
					</view>
				<view class="m-footer-btn-main m-footer-desable"  @click="ckselectsp">
						{{__('生成订单')}}
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


		<!--客户列表 -->
		<uni-drawer :visible="rightDrawerVehicle" mode="right">
			<view class="m-top-seach" style="margin-top:0;position: fixed;">
				<view  right-icon="scan" style="width: 75%;float:left;padding:10upx 30upx;">
					<view class="input-view" style="width: 100%;">
						<input  style="font-size:26upx;background:#ffffff"  class="input" type="text" :value="search_user_name" :placeholder="__('输入手机号或车牌号进行搜索')" @input="inputSearchUser">
						<image style="width:30upx;height:30upx;float:left;margin:14upx auto;z-index:9" src="/static/images/false.png" mode="aspectFill" @click="gocancelUser" />
					</view>
				</view>

				<view class="m-cell-hd" style="width:60upx;height:60upx;float:left;line-height:90upx" @click="licenseplateImage"><label  class="iconfont icon-xiangji"></label></view>
				<image class="m-cell-hd" style="width:60upx;height:60upx;float:left;margin-top:20upx" src="/static/images/tabBar4.png" mode="aspectFill" @click="goadduser" />
			</view>
			<scroll-view scroll-y="true" style="height: 100%;position: absolute;top:132upx">
			<view class="m-cells" style="padding:20upx 20upx;" v-for="(user,ii) in user_Info" :key="ii">
				<view class="m-cell m-cell-access m-info-sp" :data-id="user.user_id" :data-index="ii" @click="Presuser">
					<view class="m-cell-bd">
						<view  class="m-order-title" >
							<view style="float:left;">
								<image  class="nav-image" lazy-load style="width:60upx;height:60upx;" :src="(user.user_avatar?user.user_avatar:'https://static.shopsuite.cn/demodata/assets/data/avatar.png')" mode="scaleToFill" />
							</view>
							<view style="float:left;margin-left:20upx">
								<!-- <view  class="m-ber-n">{{user.user_account}}</view> -->
								<view class="m-ber-n">{{user.user_mobile}}</view>
								<view class="m-ber-n">{{user.user_licenseplate}}</view>
							</view>

						</view>
					</view>
				</view>
			</view>
			</scroll-view>
		</uni-drawer>


	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue'
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import uniBadge from '@/components/uni-badge.vue';

	export default {
		data()  {
			return {
				UserInfo: {
				    user_account: this.__('选择客户'),
				    user_avatar: 'https://static.shopsuite.cn/demodata/assets/data/avatar.png',
					user_licenseplate:'',
					user_mobile:''
				},
				scrollTop: 0,
				search_name:'',
				page: 1,
				rows: 10,
				productlist: [],
				ispage: !0,
				flag: !0,
				type: 0,
				item_quantity:0,
				itemInfo:[],
				numberValue:0,
				rightDrawerVehicle: false,
				num:0,
				price:0,
				search_user_name:'',
				user_Info:[],
				user_id:0,
				index:0,
				isdata:!0,
				selectsp:0,

				current:999999,
				Address_id:0,
				product_category:[],
				category_id:0,
				parent_id:0,
				leaf_items:[],
				curIndex:0,
				detail: [],
				product_items: [],
				cartItem: [],
				order_amount:0

			}
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
			uniNumberBox,
			uniDrawer,
			uniList,
			uniListItem,
			uniBadge
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			var that = this
			uni.setNavigationBarTitle({
				title:this.__('销售开单')
			});

			this.setData({
				tapindex: options.sl ? options.sl : 1,
				page: 1,
				rows: 10,
				productlist: [],
				type: options.type ? options.type : 0,
				urlArgs: options,
				product_state_id:options.type ? options.type : 1001,
			});


			this.notice.addNotification("RefreshOrder", that.RefreshOrder, that);
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

		onUnload: function() {
			//移除通知
			var that = this
			this.notice.removeNotification("RefreshOrder", that);


		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			ckselectsp: function(e) {
				var that =this


				if (that.$.isNull(this.user_id))
				{
				    that.$.confirm(that.__("请选择客户"), function (a) {
				    					 if (a.confirm)
				    					 {
				    						 that.obtainUserInfo()
				    					 }
				    })

				    return
				}

				if (that.$.isNull(this.num))
				{
				    that.$.confirm(that.__("请选择商品"), function (a) {

				    })

					return
				}


				uni.setStorageSync('items', that.cartItem);

				var options = {
					u_id:this.user_id
				}
				this.$.navigateTo({
					url: this.$.createUrl("/seller/user/cart",options)
				});

			},

			closesp: function(e) {
				var that = this;
				that.setData({
					selectct: 0,
					/*flag: !1*/
				});

				setTimeout(function() {
						that.setData({
							selectsp: 0
						})
					},
					1e2)
			},

			inputSearch:  function(e){
				this.setData({
					search_name:e.detail.value
				})
			},

			inputSearchUser: function(e){
				this.setData({
					search_user_name:e.detail.value
				})
				this.getUser()
			},

			gocancelUser: function(){
				this.setData({
					search_user_name:''
				})
			},

			setcategoryid: function(e){
				this.setData({
					category_id:e.currentTarget.dataset.id,
					page: 1,
					productlist:[]
				})

				this.getProductlist()
			},


			getUser: function(){
				var that = this;

				var params = {
					user_nickname:that.search_user_name,
				}
				that.$.request({
					url: that.Config.URL.seller.User_Info,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==  200){
							that.setData({
								user_Info:data.items
							})
						}else{
							that.$.alert(msg)
						}
					}
				})
			},

			goadduser: function() {
				var that = this;
				that.$.navigateTo({
					url: '/seller/user/add'
				})
			},

			gocancel: function(e){
				this.setData({
					search_name:''
				})
			},

			cancelAddre: function() {
				this.setData({
					rightDrawerAddre:false
				})
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


			getProductlist: function() {
				var that = this;
				var params = {
					page: that.page,
					product_state_id: 1001,
					product_name:that.search_name,
					sidx:'item_id',
					sord:that.sord,
					category_id:that.category_id
				};

				that.$.request({
					url: this.Config.URL.seller.lists_item,
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

			Presuser: function(e) {
				var that = this;
				var i = e.currentTarget.dataset.index
				that.setData({
					UserInfo:that.user_Info[i],
					user_id:e.currentTarget.dataset.id,
					rightDrawerVehicle:false,
					user_Info:[],
					search_user_name:'',
					Address_id:0,
				})
			},

			AddOrder: function() {
				var that = this;
				if (that.$.isNull(this.user_id))
				{
				    that.$.confirm(that.__("请选择客户"), function (a) {
				    					 if (a.confirm)
				    					 {
				    						 that.obtainUserInfo()
				    					 }
				    })

					return
				}


				if (that.$.isNull(this.num))
				{
				    that.$.confirm(that.__("请选择商品"), function (a) {

				    })

					return
				}

				this.saleOrder()
			},

			SelectAddress: function(){
				var that = this;
				var urlArgs = {};
				var url = '';

				url = "/seller/user/address";
				urlArgs.issub = "true";
				urlArgs.ud_id = 3;
				urlArgs.u_id = that.user_id

				that.$.navigateTo({
					url: that.$.createUrl(url, urlArgs)
				});

			},

			//上传车牌照图片
			licenseplateImage: function(){
				var that = this;
				that.$.chooseImage({
				    count: 1,
				    sizeType: ["compressed"],
				    success: function(n) {
				        that.$.showLoading();
				        var r = n.tempFilePaths;
				        that.$.uploadFile({
				            url: that.Config.URL.upload,
				            method: "POST",
				            filePath: r[0],
				            name: "upfile",
							formData: {
							             'license_plate': 'test'
							          },
				            success: function(n) {
				                that.$.hideLoading();
								var up_res = that.$.parseJSON(n.data);

								that.setData({
									search_user_name: up_res.data.license_plate_number
								})
								that.getUser()

				            },
				            fail: function(e) {
				                that.$.hideLoading()
				            },
				            complete: function(e) {
				                that.$.hideLoading()
				            }
				        })
				    },
				    fail: function(e) {
				        that.$.hideLoading()
				    },
				    complete: function(e) {
				        that.$.hideLoading()
				    }
				})
			},

			saleOrder: function(){

				var that = this;

				var params = {
					buyer_user_id:this.user_id,
					ud_id:this.Address_id,
					items:[]
				}

				var items = []
				for(var i in that.itemInfo){
					if(that.itemInfo[i].cart_quantity > 0 ){
						items.push(that.itemInfo[i])
					}

				}
				params.items = JSON.stringify(items)

				that.$.request({
					url: that.Config.URL.seller.Order_Base,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==  200){
							that.$.alert(that.__('添加订单成功！'), function() {
								let url = that.$.sprintf('/seller/order/detail?on=%s', data.order_id[0])
								that.$.gopage(url);

								/*
								setTimeout(function() {
									that.$.navigateBack(1);
								}, 2e3);
								*/
							});
						}else{

							that.$.confirm(msg, function (a) {

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
								rows: 10
							});

							that.getProductlist()
						}, 100)
				}
			},



			changes: function(e,id,t,i,v){
				var that = this
				that.itemInfo[id] = {
					item_id:id,
					cart_quantity:e,
					item_unit_price:t,
					product_image:i,
					product_item_name:v
				}
				var num = 0;

				that.cartItem = []
				for(var i in that.itemInfo ){
					num  =num + that.itemInfo[i].cart_quantity
					if(that.itemInfo[i].cart_quantity > 0 ){
						that.cartItem.push(that.itemInfo[i])
					}

				}

				that.checkout()


				that.setData({
					num : num,
				})


			},

			checkout: function() {
				var that = this


				var pat = []
				var params = {}
				for(var i in that.cartItem){
					if(that.cartItem[i].cart_quantity > 0){
						var t = that.cartItem[i].item_id + '|' + that.cartItem[i].cart_quantity
						pat.push(t)
					}
				}

				if (pat)
				{
					params={
						cart_id : pat.join(','),
						if_chain : 0,
						buyer_user_id : that.user_id,
					}
				}
				//console.log(params)
				that.$.request({
					url: this.Config.URL.seller.checkout,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {

							that.setData({
								price: data.orderSelMoneyAmount
							});
						}
					},
				})
			},

			obtainUserInfo: function() {
				this.setData({
					rightDrawerVehicle:true,
				})
			},

			RefreshOrder: function(e) {
				this.setData({
					Address_id: e.ud_id,
				})

			},

			//扫码
			getscanCode: function(){
				var that = this;
				uni.scanCode({
					scanType: ['qrCode','barCode'],
				    success: function (res) {
				        //console.log('条码类型：' + res.scanType);
				        //console.log('条码内容：' + res.result);
						that.setData({
							chain_code:res.result
						})
				    }
				});
			},



		}
	}
</script>

<style lang="scss">
	@import "../../styles/base.scss";
	@import "../../styles/sstouch_member.scss";
	@import "../../styles/sstouch_common.scss";
	@import "../../styles/_variables";

	.top {
		width: 100%;
		// height: 320upx;
		vertical-align: top;
		position: fixed;
		background-color: #ececec;
		background:#f5f5f5;
		overflow:hidden;
		z-index:9;

	}

	.m-top-seach {
		width:100%;
		height:100upx;
		background:#f5f5f5;
		overflow:hidden;
		z-index:99;
		line-height:82upx;
		position: relative;
		// top:32upx;
	}



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

	.m-user-info {
		text-align: center;
		z-index: 3;
		color: #666;
	}


	.m-user-info image {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		border: 1px solid #fff;
		vertical-align: middle;
		box-shadow: 0px 2upx 15upx rgba(0, 0, 0, 0.35);

		// position: absolute;
		// left:260upx;
		// top:30upx;

	}

	.m-user-info .m-name {
		position: absolute;
		top:40upx;

		text-align: center;
		width: 200upx;

	}

	.m-orderlist {
		position: absolute;
		// top: calc(var(--status-bar-height) + 208upx);
		padding-top: 460upx;
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
		padding-top:400upx;
	}

	.uni-numbox__minus, .uni-numbox__plus {
		width:30upx;
	}

	.uni-numbox {
		height:60upx;
	}

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

	}

	.m-footer-btn-list {
		width: 50%;
		height: 100%;
		position: relative;
		float: left;
		// display: flex;
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
		line-height: 100upx;
		font-size: 32upx;
		line-height:76upx;
		margin:12upx auto;
		font-size:36upx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(255,255,255,1);
	}


	.nav-image {
		width:60upx;
		height:60upx;
		// float:right;
		margin-top:12upx;
		border-radius:50%;
	}

	.m-cell::before {
		border-top: 0px solid #ebebe7;
	}

	.m-ad-item:after {
	    content: " ";
	    position: absolute;
	    border-bottom: 1px solid #ebebe7;
	    left: 0;
	    right: 0;
	    bottom: 0;
	    height: 1px;
	    transform-origin: 0 100%;
	    transform: scaleY(0.5);
	    color: #ebebe7;
	}

	.m-ad-item {
		background-color: #fff;
		padding: 24upx 20upx 24upx 30upx;
		position: relative;
		/*border-bottom: 1px solid #d5d5d5;*/
	}

	.tbl::after {
		border-left: 0upx solid #ebebe7;
	}

	.m-ad-l {
		width: 70%;
		display: inline-block;
	}

	.m-ad-i-top {
		font-size: 16px;
		line-height: 20px;
	}

	.m-ad-i-top text {
		margin-right: 20upx;
	}

	.m-ad-i-bot {
		font-size: 14px;
		color: #888;
		line-height: 20px;
		margin-top: 10upx;
	}


	.m-ad-icon {
		font-size: 12px;
		padding: 4upx 8upx;
		background-color: $default-skin-bg;
		color: #fff;
		border-radius: 8upx;
		margin-right: 8upx;
		text-align: center;
	}

	.m-ad-edit {
		position: absolute;
		right: 20upx;
		top: 50%;
		width: 80upx;
		height: 100upx;
		margin-top: -50upx;
		padding-left: 40upx;
	}

	.m-ad-edit label {
		width: 40upx;
		height: 50upx;
		line-height: 50upx;
		font-size: 35upx;
		display: block;
		vertical-align: middle;
		text-align: center;
		color: #888888;
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

	.zc {
		width:50upx;
		height: 80upx;
		line-height: 70upx;
		font-size: 40upx;
		float: right;
		opacity: 0.6;
		padding:20upx;
	}

	.img {
		width:122upx;
		height:122upx;
	}

	.m-info {
		height:50%;
		padding-left:20upx;

	}

	.m-user-index {
		width:100%;
		height:200upx;
		float:right;
		text-align: center;
		line-height:30upx;
	}

	.m-user-left {
		position: relative;
		top:40upx;
		left:78upx;
	}

	/*选择规格遮罩 start*/
	.m-panel-sp {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 4;
		background-color: rgba(0, 0, 0, 0.2)
	}

	.m-panel-sp-content {
		background-color: #fff;
		position: absolute;
		width: 100%;
		bottom: 0;
		box-shadow: 0px -10upx 15upx rgba(0, 0, 0, 0.35);
	}

	.m-product-item {
		padding:20upx 0 20upx 0;
	}

	.m-product-info {
		width:440upx;
	}

	.u-cart-num {
		position: absolute;
		bottom: 20upx;
		right: 20upx;
		z-index: 2;
	}

	.m-seach-input {
		width:80%;
		height:68upx;
		background:rgba(255,255,255,1);
		border-radius:10upx;
		margin:0 21upx;
		float:left;
	}

	.m-seach-image {
		width:50upx;
		height:100%;
		line-height:76upx;
		float:left;
	}

	.m-seach-input image {
		width:26upx;
		height:26upx;
		// float:left;
		padding-left:17upx;
	}

	.m-seach-input input {
		height:100%;
		padding-left:20upx;
		font-size:24upx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(17,17,17,1);
		border: 0;
	}

	.m-seach-text {
		width:10%;
		height:68upx;
		float:left;
		font-size:36upx;
		font-family:PingFang SC;
		font-weight:bold;
		color:rgba(17,17,17,1);
	}

	.m-mobile {
		font-size:30upx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(17,17,17,1);
	}

	.m-info label {
		font-size:30upx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(102,102,102,1);
	}

	.product-list {
		height:180upx;
		background:rgba(255,255,255,1);
		padding:36upx 20upx;
		margin-top:17upx;
	}

	.product-list-item {
		// padding:20upx;
	}


	.product-item-image {
		width:180upx;
		height:180upx;
		float:left;
	}
	.product-item-image img {
		width:100%;
		height:100%;

	}

	.product-item-details {
		width:65%;
		height:140upx;
		padding:20upx;
		float:left;
	}

	.product-item-name {
		width:100%;
		height:80upx;
		font-size:24upx;
		float:left;
		font-family:PingFang SC;
		font-weight:bold;
		color:rgba(17,17,17,1);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.product-item-info {
		width:40%;
		height:80upx;
		float:left;
	}

	.product-item-info view {
		font-size:24upx;
		font-family:PingFang SC;
		font-weight:bold;
		color:rgba(102,102,102,1);
	}



</style>

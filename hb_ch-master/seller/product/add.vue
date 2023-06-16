<template>
	<view class="page">
		        <view class="sstouch-inp-con">
		            <view class="form-box">
		                <view class="form-item">
		                    <view class="h4">{{__('商品分类')}}:</view>
		                    <view class="input-box" style="font-size:26upx;" @click="show()">
								<input class="inp" type="text" :value="commodity_name" disabled="disabled" id="g_name" autocomplete="off"
		                                                    readonly="readonly">
		                        <text class="input-del"></text>
		                    </view>
		                </view>
		                <view class="form-item">
		                    <view class="h4">{{__('商品名称')}}:</view>
		                    <view class="input-box">
								<input class="inp" type="text"  :value="product_name" id="g_name" autocomplete="off" readonly="readonly" @input="onInputProductname"/>
		                        <text class="input-del"></text>
		                    </view>
		                </view>
		                <view class="form-item">
		                    <view class="h4">{{__('零售价')}}:</view>
		                    <view class="input-box">
								<input class="inp" type="text"  :value="item_unit_price" @input="onInputUnitprice"/>
		                        <text class="input-del"></text>
		                    </view>
		                </view>
		                <view class="form-item">
		                    <view class="h4">{{__('市场价')}}:</view>
		                    <view class="input-box">
								<input class="inp" type="text"  :value="item_market_price" @input="onInputMarketprice"/>
		                        <text class="input-del"></text>
		                    </view>
		                </view>
						<view class="form-item">
						    <view class="h4" style="border-bottom: solid #EEE 0upx;">{{__('商品主图')}}:</view>
						    <view style="margin-left:160upx;">
								<view class="m-upImg">
									<view class="m-upImg-item" style="width:64upx;height:64upx;" v-if="(item_image_default)" >
										<image lazy-load mode="aspectFit"  :src="(item_image_default)" @click="ImgTapDefault"></image>
									</view>
									<view v-else style="width:64upx;height:64upx;" class="m-upImg-item upSelect"  @click.stop="upImgsDefault">
										<label  class="iconfont icon-xiangji"></label>
									</view>
								</view>
						        <text class="input-del"></text>
						    </view>
						</view>
						
						<view class="form-item">
						    <view class="h4" style="border-bottom: solid #EEE 0upx;">{{__('商品副图')}}:</view>
						    <view style="margin-left:160upx;">
								<view class="m-upImg">
									<view class="m-upImg-item" style="width:64upx;height:64upx;" v-for="(imglist, ii) in data_info.comment_image"   :key="ii">
										<image lazy-load mode="aspectFit"  :src="(imglist)" @click="ImgTap"></image>
									</view>
									<view v-if="true" style="width:64upx;height:64upx;" class="m-upImg-item upSelect"  @click.stop="upImgs">
										<label  class="iconfont icon-xiangji"></label>
									</view>
								</view>
						        <text class="input-del"></text>
						    </view>
						</view>

		                <view class="form-item">
		                    <view class="h4">{{__('商品库存')}}:</view>
		                    <view class="input-box">
								<input class="inp" type="text"  :value="item_quantity" @input="onInputQuantity"/>
		                        <text class="input-del"></text>
		                    </view>
		                </view>
		                <view class="form-item">
		                    <view class="h4">{{__('属性编号')}}:</view>
		                    <view class="input-box">
								<input class="inp" type="text"  :value="item_number" @input="onInputNumber"/>
		                        <text class="input-del"></text>
		                    </view>
		                </view>
		                <view class="form-item">
		                    <view class="h4">
		                        <text class="i" style="color: red;">*</text>
		                        {{__('运费设置')}}:
		                    </view>
		                    <view class="input-box" >
								<block v-if="(transports.length > 0)">
								  <picker mode="selector" @change="transportChange" :value="id" :range="transports" range-key="transport_type_name" >
									<label style="padding:0 40upx;">{{transports[id].transport_type_name}}</label>
								  </picker>
								</block>
		                    </view>
		                </view>
		                <view class="form-item">
		                    <view class="h4">
		                        <text class="i" style="color: red;">*</text>
		                         {{__('店铺分类')}}:
		                    </view>
		                    <view class="input-box">
								<block v-if="(product_categorys.length > 0)">
									<picker mode="selector" @change="categorysChange" :value="index" :range="product_categorys" range-key="store_product_cat_name" >
										<label>{{product_categorys[index].store_product_cat_name}}</label>
									</picker>
								</block>
		                    </view>
		                </view>
		                <!-- <view class="form-item">
		                    <view class="h4">商品描述:</view>
		                    <view class="input-box">
								<input class="inp" type="text"  :value="product_detail" @input="onInputProductdetail"/>
		                        <text class="input-del"></text>
		                    </view>
		                </view> -->
		                <view class="form-item" style="border-bottom: solid #EEE 2px;">
		                    <view class="h4">{{__('上下架')}}:</view>
		                    <view class="input-box" >
		                    	<switch style="padding:16upx" @change="switchChange" />
		                    </view>
		                </view>
		            </view>
		            <view class="error-tips"></view>
		            <view class="form-btn ok" @click="release">
		                <view class="btn" >{{__('发布商品')}}</view>
		            </view>
		        </view>

		   <!-- 商品分类 -->
			<uni-drawer :visible="rightDrawerVisible" mode="right" @close="closeDrawer()" >
				<view class="m-tab">
						<view class="m-navbar">
							<view :class="['m-navbar-item', tapindex==1?'m-navbar-item-on':'']" @click="onecategorys">
								{{__('一级分类')}}
							</view>
							<view :class="['m-navbar-item', tapindex==2?'m-navbar-item-on':'']">
								{{__('二级分类')}}
							</view>
							<view :class="['m-navbar-item', tapindex==3?'m-navbar-item-on':'']">
								{{__('三级分类')}}
							</view>
						</view>
				</view>
				<scroll-view scroll-y="true" style="height: 100%">
				<view class="m-cells" style="padding:20upx 20upx;" v-for="(category,ii) in categorys" :key="ii">
					<view class="m-cell m-cell-access m-info-sp" :data-category_id="category.category_id" :data-category_name="category.category_name"  @click="getCate">
						<view class="m-cell-bd">
							<view  class="m-order-title">
								<label class="m-ber-n">{{category.category_name}}</label>
								<label>
									<image  class="nav-image" lazy-load src="/static/images/nav.png" mode="scaleToFill" />
								</label>
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

	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
		data() {
			return {
				data_info:{ order: {item:{}}, comment_image: [] },
				transports:[],
				id:0,
				product_categorys:[],
				index:0,
				rightDrawerVisible: false,
				rightDrawerVehicle: false,
				tapindex: 1,
				categorys:[],
				category_id:0,
				deep:0,
				onecategory:'',
				twocategory:'',
				threecategory:'',
				commodity_name:'',
				product_name:'',
				item_unit_price:'',
				item_market_price:'',
				item_quantity:'',
				item_number:'',
				product_category_id:0,
				transport_type_id:0,
				product_detail:'',
				item_enable:1001,
				parent_id:0,
				img:'',
				item_image_default: '',
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
			uniDrawer,
			uniList,
			uniListItem

		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			var that = this;
			uni.setNavigationBarTitle({
				title:this.__('发布商品')
			});
			that.setData({
				options:options,
				order_id:options.on,
			})

			that.getfreightArrangement()
			that.getProductCategory()
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			getfreightArrangement: function(){
				var that = this;
				var	params = {

					};
					that.$.request({
						url: that.Config.URL.seller.Store_TransportType,
						data: params,
						success: function(data, status, msg, code) {
							if(status ==  200){
								that.setData({
									transports:data.items
								})
							}
						}
					})
			},

			getProductCategory: function(){
				var that = this;
				var	params = {

					};
					that.$.request({
						url: that.Config.URL.seller.Store_ProductCategory,
						data: params,
						success: function(data, status, msg, code) {
							if(status ==  200){
								that.setData({
									product_categorys:data.items
								})
							}
						}
					})
			},

			transportChange: function(e){
				var that = this;
				var index = e.detail.value
				this.setData({
					id:index,
					transport_type_id:that.transports[index].transport_type_id
				})
			},

			categorysChange: function(e){
				var that = this;
				var index = e.detail.value
				this.setData({
					index:e.detail.value,
					product_category_id:that.product_categorys[index].store_product_cat_id
				})

			},

			show: function() {
				var that = this;
				that.setData({
					category_id:0
				})
				that.getcategorys()

				this.rightDrawerVisible = true;
			},

			onInputProductname: function(e){
				this.setData({product_name:e.detail.value})
			},

			onInputUnitprice: function(e){
				this.setData({item_unit_price:e.detail.value})
			},

			onInputMarketprice: function(e){
				this.setData({item_market_price:e.detail.value})
			},

			onInputQuantity: function(e){
				this.setData({item_quantity:e.detail.value})
			},

			onInputNumber: function(e){
				this.setData({item_number:e.detail.value})
			},

			onInputProductdetail: function(e){
				this.setData({product_detail:e.detail.value})
			},


			getCate: function(e){
				var that = this;
					switch (that.tapindex) {
						case 1:
							that.setData({
								deep:that.tapindex,
								category_id:e.currentTarget.dataset.category_id,
								onecategory:e.currentTarget.dataset.category_name,
								tapindex:2
							})
							that.getcategorys()
							break;
						case 2:
							that.setData({
								deep:that.tapindex,
								category_id:e.currentTarget.dataset.category_id,
								twocategory:e.currentTarget.dataset.category_name,
								tapindex:3
							})
							that.getcategorys()
							break;
						case 3:
							that.setData({
								threecategory:e.currentTarget.dataset.category_name,
								category_id:e.currentTarget.dataset.category_id,
								tapindex:1,
								deep:1,
								rightDrawerVisible:false
							})
							that.commodity_name = that.onecategory + '>' + that.twocategory + '>' + that.threecategory
							break;
					}



			},

			onecategorys: function(){
				this.setData({
					deep:1,
					category_id:0,
					tapindex:1
				})
				this.getcategorys()
			},

			release: function() {
				var that = this;
				if(that.$.isNull(this.category_id)){
					 that.$.alert(that.__("请选择商品分类"));
					 return;
				}
				if(that.$.isNull(this.product_name)){
					 that.$.alert(that.__("请填写商品名称"))
					 return;
				}
				if(that.$.isNull(this.item_unit_price)){
					 that.$.alert(that.__("请填写商品市场价"))
					 return;
				}
				if(that.$.isNull(this.item_market_price)){
					 that.$.alert(that.__("请填写商品销售价"))
					 return;
				}
				if(that.$.isNull(this.item_quantity)){
					 that.$.alert(that.__("请填写商品数量"))
					 return;
				}
				// if(that.$.isNull(this.item_number)){
				// 	 that.$.alert("请填写商品属性编号")
				// 	 return;
				// }
				// if(that.$.isNull(this.product_detail)){
				// 	 that.$.alert("请填写商品描述")
				// 	 return;
				// }

				that.addProduct()
			},

			addProduct: function() {
				var that = this;
				var item = [
							{
								item_number:that.item_number,
								item_unit_price:that.item_unit_price,
								item_market_price:that.item_market_price,
								item_quantity:that.item_quantity,
								item_enable:that.item_enable,
								item_enable:1001,
								item_is_default:0,
								item_freetime:'',
								item_title:'',
								item_barcode:'',
								item_id:'',
								item_spec:{},
								item_unit_points:'',
								item_cost_price:'',
								item_platform_price:'',
								item_fx_commission:'',
							}
						];


				var	params = {
						product_name:that.product_name,
						product_detail:that.product_detail,
						transport_type_id:that.transport_type_id ? that.transport_type_id : that.transports[0].transport_type_id,
						product_category_id:that.product_category_id,
						category_id:that.category_id,
						kind_id:1201,
						items:JSON.stringify(item)

					};

					if(that.data_info.comment_image.length >= 1){
						var img = []
						for(var t in that.data_info.comment_image){
							img.push(that.data_info.comment_image[t])
						}
				
					}
					
					params.image = {
						0:{
							item_image_default:that.item_image_default,
							item_image_other:that.data_info.comment_image,
						}
					}


				that.$.request({
					url: that.Config.URL.seller.add_product,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==  200){
							that.$.alert(that.__('商品添加成功'))
							setTimeout(function() {
								that.$.navigateTo({
									url:'/seller/product/lists'
								})
							}, 1500);
						}
					}
				})
			},



			getcategorys: function(e){
				var that = this;
				var	params = {
						deep:that.deep
					};

				if(that.category_id !== 0){
					params.category_id= that.category_id

				}
				that.$.request({
					url: that.Config.URL.product.category,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==  200){
							that.setData({
								categorys:data.items
							})
						}
					}
				})
			},

			switchChange: function(e){
				//console.log('switch1 发生 change 事件，携带值为', e.target.value)
				var that = this;
				if(e.target.value){
					that.setData({
						item_enable:1001
					})
				}else{
					that.setData({
						item_enable:1002
					})
				}
			},
			ImgTap: function(e) {
				var that = this,
					urls = [];

				for (var i in this.data_info.comment_image) {
					urls.push(this.data_info.comment_image[i]);
				}
				var s = e.target.dataset.src;

				that.$.previewImage({ current: s, urls: urls });
			},
			
			ImgTapDefault: function(e) {
				var that = this,
					urls = [];

				
				urls.push(this.item_image_default);
				
				var s = e.target.dataset.src;

				that.$.previewImage({ current: s, urls: urls });
			},

			delImg: function(e) {
				//console.info(e);
				var dataInfo = this.data_info;
				var that = this;
				that.$.confirm(
				that.__('是否放弃上传本张图片?')
					,
					function(n) {
						if (n.confirm) {
							var i = [];
							for (let s = 0; s < dataInfo.comment_image.length; s++) {
								if (s != e.target.dataset.index) {
									var o = dataInfo.comment_image[s];
									i.push(o);
								}
							}
							dataInfo.comment_image = i;

							that.setData({ data_info: dataInfo });
						}
					},
					!0
				);
			},
			
			upImgsDefault: function(e) {
				var  that = this;
			


				that.$.showLoading();
					that.$.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						success: function(n) {
							that.$.showLoading();
							var r = n.tempFilePaths;
							that.$.uploadFile({
								url: that.Config.URL.upload,
								method: 'POST',
								filePath: r[0],
								name: 'upfile',
								//header: { 'content-type': 'multipart/form-data' },
								success: function(n) {
									that.$.hideLoading();
									var up_res = that.$.parseJSON(n.data);

									var s = up_res.data.url;
									
									that.setData({ item_image_default: s });

								},
								fail: function(e) {
									that.$.hideLoading();
								},
								complete: function(e) {
									that.$.hideLoading();
								}
							});
						},
						fail: function(e) {
							that.$.hideLoading();
						},
						complete: function(e) {
							that.$.hideLoading();
						}
					});
			},

			upImgs: function(e) {
				var that = this;
				var orderId = e.currentTarget.dataset.order_id
				var  dataInfo = this.data_info;
				if (dataInfo.comment_image && dataInfo.comment_image.length == 5) {
					that.$.alert(that.__('最多上传5张图片！'));
					return;
				}


				that.$.showLoading();
					that.$.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						success: function(n) {
							that.$.showLoading();
							var r = n.tempFilePaths;
							that.$.uploadFile({
								url: that.Config.URL.upload,
								method: 'POST',
								filePath: r[0],
								name: 'upfile',
								//header: { 'content-type': 'multipart/form-data' },
								success: function(n) {
									that.$.hideLoading();
									var up_res = that.$.parseJSON(n.data);

									var s = up_res.data.url;
									dataInfo.comment_image.push(s);
									that.setData({ data_info: dataInfo});

								},
								fail: function(e) {
									that.$.hideLoading();
								},
								complete: function(e) {
									that.$.hideLoading();
								}
							});
						},
						fail: function(e) {
							that.$.hideLoading();
						},
						complete: function(e) {
							that.$.hideLoading();
						}
					});
			},

			bindChange: function(e){

			},
		}
	}
</script>

<style lang="scss">
	@import "../../styles/base.scss";
	@import "../../styles/sstouch_member.scss";
	@import "../../styles/sstouch_common.scss";
	@import "../../styles/_variables";

	.m-upImg-item {
		width: 60upx;
		height: 60upx;
		// display: inline-block;
		vertical-align: middle;
		position: relative;
		font-size:left;
	}

	.m-upImg {
		box-sizing: border-box;
		padding: 20upx;
		background-color: #fff;
		display: inline-block;
		// height:60upx;
	}

	.m-upImg-item image {
		width: 100%;
		height: 100%;
	}

	.u-del-item {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 40upx;
		background-color: rgba(0, 0, 0, 0.5);
		text-align: center;
		line-height: 40upx;
		color: #fff;
		z-index: 5;
	}
	.u-del-item label {
		font-size: 28upx;
	}
	.upSelect {
		width: 60upx;
		height: 60upx;
		background-color: #eee;
		text-align: center;
		line-height: 60upx;
	}
	.upSelect label {
		font-size: 40upx;
	}
	.m-submitComment {
		position: fixed;
		height: 100upx;
		width: 100%;
		z-index: 999;
		left: 0;
		bottom: 0;
		background:rgba(51,51,51,1);
		box-shadow:0px 0px 4px 0px rgba(0,0,0,0.1);
	}
	.m-subBtn {
		padding: 0 35%;
		width:100%;
		height: 100%;
		background:rgba(51,51,51,1);
		color:rgba(255,255,255,1);
		font-size: 28upx;
		line-height: 100upx;

	}

	.sstouch-inp-con uni-view uni-view {
		display: inline-block;
		padding:0 20upx;
		margin-left:0;
	}

	.sstouch-inp-con {
		background:#FFF;
	}

	.m-cell::before {
		border-top: 0px solid #ebebe7;
	}


	.form-item {
		width:100%;
	}

	.input-box uni-label {
		font-size:26upx !important;
	}

	.uni-list-cell::after {
		height:0;
	}

	.uni-drawer__content {
		width:100%;
	}

	.m-tab {
		width: 100%;
	}

	.m-navbar-item {
		padding: 20upx 0;
		font-size: 24upx;
	}

	.m-orderlist {
		padding-top: 170upx;
		position: absolute;
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

	.u-tuan-label {
		padding: 5upx;
		background-color: $default-skin-bg;
		border-radius: 4upx;
		font-size: 24upx;
		color:#fff;
		margin-right: 5upx;
	}

	.nav-image {
		width:12upx;
		height:24upx;
		float:right;
		padding-top:12upx;
	}

	.input-box {
		// width: 50%;
		font-size:26upx;
		padding-left:20upx;
	}

	.u-input {
		width: 50%;
		height:90upx;;
		border: 0;  // 去除未选中状态边框
		outline: none; // 去除选中状态边框
		background-color: rgba(0, 0, 0, 0);// 透明背景
	}



</style>

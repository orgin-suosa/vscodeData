<template>
	<view class="page">
		<scroll-view v-if="(product_uniqid.length>0)" :scroll-top="scrollTop" scroll-y="true" class="m-orderlist" @scrolltolower="scrollbottom">
		<view class="m-cells">
			<view class="m-cell ">
				<view class="m-cell-bd">
					<text>{{sprintf(__('商品名称： %s'), product_name)}}</text>
				</view>
			</view>

		</view>
		<view class="sstouch-order-list" >
		    <view class="ul" id="order-list" v-for="(items, i) in product_uniqid"  :key="i">
		        <view class="sstouch-order-item">
		            <view class="sstouch-order-item-con">
		                <view class="goods-block">
		                    <view class="goods-pic">
								<img class="img" :src="product_image" style="border:solid 1px #ccc;padding:1px;"></view>
		                    <view class="goods-info" style="margin:0 0 0 142upx;">
		                        <view class="goods-name">{{product_name}}</view>
								 <view class="goods-type" style="float:left">￥：
									<uni-number-box  style="width:220upx;height:60upx;" :min="0" :max="10000000" :value="items[1]" :id="items[4]"  @change="changeprice($event,i,items[0])" />
								 </view>
								 <view class="goods-type" style="float:right">{{__('库存')}}：
									<uni-number-box  style="width:220upx;height:60upx;" :min="0" :max="10000000" :value="items[4]" :id="items[1]"  @change="changes($event,i,items[0])" /></view>
		                    </view>
		                </view>
		            </view>
		        </view>
		    </view>
		</view>


		<button class="u-btn u-btn-default" @click="saveQuantity" style="margin-top:50upx;">{{__('确定')}}</button>
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

	import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue'
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import uniBadge from '@/components/uni-badge.vue';

	export default {
		data()  {
			return {
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
				index:0,
				product_id:0,
				product_uniqid:[],
				product_name:'',
				product_image:'',
				items:[],
				num:0,

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
			this.setData({
				product_id:options.id,
				productlist: [],
				type: options.type ? options.type : 0,
				product_state_id:options.type ? options.type : 1001,
			});

			that.getProductlist()


		},

		onUnload: function() {
			//移除通知
			var that = this



		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),

			getProductlist: function() {
				var that = this;
				var params = {
					product_id: that.product_id
				};

				that.$.request({
					url: this.Config.URL.product.item,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							//console.log(data)
							that.setData({
								product_name: data.item_row.product_name,
								product_image: data.item_row.product_image
							})

							for(var i in data.item_row.product_uniqid){
								that.product_uniqid.push(data.item_row.product_uniqid[i])
							}

						} else {

						}
					}
				});
			},



			saveQuantity: function(){
				var that = this;

				var params = {
					product_id:that.product_id,
					items:JSON.stringify(that.items)
				}
				that.$.request({
					url: that.Config.URL.seller.edit_quantity,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==  200){
							that.$.alert(that.__('修改成功！'), function() {
								setTimeout(function() {
									that.product_uniqid = []
									that.getProductlist()
								}, 1e3);

								});
						}else{
							that.$.alert(that.__('修改失败'))
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

			changes: function(e,t,v){

				if(this.items[t])
				{
					var price = this.items[t].item_unit_price
					this.items[t] = {
						item_unit_price: price,
						item_quantity: e,
						item_id: v
					}
				}
				else
				{
					this.items[t] = {
						item_unit_price: this.product_uniqid[1],
						item_quantity: e,
						item_id: v
					}

				}
				//console.log(this.items)
			},

			changeprice: function(e,t,v) {

				if(this.items[t])
				{
					var quantity = this.items[t].item_quantity
					this.items[t] = {
						item_unit_price: e,
						item_quantity: quantity,
						item_id: v
					}
				}
				else
				{
					this.items[t] = {
						item_unit_price: e,
						item_quantity: this.product_uniqid[4],
						item_id: v
					}
				}

				//console.log(this.items)
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
		position: absolute;
		margin-top:140upx;
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
		// margin-top:100upx;
	}


	.m-user-info image {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		border: 1px solid #fff;
		vertical-align: middle;
		box-shadow: 0px 2upx 15upx rgba(0, 0, 0, 0.35);

		position: absolute;
		left:260upx;
		top:30upx;

	}

	.m-user-info .m-name {
		position: absolute;
		top:40upx;

		text-align: center;
		width: 200upx;

	}

	.m-orderlist {
		position: absolute;
		top: calc(var(--status-bar-height));
		// padding-top: 320upx;
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
		padding-top:300upx;
	}

	.uni-numbox__minus, .uni-numbox__plus {
		width:30upx;
	}

	.uni-numbox {
		height:60upx;
	}

	/*底部按钮 start*/
	.m-footer-btn {
		height: 100upx;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		text-align: center;
		z-index: 3
	}

	.m-footer-btn-list {
		width: 50%;
		height: 100%;
		position: relative;
		float: left;
		display: flex;
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
		width: 25%;
		height: 100%;
		float: left;
		background-color: #1A1A1A;
		color: #fff;
		line-height: 100upx;
		font-size: 32upx;
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
			margin-top:240upx;
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

	.m-cells {
		font-size: 28upx;
	}

	.m-cell {
		padding:20upx;
	}

	.img {
		width:122upx;
		height:122upx;
	}


</style>

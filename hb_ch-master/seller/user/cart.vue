<template>
	<view class="page">
		<status-bar></status-bar>
		<block v-if="(isdata)">
			<block v-if="chain_id && !isVirtual && false" >
				<view class="distribution" v-if="(true)">
					<view style="width:30%">{{__('配送方式')}}</view>
					<view class="check" style="display:flex;align-items: center;width:70%;justify-content: space-around">
						<view style="display:flex;align-items: center;" @click="express">
							<view v-if="(selfpickFlag)" class="border" style="border-radius:50%;width:26upx;height:26upx;border:1px solid #db384c">
							</view>
							<image v-if="(addressFlag)" style="width:32upx;height:32upx;border-radius:50%" src="/static/images/ziti.png"></image>
							<view style="margin-left:10upx">{{__('快递配送')}}</view>
						</view>
						<view style="display:flex;align-items: center" @click="draw" :data-store_id="store_id">
							<view v-if="(addressFlag)" class="border" style="border-radius:50%;width:26upx;height:26upx;border:1px solid #db384c">
							</view>
							<image v-if="(selfpickFlag)" style="width:32upx;height:32upx;border-radius:50%" src="/static/images/ziti.png"></image>
							<view style="margin-left:10upx">{{__('门店自提')}}</view>
						</view>
					</view>
				</view>

				<!-- 自提 -->
				<block v-if="(selfpickFlag)">
					<view v-if="(selfpickFlag)" class="m-cells" style="background:#fff;font-size:28upx;padding:20upx 30upx">
						<picker mode="date" :value="date" :start="stdate" :end="eddate" @change="bindDateChange">
							<view class="picker" style="display:flex;justify-content: space-between">
								<view>{{__('选择自提日期:')}}</view>
								<view style="color:#717171;padding-right:40upx">{{date||starttime}}</view>
							</view>
						</picker>
					</view>

					<navigator v-if="(selfpickFlag)" :url="'/chain/chain/list?issub=1&ud_id=' + (ud_id) + '&store_id=' + (store_id) + '&item_id=' + (item_ids) + '&spid=' + (spinfo)"
					 class="m-addres-info m-cell-access" style="margin-top:20upx">
						<label style="font-size:28upx;margin-left:20upx">{{__('请选择自提门店:')}}</label>
						<view class="nearbylist-item" :data-address="(ChainInfo.chain_address)" :data-name="(ChainInfo.chain_name)"
						 :data-lat="(ChainInfo.chain_lat)" :data-lng="(ChainInfo.chain_lng)">
							<view class="item-info">
								<label class="item-name">{{ChainInfo.chain_name}}</label>
								<label v-if="(ChainInfo.chain_opening_hours&&ChainInfo.chain_close_hours)" style="font-size:24upx;color:#717171;margin-left:20upx;">
									({{ChainInfo.chain_opening_hours||""}}~{{ChainInfo.chain_close_hours||""}})
								</label>
								<label class="item-distance">{{ChainInfo.distance}}</label>
								<view class="item-phone">{{__('商家电话：')}}{{ChainInfo.chain_mobile}}</view>
								<view class="item-address">
									<label class="iconfont icon-shouhuodizhi " style="font-size:40upx;margin-right:15upx;"></label>
									<label>{{ChainInfo.chain_address}}</label>
								</view>
							</view>
						</view>
					</navigator>
					<view v-if="(selfpickFlag && false)" class="m-cells m-cells-form" style="margin-top:20upx;z-index:1">
						<view class="m-cell">
							<view class="m-cell-hd" style="width:20%">
								<label class="u-label">{{__('提货人')}}</label>
							</view>
							<view class="m-cell-bd">
								<input class="u-input" maxlength="20" type="text" :value="(showud_name)" :placeholder="__('请输入提货人姓名')" @input="inputud_name" />
							</view>
							<div v-if="(ud_name=='')" class="m-cell-ft">
								<uni-icons class="m-icon-warn" type="warn"></uni-icons>
							</div>
						</view>

						<view v-if="(selfpickFlag)" class="m-cell">
							<view class="m-cell-hd" style="width:20%">
								<label for="" class="u-label">{{__('手机号码')}}</label>
							</view>
							<view class="m-cell-bd">
								<input class="u-input" type="number" :value="(showphone)" :placeholder="__('请输入手机号码')" @input="inputphone" />
							</view>
							<div v-if="(!isre || phone=='')" class="m-cell-ft">
								<uni-icons class="m-icon-warn" type="warn"></uni-icons>
							</div>
						</view>
					</view>
				</block>
				<!-- 自提 -->

			</block>

			<view class="m-cells m-cells-form">
				<view class="m-cell">
					<view class="m-cell-hd" style="width: 140upx;"><label class="u-label">{{__('店员')}}</label></view>
					<view class="m-cell-bd">
						<input class="u-input" type="text" :value="Clerk_name" disabled="true" :placeholder="__('请选择店员')" @click="obtainUserInfo" />
					</view>
					<div v-if="(Clerk_name=='')" class="m-cell-ft">
						<uni-icons class="m-icon-warn" type="warn"></uni-icons>
					</div>
				</view>
			</view>
			<view class="m-cells m-cells-form" v-if="(false)">
				<view class="m-cell">
					<view class="m-cell-hd"><label class="u-label">{{__('预约人')}}</label></view>
					<view class="m-cell-bd">
						<input class="u-input" readonly="readonly" disabled="disabled" type="text" :value="(showud_name||'')" :placeholder="__('请输入预约人姓名')" @input="inputud_name" />
					</view>
					<div v-if="(ud_name=='')" class="m-cell-ft">
						<uni-icons class="m-icon-warn" type="warn"></uni-icons>
					</div>
				</view>
				<view class="m-cell">
					<view class="m-cell-hd"><label for="" class="u-label">{{__('电话号码')}}</label></view>
					<view class="m-cell-bd">
						<input class="u-input" type="number" :value="(showphone ||'')" :placeholder="__('请输入电话号码')" @input="inputphone" />
					</view>
					<div v-if="(!isre || phone=='')" class="m-cell-ft">
						<uni-icons class="m-icon-warn" type="warn"></uni-icons>
					</div>
				</view>
			</view>
			<view class="m-product-all">
				<view class="m-product-list">
					<block v-for="(store_items, store_index) in submitinfo.items"  :key="store_index">
						<view class="m-store" :data-id="(store_items.id)">
							<view class="m-store-c">
								<label class="m-store-info">
									<label class="iconfont icon-store"> {{store_items.store_name}}</label>
								</label>
							</view>
						</view>
						<block v-if="(order_items_material.length > 0)">
							<view class="m-cells" style="background-color: #f5f5f5;">
								<view>
									<view class="m-cell" style="padding:10upx 30upx;">
										<view class="m-cell-bd">
											<text>{{__('商品明细')}}</text>
										</view>
									</view>
								</view>
							</view>
							<view v-for="(item, itemindex) in order_items_material"  :key="itemindex" class="m-product-item">
								<view :class="{'m-item-c':1, del:(item.cart_id==T_Id)}" @touchstart="removestart" @touchmove="removeload"
							 @touchend="removeend" :data-id="(item.cart_id)"   @longpress.stop="pressDelCart">
									<navigator :url="'/pages/product/detail?pid=' + (item.item_id)" class="m-product-img">
										<image :src="(item.product_image)" />
									</navigator>
									<view class="m-product-info">
										<navigator :url="'/pages/product/detail?pid=' + (item.item_id)">
											<view class="m-product-name">
												<label v-if="(item.show_typename)" class="tag tag-orange">{{item.show_typename}}</label>
												<label style="-webkit-line-clamp:1">{{item.product_name}}</label>
												<label class="m-min-name" style="overflow:hiddentext-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">
													{{item.item_spec_name?item.item_spec_name:""}}
												</label>
											</view>
											<view class="m-product-price">
												<block v-if="item.item_sale_price">
													<label>{{__('￥')}}</label>{{item.item_sale_price}}
												</block>

												<label class="pre-info-price" v-if="(item.discount_sale_money)">
													-{{__('￥')}}{{item.discount_sale_money}}
												</label>

												<block v-if="item.item_unit_points">
													<label class="pre-info-price" style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{item.item_unit_points}}</label><label >{{__('积分')}}</label>
												</block>

												<block v-if="item.item_unit_sp">
													<label class="pre-info-price" style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{item.item_unit_sp}}</label><label >{{__('众宝')}}</label>
												</block>

												<text style="float: right;padding-right: 50upx;">x{{item.cart_quantity}}</text>
											</view>

										</navigator>

									</view>
									<view class="u-del" :data-id="(item.item_id)" style="float:left" @click.stop.prevent="delcart">
										{{__('删除')}}
									</view>
								</view>
								<!-- 模板调用单品加价购、赠品、满减 -->
								<!--
							pulse_gift_cart
							pulse_bargains
							pulse_bargains_cart
							pulse_reduction
							-->
								<!-- pulse_gift_cart -->
								<view v-if="(item.pulse_gift_cart.length > 0)" v-for="(pluse, giftindex) in item.pulse_gift_cart"
								 :key="giftindex" class="m-item-act" :data-id="(pluse.cart_id)">
									<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="m-product-img m-act-img">
										<image :src="(pluse.product_image)" />
									</navigator>
									<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="act-item-name" style="height:100upx;line-height:100upx;font-size: 28upx;">
										<label>【{{__('赠品')}}】{{pluse.product_item_name}}</label>
										<text>x{{pluse.num}}</text>
									</navigator>
								</view>

								<!-- pulse_reduction -->
								<block v-if="(item.pulse_reduction.length > 0)" v-for="(pluse, reductionindex) in item.pulse_reduction"  :key="reductionindex">
									<view v-if="(pluse.reduceMoney > 0)" class="m-item-act">
										<view class="m-product-img  icon-activity icon-activity-reduction">
										</view>
										<view class="act-item-name" style="height:160upx;line-height:160upx;font-size: 28upx;">
											<label>【{{sprintf(__('满减 -￥%s'), mf(pluse.reduceMoney))}}】</label>
											<text>x{{pluse.times}}</text>
											<!--{{pluse.actName}}-->
										</view>
									</view>
								</block>


								<!-- pulse_bargains_cart -->
								<view v-if="(item.pulse_bargains_cart.length > 0)" v-for="(pluse, bargainsindex) in item.pulse_bargains_cart"   :key="bargainsindex" class="m-item-act" :data-id="(pluse.cart_id)">
									<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="m-product-img m-act-img">
										<image :src="(pluse.product_image)" />
									</navigator>
									<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="act-item-name" style="height:100upx;line-height:100upx;font-size: 28upx;width:400upx;">
										<label>【{{__('加价购')}}】{{pluse.product_item_name}}</label>
										<text>x{{pluse.num}}</text>
									</navigator>
								</view>
							</view>
						</block>

						<block v-if="(order_items_fictitious.length > 0)">
							<view class="m-cells" style="background-color: #f5f5f5;">
								<view>
									<view class="m-cell" style="padding:10upx 30upx;">
										<view class="m-cell-bd">
											<text>{{__('项目明细')}}</text>
										</view>
									</view>
								</view>
							</view>
							<view v-for="(item, itemindexs) in order_items_fictitious"  :key="itemindexs" class="m-product-item">
								<view :class="'m-item-c ' + ((item.cart_id==0)?'del':'')"  :data-id="(item.cart_id)">
									<navigator :url="'/pages/product/detail?pid=' + (item.item_id)" class="m-product-img">
										<image :src="(item.product_image)" />
									</navigator>
									<view class="m-product-info">
										<navigator :url="'/pages/product/detail?pid=' + (item.item_id)">
											<view class="m-product-name">
												<label v-if="(item.show_typename)" class="tag tag-orange">{{item.show_typename}}</label>
												<label style="-webkit-line-clamp:1">{{item.product_name}}</label>
												<label class="m-min-name" style="overflow:hiddentext-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:1">
													{{item.item_spec_name?item.item_spec_name:""}}
												</label>
											</view>
											<view class="m-product-price">
												<block v-if="item.item_sale_price">
													<label>{{__('￥')}}</label>{{item.item_sale_price}}
												</block>

												<label class="pre-info-price" v-if="(item.discount_sale_money)">
													-{{__('￥')}}{{item.discount_sale_money}}
												</label>

												<block v-if="item.item_unit_points">
													<label class="pre-info-price" style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{item.item_unit_points}}</label><label >{{__('积分')}}</label>
												</block>

												<block v-if="item.item_unit_sp">
													<label class="pre-info-price" style="margin: 0upx 10upx;">+</label><label style="font-size:32upx">{{item.item_unit_sp}}</label><label >{{__('众宝')}}</label>
												</block>

												<text style="float: right;padding-right: 50upx;">x{{item.cart_quantity}}</text>
											</view>

										</navigator>

									</view>
									<view class="u-del" :data-id="(item.item_id)" style="float:left" @click.stop.prevent="delcart">
										{{__('删除')}}
									</view>
								</view>
								<!-- 模板调用单品加价购、赠品、满减 -->
								<!--
							pulse_gift_cart
							pulse_bargains
							pulse_bargains_cart
							pulse_reduction
							-->
								<!-- pulse_gift_cart -->
								<view v-if="(item.pulse_gift_cart.length > 0)" v-for="(pluse, giftindex) in item.pulse_gift_cart"
								 :key="giftindex" class="m-item-act" :data-id="(pluse.cart_id)">
									<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="m-product-img m-act-img">
										<image :src="(pluse.product_image)" />
									</navigator>
									<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="act-item-name" style="height:100upx;line-height:100upx;font-size: 28upx;">
										<label>【{{__('赠品')}}】{{pluse.product_item_name}}</label>
										<text>x{{pluse.num}}</text>
									</navigator>
								</view>

								<!-- pulse_reduction -->
								<block v-if="(item.pulse_reduction.length > 0)" v-for="(pluse, reductionindex) in item.pulse_reduction"  :key="reductionindex">
									<view v-if="(pluse.reduceMoney > 0)" class="m-item-act">
										<view class="m-product-img  icon-activity icon-activity-reduction">
										</view>
										<view class="act-item-name" style="height:160upx;line-height:160upx;font-size: 28upx;">
											<label>【{{sprintf(__('满减 -￥%s'), mf(pluse.reduceMoney))}}】</label>
											<text>x{{pluse.times}}</text>
											<!--{{pluse.actName}}-->
										</view>
									</view>
								</block>


								<!-- pulse_bargains_cart -->
								<view v-if="(item.pulse_bargains_cart.length > 0)" v-for="(pluse, bargainsindex) in item.pulse_bargains_cart"   :key="bargainsindex" class="m-item-act" :data-id="(pluse.cart_id)">
									<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="m-product-img m-act-img">
										<image :src="(pluse.product_image)" />
									</navigator>
									<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="act-item-name" style="height:100upx;line-height:100upx;font-size: 28upx;width:400upx;">
										<label>【{{__('加价购')}}】{{pluse.product_item_name}}</label>
										<text>x{{pluse.num}}</text>
									</navigator>
								</view>
							</view>
						</block>

						<!-- 店铺加价购 pulse_bargains -->
						<view class="m-product-item" v-if="(store_items.bargains.length > 0)" v-for="(pluse, bargainsindex) in store_items.bargains"
						  :key="bargainsindex">
							<view class="m-item-act" v-if="(pluse.length > 0 || pluse.actId)" :data-id="(pluse.cart_id)">
								<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="m-product-img m-act-img">
									<image :src="(pluse.product_image)" />
								</navigator>
								<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="act-item-name" style="height:100upx;line-height:100upx;font-size: 28upx;">
									<label>【{{__('加价购')}}】{{pluse.actName}}</label>
									<text>x{{pluse.num}}</text>
								</navigator>
							</view>
						</view>

						<!-- 店铺赠品 activitys.gift -->
						<view class="m-product-item" v-if="(store_items.activitys.gift.length > 0)" v-for="(pluse, giftindex) in store_items.activitys.gift"
						  :key="giftindex">
							<view class="m-item-act" v-if="(pluse.length > 0 || pluse.actId)" :data-id="(pluse.cart_id)">
								<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="m-product-img m-act-img">
									<image :src="(pluse.product_image)" />
								</navigator>
								<navigator :url="'/pages/product/detail?pid=' + (pluse.item_id)" class="act-item-name" style="height:100upx;line-height:100upx;font-size: 28upx;">
									<label>【{{__('赠品')}}】{{pluse.product_item_name}}</label>
									<text>x{{pluse.num}}</text>
								</navigator>
							</view>
						</view>


						<!-- 店铺满减 activitys.reduction  -->
						<block v-if="(store_items.activitys.reduction.length > 0)" v-for="(pluse, reductionindex) in store_items.activitys.reduction"
						  :key="reductionindex">
							<view class="m-product-item" v-if="(pluse.actId) && (pluse.reduceMoney > 0)">
								<view class="m-item-act" :data-id="(pluse.cart_id)">
									<view class="m-product-img  icon-activity icon-activity-reduction">
									</view>
									<view class="act-item-name" style="height:160upx;line-height:160upx;font-size: 28upx;">
										<label>【{{sprintf(__('满减 -￥%s'), mf(pluse.reduceMoney))}}】</label>
										<text>x{{pluse.times}}</text>
										<!--{{pluse.actName}}-->
									</view>
								</view>
							</view>
						</block>

						<block v-if="(false)">

							<view class="datetime" v-if="(product_service_date_flag)" style="background:#fff;border-top:1px solid #d9d9d9;border-bottom:1px solid #d9d9d9;margin-top:20upx;padding:20upx 20upx;display:flex;font-size:30upx">
								<view class="section" style="width:60%">
									<picker mode="date" :value="(date)" :start="(stdate)" :end="(eddate)" @change="bindDateChange">
										<view class="picker">
											{{__('选择日期:')}} {{date}}
										</view>
									</picker>
								</view>
								<view class="section" style="width:40%">
									<picker mode="time" :value="(time)" :start="(st)" :end="(et)" @change="bindTimeChange">
										<view class="picker">
											{{__('选择时间:')}} {{time}}
										</view>
									</picker>
								</view>
							</view>

							<!--地图-->
							<navigator :url="'/chain/chain/list?issub=1&ud_id=' + ud_id + '&item_id=' + item_id + '&spid=' + spinfo + '&store_id=' + (store_id)" class="m-addres-info m-cell-access" style="margin-top:20upx" v-if="(chainFlag)">
								<label style="font-size:28upx;margin-left:20upx">{{__('请选择门店:')}}</label>
								<view class="nearbylist-item" :data-address="(ChainInfo.chain_address)" :data-name="(ChainInfo.chain_name)"
								 :data-lat="(ChainInfo.chain_lat)" :data-lng="(ChainInfo.chain_lng)">
									<view class="item-info">
										<label class="item-name">{{ChainInfo.chain_name}}</label>
										<label class="item-distance">{{ChainInfo.distance}}</label>
										<view class="item-phone">{{__('商家电话：')}}{{ChainInfo.chain_mobile}}</view>
										<view class="item-address">
											<label class="iconfont icon-shouhuodizhi " style="font-size:40upx;margin-right:15upx;"></label>
											<label>{{ChainInfo.chain_address}}</label>
										</view>
									</view>
								</view>
							</navigator>
							<!--地图-->

							<view class="m-cells m-cells-form hide" style="margin-top:20upx;z-index:1">
								<view class="m-cell" v-if="(product_service_contactor_flag)">
									<view class="m-cell-hd" style="width:20%">
										<label class="u-label">{{__('预约人')}}</label>
									</view>
									<view class="m-cell-bd">
										<input class="u-input" maxlength="20" type="text" :value="(showud_name)" placeholder="请输入预约人姓名" @input="inputud_name" />
									</view>
									<div v-if="(ud_name=='')" class="m-cell-ft">
										<uni-icons class="m-icon-warn" type="warn"></uni-icons>
									</div>
								</view>

								<view class="m-cell" v-if="(product_service_contactor_flag)">
									<view class="m-cell-hd" style="width:20%">
										<label for="" class="u-label">{{__('手机号码')}}</label>
									</view>
									<view class="m-cell-bd">
										<input class="u-input" type="number" :value="(showphone)" placeholder="请输入手机号码" @input="inputphone" />
									</view>
									<div v-if="(!isre || phone=='')" class="m-cell-ft">
										<uni-icons class="m-icon-warn" type="warn"></uni-icons>
									</div>
								</view>
								<view class="m-cell" v-if="(false)">
									<view class="m-cell-hd" style="width:20%">
										<label for="" class="u-label">{{__('详细地址')}}</label>
									</view>
									<view class="m-cell-bd">
										<input class="u-input" maxlength="100" type="text" :value="(showdetail )" placeholder="请输入详细地址" @input="inputdetail" />
									</view>
									<view v-if="(detail=='')" class="m-cell-ft">
										<uni-icons class="m-icon-warn" type="warn"></uni-icons>
									</view>
								</view>
							</view>


							<view class="m-cells-title">{{__('备注')}}</view>
							<view class="m-cells m-cells-form">
								<view class="m-cell">
									<view class="m-cell-bd">
										<textarea class="u-textarea" maxlength="200" :value="(store_items.remark)" :data-id="(store_index)"
										 :data-store_id="(store_items.store_id)" @input="inputRemark"></textarea>
										<view class="u-textarea-counter"><label>{{order_message_len[store_index] || 0}}</label>/200
										</view>
									</view>
								</view>
							</view>
							<!-- <view class="hint m-cell">
								<text>{{__('温馨提示:请您确认预约时间与地址，仔细核对手机号并保持电话畅通。下单成功后您可在“我的预约”查看订单。距离预约服务时间超过24小时您可以取消预约订单，距离预约服务时间24小时之内可以联系商家取消预约订单。')}}
								</text>
							</view> -->
						</block>
						<block v-else>
							<view class="m-cells-title">{{__('备注')}}</view>
							<view class="m-cells m-cells-form">
								<view class="m-cell">
									<view class="m-cell-bd">
										<textarea class="u-textarea" maxlength="200" :value="(store_items.remark)" :data-id="(store_index)"
										 :data-store_id="(store_items.store_id)" @input="inputRemark"></textarea>
										<view class="u-textarea-counter"><label>{{order_message_len[store_index] || 0}}</label>/200
										</view>
									</view>
								</view>
							</view>
						</block>
						<view class="m-cells total-info">
							<view class="m-cell">
								<view class="m-cell-bd">
									<text>{{__('商品总额')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">{{__('￥')}}{{store_items.productPrice}}</view>
								<view class="arrow"></view>
							</view>
							<view class="m-cell" v-if="store_items.productPointsSel">
								<view class="m-cell-bd">
									<text>{{__('积分抵扣')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">{{store_items.productPointsSel}}{{__('积分')}}</view>
								<view class="arrow"></view>
							</view>

							<view class="m-cell" v-if="store_items.productSpSel">
								<view class="m-cell-bd">
									<text>{{__('众宝抵扣')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">{{store_items.productSpSel}}{{__('众宝')}}</view>
								<view class="arrow"></view>
							</view>

							<view class="m-cell" v-if="(store_items.activityDiscountMoney>0)">
								<view class="m-cell-bd">
									<text>{{__('活动优惠')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">-{{__('￥')}}{{store_items.activityDiscountMoney}}</view>
								<view class="arrow"></view>
							</view>
							<!-- 优惠券，初始为0，选择优惠券后再修改 -->
							<view class="m-cell" @click="suitcouponlist" :data-id="(store_index)" :data-user_voucher_id="(store_items.user_voucher_id)"
							 v-if="(store_items.voucher_items.length>0)">
								<view class="m-cell-bd">
									<text>{{__('优惠券')}}</text>
									<text class="highlight12" v-if="(store_items.voucher_items.length>0)">
										({{store_items.voucher_items.length}}{{__('张优惠券可用')}})
									</text>
									<text class="highlight12" v-else>{{__('(无可用优惠券)')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt" v-if="(store_items.voucher_use_row && store_items.voucher_use_row.voucher_price)">
									-{{__('￥')}}{{store_items.voucher_use_row.voucher_price}}
								</view>
								<view class="arrow m-cell-access">
									<view class="m-cell-ft "></view>
								</view>
							</view>
							<!--会员折扣 -->
							<view class="m-cell" v-if="(store_items.order_discount_amount)">
								<view class="m-cell-bd">
									<text>{{__('会员折扣')}}</text>
									<text style="font-size:24upx;color:#717171">{{sprintf(__('(%s折)'), store_items.policy_discountrate/10)}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">-{{__('￥')}}{{store_items.order_discount_amount}}</view>
								<view class="arrow"></view>
							</view>
							<!-- <view class="m-cell">
								<view class="m-cell-bd">
									<text>{{__('运费')}}</text>
								</view>
								<view class="m-cell-ft m-order-typetxt">+{{__('￥')}}{{store_items.freight || 0}}</view>
								<view class="arrow"></view>
							</view> -->

							<!-- 积分 -->
							<view class="m-cell" v-if="(0)">
								<view class="m-cell-bd">
									<text>{{__('使用积分')}}</text>
									<text style="font-size:24upx;color:#717171">{{sprintf(__('(可使用%s积分)'), 0)}}</text>
								</view>
								<input type="number" class=" m-cell-ft m-order-typetxt" :value="(integral)" placeholder="请输入抵扣积分" @input="count" />
								<view class="arrow"></view>
							</view>

							<!-- 积分 -->
							<view class="m-cell" v-if="(0)">
								<view class="m-cell-bd">
									{{__('积分抵现')}}
								</view>
								<view class="m-cell-ft m-order-typetxt" style="padding-right:20upx">-{{__('￥')}}{{discount}}</view>
							</view>
							<!-- 余额抵扣 -->
							<view class="m-cell" v-if="(0)">
								<view class="m-cell-bd">
									<text>{{__('余额抵扣')}}</text>
									<text style="font-size:24upx;color:#717171">{{sprintf(__('(可使用%s元)'), 0)}}</text>
								</view>
								<view class=" m-cell-ft m-order-typetxt" v-if="(isBalance)">{{balance}}{{__('元')}}</view>
								<switch checked @change="switchChange" style="transform:scale(0.6);" />
							</view>

							<view class="m-cell ">
								<view class="m-cell-bd">
								</view>
								<view class="m-cell-ft m-total-info">
									{{__('总金额：')}}
									<text class="m-total-price" style="color: #DB384C;">{{__('￥')}}{{store_items.store_amount ? store_items.store_amount : store_items.order_money_select_items+store_items.freight}}</text>
								</view>
							</view>
							<view v-if="(delivery_item_none_row.length > 0)">
								<block v-for="(items, i) in delivery_item_none_row"  :key="i">
									{{items.product_item_name}},
								</block>
							</view>
						</view>


					</block>
				</view>
			</view>



			<view class="u-cleanbox"></view>

			<view class="m-footer-btn">
				<view class="m-footer-btn-list">
					<view class="m-footer-btn-item m-cart-total">
						<view :style="'line-height: ' + (submitinfo.orderSelFreightAmount>0 ? 40 : 40) + 'upx;'">{{__('合计：')}}

							<block v-if="order_amount">
								<label>{{__('￥')}}</label>
								<text class="m-total-price">{{order_amount}}</text>
							</block>


							<label v-if="submitinfo.orderSelPointsAmount" style="padding: 0 6px"> + </label>
							<text class="m-total-price" v-if="submitinfo.orderSelPointsAmount">{{submitinfo.orderSelPointsAmount}}</text>
							<label v-if="submitinfo.orderSelPointsAmount">{{__('积分')}}</label>


							<label v-if="submitinfo.orderSelSpAmount" style="padding: 0 6px"> + </label>
							<text class="m-total-price" v-if="submitinfo.orderSelSpAmount">{{submitinfo.orderSelSpAmount}}</text>
							<label v-if="submitinfo.orderSelSpAmount">{{__('众宝')}}</label>

						</view>
						<view style="line-height: 40upx;font-size: 24upx;">
							<block v-if="submitinfo.orderDiscountAmount>0">{{__('优惠')}}(<label>{{__('￥')}}{{number_format(submitinfo.orderDiscountAmount)}}</label>) <label  style="margin-right: 10upx;"></label></block>
						<!-- 	<block v-if="submitinfo.orderSelFreightAmount>0">
								{{__('运费')}}(<label>{{__('￥')}}{{submitinfo.orderSelFreightAmount}}</label>)
							</block>
							<block v-else>
								{{__('免运费')}}
							</block> -->
						</view>
					</view>
				</view>
				<view v-if="(isSubmit)" class="m-footer-btn-main u-disabled">
					{{__('正在提交....')}}
				</view>
				<block v-else>
					<view v-if="(!can_delivery && delivery_item_none_row.length > 0)">
						<button class="m-footer-btn-main" formType="submit">{{__('不可配送')}}</button>
					</view>
					<view v-else-if="(show_oos && delivery_item_none_row.length > 0)">
						<button class="m-footer-btn-main" formType="submit">{{__('暂时缺货')}}</button>
					</view>
					<form v-else-if="(!order_id)" report-submit="true" @submit="AddOrder">
						<button class="m-footer-btn-main" formType="submit">{{__('提交订单')}}</button>
					</form>
					<form v-else report-submit="true" @submit="AddOrder">
						<button class="m-footer-btn-main" formType="submit">{{__('去支付')}}</button>
					</form>
				</block>
			</view>




			<!-- <view class="m-footer-btn" >
					<view class="m-footer-btn-list">
						<view class="m-footer-btn-item" style="width: 65%;" >
							<view redirect="true"  class="u-go-home1" style="margin-left:60upx;">
								<view class="m-footer-btn-icon" style="float:left">
									<uni-badge   :text="num" type="warning"></uni-badge>
									<label style="font-size:44upx;" class="iconfont icon-cart"></label>
								</view>
								<label style="float:left;margin:20upx;">￥ {{price}}</label>
							</view>
						</view>
					</view>
				<view class="m-footer-btn-main m-footer-desable" :style="num > 0?'width:50%;background-color: #DB384C;':'width:50%'" @click="AddOrder">
						{{__('提交')}}
				</view>
			</view> -->
		</block>
		<block v-else>
			<navigator url="/seller/product/sale"  class="m-nullpage">
				<view class="m-nullpage-middle">
					<label class="iconfont icon-konggouwuche"></label>
					<view class="m-null-tip">
						<text>{{__('去挑几件中意的商品吧')}}</text>
					</view>
				</view>
			</navigator>
		</block>
		</block>

		<!--客户列表 -->
		<uni-drawer :visible="rightDrawerVehicle" mode="right">
			<scroll-view scroll-y="true" style="height: 100%;position: absolute;">
			<view class="m-cells" style="padding:20upx 20upx;" v-for="(user,ii) in clerkinfo" :key="ii">
				<view class="m-cell m-cell-access m-info-sp" :data-id="user.employee_id" :data-name="user.user_account" @click="Presuser">
					<view class="m-cell-bd">
						<view  class="m-order-title" >
							<view style="float:left;">
								<image  class="nav-image" lazy-load style="width:60upx;height:60upx;" :src="(user.user_avatar?user.user_avatar:'https://static.shopsuite.cn/demodata/assets/data/avatar.png')" mode="scaleToFill" />
							</view>
							<view style="float:left;margin-left:20upx">
								<view  class="m-ber-n">{{user.user_account}}</view>
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
	import uniDrawer from '@/components/uni-drawer/uni-drawer.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import uniIcons from '@/components/uni-icons/uni-icons.vue'
	import uniBadge from '@/components/uni-badge.vue';

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data: function() {
			return {
				options: {},
				selectsp: 0,
				selectct: 0,
				cart_type:0,
				spdata: [],
				flag:false,
				isckall: !1,
				isck: !1,
				cartlist: [],
				X_Start: 0,
				X_End: 0,
				T_Id: 0,
				select_cart_ids: [],
				isdata: !1,
				barBottom: 0,
				itemindex:0,
				price:0,
				num:0,
				buyer_user_id:0,
				rightDrawerVehicle:false,
				clerkinfo:[],
				Clerk_name:'',
				Clerk_id: 0,






				isVirtual: 0,
				ud_id: 0,
				spinfo: "",
				remark: "",
				remarkLength: 0,
				formId: "",
				submitinfo: {items:[], UserMembership:{}},
				user_voucher_ids: [],
				order_message: {},
				order_message_len: {},
				isSubmit: !1,
				order_id: "",
				paymentData: {},
				integral: "",
				discount: 0,
				disbursements: "",
				IsUseCoupon: 1,
				addressFlag: !0,
				selfpickFlag: !1,
				chainFlag: !1,
				date: "",
				starttime:"",
				endtime:"",
				pid: "",
				ud_name: "",
				phone: "",
				stdate: "",
				eddate: "",
				time: "",
				st: "",
				et: "",
				shipMethod: 0,
				item_ids: [],
				store_id: '',
				chain_id: '',
				item_id: '',
				balance: 0,
				isBalance: !0,
				isCoupon: !0,
				isTmplMsg: !0,
				can_delivery: !1,
				ifcart: false,
				cart_id: '',
				order_amount: 0,
				ChainInfo: {},
				latitude:'',
				longitude:'',


				urlArgs: {},
				delivery_item_none_row:[],
				show_oos:false,
				product_service_date_flag:false,
				product_service_contactor_flag:false,

				showPopupFlag: false,
				popupMsg: '',

				isFightGroup: 0,

				order_items_material:[],
				order_items_fictitious:[],




				detail:'',  //


				salesperson_id:'' //销售员Id
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			uniDrawer,
			uniList,
			uniListItem,
			uniBadge
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			/*
			uni.setNavigationBarTitle({
				title:this.__('购物车')
			});
			*/

			var that = this;

			let bar_bottom = 0;
			// #ifdef H5
			bar_bottom = 50;
			// #endif

			that.setData({
				buyer_user_id:options.u_id,
				cartlist:uni.getStorageSync('items')
			})

			that.getStorage()

		},

		onShow: function() {
			this.showCartNum();
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			// 离开页面，注销事件
			var that = this
			this.notice.removeNotification("RefreshCart", that);
		},

		onPullDownRefresh: function() {
			this.getCartList()
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo', 'setCartNum', 'showCartNum']),

			getStorage: function() {
				var that = this


					var pat = []
					var params = {}
					for(var i in that.cartlist){
						if(that.cartlist[i].cart_quantity > 0){
							var t = that.cartlist[i].item_id + '|' + that.cartlist[i].cart_quantity
							pat.push(t)
						}
					}
					if(pat)
					{
						params.cart_id = pat.join(',');
						params.if_chain = 0;
						params.buyer_user_id = that.buyer_user_id;
					}

					that.$.request({
						url: this.Config.URL.seller.checkout,
						data: params,
						success: function(data, status, msg, code) {
							if (200 == status) {
								var n = new Date,
									r = new Date(n);
								r.setDate(n.getDate() + parseInt(3600 * 24 * 360));
								var stdate = n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate(),
									eddate = r.getFullYear() + "-" + (r.getMonth() + 1) + "-" + r.getDate();

								var ud_id = 0;
								if (!that.$.isNull(data.delivery_address_row)) {
									ud_id = data.delivery_address_row.ud_id;
								} else {}
								if(data.items.length > 0)
								{


									if (data.if_virtual) {

										var item_row = data.items[0].items[0];
										that.setData({
											order_items_material:[],
											order_items_fictitious:[]
										})

										for(var t in data.items[0].items)
										{

											if(data.items[0].items[t].kind_id == 1201)
											{

												that.order_items_material.push(data.items[0].items[t])
											}
											else
											{
												that.order_items_fictitious.push(data.items[0].items[t])

											}
										}


										that.setData({
											item_ids: [item_row.item_id]
										});

										// that.drawSelf(item_row.store_id);

										that.setData({
											isVirtual: data.if_virtual,
											product_service_date_flag: item_row.product_service_date_flag,
											product_service_contactor_flag: item_row.product_service_contactor_flag,
											ud_id: ud_id,
											store_id: item_row.store_id,
											chainFlag: item_row.product_valid_type == 1002 ? false : true,
											addressFlag: item_row.product_valid_type == 1002 ? true : false,
											submitinfo: data,
											eddate: eddate,
											stdate: stdate,
											chain_id:that.chain_id,
											isdata:!0
										});

									} else {
										var item_row = data.items[0].items[0];
										that.setData({
											order_items_material:[],
											order_items_fictitious:[]
										})
										for(var t in data.items[0].items)
										{
											if(data.items[0].items[t].kind_id == 1201)
											{

												that.order_items_material.push(data.items[0].items[t])
											}
											else
											{
												that.order_items_fictitious.push(data.items[0].items[t])

											}
										}


										if (that.chain_id)
										{
											// that.drawSelf(item_row.store_id);
										}

										that.setData({
											store_id: item_row.store_id,
											isVirtual: data.if_virtual,
											product_service_date_flag: 1,
											product_service_contactor_flag: 1,
											ud_id: ud_id,
											submitinfo: data,
											eddate: eddate,
											stdate: stdate,
											chain_id:that.chain_id,
											isdata:!0
										});


									}
								}
								else
								{
									that.setData({
										isdata:!1
									});
								}



								that.setData({
									order_amount: data.orderSelMoneyAmount
								});



								// if (that.user_voucher_id > 0) {
								// 	that.useVoucher(that.user_voucher_id);
								// }
							} else {
								that.$.confirm(msg, that.$.navigateBack);
							}
						},

						fail: function(err, ms) {
							//console.info(err);

							that.$.confirm(err);
						}

					});



			},

			drawSelf: function(store_id) {
				var that = this;

				that.$.getLocation({
					type: "wgs84",
					success: function(t) {
						that.setData({
							latitude: t.latitude,
							longitude: t.longitude
						});
						that.getNearbylist(store_id)
					},
					fail: function() {
						that.setData({
							isdata: !0
						});

						that.$.alert("授权失败");

						that.getNearbylist(store_id)
					}
				});



				this.selfpickFlag ? this.setData({
					shipMethod: 1
				}) : this.setData({
					shipMethod: 0
				});

				// this.getCartList();
				// this.getNearbylist(store_id)
			},

			AddOrder: function() {
				var that = this;
				if (that.$.isNull(this.buyer_user_id))
				{
				    that.$.confirm(that.__("请选择客户"), function (a) {
				    					 if (a.confirm)
				    					 {

				    					 }
				    })

					return
				}


				if (that.$.isNull(this.submitinfo.items.length > 0))
				{
				    that.$.confirm(that.__("请选择商品"), function (a) {

				    })

					return
				}

				this.saleOrder()
			},


			saleOrder: function(){

				var that = this;

				var params = {
					buyer_user_id:this.buyer_user_id,
					delivery_type_id:10,
					clerk_id: that.Clerk_id,
					items:JSON.stringify(that.cartlist)
				}



				that.$.request({
					url: that.Config.URL.seller.Order_Base,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==  200){
							that.$.alert('添加订单成功！', function() {
								let url = that.$.sprintf('/seller/order/detail?on=%s', data.order_id[0])
								uni.setStorageSync('items','');
								that.setData({
									cartlist: [],
									num: 0,
									price: 0
								})
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

			Presuser: function(e) {
				var that = this;

				that.setData({
					Clerk_name:e.currentTarget.dataset.name,
					Clerk_id:e.currentTarget.dataset.id,
					rightDrawerVehicle:false,
				})
			},

			removeload: function(e) {
				//console.info(e);
				this.setData({
					X_End: e.touches[0].pageX
				})
			},

			obtainUserInfo: function() {

				var that = this;

				var params = {
					rows: 100,
					sidx: 'user_id',
					sord: 'asc'
				}
				that.$.request({
					url: that.Config.URL.seller.select_Clerk,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==  200){

							that.setData({
								clerkinfo: data.items,
								rightDrawerVehicle:true,
							})
						}else{
							that.$.alert(msg)
						}
					}
				})

			},

			pressDelCart: function(e) {
				var that = this;
				e.currentTarget.dataset.id;

				let itemList = ['删除']

				uni.showActionSheet({
					itemList: itemList,
					success: (res) => {
						if (res.tapIndex == 0)
						{
							that.delcart(e);
						}
						else
						{
						}
					}
				})

			},

			removestart: function(e) {
				this.setData({
					X_Start: e.touches[0].pageX
				})
			},

			// 删除购物车商品
			delcart: function(e) {
				var that = this;
				var t = e.currentTarget.dataset.id
				that.$.showModal({
					title: "提示",
					content: "确认要删除这个商品吗？",
					success: function(n) {
						if (n.confirm) {
							var cart = []

							for(var i in that.cartlist){
								if(parseInt(that.cartlist[i].item_id) !== parseInt(t))
								{
									cart.push(that.cartlist[i])
								}
							}

							that.cartlist = cart
							uni.setStorageSync('items', that.cartlist);
							that.getStorage()
						}
					}
				})
			},
			// 结算
			submitorder: function() {
				let that = this;
				this.isck ? that.$.navigateTo({
					url: "/pages/checkout/checkout?ifcart=1"
				}) : that.$.showModal({
					title: "提示",
					content: "请选择需要结算商品！",
					showCancel: !1
				})
			},
			// 删除所有商品
			delAll: function() {
				var that = this;
				that.select_cart_ids.length <= 0 ? that.$.confirm("请选择需要删除的商品！") : that.$.confirm("是否删除选中商品？", function(t) {
						if (t.confirm) {
							var param = {
								cart_id: that.select_cart_ids.toString()
							};
							that.$.request({
								url: that.Config.URL.cart.remove,
								data: param,
								success: function(data) {
									that.getCartList()
								}
							});
						}
					},
					!0)
			},

			closesp: function() {
				var that = this;
				that.setData({
					selectct: 0,
					flag: !1
				}), setTimeout(function() {
						that.setData({
							selectsp: 0
						})
					},
					1e3)
			},








		}
	}
</script>


<style lang="scss">
	@import "../../styles/_variables.scss";


	/*店铺信息 start*/

	.m-store:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #ebebe7;
		color: #ebebe7;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.m-store {
		height: 100upx;
		background-color: #f5f5f5;
		border-bottom: 0upx solid #e3e3e3;
		position: relative;
		overflow: hidden;
	}

	.m-store-c {
		position: absolute;
		height: 100%;
		width: 850upx;
	}

	.m-store-ck {
		float: left;
		width: 100upx;
		height: 100%;
		position: relative;
	}

	.m-store-ck icon,
	.m-store-ck .uni-icons {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -23upx;
		margin-left: -23upx;
	}

	.m-store-info {
		height: 100upx;
		line-height: 100upx;
		width: 538upx;
		float: left;
		box-sizing: border-box;
		position: relative;
	}

	/*.m-store-info::before {content: " ";position: absolute;left: 0;bottom: 0;right: 0;height: 1upx;border-bottom: 1upx solid #e3e3e3;color: #CCCCCC;-webkit-transform-origin: 0 100%;transform-origin: 0 100%;-webkit-transform: scaleY(0.5);transform: scaleY(0.5);z-index: 3;}*/



	.pre-info-price {
		height: 18upx;
		font-size: 12upx;
		color: #b0b0b0;
		margin: 0 0 0 10upx;
	}



	.m-act-img {
		width: 100upx;
		height: 100upx;
	}


	.m-item-act {
		position: relative;
		height: 100%;
		width: 850upx;
		height: 100upx;
	}


	.act-item-name {
		width: 438upx;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.m-act-change {
		float: right;
		width: 100upx;
		background-color: #fff;
		height: 100%;
		font-size: 28upx;
		position: absolute;
		font-size: 28upx;
		top: 30upx;
		right: 120upx;
		color: #888;
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

	.m-panel-sp-pinfo {
		height: 80upx;
		box-sizing: border-box;
		padding: 20upx;
		position: relative;
	}

	.m-panel-sp-pimg {
		width: 100upx;
		height: 100upx;
		background-color: #fff;
		border-radius: 8upx;
		box-sizing: border-box;
		padding: 10upx;
		box-shadow: 0px 0upx 10upx rgba(0, 0, 0, 0.35);
		float: left;
	}

	.m-panel-sp-pimg image {
		width: 100%;
		height: 100%;
	}

	.m-panel-sp-pname {
		padding-left: 20upx;
		width: 580upx;
		/*float:right;*/
		font-size: 28upx;

		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;

		margin-top: 6upx;
	}

	.m-panel-sp-pname .m-pprice {
		color: $default-skin-bg;
		font-size: 32upx;
		line-height: 50upx;
		font-weight: bold;
	}

	.m-panel-sp-icon {
		position: absolute;
		right: 20upx;
		top: 20upx;
	}

	/* .m-panel-sp-listbox{height: 604upx;} */
	.m-panel-sp-listbox-item {
		height: 130upx;
		border-top: 1upx solid #e3e3e3;
		box-sizing: border-box;
		padding: 10upx 20upx;
	}

	/*选择规格遮罩 end*/


	.u-cart-num {
		position: absolute;
		bottom: 20upx;
		right: 20upx;
		z-index: 2;
	}

	.m-cart-ck {
		float: left;
		width: 100upx;
		background-color: #fff;
		height: 100%;
		position: relative;
	}

	.m-cart-ck icon,
	.m-cart-ck .uni-icons {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -23upx;
		margin-left: -23upx;
	}

	.m-product-info {
		width: 488upx;
		height:160upx;
	}

	.m-product-info::before {
		border: none;
	}

	.m-product-item:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #ebebe7;
		color: #ebebe7;
		/*transform-origin: 0 100%;*/
		transform: scaleY(0.5);
	}

	.m-product-item {
		border-bottom: 0upx solid #e3e3e3;
		position: relative;
		overflow: hidden;
		height: auto;
		margin-top:6upx;
	}

	.m-item-c {
		position: relative;
		height: 100%;
		width: 850upx;
		height: 160upx;
	}

	.u-del {
		width: 100upx;
		background-color: $default-skin-bg;
		float: right;
		height: 100%;
		color: #fff;
		font-size: 28upx;
		text-align: center;
		line-height: 160upx;
	}

	/*底部按钮 start*/

	.m-footer-btn:before {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #ebebe7;
		color: #ebebe7;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.m-footer-btn {
		height: 100upx;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		border-top: 0upx solid #e3e3e3;
		z-index: 3
	}

.m-footer-btn {
		height: 100upx;
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		border-top: 1upx solid #d5d5d5;
		border-radius: 0;
		z-index: 100;
	}

	.m-footer-btn-list {
		width: 70%;
		height: 100%;
		position: relative;
		float: left;
	}

	.m-footer-btn-item {
		position: relative;
		float: left;
		width: 100%;
		font-size: 24upx;
		color: #888;
		line-height: 40upx;
		padding: 15upx 0;
		box-sizing: border-box;
		height: 100%;
	}

	.m-footer-btn-main {
		width: 30%;
		height: 100%;
		float: left;
		background-color: $default-skin-bg;
		color: #fff;
		line-height: 100upx;
		font-size: 32upx;
		text-align: center;
		border-radius: 0;
	}

	.m-cart-total {
		text-align: right;
		padding-right: 20upx;
	}

	.m-cart-total text {
		font-size: 36upx;
		color: $default-skin-bg;
	}

	.m-cart-total label {
		color: $default-skin-bg;
	}

	.m-cart-del {
		line-height: 70upx;
		font-size: 32upx;
	}

	/*底部按钮 end*/
	.del {
		-webkit-animation: mdel .2s 1;
		animation: mdel .2s 1;
		left: -100upx;
	}

	@-webkit-keyframes mdel {
		0% {
			left: 0;
		}

		100% {
			left: -100upx;
		}
	}

	@keyframes mdel {
		0% {
			left: 0;
		}

		100% {
			left: -100upx
		}
	}

	view {
		font-size: 28upx;
		line-height: 2;
	}

	.m-product-name {
		line-height: 40upx;
		height:80upx;
	}

	.m-footer-btn-icon {
		width: 40upx;
		height: 28upx;
		position: relative;
		line-height:28upx;
		top:28upx;
	}

	.m-cell::before {
		border-top: 0px solid #ebebe7;
	}

	.m-order-typetxt {
		color: #DB384C;
	}

	.m-product-img {
		width:160upx;
		height:160upx;
	}
</style>

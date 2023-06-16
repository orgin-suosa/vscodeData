<template>
	<view class="page">
		<view class="sstouch-main-layout mb20">
		    <view class="sstouch-address-list" id="address_list">
		      <view class="uni-list">
		      	<checkbox-group class="uni-list" @change="checkboxChange">
		      		<label class="uni-list-cell uni-list-cell-pd" style="padding:22upx 500upx 22upx 32upx;" v-for="(item,ii) in items" :key="ii">
		      			<view>
		      				<checkbox :value="item.id+''" :checked="item.logistics_is_enable?true:false"></checkbox>
		      			</view>
		      			<view>{{item.logistics_name}}</view>
		      		</label>
		      	</checkbox-group>
		      </view>
		        <view class="p" style="padding: 30rpx;">{{__('如未显示物流公司，请先在商家PC管理后台添加物流公司:设置-辅助资料-物流公司')}}</view>
		        <view class="btn-l mt5" @click="editExpress">{{__('保存设置')}}</view>
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
				items:[],
				logistics_id:[]
			}
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			var that = this;
			uni.setNavigationBarTitle({
				title:this.__('选择物流')
			});
			that.getExpress()
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			//获取物流公司
			getExpress:  function(){
				var that = this;
				var	params = {};
				that.$.request({
					url: that.Config.URL.seller.lists_express_logistics,
					data: params,
					success: function(data, status, msg, code) {
						if(status ==  200){
							that.setData({
								items:data.items
							})
							for(var t in data.items){
								if(data.items[t].logistics_is_default == 1){
									that.logistics_id.push(data.items[t].id)
								}
							}
						}
					}
				})
			},

			checkboxChange: function(e){
				//console.log(e.detail.value)
				this.setData({
					logistics_id:e.detail.value
				})
			},

			editExpress: function(){
				var that = this;

				uni.showModal({
				    title: that.__('提示'),
				    content: that.__('确定保存?'),
				    success: function (res) {
				        if (res.confirm) {
				            var	params = {
				            	logistics_id:JSON.stringify(that.logistics_id)
				            };
				            that.$.request({
				            	url: that.Config.URL.seller.enabled_express_logistics,
				            	data: params,
				            	success: function(data, status, msg, code) {
				            		if(status ==  200){
				            			that.$.confirm(that.__("保存成功"), function (t) {
				            			        if (t.confirm)
				            			        {
													that.getExpress()
												}
											})

				            		}else{
										that.$.confirm(msg)
									}
				            	}
				            })
				        } else if (res.cancel) {
				            //console.log('用户点击取消');
				        }
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
</style>

<template>
	<view class="page">
		<view v-if="(isdata)" class="m-ad-list">
			<!-- <view v-for="(item, i) in banklists"  :key="i" class="m-ad-item" :data-id="(item.user_bank_id)"  :data-ud_id="(item.user_bank_id)" @longpress="modify">
				<view class="m-ad-l">
					<view class="m-ad-i-top">
						<text>{{item.bank_name}}</text>
					</view>
					<view class="m-ad-i-bot">
						<text>{{item.user_bank_card_mobile}}</text>
					</view>
				</view>
				<view class="m-edit-view" style="background-color: #007AFF;">
					<label :data-ud_id="(item.user_bank_id)" @click="editBankcard" class="">{{'编辑'}}</label>
					<label class="" :data-ud_id="(item.user_bank_id)" @click="removeBankcard">{{'删除'}}</label>
				</view>
			</view> -->
		
				
			<view v-for="(item, i) in banklists"  :key="i" class="m-account-item" 
			:data-id="(item.user_bank_id)" :data-ud_id="(item.user_bank_id)"  @longpress="modify">
				<view class="m-left-view">
					<view class="m-left-title">
						<text>{{item.bank_name}}</text>
					</view>
					<view class="m-left-account">
						<text>{{item.user_bank_card_mobile}}</text>
					</view>
				</view>
				<view class="m-edit-view" style="">
					<label :data-ud_id="(item.user_bank_id)" @click="editBankcard" class="">{{'编辑'}}</label>
					<view class="line" style="height: 28rpx;width: 1rpx;background-color: #D8D8D8;"></view>
					<label class="" :data-ud_id="(item.user_bank_id)" @click="removeBankcard">{{'删除'}}</label>
				</view>
			</view>
			<button class="u-btn-hlight" @click="addBankcard" style="margin-top:50upx;">{{__('添加账户')}}</button>
		</view>
		<view class="m-nullpage" v-else @click="addBankcard">
			<view class="m-nullpage-middle">
				<label class="iconfont icon-dizhi"></label>
				<view class="m-null-tip">
					<text class="m-null-tipck">{{__('马上去添加账户')}}</text>
				</view>
			</view>
		</view>
	</view>
</template>


<style lang="scss">
	@import "../../styles/_variables";

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
	.m-ad-l {
		width: 70%;
		display: inline-block;
		background-color: #FF0000;
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
    
	
	.m-account-item{
		background-color: #fff;
		padding: 25upx 30upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		// height: 138rpx;
		border: #EEEEEE 1rpx solid;
		
		.m-left-view{
			
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			
			
			.m-left-title{
				text-align: left;
				height: 48rpx;
				line-height: 48rpx;
				color: #333333;
				font-size: 34rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
			}
			.m-left-account{
				text-align: left;
				height: 42rpx;
				line-height: 42rpx;
				color: #999999;
				font-size: 30rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
			}	
		}
		
		.m-edit-view {
			width: 180upx;
			margin-right: 10upx;
			display: flex;
			// flex-direction: column;
			align-items: center;
			justify-content: space-between;
			text-align: center;
			height: 55rpx;
			line-height: 55rpx;
			color: #333333;
			font-size: 30rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, PingFang SC;
		}
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

</style>

<script>

    import {
        mapState,
        mapMutations
    } from 'vuex'


	export default {
		data() {
			return {
				options:{},
				banklists: [],
				isdata: !1,
				spid: "",
				ud_id: 0
			}
		},
        computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('账户列表')
			});

			var that = this;
            this.load();
		},
		onShow: function() {
			this.load();
		},

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {

        },
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			load: function()
			{
				var that =this;
				var params = {}
				that.$.request({
					url: this.Config.URL.pay.list_user_bank,
					data: params,
					success: function(data, status, msg, code) {
						if(data.items.length > 0)
						{

						that.setData({
							banklists: data.items,
							isdata: !0,
						})
						that.$forceUpdate();
					  }

					}
				})
			},
			listBankcard: function() {
				var that = this;
				var params = {};

                that.setData({
                    isdata: !1,
                    addresslist: []
                });

				that.$.request({
					url: that.Config.URL.user.address_lists,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							if (data.items.length > 0) {

							    //that.addresslist = data.items;

                                that.setData({
                                    isdata: !0,
                                    addresslist: data.items
                                });

							} else {
								that.setData({
									isdata: !1
								});
							}
						}

                        uni.stopPullDownRefresh()
                    }
				});
			},
            modify: function(e) {
				var that = this;
                e.currentTarget.dataset.ud_id;

                let itemList = [that.__('编辑'), that.__('删除')]

                uni.showActionSheet({
                    itemList: itemList,
                    success: (res) => {
                        if (res.tapIndex == 0)
                        {
                            that.editBankcard(e);
                        }
                        else
                        {
                            that.removeBankcard(e);
                        }
                    }
                })

			},
			selectBankcard: function(obj) {
                if (obj.currentTarget.dataset.sel)
				{
                    var that = this;
                    var options = that.options;
                    options.ud_id = obj.currentTarget.dataset.ud_id;
                    that.$.navigateBack(1, function() {
                        //console.info('selectBankcard')
                        that.notice.postNotificationName("RefreshOrder", options)
                    })
				}
			},
			editBankcard: function(obj) {
				var that = this;
				var options = this.options;
				options.ud_id = obj.currentTarget.dataset.ud_id;

				if (that.ud_id != 0) {
					that.$.redirectTo({
						url: that.$.createUrl("/my/setting/bankcard-add", options)
					});
				} else {
					that.$.navigateTo({
						url: that.$.createUrl("/my/setting/bankcard-add", options)
					});
				}
			},

			addBankcard: function() {
				var that = this;
				//var options = that.options;

				if (that.options.issub)
				{
					var options = { issub: 1 };
				}
				else
				{
					var options = {};
				}

				if (that.ud_id != 0) {
					that.$.redirectTo({
						url: that.$.createUrl("/my/setting/bankcard-add", options)
					});
				} else {
					that.$.navigateTo({
						url: that.$.createUrl("/my/setting/bankcard-add", options)
					});
				}
			},

			removeBankcard: function(e) {
				var that = this;
				that.$.showModal({
					title: that.__("提示"),
					content: that.__("确认删除这个账户吗？"),
					showCancel: !0,
					success: function(n) {
						if (n.confirm) {
							var params = {
								id: e.currentTarget.dataset.ud_id
							};
							that.$.request({
								url: that.Config.URL.pay.remove_user_bank,
								data: params,
								success: function(data, status, msg, code) {
									if (200 == status) {
										that.$.showToast({
											title: that.__("删除成功！")
										});

                                        that.notice.postNotificationName("RefreshOrder", 0);
                                        that.load();
									}
								}
							});
						}
					}
				})
			}
		}
	};
</script>

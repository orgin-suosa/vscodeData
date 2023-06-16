<template>
	<view class="page">
		<view class="sstouch-main-layout">
				<view class="top">
				 	<view   right-icon="scan" style="width: 80%;float:left;;padding:20upx;margin-left:20upx;">
				 		<view class="input-view" style="width: 90%;">
				 			<input  style="font-size:26upx;"  class="input" type="text" :value="chain_code" :placeholder="__('请输入提货码/服务码进行核销')" @input="setCode">
				 			<image class="false-image" src="/static/images/false.png" mode="aspectFill" @click="gocancel" />
				 		</view>
				 	</view>
				 	<view class="zc" id="scan_btn" @click="getscanCode">

				 	</view>
				 </view>
		       <form class="sstouch-inp-con">
		            <view class="form-btn" @click="query" style="margin-top:0;    background-color: #f5f5f5;">
		                <view class="btn J_search" :style="chain_code?'background: #ff6700;color: #FFF!important;line-height:100upx':'background: #EEE;line-height:100upx'">{{__('查询订单')}}</view>
		            </view>
		        </form>
		    <view class="sstouch-order-list">
		        <view class="ul" id="order-detail"></view>
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
				chain_code:'',
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title:this.__('扫码核销')
			});
		},

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			//扫码
			getscanCode: function(){
				var that = this;
				uni.scanCode({
				    success: function (res) {
				        //console.log('条码类型：' + res.scanType);
				        //console.log('条码内容：' + res.result);
						that.setData({
							chain_code:res.result
						})
				    }
				});
			},

			setCode: function(e) {
				this.setData({
					chain_code:e.detail.value
				})
			},

			gocancel: function(e) {
				this.setData({
					chain_code:''
				})
			},

			query: function(){
				var that = this;
				if(that.chain_code){
					var params = {
						chain_code:that.chain_code
					}
					that.$.request({
						url: that.Config.URL.seller.order_get_by_pickupcode,
						data: params,
						success: function(data, status, msg, code) {
							if(status ==  200){
								//console.log(data)
							}else{
								that.$.alert(msg)
							}
						}
					})
				}else{
					that.$.alert(that.__('请输入查询数据'))
				}

			},
		}
	}
</script>

<style lang="scss">
	@import "../../styles/base.scss";
	@import "../../styles/sstouch_member.scss";
	@import "../../styles/sstouch_common.scss";


	.form-btn {
		// padding-top:50upx;
	}

	.input-view {
		width: 100%;
		display: flex;
		background-color: #FFFFFF;
		height: 30px;
		border-radius: 15px;
		padding: 0 5%;
		flex-wrap: nowrap;
		margin: 7px 0;
		line-height: 30px;
	}

	.input-view .uni-icon {
		line-height: 30px !important;
	}

	.input-view .input {
		height: 30px;
		line-height: 30px;
		width: 94%;
		padding: 0 3%;
		border: 0;  // 去除未选中状态边框
		outline: none; // 去除选中状态边框
		background-color: rgba(0, 0, 0, 0);// 透明背景

	}


	input::placeholder{
			width:357upx;
			height:25upx;
			font-size:26upx;
			font-family:Alibaba PuHuiTi;
			font-weight:400;
			color:#6DA62F;
		}

	.sstouch-order-search {
		height:70upx;
	}

	.form-btn {
		background-color: #f5f5f5;
	}

	.inp {
		width:100%;
		margin-top:16upx
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

	.false-image {
		width:30upx;
		height:30upx;
		float:left;
		margin:12upx auto;
		z-index:9
	}


</style>

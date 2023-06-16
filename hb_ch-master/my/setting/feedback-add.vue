<template>
	<view class="page">
		<view class="feedback-box" style="">
			<view class="m-content"  style=";padding:25rpx;border-radius: 10rpx;background-color: #F9F9FB;">
				
				<textarea class="u-textarea" maxlength="500" :placeholder="__('感谢提出建议')"
				 @input="inputRemark" style="height:300upx;"></textarea>
				<view class="u-textarea-counter">
					<label>{{remarkLength}}</label>/500
				</view>
			</view>
		
            <view class="btn_box" bind="submitdata">
				<button class="u-btn-hlight" @click="submitdata">{{__('提交')}}</button>
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
		data: function() {
			return {
				remark: "", remarkLength: 0, wechat_id: "", Email: "", platform: "", categoryId: ""
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function(options) {
			// uni.setNavigationBarTitle({
			// 	title:this.__('我要反馈')
			// });

			
		},
		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			
			inputRemark: function (e) {
				this.setData({
					remark: e.detail.value,
					remarkLength: e.detail.value.length
				});
			},
			test(){
			   uni.navigateTo({
			   	url:'../paytest/paytest'
			   })	
			},
			submitdata: function () {
				let that = this;
				if (that.$.isNull(this.remark))
				{
					// that.$.alert(that.__("请输入您宝贵的意见"));
					uni.showToast({
						icon:'none',
						title:'请输入您宝贵的意见'
					})
					return;
				}
				
				var params = {
					feedback_question: this.remark,
					Platform: this.platform,
				};
				
				that.$.request({
					url: this.Config.URL.user.feedback_add,
					data: params,
					success: function (data, status, msg, code) {
						if (200 == status) {
							uni.showToast({
								icon:'success',
								title:'意见反馈成功'
							})
							setTimeout(function () {
								that.$.navigateBack(1, function () {
								})
							}, 1e3)
						} else {
							uni.showToast({
								icon:'success',
								title:msg
							})
						}
					}
				});
				
			}
		}
	};
</script>



<style lang="scss" scoped>
	
	// @import "../../styles/_variables";
    
	.page{
		background-color: #FFFFFF;
		width: 100%;
	    display: flex;
		flex-direction: column;
		position: absolute;
		left: 0;
		top: 0;
		bottom:0;
	}
	
	.feedback-box{
		padding: 20rpx 25rpx;
		color: #CCCCCC;
		line-height: 40rpx;
		color: #333333;
		font-size: 32rpx;
		font-weight: 400;
		font-family: PingFangSC-Regular, PingFang SC;
	}
	// .m-cells::before{border: none;}
	// .m-cells::after{border: none;}
	// .m-cell::before{border: none;}
	.btn_box{
		margin-top: 80rpx;
	}
	
</style>

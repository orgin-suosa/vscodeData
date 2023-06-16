<template>
	<view class="container">
		<image style="width: 100%;height: auto;"
			src="https://qnsp.zcskjy.com/zc_images/images/ll_ks.jpg" mode="widthFix" @click="openUrl"></image>
		<image style="width: 521rpx;height: 100rpx;margin-top: 750rpx;position: absolute;" @click="openUrl"
			src="https://qnsp.zcskjy.com/zc_images/images/ll_ks_btn.gif" mode="widthFix"></image>
	</view>
	</view>
</template>

<script>
	export default {
		components: {
			// topTitle,
		},
		data() {
			return {
				token: '',
				miniUrl: '',
			};
		},
		onLoad() {
			// window.location.href = 'https://shop.zcskjy.com/mp?typeIndex=9';
			this.getUrlLink()
			this.addAct('initLoad')
		},

		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1,
				});
			},

			getUrlLink() {
				const that = this;
				uni.request({
					url: 'https://shop.zcskjy.com/zc-config/v1/weixin/getWxULink',
					data: {
						path: 'pages/index/llxldIndex'
					},
					success: (res) => {
						that.miniUrl = res.data.result
						// window.location.href = that.response
					}
				})
			},
			openUrl() {
				this.addAct('click')
			},
			addAct(val) {
				let that = this;
				uni.request({
					url: 'https://shop.zcskjy.com/zc-config/v1/stat/add',
					data: {
						type: 'H5',
						num: 'KS_LL_XLD',
						item: val
					},
					complete() {
						if (val == 'click') {
							window.location.href = that.miniUrl
						}
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		width: 750rpx;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		position: relative;
	}
</style>

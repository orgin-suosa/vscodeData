<template>
	<view class="content">
		<u-popup :show="show" mode="top" @close="close" @open="open">
			<view style="display: flex;align-items: center;width: 100%;flex-direction: column;">
				<image v-if="isMpWeixin" class="top" mode='widthFix'
					src="https://qnsp.zcskjy.com/zc_images/home/download_top.png">
			</view>
		</u-popup>
		<image v-if="isMpWeixin" class="top" mode='widthFix'
			src="https://qnsp.zcskjy.com/zc_images/home/download_top.png">
			<image class="top" style="margin-top: 220rpx;width: 233rpx;" mode='widthFix'
				src="https://qnsp.zcskjy.com/zc_images/home/download_mid.png">
				<image class="top" style="margin-top: 130rpx;width: 315rpx;" mode='widthFix'
					src="https://qnsp.zcskjy.com/zc_images/home/download_down.png" @click="download()">
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isMpWeixin: false,
				app_platform: '',
				show:false,
				url:'',
			}
		},
		onLoad() {
			let that = this;
			const t2 = new Date().getTime()
			that.url = 'https://qnrs.zcskjy.com/apk%2F%E9%95%BF%E4%B9%98%E5%AD%A6%E5%A0%82.apk?'+t2
			that.app_platform = uni.getStorageSync('app_platform');
			//https://qnrs.zcskjy.com/apk%2F%E9%95%BF%E4%B9%98%E5%AD%A6%E5%A0%82.apk
			if (that.$.isWeixin() && that.app_platform != 'ios') {
				that.isMpWeixin = true;
				that.show = true;
			} else {
				window.open(that.url)
			}
		},
		methods: {
			download() {
				if (this.app_platform == 'ios') {
					//打开app store
					window.open('https://itunes.apple.com/cn/app/id1628777832')
				} else {
					//下载apk
					if (this.isMpWeixin) {
						uni.showToast({
							icon: "none",
							title: "请按照指引打开浏览器下载",
							duration: 2000
						})
						plus.runtime.openURL('https://shop.zcskjy.com/zc-config/v1/downloadUrl/query')
					} else {
						window.open(this.url)
					}
				}
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
	}

	.top {
		width: 82%;
		background-color: #fff;
	}
</style>

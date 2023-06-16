<template>
	<view class="container">
		<view style="width: 100%;height: 1rpx;background-color:#F6F6F6;"></view>
		<image class="banner" src="../../static/images/zc_stock_img1.png" mode="aspectFit"></image>
		<scroll-view class="list_main" :style="{ height: clientHeight + 'px' }" scroll-y="true"
			@scrolltolower="loadMore">
			<view class="list_main">
				<courseItem v-for="data in courseArr" :courseData="data"></courseItem>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import courseItem from '@/edu/live-more/components/course_item/course_item.vue'
	export default {
		components: {
			courseItem
		},

		data() {
			return {
				clientHeight: 0,
				courseArr: [{
					name: '123'
				}, {
					name: '456'
				}, {
					name: '789'
				}, {
					name: '123'
				}, {
					name: '456'
				}, {
					name: '789'
				}]
			}
		},

		onLoad() {
			let that = this;
			uni.setNavigationBarTitle({
				title: '股市早知道'
			})

			uni.getSystemInfo({
				success(res) {
					//228是title和tab的高度和
					that.clientHeight = res.windowHeight - res.statusBarHeight - uni.upx2px(220);
				}
			})

		},
		methods: {
			loadMore() {
                  alert('1')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.banner {
		width: 690rpx;
		height: 180rpx;
		margin: 20rpx 30rpx;
		border-radius: 10rpx;
	}

	.list_main {
		width: 100%;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>

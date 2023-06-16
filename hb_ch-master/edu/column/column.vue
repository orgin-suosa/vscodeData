<template>
	<view class="container">
		<view style="width: 100%;height: 1rpx;background-color:#F6F6F6;"></view>
		<scroll-view class="list_main" :style="{ height: clientHeight + 'px' }" scroll-y="true">
			<view class="list_main">
				<columnItem v-for="data in courseArr" :courseData="data"></columnItem>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import columnItem from '@/edu/column/components/column-item/column-item.vue'
	export default {
		components: {
			columnItem
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
				title: '栏目'
			})

			uni.getSystemInfo({
				success(res) {
					//228是title和tab的高度和
					that.clientHeight = res.windowHeight - res.statusBarHeight;
				}
			})

		},
		methods: {

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

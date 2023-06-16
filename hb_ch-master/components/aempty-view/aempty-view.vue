<template name="aempty-view">
	<view class="content-view" @click="itemClick">
		<image class="m-image-img" mode="aspectFill" src="https://qnsp.zcskjy.com/zc_images/images/empty.png" />
		<view class="m-title">{{showTitle}}</view>
	</view>
</template>

<script>
	export default {
		name: "aempty-view",
		props: {
			showTitle: {
				type: String,
				default: '暂无相关数据'
			},
			itemmodel: {
				type: Object,
				default () {
					return {
						title: '',
						img: '',
						source: '',
					}
				},
			},
		},
		data() {
			return {

			}
		},
		created: function() {

		},
		methods: {

			itemClick() {
				// console.log('---1---',this.itemmodel.id);
				// this.$emit('itemClick',{id:this.itemmodel.id});
			}
		}
	}
</script>


<style lang="scss" scoped>
	.content-view {

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		height: 400rpx;
		padding: 30rpx;
		// background-color: #0077AA;

		.m-image-img {
			height: 225rpx;
			width: 300rpx;
			// border-radius:10rpx;
			margin-bottom: 30rpx;
		}

		.m-title {
			height: 40rpx;
			line-height: 40rpx;
			font-size: 26rpx;
			// margin-top: 20rpx;
			font-weight: Medium;
			color: #999999;
			text-align: center;
			font-family: PingFangSC-Medium, PingFang SC;
		}

	}
</style>

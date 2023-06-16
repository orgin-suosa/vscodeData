<template>
	<view class="content-item-view">
		<view class="item-top-view" @click="btnClick(0)">
			<view class="m-top-title">{{ '行业异动次数' }} </view>
			<image class="m-image-img" mode="aspectFill" :src="stateImgArr[parseInt(stateIndex1)]" />
		</view>
		<view class="item-top-view" @click="btnClick(1)">
			<view class="m-top-title">{{ '行业涨跌幅' }} </view>
			<image class="m-image-img" mode="aspectFill" :src="stateImgArr[parseInt(stateIndex2)]" />
		</view>
		<view class="item-top-view" @click="btnClick(2)">
			<view class="m-top-title">{{ '主力资金流入' }} </view>
			<image class="m-image-img" mode="aspectFill" :src="stateImgArr[parseInt(stateIndex3)]" />
		</view>
	</view>
</template>

<script>
	export default {
		name: "marketsort",
		props: {
			// imageUrl1:'https://qnsp.zcskjy.com/zc_images/images/xiasanImg.png',
			// imageUrl2:'https://qnsp.zcskjy.com/zc_images/images/clearsanImg.png',
			// imageUrl3:'https://qnsp.zcskjy.com/zc_images/images/shangsanImg.png',
			stateIndex1:{
				type:Number ,
				default:1
			},
			stateIndex2:{
				type:Number ,
				default:1
			},
			stateIndex3:{
				type:Number ,
				default:1
			},
			itemmodel: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
			
				stateImgArr:[
					'https://qnsp.zcskjy.com/zc_images/images/xiasanImg.png',
					'https://qnsp.zcskjy.com/zc_images/images/clearsanImg.png',
					'https://qnsp.zcskjy.com/zc_images/images/shangsanImg.png',
				]
			};
		},
		methods: {

			btnClick(index){
				
				this.$emit("sortClick", {index:index});
			},
		},
	}
</script>

<style lang="scss" scoped>
	.content-item-view {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height: auto;
		padding: 5rpx 30rpx;
		background-color: #F9F9F9;
		
		.item-top-view {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			height: 75rpx;
			width: 200rpx;
		
			.m-top-title {
				height: 40rpx;
				line-height: 40rpx;
				color: #999999;
				text-align: left;
				width: auto;
				// background-color: red;
				font-size: 28rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
			}

			.m-image-img {
				height: 30rpx;
				width: 20rpx;
				margin-left: 10rpx;
				// background-color: red;
			}
		}

		
	}
</style>

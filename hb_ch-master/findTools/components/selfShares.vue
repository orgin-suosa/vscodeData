<template>
	<view class="addShares">
		<view class="img">
			<image style="width: 148rpx; height: 123rpx;" :src="picture" ></image>
		</view>
		<view class="content">
			<view class="">
				您还没有任何自选股票，
			</view>
			<view class="">
				导入自选股就可以开始排雷哦～
			</view>
		</view>
		<view class="button">
			<u-button shape="circle" size="normal" class="custom-style" @click="downLoad">
				<u-icon  name="https://qnsp.zcskjy.com/zc_images/findTools/downShares.png"></u-icon>
				<text class="text">导入股票</text>
			</u-button>
			<u-button shape="circle" size="normal" class="addBtn" @click="addStock">
				<u-icon  name="https://qnsp.zcskjy.com/zc_images/findTools/add.png"></u-icon>
				<text class="text">添加股票</text>
			</u-button>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				picture:`${getApp().globalData.qnUrl}/zc_images/findTools/noAccess.png`+ this.$FT.versionKey(),
			}
		},
		methods:{
			downLoad(val){
				uni.navigateTo({
					url:'/findTools/saoLeiBao/downShares'
				})
			},
			addStock(){
				this.$emit('toSelfSweep')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.addShares{
		text-align: center;
		.img{
			margin: 235rpx 0 20rpx 0;
		}
		.content{
			margin: 0 auto;
			font-size: 26rpx;
			font-weight: 400;
			color: #999999;
			margin-bottom: 234rpx;
		}
		.button{
			width: 520rpx;
			height: 90rpx;
			margin: 0 auto;
		}
		.custom-style{
			background: #FA6029 linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
			.u-icon{
				margin-right: 25rpx;
			}
			.text{
				font-size: 30rpx;
				font-weight: 500;
				color: #fff;
			}
		}
		.addBtn{
			border: 2px solid #FA6029;
			margin-top: 50rpx;
			.u-icon{
				margin-right: 25rpx;
			}
			.text{
				font-size: 30rpx;
				font-weight: 500;
				color: #FA6029;
			}
		}
	}
</style>
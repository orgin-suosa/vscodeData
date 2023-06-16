<template>
	<view class="videoDetails">
		<video id="myVideo" :src="videoUrl" :poster="cover" show-fullscreen-btn></video>
		<view class="mid_part">
			<view class="mid_part_left">
				<view class="title">{{ title }}</view>
				<view class="desc">{{time}}</view>
			</view>
			<view class="mid_part_right" @click="changeRates">
				<view style="text-align: center;">{{rateText}}</view>
			</view>
		</view>

		<aexplan-view style=""></aexplan-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time: '',
				title: '',
				videoUrl: '',
				cover: '',
				videoContext: null,
				rate: [0.5, 0.8, 1.0, 1.25, 1.5],
				ratePos: 2,
				rateText: '倍速',
			};
		},

		mounted() {
			this.videoContext = uni.createVideoContext('myVideo', this)
		},

		onLoad(event) {
			//获取真实新闻id，通常 id 来自上一个页面
			// if(event.linkUrl){
			// 	this.linkUrl = event.linkUrl
			// }


			if (event.title) {
				this.title = event.title;
				uni.setNavigationBarTitle({
					title: this.title
				})

			}
			if (event.url) {
				this.videoUrl = event.url;
			}
			if (event.time) {
				this.time = event.time;
			}
			if (event.cover) {
				this.cover = event.cover;
			}

		},

		methods: {
			changeRates() {
				//支持的倍率有 0.5/0.8/1.0/1.25/1.5
				// if (!this.showControl) {
				// 	return
				// }
				// this.hideDelay()
				let pos = this.ratePos + 1
				this.ratePos = pos
				this.videoContext.playbackRate(this.rate[pos % 5]);
				this.rateText = `倍速 ${this.rate[pos%5]}`
			},

		},
	};
</script>
<style lang="less" scoped>
	.videoDetails {
		uni-video {
			width: 750upx;
		}

		&-content {
			width: 100%;
			height: 300rpx;
			padding: 0 30upx;
			background: #333333;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		&-title {
			font-size: 32upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			flex: 3;
			color: #333333;

			.video-title {
				padding-top: 16upx;
			}
		}

		.createTime {
			font-size: 24upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
		}

		.classification {
			font-size: 26upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			padding-bottom: 100upx;
		}

		&-clause {
			padding: 0 30px;
			font-size: 26upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;

			.clause-title {
				font-size: 32upx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				padding-top: 48upx;
				color: #222222;
			}

			.clause-text {
				width: 690upx;
			}
		}

		/deep/ .uni-navbar__header-btns-left {
			uni-image {
				// width: 30upx !important;
				// height:60upx !important;
			}
		}
	}

	.mid_part {
		width: 100%;
		height: 160rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;

	}

	.mid_part_left {
		width: 80%;
		height: 100%;
		display: flex;
		padding-left: 30rpx;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.mid_part_right {
		width: 20%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.title {
		font-size: 32upx;
		font-weight: 500;
		color: #222222;
	}

	.desc {
		font-size: 28upx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #222222;
	}
</style>

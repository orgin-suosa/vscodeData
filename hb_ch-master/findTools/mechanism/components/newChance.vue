<template>
	<view class="newChance">
		<view class="newChance-content" v-if="newChance.length !== 0" v-for="(item, index) in newChance" :key="index">
			<view class="newChance-child" :class="item.visited ? 'pageVisited' : ''">
		<!-- 		<view class="top-tome">{{ item.ctime }}</view> -->
				<view class="newChance-child-text"  @click="navigateDetails(item)">
					<text class="top-tome">{{ item.ctime.substring(5, item.ctime.length) }}</text>
					<view class="newChance-child-top">
						<!-- <text class="top-tome">{{ item.ctime.substring(5, item.ctime.length) }}</text> -->
						<view class="top-title">{{ item.title }}</view>
					</view>
					<view class="newChance-child-bottom">
						<text>{{ item.previewcontent }}</text>
					</view>
				</view>
				
				<view class="interestRate">
					<view class="interestRate-list">
						<view class="interestRate-list-child" v-for="(key, i) in item.stocksInfo"  @click="sharesListClick(item.stocksInfo[i],item.authStatus,item.id)">
							<view v-if="!item.authStatus">****</view>
							<view v-else>{{key.zhongWenJianCheng }}</view>
							<view class="interestRate-rise" v-if="key.zhangFu > 0">+ {{key.zhangFu}} %</view>
							<view class="interestRate-down" v-else>{{key.zhangFu}} %</view>
						</view>
						
					</view>
				</view>
			</view>
			<view class="button-list">
				<view class="button-list-child" @click="priceClick" v-if="!item.authStatus">
					<image class="iconLock" :src="iconLock" mode=""></image>
					<text class="button-list-child-text">解锁查看全文</text>
				</view>
				<!-- <view class="button-list-child" v-else @click="navigateDetails(item.authStatus)">
          <text class="button-list-child-text">查看全文</text>
        </view> -->
			</view>
		</view>
		<noData class="noData" v-if="newChance.length == 0" noDataText="暂无数据"></noData>
	</view>
</template>

<script>
import noData from '@/components/no-data/index.vue';
	export default {
		components: {noData},
		props: {
			newChance: {
				type: Array,
				default () {
					return [];
				},
			},
			totalOrderStatus: {
				type: Boolean,
				default () {
					return true;
				},
			},
		},
		watch: {
			newChance: {
				handler(newName, oldName) {
					this.newChance = newName;
					console.log('newChance组件 ', this.newChance);
					this.$forceUpdate();
				},
				deep: true,
				immediate: true,
			},
		},
		data() {
			return {
				iconLock: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-lock.png`,
				interestRate:[
					{
						key:'易方达医药ETF',
						val:6.06
					},
					{
						key:'易方达医药ETF',
						val:6.06
					},
					{
						key:'易方达医药ETF',
						val:-6.06
					},
					{
						key:'易方达医药ETF',
						val:6.06
					},
					{
						key:'易方达医药ETF',
						val:6.06
					},
					{
						key:'易方达医药ETF',
						val:6.06
					},
					]
			};
		},
		onLoad() {},
		onUnload() {},
		methods: {
			priceClick() {
				this.$emit('priceClick');
			},
			navigateDetails(item) {
				console.log('navigateDetails', item);
				this.$emit('navigateDetails', item.id);
				//   uni.navigateTo({
				//     url: '/findTools/panZhongbao/introduce',
				//   });
			},
			// 0 深证SZ 1 上证SH 2 北交BJ
			sharesListClick(item,authStatus,id) {
				console.log("涨跌幅-sharesListClick",item)
				if(!authStatus){
					this.$emit('navigateDetails', id);
				}else{
					this.$emit('sharesListClick', item,authStatus,id);
				}
			},
		},
	};
</script>

<style lang="scss">
	@mixin text-line($line: 1) {
		overflow: hidden;
		text-overflow: ellipsis;
		/* #ifndef APP-NVUE */
		word-break: break-all;
		display: -webkit-box;
		white-space: normal;
		-webkit-line-clamp: $line;
		-webkit-box-orient: vertical;
		/* #endif */
		/* #ifdef APP-NVUE */
		lines: $line;
		/* #endif */
	}

	.newChance {
		.newChance-content {
			position: relative;
		}

		&-child {
			width: 690rpx;
			// height: 510rpx;
			background: #f1f3f8;
			border-radius: 20rpx;
			padding: 30rpx;
			padding-top: 10rpx;
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;
			flex-direction: column;
			box-sizing: border-box;
			margin-bottom: 40rpx;
			position: relative;

			&-top {
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				font-weight: 600;
				width: 100%;
				max-width: 100%;
				max-height: 90rpx;
				line-height: 42rpx;
				@include text-line(2);
				margin-bottom: 20rpx;

				.top-tome {
					font-size: 30rpx;
					font-family: DIN-Medium, DIN;
					font-weight: 500;
					color: #666666;
					padding-right: 15rpx;
				}
			}

			&-bottom {
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #666666;
				width: 100%;
				max-width: 100%;
				max-height: 72rpx;
				line-height: 37rpx;
				@include text-line(2);
			}
		}

		.button-list {
			position: absolute;
			bottom: -30rpx;
			left: 50%;
			transform: translateX(-50%);

			&-child {
				width: 230rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
				border-radius: 45px;
				font-size: 28rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #ffffff;

				.iconLock {
					width: 20rpx;
					height: 25rpx;
					vertical-align: baseline;
				}

				&-text {
					vertical-align: baseline;
					padding-left: 10rpx;
				}
			}
		}

		.interestRate {
			 margin-top: 18rpx;
			&-list {
				width: 690rpx;
				padding-bottom: 18rpx;
				overflow: hidden;
				&-child {
					width: 320rpx;
					height: 60rpx;
					padding: 0 10rpx;
					margin-right: 10rpx;
					margin-bottom: 10rpx;
					background: #FFFFFF;
					border-radius: 4rpx;
					font-size: 26rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #333333;
					display: flex;
					align-items: center;
					justify-content: space-between;
					float: left;
					box-sizing: border-box;
				}
			}
			&-rise,&-down{
				font-size: 30rpx;
				font-family: DIN-Medium, DIN;
				font-weight: 500;
				color: #F43D3E;
			}
			&-down{
				color: #00A846;
			}
		}

		.pageVisited {
			.newChance-child-top {
				color: #999999;

				.top-tome {
					color: #999999;
				}
			}
		}

		.newChance-child-bottom {
			color: #999999;
		}
	}
	.noData{
		margin-top: 100rpx;
	}
</style>

<template>
	<view class="panMouthDetail">
		<u-popup :closeOnClickOverlay="true" :show="show" mode="center"  @close="close">
			<view>
				<view class="title">{{panMouthdetailList.changeType}}</view>
				<view class="tips">{{panMouthdetailList.changeType}}：{{panMouthdetailList.changeDesc}}</view>
				<view class="level">异动次数（当日/上一日）</view>
				<view class="">
					{{panMouthdetailList.todayChangeCount}}次 / {{panMouthdetailList.yesChangeCount}}次
				</view>
				<view class="continue">
					连续两日异动个股
				</view>
				<view style="display: flex;justify-content: space-between;">
					<text v-for="item in panMouthdetailList.towDayIndusChgStockList" :key="item.stockName" style="color: #666666">{{item.stockName}}<text :style="item.stockIndex.indexOf('-') !== -1 ? 'color:#01933E' : ''" style="color: #E52D2A;font-weight: 500;margin-left:14rpx">{{item.stockIndex}}%</text></text>
				</view>
				<view class="selfStock">
					当日异动涉及个股相关信息
				</view>
				<view class="stockDetail" v-for="item in panMouthdetailList.todayIndusChgStockList" :key="item.stockCode" @click="toSelfStock(item)">
					<text style="color: #666666;margin-bottom: 29rpx;width: 33.33%;">{{item.stockName || '--'}}</text>
					<!-- {{item.stockIndex.indexOf('-') !== -1 ? item.stockIndex : '+'+item.stockIndex}} -->
					<text :style="item.stockIndex.indexOf('-') !== -1 ? 'color:#01933E' : ''" style="width:33.33%;color: #E52D2A;font-weight: 500;text-align: center;">{{item.stockIndex.indexOf('-') !== -1 ? Number(item.stockIndex).toFixed(2) + '%' : '+' + Number(item.stockIndex).toFixed(2) + '%'}}</text>
					<text style="width: 33.33%;color: #666666;text-align: right;">{{item.changeCount}}次</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default{
		props:{
			panMouthdetailList:{
				type:Object,
				default(){
					return {}
				}
			},
			day:{
				type:String,
				default:''
			},
			item_id:{
				type:String,
				default:''
			},
			product_id:{
				type:String,
				default:''
			}
		},
		data(){
			return{
				show:false,
				stockList:[
					{
						name:'华阳股份1',
						raise:'+9.88%',
						num:'12次'
						
					},
					{
						name:'华阳股份2',
						raise:'+9.88%',
						num:'12次'
						
					},
					{
						name:'华阳股份3',
						raise:'-9.88%',
						num:'12次'
						
					},
				]
			}
		},
		computed:{
			
		},
		onLoad(option){
			console.log('============',option.day);
		},
		created(){
		},
		methods:{
			close(){
				this.show = false
			},
			toSelfStock(item){
				console.log('=====',item);
				uni.navigateTo({
					url:'/ganhuo/eventDetail/selfStockChange?stockCode=' + item.stockCode + '&stockName=' + item.stockName + '&day=' + this.day + '&market=' + item.market + '&item_id=' + this.item_id + '&product_id=' + this.product_id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-popup__content{
		width: 500rpx;
		height: 900rpx;
		font-size: 28rpx;
		background: #FFFFFF;
		border-radius: 21px;
		overflow: auto;
		padding: 29rpx 34rpx 63rpx 34rpx;
	}
	.title{
		font-size: 34rpx;
		font-weight: 500;
		color: #000000;
		text-align: center;
		padding-bottom: 28rpx;
		border-bottom: 1rpx solid #F0F0F0;
	}
	.tips{
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		margin-top: 30rpx;
	}
	.stockDetail{
		width: 500rpx;
		display: flex;
		// align-items: center;
		justify-content: space-between;
	}
	.selfStock{
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
		margin: 30rpx 0 31rpx 0;
	}
	.continue{
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
		margin: 30rpx 0 13rpx 0;
	}
	.level{
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
		margin: 20rpx 0 14rpx 0;
	}
</style>
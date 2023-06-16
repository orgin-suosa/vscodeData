<template>
	<view class="">
		<u-navbar @leftClick="navBack" :is-fixed="true" title="盘口异动次数" rightIcon='share-square'  @rightClick="onShareBox" :border-bottom="false"> </u-navbar>
		<view class="content" >
			<view class="" v-if="stockList.length !== 0">
				<view class="panMouth1" v-for="item in stockList" v-show="item.type == 1" :key="item.changeName" @click="cliShowDetail(item)">
					<view class="title">
						<text class="">{{item.changeName}}</text> <text class="num">{{item.changeCount}}次</text>
					</view>
					<view class="detail">
						<view class="">
							<text style="width: 40rpx;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" class="detail-name">{{item.stockName}}</text><text class="detail-num">{{item.stockIndex}}%</text>
						</view>
						<view>
							<image class="detail-image" src="https://qnsp.zcskjy.com/zc_images%2FfindTools%2Fright-arrow.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<view class="" v-if="stockList.length !== 0">
				<view class="panMouth2" v-for="item in stockList" v-show="item.type == 2" :key="item.changeName" @click="cliShowDetail(item)">
					<view class="title">
						<text class="" style="width: 174rpx;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{item.changeName}}</text><text class="num">{{item.changeCount}}次</text>
					</view>
					<view class="detail">
						<view class="">
							<text class="detail-name">{{item.stockName}}</text>
							<text class="detail-num">{{item.stockIndex}}%</text>
						</view>
						<view>
							<image class="detail-image" src="https://qnsp.zcskjy.com/zc_images%2FfindTools%2Fright-arrow.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
			<view v-if="stockList.length == 0" class="no-data">
				<image class="icon_nodata" src="https://qnsp.zcskjy.com/zc_images/findPage/no-data.png" mode=""></image>
				<view>暂无相关数据</view>
			</view>
		<view class="tips">
			免责声明：本页面信息基于证券市场公开信息历史数据汇总，不代表未来趋势，仅供投资者参考，不构成投资分析、预测或者建议，投资者据此操作，风险自担。
		</view>
		<!-- 弹框 -->
		<panMouthDetail :day="day" :product_id="product_id" :item_id="item_id" :panMouthdetailList="panMouthdetailList" ref="panMouthDetail"/>
		<shareGApp :shareDataDefault="shareData" ref="shareGApp"></shareGApp>
	</view>
</template>

<script>
	import panMouthDetail from './panMouthDetail.vue';
	import shareGApp from '@/components/share-g-app.vue';
	import { mapState } from 'vuex'
	export default{
		components:{ panMouthDetail,shareGApp },
		data(){
			return{
				product_id:'',
				item_id:'',
				day:'',
				industryCode:'',
				// 存放上下两个数据
				upStockList:[],
				downStockList:[],
				panMouthdetailList:{},
				showDetail:false,
				shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg` + this.$FT.versionKey(),
				shareData:{},
				stockList:[
					// {
					// 	changeName:'火箭发射1',
					// 	changeCode:'498',
					// 	changeName:'华阳股份',
					// 	stockIndex:'+9.88%'
					// }
				]
			}
		},
		onLoad(option) {
			console.log(option);
			this.day = option.day
			this.industryCode = option.industryCode
			this.product_id = option.product_id
			this.item_id = option.item_id
			this.getPanMouthList()
		},
		computed:{
			...mapState(['Config','userInfo'])
		},
		methods:{
			getPanmouthDetail(changeCode){
				let params = {
					userId:this.userInfo.user_id,
					day:this.day,
					industryCode:this.industryCode,
					changeCode:changeCode
				}
				uni.request({
					url:this.Config.panMouthDetail,
					method:'GET',
					data:params,
					success:(res)=>{
						let { result } = res.data;
						console.log(result);
						this.panMouthdetailList = result
						this.$refs.panMouthDetail.show = true
					}
				})
			},
			navBack() {
			 //  console.log('盘中宝-back');
			  //  #ifdef  APP-PLUS
			  uni.navigateBack();
			  //  #endif
			
			  //  #ifdef  H5
			  history.back();
			  //  #endif
			},
			initShareData(){
				let that = this;
				
				let $href = that.$.sprintf('%s/h5/findTools/eventBao/index?', that.Config.SiteUrl, that.userInfo.user_id, '&showOpenApp=true');
				
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				$href = that.$.sprintf('%s/h5/findTools/eventBao/index?', that.Config.SiteUrl, that.userInfo.user_id, '&showOpenApp=true');
				// #endif
				// #ifdef MP-WEIXIN
				$href = '/h5/findTools/eventBao/index?';
				// #endif
			
				that.setData({
					shareData: {
						shareTitle: '事件宝',
						shareText: '聚合每日重要事件，实时了解市场动向',
						href: $href + 'item_id=' + that.item_id + '&product_id=' + that.product_id ,
						image: that.shareLogo,
					},
				});
				console.log('分享入参：', that.shareData);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			},
			onShareBox() {
				this.initShareData();
				// #ifndef MP-WEIXIN
				this.$refs.shareGApp.show();
				// #endif
			},
			// 点击去详情
			cliShowDetail(item){
				console.log('===========',item.changeCode);
				this.getPanmouthDetail(item.changeCode)
			},
			getPanMouthList(){
				let data = {
					userId:this.userInfo.user_id,
					day:this.day,
					industryCode:this.industryCode
				}
				uni.request({
					url:this.Config.panMouthList,
					method:'GET',
					data:data,
					success:(res)=>{
						console.log('============res',res);
						this.$FT.clearArr(this.stockList)
						let { result } = res.data;
						console.log(res);
						this.stockList = result
						this.upStockList = result?.filter((item)=>{
							return item.type == 1
						})
						this.downStockList = result?.filter((item)=>{
							return item.type == 2
						})
						console.log(this.upStockList);
						console.log(this.downStockList);
					}
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	.content{
		display: grid;
		/* align-items: center; */
		/* grid-template-rows: 1fr 1fr; */
		grid-template-columns: 1fr 1fr;
		padding: 20rpx 30rpx 40rpx 30rpx;
		padding-top: calc(44px + var(--status-bar-height));
	}
	.panMouth1,.panMouth2{
		/* width: 340rpx; */
		height: 140rpx;
		border-radius: 8rpx;
		padding: 20rpx 30rpx 0 30rpx;
		background-color: #E52D2A;
		color: #FFFFFF;
		.title{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 30rpx;
			font-weight: 600;
			margin-bottom: 25rpx;
		}
		.num{
			font-size: 25rpx;
		}
		.detail{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 24rpx;
			font-weight: 600;
			&-image{
				width: 13rpx;
				height: 23rpx;
			}
			&-name{
				margin-right: 15rpx;
			}
		}
	}
	.panMouth1{
		margin: 0rpx 10rpx 10rpx 0;
	}
	.panMouth2{
		margin-bottom: 10rpx;
		background-color: #01933E;
	}
	.tips{
		font-size: 22rpx;
		font-weight: 400;
		color: #999999;
		padding: 0rpx 30rpx 23rpx 30rpx;
	}
	.no-data {
	  background: #ffffff;
	  font-size: 26upx;
	  font-family: PingFangSC-Regular, PingFang SC;
	  font-weight: 400;
	  color: #999999;
	  text-align: center;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  padding:40rpx 0;
	  .icon_nodata {
	    width: 300upx;
	    height: 224upx;
	    margin: 0 auto;
	    margin-bottom: 50upx;
	  }
	}
</style>
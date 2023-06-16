<template>
	<view class="selfStockChange">
		<u-navbar @leftClick="navBack" :is-fixed="true" title="个股异动详情" rightIcon='share-square'  @rightClick="onShareBox" :border-bottom="false"> </u-navbar>
			<view class="titleInfo">
				<view class="title">
					<text @click="toHq(stockList)">{{stockList.stockName}} ({{stockList.stockCode}})</text>
					<text style="margin: 0 20rpx 0 42rpx;">{{stockList.stockPrice}}</text>
					<!-- :style="getColor ? 'color:#01933E' : ''" -->
					<text style="color: #FF3A3C;" :style="getColor ? 'color:#01933E' : ''">{{stockList.stockIndex}}%</text>
				</view>
				<view class="successNum">
					<view class="">
						<text>成交量：</text>
						<text class="value">{{Number(stockList.turnover).toFixed(2) || '--'}}万</text>
					</view>
					<view class="">
						<text>市盈：</text>
						<text class="value">{{Number(stockList.pe).toFixed(2) || '--'}}</text>
					</view>
					<view class="">
						<text>总市值：</text>
						<text class="value">{{getTotalMktValue || '--'}}亿</text>
					</view>
				</view>
				<view class="successNum" style="margin-bottom: 43rpx;">
					<view class="">
						<text>成交量：</text>
						<text class="value">{{Number(stockList.turnoverCount).toFixed(2) || '--'}}万</text>
					</view>
					<view class="">
						<text>市净：</text>
						<text class="value">{{Number(stockList.pb).toFixed(2) || '--'}}</text>
					</view>
					<view class="">
						<text>流通市值：</text>
						<text class="value">{{Number(stockList.cirMktValue).toFixed(2) || '--'}}亿</text>
					</view>
				</view>
				<view class="unusual">
					<view class="detail">
						异动分布详情
					</view>
					<view class="today">
						<view class="year time" @click="cliSelectTime">
							<text style="margin-right: 30rpx;">{{y}}</text>
							<image class="image" src="https://qnsp.zcskjy.com/zc_images/findTools/downArrowSelect.png" mode="">
						</view>
						<view class="month time" @click="cliSelectTime">
							<text style="margin-right: 33rpx;">{{mm}}</text>
							<image class="image" src="https://qnsp.zcskjy.com/zc_images/findTools/downArrowSelect.png" mode=""></image>
						</view>
						<view class="day time" @click="cliSelectTime">
							<text style="margin-right: 18rpx;">{{dd}}</text>
							<image class="image" src="https://qnsp.zcskjy.com/zc_images/findTools/downArrowSelect.png" mode=""></image>
						</view>
						<view class="btn" @click="findTableData">查询</view>
					</view>
					<view class="">
						<u-datetime-picker
							:show="show"
							v-model="today"
							mode="date"
							:closeOnClickOverlay="true"
							@close="close"
							@confirm="confirm"
							@cancel="cancel"
						></u-datetime-picker>
					</view>
				</view>
			</view>
			<!-- 上涨异动分布 -->
			<view class="spreadDetail" v-if="stockList.detail && stockList.detail.length !== 0">
				<view class="raiseUnusual">
					<text style="margin-left: 30rpx;">{{'上涨'}}异动分布</text>
				</view>
				<view class="tableData" v-if="list.type == 1" v-for="list,index in stockList.detail" :key="index">
					<view class="">
						<text>异动类型：</text>
						<text style="color: #FF3A3C;font-weight: 400;" :style="list.type == 2 ? 'color: #00A846;' : 'color : #FF3A3C;'">{{list.changeName || '--'}}</text>
					</view>
					<view class="">
						<text style="margin-right: 38rpx;">总次数：</text>
						<text style="margin-right: 103rpx;color: #333333;">{{ list.changeCount || '--' }}次</text>
						<text style="margin-right: 48rpx;">上涨异动成交量：</text>
						<text style="color: #333333;">{{list.changeTurnover || '--'}}</text>
					</view>
					<view class="dividedDetail">
						分笔详细
					</view>
					<spreadDetail ref="spreadDetail1" :list="list"/>
				</view>
			</view>
			<!-- 下跌异动分布 -->
			<view class="spreadDetail" v-if="stockList.detail && stockList.detail.length !== 0">
				<view class="showDownUnusual">
					<text style="margin-left: 30rpx;">{{'下跌'}}异动分布</text>
				</view>
				<view class="tableData" v-if="list.type == 2" v-for="list,index in stockList.detail" :key="index">
					<view class="">
						<text>异动类型：</text>
						<text style="color: #FF3A3C;font-weight: 400;" :style="list.type == 2 ? 'color: #00A846;' : 'color : #FF3A3C;'">{{list.changeName || '--'}}</text>
					</view>
					<view class="">
						<text style="margin-right: 38rpx;">总次数：</text>
						<text style="margin-right: 103rpx;color: #333333;">{{ list.changeCount || '--' }}次</text>
						<text style="margin-right: 48rpx;">上涨异动成交量：</text>
						<text style="color: #333333;">{{list.changeTurnover || '--'}}</text>
					</view>
					<view class="dividedDetail">
						分笔详细
					</view>
					<spreadDetail ref="spreadDetail1" :list="list"/>
				</view>
			</view>
			<!-- <spreadDetail ref="spreadDetail1" v-for="list,index in stockList.detail" :key="index" :list="list" /> -->
			<!-- 下跌异动分布 -->
			<!-- <spreadDetail :showDownData="true" :Downtotal="Downtotal" :tableList="relativeStockDownInfo"/> -->
			<view v-if="showLoading" class="loading">
				<text><image class="rotation" src="https://qnsp.zcskjy.com/zc_images/findTools/loadingLabel.png" mode=""></image></text><text>加载更多</text>
			</view>
			<view v-if="noData" class="no-data">
				<image class="icon_nodata" src="https://qnsp.zcskjy.com/zc_images/findPage/no-data.png" mode=""></image>
				<view>暂无相关数据</view>
			</view>
			<view class="tips">
				免责声明：本页面信息基于证券市场公开信息历史数据汇总，不代表未来趋势，仅供投资者参考，不构成投资分析、预测或者建议，投资者据此操作，风险自担。
			</view>
			
			<shareGApp :shareDataDefault="shareData" ref="shareGApp"></shareGApp>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import spreadDetail from './spreadDetail.vue';
	import shareGApp from '@/components/share-g-app.vue';
	export default{
		components:{spreadDetail,shareGApp},
		data(){
			return{
				noData:false,
				product_id:'',
				item_id:'',
				market:'',
				shareData:{},
				getColor:false,
				timme:'',
				stockList:[],
				pageNum:1,
				showLoading:false,
				y:'',
				mm:'',
				dd:'',
				show:false,
				todayTime:'',
				Uptotal:0,
				Downtotal:0,
				today: Number(new Date()),
				shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg` + this.$FT.versionKey(),
				relativeStockUpInfo: {
				  theadList: [
				    {
				      id: 'nameCode',
				      name: '时间',
				    },
				    {
				      name: '详细信息',
				      id: 'totalScore',
				    },
				    {
				      name: '价格',
				      id: 'totalCheckItems',
				    },
				    {
				      name: '涨跌幅',
				      id: 'safetyItems',
				    },
				    {
				      name: '成交量(手)',
				      id: 'riskItems',
				    },
				  ],
					fixedTB: [
				    {
				      nameCode: {
				        val: '--',
				        // val2: '--',
				        type: 'normal',
				        icon: '',
				        val2Color: '#999999',
				      },
				      totalScore: {
				        val: '--',
				        type: 'normal',
				        fontColor: '#FF3A3C',
				      },
				      totalCheckItems: {
				        val: '--',
				        type: 'normal',
						fontColor: '#FF3A3C',
				      },
				      safetyItems: {
				        val: '--',
				        type: 'normal',
						fontColor: '#FF3A3C',
				      },
				      riskItems: {
				        val: '--',
				        type: 'normal',
				        fontColor: '#999999',
				      },
				    },
				  ],
				},
			}
		},
		created() {
			// 一上来默认当天
		   	this.todayTime = this.$FT.getFindTime(new Date().getTime())
		   	this.y = this.todayTime.substring(0,4)
		   	this.mm = this.todayTime.substring(5,7)
		   	this.dd = this.todayTime.substring(8,10)
			this.timme = this.y + this.mm + this.dd
		},
		onLoad(option) {
			this.name = option.stockName
			this.code = option.stockCode
			this.market = option.market
			this.day = option.day
			this.product_id = option.product_id,
			this.item_id = option.item_id,
			console.log('========this.timme',this.todayTime);
			// 清除数据
			this.$FT.clearArr(this.relativeStockUpInfo.fixedTB);
			this.getUpTableData()
		},
		computed:{
			...mapState(['Config','userInfo']),
			scrollHeight: function () {
			  let sys = uni.getSystemInfoSync();
			  let winWidth = sys.windowWidth;
			  let winrate = 750 / winWidth;
			  let winHeight = parseInt(sys.windowHeight * winrate);
			  return winHeight;
			},
			getTotalMktValue(){
				console.log(this.stockList.totalMktValue);
				return Number(this.stockList.totalMktValue).toFixed(2)
			}
		},
		methods:{
			toHq(data) {
			  console.log('222model=======>',data);
			  const that = this;
			  let { market } = this;
			  if (data) {
			    let { stockName, stockCode } = data;
			    let setcode;
			    if (market == 0 || market == 4) {
			      setcode = 1;
			    } else if (market == 1 || market == 3) {
			      setcode = 0;
			    } else {
			      setcode = market;
			    }
			    let baseUrl = that.Config.ApiUrl;
			    let urls = baseUrl + '/hq-H5/h5/index.html#/page_detail/page-detail/page-detail?code=' + stockCode + '&setcode=' + setcode + '&stockName=' + stockName;
			    // #ifdef H5
			    window.location.href = urls;
			    // #endif
			
			    //#ifdef APP-PLUS
			    uni.navigateTo({
			      url: `/my/webview/webview_live?url=${urls}`,
			    });
			    // #endif
				console.log('====333',urls);
			  }
			},
			// 查询指定日期数据
			findTableData(){
				this.day = this.timme
				this.getUpTableData()
			},
			// 获取上表格数据
			getUpTableData(){
				let params = {
				  userId: this.userInfo.user_id,
				  day:this.day,
				  stockCode:this.code,
				  stockName:this.name
				};
				let that = this;
				uni.request({
				  url: that.Config.selfStockList,
				  method: 'get',
				  dataType: 'jsonp',
				  data: params,
				  success: (res) => {
					this.showLoading = false
				    const { result } = JSON.parse(res.data);
					console.log('result==========>',result);
					if(result.detail.length == 0){
						this.noData = true
					}else{
						this.noData = false
					}
					this.stockList = result
					console.log(this.stockList.stockIndex.indexOf('-'));
					if (this.stockList.stockIndex.indexOf('-') !== -1) {
					    this.getColor = true
					}else{
						this.getColor = false
					}
				  },
				});
			},
			cliSelectTime(){
				this.show = true
			},
			confirm(val){
				this.todayTime = this.$FT.getFindTime(val.value)
				this.y = this.todayTime.substring(0,4)
				this.mm = this.todayTime.substring(5,7)
				this.dd = this.todayTime.substring(8,10)
				this.timme = this.y + this.mm + this.dd
				this.show = false
			},
			close(){
				this.show = false
			},
			cancel(){
				this.show = false
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
			onShareBox() {
				this.initShareData();
				// #ifndef MP-WEIXIN
				this.$refs.shareGApp.show();
				// #endif
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
						href: $href + 'item_id=' + that.item_id + '&product_id=' + that.product_id,
						image: that.shareLogo,
					},
				});
				console.log('分享入参：', that.shareData.href);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			},
		}
	}
</script>

<style lang="scss" scoped>
	.titleInfo{
		padding:30rpx 0 0 30rpx;
		padding-top: calc(44px + var(--status-bar-height));
	}
	.selfStockChange{
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		background-color: #fff;
	}
	.successNum{
		display: flex;
		justify-content: space-between;
		margin-bottom: 10rpx;
		margin-right: 36rpx;
	}
	.title{
		font-size: 32rpx;
		font-weight: 600;
		color: #333333;
		margin-bottom: 30rpx;
	}
	.unusual{
		font-size: 28rpx;
		font-weight: 600;
		margin-bottom: 26rpx;
		color: #333333;
	}
	.time{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 160rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 8rpx;
		border: 1rpx solid #CCCCCC;
		margin-right: 20rpx;
	}
	.month,
	.day{
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 8rpx;
		text-align: center;
		border: 1rpx solid #CCCCCC;
	}
	.today{
		display: flex;
		margin-top: 26rpx;
	}
	.btn{
		width: 120rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		color: #fff;
		background: #D8D8D8 linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
		border-radius: 8rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		margin-left: 124rpx;
	}
	.image{
		width: 23rpx;
		height: 13rpx;
	}
	.tips{
		font-size: 22rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		padding: 24rpx 30rpx 23rpx 30rpx;
	}
	.loading{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 54rpx;
	}
	@-webkit-keyframes rotation {
		from {
			-webkit-transform: rotate(0deg);
		}
		to {
			-webkit-transform: rotate(360deg);
		}
	}
	.rotation {
		width: 29rpx; 
		height:24rpx;
		margin-right: 8rpx;
		-webkit-transform: rotate(360deg);
		animation: rotation 16s linear infinite;
		-moz-animation: rotation 1s linear infinite;
		-webkit-animation: rotation 1s linear infinite;
		-o-animation: rotation 1s linear infinite;
	}
	.value{
		font-size: 24rpx;
		font-weight: 500;
		color: #333333;
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
	.raiseUnusual{
		height: 60rpx;
		line-height: 60rpx;
		background-color: #FFF5F5;
		font-size: 28rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FF3A3C;
		margin-top: 27rpx;
	}
	.showDownUnusual{
		color: #00A846;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 28rpx;
		font-weight: 500;
		margin-top: 27rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		background-color: #E9FFF2;
	}
	.tableData{
		margin-top: 21rpx;
		margin-left: 30rpx;
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
	}
	.dividedDetail{
		font-size: 26rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		margin-top: 20rpx;
		margin-bottom: 10rpx;
	}
</style>
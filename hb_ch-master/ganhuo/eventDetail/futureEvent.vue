<template>
	<view class="content">
		<scroll-view class="articleDetail-scroll" :style="{ height: scrollHeight + 'rpx' }" scroll-y="true">
			<toolTemplate
			  :title="title"
			  titleStyle="color:#fff;font-weight: 600;font-size: 36rpx;"
			  :subsectionList="[]"
			  :shareDataDefault="shareData"
			  @rightClick="onShareBox" 
			  @navBack="navBack"
			  @toLower="toLower"
			  @listScroll="listScroll"
			>
			    <template slot="content-top">
					<view class="navbar_title">{{title}}</view>
					<view class="nav-content" :style="isApp ? 'top: 200rpx' : ''" style="color: #fff">
					  <view class="title">
						<text class="title-first">{{ stockInfo.blockName == null || stockInfo.blockName == undefined ? '--' : stockInfo.blockName}} :</text> <text class="title-end" :class="getRaiseVal ? 'title-down' : ''">{{ stockInfo.blockIndex == null || stockInfo.blockIndex == undefined ? '--' : Number(stockInfo.blockIndex).toFixed(2)}}%</text>
					  </view>
					  <view class="content1">
					    <text class="up">上涨： <text style="color: #ff072d; margin-left: 6rpx">{{ stockInfo.upNumber}}</text><text style="margin-left: 6rpx">个</text></text>
					    <text class="down">下跌：<text style="color: #00a846; ">{{ stockInfo.downNumber}}</text> <text style="margin-left: 6rpx">个</text> </text>
					    <text class="up">{{ stockInfo.lable }}：{{ stockInfo.limitNumber}}<text style="margin-left: 6rpx">个</text></text>
					  </view>
					</view>
				</template>
				<template slot="conten-center">
					<view class="relativeStockNum">
						<text>相关股票：</text><text style="color: #FF072D;">{{relativeStockNum}}</text>个
					</view>
					<!-- 表格内容 -->
					<scrolTable :title="title" :tableList="title == '未来大事' ? relativeStockInfo : eventInfo" @itemClick="itemClick" @changeDateDown="changeDateDown" @changeDateUp="changeDateUp" @changeDateDown1="changeDateDown1" @changeDateUp1="changeDateUp1" />
					<view v-if="showLoading" class="loading">
						<text><image class="rotation" src="https://qnsp.zcskjy.com/zc_images/findTools/loadingLabel.png" mode=""></image></text><text>加载更多</text>
					</view>
					<view class="bottomContent">
						免责声明：本页面信息基于证券市场公开信息历史数据汇总，不代表未来趋势，仅供投资者参考，不构成投资分析、预测或者建议，投资者据此操作，风险自担。
					</view>
					
					<!-- 弹窗 -->
					<u-popup :show="show" mode="center" :closeOnClickOverlay="true" :round="10" @close="close" @open="open">
						<view class="popup">
							<view class="popupTitle">概念解析详情</view>
							<view class="popupContent">{{popupContent}}</view>
							<view class="">
								<button class="closeBtn" @click="closePopup">关闭</button>
							</view>
							<view class="closeBox" @click="closePopup">
								<image class="closeLable" src="https://qnsp.zcskjy.com/zc_images/findTools/closeLable.png" mode=""></image>
							</view>
						</view>
					</u-popup>
				</template>
			</toolTemplate>
		</scroll-view>
	</view>
</template>

<script>
	import toolTemplate from '@/findTools/toolTemplate/index.vue';
	import scrolTable from '../components/scrolTable.vue';
	import { mapState } from 'vuex';
	export default{
		components:{ toolTemplate,scrolTable },
		data(){
			return{
				item_id:'',
				product_id:'',
				indexSort:'',
				marketValueSort:'',
				isApp:false,
				isH5: false,
				android: false,
				isios: false,
				lastPage:0,
				bkCode:'',
				name:'',
				code:'',
				showLoading:false,
				pageNum:1,
				totalPage:2,
				popupContent:'',
				show:false,
				title:'未来大事',
				stockInfo:{
					blockName:'',
					downNumber:0,
					limitNumber:0,
					upNumber:0,
					blockIndex:"",
					lable:'涨停'
				},
				shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg` + this.$FT.versionKey(),
				relativeStockNum:0,
				systemInfo:{},
				bottomHeight:0,
				bottomTop:0,// 距离顶部高度
				isLoadData:true,
				timer:null,
				shareData:{},
				relativeStockInfo: {
				  theadList: [
				    {
				      id: 'nameCode',
				      name: '股票名称',
				    },
				    {
				      name: '现价（元）',
				      id: 'totalScore',
				    },
				    {
				      name: '最新涨跌幅',
				      id: 'totalCheckItems',
				    },
				    {
				      name: '概念解析',
				      id: 'safetyItems',
				    },
				    {
				      name: 'A股流通市值（亿）',
				      id: 'riskItems',
				    },
				  ],
						fixedTB: [
				    {
				      nameCode: {
				        val: '--',
				        val2: '--',
				        type: 'normal',
				        icon: '',
				        val2Color: '#999999',
				      },
				      totalScore: {
				        val: '--',
				        type: 'normal',
				        fontColor: '#F43D3E',
				      },
				      totalCheckItems: {
				        val: '--',
				        type: 'normal',
				      },
				      safetyItems: {
				        val: '--',
				        type: 'normal',
				      },
				      riskItems: {
				        val: '--',
				        type: 'normal',
				        fontColor: '#24B842',
				      },
				    },
				  ],
				},
				eventInfo: {
				  theadList: [
				    {
				      id: 'nameCode',
				      name: '股票名称',
				    },
				    {
				      name: '现价（元）',
				      id: 'totalScore',
				    },
				    {
				      name: '最新涨跌幅',
				      id: 'totalCheckItems',
				    },
				    {
				      name: '概念解析',
				      id: 'safetyItems',
				    },
				  ],
					fixedTB: [
				    {
				      nameCode: {
				        val: '--',
				        val2: '--',
				        type: 'normal',
				        icon: '',
				        val2Color: '#999999',
				      },
				      totalScore: {
				        val: '--',
				        type: 'normal',
				        fontColor: '#F43D3E',
				      },
				      totalCheckItems: {
				        val: '--',
				        type: 'normal',
				      },
				      safetyItems: {
				        val: '--',
				        type: 'normal',
				      },
				      // riskItems: {
				      //   val: '--',
				      //   type: 'normal',
				      //   fontColor: '#24B842',
				      // },
				    },
				  ],
				},
			}
		},
		created() {
		},
		watch:{
			'eventInfo.fixedTB':{
				handler(nv,ov){
					console.log('222======nv',nv,ov);
				},
				deep: true,
				immediate: true,
			}
		},
		onLoad(option) {
			// #ifdef APP-PLUS
			this.isApp = true
			// #endif
			// 如果是掘金的话，需要修改标题,修改平盘			
			console.info("---option-123--",option);
			if(option.fromType){
			    this.title = '事件掘金';
				this.fromType =  option.fromType;
				this.bkCode = option.blockCode;
			}else{
				this.title = '未来大事'
			}
			
			if(this.timer){
				clearTimeout(this.timer);
			}
			this.systemInfo = uni.getSystemInfoSync();
			console.log("systemInfo",this.systemInfo)
			this.$FT.clearArr(this.relativeStockInfo.fixedTB);
			this.$FT.clearArr(this.eventInfo.fixedTB);
			this.name = option.blockName
			this.code = option.blockCode
			this.product_id = option.product_id
			this.item_id = option.item_id
			// 还需要接收上一个页面的2个参数
			this.getRelativeStock()
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
			getRaiseVal() {
			  if (this.stockInfo.blockIndex.indexOf('-') !== -1) {
			    return true;
			  } else {
			    return false;
			  }
			},
		},
		methods:{
			getSystem() {
			  let that = this;
			  let port = uni.getSystemInfoSync().platform;
			  const ua = navigator.userAgent.toLowerCase();
			  const isWeChat = ua.indexOf('micromessenger') !== -1;
			 console.log('port====',port);
			  switch (port) {
			    case 'android':
			      that.android = true;
			      console.log('运行Android上', port); //android
			      break;
			    case 'ios':
			      if (isWeChat) {
			        wxClose();
			      }
			
			      that.isios = true;
			      console.log('运行iOS上', port); // ios
			      break;
			    default: //devtools
			      console.log('运行在开发者工具上');
			      break;
			  }
			},
			toLower(){
				const that=this;
				that.timer  = setTimeout(() => {
				  //需要定时执行的代码
				  that.isLoadData = true;
				  console.debug("Hello World",that.isLoadData);
				  }, 600)
		
			},
			listScroll(e) {
				const that=this;
				const query = uni.createSelectorQuery().in(this);
			    const scrollTop = e.detail.scrollTop;
				let BottomPageNum = 20 * that.pageNum;
				query.select('.bottomContent').boundingClientRect(data => {
					that.setData({
						bottomHeight: data.height + BottomPageNum,
						bottomTop:data.top
					});
				}).exec();
				if( this.bottomTop - this.systemInfo.safeArea.bottom < 0 && this.isLoadData){
					this.tablePaging();
				}
			
			},
			tablePaging(){
				let that = this;
				if(that.isLoadData){
					that.showLoading = true;
					that.isLoadData = false;
					that.pageNum++;
					if(	that.pageNum <= that.totalPage && that.pageNum !== that.lastPage ){
						// that.getRelativeStock();
						if(!this.bkCode){
							this.getFutureList()
						}else{
							that.getEventList()
						}
					}else {
						that.showLoading = false;
					}
				}
			
			},
			open(){
				this.show = true
			},
			closePopup(){
				// 关闭弹窗
				this.show = false
			},
			close(){
				this.show = false
			},
			// 点击的时候展示对应的弹窗
			itemClick(model,index){
				if(index == 3){
					console.log(model.safetyItems.val);
					this.popupContent = model.safetyItems.val
					this.open()
				}
				if(index == 0){
					this.toHq(model);
				}
			},
			toHq(data) {
				console.log('model=======>',data);
			  const that = this;
			  if (data.nameCode) {
			    let { val, val2, market } = data.nameCode;
			    let setcode;
			    if (market == 0 || market == 4) {
			      setcode = 1;
			    } else if (market == 1 || market == 3) {
			      setcode = 0;
			    } else {
			      setcode = market;
			    }
			    let baseUrl = that.Config.ApiUrl;
			    let urls = baseUrl + '/hq-H5/h5/index.html#/page_detail/page-detail/page-detail?code=' + val2 + '&setcode=' + setcode + '&stockName=' + val;
			    // #ifdef H5
			    window.location.href = urls;
			    // #endif
			
			    //#ifdef APP-PLUS
			    uni.navigateTo({
			      url: `/my/webview/webview_live?url=${urls}`,
			    });
			    // #endif
			  }
			},
			changeDateDown(){
				this.pageNum = 1
				// 排序调接口传递正序倒叙即可
				this.indexSort = 'desc'
				this.marketValueSort = ''
				this.$FT.clearArr(this.relativeStockInfo.fixedTB)
				this.getRelativeStock()
			},
			changeDateUp(){
				this.pageNum = 1
				this.indexSort = 'asc'
				this.marketValueSort = ''
				this.$FT.clearArr(this.relativeStockInfo.fixedTB)
				this.getRelativeStock()
			},
			changeDateDown1(){
				this.pageNum = 1
				// 排序调接口传递正序倒叙即可
				this.indexSort = ''
				this.marketValueSort = 'desc'
				this.$FT.clearArr(this.eventInfo.fixedTB)
				this.getRelativeStock()
			},
			changeDateUp1(){
				this.pageNum = 1
				this.indexSort = ''
				this.marketValueSort = 'asc'
				this.$FT.clearArr(this.eventInfo.fixedTB)
				this.getRelativeStock()
			},
			navBack(){
				//  #ifdef  APP-PLUS
				uni.navigateBack();
				//  #endif
				//  #ifdef  H5
				history.back();
				//  #endif
			},
			getEventList(){
				console.log('============this.indexEvent',this.indexEvent);
				let params = {
				  index:this.indexSort,
				  userId:this.userInfo.user_id,
				  fromType: this.fromType,
				  bkCode: this.bkCode,
				  pageNum:this.pageNum,
				  pageSize:"20"
				};
				let that = this;
				uni.request({
				  url: that.Config.eventList,
				  method: 'get',
				  dataType: 'jsonp',
				  data: params,
				  success: (res) => {
				    const {result} = JSON.parse(res.data);
					console.log('222===========result',result.list);
					this.showLoading = false
				    let scoreColor = '#24B842';
					// this.stockInfo = result
					this.stockInfo = Object.assign({},{
						blockName:result.bkName,
						downNumber:result.bkInfo.xiaDieNum,
						limitNumber:result.bkInfo.pingPanNum,
						upNumber:result.bkInfo.shangZhangNum,
						blockIndex:result.bkInfo.banKuaiZhangFu + '',
						lable:'平盘'
					})
					console.log('this.stockInfo=====>',this.stockInfo);
					this.relativeStockNum = result?.total;
					this.totalPage = (result?.total / result.pageSize).toFixed(0);
					this.lastPage = result.pageNum
					console.log('222===========result?.list',result?.list);
				    result?.list.forEach(function (item, i, array) {
						console.log('222====item',item);
				      that.eventInfo.fixedTB.push({
				        nameCode: {
				          val: item.name || '--',
				          val2: item.code || '--',
				          type: 'normal',
				          icon:'创',
				          market: Number(item.market),
				          val2Color: '#999999',
				        },
				        totalScore: {
				          val: item.zuiXinJia,
				          type: 'normal',
				          fontColor: '#333333',
				        },
				        totalCheckItems: {
				          val: item.zhangFu.toFixed(2).indexOf('-') !== -1 ? item.zhangFu.toFixed(2) + '%' : '+' + item.zhangFu.toFixed(2)  + '%',
				          type: 'normal',
						  fontColor: '#FF072D',
				        },
				        safetyItems: {
				          val: item.reason || '--',
				          type: 'normal',
						  fontColor: '#333333',
						  show:true
				        },
				        riskItems: {
				          val: '--',
				          type: 'normal',
				          fontColor: '#000000',
				        },
				      });
				    });
					console.log('222=========',that.eventInfo.fixedTB);
				  }
				});
			},
			getFutureList(){
				let params = {
				  index:this.indexSort,
				  marketValue:this.marketValueSort,
				  userId: this.userInfo.user_id,
				  blockCode:this.code,
				  blockName:this.name,
				  pageNum:this.pageNum,
				  pageSize:"20"
				};
				let that = this;
				uni.request({
				  url: that.Config.futureBigEvent,
				  method: 'get',
				  dataType: 'jsonp',
				  data: params,
				  success: (res) => {
				    const data = JSON.parse(res.data);
					const result = data.result;
					this.showLoading = false
				    let scoreColor = '#24B842';
					this.stockInfo = result;
					this.stockInfo.lable = '涨停';
					this.relativeStockNum = result?.stockCount;
					this.totalPage = result?.stockList.totalPage;
				    result?.stockList?.list.forEach(function (item, i, array) {
				      that.relativeStockInfo.fixedTB.push({
				        nameCode: {
				          val: item.stockName,
				          val2: item.stockCode,
				          type: 'normal',
				          icon:'创',
				          market: Number(item.market),
				          val2Color: '#999999',
				        },
				        totalScore: {
				          val: item.stockPrice,
				          type: 'normal',
				          fontColor: '#333333',
				        },
				        totalCheckItems: {
				          val: Number(item?.stockIndex)?.toFixed(2).indexOf('-') !== -1 ? (Number(item?.stockIndex)?.toFixed(2) + '%') : ('+' + Number(item?.stockIndex)?.toFixed(2) + '%'),
				          type: 'normal',
						  fontColor: '#FF072D',
				        },
				        safetyItems: {
				          val: item.remark,
				          type: 'normal',
						  fontColor: '#333333',
						  show:true
				        },
				        riskItems: {
				          val: item.marketValue,
				          type: 'normal',
				          fontColor: '#000000',
				        },
				      });
				    });
				  }
				});
			},
			onShareBox() {
				let that = this;
				console.log('==========',that.item_id,that.product_id);
				console.log('==========',that.code,that.name);
				let $href = that.$.sprintf('%s/h5/findTools/eventBao/index?', that.Config.SiteUrl, that.userInfo.user_id,'&showOpenApp=true');
				
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				$href = that.$.sprintf('%s/h5/findTools/eventBao/index?', that.Config.SiteUrl, that.userInfo.user_id, '&showOpenApp=true');
				// #endif
				// #ifdef MP-WEIXIN
				$href = '/h5/findTools/eventBao/index?';
				// #endif
				that.setData({
					shareData: {
						shareTitle: that.title,
						shareText: '600位记者7*24小时获取独家资讯机构、私募都在使用的A股超短热点题材宝库',
						href: $href + 'item_id=' + that.item_id + '&product_id=' + that.product_id,
						image: that.shareLogo,
					},
				});
				console.log('分享入参：', that.shareData.href);
				// // #ifndef MP-WEIXIN
				// this.$refs.shareBoxApp.show();
				// // #endif
			},
			getRelativeStock(){
				if(!this.bkCode){
					this.$FT.clearArr(this.relativeStockInfo.fixedTB);
					console.log('222========未来');
					this.getFutureList()
				}else{
					this.$FT.clearArr(this.eventInfo.fixedTB)
					console.log('222========掘金');
					this.getEventList()
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	@import '@/styles/findPage/eventBao.scss';
	.relativeStockNum{
		padding: 30rpx 0 41rpx 0;
	}
	.bottomContent{
		font-size: 22rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		padding: 24rpx 0 23rpx 0;
	}
	/deep/ .u-popup__content{
		position: relative;
		width: 560rpx;
		/* height: 470rpx; */
		background: #FFFFFF;
		border-radius: 21px;
	}
	.popup{
		margin: 52rpx 42rpx 36rpx 42rpx;
	}
	.popupTitle{
		text-align: center;
		font-size: 34rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #000000;
		padding-bottom: 18rpx;
	}
	.popupContent{
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
		margin-bottom: 18rpx;
	}
	.closeBtn{
		width: 346rpx;
		height: 80rpx;
		line-height: 80rpx;
		background: linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
		border-radius: 40px;
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #FFFFFF;
	}
	.closeLable{
		width: 70rpx;
		height: 70rpx;
	}
	.closeBox{
		position: absolute;
		bottom: -92px;
		left: 50%;
		transform: translate(-50%, -50%);
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
	.navbar_title{
		color:#fff;
		font-weight: 600;
		font-size: 36rpx;
		position: absolute;
		top: calc(8px + var(--status-bar-height));
		left: 50%;
		transform: translateX(-50%);
	}
	.nav-content{
		  position: absolute;
		  top: 120rpx;
		  left: 30rpx;
		  .title{
			  display: flex;
			  align-items: center;
			  font-size: 40rpx;
			  font-weight: 600;
			  font-family: PingFangSC-Semibold, PingFang SC;
			  color: #FFFFFF;
			  letter-spacing: 1rpx;
		  }
		  .title-end{
			  font-size: 50rpx;
			  font-weight: bold;
			  color: #FF3A3C;
			  margin-left: 27rpx;
		  }
		  .title-down{
			  color: #00A846;
		  }
		  .content1{
			  width: 700rpx;
			  display: flex;
			  align-items: center;
			  justify-content: space-between;
			  font-size: 32rpx;
			  font-weight: 600;
			  color: #FFFFFF;
		  }
	}
</style>
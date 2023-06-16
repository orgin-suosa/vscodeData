<template>
	<view class="description">
		<u-tabs
		  class="uTabs"
		  :current="tabCurrent"
		  :list="topNavList"
		  lineColor="#F43D3E"
		  :scrollable="true"
		  :activeStyle="{
		    color: '#F43D3E',
		    fontWeight: '700',
		    transform: 'scale(1.05)'
		  }"
		  itemStyle="padding-left: 27rpx; padding-right: 27rpx; height: 88rpx;"
		  @change="firstTabChange"
		>
		</u-tabs>
		<!-- :poster="coverImg" -->
		<video ref="myVideo" id="myVideo" :src="result.level0[tabCurrent].videoUrl"  show-fullscreen-btn x5-video-player-fullscreen="true" :poster="result.level0[tabCurrent].videoCover"></video>
		
		<view class="" style="padding-bottom:20rpx">
			<view class="algorithm">
				<view class="algorithm-title">{{result.name}}</view>
				<view class="algorithm-content">
					{{result.content}}
				</view>
				
			</view>
			<view class="anquanTips">
				结果仅供参考，不构成投资建议，不代表未来趋势。投资者需依赖自身独立判断进行投资决策。股市有风险，投资需谨慎。
			</view>
			<!-- 内容区 -->
			<view class="background-img">
				<view class="bgc"></view>
				<view class="bgc1">
					<view class="">
						<view class="trade-title">{{result.level0[tabCurrent].name2}}</view>
						<view class="" v-for="(item,index) in result.level0[tabCurrent].level1" :key="index">
							<view class="title">
								{{item.name}}
							</view>
							<view class="content" v-show="item.level2.length == 0">
								{{ item.content }}
							</view>
							<view v-show="item.level2.length !== 0" class="content" v-for="(i,index1) in item.level2" :key="index1">
								<view class="">
									{{ i.name }}
								</view>
								<view class="">
									{{ i.content }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- <view class="line"></view> -->
		<!-- <view class="trade">
			<view class="" v-if="tabCurrent === 0">
				<image style="width: 100%; height: auto" :src="trade1" mode="widthFix"></image>
				<image :lazy-load="true" style="width: 100%; height: auto" :src="trade2" mode="widthFix"></image>
				<image :lazy-load="true" style="width: 100%; height: auto" :src="trade3" mode="widthFix"></image>
			</view>
			<view class="" v-if="tabCurrent === 1">
				<image style="width: 100%; height: auto" :src="market1" mode="widthFix"></image>
				<image :lazy-load="true" style="width: 100%; height: auto" :src="market2" mode="widthFix"></image>
				<image :lazy-load="true" style="width: 100%; height: auto" :src="market3" mode="widthFix"></image>
			</view>
			<view class="" v-if="tabCurrent === 2">
				<image style="width: 100%; height: auto" :src="finance1" mode="widthFix"></image>
				<image :lazy-load="true" style="width: 100%; height: auto" :src="finance2" mode="widthFix"></image>
				<image :lazy-load="true" style="width: 100%; height: auto" :src="finance3" mode="widthFix"></image>
			</view>
			<view class="" v-if="tabCurrent === 3">
				<image style="width: 100%; height: auto" :src="credit" mode="widthFix"></image>
			</view>
			<view class="" v-if="tabCurrent === 4">
				<image style="width: 100%; height: auto" :src="delisted" mode="widthFix"></image>
			</view>
		</view> -->
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import toolTemplate from '../toolTemplate/index.vue';
	export default{
		components:{ },
		data(){
			return{
				// 视频暂停播放
				videoPauseShow: true,
				tabCurrent:0,
				result:{
					name:'- 避雷宝算法 -',
					content:'避雷宝基于公司历史客观数据，对公司的交易类风险、市场类风险、财务类风险、信用类风险、ST和退市风险五个风险维度进行综合分析，扫描了80个风险项，覆盖200多个风险指标，汇总得出个股总体风险量化标签。',
					level0:[
						{
							name1: '交易风险',
							name2: '交易类风险',
							videoUrl:`${getApp().globalData.qnUrl}/zc_images/findTools/video/trade.mp4`+ this.$FT.versionKey(),
							level1:[
								{
									'name':'1.股票交易类风险',
									'content':'',
									'level2':[
										{
											name:'1）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										},
										{
											name:'2）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										}
									]
								},
								{
									'name':'2.股票交易类风险',
									'content':'',
									'level2':[
										{
											name:'1）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										},
										{
											name:'2）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										}
									]
								}
							]
						},
						{
							name1: '市场风险',
							name2: '市场类风险',
							videoUrl:`${getApp().globalData.qnUrl}/zc_images/findTools/video/market.mp4`+ this.$FT.versionKey(),
							level1:[
								{
									name:'1.市场交易类风险',
									content:'',
									level2:[
										{
											name:'1）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										},
										{
											name:'2）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										}
									]
								}
							]
						},
						{
							name1: '财务风险',
							name2: '财务类风险',
							videoUrl:'',
							level1:[
								{
									name:'1.市场交易类风险',
									content:'',
									level2:[
										{
											name:'1）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										},
										{
											name:'2）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										}
									]
								}
							]
						},
						{
							name1: '信用风险',
							name2: '信用类风险',
							videoUrl:'',
							level1:[
								{
									name:'1.信用交易类风险',
									content:'',
									level2:[
										{
											name:'1）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										},
										{
											name:'2）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										}
									]
								}
							]
						},
						{
							name1: 'ST与退市',
							name2: 'ST与退市风险',
							videoUrl:'',
							level1:[
								{
									name:'1.市场交易类风险',
									content:'',
									level2:[
										{
											name:'1）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										},
										{
											name:'2）被调出重要指数',
											content:'对应公司市值减小或某方面优势下滑'
										}
									]
								}
							]
						},
					],
				},
				// 视频
				videoArr:{
					0: `${getApp().globalData.qnUrl}/zc_images/findTools/video/trade.mp4`+ this.$FT.versionKey(),
					1: `${getApp().globalData.qnUrl}/zc_images/findTools/video/market.mp4`+ this.$FT.versionKey(),
					2: `${getApp().globalData.qnUrl}/zc_images/findTools/video/finance.mp4`+ this.$FT.versionKey(),
					3:`${getApp().globalData.qnUrl}/zc_images/findTools/video/credit.mp4`+ this.$FT.versionKey(),
					4: `${getApp().globalData.qnUrl}/zc_images/findTools/video/delisted.mp4`+ this.$FT.versionKey(),
				},
				// 海报图
				coverArr:{
					0: `${getApp().globalData.qnUrl}/zc_images/findTools/video/posterTrade.jpg`+ this.$FT.versionKey(),
					1: `${getApp().globalData.qnUrl}/zc_images/findTools/video/posterMarket.jpg`+ this.$FT.versionKey(),
					2: `${getApp().globalData.qnUrl}/zc_images/findTools/video/posterFinance.jpg`+ this.$FT.versionKey(),
					3: `${getApp().globalData.qnUrl}/zc_images/findTools/video/posterFinance.jpg`+ this.$FT.versionKey(),
					4: `${getApp().globalData.qnUrl}/zc_images/findTools/video/introducePoster.jpg`+ this.$FT.versionKey(),
				},
				topNavList:[
					// {
					//   name: '交易风险',
					// },
					// {
					//   name: '市场风险',
					// },
					// {
					//   name: '财务风险',
					// },
					// {
					//   name: '信用风险',
					// },
					// {
					//   name: 'ST与退市',
					// },
				],
				// 内容
				trade1: `${getApp().globalData.qnUrl}/zc_images/findTools/trade1.png`+ this.$FT.versionKey(),
				trade2: `${getApp().globalData.qnUrl}/zc_images/findTools/trade2.png`+ this.$FT.versionKey(),
				trade3: `${getApp().globalData.qnUrl}/zc_images/findTools/trade3.png`+ this.$FT.versionKey(),
				
				market1: `${getApp().globalData.qnUrl}/zc_images/findTools/market1.png`+ this.$FT.versionKey(),
				market2: `${getApp().globalData.qnUrl}/zc_images/findTools/market2.png`+ this.$FT.versionKey(),
				market3: `${getApp().globalData.qnUrl}/zc_images/findTools/market3.png`+ this.$FT.versionKey(),
				
				finance1: `${getApp().globalData.qnUrl}/zc_images/findTools/finance1.png`+ this.$FT.versionKey(),
				finance2: `${getApp().globalData.qnUrl}/zc_images/findTools/finance2.png`+ this.$FT.versionKey(),
				finance3: `${getApp().globalData.qnUrl}/zc_images/findTools/finance3.png`+ this.$FT.versionKey(),
				
				credit:`${getApp().globalData.qnUrl}/zc_images/findTools/credit.png`+ this.$FT.versionKey(),
				
				delisted: `${getApp().globalData.qnUrl}/zc_images/findTools/delisted.png`+ this.$FT.versionKey(),
				posterImage:`${getApp().globalData.qnUrl}/zc_images/findTools/video/introducePoster.jpg`+ this.$FT.versionKey(),
				palyButton:`${getApp().globalData.qnUrl}/zc_images/findTools/btn.png` + this.$FT.versionKey(),
			}
		},
		computed:{
			chooseList(){
				return this.tabCurrent === 0 ? this.tradeList : this.tabCurrent === 1 ? this.marketList : this.tabCurrent === 2 ? this.financeList : this.tabCurrent === 3 ? this.creditList : this.tabCurrent === 4 ? this.delistedList : ''
			},
			video(){
				return this.videoArr[this.tabCurrent]
			},
			//海报
			// coverImg(){
			// 	return this.coverArr[this.tabCurrent]
			// },
		},
		created() {
			console.log('=videoArr',this.videoArr[0]);
			this.getSlbDescInfo()
			this.$FT.clearArr(this.topNavList)
			this.result.level0.forEach(item =>{
				this.topNavList.push(
					Object.assign({},{
						name:item.name1
					})
				)
			})
		},
		computed:{
			...mapState(['Config']),
		},
		methods:{
			firstTabChange(tab){
				this.videoPauseShow = true
				this.tabCurrent = tab.index;
				let videoContext = uni.createVideoContext('myVideo');
				videoContext.pause();
		
			},
			player(){
				console.log('dakai');
				this.$refs.myVideo.play();
				this.videoPauseShow = false
			},
			getSlbDescInfo(){
				uni.request({
					url:this.Config.slbDescribe,
					method:'GET',
					success:(res) =>{
						console.log(res.data.result);
						this.result = res.data.result
						console.log('==========',this.result);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.background-img{
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 30rpx;
	}
	.bgc{
		width: 650rpx;
		height: 50rpx;
		background: #F2F6FD;
		border-radius: 30px;
		border: 1rpx solid #CEECF9;
		margin: 0 auto;
	}
	.bgc1{
		position: absolute;
		top: 30rpx;
		width: 690rpx;
		// height: 100vh;
		background: #FFFFFF;
		border-radius: 20rpx;
		border: 1rpx solid #CBE0F4;
		margin: 0 auto;
		.title{
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
			padding-left: 21rpx;
			padding-top: 26rpx;
		}
		.content{
			font-size: 30rpx;
			font-weight: 400;
			color: #818791;
			padding: 5rpx 23rpx 0 21rpx;
		}
	}
	.trade-title{
		font-size: 38rpx;
		font-weight: 500;
		color: #F43D3E;
		text-align: center;
		padding: 13rpx 0 0rpx 0;
	}
	.description{
		background-color: #fff;
		position: relative;
		uni-video {
			width: 750rpx;
			height: 404rpx;
		}
	}
	.algorithm{
		margin:0rpx 30rpx 43rpx 30rpx;
		&-title{
			font-size: 36rpx;
			font-weight: 500;
			color: #333333;
			text-align: center;
		}
		&-content{
			font-size: 30rpx;
			font-weight: 400;
			color: #818791;
		}
	}
	/deep/ .u-tabs__wrapper__nav{
		// overflow-x: scroll;
		font-size: 30rpx;
		border-bottom: 1px solid #f0f0f0;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
	}
	.top{
		width: 650rpx;
		height: 15rpx;
		background: #F2F6FD;
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		border: 1px solid #CEECF9;
		border-bottom: 0px solid #fff;
		margin: 0 auto;
		margin-top: 20rpx;
	}
	::v-deep .uTabs{
		padding-bottom: 20rpx;
		background: #FCFCFC;
		
		.u-tabs__wrapper__nav__line{
			width: 40rpx !important;
			height: 10rpx !important;
			border-radius: 5rpx !important;
		}
	}
	.line{
		height: 1rpx;
		border: 1rpx solid #F0F0F0;
	}
	.playbtn{
			position: relative !important;
		&:after{
			content: '';
			position: absolute;
			left:0;
			top: 33%;
			width: 750rpx;
			height: 100rpx;
			background: url("https://qnsp.zcskjy.com/zc_images/findTools/btn.png");
			background-size: 100rpx 100rpx;
			background-repeat: no-repeat;
			background-position: center;
			
		}
	}
	.myVideoContent{
			position: relative;
		/deep/ .myVideo{
			position: relative;
			z-index: 999;
			
		}
		.blockNone{
				position: absolute !important;
				z-index: 1;
				top:0;
				visibility: hidden !important;
		}
	}


	.playbtn uni-image{
		position: absolute;
		top: 257rpx;
		left: 325rpx;
		width: 100rpx;
		height: 100rpx;
	}
	::v-deep video::-webkit-media-controls-fullscreen-button {
		display: none;
	}
	::v-deep .uni-scroll-view-content{
		// display: flex;
		// justify-content: center;
	}
	.anquanTips{
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #818791;
		background-color: #F6F6F6;
		padding: 24rpx 30rpx 22rpx 30rpx;
	}
</style>
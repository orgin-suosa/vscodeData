<template name="ahomeview">

	<view class="m-tab-view" style="background-color:#ffffff;">
		<view class="m-section-header">
			<view class="m-section-title">{{title}}</view>
			<!-- <navigator :url='loadMoreUrl' hover-class="none"> -->
				<view class="m-section-more" @click="moreBtnClick()"> {{__('更多')}}</view>
			<!-- </navigator> -->
		</view>
		<view class="" v-if="itemsModelArr.length > 0">
			<view class="news-contentview" v-if="eltmType == 0">
				<block v-for="(model, index2) in itemsModelArr" :key="index2">
					<newstextcell :itemmodel="model" @itemClick="goNewsDetail"
						v-if="model.img == null || model.img.length == 0"></newstextcell>
					<newscell :itemmodel="model" @itemClick="goNewsDetail" v-else> </newscell>
				</block>
			</view>
			<view class="video-contentview" v-else>
				<block v-for="(model, index2) in itemsModelArr" :key="index2">
					<videoitem :itemmodel="model" @click="onVideoClick(index2)"> </videoitem>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	
	import newscell from '@/components/add-new/newscell.vue'
	import newstextcell from '@/components/add-new/news-text.vue'
	import videoitem from '@/components/add-new/videoItem.vue'

	export default {

		name: "ahomeview",

		components: {
		
			newscell,
			newstextcell,
			videoitem
		},

		props: {
			//元素类型
			eltmType: 0,
			title: '',
			loadMoreUrl: '',
			requestUrl: '', //请求的url 
			requesturlarr: Array,
			encodeUrl: false, //是否对url 进行编码 
			//tabBar 的标题数组 数据
			tabbarItemArr: Array,
		},

		data() {
			return {
                
				//页面是否加载完成
				loadPageFlag: true,
				//今日日期
				todayDate: '',
				// view默认高度
				// viewHeight:800,
				viewHeight: 420, //在viewHeight 里面带单位
				//展示的列表数据  
				itemsModelArr: [],
			}
		},
		created: function() {

			//获取当天日期
			this.getTodayDate();
			//页面数据初始化
			this.initPageData();
		},

		onLoad: function() {
			console.log('---onLoad---');

		},

		computed: {

		},

		methods: {
             
			 
			moreBtnClick(){
				
				if(this.eltmType == 0){
					this.$emit('itemClick');
				}else if(this.eltmType == 1){
					uni.navigateTo({
						url: '/ganhuo/recomvideolist/recomvideolist?'
					});
				}
			},
			 
			//跳转到资讯详情页面
			goNewsDetail(data) {
				uni.navigateTo({
					url: '/ganhuo/newslistpage/newdetail?id=' + data.id
				});
			},
			
            // 组件点击事件
            onVideoClick(index) {
            	let model = this.itemsModelArr[index];
            	let modelId = model.id;
            	console.log('modelId---', modelId, model.aspectRatio);
            	if (model.aspectRatio == '0') {
            		uni.navigateTo({
            			url: '/ganhuo/recomvideolist/videoFullPlay?id=' + modelId
            		});
            	} else {
            		uni.navigateTo({
            			url: '/ganhuo/recomvideolist/videoPlayback?id=' + modelId
            		});
            	}
            },
			
			getTodayDate() {
				let nowDate = new Date();
				let date = {
					year: nowDate.getFullYear(),
					month: nowDate.getMonth() + 1,
					date: nowDate.getDate(),
				};
				if (parseInt(date.month) < 10) {
					date.month = '0' + date.month;
				}
				if (parseInt(date.date) < 10) {
					date.date = '0' + date.date;
				}
				this.todayDate = date.year + '-' + date.month + '-' + date.date;
			},
			
			initPageData: function() {
				
				var that = this;
				let params = {};
				let urlString;
				if (that.eltmType == 0) {
					params.bussinessType = "1";
					params.tabType = 0;
					params.pageNum = 1;
					params.pageSize = 10;
					urlString = that.requestUrl;

				} else if (that.eltmType == 1) {

					urlString = encodeURI(that.requestUrl + 'pageSize=4&pageNum=1&classification=推荐')
				}

				uni.request({
					method: 'GET',
					data: params,
					url: urlString,
					success: function(data, status) {

						if (data.statusCode == 200) {

							let modelArr = data.data.result.list;
						
							if (that.eltmType == 1) {
								//页面是否加载完成
								that.setData({
									loadPageFlag: true,
									itemsModelArr: modelArr,
								});
							} else if (that.eltmType == 0) {
								let ary = modelArr.slice(0, 2);
								that.setData({
									loadPageFlag: true,
									itemsModelArr: ary
								})
							}
							
						} else {
							
							
						}
					}
				});
			},

		},
	}
</script>

<style lang="scss" scoped>
	
	.m-section-header {
		height: 70rpx;
		width: auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 10rpx 0rpx 0rpx;
		// background-color: #007AFF;

		.m-section-title {
			line-height: 50rpx;
			font-size: 36rpx;
			font-weight: 500;
			font-family: PingFangSC-Medium, PingFang SC;
			color: #333333;
			text-align: left;
			width: 200rpx;
		}
		.m-section-more {
			height: 100%;
			width: 200rpx;
			line-height: 60rpx;
			font-size: 24rpx;
			text-align: right;
			color: #999999;
			// background-color: #007AFF;
		}
	}

	.video-contentview {
		// padding: 0rpx 0rpx;
		// background-color: #0077AA;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		align-content: flex-start;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.content-item-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: auto;
		padding: 16rpx 30rpx;
		border-bottom: #E9E9E9 1rpx solid;

		.item-top-view {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			height: 33rpx;
			width: 100%;
			padding-top: 18rpx;


			.m-topleft {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-start;

				.m-top-title {
					height: 30rpx;
					line-height: 30rpx;
					font-size: 26rpx;
					font-weight: Medium;
					color: #666666;
					text-align: left;
					width: auto;
					margin-right: 24rpx;
					font-size: 26rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}

				.m-image-img {
					height: 30rpx;
					width: 45rpx;
					margin-right: 24rpx;
				}

				.m-comfrom {
					height: 33rpx;
					line-height: 33rpx;
					color: #666666;
					font-size: 24rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}
			}

			.m-contentview {
				height: 40rpx;
				width: 160rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-around;

				.m-xing-img {
					width: 28rpx;
					height: 26rpx;
				}
			}
		}

		.item-center-view {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			height: auto;
			padding-top: 10rpx;
			padding-bottom: 10rpx;
			width: 100%;

			.m-center-title {
				width: 60%;
				height: auto;
				line-height: 40rpx;
				color: #333333;
				font-weight: Medium;
				color: #333333;
				text-align: left;
				font-size: 28rpx;
				font-weight: 600;
				font-family: PingFangSC-Medium, PingFang SC;
			}

			.m-affectview {
				height: 48rpx;
				width: 190rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.m-affect-img {
					height: 44rpx;
					width: 188rpx;
				}
			}
		}

		.item-botterm-view {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			height: 30rpx;
			width: 100%;
			padding-bottom: 18rpx;

			.m-bottom-title {
				height: 30rpx;
				line-height: 30rpx;
				font-size: 22rpx;
				color: #666666;
			}
		}
	}
</style>

<template>
	<!-- v-if="it
	emsModelArr.length > 0" -->
	<view class="playback-area">
		
		<view class="video-list-view"  v-if="eltmType==1" :style=" list.length > 1 ? 'column-count: 2;':'column-count: 1;'">
		<!-- <view class="video-list-view"  v-if="eltmType==1"> -->
			<block v-for="(item1, index) in list" :key="index" >
				<view class="video-item-content" @click="itemClick(index)">
					<view class="item-top-view" style="height: 260rpx;">
						<view class="item-image-content" >
							<!-- cover_url -->
							<image class="curriculum-image" :src="item1.portraitUrl" mode="aspectFill"></image>
						</view>
					</view>
					<view class="item-bottom-view">
						<view class="item-bottom-des">{{ item1.media_name }}</view>
						<view class="item-bottom-con">
							<!-- <view class="bottom-image-content"> -->
								<image class="bottom-image-content" :src="item1.portraitUrl" mode=""></image>
							<!-- </view> -->
							<view class="bottom-name-title">{{ item1.teacherName }}</view>
						</view>
					</view>
				</view>
			</block>
			
			<!-- <view class="" v-if="list.length == 0"
				style="height:400rpx;display: flex;flex-direction: column;align-items: center;justify-content: center;background-color: blue;">
				<aempty-view showTitle="暂无数据111"></aempty-view>
			</view> -->
			<!-- <block v-for="(model, index2) in itemsModelArr" :key="index2">
					<videohotitem :itemmodel="model" @click="onVideoClick(index2)"> </videohotitem>
				</block> 
			 -->             
		</view>
		<view class="video-list-view"  v-if="eltmType==2" :style=" list.length > 1 ? 'column-count: 2;':'column-count: 1;'">
		<!-- <view class="video-list-view"  v-if="eltmType==2"> -->
			<block v-for="(item1, index) in list" :key="index"> 
				<view class="video-item-content" @click="itemClick(index)">
					<view class="item-top-view" style="height: 260rpx;">
						<view class="item-image-content" >
							<image class="curriculum-image" :src="item1.image" mode=""></image>
						</view>
						<view class="item-state-label" v-if="false">{{ 'SVIP免费' }}</view>
						<view class="item-time-view">
							<image  style="width: 14rpx;height: 17rpx;" 
							src="https://qnsp.zcskjy.com/zc_images/images/whiteplay.png"
							 mode="aspectFit"></image>
							<view class="item-time-label" >{{ item1.playlengTime+':00' }}</view> 
						</view>
					</view>
					
					<view class="item-bottom-view">
						<view class="item-bottom-des">{{ item1.title }}</view>
						<view class="item-bottom-con" style="width: 100%;">
							<view class="" style="display: flex;align-items: flex-start;">
								<image class="bottom-image-content" :src="item1.portraitUrl" ></image>
								<view class="bottom-name-title">{{ item1.teacherName }}</view>
							</view>
							
							<view class="" style="display: flex;align-items: center;">
								<image class="" style="width:26rpx;height: 24rpx;" src="https://qnsp.zcskjy.com/zc_images/images/dianzan.png"></image>
								<view class="bottom-name-title" style="font-size: 22rpx;margin-left:8rpx ;">{{ item1.comment_count }}</view>
							</view>
						</view>
					</view>
				</view>
			</block>           
		    
			<!-- <view class=""  v-if="list.length == 0"
				style="height:400rpx;display: flex;flex-direction: column;align-items: center;background-color: aqua;">
				<aempty-view showTitle="暂无数据11"></aempty-view>
			</view> -->
			
		
		</view>
	</view>
</template>

<script>
	// 瀑布流的组件
	import videohotitem from '@/components/add-new/videoHotItem.vue'

	export default {

		name: "hottabview",
		components: {
			videohotitem
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
			list: {
				type: Array,
				default: () => {
					return [];
				},
			},
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
			//页面数据初始化
			// this.initPageData();
		},

		onLoad: function() {
			console.log('---onLoad---');

		},

		computed: {

		},

		methods: {
			
			itemClick(index){
				let item = this.list[index];
				if (this.eltmType == 1) {
					// 短视频类型
					this.$emit('videoClick',item);
				} else if (this.eltmType == 2) {
					// 直播类型
					this.$emit('itemClcik',item.page_url)
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

            //页面请求数据
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
					urlString = encodeURI(that.requestUrl + 'pageSize=20&pageNum=1&classification=推荐')
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
	
	.playback-area {

		// padding: 30rpx 12rpx;
        
		.video-list-view {
			// height: auto;
			// display: flex;
			// flex-direction: row;
			// align-items: flex-start;
			// align-content: flex-start;
			// flex-wrap: wrap;
			// justify-content: space-between;
			// display: grid;
			-webkit-column-count: 2;
			width: 100%;
			height: 100%;
			column-gap: 0;
			column-count: 2;
			
			.video-item-content {
				background-color: #ffffff;
				height: auto;
				min-height: 420rpx;
				width: 358rpx;
				// position: relative;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				border-radius: 20rpx;
				overflow: hidden;
				margin-bottom: 20rpx;
				
				.item-top-view {
					position: relative;
					// background-color: blue;
					width: 358rpx;
					height: 480rpx;
					
					.item-time-view{
						width: 95rpx;
						height: 36rpx;
						padding-left: 15rpx;
						padding-right: 12rpx;
						background-color: rgba(0, 0, 0, 0.5);
						border-radius: 18rpx;
						overflow: hidden;
						// background-color: #000000;
						position: absolute;
						bottom: 10rpx;
						right: 10rpx;
                        display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;
						
						.item-time-label{
							height: 27rpx;
							line-height: 27rpx;
							width: auto;
							color: #ffffff;
							font-size: 22rpx;
							font-weight: 500;
							font-family: PingFangSC-Medium, PingFang SC;
						}
					}
					
					.item-state-label{
						// background-color: ;
						position: absolute;
						left: 0;
						bottom: 0;
						width: 115rpx;
						height: 28rpx;
						border-radius: 0 17rpx 0 0;
						overflow: hidden;
						z-index: 1;
						text-align: center;
						line-height: 28rpx;
						color:#AE3B3B;
						font-size: 20rpx;
						font-weight: 500;
						font-family: PingFangSC-Medium, PingFang SC;
						background:-wbkit-linear-gradient(to right,#FFDC6B,#FFE2B9);
						background:linear-gradient(to right,#FFDC6B,#FFE2B9);
					}
					
					.item-image-content {
						position: absolute;
					    width: 100%;
						height: 100%;
						border-radius: 20rpx 20rpx 0 0;
						overflow: hidden;
					    // position: absolute;
						// left: 0;
						// top: 0;
						
						.curriculum-image {
							width: 100%;
							height: 100%;
							// border-radius: 10upx;
							// overflow: hidden;
						}
					}
				}
				
				.item-bottom-view{
					padding: 18rpx 15rpx;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					// align-items: center;
					// justify-content: space-between;
					
					.item-bottom-con{
						height: 60rpx;
						width: auto;
						display: flex;
						// align-items: flex-start;
						align-items: center;
						justify-content: space-between;
						
						.bottom-image-content{
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							overflow: hidden;
							margin-right: 20rpx;
						}
						.bottom-name-title{
							height: 60rpx;
							line-height: 60rpx;
							color:#3F3F3F;
							text-align:left;
							font-size: 24rpx;
							font-weight: 400;
							font-family: PingFangSC-Regular, PingFang SC;
						}
					}
					
					.item-bottom-des{
						margin-bottom: 10rpx;
						width: 328rpx;
						height: auto;
						color:#101115;
						text-align:left;
						max-height: 95rpx;
						line-height: 45rpx;
						font-size: 32rpx;
						font-weight: 600;
						font-family: PingFangSC-Semibold, PingFang SC;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
					}
					
				}	
			}	
		}
	}	
</style>

<template>
	<view class="playback-area">
		<!-- <view class="video-list-view"  v-if="eltmType==1" :style=" list.length > 1 ? 'column-count: 2;':'column-count: 1;'"> 
		</view>
		<view class="video-list-view"  v-if="eltmType==2" :style=" list.length > 1 ? 'column-count: 2;':'column-count: 1;'">
		</view> -->
		<scroll-view class="list" scroll-y style="padding:30rpx 12rpx;">
			<view class="waterfall-box h-flex-x h-flex-2">
				<block v-if="eltmType == 2">
					<view>
						<helang-waterfall v-for="(item,index) in leftList" :key="index" :itemmodel="item"
							tag="left" :index="index"  @click="onLeftClick(index)"></helang-waterfall>
					</view>
					<view>
						<helang-waterfall v-for="(item,index) in rightList" :key="index" :itemmodel="item"
							tag="right" :index="index" @click="onRightClick(index)" ></helang-waterfall>
					</view>
				</block>
				<block v-if="eltmType == 1">
					<view>
						<video-waterfall v-for="(item,index) in leftList" :key="index" :itemmodel="item"
							tag="left" :index="index"  @click="onLeftClick(index)"></video-waterfall>
					</view>
					<view>
						<video-waterfall v-for="(item,index) in rightList" :key="index" :itemmodel="item"
							tag="right" :index="index" @click="onRightClick(index)" ></video-waterfall>
					</view>
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	// 瀑布流的组件
	import videohotitem from '@/components/add-new/videoHotItem.vue'
    import helangWaterfall from "@/components/helang-waterfall/helang-waterfall.vue"
    import videoWaterfall from "@/components/helang-waterfall/video-waterfall.vue"
    
	export default {

		name: "waterflowview",
		components: {
			videohotitem,
			helangWaterfall,
			videoWaterfall
		},
		
		props: {
			//元素类型
			eltmType: 0,
			title: '',
			loadMoreUrl: '',
			requestUrl: '', //请求的url 
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
				//展示的列表数据  
				itemsModelArr: [],
				
				//瀑布流需要的东西
				leftHeight: 0,
				rightHeight: 0,
				leftList: [],
				rightList: [],
				ajax: {
					// 是否可以加载
					load: true,
					// 加载中提示文字
					loadTxt: '',
					// 每页的请求条件
					rows:10,
					// 页码
					page:1,
				}
			}
		},
		created: function() {
			console.info('---water-----created--');
			 this.addList(this.list);
		},
		
		onLoad: function() {
			console.info('---water-----onLoad---');
            this.addList(this.list);
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
			
			onLeftClick(index){
				
				let item = this.rightList[index];
				if (this.eltmType == 1) {
					// 短视频类型
					this.$emit('itemClcik',item);
				} else if (this.eltmType == 2) {
					// 直播类型
					this.$emit('itemClcik',item.page_url)
				}
			},
			onRightClick(index){
			    let item = this.rightList[index]; 
				// this.$emit('itemClcik',item)
				if (this.eltmType == 1) {
					// 短视频类型
					this.$emit('itemClcik',item);
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
			
			addList(res) {
				// 获取到的数据，请注意数据结构
				// console.log('分类的数组--',res[0]);
				
				this.leftHeight = 0;
				this.rightHeight = 0;
				this.leftList = [];
				this.rightList = [];
				
				if(!res || res.length < 1){
					this.ajax.loadTxt = '没有更多了';
					return;
				}
				// 左右列表高度的差
				let differ = this.leftHeight - this.rightHeight;
				// 计算差值，用于确定优先插入那一边
				let differVal = 0;
								
				// 初始化左右列表的数据
				let i = differ > 0 ? 1 : 0;
				let [left, right] = [
					[],
					[]
				];
				
				// 获取插入的方向
				let getDirection = (index)=>{
					/* 左侧高度大于右侧超过 600px 时，则前3条数据都插入到右边 */
					if(differ>= 600 && index < 3){
						differVal = 1;
						return 'right';
					}
					
					/* 右侧高度大于左侧超过 600px 时，则前3条数据都插入到左边 */
					if(differ <= -600 && index < 3){
						differVal = -1;
						return 'left';
					}
					
					/* 左侧高度大于右侧超过 350px 时，则前2条数据都插入到右边 */
					if(differ >= 350 && index < 2){
						return 'right';
					}
					/* 右侧高度大于左侧超过 350px 时，则前2条数据都插入到左边 */
					if(differ <= -350 && index < 2){
						differVal = -1;
						return 'left';
					}
					
					/* 当前数据序号为偶数时，则插入到左边 */
					if ((i+differVal) % 2 == 0) {
						return 'left';
					} else {
						/* 当前数据序号为奇数时，则插入到右边 */
						return 'right';
					}
				}
				
				// 将数据源分为左右两个列表，容错差值请自行根据项目中的数据情况调节
				res.forEach((item, index) => {
					if(getDirection(index) == 'left'){
						//console.log(`差值：${differ},方向：left，序号${index}`)
						left.push(item);
					}else{
						//console.log(`差值：${differ},方向：right，序号${index}`)
						right.push(item);
					}
					i++;
				});
				
				// 将左右列表的数据插入，第一页时则覆盖
				if(this.ajax.page == 1){
					this.leftList = left;
					this.rightList = right;
					uni.stopPullDownRefresh();
				}else{
					this.leftList = [...this.leftList, ...left];
					this.rightList = [...this.rightList, ...right];
				}
			
				this.ajax.load = true;
				this.ajax.loadTxt = '上拉加载更多';
				this.ajax.page++;
				
				// console.log('打印数据');
				// console.log(this.leftList);
				// console.log(this.rightList);
			}	
					
			

           
			
			 
		},
	}
</script>

<style lang="scss" scoped>
	
	.playback-area {
        
		width: 750rpx;  
		// padding: 30rpx 12rpx;
        
		.waterfall-box {
			// padding: 10rpx 10rpx;
			box-sizing: border-box;
			height: auto;
			>view {
				// padding: 0 10rpx;
			}
		}
		.h-flex-x {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: flex-start;
			align-content: flex-start;
			&.h-flex-2 {
				>view {
					width: 50%;
				}
			}
		}
		
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

<template>
	<view class="uni-tab-bar page" style="background-color: #ffffff">
		<!-- 			:title="aheaderModel.title"
			:detailtitle="aheaderModel.detailtitle" 
 -->
		<aheader-view :bgImg="aheaderModel.bgImg" @back="backView()"></aheader-view>

		<view
			style="border-bottom: #f0f0f0 1rpx solid; background: #ffffff; height: 92rpx; border-radius: 24rpx 24rpx 0rpx 0rpx; margin-top: -30rpx; z-index: 1">
			<scroll-view id="tab_tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft"
				style="background: #ffffff; border: 0; width: 690rpx; margin: 20rpx 30rpx" v-if="tabBars.length > 1">
				<view v-for="(tab, index) in tabBars" :key="tab.id" class="swiper-tab-list"
					:class="tabIndex == index ? 'active' : ''" :id="'tab_' + tab.id" :data-current="index"
					@click="tapTab">
					<view class="text"
						:style="index == tabIndex ? 'color:#F43D3E;font-size: 34rpx;' : 'font-size: 30rpx;'">
						{{ tab.category_name || '　' }}
					</view>
					<view class="bg-main" :style="tabIndex == index ? '' : 'background-color: #FFFFFF;'"></view>
				</view>
			</scroll-view>
		</view>

		<swiper v-if="loadPageFlag" :current="tabIndex" style="height: auto" class="swiper-box" :duration="300"
			@change="changeTab">
			<swiper-item v-for="(tab, index1) in tabBars" :key="index1">
				<scroll-view class="list" scroll-y @scrolltolower="scrolltolower()">
					<view class="video-contentview" style="">
						<block v-for="(model, index2) in itemsModelArr" :key="index2">
							<videoitem :itemmodel="model" @click="onvideoClick(index2)"> </videoitem>
						</block>
					</view>
					<uni-load-more :status="status"></uni-load-more>
					<aexplan-view v-if="itemsModelArr.length > 0"></aexplan-view>
				</scroll-view>

				<!-- <scroll-view class="list" scroll-y style="height: auto;width: 100%;display:flex;flex-direction:row;flex-wrap:wrap;"  
					 @scrolltolower="scrolltolower()">
						
						<helang-waterfall style="width: 45%;"
							v-for="(item,index) in itemsModelArr" 
							:key="index" 
							:itemmodel="item" 
							:index="index"
							@click="onVideoClick"
						></helang-waterfall> 
						 
					</scroll-view> -->

				<!-- <scroll-view class="list" scroll-y >
						<view class="waterfall-box h-flex-x h-flex-2">
							<view>
								 <helang-waterfall 
									v-for="(item,index) in leftList" 
									:key="index" 
									:itemmodel="item" 
									tag="left"
									:index="index"
									@height="onHeight"
									@click="onClick"
								></helang-waterfall> 
							</view>
							<view>
								<helang-waterfall 
									v-for="(item,index) in rightList" 
									:key="index" 
									:itemmodel="item" 
									@height="onHeight"
									@click="onClick"
									tag="right"
									:index="index"
								></helang-waterfall>
							</view>
						</view>
					</scroll-view>  -->
			</swiper-item>
		</swiper>
		<!-- <aexplan-view style="position: relative;left: 0;bottom: 0;"></aexplan-view> -->
	</view>
</template>
<script>
	import videoitem from '../../components/add-new/videoItem.vue'
	//瀑布流插件
	// import helangWaterfall from "../../components/helang-waterfall/helang-waterfall.vue"
	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {

		components: {
			videoitem,
			// "helang-waterfall": helangWaterfall
		},
		data() {
			return {
				options: {},

				loadPageFlag: false,
				scrollLeft: 0,
				isClickChange: false,

				//aheader-view 的数据
				aheaderModel: {
					title: "精选视频",
					detailtitle: "全平台热点视频一览无余",
					bgImg: "https://qnsp.zcskjy.com/zc_images/images/videoComBgImg.png"
				},

				//加载更多的显示
				status: 'more',

				tabIndex: 0,
				newsitems: [],
				tabBars: [],
				//展示的列表数据   所有列表数据
				itemsListArr: [],
				//展示的列表数据  
				itemsModelArr: [],
			}
		},

		computed: mapState(['Config']),

		methods: {

			//返回上一级页面
			backView() {
				uni.navigateBack({
					delta: 1
				});
			},

			initPageData: function() {
				let that = this;
				let tmp = [];

				// tmp.unshift({'id':0,classification:encodeURIComponent('推荐'), category_name:that.__('推荐')});
				// tmp.push({'id':1,classification:encodeURIComponent('股票'), category_name:that.__('股票')});
				// tmp.push({'id':2,classification:encodeURIComponent('保险'), category_name:that.__('保险')});
				// tmp.push({'id':3,classification:encodeURIComponent('基金'), category_name:that.__('基金')});

				tmp.unshift({
					'id': 0,
					classification: '推荐',
					category_name: that.__('推荐')
				});
				tmp.push({
					'id': 1,
					classification: '股票',
					category_name: that.__('股票')
				});
				tmp.push({
					'id': 2,
					classification: '保险',
					category_name: that.__('保险')
				});
				tmp.push({
					'id': 3,
					classification: '基金',
					category_name: that.__('基金')
				});
				tmp.push({
					'id': 4,
					classification: '路演厅',
					category_name: that.__('路演厅')
				});
				tmp.push({
					'id': 5,
					classification: '财经会',
					category_name: that.__('财经会')
				});
				tmp.push({
					'id': 6,
					classification: '公开课',
					category_name: that.__('公开课')
				});


				that.setData({
					tabBars: tmp
				})

				let ary = [];
				that.itemsListArr = [];

				for (let i = 0, length = that.tabBars.length; i < length; i++) {
					ary.push({
						loadPageFlag: false,
						pageNum: 1,
						totalPage: 1,
						status: 'more',
						classification: that.tabBars[i].classification
					});
					that.itemsListArr.push([]);
				}
				that.newsitems = ary;

				let classification = this.tabBars[this.tabIndex].classification;
				that.loadBrandsAndProduncts(that.tabIndex, classification, 1, true)

			},

			//初始化数据
			initData: function(force_refresh) {
				var that = this;

				that.loadBrandsAndProduncts(that.tabIndex, this.tabBars[this.tabIndex].classification || 0, 1,
					force_refresh)
			},

			loadBrandsAndProduncts(index, classification, pageNum, force_refresh) {
				var that = this;
				// let params = {};
				// params.classification = classification;
				// params.pageNum = pageNum;
				// params.pageSize = '10';

				let urlStr = encodeURI(this.Config.URL.newsUrl.videolist + 'pageSize=10&pageNum=' + pageNum +
					'&classification=' + classification)

				uni.request({
					method: 'GET',
					// data:params,
					url: urlStr,

					success: function(data, status) {

						if (data.statusCode == 200) {
							uni.stopPullDownRefresh()
							that.status = 'more';

							let modelArr = data.data.result.list;
							console.log('modelArr----', modelArr[0]);
							let tmp = that.newsitems[index];
							tmp.loadPageFlag = true;
							tmp.totalPage = data.data.result.totalPage;
							tmp.status = 'more';
							if (modelArr.length < 15) {
								tmp.status = 'noMore';
								this.status = 'noMore';
							}
							tmp.pageNum = pageNum;
							that.$set(that.newsitems, index, tmp);

							// 为true 的时候  下拉刷新的操作
							//为 false 的时候 拼接数组 否则直接赋值
							if (force_refresh) {
								//替换model大数组 里面对应的单页面的小数组
								that.$set(that.itemsListArr, index, modelArr);
							} else {

								// let loadArr = that.itemsListArr[index];
								// loadArr = loadArr.concat(modelArr);
								// that.$set(that.itemsListArr, index, loadArr);

								modelArr = that.itemsModelArr.concat(modelArr);
								console.log('---model---length--', modelArr.length);
							}
							//页面是否加载完成
							that.setData({
								loadPageFlag: true,
								itemsModelArr: modelArr
								// itemsModelArr:that.itemsListArr[index]
							});

							// console.log('that.itemsModelArr--',that.itemsModelArr);
							//改成瀑布流的数据
							// that.addList(that.itemsModelArr)

						} else {
							that.$.confirm(msg)
						}
					}
				});
			},

			async changeTab(e) {

				console.log('--changeTab--');

				let that = this;
				let index = e.target.current;

				if (!this.newsitems[index].loadPageFlag) {
					let category_id = this.tabBars[index].classification;
					this.loadBrandsAndProduncts(index, category_id, 1, true);
				} else {
					that.setData({
						itemsModelArr: that.itemsListArr[index]
					});

					// that.addList(that.itemsModelArr);
				}
				let tmp = that.newsitems[index];
				that.status = tmp.status;

				if (this.isClickChange) {
					this.tabIndex = index;
					this.isClickChange = false;
					return;
				}

				let tabBar = await this.getElSize("tab-bar"),
					tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;

				for (let i = 0; i < index; i++) {
					let result = await this.getElSize(this.tabBars[i].id);
					width += result.width;
				}

				let winWidth = uni.getSystemInfoSync().windowWidth,
					nowElement = await this.getElSize(this.tabBars[index].id),
					nowWidth = nowElement.width;

				console.log('---width--', width, nowWidth, tabBarScrollLeft, winWidth);
				// if (width + nowWidth - tabBarScrollLeft > winWidth) {
				// 	this.scrollLeft = width + nowWidth - winWidth;
				// }
				if (width + nowWidth - tabBarScrollLeft > winWidth / 2) {
					this.scrollLeft = tabBarScrollLeft + nowWidth;
				}
				if (width + nowWidth - tabBarScrollLeft < winWidth / 2) {
					this.scrollLeft = 0;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}

				this.isClickChange = false;
				this.tabIndex = index;

				//切换tab 的时候 将pageNum 重置
				for (var i = 0, length = that.newsitems.length; i < length; i++) {
					let tmp = that.newsitems[i];
					tmp.pageNum = 1;
					that.$set(that.newsitems, i, tmp);
				}

			},

			getElSize(id) { //得到元素的size
				return new Promise((res, rej) => {
					uni.createSelectorQuery().select("#tab_" + id).fields({
						size: true,
						scrollOffset: true
					}, (data) => {
						res(data);
					}).exec();
				})
			},

			async tapTab(e) { //点击tab-bar

				console.log('点击进行tab 切换');
				let that = this;
				let tabIndex = e.currentTarget.dataset.current;
				if (this.tabIndex === tabIndex) {
					return false;
				} else {

					this.isClickChange = true;
					this.tabIndex = tabIndex;

					let tabBar = await this.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft; //点击的时候记录并设置scrollLeft

					let width = 0;
					for (let i = 0; i < tabIndex; i++) {
						let result = await this.getElSize(this.tabBars[i].id);
						width += result.width;
					}
					let winWidth = uni.getSystemInfoSync().windowWidth,
						nowElement = await this.getElSize(this.tabBars[tabIndex].id),
						nowWidth = nowElement.width;
					console.log('nowWidth-------', nowWidth);

					if (width + nowWidth - tabBarScrollLeft > winWidth / 2) {
						this.scrollLeft = tabBarScrollLeft + nowWidth;
					}
					if (width + nowWidth - tabBarScrollLeft < winWidth / 2) {
						this.scrollLeft = 0;
					}

				}

				//切换tab 的时候 将pageNum 重置
				for (var i = 0, length = that.newsitems.length; i < length; i++) {
					let tmp = that.newsitems[i];
					tmp.pageNum = 1;
					that.$set(that.newsitems, i, tmp);
				}
			},

			loadMore() {
				let that = this;
				that.status = 'loading';
				let tmp = that.newsitems[that.tabIndex];
				tmp.status = 'loading';
				that.$set(that.newsitems, that.tabIndex, tmp);

				setTimeout(() => {
					that.addData(that.tabIndex);
				}, 1200);
			},

			addData(e) {
				if (this.newsitems[e].total <= this.newsitems[e].pageNum) {
					// this.newsitems[e].loadingText = '没有更多了';
					this.status = 'noMore';
					let tmp = this.newsitems[e];
					tmp.status = 'noMore';
					this.$set(this.newsitems, e, tmp);
					return;
				}
				let category_id = this.tabBars[this.tabIndex].classification;
				this.loadBrandsAndProduncts(this.tabIndex, category_id, this.newsitems[this.tabIndex].pageNum + 1, false);
			},

			scrolltolower: function(index) {

				console.log('---loadMore----');
				this.loadMore();
			},

			// 监听高度变化
			onHeight(height, tag) {
				if (tag == 'left') {
					this.leftHeight += height;
				} else {
					this.rightHeight += height;
				}
			},
			// 组件点击事件
			onvideoClick(index) {

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
			// 组件点击事件
			onClick(index, tag) {

				let modelId;
				// 对应的数据
				if (tag == 'left') {
					modelId = this.leftList[index].id;
				} else {
					modelId = this.rightList[index].id
				}
				console.log('modelId---', modelId);
				uni.navigateTo({
					url: '/ganhuo/recomvideolist/videoPlayback?id=' + modelId
				});

			},

		},

		onLoad(options) {
			//console.info(this.userInfo);

			var that = this;
			that.initPageData();
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			//
			// this.getList();
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			let that = this;
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			// 离开页面，注销事件
			var that = this;
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.initData(true);
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline'],
			});
			// #endif

			return {
				title: this.ShareTitle,
				imageUrl: this.ShareImg,
				path: '/pages/index/index?uid=' + this.userInfo.user_id,
			};
		},

		/**
		 * 用户点击右上角分享朋友圈
		 */
		onShareTimeline: function() {
			return {
				title: this.ShareTitle,
				query: {
					uid: this.userInfo.user_id,
				},
				imageUrl: this.ShareImg,
			};
		},
		/**
		 * 页面滚动触发事件的处理函数
		 */
		onPageScroll: function() {},
	};
</script>

<style lang="scss">
	@import '../../styles/_variables';
	@import '../../styles/layout.scss';

	.uni-tab-bar-loading {
		text-align: center;
		font-size: 28upx;
		color: #999;
	}

	.page {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		// min-height: 100%;
		background-color: #ffffff;
		background-size: cover !important;
		background-position: top center !important;
		margin-bottom: var(--window-bottom);
	}

	.waterfall-box {
		padding: 10rpx 10rpx;
		box-sizing: border-box;
		height: auto;

		>view {
			padding: 0 10rpx;
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

	.load-txt {
		padding: 0 0 20rpx 0;
		text-align: center;
		color: #999;
		font-size: 24rpx;
	}

	.uni-swiper-tab {
		line-height: 72rpx;
		height: 72rpx;
		white-space: nowrap;

		::-webkit-scrollbar {
			width: 0;
			height: 0;
			color: transparent;
		}

		.swiper-tab-list {
			width: auto;
			margin-right: 0rpx;
			padding-left: 36rpx;

			&:first-child {
				padding-left: 0rpx;
			}

			line-height: 70rpx;
			height: 70rpx;

			.bg-main {
				height: 10rpx;
				width: 40rpx;
				border-radius: 10rpx;
				background-color: #f43d3e;
			}
		}
	}

	.video-contentview {
		// width: 100%;
		padding: 20rpx 20rpx;
		// background-color: #0077AA;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		align-content: flex-start;
		flex-wrap: wrap;
		justify-content: space-between;
	}
</style>

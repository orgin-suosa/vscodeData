<template>
	<view class="uni-tab-bar page"  style="background-color: #ffffff;">
		
			<aheader-view :bgImg="aheaderModel.bgImg" :title="aheaderModel.title"
			:detailtitle="aheaderModel.detailtitle" @back="backView()"></aheader-view> 
			 
			<view style="border-bottom:#F0F0F0 1rpx solid;background:#ffffff;height: 92rpx;border-radius: 24rpx 24rpx 0rpx 0rpx;margin-top:-30rpx;z-index: 1;">
				<scroll-view id="tab_tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft" 
				style="background: #ffffff;border: 0;width:690rpx;margin:20rpx 30rpx;"  v-if="tabBars.length>1">
					<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" 
					:class="tabIndex==index ? 'active' : ''"
						  :id="'tab_' + tab.id" :data-current="index" @click="tapTab">
						  <view class="text" :style="index == tabIndex ?'color:#F43D3E;font-size: 34rpx;':'font-size: 32rpx;'">{{tab.category_name || "　"}}</view>
						  <view class="bg-main" :style="tabIndex==index ? '' : 'background-color: #FFFFFF;'"></view>

					</view>
				</scroll-view>
			</view>
		
			<!-- <swiper v-if="loadPageFlag" :current="tabIndex" style="height: auto;"  class="swiper-box"  :duration="300" @change="changeTab">
				<swiper-item v-for="(tab, index1) in tabBars" :key="index1"> -->
				
		    <swiper v-if="loadPageFlag" :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="300" @change="changeTab">
		        <swiper-item class="swiper-item" v-for="(tab,index1) in tabBars" :key="index1">		
					<scroll-view class="list" scroll-y  @scrolltolower="scrolltolower('pageIndex-'+index1)">
						
						<block v-for="(model, index2) in itemsModelArr" :key="index2">
							
							 <newstextcell :itemmodel="model" @itemClick="goDetail" v-if="model.img == null || model.img.length == 0"></newstextcell>
							 <newscell :itemmodel="model" @itemClick="goDetail" v-else> </newscell>
											 
						</block>
						
						<uni-load-more v-if="itemsModelArr.length >0" :status="status" ></uni-load-more>
						<aexplan-view v-if="itemsModelArr.length >0"></aexplan-view>
						
					</scroll-view>
				</swiper-item>
			</swiper>
		
			<!-- <aexplan-view style="position: relative;left: 0;bottom: 0;"></aexplan-view> -->
			
	</view>
</template>
<script>


	// import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	import newscell from '../../components/add-new/newscell.vue'
    import newstextcell from '@/components/add-new/news-text.vue'
	import { mapState, mapMutations } from 'vuex';
	
	export default {
		
		components: {
            newscell,
			newstextcell
		},
		data() {
			return {
				options:{},
				
				//请求是否完成   默认false 请求完成改为true 
				loadPageFlag: false,
			
				scrollLeft: 0,
				isClickChange: false,
				
			    //aheader-view 的数据
				aheaderModel:{title:"热门资讯",
							detailtitle:"第一时间为您播报热点财经新闻",
							bgImg:"https://qnsp.zcskjy.com/zc_images/images/newsTopBgImg.png"},
					
				//加载更多的显示
				status: 'more',
					
				//选中的 tabbar 默认选择的是第一个
				tabIndex: 0,
				//tabBar 的列表数据
				tabBars: [],
				//存储单个的tab 是否已经加载过数据状态的数组
				newsitems: [],
				//展示的列表数据   所有列表数据
				itemsListArr:[],
				//展示的列表数据  
				itemsModelArr:[],
			
			}
		},
		
	    computed: mapState(['Config']),
		
		methods: {
			
			//返回上一级页面
			backView(){
				uni.navigateBack({
					delta: 1
				});	
			},
			
			goDetail(data) {
				uni.navigateTo({
					url: '/ganhuo/newslistpage/newdetail?id='+data.id
				});
			},
					
			initPageData: function(){
				let that = this;
			
				let tmp = [];
				tmp.unshift({'id':0,'tabType_id':0, category_name:that.__('要闻')});
				tmp.push({'id':1,'tabType_id':1, category_name:that.__('A股')});
				tmp.push({'id':2,'tabType_id':2, category_name:that.__('港股')});
				tmp.push({'id':3,'tabType_id':3, category_name:that.__('美股')});
				tmp.push({'id':4,'tabType_id':4, category_name:that.__('基金')});
				tmp.push({'id':5,'tabType_id':5, category_name:that.__('保险')});
				tmp.push({'id':6,'tabType_id':6, category_name:that.__('房产')});
				that.setData({
					tabBars: tmp
				})
				
				that.itemsListArr = [];
				//newsitems 
				let ary = [];
				for (let i = 0, length = that.tabBars.length; i < length; i++){
					ary.push({loadPageFlag:false,pageNum:1,totalPage:1,status:'more',tabType_id:that.tabBars[i].tabType_id});
					that.itemsListArr.push([]);
				}
		     			
				that.newsitems = ary;
			
				//请求具体的 列表的数据  默认第一个tab 的id 为0  第一次加载的页面为1
				that.loadBrandsAndProduncts(that.tabIndex, 0, 1, true)
			},
			
			// 请求具体的数据列表
			loadBrandsAndProduncts(index, tabType_id, pageNum, force_refresh) {
				var that = this;
				let params = {};
			
				params.bussinessType = "1";
				params.tabType = tabType_id;
				params.pageNum = pageNum;
				params.pageSize = '15';
				console.log('params----',params);
				
				uni.request({
				     method:'GET',
					 data:params,
					 url: that.Config.URL.newsUrl.newslist,
				     success: function(data, status) {
						
						// console.log('data----',data.data);
						
						if (data.statusCode == 200) {
							uni.stopPullDownRefresh()
							that.status = 'more';
							
							let modelArr = data.data.result.list;
							console.log('modelArr----', modelArr.length);
							let tmp = that.newsitems[index];
							tmp.loadPageFlag = true;
							tmp.totalPage = data.data.result.totalPage;
							tmp.status ='more';
							if(modelArr.length < 15){
							 	tmp.status ='noMore';
								this.status = 'noMore';
							}
							tmp.pageNum = pageNum;
							that.$set(that.newsitems, index, tmp);
						
							
							// 为true 的时候  下拉刷新的操作
							//为 false 的时候 拼接数组 否则直接赋值
							if(force_refresh){
								//替换model大数组 里面对应的单页面的小数组
								that.$set(that.itemsListArr, index, modelArr);
							}else{
								
								// let loadArr = that.itemsListArr[index];
								// loadArr = loadArr.concat(modelArr);
								// that.$set(that.itemsListArr, index, loadArr);
								modelArr = that.itemsModelArr.concat(modelArr);
								console.log('---model---length--',modelArr.length);
							}
							
							//页面是否加载完成
							that.setData({
								loadPageFlag:true,
								itemsModelArr:modelArr
								// itemsModelArr:that.itemsListArr[index]
							});
						}else {
							that.$.confirm(msg)
						}
					}	
				});
			
			},
			
			
			//初始化数据
			initData: function(force_refresh) {
				
				 var that = this;
				// #ifdef MP-WEIXIN
				   
					let $title = that.plantformInfo.name;
					let $desc = '' || this.plantformInfo.site_meta_description;
					let $link =  that.$.sprintf('%s/h5/pages/index/index', that.Config.SiteUrl);
					let $img_url = this.ShareImg || this.plantformInfo.logo;
					//初始化微信分享
					that.$.wxShare($title, $desc, $link, $img_url)
				// #endif
				
				//掉用接口数据
				that.loadBrandsAndProduncts(that.tabIndex, this.tabBars[this.tabIndex].tabType_id||0, 1, force_refresh)
			},
		
			
			loadMore() {
				let that = this;
				that.status = 'loading';
				let tmp = that.newsitems[that.tabIndex];
				tmp.status ='loading';
				that.$set(that.newsitems, that.tabIndex, tmp);
				
				setTimeout(() => {
					that.addData(that.tabIndex);
				}, 500);
			},
			
			addData(e) {
				
				if (this.newsitems[e].totalPage <= this.newsitems[e].pageNum) {
					// this.newsitems[e].loadingText = '没有更多了';
					this.status = 'noMore';				
					let tmp = this.newsitems[e];
					tmp.status = 'noMore';
					this.$set(this.newsitems, e, tmp);
					return;
				}
				
				let tabType_id = this.tabBars[this.tabIndex].tabType_id;
				this.loadBrandsAndProduncts(this.tabIndex, tabType_id, this.newsitems[e].pageNum+1, false);
			},
			
			
			async changeTab(e) {
				
				// console.log('changeTab');
				
				let that  = this;
				let index = e.target.current;
				
				//如果loadPageFlag 说明那个index 没有加载过数据 发送请求
				if (!that.newsitems[index].loadPageFlag) {
					let tabType_id = that.tabBars[index].tabType_id;
					that.loadBrandsAndProduncts(index, tabType_id, 1, true);
				}else{
					
					that.setData({
						loadPageFlag:true,
						itemsModelArr:that.itemsListArr[index]
					});
				}
				
				let tmp = that.newsitems[index];
				that.status = tmp.status;
				
				if (that.isClickChange) {
					that.tabIndex = index;
					that.isClickChange = false;
					return;
				}
		
				let tabBar = await that.getElSize("tab-bar"),
						tabBarScrollLeft = tabBar.scrollLeft;
				let width = 0;
		      
				for (let i = 0; i < index; i++) {
					
					let result = await this.getElSize(this.tabBars[i].id);
					width += result.width;
				}
		
				let winWidth = uni.getSystemInfoSync().windowWidth,
						nowElement = await this.getElSize(this.tabBars[index].id),
						nowWidth = nowElement.width;
				if (width + nowWidth - tabBarScrollLeft > winWidth/2) {
					this.scrollLeft =tabBarScrollLeft+ nowWidth;
				}
				// console.log('---width---',width,nowWidth,tabBarScrollLeft,winWidth);
				if (width + nowWidth - tabBarScrollLeft < winWidth/2) {
					this.scrollLeft =  0;
				}
				if (width < tabBarScrollLeft) {
					this.scrollLeft = width;
				}
				this.isClickChange = false;
				this.tabIndex = index;
				
				//切换tab 的时候 将pageNum 重置
				for (var i = 0 ,length = that.newsitems.length; i <length; i++) {
					let tmp = that.newsitems[i];
					tmp.pageNum =1;
					that.$set(that.newsitems, i , tmp);
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
			
			    // console.log('点击进行tab 切换');
				let that  = this;
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
					console.log('---width---',width,nowWidth,tabBarScrollLeft,winWidth);
					if (width + nowWidth - tabBarScrollLeft > winWidth/2) {
						this.scrollLeft = tabBarScrollLeft+ nowWidth;
					}
					if (width + nowWidth - tabBarScrollLeft < winWidth/2) {
						this.scrollLeft =  0;
					}
					
				}
				
				//切换tab 的时候 将pageNum 重置
				for (var i = 0 ,length = that.newsitems.length; i <length; i++) {
					let tmp = that.newsitems[i];
					tmp.pageNum =1;
					that.$set(that.newsitems, i , tmp);
				}
			},
		
		
			onPopClose: function () {},
			
			onPopClick: function () {
				this.$.gopage(this.index_pop_wap_url)
			},
		
			confirm() {},
		
			scrolltolower:function(index){
				
				console.log('scrolltolower');
				
				this.status = 'loading';
				
				this.loadMore();
			},	
		},
		
		
		onLoad(options) {
			//console.info(this.userInfo);

			var that = this;
			if (options.scene) {
				var scene = decodeURIComponent(options.scene);
				var opts = {};
				opts = that.$.parse_str(scene);
				options = Object.assign(options, opts);
			}

			var w = that.$.getSystemInfoSync().windowWidth;

			that.setData({
				w: w,
				options: options
			})
             
			//页面数据初始化 
			that.initPageData();
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			//
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
		onHide: function() {
			
		},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {
			// 离开页面，注销事件
			var that = this
	
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.initData(true)
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {

		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			// #endif

			return {
				title: this.ShareTitle,
				imageUrl: this.ShareImg,
				path: "/pages/index/index?uid=" + this.userInfo.user_id
			}
		},

		/**
		 * 用户点击右上角分享朋友圈
		 */
		onShareTimeline: function () {
			return {
				title: this.ShareTitle,
				query: {
					uid: this.userInfo.user_id
				},
				imageUrl: this.ShareImg,
			}
		},
		/**
		 * 页面滚动触发事件的处理函数
		 */
		onPageScroll: function() {},
		
		
			
	}
</script>

<style lang="scss">
	@import "../../styles/_variables";
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
		margin-bottom:var(--window-bottom);
	}
	
	.uni-swiper-tab {

		line-height: 72rpx;
		height: 72rpx;
        white-space: nowrap;
        ::-webkit-scrollbar{
        	width: 0;
        	height: 0;
        	color: transparent;
        }
		.swiper-tab-list{

		    width: auto;
			margin-right: 0rpx;
			padding-left: 36rpx;
			&:first-child {
			  padding-left: 0rpx;
			}
		    line-height: 70rpx;
			height: 70rpx;

			.bg-main{
				height: 10rpx;
				width: 40rpx;
				border-radius: 10rpx;
				background-color: #F43D3E;
			}
		}
	}


	.swiper-tab-rigth-box{
	   font-size: 28rpx;
	   .swiper-tab-icon {
			font-size: 28rpx;
		   font-weight: 400;
			line-height: 66rpx;
			overflow: hidden;
			height: 66rpx;

			text{
				margin-left: 4rpx;
			}
	   }
	}

	.swiper-tab-icon:before {
		padding-top:2rpx;
		font-size: 32rpx;
		color: inherit;
		vertical-align:middle;
	}

	.swiper-tab-line {
	   width: 4rpx;
	   height: 28rpx;
	   background: linear-gradient(180deg, rgba(155, 11, 0, 0) 0%, rgba(117, 13, 5, 0.86) 100%);
	   opacity: 1;
	}
	
</style>

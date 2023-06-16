<template>
	<view class="uni-tab-bar page"  style="background-color: #FFFFFF;">
		
			<aheader-view :bgImg="aheaderModel.bgImg" :title="aheaderModel.title" showImg
			:detailtitle="aheaderModel.detailtitle" @back="backView()"></aheader-view> 
			 
			<view style="border-bottom:#F0F0F0 1rpx solid;background:#ffffff;height: 92rpx;border-radius: 24rpx 24rpx 0rpx 0rpx;margin-top:-30rpx;z-index: 1; margin-bottom: 40rpx">
				<scroll-view id="tab_tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft" 
				style="background: #ffffff;border: 0;width:690rpx;margin:20rpx 30rpx;"  v-if="tabBars.length>1">
					<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" 
					:class="tabIndex==index ? 'active' : ''"
						  :id="'tab_' + tab.id" :data-current="index" @click="tapTab">
						  	<view class="text" :style="index == tabIndex ?'color:#F43D3E;font-size:34rpx':'font-size:32rpx'">{{tab.category_name || tab.category_alias || "　"}}</view>
						  	<view class="bg-main" :style="tabIndex==index ? '' : 'background-color: #FFFFFF;'"></view>
					</view>
				</scroll-view>
			</view>
			
			<swiper v-if="loadPageFlag" :current="tabIndex" style="height: auto;" class="swiper-box"  :duration="300" @change="changeTab">
				<swiper-item v-for="(tab, index1) in tabBars" :key="index1">
					<!-- <scroll-view class="list" scroll-y  @scrolltolower="scrolltolower('pageIndex-'+index1)">
						<block v-for="(model, index2) in itemsModelArr" :key="index2">
							<quickcell :itemmodel="model" @itemClick="goDetail" :action="index2 ==0 "> </quickcell>
						</block>
					</scroll-view> -->
					<!-- <uni-indexed-list :options='list' @click ='goDetail' ></uni-indexed-list> -->
					
					<scroll-view scroll-y  style="height: 100%;" >
						<uni-cus-index-list :options='itemsModelArr' @click ='goDetail' :status ='status'
						@scrolltolower="scrolltolower()">
						</uni-cus-index-list>
						<!-- <u-loadmore :status="status"></u-loadmore> -->
						<!-- <aexplan-view style=""></aexplan-view> -->
					</scroll-view>
				</swiper-item>
			</swiper>
	</view>
</template>
<script>

	import quickcell from '../../components/add-new/quickcell.vue'
    import  uniCusIndexList from '../../components/uni-indexed-list/components/uni-indexed-list/uni-indexed-list.vue'
	import { mapState, mapMutations } from 'vuex';
	
	export default {
		
		components: {
            quickcell,
			uniCusIndexList,
		},
		data() {
			return {
				options:{},
				
				//传递的数组
				list:[{
						letter:'A',
						data:[
							'Aha','Ajjf','Ahu','Ahuhhuh','Adfvf'
						]
				    },{
						letter:'B',
						data:[
							'Bha','Bjjf','Bhu','Bhuhhuh','Bdfvf'
						]
				    },
				],
				
				//请求是否完成   默认false 请求完成改为true 
				loadPageFlag: false,
				ShareImg: "",
				ShareTitle: "",
				imageUrl:"http://mallsuite.oss-accelerate.aliyuncs.com/mall/images/media/plantform/20220411/3db396d233fa4febb9bab0a63ea220db.png",
				todayDate:'2020-05-05',
				todayweek:'周一',
				scrollLeft: 0,
				isClickChange: false,
				
				//加载更多的显示
				status: 'more',
				
				//aheader view 对应的数据
				aheaderModel:{title:"7*24快讯",
							detailtitle:"实时提供免费市场快讯，最新消息一网打尽",
							bgImg:"https://qnsp.zcskjy.com/zc_images/images/quickTopBgImg.png"},
					
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
				let model = data.item;
				// console.log('--data-----',data);
				// console.log('--model-----',model);
				uni.navigateTo({
					url: '/ganhuo/quicknewspage/quickdetail?linkTitle='+model.linkTitle
					+'&linkUrl='+model.linkUrl+'&content='+model.content+'&time='+model.time
				});
			},
			
			getTodayDate() {
			  let nowDate = new Date();
			  let date = {
			    year: nowDate.getFullYear(),
			    month: nowDate.getMonth() + 1,
			    date: nowDate.getDate(),
				 wk : nowDate.getDay(), 
			  };
			  if (parseInt(date.month) < 10) {
			    date.month = '0' + date.month;
			  }
			  if (parseInt(date.date) < 10) {
			    date.date = '0' + date.date;
			  }
			  let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
			  this.todayweek = weeks[date.wk];
			 
			  this.todayDate = date.year + '-' + date.month + '-' + date.date;
			  // this.single = date.year + '-' + date.month + '-' + date.date;
			},
					
			initPageData: function(){
				let that = this;
			
				let tmp = [];
				tmp.unshift({'id':0,'tabType_id':0, category_name:that.__('要闻')});
				tmp.push({'id':1,'tabType_id':1, category_name:that.__('A股')});
				tmp.push({'id':2,'tabType_id':2, category_name:that.__('港股')});
				tmp.push({'id':3,'tabType_id':3, category_name:that.__('美股')});
				tmp.push({'id':4,'tabType_id':4, category_name:that.__('基金')});
				tmp.push({'id':5,'tabType_id':5, category_name:that.__('商品')});
				tmp.push({'id':6,'tabType_id':6, category_name:that.__('外汇')});
				tmp.push({'id':7,'tabType_id':7, category_name:that.__('其他')});
				
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
				that.loadBrandsAndProduncts(that.tabIndex, 0, 1, false)
			},
			
			// 请求具体的数据列表
			loadBrandsAndProduncts(index, tabType_id, pageNum, force_refresh) {
				var that = this;
				let params = {};
			
				params.bussinessType = "0";
				params.tabType = tabType_id;
				params.pageNum = pageNum;
				params.pageSize = '15';
				console.log('params----',params);			
				uni.request({
				     method:'GET',
					 data:params,
					 url: this.Config.URL.newsUrl.newslist,
				     success: function(data, status) {
						
						// console.log('data----',data);
						
						if (data.statusCode == 200) {
							uni.stopPullDownRefresh()
							that.status = 'more';
							
							let modelArr = data.data.result.list;
							// console.log('modelArr----', modelArr[0]);
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
							//为 false 的时候 拼接数组 
							if(force_refresh){
								that.itemsModelArr = [];
							}else{
								that.itemsModelArr = that.itemsListArr[index];
							}
							
							//取数组的最后一个 如果数组为空  则为undefine 
							let sectionModel = that.itemsModelArr.pop();
							
							modelArr.forEach((model, index) => {
								
								let dateArr = model.time.split(' ');
								// if(arr.length == 2){
								// 	return arr[1];
								// }
								let dateStr = dateArr[0];
								
								let xingqiStr = that.getstr(dateStr);
								//元素不为 undefine
								if (typeof(sectionModel) == "undefined")
								{
								    let obj = {};
								    obj['letter'] = dateStr + xingqiStr;
									let Arr = [];
								    Arr.push(model);
									obj['data'] = Arr;
									sectionModel = obj;
									
								}else{
									
									if(sectionModel.letter == dateStr + xingqiStr){
										
										let arr = sectionModel['data'];
										arr.push(model);
										// console.log('model--1-',sectionModel);
									}else{
										//上一个老的 sectionModel
										that.itemsModelArr.push(sectionModel);
										//重新开始创建一个新的 sectionmodel 
										let obj = {};
										let xingqiStr = that.getstr(dateStr);
										obj['letter'] = dateStr+ xingqiStr;
										let Arr = [];
										Arr.push(model);
										obj['data'] = Arr;
										sectionModel = obj;
										// console.log('model--2-',sectionModel);
									}
								}
							})
							//将最后的 sectionModel加入数组
							that.itemsModelArr.push(sectionModel);
							
							
							// if(force_refresh){
								////替换model大数组 里面对应的单页面的小数组
								that.$set(that.itemsListArr, index, that.itemsModelArr);
							// }else{
								// let loadArr = that.itemsListArr[index];
								// loadArr = loadArr.concat(modelArr);
								// that.$set(that.itemsListArr, index, loadArr);
							// }
							
							// console.log('--arr---',that.itemsModelArr);
							
							//页面是否加载完成
							that.setData({

								loadPageFlag:true,
								// itemsModelArr:that.itemsListArr[index]
							});
						}else {
							that.$.confirm(msg)
						}
					}	
				});

			},
			
			getstr(str){
				
				 // new Date(this.todayDate);
				const weekTimestamp = new Date(str);
				let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
				let label = weeks[weekTimestamp.getDay()];	
				// console.log('label----',label);
				return  '  '+label;
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
				
				console.log('changeTab');
				
				let that  = this;
				let index = e.target.current;
				
				//如果loadPageFlag 说明那个index 没有加载过数据 发送请求
				if (!that.newsitems[index].loadPageFlag) {
					let tabType_id = that.tabBars[index].tabType_id;
					that.loadBrandsAndProduncts(index, tabType_id, 1, false);
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
					this.scrollLeft = tabBarScrollLeft+nowWidth;
				}
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
			
			    console.log('点击进行tab 切换');
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
		
		
			onPopClose: function () {
				
			},
			
			onPopClick: function () {
				this.$.gopage(this.index_pop_wap_url)
			},
		
			confirm() {
			},
			
			scrolltolower:function(){
				
				console.log('----quick-11---scrolltolower');
				this.loadMore();
			},	
		},
			
		
		onLoad(options) {
			
			var that = this;
			if (options.scene) {
				var scene = decodeURIComponent(options.scene);
				var opts = {};
				opts = that.$.parse_str(scene);
				options = Object.assign(options, opts);
			}

			// var w = that.$.getSystemInfoSync().windowWidth;

			that.setData({
				// w: w,
				options: options
			})
			
            that.getTodayDate();
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
            console.log('上拉加载更多');
			this.loadMore();
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
    
	.m-custom-nav{
		
		.m-topbg-img{
			width: 100%;
			// height: 360rpx;
			height: calc(260rpx + var(--status-bar-height));
		}
		
		.m-backbtn{
			position: absolute;
			top: calc(30rpx + var(--status-bar-height));
			left: 30rpx;
			width: 100rpx;
			height: 80rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;
			// background-color: #FFFFFF;
		}
		
		.m-headerview{
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;
		    height:120rpx; 
		    padding:0rpx 20rpx;
		    margin:20rpx 10rpx;
			position: absolute;
			top: calc(80rpx + var(--status-bar-height));
			left: 50rpx;
			
			.m-header-title{
				height: 50rpx;
				line-height:50rpx;
				font-size: 36rpx;
				font-weight:bold;
				color:#333333;
				margin-bottom: 20rpx;
			}
			
			// .m-section-more{
			// 	margin-bottom: 20rpx;
			// 	line-height:40rpx;
			// 	font-size: 24rpx;
			// 	color:#999999;
			// }
				 
		}
		
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

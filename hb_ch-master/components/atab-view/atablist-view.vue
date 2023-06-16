<template>
	
	<!-- <view class="m-tab-view" style="background-color:#ff4022;"> -->
	<view class="uni-tab-bar page"  style="background-color: #FFFFFF;">
	   
		<view style="border-bottom:#F0F0F0 1rpx solid;padding:100rpx 30rpx 0rpx;">
			<scroll-view id="tab_tab-bar" style="" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft"
			 style="background: #ffffff;border: 0;">
				<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" 
				:class="tabIndex==index ? 'active' : ''" :id="'tab_'+tab.id" 
				:data-current="index" style=""
				@click="tapTab">
					<view class="text" :style="index == tabIndex ?'color:#F43D3E;font-size: 34rpx;':'font-size: 32rpx;'">{{tab.category_name || "　"}}</view>
					<view class="bg-main" :style="tabIndex==index ? '' : 'background-color: #FFFFFF;'"></view>
				</view>
			</scroll-view>
		</view>
		
		<!-- v-if="loadPageFlag" -->
		
		<swiper :current="tabIndex" style="height:auto;"
		 class="swiper-box" :duration="300" @change="changeTab">
			<swiper-item v-for="(tab, index1) in tabBars" :key="index1">
				<!-- <view class="" v-if="itemsModelArr.length > 0" > -->
					<scroll-view class="list"  scroll-y  @scrolltolower="scrolltolower()" v-if="eltmType == 1">
						<view class="video-contentview " style="">
							<block v-for="(model, index2) in itemsModelArr" :key="index2">
								<videoitem :itemmodel="model" @click="onVideoClick(index2)"> </videoitem>		 
							</block>
						</view>
						<uni-load-more :status="status" ></uni-load-more>
						<aexplan-view v-if="itemsModelArr.length >0"></aexplan-view>
					</scroll-view>	
					
					<scroll-view class="list" style="padding: 0 20rpx;"  scroll-y  @scrolltolower="scrolltolower()"  v-else-if="eltmType == 0">
					    <block v-for="(model, index2) in itemsModelArr" :key="index2">
							<newstextcell style="width: 710rpx;" :itemmodel="model" @itemClick="gohotNewsDetail" v-if="model.img == null || model.img.length == 0"></newstextcell>
							<newscell style="width: 710rpx;" :itemmodel="model" @itemClick="gohotNewsDetail" v-else> </newscell>
					     </block>
						 <uni-load-more :status="status" ></uni-load-more>
						 <aexplan-view v-if="itemsModelArr.length >0"></aexplan-view>
					</scroll-view>
					
					<scroll-view class="list"  scroll-y  @scrolltolower="scrolltolower()"  v-else-if="eltmType == 2">
					    <block v-for="(model, index2) in itemsModelArr" :key="index2">
							<!-- <quickcell :itemmodel="model" @itemClick="goquickNewsDetail()"> </quickcell> -->
							<quickcell style="" :itemmodel="model" @itemClick="goquickNewsDetail"  :action="index2 ==0"> </quickcell>
					     </block>
						 <uni-load-more :status="status" ></uni-load-more>
						 <aexplan-view v-if="itemsModelArr.length >0"></aexplan-view>
					</scroll-view>
					
				<!-- </view> -->
				<!-- <view class="" style="height: 100%; display: flex;flex-direction: column;align-items: center;justify-content: center;" v-elese>
				    <aempty-view ></aempty-view>	
				</view>
				 -->
			</swiper-item>
		</swiper>
		
		<!-- :style="'height:'+viewHeight+'rpx'" -->
		
		<!-- <swiper  v-if="loadPageFlag" :current="tabIndex" :style="'height:'+viewHeight+'rpx'" 
		 class="swiper-box" :duration="300" @change="changeTab">
		  <swiper-item v-for="(tab, index1) in tabBars" :key="index1">
			<view class="" v-if="itemsModelArr.length > 0" >
				
				<scroll-view class="list"  v-if="eltmType == 0">
				  <block v-for="(model, index2) in itemsModelArr" :key="index2">
						<newstextcell :itemmodel="model" @itemClick="gohotNewsDetail" v-if="model.img == null || model.img.length == 0"></newstextcell>
						<newscell :itemmodel="model" @itemClick="gohotNewsDetail" v-else> </newscell>
				  </block>
				</scroll-view>
				<scroll-view class="list" scroll-y  v-else-if="eltmType == 1">
					<view class="video-contentview" >
						<block v-for="(model, index2) in itemsModelArr" :key="index2">
							<videoitem :itemmodel="model" @click="onVideoClick(index2)"> </videoitem>		 
						</block>
					</view>
				</scroll-view>	
			</view>	
			<view class="" style="height: 100%; display: flex;flex-direction: column;align-items: center;justify-content: center;" v-else>
			    <aempty-view ></aempty-view>	
			</view>
		  </swiper-item>
	    </swiper> -->
		
	</view>
</template>

<script>
	
	import quickcell from '@/components/add-new/quickcell.vue'
	import newscell from '@/components/add-new/newscell.vue'
	import newstextcell from '@/components/add-new/news-text.vue'
	import videoitem from '../../components/add-new/videoItem.vue'

	
	export default {
		
		name: "atablistview",
		
		components: {
			quickcell,
			newscell,
			newstextcell,
			videoitem
		},
	
		props: {
			//元素类型
			eltmType:0,
			title:'',
			requestUrl:'',   //请求的url 
			encodeUrl:false, //是否对url 进行编码 
			//tabBar 的标题数组 数据
			tabbarItemArr:Array, 
		},
		
		data() {
			return {
				
				scrollLeft:0,
				loadPageFlag: true,
				isClickChange:false,
			    
				//加载更多的显示
				status: 'more',
				//获取今天日期
				todayDate:'',
				// view默认高度
				viewHeight:420, //在viewHeight 里面带单位
				//选中的 tabbar 默认选择的是第一个
				tabIndex: 0,
				//存储单个的tab 是否已经加载过数据状态的数组
				newsitems: [],
				// 切换之后 的数组 
				tabBars:[],
				//展示的列表数据 所有列表数据
				itemsListArr:[],
				//展示的列表数据  
				itemsModelArr:[],
			}
		},
		
		created: function() {
			
			//获取当天日期
			this.getTodayDate();
			//页面数据初始化
			this.initLoadPageData();
		},
		
		onLoad:function(){
			console.log('---onLoad---');
			
		},
		
		methods: {
			
			//跳转快讯详情
			goquickNewsDetail(data) {
				
				uni.navigateTo({
					url: '/ganhuo/quicknewspage/quickdetail?linkTitle='+data.linkTitle
					+'&linkUrl='+data.linkUrl+'&content='+data.content+'&time='+data.time
				});
			},
			//跳转到资讯详情页面
			gohotNewsDetail(data){
				uni.navigateTo({
					url: '/ganhuo/newslistpage/newdetail?id='+data.id
				});
			},
			
			// 组件点击事件
			onVideoClick(index){
				// console.log(index, tag);
				let model = this.itemsModelArr[index];
				let modelId = model.id;
				console.log('modelId---',modelId,model.aspectRatio);
				if(model.aspectRatio == '0'){
					uni.navigateTo({
						url: '/ganhuo/recomvideolist/videoFullPlay?id=' + modelId
					});
				}else{
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
		
			 
			initLoadPageData(){
				let that = this;
			    
				let tmp = [];
				for (let i = 0, length = that.tabbarItemArr.length; i < length; i++){
					tmp.push({'id':i,'tabType_id':i,classification:that.tabbarItemArr[i],category_name:that.tabbarItemArr[i]});
				}
				that.setData({
					tabBars: tmp
				})
				that.itemsListArr = [];
				//newsitems 
				let ary = [];
				for (let i = 0, length = that.tabBars.length; i < length; i++){
					ary.push({loadPageFlag:false,totalPage:1,status:'more',pageNum:1,tabType_id:that.tabBars[i].tabType_id});
					that.itemsListArr.push([]);
				}		
				that.newsitems = ary;
			
				//请求具体的 列表的数据  默认第一个tab 的id 为0  第一次加载的页面为1
				that.loadBrandsAndProduncts(that.tabIndex, this.tabBars[this.tabIndex].tabType_id||0, 1, true)
			},
			
			// 请求具体的数据列表
			loadBrandsAndProduncts(index, tabType_id, pageNum, force_refresh) {
				var that = this;
				let params = {};
				let urlString;
				
				if(that.eltmType == 0){
					
					params.bussinessType = "1";
					params.tabType = tabType_id;
					params.pageNum = pageNum;
					params.pageSize = 10;
					urlString = that.requestUrl;
					
				}else if(that.eltmType == 1){
					
					let classification = that.tabBars[index].classification;
					urlString =  encodeURI(that.requestUrl+'pageSize=10&pageNum='+pageNum+'&classification='+classification)
					
				}else if(that.eltmType == 2){
					
					params.bussinessType = "0";
					params.tabType = tabType_id;
					params.pageNum = pageNum;
					params.pageSize = 10;
					urlString = that.requestUrl;
				}
				
				// console.log('params111----',params,'---urlString--',urlString);
				
				uni.request({
					 method:'GET',
					 data:params,
					 url: urlString,
					 success: function(data, status) {
						
						if (data.statusCode == 200) {
							
						    uni.stopPullDownRefresh()
							that.status = 'more';
							
							let modelArr = data.data.result.list;
							// console.log('modelArr----', modelArr[0]);
							
							let tmp = that.newsitems[index];
							tmp.loadPageFlag = true;
							tmp.totalPage = data.data.result.totalPage;
							tmp.status ='more';
							if(modelArr.length < 10){
								tmp.status ='noMore';
								that.status = 'noMore';
							}
							tmp.pageNum = pageNum;
							that.$set(that.newsitems, index, tmp);
							
							if(force_refresh){
								
								//替换model大数组 里面对应的单页面的小数组
								that.$set(that.itemsListArr, index, modelArr);
							}else{
								// let loadArr = that.itemsListArr[index];
								// loadArr = loadArr.concat(modelArr);
								// that.$set(that.itemsListArr, index, loadArr);
								
								modelArr = that.itemsModelArr.concat(modelArr);
								// console.log('---model---length--',modelArr.length);
							}
							
							//页面是否加载完成
							that.setData({
								loadPageFlag:true,
								itemsModelArr:modelArr,
							});
							
							// if(that.eltmType == 1){
							// }else if(that.eltmType == 0){
							// }else if(that.eltmType == 2){
							// }
							
						}else {
							
							
						}
					}	
				});
			
			},
			
			async changeTab(e) {
				
				console.log('--changeTab--');
				
				let that  = this;
				let index = e.target.current;
				
				if (!this.newsitems[index].loadPageFlag) {
				    let tabType_id = that.tabBars[index].tabType_id;
					that.loadBrandsAndProduncts(index, tabType_id, 1, true);
				}else{
					that.setData({
						itemsModelArr:that.itemsListArr[index]
					});
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
				
				console.log('---width--',width,nowWidth,tabBarScrollLeft,winWidth);
				// if (width + nowWidth - tabBarScrollLeft > winWidth) {
				// 	this.scrollLeft = width + nowWidth - winWidth;
				// }
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
					console.log('nowWidth-------',nowWidth);	
				
					if (width + nowWidth - tabBarScrollLeft > winWidth/2) {
						this.scrollLeft = tabBarScrollLeft+nowWidth;
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
				
			
			scrolltolower:function(){
				
				console.log('----scrolltolower---loadMore----');
				
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
					
					console.log('---totalPage---0000---',this.newsitems[e].totalPage);
					// this.newsitems[e].loadingText = '没有更多了';
					this.status = 'noMore';	
					let tmp = this.newsitems[e];
					tmp.status = 'noMore';
					this.$set(this.newsitems, e, tmp);
					return;
				}
				console.log('---totalPage-1111---');
				
				let tabType_id = this.tabBars[this.tabIndex].tabType_id;
				this.loadBrandsAndProduncts(this.tabIndex, tabType_id, this.newsitems[this.tabIndex].pageNum+1, false);
			},
			
		},
	}

</script>

<style lang="scss" scoped>
	
	@import "../../styles/_variables";
	@import '../../styles/layout.scss';
   
	
	.page {
		position: absolute;
		// top: 0;
		top: var(--status-bar-height);
		left: 0;
		width: 100%;
		bottom: 0;
		// min-height: 100%;
		background-color: #ffffff;
		background-size: cover !important;
		background-position: top center !important;
		margin-bottom:var(--window-bottom);
	}
	
	.m-section-header{
		  height: 80rpx;
		  width: auto;
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  justify-content: space-between;
		  margin: 10rpx 30rpx 0rpx;
		  // background-color: #007AFF;
		 
		.m-section-title{
			line-height:50rpx;
			font-size: 36rpx;
			font-weight:bold;
			color:#333333;
			text-align:left;
			width: 200rpx;
		}
		
		.m-section-more{
			height: 60rpx;
			width: 200rpx;
			line-height:60rpx;
			font-size: 24rpx;
			text-align: right;
			color:#999999;
			// background-color: #007AFF;
		}
			 
	}

	.uni-swiper-tab {

		line-height: 72rpx;
		height: 72rpx;
		border: 0;
		width:690rpx;
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
			line-height: 70rpx;
			height: 70rpx;
			&:first-child {
				padding-left: 0rpx;
			}
			
			.bg-main{
				// bottom: 10rpx;
				height: 10rpx;
				width: 40rpx;
				border-radius: 10rpx;
				background-color: #F43D3E;	
			}
		}
	}
    
	.video-contentview{
	
	    // background-color: #0077AA;
	    padding: 20rpx 20rpx;
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
	}
	
	 
</style>

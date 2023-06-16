
<template>
	<view class="uni-tab-bar page">
		<!-- 签到标签 -->
	   <!-- m-header-BgImg -->
		<view class="" style="background-color:#FFFFFF;width: 100%;
		position: relative;">
			<view style="padding:25rpx 22rpx 0rpx;background-color: #FFFFFF;">
				 
				<image src="https://qnsp.zcskjy.com/zc_images/images/my/incomeBgImg.png" mode="scaleToFill"
				style="background-color: #FFFFFF;height: 254rpx;width: 100%;
				 position:relative;display: block;"/>
				<view class="m-section-top" style="">
					<view class="m-money-title">{{ hasLogin ?toFix(user_income,2) : '--'}}</view>
					<view class="m-des-title">{{'累计收入（元）'}}</view>
				</view>
				<view class="m-section-bottom" style="">
					<view class="m-bottom-leftview" style="">
						<!-- <view class="m-draw-title">{{ hasLogin ? userInfo.commission_distributor_amount.toFixed(2) : '--' }}</view> -->
						<view class="m-draw-title">{{ hasLogin ? toFix(user_money,2) : '--' }}</view>
						<view class="m-des-deaw">{{'可提现余额（元）'}}</view>
					</view> 
					<view class="m-bottom-rightview" style="" @click="withDrawClick">
						{{'提现'}}
					</view> 
				</view>
			</view>
		</view>
		
		<view class="m-tabbar-view" style="border-bottom:#F0F0F0 1rpx solid;
		padding:0 30rpx;background-color: #FFFFFF;">
			<!-- scroll-view -->
				<!-- :class="tabIndex==index ? 'swiper-active' : 'swiper-unactive'" -->
			<scroll-view id="tab_tab-bar" class="uni-swiper-tab" style="">
				<view v-for="(tab,index) in tabBars" :key="tab.id" class="swiper-tab-list" 
				:class="tabIndex==index ? 'active' : ''"
					  :id="'tab_' + tab.id" :data-current="index" @click="tapTab">
					  	<view class="text" :style="index == tabIndex ?'color:#333333;font-size:34rpx':'font-size:30rpx'">{{tab.category_name || tab.category_alias || "　"}}</view>
					  	<!-- <view >{{tab.category_name || tab.category_alias || "　"}}</view> -->
						<view class="bg-main" :style="tabIndex==index ? '' : 'background-color: #FFFFFF;'"></view>
				</view>
			</scroll-view>
		</view>
		
	
	    <swiper v-if="loadComplete" :current="tabIndex" style="height: auto;" class="swiper-box" 
		:duration="300" @change="changeTab">
	      <swiper-item v-for="(tab, index1) in tabBars" :key="index1">
	    	
		    <view class="uni-fansview" v-if="tabIndex ==2">
			  <view v-for="(item, index) in fansTitleList" :key="index" class="nav-item" 
			  :class="[tabfans_level== index +1 ?'nav-item-on':'']" @click="fansTabClick(index)">
			    <text class="m-fans-Text"> {{ item }}</text>
			  </view>
			</view>
			
			<!-- <view class="m-order-content" v-if="tabIndex ==1">
				<view class="m-order-detail">
					<view class="m-num-title">{{'0'}}</view>
					<view class="m-descrip-title">{{'分销订单（笔）'}}</view>
				</view>
				<view class="" style="width: 1rpx; height:60rpx;background-color:#A0A0A0;"></view>
				<view class="m-order-detail">
					<view class="m-num-title">{{'0'}}</view>
					<view class="m-descrip-title">{{'分销收益（元）'}}</view>
				</view>
			</view> -->
			
			<!-- <view class="m-order-content" v-if=" tabIndex ==2">
				<view class="m-order-detail">
					<view class="m-num-title">{{'0'}}</view>
					<view class="m-descrip-title">{{'一级推广（人）'}}</view>
				</view>
				<view class="" style="width: 1rpx; height:60rpx;background-color:#A0A0A0;"></view>
				<view class="m-order-detail">
					<view class="m-num-title">{{'0'}}</view>
					<view class="m-descrip-title">{{'获得收益（元）'}}</view>
				</view>
			</view> -->
			
			<!-- <view class="" v-if="itemsModelArr.length > 0" style="height: 100%;"> -->
			<block v-if="itemsModelArr.length > 0">
	    		<scroll-view class="list"  scroll-y   v-if="tabIndex == 0" @scrolltolower="scrolltolower()">
	    		  <block v-for="(model, index2) in itemsModelArr" :key="index2">
	    			<agoods-item :itemmodel="model" @itemClick="shareGoods(index2)"> </agoods-item>
					
	    		  </block>
				  <uni-load-more :status="status" ></uni-load-more>
				  
	    		</scroll-view>
	    		
	    		<scroll-view class="list" scroll-y  v-if="tabIndex == 1" @scrolltolower="scrolltolower()">
	    		  <block v-for="(model, index2) in itemsModelArr" :key="index2">
	    			 <aorderitem :itemmodel="model" @itemClick="goNewsDetail"> </aorderitem>
	    		  </block>
				  <uni-load-more :status="status" ></uni-load-more>
				  
	    		</scroll-view>
				
	    		<scroll-view class="list" scroll-y  v-else-if="tabIndex == 2" @scrolltolower="scrolltolower()">
	    		  <block v-for="(model, index2) in itemsModelArr" :key="index2">
	    			<!-- <apromoteitem :itemmodel="model" @itemClick="goFinanceDetail"> </apromoteitem>
	    		  -->
				   <aorderitem :itemmodel="model" @itemClick="goNewsDetail"> </aorderitem>
				  </block> 
				  <uni-load-more :status="status" ></uni-load-more>
				  
	    		</scroll-view>
				
				<scroll-view class="list" scroll-y  v-else-if="tabIndex == 3" @scrolltolower="scrolltolower()">
				  <block v-for="(model, index2) in itemsModelArr" :key="index2">
				     <!-- <awithdrawitem :itemmodel="model" @itemClick="goFinanceDetail"></awithdrawitem> -->
				    <aorderitem :itemmodel="model" @itemClick="goNewsDetail"> </aorderitem>
				  </block> 
				  <uni-load-more :status="status" :style="itemsModelArr.length< 10 ? 'margin-top:60rpx':'' "></uni-load-more>
				  
				</scroll-view> 
				
	    	</block>
	    	<view class="m-empty-view" style="height: 100%;" v-if="itemsModelArr.length == 0">
	    	    <aempty-view style="margin-top:120rpx;;align-self: center;"></aempty-view>	
	    	</view>
	     </swiper-item>
	    </swiper>
		
	     <share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
	    
	</view>
</template>

<script>
	
	// import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	// import financeitem from '../../components/add-new/financeitem.vue';
	// import agoods-item from '../../components/amy-subcomp/agoods-item.vue'
	import agoodsitem from '@/components/amy-subcomp/agoods-item.vue';
	import aorderitem from '@/components/amy-subcomp/aorder-item.vue';
	import apromoteitem from '@/components/amy-subcomp/apromote-item.vue';
	import awithdrawitem from '@/components/amy-subcomp/awithdraw-item.vue';

    import shareBoxApp from '../../components/share-box-app.vue'
	 
	import {
		mapState,
		mapMutations
	} from 'vuex'
	
	export default {
		
		components: {
			shareBoxApp,
			'agoods-item':agoodsitem,
			// 'aorder-item':aorderitem,
			aorderitem,
			// apromoteitem,
			// awithdrawitem
		},
		data: function() {
			return {
				
				user_money: '0.00',
				user_income: '0.00',
				
				scrollLeft: 0,
				loadComplete: false,
				
				isClickChange: false,
				
				fansTitleList:['一级推广','二级推广','三级推广'],
				//URL  Arr
				// urlArr: [
				// 	this.Config.URL.fx.lists_order,
				// 	this.Config.URL.fx.lists_order,
				// 	this.Config.URL.fx.lists_commission,
				// 	this.Config.URL.fx.withdraw,
				// ],
				
				//粉丝等级   1级粉丝 2级粉丝 3级粉丝 也是选中的索引
				tabfans_level:1,
				
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
				// itemsModelArr:['1','1','1','1','1','1','1'],
				shareData:{}, 
				noImage: `${getApp().globalData.qnUrl}/zc_images/home/noImg.png`,
		
			};
		},
		
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'userInfo', 'hasLogin']),
		
		
		methods: {
			...mapMutations([
			    'login',
			    'logout',
			    'forceUserInfo',
			    'getUserInfo',
			]),
			
		
			toFix(num1,num2){
			    if(typeof(num1)=='undefined'){
			        return '--'
			    }else{
			        return Number(num1).toFixed(num2)
			    }
			},
			//提现按钮
			withDrawClick(){
				uni.navigateTo({
					url: '/home/withdrawal/withdrawal'
				});
			},
			
			shareGoods: function (e) {
			   let that = this;
			
			   let $href = that.$.sprintf('%s/h5/pages/index/index?uid=%d', that.Config.SiteUrl, this.userInfo.user_id);
			
			  // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			  // #ifdef APP-PLUS
			  $href = that.$.sprintf('%s/h5/pages/index/index?uid=%d', that.Config.SiteUrl, this.userInfo.user_id);
			  // #endif
			  // #ifdef MP-WEIXIN
			  $href = '/pages/index/index?uid=' + this.userInfo.user_id;
			  // #endif
			
			 let model = that.itemsModelArr[e];
			
			  var path,title,image,shareText,price;
			
			  if(!that.$.isNull(model.className)) {
				title = model.className;
				shareText = model.classDescribe;
			    image = model.image;
				price = model.price;
			  } else {
			
			    title = that.__('我发现这个商品很好，非常适合你哦！');
				shareText = '快来看一看吧';
			    image = that.noImage;
				price = '0';
			  }
			
			  this.setData({
			    shareData: {
			      shareTitle: title,
			      shareText: shareText,
			      href: $href,
			      image: image,
			      price: price,
			    },
			  });
			
			  // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			  // #ifdef APP-PLUS
			  this.$refs.shareBoxApp.show();
			  // #endif
			
			},
			
			
			fansTabClick(index){
				
				this.itemsModelArr = [];
				//变更粉丝等级数据
				this.tabfans_level = index +1;
				//请求具体的列表的数据  粉丝列表的数据不存储
				this.loadBrandsAndProduncts(this.tabIndex, 1, true);
			},
			
			goDetail(data) {
				uni.navigateTo({
					url: '/ganhuo/newslistpage/newdetail?id='+data.id
				});
			},
					
			initPageData: function(){
				let that = this;
			
				let tmp = [];
				tmp.unshift({'id':0, category_name:that.__('分销商品')});
				tmp.push({'id':1, category_name:that.__('分销订单')});
				tmp.push({'id':2, category_name:that.__('推广员')});
				tmp.push({'id':3, category_name:that.__('提现记录')});
				that.setData({
					tabBars: tmp
				})
				
				that.itemsListArr = [];
				//newsitems 
				let ary = [];
				for (let i = 0, length = that.tabBars.length; i < length; i++){
					ary.push({loadComplete:false,pageNum:1,records:1,status:'more',});
					that.itemsListArr.push([]);
				}
			 			
				that.newsitems = ary;
			
				//请求具体的列表的数据  
				that.loadBrandsAndProduncts(that.tabIndex, 1, true)
				
				
			},
			
			// 请求列表数据
			loadBrandsAndProduncts(index, pageNum, force_refresh) {
				
				// time_flag   0 1 2 3  0所有  1今天 2近一个月 3 近3个月
				// this.level   0  1 消费奖  6分销奖 case 1:
				// ('消费奖') ('销售奖')
				
				let that = this;
				var params;
				let urlStr;
				
				if(that.tabIndex == 0){
					urlStr = this.Config.URL.edu.getProductList,
					
					params = {
						/**
					 * 平台商品分类   category_id: 固定 2025
					   教育商品类型   kind_id:  value = "订单种类(ENUM): 1201-实物 ; 1202-虚拟  ; 1203-电子卡券  ; 1204-外卖订单;1005-教育"
					   商品状态 product_state_id:   value = "商品状态:1001-正常;1002-下架仓库中;1003-待审核; 1000-违规禁售"˚
					 */
						page: 1,
						rows: 10,
						//type_id	课程类型(ENUM) : 0-精品课；1-训练营；2-导师课
						category_id: 2025,
						kind_id: 1205,
						// store_is_open: 1,
						product_state_id: 1001,
						product_dist_enable:1
					};
					
				}else if(that.tabIndex == 1){
					urlStr = this.Config.URL.fx.lists_order;
					params = {
						time_flag: 0,
						page: pageNum,
						uo_level: 0
					};
				}else if(that.tabIndex == 2){
					urlStr = this.Config.URL.fx.lists_commission;
					params = {
						//ugc_level 粉丝等级
						ugc_level: that.tabfans_level,
						page: pageNum,
					};
				}else if(that.tabIndex == 3){
					urlStr = this.Config.URL.pay.consume_withdraw;
					params = {
						page: pageNum,
					};
				}
			    
				that.$.request({
					method: 'get',
					dataType: 'json',
					url:urlStr,
					// url: that.urlArr[that.tabIndex],
					loading:false,
					data: params,
					success: function(data, status, msg, code) {
						uni.stopPullDownRefresh()
						
						if (200 == status) {
							console.log('--urlStr---data------',urlStr,data);
							if (data.page >= data.total) {
								that.setData({
								})
							} else {
								that.setData({
								})
							}
					        
							let modelArr = data.items;
							// console.log('分享有礼111-',data.items)
							
							if(that.tabIndex ==0 ){
								let tmpArr = [];
								modelArr?.forEach(function (item, i, array) {
									const price = item.item_color[0].item_sale_price;
									const commission=item.item_color[0].item_fx_cps;
									let product_image = (item.product_image ?? '') == 
									' ' ? '' :item.product_image
									console.log('分享有礼-',price,commission)
									
									tmpArr.push(
									{
										classDescribe: item.product_tips,
										className: item.product_name,
										image:product_image,
										price: price,// 课程价格
										commission:commission,// 佣金
									});
								})
							
								modelArr = tmpArr;
							}
							console.log('分享有礼modelArr---',modelArr)
							
							
							let tmp = that.newsitems[index];
							tmp.loadComplete = true;
							tmp.records = data.records;
							tmp.pageNum = pageNum;
							tmp.status ='more';
							that.status = 'more';
							if(tmp.pageNum >= data.records){
							 	tmp.status ='noMore';
								that.status = 'noMore';
							}
							that.$set(that.newsitems, index, tmp);
							
							if(force_refresh){
								//替换model大数组 里面对应的单页面的小数组
								that.$set(that.itemsListArr, index, modelArr);
								console.log('---model---00-',modelArr.length);
							}else{
								modelArr = that.itemsModelArr.concat(modelArr);
								console.log('---model---11--',modelArr.length);
							}
							
							//页面是否加载完成
							that.setData({
								itemsModelArr:modelArr
							});
							
						} else {
					    	console.log('--urlStr---msg--status----',urlStr,msg,status);
							uni.showToast({
								icon: 'none',
								title: msg
							})
						}
						
						that.setData({
							loadComplete: true
						})
					},
					fail: function(data) {
						that.setData({
							loadComplete: true
						});
						uni.showToast({
							icon: 'error',
							title: "网络异常请重试！"
						})
					}
				});
			},
			
			
			//初始化数据
			initData: function(force_refresh) {
				var that = this;
				//掉用接口数据
				that.loadBrandsAndProduncts(that.tabIndex, 1, force_refresh)
			},
			
			scrolltolower:function(index){
				
				console.log('---loadMore----');
				this.loadMore();
			},
				
			loadMore() {
				let that = this;
				that.status = 'loading';
				let tmp = that.newsitems[that.tabIndex];
				tmp.status ='loading';
				that.$set(that.newsitems, that.tabIndex, tmp);
				
				setTimeout(() => {
					this.addData(this.tabIndex);
				}, 500);
			},
			
			addData(e) {
				
				if (this.newsitems[e].records <= this.newsitems[e].pageNum) {
					// this.newsitems[e].loadingText = '没有更多了';
					this.status = 'noMore';
					let tmp = this.newsitems[e];
					tmp.status = 'noMore';
					this.$set(this.newsitems, e, tmp);
					return;
				}
				
				this.loadBrandsAndProduncts(this.tabIndex, this.newsitems[e].pageNum+1, false);
			},
			
			
			async changeTab(e) {
				
				console.log('changeTab');
		        
				let that  = this;
				let tapIndex = e.target.current;
				
				//如果loadComplete 说明那个tapIndex 没有加载过数据 发送请求
				if (!that.newsitems[tapIndex].loadComplete) {
				
					that.loadBrandsAndProduncts(tapIndex, 1, true);
				}else{
					that.setData({
						itemsModelArr:that.itemsListArr[tapIndex]
					});
				}
				this.isClickChange = false;
				this.tabIndex = tapIndex; 
				
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
				//切换tab 的时候 将pageNum 重置
				for (var i = 0 ,length = that.newsitems.length; i <length; i++) {
					let tmp = that.newsitems[i];
					tmp.pageNum =1;
					that.$set(that.newsitems, i , tmp);
				}
			  
				let tapIndex = e.currentTarget.dataset.current;
				if (this.tabIndex === tapIndex) {
					return false;
				} else {
					this.isClickChange = true;
					this.tabIndex = tapIndex;
				}
			},
			
					
		},
		
			
		onLoad: function(opt) {
			
			let user_income1 = uni.getStorageSync('user_income');
			let user_money1 = uni.getStorageSync('user_money');
		    this.setData({
		        user_income: user_income1,
		        user_money: user_money1,
		    });
			
			//页面数据初始化
			this.initPageData();
		},
 
		onShow: function(opt) {
			
		},
         
		onReady:function(){
			
			
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
			
			// this.$refs.guessYouLike.scrollbottom();
		},
		
		
	};

</script>

<style lang="scss" >

	.page{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		// height: 100%;
		// min-height: 100%;
		background-color: #ffffff;
		background-size: cover !important;
		background-position: top center !important;
		margin-bottom:var(--window-bottom);
	}
	
	.flexCol{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
	
	.flexRow{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	
	.m-section-top{
		// margin: 10rpx 30rpx 0rpx;
		position: absolute;
		left: 62rpx;
		top: 50rpx;
		height: 90rpx;
	    display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-between;
	
		.m-money-title{
			height: 60rpx;
			line-height: 60rpx;
			color: #333333;
			font-size: 50rpx;
			font-family: PingFangSC-Bold, PingFang SC;
			font-weight: 600;
		}
		.m-des-title{
			height: 28rpx;
			line-height: 28rpx;
			color: #333333;
			font-size: 20rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
		}
	}	 
	
	.m-section-bottom{
		position: absolute;
		width: 630rpx;
		left: 62rpx;
		bottom: 35rpx;
		height: 90rpx;
	    display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	   
	    .m-bottom-rightview{
			height:60rpx ;
			width: 148rpx;
			color:#984E13 ;
			border-radius: 45rpx;
			font-size: 32rpx;
			font-weight: 500;
			text-align: center;
			font-family: PingFangSC-Medium, PingFang SC;
			background:-wbkit-linear-gradient(to left,#F2BC8D,#FFD29C);
			background:linear-gradient(to left,#F2BC8D,#FFD29C);
		}
		.m-bottom-leftview{
			 height: 75rpx;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-between;
				
			.m-draw-title{
				height: 42rpx;
				line-height: 42rpx;
				color: #8E5223;
				font-size: 36rpx;
				font-family: PingFangSC-Bold, PingFang SC;
				font-weight: 600;
			}
			
			.m-des-deaw{
				height: 28rpx;
				line-height: 28rpx;
				color: #8E5223;
				font-size: 20rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
			}
		}
	}	 
	
	
	.m-tabbar-view{
		
		// border-bottom:#F0F0F0 1rpx solid;
		// border-bottom:#FF0000 2rpx solid;
		// padding-left:10rpx;
		// padding-right:10rpx;
		// background-color: #007AFF;
		// height: 85rpx;
		
		.uni-swiper-tab {
		   
			line-height: 72rpx;
			height: 72rpx;
			border: 0;
			width: 690rpx;
		    display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			
			.swiper-tab-list{
		        flex: 1;
				width: 172rpx;
				line-height: 70rpx;
				height: 70rpx;
				color: #333333;
				font-size: 30rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
				margin: 0rpx;
				text-align: center;
				
				.swiper-active{
				   color:#333333;
				   font-size:34rpx;
				}
				
				.swiper-unactive{
					 font-size:30rpx;
				}
				
				.selTab-text{
					
					
				}
				
				.bg-main{
					height: 10rpx;
					width: 40rpx;
					border-radius: 10rpx;
					background-color: #F43D3E;
				}
			}
		}
		
	}
	
	
    .m-order-content{
		
		margin: 30rpx 30rpx 0;
		height: 120rpx;
		background-color:#F7F8FB ;
		border-radius: 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		
		.m-order-detail{
			flex: 1;
			margin-top: 22rpx;
			// margin-bottom: 12rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			// background-color: #F3A73F;
			padding-bottom: 15rpx;
			
			.m-num-title{
				height: 42rpx;
				line-height: 42rpx;
				color: #333333;
				font-size: 36rpx;
				font-weight: 600;
				font-family: PingFangSC-Bold, PingFang SC;
				margin-bottom: 10rpx;
			}
			.m-descrip-title{
				
				height: 33rpx;
				line-height: 33rpx;
				color: #666666;
				font-size: 24rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
				
			}
		}
	}
	
	
	.m-header-BgImg {
		
		// width: 100%;
		height: 254rpx;
		top: 0rpx;
		left: 0rpx;
		border-radius: 16rpx;
		margin:10rpx 22rpx 10rpx;
		background: url(https://qnsp.zcskjy.com/zc_images/images/my/incomeBgImg.png) no-repeat;
		background-size:100% 100%;
		background-attachment:fixed;
		
		.menu-view{
			padding: 10rpx 50rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			
		}
		
		.member-top{
			
			// background-color: #0077AA;
		    padding: 100rpx 10rpx 0 ;
			// margin-top:var(--status-bar-height);
			// width: 100%;
			height: 100rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			
			.right-view{
				// width: 100rpx;
				height: 100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				// justify-content: space-between;
				width: auto;
			}
			
			.icon-view{
				width: 80rpx;
				height: 100%;
				// background-color: #F0AD4E;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				.m-image-img{
					// background-color: #007AFF;
					width: 42rpx;
					height: 42rpx;
				}
			}
		}
	}
	
	
	.uni-fansview{
		
		height: 80rpx;
		width: 690rpx;
		margin: 30rpx 30rpx 20rpx;
		display: flex;
		border-radius: 6rpx;
        flex-direction: row;		
		align-items: center;
		justify-content: space-around;
		background-color: #F7F8FB;
		
		.nav-item{
			border-radius: 6rpx;
			width: 223rpx;
			height: 70rpx;
			text-align: center;
			color: #666666;
			font-family: PingFangSC-Regular, PingFang SC;
		}
		
		.nav-item-on{
			border-radius: 6rpx;
			width: 223rpx;
			height: 70rpx;
			background-color: #FFFFFF;
			text-align: center;
			color: #333333;
			font-family: PingFangSC-Medium, PingFang SC;
		}
		
		.m-fans-Text{
			height: 70rpx;
			line-height: 70rpx;
			font-size: 28rpx;
			font-weight: 400;
			// font-family: PingFangSC-Medium, PingFang SC;
		}
	}
	
</style>


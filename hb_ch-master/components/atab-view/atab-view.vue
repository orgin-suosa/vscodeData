<template>
	
	<view class="m-tab-view" style="background-color:#FFFFFF;">
	
		<view class="m-section-header">
			<view class="m-section-title" >{{title}}</view>
			<navigator :url='loadMoreUrl'  hover-class="none">
				 <view class="m-section-more"> {{__('更多')}}</view>
			</navigator>
		</view>
		
		<view style="border-bottom:#F0F0F0 1rpx solid;padding-left:30rpx;padding-right:30rpx;margin-bottom: 40rpx;">
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
		
		<swiper :current="tabIndex" :style="'height:'+viewHeight+'rpx'"
		 class="swiper-box" :duration="300" @change="changeTab">
		  <swiper-item v-for="(tab, index1) in tabBars" :key="index1">
			<view class="" v-if="itemsModelArr.length > 0" >
				<scroll-view class="list"  v-if="eltmType == 0">
				  <block v-for="(model, index2) in itemsModelArr" :key="index2">
						<newstextcell :itemmodel="model" @itemClick="goNewsDetail" v-if="model.img == null || model.img.length == 0"></newstextcell>
						<newscell :itemmodel="model" @itemClick="goNewsDetail" v-else> </newscell>
				  </block>
				</scroll-view>
				
				<scroll-view class="list" scroll-y  v-else-if="eltmType == 1">
					
					<view class="video-contentview" >
						<block v-for="(model, index2) in itemsModelArr" :key="index2">
							<videoitem :itemmodel="model" @click="onVideoClick(index2)"> </videoitem>		 
						</block>
					</view>
				</scroll-view>	
				
				<scroll-view class="list"  v-else-if="eltmType == 2">
				  <block v-for="(itemmodel, index2) in itemsModelArr" :key="index2">
					 <view class="content-item-view" >
						<view class="item-top-view">
							<view class="m-topleft">
								<view class="m-top-title">{{timeStr(itemmodel)}}</view>
								<image class="m-image-img" mode="aspectFill" :src="(itemmodel.countryUrl ||itemmodel.countryUr )" />
								<view class="m-comfrom" >{{itemmodel.affect ==0 ? '待确定':'已公布'}} </view>
							</view>
							<view class="m-contentview" style="">
								<block v-for="count in 5">
									<image class="m-xing-img"  mode="aspectFill" :src="imageStr(itemmodel.star,count)"/>
								</block>
							</view>
						</view>
						<view class="item-center-view">
							<view class="m-center-title">{{itemmodel.title || itemmodel.note}}</view>
							<view class="m-affectview" style="">
								<image class="m-affect-img" mode="aspectFit" :src="stateImage(itemmodel)"/>
							</view>
						</view>
						<view class="item-botterm-view" v-if="tabIndex ==0">
							<view class="m-bottom-title">{{'前值: '+'  '+numStr(itemmodel.previous)}}</view>
							<view class="m-bottom-title">{{'预期: '+'  '+numStr(itemmodel.consensus)}}</view>
							<view class="m-bottom-title">{{'公布: '+'  '+numStr(itemmodel.actual)}}</view>
						</view>
					</view>
	              </block>
				</scroll-view>
			</view>	
			<view class="" style="height: 100%; display: flex;flex-direction: column;align-items: center;justify-content: center;" v-else>
			    <aempty-view ></aempty-view>	
			</view>
			
		  </swiper-item>
	    </swiper>
		
	</view>
</template>

<script>
	
	import quickcell from '@/components/add-new/quickcell.vue'
	import newscell from '@/components/add-new/newscell.vue'
	import newstextcell from '@/components/add-new/news-text.vue'
	import videoitem from '../../components/add-new/videoItem.vue'

	
	export default {
		
		name: "atab-view",
		
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
			loadMoreUrl:'',
			requestUrl:'',   //请求的url 
			requesturlarr:Array,
			encodeUrl:false, //是否对url 进行编码 
			//tabBar 的标题数组 数据
			tabbarItemArr:Array, 
		},
		
		data() {
			return {
				
				scrollLeft:0,
				loadPageFlag: true,
				isClickChange:false,
			    
				//状态数组 
				statrImgArr:[
					'https://qnsp.zcskjy.com/zc_images/images/stateImg0.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg1.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg2.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg3.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg4.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg5.png',
					'https://qnsp.zcskjy.com/zc_images/images/stateImg6.png',
				],
				//
				todayDate:'',
				// view默认高度
				// viewHeight:800,
				viewHeight:420, //在viewHeight 里面带单位
				//选中的 tabbar 默认选择的是第一个
				tabIndex: 0,
				//存储单个的tab 是否已经加载过数据状态的数组
				newsitems: [],
				// 切换之后 的数组 
				tabBars:[],
				//展示的列表数据   所有列表数据
				itemsListArr:[],
				//展示的列表数据  
				itemsModelArr:[],
				
				//瀑布流需要的东西
				leftHeight: 0,
				rightHeight: 0,
				leftList: [],
				rightList: [],
				modelNum:0, //计数器
			}
		},
		created: function() {
			
			//获取当天日期
			this.getTodayDate();
			//页面数据初始化
			this.initPageData();
		},
		
		onLoad:function(){
			console.log('---onLoad---');
			
		},
		
		computed:{
			
		},
		
		methods: {
			
			imageStr: function (star,index) {
			  if(star < index){
				  return 'https://qnsp.zcskjy.com/zc_images/images/xing3.png'
			  }else{
				  return 'https://qnsp.zcskjy.com/zc_images/images/xing2.png'	
			  }
			},
			
			stateImage: function (itemmodel) {
			   return this.statrImgArr[itemmodel.affect];
			},
			
			
			timeStr(itemmodel){
				if(itemmodel.time !== 'null'){
					let arr = itemmodel.time.split(' ');
					if(arr.length == 2){
						return arr[1];
					}
				}
				return itemmodel.time;
			},
			
			numStr(title){
				if(title == null || title == 'null'){
					return '--';
				}
				return title;
			},
			
			// rpx转px
			rpxToPx(rpx) {
			  const screenWidth = uni.getSystemInfoSync().screenWidth;
			  return (screenWidth * Number.parseInt(rpx)) / 750
			},
			 
			// px转rpx
			pxToRpx(px) {
			  const screenWidth = uni.getSystemInfoSync().screenWidth;
			  return (750 * Number.parseInt(px)) / screenWidth
			},
			
			//跳转到资讯详情页面
			goNewsDetail(data){
				uni.navigateTo({
					url: '/ganhuo/newslistpage/newdetail?id='+data.id
				});
			},

			//跳转到资讯详情页面
			goFinanceDetail(data){
				// uni.navigateTo({
				// 	url: '/ganhuo/newslistpage/newdetail?id='+data.id
				// });
			},			
			
			moreBtnClick(data) {
				uni.navigateTo({
					url: '/ganhuo/quicknewspage/quickdetail?title='+data.linkTitle+'&linkUrl'+data.linkUrl
				});
			},
			
			async getScrollViewHeight(){
			
				// let scrollview = await this.getElSize('scrollview');
				// console.log('scroll----',scrollview.height);
				// this.setData({
				//    viewHeight:scrollview.height * 1.8+100
				// });
				
				// :id="'tab_'+'leftvideo'+index"
				// :id="'tab_'+'rightvideo'+index"
				
				let leftHeight = 0;
				for (let i = 0; i < this.leftList.length; i++) {
				  let result = await this.getElSize('leftvideo'+i);
				  // console.log('--left---',result.height);
				  leftHeight += result.height;
				}
				
				let leftInterval = 10 * (this.leftList.length+1);
				leftHeight += leftInterval;
				
				let rightHeight = 0;
				for (let j = 0; j < this.rightList.length; j++) {
				  let result = await this.getElSize('rightvideo'+j);
				   // console.log('--right---',result.height);
				  rightHeight += result.height;
				}	
				
				let rightInterval = 10 * (this.rightList.length+1);
				rightHeight += rightInterval;
				
				console.log('--height---',leftHeight,rightHeight);
				
				// let realleftheight = this.pxToRpx(leftHeight *2);
				// let realrighttheight = this.pxToRpx(rightHeight *2);
				// console.log('--realleftheight---',realleftheight,realrighttheight);
				
				//设置 视频view的高度
				if(leftHeight > rightHeight){
					this.setData({
					   viewHeight:leftHeight+'px',
					});
				}else{
					this.setData({
					   viewHeight:rightHeight+'px',
					});
				}
			},
			
			
			initPageData: function(){
				let that = this;
			    
				let tmp = [];
				for (let i = 0, length = that.tabbarItemArr.length; i < length; i++){
					tmp.push({'id':i,'tabType_id':i,classification:that.tabbarItemArr[i],category_name:that.tabbarItemArr[i]});
				}
				// console.log('----tmp---',tmp);
				that.setData({
					tabBars: tmp
				})
				that.itemsListArr = [];
				//newsitems 
				let ary = [];
				for (let i = 0, length = that.tabBars.length; i < length; i++){
					ary.push({loadPageFlag:false,pageNum:1,tabType_id:that.tabBars[i].tabType_id});
					that.itemsListArr.push([]);
				}		
				that.newsitems = ary;
			
			    // console.log('--height----',that.eltmType);
			   //热门资讯和财经 直接设置高度
			    if(that.eltmType == 1){
			     	that.setData({
			     	   viewHeight:830,
			     	});
			     }else if(that.eltmType == 2){
			     	that.setData({
			     	   viewHeight:690,
			     	});
			     }else if(that.eltmType == 0){
					 that.setData({
					    viewHeight:420,
					 });
				}
			
				//请求具体的 列表的数据  默认第一个tab 的id 为0  第一次加载的页面为1
				that.loadBrandsAndProduncts(that.tabIndex, this.tabBars[this.tabIndex].tabType_id||0, 1, false)
				
	  
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
					urlString =  encodeURI(that.requestUrl+'pageSize=4&pageNum=1'+'&classification='+classification)
					
				}else if(that.eltmType == 2){
					
					params.date = that.todayDate;
					params.pageNum = pageNum;
					params.pageSize = 10;
					urlString = that.requesturlarr[index];
				}
				
				// console.log('params111----',params);
				
				uni.request({
					 method:'GET',
					 data:params,
					 url: urlString,
					 success: function(data, status) {
						
						if (data.statusCode == 200) {
							
							let tmp = that.newsitems[index];
							tmp.loadPageFlag = true;
							// tmp.pageNum = pageNum;
							that.$set(that.newsitems, index, tmp);
							
							let modelArr = data.data.result.list;
							console.log('modelArr----',modelArr);
							
							if(that.eltmType == 1){
								that.$set(that.itemsListArr, index, modelArr);
								
								//页面是否加载完成
								that.setData({
									loadPageFlag:true,
									itemsModelArr:modelArr,
								});
							}else if(that.eltmType == 0){
								let ary = modelArr.slice(0,2);
								that.setData({
									loadPageFlag:true,
									itemsModelArr: ary
								})
								that.$set(that.itemsListArr, index, ary);
							}else if(that.eltmType == 2){
								let ary = modelArr.slice(0,3);
								that.setData({
									loadPageFlag:true,
									itemsModelArr: ary
								})
								that.$set(that.itemsListArr, index, ary);
							}
							
							// 热门资讯 先把数据分成瀑布流数据
							// if(that.eltmType == 1){
								//改成瀑布流的数据
								// that.addList(that.itemsModelArr)
							// }
						}else {
							that.$.confirm(msg)
						}
					}	
				});
			
			},
			
			async changeTab(e) {
			  console.log('changeTab');
			  let that = this;
			  let index = e.target.current;
			
			  //如果loadPageFlag 说明那个index 没有加载过数据 发送请求
			  if (!that.newsitems[index].loadPageFlag) {
			     let tabType_id = that.tabBars[index].tabType_id;
			     that.loadBrandsAndProduncts(index, tabType_id, 1, false);
			  } else {
				  
				 that.setData({
				   // loadPageFlag: true,
				   itemsModelArr: that.itemsListArr[index],
				 }); 
			  }
			
			  if (that.isClickChange) {
			    that.tabIndex = index;
			    that.isClickChange = false;
			    return;
			  }
			  let tabBar = await that.getElSize('tab-bar'),
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
			 	this.scrollLeft = tabBarScrollLeft + nowWidth;
			  }
			  if (width + nowWidth - tabBarScrollLeft < winWidth/2) {
			 	this.scrollLeft =  0;
			  }
			  if (width < tabBarScrollLeft) {
			    this.scrollLeft = width;
			  }
			  this.isClickChange = false;
			  this.tabIndex = index; //一旦访问data就会出问题
			},
			
			getElSize(id) {
			  //得到元素的size
			  return new Promise((res, rej) => {
			    uni.createSelectorQuery()
			      .select('#tab_' + id)
			      .fields(
			        {
			          size: true,
			          scrollOffset: true,
			        },
			        (data) => {
			          res(data);
			        },
			      )
			      .exec();
			  });
			},
			
			async tapTab(e) {
			  //点击tab-bar
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
					console.log('nowWidth-------',nowWidth,this.tabBars[tabIndex].id);
			  
			    if (width + nowWidth - tabBarScrollLeft > winWidth/2) {
			    	this.scrollLeft = tabBarScrollLeft + nowWidth;
			    }
			    if (width + nowWidth - tabBarScrollLeft < winWidth/2) {
			   	    this.scrollLeft =  0;
			    }
			   
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
			
			// 瀑布流 监听高度变化
			onHeight(height, tag) {
				if (tag == 'left') {
					this.leftHeight += height;
				} else {
					this.rightHeight += height;
				}
				// console.log('onHeight---',height,this.leftHeight,this.rightHeight);
				
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
			
			addList(res) {
				// 获取到的数据，请注意数据结构
				// console.log(res);
				
			   this.leftHeight = 0;
			   this.rightHeight = 0;
			   this.leftList = [];
			   this.rightList = [];
			   this.modelNum = 0;
			   
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
				this.leftList = left;
				this.rightList = right;
				
				// setTimeout(() => {
				// 	this.getScrollViewHeight();
				// }, 1000);
			}
		},
	}

</script>

<style lang="scss" scoped>
	
	.m-section-header{
		  height: 90rpx;
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
	
	    padding: 20rpx 20rpx;
		// background-color: #0077AA;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		align-content: flex-start;
		flex-wrap: wrap;
		justify-content: space-between;  
	}
	
	.waterfall-box {
	 	padding: 20rpx 10rpx;
	 	box-sizing: border-box;
	 
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
    
	
	.content-item-view {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: space-between;
	  height: auto;
	  padding: 16rpx 30rpx;
	  border-bottom: #E9E9E9 1rpx solid;
	
	  .item-top-view{
		  display: flex; 
		  flex-direction: row;
		  align-items: center;
		  justify-content: space-between;
		  height: 33rpx;
		  width: 100%;
		  padding-top: 18rpx;
		 
		.m-topleft{
			 display: flex;
			 flex-direction: row;
			 align-items: center;
			 justify-content: flex-start; 
			 
			.m-top-title{
			  height:30rpx;
			  line-height:30rpx;
			  font-size: 26rpx;
			  font-weight:Medium;
			  color:#666666;
			  text-align:left;
			  width: auto;
			  margin-right: 24rpx;
			  font-size: 26rpx;
			  font-weight: 400;
			  font-family: PingFangSC-Regular, PingFang SC;
			}
			
			.m-image-img{
			  height: 30rpx;
			  width: 45rpx;
			   margin-right: 24rpx;
			}
			
			.m-comfrom{
				height:33rpx;
				line-height:33rpx;
				color:#666666;
				font-size:24rpx;
				font-weight:400;
				font-family: PingFangSC-Regular, PingFang SC;
			}  
		}
		  
		.m-contentview{
			height: 40rpx;
			width: 160rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-around;
			.m-xing-img{
				width: 28rpx;
			   height: 26rpx;
			}	 
		}  
	  }
	  
	  .item-center-view{
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  justify-content: space-between;
		  height: auto;
		  padding-top: 10rpx ;
		  padding-bottom: 10rpx;
		  width: 100%;
		  
		  .m-center-title{
			 width: 60%; 
			 height: auto;
			 line-height:40rpx;
			 color: #333333;
			 font-weight:Medium;
			 color:#333333;
			 text-align:left;
			 font-size: 28rpx;
			 font-weight: 600;
			 font-family: PingFangSC-Medium, PingFang SC;
		  }
		  
		  .m-affectview{
			  height: 48rpx;
			  width: 190rpx;
			  display: flex;
			  flex-direction: row;
			  align-items: center;
			  justify-content: center;
			  .m-affect-img{ 
				height: 44rpx;
				width: 188rpx;  
			  }
		  }
	  }
	  
	  .item-botterm-view{
		  display: flex;
		  flex-direction: row;
		  align-items: center;
		  justify-content: space-between;
		  height: 30rpx;
		  width: 100%;
		  padding-bottom: 18rpx;
		  .m-bottom-title{
			height:30rpx;
			line-height:30rpx;
			font-size: 22rpx;
			color:#666666;
		  }
	   }
	}
	
	 
</style>

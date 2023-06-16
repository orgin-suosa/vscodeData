<template>
  <!-- #ifndef H5-->
<view class="uni-tab-bar page"  style="background-color: #ffffff">
  <!-- #endif -->
  <!-- #ifdef H5-->
<view class="uni-tab-bar page"  style="background-color: #ffffff">
  <!-- #endif -->
  <!-- #ifdef H5-->
  <!-- <open-app /> -->
  <!-- #endif -->
  
	<aheader-view :bgImg="aheaderModel.bgImg" :showShare="true"  :backWhite="aheaderModel.backWhite" @rightClick="onShareBox"  @back="backView()"></aheader-view>
    <!-- style="background:#ffffff;height: 100rpx;border-radius: 24rpx 24rpx 0rpx 0rpx;margin-top:-30rpx;z-index: 1;" -->
    <view class="m-swiper-header" style="border-bottom:#F0F0F0 1rpx solid;">
      <scroll-view  id="tab_tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft"
        style="background: #ffffff; border: 0; width: 670rpx;margin: 10rpx 10rpx 0rpx 30rpx"
        v-if="tabBars.length > 1">
			<view v-for="(tab, index) in tabBars" :key="tab.id" class="swiper-tab-list" 
			:class="tabIndex == index ? 'active' : ''" :id="'tab_' + tab.id" :data-current="index" @click="tapTab">
				 <view class="text" :style="index == tabIndex ?'color:#F43D3E;font-size: 34rpx;':'font-size: 32rpx;'">{{tab.category_name || "　"}}</view>
				 <view class="bg-main" :style="tabIndex==index ? '' : 'background-color: #FFFFFF;'"></view>

			</view>
      </scroll-view>
         <view class="calendar-btn" style="position: relative;" >
      		<view style="padding:0 10px;">
      			<view class="example-body" style="padding-top: 25rpx;">
      				<uni-datetime-picker type="date" v-model="todayDate" @change="changedata">
      					<image style="width: 40rpx; height: 40rpx;"
      					mode="aspectFill" src="https://qnsp.zcskjy.com/zc_images/images/calendarImg.png" />
      				</uni-datetime-picker>
      			</view>
      		 </view>	
         </view>
    </view>
    
    <view class="data-view">
      <view class="borderbtn-view" style=" ;" @click="beforeWeek">
        <image src="https://qnsp.zcskjy.com/zc_images/images/left-btn.png" mode="aspectFill" style="width: 12rpx; height: 26rpx"></image>
      </view>
      <view class="select-dataview" style="">
        <block v-for="(model, index1) in dataArr" :key="index1">
          <view class="btn-view" :class="dataIndex == index1 ? 'select' : 'unselect'" @click="dataBtnClick(index1)">
            <!-- {{ model }} -->
            <view class="day-title" :class="dataIndex == index1 ? 'title-select' : 'untitle-select'" style="">{{ model.label }}</view>
            <view class="data-title" :class="dataIndex == index1 ? 'data-select' : 'undata-select'" style="">{{ model.data }}</view>
          </view>
        </block>
      </view>
      <view class="borderbtn-view" style="" @click="nextWeek">
        <image src="https://qnsp.zcskjy.com/zc_images/images/nav.png" mode="aspectFill" 
		style="width: 12rpx; height: 26rpx"></image>
      </view>
    </view>

    <swiper v-if="loadPageFlag" :current="tabIndex" style="height: auto" class="swiper-box" :duration="300" @change="changeTab">
      <swiper-item v-for="(tab, index1) in tabBars" :key="index1">
        <scroll-view class="list" scroll-y @scrolltolower="scrolltolower()" v-if="itemsModelArr.length>0">

			  <block v-for="(itemmodel, index2) in itemsModelArr" :key="index2">
				<view class="content-item-view" >
					<view class="item-top-view">
						<view class="m-topleft">
							<view class="m-top-title">{{timeStr(itemmodel)}}</view>
							<image class="m-image-img" mode="aspectFill" :src="(itemmodel.countryUrl ||itemmodel.countryUr )" />
							<view class="m-comfrom" >{{itemmodel.affect ==0 ? '待确定':'已公布'}} </view>
						</view>
						<view class="m-contentview" style="" v-if="tabIndex ==0 || tabIndex ==1">
							<block v-for="count in 5">
								<image class="m-xing-img"  mode="aspectFill" :src="imageStr(itemmodel.star,count)"/>
							</block>
						</view>
					</view>
					<view class="item-center-view" >
						<view class="m-center-title">{{itemmodel.title || itemmodel.note}}</view>
						<view class="m-affectview" style="" v-if="tabIndex ==0">
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
		  <uni-load-more :status="status" ></uni-load-more>
		  <aexplan-view v-if="itemsModelArr.length >0"></aexplan-view>
		  
        </scroll-view>
		<view class="" style="height:100%;display: flex;flex-direction: column;
		align-items: center;justify-content: center;"
		 v-else>
		    <aempty-view ></aempty-view>	
		</view>
      </swiper-item>
	  
    </swiper>
	<!-- <aexplan-view style="position: relative;left: 0;bottom: 0;"></aexplan-view> -->
	<shareGApp :shareDataDefault="shareData" ref="shareBoxApp" />
  </view>
</template>
<script>
	
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import { mapState, mapMutations } from 'vuex';
import shareGApp from '@/components/share-g-app';
import { initWeChatActivity, addListenWeChatForward, wxClose } from '@/helpers/initWXShare.js';
export default {
  components: {
	shareGApp
  },

  data() {
    return {
      options: {},
    
	  single : '2022-05-06',
      todayDate: '2022-05-03', //选择的日期 默认当天日期
      dataIndex: 6,
      currntTimeStamp: '', //当前记录的时间戳
       
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
	   
      //请求是否完成   默认false 请求完成改为true
      loadPageFlag: true,
      hideDiy: false,
      ShareImg: '',
      ShareTitle: '',
      scrollLeft: 0,
      isClickChange: false,
	  //加载更多的显示
	  status: 'more',
      //aheader-view 的数据
      aheaderModel: { title: '财经日历', backWhite:true, detailtitle: '聚合每日重要事件，实时了解市场动向', 
	  bgImg: 'https://qnsp.zcskjy.com/zc_images/zc_images/images/zc_sjb3.png' },
      dataArr: ['01', '02', '03', '04', '05', '06', '07'],
      //选中的 tabbar 默认选择的是第一个
      tabIndex: 0,
      //tabBar 的列表数据
      tabBars: [],
      //存储单个的tab 是否已经加载过数据状态的数组
      newsitems: [],
      //展示的列表数据   所有列表数据
      itemsListArr: [],
      //展示的列表数据
      itemsModelArr: [],
      //url 接口列表的数组
      urlArr: ['/v1/news/calendar/list?', '/v1/news/calendar/event/list?', '/v1/news/calendar/holiday/list?'],
	  shareData:{},
	  shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg` + this.$FT.versionKey(),
    };
  },
  
  computed: mapState(['Config','userInfo']),
  created() {
  	this.getSystem();
    this.initShareData();
  },
  methods: {
	 initShareData(){
	 	let that = this;
	 	
	 	let $href = that.$.sprintf('%s/h5/ganhuo/financelist/financelist?uid=%d', that.Config.SiteUrl, that.userInfo.user_id, '&showOpenApp=true');
	 	
	 	// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
	 	// #ifdef APP-PLUS
	 	$href = that.$.sprintf('%s/h5/ganhuo/financelist/financelist?uid=%d', that.Config.SiteUrl, that.userInfo.user_id, '&showOpenApp=true');
	 	// #endif
	 	// #ifdef MP-WEIXIN
	 	$href = '/h5/ganhuo/financelist/financelist?uid=' + '&showOpenApp=true';
	 	// #endif
	 	
	 	that.setData({
	 		shareData: {
	 			shareTitle: '事件宝',
	 			shareText: '聚合每日重要事件,实时了解重要市场机会',
	 			href: $href,
	 			image: that.shareLogo,
	 		},
	 	});
	 	console.log('分享入参：', that.shareData);
	 	// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
	 },
	 async checkAuthProcess(signature) {
	 	let that = this;
	 	console.info('长乘资质--初始化微信流程------------>signature---1.2',signature);
	     const ua = navigator.userAgent.toLowerCase();
	     const isWeChat = ua.indexOf('micromessenger') !== -1;
	 	console.info('长乘资质------是否处于微信环境------------->1.2', isWeChat);
	 	if (!isWeChat) return;
	 
	 	// 初始化微信活动主流程
	 	await initWeChatActivity(signature);
	 	 // 监听微信转发
	 	addListenWeChatForward(this.handleForwardData(), () => {
	 	  // 转发回调，增加转发记录
	 	  console.info('长乘资质-转发数据', this.handleForwardData());
	 	});
	     },
	     // 转发参数处理
	     handleForwardData() {
	       return {
	         title: this.shareData.title,
	         desc: this.shareData.shareText,
	         imgUrl: this.shareData.image,
	         link: this.shareData.href,
	       };
	 },
	 async getSignature() {
	   const that = this;
	   let _href = encodeURIComponent(location.href.split('#')[0]);
	   const params = {
	     url: encodeURIComponent(_href), // url
	     // url: 'https://shop-qa.zcskjy.com/h5/', // url
	   };
	   console.log('getSignature-params', params);
	   console.log('getSignature-url', that.Config.URL.WXSignature);
	   uni.request({
	     url: that.Config.URL.WXSignature,
	     method: 'get',
	     data: params,
	     dataType: 'json',
	     success: (res) => {
	       const data = res.data;
	       console.log('getSignature-data', data);
	       let result = res.data.result;
	       // console.log('getSignature-complete-res', result);
	     },
	     fail: () => {},
	     complete: (res) => {
	       let result = res.data?.result;
	       console.log('getSignature-complete-res', result);
	       that.signature = {
	         // appId: 'wx1935506901780516', // 小程序的唯一标识
	         appId: 'wxd74f2b85b1b724a7', // 必填，公众号的唯一标识
	         timestamp: result?.timestamp, // 必填，生成签名的时间戳
	         nonceStr: result?.nonceStr, // 必填，生成签名的随机串
	         signature: result?.signature, // 必填，签名，见附录1
	       };
	 	console.log('getSignature-checkAuthProcess-参数', that.signature);
	 	 that.checkAuthProcess(that.signature);
	     },
	   });
	 },
	 getSystem() {
	   let that = this;
	   let port = uni.getSystemInfoSync().platform;
	   const ua = navigator.userAgent.toLowerCase();
	   const isWeChat = ua.indexOf('micromessenger') !== -1;

	   switch (port) {
	     case 'android':
	       that.android = true;
	       console.log('运行Android上', port); //android
	       break;
	     case 'ios':
		 	if (isWeChat){
				wxClose();
			};

	       that.isios = true;
	       console.log('运行iOS上', port); // ios
	       break;
	     default:
	       console.log('运行在开发者工具上'); //devtools
	       break;
	   }
	 },
	 onShareBox() {
	 	this.initShareData();
	 	// #ifndef MP-WEIXIN
	 	this.$refs.shareBoxApp.show();
	 	// #endif
	 },
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
	 
	changedata(e){
		console.log('----change事件:', e); 
		this.todayDate = e; 
		//需要计算一下 周围7天的日期
		console.log('-dataIndex-----',this.dataIndex);
		
		let date1 = new Date(this.todayDate);
		let insert = 6 - this.dataIndex;
		// console.log('inset---',insert);
		
		date1 = this.addDate(date1, insert);
		const weekTimestamp = new Date(date1);
		// const weekTimestamp = date.setDate(date.getDate() + insert);
		// const weekTimestamp = this.setDate(this.addDate(new Date(this.todayDate), insert));
		this.currntTimeStamp = weekTimestamp;
		console.log('weekTimestamp------', weekTimestamp);
		
		this.getDateWeek(weekTimestamp);
	 }, 
	
	getDateWeek(timestamp) {
	  //将时间数组 清零初始化
	  this.dataArr = [];
	
	  let ary = [];
	  /* 得到当前日期的时间戳 */
	  // const timestamp = Date.now()
	  // const timestamp = new Date(2019, 7, 30, 0, 0, 0, 0).getTime()
	  const dateWeek = Array.from(new Array(7)).map((_, i) => {
	    /* 得到当前周每一天的时间戳 */
	    const weekTimestamp = new Date(timestamp - i * 24 * 60 * 60 * 1000);
	
	    const fulltime = String(weekTimestamp.getFullYear()) + '-' + String(weekTimestamp.getMonth() + 1).padStart(2, '0') + '-' + String(new Date(weekTimestamp).getDate()).padStart(2, '0');
	
	    // const month = String(weekTimestamp.getMonth() + 1).padStart(2, '0') + '.' +
	    // 	String(new Date(weekTimestamp).getDate()).padStart(2, '0')
	    const date = String(new Date(weekTimestamp).getDate()).padStart(2, '0');
	    const value = JSON.stringify(i);
	    /* 得到周几后转换 */
	    // let label = weekTimestamp.getDay();
	   
		let weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
		let label = weeks[weekTimestamp.getDay()];
	   
	    // console.log('label-----', fulltime, date, label);
	    ary.unshift({ data: date, label: label, fulltime: fulltime});
	    return { value, date, label };
	  });
	  
	 for (let i = 0; i < ary.length; i++) {
	   let map =  ary[i];
	   if(map.fulltime == this.single){
		   map.label = '今天';
	   }
	 }
	  this.setData({
	    dataArr: ary,
	  });
	  if (this.newsitems.length > 0) {
	    this.dataBtnClick(this.dataIndex);
	  }
	},
	
	//点击日期切换
	dataBtnClick(index) {
	  this.setData({
	    dataIndex: index,
	  });
	  let map = this.dataArr[index];
	  this.todayDate = map.fulltime;
	  
	  //切换日期之后  需要将之前的大数组数据清除  状态数组清空
	  this.itemsListArr = [];
	  this.newsitems = [];
	  //newsitems
	  let ary = [];
	  for (let i = 0, length = this.tabBars.length; i < length; i++) {
	    ary.push({loadPageFlag: false, pageNum: 1, totalPage: 1, tabType_id: this.tabBars[i].tabType_id });
	    this.itemsListArr.push([]);
	  }
	  this.newsitems = ary;
	  
	  //掉用接口数据
	  this.loadBrandsAndProduncts(this.tabIndex, this.tabBars[this.tabIndex].tabType_id || 0, 1, true);
	},
	  
	addDate(date, n) {
	  console.log('addDate-----', date, n);
	  date.setDate(date.getDate() + n);
	  return date;
	},
	
	//获取时间戳
	setDate(date) {
	  console.log('---setDate--0--');
	  let week = date.getDay() - 4;
	  date = this.addDate(date, week * -1);
	 
	  this.currntTimeStamp = new Date(date);
	  console.log('-setDate---1---', this.currntTimeStamp);
	  return this.currntTimeStamp;
	},
	
	//上一周的数据
	beforeWeek() {
	  const that = this;
	
	 //之前的方法 
	  // const weekTimestamp = this.setDate(this.addDate(new Date(this.todayDate), -7));
		
		//改进的方法
	  let date1 = new Date(this.todayDate);
    	//6 - this.dataIndex 是计算出这一周最后一天的数据    //-7 是下一周的数据
		let insert = 6 - this.dataIndex  - 7;
    	date1 = this.addDate(date1, insert);
		const weekTimestamp = new Date(date1);
	
	  this.currntTimeStamp = weekTimestamp;
	 
	  this.getDateWeek(weekTimestamp, true);
	},
	//下一周的数据
	nextWeek() {
	  const that = this;
	  
	  //之前的方法 
	  // const weekTimestamp1 = that.setDate(that.addDate(new Date(this.todayDate), 7));
	  
	  //改进的方法
	  let date1 = new Date(this.todayDate);
	   //6 - this.dataIndex 是计算出这一周最后一天的数据    //加7 是下一周的数据
	  let insert = 6 - this.dataIndex + 7;
	  date1 = this.addDate(date1, insert);
	  const weekTimestamp = new Date(date1);
	  
	  this.$nextTick(() => {
	    // const timestamp = Date.now()
	    that.currntTimeStamp = weekTimestamp;
	    
	    that.getDateWeek(weekTimestamp, false);
	  });
	  
	},
	
    //返回上一级页面
    backView() {
      uni.navigateBack({
        delta: 1,
      });
    },

    //跳转到详情页
    goDetail(data) {
      uni.navigateTo({
        url: '/ganhuo/newslistpage/newdetail?id=' + data.id,
      });
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
	  this.single = date.year + '-' + date.month + '-' + date.date;
    },

    initPageData: function () {
      let that = this;

      let tmp = [];
      tmp.unshift({'id':0,tabType_id: 0, category_name: that.__('财经') });
      tmp.push({'id':1,tabType_id: 1, category_name: that.__('事件') });
      tmp.push({'id':2,tabType_id: 2, category_name: that.__('假期') });
      // tmp.push({'id':3, category_name:that.__('新股')});
      that.setData({
        tabBars: tmp,
      });

      that.itemsListArr = [];
      //newsitems
      let ary = [];
      for (let i = 0, length = that.tabBars.length; i < length; i++) {
        ary.push({ loadPageFlag: false, pageNum: 1, totalPage: 1,status:'more', tabType_id: that.tabBars[i].tabType_id });
        that.itemsListArr.push([]);
      }
      that.newsitems = ary;

      //请求具体的 列表的数据  默认第一个tab 的id 为0  第一次加载的页面为1
      that.loadBrandsAndProduncts(that.tabIndex, 0, 1, true);
    },

    // 请求具体的数据列表
    loadBrandsAndProduncts(index, tabType_id, pageNum, force_refresh) {
      var that = this;
      let params = {};
      params.date = that.todayDate;
      params.pageNum = pageNum;
      params.pageSize = '20';
      console.log('params----', params);

      uni.request({
        method: 'GET',
        data: params,
        url: that.Config.newsUrlStr + that.urlArr[that.tabIndex],
        success: function (data, status) {
          
          if (data.statusCode == 200) {
            uni.stopPullDownRefresh(); 
            that.status = 'more';
			 
			let modelArr = data.data.result.list;
			console.log('modelArr----', modelArr.length);
            let tmp = that.newsitems[index];
            tmp.loadPageFlag = true;
            tmp.totalPage = data.data.result.totalPage;
			tmp.status ='more';
            if(modelArr.length < 20){
             	tmp.status ='noMore';
				that.status = 'noMore';
            }
            tmp.pageNum = pageNum;
            that.$set(that.newsitems, index, tmp);

           
            // 为true 的时候  下拉刷新的操作
            //为 false 的时候 拼接数组 否则直接赋值
            if (force_refresh) {
              //替换model大数组 里面对应的单页面的小数组
              that.$set(that.itemsListArr, index, modelArr);
            } else {
				modelArr = that.itemsModelArr.concat(modelArr);
				console.log('---model---length--',modelArr.length);
              // let loadArr = that.itemsListArr[index];
              // loadArr = loadArr.concat(modelArr);
              // that.$set(that.itemsListArr, index, loadArr);
            }
            
            //页面是否加载完成
            that.setData({
              loadPageFlag: true,
			  itemsModelArr:modelArr 
              // itemsModelArr: that.itemsListArr[index],
            });
          } else {
            that.$.confirm(msg);
          }
        },
      });
    },

    //初始化数据
    initData: function (force_refresh) {
      var that = this;
     
      //掉用接口数据
      that.loadBrandsAndProduncts(that.tabIndex, this.tabBars[this.tabIndex].tabType_id || 0, 1, force_refresh);
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
      this.loadBrandsAndProduncts(this.tabIndex, tabType_id, this.newsitems[e].pageNum + 1, false);
    },

    async changeTab(e) {
      console.log('changeTab');
      let that = this;
      let index = e.target.current;

      //如果loadPageFlag 说明那个index 没有加载过数据 发送请求
      if (!that.newsitems[index].loadPageFlag) {
	
        let tabType_id = that.tabBars[index].tabType_id;
        that.loadBrandsAndProduncts(index, tabType_id, 1, true);
      } else {
		  
		let tmp = that.newsitems[index];
        that.setData({
		  status:tmp.status,
          loadPageFlag: true,
          itemsModelArr: that.itemsListArr[index],
        });
      }
	  
	  let tmp = that.newsitems[index];
	  that.status = tmp.status;

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
      this.tabIndex = index; 
	  
	  //切换tab 的时候 将pageNum 重置
	  for (var i = 0 ,length = that.newsitems.length; i <length; i++) {
	  	let tmp = that.newsitems[i];
	  	tmp.pageNum =1;
	  	that.$set(that.newsitems, i , tmp);
	  }
    },

    getElSize(id) {
      //得到元素的size
      return new Promise((res, rej) => {
        uni
          .createSelectorQuery()
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

    confirm() {},

    scrolltolower: function () {
      console.log('scrolltolower');
     
      this.loadMore();
    },
  },

  mounted() {},

  /**
   * 生命周期函数--监听页面 开始渲染
   */
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
      options: options,
    });

    //获取当天的日期
    that.getTodayDate();
	
    const timestamp = Date.now();
    this.currntTimeStamp = timestamp;
    //获取当天是星期几
    that.getDateWeek(timestamp, true);


    //页面数据初始化
    that.initPageData();
	this.getSignature();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
	
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 离开页面，注销事件
    var that = this;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initData(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
   * 用户点击右上角分享朋友圈
   */
  onShareTimeline: function () {
    
  },
  /**
   * 页面滚动触发事件的处理函数
   */
  onPageScroll: function () {},
};
</script>

<style lang="scss">
@import '../../styles/_variables';
@import '../../styles/layout.scss';
$openAppHeight: 100rpx;
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

.example-body {
  background-color: #fff;
  padding: 10rpx;
  height: 50rpx;
}

.m-swiper-header {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  background: #ffffff;
  height: 92rpx;
  width: 100%;
  border-radius: 24rpx 24rpx 0rpx 0rpx;
  margin-top: -30rpx;
  z-index: 1;

  .calendar-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120rpx;
    margin-right: 30rpx;
    height: 85rpx;
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
	
    .swiper-tab-list {
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
}

.data-view {
  // background-color: #0077AA;
  height: 96rpx;
  padding: 15rpx 5rpx 5rpx;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
 
  .select-dataview {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .select {
      // background-color: #ff9661;
	  background:-wbkit-linear-gradient(to right,#FF6161,#FF9661);
	  background:linear-gradient(to right,#FF6161,#FF9661);
	  
    }

    .unselect {
      background-color: #f9f9f9;
    }

    .btn-view {
      width: 75rpx;
      height: 86rpx;
      border-radius: 10rpx;
      overflow: hidden;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      // padding: 5rpx 0rpx;

      .title-select {
        color: #ffffff;
      }

      .untitle-select {
        color: #999999;
      }

      .data-select {
        color: #ffffff;
      }

      .undata-select {
        color: #333333;
      }

      .day-title {
        padding-top: 10rpx;

        font-size: 22rpx;
        line-height: 30rpx;
        height: 30rpx;
        text-align: center;
      }

      .data-title {
        padding-bottom: 10rpx;

        font-size: 28rpx;
        line-height: 30rpx;
        font-weight: bold;
        height: 30rpx;
        text-align: center;
      }
    }
  }

  .borderbtn-view {
    width: 50rpx;
    height: 90rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
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
	.page_H5{
		::v-deep .m-custom-nav{
			    margin-top:$openAppHeight;
			.m-backbtn{
				position: absolute;
				top: calc(15rpx + #{$openAppHeight} + var(--status-bar-height)); 
			}
			.shareButton{
				top: calc(30rpx + #{$openAppHeight} + var(--status-bar-height));
			}
		}

	}
	
</style>

<template>
  <view class="page beganMine" :class="{ noData: noData }">
    <search
	  ref="search"
	  class="beganMine-search"
      :is-focus="false"
      :theme="themeClass"
      :show-want="true"
      :speechEngine="''"
      :hot-list="hot_list"
      :search-his-list="search_his_list"
      :suggest-text="suggest_text"
	  :istartButton="true"
	  :showSearchResult="isBeganToMine"
	  startButtonText="开始扫雷"
	  placeholderText="请输入股票名称/代码"
      @getSearchText="getSearchText"
      @clearSearch="clearSearch"
	  @focusSearch="focusSearch"
	  @blurSearch="blurSearch"
    >
	</search>
	<scroll-view :class="!noData && isBeganToMine? '' : 'blockNone'" class="searchResult-scroll" scroll-y="true">
		<view class="searchResult" :class="isBeganToMine ? 'searchResultBottom' : ''">
			<view class="searchResultChild" v-for="(item,i) in resultList" :key="i" 
			@tap="itemClick(i)">

				<view class="searchResultChild-right">
					<view v-html="item.stockName"></view>
					<view class="searchResultChild-right-key"  v-html="item.stockCode"></view>
				</view>
				<view class="searchResultChild-left">
					<image class="iconSearch" :src="iconSearch"></image>
					<view>开始扫雷</view>
				</view>
			</view>
			
			<view v-if="resultList.length == 0" class="no-data">
			  <image class="icon_nodata" src="https://qnsp.zcskjy.com/zc_images/findPage/no-data.png" mode=""></image>
			  <view>暂未找到相关股票，换个关键词试试～</view>
			</view>
		</view>
	</scroll-view>
  </view>
</template>

<script>
// import search from '@/components/search-new/search.vue';
import search from '@/components/search-new/searchTools.vue';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    search,
  },
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin','isBeganToMine']),
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo','updateStoragekey']),
    scrollHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      return winHeight;
    }, 
  	resultHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
  	  // let fiexdReact= uni.upx2px(1048) *2;
   //    return winHeight - fiexdReact;
  	   return uni.upx2px(100) *2 * 3.355;
    },
	// searchHisList(){
	// 	return {
	// 		list:uni.getStorageSync('searchCache_stocks')
	// 	}
	// },
  },
  props: {
  	pageNum: {
  		type: Number,
  		default: 1,
  	},
	beganMineResult: {
  		type: Boolean,
  		default: false,
  	},
  },
  watch: {
	searchFocus: {
	   handler(newName, oldName) {
	     this.searchFocus = newName;
	     this.$forceUpdate();
	   },
	   deep: true,
	   immediate: true,
	 },
  	page: {
  	    handler(newName, oldName) {
  	      this.page = newName;
  	      this.$forceUpdate();
  	    },
  	    deep: true,
  	    immediate: true,
  	  },
  	  pageNum: {
  	    handler(newName, oldName) {
  	      this.pageNum = newName;
  		  this.page.pageNum = newName;
  	      this.$forceUpdate();
  	    },
  	    deep: true,
  	    immediate: true,
  	  },
  	},
  data() {
    return {
      themeClass: 'circle',
      noData: true,
      speechEngine: 'baidu', //语音识别引擎
      search_his_list: [],
      hot_list: [],
      suggest_text: '',
      showSearchResult: false,
	  showSearchFocus:false,// 搜索是否聚焦
      describeList: [],
      check_state: true,
	  iconSearch: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-search.png`,
	  page: {
		total: 1, //总页数
		pageSize: 20, //每页条数
		pageNum: 1, //默认当前页
	  },
      resultList: [
      ],
	  hList:[],
	 searchHisList:uni.getStorageSync('searchCache_stocks')
    };
  },
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.__('搜索'),
    });
    // this.search_hot_info();

    var that = this;
    var check_s = uni.getStorageSync('check_state');
    var app_platform = uni.getSystemInfoSync().platform;
    if (check_s == true && app_platform == 'ios') {
      that.setData({
        check_state: true,
      });
    } else {
      that.setData({
        check_state: false,
      });
    }
  },
  onUnload(){
  },
  onShow: function () {
    this.hList = uni.getStorageSync('searchCache_stocks');
  },
  onHide(){
  },
  methods: {

	focusSearch(e){
		this.showSearchFocus = e;
		console.log("searchFocus",e)
		this.$emit('focusSearch', e);
	},
	blurSearch(e){
		this.searchFocus = e;
		console.log("blurSearch",this.searchFocus)
		this.$emit('focusSearch', e);
	},
    clearSearch(e) {
      console.log('clearSearch', e);

      if (e == 'clearSearch') {
		this.$store.commit("updateIsBeganToMine",false);
        this.noData = false;
      } else if (e == 'clearHList') {
        this.noData = false;
      }
	  this.searchHisList=uni.getStorageSync('searchCache_stocks');
	  this.$emit('getSearchText', this.noData);
    },
	
	//个股点击
	itemClick(index){
	    let _this = this;
		let model = this.resultList[index];

		console.info('--stock---info---',model);
		// this.storagekey = model.stockcname;
		// this.$store.commit("updateStoragekey",model.stockccode);
		uni.getStorage({
		  key: 'searchCache_stocks',
		  success(res) {
			let list = res.data;
			let t = true;
			if (list.length > 5) {
			  // for (let item of list) {
			  //   if (item == _this.searchText) {
			  //     return;
			  //   }
			  // }
			  list.pop();
			  list.unshift(model.stockccode);
			} else {
			  for (let item of list) {
				if (item == model.stockccode) {
				  t = false;
				}
			  }
			  if (t) {
				list.unshift(model.stockccode);
			  }
			}
			_this.hList = list;
			_this.$store.commit('updateStoragekey',  _this.hList);
			uni.setStorage({
			  key: 'searchCache_stocks',
			  data: _this.hList,
			});
		  },
		  fail() {
			_this.hList = [];
			_this.hList.push(model.stockccode);
			_this.$store.commit('updateStoragekey',  _this.hList);
			uni.setStorage({
			  key: 'searchCache_stocks',
			  data: _this.hList,
			});
		  },
		});
		_this.$emit('itemClick', {'stockName':model.stockcname,'market':model.market,'stockCode':model.stockccode});
		
	},
	
	// getProductList(e) {
	// 	this.$emit('getProductList', e);
	// },
	getProductList(e) {
	  this.$FT.clearArr(this.resultList);
	  const that = this;
	  console.log('个股搜索入参', params,this.resultList);
	  console.log('个股搜索url', that.Config.getStockInfo);
	  let params = {
	    userId: this.userInfo.user_id,
		queryWord:e
	   };
	  uni.request({
	    url: that.Config.getStockInfo,
	    method: 'get',
	    dataType: 'jsonp',
	    data: params,
	    success: (res) => {
	      const data = JSON.parse(res.data);
	      console.log('个股搜索data', data);
	      const result = data.result;
		  uni.stopPullDownRefresh();
		  if (result.length == 0) {
		    that.noData = true;
		  }
		  console.info('个股搜索 result--1---', result);
			let scoreColor;
		   result.forEach(function (item, i, array) {
			// console.log('个股搜索item, i, array', item, i, array);
	         console.info('---item---', item,item.stockName,item.stockCode);
			that.resultList.push({
				stockName:that.replaceText(item.stockName,e),
				stockCode:that.replaceText(item.stockCode,e),
				stockccode:item.stockCode,
				market:item.market,
				stockcname:item.stockName
			});
		  });
		  
	       console.info('个股搜索result', result);
	       console.info('个股搜索that.resultList---111---', that.resultList);

	    },
	    fail: (res) => {
	      console.log('个股搜索fail', res);
	    },
	    complete: () => {
		},
	  });
	},
	replaceText(val,getSearchText){
		if (val.indexOf(getSearchText) >= 0) {
			// val =val.replaceAll(getSearchText,
			// 	"<font  style='color:#F43D3E'>" + getSearchText + "</font>") //替换所有搜索找到的关键字 更换颜色
			 let reg = new RegExp(getSearchText, "g");
			 val = val.replace(reg, "<font  style='color:#F43D3E'>" + getSearchText + "</font>");//用=替换字符串newStr里所有的xx

		}
		console.log("replaceText",val);
		return val;
	},
    getSearchText(e) {
      let that = this;
	  this.searchHisList=uni.getStorageSync('searchCache_stocks');
	  console.log('getSearchText:', e,that.resultList.length);
      if (that.$.isNull(e)) {
        that.$.confirm('请输入您要搜索的关键词!');
		that.$store.commit("updateIsBeganToMine",false);
      } else {
        that.$FT.clearArr(that.resultList);
		that.$store.commit("updateIsBeganToMine",true);
        that.getProductList(e);
		 that.noData = false;
      }
    },
  },
};
</script>

<style lang="scss">
// @import '../../styles/_variables';
@import '@/styles/_variables';
uni-page-body {
  background-color: #ffffff !important;
}
.page {
  background-color: #ffffff !important;
  .searchResult{
	  padding-top: 70rpx;
	  .searchResultChild{
	  	width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2rpx solid #F5F5F5;
		&-right{
			font-size: 34rpx;
			line-height: 40rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			&-key{
				font-size: 26rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}
		}
		&-left{
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			display: flex;
			align-items: center;
			justify-content: center;
			.iconSearch{
				margin-right: 20rpx;
			}
		}
	  }
  }
 
}
.iconSearch{
	width: 35rpx;
	height: 37rpx;
}
.s-circle {
  .header {
    border-bottom: 0;
  }
  width: 750upx;
  height: 100%;
  background: #ffffff;
  position: fixed;
  overflow: hidden;
}

/deep/ .playback-area {
  padding-top: 30upx;
  background: #ffffff;
}
 .beganMine{
	 margin-top: 52rpx;
	 &-search{
		 // padding-bottom: 70rpx;
	 }
	 .blockNone{
	 	display: none !important;
	 }
	::v-deep .search{
		margin: 0 0;
		height: 80rpx;
		background: #F2F2F2;
		border-radius: 40rpx;
		.search-icon{
			display: none;
		}
		.clear-button {
		    right: 200rpx;
		}
		.startButton{
			width: 172rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: #2D5BBF linear-gradient(90deg, #1D51D2 0%, #6D81F3 100%);
			border-radius: 0 100rpx 100rpx 0;
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
		input::-webkit-input-placeholder {
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #CCCCCC;
	
	    }
	}
	::v-deep .hList{
		width: 111%;
		padding:2rpx;
		box-sizing: content-box;
		// display: none !important;
	}
}
.no-data {
  background: #ffffff;
  font-size: 26upx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .icon_nodata {
    width: 300upx;
    height: 224upx;
    margin: 0 auto;
    margin-bottom: 50upx;
  }
}
.searchResultBottom{
	padding-bottom: 160rpx;
}

</style>

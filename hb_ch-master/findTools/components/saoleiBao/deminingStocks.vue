<template>
  <view>

	 <!-- 搜索 -->
   <beganMine :pageNum="pageNum" @getSearchText="getSearchText" @focusSearch="focusSearch" @itemClick="itemClick"></beganMine>
<!--   雷达动效 -->
<!--    <view class="riskRadar" v-if="!beganMineResult&& !showSearchFocus" style="width: 600rpx; height: 600rpx"> -->

	<view v-if="!isBeganToMine && searchHisList.length == 0">
		<view class="searchTip">
		  <view>输入股票代码/名称，开始扫雷吧～</view>
		</view>
		<view class="riskRadar"   style="width: 600rpx; height: 600rpx">
			<hxLottie ref="lottieWeb" :options="options" />
		  </view>
	</view>
      </view>
    </view>
  </view>
</template>

<script>
import beganMine from './search/beganMine';
import hxLottie from '@/uni_modules/hx-lottie/components/hx-lottie/hx-lottie.vue';
import { mapState, mapMutations } from 'vuex';
export default {
  components: {
     beganMine,
	 hxLottie
  },
  props: {
	pageNum: {
  		type: Number,
  		default: 1,
  	},
  },
  watch: {
  	  pageNum: {
  	    handler(newName, oldName) {
  	      this.pageNum = newName;
  	      this.$forceUpdate();
  	    },
  	    deep: true,
  	    immediate: true,
  	  },
	  searchHisList: {
  	    handler(newName, oldName) {
  	      this.searchHisList = newName;
  	      this.$forceUpdate();
  	    },
  	    deep: true,
  	    immediate: true,
  	  },
  	},
  computed: {
	  ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum', 'Lang','isBeganToMine']),
	  ...mapMutations(['updateIsBeganToMine']),
    // options
    options() {
      return {
        path: 'https://qnsp.zcskjy.com/zc_images/json/sweep.json', //'https://qnsp.zcskjy.com/zc_images/json/sweep.json',
      };
    },
  },
  data() {
    return {
		beganMineResult:false,
		beganMineFocus:false,
		showSearchFocus:false,
		searchHisList:uni.getStorageSync('searchCache_stocks')
	};
  },
  onLoad() {},
  onUnload() {},
  methods: {
	focusSearch(e){
		console.log("focusSearch:",e)
		this.showSearchFocus = e; 
		// this.$emit('focusSearch', this.showSearchFocus);
      },
	getSearchText(e){
		this.beganMineResult = e; 
		this.searchHisList=uni.getStorageSync('searchCache_stocks');
		console.log("deminingStocks-getSearchText:",e)
		this.$emit('getSearchText', true);
      },
	  
	  itemClick(model){
		console.info('---mdoel---',model);
		this.$emit('itemClick', model); 
	  },
	  
	  getProductList(e){
		this.$emit('getProductList', e);
	  }
  },
};
</script>

<style lang="scss">
	.riskRadar{
		margin: 0 auto;
		position: relative;
		top: -125rpx;
	}
	.blockNone{
		display: none;
	}
	.searchTip{
	  swidth: 690rpx;
	  margin:0 auto;
	  background: #ffffff;
	  font-size: 26rpx;
	  font-family: PingFangSC-Medium, PingFang SC;
	  font-weight: 500;
	  color: #666666;
	  text-align: center;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	   padding-top: 70rpx;
	  padding-bottom: 125rpx;
	
	}
</style>

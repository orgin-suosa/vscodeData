<template name="zy-search">
  <view>
      <!-- #ifdef APP-PLUS-->
       <view class="search search_app" 	:class="isios ? 'isios' : 'platform'">
      <!-- #endif -->
      <!-- #ifndef APP-PLUS-->
       <view class="search search_h5" :class="isios ? 'isios' : 'platform'">
      <!-- #endif -->
      <slot></slot>
      <!-- 使用$emit触发实例上(父组件)的自定义方法并传入参数 -->
      <!-- <button type="primary" @click="$emit('test','block')">方形</button> -->
      <!-- sync双向数据绑定语法糖 -->
      <!-- <button type="primary" @click="changeStyle">双向数据绑定改变style</button> -->
      <!-- #ifdef APP-PLUS -->
      <image v-if="speechEngine != ''" src="https://static.shopsuite.cn/xcxfile/appicon/zy-search/voice.svg" mode="aspectFit" @click="startRecognize()" class="voice-icon"></image>
      <!-- #endif -->
      <image src="https://static.shopsuite.cn/xcxfile/appicon/zy-search/search.svg" mode="aspectFit" @click="searchStart()" class="search-icon"></image>
      <template v-if="isFocus">
        <input maxlength="20"  @focus="focusSearch()" type="text" value="" confirm-type="search" @confirm="searchStart()" @input="searchChange()" @change="searchChange()" @blur="blurSearch" :placeholder="placeholderText" v-model.trim="searchText" />
      </template>
      <template v-else>
        <input maxlength="20" @focus="focusSearch()" type="text" value="" confirm-type="search" @confirm="searchStart()" @input="searchChange()" @change="searchChange()" @blur="blurSearch" :placeholder="placeholderText" v-model.trim="searchText" />
      </template>
	   <slot name="top-search">
		   	<view v-if="istartButton" class="startButton" @tap="searchStart">{{startButtonText}}</view>
	   </slot>
	   <view  v-if="searchText.length > 0" class="clear-button"  @tap="clearSearch()">
	   		<image src="https://qnsp.zcskjy.com/zc_images/images/false.png" mode="aspectFit" class="clear-icon"></image>
	   </view>
      
    </view>
   <!-- <view :class="'s-' + theme" v-if="hList.length > 0 && isearchFocus && !showSearchResult"> -->
    <view :class="'s-' + theme" v-if="storagekey.length > 0 && !isBeganToMine">
      <view class="header">
        <view>{{ __('搜索历史') }}</view>
        <!-- <image src="https://static.shopsuite.cn/xcxfile/appicon/zy-search/delete.svg" mode="aspectFit" @click="delhistory('center')"></image> -->
        <image src="https://qnsp.zcskjy.com/zc_images/home/icon-clear.png" mode="aspectFit" @tap="delhistory('center')"></image>
      </view>
      <view class="list hList">
        <view v-for="(item, index) in storagekey" :key="index" @tap="keywordsClick(item)">
          <text class="hList-text">{{ item }}</text>
        </view>
      </view>
    </view>
    <!-- <view :class="'wanted-' + theme" v-if="showWant && showSearch">
      <view class="header">{{ __('热点推荐') }}</view>
      <view class="list">
        <view v-for="(item, index) in hotList" :key="index" @click="keywordsClick(item)">{{ item }}</view>
      </view>
    </view> -->
    <u-modal
      title="温馨提示"
      content="确认删除所有历史记录？"
      buttonReverse
      :show="isDeletehList"
      showCancelButton
      asyncClose
      @confirm="confirm"
      @cancel="() => (isDeletehList = false)"
    ></u-modal>
  </view>
</template>

<script>
// import uniPopup from '@/components/uni-popup/uni-popup.vue';
// import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
/**
 * getSearchText  开始搜索对外回调函数
 * clearSearch     清空搜索对外回调函数
 */
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'search-new',
  //   components: { uniPopup, uniPopupDialog },
  props: {
	istartButton: {
		//是否自动获取焦点
		type: Boolean,
		default: false,
	},
	showSearchResult: {
		// 搜索结果是否显示
		type: Boolean,
		default: false,
	},
	startButtonText: {
      //搜索按钮文案
      type: String,
      default: '',
    },
	placeholderText: {
      type: String,
      default: '请输入关键词搜索',
    },
    isFocus: {
      //是否自动获取焦点
      type: Boolean,
      default: false,
    },
    theme: {
      //选择块级显示还是圆形显示
      type: String,
      default: 'block',
    },
    showWant: {
      //是否展示推荐菜单
      type: Boolean,
      default: false,
    },
    hotList: {
      //推荐列表数据
      type: Array,
      default() {
        return [];
      },
    },
    searchHisList: {
      type: Array,
      default() {
        return [];
      },
    },
    suggestText: {
      type: String,
      default: '',
    },

    speechEngine: {
      //语音引擎=>讯飞:iFly,百度:'baidu'
      type: String,
      Pdefault: 'baidu',
    },
  },
  computed: {
    ...mapState(['isBeganToMine','storagekey']),
    ...mapMutations(['updateStoragekey']),
  },
  data() {
    return {
      // placeholderText:'请输入关键词搜索',
      searchText: '',
      type: 'center',
      msgType: 'tip',
      messageText: '这是一条成功提示',
      hList: [], //历史记录
      showSearch: true,
      isDeletehList: false,
      isios:false,
	  isearchFocus:false
    };
  },
  created() {
    var that = this;
    setTimeout(() => {
      this.setData({
        searchText: this.suggestText,
      });

      if (this.searchHisList.length > 0) {
        //this.hList = this.searchHisList;
        this.hList = uni.getStorageSync('searchCache_stocks');
      } else {
        this.hList = uni.getStorageSync('searchCache_stocks');
      }
    }, 200);
    this.getSystem();
  },
  onShow: function () {
    this.hList = uni.getStorageSync('searchCache_stocks');
  },
  methods: {
    searchFocus(){
      this.placeholderText = '';
    },
    getSystem(){
      let that = this;
      let port = uni.getSystemInfoSync().platform;
      switch (port) {
        case 'android':
          console.log('运行Android上',port);//android
          break;
        case 'ios':
          that.isios = true;
          console.log('运行iOS上',port);// ios
          break;
        default:
          console.log('运行在开发者工具上');//devtools
          break;
      }
    },
	searchChange: function () {
		this.searchStart();
	},
    searchStart: function () {
      //触发搜索
      let _this = this;
      console.log('触发搜索', _this.searchText);
      if (_this.searchText == '') {
        uni.showToast({
          title: _this.__('请输入关键字'),
          icon: 'none',
          duration: 1000,
        });
      } else {
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
              list.unshift(_this.searchText);
            } else {
              for (let item of list) {
                if (item == _this.searchText) {
                  t = false;
                }
              }
              if (t) {
                // list.unshift(_this.searchText);
              }
            }
            _this.hList = list;
            // uni.setStorage({
            //   key: 'searchCache_stocks',
            //   data: _this.hList,
            // });
            _this.showSearch = false;
            _this.$emit('getSearchText', _this.searchText);
            console.log('搜索成功:', _this.searchText);
          },
          fail() {
            _this.hList = [];
            // _this.hList.push(_this.searchText);
            // uni.setStorage({
            //   key: 'searchCache_stocks',
            //   data: _this.hList,
            // });
            _this.showSearch = false;
            _this.$emit('getSearchText', _this.searchText);
            console.log('搜索失败:', _this.searchText);
          },
        });
      }
    },
    keywordsClick(item) {
      //推荐搜索
      this.searchText = item;
      this.showSearch = false;
      this.$emit('getSearchText', item);
    },
    delhistory(type) {
      //清空历史记录
      // this.type = type
      //   this.$refs.alertDialog.open(type);
      this.isDeletehList = true;
    },
	focusSearch: function () {
		this.isearchFocus = true;
		this.$emit('focusSearch',this.isearchFocus);
	},
	blurSearch(){
	  // this.isearchFocus = false;
   //    this.searchText = '';
   //    this.$emit('blurSearch', this.isearchFocu);
   //    this.showSearch = true;
	},
    clearSearch() {
      const _this = this;
      this.searchText = '';
      this.$emit('clearSearch', 'clearSearch');
      this.showSearch = true;
    },
    dialogConfirm() {
      this.$refs.alertDialog.close();
    },
    confirm() {
      this.isDeletehList = false;
      this.hList = [];
	  this.$store.commit('updateStoragekey',  this.hList);
      uni.setStorage({
        key: 'searchCache_stocks',
        data: [],
      });
	  this.$emit('clearSearch', 'clearHList');
    },
    startRecognize: function () {
      //语音输入
      let _this = this;
      let options = {};
      options.engine = _this.speechEngine;
      options.punctuation = false; // 是否需要标点符号
      options.timeout = 10 * 1000;
      plus.speech.startRecognize(options, function (s) {
        _this.searchText = _this.searchText + s;
      });
    },
  },
};
</script>


<style lang="scss" scoped>
@import '@/styles/searchNew.scss';
.hList{
	uni-view{
		width: 218rpx;
		height: 60rpx;
		border-radius: 10rpx;
		border: 2rpx solid #E5E5E5;
	    box-sizing: content-box;
	}
}
</style>

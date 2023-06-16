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
        <input maxlength="20" focus type="text" value="" confirm-type="search" @confirm="searchStart()" :placeholder="placeholderText" v-model.trim="searchText" />
      </template>
      <template v-else>
        <input maxlength="20" type="text" value="" confirm-type="search" @confirm="searchStart()" :placeholder="placeholderText" v-model.trim="searchText" />
      </template>
	   <slot name="top-search">
		   	<view v-if="istartButton" class="startButton" @click="searchStart">{{startButtonText}}</view>
	   </slot>
	   <view class="clear-button"  @click="clearSearch()">
		    <image v-if="searchText.length > 0" src="https://qnsp.zcskjy.com/zc_images/images/false.png" mode="aspectFit" class="clear-icon"></image>
	   </view>

    </view>
  </view>
</template>

<script>
// import uniPopup from '@/components/uni-popup/uni-popup.vue';
// import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
export default {
  name: 'search-new',
  //   components: { uniPopup, uniPopupDialog },
  props: {
	istartButton: {
		//是否自动获取焦点
		type: Boolean,
		default: false,
	},
	isHistory: {
		//是否需要历史记录
		type: Boolean,
		default: true,
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
      isios:false
    };
  },
  created() {
    var that = this;
    setTimeout(() => {
      this.setData({
        searchText: this.suggestText,
      });
    }, 200);
    this.getSystem();
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
          key: 'search_cache',
          success(res) {
            let list = res.data;
            let t = true;
            // if (list.length > 5) {
            //   for (let item of list) {
            //     if (item == _this.searchText) {
            //       return;
            //     }
            //   }
            //   list.pop();
            //   list.unshift(_this.searchText);
            // } else {
            //   for (let item of list) {
            //     if (item == _this.searchText) {
            //       t = false;
            //     }
            //   }
            //   if (t) {
            //     list.unshift(_this.searchText);
            //   }
            // }
    
            _this.showSearch = false;
            _this.$emit('getSearchText', _this.searchText);
            console.log('搜索成功:', _this.searchText);
          },
          fail() {

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
    clearSearch() {
      const _this = this;
	  // 不显示搜索记录，默认清空记录
	  if(!_this.isHistory){
	  	_this.confirm(); 
	  }
      this.searchText = '';
      this.$emit('clearSearch', 'clearSearch');
      this.showSearch = true;
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

</style>

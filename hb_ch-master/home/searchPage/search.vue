<template>
  <view class="page" :class="{ noData: noData }" :style="{ height: scrollHeight + 'rpx' }">
    <search
      :is-focus="false"
      :theme="themeClass"
      :show-want="true"
      :speechEngine="''"
      :hot-list="hot_list"
      :search-his-list="search_his_list"
      :suggest-text="suggest_text"
      @getSearchText="getSearchText"
      @clearSearch="clearSearch"
    ></search>

    <!-- <search-result :scrollH="scrollH" :resultList="resultList" ref="searchresult" v-if="showSearchResult"></search-result> -->
    <courseIntroduction :isLookMore="isLookMore" v-if="!noData && showSearchResult" :scrollH="scrollHeight" :describeList="describeList" :list="resultList"></courseIntroduction>

    <view v-if="noData" class="no-data">
      <image class="icon_nodata" src="https://qnsp.zcskjy.com/zc_images/findPage/no-data.png" mode=""></image>
      <view>当前时间暂无相关数据，换个关键词试试</view>
    </view>
  </view>
</template>

<script>
// import zySearch from '../../components/zy-search/zy-search.vue'
import search from '@/components/search-new/search.vue';
import courseIntroduction from '@/components/home/courseIntroduction';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    search,
    courseIntroduction,
  },
  data() {
    return {
      themeClass: 'circle',
      noData: false,
      speechEngine: 'baidu', //语音识别引擎
      search_his_list: [],
      hot_list: [],
      suggest_text: '',
      showSearchResult: false,
      isLookMore: false,
      getData: null,
      describeList: [],
      resultList: [
        // //  课程
        // {
        //   classSection: '30',
        //   className: '基金投资训练营',
        //   classDescribe: '从入门到精通的基金实操课',
        //   days: '7',
        //   studentsNumber: '2.57万人已学',
        //   price: '免费',
        //   image: require(`../../static/findPage/banner2.jpg`),
        // },
        // {
        //   classSection: '23',
        //   className: '定在当下投向未来',
        //   classDescribe: '看直播赢好礼',
        //   days: '5',
        //   studentsNumber: '2.57万人已学',
        //   price: '￥444',
        //   image: require(`../../static/findPage/6.jpg`),
        // },
      ],
    };
  },
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
    scrollHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      return winHeight;
    },
  },
  onLoad: function (options) {
    uni.setNavigationBarTitle({
      title: this.__('搜索'),
    });
    // this.search_hot_info();

   

    // that.$.request({
    //   url: this.Config.URL.search_hot_info,
    //   success: function (data, status, msg, code) {
    //     that.setData({
    //       hot_list: data.search_hot_words,
    //       search_his_list: data.search_history_words,
    //       suggest_text: data.suggest_search_words.default_search_words,
    //     });
    //   },
    // });
  },
  methods: {
    ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
    clearSearch(e) {
      if (e == 'clearSearch') {
        this.showSearchResult = false;
        this.noData = false;
      } else if (e == 'clearHList') {
        this.noData = false;
      }
    },
    // 热点推荐
    search_hot_info() {
      const that = this;
      uni.request({
        url: that.Config.URL.search_hot_info,
        success: (res) => {
          const data = res.data.data;
          let tagList;
          if (res.statusCode == 200) {
            that.setData({
              hot_list: data.search_hot_words,
              search_his_list: data.search_history_words,
              suggest_text: data.suggest_search_words.default_search_words,
            });
          }
        },
        fail: () => {},
        complete: () => {},
      });
    },
    getProductList(e) {
      const that = this;
     
      const parameter = {
        /**
	  * 平台商品分类   category_id: 固定 2025
	                   教育商品类型   kind_id:  value = "订单种类(ENUM): 1201-实物 ; 1202-虚拟  ; 1203-电子卡券  ; 1204-外卖订单;1005-教育"
	                   商品状态 product_state_id:   value = "商品状态:1001-正常;1002-下架仓库中;1003-待审核; 1000-违规禁售"˚
	  */
        page: 1,
        rows: 10,
        //type_id 课程类型(ENUM) : 0-精品课；1-训练营；2-导师课
        // type_id: 0,
        category_id: 2025,
        kind_id: 1205,
        product_state_id: 1001,
        //搜索关键字
        keywords: e,
      };
      uni.request({
        url: that.Config.URL.edu.getProductList,
        method: 'get',
        dataType: 'jsonp',
        data: parameter,
        success: (res) => {
          const data = JSON.parse(res.data).data;
          let tagList;
          if (res.statusCode == 200) {
            uni.stopPullDownRefresh();
            if (data.items.length == 0) {
              that.noData = true;
            }
            data.items.forEach(function (item, i, array) {
              tagList = item.product_tag_names;
              that.resultList.push({
                classSection: item.chapter.chapterNum,
                className: item.product_name,
                classDescribe: item.product_tips,
                days: '30',
                price: item.item_unit_price,
                image: item.product_image,
                portrait: item.user_avatar,
                speaker: item.user_nickname,
                studentsNumber: item.v_buy_course_num,
                product_id: item.product_id,
                item_id: item.item_id,
              });
              if ((tagList ?? '') == '') return;
              tagList.forEach(function (item, i, array) {
                if (that.describeList.length > 2) return;
                that.describeList.push(item);
              });
            });
            that.showSearchResult = true;
           //  console.log('搜素结果', that.resultList);
          }
        },
        fail: () => {},
        complete: () => {},
      });
    },
    async getSearchText(e) {
      var that = this;
      if (that.$.isNull(e)) {
        that.$.confirm('请输入您要搜索的关键词!');
        that.showSearchResult = false;
      } else {
        that.$FT.clearArr(that.describeList);
        that.$FT.clearArr(that.resultList);
        await that.getProductList(e);
        // that.showSearchResult = true;
      }

      // that.$.isNull(e) ? that.$.confirm("请输入您要搜索的关键词!") : that.showSearchResult=true;
      // that.$.isNull(e) ? that.$.confirm("请输入您要搜索的关键词!") : that.getCourse(e);
    },
  },
};
</script>

<style lang="scss">
@import '../../styles/_variables';
uni-page-body {
  background-color: #ffffff !important;
}
.page {
  width: 750upx;
  background-color: #ffffff !important;
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
  padding-top: 358upx;
  .icon_nodata {
    width: 300upx;
    height: 224upx;
    margin: 0 auto;
    margin-bottom: 50upx;
  }
}
/deep/ .playback-area {
  padding-top: 30upx;
  background: #ffffff;
}
</style>

<template>
  <scroll-view scroll-y="true" :style="{ height: scrollHeight + 'rpx' }">
   		<guess-you-like ref="guessYouLike" :titleText="__('——猜你喜欢——')" :maxNumber="1"></guess-you-like>
  </scroll-view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import guessYouLike from '@/components/guess-you-like.vue'
export default {
  components: { guessYouLike },
  computed: {
    ...mapState([ 
		'Config',
        'StateCode',
        'notice',
        'plantformInfo',
        'shopInfo',
        'userInfo',
        'hasLogin',
		'newMsgNum']),
    scrollHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      return winHeight;
    },
  },
  watch: {
  },
  data() {
    return {
      isRecommend: false,
      recommendList: [],
    };
  },
  onLoad() {
  },
  onUnload() {},
  methods: {
    // 猜你喜欢
	/*
	     * 读取商品数据
	     */

    getGuessULike() {
      const that = this;
      const params = {
        page: 1,
        rows: 5,
        product_state_id: 1001,
        kind_id: 1201,
        curpage: 1,
      };
      that.$.request({
        url: that.Config.URL.edu.getProductList,
        data: params,
        dataType: 'json',
        success: function (data, status, msg, code) {
          // console.log('猜你喜欢ss:data, status', data, status);
          // const data = res.data.data;
          // console.log('猜你喜欢-data', data);
          if (status == 200) {
            uni.stopPullDownRefresh();
            data.product_base.forEach(function (item, i, array) {
              // console.log('猜你喜欢-item', item, i, array);
              that.recommendList.push({
                // classSection: item.chapter.chapterNum,
                className: item.product_name,
                classDescribe: item.brand_desc,
                price: item.item_unit_price,
                image: item.brand_image,
                studentsNumber: item.buy_num,
                product_id: item.product_id,
                item_id: item.item_id,
                // speaker:item.user_nickname ,
              });
            });
            console.log('猜你喜欢:that.recommendList', that.recommendList);
          }
        },
        fail: () => {
          that.isRecommend = true;
        },
        complete: () => {
          if (that.recommendList.length == 0) {
            that.isRecommend = true;
          }
        },
      });
    },
  },
};
</script>

<style lang="scss">
.recommend {
  width: 90%;
  margin: 0 auto;
}
// /deep/ .m-tips{
// 	background-color: rgb(248, 248, 248);
// }
/deep/ .u-pa{
		background-color: rgb(255, 255, 255) !important;
}
</style>

<template>
  <scroll-view scroll-y="true" :style="{ height: scrollHeight + 'rpx' }">
    <recommend :isshow="isRecommend" :list="recommendList"></recommend>
  </scroll-view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import recommend from '@/components/home/recommend.vue';
export default {
  components: { recommend },
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum', 'Lang']),
    scrollHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      return winHeight;
    },
  },
  watch: {
    recommendList: {
      handler(newName, oldName) {
        this.recommendList = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      isRecommend: false,
      recommendList: [],
    };
  },
  onLoad() {
    this.getGuessULike();
  },
  onUnload() {},
  methods: {
    // 猜你喜欢
    getGuessULike() {
      const that = this;
      const params = {
        category_id: 2025,
        store_is_open: 1,
        page: 1,
        rows: 5,
        product_state_id: 1001,
        kind_id: 1205,
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
            data.items.forEach(function (item, i, array) {
              // console.log('猜你喜欢-item', item, i, array);
              that.recommendList.push({
                classSection: item.chapter.chapterNum,
                className: item.product_name,
                classDescribe: item.product_tips,
                price: item.item_unit_price,
                image: item.product_image,
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
</style>

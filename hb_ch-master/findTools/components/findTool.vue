<template>
  <view class="findTools">
    <view class="findTools-child" @click="navigatePage(index)" v-for="(item, index) in toolsList" :key="index">
      <image class="gift-title" v-if="!item.orderStatus && item.isPrice" :src="item.giftTitle" mode="heightFix"></image>
      <view class="findTools-child-title">
        <image class="title-child" v-for="(item1, i) in item.title" :key="i" :src="item1.image" mode="heightFix"></image>
      </view>
      <view>
        <view class="findTools-child-text">{{ item.text }}</view>
        <view class="findTools-child-text">{{ item.subtitle }}</view>
      </view>

      <price
        v-if="isPrice"
        :isFree="item.isFree"
        :isPrice="item.isPrice"
        :isLogon="item.isLogon"
        :orderStatus="item.orderStatus"
        :discountPrice="item.discountPrice"
        :price="item.price"
        :remaining="item.remaining"
        :numberBuyers="item.numberBuyers"
        @priceClick="priceClick"
      ></price>
    </view>
  </view>
</template>

<script>
import price from '../components/priceExp';
export default {
  components: {
    price,
  },
  props: {
    toolsList: {
      type: Array,
      default() {
        return [];
      },
    },
    isPrice: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  data() {
    return {};
  },
  onLoad() {},
  onUnload() {},
  methods: {
    priceClick(text) {
      this.$emit('priceClick', text);
      // console.log('priceClick:', text);
      // if (text == '去购买') {
      //   uni.navigateTo({
      //     url: '/pages/findPage/index',
      //   });
      // }
    },
    navigatePage(i) {
      this.$emit('navigatePage', i);
      // if (i == 0) {
      //   uni.navigateTo({
      //     url: '/findTools/panZhongbao/index',
      //   });
      // }
    },
    uniRequest(data) {
      const that = this;
      uni.request({
        url: this.Config.URL.edu.getProductList,
        method: 'get',
        data: data,
        dataType: 'json',
        success: (res) => {
          const data = res.data.data;
          console.log('getList-res', res);
          if (res.statusCode == 200) {
            uni.stopPullDownRefresh();
            result.forEach(function (item, i, array) {
              // console.log('result-forEach', item, i, array);
            });
          }
        },
        fail: () => {},
        complete: () => {
          // this.contentScroll();
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/findPage/findTools.scss';
</style>

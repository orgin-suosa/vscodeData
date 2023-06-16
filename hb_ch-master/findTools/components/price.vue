<template>
  <view class="price-parent">
    <view class="price-content">
      <view class="findTools-child-price" v-if="!orderStatus">
        <view class="discountPrice">
          <text class="price-unit">¥ </text>
          <text>{{ discountPrice }}</text>
        </view>
        <view class="originalPrice" v-if="price !=''">
          <text class="price-unit">¥</text>
          <text>{{ price }}</text>
        </view>
      </view>
      <view class="button-list">
        <view class="button-list-child" v-if="!orderStatus" v-for="(item, i) in buttonList" :key="i" @click="priceClick(item.text)">{{ item.text }}</view>
        <view class="button-list-child button-list-look" v-if="orderStatus">去查看</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    toolsList: {
      type: Array,
      default() {
        return [];
      },
    },
    orderStatus: {
      type: Boolean,
      default() {
        return false;
      },
    },
    discountPrice: {
      type: String,
      default() {
        return '0';
      },
    },
    price: {
      type: String,
      default() {
        return '';
      },
    },
    buttonList: {
      type: Array,
      default() {
        return [
          {
            text: '去购买',
          },
        ];
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
      console.log('price-purchase', text);
      this.$emit('priceClick', text);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/findPage/price.scss';
</style>

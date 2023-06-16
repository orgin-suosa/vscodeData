<template>
  <view class="price-content">
    <view class="findTools-child-price">
      <view class="findTools-child-price-content" v-if="!orderStatus && isPrice && !isLogon">
        <view class="discountPrice">
          <text class="price-unit">¥ </text>
          <text>{{ discountPrice }}</text>
        </view>
        <view class="originalPrice">
          <text class="price-unit">¥</text>
          <text>{{ price }}</text>
        </view>
      </view>
      <view class="buyers-text" v-if="orderStatus">
        <view v-if="numberBuyers != null">{{ numberBuyers }}已购买</view>
        <view v-if="remaining != null">剩余 <text class="buyers-unit">{{ remaining }} </text>天到期</view>
      </view>
      <view class="findTools-tip" v-if="!isPrice && !isFree">VIP体验名额预订中…</view>
      <view class="findTools-tip" v-if="!orderStatus && isPrice && isLogon" style="color: #666666;display: flex;align-items: center;">注册送 <view style="color: red;">5</view> 天使用权</view>
    </view>
    <view class="button-list">
      <view class="button-list-child" v-if="!orderStatus && isPrice && !isFree" v-for="(item, i) in buttonList" :key="i" @click="priceClick(item.text)">{{ item.text }}</view>
      <view class="button-list-child button-list-look" v-if="orderStatus">去使用</view>
      <view class="button-list-child button-list-look" v-if="isFree">限时免费</view>
      <view class="button-list-child button-list-look" v-if="!isPrice && !isFree">敬请参与</view>
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
    isPrice: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isLogon: {
      type: Boolean,
      default() {
        return false;
      },
    },
    isFree: {
      type: Boolean,
      default() {
        return false;
      },
    },
    discountPrice: {
      type: [Number, String],
      default() {
        return '-';
      },
    },
    price: {
      type: String,
      default() {
        return '-';
      },
    },
    remaining: {
      type: [Number, String],
      default() {
        return null;
      },
    },
    numberBuyers: {
      type: [Number, String],
      default() {
        return null;
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

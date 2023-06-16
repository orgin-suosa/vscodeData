<template>
  <view class="components-content">
    <view class="components-title">
      <view>{{ listTitle }}</view>
      <!-- <view class="components-title-key">更多</view> -->
    </view>
    <view class="components-child">
      <image @click="clickNavigate(index, listTitle)" class="imageChild" v-for="(item, index) in list" :key="index" :src="item.image" mode=""></image>
    </view>
  </view>
</template>

<script>
export default {
  name: 'imageList',
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    listTitle: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    clickNavigate(i, listTitle) {
      this.$emit('clickNavigate', i, listTitle);
    },
  },
};
</script>

<style lang="scss">
.components-content {
  width: 100%;
  margin: 0 auto;
  // transform: scale(0.92);
  .components-title {
    width: 100%;
    font-size: 36upx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12upx;
    padding-top: 14upx;
    &-key {
      font-size: 24upx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #999999;
      // -webkit-text-stroke:2upx #333333;
      // text-shadow: 0 0 5px #FF0000, 0 0 5px #6bf403;
    }
  }
  .components-child {
    width: 100%;
    border-radius: 10upx;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    .imageChild {
      width: 340upx;
      height: 160upx;
      // margin-right: 10upx;
    }
  }
}
</style>

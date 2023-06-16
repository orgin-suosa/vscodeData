<template>
  <view class="findTools">
    <view class="findTools-child" v-for="(item, index) in toolsList" :key="index">
      <view class="findToolsChild-title" v-for="(title, i) in item.title" :key="i">
        <image class="title-child" :src="title"></image>
      </view>
      <view class="findTools-child-text">{{ item.text }}</view>
      <view class="findTools-child-price">
        <view class="discountPrice">
          <view class="price-unit">¥ </view>
          <view class="">{{ item.discountPrice }}</view>
        </view>
        <view class="originalPrice">
          <view class="price-unit">¥</view>
          <view class="">{{ item.price }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      toolsList: [
        {
          title: ['../static/findTools/tools-title1.png', '../static/findTools/vipTitle.png'],
          text: '600位记者7*24小时获取独家资讯 机构、私募都在使用的A股超短热点题材宝库',
          price: '12380.00',
          discountPrice: '¥ 9888.00',
        },
        {
          title: ['../static/findTools/tools-title2.png'],
          text: '600位记者7*24小时获取独家资讯 机构、私募都在使用的A股超短热点题材宝库',
          price: '12380.00',
          discountPrice: '¥ 9888.00',
        },
        {
          title: ['../static/findTools/tools-title3.png?20220726'],
          text: '600位记者7*24小时获取独家资讯 机构、私募都在使用的A股超短热点题材宝库',
          price: '12380.00',
          discountPrice: '¥ 9888.00',
        },
      ],
    };
  },
  onLoad() {},
  onUnload() {},
  methods: {
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

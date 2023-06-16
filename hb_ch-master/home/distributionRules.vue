<template>
  <view class="content">
    <view class="content-child" v-for="(item, index) in list" :key="index">
      <view class="content-title">
        <view class="content-title-icon"></view>
        <view>{{ item.title }}</view>
      </view>
      <view class="content-rules">
        <view class="content-rules-text" v-for="(item1, i) in item.content" :key="i">{{ item1 }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      listT: ['1、进入长乘学院【个人中心】', '2、点击【可提现余额】或【疯狂赚外快】', ' 3、点击提现按钮，人工审核后佣金提现成功'],
      list: [
        {
          title: '如何获得分销佣金？',
          content: [
            '1、分享课程链接给好友',
            '2、好友通过分享进入商品页面并购买',
            '3、好友收货后，分享者获得分销佣金',
            '4、只要好友通过您的分享链接购买商品，此后用户购买任意商品您都将获得佣金',
          ],
        },
        {
          title: '获得分销佣金后，如何提现？',
          content: ['1、进入长乘学院【个人中心】', '2、点击【可提现余额】或【疯狂赚外快】', ' 3、点击提现按钮，人工审核后佣金提现成功'],
        },
        {
          title: '为何好友购买后，未获得佣金？',
          content: ['1、确认好友是否通过您分享的海报购买', '2、好友确认收货的三个工作日后，您的佣金将到账 ', '3、如果好友购买后申请退款，您将无法获得该笔佣金'],
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
          // console.log('getList-res', res);
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
.content {
  padding: 0 30upx;
  .content-child {
    padding-bottom: 40upx;
  }
  .content-title {
    font-size: 30upx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    // padding-bottom: 20upx;
    display: flex;
    align-items: center;
    justify-items: flex-start;
    &-icon {
      width: 7upx;
      height: 27upx;
      background: #f43d3e;
      margin-right: 13upx;
    }
  }
  .content-rules {
    font-size: 28upx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
  }
}
</style>

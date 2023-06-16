<template>
  <view class="content banner-wrap">
    <view class="banner-wrap-scroll">
      <view class="banner-swiper swiper-no-swiping">
        <view class="banner-swiper-child" v-for="(item, index) in bannerList" :key="index">
          <view class="banner-swiper-item" @click.stop="videoJump(item.page_url)" :class="swiperConfigure.current == index ? '' : 'active'">
            <maskTitle :state="item.state" :number="item.number"> </maskTitle>
            <image :src="item.image" mode="aspectFill" class="banner-swiper-img"></image>
            <view class="item-right">
              <!-- <view class="textEllipsis speaker">{{ item.speaker }}</view> -->
              <view class="textEllipsis labelText">{{ item.title }}</view>
              <view class="order-button look-button" v-if="item.state === 0">
                <image class="icon-live2" src="https://qnsp.zcskjy.com/zc_images/findPage/live2.png" mode="widthFix"></image>
                <text class="button-list-state-text">查看</text>
              </view>
              <view class="live-button" v-if="item.state === 1">
                <image class="icon-live2" src="https://qnsp.zcskjy.com/zc_images/findPage/live1.png" mode="widthFix"></image>
                <text class="button-list-state-text">直播</text>
              </view>
              <view class="playback-button" v-if="item.state === 2">
                <image class="icon-live2" src="https://qnsp.zcskjy.com/zc_images/findPage/live3.png" mode="widthFix"></image>
                <text class="button-list-state-text">回放</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import maskTitle from '../../components/home/maskTitle.vue';
export default {
  name: 'index-swiper',
  components: { maskTitle },
  props: {
    bannerList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    swiperConfigure: {
      type: Object,
      default: () => {
        return {};
      },
    },
    liveDuration: {
      type: Number,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    swiperChange(e) {
      let { current, source } = e.detail;
      let i = this.bannerList.length - 1;
      //只有页面自动切换，手动切换时才轮播，其他不允许
      if (source === 'autoplay' || source === 'touch') {
        this.swiperConfigure.current = current;
      }
    },
    videoJump(e) {
      console.log('轮播图点击事件', e);
      if ((e ?? '') != '') {
        this.$emit('videoJump', e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/findPage/discoveryPage.scss';
.content.banner-wrap {
  width: 100%;
  height: 174upx;
  border-radius: 10upx;
  margin: auto;
  // pointer-events: none; // 禁止用户手滑动
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  .banner-wrap-scroll {
    width: 100%;
    height: 174upx;
    overflow-x: auto;
    position: relative;
  }
  .wrap-title {
    position: absolute;
    top: 20upx;
    left: 0;
  }
  .playback-area-text {
    // transform: scale(1) translateX(0);
    width: auto;
    max-width: max-content;
  }
  .banner-swiper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    .banner-swiper-child {
      width: 560upx;
      height: 100%;
      margin-right: 16upx;
    }
    .banner-swiper-item {
      border-radius: 10upx;
      width: 560upx;
      height: 100%;
      overflow: hidden;
      display: flex;
      align-items: center;
      background: #ffffff;
      overflow: hidden;
      justify-content: flex-start;
      // padding-right:16upx;
      .item-right {
        width: 43%;
        height: 100%;
        text-align: left;
        padding-left: 29upx;
        background: #f8f7ff;
        .textEllipsis {
          max-width: 392upx;
          max-height: 44upx;
          overflow: hidden;
          display: -webkit-box; /* 限制在一个块元素显示的文本的行数 */
          -webkit-line-clamp: 1; /* 设置或检索伸缩盒对象的子元素的排列方式 */
          -webkit-box-orient: vertical;
          white-space: normal;
          word-break: break-all;
          text-overflow: ellipsis;
        }
        .speaker {
          font-size: 32upx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;

          padding-bottom: 5upx;
        }
        .labelText {
          max-height: 80upx;
          line-height: 40upx;
          font-size: 28upx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          padding-bottom: 5upx;
          padding-top: 20upx;
          -webkit-line-clamp: 2;
        }
      }
      .order-button,
      .live-button,
      .playback-button {
        width: 90upx;
        height: 40upx;
        background: linear-gradient(287deg, #739dff 0%, #4385ff 100%);
        border-radius: 20upx;
        font-size: 24upx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 20upx;
      }
      .live-button {
        background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
      }
      .playback-button {
        background: linear-gradient(287deg, #739dff 0%, #4385ff 100%);
      }
      .look-button {
        background: linear-gradient(90deg, #efae33 0%, #fe9c26 100%);
      }
    }
    .banner-swiper-img {
      display: block;
      margin: auto;
      width: 312upx !important;
      height: 175upx !important;
      // border-radius: 10upx;
    }
    .active {
      height: 100%;
      transition: all 0.1s ease-in 0s;
      transform: translateY(0);
      margin-right: 29px;
    }
  }
  .button-list-state-text {
    transform: scale(0.8) translateX(0%);
  }
  .button-list-state {
    width: 58upx;
    max-width: 58upx;
  }
}
/deep/ uni-swiper {
  .uni-swiper-wrapper {
    overflow: visible;
  }
  uni-swiper-item {
    padding-right: 16upx;
  }
  .uni-swiper-dots {
    display: flex;
    align-items: center;
    left: 0;
    bottom: -20upx;
    margin-left: 340upx;
    .uni-swiper-dot {
      width: 6upx;
      height: 6upx;
      border-radius: 4upx;
      background: rgba(0, 0, 0, 0.15);
      margin-right: 10upx;
    }
    .uni-swiper-dot-active {
      width: 15upx;
      height: 6upx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4upx;
    }
  }
}
.content-scroll {
  .list-live-content-text {
    padding: 0 0;
    margin-left: 0;
    max-width: 312upx !important;
  }
}
</style>

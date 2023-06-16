<template>
  <view class="banner-wrap">
    <view class="list-live-content bannerList">
      <view class="list-live-content-text" v-if="index == swiperConfigure.current && swiperConfigure.isTitle" v-for="(item, index) in bannerList" :key="index">
        <image class="icon-live2" src="${getApp().globalData.qnUrl}/zc_images/findPage/live2.png" mode="widthFix"></image>
        <text>{{ item.number }} </text>
      </view>
    </view>
    <swiper
      :class="{ defaultDannerList: bannerList.length == 0 }"
      class="banner-swiper swiper-no-swiping"
      :current="swiperConfigure.current"
      :indicator-dots="swiperConfigure.indicatorDots"
      :autoplay="swiperConfigure.autoplay"
      :duration="swiperConfigure.duration"
      :interval="swiperConfigure.interval"
      :circular="swiperConfigure.circular"
      :previous-margin="swiperConfigure.previousMargin"
      :next-margin="swiperConfigure.nextMargin"
      @change="swiperChange"
      :style="'height:' + imgHeight + 'rpx'"
    >
      <swiper-item :style="'width:' + imgWidth + 'rpx;' + 'height:' + imgHeight + 'rpx'" v-for="(item, index) in imageList" :key="index">
        <view :style="'width:' + imgWidth + 'rpx;' + 'height:' + imgHeight + 'rpx'" class="banner-swiper-item" @click.stop="bannerJump(item)">
          <image
            :style="'width:' + imgWidth + 'rpx;' + 'height:' + imgHeight + 'rpx'"
            :src="item.image"
            mode="aspectFill"
            class="banner-swiper-img"
            :class="swiperConfigure.current == index ? '' : 'active'"
          ></image>
        </view>
      </swiper-item>
      <!-- 			<swiper-item v-if="bannerList.length == 0" v-for="(item,index) in bannerList" :key="index">
				<view class="banner-swiper-item">
					<image src="defaultImage" mode="aspectFill" class="banner-swiper-img" :class="swiperConfigure.current == index?'':'active'"></image>
				</view>
			</swiper-item> -->
    </swiper>
  </view>
</template>

<script>
export default {
  name: 'index-swiper',
  props: {
    imgWidth: {
      type: Number,
      default: () => {
        return 750;
      },
    },
    imgHeight: {
      type: Number,
      default: () => {
        return 260;
      },
    },
    bannerList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultDannerList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    swiperConfigure: {
      type: Object,
      default: () => {
        return {
          current: 0, //当前图片
          indicatorDots: true, //是否显示面板指示点
          autoplay: true, //是否自动切换
          interval: 4000, //自动切换时间间隔
          duration: 0, //滑动动画时长
          circular: true, //是否采用衔接滑动，即播放到末尾后重新回到开头
          previousMargin: '0px', //前边距
          nextMargin: '0px', //后边距
          isTitle: false,
        };
      },
    },
  },
  data() {
    return {
      imageList: [],
    };
  },
  watch: {
    bannerList: {
      handler(newName, oldName) {
        if (newName.length == 0) {
          this.imageList = this.defaultDannerList;
        } else {
          this.imageList = newName;
        }
        console.log('顶部轮播图列表-swiper-bannerList -', newName, newName.length);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    swiperChange(e) {
      let { current, source } = e.detail;
      //只有页面自动切换，手动切换时才轮播，其他不允许
      if (source === 'autoplay' || source === 'touch') {
        this.swiperConfigure.current = current;
      }
    },
    bannerJump(item) {
      console.log('轮播图点击事件-swiperImage', item);
        this.$emit('bannerJump', item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/findPage/discoveryPage.scss';
.banner-swiper {
  margin: 0 auto;
}
.banner-wrap {
  width: 100%;
  margin: auto;
  // pointer-events: none; // 禁止用户手滑动
  .banner-swiper {
    // height: 260upx;
    .banner-swiper-item {
      border-radius: 10upx;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      overflow: hidden;
      img,
      div {
        width: 100%;
        height: 100%;
      }
    }

    .banner-swiper-img {
      display: block;
      margin: auto;
      width: 98%;
      height: 100%;
      border-radius: 10upx;
    }
    .active {
      height: 100%;
      margin-top: 0;
      transition: all 0.1s ease-in 0s;
      transform: translateY(0);
    }
  }
}
/deep/.uni-swiper-dots {
  display: flex;
  align-items: center;
  .uni-swiper-dot {
    width: 6upx;
    height: 6upx;
    border-radius: 4upx;
    background: rgba(255, 255, 255, 0.3);
  }
  .uni-swiper-dot-active {
    width: 15upx;
    height: 6upx;
    background: #ffffff;
    border-radius: 4upx;
    background-color: #ffffff;
  }
}
.defaultDannerList {
  /deep/ .uni-swiper-slide-frame {
    transform: translate(0px, 0px) translateZ(0px) !important;
  }
}
</style>

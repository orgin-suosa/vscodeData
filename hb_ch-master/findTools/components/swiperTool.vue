<template>
  <view class="findTools">
    <swiper
      class="swiperTool-swiper swiper-no-swiping"
      :current="swiperConfig.current"
      :indicator-dots="swiperConfig.indicatorDots"
      :autoplay="swiperConfig.autoplay"
      :duration="swiperConfig.duration"
      :interval="swiperConfig.interval"
      :circular="swiperConfig.circular"
      :previous-margin="swiperConfig.previousMargin"
      :next-margin="swiperConfig.nextMargin"
      @change="swiperChange"
      :style="'height:' + imgHeight + 'rpx'"
    >
      <swiper-item :style="'width:' + imgWidth + 'rpx;' + 'height:' + imgHeight + 'rpx'" v-for="(item, index) in toolsList" :key="index">
        <view
          :class="swiperConfig.current == index ? 'active' : ''"
          :style="'width:' + imgWidth + 'rpx;' + 'height:' + imgHeight + 'rpx'"
          class="swiperTool-swiper-item"
          @click.stop="navigatePage(index)"
        >
          <view class="findTools-child">
            <image class="gift-title" :src="item.giftTitle" mode="heightFix"></image>
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
              :orderStatus="item.orderStatus"
              :discountPrice="item.discountPrice"
              :price="item.price"
              :remaining="item.remaining"
              :numberBuyers="item.numberBuyers"
              @priceClick="priceClick"
            ></price>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import price from '../components/priceExp';
export default {
  components: {
    price,
  },
  watch: {
    toolsList: {
      handler(newName, oldName) {
        this.toolsList = newName;
        console.log('scrollTools-toolsList -', this.toolsList);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
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
    imgWidth: {
      type: Number,
      default: () => {
        return 750;
      },
    },
    imgHeight: {
      type: Number,
      default: () => {
        return 330;
      },
    },
    swiperConfigure: {
      type: Object,
      default: () => {
        return {
          current: 0, //当前图片
          indicatorDots: false, //是否显示面板指示点
          autoplay: false, //是否自动切换
          interval: 4000, //自动切换时间间隔
          duration: 0, //滑动动画时长
          circular: true, //是否采用衔接滑动，即播放到末尾后重新回到开头
          previousMargin: '30px', //前边距
          nextMargin: '30px', //后边距
          isTitle: false,
        };
      },
    },
  },
  watch: {
    swiperConfigure: {
      handler(newName, oldName) {
        this.swiperConfig = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      swiperConfig: {
        current: 0, //当前图片
        indicatorDots: false, //是否显示面板指示点
        autoplay: false, //是否自动切换
        interval: 4000, //自动切换时间间隔
        duration: 0, //滑动动画时长
        circular: true, //是否采用衔接滑动，即播放到末尾后重新回到开头
        previousMargin: '30px', //前边距
        nextMargin: '40px', //后边距
        isTitle: false,
      },
    };
  },
  methods: {
    priceClick(text) {
      this.$emit('priceClick', text);
    },
    navigatePage(i) {
      this.$emit('navigatePage', i);
    },
    swiperChange(e) {
      let { current, source } = e.detail;
      //只有页面自动切换，手动切换时才轮播，其他不允许
      if (source === 'autoplay' || source === 'touch') {
        this.swiperConfig.current = current;
      }
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
::v-deep .swiperTool-swiper {
  width: 750rpx;
  height: 100%;
  &-item {
    width: 100%;
    height: 100%;
  }
  .uni-swiper-slide-frame {
    uni-swiper-item {
      width: 690rpx;
      height: 100%;
      border-radius: 20rpx;
      box-sizing: border-box;
      // background: #ffffff linear-gradient(270deg, #ffe2cc 0%, #fff3e7 100%);
      // box-shadow: 0 4rpx 8rpx 0 rgba(229, 229, 229, 0.5);
      .findTools-child {
        width: 100% !important;
        height: 100% !important;
        transform: scale(0.94);
        // background: transparent;
        // box-shadow:none;
        .findTools-child-price {
          width: 66%;
        }
      }
      .swiperTool-swiper-item {
        width: 100% !important;
        height: 100% !important;
      }
      .active {
        .findTools-child {
          transform: scale(1);
        }
      }
    }
	uni-swiper-item:nth-child(4n+1)  {
	  .findTools-child {
	    background: linear-gradient(270deg, #FFE2CC 0%, #FFF3E7 100%);
	    .findTools-child-text{
	    	color: #9C5D3A;
	    }
	  }
	}
    uni-swiper-item:nth-child(4n+2) {
      .findTools-child {
        background: linear-gradient(270deg, #FFEDE7 0%, #FFF2F2 100%);
        .findTools-child-text{
        	color: #9C5D3A;
        }
      }
    }

    uni-swiper-item:nth-child(4n+3) {
      .findTools-child {
       background: linear-gradient(270deg, #DEDBDB 0%, #F4F4F4 100%);
       .findTools-child-text{
       	color: #333333;
       }
      }
    }

    uni-swiper-item:nth-child(4n+4) {
      .findTools-child {
        background: linear-gradient(270deg, #E2DDFF 0%, #F7F6FF 100%);
        .findTools-child-text{
        	color: #333333;
        }
      }
    }
  }
}
</style>

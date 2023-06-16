<template>
  <view class="playback-area" v-if="list.length !== 0">
    <view class="playback-area-list" v-for="(item, index) in list" :key="index">
      <view class="playback-area-content curriculum">
        <view class="playback-area-child">
          <view class="curriculum-image-content">
            <image v-if="item.image != ''" class="curriculum-image" :src="item.image" mode=""></image>
            <image v-if="item.image == ''" class="curriculum-image" :src="noImage" mode=""></image>
          </view>
        </view>
        <view class="playback-area-describe">
          <view class="playback-area-className">{{ item.className }}</view>
          <text class="class-describe">{{ item.classDescribe }}</text>
          <view class="playback-area-describe-bottom">
            <view class="playback-area-price">
              <text class="price-unit">¥ </text>
              <text>{{ item.price }}</text>
            </view>
            <view class="share-price" @click="onShareBox(index)">分享赚 ¥{{ item.commission }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <noData v-else></noData>
</template>

<script>
import noData from '../../components/no-data/index.vue';
export default {
  name: 'courseIntroduction',
  components: {
    noData,
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      noImage: `${getApp().globalData.qnUrl}/zc_images/home/noImg.png`,
    };
  },
  methods: {
    onShareBox(i) {
      console.log('onShareBox-item-emit', i);
      this.$emit('onShareBox', i);
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/home/courseIntroduction.scss';
.playback-area {
  background-color: #ffffff;
  .playback-area-list {
    padding-bottom: 30upx;
    .curriculum {
      padding-bottom: 0;
      padding-top: 30upx;
      .playback-area-describe-bottom {
        // width: 75.8%;
        height: 60upx;
        bottom: 0;
      }
      .playback-area-describe {
        padding-top: 0;
      }
    }
    .curriculum-image-content {
      width: 140upx;
      height: 171upx;
      border-radius: 10upx;
      .curriculum-image {
        width: 100%;
        height: 100%;
        border-radius: 0;
      }
    }
  }
  .share-price {
    width: 180upx;
    height: 60upx;
    line-height: 60upx;
    text-align: center;
    background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
    border-radius: 30upx;
    font-size: 24upx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
    max-width: 180upx;
    max-height: 60upx;
    overflow: hidden;
    display: -webkit-box; /* 限制在一个块元素显示的文本的行数 */
    -webkit-line-clamp: 1; /* 设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-box-orient: vertical;
    white-space: normal;
    word-break: break-all;
    text-overflow: ellipsis;
  }
  .playback-area-price {
  }
  .price-unit {
    display: inline-block;
    transform: scale(0.6);
    padding-right: 5upx;
    vertical-align: text-bottom;
  }
}
.no-data {
  padding-top: 350upx;
}
</style>

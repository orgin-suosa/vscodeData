<template>
       <!-- #ifdef APP-PLUS-->
       <view class="recommend recommend_app">
      <!-- #endif -->
      <!-- #ifndef APP-PLUS-->
       <view class="recommend recommend_h5">
      <!-- #endif -->
    <view class="components-title">
      <view>{{ listTitle }}</view>
      <!-- <view class="components-title-key">更多</view> -->
    </view>
    <view class="playback-area-list">
      <view class="curriculum-scroll">
        <view class="playback-area-content curriculum" v-for="(item1, index) in list" :key="index">
          <view class="playback-area-child"  @click="curriculumNav(item1)">
            <image class="curriculum-image" :src="item1.image" mode=""></image>
            <!-- <view class="classSection">
						  <image class="icon-curriculum" src="https://qnsp.zcskjy.com/zc_images/home/icon-home-9.png" mode="widthFix"></image>
						<text>{{ item1.classSection }}节课时</text>
					  </view> -->
            <view class="playback-area-describe">
              <view class="playback-area-describe-content">
                <view class="playback-area-className">{{ item1.className }}</view>
                <view class="curriculum-describe">
                  <image class="curriculum-describe-icon" src="https://qnsp.zcskjy.com/zc_images/home/icon-home-11.png" mode="widthFix"></image>
                  <view>{{ item1.classSection }}节课时</view>
                  <view class="studentsNumber">{{ item1.studentsNumber }} 人已学</view>
                </view>
                <view class="sign-up-content">
                  <view class="playback-area-price"
                    ><text class="price_unit">￥</text><text>{{ item1.price }}</text>
                  </view>
                  <view class="sign-up-button">立即报名</view>
                </view>
              </view>
          	</view>
          </view>
        </view>
      </view>
    </view>
    <noData v-if="list.length == 0"></noData>
  </view>
</template>

<script>
import noData from '../../components/no-data/index.vue';
export default {
  name: 'courseIntroduction',
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isshow: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    listTitle: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  components: {
    noData,
  },
  data() {
    return {};
  },
  methods: {
    curriculumNav(item1) {
      uni.navigateTo({
        url: '/edu/course/class-detail?product_id=' + item1.product_id + '&item_id=' + item1.item_id,
      });
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/home/courseIntroduction.scss';
.recommend {
  width: 100%;
  padding-top: 8upx;
  
  .playback-area-list {
    width: 100%;
    .curriculum-scroll {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      // overflow-x: auto;
    }
  }
  .curriculum {
    display: block;
    width: 345rpx;
	height: 385rpx;
	max-height: 385rpx;
    // height: 400rpx;
    background: #ffffff;
    box-shadow: 0px 7upx 12upx 0upx rgba(229, 229, 229, 0.5);
    // margin-right: 20upx;
    margin-bottom: 0;
	  overflow: hidden;
    .playback-area-describe {
      // width: 290upx;
      height: 168upx;
      padding-top: 0;
      // margin: 0 auto;
      position: relative;
      padding-bottom: 25upx;
      border-radius: 0 0 10upx 10upx;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      &-content{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        overflow: hidden;
      }
      .playback-area-className {
        max-width: 100%;
        max-height: 48upx;
        line-height: 48upx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .curriculum-describe {
        font-size: 24upx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        // padding-top: 15upx;
        display: flex;
        align-items: center;
        .studentsNumber {
          margin-left: 17upx;
        }
        &-icon {
          width: 20upx;
          height: 20upx;
          margin-right: 12upx;
          vertical-align: middle;
        }
      }
      // font-size: 24upx;
      // font-family: PingFangSC-Regular, PingFang SC;
      // font-weight: 400;
      // color: #666666;
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      // white-space: nowrap;
    }
    .curriculum-image {
      width: 100%;
      height: 194rpx;
      border-radius: 10upx 10upx 0 0;
      overflow: hidden;
    }
  }
  .curriculum:nth-child(even) {
    margin-right: 0;
  }
}
.recommend_h5{
    .curriculum {
        .playback-area-describe {
          // margin-left: 17upx;
        }
    }
}
.recommend_app{
  .curriculum {
	  height: 367rpx;
	  max-height: 367rpx;
      .playback-area-describe {
        margin-left: 0;
      }
    }
}
.sign-up-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 15upx;
  .sign-up-button {
    width: 122upx;
    height: 50upx;
    line-height: 50upx;
    text-align: center;
    background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
    border-radius: 25upx;
    font-size: 24upx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
  .playback-area-price {
    font-size: 36upx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #f43d3e;
	padding-right: 48rpx;
    .price_unit {
      font-size: 20upx;
      padding-right: 10upx;
    }
  }
}

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
  padding-top: 6upx;
  &-key {
    font-size: 24upx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #999999;
    // -webkit-text-stroke:2upx #333333;
    // text-shadow: 0 0 5px #FF0000, 0 0 5px #6bf403;
  }
}
</style>

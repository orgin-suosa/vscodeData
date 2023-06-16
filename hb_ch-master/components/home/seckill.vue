<template>
  <view class="seckill">
    <view class="seckill-title">
      <view>{{ listTitle }}</view>
      <!--      <view class="seckill-title-key">更多</view> -->
    </view>
    <view v-if="!isshow">
      <view class="seckill-child" @click="curriculumNav(item)" v-for="(item, index) in list" :key="index">
        <view class="seckill-child-top">
          <image class="seckill-child-top-image" :src="item.image" mode=""></image>
          <view class="seckill-describe-content">
            <view>
              <view class="seckill-name">{{ item.className }}</view>
              <view class="seckill-describe">{{ item.classDescribe }}</view>
              <view class="seckill-students">
                <text class="studentsNumber">{{ item.studentsNumber }}</text
                >万人已购学习
              </view>
            </view>

            <view class="seckill-price-content">
              <view class="original-price"
                >原价: <text class="unit">¥</text> <text class="price">{{ item.price }}</text>
              </view>
              <view class="original-price seckill-price"
                >秒杀: <text class="unit">¥</text><text class="price">{{ item.priceSpike }}</text></view
              >
            </view>
          </view>
        </view>
        <view class="seckill-child-bottom">
          <view class="seckill-child-bottom-text">
            <view class="seckill-child-bottom-key">距结束</view>
            <view class="seckill-end-time">
              <!-- 						<text class="time">{{item.days}}</text>
						 <text class="unit">天</text>
						 <text class="time">{{item.hour}}</text><text class="unit">时</text>
						 <text class="time">{{item.minute}}</text><text class="unit">分</text>
						 <text class="time">{{item.second}}</text><text class="unit">秒</text> -->
              <countdown :day="item.days" :hour="item.hour" :minute="item.minute" :second="item.second" :showColon="false"></countdown>
            </view>
          </view>
          <view class="button-preemptive">马上抢</view>
        </view>
      </view>
    </view>
    <noData v-if="isshow"></noData>
  </view>
</template>

<script>
import countdown from '../../components/home/countdown.vue';
import noData from '../../components/no-data/index.vue';
export default {
  name: 'seckill',
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
    countdown,
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
.seckill {
  &-title {
    width: 100%;
    font-size: 36upx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8upx;
    &-key {
      font-size: 24upx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #999999;
      // -webkit-text-stroke:2upx #333333;
      // text-shadow: 0 0 5px #FF0000, 0 0 5px #6bf403;
    }
  }
  .seckill-child {
    background: #f8f7ff;
    border-radius: 10upx;
    margin-bottom: 20upx;
    &-top {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 630upx;
      height: 220upx;
      // margin: 0 auto;
      border-bottom: 1upx dashed #e3e3e3;
      position: relative;
      overflow: hidden;
      &-image {
        width: 140upx;
        height: 172upx;
        margin-left: 20upx;
        border-radius: 10upx;
        overflow: hidden;
      }
      .seckill-child {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .seckill-describe-content {
        width: 75%;
        height: 172upx;
        padding-left: 30upx;
        line-height: 42upx;
        padding-top: 10upx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 24upx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        .seckill-name {
          font-size: 36upx;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #333333;
          max-width: 100%;
          max-height: 42upx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .seckill-describe {
          font-size: 24upx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          max-width: 100%;
          max-height: 46px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .seckill-students {
          .studentsNumber {
            color: #ff1a32;
          }
        }
      }
      .seckill-price-content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .original-price {
          font-size: 18upx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #999999;
          .price {
            font-size: 34upx;
            text-decoration: line-through;
          }
          .unit {
            padding: 0 10upx;
          }
        }
        .seckill-price {
          color: #ff1a32;
          padding-right: 20upx;
          font-size: 24upx;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #f43d3e;
          .price {
            text-decoration: none;
            font-size: 42upx;
          }
        }
      }
    }
    &-bottom {
      width: 100%;
      height: 79upx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-key {
        margin-right: 45upx;
        padding-left: 27upx;
      }
      .unit {
        padding-right: 16upx;
      }
      &-text {
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 24upx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
      }
      .time {
        color: #ff1a32;
        padding-right: 21upx;
      }
      .button-preemptive {
        width: 120upx;
        height: 50upx;
        line-height: 50upx;
        text-align: center;
        background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
        border-radius: 25upx;
        font-size: 24upx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        margin-right: 20upx;
      }
    }
  }
  .seckill-child:last-child {
    margin-bottom: 0;
  }
}
</style>

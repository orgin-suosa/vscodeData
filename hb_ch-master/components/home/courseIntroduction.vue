<template>
  <view class="playback-area">
    <!-- <view class="components-title">
      <view>{{ listTitle }}</view>
      <view class="components-title-key" @click="moreJump">更多</view>
    </view> -->
    <view class="playback-area-list-content">
      <view class="playback-area-list" v-for="(item1, index) in list" :key="index">
        <view class="playback-area-content curriculum" @click="curriculumNav(item1)">
          <view class="playback-area-child">
            <view class="curriculum-image-content">
              <image class="curriculum-image" :src="item1.image" mode=""></image>
            </view>
            <view class="classSection">
              <image class="icon-curriculum" src="https://qnsp.zcskjy.com/zc_images/home/icon-home-9.png" mode=""></image>
              <view class="classSection-text">{{ item1.classSection }}节课时</view>
	
            </view>
          </view>
          <view class="playback-area-describe">
            <view class="playback-area-className">{{ item1.className }}</view>
            <text class="class-describe">{{ item1.classDescribe }}</text>
            <view class="playback-area-describe-list">
              <view class="describe-list-child" v-for="(key, i) in item1.tagList" :key="i"
                ><text class="describe-list-child-text">{{ key }}</text>
              </view>
            </view>
            <view class="playback-area-describe-bottom">
              <view class="speaker-content">
				  <image class="portrait" :src="item1.portrait"></image>
                
                <view class="speaker">主讲:{{ item1.speaker }}</view>
              </view>
              <view v-if="!item1.is_buy" class="playback-area-price">
                <text class="price_unit">¥</text>
                <text>{{ item1.price }}</text>
              </view>
              <view v-else class="course-item-buy-state">
                <text>{{ __('去学习') }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="isLookMore" class="look-more">
        <text>查看更多</text>
        <image class="look-more-icon" src="https://qnsp.zcskjy.com/zc_images/images/nav.png" mode=""></image>
      </view>
    </view>
    <noData v-if="list.length == 0 && !isload"></noData>
    <view class="skeleton-content" v-if="isload && list.length == 0">
      <skeleton :isload="isload" />
      <skeleton :isload="isload" />
      <skeleton :isload="isload" />
    </view>
  </view>
</template>

<script>
import noData from '../../components/no-data/index.vue';
import skeleton from '../home/skeleton_curriculum.vue';
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
    isLookMore: {
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
    describeList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {
    list: {
      handler(newName, oldName) {
        this.list = newName;
        if (this.list.length == 0) {
          this.isload = true;
        } else {
          this.isload = false;
        }
        console.log('理财·智库-list -', newName, this.list.length);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  components: {
    noData,
    skeleton,
  },
  data() {
    return {
      isload: true,
    };
  },
  methods: {
    moreJump() {
      uni.navigateTo({
        url: '/edu/course/course',
      });
    },
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
.playback-area {
  .curriculum {
    padding-bottom: 50upx;
    height: auto;
	.playback-area-describe-bottom {
	  bottom: 55upx;
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
    padding-top: 14upx;
    &-key {
      font-size: 24upx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #999999;
      // -webkit-text-stroke:2upx #333333;
      // text-shadow: 0 0 5px #FF0000, 0 0 5px #6bf403;
    }
  }
  .course-item-buy-state {
    font-size: small;
    padding: 12rpx 25rpx;
    border-radius: 50rpx;
    font-weight: 500;
    font-size: 24rpx;
    color: #ffffff;
    background: -webkit-linear-gradient(to right, #ff6161, #ff9661);
    /* Safari 5.1-6.0 */
    background: -o-linear-gradient(to right, #ff6161, #ff9661);
    /* Opera 11.1-12.0 */
    background: -moz-linear-gradient(to right, #ff6161, #ff9661);
    /* Firefox 3.6-15 */
    background: linear-gradient(to right, #ff6161, #ff9661);
  }
}
</style>

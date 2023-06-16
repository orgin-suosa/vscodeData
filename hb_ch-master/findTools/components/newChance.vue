<template>
  <view class="newChance">
    <view class="newChance-content" v-for="(item, index) in newChance" :key="index">
      <view class="newChance-child" :class="item.visited ? 'pageVisited' : ''" @click="navigateDetails(item)">
        <view class="newChance-child-top">
          <!-- <text class="top-tome">{{ item.ctime.substring(5, item.ctime.length) }}</text> -->
          <text class="top-tome">{{ item.ctime }}</text>
          <text class="top-title">{{ item.title }}</text>
        </view>
        <view class="newChance-child-bottom">
          <text>{{ item.brief }}</text>
        </view>
      </view>
      <view class="button-list">
        <view class="button-list-child" @click="priceClick" v-if="!totalOrderStatus && !item.isFree">
          <image class="iconLock" :src="iconLock" mode=""></image>
          <text class="button-list-child-text">解锁查看全文</text>
        </view>
        <!-- <view class="button-list-child" v-else @click="navigateDetails(item.authStatus)">
          <text class="button-list-child-text">查看全文</text>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    newChance: {
      type: Array,
      default() {
        return [];
      },
    },
    totalOrderStatus: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  watch: {
    newChance: {
      handler(newName, oldName) {
        this.newChance = newName;
        console.log('newChance组件 ', this.newChance);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      iconLock: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-lock.png`,
    };
  },
  onLoad() {},
  onUnload() {},
  methods: {
    priceClick() {
      this.$emit('priceClick');
    },
    navigateDetails(item) {
      console.log('navigateDetails', item);
      this.$emit('navigateDetails', item.id);
      //   uni.navigateTo({
      //     url: '/findTools/panZhongbao/introduce',
      //   });
    },
  },
};
</script>

<style lang="scss">
@mixin text-line($line: 1) {
  overflow: hidden;
  text-overflow: ellipsis;
  /* #ifndef APP-NVUE */
  word-break: break-all;
  display: -webkit-box;
  white-space: normal;
  -webkit-line-clamp: $line;
  -webkit-box-orient: vertical;
  /* #endif */
  /* #ifdef APP-NVUE */
  lines: $line;
  /* #endif */
}
.newChance {
  .newChance-content {
    position: relative;
  }

  &-child {
    width: 690rpx;
    height: 259rpx;
    background: #f1f3f8;
    border-radius: 20rpx;
    padding: 30rpx;
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
    flex-direction: column;
    box-sizing: border-box;
    margin-bottom: 40rpx;
    position: relative;
    &-top {
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      font-weight: 600;
      width: 100%;
      max-width: 100%;
      max-height: 90rpx;
      line-height: 42rpx;
      @include text-line(2);
      .top-tome {
        color: #f43d3e;
        font-family: PingFangSC-Regular, PingFang SC;
        padding-right: 15rpx;
      }
    }
    &-bottom {
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      width: 100%;
      max-width: 100%;
      max-height: 72rpx;
      line-height: 37rpx;
      @include text-line(2);
    }
  }
  .button-list {
    position: absolute;
    bottom: -30rpx;
    left: 50%;
    transform: translateX(-50%);
    &-child {
      width: 230rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      background: linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
      border-radius: 45px;
      font-size: 28rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      .iconLock {
        width: 20rpx;
        height: 25rpx;
        vertical-align: baseline;
      }
      &-text {
        vertical-align: baseline;
        padding-left: 10rpx;
      }
    }
  }
  .pageVisited{
	  .newChance-child-top{
		  color:#999999;  
		  .top-tome{
		  		color:#999999;  
		  	}
		  }
	  }
	  .newChance-child-bottom{
		 color:#999999;   
	  }
}
</style>

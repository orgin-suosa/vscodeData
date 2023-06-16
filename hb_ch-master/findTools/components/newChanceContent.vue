<template>
  <view class="newChance">
    <view class="newChance-content" v-for="(item, index) in newChance" :key="index">
      <view class="newChance-child" :class="item.visited ? 'pageVisited' : ''" @click="navigateDetails(item)">
        <view class="newChance-child-top">
          <!-- <text class="top-tome">{{ item.ctime.substring(5, item.ctime.length) }}</text> -->
          {{ item.ctime }}
        </view>
        <view class="newChance-child-content">{{ item.title }}</view>
        <view class="newChance-child-bottom">{{ item.previewcontent }}</view>
        <view class="list">
          <view class="list-child" v-for="items,index in item.stocksInfo" :key="index" :class="!item.authStatus ? 'lists-child' : 'list-child'">
            <view class="newChance-child-list">
              <view class="newChance-child-drugName" :style="!item.authStatus ? 'transform: translateY(6rpx)' : ''">{{item.authStatus ? items.zhongWenJianCheng : '****'}}</view>
              <view class="newChance-child-chg" :style="items.zhangFu.toString().indexOf('-') !== -1 ? 'color: green' : 'color: red'">{{ items.zhangFu.toString().indexOf('-') !== -1 ? items.zhangFu + '%' : '+' + items.zhangFu + '%'}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="button-list">
        <view class="button-list-child" @click="priceClick" v-if="!totalOrderStatus && !item.authStatus">
          <image class="iconLock" :src="iconLock" mode=""></image>
          <text class="button-list-child-text">解锁查看全文</text>
        </view>
        <!-- <view class="button-list-child" v-else @click="navigateDetails(item.authStatus)">
          <text class="button-list-child-text">查看全文</text>
        </view> -->
      </view>
    </view>
    <noData class="noData" v-if="newChance.length == 0" noDataText="暂无数据"></noData>
  </view>
</template>

<script>
import noData from '@/components/no-data/index.vue';
export default {
  components: {noData},
  props: {
    newChance: {
      type: Array,
      default () {
        return [];
      },
    },
    totalOrderStatus: {
      type: Boolean,
      default () {
        return true;
      },
    },
  },
  watch: {
    newChance: {
      handler (newName, oldName) {
        this.newChance = newName;
        console.log('newChance组件 ', this.newChance);
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  data () {
    return {
      iconLock: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-lock.png`,
      drugList: [
        {
          name: '易方医药ETF',
          chg: '+6.06%'
        },
        {
          name: '易方达药ETF',
          chg: '+6.06%'
        },
        {
          name: '易方达',
          chg: '-6.06%'
        },
        {
          name: '易方达医药ETF',
          chg: '+6.06%'
        },
        {
          name: '易方达医药ETF',
          chg: '-6.06%'
        },
      ]
    };
  },
  onLoad () { },
  onUnload () { },
  methods: {
    priceClick () {
      this.$emit('priceClick');
    },
    navigateDetails (item) {
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
.list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 42rpx;
  margin-left: 20rpx;
  width: 96%;
  .lists-child{
	  width: 33.33% !important;
  }
  .list-child{
	  width: 50%;
  }
}
.newChance {
  .newChance-content {
    position: relative;
  }

  &-child {
    width: 690rpx;
    // height: 259rpx;
    background: #f5f8ff;
    border-radius: 20rpx;
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
    flex-direction: column;
    box-sizing: border-box;
    margin-bottom: 40rpx;
    position: relative;
    &-top {
      font-size: 30rpx;
      font-weight: 500;
      color: #666666;
      line-height: 36rpx;
      margin: 29rpx;
      // @include text-line(2);
      .top-tome {
        color: #f43d3e;
        font-family: PingFangSC-Regular, PingFang SC;
        padding-right: 15rpx;
        font-weight: 500;
      }
    }
    &-content {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      line-height: 45rpx;
      margin: 0 29rpx;
      @include text-line(2);
    }
    &-list {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60rpx;
      background: #ffffff;
      border-radius: 4rpx;
      padding: 0 10rpx;
      margin-bottom: 10rpx;
    }
    &-list:nth-child(odd) {
      margin-right: 10rpx;
    }
    &-drugName {
      font-size: 26rpx;
      font-weight: 500;
      color: #333333;
      margin-right: 16rpx;
    }
    &-chg {
      font-size: 30rpx;
      font-weight: 500;
      color: #f43d3e;
    }
    &-bottom {
      font-size: 26rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      width: 632rpx;
      max-width: 632rpx;
      max-height: 72rpx;
      line-height: 37rpx;
      margin: 17rpx 29rpx;
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
  .pageVisited {
    .newChance-child-top {
      color: #999999;
      .top-tome {
        color: #999999;
      }
    }
  }
  .newChance-child-bottom {
    color: #999999;
  }
}
</style>

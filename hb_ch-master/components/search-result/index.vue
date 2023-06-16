<template>
  <view class="content searchResult" :class="{ searchNoResult: isData }">
    <!-- 搜索结果区域 -->
    <view class="playback-area">
      <scroll-view
        v-if="resultList.length != 0"
        @scroll="scroll"
        class="scroller"
        :style="{ height: scrollH + 'px', maxHeight: scrollH + 'px' }"
        :scroll-into-view="toView"
        scroll-y="true"
        scroll-with-animation="true"
      >
        <view class="parseContainer">
          <!-- 课程-->
          <view class="playback-area-child" v-for="(item, index) in resultList">
            <view class="playback-area-content curriculum">
              <view class="playback-area-child">
                <image class="list-live-image" src="https://qnsp.zcskjy.com/zc_images/images/bx1.png" mode="widthFix"></image>
                <view class="classSection">
                  <text>{{ item.classSection }}节课时</text>
                </view>
              </view>
              <view class="playback-area-describe">
                <view class="playback-area-className">{{ item.className }}</view>
                <text class="class-describe">{{ item.classDescribe }}</text>
                <view class="playback-area-describe-list">
                  <view class="describe-list-child">{{ item.days }}天视屏</view>
                  <view class="describe-list-child">直播授课</view>
                  <view class="describe-list-child">社群班</view>
                  <view class="describe-list-child">1对1辅导</view>
                </view>
                <view class="playback-area-describe-bottom">
                  <text class="speaker">{{ item.studentsNumber }}</text>
                  <view class="playback-area-price">{{ item.price }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <view v-if="resultList.length == 0" class="no-data">
        <image src="https://qnsp.zcskjy.com/zc_images/findPage/no-data.png" mode=""></image>
        <view>当前时间暂无相关数据，换个关键词试试</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'search-result',
  data() {
    return {
      tabIndex: 0,
      toView: '',
      isData: true,
      searchedList: [
        {
          text: '综合',
        },
        {
          text: '课程',
        },
        {
          text: '直播',
        },
        {
          text: '干货',
        },
        {
          text: '老师',
        },
      ],
    };
  },
  props: {
    resultList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    scrollH: {
      type: Number,
      default: () => {
        return '';
      },
    },
  },
  created() {},
  onLoad() {
    //页面初始化执行,用户页面获取参数
  },
  methods: {
    keywordsClick(item) {
      //推荐搜索
      this.searchText = item;
      // this.$emit('getSearchText', item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/findPage/discoveryPage.scss';
.searchNoResult {
  overflow-y: hidden;
}
.searchResult {
  .toolHeight {
    width: 750upx;
    height: 268upx;
    position: fixed;
    background: transparent;
  }
  .scroller {
    height: 1165upx;
    max-height: 1165upx;
    overflow-y: auto;
  }
  .uni-tabNav {
    z-index: 999;
    width: 100%;
    height: 80upx;
    font-size: 30upx;
    line-height: 40upx;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border-bottom: 1upx solid #dfdfdf;
    position: fixed;
    top: 180upx;
    .current {
      font-size: 34upx;
      color: #f43d3e;
      position: relative;
      &::before {
        bottom: -20upx;
      }
    }
  }
  .playback-area {
    padding: 0 30upx;
    padding-top: 84upx;
    .curriculum {
      padding-bottom: 87upx;
    }
    .playback-area-child {
      position: relative;
    }
    .curriculum,
    .teacher {
      .list-live-image {
        width: 180upx;
      }
      .playback-area-describe {
        padding-left: 15px;
      }
    }
    &-name {
      font-size: 36upx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    &-price {
      font-size: 20upx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #f43d3e;
    }
    .classSection {
      padding: 6upx 12upx;
      background: linear-gradient(90deg, #fdecd8 0%, #ffdeae 100%);
      border-radius: 20upx;
      font-size: 20upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #5b2111;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
    }
    .class-describe {
      font-size: 24upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }
    &-describe-list {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20upx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffa312;
      .describe-list-child {
        background: #fff5ed;
        border-radius: 6upx;
        padding: 6upx 15upx;
        margin-right: 5upx;
      }
    }
  }
  .tabTitle {
    padding: 20upx 24upx;
    font-size: 30upx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #333333;
  }
  .work {
    .playback-area-name {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      .playback-area-nameText {
        max-width: 396upx;
        max-height: 114upx;
        line-height: 42upx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .hot {
        position: absolute;
        .hot-text {
          transform: scale(0.7);
        }
      }
      .hotnews {
        text-indent: 76upx;
      }
    }
    .list-live-image {
      width: 200upx;
      height: 160upx;
      background: #ffcb9a;
      border-radius: 10upx;
      opacity: 0.36;
    }
  }
  .teacher {
    height: auto;
    .class-describe {
      max-width: 500upx;
      max-height: 120upx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
  .hot {
    padding: 12upx;
    line-height: 15upx;
    background: #ff8577;
    border-radius: 4upx;
    font-size: 22px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
  .no-data {
    background: #ffffff;
    font-size: 26upx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>

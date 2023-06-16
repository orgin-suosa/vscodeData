<template>
  <view class="marketScanning">
    <view class="stockShow">
      <view class="stockShow-top">
        <image class="iconRadar" :src="iconRadar" mode="widthFix"></image>
        <text>扫描全市场股票:</text> <text class="stockShow-key">{{ stockShow.totalStockCount }} 只</text>
      </view>
      <view class="stockShow-bottom">
        <view class="stockShow-bottom-child">
          <view class="stockShow-bottom-text">
            <text class="">{{ stockShow.riskRate }}</text>
            <image class="iconMark" :src="iconMark" mode="widthFix"></image>
          </view>
          <view class="stockShow-bottom-key">有风险股票占比</view>
        </view>
        <view class="stockShow-bottom-child">
          <view class="stockShow-bottom-text">
            <text class="">{{ stockShow.riskStockCount }}</text>
            <text class="stockShow-bottom-unit">只</text>
          </view>
          <view class="stockShow-bottom-key">有风险股票</view>
        </view>
        <view class="stockShow-bottom-child">
          <view class="stockShow-bottom-text">
            <text class="">{{ stockShow.safeStockCount }}</text>
            <text class="stockShow-bottom-unit">只</text>
          </view>
          <view class="stockShow-bottom-key">无风险股票</view>
        </view>
      </view>
    </view>
    <view class="stockUpdateTime">
      <image class="iconRefresh" :src="iconRefresh" mode="widthFix"></image>
      <text>更新时间：{{ stockShow.updTime }}</text>
    </view>
    <u-sticky>
      <subsection
        class="marketSubsection"
        :subMode="subMode"
        :selectionList="subsectionList"
        :subold="subold"
        :subActiveColor="subActiveColor"
        :subInactiveColor="subActiveColor"
        :subFontSize="subActiveColor"
        :subBgColor="subBgColor"
        :subsectionIndex="subsectionIndex"
        @changeBtnIndex="changeBtnIndex"
      ></subsection>
    </u-sticky>

    <moveTable class="marketScanningTable" :tableList="tableList" @itemClick="itemClick"></moveTable>
    <view class="text-tip">免责声明：本页面信息基于证券市场公开信息历史数据汇总，不代表未来趋势，仅供投资者参考，不构成投资分析、预测或者建议，投资者据此操作，风险自担。</view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import subsection from '@/components/subsection/index.vue';
import moveTable from '../scrolTable.vue';
export default {
  components: {
    subsection,
    moveTable,
  },
  props: {
    marketIndex: {
      type: Number,
      default() {
        return 1;
      },
    },
    stockShow: {
      type: Object,
      default() {
        return {};
      },
    },
    redHeiBang: {
      type: Object,
      default() {
        return {};
      },
    },
    orderStatus: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  watch: {
    redHeiBang: {
      handler(newName, oldName) {
        this.tableList = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
    SLNumber: {
      handler(newName, oldName) {
        this.deminingStocksNumber = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum', 'Lang', 'clientInfo', 'pushMessage', 'SLNumber']),
    ...mapMutations(['updateSLNumber']),
    resultHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      let fiexdReact;
      if (this.orderStatus) {
        fiexdReact = uni.upx2px(960) * 2;
      } else {
        fiexdReact = uni.upx2px(1120) * 2;
      }

      return winHeight - fiexdReact;
    },
  },
  data() {
    return {
      iconMark: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-mark.png`,
      iconRefresh: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-refresh.png`,
      iconRadar: `${getApp().globalData.qnUrl}/zc_images/findTools/icon-radar.png`,
      subsectionList: [
        {
          name: '今日红榜',
          show_fg: 0,
        },
        {
          name: '今日黑榜',
          show_fg: 0,
        },
      ],
      subMode: 'button',
      subold: true,
      subActiveColor: '#333333',
      subBgColor: '#F6F7FA',
      subsectionIndex: this.marketIndex,
      tableList: null,
      deminingStocksNumber: this.SLNumber,
    };
  },
  onLoad() {
    this.subsectionIndex = this.marketIndex;
    this.tableList = this.redHeiBang;
    this.deminingStocksNumber = this.SLNumber;
  },
  onUnload() {},
  methods: {
    changeBtnIndex(data) {
      this.subsectionIndex = data;
      console.log('changeBtnIndex-type:', data);
      this.$emit('changeBtnIndex', data);
    },
	theadClick(model, index) {
		console.info("model, index",model, index)
    },
    itemClick(model, index) {
      this.deminingStocksNumber = this.SLNumber;
      // if(index == 0){
      // 	this.toHq(model)
      // }else{
      // 	this.$emit('itemClick',model,index);
      // }
      this.$emit('itemClick', model, index, 'table');
    },

    det(data) {
      console.info('det==', data);
      // this.toHq(data)
    },
  },
};
</script>

<style lang="scss">
.stockShow {
  width: 690rpx;
  height: 260rpx;
  background: linear-gradient(49deg, #232030 0%, #676a74 100%);
  border-radius: 20rpx;
  padding: 0 30rpx;
  margin-top: 30rpx;
  box-sizing: border-box;
  .stockShow-top {
    width: 100%;
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 20rpx 0;
    .iconRadar {
      margin-right: 10rpx;
    }
  }
  .stockShow-key {
    padding-left: 20rpx;
  }
  .stockShow-bottom {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-child {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-direction: column;
      .iconMark {
        margin-left: 10rpx;
      }
      &:last-child {
        .stockShow-bottom-text,
        .stockShow-bottom-unit {
          color: #ffffff;
        }
      }
    }
    &-text {
      font-size: 50rpx;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #ff3a3a;
    }
    &-unit {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff4545;
      padding-left: 5rpx;
    }
    &-key {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
}
.stockUpdateTime {
  width: 690rpx;
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15rpx 0;
}
.text-tip {
  font-size: 24rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  padding-bottom: 160rpx;
  // padding-top: 24rpx;
}
.iconMark {
  width: 22rpx;
  height: 22rpx;
}
.iconRadar {
  width: 31rpx;
  height: 31rpx;
}
.iconRefresh {
  width: 28rpx;
  height: 26rpx;
  margin-right: 8rpx;
}
.marketSubsection {
  // position: sticky;
  // left: 0;
  // top:44px;
  z-index: 99;
}
::v-deep .marketScanningTable {
  padding-top: 28rpx;
  overflow: hidden;
  table.gridtable {
    tr td {
      width: 130rpx !important;
      padding-top: 16rpx;
      line-height: 44rpx;
      &:nth-child(1) {
        width: 180rpx !important;
      }
      &::nth-child(3) {
        width: 145rpx !important;
      }
    }
    //   thead, tbody{
    // 	display: table-caption;
    // }
    // tbody{
    // 	height: auto;
    // 	max-height: 210rpx;
    // 	overflow-y: scroll;
    // 	&:after{
    // 		border-bottom: 0;
    // 	}
    // }
  }
}
</style>

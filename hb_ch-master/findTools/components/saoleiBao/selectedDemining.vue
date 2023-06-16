<template>
  <view class="">
    <!-- 无权限,无购买 -->
    <noAccess v-if="!totalOrderStatus" />
    <!-- 无股票 -->
    <selfShares @toSelfSweep="toSelfSweep" v-if="totalOrderStatus && redHeiBang.fixedTB.length == 0" />

    <!-- 有股票 -->
    <view class="optional-shares" style="margin-bottom: 196rpx;" v-if="totalOrderStatus && redHeiBang.fixedTB.length !== 0">
      <view class="notice" v-if="isApp && hasLogin">
        <view class="notice-content">
          <view class="notice-tips"> 自选新增中高风险通知 </view>
          <view class="notice-title"> 当你自选新增中高风险时，将推送通知你 </view>
        </view>
        <view>
          <button v-if="!isPush" type="warn" class="notice-btn" @click="openNotice()">开启通知</button>
		  <button v-if="isPush" type="warn" class="notice-btn" @click="closeNotice()">关闭通知</button>
        </view>
      </view>

      <!-- 表格组件 -->
      <moveTable class="marketScanningTable" :tableList="tableList" @itemClick="itemClick" @changeSortDate="changeSortDate"></moveTable>

      <view class="notice-statement">
        <text>免责声明：本页面信息基于证券市场公开信息历史数据汇总，不代表未来趋势，仅供投资者参考，不构成投资分析、预测或者建议，投资者据此操作，风险自担。</text>
      </view>
      <view class="notice-button" :class="totalOrderStatus ? 'notice-fixed' : ''">
        <view>
          <u-button class="notice-down" @click="addStock">
            <u-icon name="https://qnsp.zcskjy.com/zc_images/findTools/downShares.png"></u-icon>
            <text class="text">导入股票</text>
          </u-button>
        </view>
        <view>
          <u-button class="notice-add" @click="toSelfSweep">
            <u-icon name="https://qnsp.zcskjy.com/zc_images/findTools/add.png"></u-icon>
            <text class="text">添加股票</text>
          </u-button>
        </view>
      </view>
    </view>
	<!-- 确认关闭通知提示 -->
	<u-modal class="pushModal" content="确认不再接收此推送" :show="showCloseNotice" showCancelButton buttonReverse @confirm="closeNotice" @cancel="() => (showCloseNotice = false)"></u-modal>
  </view>
</template>

<script>
import noAccess from '../noAccess.vue';
import selfShares from '../selfShares.vue';
import moveTable from '../scrolTable.vue';
import { mapState } from 'vuex';
export default {
  components: {
    noAccess,
    selfShares,
    moveTable,
  },
  props: {
    redHeiBang: {
      type: Object,
      default() {
        return {
          theadList: [],
          fixedTB: [],
        };
      },
    },
    totalOrderStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      noLimit: false,
      noShares: false,
      tableList: null,
	  // 是否推送
	  isPush:false,
	  isApp:false,
	  showCloseNotice:false,
	  aa:false
    };
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
  },
  computed: {
    ...mapState(['Config','userInfo', 'hasLogin', 'clientInfo','groupId']),
  },
  created() {
    // this.totalOrderStatus = true
    // console.log('totalOrderStatus',this.totalOrderStatus);
  },
  onLoad() {
	// #ifdef APP-PLUS
	this.isApp = true;
	// #endif
    this.tableList = this.redHeiBang;
    console.log('222', this.redHeiBang);
  },
  mounted() {
    console.log('redHeiBang222', this.redHeiBang);
  },
  methods: {
	  toSelfSweep(){
		  this.$emit('toSelfSweep')
    },
	  changeSortDate(val){
		  this.$emit('changeSortDate',val)
	  },
	  // changeDateUp(val){
		// this.$emit('changeDateUp',val)  
	  // },
	  // 导入自选股
	  addStock(){
		uni.navigateTo({
			url:'/findTools/saoLeiBao/downShares'
		})
	  },
	// 关闭通知
	async closeNotice() {
	  this.showCloseNotice = false;
	  this.isPush = false;
	  let cid = this.clientInfo?.clientid || '';
	  let params = {
	    userId: this.userInfo.user_id,
	    cid: cid,
	    busType: 0,
	    operateType: 1, // 关闭推送
	  };
	  console.log('PZBoperate-params', params);
	  await this.SLBoperate(params);
	
	  uni.showToast({
	    icon: 'none',
	    title: '已关闭通知',
	  });
	},
    // 打开通知
    openNotice() {
		if (!this.hasLogin) {
		  uni.navigateTo({
		    url: '/pages/login/login',
		  });
		  return;
		}
		this.isPush = true
		uni.showToast({
		  icon: 'none',
		  title: '已打开通知',
		});
		console.log('SLBoperate-params', this.clientInfo,this.userInfo);
		let cid = this.clientInfo?.clientid || '';
		let params = {
		  userId: this.userInfo.user_id,
		  cid: cid,
		  busType: 0,
		  operateType: 0, // 打开推送
		};
		console.log('PZBoperate-params', params);
		this.SLBoperate(params);
	},
	SLBoperate(params) {
	  // operateType=0开启推送，1关闭推送
	  const that = this;
	  console.log('开/关推送-入参', params);
	  console.log('开/关推送-url', that.Config.PZBoperate);
	  uni.request({
	    url: that.Config.PZBoperate,
	    method: 'POST',
	    dataType: 'jsonp',
	    data: params,
	    success: (res) => {
	      console.log('开/关推送-res', res);
	      const data = JSON.parse(res.data);
	      console.log('开/关推送-data', data);
	      // that.isPush = data.result;
	      console.log('开/关推送-result-isPush', data.result, that.isPush);
	    },
	    fail: (res) => {
	      console.log('开/关推送-fail', res);
	      uni.showToast({
	        icon: 'none',
	        title: '操作失败,请稍后再试!',
	      });
	    },
	    complete: () => {
	      this.SLBUserBinding();
	    },
	  });
	},
	// 查询用户绑定情况
	SLBUserBinding() {
	  const that = this;
	  let params = {
	    userId: that.userInfo.user_id,
	    type: 0,
	  };
	  console.log('查询用户绑定情况-入参', params);
	  console.log('查询用户绑定情况-url', that.Config.PZBUserBinding);
	  uni.request({
	    url: that.Config.PZBUserBinding,
	    method: 'get',
	    dataType: 'jsonp',
	    data: params,
	    success: (res) => {
	      const data = JSON.parse(res.data);
	      console.log('查询用户绑定情况-data', data);
	      const result = data.result;
	      console.log('查询用户绑定情况-result', result);
	      that.isPush = result.isOpenPush;
	      console.log('查询用户绑定情况-isPush', that.isPush, result.isOpenPush);
	    },
	    fail: (res) => {
	      console.log('查询用户绑定情况-fail', res);
	    },
	    complete: () => {},
	  });
	},
	// 点击表格
    itemClick(model, index,item) {
      console.log('item==============', item);
      if (index == 0) {
        this.toHq(model);
      } else {
        this.$emit('itemClick', model, index,item);
      }
    },
    toHq(data) {
      const that = this;
      if (data.nameCode) {
        let { val, val2, market } = data.nameCode;
        let setcode;
        if (market == 0 || market == 4) {
          setcode = 1;
        } else if (market == 1 || market == 3) {
          setcode = 0;
        } else {
          setcode = market;
        }
        let baseUrl = that.Config.ApiUrl;
        let urls = baseUrl + '/hq-H5/h5/index.html#/page_detail/page-detail/page-detail?code=' + val2 + '&setcode=' + setcode + '&stockName=' + val;
        // #ifdef H5
        window.location.href = urls;
        // #endif

        //#ifdef APP-PLUS
        uni.navigateTo({
          url: `/my/webview/webview_live?url=${urls}`,
        });
        // #endif
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
  }
}
.text {
  margin-left: 28rpx;
}
.notice {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #f0f0f0;
  border-radius: 8rpx;
  padding: 19rpx 17rpx 17rpx 15rpx;
  &-tips {
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  &-title {
    font-size: 26rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
  }
  &-btn {
    height: 60rpx;
    line-height: 60rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    border-radius: 10rpx;
  }
  &-statement {
    font-size: 22rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    margin-top: 24rpx;
  }
  &-button {
    display: flex;
    margin-top: 30rpx;
    // justify-content: space-between;
    align-items: center;
  }
  &-fixed{
	width: 100%;
	position: fixed;
	bottom: 0;
	// left: 0;
	background-color: #fff;
	z-index: 200;
	padding-bottom: 46rpx;
	padding-top:20rpx ;
  }
  &-add {
    width: 300rpx;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    border: 2rpx solid #fa6029;
    font-size: 30rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fa6029;
  }
  &-down {
    width: 300rpx;
    height: 90rpx;
    line-height: 90rpx;
    background: #fa6029 linear-gradient(90deg, #ff6161 0%, #ff9661 100%);
    border-radius: 45rpx;
    font-size: 30rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
	margin-right: 90rpx;
  }
}
</style>

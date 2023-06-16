<template>
  <view class="stockDetails"> 

	<view class="stockDetails-title">6月13日 周一 新股（2）</view>
	<view class=""  v-for="(item, index) in stockDetailList" :key="index">
		<view class="stockDetails-child " :class="item.isU ? 'newStock' : ''">
			  <view class="stockDetails-top">
				  <view class="stockNameContent">
					  <view class="stockName"  @click="clickitem(index,item.isU)">
						  <view class="stockNameText">
							  <text>{{item.stockName}}</text>
							  <text v-if="item.isU">U</text>
						  </view>
						 <view v-if="item.isU" @click="helpTip(U)" class="iconHelp"></view>
					  </view>
					   <view class="stocKey">
						   <view class="icon-c">{{item.iconStock}}</view>
						   <view>{{item.stockCode}}</view>
							<view class="triangle"></view>
					   </view>
				  </view>
				  <view class="calendar" :class="item.isYetAdd ? 'yetAdd' : ''" @click="reminder(item.isYetAdd,index)">添加提醒</view>
			  </view>
			  <view class="stockDetails-key-content" >
				<view class="stockDetails-key" v-for="(row, i) in item.keyList" :key="i">
					<view class="stocKey">
					<text>{{row.key}}</text>
					<view v-if="row.keyHelp" class="iconHelp"  @click="helpTip(row.type)"></view>
					</view>
					<view class="stocVal purchasePrice" v-if="row.type =='purchasePrice'">
						<view :class="parseInt(row.val) > 50 ? 'hotVal' : ''">{{row.val}}</view>
						<view v-if="parseInt(row.val) > 50" class="iconHelp" @click="helpTip(row.type)"></view>
					</view>
					<view v-if="row.type =='PE'" class="stocVal" :class="row.val > row.val2 ? 'hotReact' : ''">
						<text v-if="row.val > row.val2">{{row.val}} > {{row.val2}}</text>
						<text v-if="row.val < row.val2">{{row.val}} < {{row.val2}}</text>
					</view>
					<view class="stocVal" v-if="row.type == 'normal'">
						<view>{{row.val}}</view>
						<view v-if="row.keyHelp" class="iconHelp" @click="helpTip(row.type)"></view>
					</view>
				</view>
			  </view>
		</view>
	</view>
	  <u-modal
	  	:content="modalData.helplText"
	  	:title="modalData.title"
	  	:show="modalData.showHelp"
	  	@confirm="() => modalData.showHelp = false"
	  ></u-modal>
  </view>
</template>
<script>
export default {
  components: {},
  props: {
    stockDetailList: {
      type: Array,
      default() {
        return [];
      },
    },
	modalData: {
	  type: Object,
	  default() {
	    return {
			showHelp:false,
			title:'',
			helplText:''
		};
	  },
	},
  },
 watch: {
	stockDetailList: {
	   handler(newName, oldName) {
	     this.stockDetailList = newName;
	     this.$forceUpdate();
	   },
	   deep: true,
	   immediate: true,
	 },
	 modalData: {
	   handler(newName, oldName) {
	     this.modalData = newName;
	     this.$forceUpdate();
	   },
	   deep: true,
	   immediate: true,
	 },
 },
  data() {
    return {
		iconHelp: `${getApp().globalData.qnUrl}/zc_images/findPage/icon-help.png`,
		showHelp:false,
		helplText:''
	};
  },
  onLoad() {},
  onUnload() {},
  methods: {
	  reminder(state,i){
		  // state = !state;
		this.$emit('reminder',state,i); 
	  },
	  helpTip(id){
		  this.$emit('helpTip',id); 
	  },
	  clickitem(index,isNewStock){
		this.$emit('clickitem', index,isNewStock); 
	  }
  },
};
</script>

<style lang="scss">
	.stockDetails{
		.stockDetails-title{
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			padding-bottom: 16rpx;
		}
		.stockDetails-child{
			width: 690rpx;
			height: 260rpx;
			background: #FFFFFF;
			box-shadow: 0 4rpx 30rpx 0 rgba(229,229,229,0.5);
			border-radius: 8rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			align-items: center;
			padding: 0 25rpx;
			box-sizing: border-box;
			margin-bottom: 30rpx;
			.stockDetails-top{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
		.stockName{
			font-size: 34rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #000000;
			display: flex;
			align-items: center;
			justify-content: flex-start;
		}
		.stocKey{
			display: flex;
			justify-content: flex-start;
			align-items: center;
			font-size: 26rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 500;
			color: #999999;
		}
		.stocVal{
			font-size: 28rpx;
			font-family: DIN-Medium, DIN;
			font-weight: 500;
			display: flex;
			align-items: center;
			justify-self: flex-start;
		}
		.hotVal{
			color: #F03D39;
		}
		.newStock .stockName .stockNameText,.hotReact{
			// width: 214rpx;
			height: 40rpx;
			padding: 5rpx 18rpx;
			line-height: 40rpx;
			background: #FFE9E9;
			border-radius: 8rpx;
			// font-size: 28rpx;
			font-family: DIN-Medium, DIN;
			font-weight: 500;
			text-align: center;
			color: #F03D39;
		}
	}
	.stockDetails-key-content{
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		.stockDetails-key{
			display: flex;
			width: 44%;
			justify-content: space-between;
			align-items: center;
		}
	}
	.calendar{
	  width: 180rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      background: linear-gradient(90deg, rgba(255, 97, 97, 1) 0%, rgba(255, 150, 97, 1) 100%);
      border-radius: 45px;
	  font-size: 28rpx;
	  font-family: PingFangSC-Regular, PingFang SC;
	  font-weight: 400;
	  color: #FFFFFF;
	}
	.yetAdd{
		background: rgba(245, 245, 245, 1);
		color: #666666;
	}
	
	.triangle{
		position: relative;
		width: 10rpx;
		height: 10rpx;
		margin-left: 10rpx;
		&::before{
			content: "";
			position: absolute;
			top:50%;
			right: 0;
			width: 0;
			height: 0;
			border-left: 10rpx solid #E7E7E7;
			border-top: 10rpx solid transparent;
			border-bottom: 10rpx solid transparent;
			transform: translateY(-50%);
		}
	}
	.iconHelp{
	    height:22rpx;
		margin-left: 5rpx;
		position: relative;
		&::after{
			content: '';
			position: absolute;
			top:0;
			width: 22rpx;
			height:22rpx;
			background: url('https://qnsp.zcskjy.com/zc_images/findPage/icon-help.png');
			background-size: 22rpx 22rpx;
			background-repeat: no-repeat;
			background-position: center;
			
		}
	}
	.icon-c{
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		background: #4D62FF;
		border-radius: 4rpx;
		font-size: 20rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		margin-right: 10rpx;
		
	}
	::v-deep .u-popup__content{
	    .u-modal__content__text{
	        text-align: center;
	    }
	    .u-modal__button-group__wrapper__text{
	     color: #F43D3E !important;
	    }
	}
</style>
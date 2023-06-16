<template>
  <view class="policyDecision">
	  <view  @click="navigatePage(index)" class="list" v-for="(item, index) in toolsList" :key="index">
		  <img class="list_image" :src="item.image" alt="" srcset="">
		  <view class="list_right">
			  <view class="list_title">
				<view>{{item.title}}</view>
				 <view class="list_price" v-if="item.title !== '财经日历'">
					 <view class="originalPrice" >
					   <text class="price-unit">¥</text>
					   <text>{{ item.price }}</text>
					 </view>
				   <view class="discountPrice">
				     <text class="price-unit">¥ </text>
				     <text>{{ item.discountPrice }}</text>
				   </view>
				   
				 </view>
			  </view>
			  <view class="lable-list">
			   <view class="lable" v-for="item in item.lableList" :key="item">
				   <view class="lable-text">{{ item }}</view>
			   </view>
			  </view>
			  <view class="list_subtitle">{{item.subtitle}}</view>
			  
		  </view>
	  </view>
  </view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
export default {
  components: {},
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    list: {
      handler(newName, oldName) {
        // this.toolsList = newName;
        this.$forceUpdate();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
  	...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum',
  		'logout',
  		'Lang'
  	]),
  },
  data() {
    return {
	toolsList: [{
			image: `${getApp().globalData.qnUrl}/zc_images/community/pzb_jc.png`,
			title:'盘中宝',
			subtitle: '盘中有「宝」，快人一步！',
			price: '--',
			discountPrice: '--',
			orderStatus: false,
			productId: '',
			itemId: '',
			isPrice: true, // 是否显示价格
			isFree: false,
			remaining: null, //权限剩余到期
			numberBuyers: null, // 购买人数
			lableList: ['财联社', '精选', '信息'],
		},
		{
			image: `${getApp().globalData.qnUrl}/zc_images/community/lhb_jc.png`,
			title:'狙击龙虎榜',
			subtitle: '揭秘超短线模式，找寻资金背后逻辑',
			price: '--',
			discountPrice: '--',
			orderStatus: false,
			productId: '',
			itemId: '',
			isPrice: true, // 是否显示价格
			isFree: false,
			remaining: null, //权限剩余到期
			numberBuyers: null, // 购买人数
			lableList: ['财联社', '精选', '信息'],
		},
		{
			image: `${getApp().globalData.qnUrl}/zc_images/community/sjb_jc.png`,
			title:'事件宝',
			subtitle: '利好利空，一【览】无余，聚合每日重要事件！',
			price: '--',
			discountPrice: '--',
			orderStatus: false,
			productId: '',
			itemId: '',
			isPrice: true,
			isFree: false,
			remaining: null, //权限剩余到期
			numberBuyers: null, // 购买人数
			lableList: ['盘口异动', '未来大势', '事件掘金'],
		},
		{
			image: `${getApp().globalData.qnUrl}/zc_images/community/blb_jc.png`,
			title:'避雷宝',
			subtitle: '利用大数据从股票的基本面筛选五大风险因子',
			price: '--',
			discountPrice: '--',
			orderStatus: false,
			productId: '',
			itemId: '',
			isPrice: true,
			isFree: false,
			remaining: null, //权限剩余到期
			numberBuyers: null, // 购买人数
			lableList: ['交易风险', '市场风险', '财务风险', '信用风险','st退市风险'],
		},
		{
			image: `${getApp().globalData.qnUrl}/zc_images/community/calendar_jc.png`,
			title:'财经日历',
			subtitle: '囊括全球财经事件，紧跟市场热点走向',
			price: '--',
			discountPrice: '--',
			orderStatus: true,
			productId: '',
			itemId: '',
			isPrice: true,
			isFree: false,
			remaining: null, //权限剩余到期
			numberBuyers: null, // 购买人数
			lableList: ['财经', '日历', '事件'],
		},
	],
	};
  },
  created() {
  	this.panzhongbaoShop();
  },
  onLoad() {},
  onUnload() {},
  methods: {
	  panzhongbaoShop() {
	  	const that = this;
	  	let params = {
	  		userId: that.userInfo.user_id,
	  	};
	  	// console.log('支付相关-入参', params);
	  	// console.log('支付相关-url', that.Config.panzhongbaoShop);
	  	uni.request({
	  		url: that.Config.panzhongbaoShop,
	  		method: 'GET',
	  		dataType: 'jsonp',
	  		data: params,
	  		success: (res) => {
	  			// console.log('支付相关-res', res);
	  			const data = JSON.parse(res.data);
	  			// console.log('支付相关-data', data);
	  			const list = data.result;
	  			// console.log('支付相关-list', list);
	  			// console.log('获取首页banner-page_code', page_code);
	  			if (res.statusCode == 200) {
	  				let pzb = list.pzb;
	  				let slb = list.slb;
	  				let sjb = list.sjb;
	  				let lhb = list.lhb; // 狙击龙虎榜
					let fketf = list.fketf; // 风口
					let jgjj = list.jgjj; // 机构掘金
					
	  				//          console.log('支付相关-盘中宝---pzb--', pzb);
	  				//          console.log('支付相关-盘中宝---slb--', slb);
	  				// console.log('支付相关-盘中宝---slb--', sjb);
	  				that.assignTool(0, pzb);
	  				that.assignTool(1, lhb); // 狙击龙虎榜
	  				that.assignTool(3, slb); // 避雷宝
	  				that.assignTool(2, sjb); // 事件宝
	  				// console.log('发现工具 :that.pageDetail', that.toolsList);
					that.assignTool(5, fketf); // 风口ETF
					that.assignTool(6, jgjj); // 机构掘金
	  
	  				if (slb.itemId) {
	  					uni.setStorage({
	  						key: 'slbItemId',
	  						data: slb.itemId,
	  					});
	  				}
	  				if (slb.productId) {
	  					uni.setStorage({
	  						key: 'slbProductId',
	  						data: slb.productId,
	  					});
	  				}
	  				if (sjb.itemId) {
	  					uni.setStorage({
	  						key: 'sjbItemId',
	  						data: sjb.itemId,
	  					});
	  				}
	  				if (sjb.productId) {
	  					uni.setStorage({
	  						key: 'sjbProductId',
	  						data: sjb.productId,
	  					});
	  				}
	  
	  				if (lhb.itemId) {
	  					uni.setStorage({
	  						key: 'lhbItemId',
	  						data: lhb.itemId,
	  					});
	  				}
	  				if (lhb.productId) {
	  					uni.setStorage({
	  						key: 'lhbProductId',
	  						data: lhb.productId,
	  					});
	  				}
					
					if (fketf.productId) {
						uni.setStorage({
							key: 'fketfProductId',
							data: fketf.productId,
						});
					}
					if (jgjj.productId) {
						uni.setStorage({
							key: 'jgjjProductId',
							data: jgjj.productId,
						});
					}
	  			}
	  		},
	  		fail: (res) => {
	  			console.log('支付相关-fail', res);
	  		},
	  		complete: () => {},
	  	});
	  },
	  assignTool(i, key) {
	  	let that = this;
	  	that.toolsList[i].discountPrice = key.unitPrice;
	  	that.toolsList[i].price = key.marketValue;
	  	that.toolsList[i].orderStatus = key.orderStatus;
	  	that.toolsList[i].productId = key.productId;
	  	that.toolsList[i].itemId = key.itemId;
	  	that.toolsList[i].giftTitle = key?.giftTitle || that.toolsList[i].giftTitle;
	  	that.toolsList[i].remaining = key?.remaining || null;
	  	that.toolsList[i].numberBuyers = key?.numberBuyers || null;
	  },
	  navigatePage(i) {
	  	if (!this.hasLogin) {
	  		uni.navigateTo({
	  			url: '/pages/login/login',
	  		});
	  		return;
	  	}
	  	// #ifdef H5
	  	if (this.$.isWeixin()) {
	  		if (this.userInfo.isBindWeiXin !== 1) {
	  			this.cleanCache()
	  			return;
	  		}
	  	}
	  	// #endif
	  	if (i == 0) {
	  		uni.navigateTo({
	  			url: '/findTools/panZhongbao/index?productId=' + this.toolsList[0].productId +
	  				'&item_id=' + this.toolsList[0].itemId,
	  		});
	  	} else if (i == 1) {
	  		uni.navigateTo({
	  			// url: '/ganhuo/financelist/financelist',
	  			url: '/findTools/dragonTigerList/index?productId=' + this.toolsList[1].productId +
	  				'&item_id=' + this.toolsList[1].itemId,
	  		});
	  	} else if (i == 2) {
	  		uni.navigateTo({
	  			// url: '/ganhuo/financelist/financelist',
	  			url: '/findTools/eventBao/index?productId=' + this.toolsList[2].productId + '&item_id=' +
	  				this.toolsList[2].itemId,
	  		});
	  	} else if (i == 4) {
	  		uni.navigateTo({
	  			url: '/ganhuo/financelist/financelist',
	  		});
	  	} else if (i == 3) {
	  		if (this.toolsList[3].productId) {
	  			uni.navigateTo({
	  				url: '/findTools/saoLeiBao/index?productId=' + this.toolsList[3].productId +
	  					'&item_id=' + this.toolsList[3].itemId,
	  				// url: '/findTools/saoLeiBao/scanprogress?productId='+ this.toolsList[1].productId + "&item_id=" + this.toolsList[1].itemId,
	  			});
	  		} else {
	  			uni.showToast({
	  				icon: 'none',
	  				title: '接口异常，请稍后重试!',
	  			});
	  		}
	  	} else {
	  		if (!this.hasLogin) {
	  			uni.navigateTo({
	  				url: '/pages/login/login',
	  			});
	  			return;
	  		}
	  		// this.serverClick();
	  	}
	  },
	  serverClick() {
	  	console.log('专属客服');
	  	let user_id = this.userInfo.user_id;
	  	let wxOriginId = uni.getStorageSync('wxOriginId') ?? 'gh_77e0924a5066';
	  	let wxMiniPath = uni.getStorageSync('wxMiniPath') ?? 'pages/index/index';
	  	let path = wxMiniPath + '?typeIndex=0&userId=' + user_id + '&mobile=' + this.userInfo.user_mobile;
	  	this.pushMiniApp(path, wxOriginId);
	  },
  },
};
</script>

<style lang="scss">
	.policyDecision{
		width: 750rpx;
		// height: 100vh;
	}
	.lable-list {
	  display: flex;
	  margin-bottom: 10rpx;
	  margin-right: 20rpx;
	  overflow-x: auto;
	  
	  .lable {
	    background: #FFF5ED;
	    border-radius: 20rpx;
	    padding: 6rpx 12rpx;
	    margin-right: 10rpx;
	    font-size: 20rpx;
	    font-weight: 400;
	    color: #FFA312;
		white-space: nowrap;
		// &-text{
		// 	transform: scale(0.9);
		// }
	  }
	}
	.list{
		width: 750rpx;
		height: 204rpx;
		border-bottom: 1rpx solid #F5F5F5;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		&_title{
			font-size: 36rpx;
			font-family: PingFangSC-Semibold, PingFang SC;
			font-weight: 600;
			color: #333333;
			display: flex;
			justify-content: space-between;
			align-items: center;
			&_price{
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
		&_subtitle{
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
		}
		&_right{
			width: 82%;
		}
	
	}
	.list_image{
		width: 96rpx;
		height: 96rpx;
		margin-left: 30rpx;
		margin-right: 23rpx;
	}

	.price-unit {
	  padding-right: 5rpx;
	}
	
	.discountPrice {
	  font-size: 43rpx;
	  color: #ff3a3c;
	  vertical-align: middle;
	  display: inline-block;
	  padding-right: 20rpx;
	  .price-unit {
	    font-size: 24rpx;
	  }
	}
	.originalPrice {
	  vertical-align: middle;
	  display: inline-block;
	  // padding-left: 40rpx;
	  font-size: 34rpx;
	     margin-right: 25rpx;
	  color: #999999;
	  text-decoration: line-through;
	
	  .price-unit {
	    font-size: 18rpx;
	  }
	}
</style>
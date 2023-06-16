<template>
  <view class="content">
	<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
	<u-navbar
	  class="navbar-text"
	  :background="backgroundObj"
	  :is-fixed="true"
	   :title="detailsTableTitle"
      @leftClick="navBack"
      :is-back="true"
	  :border-bottom="false"
	/>
	<view class="statusBarHeight" :style="{ height: statusBarHeight + 'px' }"></view>
    <scroll-view class="newShares-scroll" :style="{ height: scrollHeight + 'rpx' }" scroll-y="true">
		<view class="details">
			<view class="detailsTitle">
				<view>西部利得量化成长混合（000006）</view>
				<view class="detailsTitle-tip">近一个月有效申报新股明细</view>
			</view>
			<scrolTable class="declarationFund" :tableList="tablelist" ></scrolTable>
		</view>
	</scroll-view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import scrolTable from '../components/scrolTable.vue';
export default {
	components: {scrolTable},
  props: {
    // detailsTableTitle: {
    //   type: String,
    //   default() {
    //     return '';
    //   },
    // },
  },
  computed: {
    ...mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin', 'newMsgNum', 'Lang']),
    scrollHeight: function () {
      let sys = uni.getSystemInfoSync();
      let winWidth = sys.windowWidth;
      let winrate = 750 / winWidth;
      let winHeight = parseInt(sys.windowHeight * winrate);
      return winHeight;
    },
  },
  data() {
    return {
	detailsTableTitle:'',
	  backgroundObj: {
	    backgroundImage: 'url(/static/zeroPurchase/titleBg.png)',
	    backgroundSize: '100% 100%',
	    opacity: 1,
	  },
      statusBarHeight: 0,
      navBarHeight: 0,
	  leftIconColor: '#ffffff',
	  tablelist:{
	  	theadList:[
	  		{
	  			id: 'nameCode',
	  			name: '名称/代码',
	  		},
	  		{
	  			name:'上市日期',
	  			id:'listingdate'
	  		},
	  		{
	  			name:'发行价格',
	  			id:'issuePrice',
	  			isIconHelp:true
	  		},
	  	],
	  	fixedTB:[
	  		{
	  			nameCode: {
	  				val:'腾亚精工',
	  				val2:'301125',
	  				type:'normal',
	  				val2Color:'#999999'
	  			},
	  			listingdate:{
	  				val:'2022-01-01',
	  				type:'normal',
	  				isDet:true
	  			},
	  			issuePrice:{
	  				val:'5',
	  				type:'normal',
	  				fontColor:''
	  			}
	  		},
	  	]
	  },
      PageNav: {
        window: {
          navigationBarBackgroundColor: '#ffffff',
          navigationBarTextStyle: 'black',
          navigationBarTitleText: '',
          backgroundColor: '#f8f8f8',
          backgroundTextStyle: 'dark',
        },
      },
    };
  },
  onLoad(options) {
    this.init(options);
  },
  onUnload() {},
  methods: {
    init(options) {
	console.log("detailsTable-options",options)
	this.detailsTableTitle = options.detailsTableTitle
    this.getSystemInf();
    },
	navBack(e) {
	  //  #ifdef  APP-PLUS
	  uni.navigateBack();
	  //  #endif
	
	  //  #ifdef  H5
	  history.back();
	  //  #endif
	},
    getSystemInf() {
      // 获取手机系统信息
      const info = uni.getSystemInfoSync();
      // 设置状态栏高度（H5顶部无状态栏小程序有状态栏需要撑起高度）
      this.statusBarHeight = info.statusBarHeight;
      // 除了h5 app mp-alipay的情况下执行
      // #ifndef H5 || APP-PLUS || MP-ALIPAY
      // 获取胶囊的位置
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
      // (胶囊底部高度 - 状态栏的高度) + (胶囊顶部高度 - 状态栏内的高度) = 导航栏的高度

      // #endif
    },
  },
};
</script>

<style lang="scss">
// @import '@/styles/findPage/scss.scss';
.statusBarHeight{
	padding-top: 44px;
}
.details{
	padding:0 30rpx;
	.detailsTitle{
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
		&-tip{
			font-size: 26rpx;
			color: #999999;
		}
	}
	.declarationFund{
		padding-top: 30rpx;
		::v-deep table.gridtable.col3{
			thead, tbody  {
				tr{
					td{
						width: 130rpx !important;
					}
					td:nth-child(2){
						width: 260rpx !important;
						text-align: center;
						.val,.val2{
							text-align: center;
						}
					}
					td:last-child{
							text-align: left;
						.val,.val2{
							text-align: left;
						}
					}
				}
			}
		}
	}
}
</style>
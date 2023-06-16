<template>
  <view class="content">
    <view class="statusBarHeight" :style="{ height: statusBarHeight + 'px' }"></view>
    <status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
    <scroll-view class="articleDetail-scroll" :style="{ height: scrollHeight + 'rpx' }"       
      scroll-y="true"
	@scrolltoupper="upper"
	@scrolltolower="toLower"
	@scroll="listScroll"
	  > 
	<view id="anchor"></view>
	<image class="bg" :src="stockPicking" mode="widthFix"></image>
<!-- 	<image class="buyButton" :src="buy" mode="widthFix" @click="goTop()"></image> -->
	<view class="verifyLoginContent" ref="verifyLogin">
		<verifyLogin  class="verifyLogin" :buy="buy" signInButtonText="¥2.99元立即抢购" @goTop="goTop" @loginJump="loginJump">
		</verifyLogin>
		<view class="autoRolling">
			<view class="autoRolling-title">最新成功报名用户</view>
			<view class="autoRolling-content">
				<view class="autoRolling-text" ref="marque" :style="{animationDuration:autoRolist.length + 's'}">
					<view v-for="(item, index) in autoRolist" :key="index">{{item}}</view>
				</view>
			</view>
		</view>
	</view>
	</scroll-view>
	<payPage ref="paymentMethod" :cartId="cartId"  :showPay="showPay" @openPopup="openPopup"></payPage>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import verifyLogin from '@/components/verifyLogin/index.vue';
import verifyLogin from './components/verifyLogin/index.vue';
// import paymentMethod from '@/components/paymentMethod/index.vue';
import payPage from './components/payPage.vue';
export default {
  components: {verifyLogin,payPage},
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
  watch: {
  	showPay: {
  	  handler(newName, oldName) {
  	    this.showPay = newName;
  	    this.$forceUpdate();
  	  },
  	  deep: true,
  	  immediate: true,
  	},
  },
  data() {
    return {
	  cartId:'57|1',
      statusBarHeight: 0,
      navBarHeight: 0,
	  scrollTop: 0,
	  old: {
		  scrollTop: 0,
		  reverseOpacity: 0,
		},
		ceList:[
			'13913886239',
			'13991385182',
			'13813864482',
			'15369960597',
			'15969571595',
			'17512024680',
			'13518215782',
			'13182808787',
			'13764156636',
			'13616023184',
			'18153256769',
			'18600457459',
			'13604013456',
			'18301946578',
			'13751118749',
			'13651035403',
			'18510587470',
			'15614416436',
			'18813571472',
			'18333844177',
			'15506175537',
			'15990981172',
			'18930230812',
			'13764594241',
			'13537762970',
			'15300085721',
			'18877927118',
			'15866331189',
			'15900738620',
			'13434982679',
			'13556497124',
			'18263444933',
			'18059035151',
			'18942192789',
			'18455683220',
			'18360259152',
			'17687548680',
			'18035913928',
			'15822826760',
			'13681245424',
			'13304156152',
			'13828777170',
			'18500176466',
			'18455872054',
			'18124199775',
			'15873849924',
			'13790875023',
			'15332373833',
			'15014145137',
			'18750765310',
			'18474389630',
			'18105388620',
			'13719137937',
			'13578182425',
			'13979638269',
			'15171278026',
			'18681582785',
			'13795269739',
			'15538801592',
			'18017766337',
			'18350485608',
			'13779957372',
			'13796340827',
			'13631265377',
			'15900675677',
			'18240182957',
			'13474471030',
			'13948834579',
			'13018355356',
			'18162316772',
			'18438656676',
			'17707601060',
			'13162182871',
			'18627064923',
			'13571366159',
			'15201955651',
			'18912625644',
			'13572099363',
			'13050547470',
			'13315059332',
			'18240410908',
			'13454687023',
			'18950925388',
			'13524110206',
			'15601667281',
			'18797909909',
			'18621951994',
			'15260979763',
			'17695502049',
			'18917860328',
			'18641933001',
			'15246289096',
			'15133890209',
			'13799768819',
			'18091995798',
			'17665001772',
			'18771291961',
			'18616351807',
			'13065564076',
		],
	  autoRolist:['刚刚 139****6239用户 报名成功','刚刚 139****5182用户 报名成功','刚刚 138****4482用户 报名成功'],
	  showPay:false,
      stockPicking: `${getApp().globalData.qnUrl}/zc_images/activity/nuggetsBg.png`,
	  buy: `${getApp().globalData.qnUrl}/zc_images/activity/nuggets_buy.png`,
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
  onLoad() {
	console.info("抄手老李推广页1.0.0")
    this.init();
	this.marqueeList();
  },
  onUnload() {},
  onShow(){
		// this.showPay = false;
  },
  methods: {
    init() {
      this.getSystemInf();
    },
	marqueeList(){
		const that = this;
		this.$FT.clearArr(this.autoRolist);
		this.ceList.forEach(function (item, i, array) {
			let cel =that.$FT.geTel(item);
			// let autoRolText = '刚刚 139****6239用户 报名成功'
			let autoRolText = '刚刚 ' + cel + ' 报名成功';
			that.autoRolist.push(autoRolText)
		});
	},
	openPopup(state){
		console.log("state",state)
		this.showPay = state;
	},
	pay(){	this.$refs.verifyLogin.$emit("loginButton")  }, 
	loginJump: function (code) {
	  this.showPay = true;
	},
	upper: function (e) {
	  console.log(e);
	},
	toLower: function (e) {
	  const that = this;
	  console.log('滑动加载', e);

	},
	listScroll(e) {
	  console.log('scroll:', e);
	},
	goTop: function (e) {
		let that = this;
		 document.querySelector('#anchor').scrollIntoView(true);
	  
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
      this.navBarHeight = menuButtonInfo.bottom - info.statusBarHeight + (menuButtonInfo.top - info.statusBarHeight);

      // #endif
    },
    uniRequest(data) {
      const that = this;
      uni.request({
        url: this.Config.URL.edu.getProductList,
        method: 'get',
        data: data,
        dataType: 'json',
        success: (res) => {
          const data = res.data.data;
          console.log('getList-res', res);
          if (res.statusCode == 200) {
            uni.stopPullDownRefresh();
            result.forEach(function (item, i, array) {
              // console.log('result-forEach', item, i, array);
            });
          }
        },
        fail: () => {},
        complete: () => {
          // this.contentScroll();
        },
      });
    },
  },
};
</script>

<style lang="scss">
// @import '@/styles/findPage/scss.scss';
.bg{
	width: 750rpx;
	height: 3500rpx;
}
.content{
	position: relative;
	background-color: #e43e23;
	
}
.autoRolling{
	position: absolute;
	top:1540rpx;
	left: 50%;
	transform: translateX(-50%);
	.autoRolling-content{
		height: 60rpx;
		overflow: hidden;
		.autoRolling-text{
			// animation: marquee 2s linear infinite;
			animation: 35s marquee linear infinite normal;
		}
		
	
	}
}
@keyframes marquee {

 0% {
    transform: translateY(10rpx);
    -webkit-transform: translateY(10rpx);
  }
  100% {
    transform: translateY(-100%);
    -webkit-transform: translateY(-100%);
  }
}
::v-deep .verifyLogin{
		.signIn_content{
			position: absolute;
			top:1134rpx;
			left: 50%;
			transform: translateX(-50%);
		}
		.main-input{
			font-size: 32rpx;
			
		}
		.oBorder{
			// width: 603rpx;
		    background: transparent;
		    border-radius: 0;
		    box-shadow: none;
			display: flex;
			justify-content: space-between;
			
		}
		.mobileCode{
			.main-input{
				width: 288rpx;
				height: 104rpx;
				margin-right: 20rpx;
				padding-left: 42rpx;
				
			}
		}
		.user_mobile,.main-input,.vercode{
			background: #FFF5F4;
			border-radius: 52rpx;
		}
		.vercode{
			width: 244rpx;
			height: 104rpx;
			line-height: 104rpx;
			text-align: center;
			font-size: 32rpx;
			font-family: SourceHanSansSC-Regular, SourceHanSansSC;
			font-weight: 400;
			color: #EE1818;
		}
		.signIn-button{
			margin-top: 45rpx;
			animation: scaleAn 1s linear infinite;
			.buttonBorder {
				font-size: 60rpx;
				font-family: D-DIN-Bold, D-DIN;
				font-weight: bold;
				color: #FFF5F4;
				width: 603rpx;
				height: 104rpx;
				background: #E43E23;
				border-radius: 52rpx;
				&::after{
					width: 0;
					height: 0;
				}
			}
		}
		.user_mobile{
			width: 538rpx;
			// height: 104rpx;
			border-radius: 52rpx;
			background: #FFF5F4;
			margin: 0 auto;
			.main-input{
				width: 603rpx;
				height: 104rpx;
			}
			.country-int-code{
				display: none;
			}
		}
	}
	.buyButton{
		width: 750rpx;
		height: 209rpx;
		margin: 0 auto;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 9;
	}
	.autoRolling{
		width: 100%;
		font-size: 32rpx;
		text-align: center;
		font-family: SourceHanSansSC-Regular, SourceHanSansSC;
		font-weight: 400;
		color: #843F29;
		white-space: nowrap;
	}
	#anchor{
		width: 750rpx;
		height: 1rpx;
		position: relative;
		top:1010rpx;
	}
		@keyframes scaleAn {
		        /*from表示动画的开始位置4可以使用0%*/
		   //      from{
		   //         transform: scale(1.1);
		   //      }
		   //      /*to动画的结束位置也可以使用100%*/
		   //      to{
					// transform: scale(1.0);
		   //      }
		   0%{
			   transform: scale(1.0);
		   }
		   25%{
		   		transform: scale(1.025);
		   }
		   50%{
		   		transform: scale(1.05);
		   }
		   70%{
		   		transform: scale(1.075);
		   }
		   100%{
		   		transform: scale(1.1);
		   }
		}
</style>
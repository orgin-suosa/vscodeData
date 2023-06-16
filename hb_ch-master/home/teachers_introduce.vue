<template>
  <!-- #ifndef H5-->
   <view class="container" >
  <!-- #endif -->
  <!-- #ifdef H5-->
  <view class="container container_h5">
  <!-- #endif -->
	<status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
	<!-- #ifdef H5-->
	<open-app />
	<!-- #endif -->
	<u-navbar @leftClick="clickLeft" :is-fixed="true" title="明星师资" @rightClick="onShareBox" :rightIcon="shareIcon"
			:border-bottom="false" />
    <scroll-view class="container_scroll" scroll-y="true">
      <!-- <top-title title="明星师资"></top-title> -->
      <image class="intro" :src="imgUrl" mode="widthFix"></image>
    </scroll-view>
	<shareGApp :shareDataDefault="shareData" ref="shareBoxApp" />
  </view>
</template>

<script>
// import topTitle from '../components/top_title/top_title.vue';
import shareGApp from '@/components/share-g-app';
import { mapState, mapMutations } from 'vuex';
import { redirectWeChatByAppId, initWeChatActivity, addListenWeChatForward, wxClose } from '@/helpers/initWXShare.js';
export default {
  components: {
   shareGApp
  },
  data() {
    return {
	  shareIcon: 'share-square',
	  shareData:{},
      imgUrl: `${getApp().globalData.qnUrl}/zc_images/home/teachers.png` + this.$FT.versionKey(),
	  shareLogo: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg` + this.$FT.versionKey(),
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
  computed: mapState(['Config','userInfo']),
  created() {
	  //  #ifdef  APP-PLUS
	  this.shareIcon = 'share-square';
	  //  #endif
     this.getSystem();
  	this.initShareData();
  },
  onLoad() {
  	  //  #ifdef  APP-PLUS
  	  this.shareIcon = 'share-square';
  	  //  #endif
	  this.getSignature();
  	},
  methods: {
	  clickLeft() {
	  	// console.log('clickLeft');
	  
	  	//  #ifdef  APP-PLUS
	  	uni.navigateBack();
	  	//  #endif
	  
	  	//  #ifdef  H5
	  	history.back();
	  	//  #endif
	  },
	 initShareData(){
		 let that = this;
		 
		 let $href = that.$.sprintf('%s/h5/home/teachers_introduce?uid=%d', that.Config.SiteUrl, that.userInfo.user_id,'&showOpenApp=true');
		 
		 // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
		 // #ifdef APP-PLUS
		 $href = that.$.sprintf('%s/h5/home/teachers_introduce?uid=%d', that.Config.SiteUrl, that.userInfo.user_id, '&showOpenApp=true');
		 // #endif
		 // #ifdef MP-WEIXIN
		 $href = '/h5/home/teachers_introduce?uid=' + that.userInfo.user_id + '&showOpenApp=true';
		 // #endif
		 that.setData({
		 	shareData: {
		 		shareTitle: '长乘学堂明星师资',
		 		shareText: '有温度的陪伴式投教学习基地',
		 		href: $href,
		 		image: that.shareLogo,
		 	},
		 });
		 console.log('分享入参：', that.shareData);
	 },
	  onShareBox() {
		this.initShareData();
	  	// #ifndef MP-WEIXIN
	  	this.$refs.shareBoxApp.show();
	  	// #endif
	  },
	  async checkAuthProcess(signature) {
	  	let that = this;
	  	console.info('长乘资质--初始化微信流程------------>signature---1.2',signature);
	      const ua = navigator.userAgent.toLowerCase();
	      const isWeChat = ua.indexOf('micromessenger') !== -1;
	  	console.info('长乘资质------是否处于微信环境------------->1.2', isWeChat);
	  	if (!isWeChat) return;
	  
	  	// 初始化微信活动主流程
	  	await initWeChatActivity(signature);
	  	 // 监听微信转发
	  	addListenWeChatForward(this.handleForwardData(), () => {
	  	  // 转发回调，增加转发记录
	  	  console.info('长乘资质-转发数据', this.handleForwardData());
	  	});
	      },
	      // 转发参数处理
	      handleForwardData() {
	        return {
	          title: this.shareData.title,
	          desc: this.shareData.shareText,
	          imgUrl: this.shareData.image,
	          link: this.shareData.href,
	        };
	  },
	  async getSignature() {
	    const that = this;
	    let _href = encodeURIComponent(location.href.split('#')[0]);
	    const params = {
	      url: encodeURIComponent(_href), // url
	      // url: 'https://shop-qa.zcskjy.com/h5/', // url
	    };
	    console.log('getSignature-params', params);
	    console.log('getSignature-url', that.Config.URL.WXSignature);
	    uni.request({
	      url: that.Config.URL.WXSignature,
	      method: 'get',
	      data: params,
	      dataType: 'json',
	      success: (res) => {
	        const data = res.data;
	        console.log('getSignature-data', data);
	        let result = res.data.result;
	        // console.log('getSignature-complete-res', result);
	      },
	      fail: () => {},
	      complete: (res) => {
	        let result = res.data?.result;
	        console.log('getSignature-complete-res', result);
	        that.signature = {
	          // appId: 'wx1935506901780516', // 小程序的唯一标识
	          appId: 'wxd74f2b85b1b724a7', // 必填，公众号的唯一标识
	          timestamp: result?.timestamp, // 必填，生成签名的时间戳
	          nonceStr: result?.nonceStr, // 必填，生成签名的随机串
	          signature: result?.signature, // 必填，签名，见附录1
	        };
	  	console.log('getSignature-checkAuthProcess-参数', that.signature);
	  	 that.checkAuthProcess(that.signature);
	      },
	    });
	  },
	  getSystem() {
	    let that = this;
	    let port = uni.getSystemInfoSync().platform;
	    const ua = navigator.userAgent.toLowerCase();
	    const isWeChat = ua.indexOf('micromessenger') !== -1;
	  
	    switch (port) {
	      case 'android':
	        that.android = true;
	        console.log('运行Android上', port); //android
	        break;
	      case 'ios':
	  		if (isWeChat){
	  			wxClose();
	  		};
	        that.isios = true;
	        console.log('运行iOS上', port); // ios
	        break;
	      default:
	        console.log('运行在开发者工具上'); //devtools
	        break;
	    }
	  },
    goBack() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
};
</script>

<style lang="scss">
$openAppHeight: 100rpx;
.container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  background-color: #fff6f6;
  &_scroll{
  	padding-top: calc(44px + var(--status-bar-height)); 
  }
}
.container_h5{
	/deep/ .u-navbar--fixed{
		top:$openAppHeight;
	}
	.container_scroll{
		padding-top: calc(44px + #{$openAppHeight} + var(--status-bar-height)); 
	}
}
.intro {
  width: 100%;
  height: 100%;
}
</style>

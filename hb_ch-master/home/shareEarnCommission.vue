<template>
  <view class="shareEarnCommission">
	  <status-bar :backgroundColor="PageNav.window.navigationBarBackgroundColor"></status-bar>
	  <view class="shareContent">
		  <view class="shareContent-title">分享课程赚佣金</view>
		  <view class="shareContent-describe">分享课程成交越多收益越高</view>
		  <view class="look-rule" @click="clickNavigate">查看规则</view>
	  </view>
     <commissionCourse @onShareBox="onShareBox" :list="courseIntroductionList"></commissionCourse>
	<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
    </view>
  </view>
</template>

<script>
import commissionCourse from '../components/home/commissionCourse';
import shareBoxApp from '../components/share-box-app.vue'
import {
	mapState,
	mapMutations,
} from 'vuex';
export default {
  name: 'shareEarnCommission',
  components: {
	commissionCourse,
	shareBoxApp
  },
  computed: mapState([
  	'Config',
  	'StateCode',
  	'notice',
  	'plantformInfo',
  	'shopInfo',
  	'userInfo',
  	'hasLogin'
  ]),
  data() {
    return {
		noImage: `${getApp().globalData.qnUrl}/zc_images/home/noImg.png`,
		shareLogo:'https://qnsp.zcskjy.com/zc_images/WXshare.jpg',
		shareData:{},
		PageNav: {
			window: {
				navigationBarBackgroundColor: '#ffffff',
				navigationBarTextStyle: 'black',
				navigationBarTitleText: '',
				backgroundColor: '#f8f8f8',
				backgroundTextStyle: 'dark',
			},
		},
		courseIntroductionList:[
			// {
			// 	classDescribe: "重点基础提升",
			// 	className: "收益赚钱课",
			// 	image: "http://mallsuite.oss-accelerate.aliyuncs.com/mall/images/media/store/1001/20220512/a07a6b99c3bb4dd4b8e9adb935ecb250.jpg",
			// 	price: 99,
			// 	commission:'11',
			// 	speaker: "长乘讲师",
			// },
			// {
			// 	classDescribe: "重点基础提升",
			// 	className: "收益赚钱课",
			// 	image:'',
			// 	price: 99,
			// 	commission:'11',
			// 	speaker: "长乘讲师",
			// }
		]
	};
  },
onLoad() {
	this.$FT.clearArr(this.courseIntroductionList);
	this.getProductList();
},
  methods: {
	clickNavigate(){
		uni.navigateTo({
		  url: '/home/distributionRules',
		});
	},
	onShareBox: function (e) {
	  console.log("onShareBox-courseIntroductionList",this.courseIntroductionList[e])
      let that = this;

      let $href = that.$.sprintf('%s/h5/pages/index/index?uid=%d', that.Config.SiteUrl, this.userInfo.user_id);

      // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
      // #ifdef APP-PLUS
      $href = that.$.sprintf('%s/h5/pages/index/index?uid=%d', that.Config.SiteUrl, this.userInfo.user_id);
      // #endif
      // #ifdef MP-WEIXIN
      $href = '/pages/index/index?uid=' + this.userInfo.user_id;
      // #endif

      var path, title, image,shareText;

      if (that.$.isNull(this.ProductInfo)) {
		title = that.courseIntroductionList[e].className;
		shareText = that.courseIntroductionList[e].classDescribe;
      } else {

        title = that.__('我发现这个商品很好，非常适合你哦！');
      }
	  console.log("分享入参：",path, title, image,shareText)
      this.setData({
        shareData: {
          shareTitle: title,
          shareText: shareText,
          href: $href,
          image: that.shareLogo,
        },
      });

      // 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
      // #ifdef APP-PLUS
      this.$refs.shareBoxApp.show();
      // #endif


    },
	  getProductList(){
		  const that = this;
	      that.$.request({
	       url: that.Config.URL.edu.getProductList,
	       method: 'get',
	       data: {
	        page: 1,
	        rows: 10,
	        category_id: 2025,
	        kind_id: 1205,
	        product_state_id: 1001,
	        product_dist_enable:1, // 过滤分销的课程
	       },
	       dataType: 'json',
	       success: function(data, status, msg, code) {
	        console.log('分享有礼:data, status', data, status);
			data?.items.forEach(function (item, i, array) {
				const price=item.item_color[0].item_sale_price;
				const commission=item.item_color[0].item_fx_cps;
				let product_image=(item.product_image ?? '') == ' ' ? that.noImage :item.product_image
				console.log('分享有礼-product_image',product_image)
				that.courseIntroductionList.push({
              	classDescribe: item.product_tips,
				className: item.product_name,
				image:product_image,
				price: price,// 课程价格
				commission:commission,// 佣金
              });
			})
	       }
		  })
		  console.log("courseIntroductionList",that.courseIntroductionList)
	  },
  },
};
</script>

<style lang="scss">
@import '@/styles/home/courseIntroduction.scss';
.shareEarnCommission{
	width: 750upx;
	background: #ffffff;
	overflow-x: hidden;
	.playback-area{
		padding-right: 0;
	}
	.shareContent{
		width: 100%;
		height: 288upx;
		background: url("https://qnsp.zcskjy.com/zc_images/home/shareEarnCommission01.png");
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: center;
		text-align: left;
		padding-left: 41upx;
		margin: 0 auto;
		.shareContent-title{
			font-size: 48upx;
			line-height: 48upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			padding-top: 49upx;
		}
		.shareContent-describe{
			font-size: 32upx;
			line-height: 32upx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			padding-top: 18upx;
			padding-bottom: 26upx;
		}
		.look-rule{
			width: 180upx;
			height: 52upx;
			line-height: 52upx;
			background: #D8D8D8 linear-gradient(90deg, #FFAB6E 0%, #F8A657 100%);
			border-radius: 26upx;
			font-size: 28upx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #FFFFFF;
			text-align: center;
		}
	}
}
</style>

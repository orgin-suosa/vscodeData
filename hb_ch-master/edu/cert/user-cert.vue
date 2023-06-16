<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view style="background-color: #FFE2D2;height: 40rpx;"></view>
		<!-- #endif -->
			<view class="course_nav">
				<view class="course_nav_left"  @click="goback">
					<text class="iconfont icon-fanhui" style="font-size: 32rpx;color: #000000;"></text>
				</view>
			</view>
		<view class="top">
			<view class="cert_title">获得成就</view>
			<view class="top-center">
				<image class="user-avatar" :src="userCert.user_avatar ? userCert.user_avatar:'https://qnsp.zcskjy.com/zc_images/images/my/headerImg..png'"></image>
				<view class="join_time_long">已学习{{userCert.studied_day}}天</view>
				<view style="height: 100rpx;">
					<view style="float: left;padding-top: 0rpx; width: 50%;">
						<view style="text-align: center;font-size: 40rpx; font-weight: bold;line-height: 58rpx;">{{userCert.cert_num}}</view>
						<view class="text_3">获得证书</view>
					</view>
					<view style="padding-top: 0rpx; width: 50%; float: left;">
						<view style="text-align: center;font-size: 40rpx; font-weight: bold;line-height: 58rpx;">{{userCert.learn_time_proportion}}%</view>
						<view class="text_3">超越学习的人数</view>
					</view>
				</view>
			</view>
			<view class="context">
				<view v-if="userCert.user_cert!=false">
					<view class="graduation" v-for="item in userCert.user_cert">
						<image class="cert-image" :src="item.cert_url"></image>
					</view>
				</view>
				<view v-else>
					<view @click="goToStudy()">
						<image style="height: 250rpx;width: 40%;margin-left: 30%;margin-right: 30%;margin-top: 20%;" src="https://qnsp.zcskjy.com/zc_images/findPage/no-data.png"></image>
						<view style="text-align: center;">暂无证书，去学习</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

var that; // 当前页面对象
export default {
	data() {
		// 页面数据变量
		return {
			current: 0,
			swiperCurrent: 0,
			userCert:{
				user_cert: '',
				user_avatar: '',
			},
		};
	},
	computed: mapState(['Config']),
	// 监听 - 页面每次【加载时】执行(如：前进)
	onLoad() {
		uni.setNavigationBarTitle({
			title: this.__('我的证书')
		});

		that = this;
		that.init();
	},

	// 监听 - 页面【首次渲染完成时】执行。注意如果渲染速度快，会在页面进入动画完成前触发
	onReady() {},
	// 监听 - 页面每次【显示时】执行(如：前进和返回) (页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面)
	onShow() {},
	// 监听 - 页面每次【隐藏时】执行(如：返回)
	onHide() {},
	// 函数
	methods: {
		// 页面数据初始化函数
		init() {
			that.getUserCert()
		},
		// tabs通知swiper切换
		tabsChange(item) {
			this.swiperCurrent = item.index;
		},
		goToStudy() {
			uni.navigateTo({
				url: '/edu/course/course'
			});
		},
		goback() {
			uni.navigateBack()
		},
		//
		getUserCert(pageNo, pageSize) {
			that.$.request({
				url: this.Config.URL.edu.getUserCert,
				data: {},
				dataType: 'json',
				loading:false,
				success: function(data, status, msg, code) {
					if (status == 200) {
						that.userCert = data
						if(!data.user_avatar){
							that.userCert.user_avatar = "https://static.shopsuite.cn/demodata/assets/data/avatar.png";
						}
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/components/audio/font/iconfont.css';
.page {
	width: 100%;
	height: 1350rpx;
	background: #FFFFFF;
	line-height: 1;
}
.course_nav{
	position:absolute;
	width: 100%;
	height: 50rpx;
	z-index: 999;
	padding: 0rpx 30rpx;
	margin-top: 20rpx;
	box-sizing: border-box;
	.course_nav_left{
		float: left;
		color: #ffffff;
	}
	._right{
		float: right;
		width: 260rpx;
		height: 50rpx;
		border-radius: 25rpx;
		background: rgba(0,0,0,0.3);
		line-height: 50rpx;
		font-size: 24rpx;
		text-align: center;
		margin: 5rpx;
		color: #FFFFFF;
	}
}
.top {
	height: 436rpx;
	background-image: url('https://qnsp.zcskjy.com/zc_images/20220602180348.png');
	background-size: 100% 100%;
	.cert_title {
		position: absolute;
		margin-top: 10%;
		transform: translate(-50%);
		left: 50%;
		width: 144rpx;
		height: 50rpx;
		font-size: 36rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 50rpx;
	}
	.top-center {
		position: relative;
		top: 290rpx;
		width: 90%;
		height: 140px;
		background: #ffffff;
		margin-left: 35rpx;
		margin-right: 35rpx;
		box-shadow: 0px 11px 12px 0px rgba(240, 240, 240, 0.5);
		border-radius: 5px;
		.user-avatar {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			position: relative;
			bottom: 70rpx;
			left: 40%;
		}
		.join_time_long {
			text-align: center;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #333333;
			margin-top: -70rpx;
		}
	}
	.context {
		margin-top: 300rpx;
		width: 100%;
		// box-shadow: 0px 4px 8px 0px rgba(240, 240, 240, 0.5);
		// border-radius: 10px 10px 0px 0px;
	}
	.cert-image {
		width: 180rpx;
		height: 241rpx;
		float: left;
		margin: 20rpx;
	}
	.graduation {
		width: 100%;
		margin: 35rpx;
	}
	.text_3 {
		font-size: 24rpx;
		text-align: center;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		line-height: 22px;
	}
}
</style>

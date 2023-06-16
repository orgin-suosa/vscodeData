<template>
	<view class="page" v-if="showUrl == 'true'">
		<!-- #ifdef APP-PLUS -->
		<view style="height: 40rpx;"></view>
		<!-- #endif -->
		<image :src="cert_url" class="cert_image" mode="widthFix"></image>
		<view class="black_line"></view>
		<view class="cert_box">
			<!-- #ifdef APP-PLUS -->
			<u-button class="save_image" type="primary" shape="circle" @click="saveImg(cert_url)">保存</u-button>
			<u-button class="share_image" type="primary" shape="circle" @click="onShareBox">分享</u-button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
				<u-button class="share_image" type="primary" shape="circle" @click="onShareBox">分享</u-button>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<u-button class="save_image" type="primary" shape="circle" @click="saveImg(cert_url)">保存</u-button>
			<!-- #endif -->
			
			<view :class="'m-panel-sp ' + (shareBoxFlag==0?'hide':'') " @click.stop="closeNativeShare">
				<view :class="'m-panel-sp-content ' + (shareContetnFlag==0?'bounceOutDown animated':'bounceInUp animated')"
				 @click.stop>
					<view class="page-body">
						<!-- #ifdef APP-PLUS -->
						<view class="btn-area" v-if="1">
							<block v-for="(value,index) in providerList" :key="index">
								<button type="primary" v-if="value" :disabled="shareType === 5 && value.name !== '分享到微信好友'" @tap="share(value)">{{value.name}}</button>
							</block>
						</view>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<view class="btn-area">
							<button type="primary" open-type="share">{{__('分享')}}</button>
						</view>
						<!-- #endif -->
			
						<view class="uni-icon uni-icon-closeempty m-panel-sp-icon" color="#888" @click="closeNativeShare"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<share-box-app :shareDataDefault="shareData" ref="shareBoxApp"></share-box-app>
		<!-- #endif -->
		
		<!-- #ifdef H5 -->
		<share-box-h5 :shareDataDefault="shareData" ref="shareBoxH5"></share-box-h5>
		<!-- #endif -->
		
		<!-- #ifndef APP-PLUS -->
		<share-box-mp :shareDataDefault="shareData" @showCodeImg="showCodeImg" @saveImg="saveImg"  ref="shareBoxMp"></share-box-mp>
		<!-- #endif -->
		<u-toast ref="uToast" />
	</view>
	
	<view v-else class="page">
		<view class="user_cert_info">
			<view class="greeting">亲爱的{{userInfo.user_nickname}}学员</view>
			<view class="no_cert">你还未获得毕业证书</view>
		</view>
		<view class="zhongcai_view"><image class="zhongcai_pic" src="https://qnsp.zcskjy.com/zc_images/edu_pic/no_get_cert.png"></image></view>
		<view style="margin-left: 100rpx; margin-right: 50rpx;float: left;">
			<image class="finish_state" src="https://qnsp.zcskjy.com/zc_images/edu_pic/cert_finish.png" v-if="course_fin_schedule>=course_pc_schedule"></image>
			<image class="finish_state" src="https://qnsp.zcskjy.com/zc_images/edu_pic/cert_no_finish.png" v-else></image>
			<text class="no_finfish">课程学习进度达到{{course_pc_schedule}}</text>
		</view>
		<view>
			<image class="finish_state" src="https://qnsp.zcskjy.com/zc_images/edu_pic/cert_finish.png" v-if="chapter_fin_num>=study_chapter_num"></image>
			<image class="finish_state" src="https://qnsp.zcskjy.com/zc_images/edu_pic/cert_no_finish.png" v-else></image>
			<text class="no_finfish">章节学习数达到{{study_chapter_num}}</text>
		</view>
		<view style="margin-left: 100rpx; margin-right: 50rpx; float: left;">
			<image class="finish_state" src="https://qnsp.zcskjy.com/zc_images/edu_pic/cert_finish.png" v-if="mark>=course_pc_score"></image>
			<image class="finish_state" src="https://qnsp.zcskjy.com/zc_images/edu_pic/cert_no_finish.png" v-else></image>
			<text class="no_finfish">考试分数达到{{course_pc_score}}</text>
		</view>
		<view style="margin-left: 100rpx;">
			<image class="finish_state" src="https://qnsp.zcskjy.com/zc_images/edu_pic/cert_finish.png" v-if="user_study_chapter_time>=study_chapter_time"></image>
			<image class="finish_state" src="https://qnsp.zcskjy.com/zc_images/edu_pic/cert_no_finish.png" v-else></image>
			<text class="no_finfish">章节学习时长达到{{study_chapter_time}}分</text>
		</view>
		<view class="will_get_cert">即可获得毕业证书</view>
		<view class="continue_study">
			<u-button class="u_btn" type="primary" shape="circle" text="继续学习" @click="jumpStudy(product_id, item_id)"></u-button>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import shareBoxMp from '../../../components/share-box-mp.vue'
import shareBoxApp from '../../../components/share-box-app.vue'
import shareBoxH5 from '../../../components/share-box-h5.vue'

var that; // 当前页面对象

export default {
	data() {
		// 页面数据变量
		return {
			shareData: {
				shareText: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
				shareTitle: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
				href: "https://www.suteshop.com",
				image: '',
				price: 0
			},
			show: false,
			showUrl: false,
			showCodeImg: false,
			shareQRCode: false,
			product_id: 0,
			item_id: 0,
			shareBoxFlag: 0,
			shareContetnFlag: 0,
			course_pc_schedule: 0, //所需课程学习进度
			study_chapter_num: 0, //所需课程章节学习数
			course_pc_score: 0, //所需考试得分
			course_fin_schedule: 0, //用户课程完成进度
			chapter_fin_num: 0, //用户章节完成数
			study_chapter_time: 0,//章节学习时长
			user_study_chapter_time: 0,//用户章节学习时长
			mark:0, //用户分数
			cert_url: '' ,//证书图片
			store_name: '',//机构名称
			product_name: '',
			product_price: '',
		};
	},
	onLoad(options = {}) {
		this.showUrl = options.show
		this.res = options.res
		let res = JSON.parse(decodeURIComponent(options.res))
		if(options.show == 'true'){
			this.cert_url = res.cert_url
			this.product_name = res.product_name
			this.product_price = res.product_price
		}else{
			this.product_id = res.product_id
		 	this.course_pc_schedule = res.course_pc_schedule
			this.course_pc_score = res.course_pc_score
			this.study_chapter_num = res.study_chapter_num
			//用户
			this.course_fin_schedule = res.course_fin_schedule
			this.chapter_fin_num = res.chapter_fin_num
			this.study_chapter_time = res.study_chapter_time
			this.user_study_chapter_time= res.user_study_chapter_time
			this.mark = res.mark
		}
		this.item_id = res.item_id
		this.store_name = res.store_name
		that = this;
	},
	computed: {
	  ...mapState(['Config','userInfo']),
	},
	components: {
		shareBoxMp,
		shareBoxApp,
		shareBoxH5
	},
	methods: {
		jumpStudy(product_id, item_id){
			let again_url = this.$.sprintf('/edu/course/class-detail?product_id=%d&item_id=%d', product_id, item_id);
			uni.navigateTo({
				url: again_url
			});
		},
		onShareBox: function(e) {
			let that = this;
			var $href = that.$.sprintf('%s/tmpl/product_detail.html?item_id=%d&FX=%d', this.Config.WapSiteUrl, this
				.skuid, this.userInfo
				.user_id);
			
			$href = that.$.sprintf('%s/h5/edu/course/class-detail?item_id=%d&uid=%d', that.Config.SiteUrl, this
				.item_id, this.userInfo.user_id);
			// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			// #ifdef APP-PLUS
			
			// #endif
			
			// #ifdef MP-WEIXIN
			$href = "/edu/course/class-detail?product_id=" + this.product_id + "&uid=" + this.userInfo
				.user_id;
			// #endif
		
			this.setData({
				shareData: {
					shareTitle: this.product_name,
					shareText: this.product_name,
					href: $href,
					image: this.cert_url,
					price: this.product_price
				}
			});
		
			// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
			// #ifdef APP-PLUS
			this.$refs.shareBoxApp.show();
			// #endif
		
			//海报
			if (e == 3)
			{
				// #ifndef APP-PLUS
				this.$refs.shareBoxMp.show();
				// #endif
			}
			else
			{
				// #ifdef H5
				if (that.$.ifUniApp())
				{
					this.$refs.shareBoxH5.show();
				}
				else
				{
					this.$refs.shareBoxMp.show();
				}
				// #endif
			}
		
		},
		
		saveImg(url) {
			uni.downloadFile({
					url,
					success: res => {
					if (res.statusCode === 200) {
						uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success: function() {
							that.$refs.uToast.show({
								title: '保存图片成功',
								message: '保存图片成功',
								type: 'default',
								duration: 1000
							});
						},
						fail: function() {
							that.$refs.uToast.show({
								title: '保存图片成功',
								message: '保存图片成功',
								type: 'default',
								duration: 1000
							});
						}
					});
					} else {
						that.$refs.uToast.show({
							title: '保存图片成功',
							message: '保存图片成功',
							type: 'default',
							duration: 1000
						});
					}
				}
			});
		},
		
		closeNativeShare: function() {
			var that = this;
			that.setData({
				shareContetnFlag: 0,
				share_flag: !1
			});
		
			setTimeout(function() {
				that.setData({
					shareBoxFlag: 0
				})
			}, 1e2)
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #FFFFFF !important;
	height: 100% !important;
}
.page {
	background-color: #FFFFFF !important;
	width: 100%;
	height: 100%;
}
.cert_image {
	width: 90%;
	height: 73%;
	margin-top: 10%;
	margin-left: 5%;
	margin-right: 5%;
}
.black_line {
	width: 100%;
	height: 5%;
	background: linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
	opacity: 0.04;
	margin-top: 5rpx;
}
.cert_box{
	width: 100%;
	height: 160rpx;
	margin-top: 50rpx;
  display: flex;
  flex-direction: row;
	.save_image {
		width: 320rpx;
		height: 90rpx;
		background: linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
		border-radius: 45rpx;
		border-color: #FF6161;
		//float: left;
		//margin-left: 30rpx;
	}
	.share_image {
		width: 320rpx;
		height: 90rpx;
		background: #F18D3D;
		border-radius: 45rpx;
		border-color: #F18D3D;
	}
}
.user_cert_info {
	width: 100%;
	text-align: center;
	height: 200rpx;
	.greeting {
		padding-top: 100rpx;
		font-size: 35rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #333333;
		line-height: 50rpx;
	}
	.no_cert {
		font-size: 36rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 56rpx;
	}
}
.zhongcai_view {
	width: 100%;
	text-align: center;
	.zhongcai_pic {
		width: 700rpx;
		height: 500rpx;
	}
}
.finish_state{
	width: 30rpx;
	height: 26rpx;
	margin-right: 20rpx;
}
.no_finfish {
	width: 100%;
	color: #FF7944;
	text-align: center;
	line-height: 25rpx;
	font-weight: bold;
	font-size: 25rpx;
}
.will_get_cert {
	width: 100%;
	text-align: center;
	font-size: 35rpx;
}
.continue_study {
	width: 100%;
	margin-top: 120rpx;
	text-align: center;
	.u_btn {
		width: 80%;
		border: 1rpx solid orange;
		background: linear-gradient(to right,#FF6F61,#FF9061);
	}
}
</style>

<template>
	<view class="notice-page" v-show="showPage">
		<view class="notice-img">
			<img :src="imageUrl">
		</view>
		<view class="notice-bnt">
			<a @click="onShareBox">分享</a>
		</view>
		<view :class="'m-panel-sp ' + (shareBoxFlag==0?'hide':'') " @click.stop="closeNativeShare">
			<view :class="'m-panel-sp-content ' + (shareContetnFlag==0?'bounceOutDown animated':'bounceInUp animated')"
				@click.stop>
				<view class="page-body">
					<!-- #ifdef APP-PLUS -->
					<view class="btn-area" v-if="1">
						<block v-for="(value,index) in providerList" :key="index">
							<button type="primary" v-if="value" :disabled="shareType === 5 && value.name !== '分享到微信好友'"
								@tap="share(value)">{{value.name}}</button>
						</block>
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<view class="btn-area">
						<button type="primary" open-type="share">{{__('分享')}}</button>
					</view>
					<!-- #endif -->

					<view class="uni-icon uni-icon-closeempty m-panel-sp-icon" color="#888" @click="closeNativeShare">
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
		<share-box-mp :shareDataDefault="shareData" @cancelShare="cancelShare" @showCodeImg="showCodeImg"
			@shareQRCode="shareQRCode" @saveImg="saveImg" ref="shareBoxMp"></share-box-mp>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import shareBoxMp from '../../components/share-box-mp.vue'
	import shareBoxApp from '../../components/share-box-app.vue'
	import shareBoxH5 from '../../components/share-box-h5.vue'
	export default {
		name: "notice",
		data() {
			return {
				showPage: false,
				imageUrl: '',
				shareData: {
					shareText: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
					shareTitle: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
					href: "https://www.suteshop.com",
					image: '',
					price: 0
				},

				shareText: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
				shareTitle: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
				href: "https://www.suteshop.com",
				image: '',
				share_flag: !1,

				shareBoxFlag: 0,
				shareContetnFlag: 0,

				item_id: 0,
				shareType: 0,
				providerList: [],
				options: {},
				item_row: {
					product_name: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
					product_tips: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！',
					item_unit_price: '长乘学堂，支持原生App、微信小程序，邀请你一起体验！'
				}
			}
		},
		components: {
			shareBoxMp,
			shareBoxApp,
			shareBoxH5
		},
		onLoad: function(options) {
			this.options = options;
			let product_id = options.product_id
			let classes_id = options.classes_id
			this.item_id = options.item_id
			this.getAdmissionNotice(product_id, classes_id)
		},
		onBackPress: function() {
			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
				return true;
			}
			// #endif


			// #ifdef H5
			if (this.$refs.shareBoxH5.showBoxView) {
				this.$refs.shareBoxH5.cancel();
				return true;
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
				return true;
			}
			// #endif
		},
		onUnload() {

			// #ifdef APP-PLUS
			if (this.$refs.shareBoxApp.showBoxView) {
				this.$refs.shareBoxApp.cancel();
			}
			// #endif

			// #ifdef H5
			if (this.$refs.shareBoxH5.showBoxView) {
				this.$refs.shareBoxH5.cancel();
			}
			// #endif

			// #ifdef MP-WEIXIN
			if (this.$refs.shareBoxMp.showBoxView) {
				this.$refs.shareBoxMp.cancel();
			}
			// #endif
		},
		computed: {
			...mapState(['Config', 'userInfo']),
		},
		methods: {
			getAdmissionNotice(product_id, classes_id) {

				let that = this
				let params = {
					product_id: product_id,
					classes_id: classes_id,
				}
				that.$.request({
					url: that.Config.URL.edu.getAdmissionNotice,
					data: params,
					success: function(data, status, msg, code) {
						if (200 === status) {
							that.imageUrl = data.url
							that.item_row = data.item_row
							that.showPage = true
						}
					}
				});
			},


			onShareBox: function(e) {
				let that = this;
				var $href = that.$.sprintf('%s/tmpl/product_detail.html?item_id=%d&FX=%d', this.Config.WapSiteUrl, this
					.skuid, this.userInfo
					.user_id);

				$href = that.$.sprintf('%s/h5/edu/course/class-detail?product_id=%d&uid=%d&item_id=%d', that.Config.SiteUrl, that
					.options.product_id, this.userInfo.user_id, this.item_id);
				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS

				// #endif

				// #ifdef MP-WEIXIN
				$href = "/h5/edu/course/class-detail?product_id=" + that.options.product_id + "&uid=" + this.userInfo
					.user_id;
				// #endif

				this.setData({
					shareData: {
						shareTitle: this.item_row.product_name,
						shareText: this.item_row.product_tips,
						href: $href,
						image: this.url,
						price: this.number_format(this.item_row.item_unit_price, 2)
					}
				});

				// 如允许点击超链接跳转，则应该打开一个新页面，并传入href，由新页面内嵌webview组件负责显示该链接内容
				// #ifdef APP-PLUS
				this.$refs.shareBoxApp.show();
				// #endif

				//海报
				if (e == 3) {
					// #ifndef APP-PLUS
					this.$refs.shareBoxMp.show();
					// #endif
				} else {
					// #ifdef H5
					if (that.$.ifUniApp()) {
						this.$refs.shareBoxH5.show();
					} else {
						this.$refs.shareBoxMp.show();
					}
					// #endif
				}




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
	}
</script>

<style>
	page {
		background-color: #fff !important;
		min-height: 100% !important;
		height: 100% !important;
	}

	.notice-page {
		background-color: #FEC1B4;
	}

	.notice-page .notice-img {}

	.notice-page img {
		display: inline-block;
		width: 100%;
	}

	.notice-bnt {
		text-align: center;
		background-color: #FEC1B4;
		padding: 70rpx 0 200rpx;
	}

	.notice-bnt a {
		width: 90%;
		font-size: 18px;
		display: inline-block;
		text-decoration: none;
		color: #ffffff;
		padding: 20rpx 0;
		border-radius: 50px;
		background: linear-gradient(90deg, #FF6161 0%, #FF9661 100%);
	}
</style>

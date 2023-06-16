<template>
	<view class="page">
		<view class="row-space-around" v-if="MemberPostsList.length != 0">
			<view class="bg-gray-help margin-sm padding-lr-lg padding-tb-sm radius-xs" v-for="(item,index) in MemberPostsList" :key="index" @tap="videoJump(item.page_url)">
				<view class="liveIng" v-if="item.alive_state">
					<view class="liveIng-left">
						<image class="iconLive" :src="iconLive"></image>
						直播中
					</view>
					<view class="liveIng-right">
						{{item.view_num}}人
					</view>
					
				</view>
				<image class="videoChild" lazy-load :src="item.img_url" />
				<view class="liveTitle">{{item.title}}</view>
				
				<view class="item-info">
					<image :src="item.portraitUrl" mode="aspectFill" class="info-avatar" />
					<text class="item-name">{{item.teacherName}}</text>
				</view>
			</view>
		</view>
		<view class="m-loading-box">
			<noData v-if="MemberPostsList.length == 0" noDataText="暂无直播数据"></noData>
			<block v-else>
				<view class="u-loadmore u-loadmore-line">
					<text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	
	import dateUtil from "../../helpers/util_date";
	import { mapState, mapMutations } from 'vuex';
	import noData from '@/components/no-data/index.vue';
	export default {
		  components: {
			  noData
			},
		props:{
			page: {
			  type: Number,
			  default() {
			    return 1;
			  },
			},
			options: {
			  type: Object,
			  default() {
			    return {};
			  },
			},
		
		},
		data() {
			return {
				flag: !1,
				ispage: true,
				// page:1,
				MemberPostsList: [],
				is_loaded:!1,
				tidList:[],
				iconLive: `${getApp().globalData.qnUrl}/zc_images/findPage/live1.png`,
			};
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin','__', '$',]),
		
		created() {
			// this.getPostsList()
			this.getTeacherLiveList();
		},
		methods:{
			 ...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'getUserInfo']),
			getTeacherLiveList(page) {
					var that = this;
					let params = {
						tidList:[that.options.uid],
						pageNum:this.page,
						pageSize:10,
					}
					console.log("getTeacherLiveList-params", params)
					uni.request({
						url: that.Config.getTeacherLiveList,
						loading: false,
						method: 'POST',
						data: {
							tidList:[that.options.uid],
							pageNum:page,
							pageSize:10,
						},
						success: function(data, status) {
							// that.MemberPostsList = data.data.result.list;
						   that.setData({
							   MemberPostsList: that.MemberPostsList.concat(data.data.result.list),
							   ispage:false
							});
						console.log("getTeacherLiveList-data, status", data, data.data.result.list)
							
						},
						fail: () => {},
						complete: () => {
		
						},
					});
			},
			videoJump(url, state) {
				let zc_notitle = this.$FT.getUrlKey('zc_notitle', url)
				let webview_live = '/my/webview/webview_live';
				let webview = '/my/webview/webview';
				if (zc_notitle == 0) {
					this.openWebview(url);
				} else {
					this.webview_live(url);
				}

			},
			webview_live(urls) {
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				// #ifdef H5
				var e_uid = uni.getStorageSync('e_uid');
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						uni.showToast({
							icon: 'none',
							title: data,
						});
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							window.location.href = target;
						} else {
							window.location.href = urls;
						}
						// // #ifdef APP-PLUS
						// plus.runtime.openURL(target) //这里默认使用外部浏览器打开而不是内部web-view组件打开
						// // #endif
					},
				});
				// #endif
			
				//#ifdef APP-PLUS
				var e_uid = uni.getStorageSync('e_uid');
				console.log('getEUid=e_uid=', e_uid)
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						console.log('getEUid=xeLogin=', data)
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							uni.navigateTo({
								url: `/my/webview/webview_live?url=${target}`,
							});
						} else {
							uni.navigateTo({
								url: `/my/webview/webview_live?url=${urls}`,
							});
						}
					},
				});
				// #endif
			},
			openWebview(urls, path) {
				// console.log('openWebview-hasLogin', this.hasLogin);
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				// #ifdef H5
				var e_uid = uni.getStorageSync('e_uid');
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						uni.showToast({
							icon: 'none',
							title: data,
						});
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							window.location.href = target;
						} else {
							window.location.href = urls;
						}
						// // #ifdef APP-PLUS
						// plus.runtime.openURL(target) //这里默认使用外部浏览器打开而不是内部web-view组件打开
						// // #endif
					},
				});
				// #endif
			
				//#ifdef APP-PLUS
				var e_uid = uni.getStorageSync('e_uid');
				console.log('getEUid=e_uid=', e_uid)
				uni.request({
					method: 'POST',
					url: this.Config.xeLogin,
					data: {
						user_id: e_uid,
						redirect_uri: urls,
						login_type: 2,
					},
					success: function(data, status) {
						console.log('getEUid=xeLogin=', data)
						if (data.data.code == '0') {
							const target = data.data.result.login_url;
							console.log('getEUid=target=', target)
							uni.navigateTo({
								url: `/my/webview/webview?url=${target}`,
							});
						} else {
							uni.navigateTo({
								url: `/my/webview/webview?url=${urls}`,
							});
						}
					},
				});
				// #endif
			},
			goLive: function(e) {
				this.$emit('confirm', e);
			},
		}
	}
</script>

<style scoped  lang="scss">
	
	.page {
		background: rgba(247, 248, 252, 1);
	}
	/* 横向两端对齐,位于各行之前、之间、之后都留有空白的容器内 */
	.row-space-around {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		position: relative;
		/* #endif */
		flex-direction: row !important;
		flex-wrap:wrap !important;
/* 		justify-content: space-evenly; */
		background:rgba(247, 248, 252, 1);
		margin-left: 10rpx;
	}
	
	
	.radius-xs {
		/* padding:10upx; */
		width:358rpx;
		border-radius: 20upx;
		background-color: #fff;
		margin: 4upx;
		overflow: hidden;
		margin-bottom: 20rpx;
	}
	.videoChild{
		width:100%;
		height: 260rpx;
		object-fit: contain;
	}
	.lv-status {
		
/* 		height:50upx;
		width:120upx; */
		background-color: rgba(0, 0, 0, 0.4);
		border-radius: 50upx;
		color: #fff;
		font-size: 18upx;
		padding: 4upx 12upx;
		position: absolute;
		top: 20upx;
		left: 20upx;
		display: flex;
		flex-direction:row !important;
		/* #ifdef APP-PLUS-NVUE */
		padding-top:14upx;
		/* #endif */
		
	}
	
	.dot-gray {
		background-color: #ababab;
		border-radius: 50%;
		margin-right: 4upx;
		margin-top: 14upx;
		height: 12upx;
		width: 12upx;
		width: 12upx;
		/* #ifdef APP-PLUS-NVUE */
		margin-top: 4upx;
		/* #endif */
	}
	
	.dot {
		background-color: #ababab;
		border-radius: 50%;
		margin-right: 4upx;
		margin-top: 14upx;
		height: 12upx;
		width: 12upx;
		/* #ifdef APP-PLUS-NVUE */
		margin-top: 4upx;
		/* #endif */
	}
	
	.info-avatar {
		height: 50upx;
		width: 50upx;
		border-radius: 50upx;
	
	}
	.liveTitle{
		font-size: 32rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #101115;
		line-height: 45rpx;
		margin-left: 10upx;
	}
	.item-name {
		margin-left: 10upx;
		font-size: 24Rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #666666;
	}
	
	.item-info {
		width:300upx;
		display: flex;
		flex-direction:row !important;
		flex-wrap: wrap !important;
		align-items: center;
		overflow:hidden;
		padding-left: 15rpx;
		padding-top: 12rpx;
		padding-bottom: 30rpx;
	}
	
	.live-room-name {
		width:344upx;
	
		padding:10upx 6upx;
	}
	
	.room-name {
		overflow:hidden;
		text-overflow:ellipsis;  
		lines: 2;
		font-size: 24upx;
	}
	.u-loading {
		width:40upx;
		height:40upx;
		margin-left:220upx;
	}
	.u-loadmore-tips {
		/* #ifdef APP-PLUS-NVUE */
		width:400upx;
		margin-left:280upx;
		/* #endif */
	}
	.liveIng{
		width: 216rpx;
		height: 50rpx;
		background: #B6B6B6;
		background: linear-gradient(to right,transparent 30%,rgba(182, 182, 182, 1) 100%);
		background-color: transparent;
		border-radius: 25rpx;
		overflow: hidden;
		font-size: 22rpx;
		font-family: DINAlternate-Bold, DINAlternate;
		font-weight: bold;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		top:18rpx;
		left:15rpx;
	}
	.liveIng-left{
		width: 127rpx;
		height: 50rpx;
		background: #D8D8D8 linear-gradient(321deg, #F72424 0%, #FF6246 100%);
		border-radius: 100rpx 0rpx 100rpx 100rpx;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content:space-evenly;
	}
	.liveIng-right{
		width: 40%;
		text-align: center;
	}
	.iconLive{
		width: 20rpx;
		height: 27rpx;
	}
	::v-deep .no-data{
		background-color: #FFFFFF;
		 .no-data-icon{
			mrgin-top: 0;
			margin-bottom: 0; 
		 }
	}
</style>

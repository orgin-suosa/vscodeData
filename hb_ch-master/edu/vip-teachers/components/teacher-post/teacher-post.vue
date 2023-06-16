<template>
	<view style="width: 100%;height: auto;" class="post-view">
		<view class="rmtz_box_content_box" v-for="(item, i) in PostsList" :key="i">
			<view class='box_title_img'>
				<image class='box_title_image' :src="item.user_avatar"></image>
			</view>
			<view style="display: flex;justify-content: space-between;min-width: 600upx;">
				<view style="padding-top: 20upx;">
					<view class='box_title_name'>{{item.user_nickname}}</view>
					<view class='box_title_name_time'>发布于{{item.story_time_str}}</view>
				</view>
				<view v-if="IsLoginUser && tapindex != 2 && !item.story_enable">
					<image class="examine" src="https://qnsp.zcskjy.com/zc_images/findTools/examine.png"></image>
				</view>
			</view>
			<view class="rmtz_box_content_box2">
				<navigator :url="'/community/community/detail?id=' + item.story_id">
					<view class="rmtz_box_content_box_text text-over2">
						<span>{{ item.story_title || item.comment_content }}</span></view>
					<view class="rmtz_box_content_box_content">{{item.story_content}}</view>
				</navigator>
				<block v-if="item.story_title">
					<navigator :url="'/community/community/video?id=' + item.story_id" v-if="item.story_type == 4">
						<view class="">
							<view :data-url="item.ImgPath" class="rmtz_box_content_Img"
								:style="'background: url(' + item.story_file[0] + ') center no-repeat ;background-size:cover;'">
							</view>
						</view>
					</navigator>

					<navigator :url="'/community/community/detail?id=' + item.story_id" v-if="item.story_type != 4">
						<view class="" v-if="item.story_file[0]">
							<view :data-url="item.ImgPath" class="rmtz_box_content_Img"
								:style="'background: url(' + item.story_file[0] + ') center no-repeat ;background-size:cover;'">
							</view>
						</view>
					</navigator>
				</block>
				<!-- 点赞评论小图标 -->
				<view class="pldz_box">
					<view class="rmtz_box_content_box_dz">
						<image class="dz" src="https://qnsp.zcskjy.com/zc_images/findTools/eye.png"></image>
						<span>{{ item.story_collection_count }}</span>
					</view>
					<button hover-class="none" style="padding-left: 22upx" v-if="item.IsFabulous == 1"
						class="rmtz_box_content_box_pl" :data-story_id="item.story_id" open-type="getUserInfo"
						lang="zh_CN" @click="onUnLike">
						<image class="pl" src="https://static.shopsuite.cn/xcxfile/appicon/img/side1_03.png"></image>
						<span style="font-size: 12px">{{ item.story_like_count }}</span>
					</button>
					<button hover-class="none" style="padding-left: 22upx" class="rmtz_box_content_box_pl" v-else
						:data-story_id="item.story_id" open-type="getUserInfo" lang="zh_CN" @click="onLike">
						<image class="pl" src="https://static.shopsuite.cn/xcxfile/appicon/img/side1_05.png"></image>
						<span style="font-size: 12px">{{ item.story_like_count }}</span>
					</button>
					<view class="rmtz_box_content_box_pl">
						<image class="pl" src="https://qnsp.zcskjy.com/zc_images/findTools/pinglun.png"></image>
						<span style="font-size: 12px; color: #959593">{{ item.story_comment_count }}</span>
					</view>

					<view v-if="IsLoginUser && tapindex != 2" class="rmtz_box_content_box_sc" :data-id="item.story_id"
						@tap="DeleteMemberPosts">
						<image class="sc" src="https://static.shopsuite.cn/xcxfile/appicon/img/yhkj_10.png"></image>
					</view>
					<!-- <view v-if="IsLoginUser && tapindex != 2 && !item.story_enable" class="rmtz_box_content_box_sc" :data-id="item.story_id">
	        <label>待审核</label>
	      </view> -->
				</view>
			</view>

			<block v-if="!item.story_title">
				<span style="color: gray">
					{{ __('帖子已经删除') }}
				</span>
			</block>
		</view>
        
		<view v-if="PostsList.length == 0" style="margin-top: 200rpx;;display: flex;flex-direction: column;align-items: center;justify-content: center;">
			<noData noDataText="暂未发布观点"  ></noData>
		</view>
	    
		<view class="m-loading-box">
			<block v-if="ispage">
				<view class="u-loadmore">
					<label class="u-loading"></label>
					<text class="u-loadmore-tips">{{ __('正在加载') }}</text>
				</view>
				<view>
					<text></text>
					<canvas />
				</view>
			</block>
			<!-- <block v-else>
	    <view class="u-loadmore u-loadmore-line">
	      <text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
	    </view>
	  </block> -->
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import dateUtil from "@/helpers/util_date.js";
    import noData from '@/components/no-data/index.vue';
	export default {
		props:{
			teacherId:{
				type: String,
				defalut: ''
			}
		},
		components: {
			noData
		},
		data() {
			return {
				PostsList: [],
				scrollTop: 0,
				scposition: -1,
				oldscposition: 0,
				isquicknav: !1,
				opacity: 0,
				flag: !1,
				background: 'f1f1f1',
				user_sign: '',
				screenHeight: 0,
				IsLoginUser: !1,
				xgqy: 1,
				page:1,
				isdata: !1,
				ispage: !1,
				isnav: !0,
				animation: !0,
				initX: '690',
				initY: '1336',
				timer: null,
				videoUrlList: '',
				shareData: {},
				email: `${getApp().globalData.qnUrl}/zc_images/community/email.png` + this.$FT.versionKey(),
				love: `${getApp().globalData.qnUrl}/zc_images/findTools/love.png` + this.$FT.versionKey(),
				emailWhite: `${getApp().globalData.qnUrl}/zc_images/community/email-white.png` + this.$FT.versionKey(),
				WXshare: `${getApp().globalData.qnUrl}/zc_images/WXshare.jpg` + this.$FT.versionKey(),
				spaceBg: `${getApp().globalData.qnUrl}/zc_images/images/spaceBg.png` + this.$FT.versionKey(),
				navbarColor: '#ffffff',
				navbarRgba: 'rgba(255, 255, 255,0)',
				navbartitle: '',
				iconV: `${getApp().globalData.qnUrl}/zc_images/community/icon_v.png` + this.$FT.versionKey(),
				totalOrderStatus: true,
				totalDiscountPrice: '--',
				totalOriginalPrice: '',
				productId: '',
				itemId: '',
				buttonList: [{
					text: '开通私人定制',
				}],
				lectureList: [],
				isPosting: false, // 是否可以发帖
				isChat: false, // 是否可以私信
				// teacherId:''
			}
		},
		
		
		created() {
			
			this.GetMemberPostsByUserId(this.teacherId)
			// this.GetMemberPostsByUserId('20220')
		},
		// 函数
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		methods: {
			
			loadRefresh(itemId) {
				console.info('--teacher----loadRefresh-----');
				this.page = 1;
				// this.teacherId = itemId;
				this.GetMemberPostsByUserId(itemId);
			},
			loadmore(itemId) {
				this.page += 1;
				// this.teacherId = itemId;
				this.GetMemberPostsByUserId(itemId);
			},
			
			DeleteMemberPosts: function(a) {
				var that = this;
				if (0 == that.tapindex) {
					var params = {
						story_id: a.currentTarget.dataset.id
					};
					that.$.confirm(
						that.__('是否删除帖子?'),
						function(a) {
							if (a.confirm) {
								that.$.request({
									url: that.Config.URL.sns.story_remove,
									data: params,
									success: function(data, status, msg, code) {
										console.log("删除帖子", data)
										if (200 == status) {
											// that.setData({ PostsList: [] });
											that.GetUserSpace();
											that.GetMemberPostsByUserId();
										} else {}
									},
								});
							}
						},
						!0,
					);
				} else {
					params = {
						userId: that.userInfo.user_id,
						story_id: a.currentTarget.dataset.id,
						operateId: that.cf.storeId,
					};

					that.$.confirm(
						that.__('是否取消收藏帖子?'),
						function(a) {
							if (a.confirm) {
								that.$.request({
									url: that.Config.URL.sns.story_collection_remove,
									data: params,
									success: function(data, status, msg, code) {
										console.log("删除-success：", data, status, msg, code)
										if (200 == status) {
											that.setData({
												PostsList: []
											});
											//先注销
											// that.loaddata();
										} else {
											// that.$.alert(msg);
										}
									},
									fail: function(ata, status, msg, code) {
										console.log("删除-fail：", msg)
									}
								});
							}
						},
						!0,
					);
				}
			},
			
			getPostsList: function() {
				
				let that = this;
				var params = {
					page: this.page
				};

				that.$.request({
					url: this.Config.URL.sns.story_lists,
					data: params,
					success: function(data, status, msg, code) {
						if (data.items.length > 0) {
							for (var r = 0; r < data.items.length; r++) {
								data.items[r]['story_time_str'] = dateUtil.dateUtils.format(that.$
									.datetimeFormatter(data.items[r]['story_time']));
							}

							if (data.page >= data.total) {
								that.setData({
									PostsList: that.PostsList.concat(data.items),
									flag: !1,
									ispage: !1,
								});
							} else {
								that.setData({
									PostsList: that.PostsList.concat(data.items),
									flag: !0,
									ispage: !0,
								});
							}
						} else {
							that.setData({
								flag: !1,
								ispage: !1
							});
						}

						that.$.stopPullDownRefresh();
						that.$.hideLoading();
					},
				});
			},
		
			GetMemberPostsByUserId(uid) {
				var that = this,
					params = {
						user_id: uid,
						page: that.page,
						sidx: 'story_time',
						sord: 'DESC'
					};
				1 == that.page && that.setData({
					PostsList: []
				});
                 
				console.info('-----PostsByUserId-----',params); 
				that.$.request({
					url: this.Config.URL.sns.user_story,
					data: params,
					success: function(data, status, msg, code) {
						uni.stopPullDownRefresh();
						// console.info('--PostsByUserI----info----data---',data);
						if (data.items.length > 0) {
							for (var r = 0; r < data.items.length; r++) {
								data.items[r]['story_time_str'] = dateUtil.dateUtils.format(that.$
									.datetimeFormatter(data.items[r]['story_time']));
							}

							if (data.page >= data.total) {
								that.setData({
									PostsList: that.PostsList.concat(data.items),
									flag: !1,
									ispage: !1,
									isdata: !1,
								});
							} else {
								that.setData({
									PostsList: that.PostsList.concat(data.items),
									flag: !0,
									ispage: !0,
									isdata: !1,
								});
							}
							
							// uni.showToast({
							// 	icon:'none',
							// 	title:'暂无更多数据了！'
							// })
							
						} else {
						
							that.setData({
								flag: !1,
								ispage: !1,
								isdata: !1,
							});
						}
					},
				});
			},
			onLike: function(a) {
				let that = this;
				that.forceUserInfo(function(user) {
					that.dianzan(a.currentTarget.dataset.story_id);
				});
			},
			dianzan: function(story_id) {
				var that = this,
					params = {
						story_id: story_id,
					};

				that.$.request({
					url: this.Config.URL.sns.story_like_add,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							//that.getPostsList()

							//修正当前记录数据
							for (var r = 0; r < that.PostsList.length; r++) {
								if (story_id == that.PostsList[r]['story_id']) {
									that.PostsList[r]['IsFabulous'] = 1;
								}
							}
						} else {}
					},
				});
			},
			onUnLike: function(a) {
				let that = this;
				that.forceUserInfo(function(user) {
					that.canceldianzan(a.currentTarget.dataset.story_id);
				});
			},
			canceldianzan: function(story_id) {
				var that = this,
					params = {
						story_id: story_id,
					};

				that.$.request({
					url: this.Config.URL.sns.story_like_remove,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							//修正当前记录数据
							for (var r = 0; r < that.PostsList.length; r++) {
								if (story_id == that.PostsList[r]['story_id']) {
									that.PostsList[r]['IsFabulous'] = 0;
								}
							}
						} else {}
					},
				});
			},
			GetCommentPostsByUserId(uid) {
				var that = this;
				let params = {
					user_id: uid,
					page: that.page
				};
				1 == that.page && that.setData({
					PostsList: []
				});

				that.$.request({
					url: this.Config.URL.sns.user_comment_story,
					data: params,
					success: function(data, status, msg, code) {
						if (data.items.length > 0) {
							for (var r = 0; r < data.items.length; r++) {
								data.items[r]['story_time_str'] = dateUtil.dateUtils.format(that.$
									.datetimeFormatter(data.items[r]['story_time']));
							}

							if (that.page >= data.total) {
								that.setData({
									PostsList: that.PostsList.concat(data.items),
									flag: !1,
									ispage: !1,
									isdata: !1,
								});
							} else {
								that.setData({
									PostsList: that.PostsList.concat(data.items),
									flag: !0,
									ispage: !0,
									isdata: !1,
								});
							}
						} else {
							that.setData({
								flag: !1,
								ispage: !1,
								isdata: !1,
							});
						}
					},
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.rmtz_box_title {
		width: 750rpx;
		height: 86rpx;
	}

	.rmtz_box {
		background-color: #f6f6f6;
		padding: 20rpx 0 0 0;
	}

	.rmtz_box_content_box2 {
		// width: 520rpx;
		// float: left;
		margin-left: 94upx;
	}

	.rmtz_box_content_img {
		width: 171rpx;
		height: 171rpx;
		float: right;
	}

	.rmtz_box_content_Img {
		width: 171rpx;
		height: 171rpx;
		// margin-left: 14rpx;
	}

	.rmtz_box_content_box {
		background-color: #fff;
		padding: 27rpx 23rpx;
		// height: 171rpx;
		position: relative;
		// margin-left: 121upx;
		// display: flex;
	}

	.rmtz_box_content_box_text {
		width: 506rpx;
		font-size: 36upx;
		font-weight: 500;
		color: #333333;
		// float: left;
		// height: 101rpx;
	}

	.rmtz_box_content_box_content {
		font-size: 28upx;
		font-weight: 400;
		color: #666666;
	}

	.rmtz_box_content_box_dz {
		float: left;
		padding-right: 20rpx;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
	}

	.rmtz_box_content_box_dz span {
		padding: 0 10rpx;
	}

	.rmtz_box_content_box_pl span {
		padding: 0 10rpx;
	}

	.rmtz_box_content_box_pl {
		float: left;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
	}

	.rmtz_box_content_box_sc {
		float: left;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		padding-left: 20rpx;
	}

	.xx {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		width: 40rpx;
		height: 40rpx;
	}

	// .text-over2::after {
	//   content: " ";
	//   position: absolute;
	//   left: 30rpx;
	//   top: 168rpx;
	//   right: 0rpx;
	//   height: 1px;
	//   border-top: 1px solid red;
	//   color: #d9d9d9;
	//   -webkit-transform-origin: 0 0;
	//   transform-origin: 0 0;
	//   -webkit-transform: scaleY(0.5);
	//   transform: scaleY(0.5);
	// }

	.commentaries2 {
		padding: 22rpx 30rpx;
		position: relative;
	}

	.time_box_dz {
		width: 136rpx;
		height: 100rpx;
		line-height: 123rpx;
		/* float: left */
	}

	.time_box_dz_img2 {
		width: 37rpx;
		height: 40rpx;
		margin-top: 17rpx;
		margin-left: 20rpx;
	}

	.time_box_dz_img {
		width: 37rpx;
		height: 40rpx;
		margin-top: 1rpx;
		margin-left: 90rpx;
	}

	.time_box_fx_img {
		width: 30rpx;
		height: 35rpx;
		margin-left: 65rpx;
	}

	.dz {
		width: 35rpx;
		height: 35rpx;
		vertical-align: text-top;
	}

	.pl {
		width: 35rpx;
		height: 35rpx;
		vertical-align: text-top;
	}

	.sc {
		width: 28rpx;
		height: 33rpx;
		vertical-align: text-top;
	}

	.rmtz_box_content_box_dz {
		float: left;
		padding-right: 20rpx;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
	}

	.rmtz_box_content_box_dz span {
		padding: 0 10rpx;
	}

	.rmtz_box_content_box_pl span {
		padding: 0 10rpx;
	}

	.rmtz_box_content_box_pl {
		float: left;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
	}

	// .pldz_box::before {
	//   content: " ";
	//   position: absolute;
	//   left: 30rpx;
	//   top: 219rpx;
	//   right: 0rpx;
	//   height: 1px;
	//   border-top: 1px solid #d9d9d9;
	//   color: #d9d9d9;
	//   -webkit-transform-origin: 0 0;
	//   transform-origin: 0 0;
	//   -webkit-transform: scaleY(0.5);
	//   transform: scaleY(0.5);
	// }

	.pldz_box {
		// float: left;
		color: #828282;
		font-size: 28rpx;
		height: 32rpx;
		position: relative;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		// justify-content: space-around;
		-webkit-box-align: center;
		-webkit-align-items: center;
		align-items: center;
		padding-top: 37rpx;
	}

	.tobar::before {
		content: " ";
		position: absolute;
		left: 30rpx;
		top: 0rpx;
		right: 0rpx;
		height: 1px;
		border-left: 1px solid #d9d9d9;
		color: #d9d9d9;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.box_title_guanzhu_text {
		top: 20rpx;
		right: 0;
		/* padding: 0rpx 30rpx; border-radius: 35rpx; background-color: #db384c; text-align: center; color: #fff; font-size: 30rpx; line-height: 59rpx; align-content: center;*/
		position: absolute;
		padding: 15rpx 0rpx;
		/* line-height: 56rpx; */
		border-radius: 35rpx 0 0 35rpx;
		margin-top: 49rpx;
		background-color: #db384c;
		color: #fff;
		font-size: 25rpx;
		align-content: center;
		align-items: center;
		text-align: center;
		width: 144rpx;
	}

	.xgqm_input {
		width: 300px;
		height: 38rpx;
		margin: 0;
		border: 1rpx solid #d9d9d9;
		border-radius: 30rpx;
		color: white;
		margin-top: -9rpx;
		margin-left: 17rpx;
		padding-left: 10rpx;
	}

	navigator {}

	.u_top {
		width: 80rpx;
		height: 80rpx;
	}

	.m-orderlist {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	@keyframes mymove1 {
		from {
			bottom: 120rpx;
			opacity: 0;
		}

		to {
			bottom: 520rpx;
			opacity: 1;
		}
	}

	@keyframes mymove2 {
		from {
			bottom: 120rpx;
			opacity: 0;
		}

		to {
			bottom: 420rpx;
			opacity: 1;
		}
	}

	@keyframes mymove3 {
		from {
			bottom: 120rpx;
			opacity: 0;
		}

		to {
			bottom: 320rpx;
			opacity: 1;
		}
	}

	@keyframes mymove4 {
		from {
			bottom: 120rpx;
			opacity: 0;
		}

		to {
			bottom: 220rpx;
			opacity: 1;
		}
	}

	@keyframes mymove5 {
		from {
			bottom: 520rpx;
			opacity: 1;
		}

		to {
			bottom: 110rpx;
		}
	}

	@keyframes mymove6 {
		from {
			bottom: 420rpx;
			opacity: 1;
		}

		to {
			bottom: 110rpx;
			opacity: 0;
		}
	}

	@keyframes mymove7 {
		from {
			bottom: 320rpx;
			opacity: 1;
		}

		to {
			bottom: 110rpx;
			opacity: 0;
		}
	}

	@keyframes mymove8 {
		from {
			bottom: 220rpx;
			opacity: 1;
		}

		to {
			bottom: 110rpx;
			opacity: 0;
		}
	}

	.box_title_img {
		width: 75upx;
		height: 75upx;
		padding: 25upx 17upx 15upx 0upx;
		float: left;
		display: inline-block;
	}

	.box_title_image {
		width: 73upx;
		height: 73upx;
		border-radius: 100%;
		overflow: hidden;
	}

	.box_title_name {
		font-size: 30upx;
		font-weight: 500;
		color: #333333;
	}

	.box_title_name_time {
		// position: absolute;
		// top: 41upx;
		// left: 93upx;
		// min-width: 200upx;
		// line-height: 95upx;
		/* float: left; */
		color: #959593;
		font-size: 22upx;
		font-weight: 400;
		color: #999999;
	}

	.examine {
		width: 100upx;
		height: 100upx;
		margin-top: 19upx;
		margin-right: 25upx;
	}
</style>

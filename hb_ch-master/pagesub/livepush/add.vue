<template>
	<view>
		<block v-if="isAuth">
			<view class='form-box'>
				<view class='form-item'>
					<view class='form-title'>{{__('房间名称')}}</view>
					<input :placeholder='__("请输入房间名称（必填）")' name='' maxlength='20' v-model="liveRoomName"></input>
				</view>
				<view class='form-item' v-if="false">
					<view class='form-title'>{{__('房间密码')}}</view>
					<input :placeholder='__("请输入房间密码（选填）")' maxlength='12' type='number' v-model='roomPassword'></input>
				</view>
				<view class='form-item' v-if="false">
					<view class='form-title'>{{__('连麦权限')}}</view>
					<radio-group class="radio-group"><label class="radio" @tap='setMicrophone'>
							<view :class='"radioicon "  +  (isMicrophone?"checked":"")'></view>
							<radio />
							{{__('允许')}}
						</label><label class="radio" @tap='setMicrophone'>
							<view :class='"radioicon " +  (!isMicrophone?"checked":"")'></view>
							<radio />
							{{__('不允许')}}
						</label></radio-group>
				</view>

				<view class='form-item' v-if="live_virtual_click_enable">
					<view class='form-title'>{{__('虚拟观看数')}}</view>
					<input :placeholder='__("虚拟观看数（为0则表述不设置）")' name='' maxlength='20'
						v-model="live_virtual_click_num"></input>
				</view>

				<view class='form-item' v-if="live_virtual_like_enable">
					<view class='form-title'>{{__('虚拟人气数')}}</view>
					<input :placeholder='__("虚拟人气数（为0则表述不设置）")' name='' maxlength='20'
						v-model="live_virtual_like_num"></input>
				</view>
				<view class="form-item" style="padding-top: 0;margin-bottom: 0;">
					<view class='form-title'>{{__('房间海报')}}</view>
					<view style="float: left;">
						<view style="position: relative;">
							<image lazy-load mode="widthFix" :src="(room_poster)" @click="ImgTap"
								style="width: 120rpx;"></image>
							<view v-if="true" class="up-img-btn" @click.stop="upImgs">
								更换
							</view>
						</view>
					</view>
				</view>
				<view style='background-color:#f6f6f6;padding:20upx 0 0upx 0;'>
					<view class='bk_box'>
						<view class='bk_box_title'><span>{{__('推荐商品')}}</span></view>
						<view class='pic_box_pic'>
							<view style='display: inline-block;'>
								<view style='display: inline-block;'>
									<view class='pic_box_image'
										:style='"background: url(" + item.product_image + ") center no-repeat ;background-size:cover;"'
										v-for="(item, index) in shopback" :key="index">
										<view @tap='delshopImg' class='shanchu' :data-index='item.item_id'
											style='bottom:0upx;margin:0'><label class="iconfont icon-delete"
												data-id="item.item_id" data-index="index" style='color:#fff'></label>
										</view>
									</view>
									<image @tap='shopsearch' class='pic_box_image'
										src='https://static.shopsuite.cn/xcxfile/appicon/img/pic_11.png'
										v-if="shopback.length < live_product_bind_num"></image>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view style='background-color:#f6f6f6;padding:20upx 0 0upx 0;'>
					<view class='bk_box' v-if="false">
						<view class='bk_box_title'><span>{{__('直播标签')}}</span></view>
						<view class='pic_box_pic'>
							<robby-tags v-model="tagList" @add="addTag" @delete="delTag" :enable-del="enableDel"
								:enable-add="enableAdd"></robby-tags>
						</view>
					</view>
				</view>

				<view class='form-item border-box' v-if="false">
					<view class='form-title no-border'>选择直播模式</view>
					<view class='radio-box'>
						<view :class='"radio-item " + livePattern==1?"ck-radio":""' data-type="1" @tap='setLivePattern'>
							<image src='http://appicon-1253690476.file.myqcloud.com/icon/live_1_1.png'></image>
							<view class='radio-title'>视频模式</view>
						</view>
						<view :class='"radio-item " +  livePattern==2?"ck-radio":""' data-type="2"
							@tap='setLivePattern'>
							<image src='http://appicon-1253690476.file.myqcloud.com/icon/live_1_2.png'></image>
							<view class='radio-title'>纯音频模式</view>
						</view>
					</view>
				</view>
			</view>
			<view class='form-btn' @tap='submit'>{{__('立即创建')}}</view>
		</block>
		<block v-else>
			<view class='null_data'>{{__('还没有直播权限')}}╮(╯▽╰)╭
			</view>
		</block>

	</view>
</template>


<script>
	import diy from '../../components/themes/diy.vue'
	import dateUtil from "../../helpers/util_date";
	import statusBar from '../../components/status-bar.vue'
	import robbyTags from '../../components/robby-tags.vue';

	import {
		mapState,
		mapMutations
	} from 'vuex'
	import $ from "../../helpers/util";

	export default {
		data: function() {
			return {
				liveRoomName: "",
				roomPassword: "",
				livePattern: 1,
				isAuth: !1,
				isMicrophone: !0,

				live_enable: 1,
				room_enable: 0,
				live_virtual_click_enable: 1,
				live_virtual_like_enable: 1,
				live_product_bind_num: 10,

				live_virtual_click_num: 0,
				live_virtual_like_num: 0,
				live_push_mode: 'HD',
				puid: 0,
				zid: 0,

				shopback: [],

				enableDel: true,
				enableAdd: true,
				colorType: 'primary',
				tagList: [],
				room_poster: ''
			}
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		components: {
			diy,
			robbyTags,
			statusBar
		},
		onLoad: function(options) {
			uni.setNavigationBarTitle({
				title: this.__('创建直播间')
			});

			let that = this;
			this.notice.addNotification("RefreshCoupon", this.RefreshCoupon, this);


			this.forceUserInfo((user) => {
				if (user) {
					that.GetLiveUserPrivileges()
				}
			});
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {

			let that = this;
			this.notice.removeNotification("RefreshCoupon", that);
		},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {

		},

		/**
		 * 页面滚动触发事件的处理函数
		 */
		onPageScroll: function() {},

		methods: {
			...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getStoreInfo']),
			setLivePattern: function(e) {
				this.setData({
					livePattern: e.currentTarget.dataset.type
				})
			},
			submit: function() {
				let that = this;
				if (this.liveRoomName.length) {
					let item_id_row = []

					for (var s = 0; s < that.shopback.length; s++) {
						item_id_row.push(that.shopback[s].item_id);
					}

					let param = {
						room_name: this.liveRoomName,
						room_pattern: this.livePattern,
						room_pwd: this.roomPassword,
						room_is_microphone: this.isMicrophone ? 0 : 1,
						item_ids: JSON.stringify(item_id_row),
						//live_tag_name: JSON.stringify(this.tagList),

						live_virtual_click_num: this.live_virtual_click_num,
						live_virtual_like_num: this.live_virtual_like_num,
						live_push_mode: this.live_push_mode,
						room_poster: this.room_poster,

						puid: this.puid,
						zid: this.zid,
					};

					that.$.request({
						url: that.Config.URL.live.saveRoom,
						data: param,
						success: function(data, status, msg, code) {
							if (status == 200) {
								wx.redirectTo({
									url: "/pagesub/uLive/subnvue/push?type=presenter&url=" +
										encodeURIComponent(data.room_push_url) +
										"&pattern=" + param.room_pattern + "&roomName=" + param
										.room_name + "&roomid=" + data.room_id +
										"&mick=" + param.room_is_microphone +
										"&mode=" + param.live_push_mode +
										"&puid=" + param.puid +
										"&zid=" + param.zid
								})
							} else {
								wx.showToast({
									title: msg,
									icon: "none"
								})
							}
						}
					});
				} else {
					wx.showToast({
						icon: "none",
						title: that.__('请输入房间名称！')
					})
				}
			},

			ImgTap: function(e) {
				var that = this,
					urls = [];
				var s = this.room_poster;
				urls.push(this.room_poster);
				that.$.previewImage({
					current: s,
					urls: urls
				});
			},

			upImgs: function(e) {
				var that = this;
				let ukey = uni.getStorageSync('ukey');

				that.$.chooseImage({
					count: 1,
					sizeType: ["compressed"],
					success: function(n) {
						that.$.showLoading();
						var r = n.tempFilePaths;
						that.$.uploadFile({
							url: that.Config.URL.upload,
							method: "POST",
							filePath: r[0],
							name: "upfile",
							formData: {'perm_key':ukey},
							success: function(n) {
								that.$.hideLoading();

								var up_res = that.$.parseJSON(n.data);

								if (up_res.status == 200) {
									var s = up_res.data.url;

									that.room_poster = s
									that.$forceUpdate();
								} else {
									that.$.confirm(up_res.msg || that.__('发生错误'));
								}
							},
							fail: function(e) {
								that.$.hideLoading()
							},
							complete: function(e) {
								that.$.hideLoading()
							}
						})
					},
					fail: function(e) {
						that.$.hideLoading()
					},
					complete: function(e) {
						that.$.hideLoading()
					}
				})
			},

			GetLiveUserPrivileges: function(t) {
				var that = this,
					param = {};

				that.$.request({
					url: that.Config.URL.live.checkPerm,
					data: param,
					success: function(data, status, msg, code) {
						if (status == 200) {
							that.setData({
								isAuth: !0,
								liveRoomName: data.room_name,
								roomPassword: data.room_pwd,
								isMicrophone: data.room_is_microphone,
								livePattern: data.room_pattern,
								tagList: data.live_tag_name,
								shopback: data.product_item_rows,
								live_enable: data.live_enable,
								room_enable: data.room_enable,
								live_virtual_click_enable: data.live_virtual_click_enable,
								live_virtual_like_enable: data.live_virtual_like_enable,
								live_product_bind_num: data.live_product_bind_num,
								live_virtual_click_num: data.live_virtual_click_num,
								live_virtual_like_num: data.live_virtual_like_num,
								live_push_mode: data.live_push_mode,
								puid: data.puid,
								zid: data.zid,
								room_poster: data.room_poster,
							})

							if (that.live_enable) {
								if (that.room_enable) {

								} else {
									that.$.confirm({
										title: '',
										content: that.__('尚无直播权限！'),
										success: function(res) {
											uni.navigateBack({
												delta: 1
											})
											if (res.confirm) {} else if (res.cancel) {

											}
										}
									});
								}
							} else {
								that.$.confirm({
									title: '',
									content: that.__('平台未开启直播！'),
									success: function(res) {
										uni.navigateBack({
											delta: 1
										})
										if (res.confirm) {} else if (res.cancel) {

										}
									}
								});
							}
						} else {
							wx.showToast({
								icon: "none",
								title: msg
							})
						}
					}
				});
			},
			setMicrophone: function() {
				this.setData({
					isMicrophone: !this.isMicrophone
				})
			},


			RefreshCoupon: function(t) {
				if (0 == this.shopback.length) {
					this.setData({
						shopback: t.couponItemId
					});
				} else {
					var a = [];
					a = this.shopback;
					for (var s = 0; s < a.length; s++) {
						for (var o = 0; o < t.couponItemId.length; o++) {
							a[s].item_id == t.couponItemId[o].item_id && a.splice(s, 1);
						}
					}
					for (o = 0; o < t.couponItemId.length; o++) {
						a.push(t.couponItemId[o]);
					}

					console.info(a)
					this.setData({
						shopback: a
					})
				}
			},

			shopsearch: function() {
				var that = this
				that.$.navigateTo({
					url: "/community/community/searchsq?num=" + (this.live_product_bind_num - this.shopback
						.length)
				})
			},

			delshopImg: function(s) {
				var that = this;
				that.$.confirm(that.__("是否放弃选择该商品?"), function(t) {
						if (t.confirm) {
							var a = s.target.dataset.index;
							that.shopback.splice(a, 1), that.setData({
								shopback: that.shopback
							})
						}
					},
					!0)
			},

			clickTag: function(e) {
				//console.info(this.tagList)
				console.log(e)
			},
			delTag: function(e) {
				//console.info(this.tagList)
				console.log(e)
			},
			addTag: function(e) {
				//console.info(this.tagList)
				console.log(e)
			}
		}
	};
</script>


<style lang="scss">
	@import '../../styles/_variables.scss';

	.form-box {
		display: flex;
		flex-direction: column;
	}

	.form-item {
		display: flex;
		background-color: #fff;
		padding: 20rpx;
		font-size: 28rpx;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.form-title {
		flex-shrink: 0;
		width: 200rpx;
	}

	.form-item input {
		flex: 1;
	}

	.radio-group {
		display: flex;
		flex: 1;
	}

	.radio-group .radio {
		display: flex;
		align-items: center;
	}

	.radio-group .radio:first-child {
		margin-right: 70rpx;
	}

	.radio-group .radio .radioicon {
		width: 30rpx;
		height: 30rpx;
		background-image: url(http://appicon-1253690476.file.myqcloud.com/auth/live_1_3.png);
		background-size: cover;
		margin-right: 10rpx;
	}

	.radio-group .checked {
		background-image: url(http://appicon-1253690476.file.myqcloud.com/auth/live_1_4.png) !important;
		background-size: cover;
		width: 30rpx;
		height: 30rpx;
	}

	.radio-group .radio radio {
		display: none;
	}

	.border-box {
		flex-direction: column;
		border-bottom: 1rpx solid #f8f8f8;
		align-items: flex-start;
	}

	.border-box .form-title {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f8f8f8;
	}

	.radio-box {
		display: flex;
		width: 100%;
	}

	.radio-item {
		display: flex;
		flex-direction: column;
		flex: 1;
		justify-content: center;
		align-items: center;
		padding: 20rpx 0;
	}

	.radio-item image {
		width: 60rpx;
		height: 60rpx;
	}

	.radio-title {
		color: #9B9B9B;
		border: 1rpx solid #9B9B9B;
		border-radius: 8rpx;
		padding: 11rpx 28rpx;
		margin-top: 20rpx;
	}

	.form-btn {
		width: 90%;
		margin: 10rpx auto 60rpx auto;
		background-color: #db384c;
		color: #fff;
		padding: 20rpx 0;
		border-radius: 8rpx;
		font-size: 32rpx;
		text-align: center;
	}

	.ck-radio .radio-title {
		border: 1rpx solid #DB384C;
		color: #DB384C;
	}

	.null_data {
		display: flex;
		justify-content: center;
		font-size: 28rpx;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		align-items: center;
		color: #888;
	}

	.null_data navigator {
		color: #db384c;
		text-decoration: underline;
	}

	.no-border {
		border: none !important;
	}






	page {
		background-color: #fff;
	}

	.box {
		width: 100%;
	}

	.box_text {
		width: 700upx;
		margin: 30upx 25upx 35upx 25upx;
		position: relative;
		color: #333;
	}

	.textarea {
		width: 690upx;
		height: 227upx;
		display: block;
		position: relative;
		word-wrap: break-word;
		word-break: break-all;
		font-size: 30upx;
		color: #333;
	}

	.pic_box {
		margin: 24upx 27upx;
		display: flex;
	}

	.pic_box_img {
		width: 100%;
	}

	.pic_box_image {
		width: 154upx;
		height: 154upx;
		margin: 0 10upx;
		overflow: hidden;
		display: inline-block;
		position: relative;
	}

	.pic_box_pic {
		padding: 24upx 27upx;
	}

	.btn_box {
		margin-top: 110upx;
		text-align: center;
		display: flex;
	}

	.u-btn-default {
		width: 566upx;
		margin: 0 92upx;
	}

	.box_title {
		padding: 0 25upx;
		height: 81upx;
		color: #000;
	}

	.box_title::before {
		content: " ";
		position: absolute;
		left: 25upx;
		top: 81upx;
		right: 25upx;
		height: 1px;
		border-top: 1px solid #d9d9d9;
		color: #d9d9d9;
		-webkit-transform-origin: 0 0;
		transform-origin: 0 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.box_text_input {
		height: 81upx;
		font-size: 30upx;
		padding-left: 5upx;
	}

	.bk_box {
		background-color: #fff;
	}

	.bk_box_title {
		height: 53upx;
		font-size: 30upx;
		padding: 24upx 0 0 25upx;
		color: #818181;
		line-height: 60upx;
	}

	.bkspan_span {
		border: 1upx solid #b6b6b6;
		color: #878787;
		font-size: 28upx;
		margin: 8upx 7upx;
		border-radius: 35upx;
		text-align: center;
		padding: 5upx 20upx;
		display: inline-block;
	}

	.bkspan {
		padding: 20upx 25upx 0 15upx;
		display: flex;
	}

	.fabu_box_fb {
		background: #db384c;
		color: #fff;
		width: 374upx;
		text-align: center;
		float: left;
		font-size: 30upx;
		height: 77upx;
		line-height: 77upx;
	}

	.fabu_box {
		height: 79upx;
		line-height: 79upx;
		font-size: 30upx;
		position: fixed;
		bottom: 0;
		display: flex;
	}

	.borred {
		border: 1upx solid #db384c;
		color: #db384c;
	}

	.scimg {
		width: 40upx;
		height: 40upx;
	}

	.shanchu {
		width: 154upx;
		margin: 0 10upx;
		position: absolute;
		bottom: 14upx;
		height: 50upx;
		background-color: #000;
		opacity: 0.6;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9;
	}











	.burst-wrap {
		width: 100%;
		height: 100%;
	}

	/* .burst-wrap .burst-wrap-bg{
        position: relative;
        width: 100%;
        height: 320upx;
        background:linear-gradient(90deg,rgba(251,91,80,1) 0%,rgba(240,45,51,1) 100%);
        border-bottom-right-radius: 80upx;
        border-bottom-left-radius: 80upx;
    } */
	.burst-wrap .burst-wrap-bg>view {
		width: 90%;
		height: 100%;
		margin: 0 auto;
		position: absolute;
		top: 65upx;
		left: 0;
		right: 0;
	}

	.form-item {
		width: 100%;
	}

	.form-item textarea {
		display: block;
		height: 220upx;
		width: 100%;
		color: #AAAAAA;
		font-size: 28upx;
	}

	.uni-uploader__file,
	.uploader_video {
		position: relative;
		z-index: 1;
		width: 200upx;
		height: 200upx;
	}

	.uni-uploader__img {
		width: 200upx;
		height: 200upx;
	}

	.icon-cuo {
		position: absolute;
		right: 14upx;
		top: 5upx;
		background: linear-gradient(90deg, rgba(251, 91, 80, 1) 0%, rgba(240, 45, 51, 1) 100%);
		color: #FFFFFF;
		z-index: 999;
		border-top-right-radius: 20upx;
		border-bottom-left-radius: 20upx;
	}

	.video {
		width: 100%;
		height: 100%;
	}

	.login-input-box {
		position: relative;
		border-bottom: 1upx solid #EEEEEE;
	}

	.login-input-box .forget,
	.login-input-box .phone {
		position: absolute;
		top: 0;
		height: 100%;
		z-index: 100;
	}

	.login-input-box .phone {
		width: 100upx;
		left: 0;
		color: #666666;
		font-weight: bold;
	}

	.login-input-box .phone-input {
		padding-left: 100upx;
	}

	.address-wrap,
	.open-info {
		margin-top: 20upx;
	}

	.open-info>view:last-child {
		font-size: 28upx;
		color: #999999;
	}

	.address-wrap .address {
		background: #F2F2F2;
		border-radius: 40upx;
		padding: 0 20upx;
	}

	.user-set-btn {
		margin: 40upx;
		background: linear-gradient(90deg, rgba(251, 91, 80, 1) 0%, rgba(240, 45, 51, 1) 100%);
		color: #FFFFFF;
		text-align: center;
		height: 88upx;
		line-height: 88upx;
	}

	.up-img-btn {
		width: 120rpx;
		height: 80rpx;
		line-height: 80rpx;
		position: absolute;
		bottom: 0;
		background-color: rgba(198, 185, 184, 0.5);
		text-align: center;
		vertical-align: middle;
		color: #ffffff;
		font-weight: 700;
	}
</style>

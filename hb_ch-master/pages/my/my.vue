<template>
	<view class="page">
		<!-- 签到标签 -->

		<view class="m-banner-img" style="">
			<view class="member-top">
				<view class="icon-view" @click="btnClickAction(1)">
					<image class="m-image-img" mode="aspectFill"
						src="https://qnsp.zcskjy.com/zc_images/images/my/setImg.png" />
				</view>
				<view class="right-view" style="">
					<view class="icon-view" @click="btnClickAction(2)">
						<messageCenter />
					</view>
					<view class="icon-view" @click="btnClickAction(3)">
						<image class="m-image-img" mode="aspectFill"
							src="https://qnsp.zcskjy.com/zc_images/images/my/phoneImg.png" />
					</view>
				</view>
			</view>

			<view class="member-centet">
				<view class="hasLogin-view flexRow" v-if="hasLogin">
					<view class="memberinfo-view flexCol" style="align-items: flex-start">
						<view class="flexRow" style="height: 60rpx">
							<label class="nick-title" style="">{{ userInfo.user_nickname }}</label>
							<!-- <image  style="width:55rpx;height: 62rpx;" src="https://qnsp.zcskjy.com/zc_images/images/my/memberImg.png"></image> -->
							<!-- <image  style="width:55rpx;height: 62rpx;" :src="'https://qnsp.zcskjy.com/zc_images/images/my/levelImg'+userInfo.user_level_name +'.png'"></image> -->

							<!-- <view class="state-bgview">
									<view class="state-title"  style="" >学习王者</view>
									<image  style="width:11rpx;height: 11rpx;margin-right: 15rpx;"   src="https://qnsp.zcskjy.com/zc_images/images/my/slices.png"></image>
								</view> -->
						</view>
						<view class="flexRow" style="">
							<label class="stateNum-title"
								style="padding-right: 10rpx">{{ '学号:' + user_memberNum }}</label>
							<view class="flexRow" style="width: 60rpx;height: 60rpx;" @click="copyNumClick">
								<image style="width: 30rpx; height: 30rpx"
									src="https://qnsp.zcskjy.com/zc_images/images/my/copyImg.png"></image>
							</view>
						</view>
					</view>

					<view class="memberphoto-view" @click="btnClickAction(4)">
						<image class="member-image"
							:src="userInfo.user_avatar ? userInfo.user_avatar:'https://qnsp.zcskjy.com/zc_images/images/my/headerImg.png'">
						</image>
						<image class="small-image" src="https://qnsp.zcskjy.com/zc_images/images/my/editImg.png">
						</image>
					</view>
				</view>

				<view class="unlogin-view" v-else>
					<view class="flexCol" style="align-items: flex-start">
						<label class="nick-title" style="margin-bottom: 10rpx">{{ 'Hi～欢迎来到长乘学堂' }}</label>
						<label class="des-title" style="">{{ '登录后获取更多精彩内容' }}</label>
					</view>

					<view class="flexCol" style="margin-top: 0rpx">
						<view style="height: 40rpx; width: 100rpx"></view>
						<!-- <navigator url="/pages/login/login"> -->
						<view class="loginBtn-view" @click="goToLogin">
							<text>{{ __('登录／注册') }}</text>
						</view>
						<!-- </navigator> -->
					</view>
				</view>
			</view>
		</view>

		<view class="member-bottom flexRow">
			<view class="money-view" style="">
				<view class="number-title"> {{ hasLogin ? toFix(user_spending,2) : '--' }}</view>
				<view class="des-title">消费金额(元)</view>
			</view>
			<view class="" style="width: 1rpx; height: 40rpx; background-color: #8e5223"></view>
			<view class="money-view" style="">
				<view class="number-title"> {{ hasLogin ? toFix(user_income,2) : '--' }}</view>
				<view class="des-title"> 累计收入(元)</view>
			</view>
			<view class="" style="width: 1rpx; height: 40rpx; background-color: #8e5223"></view>
			<view class="money-view" style="" @click="hasLogin ? goToWithDraw():'' ">
				<view class="number-title" style="color: #8e5223">{{ hasLogin ? toFix(user_money,2)  : '--' }}</view>
				<view class="des-title" style="color: #8e5223">可提现余额(元)</view>
			</view>
		</view>

		<view class="menu-view">
			<block v-for="(item, index) in menuList" :key="index">
				<!-- <uni-badge text="5" type="purple" class="badge"></uni-badge> -->
				<!-- <uni-badge text="10" type="red" class="badge" style="position: absolute;right: 20rpx;top: 20rpx;"></uni-badge> -->
				<!-- <amenuitem-view :showBadge="index == 0 ? 1 : 0" :badgeNum="badge_num" :itemmodel="item" @itemClick='seletMenuIndex(index)'></amenuitem-view> -->
				<amenuitem-view :badgeNum="badge_num" :itemmodel="item" @itemClick="seletMenuIndex(index+1)">
				</amenuitem-view>
			</block>
		</view>

		<view class="" style="padding-top: 10rpx;padding-bottom: 100rpx ">
			<!-- <scroll-view scroll-y="true" style="height: ;"> -->
			<block v-for="(item, index) in miniList" :key="index">
				<aminicell-view :itemmodel="item" @itemClick="seletPageIndex(index)"></aminicell-view>
			</block>
			<!-- </scroll-view> -->
		</view>

		<!-- <view class="m-des-title" style=" height: 70rpx;padding-top:30rpx;padding-bottom: 100rpx">
		{{ 'Copyright © 2022-2030中财数科智能科技（上海）有限公司版权所有' }}
	</view> -->
	</view>
</template>

<script>
	import statusBar from '../../components/status-bar.vue';
	import uniBadge from '@/components/uni-badge.vue';
	import messageCenter from '@/components/messageTip.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		components: {
			statusBar,
			uniBadge,
			messageCenter
			// aminicell-view
		},

		data: function() {
			return {
				Info: '',
				hasSigned: false,
				user_memberNum: '',
				versionNumber: '',
				versionName: '',
				copyright: '',
				icp_number: '',
				badge_num: 8,
				user_spending: '0.00',
				user_money: '0.00',
				user_income: '0.00',
				isShowCs: false,
				isShowPs: false,
				mobile: '',

				levelImgArr: [
					'https://qnsp.zcskjy.com/zc_images/images/my/levelImg1.png',
					'https://qnsp.zcskjy.com/zc_images/images/my/levelImg2.png',
					'https://qnsp.zcskjy.com/zc_images/images/my/levelImg3.png',
					'https://qnsp.zcskjy.com/zc_images/images/my/levelImg4.png',
					'https://qnsp.zcskjy.com/zc_images/images/my/levelImg5.png',
					'https://qnsp.zcskjy.com/zc_images/images/my/levelImg6.png',
					'https://qnsp.zcskjy.com/zc_images/images/my/levelImg7.png',
				],

				menuList: [{
						title: '获得成就',
						img: 'https://qnsp.zcskjy.com/zc_images/images/my/menu1.png'
					},
					{
						title: '我的推广码',
						img: 'https://qnsp.zcskjy.com/zc_images/images/my/menu2.png'
					},
					{
						title: '我的学习',
						img: 'https://qnsp.zcskjy.com/zc_images/images/my/menu5.png'
					},
					{
						title: '我的订阅',
						img: 'https://qnsp.zcskjy.com/zc_images/images/my/menu4.png'
					},
				],

				miniList: [{
						title: '我的订单',
						img: 'https://qnsp.zcskjy.com/zc_images/images/my/order.png'
					},
					{
						title: '疯狂赚外快',
						img: 'https://qnsp.zcskjy.com/zc_images/images/my/earning.png'
					},
					// { title: '学习中心', img: 'https://qnsp.zcskjy.com/zc_images/images/my/learn.png' },
					{
						title: '我的优惠券',
						img: 'https://qnsp.zcskjy.com/zc_images/images/my/discount.png'
					},
					{
						title: '1对1服务',
						img: 'https://qnsp.zcskjy.com/zc_images/images/my/onetoone.png'
					},
					// {title:'商家入驻',img:'https://qnsp.zcskjy.com/zc_images/images/my/merchant.png'},
					// {title:'主播申请',img:'https://qnsp.zcskjy.com/zc_images/images/my/apply.png'},
					{
						title: '意见反馈',
						img: 'https://qnsp.zcskjy.com/zc_images/images/my/feedback.png'
					},
				],
			};
		},

		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'userInfo', 'hasLogin']),

		methods: {
			...mapMutations(['login', 'logout', 'getPlantformInfo', 'forceUserInfo', 'reloadUserResource', 'getUserInfo',
				'showCartNum'
			]),

			//跳转 login 页面
			goToLogin() {
				uni.navigateTo({
					url: '/pages/login/login',
				});
			},

			toFix(num1, num2) {
				if (typeof(num1) == 'undefined') {
					return '--'
				} else {
					return Number(num1).toFixed(num2)
				}
			},

			//获取学生学号
			creStudentId() {
				var student_id = this.$.getStorageSync('uid').toString();
				// let student_id = this.userInfo.uid;
				if (student_id.length < 6) {
					let size = 6 - student_id.length;
					for (let i = 0; i < size; i++) {
						student_id = '0' + student_id.toString();
					}
				}
				this.user_memberNum = 'ZC' + student_id;
				return 'ZC' + student_id;
			},

			async payAsset() {
				const that = this;
				that.$.request({
					url: that.Config.URL.pay.asset,
					// data: params,
					// dataType: 'json',
					loading: false,
					success: function(data, status, msg, code) {
						uni.stopPullDownRefresh();
						console.log('获取可提现余额-data---', data);
						if (status == 200) {
							that.setData({
								user_spending: data.user_spending,
								user_money: data.user_money,
								user_income: data.offline_income + data.online_income,
							});
						} else {
							uni.showToast({
								icon: 'none',
								title: '请稍后重试'
							})
						}
					}
				});
			},

			copyNumClick() {

				console.log('复制到剪切板---');
				uni.setClipboardData({
					data: this.user_memberNum, //要被复制的内容
					success: () => { //复制成功的回调函数
						uni.showToast({ //提示
							icon: 'none',
							title: '复制成功'
						})
					}
				});

				//  uni.showModal({
				//      content:this.user_memberNum,//模板中提示的内容
				//      confirmText:'复制内容',
				//      success:()=>{//点击复制内容的后调函数
				//        //uni.setClipboardData方法就是讲内容复制到粘贴板
				//        uni.setClipboardData({
				//          data:this.user_memberNum,//要被复制的内容
				//          success:()=>{//复制成功的回调函数
				//            uni.showToast({//提示
				//              title:'复制成功'
				//            })
				//          }
				//        });
				//     }
				// });
			},

			//跳转到提现页面
			goToWithDraw() {

				console.log('--userinfo---', this.userInfo);
				uni.navigateTo({
					url: '/home/withdrawal/withdrawal',
				});
			},

			btnClickAction(index) {

				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}

				if (index == 1) {
					//设置按钮
					uni.navigateTo({
						url: '/my/setting/settings',
					});
				} else if (index == 2) {
					//消息按钮
					uni.navigateTo({
						url: '/member/member/message',
					});
				} else if (index == 3) {
					//客服按钮
					var user_id = this.$.getStorageSync('uid');
					let chat_url = this.$.sprintf('/im/chat/chat?uid=%s', user_id);
					uni.navigateTo({
						url: chat_url,
					});
				} else if (index == 4) {
					//点击头像
					uni.navigateTo({
						url: '/my/setting/data',
					});
				}
			},

			getEUid() {
				var uid = this.$.getStorageSync('uid').toString();
				var eUrl = this.Config.getEuid
				uni.request({
					method: 'POST',
					url: eUrl,
					data: {
						"uid": uid,
					},
					success: function(data, status) {
						if (data.data.result?.userId)
							uni.setStorage({
								key: 'e_uid',
								data: data.data.result.userId
							});
					}
				})
			},



			seletMenuIndex(index) {
				console.log('menuindex---', index);
				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}

				//我的推广码
				if (index == 1) {
					uni.navigateTo({
						url: '/edu/cert/user-cert?',
					});
				} else if (index == 2) {
					uni.navigateTo({
						// url: '/member/fans/endorsement?',
						url: '/my/menuview/endorsement',
					});

				} else if (index == 3) {
					// uni.navigateTo({
					//   url: '/member/order/list?',
					// });
					let that = this;
					uni.switchTab({
						url: '/pages/course/study',
						success(res) {
							setTimeout(function() {
								that.notice.postNotificationName("changeLearnView")
							}, 100);
							console.log('成功啦', res);
						},
						fail(err) {
							console.log('失败啦', err);
						},
					});

				} else if (index == 4) {
					uni.navigateTo({
						url: '/edu/lecturer/subscribe?',
					});
				} else {
					uni.showToast({
						icon: 'none',
						title: '待对接课程页面',
					});
				}
			},

			seletPageIndex(index) {

				if (!this.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}

				console.log('pageindex---', index);
				//疯狂外块页面
				if (index == 0) {
					uni.navigateTo({
						url: '/edu/order/list?',
					});
				} else if (index == 1) {
					uni.navigateTo({
						url: '/my/outincome/outincome?',
					});
				} else if (index == 2) {

					uni.navigateTo({
						url: '/my/zc-coupon/zc-coupon',
					});
				} else if (index == 3) {
					uni.navigateTo({
						url: '/my/onetoone/onetoone',
					});
				} else if (index == 4) {
					console.log('---id----', this.userInfo.user_id);
					uni.navigateTo({
						url: '/my/setting/feedback-add?id=' + this.userInfo.user_id,
					});
				} else if (index == 5) {
					if (this.isShowCs) {
						uni.navigateTo({
							url: '/my/cs_course/cs_course'
						})
					} else if (this.isShowPs) {
						uni.navigateTo({
							url: '/my/ps_course/ps_course'
						})
					}
				} else if (index == 6) {
					if (this.isShowPs) {
						uni.navigateTo({
							url: '/my/ps_course/ps_course'
						})
					}
				}
			},

			load: function(force_refresh) {
				if (typeof force_refresh == 'undefined') {
					force_refresh = true;
				}

				var that = this,
					params = {
						/*store_id: this.shopInfo.store_id*/
					};

				//判断系统，调取对应网址
				var url = this.Config.URL.store.menu;
				url = this.Config.URL.center_menu;

				//        that.$.request({
				//            url: url,
				//            data: params,
				//            ajaxCache: {
				//                timeout: this.Config.CACHE_EXPIRE
				//            },
				//            success: function(data, status, msg, code) {
				//                that.setData({
				//                    PersonalCenterList: data.menu,
				//                    orders: data.orders
				//                });
				// that.$.stopPullDownRefresh()
				//            }
				//        });

				uni.stopPullDownRefresh();
				if (this.hasLogin) {

				} else {

				}
			},

			cancel: function() {
				let that = this;
				that.$.setStorage({
					key: 'cancel',
					data: 'yes',
				});
			},

			getPhoneNumber: function(e) {
				var that = this;
				that.$.login({
					success: function(n) {
						var r = {
							//vendorId: that.cf.storeId,
							userId: that.userInfo.Id,
							encryptData: e.detail.encryptedData,
							encryptDataIV: e.detail.iv,
							code: n.code,
						};
					},
				});
			},

			selectAddress: function(e) {
				var that = this;
				that.$.gopage('/member/address/list');
			},

			goTabBar: function(e) {
				var that = this;
				that.$.goToTabBar(that, e.currentTarget.dataset.url);
			},

			cleanCache: function(e) {
				var that = this;
				const index = e.currentTarget.dataset.index;
				const path = e.currentTarget.dataset.path;

				that.$.confirm(
					that.__('确定要清除缓存吗？'),
					function(data) {
						if (data.confirm) {
							const language = uni.getStorageSync('language');
							that.$.storage.clear();
							//如果不在允许的语言内，可重置
							uni.setStorageSync('language', language);

							//退出登录
							that.logout(true);
						}
					},
					true,
				);
			},

			navigate(href, e) {
				// do something
				console.info(href);
				console.info(e);

				this.$.gopage('/pagesub/webpage/webpage?u=' + encodeURIComponent(href));
			},

			getCsState() {
				let that = this
				if (!that.hasLogin) {
					that.setData({
						isShowCs: false
					})
					return
				}
				console.log('this.userInfo=', that.mobile)
				uni.request({
					url: that.Config.getCsTab,
					data: {
						mobile: that.mobile,
					},
					success: (res) => {
						that.getPsState()
						let {
							result
						} = res.data
						let cs = {
							title: '淳石培训',
							img: 'https://qnsp.zcskjy.com/zc_images/images/my/order.png'
						}
						if (result.isInWhiteList&&JSON.stringify(that.miniList).indexOf(JSON.stringify(cs)) === -1) {
							that.miniList.push(cs)
						}
						that.setData({
							isShowCs: result.isInWhiteList
						})
					}
				})
			},
			getPsState() {
				let that = this
				if (!that.hasLogin) {
					that.setData({
						isShowPs: false
					})
					return
				}
				uni.request({
					url: that.Config.getPsisInWhiteList,
					data: {
						mobile: that.mobile,
						// mobile: '13916516994',
					},
					success: (res) => {
						let {
							result
						} = res.data
						let ps = {
							title: '朴石培训',
							img: 'https://qnsp.zcskjy.com/zc_images/images/my/order.png'
						}
						if (result&&JSON.stringify(that.miniList).indexOf(JSON.stringify(ps)) === -1) {
							that.miniList.push(ps)
						}
						that.setData({
							isShowPs: result
						})
					}
				})
			},
		},


		onLoad: function(opt) {
			uni.setNavigationBarTitle({
				title: this.__('用户中心'),
			});

			// var that = this;
			//just for other passport
			// if (opt.perm_id && opt.perm_key)
			// {
			// 	that.$.setStorageSync('uid', opt.perm_id);
			// 	that.$.setStorageSync('ukey', decodeURIComponent(opt.perm_key));
			// }
			//强制更新用户信息及资源
			// this.forceUserInfo(function(user) {
			// });
			// that.load();
		},

		onShow: function(opt) {
			let that = this;

			//强制更新用户信息及资源
			if (this.hasLogin) {
				this.mobile = this.userInfo.user_mobile.includes('+86') ? this.userInfo.user_mobile.slice(3) : this
					.userInfo.user_mobile;
				this.getCsState()
				
				if (this.user_memberNum.length == 0) {
					this.creStudentId();
				}
				//获取小鹅通账户信息
				this.getEUid();
				//调取金额的接口
				this.payAsset();
			} else {
				this.setData({
					isShowCs: false,
					isShowPs: false,
					miniList: [{
							title: '我的订单',
							img: 'https://qnsp.zcskjy.com/zc_images/images/my/order.png'
						},
						{
							title: '疯狂赚外快',
							img: 'https://qnsp.zcskjy.com/zc_images/images/my/earning.png'
						},
						// { title: '学习中心', img: 'https://qnsp.zcskjy.com/zc_images/images/my/learn.png' },
						{
							title: '我的优惠券',
							img: 'https://qnsp.zcskjy.com/zc_images/images/my/discount.png'
						},
						{
							title: '1对1服务',
							img: 'https://qnsp.zcskjy.com/zc_images/images/my/onetoone.png'
						},
						// {title:'商家入驻',img:'https://qnsp.zcskjy.com/zc_images/images/my/merchant.png'},
						// {title:'主播申请',img:'https://qnsp.zcskjy.com/zc_images/images/my/apply.png'},
						{
							title: '意见反馈',
							img: 'https://qnsp.zcskjy.com/zc_images/images/my/feedback.png'
						},
					],
				})
				// this.setData({
				//     UserInfo: this.userInfo
				// });
				// uni.showModal({
				//     title: '未登录',
				//     content: '您未登录，需要登录后才能继续',
				//     success: (res) => {
				//         if (res.confirm) {
				//             uni.navigateTo({
				//                 url: '/pages/login/login'
				//             })
				//         } else if (res.cancel) {
				//             console.log('取消')
				//         }
				//     }
				// })
			}
		},

		onReady: function() {
			console.log('---avatar---', this.userInfo.user_avatar);
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.load(true);
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			// this.$refs.guessYouLike.scrollbottom();
		},
	};
</script>

<style lang="scss" scoped>
	.page {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		min-height: 100%;
		background-color: #ffffff;
		background-size: cover !important;
		background-position: top center !important;
		margin-bottom: var(--window-bottom);
	}

	.flexCol {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.flexRow {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}


	.flexCenter {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.m-des-title {
		text-align: center;
		height: 25rpx;
		line-height: 25rpx;
		color: #999999;
		font-size: 22rpx;
		font-weight: 400;
		font-family: PingFangSC-Regular, PingFang SC;
	}

	.m-banner-img {
		width: 750rpx;
		height: 460rpx;
		background: url(https://qnsp.zcskjy.com/zc_images/images/my/my-topbgimg.png) no-repeat;
		background-size: 750rpx 460rpx;
		// background-size: cover;
		background-attachment: fixed;
		border-radius: 0 0 39rpx 39rpx;

		.member-top {
			// background-color: #0077AA;
			padding: 88rpx 10rpx 0;
			// margin-top:var(--status-bar-height);
			// width: 100%;
			height: 88rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;

			.right-view {
				// width: 100rpx;
				height: 100%;
				display: flex;
				flex-direction: row;
				align-items: center;
				// justify-content: space-between;
				width: auto;
			}

			.icon-view {
				width: 80rpx;
				height: 100%;
				// background-color: #F0AD4E;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;

				.m-image-img {
					width: 42rpx;
					height: 42rpx;
				}
			}
		}

		.member-centet {
			// background-color: #ff6700;
			text-align: center;
			padding: 20rpx 30rpx 30rpx;
			height: 140rpx;

			.nick-title {
				color: #333333;
				line-height: 56rpx;
				height: 56rpx;
				text-align: left;
				width: auto;
				font-size: 40rpx;
				font-weight: 600;
				font-family: PingFangSC-Semibold, PingFang SC;
			}

			.state-bgview {
				color: #8e5223;
				line-height: 31rpx;
				border-radius: 0 20rpx 20rpx 0;
				height: 31rpx;
				width: 137rpx;
				text-align: left;
				font-size: 20rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
				background: -wbkit-linear-gradient(to left, #fede9c, #f9c267);
				background: linear-gradient(to left, #fede9c, #f9c267);

				margin-left: -15rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: flex-end;
			}

			.state-title {
				// color: #8E5223;
				// line-height: 31rpx;
				// border-radius: 0 20rpx 20rpx 0;
				height: 31rpx;
				width: 100rpx;
				// text-align: left;
				// font-size: 20rpx;
				// font-weight: 400;
				// font-family: PingFangSC-Regular, PingFang SC;
				// background:-wbkit-linear-gradient(to left,#FEDE9C,#F9C267);
				// background:linear-gradient(to left,#FEDE9C,#F9C267);
			}

			.stateNum-title {
				color: #999999;
				line-height: 33rpx;
				height: 33rpx;
				width: auto;
				text-align: left;
				font-size: 24rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
			}

			.member-image {
				height: 140rpx;
				width: 140rpx;
				border-radius: 140rpx;
				overflow: hidden;
				// background-color: #F1A532;
			}

			.hasLogin-view {

				// height: 140rpx;
				// background-color: #F0AD4E;
				.memberinfo-view {}

				.memberphoto-view {
					position: relative;

					.small-image {
						height: 36rpx;
						width: 36rpx;
						position: absolute;
						bottom: 10rpx;
						right: 0rpx;
					}
				}
			}

			.unlogin-view {
				display: flex;
				flex-direction: row;
				align-items: flex-end;
				justify-content: space-between;

				.des-title {
					color: #666666;
					line-height: 37rpx;
					height: 37rpx;
					text-align: left;
					font-size: 26rpx;
					font-weight: 400;
					font-family: PingFangSC-Regular, PingFang SC;
				}

				.loginBtn-view {
					font-size: 30rpx;
					font-weight: 600;
					height: 80rpx;
					text-align: center;
					line-height: 80rpx;
					width: 200rpx;
					color: #ffffff;
					border-radius: 80rpx;

					font-family: PingFangSC-Medium, PingFang SC;
					background: -wbkit-linear-gradient(to left, #ff6161, #ff9661);
					background: linear-gradient(to left, #ff6161, #ff9661);
				}
			}
		}
	}

	.member-bottom {
		// padding: 20rpx 30rpx 10rpx;
		margin: -100rpx 30rpx 0rpx;
		height: 140rpx;
		border-radius: 20rpx;
		text-align: center;
		background: -wbkit-linear-gradient(to right, #f6d8be, #f8e4d2);
		background: linear-gradient(to right, #f6d8be, #f8e4d2);

		.money-view {
			flex: 1;
			// background-color: #FF0000; 
			padding-left: 30rpx;
			text-align: left;

			.number-title {
				margin-bottom: 10rpx;
				height: 42rpx;
				line-height: 42rpx;
				color: #333333;
				font-size: 36rpx;
				font-weight: 600;
				font-family: PingFangSC-Bold, PingFang SC;
			}

			.des-title {
				height: 28rpx;
				line-height: 28rpx;
				color: #333333;
				font-size: 20rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
			}
		}
	}

	.menu-view {
		padding: 40rpx 30rpx 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
</style>

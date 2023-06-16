<template>
	<view class="container">
		<view class="search" v-if="false">
			<input class="search_input" placeholder="搜索你想要的大咖" @input="handleInput" v-model="search_data" />
			<u-icon class="search_btn" name="search" color="#878787" size="24" @click="search"></u-icon>
		</view>
        
		<scroll-view class="scroll_main" scroll-y="true" :style="{ height: clientHeight + 'px' }">
			<view class="item_main" v-for="data in teachersData" @click="toTeacherSpace(data.teacherId)">
				<view class="part1">
					<image class="teacher_icon" :src="data.portraitUrl" mode="aspectFill"></image>
					<view class="info">
						<text class="name">{{data.teacherName}}</text>
						<view class="fans">
							<text class="text1">粉丝</text>
							<text class="text2">{{data.fans}}</text>
						</view>
					</view>
					<text :class="data.focusFlag?'attention':'noattention'" @click.stop="doAttention(data)">{{data.focusFlag?'私信':'+关注'}}</text>
				</view>
				<text class="part2">{{data.teacherDesc}}</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import subsection from '../../components/subsection/index.vue';


	export default {
		components: {
			subsection,
		},

		data() {
			return {
				search_data: '',
				clientHeight: 0,
				teachersData: []
			}
		},
		methods: {
			search() {
				// alert(this.search_data)
				
			},
			handleInput(event) {},
			getTeacherList() {
				let that = this;
				let uid = that.userInfo.user_id;
				uni.request({
					url: that.Config.teacherListDate,
					methods: 'GET',
					data: {
						userId: uid
					},
					loading: false,
					success: function(res) {
						let teacherData = res?.data?.result;
						that.setData({
							teachersData: teacherData,
						});
					}
				});
			},
			toTeacherSpace(teacherId) {
				this.$.gopage('/community/community/userspace?uid=' + teacherId);
			},
			tochat(id) {
				uni.navigateTo({
					url: "/im/chat/chat?uid=" + id,
				})
			},
			doAttention(data){
				let that = this;
				//后面接入逻辑
				let oldTdata = that.teachersData
				let indexTotal = oldTdata.indexOf(data)
				let newTData = oldTdata[indexTotal]
				if (newTData.focusFlag) {
					that.tochat(newTData.teacherId)
				} else {
					//关注
					that.addAttention(newTData.teacherId, true)
				}
				newTData.focusFlag = true
				oldTdata[indexTotal] = newTData
				that.setData({
					teachersData: oldTdata,
				})
			},
			addAttention(id) {
				var that = this,
					params = {
						friend_id: id,
					};

				that.$.request({
					url: this.Config.URL.user.friend_agree,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							that.$.showToast({
								title: that.__('关注成功'),
								icon: 'success',
								duration: 2e3
							})
						} else {
							that.$.showToast({
								title: that.__('关注失败'),
								icon: 'error',
								duration: 2e3
							})
						}
					},
				});
			},
			cancelAttention(id) {
				var that = this;
				var params = {
					friend_id: id,
				};
				that.$.request({
					url: that.Config.URL.user.friend_refuse,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							that.$.showToast({
								title: that.__('取消关注成功'),
								icon: 'success',
								duration: 2e3
							});
						} else {
							that.$.showToast({
								title: that.__('取消关注失败'),
								icon: 'success',
								duration: 2e3
							});
						}
					},
				});
			}
		},
		onReady() {
			let that = this;
			uni.getSystemInfo({
				success(res) {
					//228是title和tab的高度和
					that.clientHeight = res.windowHeight - res.statusBarHeight ;
				}
			})
		},

		// 函数
		computed: {
			...mapState(['Config', 'hasLogin', 'userInfo']),
		},

		onLoad() {
			let that = this;
			that.getTeacherList();
		},
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
		background-color: #F7F7FD;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.search {
		width: 690rpx;
		height: 80rpx;
		background: #EFEFEF;
		border-radius: 40rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin-top: 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;


		.search_btn {
			margin-right: 25rpx;
		}

		.search_input {
			margin-left: 35rpx;
			font-size: 26rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			line-height: 37rpx;
		}
	}

	.scroll_main {
		width: 100%;
		min-height: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 30rpx;
		padding-bottom: 0;  
		padding-bottom: constant(safe-area-inset-bottom);  
		padding-bottom: env(safe-area-inset-bottom);  
	}

	.item_main {
		width: 690rpx;
		height: 240rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin: 30rpx 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.part1 {
		width: 640rpx;
		height: 100rpx;
		margin-top: 24rpx;
		margin-bottom: 26rpx;
		display: flex;
		flex-direction: row;
	}

	.teacher_icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50rpx;
	}

	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-left: 27rpx;
		justify-content: center;
	}

	.attention {
		width: 120rpx;
		height: 60rpx;
		background: #F43D3E;
		border-radius: 30rpx;
		margin-top: 9rpx;
		font-size: 28rpx;
		text-align: center;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 60rpx;
	}

	.noattention {
		width: 120rpx;
		height: 60rpx;
		background: #fff;
		border-radius: 30rpx;
		margin-top: 9rpx;
		font-size: 28rpx;
		text-align: center;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: red;
		border: red solid 1rpx;
		line-height: 60rpx;
	}

	.name {
		height: 45rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #3F3F3F;
		line-height: 45rpx;

	}

	.fans {
		display: flex;
		flex-direction: row;
		height: 45rpx;
	}

	.text1 {
		height: 33rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
		margin-top: 10rpx;
		line-height: 33rpx;
	}

	.text2 {
		height: 45rpx;
		font-size: 36rpx;
		font-family: DIN-Bold, DIN;
		font-weight: bold;
		margin-left: 20rpx;
		color: #333333;
		line-height: 44rpx;
	}

	.text3 {
		height: 33rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: bold;
		color: #333333;
		margin-top: 10rpx;
		line-height: 33rpx;
	}

	.part2 {
		width: 640rpx;
		height: 70rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #3F3F3F;
		line-height: 35rpx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
</style>

<template>
	<view class="tab_page1">

		<image style="width: 710rpx;height: 140rpx;margin-top: 29rpx;"
			src="https://qnsp.zcskjy.com/zc_images/dk_banner.png" mode="aspectFill"></image>
		<view class="teacher_space">

			<view class="teacher_item" v-for="(data,index) in showTeachers" :key="index"
				@click="toTeacherSpace(data.teacherId)">
				<image class="teacher_icon" :src="data.portraitUrl" mode="aspectFill"></image>
				<text class="teacher-name">{{data.teacherName}}</text>
				<view class="label_space" v-if="data.teacherLabel">
					<view class="label" v-for="tags in changeToList(data.teacherLabel)">
						{{tags}}
					</view>
				</view>
				<text class="desc">
					{{data.teacherDesc}}
				</text>
				<text v-if='weatherShow(data.teacherId)' :class="data.focusFlag?'attention':'noattention'"
					@click.stop="doAttention(data)">
					{{data.focusFlag?'已关注':'+ 关注'}}
				</text>
			</view>
			<view class="teacher_bottom">
				<text class="type1" @click="toMore">更多大咖</text>
				<text :class="oneKeyStatus?'type2':'type3'" @click="oneKeyAtt">{{oneKeyStatus?'一键关注':'已全部关注'}}</text>
			</view>
			<view class="refresh_space" @click="changeTeacherIndex">
				<u-icon name="reload" color="#999999" size="20"></u-icon>
				<view class="refresh">换一批</view>
			</view>
		</view>
		
	</view>

</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		props: {
			viewHeight: {
				type: Number,
				defalut: 0,
			},
			followPartHeight: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				//老师列表总数
				totalLength: 0,
				//当前展示的4个老师（换一批）的下标
				currentTeacherIndex: 0,
				//换一批的总数
				totalIndex: 0,
				//当前展示的4个老师
				showTeachers: [],
				//按四个老师列表为一个对象维度 将返回的数据生成新的数组
				showData: [],
				//老师列表（总）
				teachersData: [{
					teacherName: '老李',
					teacherId: '',
					teacherLabel: '',
					// tags: ['打板', '龙头战法', '技术面'],
					portraitUrl: '',
					teacherDesc: '8年海内外头部券商证券从业经验，12年短线交易经验。擅长题材分析以及年海内外头部券商证券从业经验',
					focusFlag: true
				}],
				current_user_id: '',
				focusStatus: false
			}
		},

		created() {
			let that = this;
			if (this.hasLogin) {
				that.setData({
					current_user_id: that.userInfo.user_id
				})
			}
			that.getTeacherList();
		},
		// 函数
		computed: {
			...mapState(['Config', 'hasLogin', 'userInfo', 'hasLogin']),
			oneKeyStatus() {
				let that = this;
				let focusStatus = false;
				if (that.showTeachers.length > 0) {
					that.showTeachers.forEach((data) => {
						if (!data.focusFlag) {
							focusStatus = true
						}
					})
				}
				return focusStatus;
			},

		},
		methods: {

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
						uni.stopPullDownRefresh();
						let teacherData = res?.data?.result;
						that.setData({
							teachersData: teacherData,
							showData: that.chunkArr(teacherData, 4),
							totalLength: teacherData.length,
							showTeachers: that.chunkArr(teacherData, 4)[that
								.currentTeacherIndex],
							totalIndex: Math.ceil(teacherData.length / 4)
						});
					}
				});
			},
			chunkArr(arr, size) {
				//判断如果不是数组(就没有length)，或者size没有传值，size小于1，就返回空数组
				if (!arr.length || !size || size < 1) return []
				let [start, end, result] = [null, null, []]
				for (let i = 0; i < Math.ceil(arr.length / size); i++) {
					start = i * size
					end = start + size
					result.push(arr.slice(start, end))
				}
				return result
			},
			doAttention(data) {
				let that = this;
				if (!that.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				//后面接入逻辑
				let oldTdata = that.teachersData
				let indexTotal = oldTdata.indexOf(data)
				let newTData = oldTdata[indexTotal]
				if (newTData.focusFlag) {
					//取关
					that.cancelAttention(newTData.teacherId)
				} else {
					//关注
					that.addAttention(newTData.teacherId, true)
				}
				newTData.focusFlag = !newTData.focusFlag
				oldTdata[indexTotal] = newTData
				that.setData({
					teachersData: oldTdata,
					showData: that.chunkArr(oldTdata, 4),
					showTeachers: that.showData[that.currentTeacherIndex],
				})
			},

			changeToList(str) {
				return str.split('，');
			},

			oneKeyAtt() {
				let that = this;
				if (!that.oneKeyStatus) {
					uni.showToast({
						icon: 'none',
						title: '已全部关注'
					})
					return
				}
				if (!that.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				let addData = that.showTeachers;
				let oldTdata = that.teachersData
				for (let i = 0; i < addData.length; i++) {
					if (!addData[i].focusFlag) {
						let indexTotal = oldTdata.indexOf(addData[i])
						that.addAttention(addData[i].teacherId, false)
						addData[i].focusFlag = true
						oldTdata[indexTotal] = addData[i]
						that.setData({
							teachersData: oldTdata,
							showData: that.chunkArr(oldTdata, 4),
							showTeachers: that.showData[that.currentTeacherIndex],
						})
					}
				}
			},



			addAttention(id, showT) {
				uni.$emit("attentionChange", this.showTeachers)
				var that = this,
					params = {
						friend_id: id,
					};

				that.$.request({
					url: this.Config.URL.user.friend_agree,
					data: params,
					success: function(data, status, msg, code) {
						if (200 == status) {
							if (showT)
								that.$.showToast({
									title: that.__('关注成功'),
									icon: 'success',
									duration: 2e3
								})
						} else {
							if (showT)
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
			},

			changeTeacherIndex() {
				let that = this;
				console.log('ceil=' + that.totalIndex + ' currentTeacherIndex=' + that.currentTeacherIndex);

				const newIndex = (that.currentTeacherIndex + 1) % that.totalIndex;
				that.setData({
					currentTeacherIndex: newIndex,
					showTeachers: that.showData[newIndex],
				})
			},

			toMore() {
				let that = this;
				if (!that.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				uni.navigateTo({
					url: '/edu/teacher-more/teacher-more'
				})
			},
			loadRefresh() {
				this.getTeacherList()
			},
			weatherShow(tId) {
				return this.current_user_id != tId
			},

			toTeacherSpace(teacherId) {
				let that = this;
				if (!that.hasLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				this.$.gopage('/community/community/userspace?uid=' + teacherId);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab_page1 {
		width: 100%;
		height: auto;
		flex-direction: column;
		display: flex;
		align-items: center;
	}

	.teacher_space {
		display: flex;
		flex-direction: row;
		flex-flow: wrap;
		/* margin-left: 20rpx; */
		/* margin-right: 20rpx; */
		margin-top: 5rpx;
		align-items: center;
		justify-content: left;
	}

	.teacher_item {
		width: 340rpx;
		height: 480rpx;
		background-color: #fff;
		border-radius: 15rpx;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
		margin-left: 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		box-shadow: 0 6rpx 9rpx 0 rgba(235,235,235,0.5);
	}

	.teacher_icon {
		width: 146rpx;
		height: 146rpx;
		border-radius: 73rpx;
		margin-top: 30rpx;
	}

	.teacher_name {
		height: 45rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #3F3F3F;
		margin-top: 6rpx;
		line-height: 45rpx;
	}

	.label_space {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.label {
		background-color: #FFF5ED;
		border-radius: 6rpx;
		font-size: 20rpx;
		text-align: center;
		color: #FFA312;
		padding: 5rpx 14rpx;
		margin: 3rpx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.desc {
		width: 289rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #3F3F3F;
		line-height: 30rpx;
		margin: 20rpx 25rpx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.noattention {
		width: 143rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #F64D54;
		border-radius: 30rpx;
		text-align: center;
		color: #fff;

		position: absolute;
		bottom: 20rpx;
		left: 99rpx;
	}

	.attention {
		width: 143rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #F6F6F6;
		border-radius: 30rpx;
		text-align: center;
		color: #999999;

		position: absolute;
		bottom: 20rpx;
		left: 99rpx;
	}

	.teacher_bottom {
		display: flex;
		flex-direction: row;
		margin: 40rpx 50rpx;
		width: 650rpx;
		justify-content: space-between;
		align-items: center;
	}

	.type1 {
		width: 300rpx;
		height: 80rpx;
		border-radius: 40rpx;
		border: 2rpx solid #F64D54;
		text-align: center;
		line-height: 80rpx;
		font-size: 30rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #F64D54;
	}

	.type2 {
		width: 300rpx;
		height: 80rpx;
		background: #F64D54;
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 30rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #FFFFFF;
	}

	.type3 {
		width: 300rpx;
		height: 80rpx;
		background: #F6F6F6;
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
		font-size: 30rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #999;
	}

	.refresh_space {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-bottom: 50rpx;
		align-items: center;
	}

	.refresh {
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		line-height: 33rpx;
		margin-left: 4rpx;
	}
</style>

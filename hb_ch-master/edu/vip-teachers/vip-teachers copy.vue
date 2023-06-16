<template>
	<view class="container">
		<view class="status-bar"></view>
		<text class="page_title">大咖观点</text>
		<subsection style="width: 690rpx;margin-left: 30rpx;margin-right: 30rpx;margin-top: 30rpx;" :subsectionIndex="currentIndex" :selectionList="selectionList"
			@changeBtnIndex="changeBtnIndex">
		</subsection>
		<scroll-view scroll-y="true" v-if="currentIndex==0" :style="{ height: clientHeight + 'px' }">
			<view class="tab_page1">

				<image style="width: 710rpx;height: 140rpx;margin-top: 29rpx;"
					src="https://qnsp.zcskjy.com/zc_images/dk_banner.png" mode="aspectFill"></image>
				<view class="teacher_space">

					<view class="teacher_item" v-for="data in showTeachers">
						<image class="teacher_icon" :src="data.user_avatar" mode="aspectFill"></image>
						<text class="teacher-name">{{data.user_nickname}}</text>

						<view class="label_space" v-if="data.tags">
							<view class="label" v-for="tags in data.tags">{{tags}}
							</view>
						</view>
						<text class="desc">
							{{data.lecturer_introduce}}
						</text>

						<text :class="data.isAttention?'attention':'noattention'" @click="doAttention(data)">
							{{data.isAttention?'已关注':'+ 关注'}}
						</text>

					</view>

					<view class="teacher_bottom">
						<text class="type1" @click="toMore">更多大咖</text>
						<text class="type2">一键关注</text>
					</view>
				</view>

				<view class="refresh_space" @click="changeTeacherIndex">
					<u-icon name="reload" color="#999999" size="20"></u-icon>
					<view class="refresh">换一批</view>
				</view>
			</view>

		</scroll-view>

		<view class="tab_page2" v-if="currentIndex==1">
			<text>看热点</text>
		</view>

		<view class="tab_page3" v-if="currentIndex==2" :style="{ height: clientHeight + 'px' }">
			<scroll-view class="sc_part3" :style="{ height: clientHeight + 'px' }" scroll-y="true"
				@scrolltolower="scrolltolower">
				<swiper class="scroll_follow" :autoplay="false" next-margin='60rpx'>
					<swiper-item style="width: 100%;height:280rpx;" v-for="data in showTeachers" >
						<view class="item_main">
							<view class="part1">
								<image class="teacher_icon2" :src="data.user_avatar" mode="aspectFill"></image>
						
								<view class="info">
									<text class="name">{{data.user_nickname}}</text>
						
									<view class="fans">
										<text class="text1">粉丝</text>
										<text class="text2">10.95</text>
										<text class="text3">万</text>
									</view>
								</view>
								<text
									:class="data.isAttention?'attention':'noattention'">{{data.isAttention?'私信':'去关注'}}</text>
							</view>
							<text class="part2">{{data.lecturer_introduce}}</text>
						</view>
					</swiper-item>
				
				</swiper>
			<!-- 	<scroll-view class=" scroll_follow" scroll-x="true">
					<view class="item_main" v-for="data in showTeachers">
						<view class="part1">
							<image class="teacher_icon" :src="data.user_avatar" mode="aspectFill"></image>

							<view class="info">
								<text class="name">{{data.user_nickname}}</text>

								<view class="fans">
									<text class="text1">粉丝</text>
									<text class="text2">10.95</text>
									<text class="text3">万</text>
								</view>
							</view>
							<text
								:class="data.isAttention?'attention':'noattention'">{{data.isAttention?'私信':'去关注'}}</text>
						</view>
						<text class="part2">{{data.lecturer_introduce}}</text>
					</view>
				</scroll-view> -->
				<u-sticky offsetTop="-100rpx" bgColor="#fff">
					<u-tabs :current="followCurrentIndex" @change="changeFollowTab" bgColor="#fff" :list="tabData"
						lineWidth="40rpx" lineHeight="10rpx" lineColor="#f56c6c" :activeStyle="{
			            color: '#303133',
			            fontWeight: 'bold',
			            transform: 'scale(1.05)',
			        }" :inactiveStyle="{
			            color: '#606266',
			            transform: 'scale(1)'
			        }" itemStyle="padding-left: 30rpx; padding-right: 30rpx; height: 100rpx;background-color:#fff">
					</u-tabs>
				</u-sticky>

				<policyDecision v-if="followCurrentIndex==4" />

				<view v-for="(item, index) in indexList" :key="index" v-if="followCurrentIndex!=4">
					<u-cell :title="`列表长度-${index + 1}`">
						<u-avatar slot="icon" shape="square" size="35" :src="item.url"
							customStyle="margin: -3px 5px -3px 0"></u-avatar>
					</u-cell>
				</view>


			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import subsection from '../../components/subsection/index.vue';
	import policyDecision from "../../components/community/policyDecision.vue";

	export default {
		components: {
			subsection,
			policyDecision
		},
		data() {
			return {
				//tab的index
				currentIndex: 0,
				followCurrentIndex: 0,
				//内容高度
				clientHeight: 0,
				followPartHeight: 0,
				//老师列表总数
				totalLength: 0,
				//当前展示的4个老师（换一批）的下标
				currentTeacherIndex: 0,
				//换一批的总数
				totalIndex: 0,
				selectionList: [{
						name: '找大咖',
						show_fg: 0,
					},
					{
						name: '看热点',
						show_fg: 0,
					},
					{
						name: '跟大咖',
						show_fg: 0,
					},
				],
				//当前展示的4个老师
				showTeachers: [],
				//按四个老师列表为一个对象维度 将返回的数据生成新的数组
				showData: [],
				//老师列表（总）
				teachersData: [{
					user_nickname: '老李',
					tags: ['打板', '龙头战法', '技术面'],
					user_avatar: '',
					lecturer_introduce: '8年海内外头部券商证券从业经验，12年短线交易经验。擅长题材分析以及年海内外头部券商证券从业经验',
					isAttention: true
				}],
				indexList: [],
				urls: [
					'https://cdn.uviewui.com/uview/album/1.jpg',
					'https://cdn.uviewui.com/uview/album/2.jpg',
					'https://cdn.uviewui.com/uview/album/3.jpg',
					'https://cdn.uviewui.com/uview/album/4.jpg',
					'https://cdn.uviewui.com/uview/album/5.jpg',
					'https://cdn.uviewui.com/uview/album/6.jpg',
					'https://cdn.uviewui.com/uview/album/7.jpg',
					'https://cdn.uviewui.com/uview/album/8.jpg',
					'https://cdn.uviewui.com/uview/album/9.jpg',
					'https://cdn.uviewui.com/uview/album/10.jpg',
				],
				tabData: [{
					name: '观点'
				}, {
					name: '直播',
					badge: {
						isDot: true
					}
				}, {
					name: '短视频'
				}, {
					name: '课程',
					badge: {
						value: 5,
					}
				}, {
					name: '工具包'
				}]
			}
		},
		// 函数
		computed: {
			...mapState(['Config', 'hasLogin']),
		},

		onReady() {
			let that = this;
			uni.getSystemInfo({
				success(res) {
					//228是title和tab的高度和
					that.clientHeight = res.windowHeight - res.statusBarHeight - uni.upx2px(198);
					that.followPartHeight = that.clientHeight - uni.upx2px(350)
				}
			})
		},

		onLoad() {
			let that = this;
			that.getTeacherList();
			that.loadmore();
		},
		methods: {
			changeBtnIndex(type) {
				this.currentIndex = type;
			},
			getTeacherList() {
				let that = this;
				that.$.request({
					url: this.Config.URL.edu.getLectureList,
					data: {
						pageNum: 1,
						pageSize: 50,
						// type: 1
					},
					loading: false,
					dataType: 'json',
					success: function(data, status, msg, code) {
						if (status == 200) {
							// alert(data.items)
							if (data?.items) {
								that.setData({
									teachersData: data.items,
									showData: that.chunkArr(data.items, 4),
									totalLength: data.items.length,
									showTeachers: that.chunkArr(data.items, 4)[that
										.currentTeacherIndex],
									totalIndex: Math.ceil(data.items.length / 4)
								});
							}
						}
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
			getClientStatusBarHeight() {
				const res = uni.getSystemInfoSync();
				const system = res.platform;
				if (system === 'ios') {
					return res.statusBarHeight
				} else if (system === 'android') {
					return res.statusBarHeight
				} else {
					return 0;
				}
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
			doAttention(data) {
				let that = this;
				//后面接入逻辑
				let oldTdata = that.teachersData
				let indexTotal = oldTdata.indexOf(data)
				let newTData = oldTdata[indexTotal]
				newTData.isAttention = !newTData.isAttention
				oldTdata[indexTotal] = newTData

				that.setData({
					teachersData: oldTdata,
					showData: that.chunkArr(oldTdata, 4),
					showTeachers: that.showData[that.currentTeacherIndex],
				})
			},
			toMore() {
				uni.navigateTo({
					url: '../teacher-more/teacher-more'
				})
			},
			scrolltolower() {
				this.loadmore()
			},
			loadmore() {
				for (let i = 0; i < 20; i++) {
					this.indexList.push({
						url: this.urls[uni.$u.random(0, this.urls.length - 1)]
					})
				}
			},
			changeFollowTab(event) {
				let that = this;
				this.followCurrentIndex = event.index
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: #FAFAFD;
	}

	.status-bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #fff;
	}

	.page_title {
		width: 100%;
		height: 88rpx;
		text-align: center;
		font-size: 36rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #333333;
		line-height: 88rpx;
		background-color: #fff;
		border-bottom: 1px #E6E5E5 solid;
	}

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
		width: 339rpx;
		height: 480rpx;
		background-color: #fff;
		border-radius: 15rpx;
		margin-top: 15rpx;
		margin-left: 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
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
	}

	.desc {
		width: 289rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #3F3F3F;
		line-height: 33rpx;
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
	}

	.attention {
		width: 143rpx;
		height: 60rpx;
		line-height: 60rpx;
		background: #F6F6F6;
		border-radius: 30rpx;
		text-align: center;
		color: #999999;
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

	.refresh_space {
		width: 200rpx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-bottom: 20rpx;
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

	.tab_page2 {}

	.tab_page3 {
		width: 100%;
		height: auto;
		flex-direction: column;
		display: flex;
		align-items: center;
	}

	.scroll_follow {
		width: 750rpx;
		height: 280rpx;
		display: flex;
		flex-direction: row;

		.item_main {
			width: 690rpx;
			height: 240rpx;
			background-color: #fff;
			border-radius: 20rpx;
			margin-top: 20rpx;
			margin-left: 20rpx;
			margin-right: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.part1 {
			width: 640rpx;
			height: 100rpx;
			margin-top: 24rpx;
			background-color: #fff;
			margin-bottom: 26rpx;
			display: flex;
			flex-direction: row;
		}

		.teacher_icon2 {
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
			background: #EDEDED;
			border-radius: 30rpx;
			margin-top: 9rpx;
			font-size: 28rpx;
			text-align: center;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
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

		.follow_space {
			width: 100%;
			height: 1000rpx;
			background-color: antiquewhite;
		}

		.sc_part3 {
			width: 100%;
			background-color: #F43D3E;
			display: flex;
			flex-direction: column;
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
	}
</style>

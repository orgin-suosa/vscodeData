<template>
	<view class="page_bg">
		<z-paging ref="paging" class="z-paging" v-model="teachers" @query="getList" :empty-view-fixed="false" :hide-loading-more-when-no-more-by-limit="1">
			<block ref="paging" v-model="teachers" @query="getList" :empty-view-fixed="true" :fixed="false" :hide-loading-more-when-no-more-by-limit="5">
				<view class="list-item flex-row" v-for="item in teachers" :key="item.user_id" @tap="checkDetail(item.user_id)">
					<view><image :src="item.user_avatar" shape="circle" :lazy-load="true" class="image_2" mode="aspectFill"></image></view>
					<view class="right-group flex-col">
						<text class="text_1">{{ item.user_nickname }}</text>
						<text class="text_3" v-html="item.lecturer_introduce"></text>
					</view>
				</view>
			</block>
		</z-paging>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

var that; // 当前页面对象
export default {
	data() {
		// 页面数据变量
		return {
			teachers: [],
			options: {},
			page: 1,
			ispage: !0,
			flag: !0,
			rows: 10
		};
	},
	computed: mapState(['Config']),
	// 监听 - 页面每次【加载时】执行(如：前进)
	onLoad(options) {
		uni.setNavigationBarTitle({
			title: this.__('大咖讲师')
		});

		that = this;
		that.init(options);
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
		init(options) {
		},
		// 获取列表
		getList(pageNo, pageSize) {
			that.$.request({
				url: this.Config.URL.edu.getLectureList,
				data: {
					'pageNum': pageNo,
					'pageSize': pageSize,
					// 'type':1,
				},
				dataType: 'json',
				loading:false,
				success: function(data, status, msg, code) {
					if (status == 200) {
						that.$refs.paging.complete(data.items);
					}
				}
			});
		},
		// 查看教师详情
		checkDetail(userId) {
			uni.navigateTo({
				// url: '/edu/lecturer/detail?userId=' + userId
        url: '/community/community/userspace?uid=' + userId
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page_bg {
	height: 100vh;
	background-color: #FFFFFF;
	padding: 20rpx 20rpx 0;
	padding-left: 30rpx;
	line-height: 1;
}

.list-item {
	border-radius: 10rpx;
	display: flex;
	align-items: center;
	background-color: rgb(248, 247, 255);
	margin:30rpx 30rpx 0rpx 30rpx;
	overflow: hidden;

	&:not(:first-of-type) {
		margin-top: 20rpx;
	}

	.image_2 {
		width: 144rpx !important;
		height: 176rpx !important;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.right-group {
		height: 150rpx;
		padding:0 30rpx;
		// margin-top: 10rpx;
		flex: 1 1 auto;

		.text_1 {
			color: rgb(51, 51, 51);
			font-size: 32rpx;
			font-weight: bold;
			white-space: nowrap;
			
		}

		.text_3 {
			height: 90rpx;
			margin-top: 20rpx;
			color: rgb(102, 102, 102);
			font-size: 24rpx;
			line-height: 32rpx;
			text-align: left;
			display: -webkit-box;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
		}
	}
}
</style>

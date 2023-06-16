<template>
	<view class="page_bg">
		<z-paging ref="paging" class="z-paging" v-model="teachers" @query="getList" 
		:empty-view-fixed="false" :hide-loading-more-when-no-more-by-limit="100">
			<block ref="paging" v-model="teachers" @query="getList" :empty-view-fixed="true" 
			:fixed="false" :hide-loading-more-when-no-more-by-limit="100">
			
				<view class="list-item flex-row" v-for="item in teachers" :key="item.user_id">
					<view @tap="checkDetail(item.user_id)" style="width: 120rpx;height: 12rpx;display: flex;flex-direction: row;
					align-items: center;justify-content: center;">
						<image :src="item.user_avatar" shape="circle" :lazy-load="true" 
						class="image_2" mode="aspectFill"></image>
					</view>
					<view class="right-group flex-col" @tap="checkDetail(item.user_id)">
						<text class="text_1">{{ item.user_nickname }}</text>
						<text class="text_3" v-html="item.lecturer_introduce"></text>
					</view>
					
					<u-button class="sub_btn_sel" type="primary" shape="circle" 
					@click="subLecturer(item.user_id)">取消订阅</u-button>
				</view>
			</block>
		</z-paging>
		<u-toast ref="uToast" />
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
			page: 1,
			ispage: !0,
			flag: !0,
			rows: 10
		};
	},
	computed: mapState(['Config']),
	// 监听 - 页面每次【加载时】执行(如：前进)
	onLoad() {
		uni.setNavigationBarTitle({
			title: this.__('我的订阅')
		});

		that = this;
		that.init();
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
		init() {
		},
		// 获取列表
		getList(pageNo, pageSize) {
			that.$.request({
				url: this.Config.URL.edu.getLectureList,
				data: {
					pageNum: pageNo,
					pageSize: pageSize,
					type: 1
				},
				loading:false,
				dataType: 'json',
				success: function(data, status, msg, code) {
					if (status == 200) {
						that.$refs.paging.complete(data.items);
					}
				}
			});
		},
		//订阅/取消订阅讲师
		subLecturer(userId){
			that.$.request({
				url: this.Config.URL.edu.subscribeLecturer,
				data: {
					lecturerId: userId
				},
				dataType: 'json',
				success: function(data, status, msg, code) {
					that.$refs.uToast.show({
						title: '取消订阅成功',
						message: '取消订阅成功',
						type: 'success',
						duration: 1000
					});
					that.getList(1, 10);
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
}

.list-item {
	border-bottom: 2rpx #F5F5F5 solid;
	// background-color: #007AFF;
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 690rpx;
	margin: 0 30rpx;
	padding: 20rpx 0;
	height: 120rpx;
	overflow: hidden;
    
	.sub_btn {
		// position: relative;
		// top: 80rpx;
		// left: 260rpx;
		height: 50rpx;
		width: 126rpx;
		font-size: 24rpx;
		color: #FFFFFF;
		background-color: #F43D3E;
		border-color: #F43D3E;
		white-space: nowrap;
	}
	
	.sub_btn_sel { 
		height: 48rpx;
		width: 124rpx;
		white-space: nowrap;
		font-size: 24rpx;
		color: #F43D3E;
		background-color: #FFFFFF;
		border:1rpx #F43D3E solid;
	}

	.image_2 {
		width: 120rpx !important;
		height: 120rpx !important;
		border-radius: 50%;
		overflow: hidden;
	}

	.right-group {
		height: 120rpx;
		margin-left: 18rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		text-align: left;
		// background-color: #F3A73F;
		// margin-top: 10rpx;
		// flex: 1 1 auto;
        
		.text_1 {
			height: 40rpx;
			line-height: 40rpx;
			color: #333333;
			font-size: 36rpx;
			font-weight: 500;
			font-family: PingFangSC-Medium, sans-serif;
			white-space: nowrap;
		}

		.text_3 {
			width: 380rpx;
			height: 40rpx;
			line-height: 40rpx;
			margin-top: 8rpx;
			color: #999999;
			font-size: 24rpx;
			font-weight: 400;
			font-family: PingFangSC-Regular, sans-serif;
			text-align: left;
			overflow: hidden;
			white-space: nowrap;
			text-overflow:ellipsis;
			display: -webkit-box;
			// -webkit-box-orient: vertical;
			// -webkit-line-clamp: 1;
		}
	}
}
</style>

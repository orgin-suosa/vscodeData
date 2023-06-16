<template>
	<view class="uni__uliveWrapper">
		<view class="uni__subNavs" v-if="false">
			<view class="ls flexbox flex_alignc">
				<text class="item on">推荐</text>
				<text class="item">附近</text>
				<text class="item">跳舞</text>
				<text class="item">音乐</text>
				<text class="item">游戏</text>
			</view>
		</view>
		<view class="m-tips" style="margin:0upx 0;color:#000000">
			<!-- table切换start -->
			<scroll-view class="scroll-view_S uni__subNavs" scroll-x show-scrollbar="false" :style="{backgroundColor:bgColor}">
				<view class="ls flexbox flex_alignc scroll-view-item_S"  >
					<text :class="['item', tagIndex==-2?'on':'']" data-index="-2" data-name="-2" @click="changeTag">{{__('关注')}}</text>
				</view>
				<view class="ls flexbox flex_alignc scroll-view-item_S"  >
					<text :class="['item', tagIndex==-1?'on':'']" data-index="-1" data-name="-1" @click="changeTag">{{__('推荐')}}</text>
				</view>
				<view class="ls flexbox flex_alignc scroll-view-item_S"  v-for="(tag,index) in tags" :key="index">
					<text :class="['item', tagIndex==index?'on':'']" :data-index="index" :data-name="tag.live_tag_name" @click="changeTag">{{tag.live_tag_name}}</text>
				</view>
			</scroll-view>
			<!-- table切换end -->
			<!-- 全部订单start -->
		</view>
		<view class="uni_uliveList" v-if="(false)">
			<block v-for="(item, index) in liveList" :key="index">
				<view class="item" @tap="goLive(item.room_id, item.room_state)">
					<image class="lv-thumb" :src="item.room_poster" mode="aspectFill" />
					<view class="lv-ftinfo">
						<view class="pos" v-if="false">
							<text class="iconfont icon-dingwei"></text>
							{{ item.location }}
						</view>
						<view class="title flexbox flex_alignb">{{ item.room_name }}</view>
						<view class="flexbox flex_alignc">
							<view class="user flex1 flexbox flex_alignc">
								<image class="avator" :src="item.user_avatar" mode="aspectFill" />
								<text class="fs_12 bold">{{ item.user_nickname }}</text>
							</view>
							<text class="hot" v-if="false">
								<text class="iconfont icon-hot"></text>
								{{ item.hotNum }}
							</text>
						</view>
					</view>
					<view v-if="item.room_state" class="lv-status flexbox flex_alignc">
						<text class="dot"></text>
						{{__('直播中')}}
					</view>

					<view v-else class="lv-status flexbox flex_alignc">
						<text class="dot dot-gray"></text>
						{{__('离线')}}
					</view>
					<text class="btn-play iconfont icon-bofang" v-if="false"></text>
					<image class="btn-play" src="https://static.shopsuite.cn/xcxfile/appicon/video/play_1.png" style="width: 80upx;height: 80upx;opacity: 0.7;"></image>
				</view>
			</block>
		</view>

	<!-- 	<view class="waterfall">
			<view class="ul-item" v-for="(item, index) in liveList" :key="index">
					<image class="lv-thumb" :src="item.room_poster" mode="aspectFill" />
					<view class="">{{item.room_name}}</view>
			</view>
		</view> -->

		<WaterfallsFlow :wfList='liveList' @itemTap="choose" />

		<view class="m-loading-box">
		    <block v-if="(ispage)">
		        <view class="u-loadmore">
		            <label class="u-loading"></label>
		            <text class="u-loadmore-tips">{{__('正在加载')}}</text>
		        </view>
		    </block>
		    <block v-else>
		        <view class="u-loadmore u-loadmore-line">
		            <text class="u-loadmore-tips">{{__('没有更多数据啦！')}}</text>
		        </view>
		    </block>
		</view>
		<view class="nlv-attentionFloat flexbox"  v-if="false">
			<image class="af-avator" src="/static/uimg/u__chat_img9.jpg" mode="aspectFill" />
			<view class="af-info">
				<text class="af-tit">孤独伊人直播开始了</text>
				<text class="af-subtit">心动的感觉</text>
			</view>
			<text class="af_ico iconfont">&#xe84f;</text>
		</view>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
import dateUtil from "../../helpers/util_date";
// 瀑布流组件

import WaterfallsFlow from '../../components/ulive-waterfall-flow/ulive-waterfall-flow.vue'

const liveJson = require('./mock-live.js');
import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			options: {},
			liveList: [],
			tags:[],
			isdata: false,
			page: 1,
			rows: 10,
			ispage: !0,
			flag: !0,
			tagIndex: -1,
			tagName: '',
			bgColor:''
		 };
	},
	computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
	components: {
		uniNavBar,
		WaterfallsFlow
	},
	onLoad(options) {
		uni.setNavigationBarTitle({
			title:this.__('直播')
		});

		this.setData({
			options: options
		})

		this.getLiveRome(this.tagIndex);
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		if (this.flag) {
			var that = this;
			that.setData({flag: !1});
			clearTimeout(t);

			var t = setTimeout(function () {
				that.setData({page: parseInt(that.page) + 1});
				that.getLiveRome(that.tagIndex)
			}, 500)
		}
	},
	methods: {
        ...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getStoreInfo']),
		goLive(room_id, room_state) {
			if (room_state)
			{
				uni.navigateTo({ url: '/pagesub/uLive/subnvue/live?room_id=' + room_id });
			}
			else
			{
				this.$.alert(this.__('主播离线中'), function() {
						uni.navigateTo({ url: '/pagesub/uLive/subnvue/live?room_id=' + room_id });
				});
			}
		},


		// 选中
		choose(item) {
			// item 返回选中 JSON 对象
			if (item.room_state)
			{
				uni.navigateTo({ url: '/pagesub/uLive/subnvue/live?room_id=' + item.room_id });
			}
			else
			{
				this.$.alert(this.__('主播离线中'), function() {
						uni.navigateTo({ url: '/pagesub/uLive/subnvue/live?room_id=' + item.room_id });
				});
			}
		},
		changeTag(e) {
			let newIndex = e.target.dataset.index;
			let newTagName = e.target.dataset.name;
			let that = this;
			if (newIndex !== that.tagIndex) {
				that.setData({
					tagIndex: newIndex,
					tagName: newTagName,
					liveList: [],
					//tags:[],
					isdata: false,
					page: 1,
					rows: 10,
					ispage: !0,
					flag: !0,
				});
				that.getLiveRome(parseInt(newIndex))
			}
		},
		getLiveRome(tagIndex) {
			let that = this;
			let param = {
				page: this.page, 'rand':1,
				tag_name: (tagIndex !== -1 && tagIndex !== -2) ? that.tagName : '',
				tag_id: tagIndex
			};

			that.$.request({
				url: that.Config.URL.live.index,
				data: param,
				success: function(data, status, msg, code) {
					if (status == 200) {

						if (that.tags.length == 0)
						{
						}
							that.setData({tags: data.tags});

						if (data.items.length > 0) {
							for (var r = 0; r < data.items.length; r++) {
								//data.items[r]['story_time_str'] = dateUtil.dateUtils.format(that.$.datetimeFormatter(data.items[r]['story_time']));
							}

							if (data.page >= data.total) {
								that.setData({
									liveList: that.liveList.concat(data.items),
									flag: !1,
									ispage: !1
								});
							} else {
								that.setData({
									liveList: that.liveList.concat(data.items),
									flag: !0,
									ispage: !0
								})
							}
						} else {
							that.setData({flag: !1, ispage: !1})
						}

					} else {
					}
				}
			});
		}
	}
};
</script>

<style scoped>
@import '../../styles/live/reset.css';
@import '../../styles/live/layout.css';

.u-loadmore{
	margin: auto;
}

/* .uni__uliveWrapper {
	position: relative;
	color: #1a1a1a;
	padding-bottom: var(--window-bottom);
}*/


.ul-item {
	border: 1upx solid #f5f5f5;
	background: #fff;
	border-radius: 10upx;
	/* margin:4upx 0; */
	overflow:hidden;
}


	.waterfall{
		width:100vw;
		height: auto;
		-moz-column-count:2;
		-webkit-column-count:2;
		column-count:2;
		-moz-column-gap: 2vw;
		-webkit-column-gap: 2vw;
		column-gap: 2vw;
		width: 96vw;
		margin:2vw auto;
		background: #f5f5f5;
	}
	.waterfall image{
		position:relative;
		width: 47vw;
		-moz-page-break-inside: avoid;
		-webkit-column-break-inside: avoid;
		break-inside: avoid;
	}
	.scroll-view_S{
	  width: 100%;
	  height:100upx;
	  /* background:rgba(245,245,245,1); */
	  white-space: nowrap;
	  // position: absolute;
	  // top:calc(var(--status-bar-height) + 82upx);
	}

	.scroll-view-item_S{
		  // width: 90upx;
		  /*height: 50upx;*/
		  display: inline-block;
		  /*padding:20upx;*/
		  line-height: 50upx;

		}

	.nav-text {
		width:100%;
		height:24upx;
		font-size:16upx;
		// font-family:HelveticaNeue;
		color:rgba(51,51,51,1);
		line-height:24upx;
		text-align:center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.m-navbar-item {
		padding: 20upx 0;
		font-size: 24upx;
	}

	.m-navbar-item:after {
		border: none;
	}

	.m-navbar-item.m-navbar-item-on {
		background-color: #f5f5f5;
		font-weight:bold;
		// color: $default-skin-bg;
		font-size: 30upx;
	}

	.m-navbar-item.m-navbar-item-on::before {
		content: " ";
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height:
				6upx;
		border-bottom: 6upx solid $default-skin-bg;
		color: #CCCCCC;
		-webkit-transform-origin: 0 100%;
		transform-origin: 0 100%;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 3;
	}
</style>

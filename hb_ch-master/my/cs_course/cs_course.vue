<template>
	<view>
		<view
			style="padding:0rpx 37rpx;background-color: #ffffff;z-index: 999 !important;position: relative;top: 10rpx;">

			<subsection :subsectionIndex="tradeCurrentIndex" :selectionList="trade_selection_list"
				@changeBtnIndex="changeTradeIndex"></subsection>

		</view>
		<view class="content-scroll program-scroll">

			<view style="background-color:#000000;">

				<CsVideoList key="productvideo" v-if="tradeCurrentIndex == 0" style="padding-top: 15rpx"
					ref="productList" eltmType="1" encodeUrl :tabbarItemArr="productTabTitleArr" :mobile="mobile"
					:requestUrl="requestUrl">
				</CsVideoList>

				<CsVideoList key="skillvideo" v-if="tradeCurrentIndex == 1" style="padding-top: 15rpx" ref="skillList"
					eltmType="1" encodeUrl :tabbarItemArr="skillTabTitleArr" :mobile="mobile" :requestUrl="requestUrl">
				</CsVideoList>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import subsection from '@/components/subsection/index.vue';
	import CsVideoList from '@/components/cs-video-list/cs-video-list.vue'

	export default {
		components: {
			subsection,
			CsVideoList
		},
		data() {
			return {
				tradeCurrentIndex: 0,
				trade_selection_list: [{
						name: '产品培训',
						show_fg: 0
					},
					{
						name: '技能提升',
						show_fg: 0
					}
				],
				productTabTitleArr: [],
				skillTabTitleArr: [],
				mobile: '',
				requestUrl: '',
			}
		},
		computed: {
			...mapState(['Config', 'userInfo', 'notice', 'hasLogin']),
		},
		onLoad() {
			this.setData({
				requestUrl: this.Config.getCsVideoList
			});
		},
		onShow() {
			this.getCsTabData();
		},
		methods: {
			changeTradeIndex(type) {
				this.tradeCurrentIndex = type;
			},
			getCsTabData() {
				let that = this
				if (!that.hasLogin) {
					return
				}
				that.mobile = that.userInfo.user_mobile.includes('+86') ? this.userInfo.user_mobile.slice(3) : this
					.userInfo.user_mobile;
				uni.request({
					url: that.Config.getCsTab,
					data: {
						mobile: that.mobile,
					},
					success: (res) => {
						let {
							result
						} = res.data
						if (result && result.isInWhiteList) {
							let {
								peiXun,
								tiSheng
							} = result
							that.setData({
								productTabTitleArr: peiXun.length > 0 ? peiXun : [],
								skillTabTitleArr: tiSheng.length > 0 ? tiSheng : []
							})
						} else {

						}
					}
				})
			},
		}
	}
</script>

<style>

</style>

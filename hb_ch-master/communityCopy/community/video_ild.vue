<template>
	<view class="page" :style="{ height: height }">
		<view class="swiper"  v-if="loaded">
			<video-new
					class="video"
					:video_id="video_item.story_id"
					:nickname="video_item.user_nickname"
					:user_id="video_item.user_id"
					:video_describe="video_item.story_title"
					:cover_url="video_item.story_file[0]"
					:video_url="video_item.story_video"
					:dianzan="video_item.story_like_count"
					:is_dianzan="video_item.IsFabulous"
					:pinglun="video_item.pinglun"
					:zhuanfa="video_item.zhuanfa"
					:height="height"
					:width="width"
					:sysheight="sysheight"
					:play="video_item.flag"
					:index="0"
					:cur_index="0"
					:style="{ height: height, width: width }"

					@clickVideo="clickVideo"
			></video-new>

			<cover-view class="cover-view-product" v-if="video_item.item_id && video_item.product_item_name" @click.stop="onProduct(video_item.item_id)">
				<view class="left-view" style="width: 100upx;height: 100upx;">
					<cover-image :src="video_item.product_image" class="product_img"></cover-image>
				</view>
				<view class="left-view" style="width: 400upx;height: 100upx;padding-left: 10upx;">
					<text class="left-text uni-ellipsis" style="">{{video_item.product_item_name}}</text>
					<text class="left-text uni-ellipsis" style="font-size: 24upx;">{{sprintf(__('价格:%s'), video_item.item_unit_price)}}</text>
				</view>
			</cover-view>
		</view>
	</view>
</template>


<script>

	import {mapMutations, mapState} from 'vuex'
	import videoNew from '@/components/video/video-new.vue';

	export default {
		components: {
			videoNew
		},
		data() {
			return {
				options: {},
				isbenren: false,
				height: '667px',
				width: '',
				sysheight: 0,
				story_id: 0,
				videoCtx:null,
				video_item:{},
				loaded:false
			};
		},
		computed: mapState(['Config', 'StateCode', 'notice', 'plantformInfo', 'shopInfo', 'userInfo', 'hasLogin']),
		onLoad: function (options) {
			uni.setNavigationBarTitle({
				title:this.__('')
			});


			var that = this;
			that.setData({story_id: options.id});

			this.setData({
				options: options
			});

			let res = uni.getSystemInfoSync();
			this.height = `${res.windowHeight}px`;
			this.width = `${res.windowWidth}px`;
			this.sysheight = res.windowHeight;
			//console.log(res);

			this.getVideo();
		},
		onHide() {
			//console.log('界面隐藏,暂停播放',`video_${this.story_id}`);
			this.videoCtx = uni.createVideoContext(`video_${this.story_id}`, this);
			this.videoCtx.pause();
		},
		onShow() {
			//console.log('界面显示')
			if (this.story_id !== null && this.video_item.flag) {
				//console.log('开启播放',`video_${this.story_id}`);
				this.videoCtx = uni.createVideoContext(`video_${this.story_id}`, this);
				this.videoCtx.play();
			}
		},
		onReady() {},
		methods: {
			...mapMutations(['logout', 'getPlantformInfo', 'forceUserInfo', 'getStoreInfo']),
			getVideo() {
				var that = this, params = {user_id: that.userInfo.user_id, story_id: that.story_id};

				that.$.request({
					url: this.Config.URL.sns.story_get,
					data: params,
					loading: true,
					success: (data, status, msg, code) => {
						if (200 == status)
						{
							//#ifdef H5 || MP-WEIXIN
							data.flag = false;
							//#endif

							//#ifdef APP-PLUS
							data.flag = true;
							//#endif

							that.setData({
								video_item: data,
								loaded: !0
							});

							that.userInfo.user_id == that.video_item.user_id ? that.setData({isbenren: !0}) : that.setData({isbenren: !1});

							try {
								setTimeout(() => {
									this.videoCtx = uni.createVideoContext(`video_${that.video_item.story_id}`, this);
									this.videoCtx.play();
								}, 200);
							} catch (e) {
								//console.log(e);
							}
						}
						else
						{
							that.setData({loaded: !1});
						}
					}
				});
			},
			clickVideo(e) {
				if(this.clicktime > 0 && e.timeStamp - this.clicktime < 200){
					clearInterval(this.han);
					if(!this.video_item.is_dianzan){
						this.video_item.is_dianzan = true;
					}
				}else{
					let _this = this;
					this.han = setTimeout(function() {
						_this.video_item.flag = !_this.video_item.flag;
					}, 200);
				}

				this.clicktime = e.timeStamp;

				return;
			},
			onProduct(item_id){
				this.$.gotopage('/pages/product/detail?pid=' + item_id)
			},
			tapMsg(e) {
				//console.log(5, e);
			},
			tapShare(e) {
				//console.log(6, e);
			},
			tapLove(e) {
				//console.log(7, e);
			}
		}
	};
</script>

<style  scoped>
	.page {
		flex: 1;
		overflow: hidden;
		background-color: #000;
	}
	.swiper {
		position: relative;
	}
	.cover-view-marks {
		position: fixed;
		top: 0;
		right: 0;
		z-index: 9998;
	}
	.wrapper {
		position: fixed;
		top: 80upx;
		background-color: transparent;
		flex-direction: row;
		width: 100%;
		z-index: 9999;
	}
	.video {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.title {
		line-height: 80upx;
		color: #eee;
		font-size: 18px;
		margin: 0 10px;

		position: relative;
		border-width: 0px;
		border-style: solid;
		border-color: #000;

		box-sizing: border-box;
	}
	.title-center {
		flex-direction: row;
		height: 45px;
		line-height: 30px;
		justify-content: center;
		align-items: center;
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/*  #endif */
	}
	.active-title {
		border-bottom-width: 2px;
		font-weight: bold;
		border-style: solid;
		border-bottom-color: #ffffff;
		color: #ffffff;
	}
	.img {
		width: 50upx;
		height: 50upx;
		margin-top: 18upx;
	}



	.cover-view-product{
		position: absolute;
		margin-left: 10upx;
		width: 500upx;
		bottom: 200upx;
		z-index: 9999;
		font-size: 16px;
		color: #FFFFFF;
		//#ifndef APP-PLUS-NVUE
		white-space: pre-wrap;
		text-overflow:ellipsis;
		overflow:hidden;
		//#endif

		display: flex;
        background-color: rgba(0,0,0,0.2);
	}


	.left-view{
		margin-bottom: 0upx;
		display: grid;
	}
	.left-text{
		font-size: 16px;
		color: #FFFFFF;
	}
</style>
